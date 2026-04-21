export type Question = {
  id: string;
  text: string;
  hint: string | null;
};

export type Section = {
  slug: string;
  label: string;
  number: number;
  intro: string;
  completion: string;
  questions: Question[];
  goldIntro?: boolean;
};

export const SECTIONS: Section[] = [
  {
    slug: "your-roots",
    label: "Your Roots",
    number: 1,
    intro:
      "We\u2019ll start at the very beginning, not with dates and facts, but with what it felt like. Take your time. There are no wrong answers here.",
    completion:
      "Your roots are recorded. These are the foundations that everything else in your story is built on, and now they\u2019ll be part of your page forever.",
    questions: [
      {
        id: "roots-q1",
        text: "Where were you born, and what do you know about what the world was like when you arrived?",
        hint: "The year, the place, the era, and anything about the circumstances of your birth that was passed down to you.",
      },
      {
        id: "roots-q2",
        text: "What\u2019s the earliest memory you can place a feeling on?",
        hint: "Not necessarily your first memory, the one that still carries an emotion when you recall it.",
      },
      {
        id: "roots-q3",
        text: "Describe the home you grew up in, not just what it looked like, but what it felt like.",
        hint: "The sounds, the smells, the mood of the place. What it felt like to come home.",
      },
      {
        id: "roots-q4",
        text: "Who were the most important people in your childhood, and what did each of them give you?",
        hint: "Parents, grandparents, siblings, neighbours, teachers, whoever shaped who you were becoming.",
      },
    ],
  },
  {
    slug: "the-life-you-built",
    label: "The Life You Built",
    number: 2,
    intro:
      "This section is about the chapters you chose, the work, the decisions, the turns in the road. Your life as you made it.",
    completion:
      "The life you built is something worth knowing about. These stories, the risks, the hard chapters, the moments you\u2019d return to, are the ones families hold on to longest.",
    questions: [
      {
        id: "built-q1",
        text: "Tell us about the work you\u2019ve done in your life. Of all of it, what are you most proud of?",
        hint: "This doesn\u2019t have to mean a career. It can be raising children, building something, caring for someone, or any work that felt meaningful.",
      },
      {
        id: "built-q2",
        text: "Tell us about a moment when you took a risk that changed the direction of your life.",
        hint: "The decision that felt uncertain at the time but turned out to define something important.",
      },
      {
        id: "built-q3",
        text: "What was the hardest chapter of your life, and what got you through it?",
        hint: "You don\u2019t need to share more than you\u2019re comfortable with. Even a brief answer here carries weight.",
      },
      {
        id: "built-q4",
        text: "If you could go back and spend one day in any period of your life, which would you choose, and why?",
        hint: "The answer often says more about what mattered to you than any list of achievements could.",
      },
    ],
  },
  {
    slug: "the-people-who-matter",
    label: "The People Who Matter",
    number: 3,
    intro:
      "Every life is shaped by its relationships. This section is about the people who made you who you are, and the ones you most want to say something to.",
    completion:
      "The relationships you\u2019ve described are at the heart of your story. These are the words the people you love will come back to most.",
    questions: [
      {
        id: "people-q1",
        text: "Who has loved you most in your life, and how did they show it?",
        hint: "This might be someone obvious. It might be someone surprising. Either way, they deserve to be named here.",
      },
      {
        id: "people-q2",
        text: "Is there someone you\u2019ve never properly thanked, someone whose impact on your life deserves to be acknowledged?",
        hint: "This is your chance. Write it here. They may never read it, but it belongs in your story.",
      },
      {
        id: "people-q3",
        text: "Who shaped you most, and what did they teach you that you still carry?",
        hint: "A parent, a mentor, a friend, a rival. The person whose influence you recognise in yourself most often.",
      },
      {
        id: "people-q4",
        text: "What do you want the people you love most to know about how much they\u2019ve meant to you?",
        hint: "The things that are sometimes hardest to say out loud are the most important things to leave behind.",
      },
    ],
  },
  {
    slug: "what-you-believe",
    label: "What You Believe",
    number: 4,
    intro:
      "This is the section where your wisdom lives. The things you\u2019ve learned, about life, about people, about what matters, that took decades to arrive at.",
    completion:
      "What you believe is one of the most valuable things you can leave behind. These aren\u2019t opinions, they\u2019re the distilled wisdom of a life actually lived.",
    questions: [
      {
        id: "believe-q1",
        text: "What do you know now that you wish you\u2019d known at 25?",
        hint: "The insight that came too late to be useful to you, but might still be useful to someone who comes after you.",
      },
      {
        id: "believe-q2",
        text: "What do you believe about the world or about life that most people around you don\u2019t share, or wouldn\u2019t say out loud?",
        hint: "The unconventional view. The hard-won perspective. The thing you\u2019ve stopped pretending you don\u2019t think.",
      },
      {
        id: "believe-q3",
        text: "What\u2019s one piece of advice you\u2019d give to every generation that comes after you?",
        hint: "Not a platitude, something specific, earned, and true for you.",
      },
      {
        id: "believe-q4",
        text: "What has been the greatest source of meaning in your life?",
        hint: "Not what you achieved, what made it feel worth it.",
      },
    ],
  },
  {
    slug: "your-proudest-moments",
    label: "Your Proudest Moments",
    number: 5,
    intro:
      "This is where you get to claim what you\u2019ve done. Not for anyone else\u2019s validation, just so it\u2019s recorded, and remembered.",
    completion:
      "These moments are yours. They belong on your page, and in the record of who you were.",
    questions: [
      {
        id: "proud-q1",
        text: "What\u2019s the achievement you\u2019re most proud of, the one that feels most truly yours?",
        hint: "Not necessarily the most impressive thing by outside standards. The one that took the most from you, or meant the most to you.",
      },
      {
        id: "proud-q2",
        text: "Tell us about a moment when you surprised yourself, when you did something you didn\u2019t know you were capable of.",
        hint: "A moment of unexpected courage, resilience, kindness, or skill.",
      },
      {
        id: "proud-q3",
        text: "Is there something you made, built, grew, or created that you want to be remembered for?",
        hint: "A business, a garden, a family, a piece of work, a community, anything you brought into existence that wouldn\u2019t exist without you.",
      },
    ],
  },
  {
    slug: "a-letter-to-your-family",
    label: "A Letter to Your Family",
    number: 6,
    intro:
      "This is the section most people find most meaningful, and most difficult. Take your time. There is no rush. What you write here is for the people who love you most.",
    completion:
      "What you\u2019ve written in this section is a gift that cannot be bought or replicated. It is the most personal thing on your page, and it will matter most to the people you love.",
    goldIntro: true,
    questions: [
      {
        id: "letter-q1",
        text: "If you could say one thing to each person you love, something you\u2019ve always meant to say but never quite found the words for, what would it be?",
        hint: "You can address people individually (\u201cTo my daughter Sarah\u2026\u201d) or write to everyone together. Either way is right.",
      },
      {
        id: "letter-q2",
        text: "What do you hope the people closest to you carry forward from knowing you?",
        hint: "Not what you want them to do, what you hope stays with them. The values, the habits, the way of seeing the world.",
      },
      {
        id: "letter-q3",
        text: "What do you want them to know about you that they might not already know?",
        hint: "The thing you never said. The feeling you assumed they knew but never confirmed. The story you always meant to tell.",
      },
    ],
  },
  {
    slug: "how-you-want-to-be-remembered",
    label: "How You Want to Be Remembered",
    number: 7,
    intro:
      "The final section. This is where you get to speak directly to the future, to people you may never meet, who will scan a QR code one day and want to know who you were.",
    completion: "", // Not used, redirects to /write/complete
    questions: [
      {
        id: "remember-q1",
        text: "When your grandchildren, or your grandchildren\u2019s children, read this page decades from now, what do you most want them to understand about who you were?",
        hint: "Not your accomplishments. Not your roles. The essence of you, the person behind the name and the dates.",
      },
      {
        id: "remember-q2",
        text: "Finish this sentence in whatever way feels true: \u201cThe thing I most want you to know is\u2026\u201d",
        hint: "This becomes the closing line of your Afterword page. Let it be honest.",
      },
    ],
  },
];

export function getSectionBySlug(slug: string): Section | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}

export function getNextSection(currentSlug: string): Section | undefined {
  const idx = SECTIONS.findIndex((s) => s.slug === currentSlug);
  return idx >= 0 ? SECTIONS[idx + 1] : undefined;
}
