import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SECTIONS } from "@/lib/sections";
import GuestbookForm from "./GuestbookForm";
import ReportPassingForm from "./ReportPassingForm";

type Pronouns = { subj: string; obj: string; poss: string };

function getPronouns(referredAs: string): Pronouns {
  if (referredAs === "he") return { subj: "he", obj: "him", poss: "his" };
  if (referredAs === "she") return { subj: "she", obj: "her", poss: "her" };
  return { subj: "they", obj: "them", poss: "their" };
}

function sectionIntro(slug: string, name: string, p: Pronouns): string {
  switch (slug) {
    case "your-roots":
      return `What follows are ${name}'s recollections about childhood, where ${p.subj} came from, ${p.poss} earliest memories, and the people who shaped ${p.obj}.`;
    case "the-life-you-built":
      return `This is ${name}'s account of the life ${p.subj} built, the work ${p.subj} did, the risks ${p.subj} took, the hardest chapters, and the moments ${p.subj} would return to if ${p.subj} could.`;
    case "the-people-who-matter":
      return `Here, ${name} speaks about the people who mattered most, those who loved ${p.obj}, shaped ${p.obj}, and who ${p.subj} most wanted to say something to.`;
    case "what-you-believe":
      return `What follows is ${name}'s hard-won wisdom, the things ${p.subj} learned about life, about people, and about what actually matters, that took a lifetime to arrive at.`;
    case "your-proudest-moments":
      return `These are the moments ${name} was most proud of, not by anyone else's measure, but by ${p.poss} own.`;
    case "how-you-want-to-be-remembered":
      return `What follows are ${name}'s words about how ${p.subj} wants to be remembered, written directly to the people who will one day read this page.`;
    default:
      return `In ${name}'s own words.`;
  }
}

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  page_is_public: boolean;
  memorial_slug: string | null;
  referred_as: string | null;
  birth_year: number | null;
  death_year: number | null;
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
    .select("id, first_name, last_name, avatar_url, page_is_public, memorial_slug, referred_as, birth_year, death_year")
    .eq("memorial_slug", slug)
    .maybeSingle();

  // Fallback: retry without newer columns if the query fails (missing migration).
  let resolvedProfile = profile;
  if (!resolvedProfile) {
    const { data: fallback } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url, page_is_public, memorial_slug")
      .eq("memorial_slug", slug)
      .maybeSingle();
    resolvedProfile = fallback
      ? { ...fallback, referred_as: null, birth_year: null, death_year: null }
      : null;
  }

  if (!resolvedProfile) notFound();

  const p = resolvedProfile as Profile;

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
  const firstName = p.first_name ?? fullName ?? "them";
  const initial = p.first_name?.[0]?.toUpperCase() ?? "?";
  const pr = getPronouns(p.referred_as ?? "they");

  const yearsDisplay = (() => {
    if (p.birth_year && p.death_year) return `${p.birth_year} to ${p.death_year}`;
    if (p.birth_year) return `b. ${p.birth_year}`;
    if (p.death_year) return `Passed ${p.death_year}`;
    return null;
  })();

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
        {yearsDisplay && (
          <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", marginBottom: "4px" }}>
            {yearsDisplay}
          </div>
        )}
        <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
          <a
            href="https://www.myafterword.co"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.25)" }}
          >
            Afterword
          </a>
          , written in {pr.poss} own words
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
                    {firstName}&rsquo;s story
                  </div>
                  <h2 className="font-serif" style={{ fontSize: "1.4rem", color: "#1B4F6B" }}>
                    {section.label}
                  </h2>
                </div>

                <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "#7A5C1E", lineHeight: "1.7", marginBottom: "28px" }}>
                  What follows is {firstName}&rsquo;s letter to the people {pr.subj} loves most. These are {pr.poss} own words, written for those closest to {pr.obj}.
                </p>

                {/* Paper card */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "2px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
                    padding: "56px 60px 64px",
                  }}
                >
                  {sectionAnswers.map(({ answer }, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: "'Courier New', Courier, monospace",
                        fontSize: "0.92rem",
                        color: "#2a2a2a",
                        lineHeight: "1.9",
                        whiteSpace: "pre-wrap",
                        marginBottom: i < sectionAnswers.length - 1 ? "2em" : 0,
                      }}
                    >
                      {answer}
                    </p>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={section.slug} className="mb-14">
              {/* Section header */}
              <div className="mb-5" style={{ borderBottom: "2px solid #D6EAF4", paddingBottom: "14px" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#2E7DA3", marginBottom: "4px" }}>
                  {firstName}&rsquo;s story
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
                {sectionIntro(section.slug, firstName, pr)}
              </div>

              {/* Answers, no question labels, just prose */}
              <div className="flex flex-col gap-6">
                {sectionAnswers.map(({ q, answer }) => (
                  <p key={q.id} style={{ fontSize: "1rem", color: "#1A1A1A", lineHeight: "1.85", whiteSpace: "pre-wrap" }}>
                    {answer}
                  </p>
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

          {!p.death_year && (
            <ReportPassingForm slug={slug} firstName={firstName} />
          )}

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

        {/* Subtle Afterword attribution */}
        <div style={{ textAlign: "center", padding: "40px 0 0", borderTop: "1px solid #E8E8E8", marginTop: "40px" }}>
          <p style={{ fontSize: "0.8rem", color: "#bbb", lineHeight: "1.8", margin: 0 }}>
            {firstName} wrote this page {pr.poss === "their" ? "themselves" : pr.subj === "he" ? "himself" : "herself"}.{" "}
            <a
              href="https://www.myafterword.co"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#999", textDecoration: "none", borderBottom: "1px solid #ddd" }}
            >
              Afterword
            </a>
            {" "}is a place to tell your own story, in your own words,{" "}
            <a
              href="https://www.myafterword.co"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#999", textDecoration: "none", borderBottom: "1px solid #ddd" }}
            >
              before it can only be told by others
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
