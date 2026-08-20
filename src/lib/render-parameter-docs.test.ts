import { describe, expect, it } from "vitest";
import { RENDER_PARAMETER_NAMES } from "./render-parameter-docs";
import { WORDMARK_OPTION_KEYS } from "pxface";

describe("render parameter documentation", () => {
  it("documents every request and wordmark option exactly once", () => {
    const expected = ["format", "download", ...WORDMARK_OPTION_KEYS].sort();
    const documented = [...RENDER_PARAMETER_NAMES].sort();

    expect(documented).toEqual(expected);
    expect(new Set(documented).size).toBe(documented.length);
  });
});
