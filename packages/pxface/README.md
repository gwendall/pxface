# pxface

The canonical JavaScript renderer behind [PXFACE](https://pxface.com): a
minimal 3×5 pixel type system with full control over every pixel.

```bash
npm install pxface
```

## JavaScript

```ts
import { renderWordmark } from "pxface";

const { svg, scene } = renderWordmark({
  text: "HELLO\nTHERE",
  foreground: "#F1F0E9",
  background: "#181816",
  pixelGap: 0,
  padding: 20,
  ratio: "fit",
});

console.log(scene.output); // exact pixel dimensions
```

The root export has no DOM, canvas, browser, or framework dependency. It
returns deterministic SVG plus a serializable scene. Every SVG pixel remains
an individual rectangle or circle grouped by line, character, and layer.

## React

```tsx
import { Pxface } from "pxface/react";

export function Logo() {
  return <Pxface text="HELLO" depth={1} className="logo" />;
}
```

```css
.logo { width: min(100%, 36rem); }
.logo > svg { display: block; width: 100%; height: auto; }
```

`Pxface` works during SSR and in React Server Components: it uses no hooks,
effects, browser globals, or `use client` directive. Importing `pxface` does
not require React; only `pxface/react` uses the optional peer dependency.

All options, limits, editable-SVG details, and browser examples live at
[pxface.com/docs/javascript](https://pxface.com/docs/javascript). The hosted
SVG/PNG endpoint remains available at
[pxface.com/docs/api](https://pxface.com/docs/api).

## Licensing

- Package code: MIT.
- Canonical 3×5 glyph matrices: CC0 1.0 Universal, no attribution required.
- PXFACE name, logo, and brand identity: excluded; all rights reserved.

See [LICENSES.md](LICENSES.md) for the exact scope. A user's complete export
is not automatically CC0: text, arrangement, colors, and other creative
choices retain their respective rights.
