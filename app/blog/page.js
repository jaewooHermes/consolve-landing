import Link from "next/link";
import { listPublicPosts, formatDate } from "../../lib/cms";

export const metadata = {
  title: "Consolve Blog — 쇼핑몰·웹사이트·SEO 자동화 실무 노트",
  description: "쇼핑몰 운영자와 웹사이트 운영자를 위한 Google 우선 SEO, AI 검색 대응, 웹사이트 자동화 실무 노트입니다.",
  alternates: {
    canonical: "https://consolve.kr/blog",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await listPublicPosts();

  return (
    <main className="blog-shell">
      <header className="blog-hero">
        <Link className="blog-eyebrow" href="/">
          Consovle
        </Link>
        <p className="blog-kicker">Google 노출 → AI 답변 → 네이버 보완</p>
        <h1>쇼핑몰과 웹사이트 운영자를 위한 오가닉 성장 노트</h1>
        <p>
          CMS에서 발행 승인된 글만 공개됩니다. Google 노출을 먼저 만들고, AI 검색이 인용하기 쉬운 구조와 네이버 발견성을 차례로 보강합니다.
        </p>
      </header>

      <section className="blog-list" aria-label="발행된 블로그 글">
        {posts.length === 0 ? (
          <article className="blog-empty-card">
            <p>아직 발행 승인된 글이 없습니다.</p>
            <span>CMS에서 글을 published 상태로 변경하면 이곳에 표시됩니다.</span>
          </article>
        ) : (
          posts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <div className="blog-card-meta">
                <span>{post.targetKeyword || "SEO 자동화"}</span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </div>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <Link className="blog-read-link" href={`/blog/${post.slug}`} aria-label={`${post.title} 읽기`}>
                글 읽기 →
              </Link>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
