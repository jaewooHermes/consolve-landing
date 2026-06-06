# Published CMS Blog Exposure Plan

## Goal
Show CMS-approved content at `/blog` while hiding drafts, deleted posts, and posts that have not been approved for publication.

## Architecture
Use a thin local CMS adapter first: `lib/cms.js` reads `data/posts.json`, normalizes posts, and exposes only published posts to the public routes. This preserves the interface for a future CMS swap while making the public website work now.

## Tasks

1. Create `data/posts.json` with the expected post schema and representative published/draft/deleted examples.
2. Create `lib/cms.js` with:
   - `listPublicPosts()`
   - `getPublicPostBySlug(slug)`
   - `getAllPostSlugs()`
   - hard filtering for `status === "published"` and not deleted.
3. Create `app/blog/page.js` to render only public posts.
4. Create `app/blog/[slug]/page.js` to render a post or `notFound()` when unpublished/deleted.
5. Add minimal article markdown rendering for headings, paragraphs, lists, and links.
6. Add GA4 script for `G-R4YH4QJWR8` in `app/layout.js`.
7. Add CSS for the blog list and article pages using the existing Consovle visual language.
8. Verify with build plus source-level route checks.

## Acceptance Criteria
- `/blog` exists and lists only `published` posts.
- `/blog/[slug]` exists for published posts.
- Draft/deleted posts are not linked from `/blog` and their detail pages 404.
- GA4 measurement ID is present in the rendered root layout.
- `npm run build` succeeds.
