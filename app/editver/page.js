"use client";

// /editver — 메인(/) 개선 시안
// 구성·틀은 현재 메인과 동일 (섹션 순서·레이아웃 유지), UI 디테일·카피만 개선
//   UI  : 히어로 인풋 포커스 링, 보라 CTA 기본화, 스크롤 리빌, 사례 캐러셀 도트,
//         reason 카드화 + hover, 로고 스트립 라벨, 푸터 표기 정리
//   카피: 단문·정량 톤 강화, 보증 문구 → AI 1차 견적·상세 견적 플로우로 교체 (CLAUDE.md 가격 정책)
//
// ▸ 디자인 조절은 아래 :root 토큰 블록만 수정하면 전체에 반영됩니다.
//   - 간격: --space-* (4px 리듬) / --section-y* (섹션 상하) / --hero-y
//   - 영역: --max(페이지) / --max-feature / --max-copy / --gutter
//   - 폰트: --text-* (크기) / --fw-* (굵기) / --lh-* (행간) / --ls-* (자간)
//   - 라운드: --r-* / 색: --ink, --purple, --green ...

import { useEffect, useRef } from "react";

const css = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root{
  /* ── Color ── */
  --ink:#0a0b0b;
  --muted:#666a73;
  --soft:#8d8e91;
  --line:#ececf0;
  --surface:#f7f7f8;
  --paper:#fff;
  --purple:#5e56f0;
  --purple-dark:#4d46d6;
  --purple-soft:rgba(94,86,240,.08);
  --blue:#80c7ff;
  --mint:#b9ead6;
  --pink:#efb6ff;
  --green:#31a552;

  /* ── Spacing (4px 리듬) ── */
  --space-1:4px;  --space-2:8px;   --space-3:12px;  --space-4:16px;
  --space-5:20px; --space-6:24px;  --space-7:28px;  --space-8:32px;
  --space-10:40px;--space-12:48px; --space-14:56px; --space-16:64px;
  --space-18:72px;--space-20:80px; --space-24:96px;

  /* ── 섹션 리듬 ── */
  --section-y:88px;      /* 일반 섹션 상하 패딩 */
  --section-y-lg:112px;  /* feature / omni 상하 패딩 */
  --hero-y:72px;         /* hero 상단 패딩 */

  /* ── 영역 폭 ── */
  --max:1280px;          /* 페이지 폭 (channel.io: 3-col 그리드 ≈1224 + gutter 28*2) */
  --max-feature:980px;   /* feature 폭 */
  --max-copy:880px;      /* 본문 카피 폭 */
  --hero-w:560px;        /* hero 좌측 텍스트·인풋 공통 너비 */
  --gutter:28px;         /* 좌우 여백 */

  /* ── Typography 스케일 ── */
  --text-xs:12px; --text-sm:13px; --text-md:14px;  --text-base:15px;
  --text-lg:16px; --text-xl:18px; --text-2xl:24px; --text-3xl:40px;
  --text-4xl:36px;--text-5xl:40px;--text-6xl:56px;

  /* ── 굵기 ── */
  --fw-medium:500; --fw-semibold:600; --fw-bold:700; --fw-black:800;

  /* ── 행간 ── */
  --lh-tight:1.25; --lh-snug:1.3; --lh-body:1.55; --lh-relaxed:1.8;

  /* ── 자간 ── */
  --ls-tight:-.04em; --ls-snug:-.03em; --ls-normal:-.02em; --ls-display:-.06em;

  /* ── 라운드 (channel.io) ── */
  --r-sm:8px; --r-md:12px; --r-lg:14px; --r-pill:999px;

  /* ── 그림자 ── */
  --shadow:0 12px 40px rgba(0,0,0,.08);
  --shadow-sm:0 9px 28px rgba(0,0,0,.04);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:"Pretendard","Inter","Noto Sans KR",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:#fff;letter-spacing:var(--ls-normal);line-height:var(--lh-body)}
a{text-decoration:none;color:inherit}
button,input{font:inherit}
.wrap{max-width:var(--max);margin:0 auto;padding:0 var(--gutter)}

/* ── 스크롤 리빌 (UI 개선: 섹션 페이드업) ── */
.rv{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.6,.2,1)}
.rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion: reduce){.rv{opacity:1;transform:none;transition:none}}

