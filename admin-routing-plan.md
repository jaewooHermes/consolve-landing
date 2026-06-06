# Admin Routing Plan

## Goal
Expose the blog management command tool at both:
- `https://consolve.kr/admin`
- `https://admin.consolve.kr`

## Approach
- Create a server-rendered `/admin` page that summarizes current CMS posts and shows safe command examples.
- Add `middleware.js` host-based routing: `admin.consolve.kr` rewrites to `/admin` while preserving public routes on `consolve.kr`.
- Add `robots: noindex` metadata for `/admin`.
- Add `admin.consolve.kr` to the same Vercel project and deploy.

## Acceptance Criteria
- `/admin` returns 200 locally and on `consolve.kr`.
- `admin.consolve.kr` returns the same admin command center.
- Blog routes still work.
- Build succeeds.
- No draft/deleted posts become public on `/blog`, sitemap, or RSS.
- Admin route does not expose env vars or token values.
