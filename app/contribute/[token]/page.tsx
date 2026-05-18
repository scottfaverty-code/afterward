import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ContributeForm from "./ContributeForm";

export default async function ContributePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  // Validate the invite server-side
  const { data: invite } = await supabase
    .from("contribution_invites")
    .select("id, user_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!invite || new Date(invite.expires_at) < new Date()) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url, referred_as")
    .eq("id", invite.user_id)
    .single();

  const ownerFirstName = profile?.first_name ?? null;
  const ownerFullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Someone";
  const ownerAvatarUrl = profile?.avatar_url ?? null;
  const referredAs = (profile?.referred_as as "he" | "she" | "they") ?? "they";

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      {/* Minimal header */}
      <div
        style={{
          backgroundColor: "#1B4F6B",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className="font-serif"
          style={{ color: "#fff", fontSize: "1.1rem", letterSpacing: "0.08em" }}
        >
          AFTERWORD
        </span>
      </div>

      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Invitation header */}
        <div className="text-center mb-10">
          {ownerAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ownerAvatarUrl}
              alt={ownerFullName}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                objectFit: "cover",
                margin: "0 auto 16px",
                border: "3px solid #D6EAF4",
              }}
            />
          ) : (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor: "#1B4F6B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <span className="font-serif" style={{ color: "#fff", fontSize: "1.8rem" }}>
                {ownerFullName[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
          )}

          <h1 className="font-serif mb-3" style={{ fontSize: "1.6rem", color: "#1B4F6B", lineHeight: "1.3" }}>
            {ownerFirstName
              ? <>{ownerFirstName} has invited you to add a memory</>
              : <>You&apos;ve been invited to add a memory</>
            }
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#666", lineHeight: "1.75", maxWidth: "480px", margin: "0 auto" }}>
            {ownerFullName} is building {referredAs === "he" ? "his" : referredAs === "she" ? "her" : "their"} Afterword — a place to tell {referredAs === "he" ? "his" : referredAs === "she" ? "her" : "their"} own story, in {referredAs === "he" ? "his" : referredAs === "she" ? "her" : "their"} own words.
            Your memory will become part of that story.
          </p>
        </div>

        <ContributeForm token={token} ownerFirstName={ownerFirstName} referredAs={referredAs} />
      </div>
    </div>
  );
}
