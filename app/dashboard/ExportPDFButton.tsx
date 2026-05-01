"use client";

import { useState } from "react";

export default function ExportPDFButton() {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function handleExport() {
    if (state === "loading") return;
    setState("loading");

    try {
      const res = await fetch("/api/user/export-pdf");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Use filename from Content-Disposition if present
      const disposition = res.headers.get("content-disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? "afterword.pdf";

      a.click();
      URL.revokeObjectURL(url);
      setState("idle");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={state === "loading"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "9px 16px",
        borderRadius: 8,
        border: "1px solid #D6EAF4",
        backgroundColor: state === "error" ? "#FFF5F5" : "#EEF7FC",
        color: state === "error" ? "#c0392b" : "#1B4F6B",
        fontSize: "0.82rem",
        fontWeight: 600,
        cursor: state === "loading" ? "wait" : "pointer",
        width: "100%",
        justifyContent: "center",
        transition: "opacity 0.15s",
        opacity: state === "loading" ? 0.65 : 1,
      }}
    >
      {state === "loading" ? (
        <>
          <span style={{ fontSize: "0.85rem" }}>⏳</span>
          Generating PDF…
        </>
      ) : state === "error" ? (
        <>Something went wrong — try again</>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Download as PDF
        </>
      )}
    </button>
  );
}
