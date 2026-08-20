import type { Metadata } from "next";

const siteName = "PXFACE";
export const SOCIAL_IMAGE_ALT =
  "PXFACE rendered in a minimal 3×5 pixel alphabet with full pixel control";

const openGraphImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: SOCIAL_IMAGE_ALT,
};
const twitterImage = {
  url: "/twitter-image",
  alt: SOCIAL_IMAGE_ALT,
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  keywords: string[];
  absoluteTitle?: boolean;
  alternateTypes?: Record<string, string>;
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle = false,
  alternateTypes,
}: PageMetadataOptions): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} | ${siteName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical: path,
      ...(alternateTypes ? { types: alternateTypes } : {}),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName,
      type: "website",
      images: [openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [twitterImage],
    },
  };
}
