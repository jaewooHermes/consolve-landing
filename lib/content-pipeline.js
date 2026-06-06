import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { ensureCmsSchema, isTursoEnabled } from "./cms";

const JOBS_PATH = path.join(process.cwd(), "data", "content-pipeline-jobs.json");

function tursoUrl() {
  return process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || "";
}

function tursoAuthToken() {
  return process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN || undefined;
}

function getDb() {
  const url = tursoUrl();
  if (!url) return null;
  return createClient({ url, authToken: tursoAuthToken() });
}

function safeReadJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function fromJobRow(row) {
  const payload = JSON.parse(row.payload || "{}");
  return {
    ...payload,
    id: row.id || payload.id,
    keyword: row.keyword ?? payload.keyword,
    projectName: row.project_name ?? payload.projectName,
    status: row.status ?? payload.status,
    postSlug: row.post_slug ?? payload.postSlug,
    createdAt: row.created_at ?? payload.createdAt,
    updatedAt: row.updated_at ?? payload.updatedAt,
  };
}

export async function listPipelineJobs() {
  const db = getDb();
  if (!db) return safeReadJson(JOBS_PATH, []);
  await ensureCmsSchema();
  const result = await db.execute("SELECT * FROM content_jobs ORDER BY COALESCE(created_at, updated_at, '') DESC LIMIT 100");
  return result.rows.map(fromJobRow);
}

export async function upsertPipelineJob(job) {
  const db = getDb();
  if (!db) {
    const jobs = safeReadJson(JOBS_PATH, []);
    fs.writeFileSync(JOBS_PATH, `${JSON.stringify([job, ...jobs.filter((item) => item.id !== job.id && item.postSlug !== job.postSlug)].slice(0, 100), null, 2)}\n`, "utf8");
    return { ok: true, adapter: "json", id: job.id };
  }
  await ensureCmsSchema();
  await db.execute({
    sql: `INSERT INTO content_jobs (id, keyword, project_name, status, post_slug, created_at, updated_at, payload)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        keyword = excluded.keyword,
        project_name = excluded.project_name,
        status = excluded.status,
        post_slug = excluded.post_slug,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at,
        payload = excluded.payload`,
    args: [job.id, job.keyword || null, job.projectName || null, job.status || null, job.postSlug || null, job.createdAt || null, job.updatedAt || null, JSON.stringify(job)],
  });
  return { ok: true, adapter: "turso", id: job.id };
}

export async function seedPipelineJobs(jobs = safeReadJson(JOBS_PATH, [])) {
  for (const job of jobs) await upsertPipelineJob(job);
  return { ok: true, count: jobs.length, adapter: isTursoEnabled() ? "turso" : "json" };
}
