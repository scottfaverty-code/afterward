import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import { getAllPosts } from "@/lib/blog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
        {/* Header */}
        <div
          className="text-center px-6"
          style={{
            background: "linear-gradient(135deg, #0f2d3d, #1B4F6B)",
            padding: "72px 24px 64px",
          }}
        >
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#C9932A",
              marginBottom: "12px",
            }}
          >
            The Afterword Journal
          </div>
          <h1
            className="font-serif"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#fff", maxWidth: "640px", margin: "0 auto" }}
          >
            On memory, legacy, and the stories we leave behind
          </h1>
        </div>

        {/* Posts */}
        <div className="container-narrow" style={{ paddingTop: "56px", paddingBottom: "80px" }}>
          <div className="flex flex-col gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: "none" }}
              >
                <article
                  className="rounded-2xl p-8"
                  style={{
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.15s",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "0.78rem", color: "#999", marginBottom: "10px" }}>
                    {formatDate(post.date)}
                  </div>
                  <h2
                    className="font-serif mb-3"
                    style={{ fontSize: "1.4rem", color: "#1B4F6B", lineHeight: "1.35" }}
                  >
                    {post.title}
                  </h2>
                  <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.75" }}>
                    {post.excerpt}
                  </p>
                  <div
                    style={{
                      marginTop: "16px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#2E7DA3",
                    }}
                  >
                    Read more &rarr;
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
