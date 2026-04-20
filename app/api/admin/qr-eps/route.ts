import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import QRCode from "qrcode";

/**
 * Builds a clean EPS file from a QR matrix.
 * Each module is rendered as a filled PostScript rectangle.
 * The output is print/engrave-ready at any scale.
 */
function buildEPS(url: string, modules: boolean[][], label: string): string {
  const count = modules.length; // e.g. 33 for a typical QR
  const quietZone = 4; // modules of white border
  const totalModules = count + quietZone * 2;

  // Work in points. 72pt = 1 inch. We target ~2 inches square (144pt).
  const ptPerModule = 144 / totalModules;
  const size = Math.round(totalModules * ptPerModule);

  const lines: string[] = [];

  lines.push(`%!PS-Adobe-3.0 EPSF-3.0`);
  lines.push(`%%BoundingBox: 0 0 ${size} ${size}`);
  lines.push(`%%Title: Afterword QR Code – ${label}`);
  lines.push(`%%Creator: Afterword (myafterword.co)`);
  lines.push(`%%CreationDate: ${new Date().toISOString().split("T")[0]}`);
  lines.push(`%%EndComments`);
  lines.push(``);
  lines.push(`% URL encoded in this QR: ${url}`);
  lines.push(`% Label: ${label}`);
  lines.push(``);
  lines.push(`% White background`);
  lines.push(`1 setgray`);
  lines.push(`0 0 ${size} ${size} rectfill`);
  lines.push(``);
  lines.push(`% QR modules (black)`);
  lines.push(`0 setgray`);
  lines.push(``);

  const mp = ptPerModule;

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (modules[row][col]) {
        // EPS coordinate origin is bottom-left; QR matrix origin is top-left
        const x = (col + quietZone) * mp;
        const y = (count - 1 - row + quietZone) * mp;
        lines.push(`${x.toFixed(3)} ${y.toFixed(3)} ${mp.toFixed(3)} ${mp.toFixed(3)} rectfill`);
      }
    }
  }

  lines.push(``);
  lines.push(`%%EOF`);

  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const name = searchParams.get("name") ?? slug ?? "memorial";

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
  const url = `${appUrl}/memorial/${slug}`;

  // Generate QR matrix
  const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
  const size = qr.modules.size;
  const data = qr.modules.data as Uint8Array;

  // Build 2D boolean matrix
  const modules: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    modules[r] = [];
    for (let c = 0; c < size; c++) {
      modules[r][c] = data[r * size + c] === 1;
    }
  }

  const eps = buildEPS(url, modules, name);
  const filename = `afterword-qr-${slug}.eps`;

  return new NextResponse(eps, {
    status: 200,
    headers: {
      "Content-Type": "application/postscript",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
