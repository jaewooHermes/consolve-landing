const OWNER = "jaewooHermes";
const REPO = "consolve-landing";
const BRANCH = "main";
const ARTICLE_PATH = "app/blog/midjourney-film-photo-prompts/page.js";
const BLOG_INDEX_PATH = "app/blog/page.js";

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function cleanString(value, maxLength) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function validatePayload(body) {
  const title = cleanString(body.title, 80);
  const description = cleanString(body.description, 220);
  const lead = cleanString(body.lead, 260);
  const excerpt = cleanString(body.excerpt, 180);

  if (!title) throw new Error("제목을 입력해 주세요.");
  if (!description) throw new Error("SEO 설명을 입력해 주세요.");
  if (!lead) throw new Error("상단 리드 문장을 입력해 주세요.");
  if (!excerpt) throw new Error("블로그 목록 요약을 입력해 주세요.");

  return { title, description, lead, excerpt };
}

function escapeForDoubleQuotedJs(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, "\\n");
}

function replaceOnce(source, pattern, replacement, label) {
  const next = source.replace(pattern, replacement);
  if (next === source) {
    throw new Error(`${label} 위치를 찾지 못했습니다.`);
  }
  return next;
}

function updateArticleSource(source, fields) {
  const title = escapeForDoubleQuotedJs(fields.title);
  const description = escapeForDoubleQuotedJs(fields.description);
  const lead = escapeForDoubleQuotedJs(fields.lead);

  let next = source;
  next = replaceOnce(
    next,
    /title:\s*"[^"]*\| Consolve 블로그"/,
    `title: "${title} | Consolve 블로그"`,
    "metadata title"
  );
  next = replaceOnce(
    next,
    /description:\s*"[^"]*"/,
    `description: "${description}"`,
    "metadata description"
  );
  next = replaceOnce(
    next,
    /<h1>[^<]*<\/h1>/,
    `<h1>${title}</h1>`,
    "H1"
  );
  next = replaceOnce(
    next,
    /<p className="lead">[\s\S]*?<\/p>/,
    `<p className="lead">${lead}</p>`,
    "lead"
  );
  return next;
}

function updateBlogIndexSource(source, fields) {
  const title = escapeForDoubleQuotedJs(fields.title);
  const excerpt = escapeForDoubleQuotedJs(fields.excerpt);

  let next = source;
  next = replaceOnce(
    next,
    /title:\s*"[^"]*",\n\s*excerpt:\n\s*"[^"]*",/,
    `title: "${title}",\n  excerpt:\n    "${excerpt}",`,
    "blog card title/excerpt"
  );
  return next;
}

function token() {
  return process.env.GITHUB_TOKEN_ORG || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
}

async function githubRequest(path, options = {}) {
  const authToken = token();
  if (!authToken) {
    const err = new Error("서버 환경에 GitHub 토큰이 없어 저장할 수 없습니다.");
    err.status = 503;
    throw err;
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${authToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.message || `GitHub API 오류: ${response.status}`);
    err.status = response.status;
    throw err;
  }
  return data;
}

function decodeBase64(value) {
  return Buffer.from(value || "", "base64").toString("utf8");
}

function encodeBase64(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

async function getFile(filePath) {
  const data = await githubRequest(`/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`);
  return {
    sha: data.sha,
    content: decodeBase64(data.content),
  };
}

async function updateFile(filePath, sha, content, message) {
  return githubRequest(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: encodeBase64(content),
      sha,
      branch: BRANCH,
    }),
  });
}

export async function POST(request) {
  try {
    const fields = validatePayload(await request.json());
    const [articleFile, blogIndexFile] = await Promise.all([
      getFile(ARTICLE_PATH),
      getFile(BLOG_INDEX_PATH),
    ]);

    const articleContent = updateArticleSource(articleFile.content, fields);
    const blogIndexContent = updateBlogIndexSource(blogIndexFile.content, fields);

    if (articleContent === articleFile.content && blogIndexContent === blogIndexFile.content) {
      return json({ ok: true, unchanged: true });
    }

    const message = `chore: update blog article copy`;
    const articleUpdate = await updateFile(ARTICLE_PATH, articleFile.sha, articleContent, message);
    const blogIndexLatest = await getFile(BLOG_INDEX_PATH);
    const latestBlogIndexContent = updateBlogIndexSource(blogIndexLatest.content, fields);
    const indexUpdate = await updateFile(BLOG_INDEX_PATH, blogIndexLatest.sha, latestBlogIndexContent, message);

    return json({
      ok: true,
      commit: indexUpdate.commit?.sha || articleUpdate.commit?.sha || null,
      files: [ARTICLE_PATH, BLOG_INDEX_PATH],
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error: error.message || "저장 중 오류가 발생했습니다.",
      },
      error.status || 400
    );
  }
}
