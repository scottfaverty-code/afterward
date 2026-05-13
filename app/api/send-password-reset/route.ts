import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_ADDRESS, REPLY_TO, passwordResetEmail, fetchEmailOverride, interpolateEmailVars } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email: string };

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";

  // Generate a recovery link via Supabase admin (no email sent by Supabase)
  const admin = createAdminClient();
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${siteUrl}/setup-account` },
  });

  if (linkErr) {
    // Log the real error for Vercel logs, but don't expose it to the client
    // (avoids leaking whether an email address is registered)
    console.error("[send-password-reset] generateLink failed for", email, "—", linkErr.message);
    return NextResponse.json({ ok: true });
  }

  if (!linkData?.properties?.action_link) {
    console.error("[send-password-reset] generateLink returned no action_link for", email);
    return NextResponse.json({ ok: true });
  }

  const resetLink = linkData.properties.action_link;

  try {
    const override = await fetchEmailOverride("password-reset");
    const vars = { resetLink };
    const { subject, html } = override
      ? { subject: interpolateEmailVars(override.subject, vars), html: interpolateEmailVars(override.html, vars) }
      : passwordResetEmail(resetLink);

    const resend = getResend();
    const { data: sendData, error: sendError } = await resend.emails.send({
      from: FROM_ADDRESS,
      replyTo: REPLY_TO,
      to: email,
      subject,
      html,
    });

    if (sendError) {
      console.error("[send-password-reset] Resend error for", email, "—", sendError);
    } else {
      console.log("[send-password-reset] Email sent to", email, "— Resend id:", sendData?.id ?? "unknown");
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-password-reset] Unexpected error for", email, "—", err);
    return NextResponse.json({ ok: true });
  }
}
