#!/usr/bin/env node

async function main() {
  const { runConsolveContentPipeline, persistPipelineResult } = await import('../lib/content-pipeline.js');
  const args = process.argv.slice(2);
  const get = (name, fallback = '') => {
    const index = args.indexOf(`--${name}`);
    return index === -1 ? fallback : args[index + 1];
  };
  const has = (name) => args.includes(`--${name}`);
  const keyword = get('keyword') || args.join(' ').trim();
  const result = runConsolveContentPipeline({
    keyword,
    projectName: get('project', 'consolve'),
    publish: has('publish'),
    source: 'admin-cli',
  });
  const persistence = has('no-persist') ? { ok: false, skipped: true, reason: 'no-persist' } : persistPipelineResult(result);
  console.log(JSON.stringify({ ...result, persistence }, null, 2));
}

main().catch((error) => {
  console.error(String(error && error.stack ? error.stack : error));
  process.exit(1);
});
