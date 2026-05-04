import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripe = getStripe();

  // Accept an optional promo code string from the request body
  const body = await req.json().catch(() => ({}));
  const promoCodeStr: string | null =
    typeof body.code === "string" ? body.code.trim() || null : null;

  // If a code was passed, look up its Stripe promotion_code ID
  let discounts: { promotion_code: string }[] | undefined;
  if (promoCodeStr) {
    try {
      const promos = await stripe.promotionCodes.list({ code: promoCodeStr, limit: 1 });
      const promo = promos.data[0];
      if (promo?.active) {
        discounts = [{ promotion_code: promo.id }];
      }
      // If code is invalid or inactive, silently fall through to full price
    } catch {
      // Stripe lookup failure is non-fatal — proceed without discount
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 19999,
          product_data: {
            name: "Afterword: Permanent Memorial Page + QR Plaque",
            description:
              "A self-authored memorial page, permanently hosted. Includes a physical QR plaque shipped to your door.",
          },
        },
        quantity: 1,
      },
    ],
    // Apply pre-validated discount, or allow manual code entry if none provided
    ...(discounts ? { discounts } : { allow_promotion_codes: true }),
    success_url: `${appUrl}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/#pricing`,
  });

  return NextResponse.json({ url: session.url });
}
