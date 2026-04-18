import Image from "next/image";
import Link from "next/link";
import AfterwordQR from "@/app/components/AfterwordQR";

const demos = [
  {
    slug: "patrick-william",
    name: "Patrick Williams",
    years: "1949 –",
    tagline: "Educator. Father. Husband.",
    photo: "/images/patrick-william.png",
    pronoun: "his",
    description:
      "Patrick spent forty years as an educator in Arizona — teacher, principal, superintendent. He wrote his Afterword page himself, in his own words, while he still could.",
    quotes: [
      {
        label: "His Roots",
        text: "\u201cWhat I remember most is the space of it \u2014 the open fields, the way corn rows stretched to the horizon in summer, the particular smell of a grain elevator on a hot August day\u2026\u201d",
        italic: false,
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
    ],
  },
  {
    slug: "eleanor-mitchell",
    name: "Eleanor Mitchell",
    years: "1945 –",
    tagline: "Mother. Neighbor. The warm house.",
    photo: "/images/eleanor-mitchell.png",
    pronoun: "her",
    description:
      "Eleanor raised four children in Vermont, kept a warm kitchen for everyone who needed it, and organized her town's harvest supper for twenty-eight years. This is her story, in her own words.",
    quotes: [
      {
        label: "Her Roots",
        text: "\u201cThat farmhouse shaped everything about how I think a home is supposed to feel. Not perfect. Not grand. Just warm, and full, and always open.\u201d",
        italic: false,
      },
      {
        label: "What She Believes",
        text: "\u201cDon\u2019t save the good dishes for company that never comes. Be easier on yourself than your mother probably was on herself.\u201d",
        italic: true,
      },
      {
        label: "To Her Family",
        text: "\u201cYou were my greatest adventure and my deepest joy. Carry our memories forward, but don\u2019t live in them.\u201d",
        italic: true,
      },
    ],
  },
];

export default function Example() {
  return (
    <section id="example" className="section-pad" style={{ backgroundColor: "#FAFAFA" }}>
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="mb-3 font-bold"
            style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2E7DA3" }}
          >
            Real Afterword pages
          </div>
          <h2
            className="font-serif mb-4"
            style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", color: "#1B4F6B" }}
          >
            More than words on a stone. The whole person.
          </h2>
          <p
            className="mx-auto"
            style={{ color: "#666", lineHeight: "1.75", maxWidth: "560px" }}
          >
            Every word on an Afterword page is written by the person themselves — their story, their voice, their message to the people they love. Scan either QR code to read the full page.
          </p>
        </div>

        {/* Two cards */}
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          {demos.map((demo) => (
            <div
              key={demo.slug}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
                border: "1px solid #E5E5E5",
              }}
            >
              {/* Card header */}
              <div
                className="px-6 py-6 text-center text-white"
                style={{ background: "linear-gradient(135deg, #0f2d3d, #1B4F6B)" }}
              >
                <div
                  className="mx-auto mb-3 rounded-full overflow-hidden"
                  style={{ width: 72, height: 72, border: "2px solid rgba(255,255,255,0.3)" }}
                >
                  <Image
                    src={demo.photo}
                    alt={demo.name}
                    width={72}
                    height={72}
                    style={{ objectFit: "cover", objectPosition: "center top", width: "100%", height: "100%" }}
                  />
                </div>
                <div className="font-serif mb-0.5" style={{ fontSize: "1.15rem" }}>
                  {demo.name}
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                  {demo.years}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                  {demo.tagline}
                </div>
              </div>

              {/* Description */}
              <div className="px-5 pt-4 pb-2">
                <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: "1.65" }}>
                  {demo.description}
                </p>
              </div>

              {/* Quote snippets */}
              <div className="px-5 pb-4 flex flex-col gap-2.5">
                {demo.quotes.map((q) => (
                  <div
                    key={q.label}
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#EEF7FC", borderLeft: "3px solid #2E7DA3" }}
                  >
                    <div
                      className="font-bold mb-1"
                      style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#2E7DA3" }}
                    >
                      {q.label}
                    </div>
                    <div style={{ fontSize: "0.81rem", color: "#333", lineHeight: "1.5", fontStyle: q.italic ? "italic" : "normal" }}>
                      {q.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* QR + link */}
              <div style={{ borderTop: "1px solid #E5E5E5", padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", color: "#999", marginBottom: "10px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Scan to visit {demo.pronoun === "his" ? "Patrick\u2019s" : "Eleanor\u2019s"} page
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                  <AfterwordQR url={`https://www.myafterword.co/memorial/${demo.slug}`} size={140} />
                </div>
                <Link
                  href={`/memorial/${demo.slug}`}
                  target="_blank"
                  style={{ fontSize: "0.82rem", color: "#1B4F6B", fontWeight: 600 }}
                >
                  {`Read ${demo.pronoun} full story →`}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
