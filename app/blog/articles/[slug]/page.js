import { notFound } from "next/navigation";
import { navCss, getNavHtml } from "../../../components/navHtml";
import { formatDate, getPostAuthor, getPublicPostBySlug, listPublicPosts } from "../../../../lib/cms";
import { extractHeadingsFromBlocks, extractHeadingsFromMarkdown, markdownToHtml, renderBlocksToHtml } from "../../../../lib/blog-renderer";

export const dynamic = "force-dynamic";

const css = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
:root{--ink:#0a0b0b;--muted:#666a73;--line:#ececf0;--surface:#f7f7f8;--paper:#fff;--purple:#5e56f0;--space-2:8px;--space-3:12px;--space-4:16px;--space-6:24px;--space-8:32px;--space-10:40px;--space-12:48px;--space-14:56px;--space-16:64px;--space-20:80px;--space-24:96px;--max:1280px;--gutter:28px;--text-xs:12px;--text-sm:13px;--text-md:14px;--text-base:15px;--text-lg:16px;--text-xl:18px;--text-2xl:24px;--text-3xl:40px;--fw-semibold:600;--fw-bold:700;--fw-black:800;--lh-body:1.55;--lh-relaxed:1.8;--ls-normal:-.02em;--ls-snug:-.03em;--r-md:12px;--r-lg:14px;--r-pill:999px;--shadow:0 12px 40px rgba(0,0,0,.08)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:"Pretendard","Inter","Noto Sans KR",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:#fff;letter-spacing:var(--ls-normal);line-height:var(--lh-body)}a{text-decoration:none;color:inherit}.wrap{max-width:var(--max);margin:0 auto;padding:0 var(--gutter)}
${navCss}
.ph{background:linear-gradient(135deg,#cfe0ff,#ecd8ff 55%,#ffd7ea)}.ava-ph{background:linear-gradient(135deg,#ffd7c0,#b9ead6)}
.breadcrumb{max-width:760px;margin:0 auto;padding:var(--space-8) var(--gutter) 0;font-size:var(--text-sm);color:#8d8e91}.breadcrumb a:hover{color:var(--purple)}.breadcrumb .sep{margin:0 8px;color:#cfd0d6}
.article-head{max-width:780px;margin:0 auto;padding:var(--space-6) var(--gutter) 0;text-align:center}.atags{display:flex;gap:var(--space-2);justify-content:center;flex-wrap:wrap;margin-bottom:var(--space-5)}.atag{font-size:var(--text-xs);font-weight:var(--fw-bold);color:var(--purple);background:#efeefe;border-radius:var(--r-pill);padding:6px 12px}.article-head h1{font-size:var(--text-3xl);line-height:1.3;font-weight:var(--fw-black);letter-spacing:var(--ls-snug);margin:0 0 var(--space-6);word-break:keep-all}.ameta{display:flex;align-items:center;justify-content:center;gap:var(--space-3);font-size:var(--text-md);color:#7b808a;flex-wrap:wrap}.ameta .ava{width:44px;height:44px;border-radius:50%;flex:none}.ameta b{color:#33363d;font-weight:var(--fw-semibold)}.ameta .sep{color:#cfd0d6}.cover{max-width:960px;margin:var(--space-10) auto 0;aspect-ratio:16/9;border-radius:18px;box-shadow:var(--shadow)}
.article-layout{max-width:1040px;margin:0 auto;padding:var(--space-14) var(--gutter) 0;display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:var(--space-16);align-items:start}.article-body{max-width:720px;font-size:17px;line-height:1.85;color:#2b2f37}.article-body h2{font-size:26px;font-weight:var(--fw-black);letter-spacing:var(--ls-normal);margin:var(--space-12) 0 var(--space-4);scroll-margin-top:90px}.article-body h3{font-size:var(--text-2xl);font-weight:var(--fw-bold);margin:var(--space-8) 0 var(--space-3)}.article-body p{margin:0 0 22px}.article-body strong{font-weight:var(--fw-bold);color:#111}.article-body code{font-family:"SFMono-Regular",Consolas,monospace;background:#f5f5f7;border:1px solid #ececf0;border-radius:6px;padding:1px 5px;font-size:.92em}.article-body ul,.article-body ol{margin:0 0 22px;padding-left:22px}.article-body li{margin:0 0 10px}.article-body blockquote{margin:var(--space-8) 0;padding:6px 0 6px 24px;border-left:4px solid var(--purple);font-size:21px;font-weight:var(--fw-bold);line-height:1.6;color:#1a1c20}.callout{background:#f6f5ff;border:1px solid #e6e3ff;border-radius:14px;padding:24px 26px;margin:var(--space-8) 0}.callout h4{margin:0 0 var(--space-3);font-size:var(--text-base);font-weight:var(--fw-black);color:var(--purple)}.callout p{margin:0;color:#454b55}.blog-image{margin:var(--space-8) 0}.blog-image img{width:100%;border-radius:16px;display:block;box-shadow:var(--shadow-sm);object-fit:cover}.blog-image figcaption{font-size:var(--text-sm);color:#8d8e91;text-align:center;margin-top:10px}.options{width:100%;border-collapse:separate;border-spacing:0;margin:var(--space-6) 0;border:1px solid var(--line);border-radius:14px;overflow:hidden}.options th,.options td{padding:14px 16px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.options th{background:#f7f7f8;font-weight:var(--fw-black)}.options tr:last-child th,.options tr:last-child td{border-bottom:0}.prompt-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0 18px}.prompt-gallery img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:14px;background:#f3f3f5;box-shadow:var(--shadow-sm)}.prompt{white-space:pre-wrap;word-break:break-word;background:#111114;color:#f5f5f7;border-radius:14px;padding:18px 20px;font-size:13px;line-height:1.7;overflow:auto;margin:14px 0 26px}.prompt code{background:transparent;border:0;color:inherit;padding:0}.toc{position:sticky;top:96px;font-size:var(--text-md)}.toc h5{font-size:var(--text-xs);font-weight:var(--fw-black);letter-spacing:.06em;color:#a0a4ac;margin:0 0 var(--space-3)}.toc a{display:block;padding:7px 0 7px 14px;border-left:2px solid var(--line);color:#8d8e91;font-weight:600;line-height:1.4}.toc a:hover{color:#33363d}
.cta-banner{margin:var(--space-12) 0;background:#111114;border-radius:18px;padding:var(--space-10);text-align:center;color:#fff}.cta-banner h3{font-size:var(--text-2xl);font-weight:var(--fw-bold);margin:0 0 var(--space-2);color:#fff}.cta-banner p{color:rgba(255,255,255,.7);margin:0 0 var(--space-6)}.cta-banner a{display:inline-block;background:#fff;color:#111;border-radius:var(--r-pill);padding:13px 28px;font-weight:var(--fw-bold)}
.footer{background:#fff;border-top:1px solid #e8e8ec;padding:var(--space-16) 0 var(--space-24);color:#5f636d;margin-top:var(--space-20)}.footer-grid{display:grid;grid-template-columns:1.5fr repeat(5,1fr);gap:28px}.footer h4{font-size:var(--text-sm);color:#111;margin:0 0 var(--space-4)}.footer a{display:block;font-size:var(--text-sm);margin:9px 0;color:#737780}
@media(max-width:980px){.article-layout{grid-template-columns:1fr;gap:0}.toc{display:none}}@media(max-width:900px){.links{display:none}.article-head h1{font-size:var(--text-2xl)}.article-body{font-size:16px}.footer-grid{grid-template-columns:1fr 1fr}}
`;

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function placeholderPost(slug) {
  if (!/^article-\d+$|^featured-story$/.test(slug)) return null;
  return {
    slug,
    title: "제작 사례 제목이 들어갈 자리입니다 — 상세 페이지 플레이스홀더",
    excerpt: "실제 발행 글이 연결되기 전까지 보여주는 샘플 상세 페이지입니다.",
    contentMarkdown: "## 프로젝트 배경\n본문 도입 문단 자리입니다. 실제 발행 시 독자가 이어서 읽고 싶도록 핵심 메시지를 앞에 배치하세요.\n\n## 무엇이 문제였나\n문제 설명 자리입니다.\n\n## 어떻게 접근했나\n해결 접근 방식 자리입니다.",
    publishedAt: "2026-06-09T00:00:00.000Z",
    author: "에디터",
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) return { title: "System Web 블로그" };
  return { title: `${post.title} | System Web 블로그`, description: post.excerpt || post.metaDescription };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = (await getPublicPostBySlug(slug)) || placeholderPost(slug);
  if (!post) notFound();

  const blocks = post.content?.blocks;
  const markdown = post.contentMarkdown || post.content || post.body || post.excerpt || "";
  const hasBlocks = Array.isArray(blocks) && blocks.length > 0;
  const headings = hasBlocks ? extractHeadingsFromBlocks(blocks) : extractHeadingsFromMarkdown(markdown);
  const articleHtml = hasBlocks ? renderBlocksToHtml(blocks) : markdownToHtml(markdown);
  const related = (await listPublicPosts()).filter((item) => item.slug !== post.slug).slice(0, 3);

  const body = `${getNavHtml('blog')}
  <article>
    <nav class="breadcrumb"><a href="/blog">블로그</a><span class="sep">›</span><a href="/blog">비즈니스 인사이트</a><span class="sep">›</span>${escapeHtml(post.title)}</nav>
    <header class="article-head">
      <div class="atags"><span class="atag">비즈니스 인사이트</span>${post.targetKeyword ? `<span class="atag">${escapeHtml(post.targetKeyword)}</span>` : ""}</div>
      <h1>${escapeHtml(post.title)}</h1>
      <div class="ameta"><span class="ava ava-ph"></span><b>${escapeHtml(getPostAuthor(post))}</b><span class="sep">·</span><span>${escapeHtml(formatDate(post.publishedAt || post.updatedAt))}</span></div>
    </header>
    <div class="cover ph"></div>
    <div class="article-layout">
      <div class="article-body">
        ${post.excerpt ? `<div class="callout"><h4>한눈에 보는 핵심</h4><p>${escapeHtml(post.excerpt)}</p></div>` : ""}
        ${articleHtml}
        <div class="cta-banner"><h3>우리 비즈니스에도 적용할 수 있을까요?</h3><p>현재 사이트 상태와 우선순위를 먼저 정리해드립니다.</p><a href="/#contact">5분 견적 받기</a></div>
      </div>
      <aside class="toc"><h5>CONTENTS</h5>${headings.map((h) => `<a href="#${h.id}">${escapeHtml(h.title)}</a>`).join("")}</aside>
    </div>
  </article>
  <footer class="footer"><div class="wrap footer-grid"><div><a class="brand" href="/"><img class="logo-img" src="/logo.png" alt="System Web" /></a><p style="font-size:12px;line-height:1.8;margin-top:32px;color:#9a9da5">© 2026 Visible Dev<br/>마감 안에 끝내고, 진행이 보이는 개발 외주</p></div><div><h4>기능</h4><a>진행 상황 공유</a><a>카페24 개발</a><a>랜딩페이지</a><a>자동화</a></div><div><h4>가격</h4><a>작업 범위</a><a>일정 상담</a><a>추후 개선</a></div><div><h4>블로그</h4><a>외주 일정 관리</a><a>카페24 운영</a><a>랜딩페이지 전환</a></div><div><h4>리소스</h4><a>FAQ</a><a>체크리스트</a><a>문의하기</a></div><div><h4>회사</h4><a>소개</a><a>사례</a><a>파트너</a></div></div></footer>`;

  return <div><style dangerouslySetInnerHTML={{ __html: css }} /><div dangerouslySetInnerHTML={{ __html: body }} /></div>;
}
