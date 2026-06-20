import { readFileSync, existsSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

function read(path) {
  assert(existsSync(path), `${path} should exist`);
  return readFileSync(path, 'utf8');
}

const route = read('app/api/quote/route.js');
assert(route.includes('POST'), 'quote API route should export POST');
assert(route.includes('QUOTE_API_URL'), 'quote API route should use QUOTE_API_URL');
assert(route.includes('quote_unavailable'), 'quote API route should return safe unavailable status');
assert(route.includes('AbortSignal.timeout'), 'quote API route should enforce timeout');

const widget = read('app/components/QuoteChatWidget.js');
assert(widget.includes('quote-chat-launcher'), 'widget should include floating launcher class');
assert(widget.includes('quote-chat-panel'), 'widget should include chat panel class');
assert(widget.includes('/api/quote'), 'widget should submit to /api/quote');
assert(widget.includes('예상 견적'), 'widget should render estimate copy');
assert(widget.includes('aria-expanded'), 'launcher should expose expanded state');
assert(widget.includes('상담 가능 범위 확인'), 'widget should include quick action for quote intent');
assert(widget.includes('form.search-cta'), 'widget should intercept homepage search-cta form submissions');
assert(!widget.includes('#quote form.search-cta'), 'widget should not limit submit handling to only the bottom #quote form');

const layout = read('app/layout.js');
assert(layout.includes('QuoteChatWidget'), 'root layout should mount QuoteChatWidget globally');

const nav = read('app/components/navHtml.js');
assert(nav.includes('/#quote'), 'shared nav CTA should target #quote');

const page = read('app/page.js');
assert(page.includes('id="quote"'), 'homepage should expose #quote anchor');

console.log('quote_widget_static_checks_ok');
