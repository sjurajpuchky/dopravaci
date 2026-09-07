import { ImageResponse } from "next/og";

export const alt = "Dopravaci.cz – stěhování a doprava v Praze";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          color: "#fff8ed",
          background: "linear-gradient(135deg, #6b4f3a 0%, #3f2d22 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 6, textTransform: "uppercase", color: "#f1b49f" }}>
          Stěhování · doprava · rozvoz nábytku
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 86, fontWeight: 800, lineHeight: 1.05 }}>
          Dopravíme vše, co je pro ostatní těžké.
        </div>
        <div style={{ display: "flex", marginTop: 42, fontSize: 40, fontWeight: 700 }}>
          DOPRAVACI<span style={{ color: "#e57650" }}>.CZ</span>
        </div>
      </div>
    ),
    size
  );
}
