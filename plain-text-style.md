# Scale Computing Email — Plain-Text Style

## How to use this doc

This is the **locked spec for plain-text / personal-style emails** — the format that looks and reads like a one-to-one note from a real person: a logo, prose, and links. It is a **sibling to `house-style.md`**, not a replacement. Pick one format per send:

- **Rich HTML** (hero, white content card, Section Pattern Library) → `house-style.md`
- **Plain-text** (logo + prose + links, no hero/card/buttons) → this file

Same locked-spec philosophy as `house-style.md`: match it exactly, don't introduce novel styling, and don't invent substantive copy — if the brief has a placeholder, leave it out and flag it. You may write short connective/framing sentences.

**Shared with `house-style.md` (single source of truth — don't fork these):** the Pardot merge tags, the footer copy, the company address, the logo asset URL, and the `<head>` boilerplate. This format reuses them as-is; it just drops the gray wrapper, the white card, the hero, the section patterns, and the social-icon row.

---

## When to use this format

Use it when the email should feel personal and direct: survey/feedback requests, reminders, rep outreach, account notes, low-key announcements. Use `house-style.md` instead for image-led promos, event invites with rich graphics, or anything that needs a visual hierarchy of cards and buttons.

---

## Document structure

Single column on a **white** background — no `#f2f2f2` wrapper, no white card, no three-table stack. Sections, in order:

1. **Logo** — the same logo asset as `house-style.md`, top-left, 175px. The one allowed image. No banner, no hero.
2. **Greeting** — `Hi {{Recipient.FirstName}},`
3. **Context paragraph** — 2–4 sentences on why this matters to the reader.
4. **Core message** — leads with a single bold word/phrase (e.g. **Reminder!**), then the ask.
5. **Primary CTA** — one optional emoji pointer plus a single bolded, hyperlinked phrase. One primary CTA per email.
6. **Incentive / details** — any offer or instructions, with inline links (e.g. a `mailto:`). Not buttons.
7. **Supporting info** — secondary detail (timeline, where results go, a reference link).
8. **Signature** — the conditional sender block (personalized rep, falling back to company).
9. **Footer** — copyright/trademark, address, Contact | Privacy, unsubscribe. Reused from `house-style.md`, minus the social-icon image row.

---

## Voice & tone

- Second person, conversational, professional. Write to one reader.
- Short sentences; one idea per paragraph; favor 1–3 sentence paragraphs.
- Front-load the value to the reader, not to the company.
- State the time/effort cost when asking for the reader's time ("should only take 10 minutes").

## Formatting rules

- **Bold sparingly** — only the emphasis lead-in (e.g. **Reminder!**) and the CTA. Nothing else.
- **One primary CTA**, hyperlinked. Secondary links live inline in prose.
- **Descriptive link text**, not raw URLs — except an intentional vanity URL that is itself the message (e.g. `www.CRN.com/ARC`).
- **Emoji**: at most one, as a pointer before the CTA (👉). Optional; drop it for formal audiences.
- **No images beyond the logo.** No buttons, cards, background colors, hero, or dividers.
- Blank line between every paragraph.

---

## Pardot merge tags (use exactly these — sync with `house-style.md`)

- `{{Recipient.FirstName}}` — greeting, `Hi {{Recipient.FirstName}},`
- `{{unsubscribe}}` — `href` of the footer unsubscribe link (link text is "click here")
- **Signature conditional** — personalized rep, falling back to the company signature:
  ```
  {{#if Sender.Name}}{{Sender.FirstName}} {{Sender.LastName}}
  {{Sender.Email}} // {{Sender.Phone}} {{else}}
  Scale Computing
  {{/if}}
  scalecomputing.com
  ```
  Verify `{{Sender.Name}}` resolves as a testable field in your Pardot business unit; if it doesn't, gate the conditional on `{{Sender.Email}}` instead.

Do not improvise other tokens. If you need a new one, update `house-style.md` first.

---

## Footer copy (reused verbatim from `house-style.md`)

Plain-text footer = the `house-style.md` footer **minus the social-icon row** (this format avoids images beyond the logo). Order, all small (12px / 16px) muted `#6e6e6e`:

1. **Copyright + trademark** — © 2026 Scale Computing, Inc. All rights reserved. Scale Computing and other Scale Computing marks are trademarks of Scale Computing, Inc. All other trademarks are the property of their respective owners. Information on Scale Computing patents and trademarks is available at scalecomputing.com/legal.
2. **Address** — Scale Computing / 3307 Northland Dr, Suite 500 / Austin, TX 78731
3. **Contact | Privacy** — Contact Us | Privacy Policy
4. **Unsubscribe** — "If you wish to unsubscribe or update your email preferences, click here" (`href` = `{{unsubscribe}}`)

Links: Contact `https://www.scalecomputing.com/contact`, Privacy `https://www.scalecomputing.com/privacy-policy`, Legal `https://www.scalecomputing.com/legal`.

---

## Shared assets

- **Logo:** `https://info.scalecomputing.com/l/46782/2026-05-22/9ncf6z/46782/1779485235Zbzzbthu/PRIMARY_horizontal_scale_logo_blue_grey_tm.png`
- **Font stack:** `'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', Arial, sans-serif`
- **Body text:** 15px / 24px, `#1a1a1a`. **Links:** `#0a5db5`. **Muted/footer:** `#6e6e6e`.
- **`<head>` boilerplate:** use the same boilerplate as `house-style.md` (charset/viewport metas, `x-apple-disable-message-reformatting`, `format-detection` off, `color-scheme: light only`, MSO Trebuchet forcing).

---

## Delivery format

Build as a **single self-contained, lightweight, inline-styled HTML** file — single column, white background, max-width ~600px, content left-aligned. It should *render* as plain even though it's HTML, so it drops straight into Pardot and gets logged in the dashboard like any other email (kind: `Plain-Text Outreach`). Not a `.txt` file.

---

## Template (paste-ready HTML)

```html
<body style="margin:0; padding:0; background:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; color:#1a1a1a;">

          <!-- LOGO -->
          <tr><td style="padding:0 0 24px;">
            <img src="LOGO_URL" alt="Scale Computing" width="175" style="width:175px; height:auto; display:block; border:0;" />
          </td></tr>

          <!-- BODY -->
          <tr><td style="font-size:15px; line-height:24px;">
            <p style="margin:0 0 18px;">Hi {{Recipient.FirstName}},</p>

            <p style="margin:0 0 18px;">[Context: 2–4 sentences on why this matters to the reader.]</p>

            <p style="margin:0 0 18px;"><strong>[Lead-in!]</strong> [The ask — one or two sentences.]</p>

            <p style="margin:0 0 18px;">👉 <a href="CTA_URL" style="color:#0a5db5; font-weight:bold;">[CTA phrase]</a></p>

            <p style="margin:0 0 18px;">[Incentive or instructions, with an inline link such as
              <a href="mailto:EMAIL" style="color:#0a5db5;">EMAIL</a> for follow-up.]</p>

            <p style="margin:0 0 18px;">[Supporting info: timeline, where results go, a reference link.]</p>

            <!-- SIGNATURE -->
            <p style="margin:0 0 18px; white-space:pre-line;">{{#if Sender.Name}}{{Sender.FirstName}} {{Sender.LastName}}
{{Sender.Email}} // {{Sender.Phone}} {{else}}
Scale Computing
{{/if}}
<a href="https://www.scalecomputing.com" style="color:#0a5db5;">scalecomputing.com</a></p>
          </td></tr>

          <!-- FOOTER (synced from house-style.md, no social icons) -->
          <tr><td style="padding:24px 0 0; font-size:12px; line-height:16px; color:#6e6e6e;">
            <p style="margin:0 0 14px;">© 2026 Scale Computing, Inc. All rights reserved. Scale Computing and other Scale Computing marks are trademarks of Scale Computing, Inc. All other trademarks are the property of their respective owners. Information on Scale Computing patents and trademarks is available at <a href="https://www.scalecomputing.com/legal" style="color:#6e6e6e;">scalecomputing.com/legal</a>.</p>
            <p style="margin:0 0 14px;">Scale Computing<br/>3307 Northland Dr, Suite 500<br/>Austin, TX 78731</p>
            <p style="margin:0 0 14px;"><a href="https://www.scalecomputing.com/contact" style="color:#6e6e6e;">Contact Us</a> &nbsp;|&nbsp; <a href="https://www.scalecomputing.com/privacy-policy" style="color:#6e6e6e;">Privacy Policy</a></p>
            <p style="margin:0;">If you wish to unsubscribe or update your email preferences, <a href="{{unsubscribe}}" style="color:#6e6e6e;">click here</a>.</p>
          </td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
```

---

## Filled example (the source ARC reminder, in spec)

```
[Scale Computing logo, top-left, 175px]

Hi {{Recipient.FirstName}},

For over 40 years, the CRN Annual Report Card has recognized vendor partners
for their commitment to the channel. This recognition is based on feedback from
channel partners who share their opinions on how vendor products, programs, and
performance influence channel strategy.

Reminder! You have been selected as one of our most valued partners to complete
this year's ARC Survey, which should only take 10 minutes to complete.

👉 Click here to take the survey

We will give survey respondents a $100 Amazon.com gift card in exchange for their
time. Once you have completed the survey, please send a screenshot of your
confirmation to crn@scalecomputing.com to receive your gift card. Scale
Computing™ will not have access to their identities or responses.

The results will be published in October. You can view last year's at
www.CRN.com/ARC.

{{#if Sender.Name}}{{Sender.FirstName}} {{Sender.LastName}}
{{Sender.Email}} // {{Sender.Phone}} {{else}}
Scale Computing
{{/if}}
scalecomputing.com

[Footer: copyright/trademark · address · Contact Us | Privacy Policy · unsubscribe]
```

---

## Checklist before sending

- [ ] Greeting uses `{{Recipient.FirstName}}`
- [ ] Exactly one primary CTA, hyperlinked, descriptive text
- [ ] Bold only on the lead-in and the CTA
- [ ] No images except the logo; no buttons or cards
- [ ] Time/effort cost stated if asking for the reader's time
- [ ] Signature uses the `{{#if Sender.Name}}` conditional with company fallback
- [ ] Footer copy matches `house-style.md` (address present, social-icon row omitted)
- [ ] Unsubscribe link `href` is `{{unsubscribe}}`
