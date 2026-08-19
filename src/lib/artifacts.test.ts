import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { renderWordmark } from "./wordmark-renderer";

const root = process.cwd();
const goldenOptions = {
  text: "PX",
  foreground: "#F1F0E9",
  background: "#181816",
  depthColor: "#FF4E1A",
  colorMode: "random" as const,
  seed: 42,
  depth: 1,
  pixelGap: 0.08,
  padding: 25,
  ratio: "square" as const,
  scale: 16,
};

describe("published artifacts", () => {
  it("matches the golden editable SVG", () => {
    const fixture = readFileSync(join(root, "test/fixtures/golden/px-seed-42.svg"), "utf8");
    expect(renderWordmark(goldenOptions).svg).toBe(fixture);
  });

  it("matches the golden PNG", async () => {
    const fixture = readFileSync(join(root, "test/fixtures/golden/px-seed-42.png"));
    const rendered = await sharp(Buffer.from(renderWordmark(goldenOptions).svg)).png({ compressionLevel: 9 }).toBuffer();
    expect(rendered.equals(fixture)).toBe(true);
  });

  it.each([
    ["PXWORD-3x5.ttf", [0x00, 0x01, 0x00, 0x00]],
    ["PXWORD-3x5.otf", [...Buffer.from("OTTO")]],
    ["PXWORD-3x5.woff", [...Buffer.from("wOFF")]],
    ["PXWORD-3x5.woff2", [...Buffer.from("wOF2")]],
    ["v1.0.0/PXWORD3x5-Regular.ttf", [0x00, 0x01, 0x00, 0x00]],
    ["v1.0.0/PXWORD3x5-Regular.otf", [...Buffer.from("OTTO")]],
    ["v1.0.0/PXWORD3x5-Regular.woff", [...Buffer.from("wOFF")]],
    ["v1.0.0/PXWORD3x5-Regular.woff2", [...Buffer.from("wOF2")]],
  ])("ships a valid %s container", (name, signature) => {
    const bytes = readFileSync(join(root, "public/fonts", name));
    expect([...bytes.subarray(0, 4)]).toEqual(signature);
    expect(bytes.length).toBeGreaterThan(1_000);
  });

  it.each([
    "PXWORD3x5-TTF-v1.0.0.zip",
    "PXWORD3x5-OTF-v1.0.0.zip",
    "PXWORD3x5-Web-v1.0.0.zip",
    "PXWORD3x5-v1.0.0.zip",
  ])("ships a valid %s package", (name) => {
    const bytes = readFileSync(join(root, "public/fonts", name));
    expect(bytes.subarray(0, 4).toString("binary")).toBe("PK\u0003\u0004");
    expect(bytes.length).toBeGreaterThan(1_000);
  });

  it("publishes versioned font URLs and checksums", () => {
    const manifest = JSON.parse(readFileSync(join(root, "public/fonts/manifest.json"), "utf8")) as {
      version: string;
      artifacts: Record<string, { url: string; sha256: string }>;
    };
    expect(manifest.version).toBe("1.0.0");
    expect(Object.keys(manifest.artifacts)).toHaveLength(8);
    for (const [name, artifact] of Object.entries(manifest.artifacts)) {
      expect(artifact.url).toBe(`/fonts/${name}`);
      expect(artifact.sha256).toMatch(/^[0-9a-f]{64}$/);
    }
  });
});
