import { Resend } from "resend";

// Single shared Resend instance — imported wherever we need to send email.
// RESEND_API_KEY must be set in Vercel environment variables.
export function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export const FROM_ADDRESS = "Afterword <noreply@myafterword.co>";
export const REPLY_TO = "scott@myafterword.co";

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Template variable interpolation — used when DB overrides are active
// ---------------------------------------------------------------------------

/** Replace {{varName}} tokens in a template string with values from the vars map. */
export function interpolateEmailVars(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

/**
 * Fetch a saved override from the email_templates table.
 * Returns null if no override exists or the table is not yet present.
 * Failures are swallowed — callers fall back to the hardcoded default.
 */
export async function fetchEmailOverride(id: string): Promise<{ subject: string; html: string } | null> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    const { data } = await admin
      .from("email_templates")
      .select("subject, html_body")
      .eq("id", id)
      .maybeSingle();
    return data ? { subject: data.subject, html: data.html_body } : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

export function passwordSetupEmail(setupLink: string): { subject: string; html: string } {
  return {
    subject: "Set up your Afterword password",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF7FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF7FC;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0f2d3d,#1B4F6B);padding:32px 40px;text-align:center;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:1.5rem;color:#ffffff;letter-spacing:0.04em;">Afterword</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:1.6rem;color:#1B4F6B;line-height:1.2;">Your account is ready.</h1>
          <p style="margin:0 0 24px;font-size:1rem;color:#555;line-height:1.7;">
            Click the button below to set your password and start writing your Afterword story. This link is valid for 24 hours.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr><td style="background:#1B4F6B;border-radius:8px;">
              <a href="${setupLink}" style="display:inline-block;padding:16px 32px;font-size:1rem;font-weight:600;color:#ffffff;text-decoration:none;">Set up my account &rarr;</a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:0.82rem;color:#999;line-height:1.6;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${setupLink}" style="color:#2E7DA3;word-break:break-all;">${setupLink}</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #E5E5E5;text-align:center;">
          <p style="margin:0;font-size:0.78rem;color:#999;line-height:1.6;">
            Afterword · <a href="https://www.myafterword.co" style="color:#2E7DA3;text-decoration:none;">myafterword.co</a><br>
            Questions? Reply to this email or write to <a href="mailto:scott@myafterword.co" style="color:#2E7DA3;">scott@myafterword.co</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

export function passwordResetEmail(resetLink: string): { subject: string; html: string } {
  return {
    subject: "Set up your Afterword password",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF7FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF7FC;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0f2d3d,#1B4F6B);padding:32px 40px;text-align:center;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:1.5rem;color:#ffffff;letter-spacing:0.04em;">Afterword</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:1.6rem;color:#1B4F6B;line-height:1.2;">Set up your password</h1>
          <p style="margin:0 0 24px;font-size:1rem;color:#555;line-height:1.7;">
            Click below to set your Afterword password and access your account. This link expires in 1 hour.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr><td style="background:#1B4F6B;border-radius:8px;">
              <a href="${resetLink}" style="display:inline-block;padding:16px 32px;font-size:1rem;font-weight:600;color:#ffffff;text-decoration:none;">Set up my password &rarr;</a>
            </td></tr>
          </table>
          <p style="margin:0 0 16px;font-size:0.82rem;color:#999;line-height:1.6;">
            If the button doesn't work, copy and paste this link:<br>
            <a href="${resetLink}" style="color:#2E7DA3;word-break:break-all;">${resetLink}</a>
          </p>
          <p style="margin:0;font-size:0.82rem;color:#999;line-height:1.6;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #E5E5E5;text-align:center;">
          <p style="margin:0;font-size:0.78rem;color:#999;line-height:1.6;">
            Afterword · <a href="https://www.myafterword.co" style="color:#2E7DA3;text-decoration:none;">myafterword.co</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

export function passingNotificationEmail(
  fullName: string,
  deathYear: number,
  reporterName: string | null,
  memorialUrl: string,
): { subject: string; html: string } {
  return {
    subject: `Passing reported: ${fullName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#EEF7FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF7FC;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#0f2d3d,#1B4F6B);padding:32px 40px;text-align:center;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:1.5rem;color:#ffffff;letter-spacing:0.04em;">Afterword</p>
        </td></tr>
        <tr><td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:1.4rem;color:#1B4F6B;line-height:1.3;">A passing has been reported</h1>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #E5E5E5;">
              <p style="margin:0 0 2px;font-size:0.82rem;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Name</p>
              <p style="margin:0;font-size:0.95rem;color:#1A1A1A;">${fullName}</p>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #E5E5E5;">
              <p style="margin:0 0 2px;font-size:0.82rem;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Year of passing</p>
              <p style="margin:0;font-size:0.95rem;color:#1A1A1A;">${deathYear}</p>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #E5E5E5;">
              <p style="margin:0 0 2px;font-size:0.82rem;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Reported by</p>
              <p style="margin:0;font-size:0.95rem;color:#1A1A1A;">${reporterName ?? "Not given"}</p>
            </td></tr>
            <tr><td style="padding:10px 0;">
              <p style="margin:0 0 2px;font-size:0.82rem;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Memorial page</p>
              <p style="margin:0;font-size:0.95rem;"><a href="${memorialUrl}" style="color:#2E7DA3;">${memorialUrl}</a></p>
            </td></tr>
          </table>
          <p style="margin:0;font-size:0.85rem;color:#666;line-height:1.7;">
            The page has been updated automatically. No action is required unless you would like to follow up with the family.
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #E5E5E5;text-align:center;">
          <p style="margin:0;font-size:0.78rem;color:#999;">Afterword · <a href="https://www.myafterword.co" style="color:#2E7DA3;">myafterword.co</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

export function purchaseConfirmationEmail(customerEmail: string, firstName?: string): { subject: string; html: string } {
  const name = firstName ?? "there";
  return {
    subject: "You're in. Your Afterword story starts now.",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF7FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF7FC;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0f2d3d,#1B4F6B);padding:32px 40px;text-align:center;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:1.5rem;color:#ffffff;letter-spacing:0.04em;">Afterword</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:1.6rem;color:#1B4F6B;line-height:1.2;">Hi ${name}, you're in.</h1>
          <p style="margin:0 0 20px;font-size:1rem;color:#555;line-height:1.7;">
            Your Afterword page has been created and your QR plaque order is confirmed. Here's what happens next:
          </p>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
            ${[
              ["Your memorial page", "Reserved and ready for you to fill in at your own pace."],
              ["Your QR plaque", "Shipping within 10 business days to the address you provided."],
              ["Permanent hosting", "Active from today. No renewals, ever."],
            ].map(([title, desc]) => `
            <tr><td style="padding:12px 0;border-bottom:1px solid #E5E5E5;">
              <p style="margin:0 0 2px;font-size:0.9rem;font-weight:600;color:#1B4F6B;">${title}</p>
              <p style="margin:0;font-size:0.875rem;color:#666;line-height:1.6;">${desc}</p>
            </td></tr>`).join("")}
          </table>
          <p style="margin:0 0 24px;font-size:1rem;color:#555;line-height:1.7;">
            Log in any time to start writing your story. Most people finish their first pass in a single afternoon.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
            <tr><td style="background:#1B4F6B;border-radius:8px;">
              <a href="https://www.myafterword.co/login" style="display:inline-block;padding:16px 32px;font-size:1rem;font-weight:600;color:#ffffff;text-decoration:none;">Start writing my story &rarr;</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Founder note -->
        <tr><td style="padding:24px 40px;background:#FDF3DC;">
          <p style="margin:0;font-size:0.875rem;color:#7A5C1E;line-height:1.7;">
            <strong>A note from Scott:</strong> Thank you for being an early Afterword customer. If you have any questions at any point, reply to this email and I'll get back to you personally.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #E5E5E5;text-align:center;">
          <p style="margin:0;font-size:0.78rem;color:#999;line-height:1.6;">
            Afterword · <a href="https://www.myafterword.co" style="color:#2E7DA3;text-decoration:none;">myafterword.co</a><br>
            ${customerEmail}
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

// ---------------------------------------------------------------------------
// Reminder emails — sent by the daily cron job
// ---------------------------------------------------------------------------

/** Shared email chrome so all reminder emails look consistent */
function reminderShell(bodyHtml: string, customerEmail: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF7FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF7FC;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#0f2d3d,#1B4F6B);padding:32px 40px;text-align:center;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:1.5rem;color:#ffffff;letter-spacing:0.04em;">Afterword</p>
        </td></tr>
        ${bodyHtml}
        <tr><td style="padding:24px 40px;border-top:1px solid #E5E5E5;text-align:center;">
          <p style="margin:0;font-size:0.78rem;color:#999;line-height:1.6;">
            Afterword · <a href="https://www.myafterword.co" style="color:#2E7DA3;text-decoration:none;">myafterword.co</a><br>
            ${customerEmail}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `
  <table cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
    <tr><td style="background:#1B4F6B;border-radius:8px;">
      <a href="${href}" style="display:inline-block;padding:16px 32px;font-size:1rem;font-weight:600;color:#ffffff;text-decoration:none;">${label}</a>
    </td></tr>
  </table>`;
}

/**
 * Day 3 — gentle nudge for users who haven't started writing at all.
 */
export function reminderDay3Email(customerEmail: string, firstName?: string): { subject: string; html: string } {
  const name = firstName ?? "there";
  const loginUrl = "https://www.myafterword.co/login";
  return {
    subject: "Your Afterword page is waiting for you",
    html: reminderShell(`
      <tr><td style="padding:40px 40px 32px;">
        <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:1.6rem;color:#1B4F6B;line-height:1.2;">Hi ${name}, your page is ready.</h1>
        <p style="margin:0 0 20px;font-size:1rem;color:#555;line-height:1.75;">
          Your Afterword page has been created and is waiting for your story. Most people find the first section — your roots, where you came from — the easiest place to begin.
        </p>
        <p style="margin:0 0 28px;font-size:1rem;color:#555;line-height:1.75;">
          There's no rush and no wrong way to do it. Just your words, at your own pace.
        </p>
        ${ctaButton(loginUrl, "Start writing my story →")}
      </td></tr>
      <tr><td style="padding:20px 40px 28px;background:#FAFAFA;border-top:1px solid #E5E5E5;">
        <p style="margin:0;font-size:0.82rem;color:#888;line-height:1.7;">
          <strong style="color:#555;">A tip:</strong> Set aside 20 quiet minutes and just answer the first question. You'll surprise yourself with what comes out.
        </p>
      </td></tr>`, customerEmail),
  };
}

/**
 * Day 7 — encouragement for users who've started but haven't finished.
 */
export function reminderDay7Email(customerEmail: string, firstName?: string, sectionsComplete?: number): { subject: string; html: string } {
  const name = firstName ?? "there";
  const count = sectionsComplete ?? 1;
  const loginUrl = "https://www.myafterword.co/login";
  return {
    subject: "You've started something important — keep going",
    html: reminderShell(`
      <tr><td style="padding:40px 40px 32px;">
        <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:1.6rem;color:#1B4F6B;line-height:1.2;">You've made a start, ${name}.</h1>
        <p style="margin:0 0 20px;font-size:1rem;color:#555;line-height:1.75;">
          You've completed ${count} of 7 sections. The people who matter most to you will one day read every word — and the ones still to come are often the most meaningful.
        </p>
        <p style="margin:0 0 28px;font-size:1rem;color:#555;line-height:1.75;">
          Pick up where you left off. It doesn't have to be perfect — it just has to be yours.
        </p>
        ${ctaButton(loginUrl, "Continue my story →")}
      </td></tr>`, customerEmail),
  };
}

/**
 * Day 14 — contributor invite nudge. Goes to anyone who hasn't invited
 * a contributor yet, regardless of how much they've written.
 */
export function reminderDay14InviteEmail(customerEmail: string, firstName?: string, dashboardUrl?: string): { subject: string; html: string } {
  const name = firstName ?? "there";
  const url = dashboardUrl ?? "https://www.myafterword.co/dashboard";
  return {
    subject: "Your story isn't just yours to tell",
    html: reminderShell(`
      <tr><td style="padding:40px 40px 32px;">
        <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:1.6rem;color:#1B4F6B;line-height:1.2;">The people who know you have stories only they can tell.</h1>
        <p style="margin:0 0 20px;font-size:1rem;color:#555;line-height:1.75;">
          A memory of you as a child. The version of you only your best friend saw. The moment that changed someone's life because of something you did.
        </p>
        <p style="margin:0 0 20px;font-size:1rem;color:#555;line-height:1.75;">
          Afterword lets you invite the people closest to you to contribute their own memories to your page — in their words, not yours.
        </p>
        <p style="margin:0 0 28px;font-size:1rem;color:#555;line-height:1.75;">
          And as a thank-you, anyone you invite will receive <strong>10% off</strong> if they decide to start their own Afterword.
        </p>
        ${ctaButton(url, "Invite someone who knows me →")}
      </td></tr>
      <tr><td style="padding:20px 40px 28px;background:#EEF7FC;border-top:1px solid #D6EAF4;">
        <p style="margin:0;font-size:0.85rem;color:#1B4F6B;line-height:1.7;">
          It takes less than a minute. Your dashboard has everything you need.
        </p>
      </td></tr>`, customerEmail),
  };
}

/**
 * Day 30 — final personal note from Scott for users who've barely started.
 */
/**
 * Contributor invite — sent on the author's behalf when they enter an email
 * in the dashboard. The recipient clicks through to /contribute/[token].
 */
export function contributorInviteEmail(
  inviteUrl: string,
  authorFirstName: string,
  authorFullName: string,
  recipientEmail: string,
  referredAs: "he" | "she" | "they" = "they",
): { subject: string; html: string } {
  // Build pronoun set from the author's profile preference
  const p = referredAs === "he"
    ? { sub: "he", pos: "his", obj: "him", wouldContr: "he’d", hasContr: "He’s", tells: "tells", loves: "loves" }
    : referredAs === "she"
    ? { sub: "she", pos: "her", obj: "her", wouldContr: "she’d", hasContr: "She’s", tells: "tells", loves: "loves" }
    : { sub: "they", pos: "their", obj: "them", wouldContr: "they’d", hasContr: "They’ve", tells: "tell", loves: "love" };

  return {
    subject: `${authorFirstName} is writing ${p.pos} life story — ${p.wouldContr} love a memory from you`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF7FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF7FC;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0f2d3d,#1B4F6B);padding:32px 40px;text-align:center;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:1.5rem;color:#ffffff;letter-spacing:0.04em;">Afterword</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:1.5rem;color:#1B4F6B;line-height:1.25;">
            ${authorFirstName} is writing ${p.pos} life story.
          </h1>
          <p style="margin:0 0 16px;font-size:1rem;color:#555;line-height:1.75;">
            ${authorFullName} is building ${p.pos} Afterword — a permanent page where ${p.sub} ${p.tells} ${p.pos} own story, in ${p.pos} own words. ${p.pos.charAt(0).toUpperCase() + p.pos.slice(1)} memories. ${p.pos.charAt(0).toUpperCase() + p.pos.slice(1)} values. A message to the people ${p.sub} ${p.loves}.
          </p>
          <p style="margin:0 0 16px;font-size:1rem;color:#555;line-height:1.75;">
            ${p.hasContr} asked us to reach out to you personally. There’s a memory only you could share — something you saw, something you shared with ${p.obj}, a version of ${authorFirstName} that only you know.
          </p>
          <p style="margin:0 0 28px;font-size:1rem;color:#555;line-height:1.75;">
            It takes just a few minutes. Your words will become part of ${authorFirstName}'s story, permanently.
          </p>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
            <tr><td style="background:#1B4F6B;border-radius:8px;">
              <a href="${inviteUrl}" style="display:inline-block;padding:16px 32px;font-size:1rem;font-weight:600;color:#ffffff;text-decoration:none;">Share a memory about ${authorFirstName} &rarr;</a>
            </td></tr>
          </table>

          <p style="margin:0;font-size:0.82rem;color:#999;line-height:1.6;">
            If the button doesn't work, copy and paste this link:<br>
            <a href="${inviteUrl}" style="color:#2E7DA3;word-break:break-all;">${inviteUrl}</a>
          </p>
        </td></tr>

        <!-- What is Afterword -->
        <tr><td style="padding:24px 40px;background:#EEF7FC;border-top:1px solid #D6EAF4;">
          <p style="margin:0 0 6px;font-size:0.78rem;font-weight:700;color:#1B4F6B;text-transform:uppercase;letter-spacing:0.08em;">What is Afterword?</p>
          <p style="margin:0;font-size:0.85rem;color:#555;line-height:1.7;">
            Afterword is where people write their own story while they still can — in their own voice, on their own terms. The page lives permanently, accessible to family whenever it's needed. <a href="https://www.myafterword.co" style="color:#2E7DA3;text-decoration:none;">Learn more</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #E5E5E5;text-align:center;">
          <p style="margin:0;font-size:0.75rem;color:#bbb;line-height:1.6;">
            You received this because ${authorFirstName} personally invited you.<br>
            If this wasn't meant for you, you can safely ignore it.<br><br>
            Afterword · <a href="https://www.myafterword.co" style="color:#2E7DA3;text-decoration:none;">myafterword.co</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

/**
 * Sent to the Afterword author when a contributor submits a memory.
 * Notifies them to review + approve, and nudges them to invite more people.
 */
export function contributionNotificationEmail(
  authorFirstName: string,
  contributorName: string,
  contributorRelationship: string,
  memoryExcerpt: string,
  dashboardUrl: string,
): { subject: string; html: string } {
  const excerpt = memoryExcerpt.length > 200 ? memoryExcerpt.slice(0, 197) + "…" : memoryExcerpt;
  return {
    subject: `${contributorName} shared a memory about you — ready to review`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF7FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF7FC;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0f2d3d,#1B4F6B);padding:32px 40px;text-align:center;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:1.5rem;color:#ffffff;letter-spacing:0.04em;">Afterword</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:1.5rem;color:#1B4F6B;line-height:1.25;">
            ${contributorName} shared a memory about you.
          </h1>
          <p style="margin:0 0 16px;font-size:1rem;color:#555;line-height:1.75;">
            Hi ${authorFirstName} — <strong>${contributorName}</strong> (${contributorRelationship}) just added a memory to your Afterword page. Here's what they wrote:
          </p>

          <!-- Memory excerpt -->
          <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
            <tr><td style="background:#EEF7FC;border-left:4px solid #2E7DA3;border-radius:0 8px 8px 0;padding:16px 20px;">
              <p style="margin:0;font-size:0.95rem;color:#444;line-height:1.75;font-style:italic;">&ldquo;${excerpt}&rdquo;</p>
            </td></tr>
          </table>

          <p style="margin:0 0 28px;font-size:1rem;color:#555;line-height:1.75;">
            Log in to approve it and add it to your page — or decline it if it's not right. You stay in control of everything that appears.
          </p>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
            <tr><td style="background:#1B4F6B;border-radius:8px;">
              <a href="${dashboardUrl}" style="display:inline-block;padding:16px 32px;font-size:1rem;font-weight:600;color:#ffffff;text-decoration:none;">Review ${contributorName}&rsquo;s memory &rarr;</a>
            </td></tr>
          </table>

          <!-- Invite nudge -->
          <table cellpadding="0" cellspacing="0" width="100%" style="margin:0;">
            <tr><td style="background:#F9F5EE;border:1px solid #E8DFC8;border-radius:10px;padding:20px 24px;">
              <p style="margin:0 0 8px;font-size:0.78rem;font-weight:700;color:#C9932A;text-transform:uppercase;letter-spacing:0.08em;">While you&rsquo;re thinking about it</p>
              <p style="margin:0 0 14px;font-size:0.9rem;color:#555;line-height:1.7;">
                Is there anyone else whose memory you&rsquo;d want on your page? The more voices, the richer your story.
              </p>
              <a href="${dashboardUrl}" style="font-size:0.88rem;font-weight:600;color:#1B4F6B;text-decoration:none;">Invite someone else from your dashboard &rarr;</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #E5E5E5;text-align:center;">
          <p style="margin:0;font-size:0.75rem;color:#bbb;line-height:1.6;">
            Afterword · <a href="https://www.myafterword.co" style="color:#2E7DA3;text-decoration:none;">myafterword.co</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

export function reminderDay30Email(customerEmail: string, firstName?: string): { subject: string; html: string } {
  const name = firstName ?? "there";
  const loginUrl = "https://www.myafterword.co/login";
  return {
    subject: "A note from Scott",
    html: reminderShell(`
      <tr><td style="padding:40px 40px 32px;">
        <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:1.6rem;color:#1B4F6B;line-height:1.2;">Hi ${name},</h1>
        <p style="margin:0 0 20px;font-size:1rem;color:#555;line-height:1.75;">
          I noticed you haven't had a chance to write much of your Afterword yet, and I wanted to reach out personally.
        </p>
        <p style="margin:0 0 20px;font-size:1rem;color:#555;line-height:1.75;">
          I know life gets in the way. I built Afterword because I watched my own family lose stories that could never be recovered — and I don't want that to happen to the people you love.
        </p>
        <p style="margin:0 0 28px;font-size:1rem;color:#555;line-height:1.75;">
          If anything about the questions feels off, or if there's something I can do to make the experience better for you, just reply to this email. I read every one.
        </p>
        ${ctaButton(loginUrl, "Pick up where I left off →")}
      </td></tr>
      <tr><td style="padding:20px 40px 28px;background:#FDF3DC;border-top:1px solid #F0D89A;">
        <p style="margin:0;font-size:0.875rem;color:#7A5C1E;line-height:1.7;">
          — Scott Faverty, founder of Afterword
        </p>
      </td></tr>`, customerEmail),
  };
}
