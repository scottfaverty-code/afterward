import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#EEF7FC", padding: "64px 24px" }}
    >
      <div
        className="w-full rounded-2xl p-10"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", maxWidth: "440px" }}
      >
        <h1 className="font-serif mb-3" style={{ fontSize: "1.8rem", color: "#1B4F6B" }}>
          Reset your password
        </h1>
        <p className="mb-7" style={{ fontSize: "0.95rem", color: "#666", lineHeight: "1.7" }}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
