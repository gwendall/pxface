import { buildPixelLayout, type Pixel, type PixelLayout, type TextAlign } from "./pixel-font";
import { buildRandomPalette } from "./random-palette";

export const RENDERER_VERSION = "2.0.0";
export const MAX_TEXT_LENGTH = 160;
export const MAX_LINE_COUNT = 8;
export const MAX_OUTPUT_DIMENSION = 16_384;
export const MAX_OUTPUT_AREA = 64_000_000;

export type PixelShape = "square" | "soft" | "dot";
export type ColorMode = "solid" | "random";
export type ExportRatio = "fit" | "square";

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
});

export type ValidationIssue = {
  field: keyof WordmarkOptions | "output";
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
};

export type WordmarkScene = {
  version: string;
  options: WordmarkOptions;
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

type UnknownOptions = Partial<Record<keyof WordmarkOptions, unknown>>;

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

export function normalizeWordmarkOptions(input: UnknownOptions = {}): WordmarkOptions {
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
  addRangeIssue(issues, "letterSpacing", letterSpacing, 0, 8);
  addRangeIssue(issues, "wordSpacing", wordSpacing, 0, 16);
  addRangeIssue(issues, "lineSpacing", lineSpacing, 0, 12);
  addRangeIssue(issues, "pixelGap", pixelGap, 0, 0.8);
  addRangeIssue(issues, "depth", depth, 0, 12, true);
  addRangeIssue(issues, "padding", padding, 0, 200);
  addRangeIssue(issues, "seed", seed, 0, 0xffffffff, true);
  addRangeIssue(issues, "scale", scale, 1, 256);

  const ratio = enumValue(input.ratio, WORDMARK_DEFAULTS.ratio, ["fit", "square"] as const);
  const align = enumValue(input.align, WORDMARK_DEFAULTS.align, ["left", "center", "right"] as const);
  const shape = enumValue(input.shape, WORDMARK_DEFAULTS.shape, ["square", "soft", "dot"] as const);
  const colorMode = enumValue(input.colorMode, WORDMARK_DEFAULTS.colorMode, ["solid", "random"] as const);
  const slant = booleanValue(input.slant, WORDMARK_DEFAULTS.slant);
  const transparent = booleanValue(input.transparent, WORDMARK_DEFAULTS.transparent);
  if (!ratio) issues.push({ field: "ratio", message: "Must be fit or square." });
  if (!align) issues.push({ field: "align", message: "Must be left, center, or right." });
  if (!shape) issues.push({ field: "shape", message: "Must be square, soft, or dot." });
  if (!colorMode) issues.push({ field: "colorMode", message: "Must be solid or random." });
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
  };
}

function xml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pixelShape(pixel: Pixel, color: string, options: WordmarkOptions, offset = 0) {
  const inset = options.pixelGap / 2;
  const size = 1 - options.pixelGap;
  const slantOffset = options.slant ? (4 - pixel.row) * 0.18 : 0;
  const x = round(pixel.x + inset + slantOffset + offset);
  const y = round(pixel.y + inset + offset);
  const common = `fill="${xml(color)}" data-row="${pixel.row}"`;
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
        `<g id="${layer}-line-${lineIndex + 1}-char-${characterIndex + 1}-pixel-${pixel.index + 1}">${pixelShape(pixel, color ?? pixel.color, options, offset)}</g>`,
      ).join("");
      return `<g id="${layer}-line-${lineIndex + 1}-char-${characterIndex + 1}" data-character="${xml(value)}">${shapes}</g>`;
    }).join("");
    return `<g id="${layer}-line-${lineIndex + 1}">${characterMarkup}</g>`;
  }).join("");
  return `<g id="${layer}">${lineMarkup}</g>`;
}

export function createWordmarkScene(optionsInput: UnknownOptions = {}): WordmarkScene {
  const options = normalizeWordmarkOptions(optionsInput);
  const layout = buildPixelLayout(
    options.text,
    options.letterSpacing,
    options.lineSpacing,
    options.align,
    options.wordSpacing,
  );
  const palette = buildRandomPalette(options.background, options.seed);
  const pixels = layout.pixels.map((pixel, index) => ({
    ...pixel,
    index,
    color: options.colorMode === "random" ? palette[index % palette.length] : options.foreground,
  }));
  const slantWidth = options.slant ? 0.72 : 0;
  const contentWidth = layout.width + options.depth + slantWidth;
  const contentHeight = layout.height + options.depth;
  const paddingUnits = round(Math.min(contentWidth, contentHeight) * (options.padding / 100));
  const fitWidth = round(contentWidth + paddingUnits * 2);
  const fitHeight = round(contentHeight + paddingUnits * 2);
  const width = round(options.ratio === "square" ? Math.max(fitWidth, fitHeight) : fitWidth);
  const height = options.ratio === "square" ? width : fitHeight;
  const x = round(-(width - contentWidth) / 2);
  const y = round(-(height - contentHeight) / 2);
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
    layout,
    pixels,
    contentWidth,
    contentHeight,
    viewBox: { x, y, width, height },
    output,
    shapeRendering: options.shape === "square" && options.pixelGap === 0 ? "crispEdges" : "geometricPrecision",
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

export function renderWordmark(input: UnknownOptions = {}): WordmarkRender {
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
