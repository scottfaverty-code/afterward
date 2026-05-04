"use client";

import { useEffect, useRef, useState } from "react";

type Section = {
  slug: string;
  label: string;
  shortLabel: string;
  answers: string[];
  isLetter?: boolean;
};

type Props = {
  fullName: string;
  firstName: string;
  birthYear: number | null;
  deathYear: number | null;
  avatarUrl: string | null;
  initial: string;
  sections: Section[];
  guestbook: { id: string; author_name: string; message: string; created_at: string }[];
  memorialSlug: string;
};

const NAV_BG = "#1B4F6B";
const DARK = "#0f2d3d";

export default function PreviewClient({
  fullName,
  firstName,
  birthYear,
  deathYear,
  avatarUrl,
  initial,
  sections,
  guestbook,
  memorialSlug,
}: Props) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Track scroll position for nav background + active section
  useEffect(() => {
    function onScroll() {
      setNavScrolled(window.scrollY > 80);

      // Determine active section
      const offsets = Object.entries(sectionRefs.current)
        .map(([slug, el]) => ({ slug, top: el?.getBoundingClientRect().top ?? Infinity }))
        .filter(({ top }) => top <= 120)
        .sort((a, b) => b.top - a.top);

      setActiveSection(offsets[0]?.slug ?? null);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // nav height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const navItems = [
    ...sections.map((s) => ({ id: s.slug, label: s.shortLabel })),
    { id: "guestbook", label: "Guestbook" },
  ];

  const yearsDisplay = birthYear && deathYear
    ? { birth: String(birthYear), death: String(deathYear) }
    : birthYear
    ? { birth: String(birthYear), death: null }
    : deathYear
    ? { birth: null, death: String(deathYear) }
    : null;

  return (
    <div style={{ backgroundColor: "#FAFAF5", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Sticky nav ───────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          backgroundColor: navScrolled ? NAV_BG : "transparent",
          transition: "background-color 0.3s ease",
        }}
      >
        {/* Name */}
        <span
          className="font-serif"
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: navScrolled ? "#fff" : DARK,
            letterSpacing: "0.01em",
            transition: "color 0.3s ease",
          }}
        >
          {fullName}.
        </span>

        {/* Section links */}
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: activeSection === item.id ? 700 : 400,
                color: navScrolled
                  ? activeSection === item.id ? "#fff" : "rgba(255,255,255,0.65)"
                  : activeSection === item.id ? DARK : "#666",
                letterSpacing: "0.04em",
                padding: 0,
                transition: "color 0.2s ease, font-weight 0.1s ease",
                borderBottom: activeSection === item.id
                  ? `2px solid ${navScrolled ? "#fff" : DARK}`
                  : "2px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          paddingTop: 64,
        }}
      >
        {/* Watermark name */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: "5vw",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: "clamp(80px, 16vw, 220px)",
              fontWeight: 700,
              color: DARK,
              opacity: 0.05,
              lineHeight: 0.85,
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {fullName}
          </span>
        </div>

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 48px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left: years + name */}
          <div>
            {yearsDisplay && (
              <div style={{ marginBottom: "32px" }}>
                {yearsDisplay.birth && (
                  <div
                    className="font-serif"
                    style={{
                      fontSize: "clamp(56px, 8vw, 96px)",
                      fontWeight: 700,
                      color: DARK,
                      lineHeight: 1,
                      marginBottom: "4px",
                    }}
                  >
                    {yearsDisplay.birth}
                  </div>
                )}
                <div
                  style={{
                    height: "3px",
                    width: "48px",
                    backgroundColor: NAV_BG,
                    marginBottom: "4px",
                  }}
                />
                {yearsDisplay.death && (
                  <div
                    className="font-serif"
                    style={{
                      fontSize: "clamp(56px, 8vw, 96px)",
                      fontWeight: 700,
                      color: DARK,
                      lineHeight: 1,
                    }}
                  >
                    {yearsDisplay.death}
                  </div>
                )}
              </div>
            )}

            <h1
              className="font-serif"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                color: DARK,
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: "16px",
              }}
            >
              {fullName}
            </h1>

            <p style={{ fontSize: "0.95rem", color: "#888", lineHeight: 1.6, maxWidth: "360px" }}>
              Written in {firstName}&rsquo;s own words.{" "}
              <a
                href="https://www.myafterword.co"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: NAV_BG, textDecoration: "none", borderBottom: `1px solid ${NAV_BG}` }}
              >
                Afterword
              </a>
              .
            </p>

            {/* Scroll cue */}
            <div
              style={{
                marginTop: "48px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                color: "#999",
                fontSize: "0.8rem",
              }}
              onClick={() => sections[0] && scrollTo(sections[0].slug)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M6 12l4 4 4-4" stroke={NAV_BG} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Read {firstName}&rsquo;s story
            </div>
          </div>

          {/* Right: photo */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                width: "clamp(280px, 40vw, 480px)",
                aspectRatio: "3 / 4",
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 24px 80px rgba(15,45,61,0.18)",
                backgroundColor: NAV_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={fullName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  className="font-serif"
                  style={{ fontSize: "6rem", color: "rgba(255,255,255,0.4)" }}
                >
                  {initial}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Story sections ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 48px 120px" }}>
        {sections.map((section, i) => (
          <section
            key={section.slug}
            id={section.slug}
            ref={(el) => { sectionRefs.current[section.slug] = el; }}
            style={{
              paddingTop: "96px",
              borderTop: i > 0 ? "1px solid #E8E4DC" : "none",
              marginTop: i > 0 ? "96px" : 0,
            }}
          >
            {/* Section label */}
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: NAV_BG,
                marginBottom: "16px",
              }}
            >
              {section.label}
            </div>

            {section.isLetter ? (
              /* Letter treatment */
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "2px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)",
                  padding: "56px 60px 64px",
                }}
              >
                {section.answers.map((answer, j) => (
                  <p
                    key={j}
                    style={{
                      fontFamily: "'Courier New', Courier, monospace",
                      fontSize: "0.92rem",
                      color: "#2a2a2a",
                      lineHeight: 1.9,
                      whiteSpace: "pre-wrap",
                      marginBottom: j < section.answers.length - 1 ? "2em" : 0,
                    }}
                  >
                    {answer}
                  </p>
                ))}
              </div>
            ) : (
              /* Prose treatment */
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {section.answers.map((answer, j) => (
                  <p
                    key={j}
                    style={{
                      fontSize: "1.05rem",
                      color: "#2a2a2a",
                      lineHeight: 1.9,
                      whiteSpace: "pre-wrap",
                      margin: 0,
                    }}
                  >
                    {answer}
                  </p>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* ── Guestbook ──────────────────────────────────────────────────── */}
        <section
          id="guestbook"
          ref={(el) => { sectionRefs.current["guestbook"] = el; }}
          style={{
            paddingTop: "96px",
            borderTop: "1px solid #E8E4DC",
            marginTop: "96px",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: NAV_BG,
              marginBottom: "16px",
            }}
          >
            Guestbook
          </div>

          <h2
            className="font-serif"
            style={{ fontSize: "1.6rem", color: DARK, marginBottom: "32px", fontWeight: 400 }}
          >
            Leave a message for {firstName}&rsquo;s family
          </h2>

          {/* Simple guestbook form placeholder */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "32px",
              marginBottom: "32px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <input
              type="text"
              placeholder="Your name"
              disabled
              style={{
                width: "100%",
                border: "1px solid #E8E4DC",
                borderRadius: "8px",
                padding: "12px 14px",
                fontSize: "0.95rem",
                marginBottom: "12px",
                backgroundColor: "#FAFAF5",
                color: "#999",
                boxSizing: "border-box",
              }}
            />
            <textarea
              placeholder="Your message…"
              disabled
              rows={4}
              style={{
                width: "100%",
                border: "1px solid #E8E4DC",
                borderRadius: "8px",
                padding: "12px 14px",
                fontSize: "0.95rem",
                backgroundColor: "#FAFAF5",
                color: "#999",
                resize: "none",
                boxSizing: "border-box",
                marginBottom: "12px",
                fontFamily: "inherit",
              }}
            />
            <div
              style={{
                display: "inline-block",
                padding: "10px 24px",
                borderRadius: "8px",
                backgroundColor: NAV_BG,
                color: "#fff",
                fontSize: "0.85rem",
                fontWeight: 600,
                opacity: 0.5,
                cursor: "default",
              }}
            >
              Leave a message
            </div>
            <p style={{ fontSize: "0.75rem", color: "#bbb", marginTop: "10px" }}>
              [Guestbook interactions disabled in preview]
            </p>
          </div>

          {guestbook.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {guestbook.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    padding: "24px 28px",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: DARK,
                      marginBottom: "6px",
                    }}
                  >
                    {entry.author_name}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7, margin: 0 }}>
                    {entry.message}
                  </p>
                  <div style={{ fontSize: "0.72rem", color: "#bbb", marginTop: "10px" }}>
                    {new Date(entry.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "80px",
            paddingTop: "40px",
            borderTop: "1px solid #E8E4DC",
          }}
        >
          <a
            href="https://www.myafterword.co"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "serif",
              fontSize: "0.85rem",
              color: "#bbb",
              textDecoration: "none",
              letterSpacing: "0.12em",
            }}
          >
            AFTERWORD
          </a>
          <p style={{ fontSize: "0.75rem", color: "#ccc", marginTop: "6px" }}>
            {firstName} wrote this page in {firstName === fullName ? "their" : firstName.endsWith("s") ? "his" : "his"} own words.
          </p>
        </div>
      </div>
    </div>
  );
}
