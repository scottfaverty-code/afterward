"use client";

import { useState } from "react";

export default function SeedDemoButton({ appUrl }: { appUrl: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSeed() {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/seed-demo", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <button
        onClick={handleSeed}
        disabled={status === "loading" || status === "done"}
        style={{
          padding: "8px 16px",
          fontSize: "0.8rem",
          fontWeight: 600,
          borderRadius: "8px",
          border: "1px solid #D6EAF4",
          backgroundColor: status === "done" ? "#d4edda" : "#fff",
          color: status === "done" ? "#155724" : "#1B4F6B",
          cursor: status === "loading" || status === "done" ? "default" : "pointer",
          opacity: status === "loading" ? 0.6 : 1,
        }}
      >
        {status === "idle" && "Seed Patrick William demo"}
        {status === "loading" && "Seeding…"}
        {status === "done" && "✓ Demo seeded"}
        {status === "error" && "✗ Error — try again"}
      </button>

      {status === "done" && (
        <a
          href={`${appUrl}/memorial/patrick-william`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.8rem", color: "#1B4F6B" }}
        >
          View memorial →
        </a>
      )}
    </div>
  );
}
