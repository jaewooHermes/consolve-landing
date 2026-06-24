import { NextResponse } from "next/server";
import { getPostBySlugForAdmin, upsertPostPayload } from "../../../../../lib/cms";

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const post = await getPostBySlugForAdmin(slug);
    if (!post) return json({ ok: false, error: "글을 찾지 못했습니다." }, 404);
    return json({ ok: true, post });
  } catch (error) {
    return json({ ok: false, error: error.message || "글을 불러오지 못했습니다." }, error.status || 400);
  }
}

function parseFormPost(formData, slug) {
  const rawJson = String(formData.get("contentJson") || "");
  if (!rawJson.trim()) {
    const error = new Error("contentJson이 비어 있습니다.");
    error.status = 400;
    throw error;
  }
  const payload = JSON.parse(rawJson);
  payload.slug = slug;
  payload.title = String(formData.get("title") || payload.title || "").trim();
  payload.status = String(formData.get("status") || payload.status || "draft");
  payload.category = String(formData.get("category") || payload.category || "insight").trim() || "insight";
  payload.author = String(formData.get("author") || payload.author || "Consolve").trim() || "Consolve";
  payload.writer = payload.author;
  payload.date = String(formData.get("date") || payload.date || "").trim();
  payload.eyebrow = String(formData.get("eyebrow") || payload.eyebrow || "").trim();
  payload.targetKeyword = String(formData.get("targetKeyword") || payload.targetKeyword || "").trim() || null;
  const heroImage = String(formData.get("heroImage") || payload.hero?.image || payload.hero?.src || "").trim();
  const heroAlt = String(formData.get("heroAlt") || payload.hero?.alt || payload.heroLabel || "").trim();
  payload.hero = { ...(payload.hero || {}) };
  if (heroImage) payload.hero.image = heroImage;
  else delete payload.hero.image;
  if (heroAlt) payload.hero.alt = heroAlt;
  payload.excerpt = String(formData.get("excerpt") || payload.excerpt || "").trim();
  payload.lead = String(formData.get("lead") || payload.lead || payload.excerpt || "").trim();
  payload.seoDescription = String(formData.get("description") || payload.seoDescription || payload.metaDescription || payload.excerpt || "").trim();
  if (payload.status === "published" && !payload.publishedAt) payload.publishedAt = new Date().toISOString();
  return { payload };
}

async function parseRequestBody(request, slug) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return request.json();
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    return parseFormPost(await request.formData(), slug);
  }
  return request.json();
}

function wantsHtml(request) {
  const accept = request.headers.get("accept") || "";
  const contentType = request.headers.get("content-type") || "";
  return !contentType.includes("application/json") && accept.includes("text/html");
}

function redirectToEditor(request, slug, params = {}) {
  const url = new URL(`/admin/blog/${encodeURIComponent(slug)}`, request.url);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request, { params }) {
  const { slug } = await params;
  try {
    const htmlSubmit = wantsHtml(request);
    const body = await parseRequestBody(request, slug);
    const post = await upsertPostPayload(body, { slug, actor: "admin" });
    if (htmlSubmit) return redirectToEditor(request, post.slug, { saved: "1" });
    return json({ ok: true, slug: post.slug, updatedAt: post.updatedAt, files: [], storage: "db-json" });
  } catch (error) {
    if (wantsHtml(request)) return redirectToEditor(request, slug, { error: error.message || "저장 중 오류가 발생했습니다." });
    return json({ ok: false, error: error.message || "저장 중 오류가 발생했습니다." }, error.status || 400);
  }
}
