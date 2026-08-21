"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import {
  getRenderPixelGeometry,
  hitTestWordmarkPixel,
  type RenderPixel,
  type WordmarkScene,
  type WordmarkTimeline,
} from "pxface";

type WordmarkCanvasProps = {
  scene: WordmarkScene;
  timeline?: WordmarkTimeline;
  playing: boolean;
  selectedPixelId: string | null;
  ariaLabel: string;
  onSelectPixel: (pixelId: string) => void;
};

const MAX_BACKING_PIXELS = 2_000_000;

function drawPixel(
  context: CanvasRenderingContext2D,
  scene: WordmarkScene,
  pixel: RenderPixel,
  layerOffset: number,
  color: string,
  outlined: boolean,
) {
  const { x, y, size, centerX, centerY } = getRenderPixelGeometry(pixel, scene.options, layerOffset);
  context.save();
  context.globalAlpha = pixel.opacity;
  context.translate(centerX, centerY);
  context.rotate(pixel.rotation * Math.PI / 180);
  context.scale(pixel.scale, pixel.scale);
  context.translate(-centerX, -centerY);
  context.beginPath();
  if (scene.options.shape === "dot") {
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  } else if (scene.options.shape === "soft") {
    context.roundRect(x, y, size, size, Math.min(0.22, size / 3));
  } else {
    context.rect(x, y, size, size);
  }
  context.fillStyle = color;
  context.fill();
  if (outlined) {
    context.globalAlpha = 1;
    context.strokeStyle = "#FF4E1A";
    context.lineWidth = 0.12;
    context.stroke();
  }
  context.restore();
}

function drawScene(
  canvas: HTMLCanvasElement,
  scene: WordmarkScene,
  selectedPixelId: string | null,
  hoveredPixelId: string | null,
) {
  const bounds = canvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;
  const density = Math.max(1, Math.min(
    window.devicePixelRatio || 1,
    2,
    Math.sqrt(MAX_BACKING_PIXELS / (bounds.width * bounds.height)),
  ));
  const width = Math.max(1, Math.round(bounds.width * density));
  const height = Math.max(1, Math.round(bounds.height * density));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, width, height);
  const fit = Math.min(bounds.width / scene.viewBox.width, bounds.height / scene.viewBox.height);
  const left = (bounds.width - scene.viewBox.width * fit) / 2 - scene.viewBox.x * fit;
  const top = (bounds.height - scene.viewBox.height * fit) / 2 - scene.viewBox.y * fit;
  context.setTransform(density * fit, 0, 0, density * fit, density * left, density * top);
  context.imageSmoothingEnabled = false;
  for (let layerOffset = 1; layerOffset <= scene.options.depth; layerOffset += 1) {
    scene.pixels.forEach((pixel) => drawPixel(
      context,
      scene,
      pixel,
      layerOffset,
      scene.options.depthColor,
      false,
    ));
  }
  scene.pixels.forEach((pixel) => drawPixel(
    context,
    scene,
    pixel,
    0,
    pixel.color,
    pixel.id === selectedPixelId || pixel.id === hoveredPixelId,
  ));
}

function pointerToDesignPoint(canvas: HTMLCanvasElement, scene: WordmarkScene, clientX: number, clientY: number) {
  const bounds = canvas.getBoundingClientRect();
  const fit = Math.min(bounds.width / scene.viewBox.width, bounds.height / scene.viewBox.height);
  const renderedWidth = scene.viewBox.width * fit;
  const renderedHeight = scene.viewBox.height * fit;
  return {
    x: scene.viewBox.x + (clientX - bounds.left - (bounds.width - renderedWidth) / 2) / fit,
    y: scene.viewBox.y + (clientY - bounds.top - (bounds.height - renderedHeight) / 2) / fit,
  };
}

export default function WordmarkCanvas({
  scene,
  timeline,
  playing,
  selectedPixelId,
  ariaLabel,
  onSelectPixel,
}: WordmarkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentSceneRef = useRef(scene);
  const hoveredPixelIdRef = useRef<string | null>(null);
  const selectedPixelIdRef = useRef(selectedPixelId);
  const redrawRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    redrawRef.current = () => {
      if (canvasRef.current) {
        drawScene(
          canvasRef.current,
          currentSceneRef.current,
          selectedPixelIdRef.current,
          hoveredPixelIdRef.current,
        );
      }
    };
    return () => {
      redrawRef.current = () => undefined;
    };
  }, []);

  useEffect(() => {
    selectedPixelIdRef.current = selectedPixelId;
    redrawRef.current();
  }, [selectedPixelId]);

  useEffect(() => {
    currentSceneRef.current = timeline?.frames[0]?.scene ?? scene;
    redrawRef.current();
  }, [scene, timeline]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => redrawRef.current());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!timeline || !playing) return;
    let requestId = 0;
    let previousFrame = -1;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - startedAt) % (timeline.duration * 1000);
      const frame = Math.floor(elapsed / 1000 * timeline.frameRate) % timeline.frames.length;
      if (frame !== previousFrame) {
        previousFrame = frame;
        currentSceneRef.current = timeline.frames[frame].scene;
        redrawRef.current();
      }
      requestId = requestAnimationFrame(tick);
    };
    requestId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestId);
  }, [playing, timeline]);

  function hit(event: ReactPointerEvent<HTMLCanvasElement>) {
    const point = pointerToDesignPoint(
      event.currentTarget,
      currentSceneRef.current,
      event.clientX,
      event.clientY,
    );
    return hitTestWordmarkPixel(currentSceneRef.current, point.x, point.y);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const pixelId = hit(event)?.id ?? null;
    if (pixelId === hoveredPixelIdRef.current) return;
    hoveredPixelIdRef.current = pixelId;
    event.currentTarget.style.cursor = pixelId ? "pointer" : "default";
    redrawRef.current();
  }

  return (
    <canvas
      ref={canvasRef}
      className="wordmark-canvas"
      role="img"
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        hoveredPixelIdRef.current = null;
        event.currentTarget.style.cursor = "default";
        redrawRef.current();
      }}
      onPointerDown={(event) => {
        const pixelId = hoveredPixelIdRef.current ?? hit(event)?.id;
        if (pixelId) onSelectPixel(pixelId);
      }}
    />
  );
}
