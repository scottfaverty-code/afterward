"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  missingName: boolean;
  missingPhoto: boolean;
}

export default function ProfileNudge({ missingName, missingPhoto }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (!missingName && !missingPhoto)) return null;

  let message: React.ReactNode;
  if (missingName && missingPhoto) {
    message = (
      <>Add your name and photo to personalise your Afterword page. <Link href="/setup-profile?from=dashboard" style={{ color: "#C9932A", fontWeight: 600, textDecoration: "underline" }}>Complete my profile &rarr;</Link></>
    );
  } else if (missingPhoto) {
    message = (
      <>Add a profile photo to put a face to your story. <Link href="/setup-profile?from=dashboard" style={{ color: "#C9932A", fontWeight: 600, textDecoration: "underline" }}>Add photo &rarr;</Link></>
    );
  } else {
    message = (
      <>Add your name so we can personalise your page. <Link href="/setup-profile?from=dashboard" style={{ color: "#C9932A", fontWeight: 600, textDecoration: "underline" }}>Add name &rarr;</Link></>
    );
  }

  return (
    <div
      className="flex items-start justify-between gap-4 rounded-xl px-5 py-3.5 mb-5"
      style={{
        backgroundColor: "#FDF3DC",
        borderLeft: "4px solid #C9932A",
      }}
    >
      <p style={{ fontSize: "0.875rem", color: "#7A5C1E", lineHeight: "1.65" }}>
        {message}
      </p>
      <button
        onClick={() => setDismissed(true)}
        style={{ color: "#C9932A", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", lineHeight: 1, flexShrink: 0 }}
        aria-label="Dismiss"
      >
        &#x2715;
      </button>
    </div>
  );
}
