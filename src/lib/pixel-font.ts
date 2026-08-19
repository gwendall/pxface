export type Glyph = readonly string[];

export const PIXEL_FONT: Record<string, Glyph> = {
  A: ["110", "101", "111", "101", "101"],
  B: ["100", "100", "111", "101", "111"],
  C: ["111", "100", "100", "100", "111"],
  D: ["110", "101", "101", "101", "110"],
  E: ["011", "100", "110", "100", "011"],
  F: ["111", "100", "110", "100", "100"],
  G: ["111", "100", "101", "101", "111"],
  H: ["101", "101", "111", "101", "101"],
  I: ["111", "010", "010", "010", "111"],
  J: ["001", "001", "001", "101", "111"],
  K: ["101", "101", "110", "101", "101"],
  L: ["100", "100", "100", "100", "111"],
  M: ["111", "101", "101", "101", "101"],
  N: ["110", "101", "101", "101", "101"],
  O: ["111", "101", "101", "101", "111"],
  P: ["011", "101", "111", "100", "100"],
  Q: ["111", "101", "101", "111", "001"],
  R: ["111", "101", "110", "101", "101"],
  S: ["011", "100", "111", "001", "110"],
  T: ["111", "010", "010", "010", "010"],
  U: ["101", "101", "101", "101", "111"],
  V: ["101", "101", "101", "101", "010"],
  W: ["101", "101", "101", "111", "101"],
  X: ["101", "101", "010", "101", "101"],
  Y: ["101", "101", "111", "001", "001"],
  Z: ["111", "001", "010", "100", "111"],
  "0": ["111", "101", "101", "101", "111"],
  "1": ["01", "11", "01", "01", "01"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["100", "100", "111", "101", "111"],
  "7": ["111", "001", "001", "001", "001"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
  "!": ["1", "1", "1", "0", "1"],
  "%": ["101", "001", "010", "100", "101"],
  "^": ["010", "101", "000", "000", "000"],
  "*": ["000", "010", "111", "010", "101"],
  "(": ["01", "10", "10", "10", "01"],
  ")": ["10", "01", "01", "01", "10"],
  _: ["000", "000", "000", "000", "111"],
  "+": ["000", "010", "111", "010", "000"],
  "-": ["000", "000", "111", "000", "000"],
  "=": ["000", "111", "000", "111", "000"],
  "[": ["11", "10", "10", "10", "11"],
  "]": ["11", "01", "01", "01", "11"],
  "|": ["1", "1", "1", "1", "1"],
  ":": ["0", "0", "1", "0", "1"],
  ",": ["00", "00", "00", "01", "10"],
  ".": ["0", "0", "0", "0", "1"],
  "?": ["11", "01", "11", "00", "10"],
  "{": ["001", "001", "010", "100", "100"],
  "}": ["100", "100", "010", "001", "001"],
  "'": ["10", "01", "00", "00", "00"],
  "~": ["000", "100", "111", "001", "000"],
};

export type Pixel = {
  x: number;
  y: number;
  row: number;
};

export type PixelLayout = {
  pixels: Pixel[];
  width: number;
  height: number;
};

export type TextAlign = "left" | "center" | "right";

function characterWidth(character: string) {
  return PIXEL_FONT[character]?.[0].length ?? 3;
}

export function normalizeForFont(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

export function buildPixelLayout(
  value: string,
  letterSpacing: number,
  lineSpacing: number,
  align: TextAlign,
): PixelLayout {
  const lines = normalizeForFont(value).split("\n").slice(0, 3);
  const lineWidths = lines.map((line) => {
    const characters = [...line];
    return characters.length
      ? characters.reduce((sum, character) => sum + characterWidth(character), 0)
        + (characters.length - 1) * letterSpacing
      : 0;
  });
  const width = Math.max(1, ...lineWidths);
  const lineAdvance = 5 + lineSpacing;
  const pixels: Pixel[] = [];

  lines.forEach((line, lineIndex) => {
    const lineWidth = lineWidths[lineIndex];
    const offsetX =
      align === "center"
        ? (width - lineWidth) / 2
        : align === "right"
          ? width - lineWidth
          : 0;

    let cursorX = offsetX;

    [...line].forEach((character) => {
      const glyph = PIXEL_FONT[character];
      glyph?.forEach((row, y) => {
        [...row].forEach((cell, x) => {
          if (cell !== "1") return;
          pixels.push({
            x: cursorX + x,
            y: lineIndex * lineAdvance + y,
            row: y,
          });
        });
      });

      cursorX += characterWidth(character) + letterSpacing;
    });
  });

  return {
    pixels,
    width,
    height: Math.max(5, lines.length * 5 + (lines.length - 1) * lineSpacing),
  };
}
