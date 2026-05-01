// Must run on Node.js — react-pdf uses Node APIs not available in Edge.
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { createClient } from "@/lib/supabase/server";
import AfterwordPDF from "@/lib/pdf/AfterwordPDF";
import type { PDFProfile, PDFAnswer } from "@/lib/pdf/AfterwordPDF";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch profile and answers in parallel
  const [profileResult, answersResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url, referred_as, birth_year, death_year, memorial_slug")
      .eq("id", user.id)
      .single(),
    supabase
      .from("story_answers")
      .select("section_slug, question_id, answer_text, skipped")
      .eq("user_id", user.id)
      .eq("skipped", false),
  ]);

  const profile = profileResult.data as PDFProfile | null;
  const rawAnswers = answersResult.data ?? [];

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const answers: PDFAnswer[] = rawAnswers
    .filter((a) => a.answer_text)
    .map((a) => ({
      section_slug: a.section_slug,
      question_id: a.question_id,
      answer_text: a.answer_text as string,
    }));

  // Fetch avatar as base64 so react-pdf can embed it
  let avatarBase64: string | null = null;
  if (profile.avatar_url) {
    try {
      const res = await fetch(profile.avatar_url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const contentType = res.headers.get("content-type") ?? "image/jpeg";
        avatarBase64 = `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
      }
    } catch {
      // Avatar fetch failure is non-fatal — PDF will show initial instead
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";

  // Generate PDF buffer
  const pdfElement = createElement(AfterwordPDF, {
    profile,
    answers,
    appUrl,
    avatarBase64,
  });

  const buffer = await renderToBuffer(pdfElement);

  const fullName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "") || "afterword";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="afterword-${fullName}.pdf"`,
      "Content-Length": String(buffer.length),
    },
  });
}
