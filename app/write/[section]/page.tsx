import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSectionBySlug, getNextSection } from "@/lib/sections";
import WriteHeader from "./WriteHeader";
import QuestionnaireClient from "./QuestionnaireClient";

export default async function WriteSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionSlug } = await params;

  const section = getSectionBySlug(sectionSlug);
  if (!section) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existingAnswers } = await supabase
    .from("story_answers")
    .select("question_id, answer_text, skipped")
    .eq("user_id", user.id)
    .eq("section_slug", sectionSlug);

  const initialAnswers: Record<string, string> = {};
  const initialSkipped: Record<string, boolean> = {};

  for (const row of existingAnswers ?? []) {
    const r = row as { question_id: string; answer_text: string | null; skipped: boolean };
    if (r.answer_text) initialAnswers[r.question_id] = r.answer_text;
    if (r.skipped) initialSkipped[r.question_id] = true;
  }

  const nextSection = getNextSection(sectionSlug);

  return (
    <>
      <WriteHeader sectionLabel={section.label} sectionNumber={section.number} />
      <main style={{ backgroundColor: "#FAFAFA", minHeight: "calc(100vh - 80px)" }}>
        <QuestionnaireClient
          section={section}
          nextSectionSlug={nextSection?.slug ?? null}
          initialAnswers={initialAnswers}
          initialSkipped={initialSkipped}
        />
      </main>
    </>
  );
}

export async function generateStaticParams() {
  const { SECTIONS } = await import("@/lib/sections");
  return SECTIONS.map((s) => ({ section: s.slug }));
}
