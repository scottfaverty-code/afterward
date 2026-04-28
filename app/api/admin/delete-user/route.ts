import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAuth } from "@/lib/admin-auth";

export async function DELETE(req: NextRequest) {
  // Super-admin only — deletion is irreversible.
  const { user, role } = await getAdminAuth();
  if (!user || role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await req.json() as { userId?: string };
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Prevent super-admin from deleting their own account via the panel.
  if (userId === user.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Grab the memorial slug before we delete — guestbook_entries are tied to
  // the slug as plain text (no FK), so they won't cascade automatically.
  const { data: profile } = await admin
    .from("profiles")
    .select("memorial_slug")
    .eq("id", userId)
    .maybeSingle();

  // Clean up orphaned guestbook entries for this memorial page.
  if (profile?.memorial_slug) {
    await admin
      .from("guestbook_entries")
      .delete()
      .eq("memorial_slug", profile.memorial_slug);
  }

  // Delete the auth user. Cascades:
  //   profiles         → deleted
  //   story_answers    → deleted
  //   shipping_addresses → deleted
  //   purchases.user_id → set null (financial record preserved)
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
