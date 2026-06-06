#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@libsql/client');

const root = process.cwd();
const postsPath = path.join(root, 'data', 'posts.json');
const jobsPath = path.join(root, 'data', 'content-pipeline-jobs.json');

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch { return []; }
}

function getDb() {
  const url = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL;
  if (!url) throw new Error('TURSO_DATABASE_URL or LIBSQL_URL is required');
  return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN });
}

async function ensureSchema(db) {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS posts (slug TEXT PRIMARY KEY, id TEXT, status TEXT NOT NULL, title TEXT NOT NULL, excerpt TEXT, target_keyword TEXT, published_at TEXT, updated_at TEXT, payload TEXT NOT NULL)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at)`,
    `CREATE TABLE IF NOT EXISTS content_jobs (id TEXT PRIMARY KEY, keyword TEXT, project_name TEXT, status TEXT, post_slug TEXT, created_at TEXT, updated_at TEXT, payload TEXT NOT NULL)`,
    `CREATE INDEX IF NOT EXISTS idx_content_jobs_created ON content_jobs(created_at)`,
  ]);
}

async function main() {
  const db = getDb();
  await ensureSchema(db);
  const posts = readJson(postsPath);
  const jobs = readJson(jobsPath);
  for (const post of posts) {
    await db.execute({
      sql: `INSERT INTO posts (slug, id, status, title, excerpt, target_keyword, published_at, updated_at, payload)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET id=excluded.id, status=excluded.status, title=excluded.title, excerpt=excluded.excerpt, target_keyword=excluded.target_keyword, published_at=excluded.published_at, updated_at=excluded.updated_at, payload=excluded.payload`,
      args: [post.slug, post.id || post.slug, post.status, post.title, post.excerpt || null, post.targetKeyword || null, post.publishedAt || null, post.updatedAt || null, JSON.stringify(post)],
    });
  }
  for (const job of jobs) {
    await db.execute({
      sql: `INSERT INTO content_jobs (id, keyword, project_name, status, post_slug, created_at, updated_at, payload)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET keyword=excluded.keyword, project_name=excluded.project_name, status=excluded.status, post_slug=excluded.post_slug, created_at=excluded.created_at, updated_at=excluded.updated_at, payload=excluded.payload`,
      args: [job.id, job.keyword || null, job.projectName || null, job.status || null, job.postSlug || null, job.createdAt || null, job.updatedAt || null, JSON.stringify(job)],
    });
  }
  const postCount = await db.execute('SELECT COUNT(*) AS count FROM posts');
  const jobCount = await db.execute('SELECT COUNT(*) AS count FROM content_jobs');
  console.log(JSON.stringify({ ok: true, adapter: 'turso', seededPosts: posts.length, seededJobs: jobs.length, dbPosts: Number(postCount.rows[0].count), dbJobs: Number(jobCount.rows[0].count) }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
