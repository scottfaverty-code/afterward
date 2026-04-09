import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "./DashboardHeader";
import ProfileNudge from "./ProfileNudge";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  has_seen_dashboard: boolean;
  page_is_public: boolean;
  memorial_slug: string | null;
  created_at: string;
};

type Purchase = {
  id: string;
  user_id: string | null;
  email: string | null;
  stripe_session_id: string | null;
  amount_paid: number | null;
  plaque_status: string;
  plaque_tracking_url: string | null;
  shipping_address_deferred: boolean;
  created_at: string;
};

type StoryAnswer = {
  section_slug: string;
  question_id: string;
  skipped: boolean;
};

type ShippingAddress = {
  recipient_name: string | null;
  city: string | null;
  state_province: string | null;
  delivery_type: string | null;
};

const SECTIONS = [
  { slug: "your-roots", label: "Your Roots" },
  { slug: "the-life-you-built", label: "The Life You Built" },
  { slug: "the-people-who-matter", label: "The People Who Matter" },
  { slug: "what-you-believe", label: "What You Believe" },
  { slug: "your-proudest-moments", label: "Your Proudest Moments" },
  { slug: "a-letter-to-your-family", label: "A Letter to Your Family" },
  { slug: "how-you-want-to-be-remembered", label: "How You Want to Be Remembered" },
] as const;

