import styles from "./page.module.css";

export const metadata = {
  title: "Visible Dev — 출시해도 부끄럽지 않은 웹사이트",
  description: "랜딩페이지, 회사 홈페이지, cafe24 자사몰까지 완성도 있게 만드는 개발 외주.",
};

export default function ChannelPage() {
  return (
    <div className={styles.page}>
      <nav className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="#">
            <span className="mark">✓</span> Visible Dev
          </a>
          <div className="links">
            <a>서비스 <span>⌄</span></a>
            <a>작업방식 <span>⌄</span></a>
            <a>사례</a>
            <a>자료 <span>⌄</span></a>
          </div>
          <div className="nav-actions">
            <a>로그인</a>
            <a className="pill-dark" href="#contact">프로젝트 상담하기</a>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <h1>빠르고 투명한 웹사이트 개발</h1>
              <p className="hero-copy">바쁘시죠? 바로 견적을 봐드릴게요. 결과물은 자신있습니다.</p>
              <form className="search-cta" id="contact">
                <input placeholder="만들고 싶은 웹사이트나 자사몰을 적어주세요" />
                <button className="go" aria-label="상담 시작">→</button>
              </form>
              <div className="chips">
                <span className="chip">랜딩페이지</span>
                <span className="chip">홈페이지</span>
                <span className="chip">카페24</span>
                <span className="chip">자동화</span>
              </div>
            </div>
            <div className="hero-visual" aria-label="웹사이트 미리보기">
              <div className="domain">visible.dev/work</div>
              <div className="tiny-toast">반응형 · 폼 연결 · 배포 완료</div>
              <div className="phone">
                <div className="bubble">
                  <strong>출시 체크</strong>
                  모바일 화면, 문의 폼, 카카오톡 연결, 기본 SEO까지 확인했습니다. 운영자가 바로 쓸 수 있게 인계합니다.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="logos">
          <div className="wrap logo-grid">
            <div className="logo">cafe24</div>
            <div className="logo">imweb</div>
            <div className="logo">KakaoTalk</div>
            <div className="logo">Google Sheets</div>
            <div className="logo">Notion</div>
            <div className="logo light">Shopify</div>
            <div className="logo light">Airtable</div>
            <a className="logo-cta">작업 범위 보기 ›</a>
            <div className="logo light">Slack</div>
            <div className="logo light">Discord</div>
          </div>
        </section>

        <section className="section center">
          <div className="wrap">
            <h2>빠르면서 만족스러운<br />개발물을 제공할 수 있는 이유.</h2>
            <p className="desc">작업을 빠르게 끝내는 것이 아니라, 반복되는 판단을 시스템화해 제작 속도와 결과물의 기준을 함께 끌어올립니다.</p>
            <div className="flow">
              <div className="flow-track" />
              <div className="flow-item step-card"><span>01</span><b>요청 정리</b></div>
              <div className="flow-item system-card"><span>제작 시스템</span><b>범위·구조 기준화</b></div>
              <div className="flow-item step-card"><span>02</span><b>디자인·개발</b></div>
              <div className="flow-item system-card"><span>검수 시스템</span><b>모바일·CTA 점검</b></div>
              <div className="flow-item step-card"><span>03</span><b>배포 준비</b></div>
              <div className="flow-item system-card"><span>인계 시스템</span><b>운영 기준 정리</b></div>
              <div className="flow-item step-card"><span>04</span><b>공유·확인</b></div>
              <div className="flow-note">
                <b>시스템이 단계 사이의 빈틈을 줄입니다</b>
                <p>반복되는 확인 항목을 매번 새로 판단하지 않기 때문에 더 빠르고, 놓치는 부분은 더 적어집니다.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section center">
          <div className="wrap">
            <h2>랜딩, 홈페이지, 자사몰까지<br />실제로 쓰이는 형태로 완성합니다</h2>
            <p className="desc">보여주기 좋은 화면에서 멈추지 않고, 문의 폼, 카카오톡 연결, 결제·배송 설정, 관리자 인계처럼 운영에 필요한 부분까지 챙깁니다.</p>
            <div className="case-card">
              <span className="arrow-round left">‹</span>
              <span className="arrow-round right">›</span>
              <h3>CAFE24 STORE</h3>
              <div className="num">300</div>
              <p>상품 상세, 모바일 배너, 결제·배송 설정, 문의 연결까지 운영자가 바로 판매를 시작할 수 있는 형태로 정리합니다.</p>
              <a>사례 보기 ›</a>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="intro-grid">
              <h2>완성도는<br />시스템에서 나옵니다</h2>
              <p className="desc intro-desc">모바일 반응형, 로딩 속도, 폼 연결, SEO 기본값, 배포, 운영 인계처럼 작은 항목들이 모여 실제로 쓸 수 있는 웹사이트가 됩니다.</p>
            </div>
            <div className="ai-city">
              <div className="grid-floor" />
              <div className="building purple">STATUS<br />HUB</div>
              <div className="building b1" />
              <div className="building b2" />
              <div className="building b3" />
              <div className="building b4" />
              <div className="building b5" />
              <div className="building b6" />
            </div>
          </div>
        </section>

        <section className="section center">
          <div className="wrap">
            <h2>개발물의 완성도를 높이는 시스템</h2>
            <p className="desc">좋은 결과물을 우연에 맡기지 않습니다. 제작, 검수, 인계, 공유가 하나의 시스템으로 이어지게 만듭니다.</p>
            <div className="reason-grid">
              <div className="reason"><div className="ico">1</div><h3>제작 시스템 ›</h3><p>반응형, CTA, 폼, 콘텐츠 구조에 체크리스트를 적용하며 구현합니다.</p></div>
              <div className="reason"><div className="ico">2</div><h3>검수 시스템 ›</h3><p>모바일, 링크, 문의 폼, 배포, SEO 기본값을 출시 전 기준으로 점검합니다.</p></div>
              <div className="reason"><div className="ico">3</div><h3>인계 시스템 ›</h3><p>배포 주소, 계정, 수정 방법, 다음 개선 항목을 운영자가 볼 수 있게 남깁니다.</p></div>
              <div className="reason"><div className="ico">4</div><h3>공유 시스템 ›</h3><p>진행 상황과 확인할 일을 남겨 완성도가 흐려지지 않게 관리합니다.</p></div>
            </div>
          </div>
        </section>

        <FeatureOne />
        <FeatureTwo />
        <FeatureThree />

        <section className="omni center">
          <div className="wrap">
            <div className="kicker">공유 시스템</div>
            <h2>진행 상황 공유도<br />시스템 안에서 관리합니다</h2>
            <p className="desc">요청사항이 흩어지지 않도록 한곳에 모으고, 확인해야 할 일을 정리합니다. 공유는 보여주기용 기능이 아니라 결과물의 완성도를 지키는 운영 시스템입니다.</p>
            <div className="app-shot">
              <aside className="side"><div className="dot" /><div className="list-item" /><div className="list-item w80" /><div className="list-item w70" /><div className="list-item" /></aside>
              <main className="chat-main"><div className="msg">카페24 모바일 배너 수정 요청</div><div className="msg">문의 폼은 카카오톡 채널로 연결해주세요.</div><div className="msg">오늘 확인할 항목 2개가 있습니다.</div></main>
              <aside className="profile"><div className="avatar" /><div className="list-item" /><div className="list-item w70" /><div className="list-item w90" /></aside>
            </div>
            <div className="channel-icons"><span>Talk</span><span>Mail</span><span>Board</span><span>Call</span><span>Sheet</span><span>Bot</span></div>
          </div>
        </section>

        <section className="section center">
          <div className="wrap">
            <h2>도구보다 중요한 건 시스템입니다</h2>
            <p className="desc">품질을 만드는 건 기준과 반복 가능한 시스템입니다. 무엇을 만들고 어떤 수준으로 완성할지는 사람이 판단합니다.</p>
            <div className="human-grid">
              <div className="human-card"><div className="mini-panel"><b>요청 목록</b><p>CTA 수정<br />배너 교체<br />카카오톡 연결</p></div></div>
              <div className="human-card"><div className="phone-small"><b>이번 고객</b><p>오픈일 D-5<br />확인 요청 3개</p></div></div>
              <div className="human-card"><div className="tree"><div className="root">필수 작업</div><div className="node n1">문의폼</div><div className="node n2">모바일</div><div className="node n3">배너</div></div></div>
            </div>
            <div className="human-caption"><div><h3>요청 맥락을 한 눈에</h3><p>고객이 남긴 요청과 진행 상태를 한곳에서 봅니다.</p></div><div><h3>놓치는 내용 없이 요약</h3><p>확인할 항목과 남은 작업을 짧게 정리합니다.</p></div><div><h3>필수 작업부터 선택</h3><p>마감 전 필요한 기능을 먼저 선별합니다.</p></div></div>
            <div className="stats-grid"><div className="stat-card"><b>30</b><span>랜딩페이지 시작가</span></div><div className="stat-card"><b>100</b><span>홈페이지 시작가</span></div><div className="stat-card"><b>300</b><span>cafe24 자사몰 시작가</span></div></div>
            <div className="platform"><div><h3>완성도 있는 개발물을 위한 실무 스택</h3><p className="desc platform-desc">프로젝트 성격에 맞춰 cafe24, imweb, Kakao, Make, Notion, Airtable 등을 필요한 만큼 연결합니다.</p></div><div className="platform-box"><div>cafe24</div><div>imweb</div><div>Kakao</div><div>make</div><div>notion</div><div>airtable</div></div></div>
          </div>
        </section>

        <section className="final-cta">
          <div className="wrap">
            <h2>출시할 웹사이트가 필요하다면<br />먼저 범위를 정리해드립니다</h2>
            <form className="search-cta final-search"><input placeholder="만들고 싶은 웹사이트나 자사몰을 적어주세요" /><button className="go">→</button></form>
            <div className="chips center-chips"><span className="chip">랜딩페이지</span><span className="chip">홈페이지</span><span className="chip">카페24</span><span className="chip">자동화</span></div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div><a className="brand"><span className="mark">✓</span> Visible Dev</a><p className="copyright">© 2026 Visible Dev<br />완성도 있는 개발물을 위한 외주 시안</p></div>
          <FooterCol title="서비스" items={["랜딩페이지", "홈페이지", "카페24 자사몰", "자동화"]} />
          <FooterCol title="가격" items={["작업 범위", "일정 상담", "추후 개선"]} />
          <FooterCol title="블로그" items={["외주 일정 관리", "카페24 운영", "랜딩페이지 전환"]} />
          <FooterCol title="리소스" items={["FAQ", "체크리스트", "문의하기"]} />
          <FooterCol title="회사" items={["소개", "사례", "파트너"]} />
        </div>
      </footer>

      <div className="float-chat">
        <div className="q">어떤 사이트가 필요하신가요?</div>
        <div className="q">작업 범위를 정리해드릴게요.</div>
        <div className="chat-btn">💬</div>
      </div>
    </div>
  );
}

