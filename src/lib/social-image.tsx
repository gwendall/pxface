import { ImageResponse } from "next/og";
import { buildPixelLayout } from "pxface";

const size = {
  width: 1200,
  height: 630,
};
const wordmark = buildPixelLayout("PXFACE", 1, 0, "left");

function PixelWordmark({ color, offset }: { color: string; offset: number }) {
  const unit = 46;

  return (
    <div
      style={{
        position: "absolute",
        left: 71 + offset,
        top: 180 + offset,
        width: wordmark.width * unit,
        height: wordmark.height * unit,
        display: "flex",
      }}
    >
      {wordmark.pixels.map((pixel, index) => (
        <div
          key={`${color}-${index}`}
          style={{
            position: "absolute",
            left: pixel.x * unit,
            top: pixel.y * unit,
            width: unit,
            height: unit,
            background: color,
          }}
        />
      ))}
    </div>
  );
}

export function SocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          background: "#191917",
          color: "#F1F0E9",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 28,
            display: "flex",
            border: "1px solid #4E4E49",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 72,
            top: 60,
            display: "flex",
            color: "#FF4E1A",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          3×5 PIXEL TYPE STUDIO
        </div>

        <div
          style={{
            position: "absolute",
            right: 72,
            bottom: 58,
            display: "flex",
            color: "#9B9B94",
            fontSize: 30,
            letterSpacing: "0.08em",
          }}
        >
          PXFACE.COM
        </div>

        <PixelWordmark color="#FF4E1A" offset={12} />
        <PixelWordmark color="#F1F0E9" offset={0} />

        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 54,
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            letterSpacing: "0.04em",
          }}
        >
          MINIMAL TYPE. FULL PIXEL CONTROL.
        </div>
      </div>
    ),
    size,
  );
}
