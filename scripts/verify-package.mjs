import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { renderWordmark } from "pxface";
import { Pxface } from "pxface/react";

const esmRender = renderWordmark({
  text: "NPM",
  padding: 0,
  scale: 8,
  effect: "wave",
  pixelOverrides: { "l0-c0-r0-x0": { opacity: 0.5 } },
});
assert.equal(esmRender.scene.options.text, "NPM");
assert.match(esmRender.svg, /data-pxface-renderer="2\.1\.0"/);
assert.equal(esmRender.scene.pixels[0].opacity, 0.5);
assert.doesNotThrow(() => JSON.stringify(esmRender.scene));

const require = createRequire(import.meta.url);
const commonJs = require("pxface");
assert.equal(commonJs.renderWordmark({ text: "CJS" }).scene.options.text, "CJS");

const html = renderToStaticMarkup(createElement(Pxface, {
  text: "SSR",
  ariaLabel: "SSR pixel wordmark",
}));
assert.match(html, /aria-label="SSR pixel wordmark"/);
assert.match(html, /<svg[^>]+data-pxface-renderer="2\.1\.0"/);

console.log("Verified ESM, CommonJS, serializable scene, and React SSR exports.");
