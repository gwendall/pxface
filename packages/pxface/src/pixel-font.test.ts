import { describe, expect, it } from "vitest";
import { PIXEL_FONT } from "./pixel-font-data";
import { buildPixelLayout, normalizeForFont } from "./pixel-font";

describe("pixel font", () => {
  it("covers every printable ASCII character", () => {
    const printable = Array.from({ length: 95 }, (_, index) => String.fromCharCode(32 + index));
    expect(printable.filter((character) => character !== " " && !PIXEL_FONT[normalizeForFont(character)])).toEqual([]);
  });

  it("uses the configurable word-space width", () => {
    expect(buildPixelLayout("A A", 1, 2, "left").width).toBe(11);
    expect(buildPixelLayout("A A", 1, 2, "left", 6).width).toBe(14);
  });

  it.each([
    [" A", 7, 4],
    ["A ", 7, 0],
    ["A  A", 15, 0],
    ["A\n A", 7, 0],
  ])("measures leading, trailing, repeated, and multiline spaces in %j", (text, width, firstPixelX) => {
    const layout = buildPixelLayout(text, 1, 2, "left");
    expect(layout.width).toBe(width);
    expect(layout.pixels[0]?.x).toBe(firstPixelX);
  });

  it("aligns every line within the widest line", () => {
    const centered = buildPixelLayout("A\nAAA", 1, 2, "center");
    const firstLine = centered.pixels.filter((pixel) => pixel.line === 0);
    expect(Math.min(...firstLine.map((pixel) => pixel.x))).toBe(4);
    const right = buildPixelLayout("A\nAAA", 1, 2, "right");
    expect(Math.min(...right.pixels.filter((pixel) => pixel.line === 0).map((pixel) => pixel.x))).toBe(8);
  });
});
