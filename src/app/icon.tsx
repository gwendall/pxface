import { ImageResponse } from "next/og";
import { buildPixelLayout } from "pxface";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

const mark = buildPixelLayout("PX", 0, 0, "left");

export default function Icon() {
  const unit = 8;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#191917",
        }}
      >
        <div
          style={{
            position: "relative",
            width: mark.width * unit,
            height: mark.height * unit,
            display: "flex",
          }}
        >
          {mark.pixels.map((pixel, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: pixel.x * unit,
                top: pixel.y * unit,
                width: unit,
                height: unit,
                background: "#FF4E1A",
              }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
