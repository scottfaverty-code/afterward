import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** GET /api/contributions/validate?token=xxx
 *  Public — returns enough info to render the contribution form.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const supabase = await createClient();

  const { data: invite } = await supabase
    .from("contribution_invites")
    .select("id, user_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!invite) return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "This invite has expired" }, { status: 410 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url")
    .eq("id", invite.user_id)
    .single();

  return NextResponse.json({
    owner_first_name: profile?.first_name ?? null,
    owner_full_name: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || null,
    owner_avatar_url: profile?.avatar_url ?? null,
  });
}
