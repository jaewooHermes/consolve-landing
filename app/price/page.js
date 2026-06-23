"use client";

// 가격 안내 (/price) — channel.io/ko/pricing 레이아웃 패턴 차용 (구조만, 내용은 System Web 패키지)
// 구조: 히어로 → 결제 토글 → 4개 플랜 카드 → 기능 비교 표 → 추가 항목 → FAQ 아코디언 → 하단 CTA
// 가격: 랜딩 30만 / 홈 100만 / 자사몰 300만 / 맞춤 견적 (초안 — 상세 견적에 따라 달라질 수 있음)
// 컨벤션: 인라인 css + body 문자열을 dangerouslySetInnerHTML로 렌더, 인터랙션은 useEffect 바인딩.
//
// ▸ 디자인 조절은 아래 :root 토큰 블록만 수정하면 전체에 반영됩니다.

import { useEffect, useRef } from "react";
import { bindConsultationAnalytics } from "../components/consultationAnalytics";
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

/* ── 히어로 ── */
.price-hero{padding:var(--space-20) 0 var(--space-12);text-align:center}
.price-hero h1{font-size:var(--text-5xl);line-height:1.2;margin:0 0 var(--space-4);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug);word-break:keep-all}
.price-hero p{font-size:var(--text-xl);color:#626873;margin:0 auto;max-width:560px}

/* ── 결제 토글 ── */
.toggle-row{display:flex;justify-content:center;margin:var(--space-10) 0 var(--space-4)}
.toggle{display:inline-flex;background:#f1f1f3;border-radius:var(--r-pill);padding:5px;gap:4px}
.toggle button{border:0;background:transparent;cursor:pointer;font-size:var(--text-md);font-weight:var(--fw-semibold);color:#5a5e66;padding:9px 20px;border-radius:var(--r-pill);white-space:nowrap;transition:.15s}
.toggle button.active{background:#fff;color:#111;box-shadow:0 2px 8px rgba(0,0,0,.1)}
.toggle .save{font-size:var(--text-xs);font-weight:var(--fw-bold);color:var(--purple);margin-left:6px}
.disclaimer{text-align:center;font-size:var(--text-sm);color:#9a9da5;margin:0 0 var(--space-12)}

/* ── 플랜 카드 ── */
.plan-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4);align-items:stretch;padding-bottom:var(--space-20)}
.plan{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:var(--r-lg);padding:var(--space-7);background:#fff;position:relative}
.plan.featured{border:2px solid var(--purple);box-shadow:var(--shadow)}
.badge{position:absolute;top:-13px;left:var(--space-7);background:var(--purple);color:#fff;font-size:var(--text-xs);font-weight:var(--fw-bold);border-radius:var(--r-pill);padding:5px 12px}
.plan-name{font-size:var(--text-xl);font-weight:var(--fw-bold);margin:0 0 var(--space-1)}
.plan-sub{font-size:var(--text-sm);color:#8d8e91;margin:0 0 var(--space-5);min-height:20px}
.price{font-size:var(--text-3xl);font-weight:var(--fw-black);letter-spacing:var(--ls-display);line-height:1}
.price small{font-size:var(--text-md);font-weight:var(--fw-semibold);color:#8d8e91;margin-left:4px;letter-spacing:var(--ls-normal)}
.price-note{font-size:var(--text-xs);color:#a0a4ac;margin:var(--space-2) 0 var(--space-6);min-height:16px}
.plan-cta{display:block;text-align:center;border-radius:var(--r-pill);padding:13px;font-size:var(--text-md);font-weight:var(--fw-bold);cursor:pointer;margin-bottom:var(--space-6)}
.plan-cta.dark{background:#111114;color:#fff}
.plan-cta.ghost{border:1px solid #dcdce2;color:#33363d;background:#fff}
.plan-cta.primary{background:var(--purple);color:#fff}
.feat{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--space-3)}
.feat li{font-size:var(--text-sm);color:#454b55;line-height:1.5;padding-left:24px;position:relative}
.feat li::before{content:"✓";position:absolute;left:0;top:0;color:var(--purple);font-weight:var(--fw-black);font-size:var(--text-sm)}

/* ── 비교 표 ── */
.compare{padding:var(--space-20) 0;border-top:1px solid var(--line)}
.compare h2{text-align:center;font-size:var(--text-3xl);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug);margin:0 0 var(--space-12)}
.ctable{width:100%;border-collapse:collapse;font-size:var(--text-sm)}
.ctable th,.ctable td{padding:16px 14px;text-align:center;border-bottom:1px solid var(--line)}
.ctable thead th{font-size:var(--text-md);font-weight:var(--fw-bold);color:#111;border-bottom:2px solid #e6e6ec}
.ctable thead th.hl{color:var(--purple)}
.ctable td:first-child,.ctable th:first-child{text-align:left;color:#454b55;font-weight:var(--fw-semibold);width:30%}
.ctable .grp td{background:#fafafa;font-weight:var(--fw-bold);color:#33363d;text-align:left;font-size:var(--text-xs);letter-spacing:.04em;text-transform:uppercase}
.ctable .ok{color:var(--purple);font-weight:var(--fw-bold)}
.ctable .no{color:#c7c9cf}

/* ── 추가 항목 ── */
.addons{padding:var(--space-20) 0;background:#f7f7f8}
.addons h2{text-align:center;font-size:var(--text-3xl);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug);margin:0 0 var(--space-3)}
.addons .sub{text-align:center;font-size:var(--text-lg);color:#626873;margin:0 0 var(--space-12)}
.addon-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4)}
.addon{background:#fff;border:1px solid var(--line);border-radius:var(--r-md);padding:var(--space-6)}
.addon h3{font-size:var(--text-lg);font-weight:var(--fw-bold);margin:0 0 var(--space-2)}
.addon p{font-size:var(--text-sm);color:#69707b;line-height:var(--lh-relaxed);margin:0 0 var(--space-4)}
.addon .amt{font-size:var(--text-2xl);font-weight:var(--fw-black);letter-spacing:var(--ls-display)}
.addon .amt small{font-size:var(--text-sm);font-weight:var(--fw-semibold);color:#8d8e91;margin-left:4px;letter-spacing:var(--ls-normal)}

/* ── FAQ ── */
.faq{padding:var(--space-20) 0}
.faq h2{text-align:center;font-size:var(--text-3xl);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug);margin:0 0 var(--space-12)}
.faq-list{max-width:760px;margin:0 auto}
.faq-item{border-bottom:1px solid var(--line)}
.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:var(--space-4);background:transparent;border:0;cursor:pointer;text-align:left;padding:var(--space-6) 0;font-size:var(--text-lg);font-weight:var(--fw-semibold);color:#1a1c20}
.faq-q .ico{flex:none;color:#a0a4ac;font-size:var(--text-2xl);font-weight:var(--fw-medium);transition:transform .2s}
.faq-item.open .faq-q .ico{transform:rotate(45deg);color:var(--purple)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .25s ease}
.faq-a p{margin:0;padding:0 0 var(--space-6);font-size:var(--text-md);color:#626873;line-height:var(--lh-relaxed)}

/* ── 하단 CTA ── */
.bottom-cta{padding:var(--space-24) 0;text-align:center;background:#f6f4f1}
.bottom-cta h2{font-size:var(--text-4xl);font-weight:var(--fw-bold);letter-spacing:var(--ls-snug);margin:0 0 var(--space-4)}
.bottom-cta p{font-size:var(--text-lg);color:#626873;margin:0 0 var(--space-8)}
.bottom-cta .pill-dark{display:inline-block;padding:15px 30px;font-size:var(--text-md)}
.bottom-cta .notes{margin-top:var(--space-6);color:#9a9da5;font-size:var(--text-sm)}
.bottom-cta .notes span{margin:0 10px}

/* ── Footer ── */
.footer{background:#fff;border-top:1px solid #e8e8ec;padding:var(--space-16) 0 var(--space-24);color:#5f636d}
.footer-grid{display:grid;grid-template-columns:1.5fr repeat(5,1fr);gap:var(--space-7)}
.footer h4{font-size:var(--text-sm);color:#111;margin:0 0 var(--space-4)}
.footer a{display:block;font-size:var(--text-sm);margin:9px 0;color:#737780}

@media(max-width:1000px){.plan-grid{grid-template-columns:repeat(2,1fr)}.addon-grid{grid-template-columns:1fr 1fr}}
@media(max-width:900px){
  .links{display:none}
  .price-hero h1{font-size:var(--text-4xl)}
  .ctable{font-size:var(--text-xs)}
  .ctable th,.ctable td{padding:12px 8px}
  .footer-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){.plan-grid{grid-template-columns:1fr}.addon-grid{grid-template-columns:1fr}
  .compare{overflow-x:auto}.ctable{min-width:560px}}
`;

const PLANS = [
  {
    name: "랜딩페이지",
    sub: "단일 페이지로 빠르게",
    once: "30만",
    split: "월 10만",
    note: "3개월 분할 시",
    cta: "5분 견적 받기",
    ctaClass: "ghost",
    feats: [
      "반응형 단일 페이지 1종",
      "문의 폼 · CTA 연결",
      "기본 카피 정리",
      "제작 7일 내외",
      "6개월 무상 오류 보증",
    ],
  },
  {
    name: "홈페이지",
    sub: "여러 페이지 + 문의 흐름",
    once: "100만",
    split: "월 34만",
    note: "3개월 분할 시",
    cta: "5분 견적 받기",
    ctaClass: "primary",
    featured: true,
    feats: [
      "반응형 5~7개 페이지",
      "포트폴리오 · 회사 소개 구성",
      "카카오톡 채널 연결",
      "기본 SEO · 메타 설정",
      "제작 3주 내외",
      "6개월 무상 오류 보증",
    ],
  },
  {
    name: "자사몰",
    sub: "주문 · 결제까지",
    once: "300만",
    split: "월 100만",
    note: "3개월 분할 시",
    cta: "5분 견적 받기",
    ctaClass: "ghost",
    feats: [
      "카페24 · 자사몰 구축",
      "상품 · 기획전 · 결제 연동",
      "주문 알림 자동화",
      "관리자 운영 가이드",
      "제작 4~6주 내외",
      "6개월 무상 오류 보증",
    ],
  },
  {
    name: "맞춤 · 플랫폼",
    sub: "MVP · 복합 기능",
    once: "견적 문의",
    split: "견적 문의",
    note: "",
    cta: "문의하기",
    ctaClass: "dark",
    feats: [
      "요구사항 기반 맞춤 설계",
      "회원 · 대시보드 등 기능 구현",
      "외부 API · 자동화 연동",
      "단계별 분할 진행",
      "일정 · 범위 별도 협의",
    ],
  },
];

const COMPARE = [
  { grp: "제작 범위" },
  ["페이지 수", "1종", "5~7종", "쇼핑몰 일체", "협의"],
  ["반응형(모바일)", "ok", "ok", "ok", "ok"],
  ["문의 폼 · CTA", "ok", "ok", "ok", "ok"],
  ["카카오톡 채널 연결", "no", "ok", "ok", "ok"],
  ["주문 · 결제 연동", "no", "no", "ok", "협의"],
  ["관리자 · 자동화", "no", "기본", "ok", "ok"],
  { grp: "진행 · 보증" },
  ["디자인 시안", "1안", "2안", "2안", "협의"],
  ["제작 기간", "7일", "3주", "4~6주", "협의"],
  ["수정 횟수", "2회", "3회", "3회", "협의"],
  ["무상 오류 보증", "6개월", "6개월", "6개월", "6개월"],
];

const ADDONS = [
  { name: "추가 페이지", desc: "기본 패키지 외 페이지를 더할 때.", amt: "10만", unit: "/ 페이지" },
  { name: "카피라이팅", desc: "핵심 메시지·본문 카피 작성 대행.", amt: "15만", unit: "/ 페이지" },
  { name: "로고 · 브랜딩", desc: "간단한 로고와 기본 컬러 정리.", amt: "30만", unit: "~" },
  { name: "자동화 연동", desc: "make·노션·시트 등 워크플로우 연결.", amt: "10만", unit: "/ 연동" },
  { name: "유지보수(월)", desc: "오픈 후 정기 수정·운영 지원.", amt: "월 15만", unit: "~" },
  { name: "촬영 · 이미지", desc: "제품·현장 촬영, 이미지 보정.", amt: "별도", unit: "견적" },
];

const FAQS = [
  ["견적은 어떻게 정해지나요?", "사이트 종류와 필요한 기능을 알려 주시면 1차로 AI가 5분 안에 예상 견적과 일정을 잡아드립니다. 상세 견적이 필요하면 요청 주시는 대로 직접 검토해 발송합니다."],
  ["표시된 가격이 더 늘어날 수 있나요?", "표의 금액은 표준 패키지 기준 초안입니다. 페이지 수, 연동 범위, 디자인 요구에 따라 달라질 수 있어 상세 견적에서 확정됩니다."],
  ["무상 보증은 어디까지 포함되나요?", "오픈 후 6개월간 제작 범위 내에서 발생한 기본 오류를 무상으로 수정합니다. 신규 기능 추가나 디자인 변경은 별도 항목입니다."],
  ["수정은 몇 번까지 가능한가요?", "패키지별로 정해진 시안·수정 횟수가 있으며, 그 안에서 방향을 잡고 다듬습니다. 추가 수정은 범위에 따라 별도로 안내드립니다."],
  ["분할 결제가 가능한가요?", "3개월 분할을 기본으로 안내드리며, 프로젝트 규모에 따라 단계별(착수·중간·완료) 분할도 협의할 수 있습니다."],
  ["환불 정책은 어떻게 되나요?", "착수 전에는 전액 환불됩니다. 진행 단계에 따라 이미 완료된 작업분을 제외하고 환불 범위를 협의합니다."],
];

const planHTML = (p) => `
  <div class="plan${p.featured ? " featured" : ""}">
    ${p.featured ? '<div class="badge">추천</div>' : ""}
    <div class="plan-name">${p.name}</div>
    <div class="plan-sub">${p.sub}</div>
    <div class="price" data-once="${p.once}" data-split="${p.split}">${p.once}${p.once.endsWith("만") ? '<small>원~</small>' : ""}</div>
    <div class="price-note">${p.note || ""}</div>
    <a class="plan-cta ${p.ctaClass}" href="/#contact" data-ga-consultation-cta data-ga-location="price_plan_${p.name}" data-ga-text="${p.cta}">${p.cta}</a>
    <ul class="feat">${p.feats.map((f) => `<li>${f}</li>`).join("")}</ul>
  </div>`;

const compareRowHTML = (row) => {
  if (row.grp) return `<tr class="grp"><td colspan="5">${row.grp}</td></tr>`;
  const cell = (v) =>
    v === "ok"
      ? '<span class="ok">✓</span>'
      : v === "no"
      ? '<span class="no">–</span>'
      : v;
  return `<tr><td>${row[0]}</td><td>${cell(row[1])}</td><td>${cell(row[2])}</td><td>${cell(row[3])}</td><td>${cell(row[4])}</td></tr>`;
};

const body = `${getNavHtml('price')}

  <section class="price-hero">
    <div class="wrap">
      <h1>프로젝트 규모에 맞는 합리적인 가격</h1>
      <p>랜딩 한 장부터 자사몰·플랫폼까지, 필요한 범위만큼만 선택하세요.</p>
      <div class="toggle-row">
        <div class="toggle" id="billToggle">
          <button class="active" data-mode="once">1회 결제</button>
          <button data-mode="split">3개월 분할<span class="save">분납</span></button>
        </div>
      </div>
      <p class="disclaimer">표시 금액은 표준 패키지 기준 초안이며, 상세 견적에 따라 달라질 수 있습니다.</p>
    </div>
  </section>

  <section class="wrap">
    <div class="plan-grid">
      ${PLANS.map(planHTML).join("")}
    </div>
  </section>

  <section class="compare">
    <div class="wrap">
      <h2>패키지별 상세 비교</h2>
      <table class="ctable">
        <thead>
          <tr><th>항목</th><th>랜딩페이지</th><th class="hl">홈페이지</th><th>자사몰</th><th>맞춤·플랫폼</th></tr>
        </thead>
        <tbody>
          ${COMPARE.map(compareRowHTML).join("")}
        </tbody>
      </table>
    </div>
  </section>

  <section class="addons">
    <div class="wrap">
      <h2>필요할 때 더하는 추가 항목</h2>
      <p class="sub">기본 패키지에 필요한 만큼만 골라 더할 수 있습니다.</p>
      <div class="addon-grid">
        ${ADDONS.map(
          (a) => `
          <div class="addon">
            <h3>${a.name}</h3>
            <p>${a.desc}</p>
            <div class="amt">${a.amt}<small>${a.unit}</small></div>
          </div>`
        ).join("")}
      </div>
    </div>
  </section>

  <section class="faq">
    <div class="wrap">
      <h2>자주 묻는 질문</h2>
      <div class="faq-list" id="faqList">
        ${FAQS.map(
          ([q, a]) => `
          <div class="faq-item">
            <button class="faq-q" type="button">${q}<span class="ico">+</span></button>
            <div class="faq-a"><p>${a}</p></div>
          </div>`
        ).join("")}
      </div>
    </div>
  </section>

  <section class="bottom-cta">
    <div class="wrap">
      <h2>견적부터 받아보는 게 제일 빠릅니다</h2>
      <p>만들 사이트만 적어주시면 5분 안에 예상 견적과 일정을 드립니다.</p>
      <a class="pill-dark" href="/#contact" data-ga-consultation-cta data-ga-location="price_bottom_quote" data-ga-text="5분 견적 받기">5분 견적 받기</a>
      <div class="notes"><span>· 사이트가 없어도 견적 가능</span><span>· 상세 견적은 직접 발송</span><span>· 6개월 무상 보증</span></div>
    </div>
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

export default function PricePage() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const unbindConsultationAnalytics = bindConsultationAnalytics(root);

    // 결제 토글 — 1회 결제 / 3개월 분할 금액 전환
    const toggle = root.querySelector("#billToggle");
    const prices = Array.from(root.querySelectorAll(".price"));
    let onToggle;
    if (toggle) {
      const btns = Array.from(toggle.querySelectorAll("button"));
      onToggle = (e) => {
        const btn = e.currentTarget;
        const mode = btn.dataset.mode;
        btns.forEach((b) => b.classList.toggle("active", b === btn));
        prices.forEach((p) => {
          const val = p.dataset[mode];
          p.innerHTML = val.endsWith("만") || val.startsWith("월")
            ? `${val}<small>원~</small>`
            : val;
        });
      };
      btns.forEach((b) => b.addEventListener("click", onToggle));
    }

    // FAQ 아코디언
    const faqList = root.querySelector("#faqList");
    let onFaq;
    if (faqList) {
      onFaq = (e) => {
        const q = e.target.closest(".faq-q");
        if (!q) return;
        const item = q.parentElement;
        const ans = item.querySelector(".faq-a");
        const open = item.classList.toggle("open");
        ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0px";
      };
      faqList.addEventListener("click", onFaq);
    }

    return () => {
      unbindConsultationAnalytics();
      if (toggle && onToggle)
        Array.from(toggle.querySelectorAll("button")).forEach((b) =>
          b.removeEventListener("click", onToggle)
        );
      if (faqList && onFaq) faqList.removeEventListener("click", onFaq);
    };
  }, []);

  return (
    <div ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
