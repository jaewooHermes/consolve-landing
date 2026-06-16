import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";

const POSTS_PATH = path.join(process.cwd(), "data", "posts.json");
const DEFAULT_AUTHOR = "Consolve 인사이트";

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

function readJsonPosts() {
  try {
    return JSON.parse(fs.readFileSync(POSTS_PATH, "utf8"));
  } catch {
    return [];
  }
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

export function isPublicPost(post) {
  return post?.status === "published" && Boolean(post.publishedAt);
}

export async function listPublicPosts() {
  const db = getDb();
  if (!db) {
    return readJsonPosts()
      .filter(isPublicPost)
      .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  }

  const result = await db.execute(
    "SELECT * FROM posts WHERE status = 'published' AND published_at IS NOT NULL ORDER BY published_at DESC"
  );
  return result.rows.map(fromPostRow);
}

export async function getPublicPostBySlug(slug) {
  const db = getDb();
  if (!db) {
    return readJsonPosts().find((post) => post.slug === slug && isPublicPost(post)) || null;
  }

  const result = await db.execute({
    sql: "SELECT * FROM posts WHERE slug = ? AND status = 'published' AND published_at IS NOT NULL LIMIT 1",
    args: [slug],
  });
  return result.rows[0] ? fromPostRow(result.rows[0]) : null;
}

export function formatDate(value) {
  if (!value) return "미발행";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function getPostAuthor(post) {
  return post?.author || post?.writer || DEFAULT_AUTHOR;
}
