"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/setup-account`,
    });
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div>
        <div
          className="rounded-lg p-4 mb-5"
          style={{ backgroundColor: "#EEF7FC", borderLeft: "4px solid #1B4F6B" }}
        >
          <p style={{ fontSize: "0.9rem", color: "#1B4F6B", fontWeight: 600 }}>
            Done, check your inbox for the reset link.
          </p>
        </div>
        <Link href="/login" style={{ fontSize: "0.875rem", color: "#1B4F6B", textDecoration: "underline" }}>
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-5">
        <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
          placeholder="your@email.com"
          style={{
            width: "100%",
            border: `1px solid ${errors.email ? "#c0392b" : "#D6EAF4"}`,
            borderRadius: "8px",
            padding: "12px 14px",
            fontSize: "1rem",
            color: "#1A1A1A",
            outline: "none",
            backgroundColor: "#fff",
          }}
        />
        {errors.email && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "4px" }}>{errors.email}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary-lg block w-full text-center mb-5"
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
      >
        {loading ? "Sending..." : "Send reset link"}
      </button>

      <Link href="/login" style={{ fontSize: "0.875rem", color: "#1B4F6B", textDecoration: "underline" }}>
        Back to login
      </Link>
    </form>
  );
}
