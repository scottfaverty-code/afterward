import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SECTIONS } from "@/lib/sections";
import GuestbookForm from "./GuestbookForm";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  page_is_public: boolean;
  memorial_slug: string | null;
};

type GuestbookEntry = {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
};

export default async function MemorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url, page_is_public, memorial_slug")
    .eq("memorial_slug", slug)
    .single();

  if (!profile) notFound();

  const p = profile as Profile;

  if (!p.page_is_public) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#EEF7FC", padding: "64px 24px" }}>
        <div className="text-center" style={{ maxWidth: "480px" }}>
          <h1 className="font-serif mb-3" style={{ fontSize: "1.6rem", color: "#1B4F6B" }}>
            This page is private
          </h1>
          <p style={{ color: "#666", lineHeight: "1.7" }}>
            This Afterword page has not been made public yet. The person who created it will make it accessible when the time is right.
          </p>
        </div>
      </div>
    );
  }

  // Load story answers
  const { data: rawAnswers } = await supabase
    .from("story_answers")
    .select("section_slug, question_id, answer_text, skipped")
    .eq("user_id", p.id)
    .eq("skipped", false);

  type AnswerRow = { section_slug: string; question_id: string; answer_text: string | null; skipped: boolean };
  const answers = (rawAnswers ?? []) as AnswerRow[];

  const answerMap: Record<string, string> = {};
  for (const a of answers) {
    if (a.answer_text) answerMap[a.question_id] = a.answer_text;
  }

  // Load guestbook
  const { data: rawGuestbook } = await supabase
    .from("guestbook_entries")
    .select("id, author_name, message, created_at")
    .eq("memorial_slug", slug)
    .order("created_at", { ascending: false })
    .limit(50);

  const guestbook = (rawGuestbook ?? []) as GuestbookEntry[];

  const fullName = [p.first_name, p.last_name].filter(Boolean).join(" ");
  const initial = p.first_name?.[0]?.toUpperCase() ?? "?";

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="text-center text-white px-6 py-10"
        style={{ background: "linear-gradient(135deg, #0f2d3d, #1B4F6B)" }}
      >
        {/* Avatar */}
        <div
          className="rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4"
          style={{
            width: 80,
            height: 80,
            backgroundColor: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.25)",
          }}
        >
          {p.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.avatar_url}
              alt={fullName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span className="font-serif" style={{ fontSize: "2rem", color: "rgba(255,255,255,0.6)" }}>
              {initial}
            </span>
          )}
        </div>

        <h1 className="font-serif mb-1" style={{ fontSize: "1.6rem" }}>{fullName}</h1>
        <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
          Afterword &mdash; Written in their own words
        </div>
      </div>

      {/* Content */}
      <div className="container-narrow" style={{ paddingTop: "56px", paddingBottom: "80px" }}>
        {SECTIONS.map((section) => {
          const sectionAnswers = section.questions
            .map((q) => ({ q, answer: answerMap[q.id] }))
            .filter((x) => x.answer);

          if (sectionAnswers.length === 0) return null;

          return (
            <div key={section.slug} className="mb-10">
              <h2
                className="font-serif mb-5"
                style={{ fontSize: "1.3rem", color: "#1B4F6B", borderBottom: "2px solid #D6EAF4", paddingBottom: "10px" }}
              >
                {section.label}
              </h2>
              <div className="flex flex-col gap-5">
                {sectionAnswers.map(({ q, answer }) => (
                  <div
                    key={q.id}
                    className="rounded-xl p-5"
                    style={{ backgroundColor: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.05)", borderLeft: "3px solid #2E7DA3" }}
                  >
                    <div
                      className="font-bold mb-2"
                      style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#2E7DA3" }}
                    >
                      {q.text.length > 60 ? q.text.substring(0, 60) + "..." : q.text}
                    </div>
                    <p style={{ fontSize: "0.95rem", color: "#333", lineHeight: "1.75", whiteSpace: "pre-wrap" }}>
                      {answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Guestbook */}
        <div
          className="rounded-2xl p-7 mt-6"
          style={{ backgroundColor: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >
          <h2 className="font-serif mb-5" style={{ fontSize: "1.3rem", color: "#1B4F6B" }}>
            Guestbook
          </h2>

          <GuestbookForm memorialSlug={slug} />

          {guestbook.length > 0 && (
            <div className="mt-6 flex flex-col gap-3">
              {guestbook.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
                >
                  <div className="font-semibold mb-1" style={{ fontSize: "0.85rem", color: "#1A1A1A" }}>
                    {entry.author_name}
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: "1.65" }}>
                    {entry.message}
                  </p>
                  <div style={{ fontSize: "0.72rem", color: "#999", marginTop: "6px" }}>
                    {new Date(entry.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
