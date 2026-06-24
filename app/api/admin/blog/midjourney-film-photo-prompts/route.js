import { getPostBySlugForAdmin, upsertPostPayload } from "../../../../../lib/cms";
import { promptArticleToPostPayload, PROMPT_ARTICLE_SLUG } from "../../../../../lib/prompt-article-adapter";
import { ARTICLE_CONTENT } from "../../../../blog/midjourney-film-photo-prompts/content";

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  try {
    const post = (await getPostBySlugForAdmin(PROMPT_ARTICLE_SLUG)) || promptArticleToPostPayload(ARTICLE_CONTENT);
    return json({ ok: true, post, fallback: !post.updatedAt });
  } catch (error) {
    return json({ ok: false, error: error.message || "글을 불러오지 못했습니다." }, error.status || 400);
  }
}

function parseFormPost(formData) {
  const rawJson = String(formData.get("contentJson") || "");
  if (!rawJson.trim()) {
    const error = new Error("contentJson이 비어 있습니다.");
    error.status = 400;
    throw error;
  }
  const payload = JSON.parse(rawJson);
  payload.slug = PROMPT_ARTICLE_SLUG;
  payload.title = String(formData.get("title") || payload.title || "").trim();
  payload.status = String(formData.get("status") || payload.status || "draft");
  payload.category = String(formData.get("category") || payload.category || "insight").trim() || "insight";
  payload.author = String(formData.get("author") || payload.author || "Consolve").trim() || "Consolve";
  payload.excerpt = String(formData.get("excerpt") || payload.excerpt || "").trim();
  payload.seoDescription = String(formData.get("description") || payload.seoDescription || payload.metaDescription || payload.excerpt || "").trim();
  if (payload.status === "published" && !payload.publishedAt) payload.publishedAt = new Date().toISOString();
  return { payload };
}

async function parseRequestBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return request.json();
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    return parseFormPost(await request.formData());
  }
  return request.json();
}

export async function POST(request) {
  try {
    const body = await parseRequestBody(request);
    const post = await upsertPostPayload(body, { slug: PROMPT_ARTICLE_SLUG, actor: "admin" });
    return json({ ok: true, slug: post.slug, updatedAt: post.updatedAt, files: [], storage: "db-json" });
  } catch (error) {
    return json({ ok: false, error: error.message || "저장 중 오류가 발생했습니다." }, error.status || 400);
  }
}
