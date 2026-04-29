/**
 * Client-side QR code download utilities.
 * Must only be imported from client components ("use client").
 *
 * generateStyledSVG  — uses qr-code-styling for the fully branded Afterword
 *                      QR (rounded dots, blue gradient, AFTERWORD wordmark).
 * downloadText       — triggers a browser download for any text blob.
 */

export async function generateStyledSVG(url: string): Promise<string> {
  const QRCodeStyling = (await import("qr-code-styling")).default;

  // QR slightly smaller than full canvas so the wordmark sits within a
  // ~2"×2" square (344px QR + 36px wordmark zone = 380px total).
  const qrSize = 344;
  const wordmarkZone = 36;
  const totalH = qrSize + wordmarkZone;

  const qr = new QRCodeStyling({
    width: qrSize,
    height: qrSize,
    type: "svg",
    data: url,
    margin: 10,
    qrOptions: { errorCorrectionLevel: "M" },
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
    cornersSquareOptions: { type: "extra-rounded", color: "#1B4F6B" },
    cornersDotOptions: { type: "dot", color: "#2E7DA3" },
    backgroundOptions: { color: "#ffffff" },
  });

  const blob = await qr.getRawData("svg");
  if (!blob) throw new Error("qr-code-styling returned no data");
  const svgText = await (blob as Blob).text();

  // Expand height and viewBox so the wordmark isn't clipped, then inject it.
  return svgText
    .replace(/height="[\d.]+"/,             `height="${totalH}"`)
    .replace(/viewBox="0 0 [\d.]+ [\d.]+"/,  `viewBox="0 0 ${qrSize} ${totalH}"`)
    .replace(
      "</svg>",
      `<text ` +
        `x="${qrSize / 2}" ` +
        `y="${qrSize + 24}" ` +
        `font-family="Georgia, 'Times New Roman', serif" ` +
        `font-size="11" ` +
        `letter-spacing="8" ` +
        `text-anchor="middle" ` +
        `fill="#1B4F6B"` +
      `>AFTERWORD</text>\n</svg>`,
    );
}

export function downloadText(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(objectUrl);
}
