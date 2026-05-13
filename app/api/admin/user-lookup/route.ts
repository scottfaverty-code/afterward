import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, action } = await req.json() as { email: string; action: "lookup" | "magic_link" };

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Find the user by email using listUsers with a filter
  const { data: listData, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) {
    return NextResponse.json({ error: listErr.message }, { status: 500 });
  }

  const user = listData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    return NextResponse.json({ found: false });
  }

  // Check if they have a purchase
  const { data: purchase } = await admin
    .from("purchases")
    .select("id, plaque_status, created_at, amount_paid")
    .eq("user_id", user.id)
    .maybeSingle();

  // Check if they have a profile
  const { data: profile } = await admin
    .from("profiles")
    .select("first_name, last_name, memorial_slug, page_is_public")
    .eq("id", user.id)
    .maybeSingle();

  // Check password status via auth.users.encrypted_password (identity-based check unreliable)
  const { data: pwRows } = await admin.rpc("admin_users_have_password", { user_ids: [user.id] });
  const hasPassword = ((pwRows ?? []) as { user_id: string; has_password: boolean }[])[0]?.has_password ?? false;

  const userInfo = {
    found: true,
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
    lastSignIn: user.last_sign_in_at ?? null,
    emailConfirmed: !!user.email_confirmed_at,
    emailConfirmedAt: user.email_confirmed_at ?? null,
    hasPassword,
    purchase: purchase ?? null,
    profile: profile ?? null,
  };

  if (action === "magic_link") {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";

    // New users: recovery link direct to /setup-account — Supabase sends hash
    // tokens (#access_token=...&type=recovery) which SetupAccountForm handles.
    // Existing users: magiclink through /auth/callback to /dashboard.
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink(
      hasPassword
        ? { type: "magiclink", email: user.email!, options: { redirectTo: `${siteUrl}/auth/callback?next=/dashboard` } }
        : { type: "recovery", email: user.email!, options: { redirectTo: `${siteUrl}/setup-account` } }
    );

    if (linkErr) {
      return NextResponse.json({ ...userInfo, magicLinkError: linkErr.message });
    }

    return NextResponse.json({
      ...userInfo,
      magicLink: linkData.properties?.action_link ?? null,
    });
  }

  return NextResponse.json(userInfo);
}
