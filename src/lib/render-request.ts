import {
  WORDMARK_OPTION_KEYS,
  type WordmarkInput,
  type WordmarkOptions,
  WordmarkValidationError,
} from "pxface";

export type RenderFormat = "svg" | "png";

export type ParsedRenderRequest = {
  format: RenderFormat;
  download: boolean;
  options: WordmarkInput;
};

function parseFormat(value: unknown): RenderFormat {
  if (value === undefined || value === null || value === "" || value === "svg") return "svg";
  if (value === "png") return "png";
  throw new WordmarkValidationError([{ field: "output", message: "Format must be svg or png." }]);
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
  };
}
