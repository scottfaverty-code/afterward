"use client";

import { useState } from "react";

function SeedButton({ label, endpoint, slug, appUrl }: {
  label: string;
  endpoint: string;
  slug: string;
  appUrl: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSeed() {
    setStatus("loading");
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      setStatus(data.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          whiteSpace: "nowrap",
        }}
      >
        {status === "idle" && label}
        {status === "loading" && "Seeding…"}
        {status === "done" && "✓ Seeded"}
        {status === "error" && "✗ Error, try again"}
      </button>
      {status === "done" && (
        <a href={`${appUrl}/memorial/${slug}`} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "0.8rem", color: "#1B4F6B" }}>
          View →
        </a>
      )}
    </div>
  );
}

export default function SeedDemoButton({ appUrl }: { appUrl: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
      <span style={{ fontSize: "0.75rem", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Demo memorials:
      </span>
      <SeedButton label="Seed Patrick Williams" endpoint="/api/admin/seed-demo" slug="patrick-william" appUrl={appUrl} />
      <SeedButton label="Seed Eleanor Mitchell" endpoint="/api/admin/seed-eleanor" slug="eleanor-mitchell" appUrl={appUrl} />
    </div>
  );
}
