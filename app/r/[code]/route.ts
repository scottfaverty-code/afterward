import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Tracking redirect route.
 *
 * When someone scans a campaign QR code they land here:
 *   GET /r/abc123
 *
 * This route:
 *  1. Looks up the campaign code in qr_campaigns.
 *  2. Inserts a row in qr_visits (fire-and-forget — never blocks the redirect).
 *  3. Returns a 307 redirect to the memorial page.
 *
 * If the code is unknown it redirects to the home page.
 * No auth required — this is a public endpoint hit by QR scanners.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
  const admin = createAdminClient();

  // Look up campaign
  const { data: campaign } = await admin
    .from("qr_campaigns")
    .select("memorial_slug")
    .eq("code", code)
    .maybeSingle();

  if (!campaign) {
    return NextResponse.redirect(appUrl, { status: 307 });
  }

  // Log the visit — non-blocking, errors are swallowed
  admin
    .from("qr_visits")
    .insert({ campaign_code: code })
    .then(() => {})
    .catch(() => {});

  const destination = `${appUrl}/memorial/${campaign.memorial_slug}`;
  return NextResponse.redirect(destination, { status: 307 });
}
