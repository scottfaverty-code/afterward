"use client";

import { useState } from "react";
import AdminOrdersTable from "./AdminOrdersTable";
import SeedDemoButton from "./SeedDemoButton";
import ManageAdmins from "./ManageAdmins";
import UserLookup from "./UserLookup";
import LaunchChecklist from "./LaunchChecklist";
import FeatureRoadmap from "./FeatureRoadmap";

type Order = Parameters<typeof AdminOrdersTable>[0]["orders"][number];
type AdminRow = Parameters<typeof ManageAdmins>[0]["initialAdmins"][number];

type Stat = { label: string; value: string | number; highlight?: boolean };

interface Props {
  stats: Stat[];
  orders: Order[];
  appUrl: string;
  role: string;
  adminsList: AdminRow[] | null;
  currentUserEmail: string;
}

const TABS = [
  { id: "orders", label: "Orders" },
  { id: "launch", label: "Launch checklist" },
  { id: "roadmap", label: "Roadmap" },
];

export default function AdminShell({ stats, orders, appUrl, role, adminsList, currentUserEmail }: Props) {
  const [activeTab, setActiveTab] = useState<string>("orders");

  return (
    <div style={{ padding: "32px" }}>
      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              borderLeft: stat.highlight ? "4px solid #C9932A" : "4px solid #D6EAF4",
            }}
          >
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1B4F6B", lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#999", marginTop: "6px" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: "2px solid #E5E5E5" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 20px",
              fontSize: "0.85rem",
              fontWeight: activeTab === tab.id ? 700 : 400,
              color: activeTab === tab.id ? "#1B4F6B" : "#999",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #1B4F6B" : "2px solid transparent",
              marginBottom: -2,
              cursor: "pointer",
              transition: "all 0.12s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {activeTab === "orders" && (
        <div>
          {/* Demo tools */}
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <SeedDemoButton appUrl={appUrl} />
          </div>

          {/* Customer lookup */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              overflow: "hidden",
              marginBottom: "24px",
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #F0F0F0" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A" }}>Customer lookup</h2>
              <p style={{ fontSize: "0.78rem", color: "#999", marginTop: "4px" }}>
                Find any user by email, check account status, and generate a support login link.
              </p>
            </div>
            <UserLookup />
          </div>

          {/* Orders table */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #F0F0F0" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A" }}>All orders</h2>
            </div>
            <AdminOrdersTable orders={orders} appUrl={appUrl} />
          </div>

          {/* Admin management, super_admin only */}
          {role === "super_admin" && (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                overflow: "hidden",
                marginTop: "32px",
              }}
            >
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F0F0F0" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A" }}>Admin access</h2>
                <p style={{ fontSize: "0.78rem", color: "#999", marginTop: "4px" }}>
                  Manage who can access this admin panel. Only super admins can make changes.
                </p>
              </div>
              <ManageAdmins
                initialAdmins={adminsList ?? []}
                currentUserEmail={currentUserEmail}
              />
            </div>
          )}
        </div>
      )}

      {/* Launch checklist tab */}
      {activeTab === "launch" && (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            padding: "28px 32px",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
            Launch checklist
          </h2>
          <p style={{ fontSize: "0.78rem", color: "#999", marginBottom: 24 }}>
            Click any item to mark it done. Checks are saved in this browser.
          </p>
          <LaunchChecklist />
        </div>
      )}

      {/* Roadmap tab */}
      {activeTab === "roadmap" && (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            padding: "28px 32px",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
            Feature roadmap
          </h2>
          <p style={{ fontSize: "0.78rem", color: "#999", marginBottom: 28 }}>
            A record of what&rsquo;s shipped and a place to track what&rsquo;s next. Ideas are saved in this browser.
          </p>
          <FeatureRoadmap />
        </div>
      )}
    </div>
  );
}
