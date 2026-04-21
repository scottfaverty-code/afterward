import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAuth } from "@/lib/admin-auth";
import AdminOrdersTable from "./AdminOrdersTable";
import SeedDemoButton from "./SeedDemoButton";
import ManageAdmins from "./ManageAdmins";

export default async function AdminPage() {
  const { user, role } = await getAdminAuth();

  if (!user || !role) redirect("/");

  const admin = createAdminClient();

  // Fetch admins list (for super_admin)
  const { data: adminsList } = role === "super_admin"
    ? await admin.from("admins").select("id, email, role, added_by, created_at").order("created_at")
    : { data: null };

  // Fetch all purchases with profile and shipping address
  const { data: purchases } = await admin
    .from("purchases")
    .select(`
      id,
      user_id,
      email,
      amount_paid,
      plaque_status,
      plaque_tracking_url,
      shipping_address_deferred,
      created_at,
      stripe_session_id
    `)
    .order("created_at", { ascending: false });

  // Fetch all profiles
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, first_name, last_name, memorial_slug, page_is_public");

  // Fetch all shipping addresses
  const { data: shippingAddresses } = await admin
    .from("shipping_addresses")
    .select("user_id, recipient_name, address_line_1, city, state_province, postal_code, country, delivery_type");

  // Fetch story answer counts per user
  const { data: answerCounts } = await admin
    .from("story_answers")
    .select("user_id, id")
    .eq("skipped", false);

  // Fetch auth user data (last login, email confirmed, password set)
  const { data: authUsersData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const authUsers = authUsersData?.users ?? [];

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  const addressMap = Object.fromEntries((shippingAddresses ?? []).map((a) => [a.user_id, a]));
  const answerCountMap: Record<string, number> = {};
  for (const a of answerCounts ?? []) {
    answerCountMap[a.user_id] = (answerCountMap[a.user_id] ?? 0) + 1;
  }
  const authUserMap = Object.fromEntries(authUsers.map((u) => [u.id, {
    lastSignIn: u.last_sign_in_at ?? null,
    emailConfirmed: !!u.email_confirmed_at,
    hasPassword: u.identities?.some((i) => i.provider === "email") ?? false,
  }]));

  const orders = (purchases ?? []).map((p) => ({
    ...p,
    profile: profileMap[p.user_id ?? ""] ?? null,
    shippingAddress: addressMap[p.user_id ?? ""] ?? null,
    answerCount: answerCountMap[p.user_id ?? ""] ?? 0,
    auth: authUserMap[p.user_id ?? ""] ?? null,
  }));

  // Stats
  const totalRevenue = (purchases ?? []).reduce((sum, p) => sum + (p.amount_paid ?? 0), 0);
  const pending = (purchases ?? []).filter((p) => p.plaque_status === "pending").length;
  const shipped = (purchases ?? []).filter((p) => p.plaque_status === "shipped").length;
  const delivered = (purchases ?? []).filter((p) => p.plaque_status === "delivered").length;

  return (
    <div style={{ backgroundColor: "#F4F7FA", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#0f2d3d", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "1.3rem", color: "#fff" }}>Afterword</div>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Super Admin</div>
        </div>
        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
          {user.email}
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        {/* Stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total customers", value: orders.length },
            { label: "Total revenue", value: `$${(totalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
            { label: "Plaques pending", value: pending, highlight: pending > 0 },
            { label: "Plaques shipped", value: shipped },
            { label: "Plaques delivered", value: delivered },
          ].map((stat) => (
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

        {/* Demo tools */}
        <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <SeedDemoButton appUrl={process.env.NEXT_PUBLIC_APP_URL ?? ""} />
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
          <AdminOrdersTable orders={orders} appUrl={process.env.NEXT_PUBLIC_APP_URL ?? ""} />
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
              currentUserEmail={user.email}
            />
          </div>
        )}
      </div>
    </div>
  );
}
