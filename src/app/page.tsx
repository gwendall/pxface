import type { Metadata } from "next";
import PixelStudio from "./components/pixel-studio";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "PXFACE - 3×5 Pixel Type Studio",
  description:
    "Hack a 3×5 type system pixel by pixel, apply grid-native effects, and export editable SVG or PNG.",
  path: "/",
  keywords: [
    "pixel type studio",
    "3×5 pixel font",
    "pixel wordmark generator",
    "editable SVG",
    "pixel art typography",
    "editable pixel effects",
    "SVG pixel editor",
  ],
  absoluteTitle: true,
});

export default function Home() {
  return <PixelStudio />;
}
