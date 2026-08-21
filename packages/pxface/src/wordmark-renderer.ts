import { buildPixelLayout, type Pixel, type PixelLayout, type TextAlign } from "./pixel-font";
import { buildRandomPalette } from "./random-palette";

export const RENDERER_VERSION = "2.1.0";
export const MAX_TEXT_LENGTH = 160;
export const MAX_LINE_COUNT = 8;
export const MAX_OUTPUT_DIMENSION = 16_384;
export const MAX_OUTPUT_AREA = 64_000_000;

export type PixelShape = "square" | "soft" | "dot";
export type ColorMode = "solid" | "random";
export type ExportRatio = "fit" | "square";
export type PixelEffect = "none" | "spectrum" | "explode" | "wave" | "glitch" | "weave";

export type PixelOverride = {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  scale?: number;
  rotation?: number;
};

export type PixelOverrides = Readonly<Record<string, PixelOverride>>;

export type WordmarkOptions = {
  text: string;
  foreground: string;
  background: string;
  depthColor: string;
  letterSpacing: number;
  wordSpacing: number;
  lineSpacing: number;
  pixelGap: number;
  depth: number;
  padding: number;
  ratio: ExportRatio;
  align: TextAlign;
  shape: PixelShape;
  slant: boolean;
  transparent: boolean;
  colorMode: ColorMode;
  seed: number;
  scale: number;
  effect: PixelEffect;
  effectAmount: number;
};

/** Any subset of renderer options. Missing values use versioned defaults. */
export type WordmarkInput = Partial<WordmarkOptions> & {
  pixelOverrides?: PixelOverrides;
};

export const WORDMARK_OPTION_KEYS = [
  "text",
  "foreground",
  "background",
  "depthColor",
  "letterSpacing",
  "wordSpacing",
  "lineSpacing",
  "pixelGap",
  "depth",
  "padding",
  "ratio",
  "align",
  "shape",
  "slant",
  "transparent",
  "colorMode",
  "seed",
  "scale",
  "effect",
  "effectAmount",
] as const satisfies readonly (keyof WordmarkOptions)[];

export const WORDMARK_DEFAULTS: Readonly<WordmarkOptions> = Object.freeze({
  text: "HELLO\nTHERE",
  foreground: "#F1F0E9",
  background: "#181816",
  depthColor: "#FF4E1A",
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  pixelGap: 0,
  depth: 0,
  padding: 20,
  ratio: "fit",
  align: "left",
  shape: "square",
  slant: false,
  transparent: false,
  colorMode: "solid",
  seed: 0x50584641,
  scale: 48,
  effect: "none",
  effectAmount: 1,
});

export type ValidationIssue = {
  field: keyof WordmarkInput | "output";
  message: string;
};

export class WordmarkValidationError extends Error {
  readonly issues: ValidationIssue[];

  constructor(issues: ValidationIssue[]) {
    super("Invalid wordmark options");
    this.name = "WordmarkValidationError";
    this.issues = issues;
  }
}

export type RenderPixel = Pixel & {
  index: number;
  color: string;
  offsetX: number;
  offsetY: number;
  opacity: number;
  scale: number;
  rotation: number;
};

export type WordmarkScene = {
  version: string;
  options: WordmarkOptions;
  pixelOverrides: PixelOverrides;
  layout: PixelLayout;
  pixels: RenderPixel[];
  contentWidth: number;
  contentHeight: number;
  viewBox: { x: number; y: number; width: number; height: number };
  output: { width: number; height: number };
  shapeRendering: "crispEdges" | "geometricPrecision";
};

export type WordmarkRender = {
  scene: WordmarkScene;
  svg: string;
};

function round(value: number) {
  return Number(value.toFixed(4));
}

function finiteNumber(value: unknown, fallback: number) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function booleanValue(value: unknown, fallback: boolean) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1" || value === 1) return true;
  if (value === "false" || value === "0" || value === 0) return false;
  return undefined;
}

function enumValue<T extends string>(value: unknown, fallback: T, values: readonly T[]) {
  if (value === undefined || value === null || value === "") return fallback;
  return values.includes(value as T) ? value as T : undefined;
}

function colorValue(value: unknown, fallback: string) {
  if (value === undefined || value === null || value === "") return fallback;
  return typeof value === "string" && /^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value)
    ? value.toUpperCase()
    : undefined;
}

