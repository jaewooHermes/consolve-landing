const workItems = [
  {
    title: "자사몰 리뉴얼",
    caption: "cafe24 결제·배송·운영 인계",
    image: "/projects/mogoma.png",
  },
  {
    title: "홈페이지",
    caption: "브랜드 소개와 문의 흐름 정리",
    image: "/projects/haru.png",
  },
  {
    title: "랜딩페이지",
    caption: "광고 유입을 위한 1페이지",
    image: "/projects/runninglife.png",
  },
  {
    title: "서비스 MVP",
    caption: "검증용 화면과 핵심 플로우",
    image: "/projects/autothread.png",
  },
  {
    title: "콘텐츠 사이트",
    caption: "읽히는 구조와 모바일 최적화",
    image: "/projects/arthor.png",
  },
  {
    title: "예약형 페이지",
    caption: "문의·예약 CTA 중심 설계",
    image: "/projects/komap.png",
  },
  {
    title: "브랜드 페이지",
    caption: "톤앤매너와 케이스 정리",
    image: "/projects/sajudiary.png",
  },
  {
    title: "포트폴리오",
    caption: "작업물 중심 쇼케이스",
    image: "/projects/maen-ttang.png",
  },
];

const footerColumns = [
  ["Company", "About", "Work", "Pricing", "Contact"],
  ["Services", "랜딩페이지", "홈페이지", "자사몰", "MA 운영"],
  ["Resources", "가격 가이드", "케이스 스터디", "진행 방식", "FAQ"],
  ["Build", "Next.js", "Cloudflare", "Cursor", "Claude"],
  ["Contact", "1일 견적", "진행 현황", "이메일", "카카오톡"],
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
    </span>
  );
}

function PromptBox({ compact = false }) {
  return (
    <form className={`prompt-box ${compact ? "prompt-box-compact" : ""}`}>
      <label htmlFor={compact ? "footer-prompt" : "hero-prompt"} className="sr-only">
        견적 요청 내용
      </label>
      <textarea
        id={compact ? "footer-prompt" : "hero-prompt"}
        placeholder={compact ? "만들고 싶은 페이지를 한 줄로 적어주세요..." : "예: 자사몰 상품 상세와 결제 흐름까지 다시 만들고 싶어요..."}
        rows={compact ? 2 : 3}
      />
      <div className="prompt-actions">
        <button className="icon-button" type="button" aria-label="파일 첨부">
          +
        </button>
        <div className="prompt-right">
          <span>1일 견적</span>
          <button className="send-button" type="submit" aria-label="견적 요청 보내기">
            ↑
          </button>
        </div>
      </div>
    </form>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero-gradient">
        <header className="topbar">
          <a className="brand-link" href="#" aria-label="Consolve home">
            <BrandMark />
            Consolve
          </a>
          <nav className="nav-links" aria-label="주요 메뉴">
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#numbers">Numbers</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <div className="nav-actions">
            <a className="ghost-button" href="#progress">
              진행 보기
            </a>
            <a className="light-button" href="#quote">
              견적 받기
            </a>
          </div>
        </header>

        <div className="hero-content">
          <h1>1일 견적. 실시간 진행. 6개월 무상 보증.</h1>
          <p>AI로 만드는 1인 개발 외주 — 랜딩 30 / 홈 100 / 자사몰 300.</p>
          <PromptBox />
        </div>
      </section>

      <section className="dark-page">
        <div className="trust-strip">
          <p>5월 첫 작업을 실제 출시까지 밀어붙인 스택</p>
          <div className="trust-logos" aria-label="사용 기술">
            <span>Next.js</span>
            <span>cafe24</span>
            <span>Cloudflare</span>
            <span>Cursor</span>
            <span>Claude</span>
          </div>
        </div>

        <section className="meet-section" id="services">
          <div className="section-wrap">
            <h2>Meet Consolve</h2>
            <div className="meet-grid">
              <div className="orb-card" aria-hidden="true">
                <div className="orb-shadow" />
                <div className="orb" />
              </div>
              <div className="steps">
                <article className="step step-active">
                  <h3>Start with a brief</h3>
                  <p>만들고 싶은 것, 참고 사이트, 예산만 보내면 1일 안에 견적과 일정을 정리합니다.</p>
                </article>
                <article className="step">
                  <h3>Watch progress live</h3>
                  <p>진행 단계, 산출물, 다음 액션을 /progress 화면에서 확인합니다.</p>
                </article>
                <article className="step">
                  <h3>Ship and keep it stable</h3>
                  <p>출시 후 6개월 동안 발견되는 기본 오류는 무상으로 보증합니다.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="work-section" id="work">
          <div className="section-wrap">
            <div className="section-heading-row">
              <div>
                <h2>작업 포트폴리오</h2>
                <p>랜딩, 홈페이지, 자사몰을 빠르게 출시 가능한 단위로 만듭니다.</p>
              </div>
              <a href="#quote">View all</a>
            </div>
            <div className="work-grid">
              {workItems.map((item) => (
                <article className="work-card" key={item.title}>
                  <img src={item.image} alt="" />
                  <h3>{item.title}</h3>
                  <p>{item.caption}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="numbers-section" id="numbers">
          <div className="section-wrap">
            <h2>Consolve in numbers</h2>
            <p>지금은 작게, 대신 숫자로 약속합니다.</p>
            <div className="number-grid">
              <article>
                <strong>1일</strong>
                <span>견적 응답 목표</span>
              </article>
              <article>
                <strong>3종</strong>
                <span>랜딩·홈·자사몰 표준 패키지</span>
              </article>
              <article>
                <strong>6개월</strong>
                <span>출시 후 기본 오류 무상 보증</span>
              </article>
            </div>
          </div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="section-wrap">
            <div className="section-heading-row">
              <div>
                <h2>가격</h2>
                <p>먼저 물어보지 않아도 되는 외주 단가.</p>
              </div>
            </div>
            <div className="price-grid">
              <article>
                <span>Landing</span>
                <strong>30만</strong>
                <p>3~5일. 반응형 1페이지와 문의 폼.</p>
              </article>
              <article>
                <span>Website</span>
                <strong>100만</strong>
                <p>1~2주. 회사 소개, 포트폴리오, 기본 CMS.</p>
              </article>
              <article>
                <span>Commerce</span>
                <strong>300만</strong>
                <p>3~4주. cafe24 셋업, 결제·배송, 운영 인계.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="ready-section" id="quote">
          <div className="ready-glow" />
          <div className="section-wrap ready-inner">
            <span>AI Native Development Studio</span>
            <h2>Ready to build?</h2>
            <PromptBox compact />
          </div>
        </section>

        <footer className="footer">
          <div className="footer-panel">
            <div className="footer-brand">
              <BrandMark />
            </div>
            {footerColumns.map(([title, ...links]) => (
              <div className="footer-col" key={title}>
                <h3>{title}</h3>
                {links.map((link) => (
                  <a href="#quote" key={link}>
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </footer>
      </section>
    </main>
  );
}
