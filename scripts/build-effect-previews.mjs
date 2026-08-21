import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";
import { createWordmarkTimeline, renderWordmark, sceneToSvg } from "pxface";

const outputDirectory = join(process.cwd(), "public/effects");
const previews = [
  { asset: "clean", effect: "none", amount: 1 },
  { asset: "assemble", effect: "assemble", amount: 1.15 },
  { asset: "explode", effect: "explode", amount: 1.2 },
  { asset: "relay", effect: "relay", amount: 1.1 },
  { asset: "scan", effect: "scan", amount: 1.1 },
  { asset: "glitch", effect: "glitch", amount: 1.15 },
];

const common = {
  text: "HELLO",
  foreground: "#F1F0E9",
  background: "#181816",
  depthColor: "#FF4E1A",
  pixelGap: 0.08,
  padding: 12,
  scale: 16,
  seed: 0x50584641,
};

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
  });
}

async function rasterize(svg, destination) {
  await sharp(Buffer.from(svg))
    .resize({ width: 192, height: 96, fit: "contain", background: "#181816" })
    .png({ compressionLevel: 9, palette: true, colors: 32 })
    .toFile(destination);
}

await mkdir(outputDirectory, { recursive: true });
for (const preview of previews) {
  const input = { ...common, effect: preview.effect, effectAmount: preview.amount };
  const poster = renderWordmark({ ...input, animationProgress: 0.5 });
  await rasterize(poster.svg, join(outputDirectory, `${preview.asset}.png`));
  if (preview.effect === "none") continue;
  const temporary = await mkdtemp(join(tmpdir(), `pxface-${preview.asset}-`));
  try {
    const timeline = createWordmarkTimeline(input, { duration: 2, frameRate: 8 });
    for (let index = 0; index < timeline.frames.length; index += 1) {
      const destination = join(temporary, `frame-${String(index).padStart(3, "0")}.png`);
      await rasterize(sceneToSvg(timeline.frames[index].scene), destination);
    }
    await run("ffmpeg", [
      "-y",
      "-loglevel", "error",
      "-framerate", "8",
      "-i", join(temporary, "frame-%03d.png"),
      "-an",
      "-fflags", "+bitexact",
      "-c:v", "libvpx-vp9",
      "-flags:v", "+bitexact",
      "-crf", "42",
      "-b:v", "0",
      "-deadline", "good",
      "-cpu-used", "4",
      "-pix_fmt", "yuv420p",
      "-map_metadata", "-1",
      join(outputDirectory, `${preview.asset}.webm`),
    ]);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

await writeFile(
  join(outputDirectory, "README.md"),
  "# Effect preview assets\n\nGenerated from the canonical renderer with `npm run previews:build`. Posters are 192×96 PNG; hover clips are 192×96 VP9 WebM at 8 fps.\n",
);
console.log(`Generated ${previews.length} posters and ${previews.length - 1} hover clips in ${outputDirectory}`);
