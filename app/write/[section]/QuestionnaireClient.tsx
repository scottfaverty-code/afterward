"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Section } from "@/lib/sections";

interface Props {
  section: Section;
  nextSectionSlug: string | null;
  initialAnswers: Record<string, string>;
  initialSkipped: Record<string, boolean>;
}

export default function QuestionnaireClient({
  section,
  nextSectionSlug,
  initialAnswers,
  initialSkipped,
}: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [skipped, setSkipped] = useState<Record<string, boolean>>(initialSkipped);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [navigating, setNavigating] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = section.questions[currentIndex];
  const isLastQuestion = currentIndex === section.questions.length - 1;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(120, el.scrollHeight)}px`;
    }
  }, [answers, currentIndex]);

  const saveAnswer = useCallback(async (questionId: string, text: string, isSkipped: boolean) => {
    setSaveStatus("saving");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("story_answers").upsert({
      user_id: user.id,
      section_slug: section.slug,
      question_id: questionId,
      answer_text: text || null,
      skipped: isSkipped,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,question_id" });

    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, [section.slug]);

  function handleTextChange(value: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setSaveStatus("idle");

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveAnswer(currentQuestion.id, value, false);
    }, 3000);
  }

  async function handleNext() {
    // Save current answer before advancing
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setNavigating(true);
    await saveAnswer(currentQuestion.id, answers[currentQuestion.id] ?? "", false);

    if (isLastQuestion) {
      setShowCompletion(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
    setNavigating(false);
  }

  async function handleSkip() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSkipped((prev) => ({ ...prev, [currentQuestion.id]: true }));
    await saveAnswer(currentQuestion.id, "", true);

    if (isLastQuestion) {
      setShowCompletion(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handlePrev() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setCurrentIndex((i) => i - 1);
  }

  async function handleSaveAndExit() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await saveAnswer(currentQuestion.id, answers[currentQuestion.id] ?? "", false);
    router.push("/dashboard");
  }

  function handleContinueToNext() {
    if (nextSectionSlug) {
      router.push(`/write/${nextSectionSlug}`);
    } else {
      router.push("/write/complete");
    }
  }

  const progressPct = ((section.number - 1) / 7) * 100;

  // Completion card
  if (showCompletion && section.number < 7) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh", padding: "64px 24px" }}>
        <div
          className="w-full rounded-2xl p-9"
          style={{
            backgroundColor: "#fff",
            maxWidth: "560px",
            borderLeft: "6px solid #1B4F6B",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full mb-5"
            style={{ width: 48, height: 48, backgroundColor: "#1B4F6B" }}
          >
            <span style={{ color: "#fff", fontSize: "1.25rem" }}>✓</span>
          </div>
          <h2 className="font-serif mb-4" style={{ fontSize: "1.5rem", color: "#1B4F6B" }}>
            You&apos;ve finished {section.label}.
          </h2>
          <p className="mb-7" style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.75" }}>
            {section.completion}
          </p>
          <button
            onClick={handleContinueToNext}
            className="btn-primary-lg block w-full text-center mb-3"
          >
            Continue to {nextSectionSlug ? section.label.replace(section.label, "Next Section") : "complete"} &rarr;
          </button>
          <Link href="/dashboard" className="block text-center" style={{ fontSize: "0.875rem", color: "#999", textDecoration: "underline" }}>
            Return to my dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center" style={{ paddingTop: "64px", paddingBottom: "96px", padding: "0 24px" }}>
      <div className="w-full" style={{ maxWidth: "680px", paddingTop: "64px" }}>
        {/* Section intro */}
        <div
          className="rounded-lg px-5 py-4 mb-8"
          style={{
            backgroundColor: section.goldIntro ? "#FDF3DC" : "#EEF7FC",
            borderLeft: `4px solid ${section.goldIntro ? "#C9932A" : "#2E7DA3"}`,
          }}
        >
          <p
            className="font-serif"
            style={{
              fontSize: "0.95rem",
              fontStyle: "italic",
              color: section.goldIntro ? "#7A5C1E" : "#2E7DA3",
              lineHeight: "1.7",
            }}
          >
            {section.intro}
          </p>
        </div>

        {/* Question */}
        <div>
          {/* Eyebrow */}
          <div
            className="mb-2 font-bold"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#2E7DA3",
            }}
          >
            {section.label}
          </div>

          {/* Question number */}
          <div className="mb-2" style={{ fontSize: "0.8rem", color: "#999" }}>
            Question {currentIndex + 1}
          </div>

          {/* Question text */}
          <h2
            className="font-serif mb-3"
            style={{ fontSize: "1.5rem", color: "#1A1A1A", lineHeight: "1.35" }}
          >
            {currentQuestion.text}
          </h2>

          {/* Hint */}
          {currentQuestion.hint && (
            <p
              className="mb-4"
              style={{ fontSize: "0.95rem", color: "#666", fontStyle: "italic", lineHeight: "1.65" }}
            >
              {currentQuestion.hint}
            </p>
          )}

          {/* Textarea */}
          <div className="relative mb-2">
            <textarea
              ref={textareaRef}
              value={answers[currentQuestion.id] ?? ""}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Write here..."
              style={{
                width: "100%",
                minHeight: "120px",
                border: "1px solid #D6EAF4",
                borderRadius: "8px",
                padding: "16px",
                fontSize: "1rem",
                lineHeight: "1.7",
                color: "#1A1A1A",
                resize: "none",
                outline: "none",
                backgroundColor: "#fff",
                overflow: "hidden",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#2E7DA3"; }}
              onBlur={(e) => { e.target.style.borderColor = "#D6EAF4"; }}
            />
          </div>

          {/* Save status */}
          <div className="text-right mb-6" style={{ minHeight: "20px" }}>
            {saveStatus === "saved" && (
              <span style={{ fontSize: "0.8rem", color: "#999" }}>Saved ✓</span>
            )}
            {saveStatus === "saving" && (
              <span style={{ fontSize: "0.8rem", color: "#ccc" }}>Saving...</span>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-4">
            {currentIndex > 0 ? (
              <button
                onClick={handlePrev}
                className="btn-ghost"
                style={{ padding: "12px 24px", fontSize: "0.9rem" }}
              >
                &larr; Previous
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={navigating}
              className="btn-primary"
              style={{ padding: "12px 28px", fontSize: "0.9rem", opacity: navigating ? 0.6 : 1, cursor: navigating ? "default" : "pointer" }}
            >
              {navigating ? "Saving…" : isLastQuestion ? "Finish section" : "Next question \u2192"}
            </button>
          </div>

          {/* Skip */}
          <div className="text-center">
            <button
              onClick={handleSkip}
              style={{
                fontSize: "0.875rem",
                color: "#999",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export saveAndExit for the header button
export function useSaveAndExit() {
  // No-op; header uses router.push
}
