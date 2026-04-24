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

const posts: BlogPost[] = [
  fearOfBeingForgotten,
  yourStoryShouldntWait,
  rememberedVsReduced,
];

// Sorted newest first
export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
