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
