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
- `scripts/validate-library.mjs` — consistency checker (run before every commit).
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
          "icon": "green",
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
- `icon` is one of: `blue`, `green`, `purple`, `orange`.
- `tags` and `sendDate` are optional; everything else is required.

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
   `<short-id>`; set `kind`, `title`, `subject`, `icon`, `tags`, `sendDate`).
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

## Icon colors

`blue` (default — executive/keynote, primary campaigns), `purple` (product
launches, roadmap, AI/innovation), `green` (customer stories, success), `orange`
(in use for pre-event / event reminders). All four are valid per the validator.

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
