"use client";

import { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Status = "idea" | "building" | "shipped";

type RoadmapItem = {
  id: string;
  title: string;
  notes: string;
  status: Status;
  category: string;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Shipped features (static record of what's live)
// ---------------------------------------------------------------------------

type ShippedFeature = {
  title: string;
  desc: string;
  tag: string;
};

const SHIPPED: ShippedFeature[] = [
  { title: "Memorial pages with full life story", desc: "Seven guided sections — roots, life built, people, beliefs, proudest moments, letter, and how to be remembered.", tag: "Core" },
  { title: "QR plaque integration", desc: "Every purchase gets a physical QR plaque that links to the memorial page permanently.", tag: "Core" },
  { title: "Photo upload", desc: "Profile photo stored in Supabase Storage and shown in the memorial header.", tag: "Core" },
  { title: "Page reading preference", desc: "He/His, She/Her, They/Their — sets pronouns throughout the memorial without using the word 'pronouns'.", tag: "UX" },
  { title: "Birth and death years", desc: "Optional year fields shown in the memorial header. Gracefully handles living, b. only, or full lifespan.", tag: "Core" },
  { title: "Report a Passing", desc: "Family members can add a death year from the public memorial page without logging in. Emails Scott on update.", tag: "Core" },
  { title: "Guestbook", desc: "Visitors can leave messages on any public memorial page. Shown in reverse chronological order.", tag: "Core" },
  { title: "Public / private toggle", desc: "Pages are private by default. Owner controls when to make them live.", tag: "Core" },
  { title: "Admin panel", desc: "Orders table, customer lookup, launch checklist, and this roadmap. Protected by role-based auth.", tag: "Admin" },
  { title: "Email notifications", desc: "Purchase confirmation, password setup, password reset, and passing notification — all via Resend.", tag: "Infra" },
  { title: "Name-based memorial slugs", desc: "Slugs generated from firstname-lastname at setup. Collision-safe. Never changed after creation (QR safety).", tag: "Infra" },
  { title: "Stripe checkout", desc: "One-time payment for page + plaque. Webhook-based fulfillment.", tag: "Infra" },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "afterword-roadmap-v1";

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; dot: string }> = {
  idea:     { label: "Idea",     color: "#666",    bg: "#F5F5F5", dot: "#ccc" },
  building: { label: "Building", color: "#C9932A", bg: "#FDF3DC", dot: "#C9932A" },
  shipped:  { label: "Shipped",  color: "#155724", bg: "#d4edda", dot: "#28a745" },
};

const CATEGORIES = ["Core", "UX", "Admin", "Infra", "Marketing", "Other"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusPill({ status, onClick }: { status: Status; onClick?: () => void }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: "0.68rem",
        fontWeight: 700,
        padding: "2px 9px",
        borderRadius: 999,
        backgroundColor: cfg.bg,
        color: cfg.color,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FeatureRoadmap() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<Status>("idea");
  const [formCategory, setFormCategory] = useState("Core");

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  function persist(next: RoadmapItem[]) {
    setItems(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  function openAddForm() {
    setEditingId(null);
    setFormTitle("");
    setFormNotes("");
    setFormStatus("idea");
    setFormCategory("Core");
    setShowForm(true);
    setTimeout(() => titleInputRef.current?.focus(), 60);
  }

  function openEditForm(item: RoadmapItem) {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormNotes(item.notes);
    setFormStatus(item.status);
    setFormCategory(item.category);
    setShowForm(true);
    setTimeout(() => titleInputRef.current?.focus(), 60);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function saveForm() {
    if (!formTitle.trim()) return;

    if (editingId) {
      persist(items.map((i) =>
        i.id === editingId
          ? { ...i, title: formTitle.trim(), notes: formNotes.trim(), status: formStatus, category: formCategory }
          : i
      ));
    } else {
      const newItem: RoadmapItem = {
        id: uid(),
        title: formTitle.trim(),
        notes: formNotes.trim(),
        status: formStatus,
        category: formCategory,
        createdAt: new Date().toISOString(),
      };
      persist([newItem, ...items]);
    }
    setShowForm(false);
    setEditingId(null);
  }

  function cycleStatus(id: string) {
    const order: Status[] = ["idea", "building", "shipped"];
    persist(items.map((i) => {
      if (i.id !== id) return i;
      const next = order[(order.indexOf(i.status) + 1) % order.length];
      return { ...i, status: next };
    }));
  }

  function deleteItem(id: string) {
    if (!confirm("Remove this item from the roadmap?")) return;
    persist(items.filter((i) => i.id !== id));
  }

  const filtered = filterStatus === "all" ? items : items.filter((i) => i.status === filterStatus);
  const counts: Record<Status, number> = { idea: 0, building: 0, shipped: 0 };
  items.forEach((i) => counts[i.status]++);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #D6EAF4",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: "0.875rem",
    color: "#1A1A1A",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  };

  return (
    <div style={{ maxWidth: 820 }}>

      {/* ------------------------------------------------------------------ */}
      {/* Shipped features (static) */}
      {/* ------------------------------------------------------------------ */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
            What&rsquo;s live
          </h3>
          <span style={{ fontSize: "0.75rem", color: "#999" }}>{SHIPPED.length} features shipped</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {SHIPPED.map((f) => (
            <div
              key={f.title}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #E5E5E5",
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                gap: 10,
              }}
            >
              {/* Green check */}
              <div style={{
                flexShrink: 0,
                marginTop: 2,
                width: 18,
                height: 18,
                borderRadius: 4,
                backgroundColor: "#155724",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1A1A1A" }}>{f.title}</span>
                  <span style={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 999,
                    backgroundColor: "#EEF7FC",
                    color: "#2E7DA3",
                  }}>{f.tag}</span>
                </div>
                <div style={{ fontSize: "0.77rem", color: "#888", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "#E5E5E5", marginBottom: 36 }} />

      {/* ------------------------------------------------------------------ */}
      {/* Roadmap (dynamic) */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>
              Roadmap
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#999", margin: 0 }}>
              Track ideas, in-progress work, and shipped features. Click the status pill to cycle through states.
            </p>
          </div>
          <button
            onClick={openAddForm}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              backgroundColor: "#1B4F6B",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            + Add idea
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {(["all", "idea", "building", "shipped"] as const).map((f) => {
            const active = filterStatus === f;
            const label = f === "all" ? `All (${items.length})` : `${STATUS_CONFIG[f].label} (${counts[f]})`;
            return (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  border: active ? "2px solid #1B4F6B" : "1px solid #E5E5E5",
                  backgroundColor: active ? "#EEF7FC" : "#fff",
                  color: active ? "#1B4F6B" : "#888",
                  fontWeight: active ? 700 : 400,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <div
            style={{
              backgroundColor: "#F7FBFF",
              border: "1px solid #D6EAF4",
              borderRadius: 12,
              padding: "20px 22px",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1B4F6B", marginBottom: 14 }}>
              {editingId ? "Edit item" : "New idea"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Title */}
              <input
                ref={titleInputRef}
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveForm(); if (e.key === "Escape") cancelForm(); }}
                placeholder="Feature title"
                maxLength={120}
                style={inputStyle}
              />

              {/* Notes */}
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Notes, context, or why this matters (optional)"
                rows={3}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.55 }}
              />

              {/* Status + Category row */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: 5 }}>Status</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["idea", "building", "shipped"] as Status[]).map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      const sel = formStatus === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormStatus(s)}
                          style={{
                            flex: 1,
                            padding: "7px 0",
                            borderRadius: 7,
                            border: sel ? `2px solid ${cfg.dot}` : "1px solid #E5E5E5",
                            backgroundColor: sel ? cfg.bg : "#fff",
                            color: sel ? cfg.color : "#888",
                            fontWeight: sel ? 700 : 400,
                            fontSize: "0.78rem",
                            cursor: "pointer",
                          }}
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ width: 140 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: 5 }}>Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{ ...inputStyle, padding: "7px 10px" }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={saveForm}
                disabled={!formTitle.trim()}
                style={{
                  padding: "9px 20px",
                  borderRadius: 8,
                  backgroundColor: formTitle.trim() ? "#1B4F6B" : "#ccc",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: formTitle.trim() ? "pointer" : "default",
                }}
              >
                {editingId ? "Save changes" : "Add to roadmap"}
              </button>
              <button
                onClick={cancelForm}
                style={{
                  padding: "9px 18px",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  color: "#666",
                  border: "1px solid #E5E5E5",
                  fontWeight: 400,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items list */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#bbb", fontSize: "0.85rem" }}>
            {items.length === 0 ? "No ideas yet — add one above." : "No items match this filter."}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((item) => {
            const expanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E5E5",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    cursor: "pointer",
                  }}
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                >
                  {/* Status pill — click stops propagation so it cycles without toggling expand */}
                  <span onClick={(e) => { e.stopPropagation(); cycleStatus(item.id); }}>
                    <StatusPill status={item.status} onClick={() => {}} />
                  </span>

                  <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: 600, color: "#1A1A1A", minWidth: 0 }}>
                    {item.title}
                  </span>

                  {/* Category badge */}
                  <span style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "1px 7px",
                    borderRadius: 999,
                    backgroundColor: "#EEF7FC",
                    color: "#2E7DA3",
                    flexShrink: 0,
                  }}>
                    {item.category}
                  </span>

                  {/* Chevron */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ flexShrink: 0, transition: "transform 0.15s", transform: expanded ? "rotate(180deg)" : "none" }}
                  >
                    <path d="M3 5l4 4 4-4" stroke="#ccc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Expanded panel */}
                {expanded && (
                  <div style={{ padding: "0 14px 14px", borderTop: "1px solid #F0F0F0" }}>
                    {item.notes ? (
                      <p style={{ fontSize: "0.8rem", color: "#666", lineHeight: 1.6, margin: "12px 0 12px", whiteSpace: "pre-wrap" }}>
                        {item.notes}
                      </p>
                    ) : (
                      <p style={{ fontSize: "0.78rem", color: "#ccc", margin: "12px 0 12px", fontStyle: "italic" }}>
                        No notes added.
                      </p>
                    )}

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditForm(item); setExpandedId(null); }}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 7,
                          border: "1px solid #D6EAF4",
                          backgroundColor: "#EEF7FC",
                          color: "#1B4F6B",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 7,
                          border: "1px solid #FDDEDE",
                          backgroundColor: "#FFF5F5",
                          color: "#c0392b",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                      <span style={{ fontSize: "0.72rem", color: "#ccc", marginLeft: "auto" }}>
                        Added {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
