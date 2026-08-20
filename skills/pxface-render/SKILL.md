---
name: pxface-render
description: Generate deterministic 3×5 pixel wordmark assets through the PXFACE HTTP API. Use when an agent needs to create or save editable SVG or PNG text art, logos, wordmarks, social assets, or pixel typography with controlled spacing, colors, shape, depth, padding, alignment, and canvas ratio.
---

# PXFACE Render

Generate an asset through `https://pxface.com/api/v1/render`. Treat PXFACE as a renderer, not as an installed font.

When working inside a JavaScript or React project, prefer the local `pxface`
package so rendering does not require a network request. Import
`renderWordmark` from `pxface`, or `Pxface` from `pxface/react`. Installation
and SSR examples are at `https://pxface.com/docs/javascript`. Use the hosted
endpoint for other languages, remote tools, and image-file responses.

## Render an asset

1. Choose SVG when pixels must remain editable or PNG when the caller needs a bitmap.
2. Prefer a GET request for a cacheable deterministic URL. Use POST JSON for long or structured calls.
3. Always set `text`. Set `seed` whenever `colorMode=random` so the result can be reproduced.
4. Check the HTTP status and `Content-Type` before saving the body.
5. Read `X-PXFACE-Width`, `X-PXFACE-Height`, and `X-PXFACE-Renderer-Version` when exact metadata matters.

```bash
curl --get 'https://pxface.com/api/v1/render' \
  --data-urlencode 'text=HELLO
THERE' \
  --data 'format=svg' \
  --data 'ratio=fit' \
  --output hello-there.svg
```

```bash
curl 'https://pxface.com/api/v1/render' \
  --header 'Content-Type: application/json' \
  --data '{"format":"png","options":{"text":"HELLO\\nTHERE","ratio":"square","colorMode":"random","seed":42}}' \
  --output hello-there.png
```

## Control the render

Pass any subset of these options: `text`, `foreground`, `background`, `depthColor`, `letterSpacing`, `wordSpacing`, `lineSpacing`, `pixelGap`, `depth`, `padding`, `ratio`, `align`, `shape`, `slant`, `transparent`, `colorMode`, `seed`, and `scale`.

Read the canonical defaults, ranges, enums, errors, and response schema at `https://pxface.com/openapi.yaml`. Human documentation is at `https://pxface.com/docs/api`.

## Preserve editability

SVG output groups content by canvas, depth layer, line, character, and pixel. Keep those groups and primitive rectangles/circles when the user wants a Figma-, Illustrator-, or Sketch-editable result. Do not flatten the SVG unless the target requires it.

## Handle failures

Treat non-2xx bodies as JSON errors. Correct each entry in `issues` and retry. Stay below 60 requests per minute per IP, 160 characters, 8 lines, 16,384 pixels per edge, and 64 million output pixels.

## Licensing

The 3×5 glyph shapes are CC0-1.0 with no attribution required. The app code is MIT. The PXFACE name and logo are excluded. Do not claim that a user's complete export is CC0; its text, layout, and styling belong to their respective rights holders.
