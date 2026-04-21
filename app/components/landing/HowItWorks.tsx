import Image from "next/image";

const steps = [
  {
    num: "1",
    title: "Answer guided questions about your life",
    body: "We give you thoughtful prompts: your childhood, your defining moments, your values, what you want your family to know. Takes 30\u201360 minutes.",
  },
  {
    num: "2",
    title: "Share your story your way: write, speak, or both",
    body: "Type your answers, record them in your own voice, or use our optional AI writing assistant to help shape your words. Every method preserves what matters: your voice, your story.",
  },
  {
    num: "3",
    title: "Your QR plaque arrives by post",
    body: "A 316 stainless steel plaque, ready to affix to a headstone, memorial stone, urn, or most outdoor surfaces that matter to your family.",
  },
  {
    num: "4",
    title: "Your story lives permanently",
    body: "No renewals. No subscriptions. No risk of a payment lapsing and a page disappearing. It\u2019s there whenever your family needs it, for generations.",
  },
];

const inputMethods = [
  {
    title: "Write it yourself",
    body: "Type your answers to our guided prompts at your own pace. Most people complete their page in a single afternoon. Every word is yours.",
    featured: false,
    badge: null,
  },
  {
    title: "Speak it aloud",
    body: "Record your answers using your voice. Ideal if writing is difficult, if you want to capture your actual tone and rhythm, or if you simply find it easier to talk than to type. Your recordings are preserved on your page.",
    featured: true,
    badge: "Accessibility-friendly",
  },
  {
    title: "Use AI writing assistance",
    body: "Share your thoughts and let our optional AI assistant help shape them into flowing prose. You review and approve every sentence before anything is published. Nothing goes live without your sign-off.",
    featured: false,
    badge: null,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-pad relative overflow-hidden"
      style={{ borderTop: "1px solid #E5E5E5" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/pexels-ron-lach-10223571.jpg"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.93)" }} />
      </div>

      <div className="relative container-main">
        <div className="text-center mb-14">
          <h2
            className="font-serif mb-3"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#1B4F6B" }}
          >
            Simple to set up. Permanent when it matters.
          </h2>
          <p
            className="mx-auto"
            style={{ fontSize: "1.05rem", color: "#666", maxWidth: "560px" }}
          >
            Most people complete their Afterword page in a single afternoon. You can add
            to it for the rest of your life; it will be ready the moment your family needs it.
          </p>
        </div>

        {/* Steps */}
        <div
          className="grid gap-8 mb-12 cols-4"
        >
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col">
              <div
                className="flex items-center justify-center rounded-full mb-3 font-bold font-serif"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: "#EEF7FC",
                  color: "#1B4F6B",
                  fontSize: "1rem",
                }}
              >
                {step.num}
              </div>
              <div
                className="font-bold mb-2"
                style={{ fontSize: "0.95rem", color: "#1A1A1A" }}
              >
                {step.title}
              </div>
              <p style={{ fontSize: "0.875rem", color: "#666", lineHeight: "1.65" }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* Input methods */}
        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: "#EEF7FC" }}
        >
          <div
            className="text-center mb-6 font-semibold"
            style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2E7DA3" }}
          >
            Three ways to share your story, you choose
          </div>
          <div
            className="grid gap-5 cols-3"
          >
            {inputMethods.map((method) => (
              <div
                key={method.title}
                className="rounded-xl p-5 relative"
                style={{
                  backgroundColor: "#fff",
                  border: method.featured ? "2px solid #1B4F6B" : "1px solid #E5E5E5",
                }}
              >
                {method.badge && (
                  <div
                    className="inline-block rounded-full px-2.5 py-1 mb-3"
                    style={{
                      backgroundColor: "#FDF3DC",
                      color: "#C9932A",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {method.badge}
                  </div>
                )}
                <div
                  className="font-bold mb-2"
                  style={{ fontSize: "0.95rem", color: "#1B4F6B" }}
                >
                  {method.title}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: "1.65" }}>
                  {method.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