function addRangeIssue(
  issues: ValidationIssue[],
  field: keyof WordmarkOptions,
  value: number,
  min: number,
  max: number,
  integer = false,
) {
  if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
    issues.push({ field, message: `Must be ${integer ? "an integer " : ""}between ${min} and ${max}.` });
  }
}

export function normalizeWordmarkOptions(input: WordmarkInput = {}): WordmarkOptions {
  const issues: ValidationIssue[] = [];
  const text = input.text === undefined ? WORDMARK_DEFAULTS.text : input.text;
  if (typeof text !== "string") issues.push({ field: "text", message: "Must be a string." });
  const safeText = typeof text === "string" ? text.replace(/\r\n?/g, "\n") : WORDMARK_DEFAULTS.text;
  if (safeText.length > MAX_TEXT_LENGTH) {
    issues.push({ field: "text", message: `Must contain at most ${MAX_TEXT_LENGTH} characters.` });
  }
  if (safeText.split("\n").length > MAX_LINE_COUNT) {
    issues.push({ field: "text", message: `Must contain at most ${MAX_LINE_COUNT} lines.` });
  }

  const foreground = colorValue(input.foreground, WORDMARK_DEFAULTS.foreground);
  const background = colorValue(input.background, WORDMARK_DEFAULTS.background);
  const depthColor = colorValue(input.depthColor, WORDMARK_DEFAULTS.depthColor);
  if (!foreground) issues.push({ field: "foreground", message: "Must be a #RRGGBB or #RRGGBBAA color." });
  if (!background) issues.push({ field: "background", message: "Must be a #RRGGBB or #RRGGBBAA color." });
  if (!depthColor) issues.push({ field: "depthColor", message: "Must be a #RRGGBB or #RRGGBBAA color." });

  const letterSpacing = finiteNumber(input.letterSpacing, WORDMARK_DEFAULTS.letterSpacing);
  const wordSpacing = finiteNumber(input.wordSpacing, WORDMARK_DEFAULTS.wordSpacing);
  const lineSpacing = finiteNumber(input.lineSpacing, WORDMARK_DEFAULTS.lineSpacing);
  const pixelGap = finiteNumber(input.pixelGap, WORDMARK_DEFAULTS.pixelGap);
  const depth = finiteNumber(input.depth, WORDMARK_DEFAULTS.depth);
  const padding = finiteNumber(input.padding, WORDMARK_DEFAULTS.padding);
  const seed = finiteNumber(input.seed, WORDMARK_DEFAULTS.seed);
  const scale = finiteNumber(input.scale, WORDMARK_DEFAULTS.scale);
  const effectAmount = finiteNumber(input.effectAmount, WORDMARK_DEFAULTS.effectAmount);
  addRangeIssue(issues, "letterSpacing", letterSpacing, 0, 8);
  addRangeIssue(issues, "wordSpacing", wordSpacing, 0, 16);
  addRangeIssue(issues, "lineSpacing", lineSpacing, 0, 12);
  addRangeIssue(issues, "pixelGap", pixelGap, 0, 0.8);
  addRangeIssue(issues, "depth", depth, 0, 12, true);
  addRangeIssue(issues, "padding", padding, 0, 200);
  addRangeIssue(issues, "seed", seed, 0, 0xffffffff, true);
  addRangeIssue(issues, "scale", scale, 1, 256);
  addRangeIssue(issues, "effectAmount", effectAmount, 0, 2);

  const ratio = enumValue(input.ratio, WORDMARK_DEFAULTS.ratio, ["fit", "square"] as const);
  const align = enumValue(input.align, WORDMARK_DEFAULTS.align, ["left", "center", "right"] as const);
  const shape = enumValue(input.shape, WORDMARK_DEFAULTS.shape, ["square", "soft", "dot"] as const);
  const colorMode = enumValue(input.colorMode, WORDMARK_DEFAULTS.colorMode, ["solid", "random"] as const);
  const effect = enumValue(input.effect, WORDMARK_DEFAULTS.effect, ["none", "spectrum", "explode", "wave", "glitch", "weave"] as const);
  const slant = booleanValue(input.slant, WORDMARK_DEFAULTS.slant);
  const transparent = booleanValue(input.transparent, WORDMARK_DEFAULTS.transparent);
  if (!ratio) issues.push({ field: "ratio", message: "Must be fit or square." });
  if (!align) issues.push({ field: "align", message: "Must be left, center, or right." });
  if (!shape) issues.push({ field: "shape", message: "Must be square, soft, or dot." });
  if (!colorMode) issues.push({ field: "colorMode", message: "Must be solid or random." });
  if (!effect) issues.push({ field: "effect", message: "Must be none, spectrum, explode, wave, glitch, or weave." });
  if (slant === undefined) issues.push({ field: "slant", message: "Must be a boolean." });
  if (transparent === undefined) issues.push({ field: "transparent", message: "Must be a boolean." });

  if (issues.length) throw new WordmarkValidationError(issues);

  return {
    text: safeText,
    foreground: foreground!,
    background: background!,
    depthColor: depthColor!,
    letterSpacing,
    wordSpacing,
    lineSpacing,
    pixelGap,
    depth,
    padding,
    ratio: ratio!,
    align: align!,
    shape: shape!,
    slant: slant!,
    transparent: transparent!,
    colorMode: colorMode!,
    seed,
    scale,
    effect: effect!,
    effectAmount,
  };
}

