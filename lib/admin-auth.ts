import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AdminRole = "super_admin" | "admin";

export type AdminAuthResult =
  | { user: { id: string; email: string }; role: AdminRole }
  | { user: null; role: null };

/**
 * Returns the logged-in user and their admin role (from the `admins` table).
 * Returns null role if the user is not in the admins table.
 * Always uses the service-role client to read the admins table (bypasses RLS).
 */
export async function getAdminAuth(): Promise<AdminAuthResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return { user: null, role: null };

  const adminDb = createAdminClient();
  const { data } = await adminDb
    .from("admins")
    .select("role")
    .eq("email", user.email)
    .single();

  if (!data?.role) return { user: null, role: null };

  return {
    user: { id: user.id, email: user.email },
    role: data.role as AdminRole,
  };
}

/** Convenience: returns true if the user is any admin (admin or super_admin) */
export async function isAdmin(): Promise<boolean> {
  const { role } = await getAdminAuth();
  return role === "admin" || role === "super_admin";
}

/** Convenience: returns true if the user is specifically a super_admin */
export async function isSuperAdmin(): Promise<boolean> {
  const { role } = await getAdminAuth();
  return role === "super_admin";
}
