# How to add a new email

Your library is three things:

- **`index.html`** — the page itself (layout, search, tags). You almost never touch this.
- **`emails/`** — one plain `.html` file per email, named `<sourceId>.html`.
- **`manifest.json`** — the list that tells the page which emails exist and how to label them.

Adding an email = a new file in `emails/` + a matching entry in `manifest.json`.
The two must stay in sync — that's the whole game, and it's now checked for you
automatically (see "Before it goes live").

---

## The fastest way — let Claude Code do all of it (recommended)

If you have the repo cloned locally and open in Claude Code, the build, the
manifest entry, and the commit happen in one step. Hand Claude the build doc (or
the email HTML) and say:

> Build this email to house style. Save it as `emails/<short-id>.html`, add the
> matching entry to the right campaign in `manifest.json` (id + sourceId =
> `<short-id>`, set kind/title/subject/tags/sendDate), run
> `node scripts/validate-library.mjs`, and commit.

That's the whole loop — no GitHub web UI, no separate manifest edit, and the
validator confirms it's consistent before the commit lands. Editing later is the
same: "change the CTA copy in `<id>` and re-commit."

---

## The browser way (no clone, no downloads)

1. Go to the repo on GitHub and press the **`.`** (period) key — this opens a
   full editor in your browser.
2. In `emails/`, add your new file, named with a short id + `.html`, e.g.
   `emails/q3-2026-webinar-invite.html`. Paste the email HTML Claude gave you.
3. Open **`manifest.json`** and add an entry to the right campaign's `emails`
   list:

   ```json
   {
     "id": "q3-2026-webinar-invite",
     "kind": "End User Prospect",
     "title": "Q3 Webinar Invite",
     "subject": "You're invited: live HyperCore demo",
     "sourceId": "q3-2026-webinar-invite",
     "tags": ["one-time-send", "audience-end-user-prospect", "cta-demo"],
     "sendDate": "August 5, 2026"
   }
   ```

   - **`sourceId` must exactly match the file name** (without `.html`).
   - `tags` come from the registry in `data/tag-library.json` (browse it at
     `#/tags` in the live library) — don't invent new ones. The `icon` field is
     retired; don't add it to new entries.
   - New campaign instead? Copy an existing campaign block (`id`, `title`,
     `kind`, `year`, `emails`) and give it a fresh `emails` list.
4. Commit/save. GitHub Pages redeploys in a minute or so.

> **Tip:** hand the email HTML to Claude and ask for "the manifest.json block for
> this email," then paste what comes back.

---

## Before it goes live — validation

A small script checks the two things that silently break the page:

```bash
node scripts/validate-library.mjs
```

It confirms `manifest.json` is valid JSON (a trailing comma blanks the page),
every `sourceId` has a matching `emails/<sourceId>.html` (a missing file breaks
that email's Preview), flags orphan files, duplicates, missing required fields,
and audits every tag against the registry in `data/tag-library.json` (unknown
tags are warnings; minted `campaign-*` / `event-*` / `ab-variant-*` tags are
shape-checked). Green = safe to publish.

The same check runs automatically on GitHub via
`.github/workflows/validate.yml` ("Validate library" in the Actions tab) — so
even browser-only edits get caught within a minute of pushing. If you want it
to actually *block* a broken state from deploying, make changes through a pull
request and set "Validate library" as a required check in branch protection.

---

## A couple of rules so nothing breaks

- `sourceId` in `manifest.json` and the file name in `emails/` must match
  exactly (case-sensitive, no spaces).
- Don't open `index.html` by double-clicking it from your computer — browsers
  block the file loads. View it through the GitHub Pages link (or a local web
  server).
- `manifest.json` is strict about commas: items are comma-separated and the
  **last** item has no trailing comma. Blank page? A stray comma is the usual
  culprit — or just run the validator, which says exactly where.

---

## Why this works

Each change touches two small, readable files instead of one ever-growing page,
and the validator + CI make the file/manifest sync something you no longer have
to police by hand.
