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
 *   6. Pre-send content checks inside each email file: an unsubscribe link
 *      must exist (error if the send is still upcoming, warning if already
 *      sent), merge tokens must be the locked-spec ones ({{unsubscribe}},
 *      {{Recipient.FirstName}}), and upcoming sends should carry a hidden
 *      preheader block (inbox preview text). Hosted assets (Marketing
 *      Center) are exempt — they aren't sends.
 *   7. Client-compatibility lint: markup/CSS that major email clients drop —
 *      flex/grid/position and vh/vw/rem units (ignored by Word-engine
 *      Outlook), <svg>/<video>/<form>/<button>/<iframe>/external stylesheets
 *      (stripped by Outlook and/or Gmail), background images with no VML
 *      fallback, button-style links with no MSO fallback, and <img> tags
 *      missing alt text. Warnings only — the locked specs' table-based
 *      patterns never hit these. Hosted assets are exempt (browser-viewed).
 *   8. Palette-drift lint: every hex color in an email must appear in one of
 *      the locked spec files (house-style.md, reusable-blocks.md,
 *      plain-text-style.md — the specs ARE the approved palette). Catches
 *      the "sibling emails can be off-spec" trap: a color inferred from
 *      another email instead of looked up in the token table. Warnings only.
 *
 * Run locally before you push:   node scripts/validate-library.mjs
 * Runs automatically in CI via .github/workflows/validate.yml
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

// 6. pre-send content checks ------------------------------------------------
// Mirrors the locked specs: every send carries an unsubscribe link and the
// spec merge tokens; upcoming sends should have a hidden preheader. Severity
// is date-aware — a problem in an email that hasn't sent yet is fixable (and
// for unsubscribe, a compliance must), so it's an error; history is a warning.

