"use client";

import { useState } from "react";

export default function ReplacementPlaqueButton() {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function handleClick() {
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/user/buy-replacement-plaque", { method: "POST" });
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
        background: "none",
        border: "none",
        padding: 0,
        cursor: state === "loading" ? "wait" : "pointer",
        fontSize: "0.78rem",
        color: state === "error" ? "#c0392b" : "#1B4F6B",
        textDecoration: "underline",
        opacity: state === "loading" ? 0.6 : 1,
      }}
    >
      {state === "loading"
        ? "Redirecting…"
        : state === "error"
        ? "Something went wrong — try again"
        : "Order a replacement memory marker →"}
    </button>
  );
}
