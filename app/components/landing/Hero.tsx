import Image from "next/image";
import CheckoutButton from "@/app/components/CheckoutButton";
import AfterwordQR from "@/app/components/AfterwordQR";

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
          className="grid gap-16 items-center cols-2"
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

          {/* Right: Eleanor Mitchell memorial card */}
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
                  className="mx-auto mb-3 rounded-full overflow-hidden"
                  style={{ width: 64, height: 64, border: "2px solid rgba(255,255,255,0.3)" }}
                >
                  <Image
                    src="/images/eleanor-mitchell.png"
                    alt="Eleanor Mitchell"
                    width={64}
                    height={64}
                    style={{ objectFit: "cover", objectPosition: "center top", width: "100%", height: "100%" }}
                  />
                </div>
                <div className="font-serif text-lg mb-0.5">Eleanor Mitchell</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>
                  1945 &ndash;
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                  Mother. Neighbor. The warm house.
                </div>
              </div>

              {/* Card body */}
              <div className="px-5 py-4 flex flex-col gap-3">
                {[
                  {
                    label: "Her Roots",
                    text: "\u201cThat farmhouse shaped everything about how I think a home is supposed to feel. Not perfect. Not grand. Just warm, and full, and always open.\u201d",
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
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#EEF7FC", borderLeft: "3px solid #2E7DA3" }}
                  >
                    <div
                      className="font-bold mb-1"
                      style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#2E7DA3" }}
                    >
                      {s.label}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#333", lineHeight: "1.5", fontStyle: s.italic ? "italic" : "normal" }}>
                      {s.text}
                    </div>
                  </div>
                ))}

                {/* QR */}
                <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: "14px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.68rem", color: "#999", marginBottom: "8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Scan to read Eleanor&apos;s full page
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <AfterwordQR url="https://www.myafterword.co/memorial/eleanor-mitchell" size={130} />
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
