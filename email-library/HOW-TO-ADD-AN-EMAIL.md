# How to add a new email

Your library is now three things instead of one giant file:

- **`index.html`** — the page itself (the layout, search, tags). You almost never touch this again.
- **`emails/`** — a folder with one plain `.html` file per email. Readable, no encoding.
- **`manifest.json`** — the list that tells the page which emails exist and how to label them.

Adding an email = **two small changes**, both doable in the browser.

---

## The fast way (in the browser, no downloads)

1. Go to your repo on GitHub and press the **`.`** (period) key. This opens a full editor in your browser.
2. In the `emails/` folder, **add your new email file**, named with a short id and `.html`, e.g. `emails/q3-2026-webinar-invite.html`. (Paste the email HTML Claude gave you, or drag the file in.)
3. Open **`manifest.json`** and add an entry for it. Find the right campaign's `emails` list and add a block like this:

   ```json
   {
     "id": "q3-2026-webinar-invite",
     "kind": "End User Prospect",
     "title": "Q3 Webinar Invite",
     "subject": "You're invited: live HyperCore demo",
     "icon": "blue",
     "sourceId": "q3-2026-webinar-invite",
     "tags": ["one-time-send", "audience-end-user-prospect", "cta-demo"],
     "sendDate": "August 5, 2026"
   }
   ```

   - **`sourceId` must exactly match the file name** (without `.html`). That's the link between the entry and the file.
   - `icon` can be `blue`, `green`, `purple`, or `orange`.
   - To start a brand-new campaign instead, copy an existing campaign block (the object with `id`, `title`, `kind`, `year`, `emails`) and give it a fresh `emails` list.

4. Commit/save. GitHub Pages redeploys on its own in a minute or so. Refresh the public link — your email is there.

> **Tip:** You can just hand the new email HTML to Claude and ask for "the manifest.json block for this email," and paste what comes back. No need to write the JSON yourself.

---

## A couple of rules so nothing breaks

- The `sourceId` in `manifest.json` and the file name in `emails/` must match exactly (case-sensitive, no spaces).
- Don't open `index.html` by double-clicking it from your computer — browsers block the file loads and you'll see an error message. Always view it through the GitHub Pages link (or a local web server). On GitHub Pages it works perfectly.
- `manifest.json` is strict about commas: every item in a list is separated by a comma, and the **last** item has no trailing comma. If the page goes blank, a stray comma is the usual culprit — paste the file to Claude and ask it to check.

---

## Why this is better than before

Previously every email was crammed into `index.html` as encoded text, so the file grew forever and you re-uploaded the whole thing each time. Now each change touches only two small files, the page never bloats, and you can actually read your own email history in the `emails/` folder.