const SECTION_QUESTIONS: Record<string, string[]> = {
  "your-roots": ["roots-q1", "roots-q2", "roots-q3", "roots-q4"],
  "the-life-you-built": ["built-q1", "built-q2", "built-q3", "built-q4"],
  "the-people-who-matter": ["people-q1", "people-q2", "people-q3", "people-q4"],
  "what-you-believe": ["believe-q1", "believe-q2", "believe-q3", "believe-q4"],
  "your-proudest-moments": ["proud-q1", "proud-q2", "proud-q3"],
  "a-letter-to-your-family": ["letter-q1", "letter-q2", "letter-q3"],
  "how-you-want-to-be-remembered": ["remember-q1", "remember-q2"],
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileResult, answersResult, purchaseResult, shippingResult] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("story_answers").select("section_slug, question_id, skipped").eq("user_id", user.id),
      supabase.from("purchases").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single(),
      supabase.from("shipping_addresses").select("recipient_name, city, state_province, delivery_type").eq("user_id", user.id).single(),
    ]);

  const profile = profileResult.data as Profile | null;
  const answers = (answersResult.data ?? []) as StoryAnswer[];
  const purchase = purchaseResult.data as Purchase | null;
  const shippingAddress = shippingResult.data as ShippingAddress | null;

  // Mark has_seen_dashboard
  const isFirstVisit = !profile?.has_seen_dashboard;
  if (isFirstVisit && profile) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any).update({ has_seen_dashboard: true }).eq("id", user.id);
  }

  const answerSet = new Set(answers?.filter((a) => !a.skipped && a.question_id).map((a) => `${a.section_slug}:${a.question_id}`) ?? []);

  function isSectionStarted(slug: string): boolean {
    return SECTION_QUESTIONS[slug]?.some((qid) => answerSet.has(`${slug}:${qid}`)) ?? false;
  }

  function isSectionComplete(slug: string): boolean {
    return SECTION_QUESTIONS[slug]?.every((qid) => answerSet.has(`${slug}:${qid}`)) ?? false;
  }

  const completedCount = SECTIONS.filter((s) => isSectionComplete(s.slug)).length;

  const firstIncompleteSlug = SECTIONS.find((s) => !isSectionComplete(s.slug))?.slug ?? SECTIONS[0].slug;

  const missingName = !profile?.first_name;
  const missingPhoto = !profile?.avatar_url;

  const firstName = profile?.first_name ?? null;
  const memorialSlug = profile?.memorial_slug ?? null;
  const addressDeferred = purchase?.shipping_address_deferred;

  return (
    <>
      <DashboardHeader firstName={firstName} avatarUrl={profile?.avatar_url ?? null} />

      <main style={{ backgroundColor: "#F9F9F9", minHeight: "calc(100vh - 64px)", paddingBottom: "80px" }}>
        <div className="container-main" style={{ paddingTop: "48px", maxWidth: "900px" }}>

          {/* Profile nudge */}
          <ProfileNudge missingName={missingName} missingPhoto={missingPhoto} />

          {/* Welcome banner — first visit */}
          {isFirstVisit && (
            <div
              className="rounded-2xl px-8 py-6 mb-6 flex items-center justify-between gap-6"
              style={{ backgroundColor: "#1B4F6B", color: "#fff" }}
            >
              <div>
                <h2 className="font-serif mb-1" style={{ fontSize: "1.4rem", color: "#fff" }}>
                  Welcome to Afterword{firstName ? `, ${firstName}` : ""}. Your page is ready &mdash; let&apos;s start filling it in.
                </h2>
              </div>
              <Link
                href={`/write/${firstIncompleteSlug}`}
                className="flex-shrink-0 rounded-lg px-5 py-2.5 font-semibold text-sm"
                style={{ backgroundColor: "#fff", color: "#1B4F6B", textDecoration: "none" }}
              >
                Start writing &rarr;
              </Link>
            </div>
          )}

          <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {/* Progress card */}
            <div
              className="rounded-2xl p-6 col-span-2"
              style={{ backgroundColor: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
            >
              <h3 className="font-bold mb-4" style={{ fontSize: "1rem", color: "#1A1A1A" }}>
                Your story so far
              </h3>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex justify-between mb-1.5">
                  <span style={{ fontSize: "0.8rem", color: "#666" }}>
                    {completedCount} of 7 sections complete
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#1B4F6B", fontWeight: 600 }}>
                    {Math.round((completedCount / 7) * 100)}%
                  </span>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: "#D6EAF4" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(completedCount / 7) * 100}%`, backgroundColor: "#1B4F6B" }}
                  />
                </div>
              </div>

              {/* Section checklist */}
              <div className="flex flex-col mt-5 gap-0">
                {SECTIONS.map((section) => {
                  const complete = isSectionComplete(section.slug);
                  const started = isSectionStarted(section.slug);
                  return (
                    <div
                      key={section.slug}
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: "1px solid #F0F0F0" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0"
                          style={{
                            width: 22,
                            height: 22,
                            backgroundColor: complete ? "#1B4F6B" : "#EEF7FC",
                            color: complete ? "#fff" : "#999",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                          }}
                        >
                          {complete ? "✓" : ""}
                        </div>
                        <span style={{ fontSize: "0.9rem", color: complete ? "#999" : "#1A1A1A" }}>
                          {section.label}
                        </span>
                      </div>
                      <Link
                        href={`/write/${section.slug}`}
                        style={{
                          fontSize: "0.8rem",
                          color: "#1B4F6B",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        {complete ? "Edit" : started ? "Continue \u2192" : "Start \u2192"}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Page preview card */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
            >
              <h3 className="font-bold mb-3" style={{ fontSize: "1rem", color: "#1A1A1A" }}>
                Your Afterword page
              </h3>

              {/* Mini memorial preview */}
              <div
                className="rounded-xl overflow-hidden mb-4"
                style={{ border: "1px solid #E5E5E5" }}
              >
                <div
                  className="px-4 py-3 text-center text-white"
                  style={{ background: "linear-gradient(135deg, #0f2d3d, #1B4F6B)" }}
                >
                  <div
                    className="avatar-fallback mx-auto mb-1"
                    style={{ width: 36, height: 36, fontSize: "0.875rem" }}
                  >
                    {firstName?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    {profile?.first_name} {profile?.last_name}
                  </div>
                </div>
                <div className="px-4 py-3" style={{ backgroundColor: "#EEF7FC" }}>
                  <p style={{ fontSize: "0.75rem", color: "#666", fontStyle: "italic" }}>
                    {completedCount === 0
                      ? "Your story is waiting to be written..."
                      : `${completedCount} section${completedCount === 1 ? "" : "s"} written`}
                  </p>
                </div>
              </div>

              {memorialSlug ? (
                <Link
                  href={`/memorial/${memorialSlug}`}
                  target="_blank"
                  className="btn-ghost block text-center text-sm"
                  style={{ padding: "10px 16px" }}
                >
                  View your live page &rarr;
                </Link>
              ) : (
                <p style={{ fontSize: "0.78rem", color: "#999", textAlign: "center" }}>
                  Your public page URL will be available after you complete your profile.
                </p>
              )}
              <p className="mt-3 text-center" style={{ fontSize: "0.75rem", color: "#999" }}>
                Your page is private by default. You control when it becomes publicly accessible.
              </p>
            </div>

            {/* Plaque status card */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
            >
              <h3 className="font-bold mb-3" style={{ fontSize: "1rem", color: "#1A1A1A" }}>
                Your QR plaque
              </h3>

              {addressDeferred || !shippingAddress ? (
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "#FDF3DC", borderLeft: "4px solid #C9932A" }}
                >
                  <div className="font-bold mb-1" style={{ fontSize: "0.9rem", color: "#1A1A1A" }}>
                    We still need your shipping address
                  </div>
                  <p className="mb-3" style={{ fontSize: "0.8rem", color: "#666", lineHeight: "1.6" }}>
                    Your QR plaque can&apos;t ship until we know where to send it. It only takes a minute.
                  </p>
                  <Link
                    href="/shipping-address"
                    className="btn-primary block text-center text-sm"
                    style={{ padding: "10px 16px" }}
                  >
                    Add my shipping address &rarr;
                  </Link>
                </div>
              ) : (
                <div>
                  {/* Status badge */}
                  <div className="mb-3">
                    <span
                      className="inline-block rounded-full px-3 py-1"
                      style={{
                        backgroundColor:
                          purchase?.plaque_status === "shipped" ? "#EEF7FC"
                          : purchase?.plaque_status === "delivered" ? "#d4edda"
                          : "#FDF3DC",
                        color:
                          purchase?.plaque_status === "shipped" ? "#1B4F6B"
                          : purchase?.plaque_status === "delivered" ? "#155724"
                          : "#C9932A",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {purchase?.plaque_status === "shipped" ? "Shipped"
                        : purchase?.plaque_status === "delivered" ? "Delivered"
                        : "Order received \u2014 processing"}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "#555", lineHeight: "1.65" }}>
                    Your weatherproof QR plaque will be shipped to{" "}
                    <strong>{shippingAddress.recipient_name}</strong> at{" "}
                    <strong>{shippingAddress.city}, {shippingAddress.state_province}</strong>{" "}
                    within 10 business days.
                  </p>

                  {purchase?.plaque_tracking_url && (
                    <a
                      href={purchase.plaque_tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.8rem", color: "#1B4F6B", display: "block", marginTop: "8px" }}
                    >
                      Track your shipment &rarr;
                    </a>
                  )}

                  <Link
                    href="/shipping-address"
                    style={{ fontSize: "0.78rem", color: "#999", display: "block", marginTop: "8px", textDecoration: "underline" }}
                  >
                    Update shipping address
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12" style={{ fontSize: "0.8rem", color: "#999" }}>
          Questions? Email{" "}
          <a href="mailto:scott@myafterword.co" style={{ color: "#1B4F6B" }}>
            scott@myafterword.co
          </a>{" "}
          &mdash; we read everything.
        </div>
      </main>
    </>
  );
}
