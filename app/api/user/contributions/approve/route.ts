import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** PATCH /api/user/contributions/approve
 *  Body: { contribution_id: string, status: "approved" | "rejected" }
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { contribution_id, status } = await req.json();
  if (!contribution_id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Confirm the contribution belongs to this user's memorial
  const { data: profile } = await supabase
    .from("profiles")
    .select("memorial_slug")
    .eq("id", user.id)
    .single();

  if (!profile?.memorial_slug) {
    return NextResponse.json({ error: "No memorial found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("contributions")
    .update({ status })
    .eq("id", contribution_id)
    .eq("memorial_slug", profile.memorial_slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
