"use client";

import { useState } from "react";

type Order = {
  id: string;
  user_id: string | null;
  email: string | null;
  amount_paid: number | null;
  plaque_status: string;
  plaque_tracking_url: string | null;
  shipping_address_deferred: boolean;
  created_at: string;
  stripe_session_id: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
    memorial_slug: string | null;
    page_is_public: boolean;
  } | null;
  shippingAddress: {
    recipient_name: string | null;
    address_line_1: string | null;
    city: string | null;
    state_province: string | null;
    postal_code: string | null;
    country: string | null;
    delivery_type: string | null;
  } | null;
  answerCount: number;
  auth: {
    lastSignIn: string | null;
    emailConfirmed: boolean;
    hasPassword: boolean;
  } | null;
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#FDF3DC", color: "#C9932A" },
  shipped: { bg: "#EEF7FC", color: "#1B4F6B" },
  delivered: { bg: "#d4edda", color: "#155724" },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

export default function AdminOrdersTable({ orders, appUrl }: { orders: Order[]; appUrl: string }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  async function updateStatus(orderId: string, status: string, trackingUrl?: string) {
    setUpdating(orderId);
    try {
      const res = await fetch("/api/admin/update-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status, trackingUrl }),
      });
      if (res.ok) {
        setLocalStatuses((prev) => ({ ...prev, [orderId]: status }));
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #F0F0F0" }}>
            {["Date", "Customer", "Email", "Account", "Address", "Stories", "Page", "Plaque status", "Actions"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#999",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const status = localStatuses[order.id] ?? order.plaque_status;
            const statusStyle = STATUS_COLORS[status] ?? STATUS_COLORS.pending;
            const fullName = [order.profile?.first_name, order.profile?.last_name].filter(Boolean).join(" ") || "—";
            const trackingUrl = trackingInputs[order.id] ?? order.plaque_tracking_url ?? "";

            const emailConfirmed = order.auth?.emailConfirmed ?? false;
            const hasPassword = order.auth?.hasPassword ?? false;
            const lastSignIn = order.auth?.lastSignIn ?? null;
            const accountIssue = !emailConfirmed || !hasPassword;

            return (
              <tr key={order.id} style={{ borderBottom: "1px solid #F8F8F8" }}>
                {/* Date */}
                <td style={{ padding: "14px 16px", color: "#999", whiteSpace: "nowrap" }}>
                  {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>

                {/* Customer */}
                <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap" }}>
                  {fullName}
                </td>

                {/* Email */}
                <td style={{ padding: "14px 16px", color: "#555" }}>
                  <a href={`mailto:${order.email}`} style={{ color: "#1B4F6B" }}>
                    {order.email ?? "—"}
                  </a>
                  {order.stripe_session_id && (
                    <div style={{ marginTop: "3px" }}>
                      <a
                        href={`https://dashboard.stripe.com/payments/${order.stripe_session_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "0.7rem", color: "#999" }}
                      >
                        Stripe ↗
                      </a>
                    </div>
                  )}
                </td>

                {/* Account health */}
                <td style={{ padding: "14px 16px", minWidth: "140px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {/* Email confirmed */}
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "0.7rem", color: emailConfirmed ? "#155724" : "#C9932A", fontWeight: 600 }}>
                        {emailConfirmed ? "✓" : "✗"}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#666" }}>Email confirmed</span>
                    </div>
                    {/* Password set */}
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "0.7rem", color: hasPassword ? "#155724" : "#C9932A", fontWeight: 600 }}>
                        {hasPassword ? "✓" : "✗"}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#666" }}>Password set</span>
                    </div>
                    {/* Last login */}
                    <div style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "2px" }}>
                      {lastSignIn
                        ? `Last login: ${relativeTime(lastSignIn)}`
                        : accountIssue
                          ? <span style={{ color: "#C9932A", fontWeight: 600 }}>Never logged in</span>
                          : "Never logged in"}
                    </div>
                    {/* Slug missing */}
                    {!order.profile?.memorial_slug && (
                      <div style={{ fontSize: "0.7rem", color: "#C9932A", fontWeight: 600 }}>
                        ⚠ No memorial slug
                      </div>
                    )}
                  </div>
                </td>

                {/* Address */}
                <td style={{ padding: "14px 16px", color: "#555", minWidth: "160px" }}>
                  {order.shipping_address_deferred || !order.shippingAddress ? (
                    <span style={{ color: "#C9932A", fontWeight: 600 }}>⚠ Not provided</span>
                  ) : (
                    <div>
                      <div>{order.shippingAddress.recipient_name}</div>
                      <div style={{ color: "#999", fontSize: "0.75rem" }}>
                        {order.shippingAddress.city}, {order.shippingAddress.state_province} {order.shippingAddress.postal_code}
                      </div>
                      <div style={{ color: "#999", fontSize: "0.75rem" }}>{order.shippingAddress.country}</div>
                    </div>
                  )}
                </td>

                {/* Story answers */}
                <td style={{ padding: "14px 16px", textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      borderRadius: "999px",
                      padding: "2px 10px",
                      backgroundColor: order.answerCount > 0 ? "#EEF7FC" : "#F5F5F5",
                      color: order.answerCount > 0 ? "#1B4F6B" : "#999",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                    }}
                  >
                    {order.answerCount}
                  </span>
                </td>

                {/* Memorial page */}
                <td style={{ padding: "14px 16px" }}>
                  {order.profile?.memorial_slug ? (
                    <a
                      href={`${appUrl}/memorial/${order.profile.memorial_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1B4F6B", fontSize: "0.78rem" }}
                    >
                      {order.profile.page_is_public ? "Public ↗" : "Private ↗"}
                    </a>
                  ) : (
                    <span style={{ color: "#ccc" }}>—</span>
                  )}
                </td>

                {/* Plaque status badge */}
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      borderRadius: "999px",
                      padding: "3px 10px",
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {status}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ padding: "14px 16px", minWidth: "220px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {/* Status buttons */}
                    <div style={{ display: "flex", gap: "4px" }}>
                      {["pending", "shipped", "delivered"].map((s) => (
                        <button
                          key={s}
                          disabled={status === s || updating === order.id}
                          onClick={() => updateStatus(order.id, s, s === "shipped" ? trackingUrl : undefined)}
                          style={{
                            padding: "3px 8px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            borderRadius: "4px",
                            border: "1px solid #E0E0E0",
                            backgroundColor: status === s ? "#1B4F6B" : "#fff",
                            color: status === s ? "#fff" : "#555",
                            cursor: status === s ? "default" : "pointer",
                            opacity: updating === order.id ? 0.5 : 1,
                            textTransform: "capitalize",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Tracking URL input */}
                    <div style={{ display: "flex", gap: "4px" }}>
                      <input
                        type="text"
                        placeholder="Tracking URL"
                        value={trackingUrl}
                        onChange={(e) => setTrackingInputs((prev) => ({ ...prev, [order.id]: e.target.value }))}
                        style={{
                          flex: 1,
                          fontSize: "0.72rem",
                          padding: "3px 6px",
                          border: "1px solid #E0E0E0",
                          borderRadius: "4px",
                          minWidth: 0,
                        }}
                      />
                      <button
                        disabled={!trackingInputs[order.id] || updating === order.id}
                        onClick={() => updateStatus(order.id, status, trackingInputs[order.id])}
                        style={{
                          padding: "3px 8px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          borderRadius: "4px",
                          border: "1px solid #1B4F6B",
                          backgroundColor: "#1B4F6B",
                          color: "#fff",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          opacity: !trackingInputs[order.id] || updating === order.id ? 0.4 : 1,
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div style={{ padding: "48px", textAlign: "center", color: "#999" }}>
          No orders yet.
        </div>
      )}
    </div>
  );
}
