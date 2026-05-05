import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  const { user, role } = await getAdminAuth();
  if (!user || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Fetch all beta purchases
  const { data: betaPurchases } = await admin
    .from("purchases")
    .select("user_id, email, created_at, stripe_session_id")
    .eq("is_beta", true)
    .order("created_at", { ascending: false });

  if (!betaPurchases || betaPurchases.length === 0) {
    return NextResponse.json({ rows: [] });
  }

  // Fetch all paid conversions attributed to any beta user
  const { data: conversions } = await admin
    .from("purchases")
    .select("email, amount_paid, created_at, referred_by_user_id")
    .eq("is_beta", false)
    .not("referred_by_user_id", "is", null);

  // Fetch invite counts per beta user
  const betaUserIds = betaPurchases.map((p) => p.user_id as string);

  const { data: invites } = await admin
    .from("contribution_invites")
    .select("owner_user_id")
    .in("owner_user_id", betaUserIds);

  const { data: contributions } = await admin
    .from("contributions")
    .select("memorial_slug, contribution_invites(owner_user_id)")
    .in("contribution_invites.owner_user_id", betaUserIds);

  // Build invite count map
  const inviteCountMap: Record<string, number> = {};
  for (const inv of invites ?? []) {
    const uid = inv.owner_user_id as string;
    inviteCountMap[uid] = (inviteCountMap[uid] ?? 0) + 1;
  }

  // Build contribution count map (by invite owner)
  const contributionCountMap: Record<string, number> = {};
  for (const c of contributions ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ownerId = (c as any).contribution_invites?.owner_user_id as string | undefined;
    if (ownerId) {
      contributionCountMap[ownerId] = (contributionCountMap[ownerId] ?? 0) + 1;
    }
  }

  // Build conversions map (by referred_by_user_id)
  const conversionMap: Record<string, Array<{ email: string; amount_paid: number; created_at: string }>> = {};
  for (const conv of conversions ?? []) {
    const uid = conv.referred_by_user_id as string;
    if (!conversionMap[uid]) conversionMap[uid] = [];
    conversionMap[uid].push({
      email: conv.email as string,
      amount_paid: conv.amount_paid as number,
      created_at: conv.created_at as string,
    });
  }

  // Fetch notes from stripe_session_id metadata (stored as "beta-{userId}-{ts}-{note}")
  // Notes are not stored in DB yet — this is a placeholder for future enrichment.
  // For now we extract any note embedded in the session_id string.
  function parseNote(stripeSessionId: string): string | null {
    // Format: beta-{userId}-{timestamp} — no note in current schema
    // Will be enhanced when a notes column is added
    return null;
  }

  const rows = betaPurchases.map((p) => ({
    user_id: p.user_id,
    email: p.email,
    created_at: p.created_at,
    note: parseNote(p.stripe_session_id as string),
    invites_sent: inviteCountMap[p.user_id as string] ?? 0,
    contributions_received: contributionCountMap[p.user_id as string] ?? 0,
    conversions: conversionMap[p.user_id as string] ?? [],
  }));

  return NextResponse.json({ rows });
}
