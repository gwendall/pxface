import type { WordmarkAnimation } from "pxface";

export type AnimatedAssetFormat = "gif" | "webm" | "mp4";

export type AnimationExportProgress = {
  completed: number;
  total: number;
  stage: "rendering" | "encoding";
};

export function fitAnimationDimensions(
  output: { width: number; height: number },
  maxDimension: number,
  even = false,
) {
  const ratio = Math.min(1, maxDimension / Math.max(output.width, output.height));
  const fit = (value: number) => {
    const rounded = Math.max(even ? 2 : 1, Math.round(value * ratio));
    return even && rounded % 2 ? rounded - 1 : rounded;
  };
  return { width: fit(output.width), height: fit(output.height) };
}

export function gifFrameDelays(duration: number, frameCount: number) {
  const totalCentiseconds = Math.round(duration * 100);
  const base = Math.floor(totalCentiseconds / frameCount);
  const remainder = totalCentiseconds % frameCount;
  return Array.from({ length: frameCount }, (_, index) =>
    Math.max(1, base + (index < remainder ? 1 : 0)) * 10,
  );
}

async function drawSvg(
  canvas: HTMLCanvasElement,
  svg: string,
  background: string | undefined,
) {
  const context = canvas.getContext("2d", { alpha: !background });
  if (!context) throw new Error("Canvas rendering is not available in this browser.");
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (background) {
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    context.imageSmoothingEnabled = false;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  } finally {
    URL.revokeObjectURL(url);
  }
  return context;
}

async function exportGif(
  animation: WordmarkAnimation,
  onProgress?: (progress: AnimationExportProgress) => void,
) {
  const { width, height } = fitAnimationDimensions(animation.output, 960);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const frames: Array<{ data: ArrayBuffer; delay: number }> = [];
  const delays = gifFrameDelays(animation.duration, animation.frames.length);
  for (let index = 0; index < animation.frames.length; index += 1) {
    const context = await drawSvg(canvas, animation.frames[index].svg, undefined);
    frames.push({
      data: Uint8ClampedArray.from(context.getImageData(0, 0, width, height).data).buffer,
      delay: delays[index],
    });
    onProgress?.({ completed: index + 1, total: animation.frames.length, stage: "rendering" });
  }
  onProgress?.({ completed: animation.frames.length, total: animation.frames.length, stage: "encoding" });
  const { encode } = await import("modern-gif");
  return encode({
    width,
    height,
    frames,
    format: "blob",
    looped: true,
    maxColors: 128,
    dither: "floyd-steinberg",
    ditherTransparency: "floyd-steinberg",
  });
}

async function exportVideo(
  animation: WordmarkAnimation,
  format: "webm" | "mp4",
  onProgress?: (progress: AnimationExportProgress) => void,
) {
  const {
    BufferTarget,
    CanvasSource,
    Mp4OutputFormat,
    Output,
    Quality,
    WebMOutputFormat,
    canEncodeVideo,
  } = await import("mediabunny");
  const { width, height } = fitAnimationDimensions(animation.output, 1920, true);
  const transparent = animation.frames[0].scene.options.transparent;
  const codec = format === "mp4" ? "avc" : "vp9";
  const alpha = format === "webm" && transparent ? "keep" : "discard";
  const supported = await canEncodeVideo(codec, { width, height, alpha, quality: new Quality("high") });
  if (!supported) {
    throw new Error(`${format.toUpperCase()} export is not supported by this browser.`);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const target = new BufferTarget();
  const output = new Output({
    format: format === "mp4" ? new Mp4OutputFormat() : new WebMOutputFormat(),
    target,
  });
  const source = new CanvasSource(canvas, {
    codec,
    alpha,
    quality: new Quality("high"),
    keyFrameInterval: animation.duration,
    latencyMode: "quality",
  });
  output.addVideoTrack(source);
  await output.start();
  for (let index = 0; index < animation.frames.length; index += 1) {
    const frame = animation.frames[index];
    const opaqueBackground = format === "mp4" && transparent
      ? frame.scene.options.background
      : undefined;
    await drawSvg(canvas, frame.svg, opaqueBackground);
    await source.add(index / animation.frameRate, 1 / animation.frameRate, { keyFrame: index === 0 });
    onProgress?.({ completed: index + 1, total: animation.frames.length, stage: "encoding" });
  }
  await output.finalize();
  if (!target.buffer) throw new Error(`${format.toUpperCase()} encoding did not produce a file.`);
  return new Blob([target.buffer], { type: format === "mp4" ? "video/mp4" : "video/webm" });
}

export async function exportAnimationBlob(
  animation: WordmarkAnimation,
  format: AnimatedAssetFormat,
  onProgress?: (progress: AnimationExportProgress) => void,
) {
  if (!animation.frames[0]?.scene.pixels.length) throw new Error("Type some text before exporting.");
  if (format === "gif") return exportGif(animation, onProgress);
  return exportVideo(animation, format, onProgress);
}
