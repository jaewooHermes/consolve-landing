# Discord → Review CMS Pipeline Plan

## Request
Use the existing `/workspace/blog-seo-automation` pipeline as the content generator. Newly generated content must enter the Consovle CMS as `review`, not `published`. Only after the user approves in `/admin` should it become `published` and appear on `/blog`.

## Acceptance criteria
1. Admin has no keyword/content-generation form.
2. A Discord/Hermes-facing CLI wrapper runs the existing `blog-seo-automation/apps/web/scripts/run-discord-content-command.js` from its own app directory.
3. The generated post is copied into `consolve-landing/data/posts.json` with `status: "review"` and `publishedAt: null`.
4. The job is copied into `consolve-landing/data/content-pipeline-jobs.json` as a review queue item.
5. `/blog`, `/sitemap.xml`, and `/rss.xml` continue to expose only `status: "published"` posts.
6. Admin publish action changes `review` to `published`, after which `/blog/<slug>` is public.
7. Build, local HTTP, and deployed external URL checks pass.

## Non-goal
Do not reimplement the article generator inside `consolve-landing`. The existing `blog-seo-automation` pipeline remains the source of generated content.
