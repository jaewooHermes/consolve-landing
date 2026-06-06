# Blog CMS Exposure Gap Check

## Request
Expose only CMS-approved/published posts from the existing Consovle site at `https://consolve.kr/blog`.

## Current state inspected
- Repo: `/workspace/consolve-landing`
- Stack: Next.js app router (`app/`), no existing `/blog` route.
- No existing `data/posts.json` CMS store in this repo.
- Landing page exists at `app/page.js`.
- GA4 tag is not yet present in `app/layout.js`.

## Gaps to close
1. Add a CMS data adapter that reads posts and filters only `status: "published"` with a `publishedAt` value or approved status.
2. Add `/blog` listing route.
3. Add `/blog/[slug]` article route that returns 404 for draft/deleted/unapproved posts.
4. Add a seed `data/posts.json` with example status shapes so the route has a stable contract.
5. Add metadata/canonical behavior for Google-first SEO.
6. Add GA4 Measurement ID `G-R4YH4QJWR8` to the root layout.
7. Verify build and route behavior.

## Non-goals for this change
- Full Payload CMS/PostgreSQL backend setup.
- Search Console API integration.
- Deployment unless explicitly requested or after implementation is verified locally.
