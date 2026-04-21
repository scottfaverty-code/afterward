"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  sectionLabel: string;
  sectionNumber: number;
}

export default function WriteHeader({ sectionLabel, sectionNumber }: Props) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 bg-white" style={{ borderBottom: "1px solid #E5E5E5" }}>
      <div className="container-main">
        <div className="flex items-center justify-between h-14">
          <Link href="/dashboard" className="font-serif font-bold text-teal-dark" style={{ fontSize: "1.1rem" }}>
            Afterword
          </Link>

          <div
            className="font-bold hidden sm:block"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#2E7DA3",
            }}
          >
            {sectionLabel}
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            style={{
              fontSize: "0.8rem",
              color: "#999",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Save and exit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: "6px", backgroundColor: "#D6EAF4" }}>
        <div
          style={{
            height: "100%",
            width: `${((sectionNumber - 1) / 7) * 100}%`,
            backgroundColor: "#1B4F6B",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <div
        className="container-main py-1"
        style={{ fontSize: "0.72rem", color: "#999" }}
      >
        Section {sectionNumber} of 7, {sectionLabel}
      </div>
    </div>
  );
}
