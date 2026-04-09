"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResendEmailButton() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleResend() {
    setStatus("sending");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
      setStatus(error ? "error" : "sent");
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p style={{ fontSize: "0.875rem", color: "#1B4F6B", fontWeight: 600 }}>Email resent. Check your inbox.</p>;
  }

  if (status === "error") {
    return <p style={{ fontSize: "0.875rem", color: "#c0392b" }}>Something went wrong. Try again in a moment.</p>;
  }

  return (
    <button
      onClick={handleResend}
      disabled={status === "sending"}
      style={{
        fontSize: "0.875rem",
        color: "#1B4F6B",
        background: "none",
        border: "none",
        cursor: "pointer",
        textDecoration: "underline",
        opacity: status === "sending" ? 0.7 : 1,
      }}
    >
      {status === "sending" ? "Sending..." : "Resend the email"}
    </button>
  );
}
