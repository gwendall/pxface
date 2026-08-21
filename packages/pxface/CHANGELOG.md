# Changelog

## 1.2.0 - 2026-08-21

- Add normalized time as a deterministic renderer input and fixed-step loop
  generation with shared bounds.
- Add self-contained animated SVG output and the server-renderable
  `AnimatedPxface` React adapter.
- Add Assemble, Relay, and Scan plus seamless animated behavior for all
  existing grid-native effects.
- Add a lightweight `createWordmarkTimeline` scene API for realtime Canvas or
  WebGL playback without eager per-frame SVG serialization.

## 1.1.0 - 2026-08-21

- Add stable structural pixel IDs and resolved color, offset, opacity, scale,
  and rotation properties to every scene.
- Add deterministic Spectrum, Explode, Wave, Glitch, and Weave effects.
- Add validated per-pixel overrides and export bounds that expand around
  transformed cells.

## 1.0.0 - 2026-08-20

- Publish the canonical, framework-agnostic PXFACE renderer as ESM and
  CommonJS with TypeScript declarations and source maps.
- Add the optional `pxface/react` adapter for React, SSR, and React Server
  Components.
- Include deterministic editable SVG, serializable scenes, the complete
  printable ASCII glyph set, runtime validation, and versioned defaults.
