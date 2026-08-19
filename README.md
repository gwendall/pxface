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

The app lives in `src/app`. The CC0 glyph data lives in `src/lib/pixel-font-data.ts`, with the layout engine in `src/lib/pixel-font.ts`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The repository is linked to Vercel. Pushes to `main` deploy to production.

## Licensing

PXWORD uses separate terms for its code, glyphs, and brand:

| Material | Terms |
| --- | --- |
| Application code | [MIT License](LICENSE) |
| 3×5 glyph matrices in `src/lib/pixel-font-data.ts` | [CC0 1.0 Universal](LICENSES/CC0-1.0.txt) — no attribution required |
| PXWORD name, logo, and brand identity | Excluded; all rights reserved |

CC0 applies only to the underlying glyph shapes. It does not claim rights over the text, arrangement, colors, or other creative choices users add to their exports.
