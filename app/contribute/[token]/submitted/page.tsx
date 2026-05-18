import Link from "next/link";

export default async function ContributeSubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; name?: string; ref?: string }>;
}) {
  const { code, name, ref } = await searchParams;
  const ownerFirstName = name ?? null;
  const discountCode = code ?? null;
  const referredAs = (ref === "he" || ref === "she") ? ref : "they";
  const pos = referredAs === "he" ? "his" : referredAs === "she" ? "her" : "their";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
  const checkoutUrl = discountCode
    ? `${appUrl}/checkout?code=${discountCode}`
    : `${appUrl}/checkout`;

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
          maxWidth: "560px",
          margin: "0 auto",
          padding: "64px 24px 80px",
          textAlign: "center",
        }}
      >
        {/* Checkmark */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#1B4F6B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
          }}
        >
          <span style={{ color: "#fff", fontSize: "1.75rem" }}>✓</span>
        </div>

        <h1
          className="font-serif mb-4"
          style={{ fontSize: "1.7rem", color: "#1B4F6B", lineHeight: "1.3" }}
        >
          Your memory has been submitted.
        </h1>

        <p style={{ fontSize: "0.95rem", color: "#666", lineHeight: "1.8", marginBottom: "8px" }}>
          {ownerFirstName
            ? <>{ownerFirstName} will see it shortly and can add it to {pos} page.</>
            : <>The person who invited you will see it shortly and can add it to their page.</>
          }
        </p>

        {/* Divider */}
        <div style={{ margin: "40px auto", width: "60px", height: "2px", backgroundColor: "#D6EAF4" }} />

        {/* The pitch */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "36px 32px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            textAlign: "left",
          }}
        >
          <p
            className="font-serif"
            style={{ fontSize: "1.2rem", color: "#1B4F6B", lineHeight: "1.5", marginBottom: "16px" }}
          >
            You just helped preserve {ownerFirstName ? `${ownerFirstName}'s` : "someone's"} story.
            Yours deserves the same.
          </p>

          <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: "1.8", marginBottom: "24px" }}>
            Afterword is a place to write your own life — in your own words, at your own pace,
            before it can only be told by others. The people who love you will be grateful you did.
          </p>

          {discountCode ? (
            <>
              <div
                style={{
                  backgroundColor: "#EEF7FC",
                  borderRadius: "10px",
                  padding: "18px 20px",
                  marginBottom: "20px",
                  border: "1px solid #D6EAF4",
                }}
              >
                <p style={{ fontSize: "0.75rem", color: "#2E7DA3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                  Your discount — because you took the time to be here
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#1B4F6B",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {discountCode}
                  </span>
                  <span
                    style={{
                      backgroundColor: "#1B4F6B",
                      color: "#fff",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    10% off
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "8px" }}>
                  Single use · expires in 30 days · applied automatically at checkout
                </p>
              </div>

              <a
                href={checkoutUrl}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  backgroundColor: "#1B4F6B",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "14px 24px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  marginBottom: "12px",
                }}
              >
                Start my Afterword — 10% off &rarr;
              </a>
            </>
          ) : (
            <a
              href={checkoutUrl}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                backgroundColor: "#1B4F6B",
                color: "#fff",
                borderRadius: "10px",
                padding: "14px 24px",
                fontSize: "0.95rem",
                fontWeight: 700,
                textDecoration: "none",
                marginBottom: "12px",
              }}
            >
              Start my Afterword &rarr;
            </a>
          )}

          <Link
            href="https://www.myafterword.co"
            style={{
              display: "block",
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#999",
              textDecoration: "underline",
            }}
          >
            Learn more first
          </Link>
        </div>
      </div>
    </div>
  );
}
