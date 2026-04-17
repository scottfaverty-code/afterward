"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

interface AfterwordQRProps {
  url: string;
  size?: number;
  downloadable?: boolean;
}

export default function AfterwordQR({ url, size = 240, downloadable = false }: AfterwordQRProps) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: url,
      margin: 12,
      qrOptions: {
        errorCorrectionLevel: "M",
      },
      dotsOptions: {
        type: "extra-rounded",
        gradient: {
          type: "radial",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "#2E7DA3" },
            { offset: 1, color: "#0f2d3d" },
          ],
        },
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#1B4F6B",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#2E7DA3",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: 0.28,
      },
    });

    qrRef.current = qr;

    if (ref.current) {
      ref.current.innerHTML = "";
      qr.append(ref.current);
    }
  }, [url, size]);

  function handleDownload() {
    qrRef.current?.download({ name: "afterword-qr", extension: "png" });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Outer frame */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div ref={ref} />
        {/* Afterword wordmark below the QR */}
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#1B4F6B",
            paddingBottom: "4px",
          }}
        >
          Afterword
        </div>
      </div>

      {downloadable && (
        <button
          onClick={handleDownload}
          style={{
            fontSize: "0.8rem",
            color: "#1B4F6B",
            background: "none",
            border: "1px solid #D6EAF4",
            borderRadius: "6px",
            padding: "6px 16px",
            cursor: "pointer",
          }}
        >
          Download QR code
        </button>
      )}
    </div>
  );
}
