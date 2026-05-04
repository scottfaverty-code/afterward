/**
 * Stripe webhook handler
 *
 * Safety-net for purchase recording. The welcome page already records purchases
 * when a customer lands there after Stripe redirects them, but if they close
 * their browser before the redirect completes this handler ensures:
 *   - The Supabase user is created
 *   - The purchase row is inserted
 *   - The memorial slug is generated
 *   - The confirmation email is sent
 *
 * Setup:
 *   1. In Stripe Dashboard → Webhooks, add endpoint:
 *      https://www.myafterword.co/api/webhooks/stripe
 *   2. Subscribe to: checkout.session.completed, charge.dispute.created
 *   3. Copy the signing secret → add as STRIPE_WEBHOOK_SECRET in Vercel env vars
 */

import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_ADDRESS, REPLY_TO, purchaseConfirmationEmail } from "@/lib/email";

// Stripe SDK uses Node.js crypto for signature verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text(); // must be raw string for signature verification
  const sig = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig ?? "", webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[webhook] Signature verification failed:", message);
    // Return 400 so Stripe knows the request was rejected (not a transient error)
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  // ------------------------------------------------------------------
  // Route events
  // ------------------------------------------------------------------
  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
    } else if (event.type === "charge.dispute.created") {
      await handleDisputeCreated(event.data.object as Stripe.Dispute);
    }
    // Unhandled event types are silently acknowledged with 200
  } catch (err) {
    // Always return 200 so Stripe doesn't retry endlessly.
    // Log the error for investigation but don't fail the webhook.
    console.error(`[webhook] Handler error for ${event.type}:`, err);
  }

  return NextResponse.json({ received: true });
}

// ------------------------------------------------------------------
// checkout.session.completed
// ------------------------------------------------------------------
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    console.log("[webhook] Session not paid — skipping:", session.id);
    return;
  }

  const customerEmail =
    session.customer_details?.email ??
    (typeof session.customer_email === "string" ? session.customer_email : null);

  if (!customerEmail) {
    console.error("[webhook] No customer email on session:", session.id);
    return;
  }

  const admin = createAdminClient();

  // ---- Resolve or create user ----------------------------------------
  const { data: listData } = await admin.auth.admin.listUsers();
  const existingUser = listData?.users?.find((u) => u.email === customerEmail);

  let userId = existingUser?.id;

  if (!existingUser) {
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email: customerEmail,
      // Payment through Stripe verifies the email — skip confirmation email
      email_confirm: true,
    });
    if (createError) {
      console.error("[webhook] Failed to create user:", createError.message);
      throw createError;
    }
    userId = newUser?.user?.id;
  }

  if (!userId) {
    console.error("[webhook] Could not resolve userId for:", customerEmail);
    return;
  }

  // ---- Race-condition guard: skip if already recorded ----------------
  const { data: existingPurchase } = await admin
    .from("purchases")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existingPurchase) {
    console.log("[webhook] Purchase already recorded — no-op:", session.id);
    return;
  }

  // ---- Insert purchase -----------------------------------------------
  const { error: purchaseError } = await admin.from("purchases").insert({
    user_id: userId,
    email: customerEmail,
    stripe_session_id: session.id,
    amount_paid: session.amount_total ?? 19999,
    plaque_status: "pending",
  });

  if (purchaseError) {
    console.error("[webhook] Failed to insert purchase:", purchaseError.message);
    throw purchaseError;
  }

  // ---- Generate unique memorial slug ---------------------------------
  const emailPrefix =
    customerEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "user";

  for (let attempt = 0; attempt < 5; attempt++) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const candidate = `${emailPrefix}-${randomSuffix}`;
    const { error: slugError } = await admin
      .from("profiles")
      .upsert({ id: userId, memorial_slug: candidate }, { onConflict: "id", ignoreDuplicates: true });
    if (!slugError) {
      break;
    }
  }

  // ---- Send confirmation email ---------------------------------------
  try {
    const resend = getResend();
    const { subject, html } = purchaseConfirmationEmail(customerEmail);
    await resend.emails.send({
      from: FROM_ADDRESS,
      replyTo: REPLY_TO,
      to: customerEmail,
      subject,
      html,
    });
  } catch (emailErr) {
    // Non-fatal — purchase is recorded, email failure shouldn't surface as a
    // webhook error (which would trigger Stripe retries)
    console.error("[webhook] Confirmation email failed:", emailErr);
  }

  console.log("[webhook] Purchase recorded via webhook for:", customerEmail);
}

// ------------------------------------------------------------------
// charge.dispute.created — alert Scott immediately
// ------------------------------------------------------------------
async function handleDisputeCreated(dispute: Stripe.Dispute) {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: FROM_ADDRESS,
      replyTo: REPLY_TO,
      to: REPLY_TO,
      subject: `⚠️ Stripe dispute opened — $${(dispute.amount / 100).toFixed(2)}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#FEF3C7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <tr><td style="background:#B91C1C;padding:24px 32px;">
      <p style="margin:0;font-family:Georgia,serif;font-size:1.3rem;color:#fff;">Dispute Alert — Afterword</p>
    </td></tr>
    <tr><td style="padding:32px;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="padding:10px 0;border-bottom:1px solid #E5E5E5;">
          <p style="margin:0 0 2px;font-size:0.78rem;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Amount</p>
          <p style="margin:0;font-size:1rem;color:#1A1A1A;">$${(dispute.amount / 100).toFixed(2)} ${dispute.currency.toUpperCase()}</p>
        </td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #E5E5E5;">
          <p style="margin:0 0 2px;font-size:0.78rem;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Reason</p>
          <p style="margin:0;font-size:1rem;color:#1A1A1A;">${dispute.reason}</p>
        </td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #E5E5E5;">
          <p style="margin:0 0 2px;font-size:0.78rem;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Status</p>
          <p style="margin:0;font-size:1rem;color:#1A1A1A;">${dispute.status}</p>
        </td></tr>
        <tr><td style="padding:10px 0;">
          <p style="margin:0 0 2px;font-size:0.78rem;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Dispute ID</p>
          <p style="margin:0;font-size:0.9rem;color:#666;font-family:monospace;">${dispute.id}</p>
        </td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:0.875rem;color:#666;line-height:1.7;">
        Log in to your <a href="https://dashboard.stripe.com/disputes/${dispute.id}" style="color:#2E7DA3;">Stripe dashboard</a> to respond. Most disputes require a response within 7 days.
      </p>
    </td></tr>
  </table>
</body>
</html>`,
    });
  } catch (err) {
    console.error("[webhook] Dispute alert email failed:", err);
  }

  console.log("[webhook] Dispute alert sent for:", dispute.id);
}
