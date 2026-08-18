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

The app lives in `src/app`, with the pixel alphabet and layout engine in `src/lib/pixel-font.ts`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The repository is linked to Vercel. Pushes to `main` deploy to production.
