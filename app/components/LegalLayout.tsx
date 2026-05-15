import Link from "next/link";
import Footer from "./Footer";

export default function LegalLayout({
  title,
  effectiveDate,
  lastUpdated,
  draft,
  children,
}: {
  title: string;
  effectiveDate?: string;
  lastUpdated?: string;
  draft?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <div style={{ backgroundColor: "#F8F7F4", minHeight: "100vh" }}>
        {/* Nav */}
        <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #E8E4DC", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", color: "#1B4F6B", fontWeight: 700, textDecoration: "none" }}>
            Afterword
          </Link>
          <Link href="/" style={{ fontSize: "0.8rem", color: "#999", textDecoration: "none" }}>
            ← Back to home
          </Link>
        </div>

        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 32px 96px" }}>
          {draft && (
            <div style={{ backgroundColor: "#FDF3DC", border: "1px solid #F0D080", borderRadius: "8px", padding: "12px 20px", marginBottom: "32px", fontSize: "0.82rem", color: "#7A5A00", fontWeight: 600 }}>
              DRAFT — FOR ATTORNEY REVIEW. Effective dates and bracketed placeholders are not yet final.
            </div>
          )}

          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", color: "#1A1A1A", marginBottom: "8px", fontWeight: 700 }}>
            {title}
          </h1>

          <div style={{ fontSize: "0.82rem", color: "#999", marginBottom: "48px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {effectiveDate && <span>Effective Date: {effectiveDate}</span>}
            {lastUpdated && <span>Last Updated: {lastUpdated}</span>}
          </div>

          <div style={{ fontSize: "0.95rem", color: "#2A2A2A", lineHeight: "1.85" }}>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