function Panel({ rows }) {
  return (
    <div className="panel-fake">
      {rows.map(([label, value]) => (
        <div className="row" key={label}><b>{label}</b><span>{value}</span></div>
      ))}
    </div>
  );
}

function FeatureOne() {
  return (
    <section className="feature">
      <div className="wrap">
        <div className="feature-head"><div className="kicker">제작 시스템</div><h2>반응형과 CTA는 제작 기준으로 관리합니다</h2><p className="desc">웹사이트는 데스크톱보다 모바일에서 더 많이 확인됩니다. CTA, 폼, 이미지, 텍스트가 작은 화면에서도 자연스럽게 보이도록 제작 기준을 먼저 적용합니다.</p></div>
        <div className="feature-grid"><div className="visual-card visual-blue"><Panel rows={[["모바일 레이아웃", "확인"], ["CTA 버튼", "고정"], ["문의 폼", "연결"]]} /></div><div className="chat-card"><div className="chat-line">모바일에서 버튼이 잘 보이나요?</div><div className="chat-line">주요 CTA와 문의 폼은 첫 화면에서 바로 확인됩니다.</div><div className="before-after"><b>PC</b><span>Mobile</span></div></div></div>
        <div className="caption-grid"><div className="caption"><h3>제작 기준</h3><p><b>작은 화면에서 실제로 쓰기 편한지</b>까지 확인합니다. 화면만 줄이는 것이 아니라 사용 흐름을 기준에 맞춰 다시 정리합니다.</p></div><div className="caption"><h3>놓치기 쉬운 부분</h3><p>이미지 비율, 긴 문장, 버튼 위치, 폼 입력 영역이 모바일에서 자주 깨집니다.</p></div></div>
      </div>
    </section>
  );
}

