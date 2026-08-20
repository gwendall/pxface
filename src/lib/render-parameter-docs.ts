import {
  WORDMARK_DEFAULTS,
  type WordmarkOptions,
} from "./wordmark-renderer";

export type RenderParameterDoc = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

type OptionDoc = Omit<RenderParameterDoc, "name" | "defaultValue">;

const requestParameters: Record<"format" | "download", RenderParameterDoc> = {
  format: {
    name: "format",
    type: "svg | png",
    defaultValue: "svg",
    description: "Selects the response image format and MIME type.",
  },
  download: {
    name: "download",
    type: "boolean",
    defaultValue: "false",
    description: "Returns the asset as an attachment instead of displaying it inline.",
  },
};

const optionDocs: { [Key in keyof WordmarkOptions]: OptionDoc } = {
  text: {
    type: "string",
    description: "Text to render. Supports 95 printable ASCII characters, up to 160 characters and 8 lines.",
  },
  foreground: {
    type: "#RRGGBB[AA]",
    description: "Pixel color in solid mode. The optional alpha pair controls opacity.",
  },
  background: {
    type: "#RRGGBB[AA]",
    description: "Canvas color. Also seeds the color family used by random mode.",
  },
  depthColor: {
    type: "#RRGGBB[AA]",
    description: "Color of the offset layers created when depth is greater than zero.",
  },
  letterSpacing: {
    type: "number 0-8",
    description: "Horizontal design units added after every character.",
  },
  wordSpacing: {
    type: "number 0-16",
    description: "Width of a space character in design units.",
  },
  lineSpacing: {
    type: "number 0-12",
    description: "Vertical design units inserted between 5-pixel-high lines.",
  },
  pixelGap: {
    type: "number 0-0.8",
    description: "Inset inside every pixel. Zero keeps adjacent square pixels seamless.",
  },
  depth: {
    type: "integer 0-12",
    description: "Number of one-unit diagonal layers rendered behind the text.",
  },
  padding: {
    type: "number 0-200",
    description: "Padding on every side, as a percentage of the shortest content edge.",
  },
  ratio: {
    type: "fit | square",
    description: "Fits the canvas to the content or expands it to a centered square.",
  },
  align: {
    type: "left | center | right",
    description: "Aligns each line within the width of the longest line.",
  },
  shape: {
    type: "square | soft | dot",
    description: "Renders each pixel as a square, a rounded square, or a circle.",
  },
  slant: {
    type: "boolean",
    description: "Offsets pixel rows to create an italic form.",
  },
  transparent: {
    type: "boolean",
    description: "Removes the canvas rectangle from the exported asset.",
  },
  colorMode: {
    type: "solid | random",
    description: "Uses one foreground color or a deterministic color for every pixel.",
  },
  seed: {
    type: "integer 0-4294967295",
    description: "Controls the deterministic sequence used by random color mode.",
  },
  scale: {
    type: "number 1-256",
    description: "Output pixels per design unit. Changes dimensions, not the composition.",
  },
};

function displayDefault(value: WordmarkOptions[keyof WordmarkOptions]) {
  return String(value).replaceAll("\n", "\\n");
}

function option(name: keyof WordmarkOptions): RenderParameterDoc {
  return {
    name,
    ...optionDocs[name],
    defaultValue: displayDefault(WORDMARK_DEFAULTS[name]),
  };
}

export const RENDER_PARAMETER_GROUPS = [
  {
    title: "Request",
    description: "Choose the response format and browser download behavior.",
    parameters: [requestParameters.format, requestParameters.download],
  },
  {
    title: "Content and color",
    description: "Set the characters and the colors used to draw them.",
    parameters: [
      option("text"),
      option("foreground"),
      option("background"),
      option("depthColor"),
      option("colorMode"),
      option("seed"),
    ],
  },
  {
    title: "Spacing and form",
    description: "Control the 3x5 grid, line layout, pixel geometry, and depth.",
    parameters: [
      option("letterSpacing"),
      option("wordSpacing"),
      option("lineSpacing"),
      option("pixelGap"),
      option("depth"),
      option("align"),
      option("shape"),
      option("slant"),
    ],
  },
  {
    title: "Canvas and output",
    description: "Size and frame the final SVG or PNG.",
    parameters: [
      option("padding"),
      option("ratio"),
      option("transparent"),
      option("scale"),
    ],
  },
] as const;

export const RENDER_PARAMETER_NAMES = RENDER_PARAMETER_GROUPS.flatMap(({ parameters }) =>
  parameters.map(({ name }) => name),
);
