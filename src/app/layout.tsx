import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pxword.com"),
  title: "PXWORD - 3×5 Pixel Wordmark Studio",
  description:
    "Design compact 3×5 pixel wordmarks, tune every detail, and export crisp SVG or PNG files.",
  applicationName: "PXWORD",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PXWORD - 3×5 Pixel Wordmark Studio",
    description:
      "Design compact 3×5 pixel wordmarks and export crisp SVG or PNG files.",
    url: "/",
    siteName: "PXWORD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PXWORD - 3×5 Pixel Wordmark Studio",
    description:
      "Design compact 3×5 pixel wordmarks and export crisp SVG or PNG files.",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#191917" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