function overrideNumber(
  issues: ValidationIssue[],
  pixelId: string,
  field: keyof Omit<PixelOverride, "color">,
  value: unknown,
  min: number,
  max: number,
) {
  if (value === undefined) return undefined;
  const parsed = finiteNumber(value, Number.NaN);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    issues.push({ field: "pixelOverrides", message: `${pixelId}.${field} must be between ${min} and ${max}.` });
    return undefined;
  }
  return parsed;
}

export function normalizePixelOverrides(value: unknown): PixelOverrides {
  if (value === undefined || value === null) return {};
  const issues: ValidationIssue[] = [];
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new WordmarkValidationError([{ field: "pixelOverrides", message: "Must be an object keyed by pixel ID." }]);
  }
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length > 2048) {
    throw new WordmarkValidationError([{ field: "pixelOverrides", message: "Must contain at most 2048 pixel overrides." }]);
  }
  const normalized: Record<string, PixelOverride> = {};
  entries.forEach(([pixelId, candidate]) => {
    if (!/^l\d+-c\d+-r\d+-x\d+$/.test(pixelId)) {
      issues.push({ field: "pixelOverrides", message: `${pixelId} is not a valid pixel ID.` });
      return;
    }
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      issues.push({ field: "pixelOverrides", message: `${pixelId} must contain a pixel style object.` });
      return;
    }
    const input = candidate as Record<string, unknown>;
    const allowedFields = new Set(["color", "offsetX", "offsetY", "opacity", "scale", "rotation"]);
    Object.keys(input).forEach((field) => {
      if (!allowedFields.has(field)) {
        issues.push({ field: "pixelOverrides", message: `${pixelId}.${field} is not a supported pixel property.` });
      }
    });
    const color = input.color === undefined ? undefined : colorValue(input.color, "");
    if (input.color !== undefined && !color) {
      issues.push({ field: "pixelOverrides", message: `${pixelId}.color must be a #RRGGBB or #RRGGBBAA color.` });
    }
    normalized[pixelId] = {
      ...(color ? { color } : {}),
      ...(input.offsetX === undefined ? {} : { offsetX: overrideNumber(issues, pixelId, "offsetX", input.offsetX, -12, 12) }),
      ...(input.offsetY === undefined ? {} : { offsetY: overrideNumber(issues, pixelId, "offsetY", input.offsetY, -12, 12) }),
      ...(input.opacity === undefined ? {} : { opacity: overrideNumber(issues, pixelId, "opacity", input.opacity, 0, 1) }),
      ...(input.scale === undefined ? {} : { scale: overrideNumber(issues, pixelId, "scale", input.scale, 0.1, 4) }),
      ...(input.rotation === undefined ? {} : { rotation: overrideNumber(issues, pixelId, "rotation", input.rotation, -180, 180) }),
    };
  });
  if (issues.length) throw new WordmarkValidationError(issues);
  return normalized;
}

