import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createWordmarkScene, renderWordmark } from "pxface";
import { Pxface } from "pxface/react";

describe("published pxface interface", () => {
  it("returns the same serializable scene through the public core export", () => {
    const input = { text: "CORE", depth: 1, padding: 12 } as const;
    expect(renderWordmark(input).scene).toEqual(createWordmarkScene(input));
    expect(() => JSON.stringify(createWordmarkScene(input))).not.toThrow();
  });

  it("renders through React on the server without a client boundary", () => {
    const html = renderToStaticMarkup(
      <Pxface text="SSR" ariaLabel="SSR pixel wordmark" className="logo" />,
    );
    expect(html).toContain('class="logo"');
    expect(html).toContain('aria-label="SSR pixel wordmark"');
    expect(html).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(html).toContain('data-pxface-renderer="2.1.0"');
  });
});
