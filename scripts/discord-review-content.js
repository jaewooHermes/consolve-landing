#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createClient } = require('@libsql/client');

const consolveRoot = process.cwd();
const defaultPipelineApp = process.env.BLOG_SEO_AUTOMATION_APP_DIR || '/workspace/blog-seo-automation/apps/web';
const defaultWikiRoot = process.env.BLOG_SEO_AUTOMATION_WIKI_ROOT || '/workspace/blog-seo-automation/LLM_WIKI';

function parseArgs(argv) {
  const out = { project: 'consolve', keyword: '', persist: true, extra: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--keyword') out.keyword = argv[++i];
    else if (arg === '--project' || arg === '--project-name') out.project = argv[++i];
    else if (arg === '--pipeline-app') out.pipelineApp = argv[++i];
    else if (arg === '--wiki-root') out.wikiRoot = argv[++i];
    else if (arg === '--ingest-slug') out.ingestSlug = argv[++i];
    else if (arg === '--no-persist') out.persist = false;
    else if (arg === '--serp-provider') out.serpProvider = argv[++i];
    else if (arg === '--no-wiki' || arg === '--no-deploy' || arg === '--no-auto-deploy') out.extra.push(arg);
    else out.extra.push(arg);
  }
  if (!out.keyword && !out.ingestSlug) throw new Error('--keyword is required unless --ingest-slug is provided');
  return out;
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function tursoUrl() {
  return process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || '';
}

function tursoAuthToken() {
  return process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN || undefined;
}

function getDb() {
  const url = tursoUrl();
  if (!url) return null;
  return createClient({ url, authToken: tursoAuthToken() });
}

async function ensureCmsSchema(db) {
  if (!db) return;
  await db.batch([
    `CREATE TABLE IF NOT EXISTS posts (slug TEXT PRIMARY KEY, id TEXT, status TEXT NOT NULL, title TEXT NOT NULL, excerpt TEXT, target_keyword TEXT, published_at TEXT, updated_at TEXT, payload TEXT NOT NULL)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at)`,
    `CREATE TABLE IF NOT EXISTS content_jobs (id TEXT PRIMARY KEY, keyword TEXT, project_name TEXT, status TEXT, post_slug TEXT, created_at TEXT, updated_at TEXT, payload TEXT NOT NULL)`,
    `CREATE INDEX IF NOT EXISTS idx_content_jobs_created ON content_jobs(created_at)`,
  ]);
}

function parseJsonResult(stdout) {
  const marker = 'JSON_RESULT_START';
  const idx = stdout.lastIndexOf(marker);
  if (idx === -1) throw new Error('Pipeline output did not include JSON_RESULT_START');
  return JSON.parse(stdout.slice(idx + marker.length).trim());
}

function runExistingPipeline(options) {
  const pipelineApp = path.resolve(options.pipelineApp || defaultPipelineApp);
  const script = path.join(pipelineApp, 'scripts', 'run-discord-content-command.js');
  if (!fs.existsSync(script)) throw new Error(`Pipeline script not found: ${script}`);

  const args = [script, '--project', options.project, '--keyword', options.keyword, '--no-deploy'];
  if (options.serpProvider) args.push('--serp-provider', options.serpProvider);
  args.push(...options.extra.filter(Boolean));

  const env = {
    ...process.env,
    LLM_WIKI_PATH: path.resolve(options.wikiRoot || defaultWikiRoot),
  };
  const result = spawnSync(process.execPath, args, {
    cwd: pipelineApp,
    env,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });

  if (result.status !== 0) {
    throw new Error(`blog-seo-automation pipeline failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return { stdout: result.stdout, stderr: result.stderr, json: parseJsonResult(result.stdout), pipelineApp };
}

function findGeneratedPost(pipelineApp, json) {
  const postsPath = path.join(pipelineApp, 'data', 'posts.json');
  const posts = readJson(postsPath, []);
  const slug = json.post && json.post.slug;
  const id = json.post && json.post.id;
  const post = posts.find((item) => (slug && item.slug === slug) || (id && item.id === id));
  if (!post) throw new Error(`Generated post not found in ${postsPath}: ${slug || id}`);
  return post;
}

function findSourcePostBySlug(pipelineApp, slug) {
  const postsPath = path.join(pipelineApp, 'data', 'posts.json');
  const posts = readJson(postsPath, []);
  const post = posts.find((item) => item.slug === slug);
  if (!post) throw new Error(`Source post not found in ${postsPath}: ${slug}`);
  return post;
}

function normalizeGeneratedPost(sourcePost, json, keyword) {
  const now = new Date().toISOString();
  return {
    ...sourcePost,
    id: `review_${sourcePost.id || sourcePost.slug}`,
    status: 'review',
    publishedAt: null,
    updatedAt: now,
    author: sourcePost.author || 'Consolve',
    projectName: 'consolve',
    targetKeyword: sourcePost.targetKeyword || keyword,
    source: 'blog-seo-automation',
    sourcePostId: sourcePost.id || null,
    sourceJobId: json.job?.id || null,
    sourceStatus: sourcePost.status || json.post?.status || null,
    reviewCreatedAt: now,
  };
}

async function persistToConsolve({ post, json, keyword }) {
  const job = {
    id: json.job?.id || `job_${Date.now()}`,
    keyword,
    projectName: 'consolve',
    source: 'discord-blog-seo-automation',
    status: 'ready_for_review',
    postSlug: post.slug,
    postStatus: post.status,
    sourcePostId: post.sourcePostId,
    createdAt: json.job?.createdAt || post.reviewCreatedAt,
    updatedAt: new Date().toISOString(),
    draftMarkdownPath: json.post?.draftMarkdownPath || json.draftMarkdown?.relativePath || null,
    wikiUpdate: json.wikiUpdate || null,
    deployUpdate: json.deployUpdate || null,
  };

  const db = getDb();
  if (db) {
    await ensureCmsSchema(db);
    await db.batch([
      {
        sql: `INSERT INTO posts (slug, id, status, title, excerpt, target_keyword, published_at, updated_at, payload)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(slug) DO UPDATE SET id = excluded.id, status = excluded.status, title = excluded.title, excerpt = excluded.excerpt, target_keyword = excluded.target_keyword, published_at = excluded.published_at, updated_at = excluded.updated_at, payload = excluded.payload`,
        args: [post.slug, post.id || post.slug, post.status, post.title, post.excerpt || null, post.targetKeyword || null, post.publishedAt || null, post.updatedAt || null, JSON.stringify(post)],
      },
      {
        sql: `INSERT INTO content_jobs (id, keyword, project_name, status, post_slug, created_at, updated_at, payload)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET keyword = excluded.keyword, project_name = excluded.project_name, status = excluded.status, post_slug = excluded.post_slug, created_at = excluded.created_at, updated_at = excluded.updated_at, payload = excluded.payload`,
        args: [job.id, job.keyword, job.projectName, job.status, job.postSlug, job.createdAt, job.updatedAt, JSON.stringify(job)],
      },
    ]);
    return { adapter: 'turso', postSlug: post.slug, job };
  }

  const postsPath = path.join(consolveRoot, 'data', 'posts.json');
  const jobsPath = path.join(consolveRoot, 'data', 'content-pipeline-jobs.json');

  const posts = readJson(postsPath, []);
  const withoutSameSlug = posts.filter((item) => item.slug !== post.slug);
  writeJson(postsPath, [post, ...withoutSameSlug]);

  const jobs = readJson(jobsPath, []);
  writeJson(jobsPath, [job, ...jobs.filter((item) => item.id !== job.id && item.postSlug !== post.slug)].slice(0, 100));

  return { adapter: 'json', postsPath, jobsPath, job };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const pipelineApp = path.resolve(options.pipelineApp || defaultPipelineApp);
  let sourcePost;
  let pipelineJson;

  if (options.ingestSlug) {
    sourcePost = findSourcePostBySlug(pipelineApp, options.ingestSlug);
    pipelineJson = {
      job: { id: `manual_ingest_${options.ingestSlug}`, createdAt: new Date().toISOString() },
      post: { id: sourcePost.id, slug: sourcePost.slug, status: sourcePost.status, draftMarkdownPath: sourcePost.draftMarkdownPath || null },
      wikiUpdate: { ok: false, skipped: true, reason: 'manual existing-content ingest' },
      deployUpdate: { ok: false, skipped: true, reason: 'manual existing-content ingest' },
    };
    if (!options.keyword) options.keyword = sourcePost.targetKeyword || sourcePost.keyword || sourcePost.title || options.ingestSlug;
  } else {
    const pipeline = runExistingPipeline(options);
    pipelineJson = pipeline.json;
    sourcePost = findGeneratedPost(pipeline.pipelineApp, pipeline.json);
  }

  const reviewPost = normalizeGeneratedPost(sourcePost, pipelineJson, options.keyword);
  const persistence = options.persist ? await persistToConsolve({ post: reviewPost, json: pipelineJson, keyword: options.keyword }) : null;

  const output = {
    ok: true,
    keyword: options.keyword,
    projectName: 'consolve',
    pipeline: 'blog-seo-automation',
    sourcePost: { id: sourcePost.id, slug: sourcePost.slug, status: sourcePost.status },
    cmsPost: { id: reviewPost.id, slug: reviewPost.slug, status: reviewPost.status, publishedAt: reviewPost.publishedAt },
    persistence,
    reviewUrl: 'https://consolve.kr/admin',
    publicUrlAfterApproval: `https://consolve.kr/blog/${reviewPost.slug}`,
  };

  console.log('콘텐츠 생성 완료 → Consovle CMS review 큐에 저장');
  console.log(`키워드: ${options.keyword}`);
  console.log(`CMS 상태: ${reviewPost.status}`);
  console.log(`검토: ${output.reviewUrl}`);
  console.log(`승인 후 공개 URL: ${output.publicUrlAfterApproval}`);
  console.log('\nJSON_RESULT_START');
  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(String(error && error.stack ? error.stack : error));
  process.exit(1);
});