function xml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pixelNoise(pixel: Pixel, seed: number, salt = 0) {
  let hash = seed ^ Math.imul(pixel.line + 1, 0x9e3779b1);
  hash ^= Math.imul(pixel.character + 1, 0x85ebca77);
  hash ^= Math.imul(pixel.row + 1, 0xc2b2ae3d);
  hash ^= Math.imul(pixel.column + 1, 0x27d4eb2f);
  hash ^= Math.imul(salt + 1, 0x165667b1);
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b);
  hash ^= hash >>> 16;
  return (hash >>> 0) / 0xffffffff;
}

function effectAppearance(
  pixel: Pixel,
  index: number,
  options: WordmarkOptions,
  palette: readonly string[],
): Omit<RenderPixel, keyof Pixel | "index"> {
  const amount = options.effectAmount;
  const strength = Math.min(amount, 1);
  const noise = pixelNoise(pixel, options.seed);
  const alternate = (pixel.row + pixel.column + pixel.character) % 2 === 0;
  const baseColor = options.colorMode === "random"
    ? palette[index % palette.length]
    : options.foreground;
  const base = {
    color: baseColor,
    offsetX: 0,
    offsetY: 0,
    opacity: 1,
    scale: 1,
    rotation: 0,
  };

  if (amount === 0) return base;

  switch (options.effect) {
    case "spectrum":
      return {
        ...base,
        color: palette[Math.floor(pixelNoise(pixel, options.seed, 4) * palette.length) % palette.length],
        scale: round(1 + ((0.82 + pixelNoise(pixel, options.seed, 5) * 0.24) - 1) * strength),
      };
    case "explode": {
      const force = 0.42 * amount;
      return {
        ...base,
        color: alternate ? baseColor : options.depthColor,
        offsetX: round((pixel.column - 1) * force + (noise - 0.5) * 0.12 * amount),
        offsetY: round((pixel.row - 2) * force + (pixelNoise(pixel, options.seed, 1) - 0.5) * 0.12 * amount),
        scale: round(1 + ((0.68 + pixelNoise(pixel, options.seed, 2) * 0.34) - 1) * strength),
        rotation: round((pixelNoise(pixel, options.seed, 3) - 0.5) * 28 * amount),
      };
    }
    case "wave": {
      const phase = pixel.x * 1.12 + pixel.row * 0.42 + pixel.line * 0.8;
      const wave = Math.sin(phase);
      return {
        ...base,
        color: wave > 0.42 ? options.depthColor : baseColor,
        offsetX: round(Math.cos(phase * 0.72) * 0.12 * amount),
        offsetY: round(wave * 0.78 * amount),
        scale: round(1 + ((0.88 + (wave + 1) * 0.09) - 1) * strength),
        rotation: round(wave * 9 * amount),
      };
    }
    case "glitch": {
      const rowShift = [-0.82, 0.34, -0.26, 0.9, -0.48][pixel.row] ?? 0;
      const dropout = pixelNoise(pixel, options.seed, 6);
      return {
        ...base,
        color: dropout > 0.68 ? options.depthColor : baseColor,
        offsetX: round(rowShift * amount + (dropout > 0.84 ? (noise - 0.5) * 1.2 * amount : 0)),
        offsetY: round((pixel.character % 2 === 0 ? -0.06 : 0.06) * amount),
        opacity: dropout < 0.12 * amount ? round(1 + (0.18 - 1) * strength) : 1,
        scale: dropout > 0.9 ? round(1 + (0.66 - 1) * strength) : 1,
      };
    }
    case "weave":
      return {
        ...base,
        color: alternate ? options.foreground : options.depthColor,
        offsetX: round((alternate ? -0.16 : 0.16) * amount),
        offsetY: round((alternate ? 0.16 : -0.16) * amount),
        opacity: alternate ? 1 : round(1 + (0.8 - 1) * strength),
        scale: round(alternate ? 1 : 1 + (0.64 - 1) * strength),
        rotation: round((alternate ? -1 : 1) * 8 * amount),
      };
    default:
      return base;
  }
}

function pixelGeometry(pixel: RenderPixel, options: WordmarkOptions, layerOffset = 0) {
  const inset = options.pixelGap / 2;
  const size = 1 - options.pixelGap;
  const slantOffset = options.slant ? (4 - pixel.row) * 0.18 : 0;
  const x = round(pixel.x + inset + slantOffset + layerOffset + pixel.offsetX);
  const y = round(pixel.y + inset + layerOffset + pixel.offsetY);
  const centerX = round(x + size / 2);
  const centerY = round(y + size / 2);
  return { x, y, size, centerX, centerY };
}

