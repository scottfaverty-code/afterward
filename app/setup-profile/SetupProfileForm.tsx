"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SetupProfileForm({
  initialFirstName = "",
  initialLastName = "",
  initialAvatarUrl = "",
  isUpdate = false,
}: {
  initialFirstName?: string;
  initialLastName?: string;
  initialAvatarUrl?: string;
  isUpdate?: boolean;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(initialAvatarUrl);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; photo?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrors((x) => ({ ...x, photo: "Photo must be under 10MB" }));
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrors((x) => ({ ...x, photo: undefined }));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(initialAvatarUrl);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    let avatarUrl = initialAvatarUrl;

    if (photoFile) {
      const ext = photoFile.name.split(".").pop() ?? "jpg";
      const path = `profile-photos/${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(path, photoFile, { upsert: true });

      if (uploadError) {
        setErrors({ photo: "We couldn\u2019t upload your photo, you can try again or skip for now" });
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(path);
      avatarUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      avatar_url: avatarUrl || null,
    }, { onConflict: "id" });

    if (error) {
      setErrors({ form: "Something went wrong. Please try again." });
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  function handleSkip() {
    router.push("/dashboard");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #D6EAF4",
    borderRadius: "8px",
    padding: "12px 14px",
    fontSize: "1rem",
    color: "#1A1A1A",
    outline: "none",
    backgroundColor: "#fff",
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Avatar upload */}
      <div className="flex flex-col items-center mb-7">
        <div
          className="rounded-full overflow-hidden mb-3 flex items-center justify-center"
          style={{
            width: 100,
            height: 100,
            backgroundColor: "#1B4F6B",
            border: "3px solid #D6EAF4",
          }}
        >
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="Profile photo preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <circle cx="22" cy="17" r="8" fill="rgba(255,255,255,0.4)" />
              <path d="M6 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
            </svg>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/webp"
          onChange={handlePhotoChange}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="btn-ghost cursor-pointer mb-1"
          style={{ padding: "8px 20px", fontSize: "0.875rem" }}
        >
          Upload a photo
        </label>

        {photoPreview && photoPreview !== initialAvatarUrl && (
          <button
            type="button"
            onClick={removePhoto}
            style={{ fontSize: "0.78rem", color: "#999", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Remove photo
          </button>
        )}

        {errors.photo && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "4px" }}>{errors.photo}</p>}

        <p className="text-center mt-2" style={{ fontSize: "0.8rem", color: "#999", lineHeight: "1.5" }}>
          A recent photo works best. JPG, PNG, or HEIC. Max 10MB.
          <br />
          Don&apos;t have one handy? Skip this, you can add it later from your dashboard.
        </p>
      </div>

      {/* Name fields */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
            First name <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); setErrors((x) => ({ ...x, firstName: undefined })); }}
            placeholder="Your first name"
            style={{ ...inputStyle, borderColor: errors.firstName ? "#c0392b" : "#D6EAF4" }}
          />
          {errors.firstName && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "4px" }}>{errors.firstName}</p>}
        </div>
        <div>
          <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
            Last name <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => { setLastName(e.target.value); setErrors((x) => ({ ...x, lastName: undefined })); }}
            placeholder="Your last name"
            style={{ ...inputStyle, borderColor: errors.lastName ? "#c0392b" : "#D6EAF4" }}
          />
          {errors.lastName && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "4px" }}>{errors.lastName}</p>}
        </div>
      </div>

      {errors.form && (
        <p className="mb-4" style={{ color: "#c0392b", fontSize: "0.875rem" }}>{errors.form}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary-lg block w-full text-center mb-4"
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
      >
        {loading ? "Saving..." : isUpdate ? "Save changes \u2192" : "Enter Afterword \u2192"}
      </button>

      {!isUpdate && (
        <p className="text-center">
          <button
            type="button"
            onClick={handleSkip}
            style={{ fontSize: "0.875rem", color: "#999", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Skip for now, I&apos;ll add these later
          </button>
        </p>
      )}
    </form>
  );
}
