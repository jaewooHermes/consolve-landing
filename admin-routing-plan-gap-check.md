# Admin Routing Gap Check

## Request
Move the blog management command tool routing to `admin.consolve.kr` or `consolve.kr/admin`.

## Current state
- Public landing/blog is deployed to `consolve.kr` via Vercel.
- Blog data currently uses the local CMS adapter `data/posts.json`.
- There is no existing `/admin` route or admin subdomain routing in the app.
- `.vercel/project.json` exists locally but is gitignored, so deployments can continue from this workspace.

## Gaps
1. Add a `/admin` route for the blog management command center.
2. Add middleware so requests to `admin.consolve.kr` render the admin route.
3. Add `admin.consolve.kr` to the existing Vercel project.
4. Ensure admin page is `noindex` and does not expose secrets or provide unauthenticated destructive APIs.
5. Build and verify both `consolve.kr/admin` and `admin.consolve.kr` externally.
