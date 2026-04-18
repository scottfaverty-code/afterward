import Image from "next/image";
import Link from "next/link";

const pageSections = [
  "Your autobiography, in as much detail as you choose",
  "Your proudest achievements and defining moments",
  "Your values and words of wisdom",
  "A personal message to your loved ones",
  "A living guestbook where family can leave memories",
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
              Patrick William spent forty years as an educator in Arizona. He wrote his Afterword page himself — his childhood in Indiana, the risks he took, the people he loved, and what he most wanted his grandchildren to know.
            </p>

            <p className="mb-6" style={{ color: "#666", lineHeight: "1.7" }}>
              Every word on his page is his own. Written while he still could.
            </p>

            <div className="flex flex-col gap-3 mb-7">
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

            <Link
              href="/memorial/patrick-william"
              target="_blank"
              className="btn-ghost inline-block"
              style={{ fontSize: "0.9rem", padding: "10px 20px" }}
            >
              Read Patrick&apos;s full page &rarr;
            </Link>
          </div>

          {/* Right: preview card */}
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
                  P
                </div>
                <div className="font-serif mb-0.5" style={{ fontSize: "1.1rem" }}>
                  Patrick William
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                  1949 &ndash;
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                  Educator. Father. Husband.
                </div>
              </div>

              {/* Sections */}
              <div className="p-5 flex flex-col gap-3">
                {[
                  {
                    label: "His Roots",
                    text: "\u201cWhat I remember most is the space of it \u2014 the open fields, the way corn rows stretched to the horizon in summer, the particular smell of a grain elevator on a hot August day\u2026\u201d",
                  },
                  {
                    label: "What He Believes",
                    text: "\u201cThe life is in the ordinary days, not the extraordinary ones. Pay attention to ordinary Tuesdays. That\u2019s where most of your life actually happens.\u201d",
                    italic: true,
                  },
                  {
                    label: "To His Family",
                    text: "\u201cYou were never background in my life. You were the whole point of it.\u201d",
                    italic: true,
                  },
                  {
                    label: "How He Wants to Be Remembered",
                    text: "\u201cThe thing I most want you to know is that a quiet, ordinary life \u2014 done with care \u2014 can be a life that mattered enormously.\u201d",
                    italic: true,
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

                <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: "12px", textAlign: "center" }}>
                  <Link
                    href="/memorial/patrick-william"
                    target="_blank"
                    style={{ fontSize: "0.82rem", color: "#1B4F6B", fontWeight: 600 }}
                  >
                    Read his full story &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
