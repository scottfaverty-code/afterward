import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { marked } from "marked";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await marked(post.content, { breaks: true });

  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f2d3d, #1B4F6B)",
            padding: "64px 24px 56px",
          }}
        >
          <div className="container-narrow">
            <Link
              href="/blog"
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "20px",
              }}
            >
              &larr; All posts
            </Link>
            <div style={{ fontSize: "0.78rem", color: "#C9932A", marginBottom: "12px" }}>
              {formatDate(post.date)}
            </div>
            <h1
              className="font-serif"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#fff", lineHeight: "1.3" }}
            >
              {post.title}
            </h1>
          </div>
        </div>

        {/* Body */}
        <div className="container-narrow" style={{ paddingTop: "56px", paddingBottom: "80px" }}>
          <div
            className="rounded-2xl p-8 md:p-12"
            style={{ backgroundColor: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          >
            <div
              className="prose-afterword"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>

          {/* CTA */}
          <div
            className="rounded-2xl p-8 mt-8 text-center"
            style={{ backgroundColor: "#EEF7FC" }}
          >
            <h3 className="font-serif mb-3" style={{ fontSize: "1.4rem", color: "#1B4F6B" }}>
              Your story deserves to be told in your own words.
            </h3>
            <p className="mb-5" style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.7" }}>
              Afterword gives you the space to write it, guided questions, permanent hosting, and a QR plaque shipped to your door.
            </p>
            <Link href="/#pricing" className="btn-primary">
              Get started &rarr;
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
