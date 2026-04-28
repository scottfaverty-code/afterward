import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_ADDRESS, passingNotificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, death_year, reporter_name } = body;

  // Validate inputs
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  const year = parseInt(death_year, 10);
  const currentYear = new Date().getFullYear();
  if (!year || year < 1900 || year > currentYear) {
    return NextResponse.json({ error: `Please enter a year between 1900 and ${currentYear}` }, { status: 400 });
  }

  const admin = createAdminClient();

  // Look up the profile
  const { data: profile, error: fetchError } = await admin
    .from("profiles")
    .select("id, first_name, last_name, death_year")
    .eq("memorial_slug", slug)
    .single();

  if (fetchError || !profile) {
    return NextResponse.json({ error: "Memorial page not found" }, { status: 404 });
  }

  // Don't overwrite an existing death year
  if (profile.death_year) {
    return NextResponse.json({ error: "This page has already been updated." }, { status: 409 });
  }

  // Write the death year
  const { error: updateError } = await admin
    .from("profiles")
    .update({ death_year: year })
    .eq("id", profile.id);

  if (updateError) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // Notify Scott
  try {
    const resend = getResend();
    const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
    const memorialUrl = `${appUrl}/memorial/${slug}`;
    const { subject, html } = passingNotificationEmail(
      fullName,
      year,
      reporter_name || null,
      memorialUrl,
    );
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: "scott.faverty@gmail.com",
      subject,
      html,
    });
  } catch {
    // Notification failure is non-fatal — the page was already updated
  }

  return NextResponse.json({ ok: true });
}
