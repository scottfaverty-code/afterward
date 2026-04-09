import SetupAccountForm from "./SetupAccountForm";

export default async function SetupAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#EEF7FC", padding: "64px 24px" }}
    >
      <div
        className="w-full rounded-2xl p-10"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", maxWidth: "480px" }}
      >
        <h1 className="font-serif mb-2" style={{ fontSize: "1.8rem", color: "#1B4F6B" }}>
          Create your password
        </h1>
        <p className="mb-7" style={{ fontSize: "0.95rem", color: "#666", lineHeight: "1.7" }}>
          You&apos;re almost in. Set a password to access your Afterword account.
        </p>

        <SetupAccountForm hasError={!!error} />
      </div>
    </div>
  );
}