// Same parsing the app uses: ISO, US, or natural-language dates → timestamp.
function parseSendDate(raw) {
  if (!raw) return NaN;
  const s = String(raw).trim();
  let m = s.match(/(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?/);
  if (m) return new Date(+m[1], +m[2] - 1, m[3] ? +m[3] : 1).getTime();
  m = s.match(/(\d{1,2})[/](\d{1,2})[/](\d{4})/);
  if (m) return new Date(+m[3], +m[1] - 1, +m[2]).getTime();
  const t = Date.parse(s);
  return isNaN(t) ? NaN : t;
}
const todayTs = new Date().setHours(0, 0, 0, 0);

// Locked-spec merge tokens (house-style.md / plain-text-style.md). Anything
// else that looks like a merge field would render literally — or means the
// email was authored for a different platform's syntax.
const SPEC_TOKENS = new Set(['{{unsubscribe}}', '{{Recipient.FirstName}}']);

// Hosted assets (Marketing Center pages) are not sends — no unsubscribe,
// merge fields, or preheader expected. Same heuristic the app uses.
const isHostedAsset = (e) => /marketing\s*center/i.test(`${e.kind || ''} ${e.title || ''}`);

// 7. client-compatibility lint (run inside the same per-email loop as step 6).
// Each finding is a short label; the app's build rail mirrors this function.
function clientCompatFindings(html) {
  const findings = [];
  const css = [
    [/display\s*:\s*flex/i, 'display:flex'],
    [/display\s*:\s*grid/i, 'display:grid'],
    [/position\s*:\s*(absolute|fixed)/i, 'position:absolute/fixed'],
    [/\b\d+(?:\.\d+)?(?:vh|vw)\b/i, 'vh/vw units'],
    [/\b\d+(?:\.\d+)?rem\b/i, 'rem units'],
  ];
  for (const [re, label] of css) if (re.test(html)) findings.push(`${label} (ignored by Outlook)`);
  const els = [
    [/<svg\b/i, '<svg> (dropped by Outlook and Gmail)'],
    [/<video\b/i, '<video> (unsupported in most clients)'],
    [/<form\b/i, '<form> (stripped by most clients)'],
    [/<button\b/i, '<button> (broken in Outlook — use the spec link + MSO fallback)'],
    [/<iframe\b/i, '<iframe> (stripped by all major clients)'],
    [/<link\b[^>]*rel=["']?stylesheet/i, 'external stylesheet (stripped by Gmail)'],
  ];
  for (const [re, label] of els) if (re.test(html)) findings.push(label);
  if (/background(?:-image)?\s*:[^;}"']*url\(/i.test(html) && !/<!--\[if\s+gte\s+mso|<v:fill|<v:rect/i.test(html)) {
    findings.push('background image without a VML fallback (Outlook shows none)');
  }
  const btnLike = (html.match(/<a\b[^>]*>/gi) || [])
    .filter(t => /border-radius/i.test(t) && /background/i.test(t)).length;
  if (btnLike && !/<!--\[if\s+mso\]/i.test(html)) {
    findings.push('button-style links without an MSO fallback (Outlook renders them unpadded)');
  }
  const noAlt = (html.match(/<img\b[^>]*>/gi) || []).filter(t => !/\balt\s*=/i.test(t)).length;
  if (noAlt) findings.push(`${noAlt} <img> without alt text (blank when images are blocked)`);
  return findings;
}

// 8. palette-drift lint (run inside the same per-email loop). The approved
// palette is extracted from the locked spec files themselves — registering a
// new token in a spec automatically approves it here, so the specs stay the
// single source of truth.
const SPEC_FILES = ['house-style.md', 'reusable-blocks.md', 'plain-text-style.md'];
const normalizeHex = (h) => {
  h = h.toLowerCase();
  return h.length === 4 ? '#' + [...h.slice(1)].map(ch => ch + ch).join('') : h;
};
const approvedColors = new Set();
for (const f of SPEC_FILES) {
  const p = join(REPO_ROOT, f);
  if (!existsSync(p)) continue;
  for (const m of readFileSync(p, 'utf8').match(/#(?:[0-9a-f]{6}|[0-9a-f]{3})\b/gi) || []) {
    approvedColors.add(normalizeHex(m));
  }
}

for (const c of manifest.campaigns) {
  if (!Array.isArray(c?.emails)) continue;
  for (const e of c.emails) {
    if (!e?.sourceId || isHostedAsset(e)) continue;
    const file = join(EMAILS_DIR, `${e.sourceId}.html`);
    if (!existsSync(file)) continue; // already an error in step 3
    const html = readFileSync(file, 'utf8');
    const ref = `emails/${e.sourceId}.html`;
    const ts = parseSendDate(e.sendDate);
    const upcoming = isNaN(ts) || ts >= todayTs; // undated = still editable = treat as upcoming

    // a) unsubscribe link — any mention counts; total absence is the problem
    if (!/unsubscribe/i.test(html)) {
      (upcoming ? errors : warnings).push(
        `${ref}: no unsubscribe link${upcoming ? ' — must be fixed before this sends' : ' (already sent; recorded as shipped)'}.`);
    }

    // b) merge tokens must match the locked spec
    const tokens = [...new Set(html.match(/{{[^}]*}}|%%[^%\s]*%%/g) || [])];
    const offSpec = tokens.filter(t => !SPEC_TOKENS.has(t));
    if (offSpec.length) {
      warnings.push(`${ref}: non-spec merge token(s) ${offSpec.join(', ')} — the locked specs use {{Recipient.FirstName}} / {{unsubscribe}}; anything else may render literally in Pardot.`);
    }

    // c) upcoming sends should have a hidden preheader (inbox preview text).
    // Same detection as the app: a style attr with display:none AND max-height:0.
    if (upcoming) {
      const hasPreheader = [...html.matchAll(/style="([^"]*)"/gi)].some(m => {
        const s = m[1].replace(/\s/g, '');
        return s.includes('display:none') && s.includes('max-height:0');
      });
      if (!hasPreheader) {
        warnings.push(`${ref}: upcoming send has no hidden preheader — the inbox preview will show whatever text comes first.`);
      }
    }

    // d) client-compatibility lint (step 7)
    for (const f of clientCompatFindings(html)) warnings.push(`${ref}: ${f}.`);

    // e) palette-drift lint (step 8)
    if (approvedColors.size) {
      const colors = [...new Set((html.match(/#(?:[0-9a-f]{6}|[0-9a-f]{3})\b/gi) || []).map(normalizeHex))];
      const offPalette = colors.filter(cl => !approvedColors.has(cl));
      if (offPalette.length) {
        warnings.push(`${ref}: off-palette color(s) ${offPalette.join(', ')} — not in any locked spec (house-style.md / reusable-blocks.md / plain-text-style.md). Look tokens up in the spec, never in sibling emails; if a color is genuinely approved, register it in the spec.`);
      }
    }
  }
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
