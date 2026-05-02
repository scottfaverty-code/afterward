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
  used_at: string | null;
  created_at: string;
};

export default function ContributionsCard() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  const appUrl = typeof window !== "undefined"
    ? window.location.origin
    : "https://www.myafterword.co";

  const load = useCallback(async () => {
    const res = await fetch("/api/user/contributions/invite");
    if (!res.ok) return;
    const data = await res.json();
    setInvites(data.invites ?? []);
    setContributions(data.contributions ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreateInvite() {
    setCreating(true);
    const res = await fetch("/api/user/contributions/invite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const data = await res.json();
    if (res.ok) {
      setInvites((prev) => [data.invite, ...prev]);
      // Auto-copy the link
      await navigator.clipboard.writeText(data.invite_url).catch(() => {});
      setCopiedToken(data.invite.token);
      setTimeout(() => setCopiedToken(null), 3000);
    }
    setCreating(false);
  }

  async function copyLink(token: string) {
    const url = `${appUrl}/contribute/${token}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 className="font-bold" style={{ fontSize: "1rem", color: "#1A1A1A", marginBottom: "2px" }}>
            Invite contributions
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#999" }}>
            Let the people who know you add their memories to your page.
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

      {/* Pending approvals — show first, most urgent */}
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

      {/* Create invite */}
      <button
        onClick={handleCreateInvite}
        disabled={creating}
        style={{
          width: "100%",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "1px dashed #D6EAF4",
          backgroundColor: "#EEF7FC",
          color: "#1B4F6B",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: creating ? "default" : "pointer",
          opacity: creating ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginBottom: invites.length > 0 ? "16px" : "0",
        }}
      >
        {creating ? "Creating link…" : (
          <>
            <span style={{ fontSize: "1rem" }}>+</span>
            {invites.length === 0 ? "Create your first invite link" : "Create another invite link"}
          </>
        )}
      </button>

      {/* Invite list */}
      {invites.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {invites.map((inv) => (
            <div
              key={inv.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "#FAFAFA",
                border: "1px solid #F0F0F0",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "0.8rem", color: "#555", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  /contribute/{inv.token}
                </div>
                {inv.used_at && (
                  <div style={{ fontSize: "0.7rem", color: "#2E7DA3", marginTop: "2px" }}>Used ✓</div>
                )}
              </div>
              <button
                onClick={() => copyLink(inv.token)}
                style={{
                  flexShrink: 0,
                  padding: "5px 12px",
                  borderRadius: "6px",
                  border: "1px solid #D6EAF4",
                  backgroundColor: copiedToken === inv.token ? "#1B4F6B" : "#EEF7FC",
                  color: copiedToken === inv.token ? "#fff" : "#1B4F6B",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {copiedToken === inv.token ? "Copied ✓" : "Copy link"}
              </button>
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
