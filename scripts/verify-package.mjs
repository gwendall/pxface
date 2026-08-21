import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { renderWordmark, renderWordmarkAnimation } from "pxface";
import { AnimatedPxface, Pxface } from "pxface/react";

const esmRender = renderWordmark({
  text: "NPM",
  padding: 0,
  scale: 8,
  effect: "wave",
  pixelOverrides: { "l0-c0-r0-x0": { opacity: 0.5 } },
});
assert.equal(esmRender.scene.options.text, "NPM");
assert.match(esmRender.svg, /data-pxface-renderer="2\.2\.0"/);
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
assert.match(html, /<svg[^>]+data-pxface-renderer="2\.2\.0"/);

const animation = renderWordmarkAnimation({ text: "LOOP", effect: "relay" }, {
  duration: 2,
  frameRate: 6,
});
assert.equal(animation.frames.length, 12);
assert.match(animation.svg, /data-pxface-animation="loop"/);
assert.equal(animation.frames[0].scene.viewBox.width, animation.frames[7].scene.viewBox.width);

const animatedHtml = renderToStaticMarkup(createElement(AnimatedPxface, {
  text: "SSR",
  effect: "scan",
  duration: 2,
  frameRate: 6,
}));
assert.match(animatedHtml, /data-pxface-animation="loop"/);

console.log("Verified ESM, CommonJS, static and animated scenes, and React SSR exports.");
