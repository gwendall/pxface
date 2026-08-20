# PXFACE Backlog

Ideas are ordered by dependency. The central constraint is that the editor,
exports, integrations, and agents must all use the same rendering
implementation.

## Progress

- Current batch: **PXFACE brand migration in progress**
- Legacy production: [pxword.com](https://pxword.com) remains live while
  [pxface.com](https://pxface.com) is connected and verified.
- QA: 33 automated tests, lint, production build, deterministic font rebuild,
  OpenAPI parse, skill validation, API smoke tests, and desktop/mobile browser
  checks all pass.
- Completed: licensing, responsive editor, export padding/ratios, palette mode,
  expanded glyph set, default `HELLO\nTHERE`, and pixel-font empty state.
- Legend: `[ ]` queued, `[~]` in progress, `[x]` complete, `[-]` deliberately
  skipped after evaluation.

## Now - PXFACE brand migration

- [x] **Secure the canonical domain**
  - Register `pxface.com` through Domani.
  - Confirm auto-renew, WHOIS privacy, and registrar lock.
- [x] **Replace the product identity end to end**
  - Apply PXFACE to the studio, logo treatment, copy, metadata, social cards,
    legal pages, and default download names.
  - Keep the existing dark, functional 3×5 visual language and accessibility.
- [x] **Publish PXFACE 3×5 font release**
  - Rename the family, binaries, CSS, manifests, archives, and Reserved Font
    Name, then rebuild and verify all formats deterministically.
  - Preserve documented redirects for old public PXWORD download URLs.
- [x] **Migrate developer surfaces**
  - Rename the API identity, OpenAPI contract, agent skill, `llms.txt`, event
    names, renderer metadata, and documentation.
  - Keep deprecated PXWORD response headers during the migration window.
- [~] **Migrate repositories and production**
  - Rename the private GitHub repository and Vercel project to `pxface`.
  - Deploy the new brand, attach `pxface.com`, and redirect `pxword.com` while
    preserving paths.
- [~] **Verify and close the migration**
  - Run unit tests, lint, production build, deterministic font verification,
    OpenAPI/skill checks, API smoke tests, and desktop/mobile browser QA.
  - Record the deployed commit and production verification here.

## Font distribution experience

- [x] **Create a first-class font download flow**
  - Lead with one recommended, versioned TTF “Download font” archive.
  - Offer a separate OTF alternative, web kit, complete release, and individual
    TTF, OTF, WOFF, and WOFF2 downloads with plain-language format guidance.
  - Include README, OFL license, web CSS, sizes, versions, and checksums.
- [x] **Document installation and integration**
  - Cover macOS, Windows, Linux, Figma/design applications, and self-hosted web.
  - Explain the boundary between the installable font and PXFACE renderer
    effects.
- [x] **Validate the distribution end to end**
  - Keep archives deterministic and test their contents, signatures, sizes,
    hashes, download responses, responsive UI, keyboard focus, and copy flow.

## Now — strengthen the core

- [x] **Add word-space width control**
  - Add a `Word space` range control alongside letter and line spacing.
  - Preserve the current three-unit space as the default.
  - Apply it consistently to line measurement, alignment, preview, SVG, PNG,
    filenames, and future render parameters.
  - Add layout tests for leading, trailing, repeated, and multiline spaces.

- [x] **Create one headless rendering module**
  - Define a small `WordmarkOptions` interface containing every rendering
    choice: text, type/background/depth colors, letter/word/line spacing,
    pixel gap, depth, padding, ratio, alignment, shape, slant, transparency,
    color mode, and deterministic random seed.
  - Normalize defaults and validation inside the module so callers do not
    reproduce product rules.
  - Return a serializable scene plus SVG markup and exact dimensions without
    depending on React, the DOM, canvas, or browser globals.
  - Keep React preview and download handling as thin adapters over this module.
  - Test all observable behavior through this interface.

- [x] **Complete printable ASCII coverage**
  - Add the 11 remaining glyphs: `"`, `#`, `$`, `&`, `/`, `;`, `<`, `>`, `@`,
    `\`, and `` ` ``.
  - Verify all 95 printable ASCII characters, including SPACE and lowercase
    normalization, with an automated specimen test.

## Next — rendering for tools and agents

- [x] **Add a versioned render endpoint**
  - Add `/api/v1/render` as an adapter over the headless rendering module.
  - Support `image/svg+xml` first and PNG through a server raster adapter;
    never maintain separate browser and server renderers.
  - Accept the complete `WordmarkOptions` surface through validated query
    parameters for cacheable GET requests and JSON for POST requests.
  - Return useful validation errors, exact output dimensions, deterministic
    random palettes, cache headers, and a renderer-version header.
  - Define limits for text length, line count, output size, request rate, and
    allowed CORS origins before making the endpoint public.

- [x] **Publish an OpenAPI contract and API guide**
  - Keep `openapi.yaml` generated from or checked against the same validation
    schema used by the endpoint.
  - Document every parameter, default, enum, response type, and error with
    copy-paste `curl` examples for SVG and PNG.
  - Add a small `/docs/api` page and expose the canonical OpenAPI URL.

- [x] **Make PXFACE agent-friendly**
  - Publish `/llms.txt` with concise product and render-endpoint instructions.
  - Add a reusable `SKILL.md` showing how an agent creates, previews, and saves
    a PXFACE asset without treating the glyph set as a normal font.
  - Include deterministic examples, parameter discovery, MIME handling, and
    attribution/licensing notes.
  - Evaluate an MCP adapter only after the HTTP interface is stable; it should
    call the same endpoint/module rather than implement rendering again.

## Next — editable design exports

- [x] **Create a Figma-ready SVG mode**
  - Confirm the simplest flow first: Figma can import or paste SVG, so offer
    `Copy for Figma` and `Download editable SVG` before building a plugin.
  - Name and group the SVG hierarchy by line, character, depth layer, and
    pixel so every pixel remains individually selectable.
  - Preserve rectangles/circles instead of flattening the artwork into one
    path, and include a correctly sized background frame when requested.
  - Test paste/import behavior in Figma, FigJam, Illustrator, Sketch, and
    other tools that consume editable SVG.

- [-] **Evaluate a native Figma plugin only if needed**
  - Spike direct insertion, parameter editing, and re-rendering inside Figma.
  - Reuse the public render contract or a bundled headless module.
  - Do not build a plugin if editable SVG already covers the main workflow.

## Later — distributable font files

- [x] **Generate a real font package**
  - Build TTF, OTF, WOFF, and WOFF2 artifacts from the canonical glyph data.
  - Define font metrics, proportional advances, SPACE width, naming/versioning,
    and test specimens before choosing a build tool.
  - Keep effects such as depth, random colors, pixel gap, padding, and canvas
    ratio in PXFACE; those are renderer features, not font features.
  - Decide whether generated font binaries remain CC0 or use OFL-1.1, then
    document the scope without changing the existing CC0 glyph dedication.
  - Publish CSS and design-tool installation examples if the files ship.

## Quality and operations

- [x] Add golden SVG and PNG fixtures shared by browser, API, and agent tests.
- [x] Version render defaults so old API calls remain reproducible.
- [x] Add structured usage metrics before investing in a Figma plugin or MCP.
- [x] Document how new glyphs, palettes, and render options enter the canonical
  schema and propagate to every adapter.
