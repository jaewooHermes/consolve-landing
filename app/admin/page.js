import Link from "next/link";
import { listAllPosts, summarizePosts, formatDate, isPublicPost } from "../../lib/cms";

export const metadata = {
  title: "Consolve Admin — Content Routing Status",
  description: "seo-blog CRM에서 shared DB로 저장된 콘텐츠의 노출 상태 확인 화면",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const dynamic = "force-dynamic";

function statusLabel(post) {
  if (isPublicPost(post)) return "public";
  if (post.status === "deleted") return "deleted";
  return post.status || "hidden";
}

export default async function AdminPage() {
  const posts = await listAllPosts();
  const summary = await summarizePosts();

  return (
    <main className="admin-shell">
      <header className="admin-hero">
        <p className="blog-kicker">Routing Status · Read Only</p>
        <h1>Consolve 콘텐츠 라우팅 상태</h1>
        <p>
          콘텐츠 생성, 검토, 수정, 발행, 삭제 기능은 Consovle 사이트에서 제거했습니다. 새 콘텐츠는 seo-blog CRM이 shared DB에 published 상태로 저장하고, /blog는 DB의 공개 콘텐츠를 바로 읽습니다.
        </p>
        <div className="admin-actions">
          <Link href="/blog">공개 블로그 보기</Link>
          <Link href="/sitemap.xml">사이트맵 확인</Link>
          <Link href="/rss.xml">RSS 확인</Link>
        </div>
      </header>

      <section className="admin-grid" aria-label="블로그 상태 요약">
        <article>
          <span>Total</span>
          <strong>{summary.total}</strong>
        </article>
        <article>
          <span>Public</span>
          <strong>{summary.public}</strong>
        </article>
        <article>
          <span>Hidden</span>
          <strong>{summary.hidden}</strong>
        </article>
      </section>

      <section className="admin-panel" aria-label="콘텐츠 노출 상태">
        <h2>DB 콘텐츠 노출 상태</h2>
        <div className="admin-review-list">
          {posts.map((post) => {
            const publicPost = isPublicPost(post);
            return (
              <article key={post.id || post.slug} className="admin-review-card">
                <div className="admin-review-head">
                  <div>
                    <strong>{post.title}</strong>
                    <span>{post.slug}</span>
                  </div>
                  <div className="admin-post-meta">
                    <span className={publicPost ? "is-public" : "is-hidden"}>{statusLabel(post)}</span>
                    <span>{formatDate(post.publishedAt || post.updatedAt)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
