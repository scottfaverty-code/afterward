"use client";

import { useState } from "react";

type AdminRow = {
  id: string;
  email: string;
  role: string;
  added_by: string | null;
  created_at: string;
};

interface Props {
  initialAdmins: AdminRow[];
  currentUserEmail: string;
}

const ROLE_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  super_admin: { label: "Super admin", bg: "#FDF3DC", color: "#C9932A" },
  admin: { label: "Admin", bg: "#EEF7FC", color: "#1B4F6B" },
};

export default function ManageAdmins({ initialAdmins, currentUserEmail }: Props) {
  const [admins, setAdmins] = useState<AdminRow[]>(initialAdmins);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "super_admin">("admin");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function addAdmin() {
    setError(null);
    setSuccess(null);

    if (!newEmail.trim()) {
      setError("Please enter an email address.");
      return;
    }

    setAdding(true);
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail.trim(), role: newRole }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setAdding(false);
      return;
    }

    setAdmins((prev) => [...prev, data.admin]);
    setNewEmail("");
    setNewRole("admin");
    setSuccess(`${data.admin.email} added as ${ROLE_LABELS[data.admin.role]?.label ?? data.admin.role}.`);
    setAdding(false);
  }

  async function removeAdmin(admin: AdminRow) {
    setError(null);
    setSuccess(null);

    if (admin.email === currentUserEmail) {
      setError("You cannot remove your own admin access.");
      return;
    }

    setRemoving(admin.id);
    const res = await fetch("/api/admin/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: admin.id, email: admin.email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setRemoving(null);
      return;
    }

    setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    setSuccess(`${admin.email} has been removed.`);
    setRemoving(null);
  }

  return (
    <div style={{ padding: "20px 24px" }}>
      {/* Current admins list */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", marginBottom: "28px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #F0F0F0" }}>
            {["Email", "Role", "Added by", "Since", ""].map((h) => (
              <th
                key={h}
                style={{
                  padding: "8px 12px",
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
          {admins.map((a) => {
            const roleStyle = ROLE_LABELS[a.role] ?? { label: a.role, bg: "#F0F0F0", color: "#666" };
            const isSelf = a.email === currentUserEmail;
            return (
              <tr key={a.id} style={{ borderBottom: "1px solid #F8F8F8" }}>
                <td style={{ padding: "12px 12px", fontWeight: isSelf ? 700 : 400, color: "#1A1A1A" }}>
                  {a.email}
                  {isSelf && (
                    <span style={{ marginLeft: "6px", fontSize: "0.7rem", color: "#999" }}>(you)</span>
                  )}
                </td>
                <td style={{ padding: "12px 12px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      borderRadius: "999px",
                      padding: "2px 10px",
                      backgroundColor: roleStyle.bg,
                      color: roleStyle.color,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {roleStyle.label}
                  </span>
                </td>
                <td style={{ padding: "12px 12px", color: "#999", fontSize: "0.78rem" }}>
                  {a.added_by ?? "—"}
                </td>
                <td style={{ padding: "12px 12px", color: "#999", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                  {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td style={{ padding: "12px 12px" }}>
                  {!isSelf && (
                    <button
                      onClick={() => removeAdmin(a)}
                      disabled={removing === a.id}
                      style={{
                        fontSize: "0.72rem",
                        color: removing === a.id ? "#ccc" : "#c0392b",
                        background: "none",
                        border: "none",
                        cursor: removing === a.id ? "default" : "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      {removing === a.id ? "Removing…" : "Remove"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add new admin */}
      <div
        style={{
          backgroundColor: "#F9F9F9",
          borderRadius: "10px",
          padding: "16px 20px",
          border: "1px solid #F0F0F0",
        }}
      >
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#1A1A1A",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Add admin
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="email"
            placeholder="Email address"
            value={newEmail}
            onChange={(e) => { setNewEmail(e.target.value); setError(null); setSuccess(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") addAdmin(); }}
            style={{
              flex: "1 1 220px",
              fontSize: "0.82rem",
              padding: "8px 12px",
              border: "1px solid #E0E0E0",
              borderRadius: "6px",
              outline: "none",
            }}
          />

          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as "admin" | "super_admin")}
            style={{
              fontSize: "0.82rem",
              padding: "8px 12px",
              border: "1px solid #E0E0E0",
              borderRadius: "6px",
              backgroundColor: "#fff",
              color: "#333",
              cursor: "pointer",
            }}
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super admin</option>
          </select>

          <button
            onClick={addAdmin}
            disabled={adding}
            style={{
              padding: "8px 18px",
              fontSize: "0.82rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: "none",
              backgroundColor: adding ? "#ccc" : "#1B4F6B",
              color: "#fff",
              cursor: adding ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {adding ? "Adding…" : "Add admin"}
          </button>
        </div>

        {error && (
          <p style={{ fontSize: "0.78rem", color: "#c0392b", marginTop: "8px" }}>{error}</p>
        )}
        {success && (
          <p style={{ fontSize: "0.78rem", color: "#155724", marginTop: "8px" }}>✓ {success}</p>
        )}

        <p style={{ fontSize: "0.72rem", color: "#aaa", marginTop: "10px", lineHeight: "1.5" }}>
          <strong>Admin</strong> can view orders, update plaque status, and download QR files.{" "}
          <strong>Super admin</strong> can also manage admin access.
        </p>
      </div>
    </div>
  );
}
