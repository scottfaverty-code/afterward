"use client";

import { useState } from "react";

const faqs = [
  {
    q: 'What does "permanent" actually mean? What if Afterword shuts down one day?',
    a: "We\u2019ve built our hosting model specifically to outlast subscription businesses. You can export all of your data at any time. If Afterword is ever acquired or wound down, we\u2019ll provide at minimum 5 years notice and guaranteed data export, so your story is never held hostage. We also guarantee that the URL your QR plaque points to will remain active or be redirected.",
  },
  {
    q: "How does the QR plaque attach to a headstone or urn?",
    a: "The plaque uses a weatherproof adhesive designed for outdoor stone and ceramic surfaces. It works on headstones, memorial benches, urns, garden stones, and interior surfaces. Detailed attachment instructions are included.",
  },
  {
    q: "Can I add to my Afterword page after I set it up?",
    a: "Yes, your page is always editable. Many people add to it over time as new stories come to mind. Think of it as a living document rather than a one-time project.",
  },
  {
    q: "Can I set this up as a gift for an aging parent?",
    a: "Absolutely, and many of our most meaningful setups happen this way. You purchase the Afterword and set it up together, over a weekend or during a visit. The process itself often becomes a treasured conversation.",
  },
  {
    q: "What if my family member has already passed? Can Afterword still help?",
    a: "Yes. Families can create an Afterword page for someone who has passed using photos, documents, shared memories, and family stories. It won\u2019t be self-authored, but it can still be a permanent, dignified memorial that goes far beyond a standard obituary.",
  },
  {
    q: "Is this beta pricing going away soon?",
    a: "Yes. The $199.99 beta price exists while we gather early feedback from our first wave of users. Once the beta period closes, the price returns to $349.99. We won\u2019t retroactively change the price for anyone who purchased at the beta rate.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-pad-tight" style={{ backgroundColor: "#fff" }}>
      <div className="container-main">
        <div className="text-center mb-10">
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#1B4F6B" }}
          >
            Common questions
          </h2>
        </div>

        <div className="mx-auto flex flex-col gap-0" style={{ maxWidth: "760px" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid #E5E5E5" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left flex items-center justify-between gap-4 py-5"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <span
                  className="font-semibold"
                  style={{ fontSize: "0.975rem", color: "#1A1A1A", lineHeight: "1.5" }}
                >
                  {faq.q}
                </span>
                <span
                  className="flex-shrink-0 flex items-center justify-center rounded-full transition-transform"
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: "#EEF7FC",
                    color: "#1B4F6B",
                    fontSize: "1rem",
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="pb-5" style={{ fontSize: "0.9rem", color: "#555", lineHeight: "1.75" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
