# Admin Password Protection Plan

## Goal
Protect every admin surface with Basic Auth:
- `https://consolve.kr/admin`
- `https://admin.consolve.kr`
- `https://consolve.kr/api/admin/*`
- `https://admin.consolve.kr/api/admin/*`

## Rules
- Public landing/blog/sitemap/rss remain public.
- Admin pages remain `noindex`.
- Credentials come from Vercel env: `ADMIN_USERNAME`, `ADMIN_PASSWORD`.
- Missing credentials fail closed in production.

## Verification
- Unauthenticated admin page returns 401 and `WWW-Authenticate` header.
- Authenticated admin page returns 200.
- Unauthenticated admin API returns 401.
- Authenticated admin API returns 200.
- Public blog still returns 200 and draft URL remains 404.
