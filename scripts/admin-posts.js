#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const postsPath = path.join(process.cwd(), 'data', 'posts.json');

function readPosts() {
  return JSON.parse(fs.readFileSync(postsPath, 'utf8'));
}

function writePosts(posts) {
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2) + '\n', 'utf8');
}

function getArg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

function now() {
  return new Date().toISOString();
}

const action = process.argv[2] || 'list';
const slug = getArg('slug');
const status = getArg('status');
let posts = readPosts();

if (action === 'list') {
  const filtered = status ? posts.filter((post) => post.status === status) : posts;
  for (const post of filtered) {
    console.log(`${post.status.padEnd(10)} ${String(post.slug).padEnd(44)} ${post.title}`);
  }
  process.exit(0);
}

if (!slug) {
  console.error('--slug is required');
  process.exit(1);
}

const index = posts.findIndex((post) => post.slug === slug);
if (index === -1) {
  console.error(`Post not found: ${slug}`);
  process.exit(1);
}

if (action === 'publish') {
  posts[index] = {
    ...posts[index],
    status: 'published',
    publishedAt: posts[index].publishedAt || now(),
    updatedAt: now(),
  };
  writePosts(posts);
  console.log(`published ${slug}`);
  process.exit(0);
}

if (action === 'delete') {
  posts[index] = {
    ...posts[index],
    status: 'deleted',
    updatedAt: now(),
  };
  writePosts(posts);
  console.log(`deleted ${slug}`);
  process.exit(0);
}

console.error(`Unknown action: ${action}`);
process.exit(1);
