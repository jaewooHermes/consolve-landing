# DESIGN_SYSTEM.md — System Web 디자인 시스템

> **기준(Source of truth)**: `app/page.js`(index)의 인라인 `:root` 토큰 블록.
> channel.io 레퍼런스 기반 라이트 테마. 모든 페이지(`/`, `/blog`, `/blog/articles/[slug]`, `/price`)는
> 이 토큰을 **동일하게** 보유한다. 수치 변경은 항상 토큰에서 한다(개별 셀렉터 하드코딩 금지).
>
> ⚠️ `app/globals.css`는 구버전(다크 테마) 비활성 페이지용 레거시다. 현재 활성 라우트의 디자인 기준이 아니다.

## 코드 컨벤션

각 페이지는 인라인 `const css`(스타일) + `const body`(HTML 문자열)를 `dangerouslySetInnerHTML`로 렌더한다.
- 페이지 상단 `:root` 블록은 아래 토큰과 **동일하게 유지**한다.
- 색/간격/폰트/라운드 등 수치 변경은 `:root`만 수정한다.
- 공통 컴포넌트(nav·dropdown·footer)는 페이지 간 동일한 마크업·클래스를 사용한다.

## 토큰

### 색 (Color)
| 토큰 | 값 | 용도 |
|---|---|---|
| `--ink` | `#0a0b0b` | 본문/제목 기본 |
| `--muted` | `#666a73` | 보조 텍스트 |
| `--soft` | `#8d8e91` | 더 옅은 텍스트/메타 |
| `--line` | `#ececf0` | 보더/구분선 |
| `--surface` | `#f7f7f8` | 옅은 면 배경 |
| `--paper` | `#fff` | 카드/페이지 배경 |
| `--purple` | `#5e56f0` | primary 액센트 |
| `--purple-dark` | `#4d46d6` | primary hover |
| `--blue` `--mint` `--pink` `--green` | `#80c7ff` `#b9ead6` `#efb6ff` `#31a552` | 일러스트/그라데이션 보조 |

### 간격 (Spacing) — 4px 리듬
`--space-1:4` `--space-2:8` `--space-3:12` `--space-4:16` `--space-5:20` `--space-6:24`
`--space-7:28` `--space-8:32` `--space-10:40` `--space-12:48` `--space-14:56` `--space-16:64`
`--space-18:72` `--space-20:80` `--space-24:96` (px)

### 섹션 리듬
| 토큰 | 값 | 용도 |
|---|---|---|
| `--section-y` | `88px` | 일반 섹션 상하 패딩 |
| `--section-y-lg` | `112px` | feature/omni 상하 패딩 |
| `--hero-y` | `72px` | hero 상단 패딩 |

### 영역 폭 (Width)
| 토큰 | 값 | 용도 |
|---|---|---|
| `--max` | `1280px` | 페이지 최대 폭(`.wrap`) |
| `--max-feature` | `980px` | feature 폭 |
| `--max-copy` | `880px` | 본문 카피 폭 |
| `--hero-w` | `560px` | hero 텍스트·인풋 폭 |
| `--gutter` | `28px` | 좌우 여백 |

> 아티클 본문 가독 폭(`/blog/articles`)은 `720px`(읽기 최적), 커버 `960px`, 본문+목차 레이아웃 `1040px`를
> 페이지-로컬 값으로 사용한다. 이는 긴 글 읽기를 위한 의도적 예외다.

### 타이포그래피 스케일
| 토큰 | 값 |
|---|---|
| `--text-xs` | `12px` |
| `--text-sm` | `13px` |
| `--text-md` | `14px` |
| `--text-base` | `15px` |
| `--text-lg` | `16px` |
| `--text-xl` | `18px` |
| `--text-2xl` | `24px` |
| `--text-3xl` | `40px` (섹션 제목 h2) |
| `--text-4xl` | `36px` |
| `--text-5xl` | `40px` (페이지 h1) |
| `--text-6xl` | `56px` |

- **굵기**: `--fw-medium:500` `--fw-semibold:600` `--fw-bold:700` `--fw-black:800`
- **행간**: `--lh-tight:1.25` `--lh-snug:1.3` `--lh-body:1.55` `--lh-relaxed:1.8`
- **자간**: `--ls-tight:-.04em` `--ls-snug:-.03em` `--ls-normal:-.02em` `--ls-display:-.06em`
- **폰트**: 한글 Pretendard / 영문 Inter (CDN @import). 본문 자간 `--ls-normal`, 행간 `--lh-body`.

### 라운드 (Radius)
`--r-sm:8px` `--r-md:12px` `--r-lg:14px` `--r-pill:999px`

### 그림자 (Shadow)
- `--shadow`: `0 12px 40px rgba(0,0,0,.08)`
- `--shadow-sm`: `0 9px 28px rgba(0,0,0,.04)`

## 공통 컴포넌트

- **Nav** (`.nav` / `.nav-inner` 높이 68px): sticky, 반투명 흰색 + `backdrop-filter:blur(18px)`.
  - 로고 `.logo-img`(30px), 링크 `.links`, 우측 `.nav-actions` + `.pill-dark` CTA.
  - **드롭다운**: `.nav-item > a` 트리거에 호버 시 `.dropdown > .dd-card` 노출(순수 CSS `:hover`).
    항목은 `.dd-link`(`<b>`제목 + `<span>`설명). 화살표 아이콘 없음. 모바일(<900px)에서 `.links` 숨김.
  - 현재 페이지 표시: `.links a.cur{color:var(--purple)}`.
- **Footer** (`.footer` / `.footer-grid` `1.5fr repeat(5,1fr)`): 브랜드 + 5개 링크 컬럼. <900px에서 2열.
- **버튼/CTA**: `.pill-dark`(검정 pill), `.search-cta`(인풋+`.go` 원형). 모호한 "상담 신청" 류 금지, 정량 CTA("5분 견적 받기").
- **카드**(blog/article): `.card`(`.thumb` 16:10 `--r-md` + 태그 + 제목 + byline), hover 시 thumb `translateY(-4px)` + `--shadow`.

## 반응형 브레이크포인트
- `max-width:900px` — `.links` 숨김, 그리드 1~2열로 축소, h1 한 단계 축소.
- `max-width:600px` — 카드 1열, 폼 세로 스택.
- 아티클 목차(`.toc`)는 `max-width:980px`에서 숨김(단일 컬럼).

## 모션
- 호버/드롭다운/캐러셀/스크롤 애니메이션은 `@media (prefers-reduced-motion: reduce)`로 비활성 대응.
