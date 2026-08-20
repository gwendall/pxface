import { createHash } from "node:crypto";
import sharp from "sharp";
import { parseRenderJson, parseRenderSearchParams, type ParsedRenderRequest } from "@/lib/render-request";
import {
  renderWordmark,
  RENDERER_VERSION,
  WordmarkValidationError,
  wordmarkFileName,
} from "pxface";

export const runtime = "nodejs";

const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;
const MAX_BODY_BYTES = 16_384;
const requestWindows = new Map<string, { count: number; reset: number }>();

type RateState = { allowed: boolean; remaining: number; reset: number };

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Expose-Headers": "Content-Disposition, X-PXFACE-Height, X-PXFACE-Renderer-Version, X-PXFACE-Width, X-PXWORD-Height, X-PXWORD-Renderer-Version, X-PXWORD-Width, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset",
  };
}

function clientAddress(request: Request) {
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "local";
}

function takeRateSlot(request: Request): RateState {
  const now = Date.now();
  const key = clientAddress(request);
  const current = requestWindows.get(key);
  const window = !current || current.reset <= now ? { count: 0, reset: now + RATE_WINDOW_MS } : current;
  window.count += 1;
  requestWindows.set(key, window);
  if (requestWindows.size > 2_000) {
    requestWindows.forEach((value, address) => {
      if (value.reset <= now) requestWindows.delete(address);
    });
  }
  return { allowed: window.count <= RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - window.count), reset: window.reset };
}

function rateHeaders(rate: RateState) {
  return {
    "X-RateLimit-Limit": String(RATE_LIMIT),
    "X-RateLimit-Remaining": String(rate.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rate.reset / 1000)),
  };
}

function jsonError(status: number, error: string, issues: { field: string; message: string }[], rate?: RateState) {
  return Response.json({ error, issues }, {
    status,
    headers: { ...corsHeaders(), ...(rate ? rateHeaders(rate) : {}), "Cache-Control": "no-store" },
  });
}

async function renderResponse(request: Request, parsed: ParsedRenderRequest, cacheable: boolean, rate: RateState) {
  const result = renderWordmark(parsed.options);
  const { scene, svg } = result;
  const body = parsed.format === "png"
    ? await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
    : svg;
  const mime = parsed.format === "png" ? "image/png" : "image/svg+xml; charset=utf-8";
  const etag = `"${createHash("sha256").update(body).digest("base64url")}"`;
  const disposition = `${parsed.download ? "attachment" : "inline"}; filename="${wordmarkFileName(scene.options.text, parsed.format)}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, {
      status: 304,
      headers: { ...corsHeaders(), ...rateHeaders(rate), ETag: etag },
    });
  }
  console.info(JSON.stringify({
    event: "pxface.render",
    version: RENDERER_VERSION,
    format: parsed.format,
    method: request.method,
    width: scene.output.width,
    height: scene.output.height,
    textLength: scene.options.text.length,
    lineCount: scene.options.text.split("\n").length,
  }));
  return new Response(body, {
    headers: {
      ...corsHeaders(),
      ...rateHeaders(rate),
      "Cache-Control": cacheable
        ? "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000"
        : "no-store",
      "Content-Disposition": disposition,
      "Content-Type": mime,
      ETag: etag,
      "X-Content-Type-Options": "nosniff",
      "X-PXFACE-Height": String(scene.output.height),
      "X-PXFACE-Renderer-Version": RENDERER_VERSION,
      "X-PXFACE-Width": String(scene.output.width),
      "X-PXWORD-Height": String(scene.output.height),
      "X-PXWORD-Renderer-Version": RENDERER_VERSION,
      "X-PXWORD-Width": String(scene.output.width),
    },
  });
}

async function handle(request: Request, parsed: ParsedRenderRequest, cacheable: boolean) {
  const rate = takeRateSlot(request);
  if (!rate.allowed) {
    return jsonError(429, "rate_limit_exceeded", [{ field: "request", message: `Limit is ${RATE_LIMIT} requests per minute per IP.` }], rate);
  }
  try {
    return await renderResponse(request, parsed, cacheable, rate);
  } catch (error) {
    if (error instanceof WordmarkValidationError) {
      return jsonError(400, "invalid_render_options", error.issues, rate);
    }
    console.error(error);
    return jsonError(500, "render_failed", [{ field: "output", message: "The asset could not be rendered." }], rate);
  }
}

export async function GET(request: Request) {
  try {
    return await handle(request, parseRenderSearchParams(new URL(request.url).searchParams), true);
  } catch (error) {
    if (error instanceof WordmarkValidationError) return jsonError(400, "invalid_render_options", error.issues);
    throw error;
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError(413, "payload_too_large", [{ field: "request", message: `JSON body must not exceed ${MAX_BODY_BYTES} bytes.` }]);
  }
  try {
    const body = await request.json();
    return await handle(request, parseRenderJson(body), false);
  } catch (error) {
    if (error instanceof WordmarkValidationError) return jsonError(400, "invalid_render_options", error.issues);
    if (error instanceof SyntaxError) return jsonError(400, "invalid_json", [{ field: "request", message: "Body must be valid JSON." }]);
    throw error;
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
