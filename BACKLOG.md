# PXFACE Backlog

Ideas are ordered by dependency. The central constraint is that the editor,
exports, integrations, and agents must all use the same rendering
implementation.

## Progress

- Current batch: **None - pixel remix release verified**
- Pixel-remix production verification: deployment
  `dpl_6U5hE7BbWxSZeRKVp9bsEwcyt41j` from merge commit `8f6ad1b` serves the
  five grid-native presets, direct pixel inspector, renderer `2.1.0`, and
  unclipped SVG/PNG exports successfully.
- Pixel-remix npm verification: `pxface@1.1.0` is the public `latest` release
  with registry integrity
  `sha512-xCEFyhUSArOg1rrY6BpEFjzYJJ6vJmFE72iEwvxCdyL8udgJ5AvxTujtGw2qP7h69Etvnzsdq9Jjd8EiZVoa3Q==`.
  Fresh registry installs passed ESM, CommonJS, and React SSR smoke tests; the
  matching immutable source release is tagged `js-v1.1.0` on GitHub.
- JavaScript-library production verification: deployment
  `dpl_98nVZf4D3n4AAP4TonNZF842U3TD` from merge commit `05c4ce7` serves the
  library guide, package-rendered hero, discovery links, and unchanged SVG/PNG
  render endpoint successfully.
- Public-source verification: `github.com/gwendall/pxface` is public, reports
  MIT as its repository license, and ships CI, contribution docs, and enabled
  private vulnerability reporting after a 0-finding history scan.
- npm verification: `pxface@1.0.0` is the public `latest` release with registry
  integrity `sha512-oJx8z9Z16/EPsAkw2B0ceBCqGRwVA9sCPKcYxNikAn3muNkMRMcGqmvglrJ00ZbJewEZXmoP9e+FJwde+90/0w==`.
  Fresh registry installs passed ESM, CommonJS, and React SSR smoke tests; the
  matching immutable source release is tagged `js-v1.0.0` on GitHub.
- Final social-preview verification: deployment
  `dpl_JDGVzULMkWddfjaP1hH6BDA9oTvg` from merge commit `34680e9` served the
  unified 30 px supporting type and overlay-safe URL placement successfully to
  the public Open Graph and X image routes.
- Social-preview production verification: deployment
  `dpl_CutNhMGzbKUPxfnfRWnNGdZ3LM82` from merge commit `1409cbd` served the
  dedicated Open Graph and X images, large-card metadata, and accessible image
  alt text successfully on every public page.
- Agent-resource production verification: deployment
  `dpl_3h43fwpttHMsYBRGaznFvv8UvUMm` from merge commit `4f634b4` served the
  visible `llms.txt`, `SKILL.md`, and `openapi.yaml` resource links plus three
  matching typed alternates.
- API-reference production verification: deployment
  `dpl_GJ7qEyhYpHpgQcAECjtgS7xgTF88` from merge commit `5ea8671` served 20
  documented parameters across 4 accessible tables, with the OpenAPI and agent
  guide links available.
- Shared-footer production verification: deployment
  `dpl_AE9JrKECNAnQVjMergo5cP4Wrkj4` from merge commit `1b6f2aa` served one
  shared footer on Font, API, and License; the full-screen studio retained its
  dedicated compact footer.
