# Plan: replace `/` with static landing and link `/blog`

1. Convert `index.html` into the Next.js `app/page.js` route without changing blog data adapters.
2. Adapt landing copy/branding from `Visible Dev` to `Consolve` for the production `consolve.kr` domain.
3. Add `/blog` anchors to primary navigation and footer/resource links.
4. Run `npm run build`.
5. Start production server locally and verify `/` and `/blog` over HTTP.
6. Commit selectively if verification passes; push if GitHub auth permits.
