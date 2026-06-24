/* ── 공유 Nav — navCss + getNavHtml(current) ── */

export const navCss = `
/* ── Nav ── */
.nav{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.84);backdrop-filter:blur(18px);border-bottom:1px solid rgba(17,17,20,.04)}
.nav .wrap{max-width:var(--nav-max,1280px);margin:0 auto;padding-left:var(--nav-gutter,28px);padding-right:var(--nav-gutter,28px)}
.nav-inner{height:68px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:9px;font-weight:var(--fw-bold,850);letter-spacing:var(--ls-snug,-.035em)}
.logo-img{height:30px;width:auto;display:block;flex:none}
.links{display:flex;align-items:center;gap:var(--space-8,32px);color:#333740;font-size:var(--text-md,15px);font-weight:var(--fw-semibold,700)}
.links a.cur{color:var(--purple,#5e56f0)}
@media(max-width:600px){
  .nav-inner{height:60px;gap:12px}
  .nav .wrap{padding-left:16px;padding-right:16px}
  .brand{min-width:0;flex:0 1 auto}
  .logo-img{height:24px;max-width:134px;object-fit:contain}
  .links{gap:20px;font-size:14px;flex:none}
}
@media(max-width:360px){
  .nav .wrap{padding-left:12px;padding-right:12px}
  .logo-img{height:22px;max-width:122px}
  .links{gap:16px;font-size:13px}
}
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
    </div>
  </nav>`;
}
