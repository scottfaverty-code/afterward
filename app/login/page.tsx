import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#EEF7FC", padding: "64px 24px" }}
    >
      <div
        className="w-full rounded-2xl p-10"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", maxWidth: "440px" }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="font-serif font-bold" style={{ fontSize: "1.5rem", color: "#1B4F6B" }}>
            Afterword
          </Link>
        </div>

        <h1 className="font-serif mb-7" style={{ fontSize: "1.8rem", color: "#1B4F6B" }}>
          Welcome back
        </h1>

        <LoginForm />
      </div>
    </div>
  );
}
