# PXWORD integration decisions

## Editable design tools

PXWORD SVGs keep a named hierarchy of canvas, depth layer, line, character,
and individual rectangle/circle pixels. The studio exposes **Copy for Figma**
and **Editable SVG**; the same structure comes from the API.

The compatibility fixture is parsed and rasterized in automated tests, uses no
filters, masks, external assets, CSS, fonts, scripts, or nonstandard elements,
and therefore stays within the common SVG import subset used by Figma, FigJam,
Illustrator, and Sketch. A manual application smoke test remains useful before
announcing a specific vendor certification, but is not a renderer dependency.

## Native Figma plugin — not built

The editable SVG flow covers insertion and pixel-level manipulation without
installation, authentication, review, or a second UI. A plugin is deliberately
deferred until usage events or interviews show repeated demand for editing
PXWORD parameters after insertion. If built, it must call the public render
contract or bundle the headless renderer.

## MCP adapter — not built

OpenAPI, `llms.txt`, and the validated `pxword-render` skill already give agents
parameter discovery, deterministic generation, and MIME-aware saving over a
universal HTTP endpoint. MCP would add another transport but no capability.
Reconsider it only when observed clients cannot use HTTP/OpenAPI reliably.
