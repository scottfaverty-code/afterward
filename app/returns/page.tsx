import LegalLayout from "@/app/components/LegalLayout";

export const metadata = { title: "Returns & Refunds Policy — Afterword" };

export default function ReturnsPage() {
  return (
    <LegalLayout title="Returns & Refunds Policy" effectiveDate="[EFFECTIVE DATE]" draft>
      <p style={{ color: "#666", marginBottom: "36px" }}>
        This Returns &amp; Refunds Policy applies to physical products sold by Afterword (for example, QR plaques and keepsake cards). Digital subscriptions and service fees are governed by Section 17 of the <a href="/terms">Terms of Service</a>.
      </p>

      <Section n="1" title="Personalized keepsakes">
        <p>Afterword physical products are made to order and personalized for you. Because of this, we do not accept returns for buyer&rsquo;s-remorse reasons. Personalization includes QR codes linked to your account, custom text, selected materials, or any other to-order configuration.</p>
      </Section>

      <Section n="2" title="Defects and shipping errors">
        <p>If your product arrives defective, damaged, or incorrect, we will make it right. Contact <a href="mailto:support@myafterword.co">support@myafterword.co</a> within 30 days of delivery with:</p>
        <ul>
          <li>Your order number;</li>
          <li>A description of the issue; and</li>
          <li>Photographs of the product and packaging.</li>
        </ul>
        <p>Depending on the situation and at our option, we will:</p>
        <ul>
          <li>Replace the product at no cost to you;</li>
          <li>Refund the purchase price; or</li>
          <li>Provide store credit.</li>
        </ul>
      </Section>

      <Section n="3" title="Shipping damage">
        <p>If the package shows visible shipping damage at delivery, note the damage with the carrier if possible and contact <a href="mailto:support@myafterword.co">support@myafterword.co</a>. We will work with you and, where appropriate, file a claim with the carrier.</p>
      </Section>

      <Section n="4" title="Lost shipments">
        <p>If your order has not arrived within the delivery window shown at checkout, contact <a href="mailto:support@myafterword.co">support@myafterword.co</a>. We will investigate with the carrier and, if the shipment is lost, either reship or refund.</p>
      </Section>

      <Section n="5" title="Cancellations before production">
        <p>If you need to cancel an order, contact <a href="mailto:support@myafterword.co">support@myafterword.co</a> immediately. Because we begin personalization quickly, cancellation after production has started is not guaranteed. If production has not started, we will cancel and issue a full refund.</p>
      </Section>

      <Section n="6" title="How refunds are issued">
        <p>Refunds are issued to the original payment method. Please allow up to 10 business days for the refund to appear on your statement after we process it.</p>
      </Section>

      <Section n="7" title="Your statutory rights">
        <p>Nothing in this Policy limits any consumer-protection rights you have under applicable law that cannot be waived by contract.</p>
      </Section>

      <Section n="8" title="Contact">
        <ul>
          <li>Email: <a href="mailto:support@myafterword.co">support@myafterword.co</a></li>
          <li>Mail: 6545 Market Ave North, Suite 100, Canton, OH 44721</li>
        </ul>
      </Section>
    </LegalLayout>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1B4F6B", marginBottom: "12px" }}>{n}. {title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>
    </div>
  );
}
