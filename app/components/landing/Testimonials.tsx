import Image from "next/image";

const testimonials = [
  {
    initial: "S",
    quote:
      "\u201cReading Dad\u2019s Afterword page was like hearing him speak one last time. He wrote about his childhood in a way he never talked about at the dinner table. My kids know their grandfather in a way I never expected. That page is the most important thing he left us.\u201d",
    name: "Sarah M.",
    role: "Daughter, set up Afterword 4 months before her father passed",
  },
  {
    initial: "R",
    quote:
      "\u201cI\u2019m 78 years old and I\u2019ve lived more than most people know. Setting up my Afterword page was the most meaningful afternoon I\u2019ve spent in years. My grandchildren will know exactly who I was, not just who their family told them I was.\u201d",
    name: "Robert K.",
    role: "Set up his own Afterword page, age 78",
  },
  {
    initial: "D",
    quote:
      "\u201cMom had included an Afterword QR plaque in her trust documents. She\u2019d set up her whole page herself, planned exactly where it would go. When we scattered her ashes, we placed the plaque right there. Scan it and she\u2019s telling her own story. It was the most her thing she could have done.\u201d",
    name: "David L.",
    role: "Son, found his mother\u2019s QR plaque included in her trust",
  },
];

export default function Testimonials() {
  return (
    <section className="section-pad relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/pexels-cottonbro-6184766.jpg"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(238,247,252,0.92)" }}
        />
      </div>

      <div className="relative container-main">
        <div className="text-center mb-12">
          <h2
            className="font-serif mb-3"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#1B4F6B" }}
          >
            What families say
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#666" }}>
            From people who set up their Afterword page, and from families who now have it.
          </p>
        </div>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              }}
            >
              <div className="mb-3" style={{ color: "#C9932A", fontSize: "1rem" }}>
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>
              <p
                className="mb-5"
                style={{ fontSize: "0.9rem", color: "#333", lineHeight: "1.75", fontStyle: "italic" }}
              >
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="avatar-fallback flex-shrink-0"
                  style={{ width: 40, height: 40, fontSize: "1rem" }}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="font-semibold" style={{ fontSize: "0.875rem", color: "#1A1A1A" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#999" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