function FeatureTwo() {
  return (
    <section className="feature">
      <div className="wrap">
        <div className="feature-head"><div className="kicker">검수 시스템</div><h2>출시 전 기준으로 빠짐없이 점검합니다</h2><p className="desc">랜딩페이지와 자사몰은 화면을 구현하는 것만으로 부족합니다. 모바일, CTA, 문의 흐름, 링크, SEO 기본값까지 검수 기준에 따라 확인합니다.</p></div>
        <div className="feature-grid"><div className="visual-card visual-pink"><Panel rows={[["모바일 검수", "완료"], ["CTA 검수", "개선"], ["SEO 기본값", "확인"]]} /></div><div className="chat-card"><div className="chat-line">그냥 예쁘게만 만들면 되나요?</div><div className="chat-line">아니요. 출시 전에 실제 사용 기준으로 링크, 폼, 모바일 화면을 점검합니다.</div><div className="chat-line me">좋아요.</div></div></div>
        <div className="caption-grid"><div className="caption"><h3>검수 기준</h3><p>마케팅, UX, 기획 관점의 체크리스트가 <b>검수 과정</b>에 적용됩니다. 그래서 단순 퍼블리싱보다 결과물이 더 실무적으로 작동합니다.</p></div><div className="caption"><h3>놓치지 않는 마무리</h3><p>누가 보는지, 무엇을 믿고 문의하는지, 어떤 CTA가 필요한지를 배포 전까지 확인합니다.</p></div></div>
      </div>
    </section>
  );
}

