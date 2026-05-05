import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAuth } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { user, role } = await getAdminAuth();
  if (!user || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const email: string | null = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
  const note: string | null = typeof body.note === "string" && body.note.trim() ? body.note.trim() : null;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const admin = createAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";

  // ---- Create or retrieve user ----------------------------------------
  const { data: existingUsers } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const existingUser = existingUsers?.users?.find((u) => u.email === email);

  let userId = existingUser?.id;

  if (!existingUser) {
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }
    userId = newUser?.user?.id;
  }

  if (!userId) {
    return NextResponse.json({ error: "Failed to resolve user ID." }, { status: 500 });
  }

  // ---- Check for existing beta purchase --------------------------------
  const { data: existingPurchase } = await admin
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existingPurchase) {
    // Insert a $0 beta purchase record
    const { error: purchaseError } = await admin.from("purchases").insert({
      user_id: userId,
      email,
      stripe_session_id: `beta-${userId}-${Date.now()}`,
      amount_paid: 0,
      plaque_status: "pending",
      is_beta: true,
    });

    if (purchaseError) {
      return NextResponse.json({ error: purchaseError.message }, { status: 500 });
    }

    // Generate memorial slug
    const emailPrefix = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
    for (let attempt = 0; attempt < 5; attempt++) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const candidate = `${emailPrefix}-${randomSuffix}`;
      const { error: slugError } = await admin
        .from("profiles")
        .upsert({ id: userId, memorial_slug: candidate }, { onConflict: "id", ignoreDuplicates: true });
      if (!slugError) break;
    }
  }

  // ---- Generate magic link for immediate login -------------------------
  // Link lands them straight at the dashboard (setup flow begins there)
  const nextPath = encodeURIComponent("/dashboard");
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${appUrl}/auth/callback?next=${nextPath}`,
    },
  });

  if (linkError || !linkData?.properties?.action_link) {
    return NextResponse.json({ error: "Failed to generate magic link." }, { status: 500 });
  }

  // Log the creation for audit trail
  console.log(`[admin] Beta account created by ${user.email} for ${email}${note ? ` — note: "${note}"` : ""}`);

  return NextResponse.json({
    email,
    magicLink: linkData.properties.action_link,
    isNewUser: !existingUser,
  });
}
