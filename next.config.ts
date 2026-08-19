import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        source: "/fonts/v1.0.0/:path*",
        headers: immutableFontHeaders,
      },
      ...[
        "PXWORD3x5-TTF-v1.0.0.zip",
        "PXWORD3x5-OTF-v1.0.0.zip",
        "PXWORD3x5-Web-v1.0.0.zip",
        "PXWORD3x5-v1.0.0.zip",
      ].map((file) => ({ source: `/fonts/${file}`, headers: immutableFontHeaders })),
    ];
  },
};

export default nextConfig;
