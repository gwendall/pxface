import type { Metadata } from "next";

const siteName = "PXFACE";
const socialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "PXFACE 3×5 pixel type studio",
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  keywords: string[];
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} | ${siteName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName,
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage.url],
    },
  };
}
