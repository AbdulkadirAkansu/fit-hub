import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const runtime = "edge";
export const alt = "FitHub - Kişisel Performans & Modern Fitness Merkezi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #0a0a0a, #111111)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            background: "#3b82f6",
            borderRadius: "32px",
            marginBottom: "40px",
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
          }}
        >
          <span style={{ fontSize: "72px", fontWeight: 900, color: "white" }}>F</span>
        </div>
        
        <h1
          style={{
            fontSize: "80px",
            fontWeight: 900,
            color: "white",
            marginBottom: "20px",
            letterSpacing: "-0.05em",
          }}
        >
          {SITE_NAME}
        </h1>
        
        <p
          style={{
            fontSize: "36px",
            color: "#a1a1aa",
            fontWeight: 500,
            maxWidth: "800px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {SITE_DESCRIPTION}
        </p>

        <div style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          gap: 20,
          color: '#3b82f6',
          fontSize: '24px',
          fontWeight: 'bold',
        }}>
          <span>Modern Spor Hekimliği</span>
          <span>•</span>
          <span>Biyometrik Analiz</span>
          <span>•</span>
          <span>Akıllı Asistan</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