function FeatureThree() {
  return (
    <section className="feature">
      <div className="wrap">
        <div className="feature-head"><div className="kicker">인계 시스템</div><h2>만들고 끝나지 않도록 운영 기준을 남깁니다</h2><p className="desc">배포 후 어디를 수정해야 하는지, 어떤 계정을 써야 하는지, 다음 개선은 무엇인지 알 수 있어야 합니다. 운영자가 이어서 쓸 수 있게 인계 기준을 남깁니다.</p></div>
        <div className="feature-grid"><div className="visual-card visual-dark"><div className="panel-fake task-panel"><div className="row task-row"><b>cafe24</b><br /><span>운영 가이드</span></div><div className="row task-row"><b>랜딩</b><br /><span>배포 주소</span></div><div className="row task-row"><b>자동화</b><br /><span>알림 흐름</span></div></div></div><div className="chat-card"><div className="chat-line">나중에 직접 수정할 수 있나요?</div><div className="chat-line">자주 바뀌는 영역과 계정 정보를 따로 정리해드립니다.</div><div className="before-after"><b>Build</b><span>Handoff</span></div></div></div>
        <div className="caption-grid"><div className="caption"><h3>인계 기준</h3><p>배포 주소, 관리자 접근, 수정 방법, 다음 개선 항목을 함께 인계합니다.</p></div><div className="caption"><h3>개발자의 도움만 기다리지 않도록</h3><p>운영자가 직접 볼 수 있는 구조를 남겨야 실제로 오래 쓰입니다.</p></div></div>
      </div>
    </section>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4>{title}</h4>
      {items.map((item) => <a key={item}>{item}</a>)}
    </div>
  );
}
