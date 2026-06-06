import fs from "node:fs";
import path from "node:path";

const LOCAL_POSTS_PATH = path.join(process.cwd(), "data", "posts.json");
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "jaewooHermes";
const REPO_NAME = process.env.GITHUB_REPO_NAME || "consolve-landing";
const REPO_BRANCH = process.env.GITHUB_REPO_BRANCH || "main";
const POSTS_REPO_PATH = process.env.POSTS_REPO_PATH || "data/posts.json";

function now() {
  return new Date().toISOString();
}

function normalizeInput(input) {
  return {
    action: String(input.action || "update"),
    slug: String(input.slug || "").trim(),
    title: String(input.title || "").trim(),
    excerpt: String(input.excerpt || "").trim(),
    contentMarkdown: String(input.contentMarkdown || ""),
  };
}

function mutatePosts(posts, input) {
  const index = posts.findIndex((post) => post.slug === input.slug);
  if (index === -1) throw new Error(`Post not found: ${input.slug}`);

  const current = posts[index];
  if (input.action === "publish") {
    posts[index] = {
      ...current,
      status: "published",
      publishedAt: current.publishedAt || now(),
      updatedAt: now(),
    };
    return posts;
  }

  if (input.action === "delete") {
    posts[index] = {
      ...current,
      status: "deleted",
      updatedAt: now(),
    };
    return posts;
  }

  if (input.action === "update") {
    posts[index] = {
      ...current,
      title: input.title || current.title,
      excerpt: input.excerpt,
      contentMarkdown: input.contentMarkdown,
      updatedAt: now(),
    };
    return posts;
  }

  throw new Error(`Unsupported action: ${input.action}`);
}

function readLocalPosts() {
  return JSON.parse(fs.readFileSync(LOCAL_POSTS_PATH, "utf8"));
}

function writeLocalPosts(posts) {
  fs.writeFileSync(LOCAL_POSTS_PATH, JSON.stringify(posts, null, 2) + "\n", "utf8");
}

async function githubRequest(url, options = {}) {
  const token = process.env.GITHUB_TOKEN_ORG || process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Missing GITHUB_TOKEN_ORG for GitHub-backed admin edits");
  const response = await fetch(url, {
    ...options,
    headers: {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Authorization": `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status}: ${text}`);
  }
  return response.json();
}

async function commitPostsToGitHub(posts, input) {
  const encodedPath = POSTS_REPO_PATH.split("/").map(encodeURIComponent).join("/");
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodedPath}?ref=${encodeURIComponent(REPO_BRANCH)}`;
  const current = await githubRequest(url);
  const content = Buffer.from(JSON.stringify(posts, null, 2) + "\n", "utf8").toString("base64");
  const message = `chore: ${input.action} blog post ${input.slug}`;
  const result = await githubRequest(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodedPath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content,
      sha: current.sha,
      branch: REPO_BRANCH,
    }),
  });
  return {
    ok: true,
    adapter: "github",
    commitSha: result.commit?.sha,
    commitUrl: result.commit?.html_url,
    note: "GitHub에 반영했습니다. Vercel 자동 Git 배포가 연결되지 않은 경우 별도 production deploy가 필요합니다.",
  };
}

async function applyPostAction(input) {
  if (!input.slug) throw new Error("slug is required");

  if (process.env.GITHUB_TOKEN_ORG || process.env.GITHUB_TOKEN) {
    const encodedPath = POSTS_REPO_PATH.split("/").map(encodeURIComponent).join("/");
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodedPath}?ref=${encodeURIComponent(REPO_BRANCH)}`;
    const file = await githubRequest(url);
    const posts = JSON.parse(Buffer.from(file.content || "", "base64").toString("utf8"));
    const nextPosts = mutatePosts(posts, input);
    return commitPostsToGitHub(nextPosts, input);
  }

  const posts = readLocalPosts();
  const nextPosts = mutatePosts(posts, input);
  writeLocalPosts(nextPosts);
  return { ok: true, adapter: "local", path: LOCAL_POSTS_PATH };
}

function resultHtml(result) {
  const escaped = JSON.stringify(result, null, 2)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Admin Post Result</title><style>body{font-family:ui-sans-serif,system-ui;background:#111;color:#f5f5f0;padding:32px;line-height:1.6}a{color:#b8c7ff}pre{white-space:pre-wrap;background:#1f1f1f;border:1px solid #333;border-radius:16px;padding:20px;overflow:auto}</style></head><body><h1>콘텐츠 관리 결과</h1><p><a href="/admin">← admin으로 돌아가기</a></p><pre>${escaped}</pre></body></html>`;
}

export async function POST(request) {
  const contentType = request.headers.get("content-type") || "";
  let raw = {};
  if (contentType.includes("application/json")) {
    raw = await request.json();
  } else {
    const form = await request.formData();
    raw = Object.fromEntries(form.entries());
  }

  try {
    const input = normalizeInput(raw);
    const persistence = await applyPostAction(input);
    const payload = { ok: true, action: input.action, slug: input.slug, persistence };
    if (contentType.includes("application/json")) return Response.json(payload);
    return new Response(resultHtml(payload), { headers: { "content-type": "text/html; charset=utf-8" } });
  } catch (error) {
    const payload = { ok: false, error: String(error && error.message ? error.message : error) };
    if (contentType.includes("application/json")) return Response.json(payload, { status: 400 });
    return new Response(resultHtml(payload), { status: 400, headers: { "content-type": "text/html; charset=utf-8" } });
  }
}
