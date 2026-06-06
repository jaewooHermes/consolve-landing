import { listPublicPosts } from "../../lib/cms";

function escapeXml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await listPublicPosts();
  const items = posts
    .map(
      (post) => `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>https://consolve.kr/blog/${escapeXml(post.slug)}</link>
          <guid>https://consolve.kr/blog/${escapeXml(post.slug)}</guid>
          <description>${escapeXml(post.excerpt)}</description>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
        </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Consolve Blog</title>
        <link>https://consolve.kr/blog</link>
        <description>쇼핑몰과 웹사이트 운영자를 위한 Google SEO, AI 검색, 자동화 실무 노트</description>
        <language>ko-KR</language>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
