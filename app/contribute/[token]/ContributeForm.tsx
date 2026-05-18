"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
  ownerFirstName: string | null;
  referredAs?: "he" | "she" | "they";
}

export default function ContributeForm({ token, ownerFirstName, referredAs = "they" }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [memory, setMemory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = ownerFirstName ?? "them";
  const pos = referredAs === "he" ? "his" : referredAs === "she" ? "her" : "their";
  const charLimit = 2000;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !relationship.trim() || !memory.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contributions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          contributor_name: name.trim(),
          contributor_relationship: relationship.trim(),
          memory_text: memory.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // Navigate to thank-you page, passing discount code and pronoun in search params
      const params = new URLSearchParams();
      if (data.discount_code) params.set("code", data.discount_code);
      if (ownerFirstName) params.set("name", ownerFirstName);
      params.set("ref", referredAs);
      router.push(`/contribute/${token}/submitted?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #D6EAF4",
    borderRadius: "8px",
    padding: "12px 14px",
    fontSize: "1rem",
    color: "#1A1A1A",
    outline: "none",
    backgroundColor: "#fff",
    transition: "border-color 0.15s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#555",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "36px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* Name */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah"
            maxLength={100}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "#2E7DA3"; }}
            onBlur={(e) => { e.target.style.borderColor = "#D6EAF4"; }}
          />
        </div>

        {/* Relationship */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Your relationship to {firstName}</label>
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder={referredAs === "he" ? "e.g. his daughter, his colleague" : referredAs === "she" ? "e.g. her daughter, her college roommate" : "e.g. their daughter, their colleague"}
            maxLength={100}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "#2E7DA3"; }}
            onBlur={(e) => { e.target.style.borderColor = "#D6EAF4"; }}
          />
        </div>

        {/* Memory */}
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>Your memory</label>
          <p style={{ fontSize: "0.85rem", color: "#999", marginBottom: "8px", fontStyle: "italic" }}>
            A moment, a quality, something {firstName} said — whatever feels true.
          </p>
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value.slice(0, charLimit))}
            placeholder={`Write about ${firstName} here...`}
            style={{
              ...inputStyle,
              minHeight: "160px",
              resize: "vertical",
              lineHeight: "1.7",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#2E7DA3"; }}
            onBlur={(e) => { e.target.style.borderColor = "#D6EAF4"; }}
          />
          <div style={{ textAlign: "right", fontSize: "0.75rem", color: memory.length > charLimit * 0.9 ? "#C9932A" : "#ccc", marginTop: "4px" }}>
            {memory.length} / {charLimit}
          </div>
        </div>

        {error && (
          <p style={{ fontSize: "0.875rem", color: "#c0392b", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary-lg w-full"
          style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "default" : "pointer" }}
        >
          {submitting ? "Submitting…" : `Add my memory`}
        </button>

        <p style={{ fontSize: "0.75rem", color: "#bbb", textAlign: "center", marginTop: "14px", lineHeight: "1.6" }}>
          {firstName} will review your memory before it appears on {pos} page.
          Your name and relationship will be shown — no other personal information is collected.
        </p>
      </div>
    </form>
  );
}
