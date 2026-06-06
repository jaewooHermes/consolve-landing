import Link from "next/link";
import { listAllPosts, summarizePosts, formatDate, isPublicPost } from "../../lib/cms";
import { listPipelineJobs } from "../../lib/content-pipeline";

export const metadata = {
  title: "Consolve Admin — Blog Command Center",
  description: "Consolve 블로그 발행 상태와 관리 명령어 안내",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const commands = [
  {
    label: "콘텐츠 파이프라인 실행",
    command: "npm run admin:pipeline -- --keyword \"카페24 쇼핑몰 SEO 자동화\"",
    note: "키워드 → 브리프 → 게이트 → CMS draft 패키지까지 생성합니다.",
  },
  {
    label: "발행 글 확인",
    command: "npm run admin:posts -- --status published",
    note: "published 상태와 publishedAt이 있는 글만 /blog, sitemap, RSS에 노출됩니다.",
  },
  {
    label: "초안 확인",
    command: "npm run admin:posts -- --status draft",
    note: "draft 상태 글은 공개 블로그에는 노출하지 않습니다.",
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

export default function AdminPage() {
  const posts = listAllPosts();
  const summary = summarizePosts();
  const pipelineJobs = listPipelineJobs().slice(0, 8);

  return (
    <main className="admin-shell">
      <header className="admin-hero">
        <p className="blog-kicker">Blog Command Center</p>
        <h1>Consolve 블로그 관리</h1>
        <p>
          이 화면은 `admin.consolve.kr` 또는 `consolve.kr/admin`에서 접근하는 블로그 관리 cmd 툴 라우트입니다. 공개 노출은 항상 CMS의 published 상태를 기준으로 필터링합니다.
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

      <section className="admin-panel" aria-label="상태별 글 수">
        <h2>상태별 글 수</h2>
        <div className="admin-status-list">
          {Object.entries(summary.byStatus).map(([status, count]) => (
            <span key={status}>{status}: {count}</span>
          ))}
        </div>
      </section>

      <section className="admin-panel" aria-label="콘텐츠 파이프라인 실행">
        <h2>콘텐츠 파이프라인 실행</h2>
        <p className="admin-muted">
          기존 콘텐츠 자동화 흐름을 admin에 연결했습니다. 키워드를 넣으면 Google 우선 브리프, AI 답변 보강, 네이버 발견성 체크를 거쳐 CMS draft 패키지를 만듭니다.
        </p>
        <form className="admin-pipeline-form" action="/api/admin/content-pipeline" method="post">
          <label>
            <span>키워드 / 주제</span>
            <input name="keyword" placeholder="예: 카페24 쇼핑몰 SEO 자동화" required />
          </label>
          <label>
            <span>프로젝트</span>
            <input name="projectName" defaultValue="consolve" />
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" name="publish" value="true" />
            <span>바로 published로 생성</span>
          </label>
          <button type="submit">파이프라인 실행</button>
        </form>
        <p className="admin-muted">
          기본값은 안전하게 draft입니다. public blog 노출은 여전히 published + publishedAt 조건을 통과해야 합니다.
        </p>
      </section>

      <section className="admin-panel" aria-label="최근 파이프라인 작업">
        <h2>최근 파이프라인 작업</h2>
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
          <p className="admin-muted">아직 admin에서 실행한 파이프라인 작업이 없습니다.</p>
        )}
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

      <section className="admin-panel" aria-label="CMS 글 목록">
        <h2>CMS posts</h2>
        <div className="admin-post-list">
          {posts.map((post) => {
            const publicPost = isPublicPost(post);
            return (
              <article key={post.id || post.slug}>
                <div>
                  <strong>{post.title}</strong>
                  <span>{post.slug}</span>
                </div>
                <div className="admin-post-meta">
                  <span className={publicPost ? "is-public" : "is-hidden"}>{publicPost ? "public" : "hidden"}</span>
                  <span>{post.status}</span>
                  <span>{formatDate(post.publishedAt || post.updatedAt)}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
