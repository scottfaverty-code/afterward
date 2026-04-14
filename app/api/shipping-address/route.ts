import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, delivery_type, recipient_name, contact_name, address_line_1, address_line_2, city, state_province, postal_code, country, attorney_note } = body;

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Look up user via Stripe session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const customerEmail = session.customer_details?.email ?? session.customer_email ?? "";

    if (!customerEmail) {
      return NextResponse.json({ error: "Could not find customer email" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Find the user by email directly
    const { data: { users }, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (listError) {
      console.error("List users error:", listError);
      return NextResponse.json({ error: "Failed to look up user" }, { status: 500 });
    }
    const user = users?.find((u) => u.email === customerEmail);

    if (!user) {
      console.error("User not found for email:", customerEmail);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save shipping address
    const { error: addressError } = await admin.from("shipping_addresses").upsert({
      user_id: user.id,
      delivery_type,
      recipient_name,
      contact_name: delivery_type === "estate_attorney" ? contact_name : null,
      address_line_1,
      address_line_2: address_line_2 || null,
      city,
      state_province,
      postal_code,
      country,
      attorney_note: delivery_type === "estate_attorney" && attorney_note ? attorney_note : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (addressError) {
      console.error("Address save error:", addressError);
      return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
    }

    // Send account setup email via magic link (triggers Supabase to send email)
    const { error: emailError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: customerEmail,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/setup-account`,
      },
    });

    if (emailError) {
      console.error("Email send error:", emailError);
      // Don't fail the whole request — address is saved
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Shipping address API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
