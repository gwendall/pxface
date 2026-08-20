import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const legacyFontRedirects = [
      ["/fonts/PXWORD-3x5.ttf", "/fonts/PXFACE-3x5.ttf"],
      ["/fonts/PXWORD-3x5.otf", "/fonts/PXFACE-3x5.otf"],
      ["/fonts/PXWORD-3x5.woff", "/fonts/PXFACE-3x5.woff"],
      ["/fonts/PXWORD-3x5.woff2", "/fonts/PXFACE-3x5.woff2"],
      ["/fonts/pxword-3x5.css", "/fonts/pxface-3x5.css"],
      ["/fonts/v1.0.0/PXWORD3x5-Regular.ttf", "/fonts/v2.0.0/PXFACE3x5-Regular.ttf"],
      ["/fonts/v1.0.0/PXWORD3x5-Regular.otf", "/fonts/v2.0.0/PXFACE3x5-Regular.otf"],
      ["/fonts/v1.0.0/PXWORD3x5-Regular.woff", "/fonts/v2.0.0/PXFACE3x5-Regular.woff"],
      ["/fonts/v1.0.0/PXWORD3x5-Regular.woff2", "/fonts/v2.0.0/PXFACE3x5-Regular.woff2"],
      ["/fonts/PXWORD3x5-TTF-v1.0.0.zip", "/fonts/PXFACE3x5-TTF-v2.0.0.zip"],
      ["/fonts/PXWORD3x5-OTF-v1.0.0.zip", "/fonts/PXFACE3x5-OTF-v2.0.0.zip"],
      ["/fonts/PXWORD3x5-Web-v1.0.0.zip", "/fonts/PXFACE3x5-Web-v2.0.0.zip"],
      ["/fonts/PXWORD3x5-v1.0.0.zip", "/fonts/PXFACE3x5-v2.0.0.zip"],
    ] as const;

    return [
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.pxface.com" }],
        destination: "https://pxface.com/:path*",
        permanent: true,
      },
      ...["pxword.com", "www.pxword.com"].map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://pxface.com/:path*",
        permanent: true,
      })),
      ...legacyFontRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
  async headers() {
    const immutableFontHeaders = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    return [
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/fonts/v2.0.0/:path*",
        headers: immutableFontHeaders,
      },
      ...[
        "PXFACE3x5-TTF-v2.0.0.zip",
        "PXFACE3x5-OTF-v2.0.0.zip",
        "PXFACE3x5-Web-v2.0.0.zip",
        "PXFACE3x5-v2.0.0.zip",
      ].map((file) => ({ source: `/fonts/${file}`, headers: immutableFontHeaders })),
    ];
  },
};

export default nextConfig;
