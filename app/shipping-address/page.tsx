import ShippingAddressForm from "./ShippingAddressForm";

export default function ShippingAddressPage() {
  return (
    <div
      className="min-h-screen flex items-start justify-center"
      style={{ backgroundColor: "#EEF7FC", paddingTop: "64px", paddingBottom: "96px" }}
    >
      <div
        className="w-full rounded-2xl p-10"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", maxWidth: "560px", margin: "0 24px" }}
      >
        <p className="text-center mb-5" style={{ fontSize: "0.875rem", color: "#999" }}>
          Step 2 of 2 &mdash; almost done
        </p>

        <h1
          className="font-serif mb-3"
          style={{ fontSize: "1.8rem", color: "#1B4F6B" }}
        >
          Where should we send your QR plaque?
        </h1>

        <p className="mb-7" style={{ fontSize: "0.95rem", color: "#666", lineHeight: "1.7" }}>
          Your weatherproof plaque will be shipped within 10 business days. You can send it to your home,
          or directly to your estate attorney or solicitor to hold for safekeeping.
        </p>

        <ShippingAddressForm />
      </div>
    </div>
  );
}
