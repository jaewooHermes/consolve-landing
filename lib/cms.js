import fs from "node:fs";
import path from "node:path";

const POSTS_PATH = path.join(process.cwd(), "data", "posts.json");
const PUBLIC_STATUSES = new Set(["published"]);
const BLOCKED_STATUSES = new Set(["draft", "deleted", "archived", "needs_google_seo_revision", "needs_ai_answer_revision", "needs_naver_discovery_revision"]);

function readPosts() {
  try {
    const raw = fs.readFileSync(POSTS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function normalizePost(post) {
  return {
    ...post,
    status: String(post.status || "draft"),
    title: String(post.title || "Untitled"),
    slug: String(post.slug || ""),
    excerpt: post.excerpt || "",
    metaTitle: post.metaTitle || post.title || "Consolve Blog",
    metaDescription: post.metaDescription || post.excerpt || "Consolve의 웹사이트, 쇼핑몰, SEO 자동화 실무 노트입니다.",
    contentMarkdown: post.contentMarkdown || "",
    publishedAt: post.publishedAt || null,
    updatedAt: post.updatedAt || post.publishedAt || null,
  };
}

export function isPublicPost(post) {
  const normalized = normalizePost(post);
  if (!normalized.slug) return false;
  if (BLOCKED_STATUSES.has(normalized.status)) return false;
  if (!PUBLIC_STATUSES.has(normalized.status)) return false;
  return Boolean(normalized.publishedAt);
}

export function listAllPosts() {
  return readPosts().map(normalizePost);
}

export function listPublicPosts() {
  return listAllPosts()
    .filter(isPublicPost)
    .sort((a, b) => String(b.publishedAt || b.updatedAt).localeCompare(String(a.publishedAt || a.updatedAt)));
}

export function summarizePosts() {
  return listAllPosts().reduce(
    (summary, post) => {
      summary.total += 1;
      summary.byStatus[post.status] = (summary.byStatus[post.status] || 0) + 1;
      if (isPublicPost(post)) summary.public += 1;
      else summary.hidden += 1;
      return summary;
    },
    { total: 0, public: 0, hidden: 0, byStatus: {} }
  );
}

export function getPublicPostBySlug(slug) {
  return listPublicPosts().find((post) => post.slug === slug) || null;
}

export function getAllPostSlugs() {
  return listAllPosts()
    .map((post) => post.slug)
    .filter(Boolean);
}

export function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}
