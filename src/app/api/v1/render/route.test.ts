import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { WORDMARK_OPTION_KEYS } from "pxface";
import { GET, OPTIONS, POST } from "./route";

describe("render API", () => {
  it("renders cacheable SVG with contract headers", async () => {
    const response = await GET(new Request("https://pxface.com/api/v1/render?text=API&wordSpacing=5"));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/svg+xml");
    expect(response.headers.get("cache-control")).toContain("s-maxage");
    expect(response.headers.get("x-pxface-renderer-version")).toBe("2.1.0");
    expect(response.headers.get("x-pxword-renderer-version")).toBe("2.1.0");
    expect(await response.text()).toContain('id="type-line-1-char-1"');
  });

  it("renders PNG from nested JSON options", async () => {
    const response = await POST(new Request("https://pxface.com/api/v1/render", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ format: "png", options: { text: "PNG", scale: 8 } }),
    }));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect([...bytes.slice(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  });

  it("renders effects from GET and per-pixel overrides from POST", async () => {
    const effected = await GET(new Request("https://pxface.com/api/v1/render?text=A&effect=wave&effectAmount=1.5"));
    expect(effected.status).toBe(200);
    expect(await effected.text()).toContain('data-pixel-id="l0-c0-r0-x0"');

    const overridden = await POST(new Request("https://pxface.com/api/v1/render", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        options: {
          text: "A",
          pixelOverrides: { "l0-c0-r0-x0": { color: "#123456", offsetX: -2 } },
        },
      }),
    }));
    expect(overridden.status).toBe(200);
    expect(await overridden.text()).toContain('fill="#123456"');
  });

  it("returns useful field-level errors", async () => {
    const response = await GET(new Request("https://pxface.com/api/v1/render?pixelGap=2"));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: "invalid_render_options",
      issues: [{ field: "pixelGap" }],
    });
  });

  it("publishes public CORS preflight headers", () => {
    const response = OPTIONS();
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("keeps every renderer option discoverable in OpenAPI", () => {
    const contract = readFileSync(join(process.cwd(), "public/openapi.yaml"), "utf8");
    WORDMARK_OPTION_KEYS.forEach((key) => {
      expect(contract).toContain(`${key}:`);
    });
    expect(contract).toContain("/api/v1/render:");
    expect(contract).toContain("version: 2.1.0");
    expect(contract).toContain("Legacy PXWORD alias retained for compatibility.");
  });

  it("keeps the packaged and public agent skill identical", () => {
    const packaged = readFileSync(join(process.cwd(), "skills/pxface-render/SKILL.md"), "utf8");
    const published = readFileSync(join(process.cwd(), "public/SKILL.md"), "utf8");
    expect(published).toBe(packaged);
  });
});
