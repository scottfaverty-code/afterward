"use client";

import { useState } from "react";
import { generateStyledSVG, downloadText } from "@/lib/qr-download";

const MANAGED_MEMORIALS = [
  { label: "Jonathan Williams", endpoint: "/api/admin/seed-demo",            slug: "jonathan-williams",  name: "Jonathan Williams" },
  { label: "Eleanor Mitchell",  endpoint: "/api/admin/seed-eleanor",         slug: "eleanor-mitchell",   name: "Eleanor Mitchell"  },
  { label: "Patrick Faverty",   endpoint: "/api/admin/seed-patrick-faverty", slug: "patrick-faverty",    name: "Patrick Faverty"   },
];

const linkStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  padding: "4px 10px",
  borderRadius: 6,
  border: "1px solid #D6EAF4",
  color: "#2E7DA3",
  textDecoration: "none",
  backgroundColor: "#EEF7FC",
  fontWeight: 600,
  whiteSpace: "nowrap",
  cursor: "pointer",
  background: "#EEF7FC",
};

function QRDownloadButtons({
  slug,
  name,
  appUrl,
}: {
  slug: string;
  name: string;
  appUrl: string;
}) {
  const [svgState, setSvgState] = useState<"idle" | "working">("idle");
  const [epsState, setEpsState] = useState<"idle" | "working">("idle");

  async function handleSVG() {
    if (svgState === "working") return;
    setSvgState("working");
    try {
      const url = `${appUrl}/memorial/${slug}`;
      const svg = await generateStyledSVG(url);
      downloadText(svg, `afterword-qr-${slug}.svg`, "image/svg+xml");
    } catch (e) {
      console.error("SVG generation failed", e);
    } finally {
      setSvgState("idle");
    }
  }

  async function handleEPS() {
    if (epsState === "working") return;
    setEpsState("working");
    try {
      const params = new URLSearchParams({ slug, name, format: "eps" });
      const res = await fetch(`/api/admin/qr-eps?${params}`);
      if (!res.ok) throw new Error(`EPS fetch failed: ${res.status}`);
      const text = await res.text();
      downloadText(text, `afterword-qr-${slug}.eps`, "application/postscript");
    } catch (e) {
      console.error("EPS generation failed", e);
    } finally {
      setEpsState("idle");
    }
  }

  return (
    <span style={{ display: "inline-flex", gap: 6 }}>
      <button onClick={handleSVG} disabled={svgState === "working"} style={linkStyle}>
        {svgState === "working" ? "…" : "SVG"}
      </button>
      <button onClick={handleEPS} disabled={epsState === "working"} style={linkStyle}>
        {epsState === "working" ? "…" : "EPS"}
      </button>
    </span>
  );
}

function SeedRow({
  label,
  endpoint,
  slug,
  name,
  appUrl,
}: {
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

      <a
        href={`${appUrl}/memorial/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: "0.78rem", color: "#1B4F6B", whiteSpace: "nowrap" }}
      >
        View →
      </a>

      <span style={{ fontSize: "0.72rem", color: "#bbb", marginLeft: 2 }}>QR:</span>
      <QRDownloadButtons slug={slug} name={name} appUrl={appUrl} />
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
