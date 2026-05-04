"use client";

import { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Status = "idea" | "building" | "shipped";

type RoadmapItem = {
  id: string;
  title: string;
  notes: string;
  status: Status;
  category: string;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Shipped features (static record of what's live)
// ---------------------------------------------------------------------------

type ShippedFeature = {
  title: string;
  desc: string;
  tag: string;
};

const SHIPPED: ShippedFeature[] = [
  { title: "Memorial pages with full life story", desc: "Seven guided sections — roots, life built, people, beliefs, proudest moments, letter, and how to be remembered.", tag: "Core" },
  { title: "QR plaque integration", desc: "Every purchase gets a physical QR plaque that links to the memorial page permanently.", tag: "Core" },
  { title: "Photo upload", desc: "Profile photo stored in Supabase Storage and shown in the memorial header.", tag: "Core" },
  { title: "Page reading preference", desc: "He/His, She/Her, They/Their — sets pronouns throughout the memorial without using the word 'pronouns'.", tag: "UX" },
  { title: "Birth and death years", desc: "Optional year fields shown in the memorial header. Gracefully handles living, b. only, or full lifespan.", tag: "Core" },
  { title: "Report a Passing", desc: "Family members can add a death year from the public memorial page without logging in. Emails Scott on update.", tag: "Core" },
  { title: "Guestbook", desc: "Visitors can leave messages on any public memorial page. Shown in reverse chronological order.", tag: "Core" },
  { title: "Public / private toggle", desc: "Pages are private by default. Owner controls when to make them live.", tag: "Core" },
  { title: "Admin panel", desc: "Orders table, customer lookup, launch checklist, and this roadmap. Protected by role-based auth.", tag: "Admin" },
  { title: "Email notifications", desc: "Purchase confirmation, password setup, password reset, and passing notification — all via Resend.", tag: "Infra" },
  { title: "Name-based memorial slugs", desc: "Slugs generated from firstname-lastname at setup. Collision-safe. Never changed after creation (QR safety).", tag: "Infra" },
  { title: "Stripe checkout", desc: "One-time payment for page + plaque. Webhook-based fulfillment.", tag: "Infra" },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY   = "afterword-roadmap-v1";
const SEEDED_KEY    = "afterword-roadmap-seeded-v1";
const SEEDED_KEY_V2 = "afterword-roadmap-seeded-v2";
const SEEDED_KEY_V3 = "afterword-roadmap-seeded-v3";
const SEEDED_KEY_V4 = "afterword-roadmap-seeded-v4";
const SEEDED_KEY_V5 = "afterword-roadmap-seeded-v5";

// ---------------------------------------------------------------------------
// Default roadmap items (seeded once on first load)
// ---------------------------------------------------------------------------

const DEFAULT_ITEMS: Omit<RoadmapItem, "id">[] = [
  // ── Now ──────────────────────────────────────────────────────────────────
  {
    title: "Swap Stripe to live keys",
    notes: "Test keys are in place. Swap to live before launch (target: May 10). Update STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel env vars.",
    status: "building",
    category: "Infra",
    createdAt: "2026-05-02T00:00:00.000Z",
  },
  {
    title: "Gift flow — buy an Afterword for someone else",
    notes: "Identified as the highest-ceiling viral mechanic. Buyer pays, recipient gets an invite link to claim and build their own page. Keeps gifted Afterwords personal — the recipient writes it, not the buyer.\n\nKey decisions: does the buyer see the finished page? (Probably yes, if recipient chooses.) Does the recipient need to pay anything? (No — it's a gift.)\n\nTimeline: now / Q3 2026.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-02T00:01:00.000Z",
  },
  {
    title: "Open Graph meta tags on memorial pages",
    notes: "When a memorial URL is shared on WhatsApp, iMessage, Facebook, etc., it should show a rich preview: full name, years, and a short excerpt from their story. Currently shows nothing.\n\nUse Next.js generateMetadata() in app/memorial/[slug]/page.tsx.\n\nTimeline: launch checklist — do before going public.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-02T00:02:00.000Z",
  },
  {
    title: "Account deletion (GDPR / CCPA)",
    notes: "Legal exposure. Users must be able to delete their account and all associated data. Needs: profile, story_answers, guestbook_entries, contribution_invites, contributions, purchases.\n\nSupabase cascade deletes handle most of it if foreign keys are set with ON DELETE CASCADE. Need a confirmation flow and email receipt.\n\nTimeline: before launch — legal requirement.",
    status: "idea",
    category: "Infra",
    createdAt: "2026-05-02T00:03:00.000Z",
  },
  {
    title: "Terms of Service + Privacy Policy pages",
    notes: "Waiting on attorney review. Pages exist in the codebase as placeholders. Need final legal copy inserted and linked from footer, checkout, and signup.\n\nTimeline: before launch.",
    status: "building",
    category: "Infra",
    createdAt: "2026-05-02T00:04:00.000Z",
  },
  {
    title: "Share your page button on dashboard",
    notes: "Simple but high value. Once a page is published, the owner should be able to copy the memorial URL or share it directly. Currently they have to know to navigate to /memorial/their-slug.\n\nOne button, copy to clipboard, maybe native share sheet on mobile.\n\nTimeline: now — small build, high impact.",
    status: "idea",
    category: "UX",
    createdAt: "2026-05-02T00:05:00.000Z",
  },

  // ── Q3 2026 ──────────────────────────────────────────────────────────────
  {
    title: "Family linking — connect Afterwords post-contribution",
    notes: "When a contributor builds their own Afterword after contributing to someone else's, offer to link the two pages. No family tree UI — just a soft connection stored as a slug reference.\n\nThe prompt: 'You contributed to [Patrick's] Afterword. Would you like to link your pages? Family members who visit his page will be able to find yours.'\n\nThis is the family network virality mechanic. Each linked page extends the graph.\n\nTimeline: Q3 2026.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-02T00:06:00.000Z",
  },
  {
    title: "Talk-to-text for writing sections",
    notes: "Some users — especially older adults — would write more if they could speak instead of type. Browser Web Speech API is free and works without a server. Could add a microphone button to each question textarea.\n\nDecision: free feature if built, not an upsell. It removes friction for the core product.\n\nTimeline: Q3 2026.",
    status: "idea",
    category: "UX",
    createdAt: "2026-05-02T00:07:00.000Z",
  },
  {
    title: "Email / password change UI",
    notes: "Currently users have no self-serve way to update their email or password. Basic account hygiene — needed before scale.\n\nTimeline: Q3 2026.",
    status: "idea",
    category: "UX",
    createdAt: "2026-05-02T00:08:00.000Z",
  },

  // ── Q4 2026 ──────────────────────────────────────────────────────────────
  {
    title: "'Also in this family' section on memorial pages",
    notes: "Once family linking exists, show a small card grid at the bottom of memorial pages with linked family members. Each card shows name, relationship, and links to their memorial.\n\nNo family tree to build or maintain — the graph emerges from links.\n\nThis is the public-facing expression of the family network. It makes the memorial richer and gives visitors somewhere to go.\n\nTimeline: Q4 2026, after family linking ships.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-02T00:09:00.000Z",
  },
  {
    title: "Relationship graph storage",
    notes: "Technical foundation for family network. When someone accepts a contribution from a user who also has an Afterword, optionally record the user_id linkage as a foreign key.\n\nThis is the graph edge. No UI needed yet — just capture the data so it's queryable later for family linking and Legacy Tourism.\n\nTimeline: Q4 2026.",
    status: "idea",
    category: "Infra",
    createdAt: "2026-05-02T00:10:00.000Z",
  },

  // ── Q1 2027 ──────────────────────────────────────────────────────────────
  {
    title: "Memorial location field",
    notes: "Optional field on profiles: cemetery name, city, and GPS coordinates. Never required — only for people who want their page geographically anchored.\n\nThis is the data foundation for Legacy Tourism. A cemetery can only surface Afterwords for people buried there if those pages have a location attached.\n\nTimeline: Q1 2027.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-02T00:11:00.000Z",
  },
  {
    title: "Slug permanence warning",
    notes: "Memorial slugs like /memorial/patrick-faverty are printed on physical QR plaques. If a slug changes, every plaque that points to it breaks permanently.\n\nAdd a hard warning when someone tries to edit their memorial slug. Ideally make it impossible after the first QR is shipped.\n\nTimeline: Q1 2027 — before Legacy Tourism makes slugs even more critical.",
    status: "idea",
    category: "Infra",
    createdAt: "2026-05-02T00:12:00.000Z",
  },

  // ── Q2 2027 ──────────────────────────────────────────────────────────────
  {
    title: "First cemetery partnership MVP",
    notes: "One cemetery, treated as a case study. Offer: branded landing page for their cemetery, QR codes on existing grave markers that link to Afterwords of people buried there, simple directory of connected pages.\n\nPrice: $2,400/year ($200/month). Cheap enough to get a yes, meaningful enough to prove the model.\n\nThis is the first step toward Legacy Tourism as a recurring institutional revenue stream.\n\nTimeline: Q2 2027.",
    status: "idea",
    category: "Marketing",
    createdAt: "2026-05-02T00:13:00.000Z",
  },
  {
    title: "Branded cemetery directory page",
    notes: "A public-facing page for each cemetery partner: /cemetery/[slug]. Shows cemetery name, location, and a grid of Afterwords for people buried there (those who have opted in with a location field).\n\nVisitors arriving at the cemetery scan a marker → read a story → discover related pages → discover Afterword.\n\nTimeline: Q2 2027, alongside first cemetery partnership.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-02T00:14:00.000Z",
  },

];

// Default items added in v2 seed pass
const DEFAULT_ITEMS_V2: Omit<RoadmapItem, "id">[] = [
  // ── FAQ & Support ────────────────────────────────────────────────────────
  {
    title: "Pre-purchase FAQ page (/faq)",
    notes: "Statically written page targeting the 10–12 questions a prospect has before buying. The real objections aren't about features — they're about trust and permanence:\n\n• What happens to my Afterword after I die?\n• Can I edit it after I publish?\n• Who can see it? Can I keep it private?\n• What if the company shuts down?\n• Is this just an obituary?\n• Can I do this for someone who has already passed?\n• What does the QR plaque look like, and where would I put it?\n• Is $199 one-time or a subscription?\n• What if I'm not a good writer?\n\nMost important to get right: the shutdown question. Prospects in the legacy space are rightly worried about permanence. Answer it directly — PDF export always available, 12 months notice minimum.\n\nLink from homepage footer, pricing section, and checkout flow. Write the copy first, then build the page around it.\n\nTimeline: now — high conversion value, low build effort.",
    status: "idea",
    category: "Marketing",
    createdAt: "2026-05-02T00:17:00.000Z",
  },
  {
    title: "Post-purchase support page (/support)",
    notes: "Answers the questions a new owner has while building their Afterword:\n\n• How do I write something worth reading?\n• What if I skip a question — can I come back?\n• How do I invite family to see the page?\n• How do I change my photo?\n• When will my plaque arrive?\n• Can I give someone else access to help me write?\n\nDifferent tone to the FAQ — warmer, more coaching than objection-handling. The audience is already a customer; they just need confidence.\n\nSearchable list format is a reasonable starting point. Long-term, contextual inline help inside the dashboard (question mark tooltips) is better than a separate page.\n\nTimeline: Q3 2026 — after launch, once real support questions are coming in and patterns emerge.",
    status: "idea",
    category: "UX",
    createdAt: "2026-05-02T00:18:00.000Z",
  },
  {
    title: "Contextual inline help inside the writing flow",
    notes: "Small question mark tooltips or expandable hints inside the dashboard and section writing pages. Answers the question before the user has to go looking for it.\n\nExamples:\n• On the section list: 'Can I come back and edit this? Yes — your answers save automatically and you can edit any time.'\n• On the publish toggle: 'Who can see this? Only people with the exact link, until you share it.'\n• On the contribution nudge: 'What is this? You can invite someone you know to add a memory to your page.'\n\nHigher effort than a static support page but meaningfully reduces support emails and friction at key moments.\n\nTimeline: Q4 2026.",
    status: "idea",
    category: "UX",
    createdAt: "2026-05-02T00:19:00.000Z",
  },

  // ── 2028+ ─────────────────────────────────────────────────────────────────
  {
    title: "Geographic archive — Legacy Tourism platform",
    notes: "The full vision: a publicly navigable archive of self-authored lives, anchored to real places. Someone visits any cemetery, scans any QR, and can navigate through an entire family's Afterwords. Towns become walkable histories. Cemeteries become living archives.\n\nMonetisation: institutional licensing to cemeteries, municipalities, historical societies, and genealogy platforms. This is the recurring revenue layer on top of the consumer business.\n\nThe family network virality (contributions → links → 'also in this family') is the content engine. Legacy Tourism is the monetisation layer on top of it.\n\nTimeline: 2028+, once family network has meaningful density.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-02T00:15:00.000Z",
  },
  {
    title: "Institutional API — genealogy platform integration",
    notes: "At scale, Afterword's archive of self-authored stories is valuable to Ancestry, FindMyPast, MyHeritage, and similar platforms. An API that lets them surface Afterword pages alongside their records.\n\nPer-query or subscription pricing. This is the B2B2C layer — their users discover Afterword through the genealogy platforms they already use.\n\nTimeline: 2028+.",
    status: "idea",
    category: "Infra",
    createdAt: "2026-05-02T00:16:00.000Z",
  },
];

// Default items added in v3 seed pass — posthumous memorial mode
const DEFAULT_ITEMS_V3: Omit<RoadmapItem, "id">[] = [
  // ── Posthumous Memorial Mode ──────────────────────────────────────────────
  {
    title: "Posthumous memorial mode — purchase intent branching",
    notes: "The current product assumes the purchaser IS the subject. But a meaningful segment of buyers will be purchasing for someone who has already died — a spouse, parent, or grandparent.\n\nThese are different products with different emotional contexts, different question sets, and a completely different setup flow. The branching decision needs to happen early — ideally at checkout or the very first setup screen:\n\n'Who is this Afterword for?'\n→ Myself — I'm writing my own story\n→ Someone who has passed — I'm creating a memorial for them\n\nThis flag (e.g. is_posthumous boolean on profiles) controls everything downstream: question framing, setup flow, contributor invite copy, and eventual page display.\n\nTimeline: Q3 2026 — this is a second revenue stream on the same infrastructure. High priority.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-04T00:00:00.000Z",
  },
  {
    title: "Posthumous question set — third-person, biography-first",
    notes: "The current seven guided sections are written in the first person and require the subject to answer them. For a posthumous memorial, the purchaser (a family member) answers on behalf of the deceased — or leaves sections open for contributors to fill.\n\nThe question set needs to be redesigned for this mode:\n\n• 'Where did [Name] grow up? What do you know about their early life?' (vs. 'Where did you grow up?')\n• 'How would you describe the life they built — their work, their relationships, their defining choices?'\n• 'What do you know about what they believed? What mattered most to them?'\n• 'What moment are you most proud of them for?'\n• 'What do you want the world to know about them?'\n• 'What do you want people to feel when they leave this page?'\n\nThe letter section ('A letter to your family') likely becomes 'A letter from the family' — written by the purchaser to future visitors.\n\nThe purchaser's contribution seeds the page; contributors fill it out. Neither source needs to be complete for the page to be meaningful.\n\nTimeline: Q3 2026, ships with purchase intent branching.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-04T00:01:00.000Z",
  },
  {
    title: "Contributor-first setup flow for posthumous memorials",
    notes: "For a living author, the contribution nudge is a nice-to-have — the primary product is the author's own writing. For a posthumous memorial, contributions ARE the product. The purchaser may write very little; the page is built by everyone who loved the person.\n\nThe setup flow should reflect this:\n\n1. Enter the person's name, dates, and photo\n2. Answer a few seed questions (optional — but prompts the purchaser to share what they know)\n3. Immediately: 'Now invite the people who knew [Name] — their memories will become part of this page'\n4. Generate and share a contributor invite link — right here, step 3, not buried in the dashboard\n\nThe contributor invite UI should also surface how many people have been invited and how many have submitted. For a posthumous memorial, watching contributions come in IS the emotional experience of building the page.\n\nTimeline: Q3 2026.",
    status: "idea",
    category: "UX",
    createdAt: "2026-05-04T00:02:00.000Z",
  },
  {
    title: "Posthumous contributor invite — reframed copy and email",
    notes: "The current contributor invite says: 'You've been invited to add a memory to [Name]'s Afterword. [Name] is building their life story and wants your voice in it.'\n\nFor a posthumous memorial, that copy is wrong in two ways: the subject didn't invite them (a family member did), and the framing is wrong. The contributor knows the person has passed.\n\nThe posthumous framing:\n\n• Subject line: '[Family member]'s family is building a memorial for them — and wants your memories'\n• Body: '[Name] passed on [date]. Their [daughter/son/spouse] is creating a permanent page where the people who knew them can contribute memories that will live alongside their story. You're invited to share yours.'\n• CTA: 'Share a memory of [Name]'\n\nThe 10% discount mechanic still applies and still works — if anything, the emotional context makes it more likely they'll start their own Afterword after contributing to someone else's.\n\nTimeline: Q3 2026, ships with contributor-first setup flow.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-04T00:03:00.000Z",
  },
  {
    title: "Posthumous memorial page display — tribute-first layout",
    notes: "The current memorial page is structured around the author's own sections, with contributions shown at the bottom. For a posthumous memorial where contributions are the primary content, that hierarchy should flip or at least be balanced differently.\n\nConsiderations:\n\n• If the purchaser has answered seed questions, lead with those ('In [Name]'s family's words...')\n• Contributions are shown with equal weight — not as an afterthought at the bottom\n• The guestbook becomes even more prominent — a place for condolences and memories from people who weren't invited to contribute formally\n• The 'Report a Passing' feature is unnecessary — the page was created knowing the person has passed. The death year should be set at setup.\n• The page attribution ('This page was created by [Name]'s family in their memory') replaces 'written in their own words'\n\nThis may not require a completely separate page template — just conditional rendering based on the is_posthumous flag and who authored the content.\n\nTimeline: Q3/Q4 2026.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-04T00:04:00.000Z",
  },
];

// Default items added in v4 seed pass — obituary export + Legacy.com
// NOTE: The framing in this batch was corrected in v5. These items are superseded
// by the v5 items below. Delete v4 items from the roadmap UI.
const DEFAULT_ITEMS_V4: Omit<RoadmapItem, "id">[] = [];

// Default items added in v5 seed pass — corrected obituary + trusted contact model
const DEFAULT_ITEMS_V5: Omit<RoadmapItem, "id">[] = [
  {
    title: "Trusted contact designation ('Afterword Executor')",
    notes: "Every living Afterword author should be able to name one person — a spouse, adult child, close friend, or executor — who will have elevated access to their page when the time comes.\n\nThis person is not a contributor and not a co-author. They are a designated steward. Their role activates on death.\n\nWhat they can do once elevated access is granted:\n• Generate and download the obituary PDF with QR code\n• Set the page to public (if the author hadn't already)\n• Add or confirm the death year\n• Submit the obituary to Legacy.com (when that integration exists)\n• Invite additional contributors on the author's behalf\n\nHow elevated access is triggered:\n• The trusted contact uses a private link + confirmation code (set by the author at designation time)\n• OR a family member reports a passing via the existing 'Report a Passing' form — Scott confirms manually and elevates the trusted contact\n• The author could also pre-set 'publish after I pass' as an instruction tied to this contact\n\nThe designation UI:\n• A single field in the dashboard: 'Trusted contact email' + optional note ('This is my daughter Sarah')\n• On save, that person receives an email: '[Name] has named you as their Afterword contact. When the time comes, you will be able to manage their memorial page. No action needed right now.'\n• They don't need an account. The access is link-based.\n\nThis feature answers one of the most important questions a prospect has: 'What happens after I die — who takes care of it?' The trusted contact is the answer.\n\nTimeline: Q3 2026. Ships with or before the obituary generation feature.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-04T02:00:00.000Z",
  },
  {
    title: "Obituary generation from existing Afterword (living authors)",
    notes: "The author has already written their complete life story. This feature generates a conventional, print-ready obituary from that content — ready for the trusted contact to publish when the time comes.\n\nThis is not for posthumous purchases. The author wrote everything themselves. The obituary is a condensed, third-person version of what they already said, reformatted for newspaper submission.\n\nWhat the trusted contact sees when they activate:\n1. '[Name]'s Afterword is ready. Here is their obituary, generated from their own words.'\n2. A 300–400 word obituary in conventional format: full name, dates, life summary drawn from their sections, named family members from 'people who matter', and a closing line\n3. A QR code at the bottom linking to the full Afterword memorial page\n4. An editable textarea — they can adjust anything before downloading\n5. 'Download as PDF' — print-ready for newspapers, funeral programs, church bulletins\n\nThe QR code is the product's quiet masterstroke: every printed obituary becomes a permanent pointer back to the full, self-authored story. People who knew the person scan it and find everything they wrote. People who didn't know them discover Afterword.\n\nAI generation flow:\n• Input: all section answers + name, dates, referred_as\n• Prompt: write a conventional obituary (third person, ~350 words), preserving specific details and voice, not generic filler. End with 'Read [Name]'s full life story at [url].'\n• Model: Claude Haiku or equivalent — short, structured output, cost < $0.01 per generation\n• The author can also generate and review this themselves in advance — 'preview your obituary' — and save an approved draft for the trusted contact to use\n\nTimeline: Q3 2026.",
    status: "idea",
    category: "Core",
    createdAt: "2026-05-04T02:01:00.000Z",
  },
  {
    title: "Legacy.com integration — submit obituary directly from Afterword",
    notes: "Legacy.com powers the obituary sections of 1,500+ newspapers. When a family submits an obituary, it almost always flows through Legacy.com. If Afterword can submit directly from the trusted contact's dashboard, it removes the last remaining step between the Afterword and the world.\n\nThe flow:\n1. Trusted contact generates the obituary PDF inside Afterword\n2. They review and approve it\n3. 'Publish to Legacy.com' button — enters the Legacy.com submission fields pre-populated from Afterword data\n4. Obituary publishes to Legacy.com and affiliated newspapers\n5. The QR code in the obituary links back to the full Afterword memorial page\n\nEvery scan of that QR code is a grieving family member or old friend discovering that this person wrote their own story — and that they could too.\n\nLegacy.com technical path:\n• They have a publisher API primarily accessible to funeral homes and newspaper partners — research whether a third-party integration is possible, or whether Afterword needs a funeral home relationship as the access point\n• Alternative: a pre-filled form flow that opens Legacy.com's submission page with data passed via URL params, so the trusted contact just reviews and clicks submit — no API required\n\nThe partnership pitch:\nAfterword sends them the richest obituaries they've ever received — self-authored, fully detailed, with a permanent memorial page behind every QR code. Their readers engage more deeply. Their platform carries something no competitor offers.\n\nRisk: Legacy.com owns Tributes.com (a basic memorial page product). Position Afterword as a content creator, not a competitor — we own the story, they own the distribution.\n\nTimeline: Q4 2026 outreach + API research. Q1 2027 integration if terms are workable.",
    status: "idea",
    category: "Marketing",
    createdAt: "2026-05-04T02:02:00.000Z",
  },
  {
    title: "Funeral home channel — referral and co-branded obituary flow",
    notes: "Funeral homes are in the room when families are most likely to say yes to an Afterword. They handle the obituary, the service program, and increasingly the digital memorial.\n\nBut importantly: the Afterword pitch to funeral homes is not 'help families build memorial pages.' It's 'when a family has an Afterword, we make your job easier — here's the obituary, pre-written, with the QR code ready to go.'\n\nThe funeral home integration:\n• Funeral home refers living clients to Afterword ('Many families find it meaningful to write their own story while they can')\n• When a client passes, the funeral home contacts the trusted contact — who already has the obituary ready in Afterword\n• The funeral home submits it to Legacy.com through their existing workflow; the QR code is already embedded\n• Revenue share: 15–20% referral fee for living-author purchases driven by funeral home recommendation\n\nFirst step requires no technology: identify 2–3 independent funeral homes willing to pilot a referral link. Measure conversion. Then build co-branded tooling around what works.\n\nTimeline: Q1 2027 pilot. Formal channel program Q2 2027.",
    status: "idea",
    category: "Marketing",
    createdAt: "2026-05-04T02:03:00.000Z",
  },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; dot: string }> = {
  idea:     { label: "Idea",     color: "#666",    bg: "#F5F5F5", dot: "#ccc" },
  building: { label: "Building", color: "#C9932A", bg: "#FDF3DC", dot: "#C9932A" },
  shipped:  { label: "Shipped",  color: "#155724", bg: "#d4edda", dot: "#28a745" },
};

const CATEGORIES = ["Core", "UX", "Admin", "Infra", "Marketing", "Growth", "Legacy Tourism", "Other"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusPill({ status, onClick }: { status: Status; onClick?: () => void }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: "0.68rem",
        fontWeight: 700,
        padding: "2px 9px",
        borderRadius: 999,
        backgroundColor: cfg.bg,
        color: cfg.color,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FeatureRoadmap() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<Status>("idea");
  const [formCategory, setFormCategory] = useState("Core");

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage — seed defaults once per version
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const seededV1 = localStorage.getItem(SEEDED_KEY);
      const seededV2 = localStorage.getItem(SEEDED_KEY_V2);
      const seededV3 = localStorage.getItem(SEEDED_KEY_V3);
      const seededV4 = localStorage.getItem(SEEDED_KEY_V4);
      const seededV5 = localStorage.getItem(SEEDED_KEY_V5);

      let current: RoadmapItem[] = stored ? JSON.parse(stored) : [];

      function seedBatch(batch: Omit<RoadmapItem, "id">[]) {
        const newItems: RoadmapItem[] = batch.map((item) => ({
          ...item,
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 4),
        }));
        current = [...current, ...newItems];
      }

      if (!seededV1) {
        seedBatch(DEFAULT_ITEMS);
        localStorage.setItem(SEEDED_KEY, "1");
      }

      if (!seededV2) {
        seedBatch(DEFAULT_ITEMS_V2);
        localStorage.setItem(SEEDED_KEY_V2, "1");
      }

      if (!seededV3) {
        seedBatch(DEFAULT_ITEMS_V3);
        localStorage.setItem(SEEDED_KEY_V3, "1");
      }

      if (!seededV4) {
        seedBatch(DEFAULT_ITEMS_V4); // empty array — v4 framing was corrected in v5
        localStorage.setItem(SEEDED_KEY_V4, "1");
      }

      if (!seededV5) {
        seedBatch(DEFAULT_ITEMS_V5);
        localStorage.setItem(SEEDED_KEY_V5, "1");
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      setItems(current);
    } catch {}
  }, []);

  function persist(next: RoadmapItem[]) {
    setItems(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  function openAddForm() {
    setEditingId(null);
    setFormTitle("");
    setFormNotes("");
    setFormStatus("idea");
    setFormCategory("Core");
    setShowForm(true);
    setTimeout(() => titleInputRef.current?.focus(), 60);
  }

  function openEditForm(item: RoadmapItem) {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormNotes(item.notes);
    setFormStatus(item.status);
    setFormCategory(item.category);
    setShowForm(true);
    setTimeout(() => titleInputRef.current?.focus(), 60);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function saveForm() {
    if (!formTitle.trim()) return;

    if (editingId) {
      persist(items.map((i) =>
        i.id === editingId
          ? { ...i, title: formTitle.trim(), notes: formNotes.trim(), status: formStatus, category: formCategory }
          : i
      ));
    } else {
      const newItem: RoadmapItem = {
        id: uid(),
        title: formTitle.trim(),
        notes: formNotes.trim(),
        status: formStatus,
        category: formCategory,
        createdAt: new Date().toISOString(),
      };
      persist([newItem, ...items]);
    }
    setShowForm(false);
    setEditingId(null);
  }

  function cycleStatus(id: string) {
    const order: Status[] = ["idea", "building", "shipped"];
    persist(items.map((i) => {
      if (i.id !== id) return i;
      const next = order[(order.indexOf(i.status) + 1) % order.length];
      return { ...i, status: next };
    }));
  }

  function deleteItem(id: string) {
    if (!confirm("Remove this item from the roadmap?")) return;
    persist(items.filter((i) => i.id !== id));
  }

  const filtered = filterStatus === "all" ? items : items.filter((i) => i.status === filterStatus);
  const counts: Record<Status, number> = { idea: 0, building: 0, shipped: 0 };
  items.forEach((i) => counts[i.status]++);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #D6EAF4",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: "0.875rem",
    color: "#1A1A1A",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  };

  return (
    <div style={{ maxWidth: 820 }}>

      {/* ------------------------------------------------------------------ */}
      {/* Shipped features (static) */}
      {/* ------------------------------------------------------------------ */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
            What&rsquo;s live
          </h3>
          <span style={{ fontSize: "0.75rem", color: "#999" }}>{SHIPPED.length} features shipped</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {SHIPPED.map((f) => (
            <div
              key={f.title}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #E5E5E5",
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                gap: 10,
              }}
            >
              {/* Green check */}
              <div style={{
                flexShrink: 0,
                marginTop: 2,
                width: 18,
                height: 18,
                borderRadius: 4,
                backgroundColor: "#155724",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1A1A1A" }}>{f.title}</span>
                  <span style={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 999,
                    backgroundColor: "#EEF7FC",
                    color: "#2E7DA3",
                  }}>{f.tag}</span>
                </div>
                <div style={{ fontSize: "0.77rem", color: "#888", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "#E5E5E5", marginBottom: 36 }} />

      {/* ------------------------------------------------------------------ */}
      {/* Roadmap (dynamic) */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>
              Roadmap
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#999", margin: 0 }}>
              Track ideas, in-progress work, and shipped features. Click the status pill to cycle through states.
            </p>
          </div>
          <button
            onClick={openAddForm}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              backgroundColor: "#1B4F6B",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            + Add idea
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {(["all", "idea", "building", "shipped"] as const).map((f) => {
            const active = filterStatus === f;
            const label = f === "all" ? `All (${items.length})` : `${STATUS_CONFIG[f].label} (${counts[f]})`;
            return (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  border: active ? "2px solid #1B4F6B" : "1px solid #E5E5E5",
                  backgroundColor: active ? "#EEF7FC" : "#fff",
                  color: active ? "#1B4F6B" : "#888",
                  fontWeight: active ? 700 : 400,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <div
            style={{
              backgroundColor: "#F7FBFF",
              border: "1px solid #D6EAF4",
              borderRadius: 12,
              padding: "20px 22px",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1B4F6B", marginBottom: 14 }}>
              {editingId ? "Edit item" : "New idea"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Title */}
              <input
                ref={titleInputRef}
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveForm(); if (e.key === "Escape") cancelForm(); }}
                placeholder="Feature title"
                maxLength={120}
                style={inputStyle}
              />

              {/* Notes */}
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Notes, context, or why this matters (optional)"
                rows={3}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.55 }}
              />

              {/* Status + Category row */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: 5 }}>Status</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["idea", "building", "shipped"] as Status[]).map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      const sel = formStatus === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormStatus(s)}
                          style={{
                            flex: 1,
                            padding: "7px 0",
                            borderRadius: 7,
                            border: sel ? `2px solid ${cfg.dot}` : "1px solid #E5E5E5",
                            backgroundColor: sel ? cfg.bg : "#fff",
                            color: sel ? cfg.color : "#888",
                            fontWeight: sel ? 700 : 400,
                            fontSize: "0.78rem",
                            cursor: "pointer",
                          }}
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ width: 140 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: 5 }}>Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{ ...inputStyle, padding: "7px 10px" }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={saveForm}
                disabled={!formTitle.trim()}
                style={{
                  padding: "9px 20px",
                  borderRadius: 8,
                  backgroundColor: formTitle.trim() ? "#1B4F6B" : "#ccc",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: formTitle.trim() ? "pointer" : "default",
                }}
              >
                {editingId ? "Save changes" : "Add to roadmap"}
              </button>
              <button
                onClick={cancelForm}
                style={{
                  padding: "9px 18px",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  color: "#666",
                  border: "1px solid #E5E5E5",
                  fontWeight: 400,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items list */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#bbb", fontSize: "0.85rem" }}>
            {items.length === 0 ? "No ideas yet — add one above." : "No items match this filter."}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((item) => {
            const expanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E5E5",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    cursor: "pointer",
                  }}
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                >
                  {/* Status pill — click stops propagation so it cycles without toggling expand */}
                  <span onClick={(e) => { e.stopPropagation(); cycleStatus(item.id); }}>
                    <StatusPill status={item.status} onClick={() => {}} />
                  </span>

                  <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: 600, color: "#1A1A1A", minWidth: 0 }}>
                    {item.title}
                  </span>

                  {/* Category badge */}
                  <span style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "1px 7px",
                    borderRadius: 999,
                    backgroundColor: "#EEF7FC",
                    color: "#2E7DA3",
                    flexShrink: 0,
                  }}>
                    {item.category}
                  </span>

                  {/* Chevron */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ flexShrink: 0, transition: "transform 0.15s", transform: expanded ? "rotate(180deg)" : "none" }}
                  >
                    <path d="M3 5l4 4 4-4" stroke="#ccc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Expanded panel */}
                {expanded && (
                  <div style={{ padding: "0 14px 14px", borderTop: "1px solid #F0F0F0" }}>
                    {item.notes ? (
                      <p style={{ fontSize: "0.8rem", color: "#666", lineHeight: 1.6, margin: "12px 0 12px", whiteSpace: "pre-wrap" }}>
                        {item.notes}
                      </p>
                    ) : (
                      <p style={{ fontSize: "0.78rem", color: "#ccc", margin: "12px 0 12px", fontStyle: "italic" }}>
                        No notes added.
                      </p>
                    )}

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditForm(item); setExpandedId(null); }}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 7,
                          border: "1px solid #D6EAF4",
                          backgroundColor: "#EEF7FC",
                          color: "#1B4F6B",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 7,
                          border: "1px solid #FDDEDE",
                          backgroundColor: "#FFF5F5",
                          color: "#c0392b",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                      <span style={{ fontSize: "0.72rem", color: "#ccc", marginLeft: "auto" }}>
                        Added {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
