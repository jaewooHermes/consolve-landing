# Index replacement + /blog link gap check

## Deliverable
- Replace the public `/` App Router page with the existing `index.html` landing design in this repo.
- Keep the existing `/blog` route working and expose it from the landing navigation/footer.

## Acceptance criteria
- `/` renders the replacement landing page, not the previous dark Consolve shell.
- The landing page contains a direct `/blog` link in the primary nav and footer/resources area.
- `/blog` still renders the existing public blog list.
- `npm run build` succeeds.
- Local production server returns HTTP 200 for `/` and `/blog`; `/` HTML contains the new hero copy and `/blog` links.

## Preflight notes
- Repo inspected at `/workspace/consolve-landing`.
- Existing deployed site already has App Router routes: `app/page.js`, `app/blog/page.js`, `app/blog/[slug]/page.js`.
- `index.html` is a static landing mockup in the repo; it currently has no `/blog` link and uses `Visible Dev` branding.
- Browser visual verification is unavailable in this environment because Chrome is not installed; substitute build + HTTP + HTML marker checks.
