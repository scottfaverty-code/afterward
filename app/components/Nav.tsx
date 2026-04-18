"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  function href(anchor: string) {
    return onHome ? anchor : `/${anchor}`;
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: "1px solid #E5E5E5" }}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-serif font-bold text-teal-dark"
            style={{ fontSize: "1.25rem" }}
          >
            Afterword
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            <li>
              <a href={href("#how-it-works")} className="text-dark hover:text-teal-dark transition-colors text-sm">
                How it works
              </a>
            </li>
            <li>
              <a href={href("#example")} className="text-dark hover:text-teal-dark transition-colors text-sm">
                See an example
              </a>
            </li>
            <li>
              <Link href="/blog" className="text-dark hover:text-teal-dark transition-colors text-sm">
                Journal
              </Link>
            </li>
            <li>
              <a href={href("#pricing")} className="text-dark hover:text-teal-dark transition-colors text-sm">
                Pricing
              </a>
            </li>
          </ul>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm" style={{ color: "#666", textDecoration: "none" }}>
              Log in
            </Link>
            <a href={href("#pricing")} className="btn-primary text-sm" style={{ padding: "11px 20px" }}>
              Get Started
            </a>
          </div>

          {/* Mobile: Get Started + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <a href={href("#pricing")} className="btn-primary text-sm" style={{ padding: "9px 16px", fontSize: "0.82rem" }}>
              Get Started
            </a>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <span style={{
                display: "block", width: 22, height: 2, backgroundColor: "#1A1A1A",
                transition: "transform 0.2s, opacity 0.2s",
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }} />
              <span style={{
                display: "block", width: 22, height: 2, backgroundColor: "#1A1A1A",
                transition: "opacity 0.2s",
                opacity: menuOpen ? 0 : 1,
              }} />
              <span style={{
                display: "block", width: 22, height: 2, backgroundColor: "#1A1A1A",
                transition: "transform 0.2s, opacity 0.2s",
                transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: "#fff",
            borderTop: "1px solid #E5E5E5",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div className="container-main" style={{ paddingTop: "16px", paddingBottom: "20px" }}>
            <ul className="list-none flex flex-col gap-1">
              {[
                { label: "How it works", url: href("#how-it-works") },
                { label: "See an example", url: href("#example") },
                { label: "Journal", url: "/blog" },
                { label: "Pricing", url: href("#pricing") },
                { label: "Log in", url: "/login" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    onClick={closeMenu}
                    style={{
                      display: "block",
                      padding: "12px 0",
                      fontSize: "1rem",
                      color: "#1A1A1A",
                      textDecoration: "none",
                      borderBottom: "1px solid #F5F5F5",
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
