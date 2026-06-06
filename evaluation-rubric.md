# Blog Exposure Evaluation Rubric

## PASS
- Public blog routes read from CMS-shaped data.
- Filtering is enforced in code, not only by UI convention.
- Deleted/draft/unapproved posts cannot be rendered by direct slug URL.
- Google-first metadata is generated for listing and articles.
- GA4 tag is installed with `G-R4YH4QJWR8`.
- Production build passes.

## FAIL
- `/blog` shows drafts or deleted posts.
- Direct URL can render unpublished content.
- Blog content is hard-coded directly inside route components instead of using a CMS adapter.
- Build fails.
- GA4 ID is absent.
