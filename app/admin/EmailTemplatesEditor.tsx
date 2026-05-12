"use client";

import { useEffect, useState, useRef } from "react";

type Template = {
  id: string;
  name: string;
  trigger: string;
  recipient: string;
  vars: readonly string[];
  subject: string;
  html_body: string;
  is_customized: boolean;
  updated_at: string | null;
  default_subject: string;
  default_html: string;
};

type ModalState = {
  template: Template;
  subject: string;
  html: string;
  saving: boolean;
  saved: boolean;
  error: string | null;
  preview: boolean;
};

export default function EmailTemplatesEditor() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const htmlRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/admin/email-templates")
      .then((r) => r.json())
      .then((d) => {
        if (d.templates) setTemplates(d.templates);
        else setFetchError("Could not load templates. Run the email_templates migration first.");
      })
      .catch(() => setFetchError("Network error loading templates."))
      .finally(() => setLoading(false));
  }, []);

  function openModal(t: Template) {
    setModal({ template: t, subject: t.subject, html: t.html_body, saving: false, saved: false, error: null, preview: false });
  }

  function closeModal() {
    setModal(null);
  }

  async function handleSave() {
    if (!modal) return;
    setModal((m) => m && { ...m, saving: true, saved: false, error: null });

    const res = await fetch(`/api/admin/email-templates/${modal.template.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: modal.subject, html_body: modal.html }),
    });
    const data = await res.json() as { ok?: boolean; error?: string };

    if (data.ok) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === modal.template.id
            ? { ...t, subject: modal.subject, html_body: modal.html, is_customized: true, updated_at: new Date().toISOString() }
            : t,
        ),
      );
      setModal((m) => m && { ...m, saving: false, saved: true, template: { ...m.template, is_customized: true } });
      setTimeout(() => setModal((m) => m && { ...m, saved: false }), 2500);
    } else {
      setModal((m) => m && { ...m, saving: false, error: data.error ?? "Save failed." });
    }
  }

  async function handleReset() {
    if (!modal) return;
    if (!confirm("Reset this email to the hardcoded default? Your edits will be lost.")) return;

    await fetch(`/api/admin/email-templates/${modal.template.id}`, { method: "DELETE" });

    const t = modal.template;
    setTemplates((prev) =>
      prev.map((tmpl) =>
        tmpl.id === t.id
          ? { ...tmpl, subject: tmpl.default_subject, html_body: tmpl.default_html, is_customized: false, updated_at: null }
          : tmpl,
      ),
    );
    setModal((m) =>
      m && {
        ...m,
        subject: t.default_subject,
        html: t.default_html,
        template: { ...t, is_customized: false },
        saved: false,
      },
    );
  }

  if (loading) {
    return <p style={{ color: "#999", fontSize: "0.85rem" }}>Loading email templates…</p>;
  }

  if (fetchError) {
    return (
      <div className="rounded-xl p-5" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
        <p style={{ color: "#991B1B", fontSize: "0.875rem", lineHeight: 1.6 }}>{fetchError}</p>
        <details style={{ marginTop: 12 }}>
          <summary style={{ fontSize: "0.78rem", color: "#999", cursor: "pointer" }}>Run this SQL in Supabase</summary>
          <pre style={{ marginTop: 8, padding: "12px", background: "#1A1A1A", color: "#e2e8f0", borderRadius: 8, fontSize: "0.72rem", overflowX: "auto", lineHeight: 1.6 }}>
{`create table if not exists email_templates (
  id text primary key,
  subject text not null,
  html_body text not null,
  updated_at timestamptz default now()
);
alter table email_templates enable row level security;
create policy "Admin read" on email_templates for select
  using (exists (select 1 from admins where user_id = auth.uid()));
create policy "Admin write" on email_templates for all
  using (exists (select 1 from admins where user_id = auth.uid()));`}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <>
      {/* Template list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => openModal(t)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 0",
              background: "none",
              border: "none",
              borderBottom: "1px solid #F0F0F0",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            {/* Recipient dot */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                flexShrink: 0,
                backgroundColor: t.recipient.includes("Scott") ? "#C9932A" : "#1B4F6B",
              }}
            />

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1A1A1A" }}>
                  {t.name}
                </span>
                {t.is_customized && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      backgroundColor: "#EEF7FC",
                      color: "#1B4F6B",
                      borderRadius: 4,
                      padding: "1px 6px",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Customized
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#888", marginBottom: 3 }}>{t.trigger}</div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#555",
                  fontStyle: "italic",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "600px",
                }}
              >
                &ldquo;{t.subject}&rdquo;
              </div>
            </div>

            {/* Recipient badge */}
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "#999",
                flexShrink: 0,
                textAlign: "right",
              }}
            >
              To: {t.recipient}
            </div>

            {/* Arrow */}
            <div style={{ fontSize: "1rem", color: "#CCC", flexShrink: 0 }}>›</div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "40px 24px",
            overflowY: "auto",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
              width: "100%",
              maxWidth: 860,
              overflow: "hidden",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid #F0F0F0",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
                    {modal.template.name}
                  </h2>
                  {modal.template.is_customized && (
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, backgroundColor: "#EEF7FC", color: "#1B4F6B", borderRadius: 4, padding: "1px 6px", textTransform: "uppercase" }}>
                      Customized
                    </span>
                  )}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#888" }}>
                  <strong>Trigger:</strong> {modal.template.trigger} &nbsp;·&nbsp; <strong>To:</strong> {modal.template.recipient}
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{ background: "none", border: "none", fontSize: "1.4rem", color: "#999", cursor: "pointer", lineHeight: 1, padding: "2px 6px" }}
              >
                ×
              </button>
            </div>

            {/* Available variables */}
            {modal.template.vars.length > 0 && (
              <div style={{ padding: "10px 28px", backgroundColor: "#FAFAFA", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.72rem", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Variables:</span>
                {modal.template.vars.map((v) => (
                  <code
                    key={v}
                    style={{ fontSize: "0.72rem", backgroundColor: "#EEF7FC", color: "#1B4F6B", padding: "2px 7px", borderRadius: 4, fontFamily: "monospace" }}
                  >
                    {`{{${v}}}`}
                  </code>
                ))}
              </div>
            )}

            {/* Preview toggle */}
            <div style={{ padding: "10px 28px", borderBottom: "1px solid #F0F0F0", display: "flex", gap: 8 }}>
              <button
                onClick={() => setModal((m) => m && { ...m, preview: false })}
                style={{
                  fontSize: "0.78rem", fontWeight: modal.preview ? 400 : 700,
                  color: modal.preview ? "#999" : "#1B4F6B",
                  background: "none", border: "none", cursor: "pointer", padding: "4px 0",
                  borderBottom: modal.preview ? "none" : "2px solid #1B4F6B",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => setModal((m) => m && { ...m, preview: true })}
                style={{
                  fontSize: "0.78rem", fontWeight: modal.preview ? 700 : 400,
                  color: modal.preview ? "#1B4F6B" : "#999",
                  background: "none", border: "none", cursor: "pointer", padding: "4px 0",
                  borderBottom: modal.preview ? "2px solid #1B4F6B" : "none",
                }}
              >
                Preview
              </button>
            </div>

            {/* Editor / Preview */}
            <div style={{ padding: "20px 28px" }}>
              {modal.preview ? (
                <iframe
                  srcDoc={modal.html}
                  style={{ width: "100%", height: 520, border: "1px solid #E5E5E5", borderRadius: 8 }}
                  title="Email preview"
                />
              ) : (
                <>
                  {/* Subject */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Subject line
                    </label>
                    <input
                      type="text"
                      value={modal.subject}
                      onChange={(e) => setModal((m) => m && { ...m, subject: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "0.9rem",
                        border: "1px solid #D5D5D5",
                        borderRadius: 8,
                        outline: "none",
                        boxSizing: "border-box",
                        color: "#1A1A1A",
                      }}
                    />
                  </div>

                  {/* HTML body */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Email HTML
                    </label>
                    <textarea
                      ref={htmlRef}
                      value={modal.html}
                      onChange={(e) => setModal((m) => m && { ...m, html: e.target.value })}
                      rows={18}
                      spellCheck={false}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "0.72rem",
                        lineHeight: 1.6,
                        fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                        border: "1px solid #D5D5D5",
                        borderRadius: 8,
                        outline: "none",
                        resize: "vertical",
                        boxSizing: "border-box",
                        color: "#1A1A1A",
                        backgroundColor: "#FAFAFA",
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer actions */}
            <div
              style={{
                padding: "16px 28px",
                borderTop: "1px solid #F0F0F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <button
                onClick={handleReset}
                style={{
                  fontSize: "0.78rem",
                  color: "#999",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  opacity: modal.template.is_customized ? 1 : 0.4,
                  pointerEvents: modal.template.is_customized ? "auto" : "none",
                }}
              >
                Reset to default
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {modal.error && (
                  <span style={{ fontSize: "0.78rem", color: "#c0392b" }}>{modal.error}</span>
                )}
                {modal.saved && (
                  <span style={{ fontSize: "0.78rem", color: "#155724" }}>✓ Saved</span>
                )}
                <button
                  onClick={closeModal}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "1px solid #D5D5D5",
                    background: "#fff",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    color: "#555",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={modal.saving}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: modal.saving ? "#ccc" : "#1B4F6B",
                    color: "#fff",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: modal.saving ? "wait" : "pointer",
                  }}
                >
                  {modal.saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
