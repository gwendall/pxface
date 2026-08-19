# PXWORD

PXWORD is a browser-based 3×5 pixel wordmark studio. Type a mark, adjust its spacing, shape, depth, and palette, then export it as SVG or PNG.

Production: [pxword.com](https://pxword.com)

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
```

`npm run fixtures:update` regenerates reviewed SVG/PNG golden files. `npm run
font:build` regenerates all font formats and requires Python FontTools with
WOFF support (`fonttools[woff]`). See `docs/architecture.md` before changing a
render option or glyph so every adapter stays synchronized.

The app lives in `src/app`. The CC0 glyph data lives in `src/lib/pixel-font-data.ts`, with the layout and headless render engine in `src/lib`.

The public render endpoint, OpenAPI contract, agent skill, and installable font are documented at [pxword.com/docs/api](https://pxword.com/docs/api), [pxword.com/openapi.yaml](https://pxword.com/openapi.yaml), [pxword.com/SKILL.md](https://pxword.com/SKILL.md), and [pxword.com/font](https://pxword.com/font).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The repository is linked to Vercel. Pushes to `main` deploy to production.

## Licensing

PXWORD uses separate terms for its code, glyphs, and brand:

| Material | Terms |
| --- | --- |
| Application code | [MIT License](LICENSE) |
| 3×5 glyph matrices in `src/lib/pixel-font-data.ts` | [CC0 1.0 Universal](LICENSES/CC0-1.0.txt) — no attribution required |
| Installable font binaries in `public/fonts` | [SIL Open Font License 1.1](LICENSES/OFL-1.1.txt), Reserved Font Name “PXWORD” |
| PXWORD name, logo, and brand identity | Excluded; all rights reserved |

CC0 applies only to the underlying glyph shapes. It does not claim rights over the text, arrangement, colors, or other creative choices users add to their exports.
