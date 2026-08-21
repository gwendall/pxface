# PXFACE rendering architecture

`packages/pxface/src/wordmark-renderer.ts` is the single product seam for every render.
It owns defaults, validation, layout, deterministic colors, dimensions, the
serializable scene, and editable SVG markup. The published `pxface` package,
studio, React export, and `/api/v1/render` all use that interface; PNG is
always rasterized from its SVG.

The pixel pipeline is `glyph data -> layout -> deterministic effect -> manual
pixel overrides -> resolved scene -> SVG -> optional PNG`. Effects and manual
edits never bypass the renderer. Every resolved pixel carries a structural ID,
color, offsets, opacity, scale, and rotation. Export bounds are calculated
after those transforms so every adapter receives the same unclipped canvas.

## Change propagation

When adding a glyph, palette, or render option:

1. Change the canonical glyph map or renderer type/default/validation.
2. Add the option to `WORDMARK_OPTION_KEYS` so query and JSON parsing share it.
3. Add the matching studio control if it is user-facing.
4. Add the field and constraints to `public/openapi.yaml`.
5. Update `/docs/api`, `public/llms.txt`, and the packaged/public `SKILL.md` if
   the workflow changes.
6. Add focused layout/validation tests and regenerate golden fixtures only
   when the intended output change is reviewed.
7. Increment `RENDERER_VERSION` for observable output changes. Breaking
   defaults require a new `/api/v2` adapter; `/api/v1` defaults stay frozen.

Font binaries are generated mechanically by `scripts/build-fonts.py` from the
canonical TypeScript glyph map. Renderer effects do not enter font outlines.

## Package surface

- `pxface` exports the pure renderer, layout, glyph data, palette utility,
  versioned defaults, validation error, and public types.
- `pxface/react` is the only framework adapter. It renders the canonical SVG
  without hooks, browser globals, or another layout implementation.
- The repository root is a private npm workspace only to prevent accidental
  publication of the Next.js application. It is not a statement about GitHub
  visibility or the code license.

## Operational contract

- GET renders are deterministic and cacheable with ETags.
- POST renders are deterministic but returned with `no-store`.
- Random colors require a seed; the default seed is versioned.
- Pixel effects use the same seed. `pixelOverrides` are supported in package
  calls and POST JSON; query-string GETs intentionally keep the nested map out
  of the URL surface.
- Structured `pxface.render` events record format, version, dimensions, text
  length, and line count without logging the user’s text.
- The public CORS policy is `*` without credentials. The application also
  applies a best-effort 60 request/minute/IP process-local limit; production
  edge rate limiting should replace it if usage justifies shared enforcement.
