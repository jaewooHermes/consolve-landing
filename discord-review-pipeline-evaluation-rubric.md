# Discord Review Pipeline Evaluation Rubric

## Pass criteria
- `npm run content:review -- --keyword "..."` calls `/workspace/blog-seo-automation/apps/web/scripts/run-discord-content-command.js`.
- The resulting Consovle CMS post has `status: review` and `publishedAt: null`.
- Review posts are visible in `/admin` but not `/blog`, `/sitemap.xml`, or `/rss.xml`.
- Admin `publish` action is still the only transition from review to public.
- `/api/admin/content-pipeline` remains disabled with HTTP 410.
- Production build succeeds and deployed custom domains keep Basic Auth on Admin.
