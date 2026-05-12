import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { EMAIL_TEMPLATE_META, type TemplateId } from "../route";

const VALID_IDS = new Set<string>(EMAIL_TEMPLATE_META.map((t) => t.id));

// ---------------------------------------------------------------------------
// PUT /api/admin/email-templates/[id] — save a subject + html_body override
// ---------------------------------------------------------------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, role } = await getAdminAuth();
  if (!user || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId } = await params;
  if (!VALID_IDS.has(rawId)) {
    return NextResponse.json({ error: "Unknown template ID" }, { status: 404 });
  }
  const id = rawId as TemplateId;

  const body = await req.json().catch(() => ({}));
  const subject: string | null =
    typeof body.subject === "string" && body.subject.trim() ? body.subject.trim() : null;
  const html_body: string | null =
    typeof body.html_body === "string" && body.html_body.trim() ? body.html_body.trim() : null;

  if (!subject || !html_body) {
    return NextResponse.json({ error: "subject and html_body are required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("email_templates")
    .upsert({ id, subject, html_body, updated_at: new Date().toISOString() }, { onConflict: "id" });

  if (error) {
    console.error("[email-templates] Save failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`[email-templates] Template "${id}" saved by ${user.email}`);
  return NextResponse.json({ ok: true });
}

// ---------------------------------------------------------------------------
// DELETE /api/admin/email-templates/[id] — reset to hardcoded default
// ---------------------------------------------------------------------------
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, role } = await getAdminAuth();
  if (!user || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId2 } = await params;
  if (!VALID_IDS.has(rawId2)) {
    return NextResponse.json({ error: "Unknown template ID" }, { status: 404 });
  }

  const admin = createAdminClient();
  await admin.from("email_templates").delete().eq("id", rawId2);

  console.log(`[email-templates] Template "${rawId2}" reset to default by ${user.email}`);
  return NextResponse.json({ ok: true });
}
