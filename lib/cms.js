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

function safeParsePayload(value) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

export function normalizePostPayload(input = {}) {
  const payload = safeParsePayload(input.payload ? input.payload : input);
  const slug = input.slug || payload.slug || "";
  const status = input.status || payload.status || "draft";
  const publishedAt = input.published_at ?? input.publishedAt ?? payload.publishedAt ?? null;
  const updatedAt = input.updated_at ?? input.updatedAt ?? payload.updatedAt ?? null;
  const title = input.title || payload.title || "제목 없음";
  const excerpt = input.excerpt ?? payload.excerpt ?? payload.seoDescription ?? "";
  const targetKeyword = input.target_keyword ?? input.targetKeyword ?? payload.targetKeyword ?? null;
  const category = input.category || payload.category || payload.cat || "insight";
  const author = input.author || payload.author || payload.writer || DEFAULT_AUTHOR;

  return {
    ...payload,
    id: payload.id || input.id || slug,
    schemaVersion: payload.schemaVersion || 1,
    type: payload.type || "article",
    slug,
    status,
    category,
    title,
    excerpt,
    seoDescription: payload.seoDescription || payload.metaDescription || excerpt,
    targetKeyword,
    author,
    writer: payload.writer || author,
    publishedAt,
    updatedAt,
    hero: payload.hero || {},
    content: payload.content || (Array.isArray(payload.blocks) ? { blocks: payload.blocks } : payload.content),
    contentMarkdown: payload.contentMarkdown || payload.content_markdown || payload.markdown || "",
  };
}

function fromPostRow(row) {
  return normalizePostPayload(row);
}

export function isPublicPost(post) {
  return post?.status === "published" && Boolean(post.publishedAt);
}

export async function listPublicPosts() {
  const db = getDb();
  if (!db) {
    return readJsonPosts()
      .map(normalizePostPayload)
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
    return readJsonPosts().map(normalizePostPayload).find((post) => post.slug === slug && isPublicPost(post)) || null;
  }

  const result = await db.execute({
    sql: "SELECT * FROM posts WHERE slug = ? AND status = 'published' AND published_at IS NOT NULL LIMIT 1",
    args: [slug],
  });
  return result.rows[0] ? fromPostRow(result.rows[0]) : null;
}

export async function getPostBySlugForAdmin(slug) {
  const db = getDb();
  if (!db) {
    return readJsonPosts().map(normalizePostPayload).find((post) => post.slug === slug) || null;
  }
  await ensureBlogTables(db);
  const result = await db.execute({
    sql: "SELECT * FROM posts WHERE slug = ? LIMIT 1",
    args: [slug],
  });
  return result.rows[0] ? fromPostRow(result.rows[0]) : null;
}

export async function ensureBlogTables(db = getDb()) {
  if (!db) {
    const err = new Error("DB 환경변수 TURSO_DATABASE_URL 또는 LIBSQL_URL이 없어 저장할 수 없습니다.");
    err.status = 503;
    throw err;
  }
  await db.execute(`CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft',
    title TEXT NOT NULL,
    excerpt TEXT,
    target_keyword TEXT,
    published_at TEXT,
    updated_at TEXT NOT NULL,
    payload TEXT NOT NULL
  )`);
  await db.execute(`CREATE TABLE IF NOT EXISTS post_revisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    created_by TEXT
  )`);
  return db;
}

function assertString(value, label, maxLength = 5000) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label}을(를) 입력해 주세요.`);
  if (value.length > maxLength) throw new Error(`${label}은(는) ${maxLength}자 이하여야 합니다.`);
  return value.trim();
}

function validateImagePath(value, label) {
  if (!value) return "";
  const src = assertString(value, label, 1000);
  if (!(src.startsWith("/") || src.startsWith("https://"))) {
    throw new Error(`${label}은(는) / 로 시작하는 경로 또는 https:// URL이어야 합니다.`);
  }
  return src;
}

