export const RANDOM_PIXEL_COLORS = [
  "#fff68eff", "#5c390fff", "#c77514ff", "#d7d7d7ff", "#28b143ff", "#8119b7ff",
  "#b261dcff", "#c9c9c9ff", "#b1b1b1ff", "#1637a4ff", "#1a43c8ff", "#142c7cff",
  "#cd00cbff", "#d60000ff", "#1a6ed5ff", "#ffd926ff", "#ca4e11ff", "#933709ff",
  "#2c9541ff", "#296434ff", "#dedede80", "#c6c6c6ff", "#e25b26ff", "#1c1a00ff",
  "#534c00ff", "#80dbdaff", "#555555ff", "#ffc926ff", "#8d8d8dff", "#b4b4b4ff",
  "#595959ff", "#0040ffff", "#ff8ebeff", "#a66e2cff", "#85561eff", "#690c45ff",
  "#8c0d5bff", "#ad2160ff", "#2c954199", "#51360cff", "#96200526", "#cae7fe70",
  "#dfdfdfff", "#713f1dff", "#8b532cff", "#562600ff", "#723709ff", "#ae8b61ff",
  "#b69f82ff", "#86581eff", "#a77c47ff", "#dbb180ff", "#e7cba9ff", "#d29d60ff",
  "#ead9d9ff", "#a58d8dff", "#c9b2b2ff", "#4a1201ff", "#5f1d09ff", "#711010ff",
  "#7da269ff", "#9bbc88ff", "#5e7253ff", "#ff0000ff", "#352410ff", "#856f56ff",
  "#6a563fff", "#a98c6bff", "#c8fbfbff", "#f1ffffff", "#75bdbdff", "#9be0e0ff",
  "#d6000033", "#692f08ff", "#794b11ff", "#502f05ff", "#00000099", "#0000004d",
  "#86581e4d", "#353535ff", "#515151ff", "#221e1766", "#710cc7ff", "#00000091",
  "#0060c3ff", "#e4eb17ff", "#d60404ff", "#3cc300ff", "#dc1d1dff", "#c28946ff",
  "#2a2a2aff", "#e22626ff", "#26314aff", "#ffd800ff", "#4c4c4cff", "#636363ff",
  "#00000040", "#3d2f1eff", "#bababa80", "#855114ff", "#683c08ff", "#68461fff",
  "#f0f0f0ff", "#328dfdff", "#fd3232ff", "#2858b1ff", "#2c5195ff", "#293e64ff",
  "#2d6b62ff", "#005580ff", "#229000ff", "#c42110ff", "#2c779599", "#8d5b4099",
  "#ffba00ff", "#ff2a00ff", "#e65700ff", "#b500af99",
] as const;

type Rgb = { r: number; g: number; b: number };
type Rgba = Rgb & { a: number };

function parseHex(color: string): Rgba {
  const hex = color.replace("#", "");
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
    a: hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1,
  };
}

function composite(foreground: Rgba, background: Rgb): Rgb {
  return {
    r: Math.round(foreground.r * foreground.a + background.r * (1 - foreground.a)),
    g: Math.round(foreground.g * foreground.a + background.g * (1 - foreground.a)),
    b: Math.round(foreground.b * foreground.a + background.b * (1 - foreground.a)),
  };
}

function channelLuminance(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(color: Rgb) {
  return 0.2126 * channelLuminance(color.r)
    + 0.7152 * channelLuminance(color.g)
    + 0.0722 * channelLuminance(color.b);
}

function contrastRatio(first: Rgb, second: Rgb) {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildRandomPalette(background: string, seed: number) {
  const canvas = parseHex(background);
  const darkCanvas = luminance(canvas) < 0.45;
  const referenceCanvas = darkCanvas
    ? { r: 0, g: 0, b: 0 }
    : { r: 255, g: 255, b: 255 };
  const minimumContrast = darkCanvas ? 3 : 2.5;
  const contrastingColors: string[] = RANDOM_PIXEL_COLORS.filter((color) => {
    const renderedColor = composite(parseHex(color), referenceCanvas);
    return contrastRatio(renderedColor, referenceCanvas) >= minimumContrast;
  });
  if (darkCanvas) contrastingColors.unshift("#ffffffff");

  const colors = [...contrastingColors];
  const random = seededRandom(seed);

  for (let index = colors.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [colors[index], colors[target]] = [colors[target], colors[index]];
  }

  return colors;
}
