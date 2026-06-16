"use client";

// /claudetestindex — 메인(/) 리디자인 시안
// 컨셉: "시스템" 메시지를 비주얼 언어로 — 모노스페이스 시스템 라벨, 번호 프로세스 레일,
//        실시간 진행 보드(hero), 비교 테이블, Pricing(brand.md §5) 추가
// 톤: 기존 보라(#5e56f0) + 그레이스케일 유지, Pretendard / IBM Plex Mono 악센트
//
// ▸ 디자인 조절은 아래 :root 토큰 블록만 수정하면 전체에 반영됩니다.

import { useEffect, useRef } from "react";

const css = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');

:root{
  /* ── Color ── */
  --ink:#0a0b0b;
  --muted:#666a73;
  --soft:#9a9da5;
  --line:#ececf0;
  --surface:#f7f7f8;
  --paper:#fff;
  --purple:#5e56f0;
  --purple-dark:#4d46d6;
  --purple-soft:rgba(94,86,240,.07);
  --green:#31a552;

  /* ── Spacing (4px 리듬) ── */
  --space-1:4px;  --space-2:8px;   --space-3:12px;  --space-4:16px;
  --space-5:20px; --space-6:24px;  --space-8:32px;  --space-10:40px;
  --space-12:48px;--space-14:56px; --space-16:64px; --space-20:80px;
  --space-24:96px;

  /* ── 섹션 리듬 ── */
  --section-y:104px;
  --hero-y:80px;

  /* ── 영역 폭 ── */
  --max:1200px;
  --max-copy:720px;
  --gutter:28px;

  /* ── Typography ── */
  --text-xs:12px; --text-sm:13px; --text-md:14px;  --text-base:15px;
  --text-lg:16px; --text-xl:18px; --text-2xl:22px; --text-3xl:38px;
  --text-hero:52px;
  --mono:"IBM Plex Mono",ui-monospace,monospace;

  --fw-medium:500; --fw-semibold:600; --fw-bold:700; --fw-black:800;
  --lh-tight:1.22; --lh-body:1.6; --lh-relaxed:1.8;
  --ls-tight:-.04em; --ls-normal:-.02em;

  /* ── 라운드 ── */
  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-pill:999px;

  --shadow:0 12px 40px rgba(20,18,40,.08);
  --shadow-sm:0 6px 20px rgba(20,18,40,.05);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:"Pretendard",system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink);background:#fff;letter-spacing:var(--ls-normal);line-height:var(--lh-body)}
a{text-decoration:none;color:inherit}
button,input{font:inherit}
.wrap{max-width:var(--max);margin:0 auto;padding:0 var(--gutter)}
.mono{font-family:var(--mono);letter-spacing:0}

