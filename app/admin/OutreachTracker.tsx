"use client";

import { useEffect, useState } from "react";

type OutreachStatus = "to_contact" | "reached_out" | "interested" | "signed_up" | "not_interested";

type Contact = {
  id: string;
  name: string;
  relationship: "family" | "friend";
  notes: string | null;
  status: OutreachStatus;
  sort_order: number;
  updated_at: string;
};

const STATUS_META: Record<OutreachStatus, { label: string; bg: string; color: string }> = {
  to_contact:      { label: "To contact",     bg: "#F3F4F6", color: "#6B7280" },
  reached_out:     { label: "Reached out",    bg: "#EEF7FC", color: "#1B4F6B" },
  interested:      { label: "Interested",     bg: "#FDF3DC", color: "#C9932A" },
  signed_up:       { label: "Signed up",      bg: "#D4EDDA", color: "#155724" },
  not_interested:  { label: "Not interested", bg: "#FDE8E8", color: "#9B2335" },
};

const ALL_STATUSES = Object.keys(STATUS_META) as OutreachStatus[];

export default function OutreachTracker() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [filterStatus, setFilterStatus] = useState<OutreachStatus | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addRel, setAddRel] = useState<"family" | "friend">("friend");
  const [addNotes, setAddNotes] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/outreach");
      const data = await res.json() as Contact[];
      setContacts(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: OutreachStatus) {
    setSaving(id);
    try {
      await fetch("/api/admin/outreach", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status, updated_at: new Date().toISOString() } : c));
    } finally {
      setSaving(null);
    }
  }

  async function saveNotes(id: string) {
    setSaving(id);
    try {
      await fetch("/api/admin/outreach", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes: noteDraft.trim() || null }),
      });
      setContacts((prev) => prev.map((c) => c.id === id ? { ...c, notes: noteDraft.trim() || null } : c));
    } finally {
      setSaving(null);
      setEditingNotes(null);
    }
  }

  async function addContact() {
    if (!addName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: addName.trim(), relationship: addRel, notes: addNotes.trim() || undefined }),
      });
      const created = await res.json() as Contact;
      setContacts((prev) => [...prev, created]);
      setAddName(""); setAddNotes(""); setShowAdd(false);
    } finally {
      setAdding(false);
    }
  }

  // Summary counts
  const counts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = contacts.filter((c) => c.status === s).length;
    return acc;
  }, {});

  const visible = filterStatus === "all"
    ? contacts
    : contacts.filter((c) => c.status === filterStatus);

  const family = visible.filter((c) => c.relationship === "family");
  const friends = visible.filter((c) => c.relationship === "friend");

  if (loading) return <div style={{ padding: "40px", color: "#999", fontSize: "0.85rem" }}>Loading…</div>;
  if (error) return <div style={{ padding: "40px", color: "#C9932A", fontSize: "0.85rem" }}>{error}</div>;

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
        {ALL_STATUSES.map((s) => {
          const m = STATUS_META[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: `1px solid ${filterStatus === s ? m.color : "#E5E5E5"}`,
                backgroundColor: filterStatus === s ? m.bg : "#fff",
                color: m.color,
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: m.bg,
                  border: `1px solid ${m.color}`,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: m.color,
                }}
              >
                {counts[s]}
              </span>
              {m.label}
            </button>
          );
        })}
        <button
          onClick={() => setFilterStatus("all")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #E5E5E5",
            backgroundColor: filterStatus === "all" ? "#F3F4F6" : "#fff",
            color: "#555",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          All ({contacts.length})
        </button>
      </div>

      {/* Contact groups */}
      {[{ label: "Family", rows: family }, { label: "Friends", rows: friends }].map(({ label, rows }) =>
        rows.length === 0 ? null : (
          <div key={label} style={{ marginBottom: "32px" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>
              {label}
            </div>
            <div style={{ borderRadius: "10px", border: "1px solid #F0F0F0", overflow: "hidden" }}>
              {rows.map((c, i) => {
                const m = STATUS_META[c.status];
                const isEditingNote = editingNotes === c.id;
                return (
                  <div
                    key={c.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 180px 1fr",
                      alignItems: "start",
                      gap: "12px",
                      padding: "14px 20px",
                      borderBottom: i < rows.length - 1 ? "1px solid #F5F5F5" : "none",
                      backgroundColor: saving === c.id ? "#FAFAFA" : "#fff",
                    }}
                  >
                    {/* Name + notes */}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1A1A1A" }}>{c.name}</div>
                      {isEditingNote ? (
                        <div style={{ marginTop: "6px", display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            autoFocus
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveNotes(c.id); if (e.key === "Escape") setEditingNotes(null); }}
                            style={{ fontSize: "0.78rem", border: "1px solid #D0D0D0", borderRadius: "4px", padding: "3px 8px", width: "220px" }}
                          />
                          <button onClick={() => saveNotes(c.id)} style={{ fontSize: "0.72rem", color: "#1B4F6B", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Save</button>
                          <button onClick={() => setEditingNotes(null)} style={{ fontSize: "0.72rem", color: "#999", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
                        </div>
                      ) : (
                        <div
                          onClick={() => { setEditingNotes(c.id); setNoteDraft(c.notes ?? ""); }}
                          style={{ fontSize: "0.78rem", color: c.notes ? "#666" : "#CCC", marginTop: "3px", cursor: "text" }}
                        >
                          {c.notes ?? "Add a note…"}
                        </div>
                      )}
                    </div>

                    {/* Status dropdown */}
                    <div>
                      <select
                        value={c.status}
                        onChange={(e) => updateStatus(c.id, e.target.value as OutreachStatus)}
                        disabled={saving === c.id}
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: m.color,
                          backgroundColor: m.bg,
                          border: `1px solid ${m.color}40`,
                          borderRadius: "6px",
                          padding: "5px 10px",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_META[s].label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Updated */}
                    <div style={{ fontSize: "0.72rem", color: "#CCC", textAlign: "right", paddingTop: "4px" }}>
                      {c.updated_at !== c.updated_at /* always false, just for type */ ? "" :
                        new Date(c.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* Add contact */}
      <div style={{ marginTop: "8px" }}>
        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            style={{ fontSize: "0.8rem", color: "#1B4F6B", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}
          >
            + Add contact
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", padding: "16px 20px", backgroundColor: "#F9F9F9", borderRadius: "10px", border: "1px solid #E5E5E5" }}>
            <input
              autoFocus
              placeholder="Name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              style={{ fontSize: "0.82rem", border: "1px solid #D0D0D0", borderRadius: "6px", padding: "6px 12px", width: "180px" }}
            />
            <select
              value={addRel}
              onChange={(e) => setAddRel(e.target.value as "family" | "friend")}
              style={{ fontSize: "0.82rem", border: "1px solid #D0D0D0", borderRadius: "6px", padding: "6px 10px" }}
            >
              <option value="friend">Friend</option>
              <option value="family">Family</option>
            </select>
            <input
              placeholder="Notes (optional)"
              value={addNotes}
              onChange={(e) => setAddNotes(e.target.value)}
              style={{ fontSize: "0.82rem", border: "1px solid #D0D0D0", borderRadius: "6px", padding: "6px 12px", width: "220px" }}
            />
            <button
              onClick={addContact}
              disabled={adding || !addName.trim()}
              style={{ fontSize: "0.82rem", backgroundColor: "#1B4F6B", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 16px", cursor: "pointer", fontWeight: 600, opacity: adding || !addName.trim() ? 0.5 : 1 }}
            >
              {adding ? "Adding…" : "Add"}
            </button>
            <button
              onClick={() => { setShowAdd(false); setAddName(""); setAddNotes(""); }}
              style={{ fontSize: "0.82rem", color: "#999", background: "none", border: "none", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
