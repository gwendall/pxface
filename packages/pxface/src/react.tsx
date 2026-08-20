import type { CSSProperties } from "react";
import { renderWordmark, type WordmarkInput } from "./wordmark-renderer";

export type PxfaceProps = WordmarkInput & {
  /** Applied to the wrapper so the generated SVG can be sized with CSS. */
  className?: string;
  /** Applied after PXFACE's inline-block and zero-line-height defaults. */
  style?: CSSProperties;
  /** Accessible name. Defaults to the rendered text. */
  ariaLabel?: string;
};

/**
 * Server-renderable React adapter for the canonical PXFACE renderer.
 * It has no hooks, browser globals, effects, or `use client` requirement.
 */
export function Pxface({ className, style, ariaLabel, ...options }: PxfaceProps) {
  const { scene, svg } = renderWordmark(options);
  const label = (ariaLabel ?? scene.options.text.replaceAll("\n", " ")) || "PXFACE wordmark";

  return (
    <span
      className={className}
      style={{ display: "inline-block", lineHeight: 0, ...style }}
      role="img"
      aria-label={label}
      data-pxface-version={scene.version}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