function pixelShape(pixel: RenderPixel, color: string, options: WordmarkOptions, offset = 0) {
  const { x, y, size, centerX, centerY } = pixelGeometry(pixel, options, offset);
  const transform = pixel.scale === 1 && pixel.rotation === 0
    ? ""
    : ` transform="translate(${centerX} ${centerY}) rotate(${round(pixel.rotation)}) scale(${round(pixel.scale)}) translate(${-centerX} ${-centerY})"`;
  const common = `fill="${xml(color)}" opacity="${round(pixel.opacity)}" data-row="${pixel.row}" data-column="${pixel.column}"${transform}`;
  if (options.shape === "dot") {
    return `<circle cx="${round(x + size / 2)}" cy="${round(y + size / 2)}" r="${round(size / 2)}" ${common}/>`;
  }
  const radius = options.shape === "soft" ? Math.min(0.22, size / 3) : 0;
  return `<rect x="${x}" y="${y}" width="${round(size)}" height="${round(size)}" rx="${round(radius)}" ${common}/>`;
}

function groupedPixels(pixels: RenderPixel[], options: WordmarkOptions, layer: string, offset: number, color?: string) {
  const lines = new Map<number, Map<number, RenderPixel[]>>();
  pixels.forEach((pixel) => {
    const characters = lines.get(pixel.line) ?? new Map<number, RenderPixel[]>();
    const characterPixels = characters.get(pixel.character) ?? [];
    characterPixels.push(pixel);
    characters.set(pixel.character, characterPixels);
    lines.set(pixel.line, characters);
  });
  const lineMarkup = [...lines.entries()].map(([lineIndex, characters]) => {
    const characterMarkup = [...characters.entries()].map(([characterIndex, characterPixels]) => {
      const value = characterPixels[0]?.value ?? "";
      const shapes = characterPixels.map((pixel) =>
        `<g id="${layer}-line-${lineIndex + 1}-char-${characterIndex + 1}-pixel-${pixel.index + 1}" data-pixel-id="${pixel.id}" data-pixel-layer="${layer}" data-pixel-index="${pixel.index}">${pixelShape(pixel, color ?? pixel.color, options, offset)}</g>`,
      ).join("");
      return `<g id="${layer}-line-${lineIndex + 1}-char-${characterIndex + 1}" data-character="${xml(value)}">${shapes}</g>`;
    }).join("");
    return `<g id="${layer}-line-${lineIndex + 1}">${characterMarkup}</g>`;
  }).join("");
  return `<g id="${layer}">${lineMarkup}</g>`;
}

function transformedPixelBounds(pixel: RenderPixel, options: WordmarkOptions, layerOffset: number) {
  const { size, centerX, centerY } = pixelGeometry(pixel, options, layerOffset);
  const half = size * pixel.scale / 2;
  if (options.shape === "dot") {
    return { minX: centerX - half, minY: centerY - half, maxX: centerX + half, maxY: centerY + half };
  }
  const radians = pixel.rotation * Math.PI / 180;
  const extent = half * (Math.abs(Math.cos(radians)) + Math.abs(Math.sin(radians)));
  return { minX: centerX - extent, minY: centerY - extent, maxX: centerX + extent, maxY: centerY + extent };
}

