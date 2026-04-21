import { createClient } from "@/lib/supabase/server";
import SetupProfileForm from "./SetupProfileForm";

export default async function SetupProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const isUpdate = from === "dashboard";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { first_name?: string | null; last_name?: string | null; avatar_url?: string | null } = {};
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data ?? {};
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#EEF7FC", padding: "64px 24px" }}
    >
      <div
        className="w-full rounded-2xl p-10"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", maxWidth: "520px" }}
      >
        <p className="text-center mb-5" style={{ fontSize: "0.875rem", color: "#999" }}>
          {isUpdate ? "Update your profile" : "Almost there, just one more step"}
        </p>

        <h1 className="font-serif mb-3" style={{ fontSize: "1.8rem", color: "#1B4F6B" }}>
          Let&apos;s put a name and face to your story.
        </h1>

        <p className="mb-7" style={{ fontSize: "0.95rem", color: "#666", lineHeight: "1.7" }}>
          Your name and photo will appear on your Afterword page and in your account. You can update these any time.
        </p>

        <SetupProfileForm
          initialFirstName={profile.first_name ?? ""}
          initialLastName={profile.last_name ?? ""}
          initialAvatarUrl={profile.avatar_url ?? ""}
          isUpdate={isUpdate}
        />
      </div>
    </div>
  );
}
