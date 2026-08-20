import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { renderWordmark } from "pxface";
import { Pxface } from "pxface/react";

const esmRender = renderWordmark({ text: "NPM", padding: 0, scale: 8 });
assert.equal(esmRender.scene.options.text, "NPM");
assert.match(esmRender.svg, /data-pxface-renderer="2\.0\.0"/);
assert.doesNotThrow(() => JSON.stringify(esmRender.scene));

const require = createRequire(import.meta.url);
const commonJs = require("pxface");
assert.equal(commonJs.renderWordmark({ text: "CJS" }).scene.options.text, "CJS");

const html = renderToStaticMarkup(createElement(Pxface, {
  text: "SSR",
  ariaLabel: "SSR pixel wordmark",
}));
assert.match(html, /aria-label="SSR pixel wordmark"/);
assert.match(html, /<svg[^>]+data-pxface-renderer="2\.0\.0"/);

console.log("Verified ESM, CommonJS, serializable scene, and React SSR exports.");
