import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { getResend, FROM_ADDRESS, REPLY_TO, passwordSetupEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Require an authenticated session — the welcome page CTA passes the user
    // through /auth/callback (magic link) before they reach this form, so by
    // the time they submit, a real session cookie should be present.
    const supabase = await createClient();
    const { data: { user: sessionUser } } = await supabase.auth.getUser();

    if (!sessionUser?.email) {
      return NextResponse.json({ error: "Session expired. Please use your setup link again." }, { status: 401 });
    }

    const body = await req.json();
    const { session_id, delivery_type, recipient_name, contact_name, address_line_1, address_line_2, city, state_province, postal_code, country, attorney_note } = body;

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Verify the authenticated user's email matches the Stripe session.
    // This is the IDOR guard — only the actual purchaser can save an address.
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const customerEmail = session.customer_details?.email ?? session.customer_email ?? "";

    if (!customerEmail || sessionUser.email.toLowerCase() !== customerEmail.toLowerCase()) {
      console.error("Email mismatch: session user", sessionUser.email, "vs Stripe", customerEmail);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const admin = createAdminClient();

    // Save shipping address
    const { error: addressError } = await admin.from("shipping_addresses").upsert({
      user_id: sessionUser.id,
      delivery_type,
      recipient_name,
      contact_name: delivery_type === "estate_attorney" ? contact_name : null,
      address_line_1,
      address_line_2: address_line_2 || null,
      city,
      state_province,
      postal_code,
      country,
      attorney_note: delivery_type === "estate_attorney" && attorney_note ? attorney_note : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (addressError) {
      console.error("Address save error:", addressError);
      return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
    }

    // Send password setup email via Resend
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
    try {
      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: "recovery",
        email: customerEmail,
        options: { redirectTo: `${siteUrl}/setup-account` },
      });

      if (!linkErr && linkData?.properties?.action_link) {
        const resend = getResend();
        const { subject, html } = passwordSetupEmail(linkData.properties.action_link);
        await resend.emails.send({
          from: FROM_ADDRESS,
          replyTo: REPLY_TO,
          to: customerEmail,
          subject,
          html,
        });
      }
    } catch (emailErr) {
      // Non-fatal — address is saved, email failure logged but doesn't block
      console.error("Password setup email error:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Shipping address API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
