/**
 * Daily reminder email cron job
 *
 * Vercel calls this endpoint on a schedule defined in vercel.json.
 * It is protected by CRON_SECRET — Vercel sets the Authorization header
 * automatically; any other caller without the secret gets a 401.
 *
 * What it does:
 *   For every purchased user whose page is not yet public, evaluate which
 *   reminder (if any) is due based on days since purchase and current
 *   activity, then send it and record it so it never fires again.
 *
 * Email sequence:
 *   Day  3  — "Your page is waiting"    (only if 0 answers written)
 *   Day  7  — "Keep going"              (only if story is incomplete)
 *   Day 14  — "Invite someone"          (everyone with no invite sent yet)
 *   Day 30  — "A note from Scott"       (only if fewer than 3 sections done)
 *
 * Guard rails:
 *   - Never send more than 1 reminder per user per 6 days
 *   - Stop all reminders once page_is_public = true
 *   - The email_reminders table unique index prevents double-sends
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_ADDRESS, REPLY_TO } from "@/lib/email";
import {
  reminderDay3Email,
  reminderDay7Email,
  reminderDay14InviteEmail,
  reminderDay30Email,
} from "@/lib/email";

export const runtime = "nodejs";

// Minimum days between any two reminder emails to the same user
const MIN_GAP_DAYS = 6;

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const resend = getResend();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
  const now = new Date();

  // ------------------------------------------------------------------
  // 1. Fetch all purchases with user profile + activity counts
  // ------------------------------------------------------------------
  const { data: purchases, error: purchasesError } = await admin
    .from("purchases")
    .select("user_id, email, created_at");

  if (purchasesError) {
    console.error("[cron/reminders] Failed to fetch purchases:", purchasesError.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!purchases || purchases.length === 0) {
    return NextResponse.json({ sent: 0, skipped: 0, message: "No purchases found" });
  }

  let sent = 0;
  let skipped = 0;

  for (const purchase of purchases) {
    const userId = purchase.user_id as string;
    const email = purchase.email as string;
    const purchasedAt = new Date(purchase.created_at as string);
    const daysSincePurchase = Math.floor(
      (now.getTime() - purchasedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Only start reminders after day 2 (give them 2 full days first)
    if (daysSincePurchase < 3) { skipped++; continue; }

    try {
      // Fetch profile (public status + name)
      const { data: profile } = await admin
        .from("profiles")
        .select("first_name, page_is_public, memorial_slug")
        .eq("id", userId)
        .maybeSingle();

      // Skip users who've already made their page public — they're done
      if (profile?.page_is_public) { skipped++; continue; }

      const firstName = (profile?.first_name as string | null) ?? undefined;

      // Fetch reminders already sent to this user
      const { data: sentReminders } = await admin
        .from("email_reminders")
        .select("reminder_type, sent_at")
        .eq("user_id", userId);

      const alreadySent = new Set((sentReminders ?? []).map((r: { reminder_type: string }) => r.reminder_type));

      // Enforce minimum gap — find most recent reminder
      const lastSentAt = (sentReminders ?? []).reduce((latest: Date | null, r: { sent_at: string }) => {
        const d = new Date(r.sent_at);
        return !latest || d > latest ? d : latest;
      }, null as Date | null);

      const daysSinceLastReminder = lastSentAt
        ? Math.floor((now.getTime() - lastSentAt.getTime()) / (1000 * 60 * 60 * 24))
        : Infinity;

      if (daysSinceLastReminder < MIN_GAP_DAYS) { skipped++; continue; }

      // Fetch answer count (sections with at least one answer)
      const { data: answerRows } = await admin
        .from("story_answers")
        .select("section_slug")
        .eq("user_id", userId)
        .eq("skipped", false);

      const uniqueSections = new Set((answerRows ?? []).map((a: { section_slug: string }) => a.section_slug));
      const sectionsComplete = uniqueSections.size;
      const hasAnyAnswers = sectionsComplete > 0;

      // Fetch whether they've sent any contributor invites
      const { data: inviteRows } = await admin
        .from("contribution_invites")
        .select("id")
        .eq("owner_user_id", userId)
        .limit(1);

      const hasInvited = (inviteRows ?? []).length > 0;

      // ------------------------------------------------------------------
      // 2. Determine which reminder to send (priority order)
      // ------------------------------------------------------------------
      let reminderType: string | null = null;
      let subject = "";
      let html = "";

      if (daysSincePurchase >= 30 && sectionsComplete < 3 && !alreadySent.has("day30_final")) {
        reminderType = "day30_final";
        ({ subject, html } = reminderDay30Email(email, firstName));
      } else if (daysSincePurchase >= 14 && !hasInvited && !alreadySent.has("day14_invite")) {
        reminderType = "day14_invite";
        const dashboardUrl = `${appUrl}/dashboard`;
        ({ subject, html } = reminderDay14InviteEmail(email, firstName, dashboardUrl));
      } else if (daysSincePurchase >= 7 && hasAnyAnswers && sectionsComplete < 7 && !alreadySent.has("day7_progress")) {
        reminderType = "day7_progress";
        ({ subject, html } = reminderDay7Email(email, firstName, sectionsComplete));
      } else if (daysSincePurchase >= 3 && !hasAnyAnswers && !alreadySent.has("day3_nudge")) {
        reminderType = "day3_nudge";
        ({ subject, html } = reminderDay3Email(email, firstName));
      }

      if (!reminderType) { skipped++; continue; }

      // ------------------------------------------------------------------
      // 3. Send email + record it
      // ------------------------------------------------------------------
      await resend.emails.send({
        from: FROM_ADDRESS,
        replyTo: REPLY_TO,
        to: email,
        subject,
        html,
      });

      // Upsert — safe even if two cron invocations race
      await admin.from("email_reminders").upsert(
        { user_id: userId, reminder_type: reminderType },
        { onConflict: "user_id,reminder_type", ignoreDuplicates: true }
      );

      console.log(`[cron/reminders] Sent ${reminderType} to ${email}`);
      sent++;

    } catch (err) {
      // Log but don't abort — move on to next user
      console.error(`[cron/reminders] Error for user ${userId}:`, err);
      skipped++;
    }
  }

  console.log(`[cron/reminders] Done — sent: ${sent}, skipped: ${skipped}`);
  return NextResponse.json({ sent, skipped });
}
