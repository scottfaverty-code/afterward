import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function WriteCompletePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("memorial_slug")
    .eq("id", user.id)
    .single();

  const memorialSlug = (profile as { memorial_slug?: string | null } | null)?.memorial_slug;

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(160deg, #0d2535, #1B4F6B)",
        padding: "64px 24px",
      }}
    >
      <div className="text-center text-white" style={{ maxWidth: "600px" }}>
        <h1
          className="font-serif mb-6"
          style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#fff" }}
        >
          Your story is written.
        </h1>

        <p
          className="mb-10"
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.85)",
            lineHeight: "1.7",
          }}
        >
          Everything you&apos;ve shared, your roots, the life you built, the people you love, the things you believe, is now part of your permanent Afterword page. It will be there whenever your family needs it, exactly as you wrote it.
        </p>

        {/* Confirmation items */}
        <div className="flex flex-col gap-4 mb-10 text-left">
          {[
            "Your page is live and saving in real time",
            "Your QR plaque is on its way, ships within 10 business days",
            "You can return and add to your page at any time",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.9)" }}>✓</span>
              </div>
              <span
                style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)" }}
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3">
          {memorialSlug ? (
            <Link
              href={`/memorial/${memorialSlug}`}
              target="_blank"
              className="btn-white text-center"
              style={{ minWidth: "280px", padding: "16px 32px" }}
            >
              View my Afterword page &rarr;
            </Link>
          ) : null}
          <Link
            href="/dashboard"
            className="btn-ghost-white text-center"
            style={{ minWidth: "280px", padding: "16px 32px" }}
          >
            Return to my dashboard
          </Link>
        </div>

        <p
          className="mt-8"
          style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}
        >
          You can always come back to add more, most people find new stories to tell over time.
        </p>
      </div>
    </div>
  );
}
