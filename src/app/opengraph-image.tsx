import { ImageResponse } from "next/og";
import { buildPixelLayout } from "@/lib/pixel-font";

export const alt = "PXFACE 3×5 pixel type studio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const wordmark = buildPixelLayout("PXFACE", 1, 2, "left");

export default function OpenGraphImage() {
  const unit = 34;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#191917",
          color: "#F1F0E9",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            position: "relative",
            width: wordmark.width * unit,
            height: wordmark.height * unit,
            display: "flex",
          }}
        >
          {wordmark.pixels.map((pixel, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: pixel.x * unit,
                top: pixel.y * unit,
                width: unit - 3,
                height: unit - 3,
                background: "#FF4E1A",
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "flex-end",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.08em",
          }}
        >
          <span>3×5 PIXEL TYPE STUDIO</span>
          <span>PXFACE.COM</span>
        </div>
      </div>
    ),
    size,
  );
}
