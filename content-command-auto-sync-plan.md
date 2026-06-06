# Content Command Auto-Sync Plan

## Selected option
A안: Discord/Hermes content command automatically persists the generated review content to GitHub and redeploys Vercel so it appears on `consolve.kr/admin` naturally.

## Target flow
```txt
User command in Discord/Hermes
→ content command router extracts keyword
→ existing blog-seo-automation pipeline runs
→ generated content is ingested into consolve CMS as status=review
→ data/posts.json and data/content-pipeline-jobs.json are committed to GitHub
→ main is pushed
→ Vercel production deploy runs
→ content appears in /admin, not /blog
```

## Constraints
- Admin remains review/edit/publish/delete only.
- No admin keyword generation form.
- Generated posts are never public until Admin publish changes `status` to `published`.
- `/blog`, sitemap, and RSS expose only published posts.
- Secrets are read from environment variables only: `GIT_TOKEN` or `GITHUB_TOKEN_ORG`, and `VERCEL_TOKEN`.
