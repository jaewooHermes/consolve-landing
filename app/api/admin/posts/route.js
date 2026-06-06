import { deletePost, publishPost, updatePost, upsertPost } from "../../../../lib/cms";

function parseJsonOrForm(request, text) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return JSON.parse(text || "{}");
  const params = new URLSearchParams(text || "");
  return Object.fromEntries(params.entries());
}

export async function POST(request) {
  let body;
  try {
    body = parseJsonOrForm(request, await request.text());
  } catch (error) {
    return Response.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const action = body.action;
  const slug = body.slug;
  if (!action) return Response.json({ ok: false, error: "action is required" }, { status: 400 });
  if (!slug && action !== "upsert") return Response.json({ ok: false, error: "slug is required" }, { status: 400 });

  try {
    if (action === "upsert") {
      if (!body.post) return Response.json({ ok: false, error: "post is required" }, { status: 400 });
      const persistence = await upsertPost(body.post);
      return Response.json({ ok: true, action, slug: body.post.slug, persistence });
    }

    if (action === "update") {
      const changes = {
        title: body.title,
        excerpt: body.excerpt,
        contentMarkdown: body.contentMarkdown,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        targetKeyword: body.targetKeyword,
      };
      Object.keys(changes).forEach((key) => changes[key] === undefined && delete changes[key]);
      const post = await updatePost(slug, changes);
      if (!post) return Response.json({ ok: false, error: "Post not found" }, { status: 404 });
      return Response.json({ ok: true, action, slug, post });
    }

    if (action === "publish") {
      const post = await publishPost(slug);
      if (!post) return Response.json({ ok: false, error: "Post not found" }, { status: 404 });
      return Response.json({ ok: true, action, slug, post });
    }

    if (action === "delete") {
      const post = await deletePost(slug);
      if (!post) return Response.json({ ok: false, error: "Post not found" }, { status: 404 });
      return Response.json({ ok: true, action, slug, post });
    }

    return Response.json({ ok: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (error) {
    return Response.json({ ok: false, error: error.message || "Admin post action failed" }, { status: 500 });
  }
}
