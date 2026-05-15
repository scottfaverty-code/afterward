import LegalLayout from "@/app/components/LegalLayout";

export const metadata = { title: "Accessibility Statement — Afterword" };

export default function AccessibilityPage() {
  return (
    <LegalLayout title="Accessibility Statement" effectiveDate="May 1, 2026">
      <Section title="Our commitment">
        <p>Afterword is committed to making our Service accessible to people with disabilities. We believe everyone should be able to preserve and share stories with the people they love, regardless of ability.</p>
      </Section>

      <Section title="Standard">
        <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, published by the World Wide Web Consortium (W3C). WCAG 2.1 AA includes standards for perceivable, operable, understandable, and robust web content.</p>
      </Section>

      <Section title="Ongoing effort">
        <p>Accessibility is an ongoing effort. We:</p>
        <ul>
          <li>Include accessibility in the design and development of new features;</li>
          <li>Test with keyboard-only and screen-reader use in mind;</li>
          <li>Provide text alternatives for non-text content where feasible;</li>
          <li>Aim for sufficient color contrast and resizable text; and</li>
          <li>Review third-party tools we embed for accessibility impact.</li>
        </ul>
      </Section>

      <Section title="Known limitations">
        <p>Parts of the Service may not yet fully conform to WCAG 2.1 AA, including:</p>
        <ul>
          <li>User-uploaded audio or video that does not include captions or transcripts;</li>
          <li>Legacy pages or features that we are in the process of updating; and</li>
          <li>Third-party embedded content we do not control.</li>
        </ul>
        <p>We are working to reduce these limitations.</p>
      </Section>

      <Section title="Report an issue">
        <p>If you encounter an accessibility barrier on the Service, please tell us so we can fix it:</p>
        <ul>
          <li>Email: <a href="mailto:accessibility@myafterword.co">accessibility@myafterword.co</a></li>
          <li>Mail: 6545 Market Ave North, Suite 100, Canton, OH 44721</li>
        </ul>
        <p>Include: the page or feature where the issue occurred, the nature of the issue, the assistive technology or browser you are using, and your contact information.</p>
        <p>We aim to acknowledge accessibility requests within 5 business days and to respond substantively within 30 days.</p>
      </Section>

      <Section title="Alternatives">
        <p>If you cannot access a feature of the Service, contact <a href="mailto:support@myafterword.co">support@myafterword.co</a> and we will make reasonable efforts to provide the information or service to you through an alternative means.</p>
      </Section>
    </LegalLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1B4F6B", marginBottom: "12px" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>
    </div>
  );
}
