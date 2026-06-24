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

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const post = await upsertPostPayload(body, { slug, actor: "admin" });
    return json({ ok: true, slug: post.slug, updatedAt: post.updatedAt, files: [], storage: "db-json" });
  } catch (error) {
    return json({ ok: false, error: error.message || "저장 중 오류가 발생했습니다." }, error.status || 400);
  }
}
