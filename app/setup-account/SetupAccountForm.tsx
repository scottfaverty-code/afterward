"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SetupAccountForm({ hasError }: { hasError?: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const [requestingLink, setRequestingLink] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Listen for the PASSWORD_RECOVERY event which fires when
    // Supabase detects the recovery token in the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setSessionReady(true);
      }
    });

    // Also check if a session already exists (e.g. page reload)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    // If no session after 5 seconds, show expired message
    const timeout = setTimeout(() => {
      setSessionError(true);
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Clear timeout if session becomes ready
  useEffect(() => {
    if (sessionReady) setSessionError(false);
  }, [sessionReady]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (password !== confirm) errs.confirm = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrors({ form: "Could not set password. Your link may have expired." });
      setLoading(false);
      return;
    }
    router.push("/setup-profile");
  }

  async function handleRequestNewLink() {
    setRequestingLink(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/setup-account`,
      });
    }
    router.push("/check-your-email");
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

  if (hasError || sessionError) {
    return (
      <div>
        <div
          className="rounded-lg p-4 mb-5"
          style={{ backgroundColor: "#FDF3DC", borderLeft: "4px solid #C9932A" }}
        >
          <p style={{ fontSize: "0.9rem", color: "#7A5C1E", lineHeight: "1.65" }}>
            Your setup link has expired or is invalid. Request a new one below.
          </p>
        </div>
        <button
          onClick={handleRequestNewLink}
          disabled={requestingLink}
          className="btn-primary block w-full text-center"
        >
          {requestingLink ? "Sending..." : "Request a new link"}
        </button>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="text-center py-8" style={{ color: "#999", fontSize: "0.95rem" }}>
        Verifying your link...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: undefined })); }}
              placeholder="At least 8 characters"
              style={{ ...inputStyle, paddingRight: "44px", borderColor: errors.password ? "#c0392b" : "#D6EAF4" }}
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

        <div>
          <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
            Confirm password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setErrors((x) => ({ ...x, confirm: undefined })); }}
              placeholder="Repeat your password"
              style={{ ...inputStyle, paddingRight: "44px", borderColor: errors.confirm ? "#c0392b" : "#D6EAF4" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ fontSize: "0.75rem", color: "#999", background: "none", border: "none", cursor: "pointer" }}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirm && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "4px" }}>{errors.confirm}</p>}
        </div>
      </div>

      {errors.form && (
        <div className="mb-5">
          <p style={{ color: "#c0392b", fontSize: "0.875rem", marginBottom: "8px" }}>{errors.form}</p>
          <button
            type="button"
            onClick={handleRequestNewLink}
            style={{ fontSize: "0.875rem", color: "#1B4F6B", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Request a new link
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary-lg block w-full text-center"
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
      >
        {loading ? "Setting password..." : "Set password and enter Afterword"}
      </button>
    </form>
  );
}
