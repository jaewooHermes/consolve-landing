# Admin × Content Pipeline Integration Plan

## Request
Bind the existing content pipeline concept to `consolve.kr/admin`, so blog operations and content generation live in one admin command center.

## Implementation
- Add a Consovle-local content pipeline adapter with the same high-level stages used in the previous SEO automation system: request → SERP fixture/evidence → brief → article package → gates → CMS persistence intent.
- Add `POST /api/admin/content-pipeline` for admin form/command execution.
- Add admin UI form and recent pipeline job/result sections.
- Keep public exposure rules unchanged: generated content starts as `draft` unless explicitly published by the existing admin publish command.

## Acceptance Criteria
- Admin page shows content pipeline controls and current CMS post state.
- API accepts a keyword and returns a structured pipeline result.
- API creates/saves a draft locally when filesystem is writable; otherwise it returns a clear persistence status.
- `/blog` continues to show only published posts.
- Build, local HTTP/API, deployment, and external admin URL checks pass.
