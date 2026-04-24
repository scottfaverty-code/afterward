import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_ADDRESS, REPLY_TO, passwordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email: string };

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";

  try {
    // Generate a recovery link via Supabase admin (no email sent by Supabase)
    const admin = createAdminClient();
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${siteUrl}/setup-account` },
    });

    if (linkErr || !linkData?.properties?.action_link) {
      // If user doesn't exist in Supabase, still return 200 to avoid email enumeration
      return NextResponse.json({ ok: true });
    }

    const resetLink = linkData.properties.action_link;
    const { subject, html } = passwordResetEmail(resetLink);

    const resend = getResend();
    await resend.emails.send({
      from: FROM_ADDRESS,
      replyTo: REPLY_TO,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("send-password-reset error:", err);
    // Don't expose internal errors to the client
    return NextResponse.json({ ok: true });
  }
}
