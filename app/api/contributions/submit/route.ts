import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

function promoCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `MEMORY-${s}`;
}

/** POST /api/contributions/submit
 *  Public — no auth required.
 *  Body: { token, contributor_name, contributor_relationship, memory_text }
 *  Returns: { contribution_id, discount_code, checkout_url }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { token, contributor_name, contributor_relationship, memory_text } = await req.json();

  if (!token || !contributor_name?.trim() || !contributor_relationship?.trim() || !memory_text?.trim()) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (memory_text.trim().length > 2000) {
    return NextResponse.json({ error: "Memory is too long (max 2000 characters)." }, { status: 400 });
  }

  // Validate token — fetch invite
  const { data: invite } = await supabase
    .from("contribution_invites")
    .select("id, user_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!invite) return NextResponse.json({ error: "This invite link is not valid." }, { status: 404 });
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "This invite link has expired." }, { status: 410 });
  }

  // Get memorial slug from the invite owner's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("memorial_slug, first_name")
    .eq("id", invite.user_id)
    .single();

  if (!profile?.memorial_slug) {
    return NextResponse.json({ error: "Memorial not found." }, { status: 404 });
  }

  // Generate a unique Stripe promo code (10% off, single-use, 30 days)
  let discount_code: string | null = null;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";

  try {
    const stripe = getStripe();
    let code = promoCode();

    // Create a coupon
    const coupon = await stripe.coupons.create({
      percent_off: 10,
      duration: "once",
      max_redemptions: 1,
      name: "Contribution Thank You",
      metadata: { source: "contribution", memorial_slug: profile.memorial_slug },
    });

    const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days

    // Attach a promo code to it (retry once on collision)
    let promo;
    try {
      promo = await stripe.promotionCodes.create({
        promotion: { type: "coupon", coupon: coupon.id },
        code,
        max_redemptions: 1,
        expires_at: expiresAt,
      });
    } catch {
      // code collision — retry with new code
      code = promoCode();
      promo = await stripe.promotionCodes.create({
        promotion: { type: "coupon", coupon: coupon.id },
        code,
        max_redemptions: 1,
        expires_at: expiresAt,
      });
    }

    discount_code = promo.code;
  } catch {
    // Stripe failure is non-fatal — contribution still saves, no discount shown
    discount_code = null;
  }

  // Save the contribution
  const { data: contribution, error } = await supabase
    .from("contributions")
    .insert({
      invite_id: invite.id,
      memorial_slug: profile.memorial_slug,
      contributor_name: contributor_name.trim(),
      contributor_relationship: contributor_relationship.trim(),
      memory_text: memory_text.trim(),
      status: "pending",
      discount_code,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Mark invite as used (non-fatal if fails)
  void supabase
    .from("contribution_invites")
    .update({ used_at: new Date().toISOString() })
    .eq("id", invite.id);

  const checkout_url = discount_code
    ? `${appUrl}/checkout?code=${discount_code}`
    : `${appUrl}/checkout`;

  return NextResponse.json({
    contribution_id: contribution.id,
    discount_code,
    checkout_url,
    owner_first_name: profile.first_name,
  });
}
