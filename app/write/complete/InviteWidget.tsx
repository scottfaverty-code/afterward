"use client";

import { useState } from "react";

export default function InviteWidget() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  async function handleSend() {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user/contributions/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, label: name.trim() || null }),
      });
      if (res.ok) {
        setSent((prev) => [...prev, name.trim() || trimmedEmail]);
        setEmail("");
        setName("");
      } else {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); handleSend(); }
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
          marginBottom: "6px",
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
          marginBottom: "16px",
        }}
      >
        Enter their name and email below. We&apos;ll send them a personal invitation — you approve everything before it appears on your page.
      </p>

      {/* Sent confirmations */}
      {sent.length > 0 && (
        <div style={{ marginBottom: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {sent.map((s, i) => (
            <div key={i} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>✓</span>
              <span>Invitation sent to {s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Name field */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Their name (optional)"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(255,255,255,0.25)",
          backgroundColor: "rgba(255,255,255,0.12)",
          color: "#fff",
          fontSize: "0.88rem",
          marginBottom: "8px",
          outline: "none",
          boxSizing: "border-box",
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Email + Send row */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          placeholder="Their email address"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "6px",
            border: `1px solid ${error ? "#f87171" : "rgba(255,255,255,0.25)"}`,
            backgroundColor: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: "0.88rem",
            outline: "none",
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            flexShrink: 0,
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: loading ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.22)",
            color: "#fff",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            whiteSpace: "nowrap",
            transition: "background-color 0.15s",
          }}
        >
          {loading ? "Sending…" : "Send invite"}
        </button>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "#fca5a5", marginTop: "6px" }}>{error}</p>
      )}

      {sent.length > 0 && (
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>
          Add another name and email to send more invitations.
        </p>
      )}
    </div>
  );
}
