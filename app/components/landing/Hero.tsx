import Image from "next/image";
import CheckoutButton from "@/app/components/CheckoutButton";

export default function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "640px" }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/pexels-tima-miroshnichenko-5710541.jpg"
          alt=""
          fill
          priority
          style={{ objectFit: "cover" }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(13,51,71,0.92) 0%, rgba(27,79,107,0.85) 55%, rgba(26,95,128,0.88) 100%)",
          }}
        />
      </div>

      <div className="relative container-main section-pad">
        <div
          className="grid gap-16 items-center"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {/* Left: content */}
          <div className="text-white">
            {/* Beta badge */}
            <div
              className="inline-block mb-6 rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{ backgroundColor: "#FDF3DC", color: "#C9932A" }}
            >
              Beta pricing: $150 off for a limited time
            </div>

            <h1
              className="font-serif mb-6 text-white"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: "1.15" }}
            >
              You deserve to be remembered
              <br />
              <em>in your own words,</em>
              <br />
              not someone else&apos;s.
            </h1>

            <p
              className="mb-8"
              style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.9)", lineHeight: "1.7" }}
            >
              Afterword is the only memorial you write yourself, while you still can.
              Your story, your voice, your message to the people you love.
              Permanently hosted. Accessible forever via a QR plaque on your headstone,
              urn, or most outdoor surfaces.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                <CheckoutButton className="btn-primary-lg">
                  Write Your Story: $199.99
                </CheckoutButton>
                <a href="#example" className="btn-ghost-white">
                  See a real example &rarr;
                </a>
              </div>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
                <strong style={{ color: "rgba(255,255,255,0.9)" }}>
                  One-time payment. No subscription. Permanent hosting.
                </strong>
                &nbsp;Regular price <s>$349.99</s> (beta discount saves you $150)
              </p>
            </div>
          </div>

          {/* Right: sample memorial card */}
          <div className="hidden md:block">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}
            >
              {/* Card header */}
              <div
                className="px-6 py-6 text-center text-white"
                style={{ background: "linear-gradient(135deg, #0f2d3d, #1B4F6B)" }}
              >
                <div
                  className="avatar-fallback mx-auto mb-3"
                  style={{ width: 56, height: 56, fontSize: "1.5rem" }}
                >
                  E
                </div>
                <div className="font-serif text-lg mb-0.5">Eleanor Rose Mitchell</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>
                  March 15, 1942 &ndash; November 3, 2024
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                  Beloved Mother, Grandmother &amp; Friend
                </div>
                {/* QR chip */}
                <div
                  className="flex items-center gap-2 mt-4 mx-auto rounded-lg px-3 py-2 text-left"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    maxWidth: "200px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                      Scan to know her story
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>
                      Written by Eleanor herself
                    </div>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="px-5 py-5 flex flex-col gap-3">
                <div
                  className="rounded-lg p-3"
                  style={{ backgroundColor: "#EEF7FC", borderLeft: "3px solid #2E7DA3" }}
                >
                  <div
                    className="font-bold mb-1"
                    style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#2E7DA3" }}
                  >
                    In Eleanor&apos;s own words
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#333", lineHeight: "1.5" }}>
                    &ldquo;I want you to know where I came from. I grew up in a small farmhouse in Vermont, where the winters were long but our kitchen was always warm&hellip;&rdquo;
                  </div>
                </div>
                <div
                  className="rounded-lg p-3"
                  style={{ backgroundColor: "#EEF7FC", borderLeft: "3px solid #2E7DA3" }}
                >
                  <div
                    className="font-bold mb-1"
                    style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#2E7DA3" }}
                  >
                    A message to her family
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#333", lineHeight: "1.5" }}>
                    &ldquo;You were my greatest adventure and my deepest joy. Carry our memories forward, but don&apos;t live in them&hellip;&rdquo;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
