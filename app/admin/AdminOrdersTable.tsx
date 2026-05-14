"use client";

import { useState } from "react";
import JSZip from "jszip";
import { generateStyledSVG, downloadText } from "@/lib/qr-download";

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

function slugLabel(order: Order): string {
  const name = [order.profile?.first_name, order.profile?.last_name].filter(Boolean).join(" ");
  return name || order.profile?.memorial_slug || order.id;
}

/** Filename-safe version of the author's name, e.g. "Margaret Williams" → "margaret-williams" */
function nameSlug(order: Order): string {
  const name = [order.profile?.first_name, order.profile?.last_name]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return name || order.profile?.memorial_slug || order.id;
}

type QRFormat = "eps" | "svg";

/** Fetch EPS from the server route */
async function fetchEPS(slug: string, name: string): Promise<string> {
  const params = new URLSearchParams({ slug, name, format: "eps" });
  const res = await fetch(`/api/admin/qr-eps?${params}`);
  if (!res.ok) throw new Error(`Failed to generate EPS for ${slug}: ${res.status}`);
  return res.text();
}


export default function AdminOrdersTable({ orders, appUrl }: { orders: Order[]; appUrl: string }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null); // order.id
  const [deleting, setDeleting] = useState<string | null>(null); // order.id
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete(order: Order) {
    if (!order.user_id) return;
    setDeleting(order.id);
    setDeleteError(null);
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: order.user_id }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (data.ok) {
        setDeletedIds((prev) => new Set([...prev, order.id]));
        setConfirmingDelete(null);
      } else {
        setDeleteError(data.error ?? "Delete failed");
      }
    } catch {
      setDeleteError("Network error");
    } finally {
      setDeleting(null);
    }
  }

  // QR download state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState<string | null>(null); // orderId+format or "bulk"
  const [bulkProgress, setBulkProgress] = useState<string | null>(null);

  const visibleOrders = orders.filter((o) => !deletedIds.has(o.id));
  const downloadableOrders = visibleOrders.filter((o) => o.profile?.memorial_slug);

  const allSelected =
    downloadableOrders.length > 0 &&
    downloadableOrders.every((o) => selected.has(o.id));

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(downloadableOrders.map((o) => o.id)));
    }
  }

  function toggleOne(orderId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  }

  async function downloadSingle(order: Order, format: QRFormat) {
    if (!order.profile?.memorial_slug) return;
    const slug = order.profile.memorial_slug;
    const key = `${order.id}-${format}`;
    setDownloading(key);
    try {
      const origin = window.location.origin;
      const memUrl = `${origin}/memorial/${slug}`;
      const content = format === "svg"
        ? await generateStyledSVG(memUrl)
        : await fetchEPS(slug, slugLabel(order));
      downloadText(
        content,
        `afterword-qr-${nameSlug(order)}.${format}`,
        format === "svg" ? "image/svg+xml" : "application/postscript",
      );
    } catch (e) {
      alert(`Download failed: ${(e as Error).message}`);
    } finally {
      setDownloading(null);
    }
  }

  async function downloadBulk(targetOrders: Order[], format: QRFormat) {
    const valid = targetOrders.filter((o) => o.profile?.memorial_slug);
    if (valid.length === 0) return;

    setDownloading("bulk");
    setBulkProgress(`0 / ${valid.length}`);

    try {
      const zip = new JSZip();
      const origin = window.location.origin;

      for (let i = 0; i < valid.length; i++) {
        const order = valid[i];
        const slug = order.profile!.memorial_slug!;
        setBulkProgress(`${i + 1} / ${valid.length}, ${slugLabel(order)}`);

        const memUrl = `${origin}/memorial/${slug}`;
        const content = format === "svg"
          ? await generateStyledSVG(memUrl)
          : await fetchEPS(slug, slugLabel(order));

        zip.file(`afterword-qr-${nameSlug(order)}.${format}`, content);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `afterword-qr-${format}-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(`Bulk download failed: ${(e as Error).message}`);
    } finally {
      setDownloading(null);
      setBulkProgress(null);
    }
  }

  function downloadCSV(targetOrders: Order[]) {
    const valid = targetOrders.filter((o) => o.profile?.memorial_slug);
    if (valid.length === 0) return;

    const headers = [
      "Name",
      "Email",
      "QR Filename (EPS)",
      "QR Filename (SVG)",
      "Recipient Name",
      "Address Line 1",
      "City",
      "State / Province",
      "Postal Code",
      "Country",
      "Plaque Status",
    ];

    const escape = (v: string | null | undefined) => {
      const s = v ?? "";
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    };

    const rows = valid.map((o) => {
      const ns = nameSlug(o);
      const a = o.shippingAddress;
      return [
        slugLabel(o),
        o.email ?? "",
        `afterword-qr-${ns}.eps`,
        `afterword-qr-${ns}.svg`,
        a?.recipient_name ?? "",
        a?.address_line_1 ?? "",
        a?.city ?? "",
        a?.state_province ?? "",
        a?.postal_code ?? "",
        a?.country ?? "",
        o.plaque_status,
      ].map(escape).join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `afterword-plaque-manifest-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

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

  const selectedOrders = visibleOrders.filter((o) => selected.has(o.id));

  return (
    <div>
      {/* QR Bulk Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
          backgroundColor: "#F9F9F9",
          borderBottom: "1px solid #F0F0F0",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "0.78rem", color: "#666", fontWeight: 600 }}>
          QR EPS Downloads
        </span>

        {/* All, EPS + SVG */}
        {(["eps", "svg"] as QRFormat[]).map((fmt) => (
          <button
            key={`all-${fmt}`}
            onClick={() => downloadBulk(downloadableOrders, fmt)}
            disabled={downloading !== null || downloadableOrders.length === 0}
            style={{
              padding: "5px 14px",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: `1px solid ${fmt === "eps" ? "#1B4F6B" : "#9B59B6"}`,
              backgroundColor: fmt === "eps" ? "#1B4F6B" : "#9B59B6",
              color: "#fff",
              cursor: downloading !== null || downloadableOrders.length === 0 ? "default" : "pointer",
              opacity: downloading !== null || downloadableOrders.length === 0 ? 0.5 : 1,
            }}
          >
            All ({downloadableOrders.length}) → {fmt.toUpperCase()} ZIP
          </button>
        ))}

        {/* All → CSV manifest */}
        <button
          onClick={() => downloadCSV(downloadableOrders)}
          disabled={downloadableOrders.length === 0}
          style={{
            padding: "5px 14px",
            fontSize: "0.75rem",
            fontWeight: 600,
            borderRadius: "6px",
            border: "1px solid #27AE60",
            backgroundColor: "#27AE60",
            color: "#fff",
            cursor: downloadableOrders.length === 0 ? "default" : "pointer",
            opacity: downloadableOrders.length === 0 ? 0.5 : 1,
          }}
        >
          All ({downloadableOrders.length}) → CSV
        </button>

        {/* Selected, EPS + SVG + CSV */}
        {selected.size > 0 && (["eps", "svg"] as QRFormat[]).map((fmt) => (
          <button
            key={`sel-${fmt}`}
            onClick={() => downloadBulk(selectedOrders, fmt)}
            disabled={downloading !== null}
            style={{
              padding: "5px 14px",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: `1px solid ${fmt === "eps" ? "#2E7DA3" : "#8E44AD"}`,
              backgroundColor: "transparent",
              color: fmt === "eps" ? "#2E7DA3" : "#8E44AD",
              cursor: downloading !== null ? "default" : "pointer",
              opacity: downloading !== null ? 0.5 : 1,
            }}
          >
            Selected ({selected.size}) → {fmt.toUpperCase()} ZIP
          </button>
        ))}
        {selected.size > 0 && (
          <button
            onClick={() => downloadCSV(selectedOrders)}
            style={{
              padding: "5px 14px",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: "1px solid #1E8449",
              backgroundColor: "transparent",
              color: "#1E8449",
              cursor: "pointer",
            }}
          >
            Selected ({selected.size}) → CSV
          </button>
        )}

        {downloading === "bulk" && bulkProgress && (
          <span style={{ fontSize: "0.75rem", color: "#1B4F6B", fontStyle: "italic" }}>
            Generating… {bulkProgress}
          </span>
        )}

        {selected.size > 0 && (
          <button
            onClick={() => setSelected(new Set())}
            style={{
              padding: "4px 10px",
              fontSize: "0.72rem",
              borderRadius: "6px",
              border: "1px solid #E0E0E0",
              backgroundColor: "#fff",
              color: "#999",
              cursor: "pointer",
            }}
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #F0F0F0" }}>
              {/* Select-all checkbox */}
              <th style={{ padding: "12px 12px 12px 16px", width: "32px" }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  title="Select all"
                  style={{ cursor: "pointer" }}
                />
              </th>
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
            {visibleOrders.map((order) => {
              const status = localStatuses[order.id] ?? order.plaque_status;
              const statusStyle = STATUS_COLORS[status] ?? STATUS_COLORS.pending;
              const fullName = [order.profile?.first_name, order.profile?.last_name].filter(Boolean).join(" ") || "-";
              const trackingUrl = trackingInputs[order.id] ?? order.plaque_tracking_url ?? "";
              const hasSlug = !!order.profile?.memorial_slug;

              const emailConfirmed = order.auth?.emailConfirmed ?? false;
              const hasPassword = order.auth?.hasPassword ?? false;
              const lastSignIn = order.auth?.lastSignIn ?? null;
              const accountIssue = !emailConfirmed || !hasPassword;

              return (
                <tr
                  key={order.id}
                  style={{
                    borderBottom: "1px solid #F8F8F8",
                    backgroundColor: selected.has(order.id) ? "#F0F7FF" : "transparent",
                  }}
                >
                  {/* Checkbox */}
                  <td style={{ padding: "14px 12px 14px 16px" }}>
                    {hasSlug ? (
                      <input
                        type="checkbox"
                        checked={selected.has(order.id)}
                        onChange={() => toggleOne(order.id)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <span title="No memorial slug, cannot generate QR" style={{ color: "#ddd", fontSize: "0.75rem" }}>-</span>
                    )}
                  </td>

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
                      {order.email ?? "-"}
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
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ fontSize: "0.7rem", color: emailConfirmed ? "#155724" : "#C9932A", fontWeight: 600 }}>
                          {emailConfirmed ? "✓" : "✗"}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#666" }}>Email confirmed</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ fontSize: "0.7rem", color: hasPassword ? "#155724" : "#C9932A", fontWeight: 600 }}>
                          {hasPassword ? "✓" : "✗"}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#666" }}>Password set</span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "2px" }}>
                        {lastSignIn
                          ? `Last login: ${relativeTime(lastSignIn)}`
                          : accountIssue
                            ? <span style={{ color: "#C9932A", fontWeight: 600 }}>Never logged in</span>
                            : "Never logged in"}
                      </div>
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
                      <span style={{ color: "#ccc" }}>-</span>
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

                      {/* QR downloads, EPS + SVG */}
                      {hasSlug && (
                        <div style={{ display: "flex", gap: "4px" }}>
                          {(["eps", "svg"] as QRFormat[]).map((fmt) => {
                            const fmtKey = `${order.id}-${fmt}`;
                            const isThisDownloading = downloading === fmtKey;
                            return (
                              <button
                                key={fmt}
                                onClick={() => downloadSingle(order, fmt)}
                                disabled={downloading !== null}
                                style={{
                                  padding: "3px 8px",
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  borderRadius: "4px",
                                  border: "1px solid #9B59B6",
                                  backgroundColor: isThisDownloading ? "#E8D5F5" : "#fff",
                                  color: "#9B59B6",
                                  cursor: downloading !== null ? "default" : "pointer",
                                  opacity: downloading !== null && !isThisDownloading ? 0.4 : 1,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {isThisDownloading ? "…" : `⬇ ${fmt.toUpperCase()}`}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Delete */}
                      {order.user_id && (
                        <div style={{ marginTop: 2 }}>
                          {confirmingDelete === order.id ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <span style={{ fontSize: "0.7rem", color: "#7B1D1D", fontWeight: 600 }}>
                                Delete permanently?
                              </span>
                              {deleteError && deleting === order.id && (
                                <span style={{ fontSize: "0.68rem", color: "#c0392b" }}>{deleteError}</span>
                              )}
                              <div style={{ display: "flex", gap: 4 }}>
                                <button
                                  onClick={() => handleDelete(order)}
                                  disabled={deleting === order.id}
                                  style={{
                                    padding: "3px 8px",
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    borderRadius: "4px",
                                    border: "none",
                                    backgroundColor: "#c0392b",
                                    color: "#fff",
                                    cursor: deleting === order.id ? "wait" : "pointer",
                                    opacity: deleting === order.id ? 0.6 : 1,
                                  }}
                                >
                                  {deleting === order.id ? "Deleting…" : "Confirm"}
                                </button>
                                <button
                                  onClick={() => { setConfirmingDelete(null); setDeleteError(null); }}
                                  style={{
                                    padding: "3px 8px",
                                    fontSize: "0.7rem",
                                    borderRadius: "4px",
                                    border: "1px solid #E0E0E0",
                                    backgroundColor: "#fff",
                                    color: "#999",
                                    cursor: "pointer",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setConfirmingDelete(order.id); setDeleteError(null); }}
                              style={{
                                padding: "3px 8px",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                borderRadius: "4px",
                                border: "1px solid #f5c6cb",
                                backgroundColor: "#fff",
                                color: "#c0392b",
                                cursor: "pointer",
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {visibleOrders.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "#999" }}>
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
