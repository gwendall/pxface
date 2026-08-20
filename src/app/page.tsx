import type { Metadata } from "next";
import PixelStudio from "./components/pixel-studio";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "PXFACE - 3×5 Pixel Type Studio",
  description:
    "Design 3×5 pixel wordmarks, tune every detail, and export editable SVG, PNG, or the installable font.",
  path: "/",
  keywords: [
    "pixel type studio",
    "3×5 pixel font",
    "pixel wordmark generator",
    "editable SVG",
    "pixel art typography",
  ],
  absoluteTitle: true,
});

export default function Home() {
  return <PixelStudio />;
}
