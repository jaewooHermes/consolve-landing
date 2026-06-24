import { navCss, getNavHtml } from "../../components/navHtml";
import { ARTICLE_CONTENT } from "./content";

const css = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
:root{--ink:#0a0b0b;--muted:#616670;--line:#ececf0;--paper:#fff;--soft:#f7f7f8;--purple:#5e56f0;--max:920px;--gutter:24px;--r:20px;--ls:-.02em;}
*{box-sizing:border-box} body{margin:0;font-family:"Pretendard","Noto Sans KR",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:#fff;letter-spacing:var(--ls);line-height:1.75} a{text-decoration:none;color:inherit} code{font-family:"SFMono-Regular",Consolas,monospace}
${navCss}
.article-wrap{max-width:var(--max);margin:0 auto;padding:72px var(--gutter) 96px}.admin-edit{position:fixed;right:18px;bottom:18px;z-index:50;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:#111114;color:#fff;padding:11px 16px;font-size:13px;font-weight:850;box-shadow:0 12px 34px rgba(0,0,0,.18)}.eyebrow{display:inline-flex;align-items:center;border:1px solid #e1defd;background:#f2f1ff;color:var(--purple);border-radius:999px;padding:7px 13px;font-size:13px;font-weight:800;margin-bottom:22px}.article-wrap h1{font-size:clamp(36px,6vw,62px);line-height:1.08;letter-spacing:-.06em;margin:0 0 22px;font-weight:850}.lead{font-size:19px;color:#545b66;line-height:1.8;margin:0 0 34px;max-width:760px}.meta{display:flex;gap:10px;align-items:center;color:#80858d;font-size:14px;margin-bottom:42px}.hero{width:100%;aspect-ratio:16/10;border-radius:28px;display:block;margin:0 0 48px;box-shadow:0 22px 70px rgba(0,0,0,.10);background:radial-gradient(circle at 22% 24%,rgba(255,255,255,.92) 0 12%,transparent 34%),radial-gradient(circle at 82% 28%,rgba(255,215,234,.72) 0 18%,transparent 42%),radial-gradient(circle at 50% 82%,rgba(207,224,255,.86) 0 22%,transparent 48%),linear-gradient(135deg,#e6e3ff 0%,#cfe0ff 48%,#ffd7ea 100%);position:relative;overflow:hidden}.hero:after{content:"";position:absolute;inset:18%;border-radius:999px;background:rgba(255,255,255,.28);filter:blur(42px)}.article{font-size:17px}.article h2{font-size:30px;line-height:1.25;letter-spacing:-.045em;margin:58px 0 18px;padding-top:18px;border-top:1px solid var(--line)}.article h3{font-size:22px;line-height:1.35;letter-spacing:-.04em;margin:38px 0 10px}.article p{margin:0 0 18px;color:#2f3339}.article ul,.article ol{padding-left:22px;margin:0 0 22px}.article li{margin:7px 0}.note{border-left:4px solid var(--purple);background:#f7f6ff;border-radius:0 16px 16px 0;padding:18px 20px;margin:30px 0;color:#343447}.options{width:100%;border-collapse:separate;border-spacing:0;margin:20px 0 30px;border:1px solid var(--line);border-radius:18px;overflow:hidden}.options th,.options td{padding:14px 16px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.options tr:last-child td{border-bottom:0}.options th{background:#f8f8fa;font-size:14px}.prompt-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:16px 0 18px}.prompt-gallery img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block;border-radius:18px;background:#f2f2f3;box-shadow:0 12px 34px rgba(0,0,0,.08)}.prompt{background:#111114;color:#f2f2f5;border-radius:18px;padding:18px 18px;margin:14px 0 26px;overflow:auto;font-size:13px;line-height:1.7;white-space:pre-wrap}.back{display:inline-flex;margin-top:54px;color:#4f46e5;font-weight:800}.footer-space{height:40px}@media(max-width:640px){.article-wrap{padding-top:48px}.admin-edit{right:12px;bottom:12px}.article{font-size:16px}.article h2{font-size:25px}.options{font-size:14px}.prompt-gallery{grid-template-columns:1fr;gap:10px}.prompt{font-size:12px}}
`;

export const metadata = {
  title: `${ARTICLE_CONTENT.title} | Consolve 블로그`,
  description: ARTICLE_CONTENT.seoDescription,
};

function renderInline(value = "") {
  const parts = String(value).split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <b key={index}>{part.slice(2, -2)}</b>;
    return part;
  });
}

export default function MidjourneyFilmPhotoPromptsPage() {
  const article = ARTICLE_CONTENT;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: getNavHtml("blog") }} />
      <a className="admin-edit" href="/admin/blog/midjourney-film-photo-prompts" rel="nofollow">수정</a>
      <main className="article-wrap" data-content-source="editable-json">
        <span className="eyebrow">{article.eyebrow}</span>
        <h1>{article.title}</h1>
        <p className="lead">{article.lead}</p>
        <div className="meta"><b>{article.author}</b><span>·</span><span>{article.date}</span></div>
        <div className="hero" role="img" aria-label={article.heroLabel} />
        <article className="article">
          {article.introParagraphs.map((paragraph) => <p key={paragraph}>{renderInline(paragraph)}</p>)}
          {article.note ? <p className="note">{renderInline(article.note)}</p> : null}
          <h2>{article.optionsTitle}</h2>
          <table className="options"><tbody>
            {article.options.map((row, rowIndex) => (
              <tr key={rowIndex}>{row.map((cell, cellIndex) => rowIndex === 0 ? <th key={cellIndex}>{renderInline(cell)}</th> : <td key={cellIndex}>{renderInline(cell)}</td>)}</tr>
            ))}
          </tbody></table>
          <h2>{article.promptsTitle}</h2>
          {article.promptItems.map((item, index) => (
            <section key={item.title}>
              <h3>{index + 1}. {item.title}</h3>
              <p>{renderInline(item.description)}</p>
              <div className="prompt-gallery" aria-label={`${item.title} 이미지 예시 3장`}>
                {[1, 2, 3].map((variant) => <img key={variant} src={`/generated-content/midjourney-film-photo-prompts/${item.imageBase}-0${variant}.png`} alt={`${item.title} ${variant}`} loading={index < 2 ? "eager" : "lazy"} />)}
              </div>
              <pre className="prompt"><code>{item.prompt}</code></pre>
            </section>
          ))}
          <h2>{article.howToTitle}</h2>
          <p>{renderInline(article.howToIntro)}</p>
          <ol>{article.howToItems.map((item) => <li key={item}>{renderInline(item)}</li>)}</ol>
          <pre className="prompt"><code>{article.examplePrompt}</code></pre>
          <h2>{article.checklistTitle}</h2>
          <ul>{article.checklist.map((item) => <li key={item}>{renderInline(item)}</li>)}</ul>
          <p>{renderInline(article.outro)}</p>
          <a className="back" href="/blog">← 블로그 목록으로</a>
        </article>
      </main>
      <div className="footer-space" />
    </>
  );
}
