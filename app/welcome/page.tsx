import { redirect } from "next/navigation";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

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
        email_confirm: false,
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

        // Generate a unique memorial slug from email prefix + random suffix
        const emailPrefix = customerEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        const memorialSlug = `${emailPrefix}-${randomSuffix}`;

        // Create profile row with slug
        await admin
          .from("profiles")
          .upsert({ id: userId, memorial_slug: memorialSlug }, { onConflict: "id", ignoreDuplicates: true });
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
          Your Afterword page has been created. We&apos;ve sent a link to{" "}
          <strong style={{ color: "#1A1A1A" }}>{customerEmail}</strong>{" "}
          to set up your password and access your account.
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
            <strong>What happens next:</strong> Check your email for a link to set up your password. Once you&apos;re in, guided prompts will walk you through writing your story, most people finish their first pass in a single afternoon.
          </p>
        </div>

        {/* CTA */}
        <Link
          href={`/shipping-address?session_id=${session_id}`}
          className="btn-primary-lg block text-center w-full mb-3"
        >
          Next: where should we send your plaque? &rarr;
        </Link>

        <p className="text-center" style={{ fontSize: "0.8rem", color: "#999" }}>
          Takes 60 seconds. We&apos;ll confirm everything by email.
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
