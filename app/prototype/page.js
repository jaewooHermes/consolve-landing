import styles from "./page.module.css";

export const metadata = {
  title: "Consolve — 1일 견적. 실시간 진행. 6개월 무상 보증.",
  description:
    "AI로 만드는 1인 개발 외주. 랜딩 30 / 홈 100 / 자사몰 300.",
};

export default function Prototype() {
  return (
    <main className={styles.main}>
      {/* 1. Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.h1}>
            1일 견적.
            <br />
            실시간 진행.
            <br />
            6개월 무상 보증.
          </h1>
          <p className={styles.sub}>
            AI로 만드는 1인 개발 외주
            <br />— 랜딩 30 / 홈 100 / 자사몰 300.
          </p>
          <div className={styles.ctaRow}>
            <a href="#quote" className={styles.btnPrimary}>
              1일 견적 받기
            </a>
            <a href="#progress" className={styles.btnSecondary}>
              진행 중인 프로젝트 보기 →
            </a>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.placeholder}>
              /progress 실물 스크린샷 자리
              <br />
              <span className={styles.placeholderHint}>
                (W3 견적 자동화·대시보드 v0.1 완성 후 교체)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 5축 가치 */}
      <section className={styles.values}>
        <div className={styles.container}>
          <h2 className={styles.h2}>다섯 가지 차별화</h2>
          <p className={styles.sectionSub}>
            다른 외주에 없는 것만 모았습니다.
          </p>
          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>⚡</div>
              <strong>빠른 견적</strong>
              <p>요청 폼 보내면 1일 안에 견적·일정 메일.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>💰</div>
              <strong>가격 공개</strong>
              <p>30 / 100 / 300 — 견적 안 물어봐도 됩니다.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>📊</div>
              <strong>실시간 진행</strong>
              <p>/progress URL 로 단계·산출물 라이브.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>👤</div>
              <strong>1인 책임</strong>
              <p>받은 사람이 끝까지 — 재외주 없음.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤖</div>
              <strong>AI 네이티브</strong>
              <p>Cursor·Claude 로 만들고, 세션 로그까지 인계.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing */}
      <section className={styles.pricing}>
        <div className={styles.container}>
          <h2 className={styles.h2}>가격</h2>
          <p className={styles.sectionSub}>
            견적 안 물어봐도 됩니다. 모든 가격에 6개월 무상 보증 포함.
          </p>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3 className={styles.h3}>랜딩페이지</h3>
              <div className={styles.price}>
                30<span className={styles.priceUnit}>만</span>
              </div>
              <p className={styles.duration}>3~5일</p>
              <ul className={styles.featureList}>
                <li>반응형 1페이지</li>
                <li>문의 폼 · 기본 SEO</li>
                <li>도메인 · 호스팅 연결</li>
                <li>6개월 무상 보증</li>
              </ul>
            </div>
            <div
              className={`${styles.pricingCard} ${styles.pricingFeatured}`}
            >
              <div className={styles.badge}>가장 인기</div>
              <h3 className={styles.h3}>홈페이지</h3>
              <div className={styles.price}>
                100<span className={styles.priceUnit}>만</span>
              </div>
              <p className={styles.duration}>1~2주</p>
              <ul className={styles.featureList}>
                <li>5~10페이지</li>
                <li>CMS · 블로그 (선택)</li>
                <li>관리자 페이지 기본</li>
                <li>6개월 무상 보증</li>
              </ul>
            </div>
            <div className={styles.pricingCard}>
              <h3 className={styles.h3}>자사몰 (cafe24)</h3>
              <div className={styles.price}>
                300<span className={styles.priceUnit}>만</span>
              </div>
              <p className={styles.duration}>3~4주</p>
              <ul className={styles.featureList}>
                <li>cafe24 셋업 · 디자인</li>
                <li>결제 · 배송 연동</li>
                <li>운영 인계 가이드</li>
                <li>6개월 무상 보증</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 작업물 */}
      <section className={styles.work}>
        <div className={styles.container}>
          <h2 className={styles.h2}>최근 작업</h2>
          <p className={styles.sectionSub}>
            2026년 5월 — 첫 3건의 외주를 끝냈습니다.
          </p>
          <div className={styles.workGrid}>
            <article className={styles.workCard}>
              <div className={styles.workImg}>이미지 자리</div>
              <h3 className={styles.h3}>자사몰 (cafe24)</h3>
              <p className={styles.workMeta}>3주 · 300만</p>
              <p className={styles.workDesc}>
                결제·배송 연동 · 운영 인계 완료
              </p>
            </article>
            <article className={styles.workCard}>
              <div className={styles.workImg}>이미지 자리</div>
              <h3 className={styles.h3}>홈페이지</h3>
              <p className={styles.workMeta}>2주 · 100만</p>
              <p className={styles.workDesc}>
                5페이지 · CMS 연동 · 모바일 최적화
              </p>
            </article>
            <article className={styles.workCard}>
              <div className={styles.workImg}>이미지 자리</div>
              <h3 className={styles.h3}>랜딩페이지</h3>
              <p className={styles.workMeta}>4일 · 30만</p>
              <p className={styles.workDesc}>
                A/B 테스트 셋업 · 광고 연동
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 5. About */}
      <section className={styles.about}>
        <div className={styles.container}>
          <div className={styles.aboutRow}>
            <div className={styles.aboutPhoto}>사진 자리</div>
            <div className={styles.aboutText}>
              <h2 className={styles.h2}>
                받은 사람이, 끝까지 합니다.
              </h2>
              <p>
                외주 재외주 없이 기획·디자인·개발·납품·운영 인계까지 한 사람이.
                연락도 한 사람한테만 하시면 됩니다.
              </p>
              <p className={styles.contact}>qus7146@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA + 폼 */}
      <section className={styles.ctaSection} id="quote">
        <div className={styles.container}>
          <h2 className={styles.h2}>지금 견적 받기</h2>
          <p className={styles.sectionSub}>
            요청 보내주시면 1일 안에 견적·일정 메일로 보내드립니다.
          </p>
          <form className={styles.quoteForm}>
            <input
              type="email"
              placeholder="이메일"
              className={styles.input}
              required
            />
            <textarea
              placeholder="만들고 싶은 것 (자유롭게 적어주세요)"
              rows={5}
              className={styles.textarea}
              required
            />
            <button type="submit" className={styles.btnPrimary}>
              견적 요청 보내기
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
