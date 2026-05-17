"use client";

import { useState } from "react";

export default function InviteWidget() {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/user/contributions/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteUrl(data.invite_url);
        await navigator.clipboard.writeText(data.invite_url).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "24px",
        borderRadius: "14px",
        backgroundColor: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
        position: "relative",
        textAlign: "left",
      }}
    >
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        style={{
          position: "absolute",
          top: "12px",
          right: "14px",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.4)",
          fontSize: "1rem",
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        ×
      </button>

      <p
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "1rem",
          color: "#fff",
          lineHeight: "1.55",
          marginBottom: "8px",
          paddingRight: "24px",
        }}
      >
        One more thing — invite someone who knows your story.
      </p>
      <p
        style={{
          fontSize: "0.82rem",
          color: "rgba(255,255,255,0.72)",
          lineHeight: "1.65",
          marginBottom: "18px",
        }}
      >
        The people who've watched you live this life have memories that belong here too. Send them a link — you approve everything before it appears on your page.
      </p>

      {!inviteUrl ? (
        <button
          onClick={handleCreate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.35)",
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "#fff",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating link…" : "Create an invite link"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            readOnly
            value={inviteUrl}
            style={{
              flex: 1,
              fontSize: "0.78rem",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.25)",
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.9)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              flexShrink: 0,
              padding: "10px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: copied ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background-color 0.15s",
            }}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
