"use client";

import { useState } from "react";

export default function ReportPassingForm({ slug, firstName }: { slug: string; firstName: string }) {
  const [open, setOpen] = useState(false);
  const [deathYear, setDeathYear] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/memorial/report-passing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          death_year: deathYear,
          reporter_name: reporterName.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
        <p style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.7 }}>
          Thank you. {firstName}&rsquo;s page has been updated.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0 8px" }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            fontSize: "0.78rem",
            color: "#aaa",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Has {firstName} passed? A family member can update this page.
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 16,
        borderRadius: 12,
        border: "1px solid #E5E5E5",
        backgroundColor: "#FAFAFA",
        padding: "24px 28px",
      }}
    >
      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>
        Update {firstName}&rsquo;s page
      </p>
      <p style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.6, marginBottom: 20 }}>
        Adding the year of passing will update this page to show the dates of {firstName}&rsquo;s life.
        This cannot be undone.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#444", marginBottom: 4 }}>
              Year of passing <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <input
              type="number"
              value={deathYear}
              onChange={(e) => setDeathYear(e.target.value)}
              placeholder="e.g. 2025"
              min="1900"
              max={new Date().getFullYear()}
              required
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
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#444", marginBottom: 4 }}>
              Your name <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#aaa" }}>(optional)</span>
            </label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="e.g. Sarah Williams"
              maxLength={100}
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
        </div>

        {error && (
          <p style={{ fontSize: "0.82rem", color: "#c0392b", marginBottom: 12 }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              backgroundColor: loading ? "#ccc" : "#1B4F6B",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Saving..." : "Update page"}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setError(null); }}
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              backgroundColor: "#fff",
              color: "#666",
              border: "1px solid #E5E5E5",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
