import { redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export default async function AccountReadyPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) redirect("/");

  let setupLink: string | null = null;
  let customerEmail = "";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);
    customerEmail = session.customer_details?.email ?? session.customer_email ?? "";

    if (customerEmail) {
      const admin = createAdminClient();
      const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";

      const { data: listData } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const user = listData?.users?.find((u) => u.email?.toLowerCase() === customerEmail.toLowerCase());

      if (user) {
        const hasPassword = user.identities?.some((i) => i.provider === "email") ?? false;

        if (hasPassword) {
          // Existing user — magiclink through callback to dashboard
          const { data: linkData } = await admin.auth.admin.generateLink({
            type: "magiclink",
            email: user.email!,
            options: { redirectTo: `${siteUrl}/auth/callback?next=/dashboard` },
          });
          setupLink = linkData?.properties?.action_link ?? null;
        } else {
          // New user — recovery link direct to /setup-account so the hash
          // tokens (#access_token=...&type=recovery) land right there.
          // Avoids the server-side /auth/callback which can't read URL hashes.
          const { data: linkData } = await admin.auth.admin.generateLink({
            type: "recovery",
            email: user.email!,
            options: { redirectTo: `${siteUrl}/setup-account` },
          });
          setupLink = linkData?.properties?.action_link ?? null;
        }
      }
    }
  } catch {
    // fallback to login page
  }

  return (
    <div
      className="min-h-screen flex items-start justify-center"
      style={{ backgroundColor: "#EEF7FC", paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div
        className="w-full rounded-2xl p-10"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", maxWidth: "520px", margin: "0 24px" }}
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

        <h1
          className="font-serif text-center mb-3"
          style={{ fontSize: "2rem", color: "#1B4F6B" }}
        >
          Your plaque is on its way.
        </h1>

        <p className="text-center mb-8" style={{ fontSize: "1.05rem", color: "#666", lineHeight: "1.7" }}>
          Now set up your password and start writing your story.
          {customerEmail && (
            <>
              {" "}Your account is{" "}
              <strong style={{ color: "#1A1A1A" }}>{customerEmail}</strong>.
            </>
          )}
        </p>

        {setupLink ? (
          <>
            <a
              href={setupLink}
              className="btn-primary-lg block text-center w-full mb-3"
            >
              Set up my account &rarr;
            </a>
            <p className="text-center" style={{ fontSize: "0.8rem", color: "#999" }}>
              This link is single-use and works for the next hour.
              If it expires, use{" "}
              <Link href="/forgot-password" style={{ color: "#1B4F6B" }}>
                forgot password
              </Link>{" "}
              to get back in.
            </p>
          </>
        ) : (
          <>
            <p
              className="text-center mb-5 rounded-lg p-4"
              style={{ fontSize: "0.9rem", color: "#7A5C1E", backgroundColor: "#FDF3DC", lineHeight: "1.65" }}
            >
              We couldn&apos;t generate your access link automatically. Use the button below to log in or reset your password.
            </p>
            <Link href="/login" className="btn-primary-lg block text-center w-full">
              Go to login &rarr;
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
