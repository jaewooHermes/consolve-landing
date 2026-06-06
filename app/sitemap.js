import { listPublicPosts } from "../lib/cms";

export default async function sitemap() {
  const now = new Date();
  const posts = (await listPublicPosts()).map((post) => ({
    url: `https://consolve.kr/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://consolve.kr",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://consolve.kr/blog",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...posts,
  ];
}
