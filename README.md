# PXFACE

PXFACE is a browser-based 3×5 pixel wordmark studio. Type a mark, adjust its spacing, shape, depth, and palette, then export it as SVG or PNG.

**Pixel type, made tangible.**

Production: [pxface.com](https://pxface.com)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Quality checks:

```bash
npm test
npm run lint
npm run build
npm run font:verify
```

`npm run fixtures:update` regenerates reviewed SVG/PNG golden files. `npm run
font:build` regenerates all font formats and requires Python FontTools with
WOFF support (`fonttools[woff]`). `npm run font:verify` checks font metadata,
printable ASCII coverage, binary signatures, release hashes, and exact ZIP
contents. See `docs/architecture.md` before changing a render option or glyph
so every adapter stays synchronized.

The app lives in `src/app`. The CC0 glyph data lives in `src/lib/pixel-font-data.ts`, with the layout and headless render engine in `src/lib`.

The public render endpoint, OpenAPI contract, agent skill, and installable font are documented at [pxface.com/docs/api](https://pxface.com/docs/api), [pxface.com/openapi.yaml](https://pxface.com/openapi.yaml), [pxface.com/SKILL.md](https://pxface.com/SKILL.md), and [pxface.com/font](https://pxface.com/font).

## Font releases

The font download page leads with a versioned TTF package for the most reliable
desktop and design-tool installation. It also provides an OTF alternative, a
WOFF2/WOFF web kit with CSS, individual immutable files, and a complete release
archive. Do not install both TTF and OTF: they are the same family and style.

`public/fonts/manifest.json` is the machine-readable release index. Each
complete archive includes the OFL, README, FONTLOG, checksums, and a binary
manifest. Legacy unversioned files remain available for existing app CSS, while
public documentation links to the versioned `public/fonts/v2.0.0` artifacts.

PXFACE replaces the former PXWORD identity. Requests to `pxword.com` and old
PXWORD font download paths redirect to their PXFACE equivalents. The render API
also retains deprecated `X-PXWORD-*` response headers and SVG metadata aliases
during the migration window.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The repository is linked to Vercel. Pushes to `main` deploy to production.

## Licensing

PXFACE uses separate terms for its code, glyphs, and brand:

| Material | Terms |
| --- | --- |
| Application code | [MIT License](LICENSE) |
| 3×5 glyph matrices in `src/lib/pixel-font-data.ts` | [CC0 1.0 Universal](LICENSES/CC0-1.0.txt) — no attribution required |
| Installable font binaries in `public/fonts` | [SIL Open Font License 1.1](LICENSES/OFL-1.1.txt), Reserved Font Name “PXFACE” |
| PXFACE name, logo, and brand identity | Excluded; all rights reserved |

CC0 applies only to the underlying glyph shapes. It does not claim rights over the text, arrangement, colors, or other creative choices users add to their exports.
