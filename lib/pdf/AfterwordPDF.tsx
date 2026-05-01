import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PDFAnswer = {
  section_slug: string;
  question_id: string;
  answer_text: string;
};

export type PDFProfile = {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  referred_as: string | null;
  birth_year: number | null;
  death_year: number | null;
  memorial_slug: string | null;
};

// ---------------------------------------------------------------------------
// Section metadata — mirrors lib/sections.ts but inline for PDF context
// ---------------------------------------------------------------------------

const SECTION_META: {
  slug: string;
  label: string;
  questions: string[];
  isLetter?: boolean;
}[] = [
  { slug: "your-roots",               label: "Your Roots",                 questions: ["roots-q1","roots-q2","roots-q3","roots-q4"] },
  { slug: "the-life-you-built",        label: "The Life You Built",         questions: ["built-q1","built-q2","built-q3","built-q4"] },
  { slug: "the-people-who-matter",     label: "The People Who Matter",      questions: ["people-q1","people-q2","people-q3","people-q4"] },
  { slug: "what-you-believe",          label: "What You Believe",           questions: ["believe-q1","believe-q2","believe-q3","believe-q4"] },
  { slug: "your-proudest-moments",     label: "Your Proudest Moments",      questions: ["proud-q1","proud-q2","proud-q3"] },
  { slug: "a-letter-to-your-family",   label: "A Letter to Your Family",    questions: ["letter-q1","letter-q2","letter-q3"], isLetter: true },
  { slug: "how-you-want-to-be-remembered", label: "How You Want to Be Remembered", questions: ["remember-q1","remember-q2"] },
];

function getPronouns(referredAs: string | null) {
  if (referredAs === "he") return { subj: "he", obj: "him", poss: "his" };
  if (referredAs === "she") return { subj: "she", obj: "her", poss: "her" };
  return { subj: "they", obj: "them", poss: "their" };
}

