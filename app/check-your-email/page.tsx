import Link from "next/link";
import ResendEmailButton from "./ResendEmailButton";

export default function CheckYourEmailPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#EEF7FC", padding: "64px 24px" }}
    >
      <div className="text-center" style={{ maxWidth: "480px" }}>
        {/* Envelope icon */}
        <div className="flex justify-center mb-6">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 80, height: 80, backgroundColor: "#EEF7FC", border: "2px solid #D6EAF4" }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Email envelope">
              <rect x="4" y="10" width="32" height="22" rx="3" stroke="#1B4F6B" strokeWidth="2" fill="none" />
              <path d="M4 13l16 11 16-11" stroke="#1B4F6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h1
          className="font-serif mb-4"
          style={{ fontSize: "2rem", color: "#1B4F6B" }}
        >
          Check your inbox
        </h1>

        <p className="mb-3" style={{ fontSize: "1rem", color: "#555", lineHeight: "1.75" }}>
          We&apos;ve sent a password setup link to your email address. Click the link in that email to create your password and start writing your story.
        </p>

        <p className="mb-8" style={{ fontSize: "1rem", color: "#555", lineHeight: "1.75" }}>
          The link expires in 24 hours. If you don&apos;t see it, check your spam or junk folder.
        </p>

        <div className="flex flex-col items-center gap-3">
          <ResendEmailButton />
          <Link href="/" style={{ fontSize: "0.875rem", color: "#999", textDecoration: "underline" }}>
            Back to Afterword
          </Link>
        </div>
      </div>
    </div>
  );
}
