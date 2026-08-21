"use client";

import {
  ArrowCounterClockwise,
  Check,
  Copy,
  DownloadSimple,
  Export,
  ImageSquare,
  Pause,
  Play,
  Shuffle,
  TextAlignCenter,
  TextAlignLeft,
  TextAlignRight,
} from "@phosphor-icons/react";
import Link from "next/link";
import NextImage from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPixelLayout,
  createWordmarkTimeline,
  renderWordmark,
  renderWordmarkAnimation,
  type ColorMode,
  type ExportRatio,
  type PixelEffect,
  type PixelOverride,
  type PixelOverrides,
  type PixelShape,
  type TextAlign,
  type WordmarkInput,
  wordmarkFileName,
} from "pxface";
import { exportAnimationBlob, type AnimatedAssetFormat } from "@/lib/animation-export";
import WordmarkCanvas from "./wordmark-canvas";

type Palette = {
  name: string;
  foreground: string;
  background: string;
  shadow: string;
};

const palettes: Palette[] = [
  {
    name: "Signal",
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

const sampleWords = ["PXFACE", "TYPE", "GLYPH", "MODULAR"];
const initialRandomSeed = 0x50584641;

const remixPresets: Array<{
  effect: PixelEffect;
  name: string;
  description: string;
  amount: number;
  asset: string;
}> = [
  { effect: "none", name: "Clean", description: "Original grid", amount: 1, asset: "clean" },
  { effect: "assemble", name: "Assemble", description: "Fall into place", amount: 1.15, asset: "assemble" },
  { effect: "explode", name: "Reform", description: "Break and return", amount: 1.2, asset: "explode" },
  { effect: "relay", name: "Relay", description: "Cell-by-cell signal", amount: 1.1, asset: "relay" },
  { effect: "scan", name: "Scan", description: "Grid sweep", amount: 1.1, asset: "scan" },
  { effect: "glitch", name: "Glitch", description: "Rerouted scanlines", amount: 1.15, asset: "glitch" },
];

const animationFrameRate = 12;

function EffectPreview({ asset, animated, reducedMotion }: {
  asset: string;
  animated: boolean;
  reducedMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    const button = video?.closest("button");
    if (!video || !button || reducedMotion) return;
    const play = () => {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    };
    const stop = () => {
      video.pause();
      video.currentTime = 0;
    };
    button.addEventListener("pointerenter", play);
    button.addEventListener("pointerleave", stop);
    button.addEventListener("focus", play);
    button.addEventListener("blur", stop);
    return () => {
      button.removeEventListener("pointerenter", play);
      button.removeEventListener("pointerleave", stop);
      button.removeEventListener("focus", play);
      button.removeEventListener("blur", stop);
    };
  }, [reducedMotion]);

  if (!animated) {
    return <NextImage src={`/effects/${asset}.png`} width={192} height={96} alt="" loading="lazy" unoptimized />;
  }
  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      poster={`/effects/${asset}.png`}
      width="192"
      height="96"
      aria-hidden="true"
    >
      <source src={`/effects/${asset}.webm`} type="video/webm" />
    </video>
  );
}

