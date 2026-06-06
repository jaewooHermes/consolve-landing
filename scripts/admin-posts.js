#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@libsql/client');

const postsPath = path.join(process.cwd(), 'data', 'posts.json');

function readJsonPosts() {
  try { return JSON.parse(fs.readFileSync(postsPath, 'utf8')); }
  catch { return []; }
}

function writeJsonPosts(posts) {
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2) + '\n', 'utf8');
}

function getArg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx === -1 ? null : process.argv[idx + 1] || null;
}

function now() { return new Date().toISOString(); }

function dbClient() {
  const url = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL;
  if (!url) return null;
  return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN });
}

async function ensureSchema(db) {
  if (!db) return;
  await db.batch([
    `CREATE TABLE IF NOT EXISTS posts (slug TEXT PRIMARY KEY, id TEXT, status TEXT NOT NULL, title TEXT NOT NULL, excerpt TEXT, target_keyword TEXT, published_at TEXT, updated_at TEXT, payload TEXT NOT NULL)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at)`,
  ]);
}

function fromRow(row) {
  const payload = JSON.parse(row.payload || '{}');
  return { ...payload, slug: row.slug, status: row.status, title: row.title, publishedAt: row.published_at ?? payload.publishedAt, updatedAt: row.updated_at ?? payload.updatedAt };
}

async function listPosts(status) {
  const db = dbClient();
  if (!db) return readJsonPosts().filter((post) => !status || post.status === status);
  await ensureSchema(db);
  const result = status
    ? await db.execute({ sql: "SELECT * FROM posts WHERE status = ? ORDER BY COALESCE(updated_at, published_at, '') DESC", args: [status] })
    : await db.execute("SELECT * FROM posts ORDER BY COALESCE(updated_at, published_at, '') DESC");
  return result.rows.map(fromRow);
}

async function savePost(post) {
  const db = dbClient();
  if (!db) {
    const posts = readJsonPosts();
    const idx = posts.findIndex((item) => item.slug === post.slug);
    if (idx === -1) posts.unshift(post); else posts[idx] = post;
    writeJsonPosts(posts);
    return;
  }
  await ensureSchema(db);
  await db.execute({
    sql: `INSERT INTO posts (slug, id, status, title, excerpt, target_keyword, published_at, updated_at, payload)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET id=excluded.id, status=excluded.status, title=excluded.title, excerpt=excluded.excerpt, target_keyword=excluded.target_keyword, published_at=excluded.published_at, updated_at=excluded.updated_at, payload=excluded.payload`,
    args: [post.slug, post.id || post.slug, post.status, post.title, post.excerpt || null, post.targetKeyword || null, post.publishedAt || null, post.updatedAt || null, JSON.stringify(post)],
  });
}

async function main() {
  const action = process.argv[2] || 'list';
  const slug = getArg('slug');
  const status = getArg('status');

  if (action === 'list') {
    const posts = await listPosts(status);
    for (const post of posts) console.log(`${String(post.status).padEnd(10)} ${String(post.slug).padEnd(44)} ${post.title}`);
    return;
  }

  if (!slug) throw new Error('--slug is required');
  const posts = await listPosts(null);
  const post = posts.find((item) => item.slug === slug);
  if (!post) throw new Error(`Post not found: ${slug}`);

  if (action === 'publish') {
    await savePost({ ...post, status: 'published', publishedAt: post.publishedAt || now(), updatedAt: now() });
    console.log(`published ${slug}`);
    return;
  }
  if (action === 'delete') {
    await savePost({ ...post, status: 'deleted', updatedAt: now() });
    console.log(`deleted ${slug}`);
    return;
  }
  throw new Error(`Unknown action: ${action}`);
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exit(1);
});
