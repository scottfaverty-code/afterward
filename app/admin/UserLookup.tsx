"use client";

import { useState } from "react";

type UserInfo = {
  found: boolean;
  id?: string;
  email?: string;
  createdAt?: string;
  lastSignIn?: string | null;
  emailConfirmed?: boolean;
  emailConfirmedAt?: string | null;
  hasPassword?: boolean;
  purchase?: {
    id: string;
    plaque_status: string;
    created_at: string;
    amount_paid: number | null;
  } | null;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    memorial_slug: string | null;
    page_is_public: boolean;
  } | null;
  magicLink?: string | null;
  magicLinkError?: string;
};

function fmt(iso: string | null | undefined) {
  if (!iso) return "never";
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function UserLookup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UserInfo | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setResult(null);
    setCopied(false);
    try {
      const res = await fetch("/api/admin/user-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), action: "lookup" }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  }

  async function generateMagicLink() {
    if (!result?.email) return;
    setGeneratingLink(true);
    setCopied(false);
    try {
      const res = await fetch("/api/admin/user-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: result.email, action: "magic_link" }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      alert("Failed to generate link");
    } finally {
      setGeneratingLink(false);
    }
  }

  function copyLink() {
    if (!result?.magicLink) return;
    navigator.clipboard.writeText(result.magicLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  const pill = (label: string, ok: boolean) => (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "999px",
        fontSize: "0.72rem",
        fontWeight: 600,
        backgroundColor: ok ? "#d4edda" : "#FDF3DC",
        color: ok ? "#155724" : "#C9932A",
      }}
    >
      {label}
    </span>
  );

  return (
    <div style={{ padding: "20px 24px" }}>
      <p style={{ fontSize: "0.82rem", color: "#666", marginBottom: "16px" }}>
        Look up any registered user by email address, check their account status, and generate a direct login link if needed.
      </p>

      <form onSubmit={lookup} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@email.com"
          required
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #E5E5E5",
            fontSize: "0.9rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "#1B4F6B",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Looking up…" : "Look up"}
        </button>
      </form>

      {result && !result.found && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "8px",
            backgroundColor: "#FDF3DC",
            color: "#C9932A",
            fontSize: "0.875rem",
          }}
        >
          No account found for <strong>{email}</strong>. They may not have completed sign-up, or may have used a different email address.
        </div>
      )}

      {result && result.found && (
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid #E5E5E5",
            overflow: "hidden",
          }}
        >
          {/* User header */}
          <div
            style={{
              padding: "14px 16px",
              backgroundColor: "#F4F7FA",
              borderBottom: "1px solid #E5E5E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1A1A1A" }}>
                {result.profile?.first_name && result.profile?.last_name
                  ? `${result.profile.first_name} ${result.profile.last_name}`
                  : result.email}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#999", marginTop: "2px" }}>
                {result.email} &middot; Joined {fmt(result.createdAt)}
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {pill(result.emailConfirmed ? "Email confirmed" : "Email NOT confirmed", !!result.emailConfirmed)}
              {pill(result.purchase ? "Purchased" : "No purchase", !!result.purchase)}
              {result.profile?.page_is_public !== undefined &&
                pill(result.profile.page_is_public ? "Page live" : "Page draft", !!result.profile?.page_is_public)}
            </div>
          </div>

          {/* Details grid */}
          <div
            style={{
              padding: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              { label: "Last sign in", value: fmt(result.lastSignIn) },
              { label: "Email confirmed at", value: fmt(result.emailConfirmedAt) },
              { label: "Auth method", value: result.hasPassword ? "Email + password" : "Passwordless / social" },
              { label: "Memorial slug", value: result.profile?.memorial_slug ?? "Not set" },
              {
                label: "Purchase",
                value: result.purchase
                  ? `${result.purchase.plaque_status} (${result.purchase.amount_paid != null ? "$" + (result.purchase.amount_paid / 100).toFixed(2) : "?"} on ${fmt(result.purchase.created_at)})`
                  : "None",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#999", marginBottom: "3px" }}>
                  {label}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#333" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div
            style={{
              padding: "14px 16px",
              borderTop: "1px solid #F0F0F0",
              backgroundColor: "#FAFAFA",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#666", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Support actions
            </div>

            {!result.emailConfirmed && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "#FDF3DC",
                  color: "#C9932A",
                  fontSize: "0.8rem",
                  marginBottom: "12px",
                }}
              >
                <strong>Confirmation email not received.</strong>{" "}
                {result.hasPassword
                  ? "Generate a magic link below. It bypasses email confirmation and takes them straight to their dashboard."
                  : "This user hasn't set a password yet. Generate a magic link below — it will log them in and take them to the password setup page first, then into their dashboard."}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={generateMagicLink}
                disabled={generatingLink}
                style={{
                  padding: "9px 18px",
                  borderRadius: "8px",
                  backgroundColor: "#1B4F6B",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: generatingLink ? "not-allowed" : "pointer",
                  opacity: generatingLink ? 0.6 : 1,
                }}
              >
                {generatingLink
                  ? "Generating…"
                  : result.hasPassword
                  ? "Generate magic login link"
                  : "Generate setup + login link"}
              </button>
              {result.profile?.memorial_slug && (
                <a
                  href={`/memorial/${result.profile.memorial_slug}`}
                  target="_blank"
                  style={{
                    padding: "9px 18px",
                    borderRadius: "8px",
                    border: "1px solid #E5E5E5",
                    color: "#1B4F6B",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    textDecoration: "none",
                    backgroundColor: "#fff",
                  }}
                >
                  View memorial page &rarr;
                </a>
              )}
            </div>

            {result.magicLinkError && (
              <div style={{ marginTop: "12px", color: "#c0392b", fontSize: "0.82rem" }}>
                Error generating link: {result.magicLinkError}
              </div>
            )}

            {result.magicLink && (
              <div style={{ marginTop: "14px" }}>
                <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "6px" }}>
                  Copy this link and send it to the customer. It&apos;s single-use and expires after 1 hour.
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    backgroundColor: "#EEF7FC",
                    borderRadius: "8px",
                    padding: "10px 12px",
                  }}
                >
                  <code
                    style={{
                      flex: 1,
                      fontSize: "0.72rem",
                      color: "#1B4F6B",
                      wordBreak: "break-all",
                      lineHeight: "1.5",
                    }}
                  >
                    {result.magicLink}
                  </code>
                  <button
                    onClick={copyLink}
                    style={{
                      flexShrink: 0,
                      padding: "6px 14px",
                      borderRadius: "6px",
                      backgroundColor: copied ? "#155724" : "#1B4F6B",
                      color: "#fff",
                      border: "none",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                    }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
