# Contributing to PXFACE

PXFACE keeps one canonical renderer behind the studio, npm package, React
adapter, HTTP endpoint, SVG exports, and PNG rasterization. Read
[`docs/architecture.md`](docs/architecture.md) before changing a glyph, render
option, default, or output shape.

## Local setup

```bash
npm install
npm run dev
```

Before opening a pull request:

```bash
npm audit
npm test
npm run lint
npm run package:verify
npm run build
npm run font:verify
```

Python FontTools with WOFF support is required only for font verification and
rebuilding: `python3 -m pip install "fonttools[woff]"`.

## Changes to the renderer

- Treat the `pxface` package interface as the test surface. Avoid reproducing
  renderer rules inside an adapter.
- Add focused behavior tests before updating golden files.
- Increment `RENDERER_VERSION` for observable output changes. Breaking hosted
  defaults require a new versioned HTTP route.
- Keep `public/openapi.yaml`, the studio, human docs, `llms.txt`, and both
  copies of `SKILL.md` aligned when the public option surface changes.

## Licensing contributions

By contributing application or package code, you agree that your contribution
is available under the repository's MIT License. By contributing to the
canonical glyph matrices, you agree to dedicate that contribution under CC0
1.0 Universal. The PXFACE name, logo, and brand identity remain excluded.
