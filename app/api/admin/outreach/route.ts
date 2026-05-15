import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAuth } from "@/lib/admin-auth";

export type OutreachStatus =
  | "to_contact"
  | "reached_out"
  | "interested"
  | "signed_up"
  | "not_interested";

export type OutreachContact = {
  id: string;
  name: string;
  relationship: "family" | "friend";
  notes: string | null;
  status: OutreachStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// Initial seed — inserted once when the table is empty.
const SEED: Omit<OutreachContact, "id" | "created_at" | "updated_at">[] = [
  // ── Family ────────────────────────────────────────────────────────────────
  { name: "Debbie & Jay Jamison",    relationship: "family", notes: "Aunt and uncle",              status: "reached_out",  sort_order: 10 },
  { name: "Terry McGowan",           relationship: "family", notes: "Step dad",                     status: "to_contact",   sort_order: 11 },
  { name: "Karen & Ken McGinnis",    relationship: "family", notes: "Aunt and uncle",              status: "to_contact",   sort_order: 12 },
  { name: "Ellen & Mike Williamson", relationship: "family", notes: "Dad's sister and husband",    status: "to_contact",   sort_order: 13 },
  { name: "Alice & Mike Linhard",    relationship: "family", notes: "Dad's sister and husband",    status: "to_contact",   sort_order: 14 },

  // ── Friends ───────────────────────────────────────────────────────────────
  { name: "Brian Berman",            relationship: "friend", notes: "About his mom, dad, and aunt",            status: "reached_out",  sort_order: 20 },
  { name: "Ben & Shestin Swartley",  relationship: "friend", notes: "About Ben's mom, dad, Kelly, and Jeff",   status: "reached_out",  sort_order: 21 },
  { name: "Chelsea Allen",           relationship: "friend", notes: "About her mom and dad",                   status: "to_contact",   sort_order: 22 },
  { name: "Aaron Gaily",             relationship: "friend", notes: null, status: "to_contact",   sort_order: 23 },
  { name: "Seth Marks",              relationship: "friend", notes: null, status: "to_contact",   sort_order: 24 },
  { name: "Mike Walthers",           relationship: "friend", notes: null, status: "to_contact",   sort_order: 25 },
  { name: "Brad Lewis",              relationship: "friend", notes: null, status: "to_contact",   sort_order: 26 },
  { name: "Bret Hogan",              relationship: "friend", notes: null, status: "to_contact",   sort_order: 27 },
  { name: "The Garveys",             relationship: "friend", notes: null, status: "to_contact",   sort_order: 28 },
  { name: "Alex Horowitz",           relationship: "friend", notes: null, status: "to_contact",   sort_order: 29 },
  { name: "Heidi Knott",             relationship: "friend", notes: null, status: "to_contact",   sort_order: 30 },
  { name: "Allison Barrientos",      relationship: "friend", notes: null, status: "to_contact",   sort_order: 31 },
  { name: "Phil Barrientos",         relationship: "friend", notes: null, status: "to_contact",   sort_order: 32 },
  { name: "Jackie Olsen",            relationship: "friend", notes: null, status: "to_contact",   sort_order: 33 },
  { name: "David Olson",             relationship: "friend", notes: null, status: "to_contact",   sort_order: 34 },
  { name: "Amanda DeSalvo",          relationship: "friend", notes: null, status: "to_contact",   sort_order: 35 },
  { name: "Chris DeSalvo",           relationship: "friend", notes: null, status: "to_contact",   sort_order: 36 },
  { name: "Laith Agha",              relationship: "friend", notes: null, status: "to_contact",   sort_order: 37 },
  { name: "Corey Wood",              relationship: "friend", notes: null, status: "to_contact",   sort_order: 38 },
  { name: "Chris Orosco",            relationship: "friend", notes: null, status: "to_contact",   sort_order: 39 },
  { name: "Marianne McClure",        relationship: "friend", notes: null, status: "to_contact",   sort_order: 40 },
  { name: "James Nichols",           relationship: "friend", notes: null, status: "to_contact",   sort_order: 41 },
  { name: "Jeff Nakamura",           relationship: "friend", notes: null, status: "to_contact",   sort_order: 42 },
  { name: "Kevin Kinkor",            relationship: "friend", notes: null, status: "to_contact",   sort_order: 43 },
  { name: "Roslyn Fogarty",          relationship: "friend", notes: null, status: "to_contact",   sort_order: 44 },
  { name: "Stephanie Thomas",        relationship: "friend", notes: null, status: "to_contact",   sort_order: 45 },
];

async function guardSuperAdmin() {
  const { user, role } = await getAdminAuth();
  if (!user || role !== "super_admin") return null;
  return createAdminClient();
}

/** GET /api/admin/outreach — list all contacts, seeding on first run */
export async function GET() {
  const admin = await guardSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Seed if table is empty
  const { data: existing } = await admin
    .from("outreach_contacts")
    .select("id")
    .limit(1);

  if (!existing || existing.length === 0) {
    await admin.from("outreach_contacts").insert(SEED);
  }

  const { data, error } = await admin
    .from("outreach_contacts")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** PATCH /api/admin/outreach — update status and/or notes for one contact */
export async function PATCH(req: NextRequest) {
  const admin = await guardSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, status, notes } = await req.json() as {
    id: string;
    status?: OutreachStatus;
    notes?: string | null;
  };

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;

  const { error } = await admin.from("outreach_contacts").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** POST /api/admin/outreach — add a new contact */
export async function POST(req: NextRequest) {
  const admin = await guardSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, relationship, notes } = await req.json() as {
    name: string;
    relationship: "family" | "friend";
    notes?: string;
  };

  if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });

  const { data, error } = await admin
    .from("outreach_contacts")
    .insert({ name: name.trim(), relationship: relationship ?? "friend", notes: notes?.trim() || null, status: "to_contact", sort_order: 999 })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
