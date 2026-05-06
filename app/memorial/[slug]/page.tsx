import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SECTIONS } from "@/lib/sections";
import PreviewClient from "@/app/memorial-preview/[slug]/PreviewClient";

// ---------------------------------------------------------------------------
// Open Graph / Twitter metadata
// Runs independently of the page render — Next.js deduplicates the Supabase
// query automatically via the request cache.
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url, page_is_public, birth_year, death_year, referred_as")
    .eq("memorial_slug", slug)
    .maybeSingle();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";

  // Private or missing pages — return generic metadata
  if (!profile || !profile.page_is_public) {
    return {
      title: "Afterword",
      description: "A permanent page for your story, written in your own words.",
    };
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");

  const years =
    profile.birth_year && profile.death_year
      ? ` (${profile.birth_year}–${profile.death_year})`
      : profile.birth_year
      ? ` (b. ${profile.birth_year})`
      : "";

  const poss =
    profile.referred_as === "he" ? "his"
    : profile.referred_as === "she" ? "her"
    : "their";

  const title = `${fullName}${years} · Afterword`;
  const description = `${fullName}'s life story, written in ${poss} own words.`;
  const pageUrl = `${appUrl}/memorial/${slug}`;

  // Resolve avatar to an absolute URL
  const rawAvatar = profile.avatar_url ?? null;
  const imageUrl = rawAvatar
    ? rawAvatar.startsWith("http")
      ? rawAvatar
      : `${appUrl}${rawAvatar}`
    : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Afterword",
      type: "profile",
      ...(imageUrl
        ? { images: [{ url: imageUrl, width: 800, height: 800, alt: fullName }] }
        : {}),
    },
    twitter: {
      card: imageUrl ? "summary" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

type Pronouns = { subj: string; obj: string; poss: string };

function getPronouns(referredAs: string | null): Pronouns {
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

const SHORT_LABELS: Record<string, string> = {
  "your-roots": "Roots",
  "the-life-you-built": "Life Built",
  "the-people-who-matter": "People",
  "what-you-believe": "Beliefs",
  "your-proudest-moments": "Moments",
  "a-letter-to-your-family": "Letter",
  "how-you-want-to-be-remembered": "Legacy",
};

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

type ContributionRow = {
  id: string;
  contributor_name: string;
  contributor_relationship: string;
  memory_text: string;
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

  const guestbook = (rawGuestbook ?? []) as {
    id: string; author_name: string; message: string; created_at: string;
  }[];

  // Load approved contributions
  const { data: rawContributions } = await supabase
    .from("contributions")
    .select("id, contributor_name, contributor_relationship, memory_text, created_at")
    .eq("memorial_slug", slug)
    .eq("status", "approved")
    .order("created_at", { ascending: true });
  const contributions = (rawContributions ?? []) as ContributionRow[];

  const fullName = [p.first_name, p.last_name].filter(Boolean).join(" ");
  const firstName = p.first_name ?? fullName ?? "them";
  const initial = p.first_name?.[0]?.toUpperCase() ?? "?";
  const pr = getPronouns(p.referred_as ?? null);

  // Build sections with content only
  const sections = SECTIONS
    .map((s) => {
      const sectionAnswers = s.questions
        .map((q) => answerMap[q.id])
        .filter(Boolean) as string[];
      return {
        slug: s.slug,
        label: s.label,
        shortLabel: SHORT_LABELS[s.slug] ?? s.label,
        intro: s.slug !== "a-letter-to-your-family" ? sectionIntro(s.slug, firstName, pr) : null,
        answers: sectionAnswers,
        isLetter: s.slug === "a-letter-to-your-family",
      };
    })
    .filter((s) => s.answers.length > 0);

  return (
    <PreviewClient
      fullName={fullName}
      firstName={firstName}
      poss={pr.poss}
      birthYear={p.birth_year ?? null}
      deathYear={p.death_year ?? null}
      avatarUrl={p.avatar_url ?? null}
      initial={initial}
      sections={sections}
      guestbook={guestbook}
      memorialSlug={slug}
      isPreview={false}
      contributions={contributions}
    />
  );
}
