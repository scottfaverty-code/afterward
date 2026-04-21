import Image from "next/image";

export default function Problem() {
  return (
    <section style={{ backgroundColor: "#F9F9F9", padding: "96px 0" }}>
      <div className="container-main">
        <div
          className="grid gap-16 items-center cols-2"
        >
          {/* Left: text + photo */}
          <div>
            <Image
              src="/images/pexels-shvets-production-7545406.jpg"
              alt="A family looking through old photographs"
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
              The alternative
            </div>

            <h2
              className="font-serif mb-4"
              style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", color: "#1B4F6B" }}
            >
              When you&apos;re gone, who tells your story?
            </h2>

            <p className="mb-3" style={{ color: "#666", lineHeight: "1.7" }}>
              Most people are remembered by a three-paragraph obituary, written in 48 hours
              by a grieving family who didn&apos;t have time, or the information, to get it right.
              It lists a name, some dates, and a handful of roles.
            </p>

            <p className="mb-6" style={{ color: "#666", lineHeight: "1.7" }}>
              It says almost nothing about who you actually <em>were</em>.
            </p>

            <div
              className="rounded-lg px-5 py-4"
              style={{
                borderLeft: "4px solid #1B4F6B",
                backgroundColor: "#EEF7FC",
                color: "#1A1A1A",
                lineHeight: "1.7",
              }}
            >
              <strong>Afterword is different.</strong> You write it, before it&apos;s needed,
              in your own voice, on your own timeline. Your family finds it there,
              exactly as you left it, whenever they need it. For as long as they live.
            </div>
          </div>

          {/* Right: sample obituary card */}
          <div>
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                border: "1px solid #E5E5E5",
              }}
            >
              <div
                className="mb-3 font-bold"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#999",
                }}
              >
                A typical obituary
              </div>
              <div
                className="font-serif mb-1"
                style={{ fontSize: "1.1rem", color: "#1A1A1A", fontWeight: 700 }}
              >
                Margaret Anne Williams, 1944&ndash;2024
              </div>
              <div
                className="mb-4"
                style={{ fontSize: "0.85rem", color: "#999" }}
              >
                Passed away peacefully on December 4, 2024
              </div>
              <p className="mb-3" style={{ fontSize: "0.9rem", color: "#555", lineHeight: "1.7" }}>
                Margaret was a loving wife, mother, and grandmother. She enjoyed gardening,
                cooking for her family, and attending church. She is survived by her husband
                of 47 years, three children, and seven grandchildren.
              </p>
              <p className="mb-5" style={{ fontSize: "0.9rem", color: "#555", lineHeight: "1.7" }}>
                A memorial service will be held on December 10th. In lieu of flowers,
                donations may be made to the local food bank.
              </p>
              <div
                className="inline-block rounded px-3 py-1.5"
                style={{
                  backgroundColor: "#FDF3DC",
                  color: "#C9932A",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                Written in 48 hours by someone who loved her but barely knew her whole story
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
