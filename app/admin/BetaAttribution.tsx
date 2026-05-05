"use client";

import { useState, useEffect } from "react";

type Conversion = {
  email: string;
  amount_paid: number;
  created_at: string;
};

type BetaRow = {
  user_id: string;
  email: string;
  created_at: string;
  note: string | null;
  invites_sent: number;
  contributions_received: number;
  conversions: Conversion[];
};

export default function BetaAttribution() {
  const [rows, setRows] = useState<BetaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/admin/beta-attribution")
      .then((r) => r.json())
      .then((d) => {
        setRows(d.rows ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function toggleExpand(userId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  }

  const totalBeta = rows.length;
  const totalConversions = rows.reduce((n, r) => n + r.conversions.length, 0);
  const totalRevenue = rows.reduce((n, r) => n + r.conversions.reduce((s, c) => s + c.amount_paid, 0), 0);

  return (
    <div style={{ maxWidth: 820 }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
        Beta attribution
      </h3>
      <p style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.55, marginBottom: 20 }}>
        Every free beta account and the paid customers their contributor invites generated.
      </p>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Beta accounts", value: totalBeta },
          { label: "Paid conversions", value: totalConversions },
          { label: "Revenue attributed", value: `$${(totalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: "14px 18px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1B4F6B", lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#999", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ fontSize: "0.85rem", color: "#999", padding: "20px 0" }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: "32px 24px",
            textAlign: "center",
            border: "1px solid #E5E5E5",
          }}
        >
          <p style={{ fontSize: "0.9rem", color: "#888", margin: 0 }}>
            No beta accounts yet. Create one above and share the magic link.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((row) => {
            const isOpen = expanded.has(row.user_id);
            const conversionRevenue = row.conversions.reduce((s, c) => s + c.amount_paid, 0);

            return (
              <div
                key={row.user_id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  border: "1px solid #E5E5E5",
                  overflow: "hidden",
                }}
              >
                {/* Row header */}
                <div
                  onClick={() => row.conversions.length > 0 && toggleExpand(row.user_id)}
                  style={{
                    padding: "14px 18px",
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 80px 100px 80px",
                    gap: 12,
                    alignItems: "center",
                    cursor: row.conversions.length > 0 ? "pointer" : "default",
                  }}
                >
                  {/* Identity */}
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1A1A1A" }}>
                      {row.email}
                    </div>
                    {row.note && (
                      <div style={{ fontSize: "0.72rem", color: "#aaa", marginTop: 2 }}>
                        {row.note}
                      </div>
                    )}
                    <div style={{ fontSize: "0.72rem", color: "#ccc", marginTop: 2 }}>
                      {new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>

                  {/* Invites */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1B4F6B" }}>{row.invites_sent}</div>
                    <div style={{ fontSize: "0.68rem", color: "#aaa" }}>invites</div>
                  </div>

                  {/* Contributions */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1B4F6B" }}>{row.contributions_received}</div>
                    <div style={{ fontSize: "0.68rem", color: "#aaa" }}>memories</div>
                  </div>

                  {/* Conversions */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: row.conversions.length > 0 ? "#155724" : "#ccc" }}>
                      {row.conversions.length}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#aaa" }}>conversions</div>
                  </div>

                  {/* Revenue */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: row.conversions.length > 0 ? "#155724" : "#ccc" }}>
                      ${(conversionRevenue / 100).toFixed(0)}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#aaa" }}>revenue</div>
                  </div>
                </div>

                {/* Conversion detail (expandable) */}
                {isOpen && row.conversions.length > 0 && (
                  <div style={{ borderTop: "1px solid #F0F0F0", backgroundColor: "#FAFAFA", padding: "12px 18px" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                      Converted customers
                    </div>
                    {row.conversions.map((c) => (
                      <div
                        key={c.email}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "7px 0",
                          borderBottom: "1px solid #F0F0F0",
                          fontSize: "0.82rem",
                        }}
                      >
                        <span style={{ color: "#1A1A1A" }}>{c.email}</span>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <span style={{ color: "#155724", fontWeight: 600 }}>
                            ${(c.amount_paid / 100).toFixed(2)}
                          </span>
                          <span style={{ color: "#ccc" }}>
                            {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
