import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SECTIONS } from "@/lib/sections";
import GuestbookForm from "./GuestbookForm";

function sectionIntro(slug: string, firstName: string): string {
  switch (slug) {
    case "your-roots":
      return `What follows are ${firstName}'s recollections about their childhood — where they came from, their earliest memories, and the people who shaped who they were becoming.`;
    case "the-life-you-built":
      return `This is ${firstName}'s account of the life they built — the work they did, the risks they took, the hardest chapters, and the moments they'd return to if they could.`;
    case "the-people-who-matter":
      return `Here, ${firstName} speaks about the people who mattered most — those who loved them, shaped them, and who they most wanted to say something to.`;
    case "what-you-believe":
      return `What follows is ${firstName}'s hard-won wisdom — the things they learned about life, about people, and about what actually matters, that took a lifetime to arrive at.`;
    case "your-proudest-moments":
      return `These are the moments ${firstName} was most proud of — not by anyone else's measure, but by their own.`;
    default:
      return `In ${firstName}'s own words.`;
  }
}

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

          const isLetter = section.slug === "a-letter-to-your-family";
          const isRemembered = section.slug === "how-you-want-to-be-remembered";

          // Letter to family: typewriter paper treatment
          if (isLetter) {
            return (
              <div key={section.slug} className="mb-14">
                <div className="mb-5" style={{ borderBottom: "2px solid #D6EAF4", paddingBottom: "14px" }}>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#2E7DA3", marginBottom: "4px" }}>
                    {p.first_name}&rsquo;s story
                  </div>
                  <h2 className="font-serif" style={{ fontSize: "1.4rem", color: "#1B4F6B" }}>
                    {section.label}
                  </h2>
                </div>

                <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "#7A5C1E", lineHeight: "1.7", marginBottom: "28px" }}>
                  What follows is {p.first_name}&rsquo;s letter to the people they love most. These are their own words, written for the people closest to them.
                </p>

                {/* Paper card */}
                <div
                  style={{
                    backgroundColor: "#FFFEF7",
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e8e0d0 31px, #e8e0d0 32px)",
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.04)",
                    padding: "48px 52px 52px",
                    position: "relative",
                    lineHeight: "32px",
                  }}
                >
                  {/* Red margin line */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "72px",
                    width: "1px",
                    backgroundColor: "rgba(220, 100, 100, 0.25)",
                  }} />

                  <div style={{ paddingLeft: "20px" }}>
                    {sectionAnswers.map(({ answer }, i) => (
                      <p
                        key={i}
                        style={{
                          fontFamily: "'Courier New', Courier, monospace",
                          fontSize: "0.92rem",
                          color: "#2a2a2a",
                          lineHeight: "32px",
                          whiteSpace: "pre-wrap",
                          marginBottom: i < sectionAnswers.length - 1 ? "32px" : 0,
                        }}
                      >
                        {answer}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={section.slug} className="mb-14">
              {/* Section header */}
              <div className="mb-5" style={{ borderBottom: "2px solid #D6EAF4", paddingBottom: "14px" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#2E7DA3", marginBottom: "4px" }}>
                  {p.first_name}&rsquo;s story
                </div>
                <h2 className="font-serif" style={{ fontSize: "1.4rem", color: "#1B4F6B" }}>
                  {section.label}
                </h2>
              </div>

              {/* Section intro */}
              <div
                className="rounded-lg p-4 mb-6"
                style={{
                  backgroundColor: isRemembered ? "#EEF7FC" : "#EEF7FC",
                  borderLeft: "4px solid #2E7DA3",
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                  color: "#1B4F6B",
                  lineHeight: "1.7",
                }}
              >
                {isRemembered
                  ? `What follows are ${p.first_name}'s words about how they want to be remembered — written directly to the people who will read this page.`
                  : sectionIntro(section.slug, p.first_name ?? "they")}
              </div>

              {/* Answers */}
              <div className="flex flex-col gap-6">
                {sectionAnswers.map(({ q, answer }) => (
                  <div key={q.id}>
                    <div
                      className="mb-2"
                      style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#999" }}
                    >
                      {q.text}
                    </div>
                    <p style={{ fontSize: "1rem", color: "#1A1A1A", lineHeight: "1.85", whiteSpace: "pre-wrap" }}>
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
