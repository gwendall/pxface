import { describe, expect, it } from "vitest";
import { fitAnimationDimensions, gifFrameDelays } from "./animation-export";

describe("animation export sizing", () => {
  it("preserves small dimensions", () => {
    expect(fitAnimationDimensions({ width: 640, height: 320 }, 960)).toEqual({ width: 640, height: 320 });
  });

  it("caps large outputs while preserving their aspect ratio", () => {
    expect(fitAnimationDimensions({ width: 4000, height: 2000 }, 1920)).toEqual({ width: 1920, height: 960 });
  });

  it("returns codec-safe even video dimensions", () => {
    expect(fitAnimationDimensions({ width: 1001, height: 499 }, 1920, true)).toEqual({ width: 1000, height: 498 });
  });

  it("distributes GIF centiseconds without shortening the loop", () => {
    const delays = gifFrameDelays(3, 36);
    expect(delays).toHaveLength(36);
    expect(delays.reduce((total, delay) => total + delay, 0)).toBe(3000);
    expect(new Set(delays)).toEqual(new Set([80, 90]));
  });
});
