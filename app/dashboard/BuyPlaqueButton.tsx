"use client";

import { useState } from "react";

export default function BuyPlaqueButton() {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function handleClick() {
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/user/buy-plaque", { method: "POST" });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setState("error");
        setTimeout(() => setState("idle"), 3000);
      }
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      style={{
        width: "100%",
        padding: "12px 20px",
        borderRadius: 10,
        border: "none",
        backgroundColor: state === "error" ? "#FFF5F5" : "#1B4F6B",
        color: state === "error" ? "#c0392b" : "#fff",
        fontSize: "0.875rem",
        fontWeight: 700,
        cursor: state === "loading" ? "wait" : "pointer",
        opacity: state === "loading" ? 0.7 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {state === "loading"
        ? "Redirecting to checkout…"
        : state === "error"
        ? "Something went wrong — try again"
        : "Add my QR plaque — $50 →"}
    </button>
  );
}
