import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_ADDRESS, REPLY_TO, purchaseConfirmationEmail } from "@/lib/email";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  let customerEmail = "";
  // Magic link that logs the user in and lands them at the shipping address page.
  // Using the auth callback means a real session cookie is set before they fill
  // in the form — so the shipping address API can verify identity via session,
  // not just via a guessable session_id in the URL.
  let shippingLink = `/shipping-address?session_id=${session_id}`; // fallback for dev

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      redirect("/");
    }

    customerEmail = session.customer_details?.email ?? session.customer_email ?? "";

    // Create or retrieve user, insert purchase record
    const admin = createAdminClient();
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === customerEmail);

    let userId = existingUser?.id;

    if (!existingUser) {
      const { data: newUser } = await admin.auth.admin.createUser({
        email: customerEmail,
        // Payment through Stripe verifies the email address — no confirmation
        // email needed. Skip it and give the user a direct access link instead.
        email_confirm: true,
      });
      userId = newUser?.user?.id;
    }

    // Insert purchase if not already recorded
    if (userId) {
      const { data: existingPurchase } = await admin
        .from("purchases")
        .select("id")
        .eq("stripe_session_id", session_id)
        .single();

      if (!existingPurchase) {
        await admin.from("purchases").insert({
          user_id: userId,
          email: customerEmail,
          stripe_session_id: session_id,
          amount_paid: session.amount_total ?? 19999,
          plaque_status: "pending",
        });

        // Generate a unique memorial slug from email prefix + random suffix.
        // Retry up to 5 times on the rare chance of a collision.
        const emailPrefix = customerEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
        let memorialSlug = "";
        for (let attempt = 0; attempt < 5; attempt++) {
          const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 chars = 2.2B combinations
          const candidate = `${emailPrefix}-${randomSuffix}`;
          const { error: slugError } = await admin
            .from("profiles")
            .upsert({ id: userId, memorial_slug: candidate }, { onConflict: "id", ignoreDuplicates: true });
          if (!slugError) {
            memorialSlug = candidate;
            break;
          }
        }

        // Send purchase confirmation email via Resend
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
        } catch {
          // Non-fatal — purchase is recorded, email failure shouldn't block the flow
        }
      }

      // Generate a magic link so the CTA button logs the user in as it navigates
      // to the shipping address page. Done outside the !existingPurchase block so
      // it still works on repeat visits (e.g. customer refreshes the welcome page).
      // Encode the next path so the ? in ?session_id= doesn't break query parsing.
      const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
      const nextPath = encodeURIComponent(`/shipping-address?session_id=${session_id}`);
      try {
        const { data: linkData } = await admin.auth.admin.generateLink({
          type: "magiclink",
          email: customerEmail,
          options: { redirectTo: `${siteUrl}/auth/callback?next=${nextPath}` },
        });
        if (linkData?.properties?.action_link) {
          shippingLink = linkData.properties.action_link;
        }
      } catch {
        // Non-fatal — falls back to direct link (unauthenticated)
      }
    }
  } catch {
    // If Stripe env not configured, show page with placeholder email for dev
    customerEmail = customerEmail || "your email";
  }

  return (
    <div className="min-h-screen flex items-start justify-center" style={{ backgroundColor: "#EEF7FC", paddingTop: "96px", paddingBottom: "96px" }}>
      <div
        className="w-full rounded-2xl p-10"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", maxWidth: "560px", margin: "0 24px" }}
      >
        {/* Checkmark */}
        <div className="flex justify-center mb-6">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 72, height: 72, backgroundColor: "#EEF7FC" }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <circle cx="18" cy="18" r="18" fill="#1B4F6B" />
              <path d="M10 18l6 6 10-12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="font-serif text-center mb-3"
          style={{ fontSize: "2rem", color: "#1B4F6B" }}
        >
          You&apos;re in. Your story starts now.
        </h1>

        <p className="text-center mb-7" style={{ fontSize: "1.05rem", color: "#666", lineHeight: "1.7" }}>
          Your Afterword page has been created for{" "}
          <strong style={{ color: "#1A1A1A" }}>{customerEmail}</strong>.
          {" "}First, tell us where to send your plaque. Then you&apos;ll set up your password and start writing.
        </p>

        {/* Confirmation items */}
        <div className="flex flex-col gap-3 mb-7">
          {[
            "Your memorial page is reserved and ready to fill in",
            "Your QR plaque order has been received, ships within 10 business days",
            "Permanent hosting is active from today, no renewals ever",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                style={{ width: 22, height: 22, backgroundColor: "#EEF7FC", color: "#1B4F6B", fontSize: "0.6rem", fontWeight: 700 }}
              >
                ✓
              </div>
              <span style={{ fontSize: "0.9rem", color: "#333" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Gold info box */}
        <div
          className="rounded-lg p-4 mb-7"
          style={{ backgroundColor: "#FDF3DC", border: "1px solid #C9932A" }}
        >
          <p style={{ fontSize: "0.875rem", color: "#1A1A1A", lineHeight: "1.7" }}>
            <strong>What happens next:</strong> Tell us where to send your plaque (takes 60 seconds), then you&apos;ll set your password and start writing. Guided prompts walk you through your story, most people finish their first pass in a single afternoon.
          </p>
        </div>

        {/* CTA — href is a Supabase magic link that sets a session cookie before
             landing at /shipping-address. Falls back to a direct link in dev. */}
        <a
          href={shippingLink}
          className="btn-primary-lg block text-center w-full mb-3"
        >
          Next: where should we send your plaque? &rarr;
        </a>

        <p className="text-center" style={{ fontSize: "0.8rem", color: "#999" }}>
          Takes 60 seconds, then you&apos;ll set up your account.
        </p>

        {/* Founder note */}
        <div
          className="rounded-xl p-5 mt-7"
          style={{ backgroundColor: "#FDF3DC" }}
        >
          <p style={{ fontSize: "0.875rem", color: "#7A5C1E", lineHeight: "1.7" }}>
            <strong>A note from Scott:</strong> &ldquo;Thank you for being an early Afterword customer. Every person who signs up in this beta period is helping us build something that genuinely matters. If you have any questions at any point, email me directly at{" "}
            <a href="mailto:scott@myafterword.co" style={{ color: "#C9932A", fontWeight: 600 }}>scott@myafterword.co</a>
            {" "}and I read everything.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
