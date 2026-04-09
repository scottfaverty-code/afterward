import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1A1A1A", color: "#fff" }}>
      <div className="container-main" style={{ paddingTop: "64px", paddingBottom: "40px" }}>
        <div
          className="grid gap-12"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          <div>
            <div
              className="font-serif font-bold mb-3"
              style={{ fontSize: "1.25rem", color: "#fff" }}
            >
              Afterword
            </div>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>
              A permanent memorial platform designed to preserve your story, in your own words, for generations to come.
            </p>
          </div>

          <div>
            <div
              className="font-bold mb-4"
              style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}
            >
              Platform
            </div>
            <ul className="flex flex-col gap-2 list-none" style={{ padding: 0 }}>
              <li><a href="#how-it-works" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }} className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#example" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }} className="hover:text-white transition-colors">See an Example</a></li>
              <li><a href="#pricing" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }} className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <div
              className="font-bold mb-4"
              style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}
            >
              Legal
            </div>
            <ul className="flex flex-col gap-2 list-none" style={{ padding: 0 }}>
              <li><Link href="/terms" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }} className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }} className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><a href="mailto:scott@myafterword.co" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }} className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: "40px",
            paddingTop: "24px",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          &copy; 2026 Afterword. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
