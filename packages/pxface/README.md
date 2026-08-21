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

## Remix pixels

Effects operate on the individual cells of the 3×5 grid and stay
deterministic when a seed is provided. Manual overrides are applied after the
effect, so any pixel can be recolored or transformed independently.

```ts
const { svg, scene } = renderWordmark({
  text: "REMIX",
  effect: "wave",
  effectAmount: 1.1,
  seed: 42,
  pixelOverrides: {
    "l0-c0-r0-x0": {
      color: "#FF4E1A",
      offsetY: -1,
      opacity: 0.7,
      scale: 1.4,
    },
  },
});

console.log(scene.pixels[0].id); // l0-c0-r0-x0
```

Available effects are `spectrum`, `explode`, `wave`, `glitch`, `weave`,
`assemble`, `relay`, and `scan`.
Each resolved scene pixel exposes its stable ID, color, offsets, opacity,
scale, and rotation. Export bounds grow around transformed pixels so SVG and
PNG output do not clip the remix.

## Animate the grid

Animation is fixed-step and deterministic. Sample any exact loop phase with
`animationProgress`, or generate a complete loop whose frames all share one
viewBox. The returned animated SVG is self-contained and includes a static
reduced-motion fallback.

```ts
import { renderWordmarkAnimation } from "pxface";

const loop = renderWordmarkAnimation(
  { text: "MOVE", effect: "assemble", seed: 42 },
  { duration: 3, frameRate: 12 },
);

console.log(loop.svg);           // self-contained animated SVG
console.log(loop.frames[0].svg); // exact static SVG frame
```

For a single deterministic frame, call `renderWordmark` with
`animationProgress` between `0` and `1`. Both ends resolve to the same seamless
loop frame.

For realtime Canvas or WebGL playback, use `createWordmarkTimeline`. It returns
the same fixed-step scenes and shared viewBox without serializing an SVG string
for every frame. Call `renderWordmarkAnimation` only when you need the finished
animated asset.

```ts
import { createWordmarkTimeline } from "pxface";

const timeline = createWordmarkTimeline(
  { text: "MOVE", effect: "relay" },
  { duration: 3, frameRate: 12 },
);

drawScene(timeline.frames[0].scene);
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

```tsx
import { AnimatedPxface } from "pxface/react";

export function Loop() {
  return <AnimatedPxface text="MOVE" effect="relay" duration={3} frameRate={12} />;
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
static and animated SVG/PNG endpoint remains available at
[pxface.com/docs/api](https://pxface.com/docs/api).

## Licensing

- Package code: MIT.
- Canonical 3×5 glyph matrices: CC0 1.0 Universal, no attribution required.
- PXFACE name, logo, and brand identity: excluded; all rights reserved.

See [LICENSES.md](LICENSES.md) for the exact scope. A user's complete export
is not automatically CC0: text, arrangement, colors, and other creative
choices retain their respective rights.