export function createWordmarkScene(optionsInput: WordmarkInput = {}): WordmarkScene {
  const options = normalizeWordmarkOptions(optionsInput);
  const pixelOverrides = normalizePixelOverrides(optionsInput.pixelOverrides);
  const layout = buildPixelLayout(
    options.text,
    options.letterSpacing,
    options.lineSpacing,
    options.align,
    options.wordSpacing,
  );
  const palette = buildRandomPalette(options.background, options.seed);
  const pixels = layout.pixels.map((pixel, index) => {
    const effect = effectAppearance(pixel, index, options, palette);
    const override = pixelOverrides[pixel.id];
    return {
      ...pixel,
      index,
      ...effect,
      ...(override?.color === undefined ? {} : { color: override.color }),
      ...(override?.offsetX === undefined ? {} : { offsetX: override.offsetX }),
      ...(override?.offsetY === undefined ? {} : { offsetY: override.offsetY }),
      ...(override?.opacity === undefined ? {} : { opacity: override.opacity }),
      ...(override?.scale === undefined ? {} : { scale: override.scale }),
      ...(override?.rotation === undefined ? {} : { rotation: override.rotation }),
    };
  });
  const slantWidth = options.slant ? 0.72 : 0;
  const bounds = pixels.reduce((current, pixel) => {
    const layers = Array.from({ length: options.depth + 1 }, (_, layerOffset) =>
      transformedPixelBounds(pixel, options, layerOffset),
    );
    layers.forEach((pixelBounds) => {
      current.minX = Math.min(current.minX, pixelBounds.minX);
      current.minY = Math.min(current.minY, pixelBounds.minY);
      current.maxX = Math.max(current.maxX, pixelBounds.maxX);
      current.maxY = Math.max(current.maxY, pixelBounds.maxY);
    });
    return current;
  }, {
    minX: 0,
    minY: 0,
    maxX: layout.width + options.depth + slantWidth,
    maxY: layout.height + options.depth,
  });
  const contentWidth = round(bounds.maxX - bounds.minX);
  const contentHeight = round(bounds.maxY - bounds.minY);
  const paddingUnits = round(Math.min(contentWidth, contentHeight) * (options.padding / 100));
  const fitWidth = round(contentWidth + paddingUnits * 2);
  const fitHeight = round(contentHeight + paddingUnits * 2);
  const width = round(options.ratio === "square" ? Math.max(fitWidth, fitHeight) : fitWidth);
  const height = options.ratio === "square" ? width : fitHeight;
  const x = round(bounds.minX - (width - contentWidth) / 2);
  const y = round(bounds.minY - (height - contentHeight) / 2);
  const output = { width: Math.ceil(width * options.scale), height: Math.ceil(height * options.scale) };
  const outputIssues: ValidationIssue[] = [];
  if (output.width > MAX_OUTPUT_DIMENSION || output.height > MAX_OUTPUT_DIMENSION) {
    outputIssues.push({ field: "output", message: `Width and height must not exceed ${MAX_OUTPUT_DIMENSION}px.` });
  }
  if (output.width * output.height > MAX_OUTPUT_AREA) {
    outputIssues.push({ field: "output", message: `Area must not exceed ${MAX_OUTPUT_AREA} pixels.` });
  }
  if (outputIssues.length) throw new WordmarkValidationError(outputIssues);
  return {
    version: RENDERER_VERSION,
    options,
    pixelOverrides,
    layout,
    pixels,
    contentWidth,
    contentHeight,
    viewBox: { x, y, width, height },
    output,
    shapeRendering: options.shape === "square"
      && options.pixelGap === 0
      && pixels.every((pixel) => Number.isInteger(pixel.offsetX) && Number.isInteger(pixel.offsetY) && pixel.scale === 1 && pixel.rotation === 0)
      ? "crispEdges"
      : "geometricPrecision",
  };
}

export function sceneToSvg(scene: WordmarkScene) {
  const { options, viewBox, output, pixels } = scene;
  const background = options.transparent
    ? ""
    : `<g id="canvas"><rect id="background" x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="${xml(options.background)}"/></g>`;
  const depth = Array.from({ length: options.depth }, (_, index) =>
    groupedPixels(pixels, options, `depth-${index + 1}`, index + 1, options.depthColor),
  ).join("");
  const foreground = groupedPixels(pixels, options, "type", 0);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${output.width}" height="${output.height}" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}" shape-rendering="${scene.shapeRendering}" data-pxface-renderer="${scene.version}" data-pxword-renderer="${scene.version}"><title>${xml(options.text || "PXFACE wordmark")}</title><metadata>PXFACE 3x5 glyph shapes are dedicated under CC0-1.0: https://creativecommons.org/publicdomain/zero/1.0/</metadata>${background}${depth}${foreground}</svg>`;
}

export function renderWordmark(input: WordmarkInput = {}): WordmarkRender {
  const scene = createWordmarkScene(input);
  return { scene, svg: sceneToSvg(scene) };
}

export function wordmarkFileName(text: string, extension: "svg" | "png") {
  const safeName = text
    .replace(/\n/g, "-")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `${safeName || "pxface"}.${extension}`;
}
