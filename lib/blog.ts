export type BlogPost = {
  slug: string;
  title: string;
  date: string;       // ISO yyyy-mm-dd
  excerpt: string;
  content: string;    // Markdown
};

// Registry, add a new import here each time you publish a post
import fearOfBeingForgotten from "@/content/blog/fear-of-being-forgotten";
import yourStoryShouldntWait from "@/content/blog/your-story-shouldnt-wait";
import rememberedVsReduced from "@/content/blog/remembered-vs-reduced";
import yourLoveStoryDeservesToLast from "@/content/blog/your-love-story-deserves-to-last";
import legacyIsntAboutPerfection from "@/content/blog/legacy-isnt-about-perfection";
import sciencePsychologyFearForgotten from "@/content/blog/science-psychology-fear-forgotten";
import recordYourLifeStory from "@/content/blog/record-your-life-story-30-minutes-a-week";

const posts: BlogPost[] = [
  fearOfBeingForgotten,
  yourStoryShouldntWait,
  rememberedVsReduced,
  yourLoveStoryDeservesToLast,
  legacyIsntAboutPerfection,
  sciencePsychologyFearForgotten,
  recordYourLifeStory,
];

// Sorted newest first
export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
