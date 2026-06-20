# Consolve Landing Quote Chat Integration

`consolve-landing` now has a ChannelTalk-style floating quote chat widget mounted globally from `app/layout.js`.

## Local services

Terminal 1 — quote-server:

```bash
cd /workspace/quote-server
. .venv/bin/activate
PORT=8787 DATA_DIR=/workspace/quote-server/data WIKI_ROOT=/workspace/LLM_WIKI WORKSPACE_ROOT=/workspace python -m quote_server.app
```

Terminal 2 — landing:

```bash
cd /workspace/consolve-landing
cp .env.example .env.local
npm install
npm run dev
```

Required env:

```env
QUOTE_API_URL=http://127.0.0.1:8787
QUOTE_API_TIMEOUT_MS=8000
QUOTE_API_TOKEN=
```

## User flow

- Bottom-right floating button opens a chat-like quote panel.
- Navigation and price-page CTAs target `/#quote` or `/?quote=<service>#quote`; the widget opens automatically.
- Homepage final quote form also opens the chat widget and submits the same request.
- The widget calls `POST /api/quote`.
- The Next.js route proxies server-side to `${QUOTE_API_URL}/quote`.

## Verification

```bash
npm run test:quote-widget
npm run build
python scripts/smoke-quote-integration.py
```

Expected smoke markers:

```text
home_has_quote_widget True
api_status ok
service_type ecommerce_site
range_min > 0
range_max > range_min
```

## Production note

Do not claim production quote integration until `QUOTE_API_URL` points to a reachable quote-server endpoint, e.g. `https://quote-api.consolve.kr`. Before exposing quote-server publicly, add `QUOTE_API_TOKEN`/HMAC/Cloudflare Access.