function validateBlocks(blocks) {
  if (!Array.isArray(blocks)) throw new Error("content.blocks 배열이 필요합니다.");
  if (blocks.length > 200) throw new Error("content.blocks 항목이 너무 많습니다.");
  const allowed = new Set(["paragraph", "heading", "callout", "quote", "list", "table", "code", "image", "promptGrid", "promptList"]);
  return blocks.map((block, index) => {
    if (!block || typeof block !== "object" || Array.isArray(block)) throw new Error(`blocks ${index + 1} 형식이 올바르지 않습니다.`);
    if (!allowed.has(block.type)) throw new Error(`지원하지 않는 block type입니다: ${block.type}`);
    if (block.type === "image") validateImagePath(block.src || block.image, `blocks ${index + 1} 이미지`);
    if ((block.type === "promptGrid" || block.type === "promptList") && Array.isArray(block.items)) {
      block.items.forEach((item, itemIndex) => {
        if (item.image) validateImagePath(item.image, `prompt ${itemIndex + 1} 이미지`);
        if (Array.isArray(item.images)) {
          item.images.forEach((image, imageIndex) => validateImagePath(typeof image === "string" ? image : image?.src, `prompt ${itemIndex + 1}-${imageIndex + 1} 이미지`));
        }
      });
    }
    return block;
  });
}

export function validatePostPayload(raw, expectedSlug = "") {
  const source = raw?.payload || raw?.article || raw;
  if (!source || typeof source !== "object" || Array.isArray(source)) throw new Error("블로그 JSON 객체가 필요합니다.");
  const slug = assertString(source.slug || expectedSlug, "slug", 160).replace(/[^a-z0-9-]/gi, "").toLowerCase();
  if (expectedSlug && slug !== expectedSlug) throw new Error(`slug가 URL과 다릅니다: ${slug} !== ${expectedSlug}`);
  const status = source.status || "draft";
  if (!["draft", "review", "published", "archived"].includes(status)) throw new Error("status는 draft/review/published/archived 중 하나여야 합니다.");
  const now = new Date().toISOString();
  const payload = normalizePostPayload({
    ...source,
    slug,
    status,
    title: assertString(source.title, "제목", 160),
    excerpt: assertString(source.excerpt || source.seoDescription, "요약", 500),
    seoDescription: assertString(source.seoDescription || source.excerpt, "SEO 설명", 500),
    author: source.author || DEFAULT_AUTHOR,
    publishedAt: status === "published" ? (source.publishedAt || now) : (source.publishedAt || null),
    updatedAt: now,
    content: {
      ...(source.content || {}),
      blocks: validateBlocks(source.content?.blocks || source.blocks || []),
    },
  });
  if (payload.hero?.image) validateImagePath(payload.hero.image, "hero.image");
  return payload;
}

export async function upsertPostPayload(rawPayload, { slug: expectedSlug = "", actor = "admin" } = {}) {
  const db = await ensureBlogTables();
  const payload = validatePostPayload(rawPayload, expectedSlug);
  const now = payload.updatedAt || new Date().toISOString();
  const existing = await db.execute({ sql: "SELECT payload FROM posts WHERE slug = ? LIMIT 1", args: [payload.slug] });
  if (existing.rows[0]?.payload) {
    await db.execute({
      sql: "INSERT INTO post_revisions (slug, payload, created_at, created_by) VALUES (?, ?, ?, ?)",
      args: [payload.slug, existing.rows[0].payload, now, actor],
    });
  }
  await db.execute({
    sql: `INSERT INTO posts (id, slug, status, title, excerpt, target_keyword, published_at, updated_at, payload)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(slug) DO UPDATE SET
            status = excluded.status,
            title = excluded.title,
            excerpt = excluded.excerpt,
            target_keyword = excluded.target_keyword,
            published_at = excluded.published_at,
            updated_at = excluded.updated_at,
            payload = excluded.payload`,
    args: [
      payload.id || payload.slug,
      payload.slug,
      payload.status,
      payload.title,
      payload.excerpt || null,
      payload.targetKeyword || null,
      payload.publishedAt || null,
      now,
      JSON.stringify(payload),
    ],
  });
  return payload;
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
