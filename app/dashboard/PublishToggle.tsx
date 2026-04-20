"use client";

import { useState } from "react";

interface Props {
  initialPublished: boolean;
  memorialSlug: string | null;
  completedSections: number;
}

export default function PublishToggle({ initialPublished, memorialSlug, completedSections }: Props) {
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setLoading(true);
    setError(null);
    const next = !isPublished;

    const res = await fetch("/api/publish-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publish: next }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    setIsPublished(next);
    setLoading(false);
  }

  const hasContent = completedSections >= 1;

  return (
    <div className="mt-4 pt-4" style={{ borderTop: "1px solid #F0F0F0" }}>
      {isPublished ? (
        <div>
          <div
            className="flex items-center gap-2 mb-3 rounded-lg px-3 py-2"
            style={{ backgroundColor: "#d4edda", border: "1px solid #c3e6cb" }}
          >
            <span style={{ fontSize: "0.75rem", color: "#155724", fontWeight: 700 }}>
              ✓ Your page is live
            </span>
          </div>
          {memorialSlug && (
            <p style={{ fontSize: "0.72rem", color: "#999", marginBottom: "10px", wordBreak: "break-all" }}>
              myafterword.co/memorial/{memorialSlug}
            </p>
          )}
          <button
            onClick={toggle}
            disabled={loading}
            style={{
              fontSize: "0.78rem",
              color: "#999",
              background: "none",
              border: "none",
              cursor: loading ? "default" : "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            {loading ? "Updating…" : "Make page private"}
          </button>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "12px", lineHeight: "1.5" }}>
            {hasContent
              ? "Ready to share your page with family?"
              : "Complete at least one section before publishing."}
          </p>
          <button
            onClick={toggle}
            disabled={loading || !hasContent}
            className={hasContent ? "btn-primary" : undefined}
            style={
              hasContent
                ? { padding: "10px 20px", fontSize: "0.875rem", width: "100%", opacity: loading ? 0.6 : 1, cursor: loading ? "default" : "pointer" }
                : { padding: "10px 20px", fontSize: "0.875rem", width: "100%", backgroundColor: "#E5E5E5", color: "#999", border: "none", borderRadius: "8px", cursor: "not-allowed" }
            }
          >
            {loading ? "Publishing…" : "Publish my page"}
          </button>
        </div>
      )}

      {error && (
        <p style={{ fontSize: "0.75rem", color: "#c0392b", marginTop: "8px" }}>{error}</p>
      )}
    </div>
  );
}
