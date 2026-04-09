"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GuestbookForm({ memorialSlug }: { memorialSlug: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!message.trim()) errs.message = "Message is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const supabase = createClient();
    await supabase.from("guestbook_entries").insert({
      memorial_slug: memorialSlug,
      author_name: name.trim(),
      message: message.trim(),
    });
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "#EEF7FC", borderLeft: "4px solid #1B4F6B" }}
      >
        <p style={{ fontSize: "0.9rem", color: "#1B4F6B", fontWeight: 600 }}>
          Thank you. Your message has been added.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #D6EAF4",
    borderRadius: "8px",
    padding: "12px 14px",
    fontSize: "0.95rem",
    color: "#1A1A1A",
    outline: "none",
    backgroundColor: "#fff",
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })); }}
          placeholder="Your name"
          style={{ ...inputStyle, borderColor: errors.name ? "#c0392b" : "#D6EAF4" }}
        />
        {errors.name && <p style={{ color: "#c0392b", fontSize: "0.78rem", marginTop: "3px" }}>{errors.name}</p>}
      </div>
      <div>
        <textarea
          value={message}
          onChange={(e) => { setMessage(e.target.value); setErrors((x) => ({ ...x, message: undefined })); }}
          placeholder="Leave a message or memory..."
          rows={3}
          style={{ ...inputStyle, resize: "vertical", borderColor: errors.message ? "#c0392b" : "#D6EAF4" }}
        />
        {errors.message && <p style={{ color: "#c0392b", fontSize: "0.78rem", marginTop: "3px" }}>{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
      >
        {loading ? "Saving..." : "Leave a message"}
      </button>
    </form>
  );
}
