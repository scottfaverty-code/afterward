import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

const PLAQUE_PRICE_CENTS = 5000; // $50.00

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Confirm they have an account and don't already have a plaque on the way
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, plaque_status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "No Afterword account found." }, { status: 404 });
  }

  if (purchase.plaque_status !== "not_included") {
    return NextResponse.json({ error: "A plaque is already on your account." }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: PLAQUE_PRICE_CENTS,
          product_data: {
            name: "Afterword QR Plaque",
            description:
              "Weatherproof QR plaque that links directly to your Afterword memorial page. Shipped to your door within 10 business days.",
          },
        },
        quantity: 1,
      },
    ],
    // Tag this session so the webhook knows it's a plaque-only order
    metadata: {
      type: "plaque_only",
      user_id: user.id,
    },
    success_url: `${appUrl}/dashboard?plaque_ordered=1`,
    cancel_url: `${appUrl}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
