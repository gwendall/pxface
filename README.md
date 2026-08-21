# PXFACE

PXFACE is a browser-based 3×5 pixel type system. Type a mark, apply grid-native effects, edit individual pixels, then export it as editable SVG or PNG.

**Hack every pixel. Export native SVG.**

Production: [pxface.com](https://pxface.com)
Source: [github.com/gwendall/pxface](https://github.com/gwendall/pxface)

## JavaScript package

Install the same framework-agnostic renderer used by the studio and hosted
endpoint:

```bash
npm install pxface
```

```ts
import { renderWordmark } from "pxface";

const { svg, scene } = renderWordmark({
  text: "HELLO\nTHERE",
  effect: "wave",
  pixelOverrides: {
    "l0-c0-r0-x0": { color: "#FF4E1A", offsetY: -1 },
  },
});
```

React is an optional adapter rather than a second renderer:

```tsx
import { Pxface } from "pxface/react";

export function Logo() {
  return <Pxface text="HELLO" depth={1} />;
}
```

The package supports ESM, CommonJS, TypeScript, React SSR, and React Server
Components. Full documentation: [pxface.com/docs/javascript](https://pxface.com/docs/javascript).

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
npm run package:verify
npm run font:verify
```

`npm run fixtures:update` regenerates reviewed SVG/PNG golden files. `npm run
font:build` regenerates all font formats and requires Python FontTools with
WOFF support (`fonttools[woff]`). `npm run font:verify` checks font metadata,
printable ASCII coverage, binary signatures, release hashes, and exact ZIP
contents. See `docs/architecture.md` before changing a render option or glyph
so every adapter stays synchronized.

The Next.js app lives in `src/app`. The publishable renderer, React adapter,
and CC0 glyph data live in `packages/pxface`. The root workspace stays private
only to prevent accidental npm publication; the `pxface` workspace is the
public package.

The JavaScript library, public render endpoint, OpenAPI contract, agent skill,
and installable font are documented at
[pxface.com/docs/javascript](https://pxface.com/docs/javascript),
[pxface.com/docs/api](https://pxface.com/docs/api),
[pxface.com/openapi.yaml](https://pxface.com/openapi.yaml),
[pxface.com/SKILL.md](https://pxface.com/SKILL.md), and
[pxface.com/font](https://pxface.com/font).

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
| 3×5 glyph matrices in `packages/pxface/src/pixel-font-data.ts` | [CC0 1.0 Universal](LICENSES/CC0-1.0.txt) — no attribution required |
| Installable font binaries in `public/fonts` | [SIL Open Font License 1.1](LICENSES/OFL-1.1.txt), Reserved Font Name “PXFACE” |
| PXFACE name, logo, and brand identity | Excluded; all rights reserved |

CC0 applies only to the underlying glyph shapes. It does not claim rights over the text, arrangement, colors, or other creative choices users add to their exports.
