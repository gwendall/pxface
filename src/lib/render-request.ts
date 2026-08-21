import {
  WORDMARK_OPTION_KEYS,
  type WordmarkAnimationOptions,
  type WordmarkInput,
  type WordmarkOptions,
  WordmarkValidationError,
} from "pxface";

export type RenderFormat = "svg" | "png" | "svg-animation";

export type ParsedRenderRequest = {
  format: RenderFormat;
  download: boolean;
  options: WordmarkInput;
  animation: WordmarkAnimationOptions;
};

function parseFormat(value: unknown): RenderFormat {
  if (value === undefined || value === null || value === "" || value === "svg") return "svg";
  if (value === "png") return "png";
  if (value === "svg-animation") return "svg-animation";
  throw new WordmarkValidationError([{ field: "output", message: "Format must be svg, png, or svg-animation." }]);
}

function parseAnimationNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseDownload(value: unknown) {
  if (value === undefined || value === null || value === "" || value === false || value === "false" || value === "0") return false;
  if (value === true || value === "true" || value === "1") return true;
  throw new WordmarkValidationError([{ field: "output", message: "Download must be a boolean." }]);
}

export function parseRenderSearchParams(searchParams: URLSearchParams): ParsedRenderRequest {
  const options: Partial<Record<keyof WordmarkOptions, unknown>> = {};
  WORDMARK_OPTION_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null) options[key] = value;
  });
  return {
    format: parseFormat(searchParams.get("format")),
    download: parseDownload(searchParams.get("download")),
    options: options as WordmarkInput,
    animation: {
      duration: parseAnimationNumber(searchParams.get("duration")),
      frameRate: parseAnimationNumber(searchParams.get("frameRate")),
    },
  };
}

export function parseRenderJson(value: unknown): ParsedRenderRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new WordmarkValidationError([{ field: "output", message: "Body must be a JSON object." }]);
  }
  const record = value as Record<string, unknown>;
  const source = record.options && typeof record.options === "object" && !Array.isArray(record.options)
    ? record.options as Record<string, unknown>
    : record;
  const options: Partial<Record<keyof WordmarkOptions, unknown>> = {};
  WORDMARK_OPTION_KEYS.forEach((key) => {
    if (source[key] !== undefined) options[key] = source[key];
  });
  const pixelOverrides = source.pixelOverrides;
  return {
    format: parseFormat(record.format),
    download: parseDownload(record.download),
    options: {
      ...options as WordmarkInput,
      ...(pixelOverrides === undefined ? {} : { pixelOverrides: pixelOverrides as WordmarkInput["pixelOverrides"] }),
    },
    animation: {
      duration: parseAnimationNumber(record.duration),
      frameRate: parseAnimationNumber(record.frameRate),
    },
  };
}
