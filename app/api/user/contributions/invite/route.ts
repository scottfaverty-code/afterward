import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function makeToken(): string {
  // 12 chars, unambiguous charset (no 0/O, 1/l/I)
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let t = "";
  for (let i = 0; i < 12; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

/** POST /api/user/contributions/invite
 *  Body: { label?: string }
 *  Returns: { token, invite_url }
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const label: string | null = typeof body.label === "string" ? body.label.trim() || null : null;

  // Unique token — retry up to 5 times on collision
  let token = "";
  for (let i = 0; i < 5; i++) {
    const candidate = makeToken();
    const { data: existing } = await supabase
      .from("contribution_invites")
      .select("id")
      .eq("token", candidate)
      .maybeSingle();
    if (!existing) { token = candidate; break; }
  }
  if (!token) return NextResponse.json({ error: "Could not generate a unique token" }, { status: 500 });

  const { data, error } = await supabase
    .from("contribution_invites")
    .insert({ user_id: user.id, token, label })
    .select("id, token, label, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
  return NextResponse.json({ invite: data, invite_url: `${appUrl}/contribute/${token}` });
}

/** GET /api/user/contributions/invite
 *  Returns owner's invites + pending contribution counts
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: invites, error } = await supabase
    .from("contribution_invites")
    .select("id, token, label, used_at, created_at, expires_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch contributions for this user's memorial
  const { data: profile } = await supabase
    .from("profiles")
    .select("memorial_slug")
    .eq("id", user.id)
    .single();

  const { data: contribs } = profile?.memorial_slug
    ? await supabase
        .from("contributions")
        .select("id, invite_id, contributor_name, contributor_relationship, memory_text, status, created_at")
        .eq("memorial_slug", profile.memorial_slug)
        .order("created_at", { ascending: false })
    : { data: [] };

  return NextResponse.json({ invites: invites ?? [], contributions: contribs ?? [] });
}
