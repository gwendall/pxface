import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "./components/site-header";
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
  metadataBase: new URL("https://pxface.com"),
  title: {
    default: "PXFACE - 3×5 Pixel Type Studio",
    template: "%s | PXFACE",
  },
  description:
    "Design 3×5 pixel wordmarks, tune every detail, and export editable SVG, PNG, or the font.",
  applicationName: "PXFACE",
  authors: [{ name: "Gwendall Esnault", url: "https://gwendall.com" }],
  creator: "Gwendall Esnault",
  publisher: "PXFACE",
  category: "design",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PXFACE - 3×5 Pixel Type Studio",
    description:
      "Design 3×5 pixel wordmarks and export editable SVG, PNG, or the font.",
    url: "/",
    siteName: "PXFACE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PXFACE - 3×5 Pixel Type Studio",
    description:
      "Design 3×5 pixel wordmarks and export editable SVG, PNG, or the font.",
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
      <body>
        <div className="site-root">
          <SiteHeader />
          <div className="site-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
