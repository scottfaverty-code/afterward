"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  promoCode?: string;
}

export default function CheckoutButton({ className, style, children, promoCode }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode ?? null }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
      style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer", ...style }}
    >
      {loading ? "Redirecting to checkout…" : children}
    </button>
  );
}
