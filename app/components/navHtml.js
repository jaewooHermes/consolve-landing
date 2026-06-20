/* ── 공유 Nav — navCss + getNavHtml(current) ── */

export const navCss = `
/* ── Nav ── */
.nav{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.84);backdrop-filter:blur(18px);border-bottom:1px solid rgba(17,17,20,.04)}
.nav-inner{height:68px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:9px;font-weight:var(--fw-bold);letter-spacing:var(--ls-snug)}
.logo-img{height:30px;width:auto;display:block;flex:none}
.links{display:flex;align-items:center;gap:var(--space-8);color:#333740;font-size:var(--text-md);font-weight:var(--fw-semibold)}
.links a.cur{color:var(--purple)}
.nav-actions{display:flex;align-items:center;gap:var(--space-4);font-size:var(--text-md);font-weight:var(--fw-semibold)}
.pill-dark{background:#111114;color:#fff;border-radius:var(--r-pill);padding:11px 18px;font-weight:var(--fw-bold);box-shadow:0 8px 18px rgba(0,0,0,.12)}
`;

export function getNavHtml(current) {
  const cur = (page) => current === page ? ' class="cur"' : '';
  return `
  <nav class="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="/"><img class="logo-img" src="/logo.png" alt="System Web" /></a>
      <div class="links">
        <a${cur('price')} href="/price">가격</a>
        <a${cur('blog')} href="/blog">블로그</a>
      </div>
      <div class="nav-actions"><a>로그인</a><a class="pill-dark" href="/#quote">5분 견적 받기</a></div>
    </div>
  </nav>`;
}
