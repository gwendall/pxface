import { describe, expect, it } from "vitest";
import { createPageMetadata } from "./site-metadata";

describe("createPageMetadata", () => {
  it("keeps canonical and social metadata aligned to the route", () => {
    const metadata = createPageMetadata({
      title: "Render API",
      description: "Generate pixel wordmarks.",
      path: "/docs/api",
      keywords: ["pixel API"],
    });

    expect(metadata.title).toBe("Render API");
    expect(metadata.alternates).toEqual({ canonical: "/docs/api" });
    expect(metadata.openGraph).toMatchObject({
      title: "Render API | PXFACE",
      url: "/docs/api",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Render API | PXFACE",
    });
  });

  it("supports an absolute homepage title", () => {
    const metadata = createPageMetadata({
      title: "PXFACE - 3×5 Pixel Type Studio",
      description: "Design pixel wordmarks.",
      path: "/",
      keywords: ["pixel type"],
      absoluteTitle: true,
    });

    expect(metadata.title).toEqual({
      absolute: "PXFACE - 3×5 Pixel Type Studio",
    });
    expect(metadata.openGraph).toMatchObject({
      title: "PXFACE - 3×5 Pixel Type Studio",
      url: "/",
    });
  });
});
