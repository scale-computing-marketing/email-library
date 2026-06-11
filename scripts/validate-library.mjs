#!/usr/bin/env node
/**
 * validate-library.mjs
 * --------------------
 * Catches the things that silently break the public Email Library:
 *   1. manifest.json is invalid JSON (a stray/trailing comma blanks the page).
 *   2. A manifest entry's sourceId has no emails/<sourceId>.html file
 *      (Preview throws "Could not load ..." — this is the live nyslgitda bug).
 *   3. An emails/*.html file no email entry points at (orphan, never shown).
 *   4. Duplicate ids/sourceIds, missing required fields, retired "icon" field.
 *   5. Manifest tags that don't exist in the Tag Library registry
 *      (data/tag-library.json in this repo — the single source of truth for
 *      tags; the Tag Library page and Campaign Builder render from it too).
 *      Minted per-campaign tags (campaign-*, event-*, ab-variant-*) are
 *      pattern-checked instead.
 *
 * Run locally before you push:   node scripts/validate-library.mjs
 * Runs automatically in CI via .github/workflows/validate-library.yml
 *
 * Exit code 0 = OK (warnings allowed). Exit code 1 = errors found.
 * No dependencies — stock Node 18+.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(REPO_ROOT, 'manifest.json');
const EMAILS_DIR = join(REPO_ROOT, 'emails');

// Tag Library registry — lives in this repo; the dashboard reads it from here.
const REGISTRY = join(REPO_ROOT, 'data', 'tag-library.json');
// Tags minted per campaign (the registry carries them as templates like
// "campaign-[name]-[q#-yyyy]") are validated by shape, not membership.
const MINTED_PATTERNS = [
  /^campaign-[a-z0-9]+(?:-[a-z0-9]+)*$/,
  /^event-[a-z0-9]+(?:-[a-z0-9]+)*$/,
  /^ab-variant-[ab]$/,
];

const errors = [];
const warnings = [];

// 1. manifest.json must exist and parse -----------------------------------
if (!existsSync(MANIFEST)) {
  console.error('✗ manifest.json not found at repo root.');
  process.exit(1);
}
let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
} catch (e) {
  console.error('✗ manifest.json is not valid JSON — the page will load blank.');
  console.error(`  ${e.message}`);
  console.error('  (Most common cause: a trailing comma after the last item in a list.)');
  process.exit(1);
}

// 2. structure + collect ids ----------------------------------------------
if (!manifest || !Array.isArray(manifest.campaigns)) {
  console.error('✗ manifest.json must be an object with a "campaigns" array.');
  process.exit(1);
}

const campaignIds = new Map();   // id -> count
const emailIds = new Map();
const sourceIds = [];
const referencedFiles = new Set();
const usedTags = [];             // { tag, where } — checked against the registry in step 5

for (const [ci, c] of manifest.campaigns.entries()) {
  const where = `campaign[${ci}]${c && c.id ? ` "${c.id}"` : ''}`;
  for (const f of ['id', 'title', 'year']) {
    if (!c?.[f]) errors.push(`${where}: missing required field "${f}".`);
  }
  if (!c?.kind) warnings.push(`${where}: no "kind" label.`);
  if (c?.id) campaignIds.set(c.id, (campaignIds.get(c.id) || 0) + 1);

  if (!Array.isArray(c?.emails)) {
    errors.push(`${where}: "emails" must be an array.`);
    continue;
  }
  for (const [ei, e] of c.emails.entries()) {
    const ew = `${where} > email[${ei}]${e && e.id ? ` "${e.id}"` : ''}`;
    for (const f of ['id', 'title', 'subject', 'sourceId']) {
      if (!e?.[f]) errors.push(`${ew}: missing required field "${f}".`);
    }
    if (e?.icon) {
      warnings.push(`${ew}: "icon" is retired (rows render neutral gray) — remove it.`);
    }
    if (e?.tags && !Array.isArray(e.tags)) errors.push(`${ew}: "tags" must be an array.`);
    if (Array.isArray(e?.tags)) for (const t of e.tags) usedTags.push({ tag: t, where: ew });
    if (!e?.sendDate) warnings.push(`${ew}: no "sendDate".`);
    if (e?.id) emailIds.set(e.id, (emailIds.get(e.id) || 0) + 1);

    // 3. every sourceId must have a matching file
    if (e?.sourceId) {
      sourceIds.push(e.sourceId);
      referencedFiles.add(`${e.sourceId}.html`);
      const file = join(EMAILS_DIR, `${e.sourceId}.html`);
      if (!existsSync(file)) {
        errors.push(`${ew}: no file emails/${e.sourceId}.html — Preview will break.`);
      }
    }
  }
}

// duplicates
for (const [id, n] of campaignIds) if (n > 1) errors.push(`Duplicate campaign id "${id}" (${n}×).`);
for (const [id, n] of emailIds) if (n > 1) errors.push(`Duplicate email id "${id}" (${n}×).`);
const dupSrc = sourceIds.filter((s, i) => sourceIds.indexOf(s) !== i);
for (const s of [...new Set(dupSrc)]) errors.push(`Duplicate sourceId "${s}".`);

// 4. orphan files (on disk, not referenced) — warning, not fatal
if (existsSync(EMAILS_DIR)) {
  for (const f of readdirSync(EMAILS_DIR)) {
    if (f.endsWith('.html') && !referencedFiles.has(f)) {
      warnings.push(`emails/${f} is not referenced by any manifest entry (won't appear).`);
    }
  }
}

// 5. tags must exist in the Tag Library registry ---------------------------
// The registry is a repo file the Tag Library page and Campaign Builder also
// render from — if it's missing or unparseable, those pages are broken too,
// so that's an error, not a skipped check.
let registryNote = '';
let registry = null;
if (!existsSync(REGISTRY)) {
  errors.push('data/tag-library.json is missing — the Tag Library page, Campaign Builder, and tag checks all depend on it.');
} else {
  try {
    registry = JSON.parse(readFileSync(REGISTRY, 'utf8'));
  } catch (e) {
    errors.push(`data/tag-library.json is not valid JSON: ${e.message}`);
  }
}
if (registry) {
  const known = new Set(
    [...(registry.tags || []), ...(registry.campaigns || [])]
      .map(t => t.tag)
      .filter(t => t && !t.includes('[')) // drop template entries like campaign-[name]-[q#-yyyy]
  );
  const flagged = new Set(); // warn once per unknown tag, listing where it's used
  for (const { tag, where } of usedTags) {
    if (known.has(tag) || MINTED_PATTERNS.some(p => p.test(tag)) || flagged.has(tag)) continue;
    flagged.add(tag);
    const uses = usedTags.filter(u => u.tag === tag).map(u => u.where);
    warnings.push(`tag "${tag}" is not in the Tag Library registry — used by: ${uses.join('; ')}.`);
  }
  registryNote = `Tags checked against data/tag-library.json (${known.size} registered).`;
}

// report ------------------------------------------------------------------
const emailCount = sourceIds.length;
console.log(`Checked ${manifest.campaigns.length} campaign(s), ${emailCount} email(s).`);
if (registryNote) console.log(registryNote);
console.log('');

if (warnings.length) {
  console.log(`⚠ ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  - ${w}`);
  console.log('');
}
if (errors.length) {
  console.error(`✗ ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nFix these before pushing — the library would break.');
  process.exit(1);
}
console.log('✓ Library is consistent. Safe to publish.');
