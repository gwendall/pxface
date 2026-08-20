# PXFACE integration decisions

## JavaScript and React

The `pxface` npm package is the canonical local integration. Its root export
contains the framework-agnostic renderer and serializable scene; the optional
`pxface/react` subpath is a server-renderable adapter over that exact module.
The Next.js studio resolves those same public imports in the workspace, so a
change cannot silently diverge between product and package.

The package ships ESM, CommonJS, TypeScript declarations, source maps, and a
React peer dependency that remains optional for core callers. The hosted HTTP
endpoint remains the adapter for agents, other languages, and callers that
need a PNG response rather than local rendering.

## Editable design tools

PXFACE SVGs keep a named hierarchy of canvas, depth layer, line, character,
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
PXFACE parameters after insertion. If built, it must call the public render
contract or bundle `pxface`.

## MCP adapter — not built

OpenAPI, `llms.txt`, and the validated `pxface-render` skill already give agents
parameter discovery, deterministic generation, and MIME-aware saving over a
universal HTTP endpoint. MCP would add another transport but no capability.
Reconsider it only when observed clients cannot use HTTP/OpenAPI reliably.
