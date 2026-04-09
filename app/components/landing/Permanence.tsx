const pillars = [
  {
    title: "One payment. No renewals.",
    body: "Your $199.99 covers permanent hosting with no renewal dates, no expiry notices, no annual fees.",
  },
  {
    title: "Your data, always yours.",
    body: "You can export everything, every word, every photo, at any time. We\u2019ll never hold your story hostage.",
  },
  {
    title: "The QR link never breaks.",
    body: "The URL your QR plaque points to is guaranteed to remain active. If anything ever changes, we redirect it.",
  },
];

export default function Permanence() {
  return (
    <section
      className="section-pad"
      style={{ backgroundColor: "#1B4F6B", color: "#fff" }}
    >
      <div className="container-narrow">
        <div
          className="mb-3 font-bold"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#C9932A",
          }}
        >
          Our commitment
        </div>

        <h2
          className="font-serif mb-5"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#fff" }}
        >
          We don&apos;t charge a monthly fee to keep your memory alive.
        </h2>

        <p
          className="mb-10"
          style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.8)", lineHeight: "1.75" }}
        >
          Most digital memorial products are subscriptions. Stop paying, and the page disappears,
          taking every story and photo with it. We built Afterword differently.
          One payment covers permanent hosting. Not for 10 years.
          Not until you stop paying. Forever.
        </p>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {pillars.map((p) => (
            <div key={p.title}>
              <div
                className="font-bold mb-2"
                style={{ fontSize: "1rem", color: "#fff" }}
              >
                {p.title}
              </div>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", lineHeight: "1.65" }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
