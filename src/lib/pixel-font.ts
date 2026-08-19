import { PIXEL_FONT } from "./pixel-font-data";

export { PIXEL_FONT, type Glyph } from "./pixel-font-data";

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
