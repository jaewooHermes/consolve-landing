import { navCss, getNavHtml } from "../../components/navHtml";
import { getPublicPostBySlug } from "../../../lib/cms";
import { renderBlocksToHtml } from "../../../lib/blog-renderer";
import { promptArticleToPostPayload, PROMPT_ARTICLE_SLUG } from "../../../lib/prompt-article-adapter";
import { ARTICLE_CONTENT } from "./content";

export const dynamic = "force-dynamic";

const css = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
:root{--ink:#0a0b0b;--muted:#616670;--line:#ececf0;--paper:#fff;--soft:#f7f7f8;--purple:#5e56f0;--max:920px;--gutter:24px;--r:20px;--ls:-.02em;}
*{box-sizing:border-box} body{margin:0;font-family:"Pretendard","Noto Sans KR",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:#fff;letter-spacing:var(--ls);line-height:1.75} a{text-decoration:none;color:inherit} code{font-family:"SFMono-Regular",Consolas,monospace}
${navCss}
.article-wrap{max-width:var(--max);margin:0 auto;padding:72px var(--gutter) 96px}.admin-edit{position:fixed;right:18px;bottom:18px;z-index:50;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:#111114;color:#fff;padding:11px 16px;font-size:13px;font-weight:850;box-shadow:0 12px 34px rgba(0,0,0,.18)}.eyebrow{display:inline-flex;align-items:center;border:1px solid #e1defd;background:#f2f1ff;color:var(--purple);border-radius:999px;padding:7px 13px;font-size:13px;font-weight:800;margin-bottom:22px}.article-wrap h1{font-size:clamp(36px,6vw,62px);line-height:1.08;letter-spacing:-.06em;margin:0 0 22px;font-weight:850}.lead{font-size:19px;color:#545b66;line-height:1.8;margin:0 0 34px;max-width:760px}.meta{display:flex;gap:10px;align-items:center;color:#80858d;font-size:14px;margin-bottom:42px}.hero{width:100%;aspect-ratio:16/10;border-radius:28px;display:block;margin:0 0 48px;box-shadow:0 22px 70px rgba(0,0,0,.10);background:radial-gradient(circle at 22% 24%,rgba(255,255,255,.92) 0 12%,transparent 34%),radial-gradient(circle at 82% 28%,rgba(255,215,234,.72) 0 18%,transparent 42%),radial-gradient(circle at 50% 82%,rgba(207,224,255,.86) 0 22%,transparent 48%),linear-gradient(135deg,#e6e3ff 0%,#cfe0ff 48%,#ffd7ea 100%);position:relative;overflow:hidden}.hero:after{content:"";position:absolute;inset:18%;border-radius:999px;background:rgba(255,255,255,.28);filter:blur(42px)}.article{font-size:17px}.article h2{font-size:30px;line-height:1.25;letter-spacing:-.045em;margin:58px 0 18px;padding-top:18px;border-top:1px solid var(--line)}.article h3{font-size:22px;line-height:1.35;letter-spacing:-.04em;margin:38px 0 10px}.article p{margin:0 0 18px;color:#2f3339}.article ul,.article ol{padding-left:22px;margin:0 0 22px}.article li{margin:7px 0}.callout{border-left:4px solid var(--purple);background:#f7f6ff;border-radius:0 16px 16px 0;padding:18px 20px;margin:30px 0;color:#343447}.callout h4{margin:0 0 8px;color:var(--purple)}.callout p{margin:0}.options{width:100%;border-collapse:separate;border-spacing:0;margin:24px 0 30px;border:1px solid var(--line);border-radius:16px;overflow:hidden}.options th,.options td{padding:14px 16px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.options th{background:#f7f7f8;font-weight:850}.options tr:last-child th,.options tr:last-child td{border-bottom:0}.prompt-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0 18px}.prompt-gallery img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:16px;background:#f1f1f3;box-shadow:0 10px 34px rgba(0,0,0,.08)}.prompt{white-space:pre-wrap;word-break:break-word;background:#111114;color:#f5f5f7;border-radius:16px;padding:18px 20px;font-size:13px;line-height:1.7;overflow:auto;margin:14px 0 30px}.prompt code{color:inherit}.back{display:inline-flex;margin-top:42px;color:var(--purple);font-weight:800}.footer-space{height:40px}@media(max-width:720px){.prompt-gallery{grid-template-columns:1fr}.article-wrap{padding-top:48px}.admin-edit{right:12px;bottom:12px}.options{font-size:14px}}
`;

export async function generateMetadata() {
  const dbPost = await getPublicPostBySlug(PROMPT_ARTICLE_SLUG);
  const post = dbPost || promptArticleToPostPayload(ARTICLE_CONTENT);
  return {
    title: `${post.title} | Consolve 블로그`,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function MidjourneyFilmPhotoPromptsPage() {
  const dbPost = await getPublicPostBySlug(PROMPT_ARTICLE_SLUG);
  const article = dbPost || promptArticleToPostPayload(ARTICLE_CONTENT);
  const blocks = article.content?.blocks || [];
  const articleHtml = renderBlocksToHtml(blocks);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: getNavHtml("blog") }} />
      <a className="admin-edit" href="/admin/blog/midjourney-film-photo-prompts" rel="nofollow">수정</a>
      <main className="article-wrap" data-content-source={dbPost ? "db-json" : "static-fallback"}>
        <span className="eyebrow">{article.eyebrow || "프롬프트 모음"}</span>
        <h1>{article.title}</h1>
        <p className="lead">{article.lead || article.excerpt}</p>
        <div className="meta"><b>{article.author}</b><span>·</span><span>{article.date || "2026년 6월 23일"}</span></div>
        <div className="hero" role="img" aria-label={article.hero?.alt || article.heroLabel || "블로그 대표 이미지"} />
        <article className="article" dangerouslySetInnerHTML={{ __html: articleHtml }} />
        <a className="back" href="/blog">← 블로그 목록으로</a>
      </main>
      <div className="footer-space" />
    </>
  );
}
