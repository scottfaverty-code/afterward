"use client";

import { useState, useEffect, useRef } from "react";
import { generateStyledSVG, downloadText } from "@/lib/qr-download";

type Campaign = {
  id: string;
  memorial_slug: string;
  campaign_name: string;
  code: string;
  created_at: string;
  click_count: number;
};

// ---------------------------------------------------------------------------
// QR download buttons (reused per row)
// ---------------------------------------------------------------------------

function QRButtons({ code, campaignName, appUrl }: { code: string; campaignName: string; appUrl: string }) {
  const [svgBusy, setSvgBusy] = useState(false);
  const [epsBusy, setEpsBusy] = useState(false);

  const trackUrl = `${appUrl}/r/${code}`;
  const filename = `afterword-qr-${code}`;

  async function handleSVG() {
    if (svgBusy) return;
    setSvgBusy(true);
    try {
      const svg = await generateStyledSVG(trackUrl);
      downloadText(svg, `${filename}.svg`, "image/svg+xml");
    } finally {
      setSvgBusy(false);
    }
  }

  async function handleEPS() {
    if (epsBusy) return;
    setEpsBusy(true);
    try {
      const params = new URLSearchParams({ slug: code, name: campaignName, format: "eps", url: trackUrl });
      const res = await fetch(`/api/admin/qr-eps?${params}`);
      if (res.ok) {
        const text = await res.text();
        downloadText(text, `${filename}.eps`, "application/postscript");
      }
    } finally {
      setEpsBusy(false);
    }
  }

  const btnStyle: React.CSSProperties = {
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 5,
    border: "1px solid #D6EAF4",
    backgroundColor: "#EEF7FC",
    color: "#2E7DA3",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <span style={{ display: "inline-flex", gap: 5 }}>
      <button onClick={handleSVG} disabled={svgBusy} style={btnStyle}>{svgBusy ? "…" : "SVG"}</button>
      <button onClick={handleEPS} disabled={epsBusy} style={btnStyle}>{epsBusy ? "…" : "EPS"}</button>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Copy-link button
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      onClick={handleCopy}
      title={text}
      style={{
        fontSize: "0.7rem",
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 5,
        border: `1px solid ${copied ? "#d4edda" : "#E5E5E5"}`,
        backgroundColor: copied ? "#d4edda" : "#FAFAFA",
        color: copied ? "#155724" : "#666",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.15s",
      }}
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Inline sparkline (last 14 days of visits)
// ---------------------------------------------------------------------------

function Sparkline({ dailyCounts }: { dailyCounts: number[] }) {
  const max = Math.max(...dailyCounts, 1);
  const w = 80;
  const h = 24;
  const barW = w / dailyCounts.length - 1;

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {dailyCounts.map((v, i) => {
        const barH = Math.max(2, (v / max) * (h - 2));
        return (
          <rect
            key={i}
            x={i * (barW + 1)}
            y={h - barH}
            width={barW}
            height={barH}
            rx={1}
            fill={v > 0 ? "#2E7DA3" : "#E5E5E5"}
          />
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function QRCampaigns({ appUrl }: { appUrl: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formSlug, setFormSlug] = useState("");
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/qr-campaigns");
      const data = await res.json();
      setCampaigns(data.campaigns ?? []);
    } finally {
      setLoading(false);
    }
  }

  function openForm() {
    setFormSlug("patrick-faverty");
    setFormName("");
    setFormError(null);
    setShowForm(true);
    setTimeout(() => nameInputRef.current?.focus(), 60);
  }

  async function handleCreate() {
    if (!formName.trim() || !formSlug.trim()) {
      setFormError("Both fields are required.");
      return;
    }
    setFormSaving(true);
    setFormError(null);
    try {
      const res = await fetch("/api/admin/qr-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorial_slug: formSlug.trim(), campaign_name: formName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong.");
        return;
      }
      setCampaigns((prev) => [data.campaign, ...prev]);
      setShowForm(false);
    } finally {
      setFormSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this campaign? All click data will be lost.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/qr-campaigns/${id}`, { method: "DELETE" });
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  // Group campaigns by memorial slug
  const bySlug: Record<string, Campaign[]> = {};
  for (const c of campaigns) {
    bySlug[c.memorial_slug] = [...(bySlug[c.memorial_slug] ?? []), c];
  }
  const slugs = Object.keys(bySlug);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #D6EAF4",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: "0.875rem",
    color: "#1A1A1A",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  };

  return (
    <div style={{ maxWidth: 800 }}>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: "0.78rem", color: "#999", margin: 0, lineHeight: 1.6 }}>
            Each campaign generates a unique short link (<code style={{ fontSize: "0.75rem", backgroundColor: "#F5F5F5", padding: "1px 5px", borderRadius: 4 }}>/r/abc123</code>) that
            redirects to the memorial and logs the click. Use a different campaign per publication so you can see
            which placements drive traffic.
          </p>
        </div>
        <button
          onClick={openForm}
          style={{
            flexShrink: 0,
            marginLeft: 16,
            padding: "9px 18px",
            borderRadius: 8,
            backgroundColor: "#1B4F6B",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            fontSize: "0.82rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + New campaign
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div style={{
          backgroundColor: "#F7FBFF",
          border: "1px solid #D6EAF4",
          borderRadius: 12,
          padding: "20px 22px",
          marginBottom: 24,
        }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1B4F6B", marginBottom: 14 }}>
            New QR campaign
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: 5 }}>
                Publication or placement
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setShowForm(false); }}
                placeholder="e.g. SLO Tribune, Facebook, Church Bulletin"
                maxLength={120}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: 5 }}>
                Memorial slug
              </label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="e.g. patrick-faverty"
                maxLength={120}
                style={inputStyle}
              />
              <p style={{ fontSize: "0.72rem", color: "#aaa", margin: "4px 0 0" }}>
                The slug from the memorial URL: myafterword.co/memorial/<strong>{formSlug || "..."}</strong>
              </p>
            </div>
          </div>
          {formError && (
            <p style={{ fontSize: "0.8rem", color: "#c0392b", marginTop: 10 }}>{formError}</p>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={handleCreate}
              disabled={formSaving}
              style={{
                padding: "9px 20px",
                borderRadius: 8,
                backgroundColor: formSaving ? "#ccc" : "#1B4F6B",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: formSaving ? "default" : "pointer",
              }}
            >
              {formSaving ? "Creating…" : "Create campaign"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: "9px 18px",
                borderRadius: 8,
                backgroundColor: "#fff",
                color: "#666",
                border: "1px solid #E5E5E5",
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p style={{ fontSize: "0.82rem", color: "#bbb", textAlign: "center", padding: "32px 0" }}>Loading…</p>
      )}

      {/* Empty */}
      {!loading && campaigns.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "48px 0",
          border: "2px dashed #E5E5E5",
          borderRadius: 12,
          color: "#bbb",
          fontSize: "0.85rem",
        }}>
          No campaigns yet. Create one to generate a trackable QR code.
        </div>
      )}

      {/* Campaign groups */}
      {!loading && slugs.map((slug) => {
        const group = bySlug[slug];
        const totalClicks = group.reduce((s, c) => s + c.click_count, 0);

        return (
          <div key={slug} style={{ marginBottom: 28 }}>
            {/* Slug heading */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
              paddingBottom: 8,
              borderBottom: "2px solid #E5E5E5",
            }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2E7DA3" }}>
                {slug}
              </span>
              <a
                href={`${appUrl}/memorial/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.72rem", color: "#bbb", textDecoration: "none" }}
              >
                ↗ view page
              </a>
              <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#999" }}>
                {totalClicks} total click{totalClicks !== 1 ? "s" : ""} · {group.length} campaign{group.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Campaign rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {group.map((campaign) => {
                const trackUrl = `${appUrl}/r/${campaign.code}`;
                const age = Math.floor((Date.now() - new Date(campaign.created_at).getTime()) / 86400000);
                const ageLabel = age === 0 ? "today" : age === 1 ? "yesterday" : `${age}d ago`;

                return (
                  <div
                    key={campaign.id}
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E5E5",
                      borderRadius: 10,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Click count badge */}
                    <div style={{
                      flexShrink: 0,
                      minWidth: 44,
                      textAlign: "center",
                      backgroundColor: campaign.click_count > 0 ? "#EEF7FC" : "#F5F5F5",
                      borderRadius: 8,
                      padding: "6px 8px",
                    }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: campaign.click_count > 0 ? "#1B4F6B" : "#ccc", lineHeight: 1 }}>
                        {campaign.click_count}
                      </div>
                      <div style={{ fontSize: "0.6rem", color: "#aaa", marginTop: 2 }}>
                        {campaign.click_count === 1 ? "click" : "clicks"}
                      </div>
                    </div>

                    {/* Name + meta */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>
                        {campaign.campaign_name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <code style={{ fontSize: "0.7rem", color: "#999", backgroundColor: "#F5F5F5", padding: "1px 5px", borderRadius: 3 }}>
                          /r/{campaign.code}
                        </code>
                        <span style={{ fontSize: "0.7rem", color: "#ccc" }}>·</span>
                        <span style={{ fontSize: "0.7rem", color: "#bbb" }}>Created {ageLabel}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
                      <CopyButton text={trackUrl} />
                      <QRButtons code={campaign.code} campaignName={campaign.campaign_name} appUrl={appUrl} />
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        disabled={deleting === campaign.id}
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 5,
                          border: "1px solid #FDDEDE",
                          backgroundColor: "#FFF5F5",
                          color: "#c0392b",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {deleting === campaign.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
