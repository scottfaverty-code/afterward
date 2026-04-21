export default function WhatYouGet() {
  const items = [
    {
      title: "Your Self-Written Memorial Page",
      body: "A permanent, beautifully designed page where you share your autobiography, proudest moments, values, words of wisdom, and a personal message to the people who matter most. Written entirely in your own voice.",
    },
    {
      title: "Physical QR Plaque, Shipped to You",
      body: "A 316 stainless steel QR plaque, rated for 30–50 years and suitable for coastal climates, that links directly to your Afterword page. Attach it to a headstone, memorial stone, urn, bench, or most outdoor surfaces. Especially meaningful for families who chose cremation.",
    },
    {
      title: "Permanent Hosting: No Subscription Required",
      body: "Your page lives forever. No monthly fee. No renewal notices. No risk of disappearing when a subscription lapses. One payment. Permanently online. We\u2019ll explain exactly what \u201cpermanent\u201d means, and we mean it.",
    },
  ];

  return (
    <section className="section-pad" style={{ backgroundColor: "#fff" }}>
      <div className="container-main">
        <h2
          className="font-serif text-center mb-3"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#1B4F6B" }}
        >
          Everything included. Once.
        </h2>
        <p
          className="text-center mb-12 mx-auto"
          style={{ color: "#666", maxWidth: "560px", lineHeight: "1.7" }}
        >
          One purchase covers everything: the digital memorial you write, the QR plaque
          shipped to your door, and permanent hosting with no renewals, ever.
        </p>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-8"
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                borderTop: "4px solid #1B4F6B",
              }}
            >
              <div
                className="font-bold mb-3"
                style={{ fontSize: "1.05rem", color: "#1B4F6B" }}
              >
                {item.title}
              </div>
              <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: "1.65" }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
