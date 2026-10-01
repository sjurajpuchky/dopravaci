import { ImageResponse } from "next/og";

export const alt = "Dopravaci.cz – nadrozměrná a velkotonážní přeprava";
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
          color: "#ffffff",
          background: "linear-gradient(135deg, #101820 0%, #273640 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: "#f5a623" }}>
          Nadrozměrná · velkotonážní · asistovaná přeprava
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 86, fontWeight: 800, lineHeight: 1.05 }}>
          Přeprava, která přesahuje běžné rozměry.
        </div>
        <div style={{ display: "flex", marginTop: 42, fontSize: 40, fontWeight: 700 }}>
          DOPRAVACI<span style={{ color: "#f5a623" }}>.CZ</span>
        </div>
      </div>
    ),
    size
  );
}
