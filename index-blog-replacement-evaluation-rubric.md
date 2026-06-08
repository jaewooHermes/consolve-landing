# Evaluation rubric

| Check | Pass condition |
| --- | --- |
| Root route | `/` returns HTTP 200 and contains `빠르게 만들고` plus `Consolve` branding. |
| Blog route | `/blog` returns HTTP 200 and contains blog list shell text. |
| Blog link | Root HTML contains at least one `href="/blog"`. |
| Build | `npm run build` exits 0. |
| Scope | Existing `/blog` implementation and CMS adapter are not removed. |
