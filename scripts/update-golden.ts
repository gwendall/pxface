import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { renderWordmark } from "pxface";

async function main() {
  const output = join(process.cwd(), "test/fixtures/golden");
  const render = renderWordmark({
    text: "PX",
    foreground: "#F1F0E9",
    background: "#181816",
    depthColor: "#FF4E1A",
    colorMode: "random",
    seed: 42,
    depth: 1,
    pixelGap: 0.08,
    padding: 25,
    ratio: "square",
    scale: 16,
  });

  await mkdir(output, { recursive: true });
  await writeFile(join(output, "px-seed-42.svg"), render.svg);
  await writeFile(join(output, "px-seed-42.png"), await sharp(Buffer.from(render.svg)).png({ compressionLevel: 9 }).toBuffer());
  console.log(`Updated golden fixtures at ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
