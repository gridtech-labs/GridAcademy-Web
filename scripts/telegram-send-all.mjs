#!/usr/bin/env node
/**
 * One-time script: sends ALL existing blog posts and mock tests to Telegram.
 * Run via GitHub Actions "Send All to Telegram" workflow (manual trigger).
 */

import { readFileSync } from 'node:fs';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
const SITE      = 'https://www.gridacademy.in';
const DELAY_MS  = 1500; // avoid Telegram rate limits

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set.');
  process.exit(1);
}

function allMatches(text, re) {
  return [...text.matchAll(re)].map(m => m[1]);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function sendTelegram(text) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: false,
    }),
  });
  const data = await res.json();
  if (!data.ok) console.error('Telegram error:', data.description);
  else console.log('✓ Sent:', text.split('\n')[0].slice(0, 60));
}

// ── Blog posts ────────────────────────────────────────────────────────────────
const blogSrc = readFileSync('src/lib/blog-posts.ts', 'utf8');

// Extract each blog post block between `const xxx: BlogPost = {` and the closing `};`
const blogBlocks = [...blogSrc.matchAll(/const \w+: BlogPost = \{([\s\S]*?)\n\};/g)].map(m => m[1]);

console.log(`\nFound ${blogBlocks.length} blog posts\n`);

for (const block of blogBlocks) {
  const slug    = (block.match(/slug:\s*['"`]([^'"`\n]+)['"`]/))?.[1];
  const title   = (block.match(/title:\s*['"`]([^'"`\n]+)['"`]/))?.[1];
  const cat     = (block.match(/category:\s*['"`]([^'"`\n]+)['"`]/))?.[1] ?? 'GridAcademy';
  const excerpt = (block.match(/excerpt:\s*['"`]([^'"`\n]{0,200})/))?.[1]
    ?.replace(/['"`].*$/, '').trim().slice(0, 160) ?? '';

  if (!slug || !title) continue;

  const msg = [
    `📝 <b>Blog — ${cat}</b>`,
    '',
    `<b>${title}</b>`,
    excerpt ? `\n${excerpt}` : '',
    '',
    `🔗 <a href="${SITE}/blog/${slug}">Read Article →</a>`,
  ].join('\n').replace(/\n{3,}/g, '\n\n');

  await sendTelegram(msg);
  await sleep(DELAY_MS);
}

// ── Mock tests ────────────────────────────────────────────────────────────────
const metaSrc = readFileSync('src/lib/static-meta.ts', 'utf8');

// Extract the slugMeta object content
const metaBody = metaSrc.match(/const slugMeta[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? '';

// Split into per-exam blocks
const examBlocks = [...metaBody.matchAll(/^\s{2}['"]([a-z0-9][a-z0-9-]+)['"]\s*:\s*\{([\s\S]*?)\n\s{2}\}/gm)];

console.log(`\nFound ${examBlocks.length} mock tests\n`);

for (const [, slug, block] of examBlocks) {
  const title = (block.match(/title:\s*['"`]([^'"`\n]+)['"`]/))?.[1] ?? slug;

  const msg = [
    `🎯 <b>Mock Test — GridAcademy</b>`,
    '',
    `<b>${title}</b>`,
    '',
    `📌 <a href="${SITE}/exam/${slug}">Start Practising Free →</a>`,
  ].join('\n');

  await sendTelegram(msg);
  await sleep(DELAY_MS);
}

console.log('\nDone! All content sent to Telegram.');
