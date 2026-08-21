import { describe, expect, it } from "vitest";
import {
  normalizeWordmarkOptions,
  renderWordmark,
  renderWordmarkAnimation,
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
      effect: "none",
      effectAmount: 1,
      animationProgress: 0.5,
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
    expect(svg).toContain('data-pxface-renderer="2.2.0"');
    expect(svg).toContain('data-pxword-renderer="2.2.0"');
    expect(svg).toContain('data-pixel-id="l0-c0-r0-x0"');
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

  it.each(["spectrum", "explode", "wave", "glitch", "weave", "assemble", "relay", "scan"] as const)(
    "renders the %s effect deterministically through the shared scene",
    (effect) => {
      const input = { text: "PX", effect, effectAmount: 1.2, seed: 42 };
      const first = renderWordmark(input);
      const second = renderWordmark(input);
      expect(first.svg).toBe(second.svg);
      expect(first.svg).not.toBe(renderWordmark({ ...input, effect: "none" }).svg);
      expect(first.scene.pixels.some((pixel) =>
        pixel.offsetX !== 0
        || pixel.offsetY !== 0
        || pixel.scale !== 1
        || pixel.rotation !== 0
        || pixel.color !== first.scene.options.foreground
        || pixel.opacity !== 1
      )).toBe(true);
    },
  );

  it.each(["spectrum", "explode", "wave", "glitch", "weave", "assemble", "relay", "scan"] as const)(
    "reduces the %s effect to the clean scene at zero strength",
    (effect) => {
      const clean = renderWordmark({ text: "PX", effect: "none" }).scene.pixels;
      const zero = renderWordmark({ text: "PX", effect, effectAmount: 0 }).scene.pixels;
      expect(zero).toEqual(clean);
    },
  );

  it("applies manual pixel overrides after an effect", () => {
    const { scene, svg } = renderWordmark({
      text: "A",
      effect: "explode",
      pixelOverrides: {
        "l0-c0-r0-x0": {
          color: "#123456",
          offsetX: -2,
          offsetY: 3,
          opacity: 0.25,
          scale: 1.5,
          rotation: 30,
        },
      },
    });
    expect(scene.pixels[0]).toMatchObject({
      id: "l0-c0-r0-x0",
      color: "#123456",
      offsetX: -2,
      offsetY: 3,
      opacity: 0.25,
      scale: 1.5,
      rotation: 30,
    });
    expect(svg).toContain('fill="#123456" opacity="0.25"');
  });

  it("expands the canvas around transformed pixels instead of clipping them", () => {
    const clean = renderWordmark({ text: "A", padding: 0, scale: 10 }).scene;
    const remixed = renderWordmark({
      text: "A",
      padding: 0,
      scale: 10,
      pixelOverrides: { "l0-c0-r0-x0": { offsetX: -3, offsetY: -2, scale: 2, rotation: 45 } },
    }).scene;
    expect(remixed.viewBox.x).toBeLessThan(clean.viewBox.x);
    expect(remixed.viewBox.y).toBeLessThan(clean.viewBox.y);
    expect(remixed.output.width).toBeGreaterThan(clean.output.width);
    expect(remixed.output.height).toBeGreaterThan(clean.output.height);
  });

  it("rejects malformed pixel overrides", () => {
    expect(() => renderWordmark({
      text: "A",
      pixelOverrides: { nope: { opacity: 2 } },
    })).toThrow(WordmarkValidationError);
  });

  it.each(["spectrum", "explode", "wave", "glitch", "weave", "assemble", "relay", "scan"] as const)(
    "closes the %s animation loop without a seam",
    (effect) => {
      const start = renderWordmark({ text: "LOOP", effect, seed: 42, animationProgress: 0 }).scene.pixels;
      const end = renderWordmark({ text: "LOOP", effect, seed: 42, animationProgress: 1 }).scene.pixels;
      expect(end).toEqual(start);
    },
  );

  it("builds deterministic fixed-step animation frames with one shared viewport", () => {
    const first = renderWordmarkAnimation(
      { text: "MOVE", effect: "assemble", effectAmount: 1.2, seed: 42 },
      { duration: 2, frameRate: 6 },
    );
    const second = renderWordmarkAnimation(
      { text: "MOVE", effect: "assemble", effectAmount: 1.2, seed: 42 },
      { duration: 2, frameRate: 6 },
    );
    expect(first.svg).toBe(second.svg);
    expect(first.frames).toHaveLength(12);
    expect(new Set(first.frames.map((frame) => JSON.stringify(frame.scene.viewBox))).size).toBe(1);
    expect(new Set(first.frames.map((frame) => JSON.stringify(frame.scene.output))).size).toBe(1);
    expect(first.svg).toContain('data-pxface-animation="loop"');
    expect(first.svg).toContain("@keyframes pxface-frame");
    expect(first.svg).toContain("visibility:hidden");
    expect(first.svg).toContain('id="animation-frame-12"');
    expect(first.svg).toContain('data-pixel-id="l0-c0-r0-x0"');
  });

  it("preserves manual pixel overrides in every animation frame", () => {
    const animation = renderWordmarkAnimation({
      text: "A",
      effect: "relay",
      pixelOverrides: {
        "l0-c0-r0-x0": { color: "#123456", offsetX: -2, opacity: 0.4 },
      },
    }, { duration: 1, frameRate: 4 });
    animation.frames.forEach(({ scene }) => {
      expect(scene.pixels[0]).toMatchObject({ color: "#123456", offsetX: -2, opacity: 0.4 });
    });
  });

  it("rejects unsafe animation settings", () => {
    expect(() => renderWordmarkAnimation({ text: "A" }, { duration: 0.5 })).toThrow(WordmarkValidationError);
    expect(() => renderWordmarkAnimation({ text: "A" }, { frameRate: 60 })).toThrow(WordmarkValidationError);
  });
});
