import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAuth } from "@/lib/admin-auth";

/** POST /api/admin/admins, add a new admin (super_admin only) */
export async function POST(req: NextRequest) {
  const { user, role } = await getAdminAuth();

  if (!user || role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as { email?: string; role?: string };
  const email = body.email?.trim().toLowerCase();
  const newRole = body.role === "super_admin" ? "super_admin" : "admin";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("admins")
    .insert({ email, role: newRole, added_by: user.email })
    .select("id, email, role, added_by, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "That email is already an admin" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ admin: data });
}

/** DELETE /api/admin/admins, remove an admin by id (super_admin only, cannot remove self) */
export async function DELETE(req: NextRequest) {
  const { user, role } = await getAdminAuth();

  if (!user || role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as { id?: string; email?: string };

  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Cannot remove yourself
  if (body.email === user.email) {
    return NextResponse.json({ error: "You cannot remove your own admin access" }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db.from("admins").delete().eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