.nav{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.84);backdrop-filter:blur(18px);border-bottom:1px solid rgba(17,17,20,.04)}
.nav-inner{height:68px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:9px;font-weight:var(--fw-bold);letter-spacing:var(--ls-snug)}
.logo-img{height:30px;width:auto;display:block;flex:none}
.links{display:flex;align-items:center;gap:var(--space-8);color:#333740;font-size:var(--text-md);font-weight:var(--fw-semibold)}
.links a{transition:color .15s}
.links a:hover{color:var(--purple)}
.links span{color:#b3b3ba;margin-left:4px}
.nav-actions{display:flex;align-items:center;gap:var(--space-4);font-size:var(--text-md);font-weight:var(--fw-semibold)}
.pill-dark{background:#111114;color:#fff;border-radius:var(--r-pill);padding:11px 18px;font-weight:var(--fw-bold);box-shadow:0 8px 18px rgba(0,0,0,.12);transition:background .15s,transform .15s}
.pill-dark:hover{background:var(--purple);transform:translateY(-1px)}

.hero{padding:var(--hero-y) 0 var(--space-16)}
.hero-grid{display:grid;grid-template-columns:1fr 1.05fr;gap:var(--space-20);align-items:center}
.eyebrow{display:inline-flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);color:#6f7580;margin-bottom:var(--space-5);font-weight:var(--fw-semibold)}
.eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--purple);box-shadow:0 0 0 6px var(--purple-soft)}
h1{font-size:var(--text-5xl);line-height:1.4;margin:0 0 var(--space-6);font-weight:var(--fw-semibold);letter-spacing:var(--ls-normal);max-width:var(--hero-w)}
.hero-copy{color:#565b66;font-size:var(--text-lg);margin:0 0 var(--space-10);max-width:var(--hero-w);line-height:var(--lh-relaxed)}
.search-cta{width:min(var(--hero-w),100%);height:62px;border:1px solid #e2e2e8;border-radius:var(--r-pill);display:flex;align-items:center;padding:6px 8px 6px 28px;background:#fff;box-shadow:0 10px 34px rgba(20,18,40,.06);transition:border-color .15s,box-shadow .15s}
.search-cta:focus-within{border-color:var(--purple);box-shadow:0 0 0 4px var(--purple-soft),0 10px 34px rgba(20,18,40,.08)}
.search-cta input{border:0;outline:none;flex:1;color:#2d3035;font-size:var(--text-md);letter-spacing:var(--ls-normal);background:transparent}
.search-cta input::placeholder{color:#a9acb3}
.go{border:0;width:48px;height:48px;border-radius:50%;background:var(--purple);color:#fff;display:grid;place-items:center;font-size:var(--text-lg);font-weight:var(--fw-black);cursor:pointer;transition:.2s}
.go:hover{background:var(--purple-dark);transform:translateX(2px)}
.chips{display:flex;gap:7px;align-items:center;margin-top:var(--space-5);color:#a0a4ac;font-size:var(--text-xs);flex-wrap:wrap}
.chip{padding:4px 9px;border-radius:var(--r-pill);background:#f2f2f4;color:#7b808a;font-weight:var(--fw-bold);cursor:pointer;transition:background .15s,color .15s}
.chip:hover{background:var(--purple-soft);color:var(--purple)}

.hero-visual{position:relative;min-height:640px;border-radius:24px;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:32px 32px 0;background:linear-gradient(135deg,#cfe0ff 0%,#ecd8ff 32%,#ffd7ea 58%,#dfe5ff 100%);box-shadow:var(--shadow)}
.hero-visual::before{content:"";position:absolute;inset:0;background:radial-gradient(55% 45% at 22% 12%,rgba(140,175,255,.85),transparent 62%),radial-gradient(45% 40% at 82% 26%,rgba(255,150,205,.7),transparent 62%),radial-gradient(70% 55% at 55% 95%,rgba(170,150,255,.6),transparent 60%)}
.browser-pill{position:relative;z-index:2;display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.75);backdrop-filter:blur(8px);border-radius:var(--r-pill);padding:12px 22px;font-size:var(--text-sm);font-weight:var(--fw-semibold);color:#3a3550;box-shadow:0 6px 18px rgba(60,40,90,.08);margin-bottom:22px}
.demo-phone{position:relative;z-index:2;width:62%;max-width:380px;flex:1;background:#fff;border:7px solid #15151c;border-bottom:0;border-radius:34px 34px 0 0;box-shadow:0 30px 60px rgba(30,20,60,.18);padding:24px 18px;display:flex;flex-direction:column;gap:16px}
.chat-user{align-self:flex-end;max-width:80%;background:#f1f1f4;color:#2b2b30;border-radius:16px 16px 4px 16px;padding:11px 15px;font-size:var(--text-sm);line-height:1.5}
.chat-ai{align-self:flex-start;max-width:90%}
.ai-head{display:flex;align-items:center;gap:7px;font-size:var(--text-xs);font-weight:var(--fw-bold);color:#6b6f78;margin-bottom:7px}
.ai-ava{width:20px;height:20px;border-radius:6px;background:linear-gradient(135deg,#7d78f5,#ff8fcf);display:grid;place-items:center;font-size:11px;color:#fff}
.ai-msg{background:#f6f6f8;border-radius:4px 16px 16px 16px;padding:12px 15px;font-size:var(--text-sm);line-height:1.6;color:#33363d}
.typing{display:inline-flex;gap:4px;align-items:center;background:#f6f6f8;border-radius:4px 16px 16px 16px;padding:14px 16px}
.typing i{width:6px;height:6px;border-radius:50%;background:#b8bac2;animation:blink 1.2s infinite}
.typing i:nth-child(2){animation-delay:.2s}.typing i:nth-child(3){animation-delay:.4s}
@keyframes blink{0%,60%,100%{opacity:.35}30%{opacity:1}}
@media (prefers-reduced-motion: reduce){.typing i{animation:none;opacity:.6}}

.logos{padding:var(--space-8) 0 var(--space-20)}
.logo-label{text-align:center;font-size:var(--text-xs);font-weight:var(--fw-bold);color:#a4a8b0;letter-spacing:.08em;margin-bottom:var(--space-8)}
.logo-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:var(--space-10);align-items:center;opacity:.72}
.logo{height:30px;display:flex;align-items:center;justify-content:center;color:#26272b;font-weight:var(--fw-black);font-size:var(--text-lg);filter:grayscale(1)}
.logo.light{color:#b6b8bf}
.logo-cta{justify-self:center;background:#111;color:#fff;border-radius:var(--r-pill);padding:11px 18px;font-size:var(--text-xs);font-weight:var(--fw-black);transition:background .15s}
.logo-cta:hover{background:var(--purple)}

.section{padding:var(--section-y) 0}
.section.center{text-align:center}
.kicker{font-size:var(--text-md);font-weight:var(--fw-bold);color:var(--purple);margin-bottom:var(--space-3)}
h2{font-size:var(--text-3xl);line-height:1.4;margin:0 0 var(--space-4);font-weight:var(--fw-semibold);letter-spacing:var(--ls-normal);word-break:keep-all}
.desc{font-size:var(--text-xl);color:#626873;line-height:var(--lh-body);margin:0 auto;max-width:var(--max-copy)}

.quality-chart{margin:var(--space-16) auto 0;background:#fafafa;border:1px solid #efeff2;border-radius:var(--r-lg);padding:var(--space-10) var(--space-12)}
.quality-chart svg{width:100%;height:auto;display:block}
@media(max-width:520px){.quality-chart{padding:var(--space-6) var(--space-5)}}
.quality-chart .q-area,.quality-chart .q-line-2,.quality-chart .q-dots,.quality-chart .q-label{opacity:0}
.quality-chart .q-line{stroke-dasharray:1;stroke-dashoffset:1}
.quality-chart.in-view .q-area{animation:q-fade .6s ease .1s both}
.quality-chart.in-view .q-line{animation:q-draw 1.1s cubic-bezier(.33,0,.2,1) .15s both}
.quality-chart.in-view .q-line-2{animation:q-fade .8s ease .55s both}
.quality-chart.in-view .q-dots{animation:q-fade .5s ease .95s both}
.quality-chart.in-view .q-label{animation:q-fade .5s ease 1.2s both}
@keyframes q-draw{to{stroke-dashoffset:0}}
@keyframes q-fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion: reduce){.quality-chart .q-area,.quality-chart .q-line-2,.quality-chart .q-dots,.quality-chart .q-label{opacity:1}.quality-chart .q-line{stroke-dashoffset:0}.quality-chart.in-view .q-area,.quality-chart.in-view .q-line,.quality-chart.in-view .q-line-2,.quality-chart.in-view .q-dots,.quality-chart.in-view .q-label{animation:none}}

/* 사례 — 탭 + 대형 인터뷰 카드 캐러셀 (channel.io 레퍼런스 레이아웃) */
.case-tabs{display:flex;align-items:center;justify-content:center;gap:var(--space-4);margin-bottom:var(--space-8);flex-wrap:wrap}
.case-tabs .tab-group{display:flex;align-items:center;gap:var(--space-1);background:#f1f1f3;border-radius:var(--r-pill);padding:5px}
.case-tabs .tab-group a{padding:9px 18px;border-radius:var(--r-pill);font-size:var(--text-md);font-weight:var(--fw-semibold);color:#5a5e66;white-space:nowrap;cursor:pointer;transition:color .15s}
.case-tabs .tab-group a.active{background:#fff;color:#111;box-shadow:0 2px 8px rgba(0,0,0,.1)}
.case-tabs .tab-all{font-size:var(--text-md);font-weight:var(--fw-semibold);color:#8b9099;white-space:nowrap;cursor:pointer}
.case-stage{position:relative}
.case-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;border-radius:20px;scrollbar-width:none;-ms-overflow-style:none}
.case-track::-webkit-scrollbar{display:none}
.case-card{flex:0 0 100%;scroll-snap-align:center;position:relative;min-height:600px;border-radius:20px;overflow:hidden;color:#fff;display:flex;align-items:center;background-size:cover;background-position:center right}
.case-card::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(28,24,22,.92) 0%,rgba(28,24,22,.72) 38%,rgba(28,24,22,.25) 68%,rgba(28,24,22,.05) 100%)}
.case-1{background-image:linear-gradient(120deg,#2a2622,#4a4038 60%,#6b5d4f)}
.case-2{background-image:linear-gradient(120deg,#1c2330,#28324a 60%,#3c4a68)}
.case-3{background-image:linear-gradient(120deg,#241c2c,#352a44 60%,#4a3c5e)}
.case-inner{position:relative;z-index:2;padding:var(--space-16) var(--space-14) var(--space-16) var(--space-24);max-width:600px}
.case-brand{font-size:var(--text-2xl);font-weight:var(--fw-black);letter-spacing:.06em;margin-bottom:var(--space-8)}
.case-stat{font-size:64px;line-height:1;font-weight:var(--fw-black);letter-spacing:var(--ls-display)}
.case-stat small{font-size:.42em;font-weight:var(--fw-bold);margin-left:4px;vertical-align:8px}
.case-stat-label{font-size:var(--text-lg);font-weight:var(--fw-semibold);margin:var(--space-3) 0 var(--space-7)}
.case-quote{font-size:var(--text-lg);font-weight:var(--fw-bold);line-height:1.7;max-width:480px;margin:0}
.case-quote em{display:block;margin-top:var(--space-2);font-style:normal;font-weight:var(--fw-medium);opacity:.55;font-size:var(--text-sm)}
.case-author{margin-top:var(--space-5);font-size:var(--text-sm);color:rgba(255,255,255,.78)}
.case-more{display:inline-block;margin-top:var(--space-8);font-size:var(--text-sm);font-weight:var(--fw-bold);cursor:pointer;transition:opacity .15s}
.case-more:hover{opacity:.75}
.case-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:4;width:48px;height:48px;border-radius:50%;border:0;background:rgba(255,255,255,.22);backdrop-filter:blur(6px);color:#fff;cursor:pointer;font-size:24px;line-height:1;display:grid;place-items:center;transition:background .15s}
.case-nav:hover{background:rgba(255,255,255,.4)}
.case-nav.prev{left:18px}.case-nav.next{right:18px}
.case-dots{display:flex;justify-content:center;gap:8px;margin-top:var(--space-5)}
.case-dots button{width:8px;height:8px;border-radius:var(--r-pill);border:0;padding:0;background:#d9d9df;cursor:pointer;transition:width .2s,background .2s}
.case-dots button.active{width:22px;background:var(--purple)}
@media(max-width:900px){.case-card{min-height:480px}.case-inner{padding:var(--space-12) var(--space-8)}.case-stat{font-size:48px}}

/* 지식 시스템 보드 — status frame(흰 패널 + 상태 행) 스타일. 행들이 차례로 대기→✓ 완료로 점검되는 데모 */
.kboard{margin-top:var(--space-14);background:linear-gradient(135deg,#e7ecff 0%,#f1e7ff 55%,#ffe9f4 100%);border-radius:var(--r-lg);padding:var(--space-10) var(--space-8);position:relative;overflow:hidden;box-shadow:var(--shadow)}
.kboard-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-8)}
.kboard-title{display:flex;align-items:center;gap:9px;font-size:var(--text-sm);font-weight:var(--fw-bold);color:#4a4566;letter-spacing:.06em}
.kboard-title::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--green);animation:blink 1.2s infinite}
.kboard-zero{font-size:var(--text-sm);font-weight:var(--fw-bold);color:var(--green);background:rgba(255,255,255,.7);border-radius:var(--r-pill);padding:6px 14px}
.kpanels{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4)}
.kpanel{background:#fff;border-radius:var(--r-md);box-shadow:0 28px 70px rgba(27,36,61,.16);padding:var(--space-4);text-align:left}
.kpanel-t{font-size:var(--text-sm);font-weight:var(--fw-bold);color:#343943;padding:2px 4px 10px}
.krow{height:38px;border:1px solid #edf0f4;border-radius:var(--r-sm);margin:var(--space-2) 0;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font-size:var(--text-xs);color:#343943}
.krow b{font-weight:var(--fw-semibold)}
.krow .st{position:relative;min-width:52px;text-align:right;font-weight:var(--fw-bold)}
.krow .st i{font-style:normal;position:absolute;right:0;top:50%;transform:translateY(-50%);white-space:nowrap}
.krow .st .w{color:#a9acb3}
.krow .st .d{color:var(--purple);opacity:0}
.kboard.in-view .krow{animation:k-row 9.6s ease infinite;animation-delay:calc(var(--d)*1s)}
.kboard.in-view .krow .w{animation:k-wait 9.6s ease infinite;animation-delay:calc(var(--d)*1s)}
.kboard.in-view .krow .d{animation:k-done 9.6s ease infinite;animation-delay:calc(var(--d)*1s)}
@keyframes k-row{0%,2%{border-color:#edf0f4;background:#fff}5%,80%{border-color:#d8d5f9;background:#fbfaff}90%,100%{border-color:#edf0f4;background:#fff}}
@keyframes k-wait{0%,3%{opacity:1}6%,80%{opacity:0}90%,100%{opacity:1}}
@keyframes k-done{0%,3%{opacity:0;transform:translateY(-50%) scale(.7)}7%,80%{opacity:1;transform:translateY(-50%) scale(1)}90%,100%{opacity:0}}
@media (prefers-reduced-motion: reduce){.kboard.in-view .krow,.kboard.in-view .krow .w,.kboard.in-view .krow .d{animation:none}.krow .st .w{opacity:0}.krow .st .d{opacity:1}.kboard-title::before{animation:none}}
@media(max-width:900px){.kpanels{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.kpanels{grid-template-columns:1fr}.kboard{padding:var(--space-6) var(--space-5)}}

.reason-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4);margin-top:var(--space-16);text-align:left}
.reason{background:#fff;border:1px solid #ececf0;border-radius:var(--r-lg);padding:var(--space-6);transition:transform .2s,box-shadow .2s,border-color .2s}
.reason:hover{transform:translateY(-3px);box-shadow:var(--shadow-sm);border-color:#dedcf8}
.reason .ico{width:28px;height:28px;border-radius:var(--r-sm);border:1px solid #e8e8ee;display:grid;place-items:center;margin-bottom:var(--space-4);color:var(--purple);font-weight:var(--fw-black);background:var(--purple-soft)}.reason h3{font-size:var(--text-lg);margin:0 0 var(--space-2)}.reason p{font-size:var(--text-sm);color:#69707b;line-height:var(--lh-relaxed);margin:0}

.feature{padding:var(--section-y-lg) 0}.feature-head{margin-bottom:var(--space-10)}.feature-head .kicker{text-align:left}.feature-head .desc{margin:0;max-width:720px}
.feature-grid{display:grid;grid-template-columns:2fr 1fr;gap:var(--space-6);align-items:stretch}.visual-card{border-radius:var(--r-lg);min-height:280px;position:relative;overflow:hidden;box-shadow:var(--shadow)}.visual-blue{background:linear-gradient(135deg,#9ed1ff,#6fa8ff)}.visual-pink{background:linear-gradient(135deg,#f0b4ff,#c4b9ff)}.visual-dark{background:radial-gradient(circle at 60% 15%,#8d7c9d,transparent 34%),linear-gradient(135deg,#140816,#2d1938 45%,#050307)}.visual-green{background:linear-gradient(135deg,#d9ebe6,#b8d4cd)}.visual-lavender{background:linear-gradient(135deg,#d7d6ff,#f2d5ff)}
.panel-fake{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:66%;border-radius:var(--r-md);background:#fff;box-shadow:0 28px 70px rgba(27,36,61,.16);padding:var(--space-4)}.row{height:38px;border:1px solid #edf0f4;border-radius:var(--r-sm);margin:var(--space-2) 0;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font-size:var(--text-xs);color:#343943}.switch{width:32px;height:18px;border-radius:99px;background:#31a552;position:relative}.switch::after{content:"";position:absolute;width:14px;height:14px;right:2px;top:2px;background:#fff;border-radius:50%}.chat-card{border-radius:var(--r-lg);background:#fafafa;border:1px solid #efeff2;min-height:280px;padding:var(--space-8) var(--space-6);display:flex;flex-direction:column;justify-content:center;gap:var(--space-3)}.chat-line{max-width:230px;background:#fff;border:1px solid #e5e5ea;border-radius:var(--r-pill);padding:12px 16px;font-size:var(--text-sm);color:#555b66}.chat-line.me{margin-left:auto;background:#111;color:#fff}.before-after{margin-top:var(--space-4);display:flex;gap:18px;justify-content:center;color:#a0a3aa;font-size:var(--text-xs);font-weight:var(--fw-black)}.before-after b{color:#111;background:#fff;padding:6px 12px;border-radius:var(--r-pill);box-shadow:0 4px 14px rgba(0,0,0,.05)}
.caption-grid{display:grid;grid-template-columns:2fr 1fr;gap:var(--space-6);margin-top:var(--space-4)}.caption h3{font-size:var(--text-xl);margin:0 0 var(--space-2)}.caption p{font-size:var(--text-sm);line-height:var(--lh-relaxed);color:#59606b;margin:0}.caption b{color:#111}

.omni{background:#f6f3ef;padding:var(--section-y-lg) 0;text-align:center}.app-shot{margin:var(--space-14) auto 0;max-width:760px;height:430px;border-radius:var(--r-lg);background:#fff;box-shadow:0 30px 80px rgba(0,0,0,.1);border:1px solid #eee;display:grid;grid-template-columns:160px 1fr 170px;overflow:hidden;text-align:left}.side{background:#f6f6f8;border-right:1px solid #ececf0;padding:var(--space-5)}.side .dot{width:8px;height:8px;border-radius:50%;background:#ff5f57;box-shadow:16px 0 #ffbd2e,32px 0 #28c840;margin-bottom:var(--space-5)}.list-item{height:26px;border-radius:var(--r-sm);background:#e9e9ef;margin-bottom:var(--space-2)}.chat-main{padding:var(--space-6)}.msg{background:#f0eefb;border-radius:var(--r-lg);padding:12px 14px;margin:var(--space-3) 0;font-size:var(--text-sm)}.profile{padding:var(--space-6);background:#fbfbfc;border-left:1px solid #ececf0}.avatar{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#ffd7c0,#b9ead6);margin-bottom:var(--space-4)}.channel-icons{display:flex;justify-content:center;gap:var(--space-6);margin-top:var(--space-8);color:#a4a4aa;font-weight:var(--fw-black);font-size:var(--text-xl)}

.human-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-top:var(--space-14)}.human-card{min-height:250px;border-radius:var(--r-lg);background:#f4efe7;padding:var(--space-6);position:relative;overflow:hidden}.human-card:nth-child(2){background:#dfeede}.human-card:nth-child(3){background:#dfeeff}.mini-panel{background:rgba(255,255,255,.8);border-radius:var(--r-md);padding:var(--space-4);width:190px;box-shadow:0 12px 34px rgba(0,0,0,.07)}.phone-small{margin:8px auto 0;width:140px;height:210px;border:4px solid #15172a;border-radius:24px;background:#fff;padding:22px 14px}.tree{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);width:220px;height:120px}.tree .root{position:absolute;left:50%;top:0;transform:translateX(-50%);background:#1f2d50;color:#fff;border-radius:var(--r-pill);padding:12px 38px}.tree .node{position:absolute;bottom:0;border:1px solid #1f2d50;border-radius:var(--r-pill);padding:10px 18px;background:rgba(255,255,255,.55);font-size:var(--text-sm)}.n1{left:0}.n2{left:76px}.n3{right:0}.human-caption{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);text-align:left;margin-top:var(--space-4)}.human-caption h3{margin:0 0 var(--space-2);font-size:var(--text-xl)}.human-caption p{margin:0;color:#626873;font-size:var(--text-sm);line-height:var(--lh-relaxed)}

.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3);margin-top:var(--space-18)}.stat-card{background:#f6f4f1;border-radius:var(--r-lg);padding:var(--space-6);text-align:left}.stat-card b{font-size:var(--text-4xl);display:block;letter-spacing:var(--ls-display);color:var(--purple)}.stat-card span{font-size:var(--text-sm);color:#777b84}.platform{margin-top:var(--space-3);background:#f6f4f1;border-radius:var(--r-lg);display:grid;grid-template-columns:1fr 1.3fr;gap:var(--space-3);padding:var(--space-6);text-align:left}.platform-box{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-2)}.platform-box div{background:#fff;border:1px solid #e7e4df;border-radius:var(--r-sm);padding:14px;text-align:center;font-weight:var(--fw-black);color:#555}

.final-cta{padding:var(--section-y) 0;text-align:center}.final-cta h2{font-size:var(--text-3xl)}.footer{background:#fff;margin-top:0;border-top:1px solid #e8e8ec;padding:var(--space-16) 0 var(--space-24);color:#5f636d}.footer-grid{display:grid;grid-template-columns:1.5fr repeat(5,1fr);gap:var(--space-7)}.footer h4{font-size:var(--text-sm);color:#111;margin:0 0 var(--space-4)}.footer a{display:block;font-size:var(--text-sm);margin:9px 0;color:#737780;transition:color .15s}.footer a:hover{color:var(--purple)}


@media(max-width:900px){.links{display:none}.hero-grid,.feature-grid,.caption-grid,.human-grid,.human-caption,.stats-grid,.platform,.footer-grid{grid-template-columns:1fr}.hero{padding-top:var(--space-12)}.hero-grid{gap:var(--space-8)}h1{font-size:var(--text-4xl)}.hero-visual{min-height:460px}.logo-grid{grid-template-columns:repeat(2,1fr)}.reason-grid{grid-template-columns:1fr 1fr}.app-shot{grid-template-columns:1fr;height:auto}.profile{display:none}.side{display:none}.feature{padding:var(--space-20) 0}.section{padding:var(--space-18) 0}}
`;

const body = `
  <nav class="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="#"><img class="logo-img" src="/logo.png" alt="System Web" /></a>
      <div class="links"><a>서비스 <span>⌄</span></a><a>진행방식 <span>⌄</span></a><a>사례</a><a>자료 <span>⌄</span></a></div>
      <div class="nav-actions"><a>로그인</a><a class="pill-dark" href="#contact">5분 견적 받기</a></div>
    </div>
  </nav>

  <main>
    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <div class="eyebrow">AI 1차 견적, 5분이면 나옵니다</div>
          <h1>시스템으로 만드는, 빠르고 퀄리티 있는 웹사이트·자사몰</h1>
          <p class="hero-copy">기획·디자인·개발의 기준을 시스템으로 고정했습니다.<br/>같은 일정에서, 완성도는 2배 이상 올라갑니다.</p>
          <form class="search-cta" id="contact">
            <input placeholder="예: 러닝 브랜드 자사몰을 리뉴얼하고 싶어요" />
            <button class="go" aria-label="견적 받기">↑</button>
          </form>
          <div class="chips"><span>예시로 시작하기</span><span class="chip">러닝 브랜드</span><span class="chip">시공사</span><span class="chip">플랫폼</span></div>
        </div>
        <div class="hero-visual" aria-label="견적 어시스턴트 데모 미리보기">
          <div class="browser-pill">🌐 mybrand.com</div>
          <div class="demo-phone">
            <div class="chat-user">쇼핑몰(자사몰) 만들고 싶어요</div>
            <div class="chat-ai">
              <div class="ai-head"><span class="ai-ava">✦</span> 견적 어시스턴트</div>
              <div class="ai-msg">안녕하세요! 만들 사이트와 브랜드를 알려 주시면 5분 안에 1차 견적과 일정을 정리해 드릴게요.</div>
            </div>
            <div class="chat-ai">
              <div class="typing" aria-label="입력 중"><i></i><i></i><i></i></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="logos">
      <div class="wrap">
        <div class="logo-label">함께 다루는 플랫폼 · 도구</div>
        <div class="logo-grid">
          <div class="logo">cafe24</div><div class="logo">imweb</div><div class="logo">KakaoTalk</div><div class="logo">Google Sheets</div><div class="logo">Notion</div>
          <div class="logo light">Shopify</div><div class="logo light">Airtable</div><a class="logo-cta">가능한 작업 보기 ›</a><div class="logo light">Slack</div><div class="logo light">Discord</div>
        </div>
      </div>
    </section>

    <section class="section center">
      <div class="wrap rv">
        <h2>빠른 외주는 왜 항상 퀄리티가 아쉬울까요?</h2>
        <p class="desc">급하게 만들면 판단이 즉흥적으로 변합니다. 빠뜨리는 항목이 생기고, 결과물마다 편차가 납니다.<br>그래서 반복되는 판단을 시스템으로 고정했습니다. 빨라도 기준이 흔들리지 않습니다.</p>
        <div class="quality-chart">
          <svg viewBox="0 0 880 250" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="시스템을 적용하면 퀄리티가 기준선 위에서 일정하게 유지되지만, 시스템 없이 즉흥적으로 만들면 퀄리티가 기준 아래로 출렁이는 비교 그래프">
            <path class="q-area" d="M70 118 C126 118,126 104,182 104 C238 104,238 110,294 110 C350 110,350 100,406 100 C462 100,462 106,518 106 C574 106,574 96,630 96 C686 96,686 102,740 102 L740 150 L70 150 Z" fill="rgba(94,86,240,.07)"/>
            <line x1="70" y1="150" x2="740" y2="150" stroke="#d7d7de" stroke-width="1.5" stroke-dasharray="5 5"/>
            <path class="q-line-2" d="M70 135 C126 135,126 162,182 162 C238 162,238 132,294 132 C350 132,350 178,406 178 C462 178,462 148,518 148 C574 148,574 190,630 190 C686 190,686 165,740 165" fill="none" stroke="#c5c5cb" stroke-width="2.5" stroke-dasharray="6 6" stroke-linecap="round"/>
            <path class="q-line" pathLength="1" d="M70 118 C126 118,126 104,182 104 C238 104,238 110,294 110 C350 110,350 100,406 100 C462 100,462 106,518 106 C574 106,574 96,630 96 C686 96,686 102,740 102" fill="none" stroke="#5e56f0" stroke-width="3.5" stroke-linecap="round"/>
            <g class="q-dots" fill="#c5c5cb"><circle cx="70" cy="135" r="3"/><circle cx="182" cy="162" r="3"/><circle cx="294" cy="132" r="3"/><circle cx="406" cy="178" r="3"/><circle cx="518" cy="148" r="3"/><circle cx="630" cy="190" r="3"/><circle cx="740" cy="165" r="3"/></g>
            <g class="q-dots" fill="#5e56f0"><circle cx="70" cy="118" r="4.5"/><circle cx="182" cy="104" r="4.5"/><circle cx="294" cy="110" r="4.5"/><circle cx="406" cy="100" r="4.5"/><circle cx="518" cy="106" r="4.5"/><circle cx="630" cy="96" r="4.5"/><circle cx="740" cy="102" r="4.5"/></g>
            <image class="q-label" href="/logo.png" x="748" y="93" width="100" height="18"/>
            <text class="q-label" x="752" y="168" fill="#9a9da5" font-size="14" font-weight="700">기존 외주</text>
            <text class="q-label" x="74" y="168" fill="#b4b7bf" font-size="12" font-weight="600">퀄리티 기준선</text>
            <text class="q-label" x="596" y="222" fill="#b4b7bf" font-size="12" font-weight="600">편차·누락 발생</text>
          </svg>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap rv">
        <div style="text-align:center;margin-bottom:var(--space-16)">
          <h2>시스템으로 만들어 오픈한 곳들의 실제 숫자입니다</h2>
          <p class="desc">가능성 이야기가 아닙니다. 오픈까지 끝낸 사례입니다.<br>업종별로 일정·작업 범위·진행 방식이 어떻게 달라졌는지 확인해 보세요.</p>
        </div>
        <div class="case-tabs">
          <div class="tab-group">
            <a class="active" data-cat="all">전체</a><a data-cat="commerce">자사몰</a><a data-cat="homepage">홈페이지</a><a data-cat="platform">플랫폼</a>
          </div>
          <a class="tab-all">모든 사례 보기</a>
        </div>
        <div class="case-stage">
          <button class="case-nav prev" type="button" aria-label="이전 사례">‹</button>
          <div class="case-track" id="caseTrack">
            <article class="case-card case-1" data-cat="commerce">
              <div class="case-inner">
                <div class="case-brand">러닝 브랜드 · 자사몰</div>
                <div class="case-stat">2.1<small>배</small></div>
                <div class="case-stat-label">리뉴얼 후 구매 전환</div>
                <p class="case-quote">“필수 기능부터 잡고 빠르게 오픈했어요. 그다음은 데이터를 보며 고쳤습니다. 일정도 퀄리티도 놓치지 않았어요.”<em>러닝화 D2C 자사몰 리뉴얼</em></p>
                <div class="case-author">마케팅 담당</div>
                <a class="case-more">사례 자세히 보기 ›</a>
              </div>
            </article>
            <article class="case-card case-2" data-cat="homepage">
              <div class="case-inner">
                <div class="case-brand">시공사 · 홈페이지</div>
                <div class="case-stat">3.4<small>배</small></div>
                <div class="case-stat-label">월 온라인 견적 문의</div>
                <p class="case-quote">“시공 포트폴리오와 문의 흐름을 다시 정리했더니, 전화보다 온라인 문의가 먼저 늘었습니다.”<em>인테리어 시공사 홈페이지 제작</em></p>
                <div class="case-author">대표</div>
                <a class="case-more">사례 자세히 보기 ›</a>
              </div>
            </article>
            <article class="case-card case-3" data-cat="platform">
              <div class="case-inner">
                <div class="case-brand">플랫폼 · MVP</div>
                <div class="case-stat">21<small>일</small></div>
                <div class="case-stat-label">기획부터 베타 오픈까지</div>
                <p class="case-quote">“핵심 화면과 가입·문의 플로우를 먼저 구현했습니다. 21일 만에 사용자 반응을 확인했어요.”<em>초기 스타트업 MVP 구축</em></p>
                <div class="case-author">대표</div>
                <a class="case-more">사례 자세히 보기 ›</a>
              </div>
            </article>
          </div>
          <button class="case-nav next" type="button" aria-label="다음 사례">›</button>
        </div>
        <div class="case-dots" id="caseDots" aria-label="사례 위치"></div>
      </div>
    </section>

    <section class="section">
      <div class="wrap rv">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start" class="intro-grid">
          <div><div class="kicker">제작 시스템</div><h2>경험에 기대지 않습니다. 지식이 시스템으로 돌아갑니다</h2></div>
          <p class="desc" style="margin:0">견적, UX, SEO, 운영, 배포, 인수인계 — 사람 기억에 두면 하나는 꼭 빠집니다. 그래서 전부 점검 시스템에 넣었습니다. 매 프로젝트, 같은 항목이 자동으로 확인됩니다.</p>
        </div>
        <div class="kboard" aria-label="영역별 지식이 자동 점검되는 시스템 데모">
          <div class="kboard-head">
            <div class="kboard-title">SYSTEM CHECK — 전 영역 자동 점검</div>
            <div class="kboard-zero">누락 0건</div>
          </div>
          <div class="kpanels">
            <div class="kpanel"><div class="kpanel-t">견적 · 기획</div>
              <div class="krow" style="--d:0.3"><b>범위 산정</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
              <div class="krow" style="--d:0.85"><b>일정 리스크</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
              <div class="krow" style="--d:1.4"><b>필수·나중 분류</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
            </div>
            <div class="kpanel"><div class="kpanel-t">UX · UI</div>
              <div class="krow" style="--d:1.95"><b>구매 동선</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
              <div class="krow" style="--d:2.5"><b>모바일 기준</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
              <div class="krow" style="--d:3.05"><b>폼 마찰 제거</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
            </div>
            <div class="kpanel"><div class="kpanel-t">SEO · 배포</div>
              <div class="krow" style="--d:3.6"><b>메타 · 사이트맵</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
              <div class="krow" style="--d:4.15"><b>속도 검수</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
              <div class="krow" style="--d:4.7"><b>도메인 · SSL</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
            </div>
            <div class="kpanel"><div class="kpanel-t">운영 · 인수인계</div>
              <div class="krow" style="--d:5.25"><b>주문 · CS 흐름</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
              <div class="krow" style="--d:5.8"><b>수정 가이드</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
              <div class="krow" style="--d:6.35"><b>계정 권한 이전</b><span class="st"><i class="w">대기</i><i class="d">✓ 완료</i></span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section center">
      <div class="wrap rv">
        <h2>마감 안에 ‘쓸 수 있는’ 결과물이 나오는 이유</h2>
        <p class="desc">시작 전에 목표 일정과 필수 기능을 나눕니다. 필요한 것부터 만들고, 좋은 것은 다음으로 미룹니다.</p>
        <div class="reason-grid">
          <div class="reason"><div class="ico">1</div><h3>필수 범위 구분 ›</h3><p>Must-have와 Later를 나눕니다. 마감 전 공개할 범위가 먼저 정해집니다.</p></div>
          <div class="reason"><div class="ico">2</div><h3>진행 상황 공유 ›</h3><p>남은 작업, 확인 요청, 변경 사항을 문서와 대시보드로 보여드립니다.</p></div>
          <div class="reason"><div class="ico">3</div><h3>직접 확인 가능한 결과물 ›</h3><p>페이지, 폼, 카카오톡 연결처럼 실제로 동작하는 단위로 확인합니다.</p></div>
          <div class="reason"><div class="ico">4</div><h3>개선 사항 분리 ›</h3><p>마감 이후 고도화할 항목은 따로 둡니다. 일정과 품질을 같이 지킵니다.</p></div>
        </div>
      </div>
    </section>

    <section class="feature">
      <div class="wrap rv">
        <div class="feature-head"><div class="kicker">진행 규칙</div><h2>범위가 부풀지 않게 ‘필수’와 ‘나중’을 먼저 나눕니다</h2><p class="desc">작업 범위가 커지면 오픈일이 밀립니다. 그래서 필수 기능과 추후 개선 항목을 시작 전에 분리합니다. 어떤 작업이 왜 먼저인지 고객이 확인할 수 있습니다.</p></div>
        <div class="feature-grid"><div class="visual-card visual-blue"><div class="panel-fake"><div class="row"><b>기본 CTA 연결</b><span class="switch"></span></div><div class="row"><b>카페24 모바일 배너</b><span>필수</span></div><div class="row"><b>관리자 통계 화면</b><span>추후</span></div></div></div><div class="chat-card"><div class="chat-line">지금 어떤 작업이 먼저인가요?</div><div class="chat-line">마감 전 필수는 문의 연결과 모바일 CTA입니다.</div><div class="before-after"><b>Before</b><span>After</span></div></div></div>
        <div class="caption-grid"><div class="caption"><h3>규칙 설정</h3><p><b>마감 전 반드시 필요한 것</b>과 나중에 개선해도 되는 것을 분리합니다. 일정 리스크가 내려갑니다.</p></div><div class="caption"><h3>규칙이 없을 때</h3><p>좋아 보이는 기능이 계속 늘어납니다. 정작 오픈일에 필요한 것이 늦어집니다.</p></div></div>
      </div>
    </section>

    <section class="feature">
      <div class="wrap rv">
        <div class="feature-head"><div class="kicker">상태</div><h2>기록하는 순간, 외주는 블랙박스가 아니게 됩니다</h2><p class="desc">요청사항과 진행 상태를 전부 기록합니다. 어떤 요청이 완료됐고 어떤 항목이 확인 대기인지 언제든 볼 수 있습니다.</p></div>
        <div class="feature-grid"><div class="visual-card visual-pink"><div class="panel-fake"><div class="row"><b>랜딩페이지 히어로</b><span>100%</span></div><div class="row"><b>카페24 기획전</b><span>80%</span></div><div class="row"><b>카카오톡 연결</b><span>확인중</span></div></div></div><div class="chat-card"><div class="chat-line">지금 내가 확인할 것은?</div><div class="chat-line">CTA 문구와 카카오톡 채널 연결, 2개입니다.</div><div class="chat-line me">확인했습니다.</div></div></div>
        <div class="caption-grid"><div class="caption"><h3>상태 관리</h3><p>완료, 진행중, 확인 대기, 추후 개선으로 나눕니다. 고객이 직접 판단할 수 있습니다.</p></div><div class="caption"><h3>묻지 않아도 되는 데이터</h3><p>작업 상태가 보이면 “지금 어디까지 됐나요?”라는 질문이 사라집니다.</p></div></div>
      </div>
    </section>

    <section class="feature">
      <div class="wrap rv">
        <div class="feature-head"><div class="kicker">태스크 실행</div><h2>안내로 끝내지 않습니다. 결과물까지 만듭니다</h2><p class="desc">상담에서 멈추지 않습니다. 카페24 수정, 랜딩페이지 제작, 자동화 연결까지 실제로 동작하는 결과물을 만듭니다.</p></div>
        <div class="feature-grid"><div class="visual-card visual-dark"><div class="panel-fake" style="width:78%;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;background:transparent;box-shadow:none"><div class="row" style="height:76px;display:block;padding:12px"><b>카페24</b><br><span>기획전 수정</span></div><div class="row" style="height:76px;display:block;padding:12px"><b>랜딩</b><br><span>문의 폼 연결</span></div><div class="row" style="height:76px;display:block;padding:12px"><b>자동화</b><br><span>알림 발송</span></div></div></div><div class="chat-card"><div class="chat-line">주문 자동화 해주세요</div><div class="chat-line">가능합니다. 먼저 주문 확인과 알림 범위를 나누겠습니다.</div><div class="before-after"><b>Before</b><span>After</span></div></div></div>
        <div class="caption-grid"><div class="caption"><h3>태스크 실행</h3><p>상담과 기획에서 멈추지 않습니다. 페이지와 자동화가 실제로 동작하는 형태로 전달합니다.</p></div><div class="caption"><h3>단순 안내만 반복한다면?</h3><p>결국 고객이 직접 처리해야 합니다. 필요한 것은 안내가 아니라 실행입니다.</p></div></div>
      </div>
    </section>

    <section class="section">
      <div class="wrap rv">
        <div class="kicker">평가 및 개선</div><h2>오픈이 끝이 아닙니다. 지표 보고 다음 개선까지</h2><p class="desc" style="margin:0">오픈 후 문의, 클릭, 상담 연결 지표를 봅니다. 다음에 고칠 것이 데이터로 정해집니다.</p>
        <div class="feature-grid" style="margin-top:48px"><div class="visual-card visual-green"><div class="panel-fake"><div class="row"><b>문의 전환</b><span>4.6%</span></div><div class="row"><b>상담 연결</b><span>86.2%</span></div><div class="row"><b>다음 개선</b><span>CTA 문구</span></div></div></div><div class="visual-card visual-lavender"><div class="panel-fake"><div class="row"><b>AI가 모아본 개선점</b><span>3개</span></div><div class="row"><b>히어로 문구</b><span>우선</span></div><div class="row"><b>FAQ 보강</b><span>다음</span></div></div></div></div>
      </div>
    </section>

    <section class="omni center">
      <div class="wrap rv">
        <div class="kicker">채널박스</div><h2>카톡, 이메일, 게시판, 전화까지 프로젝트 채널을 하나로</h2><p class="desc">요청이 흩어지면 누락이 생깁니다. 한곳에 모으고, 확인할 일만 정리해 드립니다.</p>
        <div class="app-shot"><aside class="side"><div class="dot"></div><div class="list-item"></div><div class="list-item" style="width:80%"></div><div class="list-item" style="width:70%"></div><div class="list-item"></div></aside><main class="chat-main"><div class="msg">카페24 모바일 배너 수정 요청</div><div class="msg">문의 폼은 카카오톡 채널로 연결해주세요.</div><div class="msg">오늘 확인할 항목 2개가 있습니다.</div></main><aside class="profile"><div class="avatar"></div><div class="list-item"></div><div class="list-item" style="width:70%"></div><div class="list-item" style="width:90%"></div></aside></div>
        <div class="channel-icons"><span>Talk</span><span>Mail</span><span>Board</span><span>Call</span><span>Sheet</span><span>Bot</span></div>
      </div>
    </section>

    <section class="section center">
      <div class="wrap rv">
        <h2>결국, 중요한 결정은 사람이 합니다</h2><p class="desc">AI와 자동화는 속도를 만듭니다. 무엇을 먼저 만들고 무엇을 마감 뒤로 보낼지는 사람이 판단합니다.</p>
        <div class="human-grid"><div class="human-card"><div class="mini-panel"><b>요청 목록</b><p>CTA 수정<br>배너 교체<br>카카오톡 연결</p></div></div><div class="human-card"><div class="phone-small"><b>이번 고객</b><p style="font-size:12px;color:#666">오픈일 D-5<br>확인 요청 3개</p></div></div><div class="human-card"><div class="tree"><div class="root">필수 작업</div><div class="node n1">문의폼</div><div class="node n2">모바일</div><div class="node n3">배너</div></div></div></div>
        <div class="human-caption"><div><h3>요청 맥락을 한 눈에</h3><p>고객이 남긴 요청과 진행 상태를 한곳에서 봅니다.</p></div><div><h3>놓치는 내용 없이 요약</h3><p>확인할 항목과 남은 작업을 짧게 정리합니다.</p></div><div><h3>필수 작업부터 선택</h3><p>마감 전 필요한 기능을 먼저 선별합니다.</p></div></div>
        <div class="stats-grid"><div class="stat-card"><b>5분</b><span>AI 1차 견적 — 입력 즉시 예상 견적·일정</span></div><div class="stat-card"><b>3종</b><span>표준 패키지 — 랜딩 30 · 홈 100 · 자사몰 300만 (기준가)</span></div><div class="stat-card"><b>1일</b><span>상세 견적 — 요청 시 범위 확정 견적서 발송</span></div></div>
        <div class="platform"><div><h3>글로벌 스탠더드보다 중요한 건 내 일정</h3><p class="desc" style="margin:0;font-size:13px">많은 도구보다, 지금 내 프로젝트가 어디까지 왔는지 보이는 것이 먼저입니다.</p></div><div class="platform-box"><div>cafe24</div><div>imweb</div><div>Kakao</div><div>make</div><div>notion</div><div>airtable</div></div></div>
      </div>
    </section>

    <section class="final-cta">
      <div class="wrap rv">
        <h2>만들 사이트 한 줄이면 됩니다. 5분 안에 1차 견적을 드립니다</h2>
        <form class="search-cta" style="margin:30px auto 0"><input placeholder="예: 인테리어 회사 홈페이지를 새로 만들고 싶어요"/><button class="go" aria-label="견적 받기">↑</button></form>
        <div class="chips" style="justify-content:center"><span>기준가 공개</span><span class="chip">랜딩 30만~</span><span class="chip">홈 100만~</span><span class="chip">자사몰 300만~</span><span class="chip">상세 견적 1일 내</span></div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="wrap footer-grid">
      <div><a class="brand"><img class="logo-img" src="/logo.png" alt="System Web" /></a><p style="font-size:12px;line-height:1.8;margin-top:32px;color:#9a9da5">© 2026 System Web<br/>시스템으로 만드는 웹사이트·자사몰</p></div>
      <div><h4>기능</h4><a>진행 상황 공유</a><a>카페24 개발</a><a>랜딩페이지</a><a>자동화</a></div>
      <div><h4>가격</h4><a>작업 범위</a><a>일정 상담</a><a>추후 개선</a></div>
      <div><h4>블로그</h4><a>외주 일정 관리</a><a>카페24 운영</a><a>랜딩페이지 전환</a></div>
      <div><h4>리소스</h4><a>FAQ</a><a>체크리스트</a><a>문의하기</a></div>
      <div><h4>회사</h4><a>소개</a><a>사례</a><a>파트너</a></div>
    </div>
  </footer>
`;

export default function EditVerPage() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 스크롤 리빌: .rv 요소 진입 시 1회 페이드업 (reduce-motion이면 즉시 표시)
    let revealIO;
    const reveals = Array.from(root.querySelectorAll(".rv"));
    if (reduce) {
      reveals.forEach((el) => el.classList.add("in"));
    } else {
      revealIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              revealIO.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      reveals.forEach((el) => revealIO.observe(el));
    }

    // 퀄리티 그래프: 스크롤 진입 시 1회 라인 드로잉/페이드인 (reduce-motion이면 정적)
    const chart = root.querySelector(".quality-chart");
    let chartIO;
    if (chart) {
      if (reduce) {
        chart.classList.add("in-view");
      } else {
        chartIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                chart.classList.add("in-view");
                chartIO.unobserve(e.target);
              }
            });
          },
          { threshold: 0.35 }
        );
        chartIO.observe(chart);
      }
    }

    // 지식 보드: 화면에 보이는 동안만 스캔 루프 재생 (reduce-motion이면 전체 체크 상태로 정적 표시)
    const kboard = root.querySelector(".kboard");
    let kboardIO;
    if (kboard) {
      if (reduce) {
        kboard.classList.add("in-view");
      } else {
        kboardIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              kboard.classList.toggle("in-view", e.isIntersecting);
            });
          },
          { threshold: 0.25 }
        );
        kboardIO.observe(kboard);
      }
    }

    const track = root.querySelector("#caseTrack");
    const prev = root.querySelector(".case-nav.prev");
    const next = root.querySelector(".case-nav.next");
    const dotsWrap = root.querySelector("#caseDots");
    const tabs = Array.from(root.querySelectorAll(".case-tabs .tab-group a"));
    if (!track) return;

    const cards = () => Array.from(track.querySelectorAll(".case-card"));
    const visibleCards = () => cards().filter((el) => el.style.display !== "none");
    const stepSize = () => {
      const c = visibleCards()[0];
      return c ? c.offsetWidth : track.clientWidth;
    };
    const onPrev = () => track.scrollBy({ left: -stepSize(), behavior: "smooth" });
    const onNext = () => track.scrollBy({ left: stepSize(), behavior: "smooth" });
    prev?.addEventListener("click", onPrev);
    next?.addEventListener("click", onNext);

    // 도트 인디케이터: 표시 중인 카드 수만큼 생성, 스크롤 위치와 동기화
    const buildDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      visibleCards().forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `사례 ${i + 1}`);
        if (i === 0) b.classList.add("active");
        b.addEventListener("click", () =>
          track.scrollTo({ left: stepSize() * i, behavior: "smooth" })
        );
        dotsWrap.appendChild(b);
      });
    };
    const onScroll = () => {
      if (!dotsWrap) return;
      const idx = Math.round(track.scrollLeft / stepSize());
      Array.from(dotsWrap.children).forEach((d, i) =>
        d.classList.toggle("active", i === idx)
      );
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    buildDots();

    const onTab = (e) => {
      const tab = e.currentTarget;
      const cat = tab.dataset.cat;
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      cards().forEach((c) => {
        c.style.display = cat === "all" || c.dataset.cat === cat ? "" : "none";
      });
      track.scrollTo({ left: 0, behavior: "auto" });
      buildDots();
    };
    tabs.forEach((t) => t.addEventListener("click", onTab));

    return () => {
      prev?.removeEventListener("click", onPrev);
      next?.removeEventListener("click", onNext);
      track.removeEventListener("scroll", onScroll);
      tabs.forEach((t) => t.removeEventListener("click", onTab));
      chartIO?.disconnect();
      kboardIO?.disconnect();
      revealIO?.disconnect();
    };
  }, []);

  return (
    <div ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
