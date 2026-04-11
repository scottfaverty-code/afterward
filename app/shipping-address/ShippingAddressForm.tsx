"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "New Zealand",
  "Other",
];

interface FormErrors {
  [key: string]: string;
}

export default function ShippingAddressForm({ isUpdate = false, sessionId }: { isUpdate?: boolean; sessionId?: string }) {
  const router = useRouter();
  const [deliveryType, setDeliveryType] = useState<"home" | "estate_attorney">("home");
  const [fields, setFields] = useState({
    recipient_name: "",
    contact_name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state_province: "",
    postal_code: "",
    country: "United States",
    attorney_note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function set(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const next = { ...e }; delete next[key]; return next; });
  }

  function validate(): boolean {
    const e: FormErrors = {};
    const required =
      deliveryType === "home"
        ? ["recipient_name", "address_line_1", "city", "state_province", "postal_code", "country"]
        : ["recipient_name", "contact_name", "address_line_1", "city", "state_province", "postal_code", "country"];
    for (const field of required) {
      if (!fields[field as keyof typeof fields].trim()) {
        const labels: Record<string, string> = {
          recipient_name: deliveryType === "home" ? "Full name" : "Attorney or firm name",
          contact_name: "Contact name at firm",
          address_line_1: "Address line 1",
          city: "City",
          state_province: "State / Province",
          postal_code: "Postal / ZIP code",
          country: "Country",
        };
        e[field] = `${labels[field] ?? field} is required`;
      }
    }
    if (fields.attorney_note.length > 300) {
      e.attorney_note = "Note must be 300 characters or fewer";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Pre-auth flow: use API route with session_id
    if (sessionId) {
      const res = await fetch("/api/shipping-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          delivery_type: deliveryType,
          recipient_name: fields.recipient_name,
          contact_name: fields.contact_name,
          address_line_1: fields.address_line_1,
          address_line_2: fields.address_line_2,
          city: fields.city,
          state_province: fields.state_province,
          postal_code: fields.postal_code,
          country: fields.country,
          attorney_note: fields.attorney_note,
        }),
      });

      if (!res.ok) {
        setErrors({ form: "Something went wrong. Please try again." });
        setLoading(false);
        return;
      }

      router.push("/check-your-email");
      return;
    }

    // Authenticated flow (update from dashboard)
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setErrors({ form: "You must be logged in to update your address." });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("shipping_addresses").upsert({
      user_id: user.id,
      delivery_type: deliveryType,
      recipient_name: fields.recipient_name,
      contact_name: deliveryType === "estate_attorney" ? fields.contact_name : null,
      address_line_1: fields.address_line_1,
      address_line_2: fields.address_line_2 || null,
      city: fields.city,
      state_province: fields.state_province,
      postal_code: fields.postal_code,
      country: fields.country,
      attorney_note: deliveryType === "estate_attorney" && fields.attorney_note ? fields.attorney_note : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (error) {
      setErrors({ form: "Something went wrong. Please try again." });
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  async function handleSkip() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("purchases")
        .update({ shipping_address_deferred: true })
        .eq("user_id", user.id);
    }
    router.push("/check-your-email");
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

  const errorStyle: React.CSSProperties = {
    color: "#c0392b",
    fontSize: "0.8rem",
    marginTop: "4px",
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Delivery type selector */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        {(["home", "estate_attorney"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setDeliveryType(type)}
            className="rounded-xl p-5 text-left transition-colors cursor-pointer"
            style={{
              border: deliveryType === type ? "2px solid #1B4F6B" : "2px solid #E5E5E5",
              backgroundColor: deliveryType === type ? "#EEF7FC" : "#fff",
            }}
          >
            <div className="font-bold" style={{ fontSize: "0.9rem", color: "#1A1A1A" }}>
              {type === "home" ? "My home address" : "My estate attorney or solicitor"}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#666", marginTop: "2px" }}>
              {type === "home" ? "Ship directly to me" : "They\u2019ll hold it until it\u2019s needed"}
            </div>
          </button>
        ))}
      </div>

      {/* Estate attorney framing note */}
      {deliveryType === "estate_attorney" && (
        <div
          className="rounded-lg p-4 mb-5"
          style={{
            backgroundColor: "#FDF3DC",
            borderLeft: "4px solid #C9932A",
            fontSize: "0.9rem",
            fontStyle: "italic",
            color: "#7A5C1E",
            lineHeight: "1.65",
          }}
        >
          A thoughtful choice. Your attorney will receive the plaque and can include it with your estate documents for your family to find when the time comes. We&apos;ll include a note in the package explaining what Afterword is and how to use the QR plaque.
        </div>
      )}

      {/* Form fields */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
            {deliveryType === "home" ? "Full name" : "Attorney or firm name"} <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <input
            type="text"
            value={fields.recipient_name}
            onChange={(e) => set("recipient_name", e.target.value)}
            placeholder={deliveryType === "home" ? "Name on the shipping label" : "e.g. Smith & Associates Law"}
            style={{ ...inputStyle, borderColor: errors.recipient_name ? "#c0392b" : "#D6EAF4" }}
          />
          {errors.recipient_name && <p style={errorStyle}>{errors.recipient_name}</p>}
        </div>

        {deliveryType === "estate_attorney" && (
          <div>
            <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
              Contact name at firm <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <input
              type="text"
              value={fields.contact_name}
              onChange={(e) => set("contact_name", e.target.value)}
              placeholder="The attorney or paralegal handling your file"
              style={{ ...inputStyle, borderColor: errors.contact_name ? "#c0392b" : "#D6EAF4" }}
            />
            {errors.contact_name && <p style={errorStyle}>{errors.contact_name}</p>}
          </div>
        )}

        <div>
          <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
            Address line 1 <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <input
            type="text"
            value={fields.address_line_1}
            onChange={(e) => set("address_line_1", e.target.value)}
            placeholder="Street address"
            style={{ ...inputStyle, borderColor: errors.address_line_1 ? "#c0392b" : "#D6EAF4" }}
          />
          {errors.address_line_1 && <p style={errorStyle}>{errors.address_line_1}</p>}
        </div>

        <div>
          <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
            Address line 2 <span style={{ color: "#999", fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            type="text"
            value={fields.address_line_2}
            onChange={(e) => set("address_line_2", e.target.value)}
            placeholder={deliveryType === "home" ? "Apartment, suite, unit (optional)" : "Suite, floor (optional)"}
            style={inputStyle}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
              City <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <input
              type="text"
              value={fields.city}
              onChange={(e) => set("city", e.target.value)}
              style={{ ...inputStyle, borderColor: errors.city ? "#c0392b" : "#D6EAF4" }}
            />
            {errors.city && <p style={errorStyle}>{errors.city}</p>}
          </div>
          <div>
            <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
              State / Province <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <input
              type="text"
              value={fields.state_province}
              onChange={(e) => set("state_province", e.target.value)}
              style={{ ...inputStyle, borderColor: errors.state_province ? "#c0392b" : "#D6EAF4" }}
            />
            {errors.state_province && <p style={errorStyle}>{errors.state_province}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
              Postal / ZIP code <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <input
              type="text"
              value={fields.postal_code}
              onChange={(e) => set("postal_code", e.target.value)}
              style={{ ...inputStyle, borderColor: errors.postal_code ? "#c0392b" : "#D6EAF4" }}
            />
            {errors.postal_code && <p style={errorStyle}>{errors.postal_code}</p>}
          </div>
          <div>
            <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
              Country <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <select
              value={fields.country}
              onChange={(e) => set("country", e.target.value)}
              style={{ ...inputStyle, borderColor: errors.country ? "#c0392b" : "#D6EAF4" }}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.country && <p style={errorStyle}>{errors.country}</p>}
          </div>
        </div>

        {deliveryType === "estate_attorney" && (
          <div>
            <label className="block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
              Note to include in the package <span style={{ color: "#999", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={fields.attorney_note}
              onChange={(e) => set("attorney_note", e.target.value)}
              placeholder="Anything you\u2019d like us to include in the note to your attorney \u2014 e.g. your file reference, any special instructions"
              rows={3}
              maxLength={300}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "80px",
                borderColor: errors.attorney_note ? "#c0392b" : "#D6EAF4",
              }}
            />
            <div className="flex justify-between mt-1">
              {errors.attorney_note && <p style={errorStyle}>{errors.attorney_note}</p>}
              <p style={{ fontSize: "0.75rem", color: "#999", marginLeft: "auto" }}>
                {fields.attorney_note.length} / 300
              </p>
            </div>
          </div>
        )}
      </div>

      {errors.form && (
        <p className="mt-4" style={{ color: "#c0392b", fontSize: "0.875rem" }}>{errors.form}</p>
      )}

      <p className="text-center mt-5 mb-5" style={{ fontSize: "0.82rem", color: "#999" }}>
        Your address is stored securely and used only to ship your plaque. We do not share it with anyone.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary-lg block w-full text-center mb-4"
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
      >
        {loading ? "Saving..." : isUpdate ? "Update address \u2192" : "Confirm address and continue \u2192"}
      </button>

      {!isUpdate && (
        <p className="text-center">
          <button
            type="button"
            onClick={handleSkip}
            style={{ fontSize: "0.875rem", color: "#999", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            I&apos;ll add this later
          </button>
        </p>
      )}
    </form>
  );
}
