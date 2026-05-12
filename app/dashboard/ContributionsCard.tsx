"use client";

import { useState, useEffect, useCallback } from "react";

type Contribution = {
  id: string;
  invite_id: string;
  contributor_name: string;
  contributor_relationship: string;
  memory_text: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type Invite = {
  id: string;
  token: string;
  label: string | null;
  email: string | null;
  used_at: string | null;
  created_at: string;
};

export default function ContributionsCard() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [emailInput, setEmailInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [recentlySent, setRecentlySent] = useState<string | null>(null); // email just sent

  // Approval state
  const [approving, setApproving] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/user/contributions/invite");
    if (!res.ok) return;
    const data = await res.json();
    setInvites(data.invites ?? []);
    setContributions(data.contributions ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSendInvite() {
    const email = emailInput.trim().toLowerCase();
    if (!email || !email.includes("@")) return;
    setSending(true);
    setSendError("");

    const res = await fetch("/api/user/contributions/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, label: labelInput.trim() || null }),
    });
    const data = await res.json() as { invite?: Invite; error?: string };

    if (!res.ok || !data.invite) {
      setSendError(data.error ?? "Something went wrong — please try again.");
      setSending(false);
      return;
    }

    setInvites((prev) => [data.invite!, ...prev]);
    setRecentlySent(email);
    setEmailInput("");
    setLabelInput("");
    setSending(false);
    setTimeout(() => setRecentlySent(null), 4000);
  }

  async function handleApprove(id: string, status: "approved" | "rejected") {
    setApproving(id);
    await fetch("/api/user/contributions/approve", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contribution_id: id, status }),
    });
    setContributions((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    setApproving(null);
  }

  const pending = contributions.filter((c) => c.status === "pending");
  const approved = contributions.filter((c) => c.status === "approved");

  return (
    <div
      className="rounded-2xl p-6 col-span-2"
      style={{ backgroundColor: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h3 className="font-bold" style={{ fontSize: "1rem", color: "#1A1A1A", marginBottom: "2px" }}>
            Invite contributions
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#999" }}>
            Enter an email and we&apos;ll send them a personal invitation on your behalf.
          </p>
        </div>
        {pending.length > 0 && (
          <span
            style={{
              backgroundColor: "#C9932A",
              color: "#fff",
              borderRadius: "20px",
              padding: "3px 10px",
              fontSize: "0.75rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {pending.length} waiting
          </span>
        )}
      </div>

      {/* Pending approvals — show first */}
      {pending.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#C9932A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
            Waiting for your approval
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {pending.map((c) => (
              <div
                key={c.id}
                style={{
                  backgroundColor: "#FDF9F3",
                  borderRadius: "10px",
                  padding: "16px",
                  border: "1px solid #F0E4C8",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1A1A1A" }}>{c.contributor_name}</span>
                    <span style={{ fontSize: "0.8rem", color: "#999", marginLeft: "6px" }}>· {c.contributor_relationship}</span>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#ccc", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#444", lineHeight: "1.65", marginBottom: "14px" }}>
                  &ldquo;{c.memory_text}&rdquo;
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleApprove(c.id, "approved")}
                    disabled={approving === c.id}
                    style={{
                      flex: 1,
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#1B4F6B",
                      color: "#fff",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: approving === c.id ? "default" : "pointer",
                      opacity: approving === c.id ? 0.6 : 1,
                    }}
                  >
                    Add to my page
                  </button>
                  <button
                    onClick={() => handleApprove(c.id, "rejected")}
                    disabled={approving === c.id}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "1px solid #E5E5E5",
                      backgroundColor: "#fff",
                      color: "#999",
                      fontSize: "0.82rem",
                      cursor: approving === c.id ? "default" : "pointer",
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email invite form */}
      <div
        style={{
          backgroundColor: "#F8FBFD",
          borderRadius: "10px",
          border: "1px solid #E0EEF6",
          padding: "16px",
          marginBottom: invites.length > 0 ? "16px" : "0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: "4px" }}>
              Their email address
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setSendError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSendInvite()}
              placeholder="e.g. carol@example.com"
              style={{
                width: "100%",
                padding: "9px 11px",
                borderRadius: "7px",
                border: "1px solid #D6EAF4",
                fontSize: "0.875rem",
                color: "#1A1A1A",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: "4px" }}>
              Who are they to you? <span style={{ fontWeight: 400, color: "#aaa" }}>(optional)</span>
            </label>
            <input
              type="text"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendInvite()}
              placeholder="e.g. My sister Carol, college roommate"
              style={{
                width: "100%",
                padding: "9px 11px",
                borderRadius: "7px",
                border: "1px solid #E5E5E5",
                fontSize: "0.875rem",
                color: "#1A1A1A",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "#fff",
              }}
            />
          </div>

          {sendError && (
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#c0392b" }}>{sendError}</p>
          )}

          {recentlySent && (
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#155724", fontWeight: 600 }}>
              ✓ Invite sent to {recentlySent}
            </p>
          )}

          <button
            onClick={handleSendInvite}
            disabled={sending || !emailInput.includes("@")}
            style={{
              alignSelf: "flex-start",
              padding: "9px 20px",
              borderRadius: "7px",
              border: "none",
              backgroundColor: "#1B4F6B",
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: sending || !emailInput.includes("@") ? "default" : "pointer",
              opacity: sending || !emailInput.includes("@") ? 0.5 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {sending ? "Sending…" : "Send invite"}
          </button>
        </div>
      </div>

      {/* Sent invites list */}
      {!loading && invites.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>
            Invites sent
          </p>
          {invites.map((inv) => (
            <div
              key={inv.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "8px",
                backgroundColor: "#FAFAFA",
                border: "1px solid #F0F0F0",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                  {inv.email ?? `…${inv.token}`}
                </div>
                {inv.label && (
                  <div style={{ fontSize: "0.72rem", color: "#aaa", marginTop: "1px" }}>{inv.label}</div>
                )}
              </div>
              <div style={{ flexShrink: 0, textAlign: "right" }}>
                {inv.used_at ? (
                  <span style={{ fontSize: "0.72rem", color: "#2E7DA3", fontWeight: 700 }}>Memory submitted ✓</span>
                ) : (
                  <span style={{ fontSize: "0.72rem", color: "#bbb" }}>
                    Sent {new Date(inv.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approved count */}
      {approved.length > 0 && !loading && (
        <p style={{ fontSize: "0.78rem", color: "#999", marginTop: "14px", textAlign: "center" }}>
          {approved.length} {approved.length === 1 ? "memory" : "memories"} on your page
        </p>
      )}
    </div>
  );
}
