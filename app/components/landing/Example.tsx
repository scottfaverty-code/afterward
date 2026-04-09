import Image from "next/image";

const pageSections = [
  "Your autobiography, in as much detail as you choose",
  "Your proudest achievements and defining moments",
  "Your values and words of wisdom",
  "A personal message to your loved ones",
  "A living guestbook where family can leave memories",
  "Photos and any other media you choose to share",
];

export default function Example() {
  return (
    <section id="example" className="section-pad" style={{ backgroundColor: "#fff" }}>
      <div className="container-main">
        <div
          className="grid gap-16 items-center"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {/* Left: text */}
          <div>
            <Image
              src="/images/pexels-tima-miroshnichenko-5591208.jpg"
              alt="A person reading at a memorial"
              width={560}
              height={280}
              className="rounded-xl mb-8 w-full"
              style={{ objectFit: "cover", maxHeight: "280px" }}
              loading="lazy"
            />

            <div
              className="mb-3 font-bold"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#2E7DA3",
              }}
            >
              A real Afterword page
            </div>

            <h2
              className="font-serif mb-4"
              style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", color: "#1B4F6B" }}
            >
              More than words on a stone. The whole person.
            </h2>

            <p className="mb-3" style={{ color: "#666", lineHeight: "1.7" }}>
              Your Afterword page is a complete portrait, not a summary. Every section
              is written by you, in your words, to be discovered by your family
              long after you&apos;re gone.
            </p>

            <p className="mb-6" style={{ color: "#666", lineHeight: "1.7" }}>
              Scan the QR plaque at the headstone and this is what appears.
              Eleanor&apos;s page has been visited 847 times since her passing.
              Her grandchildren visit it on her birthday.
            </p>

            <div className="flex flex-col gap-3">
              {pageSections.map((section) => (
                <div key={section} className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 22,
                      height: 22,
                      backgroundColor: "#EEF7FC",
                      color: "#1B4F6B",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ fontSize: "0.9rem", color: "#333" }}>{section}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: full memorial preview card */}
          <div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                border: "1px solid #E5E5E5",
              }}
            >
              {/* Header */}
              <div
                className="px-6 py-6 text-center text-white"
                style={{ background: "linear-gradient(135deg, #0f2d3d, #1B4F6B)" }}
              >
                <div
                  className="avatar-fallback mx-auto mb-2"
                  style={{ width: 64, height: 64, fontSize: "1.5rem" }}
                >
                  E
                </div>
                <div className="font-serif mb-0.5" style={{ fontSize: "1.1rem" }}>
                  Eleanor Rose Mitchell
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                  March 15, 1942 &ndash; November 3, 2024
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                  Beloved Mother, Grandmother &amp; Friend
                </div>
              </div>

              {/* Sections */}
              <div className="p-5 flex flex-col gap-3">
                {[
                  {
                    label: "My Story",
                    text: "\u201cI want you to know where I came from. I grew up in a small farmhouse in Vermont, where the winters were long but our kitchen was always warm\u2026\u201d",
                  },
                  {
                    label: "My Proudest Moment",
                    text: "\u201cWhen Thomas and I started out, we had nothing but love and a secondhand kitchen table. Sixty-two years later, that table hosted thousands of meals\u2026\u201d",
                  },
                  {
                    label: "Words of Wisdom",
                    text: "\u201cLove freely, forgive quickly, and never go to bed angry.\u201d",
                    italic: true,
                  },
                  {
                    label: "To My Family",
                    text: "\u201cYou were my greatest adventure and my deepest joy. Carry our memories forward, but don\u2019t live in them\u2026\u201d",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: "#EEF7FC",
                      borderLeft: "3px solid #2E7DA3",
                    }}
                  >
                    <div
                      className="font-bold mb-1"
                      style={{
                        fontSize: "0.67rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#2E7DA3",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#333",
                        lineHeight: "1.5",
                        fontStyle: s.italic ? "italic" : "normal",
                      }}
                    >
                      {s.text}
                    </div>
                  </div>
                ))}

                {/* Guestbook */}
                <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: "14px" }}>
                  <div
                    className="font-bold mb-2"
                    style={{
                      fontSize: "0.68rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#999",
                    }}
                  >
                    Guestbook: 23 messages
                  </div>
                  {[
                    { author: "Sarah M., Granddaughter", msg: "Reading this in her own words still makes me feel like she\u2019s here." },
                    { author: "David L., Son", msg: "I didn\u2019t know the Vermont farmhouse story until I read this page." },
                  ].map((entry) => (
                    <div
                      key={entry.author}
                      className="rounded-lg p-2.5 mb-1.5"
                      style={{ backgroundColor: "#fafafa", fontSize: "0.8rem", color: "#666" }}
                    >
                      <div className="font-semibold mb-0.5" style={{ fontSize: "0.75rem", color: "#333" }}>
                        {entry.author}
                      </div>
                      {entry.msg}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
