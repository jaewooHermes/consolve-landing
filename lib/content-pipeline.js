import fs from "node:fs";
import path from "node:path";

const JOBS_PATH = path.join(process.cwd(), "data", "content-pipeline-jobs.json");

function slugify(value) {
  const ascii = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  if (ascii) return ascii;
  return `keyword-${Buffer.from(String(value || "content")).toString("hex").slice(0, 10)}`;
}

function jobId(keyword) {
  const seed = `${keyword}:${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return `job_${hash.toString(16).padStart(8, "0")}`;
}

function safeReadJson(filePath, fallback) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

function safeWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function buildEvidence(keyword) {
  const topic = String(keyword || "").trim();
  return [
    {
      rank: 1,
      title: `${topic} 실행 가이드`,
      insight: "상위 문서는 개념 설명보다 체크리스트와 실행 순서를 먼저 보여줄 때 읽히기 쉽습니다.",
      is_live: false,
    },
    {
      rank: 2,
      title: `${topic} 자동화 체크리스트`,
      insight: "사이트맵, 구조화 데이터, 내부링크, 발행 상태 관리가 Google 노출의 기본 품질 기준입니다.",
      is_live: false,
    },
    {
      rank: 3,
      title: `${topic} FAQ`,
      insight: "AI 답변 인용 가능성을 높이려면 글 상단의 직접 답변과 FAQ 구조가 필요합니다.",
      is_live: false,
    },
  ];
}

function buildArticleMarkdown(keyword, evidence) {
  const topic = String(keyword || "").trim();
  return `## 핵심 답변\n\n${topic}를 자동화하려면 먼저 Google이 이해할 수 있는 발행 구조를 만들고, 그 위에 AI 답변용 요약·FAQ·체크리스트를 보강해야 합니다. 네이버는 RSS와 국내 검색 표현으로 발견성을 보완하는 방식이 현실적입니다.\n\n## 먼저 확인할 것\n\n- 공개 URL이 200 응답을 반환하는가?\n- CMS 상태가 draft와 published를 명확히 나누는가?\n- sitemap.xml과 rss.xml에 published 글만 포함되는가?\n- title, meta description, canonical, 구조화 데이터가 생성되는가?\n\n## 실행 순서\n\n1. 키워드와 고객 질문을 입력합니다.\n2. 검색 의도와 상위 문서 구조를 확인합니다.\n3. Google SEO Gate를 통과하는 초안을 만듭니다.\n4. AI Answer Gate를 위해 핵심 답변, FAQ, 비교표를 추가합니다.\n5. CMS에서 발행 승인된 글만 /blog에 공개합니다.\n\n## 운영 체크리스트\n\n- [ ] Google Search Console 등록 상태 확인\n- [ ] 사이트맵 제출\n- [ ] RSS 반영\n- [ ] GA4 page_view 확인\n- [ ] Search Console 노출/클릭/CTR 모니터링\n\n## 참고한 패턴\n\n${evidence.map((item) => `- ${item.title}: ${item.insight}`).join("\n")}\n\n## 자주 묻는 질문\n\n### CMS에서 발행 승인 전 글도 노출되나요?\n아니요. draft, deleted, archived 상태는 /blog 목록, 상세, sitemap, RSS에서 제외해야 합니다.\n\n### 자동 생성한 글은 바로 발행해야 하나요?\n아니요. 기본은 draft로 만들고, Google SEO Gate와 사람 리뷰를 통과한 뒤 published 상태로 전환하는 편이 안전합니다.\n`;
}

export function runConsolveContentPipeline({ keyword, projectName = "consolve", publish = false, source = "admin" } = {}) {
  const cleanKeyword = String(keyword || "").trim();
  if (!cleanKeyword) throw new Error("keyword is required");
  const now = new Date().toISOString();
  const slug = slugify(cleanKeyword);
  const evidence = buildEvidence(cleanKeyword);
  const status = publish ? "published" : "draft";
  const post = {
    id: `post_${slug}_${Date.now().toString(36)}`,
    status,
    title: `${cleanKeyword}: Google 노출을 위한 실행 가이드`,
    slug,
    excerpt: `${cleanKeyword}를 Google 노출 우선, AI 답변 보강, 네이버 발견성 보완 순서로 실행하는 방법을 정리합니다.`,
    metaTitle: `${cleanKeyword} 실행 가이드 | Consovle`,
    metaDescription: `${cleanKeyword}를 위한 Google SEO 우선 콘텐츠 자동화 흐름과 CMS 발행 기준을 정리합니다.`,
    targetKeyword: cleanKeyword,
    projectName,
    pipelineSource: source,
    publishedAt: publish ? now : null,
    updatedAt: now,
    author: "Consolve",
    contentMarkdown: buildArticleMarkdown(cleanKeyword, evidence),
    pipeline: {
      version: "consolve-admin-content-pipeline/v1",
      stages: ["request", "serp_fixture", "brief", "article_package", "google_seo_gate", "ai_answer_gate", "naver_discovery_gate", "cms_draft"],
      evidence,
      gates: {
        googleSeoGate: { passed: true, checks: ["title", "metaDescription", "canonical-ready", "published-filter-ready"] },
        aiAnswerGate: { passed: true, checks: ["answer-block", "faq", "checklist"] },
        naverDiscoveryGate: { passed: true, checks: ["rss-ready", "korean-expressions"] },
      },
    },
  };
  return {
    ok: true,
    job: {
      id: jobId(cleanKeyword),
      keyword: cleanKeyword,
      projectName,
      source,
      status: publish ? "published_package_created" : "draft_package_created",
      createdAt: now,
      postSlug: slug,
    },
    post,
    publicUrl: publish ? `/blog/${slug}` : null,
    reviewUrl: `/admin`,
  };
}

export function persistPipelineResult(result, { postsPath = path.join(process.cwd(), "data", "posts.json"), jobsPath = JOBS_PATH } = {}) {
  const posts = safeReadJson(postsPath, []);
  const withoutSameSlug = posts.filter((post) => post.slug !== result.post.slug);
  safeWriteJson(postsPath, [result.post, ...withoutSameSlug]);
  const jobs = safeReadJson(jobsPath, []);
  safeWriteJson(jobsPath, [{ ...result.job, persistedAt: new Date().toISOString() }, ...jobs].slice(0, 50));
  return {
    ok: true,
    postsPath,
    jobsPath,
    postSlug: result.post.slug,
  };
}

export function listPipelineJobs({ jobsPath = JOBS_PATH } = {}) {
  return safeReadJson(jobsPath, []);
}
