import CheckoutButton from "@/app/components/CheckoutButton";

const features = [
  { strong: "Permanent hosted memorial page", rest: ": written entirely in your own words" },
  { strong: "Physical QR plaque", rest: ": shipped to your door, weatherproof, attaches to most outdoor surfaces" },
  { strong: "Guided story prompts", rest: ": thoughtful questions to draw out the stories that matter" },
  { strong: "Write, speak, or use AI assistance", rest: ": three ways to share your story; you choose" },
  { strong: "Voice recording", rest: ": record answers aloud if writing is difficult or you prefer your natural voice" },
  { strong: "Living guestbook", rest: ": family and friends can leave messages and memories" },
  { strong: "Lifetime hosting", rest: ": no renewals, no expiry, no risk of losing the page" },
  { strong: "Data export", rest: ": your story, always yours to keep" },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="section-pad"
      style={{ backgroundColor: "#EEF7FC" }}
    >
      <div className="container-narrow">
        <div
          className="mb-3 font-bold"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#2E7DA3",
          }}
        >
          Pricing
        </div>

        <h2
          className="font-serif mb-3"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#1B4F6B" }}
        >
          The window doesn&apos;t stay open forever.
        </h2>

        <p className="mb-8" style={{ fontSize: "1.05rem", color: "#666" }}>
          Right now, you can write your own story. Don&apos;t leave it to someone else.
        </p>

        <div
          className="rounded-2xl p-8 mx-auto"
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
            maxWidth: "560px",
          }}
        >
          {/* Beta badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mb-6"
            style={{ backgroundColor: "#FDF3DC", color: "#C9932A", fontSize: "0.8rem", fontWeight: 700 }}
          >
            Beta Pricing: Limited Time
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className="font-serif font-bold"
              style={{ fontSize: "3rem", color: "#1B4F6B" }}
            >
              $199.99
            </span>
            <span style={{ fontSize: "1.25rem", color: "#999", textDecoration: "line-through" }}>
              $349.99
            </span>
          </div>
          <div
            className="mb-7"
            style={{ fontSize: "0.8rem", color: "#999" }}
          >
            One-time payment &nbsp;&middot;&nbsp; No subscription &nbsp;&middot;&nbsp; Permanent hosting
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-2.5 mb-7 list-none" style={{ padding: 0 }}>
            {features.map((f) => (
              <li key={f.strong} className="flex items-start gap-2.5">
                <span
                  className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: "#EEF7FC",
                    color: "#1B4F6B",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
                <span style={{ fontSize: "0.875rem", color: "#333", lineHeight: "1.6" }}>
                  <strong>{f.strong}</strong>{f.rest}
                </span>
              </li>
            ))}
          </ul>

          <CheckoutButton className="btn-primary-lg w-full text-center block">
            Write Your Story: $199.99
          </CheckoutButton>

          <p
            className="text-center mt-3"
            style={{ fontSize: "0.8rem", color: "#999" }}
          >
            One-time payment. Secured checkout. Permanent from day one.
          </p>
        </div>
      </div>
    </section>
  );
}
