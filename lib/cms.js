import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";

const POSTS_PATH = path.join(process.cwd(), "data", "posts.json");
const DEFAULT_AUTHOR = "Consolve";

function tursoUrl() {
  return process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || "";
}

function tursoAuthToken() {
  return process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN || undefined;
}

export function isTursoEnabled() {
  return Boolean(tursoUrl());
}

function getDb() {
  const url = tursoUrl();
  if (!url) return null;
  return createClient({ url, authToken: tursoAuthToken() });
}

export async function ensureCmsSchema() {
  const db = getDb();
  if (!db) return { ok: true, adapter: "json" };
  await db.batch([
    `CREATE TABLE IF NOT EXISTS posts (
      slug TEXT PRIMARY KEY,
      id TEXT,
      status TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      target_keyword TEXT,
      published_at TEXT,
      updated_at TEXT,
      payload TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at)`,
    `CREATE TABLE IF NOT EXISTS content_jobs (
      id TEXT PRIMARY KEY,
      keyword TEXT,
      project_name TEXT,
      status TEXT,
      post_slug TEXT,
      created_at TEXT,
      updated_at TEXT,
      payload TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_content_jobs_created ON content_jobs(created_at)`,
  ]);
  return { ok: true, adapter: "turso" };
}

function readJsonPosts() {
  try {
    return JSON.parse(fs.readFileSync(POSTS_PATH, "utf8"));
  } catch {
    return [];
  }
}

function writeJsonPosts(posts) {
  fs.writeFileSync(POSTS_PATH, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
}

function fromPostRow(row) {
  const payload = JSON.parse(row.payload || "{}");
  return {
    ...payload,
    id: payload.id || row.id,
    slug: row.slug,
    status: row.status,
    title: row.title || payload.title,
    excerpt: row.excerpt ?? payload.excerpt,
    targetKeyword: row.target_keyword ?? payload.targetKeyword,
    publishedAt: row.published_at ?? payload.publishedAt ?? null,
    updatedAt: row.updated_at ?? payload.updatedAt,
  };
}

function normalizePost(post) {
  const updatedAt = post.updatedAt || new Date().toISOString();
  return {
    author: DEFAULT_AUTHOR,
    ...post,
    updatedAt,
    publishedAt: post.publishedAt || null,
  };
}

export function isPublicPost(post) {
  return post?.status === "published" && Boolean(post.publishedAt);
}

export async function listAllPosts() {
  const db = getDb();
  if (!db) {
    return readJsonPosts().sort((a, b) => String(b.updatedAt || b.publishedAt || "").localeCompare(String(a.updatedAt || a.publishedAt || "")));
  }
  await ensureCmsSchema();
  const result = await db.execute("SELECT * FROM posts ORDER BY COALESCE(updated_at, published_at, '') DESC");
  return result.rows.map(fromPostRow);
}

export async function listPublicPosts() {
  const db = getDb();
  if (!db) {
    return readJsonPosts()
      .filter(isPublicPost)
      .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  }
  await ensureCmsSchema();
  const result = await db.execute("SELECT * FROM posts WHERE status = 'published' AND published_at IS NOT NULL ORDER BY published_at DESC");
  return result.rows.map(fromPostRow);
}

export async function getPostBySlug(slug) {
  const db = getDb();
  if (!db) return readJsonPosts().find((post) => post.slug === slug) || null;
  await ensureCmsSchema();
  const result = await db.execute({ sql: "SELECT * FROM posts WHERE slug = ? LIMIT 1", args: [slug] });
  return result.rows[0] ? fromPostRow(result.rows[0]) : null;
}

export async function getPublicPostBySlug(slug) {
  const post = await getPostBySlug(slug);
  return isPublicPost(post) ? post : null;
}

export async function upsertPost(post) {
  const normalized = normalizePost(post);
  const db = getDb();
  if (!db) {
    const posts = readJsonPosts();
    const index = posts.findIndex((item) => item.slug === normalized.slug);
    if (index === -1) posts.unshift(normalized);
    else posts[index] = { ...posts[index], ...normalized };
    writeJsonPosts(posts);
    return { ok: true, adapter: "json", slug: normalized.slug };
  }
  await ensureCmsSchema();
  await db.execute({
    sql: `INSERT INTO posts (slug, id, status, title, excerpt, target_keyword, published_at, updated_at, payload)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        id = excluded.id,
        status = excluded.status,
        title = excluded.title,
        excerpt = excluded.excerpt,
        target_keyword = excluded.target_keyword,
        published_at = excluded.published_at,
        updated_at = excluded.updated_at,
        payload = excluded.payload`,
    args: [
      normalized.slug,
      normalized.id || normalized.slug,
      normalized.status,
      normalized.title,
      normalized.excerpt || null,
      normalized.targetKeyword || null,
      normalized.publishedAt || null,
      normalized.updatedAt || null,
      JSON.stringify(normalized),
    ],
  });
  return { ok: true, adapter: "turso", slug: normalized.slug };
}

export async function updatePost(slug, changes) {
  const post = await getPostBySlug(slug);
  if (!post) return null;
  const next = normalizePost({ ...post, ...changes, updatedAt: new Date().toISOString() });
  await upsertPost(next);
  return next;
}

export async function publishPost(slug) {
  const post = await getPostBySlug(slug);
  if (!post) return null;
  const now = new Date().toISOString();
  return updatePost(slug, { status: "published", publishedAt: post.publishedAt || now, updatedAt: now });
}

export async function deletePost(slug) {
  const now = new Date().toISOString();
  return updatePost(slug, { status: "deleted", updatedAt: now });
}

export async function summarizePosts() {
  const posts = await listAllPosts();
  const byStatus = posts.reduce((acc, post) => {
    const key = post.status || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const publicCount = posts.filter(isPublicPost).length;
  return {
    total: posts.length,
    public: publicCount,
    hidden: posts.length - publicCount,
    byStatus,
    adapter: isTursoEnabled() ? "turso" : "json",
  };
}

export async function seedPosts(posts = readJsonPosts()) {
  await ensureCmsSchema();
  for (const post of posts) await upsertPost(post);
  return { ok: true, count: posts.length, adapter: isTursoEnabled() ? "turso" : "json" };
}

export function formatDate(value) {
  if (!value) return "미발행";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
