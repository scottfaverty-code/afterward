import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin-auth";

/** DELETE /api/admin/qr-campaigns/[id] — remove a campaign and its visits */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  // Fetch the code first so we can delete its visits
  const { data: campaign } = await admin
    .from("qr_campaigns")
    .select("code")
    .eq("id", id)
    .maybeSingle();

  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete visits first (no FK constraint required)
  await admin.from("qr_visits").delete().eq("campaign_code", campaign.code);

  // Delete the campaign
  const { error } = await admin.from("qr_campaigns").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