function sectionIntro(slug: string, firstName: string, p: ReturnType<typeof getPronouns>): string {
  switch (slug) {
    case "your-roots":
      return `What follows are ${firstName}'s recollections about childhood, where ${p.subj} came from, ${p.poss} earliest memories, and the people who shaped ${p.obj}.`;
    case "the-life-you-built":
      return `This is ${firstName}'s account of the life ${p.subj} built, the work ${p.subj} did, the risks ${p.subj} took, the hardest chapters, and the moments ${p.subj} would return to if ${p.subj} could.`;
    case "the-people-who-matter":
      return `Here, ${firstName} speaks about the people who mattered most, those who loved ${p.obj}, shaped ${p.obj}, and who ${p.subj} most wanted to say something to.`;
    case "what-you-believe":
      return `What follows is ${firstName}'s hard-won wisdom, the things ${p.subj} learned about life, about people, and about what actually matters, that took a lifetime to arrive at.`;
    case "your-proudest-moments":
      return `These are the moments ${firstName} was most proud of, not by anyone else's measure, but by ${p.poss} own.`;
    case "how-you-want-to-be-remembered":
      return `What follows are ${firstName}'s words about how ${p.subj} wants to be remembered, written directly to the people who will one day read this page.`;
    default:
      return `In ${firstName}'s own words.`;
  }
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const DARK = "#0f2d3d";
const TEAL = "#1B4F6B";
const TEAL_LIGHT = "#2E7DA3";
const GOLD = "#C9932A";
const PAGE_BG = "#FAFAFA";
const WHITE = "#ffffff";

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAGE_BG,
    fontFamily: "Helvetica",
    paddingTop: 0,
    paddingBottom: 56,
    paddingHorizontal: 0,
    fontSize: 10,
  },

  // ── Cover ──────────────────────────────────────────────────────────────
  coverBand: {
    backgroundColor: DARK,
    paddingTop: 64,
    paddingBottom: 56,
    paddingHorizontal: 56,
    alignItems: "center",
  },
  coverWordmark: {
    color: WHITE,
    fontFamily: "Times-Roman",
    fontSize: 13,
    letterSpacing: 3,
    marginBottom: 32,
    opacity: 0.7,
  },
  coverAvatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1.5,
    marginBottom: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  coverAvatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    objectFit: "cover",
  },
  coverAvatarInitial: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Times-Roman",
    fontSize: 28,
  },
  coverName: {
    color: WHITE,
    fontFamily: "Times-Roman",
    fontSize: 26,
    marginBottom: 6,
    textAlign: "center",
  },
  coverYears: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginBottom: 6,
    textAlign: "center",
  },
  coverSubtitle: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 9,
    letterSpacing: 1,
    textAlign: "center",
  },

  // ── Body content area ──────────────────────────────────────────────────
  body: {
    paddingHorizontal: 56,
    paddingTop: 48,
  },

  // ── Section ────────────────────────────────────────────────────────────
  sectionContainer: {
    marginBottom: 36,
  },
  sectionLabel: {
    color: TEAL_LIGHT,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  sectionTitle: {
    color: TEAL,
    fontFamily: "Times-Roman",
    fontSize: 18,
    marginBottom: 10,
    borderBottomColor: "#D6EAF4",
    borderBottomWidth: 1.5,
    paddingBottom: 8,
  },
  sectionIntro: {
    color: TEAL,
    fontSize: 9,
    fontStyle: "italic",
    lineHeight: 1.7,
    marginBottom: 14,
    paddingLeft: 10,
    borderLeftColor: TEAL_LIGHT,
    borderLeftWidth: 2.5,
  },
  answerText: {
    color: "#1A1A1A",
    fontSize: 10.5,
    lineHeight: 1.85,
    marginBottom: 14,
  },

  // ── Letter section ─────────────────────────────────────────────────────
  letterCard: {
    backgroundColor: WHITE,
    borderRadius: 2,
    padding: "28 32",
    marginTop: 4,
  },
  letterIntro: {
    color: "#7A5C1E",
    fontSize: 9,
    fontStyle: "italic",
    lineHeight: 1.7,
    marginBottom: 20,
  },
  letterText: {
    fontFamily: "Courier",
    fontSize: 9.5,
    color: "#2a2a2a",
    lineHeight: 1.9,
    marginBottom: 16,
  },

  // ── Footer ─────────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 24,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerName: {
    color: "#bbb",
    fontSize: 8,
  },
  footerUrl: {
    color: "#bbb",
    fontSize: 8,
  },

  // ── Closing strip ──────────────────────────────────────────────────────
  closingStrip: {
    backgroundColor: DARK,
    paddingVertical: 28,
    paddingHorizontal: 56,
    alignItems: "center",
    marginTop: 12,
  },
  closingLine1: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 8,
    letterSpacing: 1,
    marginBottom: 4,
  },
  closingLine2: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 7.5,
  },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AfterwordPDF({
  profile,
  answers,
  appUrl,
  avatarBase64,
}: {
  profile: PDFProfile;
  answers: PDFAnswer[];
  appUrl: string;
  avatarBase64: string | null;
}) {
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Afterword";
  const firstName = profile.first_name ?? fullName;
  const initial = (profile.first_name?.[0] ?? fullName[0] ?? "?").toUpperCase();
  const pr = getPronouns(profile.referred_as);

  const yearsDisplay = (() => {
    if (profile.birth_year && profile.death_year) return `${profile.birth_year} – ${profile.death_year}`;
    if (profile.birth_year) return `b. ${profile.birth_year}`;
    if (profile.death_year) return `Passed ${profile.death_year}`;
    return null;
  })();

  const memorialUrl = profile.memorial_slug
    ? `${appUrl}/memorial/${profile.memorial_slug}`
    : appUrl;

  const answerMap: Record<string, string> = {};
  for (const a of answers) {
    if (a.answer_text) answerMap[a.question_id] = a.answer_text;
  }

  const sectionsWithContent = SECTION_META.filter((s) =>
    s.questions.some((qid) => answerMap[qid])
  );

  const generated = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <Document
      title={`${fullName} — Afterword`}
      author="Afterword"
      subject="A self-authored life story"
      creator="myafterword.co"
    >
      <Page size="A4" style={styles.page}>

        {/* ── Cover band ── */}
        <View style={styles.coverBand} fixed={false}>
          <Text style={styles.coverWordmark}>AFTERWORD</Text>

          {/* Avatar */}
          <View style={styles.coverAvatarRing}>
            {avatarBase64 ? (
              <Image src={avatarBase64} style={styles.coverAvatarImg} />
            ) : (
              <Text style={styles.coverAvatarInitial}>{initial}</Text>
            )}
          </View>

          <Text style={styles.coverName}>{fullName}</Text>
          {yearsDisplay && <Text style={styles.coverYears}>{yearsDisplay}</Text>}
          <Text style={styles.coverSubtitle}>
            Written in {pr.poss} own words
          </Text>
        </View>

        {/* ── Story sections ── */}
        <View style={styles.body}>
          {sectionsWithContent.map((section) => {
            const sectionAnswers = section.questions
              .map((qid) => answerMap[qid])
              .filter(Boolean) as string[];

            const isLetter = section.isLetter;

            return (
              <View key={section.slug} style={styles.sectionContainer} wrap={false}>
                <Text style={styles.sectionLabel}>{firstName}&rsquo;s story</Text>
                <Text style={styles.sectionTitle}>{section.label}</Text>

                {isLetter ? (
                  <>
                    <Text style={styles.letterIntro}>
                      {`What follows is ${firstName}'s letter to the people ${pr.subj} loves most. These are ${pr.poss} own words, written for those closest to ${pr.obj}.`}
                    </Text>
                    <View style={styles.letterCard}>
                      {sectionAnswers.map((text, i) => (
                        <Text key={i} style={styles.letterText}>{text}</Text>
                      ))}
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.sectionIntro}>
                      {sectionIntro(section.slug, firstName, pr)}
                    </Text>
                    {sectionAnswers.map((text, i) => (
                      <Text key={i} style={styles.answerText}>{text}</Text>
                    ))}
                  </>
                )}
              </View>
            );
          })}

          {/* Closing strip */}
          <View style={styles.closingStrip}>
            <Text style={styles.closingLine1}>myafterword.co</Text>
            <Text style={styles.closingLine2}>
              This Afterword was generated on {generated}
            </Text>
          </View>
        </View>

        {/* ── Per-page footer ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerName}>{fullName}</Text>
          <Text style={styles.footerUrl}>{memorialUrl}</Text>
        </View>

      </Page>
    </Document>
  );
}
