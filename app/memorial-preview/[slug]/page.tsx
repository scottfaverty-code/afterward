/**
 * /memorial-preview/[slug]
 *
 * Design exploration — modern editorial layout with sticky section nav.
 * NOT linked from anywhere. Navigate directly to test.
 * Slug: /memorial-preview/patrick-faverty
 */
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SECTIONS } from "@/lib/sections";
import PreviewClient from "./PreviewClient";

export default async function MemorialPreviewPage({
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

  if (!profile) notFound();

  // Load story answers
  const { data: rawAnswers } = await supabase
    .from("story_answers")
    .select("section_slug, question_id, answer_text, skipped")
    .eq("user_id", profile.id)
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

  // Section short labels for the nav
  const SHORT_LABELS: Record<string, string> = {
    "your-roots": "Roots",
    "the-life-you-built": "Life Built",
    "the-people-who-matter": "People",
    "what-you-believe": "Beliefs",
    "your-proudest-moments": "Moments",
    "a-letter-to-your-family": "Letter",
    "how-you-want-to-be-remembered": "Legacy",
  };

  // Build sections with content only
  const sections = SECTIONS
    .map((s) => {
      const answers = s.questions
        .map((q) => answerMap[q.id])
        .filter(Boolean) as string[];
      return {
        slug: s.slug,
        label: s.label,
        shortLabel: SHORT_LABELS[s.slug] ?? s.label,
        answers,
        isLetter: s.slug === "a-letter-to-your-family",
      };
    })
    .filter((s) => s.answers.length > 0);

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  const firstName = profile.first_name ?? fullName ?? "them";
  const initial = profile.first_name?.[0]?.toUpperCase() ?? "?";

  return (
    <PreviewClient
      fullName={fullName}
      firstName={firstName}
      birthYear={profile.birth_year ?? null}
      deathYear={profile.death_year ?? null}
      avatarUrl={profile.avatar_url ?? null}
      initial={initial}
      sections={sections}
      guestbook={guestbook}
      memorialSlug={slug}
    />
  );
}
