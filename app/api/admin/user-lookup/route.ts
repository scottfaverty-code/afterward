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

  const userInfo = {
    found: true,
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
    lastSignIn: user.last_sign_in_at ?? null,
    emailConfirmed: !!user.email_confirmed_at,
    emailConfirmedAt: user.email_confirmed_at ?? null,
    hasPassword: user.identities?.some((i) => i.provider === "email") ?? false,
    purchase: purchase ?? null,
    profile: profile ?? null,
  };

  if (action === "magic_link") {
    // Generate a magic link so the user can log in immediately
    // (bypasses email confirmation requirement)
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: user.email!,
      options: {
        redirectTo: `${siteUrl}/dashboard`,
      },
    });

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
