# CLAUDE.md — Email Library project guide

Claude Code reads this file automatically when it opens the repo. It defines how
this project works so new emails come out correct without re-explaining.

## What this repo is

A public **email preview library**, served via GitHub Pages. Internal reviewers
get one shareable link per campaign (Preview = rendered email, Copy HTML = code
for Pardot). `index.html` is the page itself — **you almost never edit it.**

## Structure

- `index.html` — the app (layout, search, tags). Don't edit for content.
- `manifest.json` — the list of campaigns and emails. **You edit this.**
- `emails/<sourceId>.html` — one standalone, Pardot-ready email per file.
- `data/tag-library.json` — **the tag registry, single source of truth for
  tags** (moved here from the mar-ops-dashboard June 2026). To add or change a
  tag, edit this file. Never invent tags ad hoc.
- Ops Tools are **routed views inside `index.html`** (`#/tags` = Tag Library
  browser, `#/builder` = Campaign Builder) so they share the app shell
  (sidebar, breadcrumb, hero). The builder's logic is
  `assets/campaign-builder.{css,js}` (verbatim from the dashboard's old
  `sections/campaign-builder/`; reads the registry as `window.TAG_DATA`,
  exports the Word build doc). `tags.html` / `builder.html` are just redirect
  stubs for old links.
- `scripts/validate-library.mjs` — consistency checker (run before every commit).
  Audits every manifest tag against `data/tag-library.json`; minted
  per-campaign tags (`campaign-*`, `event-*`, `ab-variant-*`) are
  shape-checked. An unknown tag is a warning: fix it or register it.
- `house-style.md`, `reusable-blocks.md`, `plain-text-style.md` — the locked
  build specs (see "Which spec to build from").

## The golden rule

Every email is **two things that must match**: a file `emails/<id>.html` **and**
an entry in `manifest.json` whose `sourceId` equals that filename (without
`.html`). Add both in the **same commit**. A manifest entry with no file breaks
that email's Preview; a file with no entry never appears.

## manifest.json schema

```json
{
  "campaigns": [
    {
      "id": "q2-2026-tradeshows",
      "title": "Q2-2026 Tradeshows",
      "kind": "Tradeshow Post-Event",
      "year": "2026",
      "emails": [
        {
          "id": "q2-2026-tradeshows-nyslgitda",
          "kind": "Tradeshow Post-Event",
          "title": "NYSLGITDA Spring Conference",
          "subject": "Great to see you at NYSLGITDA!",
          "sourceId": "q2-2026-tradeshows-nyslgitda",
          "tags": ["one-time-send", "content-post-event", "audience-end-user"],
          "sendDate": "June 8, 2026"
        }
      ]
    }
  ]
}
```

- `year` is a **string**. `sourceId` must equal `id` and the filename.
- `tags` and `sendDate` are optional; everything else is required.
- `icon` is **retired** (June 2026): the library renders every email icon neutral
  gray, so the field is no longer carried in the manifest. Don't add it to new
  entries — the validator warns if it reappears.

## Which spec to build from

Pick one format per send:

- **Rich HTML** (hero, white content card, Section Pattern Library) →
  `house-style.md`. For standing modules (the VMware-alternative offer, media+text
  rows, Gartner review card, etc.) compose by name from `reusable-blocks.md`.
- **Plain-text / personal** (logo + prose + links, no hero/card/buttons — survey
  asks, rep outreach, low-key notes) → `plain-text-style.md`. Log these in the
  manifest with `kind: "Plain-Text Outreach"`.

These are **locked specs, not creative briefs**: match them exactly, don't
introduce novel styling, and don't invent substantive copy — if the brief has a
placeholder, leave it out and flag it. The existing files in `emails/` are
faithful references.

## Building a new email

Before building, decide (from the brief):
1. Which Section Patterns / blocks the copy calls for — and why.
2. Numbered Outcome Grid? Only if all items share the same copy shape; otherwise
   use the stacked variant.
