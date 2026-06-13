"use client";

// 블로그 (/blog) — channel.io/ko/blog 레이아웃 패턴 차용 (구조만, 카피·이미지는 placeholder)
// 구조: featured 히어로 → 카테고리 탭 필터 → 3열 아티클 카드 그리드 → 뉴스레터 → 푸터
// 컨벤션: 인라인 css + body 문자열을 dangerouslySetInnerHTML로 렌더, 인터랙션은 useEffect 바인딩.
//
// ▸ 디자인 조절은 아래 :root 토큰 블록만 수정하면 전체에 반영됩니다.

import { useEffect, useRef } from "react";
import { navCss, getNavHtml } from "../components/navHtml";

const css = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root{
  --ink:#0a0b0b;
  --muted:#666a73;
  --soft:#8d8e91;
  --line:#ececf0;
  --surface:#f7f7f8;
  --paper:#fff;
  --purple:#5e56f0;
  --purple-dark:#4d46d6;

  --space-1:4px;  --space-2:8px;   --space-3:12px;  --space-4:16px;
  --space-5:20px; --space-6:24px;  --space-7:28px;  --space-8:32px;
  --space-10:40px;--space-12:48px; --space-14:56px; --space-16:64px;
  --space-18:72px;--space-20:80px; --space-24:96px;

  --section-y:88px;
  --max:1280px;
  --gutter:28px;

  --text-xs:12px; --text-sm:13px; --text-md:14px;  --text-base:15px;
  --text-lg:16px; --text-xl:18px; --text-2xl:24px; --text-3xl:40px;
  --text-4xl:36px;--text-5xl:40px;

  --fw-medium:500; --fw-semibold:600; --fw-bold:700; --fw-black:800;
  --lh-tight:1.25; --lh-snug:1.3; --lh-body:1.55; --lh-relaxed:1.8;
  --ls-tight:-.04em; --ls-snug:-.03em; --ls-normal:-.02em; --ls-display:-.06em;

  --r-sm:8px; --r-md:12px; --r-lg:14px; --r-pill:999px;
  --shadow:0 12px 40px rgba(0,0,0,.08);
  --shadow-sm:0 9px 28px rgba(0,0,0,.04);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:"Pretendard","Inter","Noto Sans KR",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:#fff;letter-spacing:var(--ls-normal);line-height:var(--lh-body)}
a{text-decoration:none;color:inherit}
button,input{font:inherit}
.wrap{max-width:var(--max);margin:0 auto;padding:0 var(--gutter)}

${navCss}

/* ── 페이지 헤더 ── */
.blog-head{padding:var(--space-16) 0 var(--space-10)}
.blog-head .kicker{font-size:var(--text-md);font-weight:var(--fw-bold);color:var(--purple);margin-bottom:var(--space-3)}
.blog-head h1{font-size:var(--text-5xl);line-height:1.2;margin:0 0 var(--space-4);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug)}
.blog-head p{font-size:var(--text-xl);color:#626873;margin:0;max-width:560px}

/* ── Featured 히어로 ── */
.featured{display:grid;grid-template-columns:1.15fr 1fr;gap:var(--space-12);align-items:center;padding-bottom:var(--space-16);border-bottom:1px solid var(--line)}
.featured .thumb{aspect-ratio:16/10;border-radius:var(--r-lg);box-shadow:var(--shadow)}
.featured .tag{display:inline-block;font-size:var(--text-xs);font-weight:var(--fw-bold);color:var(--purple);background:#efeefe;border-radius:var(--r-pill);padding:6px 12px;margin-bottom:var(--space-4)}
.featured h2{font-size:var(--text-3xl);line-height:1.35;margin:0 0 var(--space-4);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug);word-break:keep-all}
.featured .excerpt{font-size:var(--text-lg);color:#5a606b;line-height:var(--lh-body);margin:0 0 var(--space-6)}
.byline{display:flex;align-items:center;gap:var(--space-3);font-size:var(--text-sm);color:#7b808a}
.byline .ava{width:34px;height:34px;border-radius:50%;flex:none}
.byline b{color:#33363d;font-weight:var(--fw-semibold)}
.byline .dot{color:#c7c9cf}

/* ── 카테고리 탭 ── */
.cat-bar{position:sticky;top:68px;z-index:20;background:rgba(255,255,255,.9);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);margin-top:var(--space-8)}
.cat-bar .wrap{display:flex;gap:var(--space-2);overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;padding-top:var(--space-3);padding-bottom:var(--space-3)}
.cat-bar .wrap::-webkit-scrollbar{display:none}
.cat{flex:none;border:0;background:transparent;cursor:pointer;font-size:var(--text-md);font-weight:var(--fw-semibold);color:#5a5e66;padding:9px 16px;border-radius:var(--r-pill);white-space:nowrap;transition:.15s}
.cat:hover{background:#f3f3f5}
.cat.active{background:#111114;color:#fff}

/* ── 아티클 그리드 ── */
.grid-sec{padding:var(--space-14) 0 var(--space-20)}
.card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-8) var(--space-6)}
.card{display:flex;flex-direction:column;cursor:pointer}
.card .thumb{aspect-ratio:16/10;border-radius:var(--r-md);margin-bottom:var(--space-4);transition:.25s}
.card:hover .thumb{transform:translateY(-4px);box-shadow:var(--shadow)}
.card .tag{font-size:var(--text-xs);font-weight:var(--fw-bold);color:var(--purple);margin-bottom:var(--space-2)}
.card h3{font-size:var(--text-xl);line-height:1.4;margin:0 0 var(--space-3);font-weight:var(--fw-bold);letter-spacing:var(--ls-normal);word-break:keep-all}
.card .excerpt{font-size:var(--text-sm);color:#69707b;line-height:var(--lh-relaxed);margin:0 0 var(--space-4);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card .byline{margin-top:auto}
.card .byline .ava{width:28px;height:28px}
.empty{grid-column:1/-1;text-align:center;color:#9a9da5;padding:var(--space-16) 0;font-size:var(--text-md)}

/* placeholder 썸네일 그라데이션 */
.ph{background:linear-gradient(135deg,#cfe0ff,#ecd8ff 55%,#ffd7ea)}
.ph-1{background:linear-gradient(135deg,#cfe0ff,#dfe5ff)}
.ph-2{background:linear-gradient(135deg,#ecd8ff,#efb6ff)}
.ph-3{background:linear-gradient(135deg,#ffd7ea,#ffe6cf)}
.ph-4{background:linear-gradient(135deg,#d9ebe6,#b9ead6)}
.ph-5{background:linear-gradient(135deg,#e6e3ff,#cfe0ff)}
.ava-ph{background:linear-gradient(135deg,#ffd7c0,#b9ead6)}

/* 더보기 */
.more-row{text-align:center;margin-top:var(--space-16)}
.btn-more{border:1px solid #dcdce2;background:#fff;border-radius:var(--r-pill);padding:13px 28px;font-size:var(--text-md);font-weight:var(--fw-bold);color:#33363d;cursor:pointer;transition:.15s}
.btn-more:hover{border-color:#bdbdc6;background:#fafafb}

/* ── 뉴스레터 ── */
.newsletter{background:#f6f4f1;border-radius:24px;margin:0 auto var(--space-24);max-width:calc(var(--max) - var(--gutter)*2);padding:var(--space-16) var(--space-12);text-align:center}
.newsletter h2{font-size:var(--text-3xl);margin:0 0 var(--space-3);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug)}
.newsletter p{font-size:var(--text-lg);color:#626873;margin:0 0 var(--space-8)}
.sub-form{display:flex;gap:var(--space-2);max-width:460px;margin:0 auto}
.sub-form input{flex:1;height:54px;border:1px solid #e2e2e8;border-radius:var(--r-pill);padding:0 22px;outline:none;background:#fff;font-size:var(--text-md);color:#2d3035}
.sub-form input::placeholder{color:#a9acb3}
.sub-form button{height:54px;border:0;border-radius:var(--r-pill);background:#111114;color:#fff;font-weight:var(--fw-bold);font-size:var(--text-md);padding:0 26px;cursor:pointer}

/* ── Footer ── */
.footer{background:#fff;border-top:1px solid #e8e8ec;padding:var(--space-16) 0 var(--space-24);color:#5f636d}
.footer-grid{display:grid;grid-template-columns:1.5fr repeat(5,1fr);gap:var(--space-7)}
.footer h4{font-size:var(--text-sm);color:#111;margin:0 0 var(--space-4)}
.footer a{display:block;font-size:var(--text-sm);margin:9px 0;color:#737780}

@media(max-width:900px){
  .links{display:none}
  .blog-head h1{font-size:var(--text-4xl)}
  .featured{grid-template-columns:1fr;gap:var(--space-6)}
  .featured h2{font-size:var(--text-2xl)}
  .card-grid{grid-template-columns:repeat(2,1fr)}
  .footer-grid{grid-template-columns:1fr 1fr}
  .newsletter{padding:var(--space-12) var(--space-6)}
}
@media(max-width:600px){
  .card-grid{grid-template-columns:1fr}
  .sub-form{flex-direction:column}
}
`;

// placeholder 아티클 데이터 (카테고리별 필터에 사용)
const CATS = [
  { key: "all", label: "전체" },
  { key: "event", label: "이벤트" },
  { key: "case", label: "성공 사례" },
  { key: "tip", label: "활용 팁" },
  { key: "insight", label: "비즈니스 인사이트" },
  { key: "news", label: "뉴스룸" },
];

const CAT_LABEL = {
  event: "이벤트",
  case: "성공 사례",
  tip: "활용 팁",
  insight: "비즈니스 인사이트",
  news: "뉴스룸",
};

const ARTICLES = Array.from({ length: 9 }).map((_, i) => {
  const cats = ["case", "tip", "insight", "event", "news"];
  const cat = cats[i % cats.length];
  return {
    cat,
    slug: `article-${i + 1}`,
    ph: `ph-${(i % 5) + 1}`,
    title: `아티클 제목 자리입니다 — 플레이스홀더 제목 ${i + 1}`,
    excerpt:
      "본문 요약이 들어갈 자리입니다. 두 줄 정도의 발췌문이 카드에 표시되며 실제 내용으로 교체하면 됩니다.",
    author: ["에디터", "운영팀", "디자인팀"][i % 3],
    date: `2026년 6월 ${((i * 3) % 28) + 1}일`,
  };
});

const cardHTML = (a) => `
  <a class="card" href="/blog/articles/${a.slug}" data-cat="${a.cat}">
    <div class="thumb ph ${a.ph}"></div>
    <div class="tag">${CAT_LABEL[a.cat]}</div>
    <h3>${a.title}</h3>
    <p class="excerpt">${a.excerpt}</p>
    <div class="byline">
      <span class="ava ava-ph"></span>
      <b>${a.author}</b><span class="dot">·</span><span>${a.date}</span>
    </div>
  </a>`;

const body = `${getNavHtml('blog')}

  <header class="blog-head">
    <div class="wrap">
      <div class="kicker">System Web 블로그</div>
      <h1>웹사이트·자사몰을 더 빠르고 단단하게 만드는 이야기</h1>
      <p>제작 시스템, 운영 노하우, 실제 제작 사례를 정리합니다.</p>
    </div>
  </header>

  <section class="wrap">
    <a class="featured" href="/blog/articles/featured-story">
      <div class="thumb ph"></div>
      <div>
        <span class="tag">성공 사례</span>
        <h2>대표 아티클 제목이 들어갈 자리입니다 — featured 플레이스홀더</h2>
        <p class="excerpt">메인에 노출되는 대표 글의 요약문이 들어갑니다. 실제 발행 시 핵심 메시지로 교체하세요. 이 영역은 channel.io 블로그의 featured 히어로 구조를 차용했습니다.</p>
        <div class="byline">
          <span class="ava ava-ph"></span>
          <b>에디터</b><span class="dot">·</span><span>2026년 6월 9일</span>
        </div>
      </div>
    </a>
  </section>

  <nav class="cat-bar">
    <div class="wrap" id="catBar">
      ${CATS.map(
        (c, i) =>
          `<button class="cat${i === 0 ? " active" : ""}" data-cat="${c.key}">${c.label}</button>`
      ).join("")}
    </div>
  </nav>

  <section class="grid-sec">
    <div class="wrap">
      <div class="card-grid" id="cardGrid">
        ${ARTICLES.map(cardHTML).join("")}
      </div>
      <div class="more-row"><button class="btn-more">더 보기</button></div>
    </div>
  </section>

  <section class="newsletter">
    <h2>새 글이 올라오면 알려드릴까요?</h2>
    <p>제작 노하우와 사례를 정리해 가끔 보내드립니다.</p>
    <form class="sub-form" onsubmit="return false">
      <input type="email" placeholder="이메일 주소를 입력하세요" aria-label="이메일 주소" />
      <button type="submit">구독하기</button>
    </form>
  </section>

  <footer class="footer">
    <div class="wrap footer-grid">
      <div><a class="brand" href="/"><img class="logo-img" src="/logo.png" alt="System Web" /></a><p style="font-size:12px;line-height:1.8;margin-top:32px;color:#9a9da5">© 2026 Visible Dev<br/>마감 안에 끝내고, 진행이 보이는 개발 외주</p></div>
      <div><h4>기능</h4><a>진행 상황 공유</a><a>카페24 개발</a><a>랜딩페이지</a><a>자동화</a></div>
      <div><h4>가격</h4><a>작업 범위</a><a>일정 상담</a><a>추후 개선</a></div>
      <div><h4>블로그</h4><a>외주 일정 관리</a><a>카페24 운영</a><a>랜딩페이지 전환</a></div>
      <div><h4>리소스</h4><a>FAQ</a><a>체크리스트</a><a>문의하기</a></div>
      <div><h4>회사</h4><a>소개</a><a>사례</a><a>파트너</a></div>
    </div>
  </footer>
`;

export default function BlogPage() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const bar = root.querySelector("#catBar");
    const grid = root.querySelector("#cardGrid");
    if (!bar || !grid) return;

    const tabs = Array.from(bar.querySelectorAll(".cat"));
    const cards = Array.from(grid.querySelectorAll(".card"));

    const onTab = (e) => {
      const tab = e.currentTarget;
      const cat = tab.dataset.cat;
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      let shown = 0;
      cards.forEach((c) => {
        const match = cat === "all" || c.dataset.cat === cat;
        c.style.display = match ? "" : "none";
        if (match) shown++;
      });
      let empty = grid.querySelector(".empty");
      if (!shown) {
        if (!empty) {
          empty = document.createElement("div");
          empty.className = "empty";
          empty.textContent = "해당 카테고리의 글이 아직 없습니다.";
          grid.appendChild(empty);
        }
      } else if (empty) {
        empty.remove();
      }
    };

    tabs.forEach((t) => t.addEventListener("click", onTab));
    return () => tabs.forEach((t) => t.removeEventListener("click", onTab));
  }, []);

  return (
    <div ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