function randomSeed() {
  const values = new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return values[0];
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
  const displayValue = Number.isInteger(value) ? value : Number(value.toFixed(2));
  return (
    <label className="range-control">
      <span>
        {label}
        <output>{displayValue}{suffix}</output>
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
  const pickerValue = /^#[0-9a-f]{8}$/i.test(value) ? value.slice(0, 7) : value;
  return (
    <label className="color-control">
      <span>{label}</span>
      <span className="color-value">
        {value.toUpperCase()}
        <input
          type="color"
          value={pickerValue}
          aria-label={`${label} color`}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}

export default function PixelStudio() {
  const [text, setText] = useState("HELLO\nTHERE");
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [wordSpacing, setWordSpacing] = useState(3);
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
  const [effect, setEffect] = useState<PixelEffect>("none");
  const [effectAmount, setEffectAmount] = useState(1);
  const [loopDuration, setLoopDuration] = useState(3);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [pixelOverrides, setPixelOverrides] = useState<PixelOverrides>({});
  const [selectedPixelId, setSelectedPixelId] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [exportState, setExportState] = useState<AnimatedAssetFormat | "idle" | "error">("idle");
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState("");
  const exportMenuRef = useRef<HTMLDetailsElement>(null);

  const wordmarkInput = useMemo<WordmarkInput>(() => ({
    text,
    foreground,
    background,
    depthColor: shadow,
    letterSpacing,
    wordSpacing,
    lineSpacing,
    pixelGap,
    depth,
    padding: paddingPercent,
    ratio: exportRatio,
    align,
    shape,
    slant,
    transparent,
    colorMode,
    seed: randomPaletteSeed,
    effect,
    effectAmount,
    pixelOverrides,
  }), [
    align,
    background,
    colorMode,
    depth,
    exportRatio,
    effect,
    effectAmount,
    foreground,
    letterSpacing,
    lineSpacing,
    paddingPercent,
    pixelGap,
    pixelOverrides,
    randomPaletteSeed,
    shadow,
    shape,
    slant,
    text,
    transparent,
    wordSpacing,
  ]);
  const render = useMemo(() => renderWordmark(wordmarkInput), [wordmarkInput]);
  const timeline = useMemo(() => effect === "none" ? undefined : createWordmarkTimeline(wordmarkInput, {
    duration: loopDuration,
    frameRate: animationFrameRate,
  }), [effect, loopDuration, wordmarkInput]);
  const { layout } = render.scene;
  const emptyLayout = useMemo(() => buildPixelLayout("ABC", 1, 2, "left"), []);
  const hasPixels = layout.pixels.length > 0;
  const selectedPixel = selectedPixelId
    ? render.scene.pixels.find((pixel) => pixel.id === selectedPixelId)
    : undefined;
  const hasManualEdits = Object.keys(pixelOverrides).length > 0;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setPrefersReducedMotion(media.matches);
      if (media.matches) setIsPlaying(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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

  function applyRemixPreset(preset: (typeof remixPresets)[number]) {
    if (preset.effect === effect && preset.effect !== "none") {
      setRandomPaletteSeed(randomSeed());
    }
    setEffect(preset.effect);
    setEffectAmount(preset.amount);
    if (preset.effect !== "none" && !prefersReducedMotion) setIsPlaying(true);
  }

  function updateSelectedPixel(patch: PixelOverride) {
    if (!selectedPixelId) return;
    setPixelOverrides((current) => ({
      ...current,
      [selectedPixelId]: { ...current[selectedPixelId], ...patch },
    }));
  }

  function resetSelectedPixel() {
    if (!selectedPixelId) return;
    setPixelOverrides((current) => {
      const next = { ...current };
      delete next[selectedPixelId];
      return next;
    });
  }

  function resetRemix() {
    setEffect("none");
    setEffectAmount(1);
    setPixelOverrides({});
    setSelectedPixelId(null);
    setIsPlaying(false);
  }

  function handleTextChange(value: string) {
    setText(value.toUpperCase().split("\n").slice(0, 3).join("\n"));
    setPixelOverrides({});
    setSelectedPixelId(null);
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
    const effects: PixelEffect[] = ["assemble", "explode", "relay", "scan", "glitch", "spectrum", "wave", "weave"];
    setEffect(effects[Math.floor(Math.random() * effects.length)]);
    setEffectAmount(0.85 + Math.random() * 0.45);
    setPixelOverrides({});
    setSelectedPixelId(null);
    if (!prefersReducedMotion) setIsPlaying(true);
  }

  function getSvgMarkup() {
    return render.svg;
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
    downloadBlob(new Blob([getSvgMarkup()], { type: "image/svg+xml" }), wordmarkFileName(text, "svg"));
  }

  function animationFileName(extension: "svg" | AnimatedAssetFormat) {
    return wordmarkFileName(text, extension).replace(`.${extension}`, `-loop.${extension}`);
  }

  function downloadAnimatedSvg() {
    const animation = renderWordmarkAnimation(wordmarkInput, {
      duration: loopDuration,
      frameRate: animationFrameRate,
    });
    downloadBlob(
      new Blob([animation.svg], { type: "image/svg+xml" }),
      animationFileName("svg"),
    );
    if (exportMenuRef.current) exportMenuRef.current.open = false;
  }

  async function downloadAnimation(format: AnimatedAssetFormat) {
    setExportState(format);
    setExportProgress(0);
    setExportError("");
    try {
      await new Promise(requestAnimationFrame);
      const animation = renderWordmarkAnimation(wordmarkInput, {
        duration: loopDuration,
        frameRate: animationFrameRate,
      });
      const blob = await exportAnimationBlob(animation, format, ({ completed, total }) => {
        setExportProgress(Math.round((completed / total) * 100));
      });
      downloadBlob(blob, animationFileName(format));
      setExportState("idle");
      if (exportMenuRef.current) exportMenuRef.current.open = false;
    } catch (error) {
      setExportState("error");
      setExportError(error instanceof Error ? error.message : "Animation export failed.");
    }
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
        if (blob) downloadBlob(blob, wordmarkFileName(text, "png"));
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }

  async function copySvg() {
    try {
      const svg = getSvgMarkup();
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({
          "text/html": new Blob([svg], { type: "text/html" }),
          "text/plain": new Blob([svg], { type: "text/plain" }),
        })]);
      } else {
        await navigator.clipboard.writeText(svg);
      }
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
  const hasAnimation = effect !== "none" && hasPixels;
  const isExporting = exportState !== "idle" && exportState !== "error";

  return (
    <div className="app-shell">
      <div className="studio-toolbar" aria-label="Studio export controls">
        <p className="source-note"><span>Pixel motion</span><strong>Every cell moves independently. Export the loop.</strong></p>
        <div className="topbar-actions">
          <button type="button" className="button secondary" onClick={copySvg} disabled={!hasPixels}>
            {copyState === "copied" ? <Check weight="bold" /> : <Copy />}
            {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy for Figma"}
          </button>
          <details className="export-menu" ref={exportMenuRef}>
            <summary
              className="button primary"
              aria-disabled={!hasPixels || isExporting}
              onClick={(event) => {
                if (!hasPixels || isExporting) event.preventDefault();
              }}
            >
              <Export weight="bold" /> {isExporting ? `${exportProgress}%` : "Export"}
            </summary>
            <div className="export-popover" aria-label="Export formats">
              <p>Static</p>
              <button type="button" onClick={downloadPng} disabled={!hasPixels || isExporting}>
                <ImageSquare weight="fill" /><span><strong>PNG</strong><small>Raster image</small></span>
              </button>
              <button type="button" onClick={downloadSvg} disabled={!hasPixels || isExporting}>
                <DownloadSimple /><span><strong>SVG</strong><small>Editable pixels</small></span>
              </button>
              <p>Loop</p>
              <button type="button" onClick={downloadAnimatedSvg} disabled={!hasAnimation || isExporting}>
                <DownloadSimple /><span><strong>Animated SVG</strong><small>Native and hackable</small></span>
              </button>
              {(["gif", "webm", "mp4"] as AnimatedAssetFormat[]).map((format) => (
                <button
                  type="button"
                  key={format}
                  disabled={!hasAnimation || isExporting}
                  onClick={() => void downloadAnimation(format)}
                >
                  <DownloadSimple />
                  <span>
                    <strong>{format.toUpperCase()}</strong>
                    <small>{format === "gif" ? "Universal loop" : format === "webm" ? "Video + alpha" : "Social video"}</small>
                  </span>
                </button>
              ))}
              {!hasAnimation && <small className="export-hint">Choose a motion effect to export a loop.</small>}
              {exportState === "error" && <small className="export-error" role="alert">{exportError}</small>}
            </div>
          </details>
        </div>
      </div>

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
              onChange={(event) => handleTextChange(event.target.value)}
            />
            <div className="sample-row" aria-label="Text examples">
              {sampleWords.map((word) => (
                <button type="button" key={word} onClick={() => handleTextChange(word)}>{word}</button>
              ))}
            </div>
          </section>

          <section className="control-section remix-section">
            <div className="remix-heading">
              <div>
                <p className="field-label">Motion</p>
                <p>Seamless loops built from individual cells.</p>
              </div>
              <div className="remix-heading-actions">
                {effect !== "none" && (
                  <button
                    type="button"
                    className="loop-toggle"
                    aria-label={isPlaying ? "Pause animation" : "Play animation"}
                    aria-pressed={isPlaying}
                    onClick={() => setIsPlaying((current) => !current)}
                    disabled={prefersReducedMotion}
                  >
                    {isPlaying ? <Pause weight="fill" /> : <Play weight="fill" />}
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                )}
                {(effect !== "none" || hasManualEdits) && (
                  <button type="button" onClick={resetRemix}>Reset all</button>
                )}
              </div>
            </div>
            <div className="remix-grid" aria-label="Pixel effect presets">
              {remixPresets.map((preset) => (
                <button
                  type="button"
                  className="remix-preset"
                  data-active={effect === preset.effect}
                  aria-pressed={effect === preset.effect}
                  aria-label={`Apply ${preset.name} effect: ${preset.description}`}
                  key={preset.effect}
                  onClick={() => applyRemixPreset(preset)}
                >
                  <span className="remix-preset-art" aria-hidden="true">
                    <EffectPreview
                      asset={preset.asset}
                      animated={preset.effect !== "none"}
                      reducedMotion={prefersReducedMotion}
                    />
                  </span>
                  <span className="remix-preset-copy">
                    <strong>{preset.name}</strong>
                    <small>{preset.description}</small>
                  </span>
                </button>
              ))}
            </div>
            {effect !== "none" && (
              <div className="loop-controls">
                <RangeControl label="Effect strength" min={0} max={2} step={0.05} value={effectAmount} onChange={setEffectAmount} />
                <RangeControl label="Loop duration" min={1} max={6} step={0.5} value={loopDuration} suffix="s" onChange={setLoopDuration} />
                <small>{animationFrameRate} fps pixel cadence. Static SVG and PNG use the strongest frame.</small>
              </div>
            )}
          </section>

          <section className="control-section pixel-inspector" data-active={Boolean(selectedPixel)}>
            <div className="pixel-inspector-heading">
              <div>
                <p className="field-label">Pixel editor</p>
                <p>{selectedPixel ? "Manual overrides are applied after the effect." : "Click a pixel on the canvas or choose one below."}</p>
              </div>
              {selectedPixel && pixelOverrides[selectedPixel.id] && (
                <button type="button" onClick={resetSelectedPixel}><ArrowCounterClockwise /> Reset</button>
              )}
            </div>
            <label className="pixel-select-label">
              <span>Selected pixel</span>
              <select value={selectedPixelId ?? ""} onChange={(event) => setSelectedPixelId(event.target.value || null)}>
                <option value="">None</option>
                {render.scene.pixels.map((pixel) => (
                  <option value={pixel.id} key={pixel.id}>
                    {pixel.value} {pixel.character + 1} / row {pixel.row + 1} / col {pixel.column + 1}
                  </option>
                ))}
              </select>
            </label>
            {selectedPixel && (
              <div className="pixel-controls">
                <ColorControl label="Pixel color" value={selectedPixel.color} onChange={(color) => updateSelectedPixel({ color })} />
                <RangeControl label="Horizontal offset" min={-3} max={3} step={0.1} value={selectedPixel.offsetX} onChange={(offsetX) => updateSelectedPixel({ offsetX })} />
                <RangeControl label="Vertical offset" min={-3} max={3} step={0.1} value={selectedPixel.offsetY} onChange={(offsetY) => updateSelectedPixel({ offsetY })} />
                <RangeControl label="Opacity" min={0} max={1} step={0.05} value={selectedPixel.opacity} onChange={(opacity) => updateSelectedPixel({ opacity })} />
                <RangeControl label="Scale" min={0.1} max={3} step={0.1} value={selectedPixel.scale} onChange={(scale) => updateSelectedPixel({ scale })} />
              </div>
            )}
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
            <RangeControl label="Word space" min={0} max={8} value={wordSpacing} onChange={setWordSpacing} />
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
                title="Random colors: click again to reshuffle"
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
          <Link className="font-download-link" href="/font">
            <DownloadSimple /> Download PXFACE font
          </Link>
        </aside>

        <section className="preview-panel" aria-label="Wordmark preview">
          <div className="preview-meta">
            <span>Live canvas / click a pixel</span>
            <span>{effect === "none" ? "Clean" : `${effect} / ${loopDuration}s loop`} / {layout.width}×{layout.height} units</span>
          </div>
          <div className={`preview-frame${transparent ? " checkerboard" : ""}`} style={previewStyle}>
            {hasPixels ? (
              <WordmarkCanvas
                scene={render.scene}
                timeline={timeline}
                playing={isPlaying && !prefersReducedMotion}
                selectedPixelId={selectedPixelId}
                ariaLabel={`${text || "Empty"} pixel wordmark preview`}
                onSelectPixel={setSelectedPixelId}
              />
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
            <Link className="api-link" href="/docs/api">Render API</Link>
            <Link className="spec-note" href="/license">Glyphs CC0 / Code MIT</Link>
            <a href="https://gwendall.com" target="_blank" rel="noreferrer">Made by Gwendall</a>
          </div>
        </section>
      </main>
    </div>
  );
}
