import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin-auth";

function uid6(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // no ambiguous chars (0/O, 1/l/I)
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/** GET /api/admin/qr-campaigns — list all campaigns with click counts */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const [{ data: campaigns }, { data: visits }] = await Promise.all([
    admin.from("qr_campaigns").select("id, memorial_slug, campaign_name, code, created_at").order("created_at", { ascending: false }),
    admin.from("qr_visits").select("campaign_code"),
  ]);

  // Aggregate visit counts client-side
  const counts: Record<string, number> = {};
  for (const v of visits ?? []) {
    counts[v.campaign_code] = (counts[v.campaign_code] ?? 0) + 1;
  }

  const result = (campaigns ?? []).map((c) => ({
    ...c,
    click_count: counts[c.code] ?? 0,
  }));

  return NextResponse.json({ campaigns: result });
}

/** POST /api/admin/qr-campaigns — create a new campaign */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { memorial_slug, campaign_name } = await req.json();

  if (!memorial_slug || typeof memorial_slug !== "string") {
    return NextResponse.json({ error: "memorial_slug is required" }, { status: 400 });
  }
  if (!campaign_name || typeof campaign_name !== "string") {
    return NextResponse.json({ error: "campaign_name is required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify the slug exists
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("memorial_slug", memorial_slug)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Memorial not found for that slug" }, { status: 404 });
  }

  // Generate a unique 6-char code (retry up to 5 times on collision)
  let code = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = uid6();
    const { data: existing } = await admin
      .from("qr_campaigns")
      .select("code")
      .eq("code", candidate)
      .maybeSingle();
    if (!existing) {
      code = candidate;
      break;
    }
  }
  if (!code) {
    return NextResponse.json({ error: "Could not generate a unique code. Try again." }, { status: 500 });
  }

  const { data, error } = await admin
    .from("qr_campaigns")
    .insert({ memorial_slug, campaign_name: campaign_name.trim(), code })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ campaign: { ...data, click_count: 0 } });
}
