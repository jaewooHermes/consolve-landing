# CLAUDE.md — consolve-landing

개발 외주 사업 랜딩 사이트. 브랜드명은 **System Web** (Consolve에서 변경됨, 도메인은 consolve.kr 계열).

> ⚠️ `brand.md`는 Consolve 시절(2026-05) 구버전 문서다. 헤드라인·디자인 톤·브랜드명이 현재 구현과 다르므로
> 브랜드·디자인 기준은 **이 문서와 현재 `app/page.js` 구현**을 따른다.

## 스택·구조

- Next.js (App Router), JavaScript. metadata는 `app/layout.js`에 있음.
- `app/page.js` — 메인 페이지 (유일한 활성 페이지). 클라이언트 컴포넌트.
- `app/claudetestindex/page.js` — 메인 리디자인 시안. 시안이 확정되면 메인으로 승격하는 방식으로 작업해 왔음.
- `app/channel/`, `app/prototype/`, `app/gallery/` — 구버전 페이지. `page.disabled.js`로 비활성화해 보존 중 (삭제하지 말 것).
- `makegallery/` — 별도 갤러리 앱 (메인 사이트와 독립).

## 페이지 코드 컨벤션

메인·시안 페이지는 공통 패턴을 따른다:

- **인라인 CSS 문자열(`const css`) + HTML 문자열(`const body`)을 `dangerouslySetInnerHTML`로 렌더링**하는 구조. JSX 컴포넌트 분리를 하지 않는다.
- 인터랙션(캐러셀, IntersectionObserver 등)은 `useEffect` 안에서 querySelector로 바인딩하고, cleanup에서 해제한다.
- **디자인 수치 조정은 `:root` 토큰 블록만 수정**한다. 개별 셀렉터에 하드코딩하지 않는다.
- 비활성화는 파일 삭제가 아니라 `page.disabled.js`로 이름 변경.

## 디자인 토큰 (channel.io 레퍼런스 기반)

- **색**: primary 보라 `#5e56f0` (`--purple`) + 그레이스케일. 잉크 `#0a0b0b`, 배경 흰색.
- **폰트**: 한글 Pretendard / 영문 Inter (CDN @import). 시안에서는 모노 악센트로 IBM Plex Mono 사용.
- **간격**: 4px 리듬 (`--space-1`=4px ~ `--space-24`=96px). 섹션 상하는 `--section-y` 계열.
- **폭**: 페이지 `--max:1280px`, 카피 `--max-copy`, 히어로 `--hero-w:560px`.
- **라운드**: `--r-sm:8px / --r-md:12px / --r-lg:14px / --r-pill:999px`.
- 애니메이션에는 `prefers-reduced-motion` 대응을 넣는다.

## 브랜드·카피 규칙

- 브랜드 표기: **System Web**, 로고는 `/logo.png`.
- 핵심 메시지: "시스템으로 만드는, 빠르고 퀄리티 있는 웹사이트·자사몰" / **5분 견적**.
- 가격: 랜딩 30만 / 홈 100만 / 자사몰 300만. 초안이며 상세 견적에 따라 달라질 수 있음. 1차로 AI가 견적을 주고 상세견적 요청시 직접 발송하는 식. 
- 카피 톤: 한국어 직설, 단문, 정량 표현 우선 ("빠른" ❌ → "5분" ⭕). "상담 신청" 류 모호한 CTA 금지.
- 1인 개발 강조는 메인에 노출하지 않는다 (About에서만).
- 타사 카피·로고·이미지·브랜드 색 복제 금지 (구조 패턴 차용만 허용).
