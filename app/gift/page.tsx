import Link from "next/link";
import Footer from "@/app/components/Footer";
import CheckoutButton from "@/app/components/CheckoutButton";

export default function GiftPage() {
  return (
    <>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 bg-white"
        style={{ borderBottom: "1px solid #E5E5E5", backdropFilter: "blur(8px)" }}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-serif font-bold text-teal-dark" style={{ fontSize: "1.25rem" }}>
              Afterword
            </Link>
            <ul className="hidden md:flex items-center gap-8 list-none">
              <li>
                <a href="#how-it-works" className="text-dark hover:text-teal-dark transition-colors text-sm">
                  How gifting works
                </a>
              </li>
              <li>
                <a href="#example" className="text-dark hover:text-teal-dark transition-colors text-sm">
                  See an example
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-dark hover:text-teal-dark transition-colors text-sm">
                  Pricing
                </a>
              </li>
            </ul>
            <a href="#pricing" className="btn-primary text-sm" style={{ padding: "11px 20px" }}>
              Give This Gift
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section
          style={{
            background: "linear-gradient(160deg, #0d3347 0%, #1B4F6B 55%, #1a5f80 100%)",
            color: "#fff",
            padding: "96px 0 80px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div className="container-main">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "64px",
                alignItems: "center",
              }}
              className="gift-hero-grid"
            >
              {/* Left */}
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#a8d8ee",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "6px 14px",
                    borderRadius: "100px",
                    marginBottom: "24px",
                  }}
                >
                  A meaningful gift for someone you love
                </div>
                <h1
                  className="font-serif"
                  style={{
                    fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: "#fff",
                    marginBottom: "20px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  They have stories
                  <br />
                  your family
                  <br />
                  <em style={{ fontStyle: "italic", color: "#a8d8ee" }}>hasn&apos;t heard yet.</em>
                </h1>
                <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.65, marginBottom: "36px", maxWidth: "520px" }}>
                  Afterword is a permanent, self-written memorial page. You give it as a gift.
                  You set it up together. They write their story in their own words, and your family
                  has it forever &mdash; hosted permanently, accessible via a QR plaque on their headstone,
                  urn, or most outdoor surfaces.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <a href="#pricing" className="btn-primary-lg">Give This Gift: $199.99</a>
                    <a
                      href="#example"
                      className="btn-ghost"
                      style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", background: "transparent" }}
                    >
                      See what it looks like &rarr;
                    </a>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>
                    <strong style={{ color: "rgba(255,255,255,0.85)" }}>One-time payment. No subscription. Permanent hosting.</strong>
                    &nbsp;Regular price <s style={{ color: "rgba(255,255,255,0.4)" }}>$349.99</s> (beta discount saves you $150).
                  </p>
                </div>
              </div>

              {/* Right: Gift card */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "relative", maxWidth: "380px", marginLeft: "auto" }}>
                  {/* "A gift for someone you love" ribbon */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#C9932A",
                      color: "#fff",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "4px 16px",
                      borderRadius: "100px",
                      whiteSpace: "nowrap",
                      zIndex: 2,
                    }}
                  >
                    A gift for someone you love
                  </div>
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "#fff", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}
                  >
                    {/* Card header */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #1a3a4a, #1B4F6B)",
                        padding: "28px 24px 20px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      <div
                        className="font-serif flex items-center justify-center mx-auto"
                        style={{
                          width: 72,
                          height: 72,
                          background: "rgba(255,255,255,0.15)",
                          borderRadius: "50%",
                          border: "3px solid rgba(255,255,255,0.3)",
                          marginBottom: "12px",
                          fontSize: "1.8rem",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        H
                      </div>
                      <div className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}>
                        Harold James Faverty
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "10px" }}>
                        June 4, 1946 &ndash; written at age 78
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
                        Father, grandfather, retired schoolteacher
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          marginTop: "14px",
                          textAlign: "left",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)" }}>Scan to know his story</div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Written by Harold himself</div>
                        </div>
                      </div>
                    </div>
                    {/* Card body */}
                    <div style={{ padding: "20px 24px" }}>
                      <div
                        style={{
                          borderLeft: "3px solid #D6EAF4",
                          padding: "10px 14px",
                          marginBottom: "12px",
                          background: "#EEF7FC",
                          borderRadius: "0 6px 6px 0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "#2E7DA3",
                            marginBottom: "4px",
                          }}
                        >
                          In Harold&apos;s own words
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#333", lineHeight: 1.5 }}>
                          &ldquo;There are things I&apos;ve never told my children about where I came from. I grew up in a coal town in Pennsylvania where ambition was considered suspicious...&rdquo;
                        </div>
                      </div>
                      <div
                        style={{
                          borderLeft: "3px solid #D6EAF4",
                          padding: "10px 14px",
                          background: "#EEF7FC",
                          borderRadius: "0 6px 6px 0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "#2E7DA3",
                            marginBottom: "4px",
                          }}
                        >
                          A message to his family
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#333", lineHeight: 1.5 }}>
                          &ldquo;The thing I most want you to know is that I was happy. Not every day. But in the way that matters...&rdquo;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency Strip */}
        <div
          style={{
            background: "#FDF3DC",
            borderTop: "2px solid #e8c87a",
            borderBottom: "2px solid #e8c87a",
            padding: "20px 0",
            textAlign: "center",
          }}
        >
          <div
            className="container-main"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}
          >
            <p style={{ fontSize: "1rem", color: "#7a5a10" }}>
              <strong style={{ color: "#5a3d08" }}>The window is open right now.</strong>{" "}
              Most people wait until it isn&apos;t. You&apos;re here because you know better.
            </p>
          </div>
        </div>

        {/* The Problem */}
        <section style={{ background: "#1A1A1A", color: "#fff", padding: "96px 0" }}>
          <div className="container-main">
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}
              className="gift-two-col"
            >
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#888",
                    marginBottom: "16px",
                  }}
                >
                  The thing about waiting
                </div>
                <h2
                  className="font-serif"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "24px" }}
                >
                  They want to tell you. Life just keeps getting in the way.
                </h2>
                <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "16px" }}>
                  Most people have stories they&apos;ve never told. Experiences from before you were born.
                  Lessons they learned the hard way. Things they want the people they love to know
                  but somehow, the right moment never comes.
                </p>
                <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "16px" }}>
                  They&apos;re not withholding. They just never had a prompt, a place, or a reason to sit down
                  and get it all out. And then one day, the window closes.
                </p>
                <div
                  style={{
                    borderLeft: "4px solid #C9932A",
                    paddingLeft: "20px",
                    marginTop: "28px",
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.65,
                  }}
                >
                  <strong style={{ color: "#fff" }}>Afterword changes that.</strong> You give them the gift. They write their story
                  at their own pace, guided by thoughtful prompts that make it easy.
                  Your family has it permanently, exactly as they wrote it, for generations.
                </div>
              </div>

              <div>
                <div
                  style={{
                    background: "#2a2a2a",
                    border: "1px solid #3a3a3a",
                    borderRadius: "16px",
                    padding: "32px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#555",
                      marginBottom: "24px",
                    }}
                  >
                    What families wish they had asked
                  </div>
                  {[
                    {
                      strong: "\"I never knew what his childhood was actually like.\"",
                      text: "He mentioned his hometown sometimes, but I never really asked. Now I never can.",
                    },
                    {
                      strong: "\"She had all these old photos and I never found out who half the people were.\"",
                      text: "We found them after she passed. There was no one left to ask.",
                    },
                    {
                      strong: "\"I wish he had written something for his grandchildren to read when they're older.\"",
                      text: "They were too young to understand who he really was. That breaks my heart.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: i < 2 ? "20px" : 0,
                        paddingBottom: i < 2 ? "20px" : 0,
                        borderBottom: i < 2 ? "1px solid #333" : "none",
                      }}
                    >
                      <p style={{ fontSize: "0.9rem", color: "#888", lineHeight: 1.55, fontStyle: "italic" }}>
                        <strong style={{ color: "#aaa", fontStyle: "normal" }}>{item.strong}</strong>{" "}
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What They Get */}
        <section style={{ background: "#EEF7FC", padding: "96px 0" }}>
          <div className="container-main">
            <h2
              className="font-serif"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", textAlign: "center", marginBottom: "12px", color: "#1B4F6B" }}
            >
              Everything included. One gift.
            </h2>
            <p style={{ textAlign: "center", fontSize: "1.05rem", color: "#666", maxWidth: "580px", margin: "0 auto 56px" }}>
              One purchase covers everything they need: the page where they write their story,
              the QR plaque shipped to your door, and permanent hosting with no renewals, ever.
            </p>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}
              className="gift-three-col"
            >
              {[
                {
                  title: "Their Self-Written Memorial Page",
                  body: "A permanent, beautifully designed page where they share their autobiography, proudest moments, values, words of wisdom, and a personal message to the people who matter most. Written entirely in their own voice.",
                },
                {
                  title: "Physical QR Plaque, Shipped to You",
                  body: "A durable, weather-resistant QR plaque that links directly to their Afterword page. Attach it to a headstone, memorial stone, urn, bench, or most outdoor surfaces. Especially meaningful for families who chose cremation.",
                },
                {
                  title: "Permanent Hosting: No Subscription Required",
                  body: "Their page lives forever. No monthly fee. No renewal notices. No risk of disappearing when a subscription lapses. One payment. Permanently online. You'll never have to worry about it again.",
                },
              ].map((d) => (
                <div
                  key={d.title}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "32px 28px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                    borderTop: "4px solid #1B4F6B",
                  }}
                >
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1B4F6B", marginBottom: "10px" }}>{d.title}</div>
                  <p style={{ fontSize: "0.92rem", color: "#666", lineHeight: 1.65 }}>{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Example */}
        <section id="example" style={{ background: "#fff", padding: "96px 0" }}>
          <div className="container-main">
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}
              className="gift-two-col"
            >
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#2E7DA3",
                    marginBottom: "12px",
                  }}
                >
                  What they&apos;ll leave behind
                </div>
                <h2
                  className="font-serif"
                  style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", color: "#1B4F6B", marginBottom: "20px", lineHeight: 1.2 }}
                >
                  Not just a name on a stone. The whole person.
                </h2>
                <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.7, marginBottom: "16px" }}>
                  An Afterword page holds everything a standard obituary leaves out: the childhood
                  that shaped them, the defining moments nobody outside the family knows about,
                  the wisdom they earned the hard way, and the things they most want to say
                  while they still can.
                </p>
                <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.7, marginBottom: "16px" }}>
                  Scan the QR plaque and this is what the family finds. Not a summary.
                  The person themselves, in their own words.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "28px" }}>
                  {[
                    "Their autobiography, in as much detail as they choose",
                    "Their proudest achievements and defining moments",
                    "Their values and words of wisdom",
                    "A personal message to the family",
                    "A living guestbook where family can leave memories",
                    "Photos and any other media they choose to share",
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.92rem", color: "#333" }}>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          background: "#EEF7FC",
                          color: "#1B4F6B",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        &#10003;
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Full memorial preview */}
              <div>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.12)", border: "1px solid #E5E5E5" }}
                >
                  <div
                    style={{
                      background: "linear-gradient(135deg, #0f2d3d, #1B4F6B)",
                      padding: "28px 24px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    <div
                      className="font-serif flex items-center justify-center mx-auto"
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.15)",
                        border: "2px solid rgba(255,255,255,0.25)",
                        marginBottom: "10px",
                        fontSize: "1.5rem",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      H
                    </div>
                    <div className="font-serif" style={{ fontSize: "1.1rem", marginBottom: "3px" }}>Harold James Faverty</div>
                    <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: "3px" }}>
                      June 4, 1946 &ndash; still adding to this page
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                      Father, Grandfather &amp; Retired Schoolteacher
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    {[
                      {
                        label: "My Story",
                        text: "&ldquo;I grew up in a coal town in Pennsylvania where ambition was considered suspicious. I was the first person in my family to go to college &mdash; which meant being the first person to leave...&rdquo;",
                      },
                      {
                        label: "What I Want My Grandchildren to Know",
                        text: "&ldquo;By the time you read this, I&apos;ll have been gone a while. So let me say it clearly: the things that seemed important to me at 40 &mdash; the job, the house, the status &mdash; none of them were what mattered...&rdquo;",
                      },
                      {
                        label: "Words of Wisdom",
                        text: "<em>&ldquo;Be harder to impress by things and easier to impress by people.&rdquo;</em>",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          marginBottom: "14px",
                          padding: "14px",
                          background: "#EEF7FC",
                          borderRadius: "8px",
                          borderLeft: "3px solid #2E7DA3",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.67rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "#2E7DA3",
                            marginBottom: "5px",
                          }}
                        >
                          {s.label}
                        </div>
                        <div
                          style={{ fontSize: "0.82rem", color: "#333", lineHeight: 1.5 }}
                          dangerouslySetInnerHTML={{ __html: s.text }}
                        />
                      </div>
                    ))}
                    <div style={{ padding: "14px", borderTop: "1px solid #E5E5E5" }}>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "#999",
                          marginBottom: "10px",
                        }}
                      >
                        Guestbook: 14 messages
                      </div>
                      {[
                        { author: "Lisa F., Daughter", message: "&ldquo;Dad, I had no idea about the coal town. Thank you for finally telling us.&rdquo;" },
                        { author: "Marcus F., Grandson (age 11)", message: "&ldquo;Great-grandpa&apos;s page made me want to be a teacher too.&rdquo;" },
                      ].map((e) => (
                        <div
                          key={e.author}
                          style={{
                            fontSize: "0.8rem",
                            color: "#666",
                            background: "#fafafa",
                            borderRadius: "6px",
                            padding: "8px 12px",
                            marginBottom: "6px",
                          }}
                        >
                          <div style={{ fontWeight: 600, color: "#333", fontSize: "0.75rem", marginBottom: "2px" }}>{e.author}</div>
                          <span dangerouslySetInnerHTML={{ __html: e.message }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Gifting Works */}
        <section
          id="how-it-works"
          style={{ background: "#fff", borderTop: "1px solid #E5E5E5", padding: "96px 0" }}
        >
          <div className="container-main">
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2
                className="font-serif"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#1B4F6B", marginBottom: "12px" }}
              >
                Simple to give. Simple to set up. Permanent when it matters.
              </h2>
              <p style={{ fontSize: "1.05rem", color: "#666", maxWidth: "560px", margin: "0 auto" }}>
                Most families complete the Afterword page together in a single afternoon. Many say it becomes one of the most meaningful conversations they&apos;ve ever had.
              </p>
            </div>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", position: "relative" }}
              className="gift-steps"
            >
              {[
                {
                  num: "1",
                  title: "You purchase the Afterword gift",
                  body: "One-time payment. You'll receive login credentials and a gift note you can present to the recipient however you like.",
                },
                {
                  num: "2",
                  title: "You set it up together (or they do it solo)",
                  body: "Guided prompts walk them through their story. No blank page to stare at. Most families do it over a weekend visit or a long phone call.",
                },
                {
                  num: "3",
                  title: "Their QR plaque arrives by post",
                  body: "A durable, weather-resistant plaque that links to their page. Affixes to a headstone, urn, memorial bench, or most outdoor surfaces.",
                },
                {
                  num: "4",
                  title: "Their story lives permanently",
                  body: "No renewals. No subscriptions. No risk of a page disappearing. It's there whenever the family needs it, for generations.",
                },
              ].map((step) => (
                <div key={step.num} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                  <div
                    className="font-serif flex items-center justify-center mx-auto"
                    style={{
                      width: 56,
                      height: 56,
                      background: "#1B4F6B",
                      color: "#fff",
                      borderRadius: "50%",
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      marginBottom: "20px",
                    }}
                  >
                    {step.num}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1B4F6B", marginBottom: "8px" }}>{step.title}</div>
                  <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.6 }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Will They Actually Do It? */}
        <section style={{ background: "#EEF7FC", borderTop: "1px solid #D6EAF4", padding: "96px 0" }}>
          <div className="container-main">
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}
              className="gift-two-col"
            >
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#2E7DA3",
                    marginBottom: "12px",
                  }}
                >
                  The most common question
                </div>
                <h2
                  className="font-serif"
                  style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", color: "#1B4F6B", marginBottom: "20px", lineHeight: 1.2 }}
                >
                  &ldquo;Will they actually sit down and do it?&rdquo;
                </h2>
                <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.7, marginBottom: "16px" }}>
                  It&apos;s the first thing most gift-givers wonder. The honest answer: yes &mdash; because
                  Afterword removes every barrier that normally stops people from getting started.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "28px" }}>
                  {[
                    {
                      title: "No blank page to face.",
                      body: "Thoughtful guided prompts walk them through their story section by section. They\u2019re answering questions, not writing an essay.",
                    },
                    {
                      title: "They can speak instead of type.",
                      body: "Voice recording means even if typing is difficult or uncomfortable, they can simply talk. Their actual voice is preserved on the page.",
                    },
                    {
                      title: "The setup session itself is the gift.",
                      body: "Most families sit down together for the first pass. That afternoon \u2014 the stories that come out, the things you never knew to ask \u2014 becomes something people treasure as much as the finished page.",
                    },
                    {
                      title: "It never has to be \u201cfinished.\u201d",
                      body: "They can add a section today and come back in six months. The page grows with them for as long as they like.",
                    },
                  ].map((r) => (
                    <div key={r.title} style={{ marginBottom: "4px" }}>
                      <div style={{ fontSize: "0.92rem", color: "#333", lineHeight: 1.55 }}>
                        <strong style={{ color: "#1B4F6B", display: "block", marginBottom: "2px" }}>{r.title}</strong>
                        {r.body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jennifer M. quote */}
              <div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "36px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                    position: "relative",
                  }}
                >
                  <div
                    className="font-serif"
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "24px",
                      fontSize: "5rem",
                      lineHeight: 1,
                      color: "#D6EAF4",
                    }}
                  >
                    &ldquo;
                  </div>
                  <p
                    className="font-serif"
                    style={{
                      fontSize: "1.15rem",
                      lineHeight: 1.65,
                      color: "#333",
                      marginBottom: "20px",
                      position: "relative",
                      zIndex: 1,
                      paddingTop: "20px",
                    }}
                  >
                    My dad is 82 and has never once sat down to write anything personal in his life.
                    We did his Afterword page together over a Sunday visit. He talked, I typed,
                    and we laughed more than we had in years. He called me the next week to add
                    something he&apos;d forgotten. That call alone was worth everything.
                  </p>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1B4F6B" }}>Jennifer M.</div>
                  <div style={{ fontSize: "0.78rem", color: "#999" }}>Daughter, gifted an Afterword page to her father</div>
                </div>
              </div>
            </div>

            {/* Three ways */}
            <div
              style={{
                marginTop: "56px",
                borderTop: "2px solid #D6EAF4",
                paddingTop: "48px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#2E7DA3",
                  marginBottom: "28px",
                }}
              >
                Three ways they can share their story, they choose
              </div>
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}
                className="gift-three-col"
              >
                {[
                  {
                    featured: false,
                    badge: null,
                    title: "Write it themselves",
                    body: "Type answers to guided prompts at their own pace. Most people complete their page in a single afternoon. Every word is theirs.",
                  },
                  {
                    featured: true,
                    badge: "Ideal for older adults",
                    title: "Speak it aloud",
                    body: "Record answers in their own voice. Ideal if typing is difficult, if they want to capture their actual tone and rhythm, or if they simply find it easier to talk than to type. Their recordings are preserved on the page.",
                  },
                  {
                    featured: false,
                    badge: null,
                    title: "Use AI writing assistance",
                    body: "Share thoughts and let the optional AI assistant help shape them into flowing prose. They review and approve every sentence before anything is published. Nothing goes live without their sign-off.",
                  },
                ].map((method) => (
                  <div
                    key={method.title}
                    style={{
                      border: method.featured ? "2px solid #2E7DA3" : "2px solid #E5E5E5",
                      borderRadius: "16px",
                      padding: "28px 24px",
                      background: method.featured ? "#EEF7FC" : "#fafafa",
                      position: "relative",
                    }}
                  >
                    {method.badge && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-12px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "#1B4F6B",
                          color: "#fff",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          padding: "4px 14px",
                          borderRadius: "100px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {method.badge}
                      </div>
                    )}
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1B4F6B", marginBottom: "8px" }}>{method.title}</div>
                    <p style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.6 }}>{method.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Permanence Promise */}
        <section
          style={{
            background: "linear-gradient(135deg, #0d2535, #1B4F6B)",
            color: "#fff",
            textAlign: "center",
            padding: "96px 0",
          }}
        >
          <div className="container-narrow">
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "16px",
              }}
            >
              Our commitment
            </div>
            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "20px",
                maxWidth: "720px",
                margin: "0 auto 20px",
                lineHeight: 1.2,
              }}
            >
              Their page will still be there when the grandchildren find it.
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.7)",
                maxWidth: "620px",
                margin: "0 auto 40px",
                lineHeight: 1.7,
              }}
            >
              Most digital memorial products are subscriptions. Stop paying, and the page disappears,
              taking every story and photo with it. We built Afterword differently.
              Your one-time payment covers permanent hosting &mdash; not for 10 years, not until someone
              stops paying. Forever.
            </p>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", maxWidth: "860px", margin: "0 auto" }}
              className="gift-three-col"
            >
              {[
                {
                  title: "One payment. No renewals.",
                  body: "Your $199.99 covers permanent hosting with no renewal dates, no expiry notices, no annual fees.",
                },
                {
                  title: "Their data, always theirs.",
                  body: "They can export everything, every word, every photo, at any time. We\u2019ll never hold their story hostage.",
                },
                {
                  title: "The QR link never breaks.",
                  body: "The URL the QR plaque points to is guaranteed to remain active. If anything ever changes, we redirect it.",
                },
              ].map((p) => (
                <div
                  key={p.title}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "28px 24px",
                  }}
                >
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{p.title}</div>
                  <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ background: "#EEF7FC", padding: "96px 0" }}>
          <div className="container-main">
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#1B4F6B", marginBottom: "12px" }}>
                From people who gave this gift
              </h2>
              <p style={{ fontSize: "1.05rem", color: "#666" }}>And from families who now have the page when they need it most.</p>
            </div>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}
              className="gift-three-col"
            >
              {[
                {
                  featured: true,
                  quote: "Reading Dad\u2019s Afterword page was like hearing him speak one last time. He wrote about his childhood in a way he never talked about at the dinner table. My kids know their grandfather in a way I never expected. That page is the most important thing he left us.",
                  initial: "S",
                  name: "Sarah M.",
                  role: "Daughter, set up Afterword 4 months before her father passed",
                },
                {
                  featured: false,
                  quote: "I gave this to my mother for her 75th birthday. She was skeptical at first \u2014 she kept saying she didn\u2019t have anything interesting to say. Three weeks later she had written 14 sections and was asking me how to add more photos. She\u2019s added something new almost every month since.",
                  initial: "K",
                  name: "Karen T.",
                  role: "Daughter, gifted Afterword to her mother, age 75",
                },
                {
                  featured: false,
                  quote: "My mother chose cremation. We scattered her ashes at the place she loved most, but I always worried there was nowhere to go, nothing to visit. The QR plaque is on the memorial bench we placed for her. Scan it and she\u2019s right there, in her own words.",
                  initial: "D",
                  name: "David L.",
                  role: "Son, set up Afterword after his mother\u2019s cremation",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "28px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    border: t.featured ? "2px solid #2E7DA3" : "none",
                    position: "relative",
                  }}
                >
                  {t.featured && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-12px",
                        left: "24px",
                        background: "#1B4F6B",
                        color: "#fff",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "4px 12px",
                        borderRadius: "100px",
                      }}
                    >
                      Most meaningful gift
                    </div>
                  )}
                  <p
                    className="font-serif"
                    style={{ fontSize: "1rem", lineHeight: 1.65, color: "#333", flex: 1, marginBottom: "20px" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "#EEF7FC",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#1B4F6B",
                        flexShrink: 0,
                      }}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#333" }}>{t.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "#999" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gift Occasions */}
        <section style={{ background: "#fff", padding: "96px 0" }}>
          <div className="container-main">
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#1B4F6B", marginBottom: "12px" }}>
                Who this gift is for
              </h2>
              <p style={{ fontSize: "1.05rem", color: "#666" }}>
                Any time the window is open is the right time. Some are more obvious than others.
              </p>
            </div>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}
              className="gift-three-col"
            >
              {[
                {
                  occasion: "For an aging parent",
                  title: "You still have time to ask. They still have time to answer.",
                  body: "This is the most common reason people come to Afterword. A parent in their 70s or 80s, in good health, but with the quiet awareness that time is finite. The gift prompts the conversation you\u2019ve been meaning to have.",
                  hook: "\u201cI kept meaning to sit down and record him. This gave us both a reason to finally do it.\u201d",
                },
                {
                  occasion: "For a grandparent",
                  title: "History lives in people. Give it somewhere to live on.",
                  body: "Grandparents have lived through decades your children will only read about in textbooks. An Afterword page preserves that living history, in their words, for every generation of your family that comes after.",
                  hook: "\u201cMy grandmother lived through things my kids can\u2019t imagine. Now they\u2019ll know.\u201d",
                },
                {
                  occasion: "As a family gift",
                  title: "Pool together. Make it the gift that matters to everyone.",
                  body: "For a parent\u2019s milestone birthday, anniversary, or the holidays \u2014 when you want to give something that means more than anything you could buy. Siblings often go in together. It\u2019s the one gift everyone agrees was the right call.",
                  hook: "\u201cFive siblings, and we all agreed this was the most meaningful thing we\u2019d ever given her.\u201d",
                },
              ].map((card) => (
                <div
                  key={card.occasion}
                  style={{
                    border: "2px solid #D6EAF4",
                    borderRadius: "16px",
                    padding: "32px 28px",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#2E7DA3",
                      marginBottom: "8px",
                    }}
                  >
                    {card.occasion}
                  </div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1B4F6B", marginBottom: "12px" }}>
                    {card.title}
                  </div>
                  <p style={{ fontSize: "0.92rem", color: "#666", lineHeight: 1.65, marginBottom: "16px" }}>{card.body}</p>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      fontStyle: "italic",
                      color: "#2E7DA3",
                      borderLeft: "3px solid #D6EAF4",
                      paddingLeft: "12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {card.hook}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ background: "#EEF7FC", padding: "96px 0" }}>
          <div className="container-narrow">
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#2E7DA3",
                textAlign: "center",
                marginBottom: "12px",
              }}
            >
              Pricing
            </div>
            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 700,
                textAlign: "center",
                color: "#1B4F6B",
                marginBottom: "12px",
                lineHeight: 1.2,
              }}
            >
              Give the gift before the window closes.
            </h2>
            <p style={{ textAlign: "center", fontSize: "1.05rem", color: "#666", maxWidth: "480px", margin: "0 auto 48px" }}>
              Every month you wait is a story that doesn&apos;t get told. This is the easy part.
            </p>

            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                padding: "40px 44px",
                maxWidth: "560px",
                margin: "0 auto",
                border: "2px solid #D6EAF4",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#C9932A",
                  background: "#FDF3DC",
                  border: "1px solid #e8c87a",
                  borderRadius: "100px",
                  padding: "6px 20px",
                  marginBottom: "24px",
                  display: "block",
                  width: "100%",
                }}
              >
                Beta Pricing: Limited Time
              </div>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <span style={{ fontSize: "3rem", fontWeight: 800, color: "#1B4F6B", letterSpacing: "-0.02em" }}>$199.99</span>
                <span style={{ fontSize: "1.25rem", color: "#999", textDecoration: "line-through", marginLeft: "10px" }}>$349.99</span>
                <div style={{ fontSize: "0.82rem", color: "#666", marginTop: "8px" }}>
                  One-time payment &nbsp;&middot;&nbsp; No subscription &nbsp;&middot;&nbsp; Permanent hosting
                </div>
              </div>
              <ul style={{ listStyle: "none", marginBottom: "28px" }}>
                {[
                  ["Permanent hosted memorial page", "written entirely in their own words"],
                  ["Physical QR plaque", "shipped to your door, weatherproof, attaches to most outdoor surfaces"],
                  ["Guided story prompts", "thoughtful questions to draw out the stories that matter"],
                  ["Write, speak, or use AI assistance", "three ways to share their story; they choose"],
                  ["Voice recording", "record answers aloud if typing is difficult or they prefer their natural voice"],
                  ["Living guestbook", "family and friends can leave messages and memories"],
                  ["Lifetime hosting", "no renewals, no expiry, no risk of losing the page"],
                  ["Data export", "their story, always theirs to keep"],
                ].map(([bold, rest]) => (
                  <li
                    key={bold}
                    style={{
                      fontSize: "0.92rem",
                      color: "#333",
                      padding: "8px 0",
                      borderBottom: "1px solid #E5E5E5",
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "#1B4F6B", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0, marginTop: "1px" }}>&#10003;</span>
                    <span>
                      <strong>{bold}</strong>: {rest}
                    </span>
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <CheckoutButton className="btn-primary-lg">Give This Gift: $199.99</CheckoutButton>
              </div>
              <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#999" }}>
                One-time payment. Secured checkout. Permanent from day one.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: "#fff", padding: "64px 0" }}>
          <div className="container-main">
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#1B4F6B" }}>
                Questions about gifting
              </h2>
            </div>
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
              {[
                {
                  q: "What if they're not comfortable with technology?",
                  a: "Afterword is designed to be used by people who are not particularly tech-savvy. The interface is simple, the prompts are conversational, and the voice recording option means they never have to type a single word if they don't want to. Many family members also set up the page together, which makes the process feel much more approachable.",
                },
                {
                  q: "Can I help them set it up, or does it need to be done alone?",
                  a: "Absolutely — and most families do exactly this. You purchase the Afterword and set it up together, over a weekend visit or a long phone call. You might ask the questions and type their answers, or sit together while they use voice recording. The process often becomes a treasured conversation in its own right.",
                },
                {
                  q: "What if they're skeptical or think it's morbid?",
                  a: "This is common. The reframe that tends to land: this isn't about death — it's about their story being heard. Most people who are initially reluctant become some of the most enthusiastic users once they realize the prompts are genuinely interesting and the process feels more like sharing than preparing for something. Many say it's the most meaningful afternoon they've spent in years.",
                },
                {
                  q: "Can I set this up as a surprise, or should I involve them?",
                  a: "You can purchase it as a surprise gift, but the recipient needs to be involved to write their page — which is the whole point. The gift is the opportunity and the platform; their story is theirs to tell. Most people present it as a gift and set up the first session together.",
                },
                {
                  q: "What if they start but don't finish?",
                  a: "There is no \"finished.\" The page is designed to be added to over time. Even a partially complete Afterword page — a few sections, some photos, a message to the family — is infinitely more valuable than nothing. And most people, once they start, find they want to keep going.",
                },
                {
                  q: "What does \"permanent\" actually mean? What if Afterword shuts down?",
                  a: "We've built our hosting model specifically to outlast subscription businesses. If Afterword is ever acquired or wound down, we'll provide at minimum 5 years notice and guaranteed data export, so their story is never held hostage. We also guarantee that the URL the QR plaque points to will remain active or be redirected.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid #E5E5E5",
                    borderTop: i === 0 ? "1px solid #E5E5E5" : undefined,
                    padding: "24px 0",
                  }}
                >
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1B4F6B", marginBottom: "10px" }}>
                    {item.q}
                  </div>
                  <p style={{ fontSize: "0.92rem", color: "#666", lineHeight: 1.7 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
