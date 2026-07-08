"use client";

// 메인 (/) — editver 개선 시안을 승격한 버전
// nav만 index(드롭다운) 버전을 유지하고, 나머지 UI·카피·인터랙션은 editver를 따른다.
//   UI  : 히어로 인풋 포커스 링, 보라 CTA 기본화, 스크롤 리빌(.rv), 사례 캐러셀 도트,
//         reason 카드화 + hover, 지식 시스템 보드(kboard), 로고 스트립 라벨
//   카피: 단문·정량 톤, AI 1차 견적 → 상세 견적 플로우 (CLAUDE.md 가격 정책)
//   nav : index의 호버 드롭다운(서비스/진행방식/자료) 유지
//
// ▸ 디자인 조절은 아래 :root 토큰 블록만 수정하면 전체에 반영됩니다.
//   - 간격: --space-* (4px 리듬) / --section-y* (섹션 상하) / --hero-y
//   - 영역: --max(페이지) / --max-feature / --max-copy / --gutter
//   - 폰트: --text-* (크기) / --fw-* (굵기) / --lh-* (행간) / --ls-* (자간)
//   - 라운드: --r-* / 색: --ink, --purple, --green ...

import { useEffect, useRef } from "react";
import { bindConsultationAnalytics } from "./components/consultationAnalytics";
import { navCss, getNavHtml } from "./components/navHtml";
import QuoteChatWidget from "./components/QuoteChatWidget";

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

