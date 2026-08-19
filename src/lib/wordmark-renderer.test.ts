import { describe, expect, it } from "vitest";
import {
  normalizeWordmarkOptions,
  renderWordmark,
  WordmarkValidationError,
} from "./wordmark-renderer";

describe("wordmark renderer", () => {
  it("normalizes defaults through one public interface", () => {
    const options = normalizeWordmarkOptions();
    expect(options).toMatchObject({
      text: "HELLO\nTHERE",
      wordSpacing: 3,
      pixelGap: 0,
      depth: 0,
      padding: 20,
      ratio: "fit",
    });
  });

  it("is deterministic for seeded random colors", () => {
    const input = { text: "PIXEL", colorMode: "random" as const, seed: 42 };
    expect(renderWordmark(input).svg).toBe(renderWordmark(input).svg);
    expect(renderWordmark(input).svg).not.toBe(renderWordmark({ ...input, seed: 43 }).svg);
  });

  it("emits an editable hierarchy and exact dimensions", () => {
    const { scene, svg } = renderWordmark({ text: "A", depth: 1, scale: 10, padding: 0 });
    expect(scene.output).toEqual({ width: 40, height: 60 });
    expect(svg).toContain('id="depth-1-line-1-char-1-pixel-1"');
    expect(svg).toContain('id="type-line-1-char-1-pixel-1"');
    expect(svg).toContain('data-pxword-renderer="1.0.0"');
  });

  it("keeps zero-gap square pixels exactly adjacent", () => {
    const { svg } = renderWordmark({ text: "I", pixelGap: 0, shape: "square" });
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).toContain('width="1" height="1" rx="0"');
  });

  it("returns field-level validation issues", () => {
    expect(() => normalizeWordmarkOptions({ pixelGap: 2 })).toThrow(WordmarkValidationError);
    try {
      normalizeWordmarkOptions({ pixelGap: 2 });
    } catch (error) {
      expect((error as WordmarkValidationError).issues).toEqual([
        { field: "pixelGap", message: "Must be between 0 and 0.8." },
      ]);
    }
  });
});
