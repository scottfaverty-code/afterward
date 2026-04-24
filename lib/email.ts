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
            Afterword &mdash; <a href="https://www.myafterword.co" style="color:#2E7DA3;text-decoration:none;">myafterword.co</a><br>
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
    subject: "Reset your Afterword password",
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
          <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:1.6rem;color:#1B4F6B;line-height:1.2;">Reset your password</h1>
          <p style="margin:0 0 24px;font-size:1rem;color:#555;line-height:1.7;">
            We received a request to reset your Afterword password. Click below to choose a new one. This link expires in 1 hour.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr><td style="background:#1B4F6B;border-radius:8px;">
              <a href="${resetLink}" style="display:inline-block;padding:16px 32px;font-size:1rem;font-weight:600;color:#ffffff;text-decoration:none;">Reset my password &rarr;</a>
            </td></tr>
          </table>
          <p style="margin:0 0 16px;font-size:0.82rem;color:#999;line-height:1.6;">
            If the button doesn't work, copy and paste this link:<br>
            <a href="${resetLink}" style="color:#2E7DA3;word-break:break-all;">${resetLink}</a>
          </p>
          <p style="margin:0;font-size:0.82rem;color:#999;line-height:1.6;">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #E5E5E5;text-align:center;">
          <p style="margin:0;font-size:0.78rem;color:#999;line-height:1.6;">
            Afterword &mdash; <a href="https://www.myafterword.co" style="color:#2E7DA3;text-decoration:none;">myafterword.co</a>
          </p>
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
            Afterword &mdash; <a href="https://www.myafterword.co" style="color:#2E7DA3;text-decoration:none;">myafterword.co</a><br>
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
