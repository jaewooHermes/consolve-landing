"use client";

// 블로그 상세 (/blog/articles/[slug]) — channel.io 아티클 상세 레이아웃 패턴 차용 (구조만, 내용은 placeholder)
// 구조: 브레드크럼 → 태그·제목·작성자 메타 → 커버 → (본문 + 우측 sticky 목차) → CTA 배너 → 공유·작성자 → 추천 → 뉴스레터 → 푸터
// 컨벤션: 인라인 css + body 문자열을 dangerouslySetInnerHTML로 렌더, 인터랙션(목차 스크롤 스파이)은 useEffect 바인딩.
//
// ▸ 동적 라우트지만 내용은 placeholder 고정 — slug 값은 사용하지 않습니다.
// ▸ 디자인 조절은 아래 :root 토큰 블록만 수정하면 전체에 반영됩니다.

import { useEffect, useRef } from "react";

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

/* ── Nav ── */
.nav{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.84);backdrop-filter:blur(18px);border-bottom:1px solid rgba(17,17,20,.04)}
.nav-inner{height:68px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:9px;font-weight:var(--fw-bold);letter-spacing:var(--ls-snug)}
.logo-img{height:30px;width:auto;display:block;flex:none}
.links{display:flex;align-items:center;gap:var(--space-8);color:#333740;font-size:var(--text-md);font-weight:var(--fw-semibold)}
.links a.cur{color:var(--purple)}
.links span{color:#b3b3ba;margin-left:4px}
.nav-item{position:relative;display:flex;align-items:center;height:68px}
.nav-item>a{display:flex;align-items:center;cursor:pointer}
.dropdown{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(6px);padding-top:12px;opacity:0;visibility:hidden;transition:opacity .18s,transform .18s;z-index:40}
.nav-item:hover .dropdown{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
.dd-card{background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);padding:8px;min-width:248px}
.dd-link{display:block;padding:10px 14px;border-radius:10px}
.dd-link:hover{background:#f5f5f7}
.dd-link b{display:block;font-size:var(--text-md);color:#111;font-weight:var(--fw-semibold)}
.dd-link span{display:block;font-size:var(--text-xs);color:#8d8e91;margin:2px 0 0;font-weight:var(--fw-medium)}
@media (prefers-reduced-motion: reduce){.dropdown{transition:opacity .18s}.nav-item:hover .dropdown{transform:translateX(-50%) translateY(0)}}
.nav-actions{display:flex;align-items:center;gap:var(--space-4);font-size:var(--text-md);font-weight:var(--fw-semibold)}
.pill-dark{background:#111114;color:#fff;border-radius:var(--r-pill);padding:11px 18px;font-weight:var(--fw-bold);box-shadow:0 8px 18px rgba(0,0,0,.12)}

/* placeholder 그라데이션 */
.ph{background:linear-gradient(135deg,#cfe0ff,#ecd8ff 55%,#ffd7ea)}
.ph-1{background:linear-gradient(135deg,#cfe0ff,#dfe5ff)}
.ph-2{background:linear-gradient(135deg,#ecd8ff,#efb6ff)}
.ph-3{background:linear-gradient(135deg,#ffd7ea,#ffe6cf)}
.ava-ph{background:linear-gradient(135deg,#ffd7c0,#b9ead6)}

/* ── 브레드크럼 ── */
.breadcrumb{max-width:760px;margin:0 auto;padding:var(--space-8) var(--gutter) 0;font-size:var(--text-sm);color:#8d8e91}
.breadcrumb a:hover{color:var(--purple)}
.breadcrumb .sep{margin:0 8px;color:#cfd0d6}

/* ── 아티클 헤더 ── */
.article-head{max-width:760px;margin:0 auto;padding:var(--space-6) var(--gutter) 0;text-align:center}
.atags{display:flex;gap:var(--space-2);justify-content:center;flex-wrap:wrap;margin-bottom:var(--space-5)}
.atag{font-size:var(--text-xs);font-weight:var(--fw-bold);color:var(--purple);background:#efeefe;border-radius:var(--r-pill);padding:6px 12px}
.article-head h1{font-size:var(--text-3xl);line-height:1.3;font-weight:var(--fw-black);letter-spacing:var(--ls-snug);margin:0 0 var(--space-6);word-break:keep-all}
.ameta{display:flex;align-items:center;justify-content:center;gap:var(--space-3);font-size:var(--text-md);color:#7b808a}
.ameta .ava{width:44px;height:44px;border-radius:50%;flex:none}
.ameta b{color:#33363d;font-weight:var(--fw-semibold)}
.ameta .sep{color:#cfd0d6}

.cover{max-width:960px;margin:var(--space-10) auto 0;aspect-ratio:16/9;border-radius:18px;box-shadow:var(--shadow)}

/* ── 본문 + 목차 레이아웃 ── */
.article-layout{max-width:1040px;margin:0 auto;padding:var(--space-14) var(--gutter) 0;display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:var(--space-16);align-items:start}
.article-body{max-width:720px;font-size:17px;line-height:1.85;color:#2b2f37}
.article-body h2{font-size:26px;font-weight:var(--fw-black);letter-spacing:var(--ls-normal);margin:var(--space-12) 0 var(--space-4);scroll-margin-top:90px}
.article-body h3{font-size:var(--text-2xl);font-weight:var(--fw-bold);margin:var(--space-8) 0 var(--space-3)}
.article-body p{margin:0 0 22px}
.article-body strong{font-weight:var(--fw-bold);color:#111}
.article-body a.link{color:var(--purple);font-weight:var(--fw-semibold);text-decoration:underline}
.article-body ul,.article-body ol{margin:0 0 22px;padding-left:22px}
.article-body li{margin:0 0 10px}
.article-body blockquote{margin:var(--space-8) 0;padding:6px 0 6px 24px;border-left:4px solid var(--purple);font-size:21px;font-weight:var(--fw-bold);line-height:1.6;color:#1a1c20}
.article-body blockquote cite{display:block;margin-top:var(--space-3);font-size:var(--text-md);font-weight:var(--fw-medium);font-style:normal;color:#8d8e91}
.inline-img{margin:var(--space-8) 0}
.inline-img .ph{aspect-ratio:16/9;border-radius:14px}
.inline-img figcaption{margin-top:10px;text-align:center;font-size:var(--text-sm);color:#9a9da5}
.callout{background:#f6f5ff;border:1px solid #e6e3ff;border-radius:14px;padding:24px 26px;margin:var(--space-8) 0}
.callout h4{margin:0 0 var(--space-3);font-size:var(--text-base);font-weight:var(--fw-black);color:var(--purple)}
.callout ul{margin:0;padding-left:20px;font-size:var(--text-base);color:#454b55;line-height:1.7}
.callout li{margin:0 0 8px}
.callout li:last-child{margin:0}

.cta-banner{margin:var(--space-12) 0;background:#111114;border-radius:18px;padding:var(--space-10);text-align:center;color:#fff}
.cta-banner h3{font-size:var(--text-2xl);font-weight:var(--fw-bold);margin:0 0 var(--space-2);color:#fff}
.cta-banner p{color:rgba(255,255,255,.7);margin:0 0 var(--space-6)}
.cta-banner a{display:inline-block;background:#fff;color:#111;border-radius:var(--r-pill);padding:13px 28px;font-weight:var(--fw-bold)}

.share-row{display:flex;align-items:center;gap:var(--space-3);margin:var(--space-12) 0 0;padding-top:var(--space-8);border-top:1px solid var(--line)}
.share-row .lbl{font-size:var(--text-md);font-weight:var(--fw-bold);color:#8d8e91;margin-right:auto}
.share-btn{width:42px;height:42px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:#5a5e66;font-weight:var(--fw-black);font-size:var(--text-sm);cursor:pointer;background:#fff}
.share-btn:hover{background:#f5f5f7}

.author-box{display:flex;gap:var(--space-4);align-items:center;background:#f7f7f8;border-radius:16px;padding:24px;margin-top:var(--space-6)}
.author-box .ava{width:60px;height:60px;border-radius:50%;flex:none}
.author-box b{font-size:var(--text-lg)}
.author-box p{margin:4px 0 0;font-size:var(--text-sm);color:#69707b;line-height:1.6}

/* ── 목차 (sticky) ── */
.toc{position:sticky;top:96px;font-size:var(--text-md)}
.toc h5{font-size:var(--text-xs);font-weight:var(--fw-black);letter-spacing:.06em;color:#a0a4ac;margin:0 0 var(--space-3)}
.toc a{display:block;padding:7px 0 7px 14px;border-left:2px solid var(--line);color:#8d8e91;font-weight:var(--fw-medium);line-height:1.4;transition:.15s}
.toc a:hover{color:#33363d}
.toc a.active{border-left-color:var(--purple);color:#1a1c20;font-weight:var(--fw-bold)}

/* ── 추천 아티클 ── */
.related{padding:var(--space-20) 0;border-top:1px solid var(--line);margin-top:var(--space-16)}
.related h2{font-size:var(--text-3xl);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug);margin:0 0 var(--space-8)}
.card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-8) var(--space-6)}
.card{display:flex;flex-direction:column;cursor:pointer}
.card .thumb{aspect-ratio:16/10;border-radius:var(--r-md);margin-bottom:var(--space-4);transition:.25s}
.card:hover .thumb{transform:translateY(-4px);box-shadow:var(--shadow)}
.card .tag{font-size:var(--text-xs);font-weight:var(--fw-bold);color:var(--purple);margin-bottom:var(--space-2)}
.card h3{font-size:var(--text-xl);line-height:1.4;margin:0 0 var(--space-3);font-weight:var(--fw-bold);letter-spacing:var(--ls-normal);word-break:keep-all}
.card .byline{display:flex;align-items:center;gap:var(--space-2);margin-top:auto;font-size:var(--text-sm);color:#7b808a}
.card .byline .ava{width:28px;height:28px;border-radius:50%;flex:none}
.card .byline b{color:#33363d;font-weight:var(--fw-semibold)}
.card .byline .dot{color:#c7c9cf}

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

@media(max-width:980px){
  .article-layout{grid-template-columns:1fr;gap:0}
  .toc{display:none}
}
@media(max-width:900px){
  .links{display:none}
  .article-head h1{font-size:var(--text-2xl)}
  .article-body{font-size:16px}
  .card-grid{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr 1fr}
  .newsletter{padding:var(--space-12) var(--space-6)}
}
@media(max-width:600px){.sub-form{flex-direction:column}}
`;

// 목차 섹션 (id ↔ 라벨)
const SECTIONS = [
  ["sec-1", "프로젝트 배경"],
  ["sec-2", "무엇이 문제였나"],
  ["sec-3", "어떻게 접근했나"],
  ["sec-4", "적용 단계"],
  ["sec-5", "도입 후 결과"],
  ["sec-6", "고객의 한마디"],
  ["sec-7", "마치며"],
];

const RELATED = [
  { slug: "article-1", ph: "ph-1", tag: "성공 사례", title: "추천 아티클 제목 자리입니다 — 플레이스홀더 1", author: "에디터", date: "2026년 5월 2일" },
  { slug: "article-2", ph: "ph-2", tag: "활용 팁", title: "추천 아티클 제목 자리입니다 — 플레이스홀더 2", author: "운영팀", date: "2026년 4월 28일" },
  { slug: "article-3", ph: "ph-3", tag: "비즈니스 인사이트", title: "추천 아티클 제목 자리입니다 — 플레이스홀더 3", author: "디자인팀", date: "2026년 4월 20일" },
];

const body = `
  <nav class="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="/"><img class="logo-img" src="/logo.png" alt="System Web" /></a>
      <div class="links">
        <div class="nav-item">
          <a>서비스</a>
          <div class="dropdown"><div class="dd-card">
            <a class="dd-link" href="/price"><b>랜딩페이지</b><span>단일 페이지로 빠르게</span></a>
            <a class="dd-link" href="/price"><b>홈페이지</b><span>여러 페이지 + 문의 흐름</span></a>
            <a class="dd-link" href="/price"><b>자사몰</b><span>주문·결제까지</span></a>
            <a class="dd-link" href="/price"><b>맞춤·플랫폼</b><span>MVP·복합 기능</span></a>
          </div></div>
        </div>
        <div class="nav-item">
          <a>진행방식</a>
          <div class="dropdown"><div class="dd-card">
            <a class="dd-link" href="/#"><b>필수 범위 구분</b><span>Must-have부터 정의</span></a>
            <a class="dd-link" href="/#"><b>진행 상황 공유</b><span>남은 작업을 투명하게</span></a>
            <a class="dd-link" href="/#"><b>태스크 실행</b><span>안내가 아닌 결과물</span></a>
            <a class="dd-link" href="/#"><b>평가·개선</b><span>지표 보고 다음 개선</span></a>
          </div></div>
        </div>
        <a href="/price">가격</a>
        <a class="cur" href="/blog">블로그</a>
      </div>
      <div class="nav-actions"><a href="/">로그인</a><a class="pill-dark" href="/#contact">5분 견적 받기</a></div>
    </div>
  </nav>

  <article>
    <nav class="breadcrumb">
      <a href="/blog">블로그</a><span class="sep">›</span><a href="/blog">성공 사례</a><span class="sep">›</span>아티클 상세
    </nav>

    <header class="article-head">
      <div class="atags"><span class="atag">성공 사례</span><span class="atag">자사몰</span><span class="atag">카페24</span></div>
      <h1>제작 사례 제목이 들어갈 자리입니다 — 상세 페이지 플레이스홀더</h1>
      <div class="ameta">
        <span class="ava ava-ph"></span>
        <b>에디터</b><span class="sep">·</span><span>콘텐츠 마케터</span><span class="sep">·</span><span>2026년 5월 8일</span><span class="sep">·</span><span>읽는 데 8분</span>
      </div>
    </header>

    <div class="cover ph"></div>

    <div class="article-layout">
      <div class="article-body">
        <div class="callout">
          <h4>한눈에 보는 핵심</h4>
          <ul>
            <li>이 글의 핵심 요약 1번 자리입니다. 실제 내용으로 교체하세요.</li>
            <li>핵심 요약 2번 자리 — 어떤 문제를 어떻게 해결했는지 한 줄로.</li>
            <li>핵심 요약 3번 자리 — 정량 결과(예: 전환 2.1배)를 짧게.</li>
          </ul>
        </div>

        <p>본문 도입 문단 자리입니다. 이 문단에서는 글의 배경과 맥락을 소개합니다. 실제 발행 시 독자가 이어서 읽고 싶도록 핵심 메시지를 앞에 배치하세요. 발췌문과 본문 톤은 한국어 직설·단문을 따릅니다.</p>

        <h2 id="sec-1">프로젝트 배경</h2>
        <p>섹션 본문 문단 자리입니다. 어떤 브랜드·업종이었고 왜 이 프로젝트가 시작됐는지 설명합니다. 두세 문단 정도의 길이로 채워집니다. <a class="link" href="#">참고 링크</a>처럼 인라인 링크도 들어갈 수 있습니다.</p>
        <p>두 번째 문단 자리입니다. <strong>강조가 필요한 부분</strong>은 굵게 표시합니다.</p>

        <figure class="inline-img"><div class="ph ph-1"></div><figcaption>이미지 설명(캡션) 자리입니다.</figcaption></figure>

        <h2 id="sec-2">무엇이 문제였나</h2>
        <p>문제 상황을 정리하는 섹션입니다. 기존 방식의 한계나 고객이 겪던 어려움을 구체적으로 적습니다.</p>
        <ul>
          <li>문제 항목 1 — 플레이스홀더 텍스트입니다.</li>
          <li>문제 항목 2 — 플레이스홀더 텍스트입니다.</li>
          <li>문제 항목 3 — 플레이스홀더 텍스트입니다.</li>
        </ul>

        <h2 id="sec-3">어떻게 접근했나</h2>
        <p>해결 접근 방식을 설명하는 섹션입니다. 어떤 기준과 시스템으로 문제를 풀었는지 서술합니다.</p>
        <blockquote>“핵심 인용문이 들어갈 자리입니다. 고객이나 담당자의 한마디를 강조해 보여 줍니다.”<cite>— 담당자 직책</cite></blockquote>

        <h2 id="sec-4">적용 단계</h2>
        <p>실제 적용 과정을 단계별로 정리합니다.</p>
        <ol>
          <li>1단계 — 필수 범위와 일정 정의(플레이스홀더).</li>
          <li>2단계 — 디자인 시안과 핵심 화면 구현(플레이스홀더).</li>
          <li>3단계 — 연동·자동화 및 검수(플레이스홀더).</li>
          <li>4단계 — 오픈 후 지표 확인과 개선(플레이스홀더).</li>
        </ol>
        <div class="callout">
          <h4>적용 시 체크리스트</h4>
          <ul>
            <li>체크 항목 1 자리입니다.</li>
            <li>체크 항목 2 자리입니다.</li>
          </ul>
        </div>

        <h2 id="sec-5">도입 후 결과</h2>
        <p>정량·정성 결과를 정리하는 섹션입니다. 그래프나 수치 이미지를 함께 배치할 수 있습니다.</p>
        <figure class="inline-img"><div class="ph ph-2"></div><figcaption>결과 지표 그래프 자리입니다.</figcaption></figure>

        <h2 id="sec-6">고객의 한마디</h2>
        <blockquote>“도입 후 무엇이 어떻게 좋아졌는지에 대한 고객 후기 자리입니다.”<cite>— 고객사 담당자</cite></blockquote>

        <h2 id="sec-7">마치며</h2>
        <p>마무리 문단 자리입니다. 글의 핵심을 다시 짚고, 다음 행동(견적 문의 등)으로 자연스럽게 연결합니다.</p>

        <div class="cta-banner">
          <h3>비슷한 사이트, 5분이면 견적이 나옵니다</h3>
          <p>만들고 싶은 사이트만 적어주세요. 예상 견적과 일정을 바로 드립니다.</p>
          <a href="/#contact">5분 견적 받기</a>
        </div>

        <div class="share-row">
          <span class="lbl">이 글 공유하기</span>
          <button class="share-btn" type="button" aria-label="링크 복사">↗</button>
          <button class="share-btn" type="button" aria-label="페이스북 공유">f</button>
          <button class="share-btn" type="button" aria-label="엑스 공유">X</button>
        </div>

        <div class="author-box">
          <span class="ava ava-ph"></span>
          <div>
            <b>에디터</b>
            <p>작성자 소개 자리입니다. 역할과 한 줄 소개를 적습니다. 실제 발행 시 교체하세요.</p>
          </div>
        </div>
      </div>

      <aside class="toc">
        <h5>목차</h5>
        ${SECTIONS.map(([id, label]) => `<a href="#${id}" data-id="${id}">${label}</a>`).join("")}
      </aside>
    </div>
  </article>

  <section class="wrap related">
    <h2>이어서 읽기 좋은 글</h2>
    <div class="card-grid">
      ${RELATED.map(
        (a) => `
        <a class="card" href="/blog/articles/${a.slug}">
          <div class="thumb ph ${a.ph}"></div>
          <div class="tag">${a.tag}</div>
          <h3>${a.title}</h3>
          <div class="byline"><span class="ava ava-ph"></span><b>${a.author}</b><span class="dot">·</span><span>${a.date}</span></div>
        </a>`
      ).join("")}
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
      <div><h4>가격</h4><a href="/price">패키지</a><a href="/price">추가 항목</a><a href="/price">FAQ</a></div>
      <div><h4>블로그</h4><a href="/blog">외주 일정 관리</a><a href="/blog">카페24 운영</a><a href="/blog">랜딩페이지 전환</a></div>
      <div><h4>리소스</h4><a>FAQ</a><a>체크리스트</a><a>문의하기</a></div>
      <div><h4>회사</h4><a>소개</a><a>사례</a><a>파트너</a></div>
    </div>
  </footer>
`;

export default function ArticlePage() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // 목차 스크롤 스파이 — 현재 보이는 섹션 강조
    const tocLinks = Array.from(root.querySelectorAll(".toc a"));
    const headings = Array.from(root.querySelectorAll(".article-body h2[id]"));
    if (!tocLinks.length || !headings.length) return;

    const setActive = (id) => {
      tocLinks.forEach((a) => a.classList.toggle("active", a.dataset.id === id));
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 }
    );
    headings.forEach((h) => io.observe(h));

    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
