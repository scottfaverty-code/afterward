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
  //   profiles           → deleted
  //   story_answers      → deleted
  //   shipping_addresses → deleted
  //   purchases.user_id  → set null (financial record preserved)
  //
  // If the auth user no longer exists (e.g. already deleted, or a seed/demo
  // record with no real auth counterpart), skip auth deletion and still clean
  // up all DB rows so the orders table stays tidy.
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    if (error.message?.toLowerCase().includes("user not found")) {
      // Auth user already gone — manually clean up DB rows that won't cascade
      console.warn("[delete-user] Auth user not found, cleaning up DB rows for:", userId);
      await Promise.all([
        admin.from("profiles").delete().eq("id", userId),
        admin.from("story_answers").delete().eq("user_id", userId),
        admin.from("shipping_addresses").delete().eq("user_id", userId),
        admin.from("purchases").update({ user_id: null }).eq("user_id", userId),
      ]);
      if (profile?.memorial_slug) {
        await admin.from("guestbook_entries").delete().eq("memorial_slug", profile.memorial_slug);
      }
    } else {
      console.error("[delete-user] Delete failed for", userId, "—", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
