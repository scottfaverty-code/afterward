"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  firstName: string | null;
  avatarUrl: string | null;
}

export default function DashboardHeader({ firstName, avatarUrl }: Props) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initial = firstName?.[0]?.toUpperCase() ?? "?";

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: "1px solid #E5E5E5" }}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="font-serif font-bold text-teal-dark" style={{ fontSize: "1.25rem" }}>
            Afterword
          </Link>

          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                backgroundColor: "#1B4F6B",
              }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={`${firstName}'s avatar`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <span style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 600 }}>{initial}</span>
              )}
            </div>

            {firstName && (
              <span style={{ fontSize: "0.875rem", color: "#333" }}>{firstName}</span>
            )}

            <button
              onClick={handleLogout}
              style={{
                fontSize: "0.8rem",
                color: "#999",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
