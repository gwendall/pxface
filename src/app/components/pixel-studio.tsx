"use client";

import {
  Check,
  Copy,
  DownloadSimple,
  ImageSquare,
  Shuffle,
  TextAlignCenter,
  TextAlignLeft,
  TextAlignRight,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  buildPixelLayout,
  type Pixel,
  type TextAlign,
} from "@/lib/pixel-font";
import { shuffledNakedPunksPalette } from "@/lib/naked-punks-palette";

type PixelShape = "square" | "soft" | "dot";
type ColorMode = "solid" | "random";
type ExportRatio = "fit" | "square";

type Palette = {
  name: string;
  foreground: string;
  background: string;
  shadow: string;
};

const palettes: Palette[] = [
  {
    name: "PX Orange",
    foreground: "#F1F0E9",
    background: "#181816",
    shadow: "#FF4E1A",
  },
  {
    name: "Acid",
    foreground: "#1A1A17",
    background: "#D8FF3E",
    shadow: "#F4F1E8",
  },
  {
    name: "Cobalt",
    foreground: "#F4F1E8",
    background: "#1748E8",
    shadow: "#101C52",
  },
  {
    name: "Paper",
    foreground: "#191917",
    background: "#F0EEE6",
    shadow: "#FF4E1A",
  },
];

const sampleWords = ["PXWORD", "PIXEL", "SIGNAL", "MODULAR"];
const initialRandomSeed = 0x5058574f;

function randomSeed() {
  const values = new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return values[0];
}

function roundCanvasValue(value: number) {
  return Number(value.toFixed(4));
}

function PixelMark({ pixels }: { pixels: Pixel[] }) {
  return (
    <svg viewBox="0 0 7 5" aria-hidden="true" className="brand-mark">
      {pixels.map((pixel, index) => (
        <rect key={index} x={pixel.x} y={pixel.y} width="1" height="1" />
      ))}
    </svg>
  );
}

function SegmentButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="segment-button"
      data-active={active}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function RangeControl({
  label,
  min,
  max,
  step = 1,
  value,
  suffix = "",
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-control">
      <span>
        {label}
        <output>{value}{suffix}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="color-control">
      <span>{label}</span>
      <span className="color-value">
        {value.toUpperCase()}
        <input
          type="color"
          value={value}
          aria-label={`${label} color`}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}

function svgShape(
  pixel: Pixel,
  index: number,
  shape: PixelShape,
  gap: number,
  slant: boolean,
  color: string,
  offset = 0,
) {
  const inset = gap / 2;
  const size = 1 - gap;
  const slantOffset = slant ? (4 - pixel.row) * 0.18 : 0;
  const x = pixel.x + inset + slantOffset + offset;
  const y = pixel.y + inset + offset;

  if (shape === "dot") {
    return (
      <circle
        key={`${offset}-${index}`}
        cx={x + size / 2}
        cy={y + size / 2}
        r={size / 2}
        fill={color}
      />
    );
  }

  return (
    <rect
      key={`${offset}-${index}`}
      x={x}
      y={y}
      width={size}
      height={size}
      rx={shape === "soft" ? Math.min(0.22, size / 3) : 0}
      fill={color}
    />
  );
}

export default function PixelStudio() {
  const [text, setText] = useState("HELLO\nTHERE");
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [lineSpacing, setLineSpacing] = useState(2);
  const [pixelGap, setPixelGap] = useState(0);
  const [depth, setDepth] = useState(0);
  const [paddingPercent, setPaddingPercent] = useState(20);
  const [exportRatio, setExportRatio] = useState<ExportRatio>("fit");
  const [shape, setShape] = useState<PixelShape>("square");
  const [align, setAlign] = useState<TextAlign>("left");
  const [slant, setSlant] = useState(false);
  const [transparent, setTransparent] = useState(false);
  const [foreground, setForeground] = useState(palettes[0].foreground);
  const [background, setBackground] = useState(palettes[0].background);
  const [shadow, setShadow] = useState(palettes[0].shadow);
  const [colorMode, setColorMode] = useState<ColorMode>("solid");
  const [randomPaletteSeed, setRandomPaletteSeed] = useState(initialRandomSeed);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const layout = useMemo(
    () => buildPixelLayout(text, letterSpacing, lineSpacing, align),
    [align, letterSpacing, lineSpacing, text],
  );
  const randomPalette = useMemo(
    () => shuffledNakedPunksPalette(background, randomPaletteSeed),
    [background, randomPaletteSeed],
  );
  const pixelColors = useMemo(
    () => layout.pixels.map((_, index) => (
      colorMode === "random" ? randomPalette[index % randomPalette.length] : foreground
    )),
    [colorMode, foreground, layout.pixels, randomPalette],
  );
  const brandLayout = useMemo(() => buildPixelLayout("PX", 1, 2, "left"), []);
  const emptyLayout = useMemo(() => buildPixelLayout("ABC", 1, 2, "left"), []);
  const slantWidth = slant ? 0.72 : 0;
  const contentWidth = layout.width + depth + slantWidth;
  const contentHeight = layout.height + depth;
  const padding = roundCanvasValue(Math.min(contentWidth, contentHeight) * (paddingPercent / 100));
  const fitWidth = roundCanvasValue(contentWidth + padding * 2);
  const fitHeight = roundCanvasValue(contentHeight + padding * 2);
  const viewWidth = roundCanvasValue(exportRatio === "square" ? Math.max(fitWidth, fitHeight) : fitWidth);
  const viewHeight = exportRatio === "square" ? viewWidth : fitHeight;
  const viewX = roundCanvasValue(-(viewWidth - contentWidth) / 2);
  const viewY = roundCanvasValue(-(viewHeight - contentHeight) / 2);
  const hasPixels = layout.pixels.length > 0;
  const shapeRendering = shape === "square" && pixelGap === 0
    ? "crispEdges"
    : "geometricPrecision";

  function selectPalette(palette: Palette) {
    setColorMode("solid");
    setForeground(palette.foreground);
    setBackground(palette.background);
    setShadow(palette.shadow);
  }

  function selectRandomPalette() {
    setColorMode("random");
    setRandomPaletteSeed(randomSeed());
  }

  function shuffleStyle() {
    const paletteIndex = Math.floor(Math.random() * (palettes.length + 1));
    const shapes: PixelShape[] = ["square", "soft", "dot"];
    if (paletteIndex === palettes.length) selectRandomPalette();
    else selectPalette(palettes[paletteIndex]);
    setShape(shapes[Math.floor(Math.random() * shapes.length)]);
    setDepth(Math.floor(Math.random() * 4));
    setPixelGap([0, 0.08, 0.2][Math.floor(Math.random() * 3)]);
    setSlant(Math.random() > 0.55);
  }

  function shapeMarkup(pixel: Pixel, color: string, offset: number) {
    const inset = pixelGap / 2;
    const size = 1 - pixelGap;
    const slantOffset = slant ? (4 - pixel.row) * 0.18 : 0;
    const x = pixel.x + inset + slantOffset + offset;
    const y = pixel.y + inset + offset;

    if (shape === "dot") {
      return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2}" fill="${color}"/>`;
    }

    const radius = shape === "soft" ? Math.min(0.22, size / 3) : 0;
    return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}" fill="${color}"/>`;
  }

  function getSvgMarkup() {
    const exportUnit = 48;
    const licenseMarkup = "<metadata>PXWORD 3x5 glyph shapes are dedicated under CC0-1.0: https://creativecommons.org/publicdomain/zero/1.0/</metadata>";
    const backgroundMarkup = transparent
      ? ""
      : `<rect x="${viewX}" y="${viewY}" width="${viewWidth}" height="${viewHeight}" fill="${background}"/>`;
    const shadowMarkup = Array.from({ length: depth }, (_, layerIndex) =>
      layout.pixels
        .map((pixel) => shapeMarkup(pixel, shadow, layerIndex + 1))
        .join(""),
    ).join("");
    const foregroundMarkup = layout.pixels
      .map((pixel, index) => shapeMarkup(pixel, pixelColors[index], 0))
      .join("");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(viewWidth * exportUnit)}" height="${Math.ceil(viewHeight * exportUnit)}" viewBox="${viewX} ${viewY} ${viewWidth} ${viewHeight}" shape-rendering="${shapeRendering}">${licenseMarkup}${backgroundMarkup}${shadowMarkup}${foregroundMarkup}</svg>`;
  }

  function fileName(extension: string) {
    const safeName = text
      .replace(/\n/g, "-")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
    return `${safeName || "pxword"}.${extension}`;
  }

  function downloadBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadSvg() {
    downloadBlob(new Blob([getSvgMarkup()], { type: "image/svg+xml" }), fileName("svg"));
  }

  function downloadPng() {
    const svg = getSvgMarkup();
    const svgBlob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      context?.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, fileName("png"));
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }

  async function copySvg() {
    try {
      await navigator.clipboard.writeText(getSvgMarkup());
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  const previewStyle = transparent
    ? undefined
    : ({ "--preview-background": background } as React.CSSProperties);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <PixelMark pixels={brandLayout.pixels} />
          <span>PXWORD</span>
        </div>
        <p className="source-note">3×5 pixel wordmark studio</p>
        <div className="topbar-actions">
          <button type="button" className="button secondary" onClick={copySvg} disabled={!hasPixels}>
            {copyState === "copied" ? <Check weight="bold" /> : <Copy />}
            {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy SVG"}
          </button>
          <button type="button" className="button secondary" onClick={downloadSvg} disabled={!hasPixels}>
            <DownloadSimple /> SVG
          </button>
          <button type="button" className="button primary" onClick={downloadPng} disabled={!hasPixels}>
            <ImageSquare weight="fill" /> PNG
          </button>
        </div>
      </header>

      <main className="studio-grid">
        <aside className="control-panel" aria-label="Typography controls">
          <section className="control-section type-section">
            <label className="field-label" htmlFor="wordmark">Your text</label>
            <textarea
              id="wordmark"
              value={text}
              rows={3}
              maxLength={80}
              spellCheck={false}
              style={{ textAlign: align }}
              onChange={(event) => setText(event.target.value.toUpperCase().split("\n").slice(0, 3).join("\n"))}
            />
            <div className="sample-row" aria-label="Text examples">
              {sampleWords.map((word) => (
                <button type="button" key={word} onClick={() => setText(word)}>{word}</button>
              ))}
            </div>
          </section>

          <section className="control-section split-control">
            <div>
              <p className="field-label">Alignment</p>
              <div className="segmented three">
                <SegmentButton active={align === "left"} label="Align left" onClick={() => setAlign("left")}><TextAlignLeft /></SegmentButton>
                <SegmentButton active={align === "center"} label="Align center" onClick={() => setAlign("center")}><TextAlignCenter /></SegmentButton>
                <SegmentButton active={align === "right"} label="Align right" onClick={() => setAlign("right")}><TextAlignRight /></SegmentButton>
              </div>
            </div>
            <div>
              <p className="field-label">Shape</p>
              <div className="segmented three">
                {(["square", "soft", "dot"] as PixelShape[]).map((item) => (
                  <SegmentButton key={item} active={shape === item} label={`${item} pixels`} onClick={() => setShape(item)}>
                    <span className={`shape-icon ${item}`} />
                  </SegmentButton>
                ))}
              </div>
            </div>
          </section>

          <section className="control-section">
            <p className="field-label">Export ratio</p>
            <div className="segmented two">
              <SegmentButton active={exportRatio === "fit"} label="Fit export to content" onClick={() => setExportRatio("fit")}>
                <span className="segment-label">FIT</span>
              </SegmentButton>
              <SegmentButton active={exportRatio === "square"} label="Use a square export canvas" onClick={() => setExportRatio("square")}>
                <span className="segment-label">1:1</span>
              </SegmentButton>
            </div>
          </section>

          <section className="control-section sliders">
            <RangeControl label="Letter space" min={0} max={4} value={letterSpacing} onChange={setLetterSpacing} />
            <RangeControl label="Line space" min={0} max={5} value={lineSpacing} onChange={setLineSpacing} />
            <RangeControl label="Pixel gap" min={0} max={0.36} step={0.04} value={pixelGap} onChange={setPixelGap} />
            <RangeControl label="Depth" min={0} max={4} value={depth} onChange={setDepth} />
            <RangeControl label="Padding" min={0} max={100} step={5} value={paddingPercent} suffix="%" onChange={setPaddingPercent} />
          </section>

          <section className="control-section color-section">
            <ColorControl
              label="Type"
              value={foreground}
              onChange={(value) => {
                setColorMode("solid");
                setForeground(value);
              }}
            />
            <ColorControl label="Canvas" value={background} onChange={setBackground} />
            <ColorControl label="Depth" value={shadow} onChange={setShadow} />
            <div className="palette-row" aria-label="Color palettes">
              {palettes.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  className="palette-button"
                  title={palette.name}
                  aria-label={`Use ${palette.name} palette`}
                  onClick={() => selectPalette(palette)}
                >
                  <span style={{ background: palette.foreground }} />
                  <span style={{ background: palette.shadow }} />
                  <span style={{ background: palette.background }} />
                </button>
              ))}
              <button
                type="button"
                className="palette-button random-palette-button"
                data-active={colorMode === "random"}
                title="Random colors — click again to reshuffle"
                aria-label="Use random colors; press again to reshuffle"
                aria-pressed={colorMode === "random"}
                onClick={selectRandomPalette}
              >
                <span style={{ background: "#FFF68E" }} />
                <span style={{ background: "#28B143" }} />
                <span style={{ background: "#8119B7" }} />
                <span style={{ background: "#1A6ED5" }} />
                <strong>RANDOM</strong>
              </button>
            </div>
          </section>

          <section className="control-section switches">
            <label className="switch-row">
              <span>
                <strong>Slant</strong>
                <small>Shift rows into an italic form</small>
              </span>
              <input type="checkbox" checked={slant} onChange={(event) => setSlant(event.target.checked)} />
            </label>
            <label className="switch-row">
              <span>
                <strong>Transparent</strong>
                <small>Remove the canvas on export</small>
              </span>
              <input type="checkbox" checked={transparent} onChange={(event) => setTransparent(event.target.checked)} />
            </label>
          </section>

          <button type="button" className="shuffle-button" onClick={shuffleStyle}>
            <Shuffle /> Shuffle style
          </button>
        </aside>

        <section className="preview-panel" aria-label="Wordmark preview">
          <div className="preview-meta">
            <span>Live canvas</span>
            <span>{layout.width}×{layout.height} units</span>
          </div>
          <div className={`preview-frame${transparent ? " checkerboard" : ""}`} style={previewStyle}>
            {hasPixels ? (
              <svg
                className="wordmark-svg"
                viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
                shapeRendering={shapeRendering}
                role="img"
                aria-label={`${text || "Empty"} pixel wordmark preview`}
                style={transparent ? undefined : { background }}
              >
                {Array.from({ length: depth }, (_, layerIndex) =>
                  layout.pixels.map((pixel, index) =>
                    svgShape(pixel, index, shape, pixelGap, slant, shadow, layerIndex + 1),
                  ),
                )}
                {layout.pixels.map((pixel, index) =>
                  svgShape(pixel, index, shape, pixelGap, slant, pixelColors[index]),
                )}
              </svg>
            ) : (
              <div className="empty-state">
                <svg
                  className="empty-state-mark"
                  viewBox={`0 0 ${emptyLayout.width} ${emptyLayout.height}`}
                  shapeRendering="crispEdges"
                  aria-hidden="true"
                >
                  {emptyLayout.pixels.map((pixel, index) => (
                    <rect key={index} x={pixel.x} y={pixel.y} width="1" height="1" />
                  ))}
                </svg>
                <p>Type A-Z, 0-9 or symbols.</p>
              </div>
            )}
          </div>
          <div className="preview-footer">
            <p>Every shape stays vector at any size.</p>
            <Link className="spec-note" href="/license">Glyphs CC0 / Code MIT</Link>
            <a href="https://gwendall.com" target="_blank" rel="noreferrer">Made by Gwendall</a>
          </div>
        </section>
      </main>
    </div>
  );
}
