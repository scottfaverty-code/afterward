"use client";

import { useState } from "react";

type BetaResult = {
  email: string;
  magicLink: string;
};

export default function CreateBetaAccount() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<BetaResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) return;
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/create-beta-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, note: note.trim() || null }),
      });
      const data = await res.json() as { magicLink?: string; error?: string };
      if (!res.ok || !data.magicLink) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setState("error");
        return;
      }
      setResult({ email: trimmed, magicLink: data.magicLink });
      setState("done");
    } catch {
      setErrorMsg("Network error — please try again.");
      setState("error");
    }
  }

  async function copyLink() {
    if (!result) return;
    await navigator.clipboard.writeText(result.magicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function reset() {
    setEmail("");
    setNote("");
    setState("idle");
    setResult(null);
    setCopied(false);
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
        Create beta account
      </h3>
      <p style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.55, marginBottom: 20 }}>
        Creates a free account (no payment required) and generates a magic link you can hand or text to a beta tester.
        Their contributors will still receive the standard 10% discount invite — and those conversions will be attributed back to this account.
      </p>

      {state !== "done" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#555", marginBottom: 5 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="beta@example.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #D6EAF4",
                fontSize: "0.9rem",
                color: "#1A1A1A",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#555", marginBottom: 5 }}>
              Note (optional — for your records)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Met at Marielders, Mariemont — May 2026"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #E5E5E5",
                fontSize: "0.875rem",
                color: "#1A1A1A",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {state === "error" && (
            <div style={{ fontSize: "0.82rem", color: "#c0392b", backgroundColor: "#FFF5F5", padding: "10px 14px", borderRadius: 8 }}>
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={state === "loading" || !email.includes("@")}
            style={{
              padding: "11px 20px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#1B4F6B",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: state === "loading" ? "wait" : "pointer",
              opacity: state === "loading" || !email.includes("@") ? 0.6 : 1,
              alignSelf: "flex-start",
            }}
          >
            {state === "loading" ? "Creating account…" : "Create beta account →"}
          </button>
        </div>
      ) : (
        <div>
          {/* Success card */}
          <div
            style={{
              backgroundColor: "#F6FBF7",
              border: "1px solid #d4edda",
              borderRadius: 12,
              padding: "20px 24px",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  backgroundColor: "#155724",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#155724" }}>
                  Beta account created
                </div>
                <div style={{ fontSize: "0.78rem", color: "#666" }}>{result?.email}</div>
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                Magic link — share this directly
              </div>
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #D6EAF4",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: "0.75rem",
                  color: "#1B4F6B",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                {result?.magicLink}
              </div>
              <button
                onClick={copyLink}
                style={{
                  padding: "9px 18px",
                  borderRadius: 8,
                  border: "1px solid #D6EAF4",
                  backgroundColor: copied ? "#155724" : "#EEF7FC",
                  color: copied ? "#fff" : "#1B4F6B",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {copied ? "✓ Copied!" : "Copy magic link"}
              </button>
            </div>

            <p style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.55, margin: 0 }}>
              This link logs them directly into their new Afterword account. It expires in 24 hours — if they don't use it in time, generate a new one from the User Lookup tab.
            </p>
          </div>

          <button
            onClick={reset}
            style={{
              fontSize: "0.82rem",
              color: "#999",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Create another beta account
          </button>
        </div>
      )}
    </div>
  );
}
