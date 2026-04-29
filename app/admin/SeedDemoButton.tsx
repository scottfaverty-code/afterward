"use client";

import { useState } from "react";

const MANAGED_MEMORIALS = [
  { label: "Jonathan Williams", endpoint: "/api/admin/seed-demo",            slug: "jonathan-williams",  name: "Jonathan Williams" },
  { label: "Eleanor Mitchell",  endpoint: "/api/admin/seed-eleanor",         slug: "eleanor-mitchell",   name: "Eleanor Mitchell"  },
  { label: "Patrick Faverty",   endpoint: "/api/admin/seed-patrick-faverty", slug: "patrick-faverty",    name: "Patrick Faverty"   },
];

function QRDownloadLinks({ slug, name }: { slug: string; name: string }) {
  return (
    <span style={{ display: "inline-flex", gap: 6 }}>
      <a
        href={`/api/admin/qr-eps?slug=${slug}&name=${encodeURIComponent(name)}&format=svg`}
        download
        style={{
          fontSize: "0.72rem",
          padding: "4px 10px",
          borderRadius: 6,
          border: "1px solid #D6EAF4",
          color: "#2E7DA3",
          textDecoration: "none",
          backgroundColor: "#EEF7FC",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        SVG
      </a>
      <a
        href={`/api/admin/qr-eps?slug=${slug}&name=${encodeURIComponent(name)}&format=eps`}
        download
        style={{
          fontSize: "0.72rem",
          padding: "4px 10px",
          borderRadius: 6,
          border: "1px solid #D6EAF4",
          color: "#2E7DA3",
          textDecoration: "none",
          backgroundColor: "#EEF7FC",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        EPS
      </a>
    </span>
  );
}

function SeedRow({ label, endpoint, slug, name, appUrl }: {
  label: string;
  endpoint: string;
  slug: string;
  name: string;
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
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {/* Seed button */}
      <button
        onClick={handleSeed}
        disabled={status === "loading" || status === "done"}
        style={{
          padding: "7px 14px",
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
        {status === "idle" && `Seed ${label}`}
        {status === "loading" && "Seeding…"}
        {status === "done" && "✓ Seeded"}
        {status === "error" && "✗ Error, try again"}
      </button>

      {/* View link */}
      <a
        href={`${appUrl}/memorial/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: "0.78rem", color: "#1B4F6B", whiteSpace: "nowrap" }}
      >
        View →
      </a>

      {/* QR downloads */}
      <span style={{ fontSize: "0.72rem", color: "#bbb", marginLeft: 2 }}>QR:</span>
      <QRDownloadLinks slug={slug} name={name} />
    </div>
  );
}

export default function SeedDemoButton({ appUrl }: { appUrl: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontSize: "0.75rem", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Managed memorials
      </span>
      {MANAGED_MEMORIALS.map((m) => (
        <SeedRow key={m.slug} appUrl={appUrl} {...m} />
      ))}
    </div>
  );
}
