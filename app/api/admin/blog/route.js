import { listAllPostsForAdmin, upsertPostPayload } from "../../../../lib/cms";

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  try {
    const posts = await listAllPostsForAdmin();
    return json({
      ok: true,
      posts: posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        status: post.status,
        category: post.category,
        author: post.author,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
      })),
    });
  } catch (error) {
    return json({ ok: false, error: error.message || "목록을 불러오지 못했습니다." }, error.status || 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const slug = String(body.slug || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    if (!slug || slug.length < 3) {
      return json({ ok: false, error: "slug는 영문 소문자·숫자·하이픈 3자 이상이어야 합니다." }, 400);
    }
    const title = String(body.title || "").trim() || "새 블로그 글";
    const post = await upsertPostPayload(
      {
        payload: {
          schemaVersion: 1,
          slug,
          status: "draft",
          type: "article",
          category: String(body.category || "insight").trim() || "insight",
          title,
          excerpt: "요약을 입력하세요.",
          seoDescription: "SEO 설명을 입력하세요.",
          hero: { kind: "gradient", alt: title },
          content: { blocks: [{ type: "paragraph", text: "본문을 입력하세요." }] },
        },
      },
      { slug, actor: "admin" }
    );
    return json({ ok: true, slug: post.slug });
  } catch (error) {
    return json({ ok: false, error: error.message || "글을 만들지 못했습니다." }, error.status || 400);
  }
}
