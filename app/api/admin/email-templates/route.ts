import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  passwordSetupEmail,
  passwordResetEmail,
  purchaseConfirmationEmail,
  reminderDay3Email,
  reminderDay7Email,
  reminderDay14InviteEmail,
  reminderDay30Email,
  contributorInviteEmail,
  passingNotificationEmail,
} from "@/lib/email";

// ---------------------------------------------------------------------------
// Metadata for each email — display name, trigger description, recipient,
// and the variable tokens available when editing.
// ---------------------------------------------------------------------------
export type TemplateId =
  | "purchase-confirmation"
  | "contributor-invite"
  | "reminder-day-3"
  | "reminder-day-7"
  | "reminder-day-14-invite"
  | "reminder-day-30"
  | "password-setup"
  | "password-reset"
  | "passing-notification";

export const EMAIL_TEMPLATE_META: { id: TemplateId; name: string; trigger: string; recipient: string; vars: readonly string[] }[] = [
  {
    id: "purchase-confirmation",
    name: "Purchase confirmation",
    trigger: "Sent automatically after Stripe checkout completes",
    recipient: "Customer",
    vars: ["firstName", "customerEmail"],
  },
  {
    id: "contributor-invite",
    name: "Contributor invite",
    trigger: "Sent when an author invites someone from their dashboard",
    recipient: "Invited person",
    vars: ["authorFirstName", "authorFullName", "inviteUrl", "recipientEmail"],
  },
  {
    id: "reminder-day-3",
    name: "Day 3 — getting started nudge",
    trigger: "Day 3 after purchase, if the customer hasn't written anything yet",
    recipient: "Customer",
    vars: ["firstName", "customerEmail"],
  },
  {
    id: "reminder-day-7",
    name: "Day 7 — keep going",
    trigger: "Day 7 after purchase, if started but not yet finished",
    recipient: "Customer",
    vars: ["firstName", "sectionsComplete", "customerEmail"],
  },
  {
    id: "reminder-day-14-invite",
    name: "Day 14 — invite a contributor",
    trigger: "Day 14 after purchase, if no contributor has been invited yet",
    recipient: "Customer",
    vars: ["firstName", "dashboardUrl", "customerEmail"],
  },
  {
    id: "reminder-day-30",
    name: "Day 30 — personal note from Scott",
    trigger: "Day 30 after purchase, if fewer than 2 sections are complete",
    recipient: "Customer",
    vars: ["firstName", "customerEmail"],
  },
  {
    id: "password-setup",
    name: "Account setup",
    trigger: "Sent when a founding author account is created by an admin",
    recipient: "Customer",
    vars: ["setupLink"],
  },
  {
    id: "password-reset",
    name: "Password reset",
    trigger: "Sent when a user requests a password reset",
    recipient: "Customer",
    vars: ["resetLink"],
  },
  {
    id: "passing-notification",
    name: "Passing notification (admin alert)",
    trigger: "Sent to Scott when a family member reports a passing on a memorial page",
    recipient: "Scott (admin)",
    vars: ["fullName", "deathYear", "reporterName", "memorialUrl"],
  },
] as const;

/**
 * Build the hardcoded default for a given template ID by calling the
 * existing email function with {{var}} placeholder strings. This gives us
 * a ready-to-edit starting point that always matches the actual email design.
 */
function getHardcodedDefault(id: string): { subject: string; html: string } | null {
  switch (id) {
    case "purchase-confirmation":
      return purchaseConfirmationEmail("{{customerEmail}}", "{{firstName}}");
    case "contributor-invite":
      return contributorInviteEmail(
        "{{inviteUrl}}",
        "{{authorFirstName}}",
        "{{authorFullName}}",
        "{{recipientEmail}}",
      );
    case "reminder-day-3":
      return reminderDay3Email("{{customerEmail}}", "{{firstName}}");
    case "reminder-day-7":
      // sectionsComplete expects a number; "{{sectionsComplete}}" works fine as display text
      return reminderDay7Email("{{customerEmail}}", "{{firstName}}", undefined);
    case "reminder-day-14-invite":
      return reminderDay14InviteEmail("{{customerEmail}}", "{{firstName}}", "{{dashboardUrl}}");
    case "reminder-day-30":
      return reminderDay30Email("{{customerEmail}}", "{{firstName}}");
    case "password-setup":
      return passwordSetupEmail("{{setupLink}}");
    case "password-reset":
      return passwordResetEmail("{{resetLink}}");
    case "passing-notification":
      return passingNotificationEmail(
        "{{fullName}}",
        2024, // placeholder year — not editable inline
        "{{reporterName}}",
        "{{memorialUrl}}",
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// GET /api/admin/email-templates — return all templates with DB overrides merged in
// ---------------------------------------------------------------------------
export async function GET() {
  const { user, role } = await getAdminAuth();
  if (!user || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Fetch whatever is saved in the DB (may be an empty array if table has no rows yet)
  let dbRows: { id: string; subject: string; html_body: string; updated_at: string }[] = [];
  try {
    const { data } = await admin
      .from("email_templates")
      .select("id, subject, html_body, updated_at");
    dbRows = (data ?? []) as typeof dbRows;
  } catch {
    // Table may not exist yet — return defaults only
  }

  const dbMap = Object.fromEntries(dbRows.map((r) => [r.id, r]));

  const templates = EMAIL_TEMPLATE_META.map((meta) => {
    const override = dbMap[meta.id];
    const defaults = getHardcodedDefault(meta.id);
    return {
      ...meta,
      subject: override?.subject ?? defaults?.subject ?? "",
      html_body: override?.html_body ?? defaults?.html ?? "",
      is_customized: !!override,
      updated_at: override?.updated_at ?? null,
      default_subject: defaults?.subject ?? "",
      default_html: defaults?.html ?? "",
    };
  });

  return NextResponse.json({ templates });
}
