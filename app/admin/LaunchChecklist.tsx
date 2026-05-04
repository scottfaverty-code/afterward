"use client";

import { useState, useEffect } from "react";

type ChecklistItem = {
  id: string;
  label: string;
  note?: string;
  tag?: "code" | "external" | "legal";
};

type ChecklistSection = {
  heading: string;
  color: string;
  items: ChecklistItem[];
};

const SECTIONS: ChecklistSection[] = [
  {
    heading: "Must ship by May 10",
    color: "#c0392b",
    items: [
      {
        id: "stripe-live",
        label: "Enable Stripe live keys in Vercel",
        note: "Set sk_live_ and pk_live_ in Production environment variables. Test with a real card before launch.",
        tag: "external",
      },
      {
        id: "stripe-webhook",
        label: "Register Stripe webhook + set STRIPE_WEBHOOK_SECRET",
        note: "In Stripe Dashboard → Developers → Webhooks, add endpoint https://www.myafterword.co/api/webhooks/stripe. Subscribe to checkout.session.completed and charge.dispute.created. Copy the signing secret (whsec_...) into Vercel as STRIPE_WEBHOOK_SECRET. Without this, purchases made before the redirect completes won't be recorded.",
        tag: "external",
      },
      {
        id: "tos",
        label: "Terms of Service page live",
        note: "Required before taking real payments. Waiting on attorney draft.",
        tag: "legal",
      },
      {
        id: "privacy",
        label: "Privacy Policy page live",
        note: "Required for GDPR/CCPA compliance. Pair with ToS.",
        tag: "legal",
      },
      {
        id: "birth-death-years",
        label: "Birth and death years on profiles and memorial pages",
        note: "Profiles need year fields. Memorial page header should show '1949 - 2025'. Core to the product feeling complete.",
        tag: "code",
      },
      {
        id: "og-tags",
        label: "Open Graph meta tags on memorial pages",
        note: "When a family member shares a link via text or social, it should preview with name, years, and photo. Biggest word-of-mouth multiplier at launch.",
        tag: "code",
      },
    ],
  },
  {
    heading: "High value - ship if time allows",
    color: "#C9932A",
    items: [
      {
        id: "shipping-email",
        label: "Plaque shipped email with tracking link",
        note: "Customers go silent after purchase. A shipping notification with tracking builds trust and reduces support emails.",
        tag: "code",
      },
      {
        id: "mobile-writing",
        label: "Mobile review of the writing experience",
        note: "Many people will write on their phone. Check all 7 sections on iOS Safari before launch.",
        tag: "external",
      },
    ],
  },
  {
    heading: "Post-launch backlog",
    color: "#999",
    items: [
      {
        id: "photo-library",
        label: "Multiple photos per memorial page",
        note: "Currently one avatar. A photo gallery would significantly enrich the pages.",
        tag: "code",
      },
      {
        id: "list-users-pagination",
        label: "Fix listUsers pagination",
        note: "Admin panel uses listUsers without pagination - breaks above 1,000 users.",
        tag: "code",
      },
      {
        id: "video-support",
        label: "Video support on memorial pages",
        note: "Allow an embedded video or uploaded clip alongside the written story.",
        tag: "code",
      },
    ],
  },
];

const TAG_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  code: { label: "Code", bg: "#EEF7FC", color: "#1B4F6B" },
  external: { label: "Manual", bg: "#F3F0FF", color: "#6C3FC5" },
  legal: { label: "Legal", bg: "#FDF3DC", color: "#C9932A" },
};

const STORAGE_KEY = "afterword-launch-checklist";

export default function LaunchChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setChecked(JSON.parse(stored));
    } catch {}
  }, []);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  const totalItems = SECTIONS.flatMap((s) => s.items).length;
  const doneItems = SECTIONS.flatMap((s) => s.items).filter((i) => checked[i.id]).length;
  const pct = Math.round((doneItems / totalItems) * 100);

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#333" }}>
            Launch progress
          </span>
          <span style={{ fontSize: "0.78rem", color: "#999" }}>
            {doneItems} of {totalItems} complete
          </span>
        </div>
        <div style={{ height: 8, backgroundColor: "#E5E5E5", borderRadius: 999, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              backgroundColor: pct === 100 ? "#155724" : "#1B4F6B",
              borderRadius: 999,
              transition: "width 0.3s",
            }}
          />
        </div>
        <div style={{ fontSize: "0.75rem", color: "#aaa", marginTop: 4 }}>
          Target: May 10, 2026
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => {
        const sectionDone = section.items.every((i) => checked[i.id]);
        return (
          <div key={section.heading} style={{ marginBottom: 28 }}>
            <div style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: sectionDone ? "#999" : section.color,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              {sectionDone && <span style={{ fontSize: "0.9rem" }}>✓</span>}
              {section.heading}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {section.items.map((item) => {
                const done = !!checked[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: `1px solid ${done ? "#d4edda" : "#E5E5E5"}`,
                      backgroundColor: done ? "#f6fbf7" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.12s",
                    }}
                  >
                    {/* Checkbox */}
                    <div style={{
                      flexShrink: 0,
                      marginTop: 1,
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: done ? "none" : "2px solid #D6EAF4",
                      backgroundColor: done ? "#155724" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {done && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: done ? "#999" : "#1A1A1A",
                        textDecoration: done ? "line-through" : "none",
                        marginBottom: item.note ? 3 : 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}>
                        {item.label}
                        {item.tag && (
                          <span style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            padding: "1px 7px",
                            borderRadius: 999,
                            backgroundColor: done ? "#F0F0F0" : TAG_STYLES[item.tag].bg,
                            color: done ? "#bbb" : TAG_STYLES[item.tag].color,
                          }}>
                            {TAG_STYLES[item.tag].label}
                          </span>
                        )}
                      </div>
                      {item.note && (
                        <div style={{ fontSize: "0.78rem", color: done ? "#bbb" : "#888", lineHeight: 1.55 }}>
                          {item.note}
                        </div>
                      )}
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
