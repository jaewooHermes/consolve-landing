import Link from "next/link";
import { listAllPosts, summarizePosts, formatDate, isPublicPost } from "../../lib/cms";
import { listPipelineJobs } from "../../lib/content-pipeline";

export const metadata = {
  title: "Consolve Admin — Review & Publish",
  description: "Discord에서 생성된 Consovle 블로그 콘텐츠의 검토, 수정, 발행, 삭제 관리",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const dynamic = "force-dynamic";

const commands = [
  {
    label: "발행 글 확인",
    command: "npm run admin:posts -- --status published",
    note: "published 상태와 publishedAt이 있는 글만 /blog, sitemap, RSS에 노출됩니다.",
  },
  {
    label: "검토 초안 확인",
    command: "npm run admin:posts -- --status draft",
    note: "Discord로 생성된 draft/review 글을 검토합니다. admin에서 새 키워드 생성은 하지 않습니다.",
  },
  {
    label: "발행 승인",
    command: "npm run admin:publish -- --slug <slug>",
    note: "발행 승인 후 /blog/<slug>에 노출되고 sitemap/RSS에 포함됩니다.",
  },
  {
    label: "삭제 처리",
    command: "npm run admin:delete -- --slug <slug>",
    note: "deleted 상태는 목록/상세/sitemap/RSS에서 제외됩니다. 기존 노출 글은 301 여부를 따로 판단하세요.",
  },
];

function statusLabel(post) {
  if (isPublicPost(post)) return "public";
  if (post.status === "deleted") return "deleted";
  return "review";
}

export default async function AdminPage() {
  const posts = await listAllPosts();
  const summary = await summarizePosts();
  const pipelineJobs = (await listPipelineJobs()).slice(0, 8);

  return (
    <main className="admin-shell">
      <header className="admin-hero">
        <p className="blog-kicker">Review · Edit · Publish · Delete</p>
        <h1>Consolve 콘텐츠 검토 관리자</h1>
        <p>
          이 화면은 Discord/Hermes로 생성된 콘텐츠를 검토, 수정, 발행, 삭제하는 전용 관리 화면입니다. 키워드 입력으로 새 콘텐츠를 생성하는 기능은 admin에서 제거했습니다.
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
          <span>Review/Hidden</span>
          <strong>{summary.hidden}</strong>
        </article>
      </section>

      <section className="admin-panel" aria-label="상태별 글 수">
        <h2>상태별 글 수</h2>
        <div className="admin-status-list">
          {Object.entries(summary.byStatus).map(([status, count]) => (
            <span key={status}>{status}: {count}</span>
          ))}
        </div>
      </section>

      <section className="admin-panel" aria-label="Discord 생성 작업">
        <h2>Discord 생성 콘텐츠 큐</h2>
        <p className="admin-muted">
          콘텐츠 생성은 Discord/Hermes 명령에서만 수행합니다. Admin은 생성된 draft를 검토하고 수정한 뒤 published/deleted 상태만 관리합니다.
        </p>
        {pipelineJobs.length ? (
          <div className="admin-post-list">
            {pipelineJobs.map((job) => (
              <article key={job.id}>
                <div>
                  <strong>{job.keyword}</strong>
                  <span>{job.id} · {job.projectName}</span>
                </div>
                <div className="admin-post-meta">
                  <span>{job.status}</span>
                  <span>{job.postSlug}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="admin-muted">아직 Discord에서 생성된 작업 기록이 없습니다.</p>
        )}
      </section>

      <section className="admin-panel" aria-label="CMS 글 검토">
        <h2>콘텐츠 검토 / 수정 / 발행 / 삭제</h2>
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
                    <span>{post.status}</span>
                    <span>{formatDate(post.publishedAt || post.updatedAt)}</span>
                  </div>
                </div>

                <form className="admin-edit-form" action="/api/admin/posts" method="post">
                  <input type="hidden" name="slug" value={post.slug} />
                  <input type="hidden" name="action" value="update" />
                  <label>
                    <span>Title</span>
                    <input name="title" defaultValue={post.title || ""} />
                  </label>
                  <label>
                    <span>Excerpt</span>
                    <textarea name="excerpt" rows={2} defaultValue={post.excerpt || ""} />
                  </label>
                  <label>
                    <span>Content Markdown</span>
                    <textarea name="contentMarkdown" rows={8} defaultValue={post.contentMarkdown || ""} />
                  </label>
                  <div className="admin-form-actions">
                    <button type="submit">수정 저장</button>
                  </div>
                </form>

                <div className="admin-inline-actions">
                  <form action="/api/admin/posts" method="post">
                    <input type="hidden" name="slug" value={post.slug} />
                    <input type="hidden" name="action" value="publish" />
                    <button type="submit">발행</button>
                  </form>
                  <form action="/api/admin/posts" method="post">
                    <input type="hidden" name="slug" value={post.slug} />
                    <input type="hidden" name="action" value="delete" />
                    <button className="danger" type="submit">삭제</button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="admin-panel" aria-label="관리 명령어">
        <h2>관리 cmd</h2>
        <div className="admin-command-list">
          {commands.map((item) => (
            <article key={item.label}>
              <h3>{item.label}</h3>
              <code>{item.command}</code>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