${navCss}

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
.case-stage{position:relative}
.case-track{position:relative;display:flex;gap:var(--space-4);overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none;-ms-overflow-style:none}
.case-track::-webkit-scrollbar{display:none}
.case-card{flex:0 0 100%;scroll-snap-align:center;position:relative;min-height:600px;border-radius:20px;overflow:hidden;color:#fff;display:flex;align-items:center;justify-content:space-between;background-size:140% 140%;background-position:50% 50%}
.case-card.is-active{animation:case-kb 16s ease-in-out infinite alternate}
.case-card::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(28,24,22,.55) 0%,rgba(28,24,22,.28) 45%,rgba(28,24,22,0) 100%)}
.case-1{background-image:linear-gradient(120deg,#2a2622,#4a4038 60%,#6b5d4f)}
.case-2{background-image:linear-gradient(120deg,#1c2330,#28324a 60%,#3c4a68)}
.case-3{background-image:linear-gradient(120deg,#241c2c,#352a44 60%,#4a3c5e)}
.case-4{background-image:linear-gradient(120deg,#1f2a25,#2c4035 60%,#3f5c49)}
.case-5{background-image:linear-gradient(120deg,#2a2420,#44372b 60%,#634f39)}
.case-6{background-image:linear-gradient(120deg,#202430,#303a52 60%,#45507a)}
.case-inner{position:relative;z-index:2;padding:var(--space-16) var(--space-14) var(--space-16) var(--space-24);max-width:600px}
.case-card.is-active .case-inner>*{animation:case-in .5s ease both}
.case-card.is-active .case-inner>*:nth-child(1){animation-delay:.04s}
.case-card.is-active .case-inner>*:nth-child(2){animation-delay:.10s}
.case-card.is-active .case-inner>*:nth-child(3){animation-delay:.16s}
.case-card.is-active .case-inner>*:nth-child(4){animation-delay:.22s}
.case-card.is-active .case-inner>*:nth-child(5){animation-delay:.28s}
.case-card.is-active .case-inner>*:nth-child(6){animation-delay:.34s}
.case-brand{font-size:var(--text-2xl);font-weight:var(--fw-black);letter-spacing:.06em;margin-bottom:var(--space-8)}
.case-title{font-size:44px;line-height:1.22;font-weight:var(--fw-black);letter-spacing:var(--ls-display);margin-bottom:var(--space-7)}
.case-shot{position:relative;z-index:2;flex:0 0 42%;max-width:520px;margin-right:var(--space-16);border-radius:14px;overflow:hidden;background:#17181c;border:1px solid rgba(255,255,255,.14);box-shadow:0 28px 70px rgba(0,0,0,.4)}
.case-shot-bar{display:flex;align-items:center;gap:6px;padding:11px 14px;background:#232429;border-bottom:1px solid rgba(255,255,255,.06)}
.case-shot-bar i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.22)}
.case-shot-bar span{margin-left:10px;flex:1;background:rgba(255,255,255,.08);border-radius:7px;padding:4px 12px;font-size:12px;line-height:1;color:rgba(255,255,255,.65);font-weight:600;letter-spacing:.02em}
.case-shot img{display:block;width:100%;height:330px;object-fit:cover;object-position:top}
.case-shot.is-phone{flex:0 0 auto;width:238px;border-radius:30px;padding:10px;background:#0c0d10;border:1px solid rgba(255,255,255,.18)}
.case-shot.is-phone img{height:452px;border-radius:22px}
.case-status{display:inline-block;vertical-align:4px;margin-left:var(--space-2);padding:4px 10px;border-radius:var(--r-pill);font-size:var(--text-xs,12px);font-weight:var(--fw-bold);letter-spacing:0;background:rgba(255,255,255,.16);color:rgba(255,255,255,.75)}
.case-status.is-live{background:rgba(94,220,140,.2);color:#8df0b4}
.case-quote{font-size:var(--text-lg);font-weight:var(--fw-bold);line-height:1.7;max-width:480px;margin:0}
.case-quote em{display:block;margin-top:var(--space-2);font-style:normal;font-weight:var(--fw-medium);opacity:.55;font-size:var(--text-sm)}
.case-more{display:inline-block;margin-top:var(--space-8);font-size:var(--text-sm);font-weight:var(--fw-bold);cursor:pointer;transition:opacity .15s}
.case-more:hover{opacity:.75}
.case-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:4;width:48px;height:48px;border-radius:50%;border:0;background:rgba(255,255,255,.22);backdrop-filter:blur(6px);color:#fff;cursor:pointer;font-size:24px;line-height:1;display:grid;place-items:center;transition:background .15s}
.case-nav:hover{background:rgba(255,255,255,.4)}
.case-nav.prev{left:18px}.case-nav.next{right:18px}
@keyframes case-kb{from{background-position:38% 50%}to{background-position:62% 50%}}
@keyframes case-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){.case-card{transform:none;opacity:1;transition:none;animation:none}.case-card.is-active{animation:none}.case-card.is-active .case-inner>*{animation:none}}
@media(max-width:900px){.case-card{min-height:480px}.case-inner{padding:var(--space-12) var(--space-8)}.case-title{font-size:32px}.case-shot{display:none}}

/* 지식 시스템 보드 — status frame(흰 패널 + 상태 행) 스타일. 행들이 차례로 대기→✓ 완료로 점검되는 데모 */
.kboard{margin-top:var(--space-14);background:linear-gradient(135deg,#e7ecff 0%,#f1e7ff 55%,#ffe9f4 100%);border-radius:var(--r-lg);padding:var(--space-10) var(--space-8);position:relative;overflow:hidden;box-shadow:var(--shadow)}
.kboard-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-8)}
.kboard-title{display:flex;align-items:center;font-size:var(--text-sm);font-weight:var(--fw-bold);color:#4a4566;letter-spacing:.06em}
.kboard-done{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.92);z-index:3;display:flex;flex-direction:column;align-items:center;gap:var(--space-4);opacity:0;transition:opacity .45s ease,transform .45s cubic-bezier(.2,.7,.2,1)}
.kboard.complete .kboard-done{opacity:1;transform:translate(-50%,-50%) scale(1)}
.kboard-done .kdone-t{font-size:var(--text-3xl);font-weight:var(--fw-black);color:var(--purple-dark);letter-spacing:var(--ls-snug)}
.kboard::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(135deg,rgba(94,86,240,.12),rgba(49,165,82,.16));opacity:0;transition:opacity .5s ease}
.kboard.complete::after{opacity:1}
.kboard-head{transition:opacity .5s ease}
.kboard.complete .kboard-head{opacity:0}
.kpanels{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4);transition:opacity .5s ease}
.kboard.complete .kpanels{opacity:0}
.kpanel{background:#fff;border-radius:var(--r-md);box-shadow:0 28px 70px rgba(27,36,61,.16);padding:var(--space-4);text-align:left}
.kpanel-t{font-size:var(--text-sm);font-weight:var(--fw-bold);color:#343943;padding:2px 4px 10px}
.krow{height:38px;border:1px solid #edf0f4;border-radius:var(--r-sm);margin:var(--space-2) 0;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font-size:var(--text-xs);color:#343943;transition:border-color .3s ease,background .3s ease}
.krow b{font-weight:var(--fw-semibold)}
.krow .st{position:relative;min-width:52px;text-align:right;font-weight:var(--fw-bold)}
.krow .st i{font-style:normal;position:absolute;right:0;top:50%;transform:translateY(-50%);white-space:nowrap;transition:opacity .25s ease,transform .25s ease}
.krow .st .w{color:#a9acb3}
.krow .st .d{color:var(--purple);opacity:0;transform:translateY(-50%) scale(.7)}
.krow.done{border-color:#d8d5f9;background:#fbfaff}
.krow.done .st .w{opacity:0}
.krow.done .st .d{opacity:1;transform:translateY(-50%) scale(1)}
@media (prefers-reduced-motion: reduce){.kboard-done,.kboard::after,.kboard-head,.kpanels,.krow,.krow .st i{transition:none}}
@media(max-width:900px){.kpanels{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.kpanels{grid-template-columns:1fr}.kboard{padding:var(--space-6) var(--space-5)}}

.reason-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4);margin-top:var(--space-16);text-align:left}
.reason{background:#fff;border:1px solid #ececf0;border-radius:var(--r-lg);padding:var(--space-6);transition:transform .2s,box-shadow .2s,border-color .2s}
.reason:hover{transform:translateY(-3px);box-shadow:var(--shadow-sm);border-color:#dedcf8}
.reason .ico{width:28px;height:28px;border-radius:var(--r-sm);border:1px solid #e8e8ee;display:grid;place-items:center;margin-bottom:var(--space-4);color:var(--purple);font-weight:var(--fw-black);background:var(--purple-soft)}.reason h3{font-size:var(--text-lg);margin:0 0 var(--space-2)}.reason p{font-size:var(--text-sm);color:#69707b;line-height:var(--lh-relaxed);margin:0;word-break:keep-all}

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

const body = `${getNavHtml(null)}

  <main>
    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <h1>시스템으로 만드는, 빠르고 퀄리티 있는 웹사이트·자사몰</h1>
          <p class="hero-copy">기획·디자인·개발의 기준을 시스템으로 고정했습니다.<br/>속도와 완성도 모두 2배 이상 끌어올린 개발 외주를 만나보세요.</p>
          <form class="search-cta" id="contact" data-ga-consultation-cta data-ga-location="home_hero_quote_form" data-ga-text="hero_quote_form_submit">
            <input placeholder="예: 러닝 브랜드 자사몰을 리뉴얼하고 싶어요" />
            <button class="go" aria-label="견적 받기" data-ga-consultation-cta data-ga-location="home_hero_quote_button" data-ga-text="견적 받기">↑</button>
          </form>
          <div class="chips"><span>요청사항을 입력하고 5분 내로 견적을 받아보세요</span><span class="chip">러닝 브랜드</span><span class="chip">시공사</span><span class="chip">플랫폼</span></div>
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
          <h2>실제 결과를 직접 확인해보세요</h2>
          <p class="desc">가능성 이야기가 아닙니다. 오픈까지 끝낸 사례입니다.<br>운영 중인 사이트는 지금 바로 들어가서 확인할 수 있습니다.</p>
        </div>
        <div class="case-tabs">
          <div class="tab-group">
            <a class="active" data-cat="store">자사몰</a><a data-cat="landing">랜딩페이지</a><a data-cat="homepage">홈페이지</a><a data-cat="service">웹 서비스</a>
          </div>
        </div>
        <div class="case-stage">
          <button class="case-nav prev" type="button" aria-label="이전 사례">‹</button>
          <div class="case-track" id="caseTrack">
            <article class="case-card case-1" data-cat="store">
              <div class="case-inner">
                <div class="case-brand">RIFE <span class="case-status is-live">운영 중</span></div>
                <div class="case-title">러닝 의류 브랜드 자사몰</div>
                <p class="case-quote">러닝 의류 브랜드 RIFE의 자사몰. 상품 탐색부터 주문까지 브랜드 톤을 유지한 쇼핑 동선으로 구축했습니다.<em>자사몰 개발</em></p>
                <a class="case-more" href="https://rife.kr" target="_blank" rel="noopener">rife.kr 방문하기 ›</a>
              </div>
              <div class="case-shot is-phone" aria-hidden="true">
                <img src="/cases/rife-mobile.jpg" alt="" loading="lazy"/>
              </div>
            </article>
            <article class="case-card case-2" data-cat="landing">
              <div class="case-inner">
                <div class="case-brand">RACE MANAGER <span class="case-status is-live">운영 중</span></div>
                <div class="case-title">B2B 대회 도입 랜딩페이지</div>
                <p class="case-quote">대회 운영 서비스 도입을 검토하는 기업·주최사를 위한 랜딩페이지. 도입 문의로 이어지는 한 페이지 구성입니다.<em>랜딩페이지 제작</em></p>
                <a class="case-more" href="https://racemanager.kr" target="_blank" rel="noopener">racemanager.kr 방문하기 ›</a>
              </div>
              <div class="case-shot" aria-hidden="true">
                <div class="case-shot-bar"><i></i><i></i><i></i><span>racemanager.kr</span></div>
                <img src="/cases/racemanager.jpg" alt="" loading="lazy"/>
              </div>
            </article>
            <article class="case-card case-3" data-cat="homepage">
              <div class="case-inner">
                <div class="case-brand">PRIME ENC <span class="case-status is-live">운영 중</span></div>
                <div class="case-title">난방 관리 업체 홈페이지</div>
                <p class="case-quote">난방 관리 업체의 회사 홈페이지. 서비스 소개와 문의 동선을 정리해 오픈했습니다.<em>홈페이지 제작</em></p>
                <a class="case-more" href="https://primeenc.kr" target="_blank" rel="noopener">primeenc.kr 방문하기 ›</a>
              </div>
              <div class="case-shot" aria-hidden="true">
                <div class="case-shot-bar"><i></i><i></i><i></i><span>primeenc.kr</span></div>
                <img src="/cases/primeenc.jpg" alt="" loading="lazy"/>
              </div>
            </article>
            <article class="case-card case-4" data-cat="service">
              <div class="case-inner">
                <div class="case-brand">사주 심리테스트 <span class="case-status">현재 닫힘</span></div>
                <div class="case-title">바이럴 심리테스트 · 운세 챗봇</div>
                <p class="case-quote">사주 기반 바이럴 심리테스트 페이지와 운세 챗봇을 함께 구축한 웹 서비스입니다.<em>웹 서비스 개발</em></p>
              </div>
              <div class="case-shot" aria-hidden="true">
                <div class="case-shot-bar"><i></i><i></i><i></i><span>사주BTI · 심리테스트</span></div>
                <img src="/projects/sajudiary.png" alt="" loading="lazy"/>
              </div>
            </article>
            <article class="case-card case-5" data-cat="landing">
              <div class="case-inner">
                <div class="case-brand">묘수의관점 <span class="case-status">현재 닫힘</span></div>
                <div class="case-title">유튜브 채널 소개 랜딩</div>
                <p class="case-quote">유튜버 ‘묘수의관점’ 채널을 소개하는 랜딩페이지를 제작했습니다.<em>랜딩페이지 제작</em></p>
              </div>
            </article>
            <article class="case-card case-6" data-cat="landing">
              <div class="case-inner">
                <div class="case-brand">ALTA <span class="case-status">현재 닫힘</span></div>
                <div class="case-title">앱 소개 랜딩페이지</div>
                <p class="case-quote">앱 ‘alta’를 소개하는 랜딩페이지. 핵심 기능을 한 페이지로 정리했습니다.<em>랜딩페이지 제작</em></p>
              </div>
            </article>
          </div>
          <button class="case-nav next" type="button" aria-label="다음 사례">›</button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap rv">
        <div class="kicker">제작 시스템</div><h2>사람이 아닌 시스템을 믿으세요</h2>
        <p class="desc" style="margin:var(--space-4) 0 0">웹사이트 하나에도 챙길 항목이 수십 개입니다. 기억에만 맡기면 그중 하나는 꼭 빠집니다.<br/>시스템웹은 모든 노하우를 시스템에 넣었습니다. 프로젝트마다 빈틈없이 확인합니다.</p>
        <div class="kboard" aria-label="영역별 지식이 자동 점검되는 시스템 데모">
          <div class="kboard-head">
            <div class="kboard-title">단계별 점검 항목</div>
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
          <div class="kboard-done"><span class="kdone-t">점검이 완료되었습니다.</span></div>
        </div>
      </div>
    </section>

    <section class="section center">
      <div class="wrap rv">
        <h2>매 프로젝트마다 4개 시스템이 작동합니다</h2>
        <p class="desc">기획부터 인수인계까지, 판단이 필요한 모든 단계를 더블 체크합니다. 기억에만 의존하지 않습니다.</p>
        <div class="reason-grid">
          <div class="reason"><div class="ico">1</div><h3>기획 시스템 ›</h3><p>시작 전에 목표·기능·일정·우선순위를 문서로 확정합니다. 개선 사항이나 더 좋은 방향을 제안드립니다.</p></div>
          <div class="reason"><div class="ico">2</div><h3>진행 시스템 ›</h3><p>작업 현황·확인 요청·변경 사항을 실시간 대시보드로 공유합니다. 물어볼 필요가 없습니다.</p></div>
          <div class="reason"><div class="ico">3</div><h3>검증 시스템 ›</h3><p>오픈 전 수십 개 항목을 체크리스트로 전수 확인합니다. 빠지는 항목이 없습니다.</p></div>
          <div class="reason"><div class="ico">4</div><h3>인수인계 시스템 ›</h3><p>계정 권한·수정 가이드·운영 방법을 전달합니다. 외주 후에도 직접 운영할 수 있습니다.</p></div>
        </div>
      </div>
    </section>

    <section class="feature">
      <div class="wrap rv">
        <div class="feature-head"><div class="kicker">기획 시스템</div><h2>목적과 의도에 맞게 기능·일정·우선순위를 정합니다</h2><p class="desc">개선 사항이나 더 좋은 방향이 있다면 제안드립니다.</p></div>
        <div class="feature-grid"><div class="visual-card visual-blue"><div class="panel-fake"><div class="row"><b>기본 CTA 연결</b><span class="switch"></span></div><div class="row"><b>카페24 모바일 배너</b><span>필수</span></div><div class="row"><b>관리자 통계 화면</b><span>추후</span></div></div></div><div class="chat-card"><div class="chat-line">지금 어떤 작업이 먼저인가요?</div><div class="chat-line">마감 전 필수는 문의 연결과 모바일 CTA입니다.</div></div></div>
        <div class="caption-grid"><div class="caption"><h3>규칙 설정</h3><p><b>마감 전 반드시 필요한 것</b>과 나중에 개선해도 되는 것을 분리합니다. 일정 리스크가 내려갑니다.</p></div><div class="caption"><h3>규칙이 없을 때</h3><p>좋아 보이는 기능이 계속 늘어납니다. 정작 오픈일에 필요한 것이 늦어집니다.</p></div></div>
      </div>
    </section>

    <section class="feature">
      <div class="wrap rv">
        <div class="feature-head"><div class="kicker">진행 시스템</div><h2>작업 현황을 실시간 대시보드로 공유합니다.</h2><p class="desc">요청사항과 진행 상태를 전부 기록합니다. 어떤 요청이 완료됐고 어떤 항목이 확인 대기인지 언제든 볼 수 있습니다.</p></div>
        <div class="feature-grid"><div class="visual-card visual-pink"><div class="panel-fake"><div class="row"><b>랜딩페이지 히어로</b><span>100%</span></div><div class="row"><b>카페24 기획전</b><span>80%</span></div><div class="row"><b>카카오톡 연결</b><span>확인중</span></div></div></div><div class="chat-card"><div class="chat-line">지금 내가 확인할 것은?</div><div class="chat-line">CTA 문구와 카카오톡 채널 연결, 2개입니다.</div><div class="chat-line me">확인했습니다.</div></div></div>
        <div class="caption-grid"><div class="caption"><h3>상태 관리</h3><p>완료, 진행중, 확인 대기, 추후 개선으로 나눕니다. 고객이 직접 판단할 수 있습니다.</p></div><div class="caption"><h3>묻지 않아도 되는 데이터</h3><p>작업 상태가 보이면 “지금 어디까지 됐나요?”라는 질문이 사라집니다.</p></div></div>
      </div>
    </section>

    <section class="feature">
      <div class="wrap rv">
        <div class="feature-head"><div class="kicker">검증 시스템</div><h2>오픈 전 수십 개 항목을 빠짐없이 확인합니다</h2><p class="desc">기억에 의존하지 않습니다. 체크리스트가 자동으로 돌아가고, 전 항목이 통과해야 오픈이 진행됩니다.</p></div>
        <div class="feature-grid"><div class="visual-card visual-dark"><div class="panel-fake" style="width:78%;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;background:transparent;box-shadow:none"><div class="row" style="height:76px;display:block;padding:12px"><b>UX · UI</b><br><span>✓ 완료</span></div><div class="row" style="height:76px;display:block;padding:12px"><b>속도 검수</b><br><span>✓ 완료</span></div><div class="row" style="height:76px;display:block;padding:12px"><b>메타 · SEO</b><br><span>확인중</span></div></div></div><div class="chat-card"><div class="chat-line">오픈 전 뭘 더 확인해야 하나요?</div><div class="chat-line">체크리스트 기준 3개 항목이 남아 있습니다.</div></div></div>
        <div class="caption-grid"><div class="caption"><h3>전수 점검</h3><p>UX·UI, 속도, 메타, 도메인, SSL까지 기준 항목을 빠짐없이 확인합니다. 사람 기억에 맡기지 않습니다.</p></div><div class="caption"><h3>검증 없이 오픈하면?</h3><p>빠진 항목은 오픈 후에야 발견됩니다. 수정 비용과 신뢰 손실이 동시에 생깁니다.</p></div></div>
      </div>
    </section>

    <section class="section">
      <div class="wrap rv">
        <div class="kicker">인수인계 시스템</div><h2>오픈 후에도 혼자 운영할 수 있어야 합니다</h2><p class="desc" style="margin:0">계정 권한, 수정 가이드, 운영 방법을 문서로 전달합니다. 외주가 끝나도 고객이 직접 다룰 수 있습니다.</p>
        <div class="feature-grid" style="margin-top:48px"><div class="visual-card visual-green"><div class="panel-fake"><div class="row"><b>계정 권한 이전</b><span>✓ 완료</span></div><div class="row"><b>수정 가이드 문서</b><span>✓ 완료</span></div><div class="row"><b>운영 방법 안내</b><span>✓ 완료</span></div></div></div><div class="visual-card visual-lavender"><div class="panel-fake"><div class="row"><b>인수인계 항목</b><span>3개</span></div><div class="row"><b>관리자 접근 권한</b><span>이전 완료</span></div><div class="row"><b>다음 개선 항목</b><span>정리 완료</span></div></div></div></div>
        <div class="caption-grid"><div class="caption"><h3>운영 비용 시뮬레이션 문서 제공</h3><p>현재 트래픽 기준 예상 월 방문자 수, 규모별 서버비 시나리오, 인프라 사양을 정리한 문서를 함께 전달합니다. 오픈 후 비용 계획을 직접 세울 수 있습니다.</p></div><div class="caption"><h3>오픈 후에도 직접 다룰 수 있습니다</h3><p>계정 권한·수정 가이드·운영 방법을 문서로 전달합니다. 간단한 텍스트·이미지 수정은 직접 할 수 있습니다.</p></div></div>
      </div>
    </section>

    <section class="omni center">
      <div class="wrap rv">
        <div class="kicker">채널박스</div><h2>카톡, 이메일, 게시판, 전화까지 프로젝트 채널을 하나로</h2><p class="desc">요청이 흩어지면 누락이 생깁니다. 한곳에 모으고, 확인할 일만 정리해 드립니다.</p>
        <div class="app-shot"><aside class="side"><div class="dot"></div><div class="list-item"></div><div class="list-item" style="width:80%"></div><div class="list-item" style="width:70%"></div><div class="list-item"></div></aside><main class="chat-main"><div class="msg">카페24 모바일 배너 수정 요청</div><div class="msg">문의 폼은 카카오톡 채널로 연결해주세요.</div><div class="msg">오늘 확인할 항목 2개가 있습니다.</div></main><aside class="profile"><div class="avatar"></div><div class="list-item"></div><div class="list-item" style="width:70%"></div><div class="list-item" style="width:90%"></div></aside></div>
        <div class="channel-icons"><span>Talk</span><span>Mail</span><span>Board</span><span>Call</span><span>Sheet</span><span>Bot</span></div>
      </div>
    </section>

    <!-- section: 결국, 중요한 결정은 사람이 합니다 — disabled -->

    <section class="final-cta">
      <div class="wrap rv">
        <h2>만들 사이트 한 줄이면 됩니다. 5분 안에 1차 견적을 드립니다</h2>
        <form class="search-cta" style="margin:30px auto 0" data-ga-consultation-cta data-ga-location="home_final_quote_form" data-ga-text="final_quote_form_submit"><input placeholder="예: 인테리어 회사 홈페이지를 새로 만들고 싶어요"/><button class="go" aria-label="견적 받기" data-ga-consultation-cta data-ga-location="home_final_quote_button" data-ga-text="견적 받기">↑</button></form>
        <div class="chips" style="justify-content:center"><span>요청사항을 입력하고 5분 내로 견적을 받아보세요</span><span class="chip">러닝 브랜드</span><span class="chip">시공사</span><span class="chip">플랫폼</span></div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="wrap footer-grid">
      <div><a class="brand"><img class="logo-img" src="/logo.png" alt="System Web" /></a><p style="font-size:12px;line-height:1.8;margin-top:32px;color:#9a9da5">© 2026 consolve · System Web<br/>시스템으로 만드는 웹사이트·자사몰</p></div>
      <div><h4>기능</h4><a>진행 상황 공유</a><a>카페24 개발</a><a>랜딩페이지</a><a>자동화</a></div>
      <div><h4>가격</h4><a>작업 범위</a><a>일정 상담</a><a>추후 개선</a></div>
      <div><h4>블로그</h4><a>외주 일정 관리</a><a>카페24 운영</a><a>랜딩페이지 전환</a></div>
      <div><h4>리소스</h4><a>FAQ</a><a>체크리스트</a><a>문의하기</a></div>
      <div><h4>회사</h4><a>소개</a><a>사례</a><a>파트너</a></div>
    </div>
  </footer>
`;

export default function HomePage() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const unbindConsultationAnalytics = bindConsultationAnalytics(root);

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

    // 지식 보드: 화면에 보이면 "모두 대기 → 순차 점검 → 점검 완료 → 초기화" 사이클을 반복
    // (reduce-motion이면 전체 체크 상태로 정적 표시)
    const kboard = root.querySelector(".kboard");
    let kboardIO;
    const kboardTimers = [];
    const clearKboardTimers = () => {
      kboardTimers.forEach(clearTimeout);
      kboardTimers.length = 0;
    };
    if (kboard) {
      const krows = Array.from(kboard.querySelectorAll(".krow"));
      if (reduce) {
        krows.forEach((r) => r.classList.add("done"));
      } else {
        const later = (fn, ms) => kboardTimers.push(setTimeout(fn, ms));
        const STEP = 340; // 행 간 점검 간격
        const START = 500; // 사이클 시작 전 대기
        const HOLD = 1900; // 점검 완료 유지
        const runCycle = () => {
          // 1) 초기화: 모두 대기
          kboard.classList.remove("complete");
          krows.forEach((r) => r.classList.remove("done"));
          // 2) 순차 점검
          krows.forEach((r, i) =>
            later(() => r.classList.add("done"), START + i * STEP)
          );
          // 3) 모두 완료 → 점검 완료 표시
          const allDone = START + krows.length * STEP;
          later(() => kboard.classList.add("complete"), allDone + 400);
          // 4) 완료 유지 후 다음 사이클
          later(runCycle, allDone + 400 + HOLD);
        };
        let running = false;
        kboardIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting && !running) {
                running = true;
                runCycle();
              } else if (!e.isIntersecting && running) {
                running = false;
                clearKboardTimers();
              }
            });
          },
          { threshold: 0.25 }
        );
        kboardIO.observe(kboard);
      }
    }

    // 사례 캐러셀 (channel.io 레퍼런스): 연속 6장 + 오토플레이 · 활성 카드 강조 ·
    // 콘텐츠 스태거 · Ken Burns. 탭은 해당 카테고리 카드로 이동.
    const stage = root.querySelector(".case-stage");
    const track = root.querySelector("#caseTrack");
    const prevBtn = root.querySelector(".case-nav.prev");
    const nextBtn = root.querySelector(".case-nav.next");
    const tabs = Array.from(root.querySelectorAll(".case-tabs .tab-group a"));
    let caseCleanup;

    if (track) {
      const cards = Array.from(track.querySelectorAll(".case-card"));

      const center = (i, smooth = true) => {
        i = ((i % cards.length) + cards.length) % cards.length;
        const c = cards[i];
        const left = c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2;
        track.scrollTo({ left, behavior: smooth && !reduce ? "smooth" : "auto" });
      };

      // 오토플레이
      const AUTOPLAY = 5000;
      let timer = null;
      const start = () => {
        if (reduce || timer) return;
        timer = setInterval(() => center(currentIdx + 1), AUTOPLAY);
      };
      const stop = () => {
        if (timer) { clearInterval(timer); timer = null; }
      };
      const restart = () => { stop(); start(); };

      let currentIdx = -1;
      const setActive = (idx) => {
        if (idx === currentIdx) return;
        currentIdx = idx;
        cards.forEach((c, i) => c.classList.toggle("is-active", i === idx));
        const cat = cards[idx].dataset.cat;
        tabs.forEach((t) => t.classList.toggle("active", t.dataset.cat === cat));
      };

      const nearestIdx = () => {
        const tr = track.getBoundingClientRect();
        const mid = tr.left + tr.width / 2;
        let best = 0, bestD = Infinity;
        cards.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid);
          if (d < bestD) { bestD = d; best = i; }
        });
        return best;
      };
      let scrollRaf = 0;
      const onScroll = () => {
        cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(() => setActive(nearestIdx()));
      };
      track.addEventListener("scroll", onScroll, { passive: true });

      const onPrev = () => { center(currentIdx - 1); restart(); };
      const onNext = () => { center(currentIdx + 1); restart(); };
      prevBtn?.addEventListener("click", onPrev);
      nextBtn?.addEventListener("click", onNext);

      const onTab = (e) => {
        const cat = e.currentTarget.dataset.cat;
        const idx = cards.findIndex((c) => c.dataset.cat === cat);
        if (idx >= 0) { center(idx); restart(); }
      };
      tabs.forEach((t) => t.addEventListener("click", onTab));

      // 상호작용 중에는 오토플레이 일시정지
      const pause = () => stop();
      const resume = () => start();
      stage?.addEventListener("pointerenter", pause);
      stage?.addEventListener("pointerleave", resume);
      stage?.addEventListener("focusin", pause);
      stage?.addEventListener("focusout", resume);
      stage?.addEventListener("touchstart", pause, { passive: true });

      // 초기화: 첫 카드 중앙 정렬 · 활성화 · 오토플레이 시작
      center(0, false);
      setActive(0);
      start();

      caseCleanup = () => {
        stop();
        cancelAnimationFrame(scrollRaf);
        track.removeEventListener("scroll", onScroll);
        prevBtn?.removeEventListener("click", onPrev);
        nextBtn?.removeEventListener("click", onNext);
        tabs.forEach((t) => t.removeEventListener("click", onTab));
        stage?.removeEventListener("pointerenter", pause);
        stage?.removeEventListener("pointerleave", resume);
        stage?.removeEventListener("focusin", pause);
        stage?.removeEventListener("focusout", resume);
        stage?.removeEventListener("touchstart", pause);
      };
    }

    return () => {
      unbindConsultationAnalytics();
      chartIO?.disconnect();
      kboardIO?.disconnect();
      clearKboardTimers();
      revealIO?.disconnect();
      caseCleanup?.();
    };
  }, []);

  return (
    <div ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <QuoteChatWidget />
    </div>
  );
}