/* ── Nav ── */
.nav{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.86);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}
.nav-inner{height:64px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:9px;font-weight:var(--fw-bold)}
.logo-img{height:28px;width:auto;display:block}
.links{display:flex;align-items:center;gap:var(--space-8);color:#3a3e46;font-size:var(--text-md);font-weight:var(--fw-semibold)}
.links a:hover{color:var(--purple)}
.pill-dark{background:#111114;color:#fff;border-radius:var(--r-pill);padding:10px 18px;font-size:var(--text-md);font-weight:var(--fw-bold);transition:.18s}
.pill-dark:hover{background:var(--purple)}

/* ── Hero ── */
.hero{position:relative;padding:var(--hero-y) 0 var(--space-16);overflow:hidden}
.hero::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(10,11,11,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(10,11,11,.028) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(70% 80% at 50% 0%,#000 30%,transparent 100%);pointer-events:none}
.hero-grid{position:relative;display:grid;grid-template-columns:1.05fr 1fr;gap:var(--space-16);align-items:center}
.sys-tag{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:var(--text-xs);font-weight:600;color:#6f7580;border:1px solid var(--line);background:#fff;border-radius:var(--r-pill);padding:7px 14px;margin-bottom:var(--space-6)}
.sys-tag::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 0 4px rgba(49,165,82,.14);animation:pulse 2.2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(49,165,82,.14)}50%{box-shadow:0 0 0 7px rgba(49,165,82,.06)}}
h1{font-size:var(--text-hero);line-height:var(--lh-tight);margin:0 0 var(--space-6);font-weight:var(--fw-bold);letter-spacing:var(--ls-tight);word-break:keep-all}
h1 em{font-style:normal;color:var(--purple)}
.hero-copy{color:#565b66;font-size:var(--text-xl);margin:0 0 var(--space-10);max-width:520px;line-height:var(--lh-relaxed);word-break:keep-all}
.search-cta{width:min(520px,100%);height:60px;border:1px solid #e2e2e8;border-radius:var(--r-pill);display:flex;align-items:center;padding:6px 8px 6px 26px;background:#fff;box-shadow:var(--shadow-sm);transition:.18s}
.search-cta:focus-within{border-color:var(--purple);box-shadow:0 0 0 4px var(--purple-soft)}
.search-cta input{border:0;outline:none;flex:1;min-width:0;color:#2d3035;font-size:var(--text-md)}
.search-cta input::placeholder{color:#a9acb3}
.go{border:0;flex:none;height:46px;padding:0 22px;border-radius:var(--r-pill);background:var(--purple);color:#fff;font-size:var(--text-md);font-weight:var(--fw-bold);cursor:pointer;transition:.18s}
.go:hover{background:var(--purple-dark)}
.hero-proof{display:flex;gap:var(--space-5);margin-top:var(--space-6);color:#7b808a;font-size:var(--text-sm);font-weight:var(--fw-semibold);flex-wrap:wrap}
.hero-proof span::before{content:"✓";color:var(--purple);font-weight:var(--fw-black);margin-right:6px}

/* hero 우측 — 진행 보드 */
.board-frame{position:relative}
.board{position:relative;z-index:2;background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--shadow);padding:var(--space-6);max-width:440px;margin-left:auto}
.board-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5)}
.board-title{font-size:var(--text-base);font-weight:var(--fw-bold)}
.board-title small{display:block;font-family:var(--mono);font-size:11px;font-weight:500;color:var(--soft);margin-top:3px}
.dday{font-family:var(--mono);font-size:var(--text-sm);font-weight:600;color:var(--purple);background:var(--purple-soft);border-radius:var(--r-pill);padding:5px 12px}
.bar{height:8px;border-radius:99px;background:#f0f0f3;overflow:hidden;margin-bottom:6px}
.bar i{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,var(--purple),#8a84f5);animation:fill 1.4s cubic-bezier(.3,0,.2,1) .5s forwards}
@keyframes fill{to{width:68%}}
.bar-label{display:flex;justify-content:space-between;font-family:var(--mono);font-size:11px;color:var(--soft);margin-bottom:var(--space-5)}
.task{display:flex;align-items:center;gap:11px;padding:11px 0;border-top:1px solid #f3f3f6;font-size:var(--text-md);color:#3a3e46}
.task .tick{flex:none;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:var(--fw-black)}
.task.done .tick{background:var(--purple);color:#fff;opacity:0;animation:pop .35s ease forwards}
.task.done:nth-of-type(2) .tick{animation-delay:.9s}
.task.done:nth-of-type(3) .tick{animation-delay:1.15s}
.task.done:nth-of-type(4) .tick{animation-delay:1.4s}
@keyframes pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
.task.active .tick{border:2px solid var(--purple);position:relative}
.task.active .tick::after{content:"";width:6px;height:6px;border-radius:50%;background:var(--purple);animation:pulse 1.6s infinite}
.task.todo{color:#b3b6bd}
.task.todo .tick{border:2px dashed #d9dadf}
.task .who{margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--soft)}
.board-foot{display:flex;gap:var(--space-3);margin-top:var(--space-5)}
.board-foot span{font-size:var(--text-xs);font-weight:var(--fw-bold);border-radius:var(--r-pill);padding:6px 12px;background:var(--surface);color:#5a5e66}
.board-foot span.alert{background:rgba(94,86,240,.1);color:var(--purple)}
.board-caption{position:relative;z-index:2;text-align:right;max-width:440px;margin:14px 0 0 auto;font-family:var(--mono);font-size:11px;color:var(--soft)}
.board-frame::before{content:"";position:absolute;right:-40px;top:-40px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,var(--purple-soft),transparent 70%);z-index:1}

/* ── 마키 스트립 ── */
.strip{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:14px 0;overflow:hidden;background:var(--surface)}
.strip-track{display:flex;width:max-content;gap:56px;font-family:var(--mono);font-size:var(--text-sm);font-weight:500;color:#7b808a;white-space:nowrap;animation:marquee 30s linear infinite}
.strip-track b{color:var(--purple);font-weight:600;margin-right:8px}
@keyframes marquee{to{transform:translateX(-50%)}}

/* ── 공통 섹션 ── */
.section{padding:var(--section-y) 0}
.sec-no{font-family:var(--mono);font-size:var(--text-sm);font-weight:600;color:var(--purple);margin-bottom:var(--space-4);display:flex;align-items:center;gap:12px}
.sec-no::after{content:"";flex:none;width:48px;height:1px;background:#d8d6f8}
h2{font-size:var(--text-3xl);line-height:1.3;margin:0 0 var(--space-4);font-weight:var(--fw-bold);letter-spacing:var(--ls-normal);word-break:keep-all}
.desc{font-size:var(--text-lg);color:#626873;line-height:var(--lh-relaxed);margin:0;max-width:var(--max-copy);word-break:keep-all}

/* ── 01 비교 ── */
.compare{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-top:var(--space-12)}
.compare-col{border-radius:var(--r-lg);padding:var(--space-8)}
.compare-col.bad{background:var(--surface);border:1px solid var(--line)}
.compare-col.good{background:#13121f;color:#fff;box-shadow:var(--shadow)}
.compare-col h3{font-size:var(--text-lg);margin:0 0 var(--space-6);display:flex;align-items:center;gap:8px}
.compare-col.bad h3{color:#8b9099}
.compare-col.good h3 .mono{font-size:11px;color:#a7a2f8;background:rgba(94,86,240,.25);border-radius:var(--r-pill);padding:4px 10px}
.compare-row{display:flex;gap:11px;padding:13px 0;border-top:1px solid rgba(127,127,140,.16);font-size:var(--text-md);line-height:1.55;word-break:keep-all}
.compare-col.bad .compare-row{color:#7b808a}
.compare-col.bad .compare-row::before{content:"✕";flex:none;color:#c2c5cb;font-weight:var(--fw-black)}
.compare-col.good .compare-row{color:#e8e7f2}
.compare-col.good .compare-row::before{content:"✓";flex:none;color:#8a84f5;font-weight:var(--fw-black)}

/* ── 02 프로세스 레일 ── */
.steps{margin-top:var(--space-12);display:grid;gap:0}
.step{display:grid;grid-template-columns:120px 1fr;gap:var(--space-10);padding:var(--space-10) 0;border-top:1px solid var(--line);align-items:start}
.step:last-child{border-bottom:1px solid var(--line)}
.step-no{font-family:var(--mono);font-size:var(--text-sm);font-weight:600;color:var(--soft);padding-top:4px}
.step-no b{display:block;font-size:28px;font-weight:600;color:var(--ink);margin-top:2px}
.step-body{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-10);align-items:center}
.step h3{font-size:var(--text-2xl);margin:0 0 var(--space-3);font-weight:var(--fw-bold)}
.step p{margin:0;color:#626873;font-size:var(--text-base);line-height:var(--lh-relaxed);word-break:keep-all}
.step-chip{margin-top:var(--space-4);display:inline-flex;font-family:var(--mono);font-size:11px;color:var(--purple);background:var(--purple-soft);border-radius:var(--r-pill);padding:5px 12px}
.step-visual{border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface);padding:var(--space-5);font-size:var(--text-sm)}
.sv-row{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #e7e7ec;border-radius:var(--r-sm);padding:11px 14px;margin:7px 0;color:#3a3e46}
.sv-row b{font-weight:var(--fw-bold)}
.sv-row .tag{font-family:var(--mono);font-size:10px;border-radius:var(--r-pill);padding:3px 9px;background:var(--surface);color:#7b808a}
.sv-row .tag.p{background:var(--purple-soft);color:var(--purple)}
.sv-row .tag.g{background:rgba(49,165,82,.1);color:var(--green)}

/* ── 03 Pricing ── */
.price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-top:var(--space-12);align-items:stretch}
.price-card{border:1px solid var(--line);border-radius:var(--r-lg);padding:var(--space-8);display:flex;flex-direction:column;background:#fff;position:relative}
.price-card.featured{border-color:var(--purple);box-shadow:0 16px 48px rgba(94,86,240,.14)}
.badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--purple);color:#fff;font-size:var(--text-xs);font-weight:var(--fw-bold);border-radius:var(--r-pill);padding:5px 14px;white-space:nowrap}
.price-name{font-size:var(--text-lg);font-weight:var(--fw-bold)}
.price-for{font-size:var(--text-sm);color:var(--soft);margin-top:4px}
.price-num{margin:var(--space-6) 0 var(--space-2);font-size:40px;font-weight:var(--fw-black);letter-spacing:var(--ls-tight)}
.price-num small{font-size:var(--text-base);font-weight:var(--fw-semibold);color:var(--muted);margin-left:2px}
.price-days{font-family:var(--mono);font-size:var(--text-xs);color:var(--purple);margin-bottom:var(--space-6)}
.price-list{flex:1;margin:0 0 var(--space-8);padding:0;list-style:none;border-top:1px solid var(--line)}
.price-list li{padding:11px 0;border-bottom:1px solid #f3f3f6;font-size:var(--text-md);color:#3a3e46;display:flex;gap:9px}
.price-list li::before{content:"✓";color:var(--purple);font-weight:var(--fw-black)}
.price-cta{display:block;text-align:center;border-radius:var(--r-sm);padding:13px;font-size:var(--text-md);font-weight:var(--fw-bold);border:1px solid #d9dadf;color:var(--ink);cursor:pointer;transition:.18s}
.price-cta:hover{border-color:var(--purple);color:var(--purple)}
.price-card.featured .price-cta{background:var(--purple);border-color:var(--purple);color:#fff}
.price-card.featured .price-cta:hover{background:var(--purple-dark)}
.price-note{margin-top:var(--space-8);text-align:center;font-size:var(--text-sm);color:var(--soft)}
.price-note b{color:#5a5e66}

/* ── 04 사례 ── */
.proof-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-top:var(--space-12)}
.proof-card{border:1px solid var(--line);border-radius:var(--r-lg);padding:var(--space-8);background:#fff;transition:.2s;display:flex;flex-direction:column}
.proof-card:hover{border-color:#d8d6f8;box-shadow:var(--shadow-sm);transform:translateY(-3px)}
.proof-cat{font-family:var(--mono);font-size:11px;color:var(--soft);margin-bottom:var(--space-8)}
.proof-stat{font-size:48px;font-weight:var(--fw-black);letter-spacing:var(--ls-tight);color:var(--purple);line-height:1}
.proof-stat small{font-size:.4em;font-weight:var(--fw-bold);margin-left:3px}
.proof-label{font-size:var(--text-md);font-weight:var(--fw-bold);margin:var(--space-3) 0 var(--space-6)}
.proof-quote{flex:1;margin:0;font-size:var(--text-md);color:#626873;line-height:var(--lh-relaxed);word-break:keep-all;border-top:1px solid var(--line);padding-top:var(--space-5)}
.proof-author{margin-top:var(--space-4);font-size:var(--text-xs);color:var(--soft)}

/* ── 05 FAQ ── */
.faq{max-width:760px;margin:var(--space-12) auto 0}
.faq details{border-top:1px solid var(--line)}
.faq details:last-child{border-bottom:1px solid var(--line)}
.faq summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:22px 4px;font-size:var(--text-lg);font-weight:var(--fw-bold)}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-size:22px;font-weight:400;color:var(--soft);transition:.2s}
.faq details[open] summary::after{transform:rotate(45deg);color:var(--purple)}
.faq .a{padding:0 4px 24px;color:#626873;font-size:var(--text-base);line-height:var(--lh-relaxed);word-break:keep-all;max-width:640px}

/* ── 최종 CTA ── */
.final{background:#13121f;color:#fff;padding:var(--space-24) 0;text-align:center;position:relative;overflow:hidden}
.final::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(60% 90% at 50% 100%,#000 20%,transparent 100%)}
.final .wrap{position:relative}
.final h2{color:#fff;font-size:var(--text-3xl)}
.final p{color:#a4a2b8;font-size:var(--text-lg);margin:0 0 var(--space-10)}
.final .search-cta{margin:0 auto;border-color:rgba(255,255,255,.14);background:#fff}
.final .hero-proof{justify-content:center;color:#8e8ca4}

/* ── Footer ── */
.footer{padding:var(--space-12) 0;border-top:1px solid var(--line)}
.footer-inner{display:flex;align-items:center;justify-content:space-between;gap:var(--space-6);flex-wrap:wrap}
.footer-meta{font-size:var(--text-sm);color:var(--soft);line-height:1.8}
.footer-links{display:flex;gap:var(--space-6);font-size:var(--text-sm);font-weight:var(--fw-semibold);color:#5a5e66}

/* ── 스크롤 리빌 ── */
.rv{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,0,.2,1)}
.rv.in{opacity:1;transform:none}
.rv-d1{transition-delay:.08s}.rv-d2{transition-delay:.16s}.rv-d3{transition-delay:.24s}
@media (prefers-reduced-motion: reduce){
  .rv{opacity:1;transform:none;transition:none}
  .bar i{animation:none;width:68%}
  .task.done .tick{animation:none;opacity:1}
  .strip-track{animation:none}
  .sys-tag::before,.task.active .tick::after{animation:none}
}

/* ── 반응형 ── */
@media(max-width:980px){
  :root{--text-hero:38px;--text-3xl:30px;--section-y:72px}
  .links{display:none}
  .hero-grid{grid-template-columns:1fr;gap:var(--space-12)}
  .board,.board-caption{margin-left:0}
  .compare{grid-template-columns:1fr}
  .step{grid-template-columns:1fr;gap:var(--space-5);padding:var(--space-8) 0}
  .step-no{display:flex;align-items:baseline;gap:10px}
  .step-no b{font-size:20px;margin:0}
  .step-body{grid-template-columns:1fr;gap:var(--space-6)}
  .price-grid,.proof-grid{grid-template-columns:1fr}
  .price-card.featured{order:-1}
}
`;

const body = `
  <nav class="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="#"><img class="logo-img" src="/logo.png" alt="System Web" /></a>
      <div class="links"><a href="#process">진행 방식</a><a href="#pricing">가격</a><a href="#proof">사례</a><a href="#faq">FAQ</a></div>
      <a class="pill-dark" href="#contact">5분 견적 받기</a>
    </div>
  </nav>

  <main>
    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <div class="sys-tag">SYSTEM RUNNING — 지금 2개 프로젝트 진행 중</div>
          <h1>좋은 외주는 운이 아니라<br /><em>시스템</em>입니다</h1>
          <p class="hero-copy">견적, 범위, 제작, 검수 — 판단이 필요한 모든 단계의 기준을 시스템으로 고정했습니다. 빠르게 만들어도 퀄리티가 흔들리지 않는 이유입니다.</p>
          <form class="search-cta" id="contact">
            <input placeholder="만들 사이트를 한 줄로 적어주세요" />
            <button class="go" type="button">5분 견적</button>
          </form>
          <div class="hero-proof"><span>5분 자동 견적</span><span>진행 실시간 공유</span><span>6개월 무상 보증</span></div>
        </div>
        <div class="board-frame">
          <div class="board" aria-label="고객에게 제공되는 실시간 진행 보드 예시">
            <div class="board-head">
              <div class="board-title">러닝 브랜드 자사몰 리뉴얼<small>PROJECT-027 · 카페24</small></div>
              <span class="dday">D-12</span>
            </div>
            <div class="bar"><i></i></div>
            <div class="bar-label"><span>전체 진행률</span><span>68%</span></div>
            <div class="task done"><span class="tick">✓</span>범위 문서 확정<span class="who">06.02</span></div>
            <div class="task done"><span class="tick">✓</span>메인·상세 페이지 디자인<span class="who">06.05</span></div>
            <div class="task done"><span class="tick">✓</span>결제·배송 세팅<span class="who">06.08</span></div>
            <div class="task active"><span class="tick"></span>카페24 스킨 개발<span class="who">진행 중</span></div>
            <div class="task todo"><span class="tick"></span>체크리스트 검수<span class="who">대기</span></div>
            <div class="board-foot"><span class="alert">확인 요청 2건</span><span>오늘 업데이트 3회</span></div>
          </div>
          <p class="board-caption">↑ 고객에게 드리는 실시간 진행 페이지 예시</p>
        </div>
      </div>
    </section>

    <div class="strip" aria-hidden="true">
      <div class="strip-track">
        <span><b>01</b>5분 자동 견적</span><span><b>02</b>범위 문서 고정</span><span><b>03</b>진행 실시간 공유</span><span><b>04</b>체크리스트 검수</span><span><b>05</b>6개월 무상 보증</span><span><b>—</b>랜딩 30 · 홈 100 · 자사몰 300</span>
        <span><b>01</b>5분 자동 견적</span><span><b>02</b>범위 문서 고정</span><span><b>03</b>진행 실시간 공유</span><span><b>04</b>체크리스트 검수</span><span><b>05</b>6개월 무상 보증</span><span><b>—</b>랜딩 30 · 홈 100 · 자사몰 300</span>
      </div>
    </div>

    <section class="section">
      <div class="wrap">
        <div class="rv"><div class="sec-no">01 — WHY SYSTEM</div>
        <h2>빠른 외주의 퀄리티가 출렁이는 이유</h2>
        <p class="desc">사람의 감으로 매번 판단하면, 바쁠수록 빠뜨리고 흔들립니다. 그래서 외주에서 반복되는 판단을 전부 체크리스트와 자동화로 고정했습니다. 빨라도 기준 아래로 내려가지 않습니다.</p></div>
        <div class="compare">
          <div class="compare-col bad rv">
            <h3>감으로 만들 때</h3>
            <div class="compare-row">견적이 담당자와 타이밍에 따라 달라집니다</div>
            <div class="compare-row">작업 중 범위가 슬금슬금 늘어나고 일정이 밀립니다</div>
            <div class="compare-row">진행 상황은 물어봐야만 알 수 있습니다</div>
            <div class="compare-row">오픈 직전에 빠진 항목이 발견됩니다</div>
            <div class="compare-row">오픈하고 나면 연락이 잘 닿지 않습니다</div>
          </div>
          <div class="compare-col good rv rv-d1">
            <h3>시스템으로 만들 때 <span class="mono">SYSTEM WEB</span></h3>
            <div class="compare-row">같은 범위면 누가, 언제 물어도 같은 가격</div>
            <div class="compare-row">시작 전 '필수 / 나중'을 문서로 고정해 범위가 안 부풉니다</div>
            <div class="compare-row">전용 페이지에서 진행률·확인 요청이 실시간으로 보입니다</div>
            <div class="compare-row">오픈 전 체크리스트 전 항목을 검수합니다</div>
            <div class="compare-row">출시 후 6개월, 기본 오류는 무상으로 고칩니다</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="process" style="padding-top:0">
      <div class="wrap">
        <div class="rv"><div class="sec-no">02 — HOW IT WORKS</div>
        <h2>맡기면 이렇게 진행됩니다</h2>
        <p class="desc">네 단계, 모두 기록이 남고 모두 눈으로 확인할 수 있습니다.</p></div>
        <div class="steps">
          <div class="step rv">
            <div class="step-no">STEP<b>01</b></div>
            <div class="step-body">
              <div>
                <h3>견적</h3>
                <p>만들 사이트를 한 줄로 적으면 5분 안에 범위·가격·일정이 나옵니다. 표준 범위를 벗어나면 1영업일 안에 견적서를 드립니다.</p>
                <span class="step-chip">평균 소요 5분</span>
              </div>
              <div class="step-visual">
                <div class="sv-row"><b>러닝 브랜드 자사몰</b><span class="tag p">입력</span></div>
                <div class="sv-row"><b>자사몰 패키지 · 300만원 · 21일</b><span class="tag g">산출 완료</span></div>
              </div>
            </div>
          </div>
          <div class="step rv">
            <div class="step-no">STEP<b>02</b></div>
            <div class="step-body">
              <div>
                <h3>범위 고정</h3>
                <p>시작 전에 '마감 전 필수'와 '오픈 후 개선'을 나눠 문서로 고정합니다. 작업 중 범위가 부풀어 일정이 밀리는 일을 구조적으로 막습니다.</p>
                <span class="step-chip">범위 문서 1부 공유</span>
              </div>
              <div class="step-visual">
                <div class="sv-row"><b>결제·문의 연결</b><span class="tag p">필수</span></div>
                <div class="sv-row"><b>관리자 통계 화면</b><span class="tag">오픈 후</span></div>
              </div>
            </div>
          </div>
          <div class="step rv">
            <div class="step-no">STEP<b>03</b></div>
            <div class="step-body">
              <div>
                <h3>제작 + 실시간 공유</h3>
                <p>제작 중 진행률, 완료 항목, 확인 요청이 전용 페이지에 실시간으로 올라갑니다. "지금 어디까지 됐나요?"를 물을 필요가 없습니다.</p>
                <span class="step-chip">전용 진행 페이지 제공</span>
              </div>
              <div class="step-visual">
                <div class="sv-row"><b>메인 페이지 개발</b><span class="tag g">완료</span></div>
                <div class="sv-row"><b>CTA 문구 확인 요청</b><span class="tag p">고객 확인 대기</span></div>
              </div>
            </div>
          </div>
          <div class="step rv">
            <div class="step-no">STEP<b>04</b></div>
            <div class="step-body">
              <div>
                <h3>검수 + 6개월 보증</h3>
                <p>오픈 전 반응형·속도·폼 동작까지 체크리스트 전 항목을 검수합니다. 출시 후 6개월간 기본 오류는 무상으로 고칩니다.</p>
                <span class="step-chip">보증 기간 6개월</span>
              </div>
              <div class="step-visual">
                <div class="sv-row"><b>모바일 반응형 점검</b><span class="tag g">통과</span></div>
                <div class="sv-row"><b>무상 보증</b><span class="tag p">~ 2026.12</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="pricing" style="padding-top:0">
      <div class="wrap">
        <div class="rv"><div class="sec-no">03 — PRICING</div>
        <h2>가격을 먼저 공개합니다</h2>
        <p class="desc">견적을 받아봐야 아는 가격이 아닙니다. 표준 범위는 이 가격 그대로 진행합니다.</p></div>
        <div class="price-grid">
          <div class="price-card rv">
            <div class="price-name">랜딩 페이지</div>
            <div class="price-for">캠페인 · 사전예약 · 단일 상품</div>
            <div class="price-num">30<small>만원</small></div>
            <div class="price-days">제작 5일</div>
            <ul class="price-list">
              <li>1페이지 반응형 제작</li>
              <li>문의 폼 · 카카오톡 채널 연결</li>
              <li>기본 SEO 세팅</li>
              <li>6개월 무상 보증</li>
            </ul>
            <a class="price-cta" href="#contact">이 범위로 견적 받기</a>
          </div>
          <div class="price-card featured rv rv-d1">
            <span class="badge">가장 많이 선택</span>
            <div class="price-name">홈페이지</div>
            <div class="price-for">기업 · 시공사 · 브랜드 소개</div>
            <div class="price-num">100<small>만원</small></div>
            <div class="price-days">제작 10일</div>
            <ul class="price-list">
              <li>5페이지 내외 반응형 제작</li>
              <li>문의 · 예약 폼 연결</li>
              <li>기본 SEO · 애널리틱스 세팅</li>
              <li>직접 수정 가능한 관리 가이드</li>
              <li>6개월 무상 보증</li>
            </ul>
            <a class="price-cta" href="#contact">이 범위로 견적 받기</a>
          </div>
          <div class="price-card rv rv-d2">
            <div class="price-name">자사몰</div>
            <div class="price-for">D2C · 쇼핑몰 구축 · 리뉴얼</div>
            <div class="price-num">300<small>만원</small></div>
            <div class="price-days">제작 21일</div>
            <ul class="price-list">
              <li>카페24 · 아임웹 구축</li>
              <li>결제 · 배송 · 회원 세팅</li>
              <li>기획전 · 상세 페이지 템플릿</li>
              <li>주문 알림 자동화 연결</li>
              <li>6개월 무상 보증</li>
            </ul>
            <a class="price-cta" href="#contact">이 범위로 견적 받기</a>
          </div>
        </div>
        <p class="price-note rv">모든 패키지 공통 — <b>진행 실시간 공유 · 1영업일 내 견적서 발급 · 세금계산서 발행</b></p>
      </div>
    </section>

    <section class="section" id="proof" style="padding-top:0">
      <div class="wrap">
        <div class="rv"><div class="sec-no">04 — PROOF</div>
        <h2>시스템으로 만든 결과입니다</h2>
        <p class="desc">그럴듯한 시안이 아니라, 오픈해서 검증된 실제 제작 사례입니다.</p></div>
        <div class="proof-grid">
          <div class="proof-card rv">
            <div class="proof-cat">CASE 01 — 자사몰 · 카페24</div>
            <div class="proof-stat">2.1<small>배</small></div>
            <div class="proof-label">리뉴얼 후 구매 전환</div>
            <p class="proof-quote">"필수 기능부터 잡고 빠르게 오픈한 뒤 데이터를 보며 개선했어요. 일정도 퀄리티도 놓치지 않았습니다."</p>
            <div class="proof-author">러닝화 D2C 브랜드 · 마케팅 담당</div>
          </div>
          <div class="proof-card rv rv-d1">
            <div class="proof-cat">CASE 02 — 홈페이지</div>
            <div class="proof-stat">3.4<small>배</small></div>
            <div class="proof-label">월 온라인 견적 문의</div>
            <p class="proof-quote">"시공 포트폴리오와 문의 흐름이 믿음직하게 정리되니, 전화보다 온라인 문의가 늘었습니다."</p>
            <div class="proof-author">인테리어 시공사 · 대표</div>
          </div>
          <div class="proof-card rv rv-d2">
            <div class="proof-cat">CASE 03 — 플랫폼 MVP</div>
            <div class="proof-stat">21<small>일</small></div>
            <div class="proof-label">기획부터 베타 오픈까지</div>
            <p class="proof-quote">"핵심 화면과 가입·문의 플로우를 먼저 구현해, 빠르게 사용자 반응을 확인했습니다."</p>
            <div class="proof-author">초기 스타트업 · 대표</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="faq" style="padding-top:0">
      <div class="wrap">
        <div class="rv" style="text-align:center"><div class="sec-no" style="justify-content:center">05 — FAQ</div>
        <h2>자주 묻는 질문</h2></div>
        <div class="faq rv">
          <details>
            <summary>정말 5분 만에 견적이 나오나요?</summary>
            <div class="a">표준 범위(랜딩·홈·자사몰 패키지)는 자동 산출되어 5분 안에 범위·가격·일정을 받아보실 수 있습니다. 표준을 벗어나는 요구사항은 1영업일 안에 견적서로 드립니다.</div>
          </details>
          <details>
            <summary>진행 상황은 어떻게 확인하나요?</summary>
            <div class="a">계약과 동시에 전용 진행 페이지 링크를 드립니다. 진행률, 완료 항목, 확인이 필요한 요청이 실시간으로 올라가므로 묻지 않아도 현재 상태를 알 수 있습니다.</div>
          </details>
          <details>
            <summary>6개월 무상 보증은 어디까지 포함되나요?</summary>
            <div class="a">출시한 기능이 의도대로 동작하지 않는 오류, 화면 깨짐, 폼·결제 연결 문제를 무상으로 고칩니다. 새로운 기능 추가나 디자인 변경은 별도 견적으로 진행합니다.</div>
          </details>
          <details>
            <summary>작업 중에 요구사항이 바뀌면 어떻게 되나요?</summary>
            <div class="a">시작 전 고정한 범위 문서가 기준입니다. 범위 안의 조정은 그대로 반영하고, 범위를 벗어나는 변경은 '오픈 후 개선' 항목으로 분리하거나 추가 견적으로 안내드립니다. 일정이 모르게 밀리는 일은 없습니다.</div>
          </details>
        </div>
      </div>
    </section>

    <section class="final">
      <div class="wrap">
        <h2 class="rv">지금 만들 사이트를 한 줄로 적어주세요</h2>
        <p class="rv rv-d1">5분 안에 범위 · 가격 · 일정을 답합니다.</p>
        <form class="search-cta rv rv-d2"><input placeholder="예) 러닝 브랜드 자사몰 리뉴얼하고 싶어요" /><button class="go" type="button">5분 견적</button></form>
        <div class="hero-proof rv rv-d3"><span>랜딩 30만</span><span>홈 100만</span><span>자사몰 300만</span><span>6개월 보증</span></div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="wrap footer-inner">
      <div>
        <a class="brand"><img class="logo-img" src="/logo.png" alt="System Web" /></a>
        <p class="footer-meta">© 2026 Visible Dev — 시스템으로 만드는, 진행이 보이는 개발 외주</p>
      </div>
      <div class="footer-links"><a href="#process">진행 방식</a><a href="#pricing">가격</a><a href="#proof">사례</a><a href="#faq">FAQ</a><a href="#contact">견적 받기</a></div>
    </div>
  </footer>
`;

export default function ClaudeTestIndexPage() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // 스크롤 리빌: .rv 요소가 화면에 들어오면 1회 .in 부여 (reduce-motion은 CSS에서 처리)
    const targets = Array.from(root.querySelectorAll(".rv"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => io.observe(t));

    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