- Production verification: [pxface.com](https://pxface.com) served deployment
  `dpl_DK8kc1ydQxMR3qfE6pWJvauCp9Ly` from merge commit `4b481d1` successfully.
- Legacy production: [pxword.com](https://pxword.com) redirects to PXFACE while
  preserving the requested path.
- Shared-shell production verification: deployment
  `dpl_3SzVNdh3FZPt7SjJ8fF6p33cVBb5` from merge commit `9856217` served the
  shared navigation and route metadata successfully.
- QA: 53 automated tests, lint, production build, deterministic font rebuild,
  OpenAPI parse, skill validation, package smoke tests, API effect/override
  smoke tests, and desktop/mobile browser checks all pass.
- Completed: licensing, responsive editor, export padding/ratios, palette mode,
  expanded glyph set, default `HELLO\nTHERE`, and pixel-font empty state.
- Legend: `[ ]` queued, `[~]` in progress, `[x]` complete, `[-]` deliberately
  skipped after evaluation.

## Now - pixel remix system

- [x] **Make every rendered pixel independently addressable**
  - Give pixels stable structural identifiers and resolved color, offset,
    opacity, scale, and rotation properties.
  - Apply deterministic effects and manual overrides through the canonical
    renderer used by the studio, package, React adapter, API, SVG, and PNG.
  - Expand export bounds around transformed pixels so remixes never clip.
- [x] **Ship a focused set of grid-native effects**
  - Add Clean plus five real-renderer presets: Spectrum, Explode, Wave,
    Glitch, and Weave.
  - Keep effects deterministic, adjustable, and visually distinct because
    they act on individual 3x5 cells rather than the whole word as one shape.
- [x] **Add direct pixel remixing to the studio**
  - Make foreground pixels hoverable and selectable on the live canvas.
  - Expose color, horizontal and vertical offset, opacity, and scale in a
    compact inspector, with per-pixel and global reset actions.
  - Keep the fixed desktop/mobile layout and existing visual language intact.
- [x] **Explain and expose the programmable system**
  - Make the pixel-by-pixel, SVG-native promise visible in the studio.
  - Document effects and manual overrides for JavaScript and the render API.
- [x] **Verify, publish, and close the remix batch**
  - Add renderer, bounds, determinism, override, API, export, and interaction
    coverage; run lint, package verification, font verification, and build.
  - Check desktop/mobile, light/dark, keyboard/focus, PNG/SVG parity, and the
    production deployment before marking the batch complete.

## Now - JavaScript library and public-source release

- [x] **Open the canonical renderer as a package**
  - Keep the Next.js app at the repository root and add a lightweight npm
    workspace instead of moving a working product into an `apps/` hierarchy.
  - Publish one framework-agnostic `pxface` interface with a `pxface/react`
    adapter, zero renderer duplication, complete TypeScript declarations, ESM
    and CommonJS output, and explicit licensing for code, glyphs, and brand.
  - Make the studio, server endpoint, scripts, and tests consume that same
    package seam.
- [x] **Create a first-class frontend integration experience**
  - Document installation, direct SVG generation, serializable scenes, React,
    SSR and React Server Components, responsive styling, editable pixels, and
    the relationship with the hosted render endpoint.
  - Link the library from the shared navigation, footer, README, `llms.txt`,
    agent skill, and route metadata so humans and agents can find it.
- [x] **Verify the package as a real consumer**
  - Test the public package interface and React server rendering, build both
    module formats and declarations, inspect the packed tarball, and run the
    full app, font, OpenAPI, and production-build checks once the batch lands.
- [x] **Publish the source and package**
  - Scan the complete Git history for secrets before changing visibility.
  - Merge the implementation, publish the available `pxface` npm name, make
    `gwendall/pxface` public, deploy production, and verify every public URL.
  - Full-history `gitleaks` scan: 31 commits and 0 findings before opening the
    repository. Production dependencies and the full workspace audit clean.
  - GitHub, Vercel, and npm are public and verified. The first release reserved
    `pxface`, published version `1.0.0` as `latest`, and attached the matching
    GitHub source release.

## Now - social preview artifact

- [x] **Keep supporting copy readable in real link previews**
  - Increase the supporting type after the Telegram preview exposed text that
    was technically present but too small to read comfortably.
  - Move the URL away from the top-right media overlay used by Telegram and
    recheck both Telegram-sized and X-sized previews.

- [x] **Turn the social image into the product poster**
  - Make the PXFACE glyph artwork dominate the 1200×630 frame and remain
    instantly legible in a mobile feed.
  - Preserve the dark, off-white, and orange brand system without adding a
    second visual identity or generic marketing decoration.
- [x] **Guarantee Open Graph and X discovery**
  - Publish explicit large-image metadata, dimensions, and accessible alt text
    for every route through the shared metadata implementation.
  - Verify the public image response with normal and X crawler user agents.
- [x] **Compare, test, publish, and verify**
  - Inspect multiple rendered iterations at full size and feed-preview size.
  - Run metadata tests, lint, the production build, browser QA, and production
    verification before closing the batch.

## Now - agent resource discovery

- [x] **Surface the machine-readable resources**
  - Give `llms.txt`, `SKILL.md`, and `openapi.yaml` a dedicated, human-readable
    resource block on the API guide.
  - Publish typed alternate links in the page metadata so tools can discover
    the files without parsing the full guide.
- [x] **Verify and publish agent discovery**
  - Test all three resources, their MIME types, page metadata, responsive
    presentation, and the production deployment.

## Now - API parameter reference

- [x] **Document every accepted render parameter**
  - Replace the compact option summary with grouped reference tables covering
    parameter names, types or accepted values, defaults, constraints, and
    effects.
  - Keep the human reference aligned with the renderer option keys through an
    automated coverage test.
- [x] **Verify and publish the API documentation**
  - Test the page at desktop and mobile sizes in both color schemes, run the
    automated checks, then merge and verify the production deployment.

## Now - shared editorial footer

- [x] **Consolidate secondary-page footers**
  - Replace the separate Font, API, and License footer markup with one shared
    server component and one consistent set of links.
  - Keep the compact studio footer separate because it belongs to the fixed,
    full-screen canvas layout.
- [x] **Verify and publish the footer consolidation**
  - Test all secondary pages at desktop and mobile sizes in both color schemes,
    then merge and verify the production deployment.

## Now - shared site shell

- [x] **Unify the PXFACE signature and navigation**
  - Treat the orange PX mark and FACE suffix as one readable PXFACE lockup.
  - Use the same Studio, Font, API, and License navigation on every route.
- [x] **Add complete route metadata**
  - Give every page its own title, description, canonical URL, Open Graph, and
    Twitter card metadata through one shared Next.js metadata helper.
- [x] **Verify and publish the shared shell**
  - Test desktop/mobile layout, both color schemes, metadata output, routes,
    automated checks, and the production deployment.

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
- [x] **Migrate repositories and production**
  - Rename the private GitHub repository and Vercel project to `pxface`.
  - Deploy the new brand, attach `pxface.com`, and redirect `pxword.com` while
    preserving paths.
- [x] **Verify and close the migration**
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
