#!/usr/bin/env node
/**
 * Detects newly added blog posts (blog-posts.ts) and mock tests (static-meta.ts)
 * by diffing HEAD~1..HEAD, then sends a Telegram message for each new item.
 *
 * Requires env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

import { execSync } from 'node:child_process';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
const SITE      = 'https://www.gridacademy.in';

if (!BOT_TOKEN || !CHAT_ID) {
  console.log('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping.');
  process.exit(0);
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getDiff(filePath) {
  try {
    return execSync(`git diff HEAD~1 HEAD -- "${filePath}"`, { encoding: 'utf8' });
  } catch {
    return '';
  }
}

/** Extract only the newly added lines from a git diff (strips the leading +). */
function addedLines(diff) {
  return diff
    .split('\n')
    .filter(l => l.startsWith('+') && !l.startsWith('+++'))
    .map(l => l.slice(1))
    .join('\n');
}

function allMatches(text, re) {
  return [...text.matchAll(re)].map(m => m[1]);
}

async function sendTelegram(text) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id:                  CHAT_ID,
      text,
      parse_mode:               'HTML',
      disable_web_page_preview: false,
    }),
  });
  const data = await res.json();
  if (!data.ok) {
    console.error('Telegram API error:', data.description);
  } else {
    console.log('✓ Sent:', text.split('\n')[0]);
  }
}

// ── Blog posts (src/lib/blog-posts.ts) ───────────────────────────────────────

const blogDiff  = getDiff('src/lib/blog-posts.ts');
const blogAdded = addedLines(blogDiff);

if (blogAdded.trim()) {
  const slugs    = allMatches(blogAdded, /slug:\s*['"`]([^'"`\n]+)['"`]/g);
  const titles   = allMatches(blogAdded, /title:\s*['"`]([^'"`\n]+)['"`]/g);
  const excerpts = allMatches(blogAdded, /excerpt:\s*['"`]([^'"`\n]{0,200})/g);
  const cats     = allMatches(blogAdded, /category:\s*['"`]([^'"`\n]+)['"`]/g);

  for (let i = 0; i < slugs.length; i++) {
    const slug    = slugs[i];
    const title   = titles[i]   ?? slug;
    const cat     = cats[i]     ?? 'GridAcademy';
    const excerpt = (excerpts[i] ?? '')
      .replace(/['"`].*$/, '')   // stop at closing quote
      .trim()
      .slice(0, 160);

    const msg = [
      `📝 <b>New Blog Post — ${cat}</b>`,
      '',
      `<b>${title}</b>`,
      excerpt ? `\n${excerpt}` : '',
      '',
      `🔗 <a href="${SITE}/blog/${slug}">Read Article →</a>`,
    ].join('\n').replace(/\n{3,}/g, '\n\n');

    await sendTelegram(msg);
  }
} else {
  console.log('No new blog posts detected.');
}

// ── Mock tests (src/lib/static-meta.ts) ──────────────────────────────────────

const metaDiff  = getDiff('src/lib/static-meta.ts');
const metaAdded = addedLines(metaDiff);

if (metaAdded.trim()) {
  // Match top-level exam slug keys: '  "some-slug": {' or "  'some-slug': {"
  const slugs  = allMatches(metaAdded, /^\s{2}['"]([a-z0-9][a-z0-9-]+)['"]\s*:/gm);
  const titles = allMatches(metaAdded, /title:\s*['"`]([^'"`\n]+)['"`]/g);

  for (let i = 0; i < slugs.length; i++) {
    const slug  = slugs[i];
    const title = titles[i] ?? slug;

    const msg = [
      `🎯 <b>New Mock Test Live on GridAcademy!</b>`,
      '',
      `<b>${title}</b>`,
      '',
      `📌 <a href="${SITE}/exam/${slug}">Start Practising Free →</a>`,
    ].join('\n');

    await sendTelegram(msg);
  }
} else {
  console.log('No new mock tests detected.');
}
