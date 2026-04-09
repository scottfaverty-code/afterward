"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrors({ form: "Incorrect email or password. Please try again." });
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #D6EAF4",
    borderRadius: "8px",
    padding: "12px 14px",
    fontSize: "1rem",
    color: "#1A1A1A",
    outline: "none",
    backgroundColor: "#fff",
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4 mb-5">
        <div>
          <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined, form: undefined })); }}
            placeholder="your@email.com"
            style={{ ...inputStyle, borderColor: errors.email ? "#c0392b" : "#D6EAF4" }}
          />
          {errors.email && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "4px" }}>{errors.email}</p>}
        </div>

        <div>
          <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: undefined, form: undefined })); }}
              placeholder="Your password"
              style={{ ...inputStyle, paddingRight: "44px", borderColor: errors.password || errors.form ? "#c0392b" : "#D6EAF4" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ fontSize: "0.75rem", color: "#999", background: "none", border: "none", cursor: "pointer" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "4px" }}>{errors.password}</p>}
        </div>
      </div>

      {errors.form && (
        <p className="mb-4" style={{ color: "#c0392b", fontSize: "0.875rem" }}>{errors.form}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary-lg block w-full text-center mb-5"
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
      >
        {loading ? "Logging in..." : "Log in to my Afterword"}
      </button>

      <div className="flex flex-col items-center gap-2">
        <Link href="/forgot-password" style={{ fontSize: "0.875rem", color: "#1B4F6B", textDecoration: "underline" }}>
          Forgot your password?
        </Link>
        <Link href="/#pricing" style={{ fontSize: "0.875rem", color: "#999" }}>
          Don&apos;t have an account yet?
        </Link>
      </div>
    </form>
  );
}
