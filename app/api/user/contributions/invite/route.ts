import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_ADDRESS, contributorInviteEmail } from "@/lib/email";

function makeToken(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let t = "";
  for (let i = 0; i < 12; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

/** POST /api/user/contributions/invite
 *  Body: { email: string, label?: string }
 *  Creates a contribution invite, sends an email to the recipient, and returns the invite.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const email: string | null = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
  const label: string | null = typeof body.label === "string" ? body.label.trim() || null : null;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  // Get the author's profile for personalisation
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const authorFirstName = profile?.first_name ?? "Someone";
  const authorFullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || authorFirstName;

  // Generate a unique token
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
  if (!token) return NextResponse.json({ error: "Could not generate a unique token." }, { status: 500 });

  // Insert the invite with email stored
  const { data, error } = await supabase
    .from("contribution_invites")
    .insert({ user_id: user.id, token, label, email })
    .select("id, token, label, email, used_at, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send the invite email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
  const inviteUrl = `${appUrl}/contribute/${token}`;

  try {
    const resend = getResend();
    const { subject, html } = contributorInviteEmail(inviteUrl, authorFirstName, authorFullName, email);
    await resend.emails.send({
      from: FROM_ADDRESS,
      replyTo: user.email ?? undefined,
      to: email,
      subject,
      html,
    });
  } catch (emailErr) {
    console.error("[invite] Failed to send contributor invite email:", emailErr);
    // Don't fail the request — the invite record exists, we can resend manually
  }

  return NextResponse.json({ invite: data, invite_url: inviteUrl });
}

/** GET /api/user/contributions/invite
 *  Returns the author's invites (with email) + their contributions for approval.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: invites, error } = await supabase
    .from("contribution_invites")
    .select("id, token, label, email, used_at, created_at, expires_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

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
