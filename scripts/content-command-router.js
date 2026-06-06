#!/usr/bin/env node
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO_ROOT = process.cwd();

function parseArgs(argv) {
  const out = {
    text: '',
    project: 'consolve',
    keyword: '',
    ingestSlug: '',
    dryRun: false,
    skipDeploy: false,
    skipPush: false,
    noSync: false,
    extra: [],
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--keyword') out.keyword = argv[++i];
    else if (arg === '--project' || arg === '--project-name') out.project = argv[++i];
    else if (arg === '--ingest-slug') out.ingestSlug = argv[++i];
    else if (arg === '--dry-run') out.dryRun = true;
    else if (arg === '--skip-deploy') out.skipDeploy = true;
    else if (arg === '--skip-push') out.skipPush = true;
    else if (arg === '--no-sync') out.noSync = true;
    else if (arg.startsWith('--')) out.extra.push(arg, argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : '');
    else out.text = [out.text, arg].filter(Boolean).join(' ');
  }
  if (!out.keyword) out.keyword = inferKeyword(out.text);
  if (!out.keyword && !out.ingestSlug) throw new Error('keyword is required');
  return out;
}

function stripQuotes(value) {
  return String(value || '').trim().replace(/^["'“”‘’]|["'“”‘’]$/g, '').trim();
}

function matchField(text, names) {
  for (const name of names) {
    const re = new RegExp(`${name}\\s*[:=]\\s*("[^"]+"|'[^']+'|[^,\\n]+)`, 'i');
    const found = String(text || '').match(re);
    if (found) return stripQuotes(found[1]);
  }
  return '';
}

function inferKeyword(text) {
  const raw = String(text || '').trim();
  if (!raw) return '';
  const explicit = matchField(raw, ['keyword', '키워드', '주제']);
  if (explicit) return explicit;
  const quoted = raw.match(/["“]([^"”]+)["”]/);
  if (quoted) return stripQuotes(quoted[1]);
  return stripQuotes(raw
    .replace(/^\/?(?:content|콘텐츠|블로그|seo)?\s*(?:create|generate|생성|작성|만들어줘|글\s*생성)?\s*/i, '')
    .replace(/(?:콘텐츠|컨텐츠|블로그|SEO)?\s*(?:글|기사)?\s*(?:생성해줘|생성|작성해줘|작성|만들어줘|만들어|해줘)\s*$/i, '')
  );
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || REPO_ROOT,
    env: { ...process.env, ...(options.env || {}) },
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return result.stdout;
}

function parseJsonResult(stdout) {
  const marker = 'JSON_RESULT_START';
  const idx = stdout.lastIndexOf(marker);
  if (idx === -1) throw new Error('Command output did not include JSON_RESULT_START');
  return JSON.parse(stdout.slice(idx + marker.length).trim());
}

function gitStatus() {
  return run('git', ['status', '--short']).trim();
}

function makeAskpass(token) {
  const file = path.join(REPO_ROOT, `.git`, `consolve-git-askpass-${process.pid}.sh`);
  fs.writeFileSync(file, `#!/bin/sh\ncase "$1" in\n*Username*) printf '%s\\n' 'x-access-token' ;;\n*) printf '%s\\n' '${String(token).replace(/'/g, `'\\''`)}' ;;\nesac\n`, { mode: 0o700 });
  return file;
}

function syncToGitAndVercel({ slug, dryRun, skipPush, skipDeploy }) {
  const status = gitStatus();
  if (!status) return { ok: true, skipped: true, reason: 'no local changes' };

  const filesToAdd = ['data/posts.json', 'data/content-pipeline-jobs.json'];
  if (dryRun) {
    return { ok: true, dryRun: true, status, filesToAdd, wouldCommit: `chore: add review content ${slug}` };
  }

  run('git', ['add', ...filesToAdd]);
  run('git', ['commit', '-m', `chore: add review content ${slug}`]);

  let push = { skipped: skipPush };
  if (!skipPush) {
    const token = process.env.GIT_TOKEN || process.env.GITHUB_TOKEN_ORG || process.env.GITHUB_TOKEN;
    if (!token) throw new Error('Missing GIT_TOKEN or GITHUB_TOKEN_ORG for push');
    const askpass = makeAskpass(token);
    try {
      run('git', ['push', 'origin', 'main'], { env: { GIT_ASKPASS: askpass } });
      push = { ok: true };
    } finally {
      fs.rmSync(askpass, { force: true });
    }
  }

  let deploy = { skipped: skipDeploy };
  if (!skipDeploy) {
    if (!process.env.VERCEL_TOKEN) throw new Error('Missing VERCEL_TOKEN for production deploy');
    const output = run('npx', ['--yes', 'vercel@latest', 'deploy', '--prod', '--yes', '--token', process.env.VERCEL_TOKEN], {
      env: {
        HOME: process.env.HOME || '/workspace/.home',
        XDG_CACHE_HOME: process.env.XDG_CACHE_HOME || '/workspace/.cache',
        XDG_DATA_HOME: process.env.XDG_DATA_HOME || '/workspace/.local/share',
        npm_config_cache: process.env.npm_config_cache || '/workspace/.npm-cache',
      },
    });
    deploy = { ok: true, output: output.split('\n').slice(-8).join('\n') };
  }

  return { ok: true, status, push, deploy };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const reviewArgs = ['scripts/discord-review-content.js', '--project', options.project];
  if (options.ingestSlug) reviewArgs.push('--ingest-slug', options.ingestSlug);
  else reviewArgs.push('--keyword', options.keyword);
  reviewArgs.push(...options.extra.filter(Boolean));

  const reviewStdout = run(process.execPath, reviewArgs);
  const review = parseJsonResult(reviewStdout);
  const slug = review.cmsPost.slug;
  const sync = review.persistence?.adapter === 'turso'
    ? { ok: true, skipped: true, adapter: 'turso', reason: 'Turso CMS writes are live; GitHub commit/Vercel deploy not required for content visibility' }
    : options.noSync
      ? { ok: true, skipped: true, reason: 'no-sync requested' }
      : syncToGitAndVercel({ slug, dryRun: options.dryRun, skipPush: options.skipPush, skipDeploy: options.skipDeploy });

  const result = {
    ok: true,
    keyword: review.keyword,
    cmsPost: review.cmsPost,
    reviewUrl: review.reviewUrl,
    publicUrlAfterApproval: review.publicUrlAfterApproval,
    sync,
    discordMessage: [
      '콘텐츠 생성 완료 → Consovle admin 검토 큐에 추가됨',
      '',
      `키워드: ${review.keyword}`,
      `상태: ${review.cmsPost.status}`,
      `Admin 검토: ${review.reviewUrl}`,
      `발행 승인 후 공개 URL: ${review.publicUrlAfterApproval}`,
      sync.deploy?.ok ? '배포: 완료' : `배포: ${sync.skipped || sync.deploy?.skipped || sync.dryRun ? 'skipped/dry-run' : '완료'}`,
      '',
      '아직 /blog에는 공개되지 않았습니다. Admin에서 발행해야 공개됩니다.',
    ].join('\n'),
  };

  console.log(result.discordMessage);
  console.log('\nJSON_RESULT_START');
  console.log(JSON.stringify(result, null, 2));
}

try {
  main();
} catch (error) {
  console.error(String(error && error.stack ? error.stack : error));
  process.exit(1);
}
