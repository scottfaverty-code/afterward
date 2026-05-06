import Link from "next/link";
import CheckoutButton from "@/app/components/CheckoutButton";

const FULL_PRICE = 149;
const DISCOUNT_PCT = 10;
const DISCOUNTED_PRICE = Math.round(FULL_PRICE * (1 - DISCOUNT_PCT / 100));

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const promoCode = typeof code === "string" && code.trim() ? code.trim().toUpperCase() : null;
  const hasDiscount = !!promoCode;

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      {/* Minimal nav */}
      <div
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #E5E5E5",
          padding: "0 32px",
          height: "60px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          className="font-serif"
          style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1B4F6B", textDecoration: "none" }}
        >
          Afterword
        </Link>
      </div>

      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          padding: "64px 24px 80px",
        }}
      >
        {/* Discount badge */}
        {hasDiscount && (
          <div
            style={{
              backgroundColor: "#EEF7FC",
              border: "1px solid #D6EAF4",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "#1B4F6B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#fff", fontSize: "1rem" }}>✓</span>
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1B4F6B", marginBottom: "2px" }}>
                10% discount applied
              </div>
              <div style={{ fontSize: "0.78rem", color: "#555" }}>
                Code <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{promoCode}</span> will be applied at checkout
              </div>
            </div>
          </div>
        )}

        {/* Heading */}
        <h1
          className="font-serif"
          style={{ fontSize: "1.9rem", color: "#1B4F6B", marginBottom: "12px", lineHeight: 1.2 }}
        >
          Start your Afterword
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#666", lineHeight: 1.75, marginBottom: "36px" }}>
          A permanent page for your story, written in your own words. Includes a physical QR plaque shipped to you.
        </p>

        {/* Pricing card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            marginBottom: "20px",
          }}
        >
          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "20px" }}>
            <span
              className="font-serif"
              style={{ fontSize: "2.4rem", fontWeight: 700, color: "#1B4F6B" }}
            >
              ${hasDiscount ? DISCOUNTED_PRICE : FULL_PRICE}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: "1.1rem", color: "#bbb", textDecoration: "line-through" }}>
                ${FULL_PRICE}
              </span>
            )}
            <span style={{ fontSize: "0.85rem", color: "#999" }}>one-time</span>
          </div>

          {/* What's included */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
            {[
              "Permanent memorial page, hosted for life",
              "Seven guided life story sections",
              "Physical QR plaque, shipped to your door",
              "Public or private — you control access",
              "PDF export of your full Afterword",
              "Invite family to contribute memories",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    backgroundColor: "#1B4F6B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: "0.875rem", color: "#444", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          <CheckoutButton
            promoCode={promoCode ?? undefined}
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#1B4F6B",
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {hasDiscount
              ? `Continue to checkout — $${DISCOUNTED_PRICE}`
              : `Continue to checkout — $${FULL_PRICE}`}
          </CheckoutButton>

          <p style={{ fontSize: "0.73rem", color: "#bbb", textAlign: "center", marginTop: "12px", lineHeight: 1.6 }}>
            Secure checkout via Stripe. One-time payment — no subscription, ever.
            {hasDiscount && " Your discount is applied automatically."}
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/"
            style={{ fontSize: "0.8rem", color: "#999", textDecoration: "underline" }}
          >
            Learn more about Afterword first
          </Link>
        </div>
      </div>
    </div>
  );
}