3. "Key Event Information" (dates / venue / booth)? Use the Save-the-Date Ticket,
   not a Numbered Outcome Grid.
4. How many primary CTAs? One → Closing Line + Primary CTA. Two roughly equal →
   Linked Action Tiles (no primary button).

Then:
1. Build to the chosen spec (keep the `#f2f2f2` background, MSO button fallbacks,
   and merge fields `{{Recipient.FirstName}}` / `{{unsubscribe}}`).
2. Save as `emails/<short-id>.html`.
3. Add the manifest entry under the correct campaign (`id` + `sourceId` =
   `<short-id>`; set `kind`, `title`, `subject`, `tags`, `sendDate`).
4. Run `node scripts/validate-library.mjs` — it must print `✓` before you commit.
5. Commit the file and the manifest change together.

Editing an existing email is the same loop: edit `emails/<id>.html` in place,
re-run the validator, commit.

## Reviewer sharing

To get a campaign reviewed, open the live library, click into the campaign, and
copy its shareable link — e.g.
`https://scale-computing-marketing.github.io/email-library/#/campaign/<campaign-id>`.
Anyone with the link can review the rendered emails; no login required.

## Visual QA (rendering differs across clients)

- Render the file and look at it before editing — describe what specific value is
  wrong and why, rather than guessing.
- On a visual complaint, a screenshot gets to the fix in one round.
- If the same fix doesn't land twice, switch layouts (e.g. stack a grid) rather
  than re-tweaking — the renderer disagrees with the CSS.

## Don'ts

- Don't add a manifest entry without its HTML file (breaks Preview).
- Don't leave a trailing comma in `manifest.json` (blanks the page — the
  validator catches it).
- Don't open `index.html` via `file://`; view it through GitHub Pages.

## Note on dashboard-bootstrap.md

That older doc describes a superseded publishing flow (base64 into `index.html`
via a "dashboard chat," then re-uploading the whole file). This repo no longer
works that way — emails are individual files in `emails/` plus entries in
`manifest.json`, published per `HOW-TO-ADD-AN-EMAIL.md`. Keep that doc only as an
archive; don't follow its publishing steps.

## House-style tokens (convenience snapshot — `house-style.md` is authoritative)

| Token | Value |
| --- | --- |
| Email background | `#f2f2f2` |
| Content card | `#ffffff`, 8px radius, max-width 680px |
| Body font | `'Trebuchet MS', Arial, sans-serif` |
| Body text / muted | `#1a1a1a` / `#6e6e6e` |
| Primary link & button (blue) | `#0a5db5` |
| Accent blue | `#1e88e5` |
| Navy box / hero | `#0a2540` |
| Opt-in link (magenta, per-send) | `#9c2e91` |
| Informational Card (grey prose box) | bg `#f1f0ee`, 1px border `#e4e2dd` |
| Soft data card (numbered grid / ticket) | `#f7f9fc` |

**Token rule:** before choosing any color/spacing/box value, look it up in
`house-style.md` (then `reusable-blocks.md`) by the pattern's name — **never infer
a token from another email; sibling emails can be off-spec.** The three card tints
are meaningful and not interchangeable: navy `#0a2540` = action, grey `#f1f0ee` =
explanatory prose (Informational Card — e.g. "Report Overview" / "How to Leverage"),
soft blue-gray `#f7f9fc` = structured data (Numbered Outcome Grid, Save-the-Date).

## Resolving & creating

- When I refer to an email loosely ("the GigaOm leads email"), resolve it against
  `manifest.json` by `id`, `title`, or `campaign`. If exactly one matches, proceed.
  If more than one could match, list the candidates (id + campaign + title) and ask
  which — never guess.
- Emails are flat files at `emails/<sourceId>.html`. Never create subfolders.
- If a new email belongs to a campaign not yet in `manifest.json`, create the
  campaign object (`id`, `title`, `kind`, `year`, `emails: []`) and add the email to
  it — just do it and report what you created.
