# Scale Computing Email House Style

## How to use this doc

This is a **locked specification, not a creative brief.** The goal is that every Scale Computing email is visually and structurally indistinguishable in brand, layout, and typography. Consistency across emails is the deliverable.

**Scope:** this spec covers our **rich HTML** emails (three-table layout, hero, white content card, pattern library). For **plain-text / personal-style** sends — a logo, prose, and links that read like a one-to-one note — use the separate `plain-text-style.md` spec. Don't try to force plain-text copy through the Section Pattern Library below.

When building an email:
- Match this spec exactly. Use the defined colors, fonts, paddings, class names, and patterns as written.
- Do NOT introduce novel design, layout, color, or typographic choices, "improved" aesthetics, or variations — even if they would look good in isolation. Variation is a defect here, not an enhancement.
- Compose only from the Section Pattern Library below. If the brief calls for something no pattern covers, ask before inventing.
- Copy judgment is narrow: you may write short connective/framing sentences (e.g. a closing line before a CTA), but do not invent substantive content. If the brief has a placeholder (e.g. "Insert X blurb"), leave it out and flag it.

## Layout
- 680px max width, centered. Use fluid containers: `width:100%; max-width:680px` on every 680px table (not a hard `width:680px`), so they collapse cleanly on mobile.
- Table-based layout (cellspacing=0, cellpadding=0, role="presentation" on every layout table)
- Inline CSS only — no external stylesheets, no `<style>` in `<head>` except for media queries and dark-mode overrides
- Outlook MSO conditional comments for VML buttons and proper rendering
- Wrap the whole stack in an MSO/IE ghost table so Outlook holds the 680px width:
  ```html
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="680" align="center"><tr><td>
  <![endif]-->
  ... three stacked 680px tables (logo bar / content card / footer) ...
  <!--[if mso | IE]>
  </td></tr></table>
  <![endif]-->
  ```
- Mobile breakpoint at 700px
- Standard horizontal padding inside the content card and footer is **35px desktop / 24px mobile** (mobile via the `.mobile-padding` class)

## Vertical rhythm between stacked patterns

Each pattern defines its own internal padding. When two patterns stack, do NOT let both contribute full vertical padding at the seam — that doubles the gap (e.g. Greeting + Intro's 35px bottom landing on Closing Line's top spacing reads as ~70px of dead space).

Rule: the **upper** pattern surrenders its bottom padding at a seam; the **lower** pattern owns the gap. In practice:

- A padded cell that is immediately followed by another content cell drops its bottom padding to **16px** (one body-paragraph rhythm), rather than the full 35px. The full 35px bottom padding is only correct when the cell is the LAST cell in the white content card.
- Patterns that already specify a top padding (Section Header `35px…`, Pull Quote `36px…`, Closing Line `36px…`) assume the cell above them has already closed to 16px. Don't add a full 35px above AND a 36px below across one seam.

Quick check when composing: walk the cells top-to-bottom and make sure no two adjacent cells each carry 30px+ of padding toward the same seam. One owns it, the other closes to 16px.

## Document Structure (three stacked tables — DO NOT nest these)

The email is **three separate 680px tables**, stacked, all centered inside one outer `#f2f2f2` table cell. The logo and footer sit on the gray body background, OUTSIDE the white card. Only the hero-through-CTA content lives in the white card.

1. **Logo bar** — `#f2f2f2` background. Single row, logo image aligned **left**, 175px wide. Padding `8px 0`. (The logo is NOT in the footer and is NOT centered.)
2. **Content card** — `#ffffff` background, `border-radius:8px; overflow:hidden`. Contains everything from the Hero Block down through Closing + Primary CTA.
3. **Footer** — `#f2f2f2` background, centered text. Contains copyright, social icons, address, contact/privacy, unsubscribe. (No logo in the footer.)

```
#f2f2f2 outer wrapper (padding 24px 10px 0)
 ├─ [680px] LOGO BAR        — gray bg, logo left @175px
 ├─ [680px] CONTENT CARD    — white bg, radius 8px: Hero → … → Closing CTA
 └─ [680px] FOOTER          — gray bg, centered
```

## Typography
- Font stack: `'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', Arial, sans-serif`
- Force Trebuchet MS in MSO conditional style block
- Body copy: 15px / 24px line-height (16px / 25px on mobile)
- H1 (hero headline): 28px desktop, 24px mobile
- H2 (section headers): 24px desktop, 22px mobile
- H3 (session/sub-section): 18px desktop / mobile
- Eyebrows / kickers: 11–13px, uppercase, 1.5–2.5px letter-spacing, bold

## Required `<head>` boilerplate

Every email includes, in order: charset + Content-Type meta, `viewport`, `x-apple-disable-message-reformatting`, `format-detection` (telephone/date/address/email/url = no), `color-scheme: light only` + `supported-color-schemes: light only`, the page `<title>` (= subject line), the MSO `<noscript>` block forcing Trebuchet MS + `AllowPNG`, then the main `<style>` block.

The main `<style>` block must include: text-size-adjust resets, `mso-table-lspace/rspace` + `border-collapse` on tables, `img` resets (`-ms-interpolation-mode:bicubic; border:0; display:block`), `body` reset, `a { color:#0a5db5 }`, an `a[x-apple-data-detectors]` override, the `@media max-width:700px` block, and the `@media (prefers-color-scheme: dark)` block.

## Responsive class names (use these exact names)

The media query at `max-width:700px` keys off these classes. Apply them as noted:
- `.email-container` — on each 680px table → `width:100% !important`
- `.fluid` — on the hero image and any full-bleed image → `width:100% !important; height:auto`
- `.mobile-padding` — on every padded cell (35px sides) → drops to `24px` sides
- `.mobile-h1` / `.mobile-h2` / `.mobile-h3` — on H1/H2/H3 → 28/22/18px
- `.mobile-eyebrow` — on eyebrow/kicker `<p>` → 11px, 2px letter-spacing
- `.mobile-body` — on body `<p>` → 16px / 25px
- `.dark-text` / `.muted-text` — on body / muted `<p>` (re-asserts color in dark mode)
- `.cta-button-primary` — on the primary CTA table → full-width; its `a` becomes `display:block; width:100%`
- `.logo-img` — on the header logo → `max-width:160px` on mobile
- `.mobile-logo-pad` — on the logo cell → `padding-left:0; padding-right:0` (overrides any default padding so the logo aligns flush-left with the hero image below it; **never use `.mobile-padding` on the logo cell** — it pushes the logo in while the hero stays flush, breaking alignment on mobile)
- `.col-stack` / `.split-img` / `.split-text` — on the 2-column outcome-grid cells → stack to single column
- `.card-outer` — on the Informational Card's outer gutter cell → side gutters drop to `16px` on mobile (desktop sides are set inline at `35px`). Do NOT also put `.mobile-padding` on this cell — `.card-outer` owns its gutter.
- `.card-padding` — on the Informational Card's inner content cell → `padding:24px 22px` on mobile (desktop `30px 34px` is set inline)
- `.ticket-stub` — on the navy date-stub cell of the Save-the-Date Ticket → stacks to full width on mobile
- `.ticket-details` — on the details cell of the Save-the-Date Ticket → stacks to full width and flips the dashed divider from `border-left` to `border-top`

## Colors
- Hero background: `#0a2540` (dark navy)
- Accent bar: `#1e88e5` (bright blue, 3px under hero image)
- Body background: `#f2f2f2` (light gray)
- Card background: `#ffffff`
- Soft card background (numbered grid, pull quotes): `#f7f9fc` (pale blue-gray)
- Informational card background (grey box): `#f1f0ee` (soft grey)
- Informational card border: `#e4e2dd` (neutral grey, 1px)
- Body text: `#1a1a1a` (near-black)
- Muted text: `#6e6e6e`
- Primary CTA button: `#0a5db5` (medium blue)
- Secondary CTA button (inside navy callouts): `#1e88e5` (bright blue)
- Links in body: `#0a5db5`
- Hero eyebrow text: `#7ec4ff` (sky blue, on navy)
- Hero subtext on navy: `#dbe4f0`
- Hero presenter line on navy: `#b8c5d6`
- Accent numeral / decorative bright blue: `#1e88e5`

## Pardot merge tags (must preserve exactly)
- `{{Recipient.FirstName}}` — greeting in body (e.g. `Hi {{Recipient.FirstName}},`)
- `{{unsubscribe}}` — link in footer
- `{{Sender.FirstName}}` / `{{Sender.LastName}}` — assigned-sender name (plain-text signature)
- `{{Sender.Email}}` / `{{Sender.Phone}}` — assigned-sender contact (plain-text signature)
- `{{#if Sender.Name}}…{{else}}…{{/if}}` — conditional that prints the personalized rep signature when a sender is assigned, falling back to the company signature when not

The `Sender.*` tokens and the `{{#if Sender.Name}}` conditional are used by the plain-text format (`plain-text-style.md`); they're approved for HTML too if a send ever needs a personalized rep line. Verify `{{Sender.Name}}` resolves as a testable field in your Pardot business unit before first use; if it doesn't, gate the conditional on `{{Sender.Email}}` instead.

## Company info for footer
Scale Computing
3307 Northland Dr, Suite 500
Austin, TX 78731

## Social links
- Facebook: https://www.facebook.com/ScaleComputing
- X: https://twitter.com/ScaleComputing
- LinkedIn: https://www.linkedin.com/company/scale-computing
- YouTube: https://www.youtube.com/user/ScaleComputing

## Legal links
- Contact: https://www.scalecomputing.com/contact
- Privacy: https://www.scalecomputing.com/privacy-policy
- Trademarks: https://www.scalecomputing.com/legal

## Logo asset URL
https://info.scalecomputing.com/l/46782/2026-05-22/9ncf6z/46782/1779485235Zbzzbthu/PRIMARY_horizontal_scale_logo_blue_grey_tm.png

## Social icon asset base
img.icons8.com/ios-glyphs/60/b8bcc2/ followed by:
- facebook-new.png
- twitterx--v2.png
- linkedin.png
- youtube-play.png

Each icon: 28×28px, light gray `#b8bcc2` styling.

## Canonical reference email
`platform-26-security-sessions.html` (in project knowledge) is the authoritative design reference for hero, footer, and table-layout patterns. `five-star-tech-session.html` is a secondary structural reference that demonstrates the full three-table layout (header logo bar, white content card, gray footer), the 2×2 Numbered Outcome Grid, and the Pull Quote in context. The section patterns below define what goes between hero and footer — emails compose from them based on the brief.

---

# Section Pattern Library

Every email is composed from these patterns. Pick the patterns that fit the copy. If the brief doesn't call for a pattern, don't force it in.

**Every email always has these four:** Logo Bar (header), Hero Block, Greeting + Intro, Closing + Primary CTA + Footer. The middle of the email is where you compose.

---

## Pattern: Logo Bar (header)

**Use when:** every email. First thing in the stack, above the white content card.

**Visual:** Gray `#f2f2f2` background (same as body — it reads as part of the page, not the card). Single row, logo image aligned **left**, 175px wide (`max-width:160px` on mobile via `.logo-img`). Cell padding `8px 0` (vertical only — **zero horizontal padding** so the logo sits flush with the same left edge as the hero image and content card below it). The logo is a plain `<img>` (not linked unless the brief says so).

**Alignment rule:** The logo's left edge **must** match the hero image's left edge across all viewports. Both live in 680px-max-width tables centered in the gray body, so as long as the logo cell has no horizontal padding (and no `.mobile-padding` class that would re-introduce it on mobile), they align automatically. If you add side padding to the logo cell, mobile breaks first — the logo will appear pushed in while the hero still hugs the card edge.

**Do not:** apply `.mobile-padding` to the logo cell. Use a dedicated `.mobile-logo-pad` class set to `padding-left:0; padding-right:0` if you need a class hook, or just omit the class entirely.

Logo asset: `https://info.scalecomputing.com/l/46782/2026-05-22/9ncf6z/46782/1779485235Zbzzbthu/PRIMARY_horizontal_scale_logo_blue_grey_tm.png`

---

## Pattern: Hero Block — Banner With CTA Strip

**Use when:** every email. This is the standard hero.

**Visual:** Lives at the top of the white content card. Dark navy `#0a2540` background, 3px bright-blue `#1e88e5` accent bar on top (a 3px-high row), clickable banner image (`<a>` wrapping the `<img>`, image `width:100%; max-width:680px; height:auto`, class `fluid`), then a bright-blue `#1e88e5` strip beneath the banner with a short white uppercase CTA link.

**Measurements:**
- Accent bar row: `height:3px; line-height:3px; font-size:0; background:#1e88e5`
- Hero image cell: `padding:0; font-size:0; line-height:0; background:#0a2540`
- CTA strip cell: `padding:14px 35px` (class `mobile-padding`), `background:#1e88e5`
- CTA strip link: 13px, white, bold, uppercase, 1.5px letter-spacing, no underline. Arrow has a space before it: `Watch The Session &nbsp;&rarr;`

**Variants:**
- The CTA strip text changes per email ("Watch the Session," "Watch the Sessions," "RSVP Now," "See the Roadmap")
- The strip is omitted if there's no single primary destination above the fold

---

## Pattern: Greeting + Intro

**Use when:** every email, immediately after the hero.

**Visual:** White card, `Hi {{Recipient.FirstName}},` followed by 1–3 short paragraphs (15px / 24px line-height, near-black `#1a1a1a`, class `mobile-body dark-text`). Cell padding `35px` all sides (`mobile-padding`). Greeting paragraph has `margin:0 0 20px 0`; intermediate paragraphs `margin:0 0 16px 0`; last paragraph `margin:0`. Keep paragraphs tight — em-dashes are encouraged for rhythm.

---

## Pattern: Featured Keynote Callout (dark navy box)

**Use when:** the email leads with one marquee session, keynote, or customer story you want to spotlight. Usually paired with a downstream Linked Session List or Numbered Outcome Grid that expands on the marquee item.

**Triggers in the brief:**
- A single named keynote/session that anchors the email ("In this keynote, X presented Y")
- A featured customer story with a named hero ("Nathan Davidson from Five Star shares the blueprint")
- A standalone marquee video that needs hierarchy over follow-up content

**Visual:** Dark navy `#0a2540` **rounded box (`border-radius:8px`)** inside the white card. The card cell has `padding:0 35px` (so the navy box has gutters); the navy box's own inner cells supply the vertical rhythm. Centered. Contents top-to-bottom:
1. Sky-blue eyebrow `#7ec4ff`, uppercase, 2.5px letter-spacing, 12px — e.g. `THE KEYNOTE`, `THE CUSTOMER SESSION`, `THE FEATURED SESSION`. (Top cell padding ~`36px 32px 12px`.)
2. Large white headline in curly quotes (`&ldquo;…&rdquo;`), 26px / 32px, bold, centered, `letter-spacing:-0.3px`, class `mobile-h2`
3. Presenter line `#b8c5d6` — uppercase, 1px letter-spacing, 13px, bold — `Name &mdash; Title, Company`
4. Description paragraph `#dbe4f0`, centered, 15px / 24px
5. Bright-blue `#1e88e5` secondary CTA button — rounded 4px, ~240px wide, 44px tall, 12px uppercase label with 1.4px letter-spacing, MSO VML fallback. (Bottom cell padding ~`0 32px 36px`.)

**Don't:** stack two of these in one email. If you have two marquee items, one is the featured callout and the other becomes the lead item in a Linked Session List.

---

## Pattern: Section Header (eyebrow + H2 + lead-in)

**Use when:** introducing a cluster — a Linked Session List or a Numbered Outcome Grid. Not used standalone.

**Visual:** White card cell, `padding:35px 35px 8px` (`mobile-padding`). Three stacked elements:
1. Eyebrow — **bright blue `#1e88e5`** (note: section-header eyebrows are bright blue; outcome-*card* eyebrows are muted `#6e6e6e`), 11px, uppercase, 2.5px letter-spacing, bold, class `mobile-eyebrow`. `margin:0 0 8px`.
2. H2 — `#1a1a1a`, 24px / 30px, bold, `letter-spacing:-0.3px`, class `mobile-h2`. `margin:0 0 12px`.
3. Lead-in paragraph — body text 15px / 24px, `margin:0`.

---

## Pattern: Informational Card (grey box)

**Use when:** you want to set a block of explanatory or instructional prose apart as its own visual unit — content that is neither a clickable list (Linked Session List), a ranked set of points (Numbered Outcome Grid), nor an action callout (the navy boxes). It wraps what would otherwise be a Section Header (eyebrow + H2) plus its 1–4 body paragraphs in a tinted card, so the section reads as a distinct, self-contained passage without implying a CTA or a ranking.

**Triggers in the brief:**
- An "overview" / "about this report" explanatory section (e.g. `Report Overview`)
- A "how to use / how to leverage this" instructional section (e.g. `How to Leverage This Campaign`)
- Any prose section the brief wants visually grouped and lifted off the running body copy
- Often appears as a **pair** — an overview card followed immediately by a how-to card

**Visual:** A soft grey `#f1f0ee` rounded box (`border-radius:8px`) with a 1px `#e4e2dd` border, inside the white content card. Contents are the same three elements as a Section Header, with one deliberate change: the H2 is **navy `#0a2540`** instead of near-black. The navy heading ties the grey card back to the navy box family so it reads as part of the system, not a stray color.
1. Eyebrow — **bright blue `#1e88e5`**, 11px, uppercase, 2.5px letter-spacing, bold, class `mobile-eyebrow`. `margin:0 0 8px`.
2. H2 — **navy `#0a2540`**, 24px / 30px, bold, `letter-spacing:-0.3px`, class `mobile-h2`. `margin:0 0 12px`.
3. 1–4 body paragraphs — 15px / 24px, `#1a1a1a`, class `mobile-body dark-text`. Intermediate paragraphs `margin:0 0 16px 0`; the last paragraph `margin:0`.

**Measurements:**
- Outer gutter cell: class `card-outer`. Desktop side gutters `35px` (set inline); mobile `16px` (via `.card-outer`). This cell also carries the seam padding top/bottom (see Vertical rhythm). It does NOT also take `.mobile-padding`.
- Inner content cell: class `card-padding`. Desktop `padding:30px 34px`; mobile `padding:24px 22px` (via `.card-padding`).
- Box: set both `bgcolor="#f1f0ee"` (Outlook fallback) and `style="background:#f1f0ee; border:1px solid #e4e2dd; border-radius:8px;"`. Outlook ignores `border-radius` — square corners there are expected and fine.

**Vertical rhythm:** the card owns the gap *above* it — the cell above closes its bottom padding to `16px` (per the seam rule) and the card's `card-outer` top padding supplies the rest (`15px`, ≈31px total above). The card surrenders its own bottom padding (`0`); the pattern *below* owns that gap with its top padding. **To keep the gaps symmetric around a card or card-pair**, set the following pattern's top padding to `16px + the card-outer top padding` — e.g. card-outer top `15px` above → Closing Line top `31px` below. When two cards stack, the lower card's `card-outer` top padding is `20px`.

**Don't:** use it for clickable items (the grey + navy heading signals "read this," not "tap this" — use a Linked Session List). Don't use it for ranked points (use the Numbered Outcome Grid's `#f7f9fc` cards). Don't stand it directly against a navy box with no separating content — the two tints compete. Don't change the grey or border values per send; they're locked like every other token.

**Tint families (keep the three card colors meaningful):**
- **Navy `#0a2540`** = action / marquee — Featured Keynote Callout, Linked Action Tiles.
- **Soft blue-gray `#f7f9fc`** = structured data — Numbered Outcome Grid (ranked points), Save-the-Date Ticket (event facts), Signature Stat Ticket (hero stat).
- **Grey `#f1f0ee`** = explanatory prose grouped as a section — Informational Card.

**Per-send variables (structure is locked; these change per send):** the eyebrow label, the H2 text, and the body paragraphs. Everything else (grey, border, navy heading, paddings, classes) is fixed.

**Markup:**
```html
<!-- INFORMATIONAL CARD (grey box) -->
<tr>
  <td class="card-outer" style="padding:15px 35px 0;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f1f0ee" style="width:100%; background:#f1f0ee; border:1px solid #e4e2dd; border-radius:8px;">
      <tr>
        <td class="card-padding" style="padding:30px 34px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
          <p class="mobile-eyebrow" style="margin:0 0 8px; font-size:11px; line-height:14px; letter-spacing:2.5px; text-transform:uppercase; color:#1e88e5; font-weight:bold;">EYEBROW</p>
          <h2 class="mobile-h2" style="margin:0 0 12px; font-size:24px; line-height:30px; letter-spacing:-0.3px; color:#0a2540; font-weight:bold;">Heading</h2>
          <p class="mobile-body dark-text" style="margin:0; font-size:15px; line-height:24px; color:#1a1a1a;">Body copy…</p>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

Add these to the `@media only screen and (max-width:700px)` block:
```css
.card-outer { padding-left:16px !important; padding-right:16px !important; }
.card-padding { padding:24px 22px !important; }
```

**Why this exists:** the white card carries running body copy, the navy boxes carry actions, and the blue-gray cards carry structured lists — but an explanatory passage ("here's what the report covers," "here's how to run the campaign") had nowhere to live except as undifferentiated body text. The grey card gives that prose a container and a soft, neutral tint that's distinct from both the white body copy and the navy/blue-gray system while still reading as part of it (via the navy heading), so the reader's eye groups it as one section.

**Example:** `Q2-2026-GigaOm-Active-Partners.html` — the Report Overview and How to Leverage This Campaign sections.

---

## Pattern: Linked Session List

**Use when:** 2–5 separate sessions, each with its own video URL, that deserve roughly equal billing.

**Triggers in the brief:**
- Multiple session links the reader is supposed to click through to
- Phrases like "Three additional sessions provide..." or "Explore the dedicated breakouts..."

**Visual:** Each session is a row with a 3px bright-blue `#1e88e5` left border. Inside the border:
1. Eyebrow `#6e6e6e`, uppercase, 2px letter-spacing — used for either the session category ("Lessons from the Front Lines") or the presenter ("Andy Chen — Supermicro®")
2. H3 title-as-link in `#0a5db5` with a trailing `→`. No underline. (The arrow + blue color does the link signaling.)
3. Description paragraph in body text — 15px / 24px

**Cluster of these:** prefix with a section header (eyebrow + H2 + lead-in paragraph) introducing the cluster, e.g. `THE STRATEGIC BLUEPRINT / Three Critical Sessions for Sustained Resilience`.

**Don't:** use this pattern when the items aren't actually clickable. The trailing arrow + blue color = "tap me." For non-clickable lists, use the Numbered Outcome Grid.

---

## Pattern: Numbered Outcome Grid

**Use when:** 3–6 static talking points (pillars, benefits, outcomes, principles) that share a theme but **do not** have individual destination URLs.

**Triggers in the brief:**
- Bulleted lists of benefits introduced as "delivering:" or "you'll gain:"
- "Three things X tackles..." with no per-bullet links
- Anything formatted in the brief as `**Bold heading:** description` with no hyperlink

**Visual:** 2-column grid of soft-tinted cards (`#f7f9fc` background, 8px rounded corners). For 4 outcomes use 2×2. For 3 use 1 row of 3 or a 2+1 layout. For 6 use 2×3. Each column `td` is `width:50%` with class `col-stack split-img`/`split-text`; left card has `padding:0 8px 16px 0`, right card `padding:0 0 16px 8px` (8px gutter between, 16px below). Each card's inner cell is `padding:24px 22px 22px 22px`. Card contains:
1. Large bright-blue `#1e88e5` numeral (`01`, `02`, `03`…) — 32px / 32px, bold, letter-spacing -1px. `margin:0 0 10px`.
2. Eyebrow — **muted `#6e6e6e`** (not bright blue — that's reserved for section headers), uppercase, 2px letter-spacing, 11px, bold. `margin:0 0 6px`. Short category label ("Resilience," "Security").
3. H3 title in `#0a2540` navy, 18px / 24px bold (not a link, no arrow), class `mobile-h3`. `margin:0 0 8px`.
4. Description in body text, 14px / 22px (slightly tighter than the standard 15/24 so cards stay compact). `margin:0`.

**Mobile:** cards stack to single column via `.col-stack`, `.split-img`, `.split-text` classes.

**Stacked variant (full-width rows):** Use this *instead* of the grid when the three card descriptions vary noticeably in length (e.g., one card is 4 lines and another is 2). Side-by-side cards with mismatched copy fight every renderer's equal-height handling and waste time chasing a fix that doesn't render the same across clients. Stacked sidesteps the problem entirely.

Layout: each card is its own full-width `table` with `background:#f7f9fc; border-radius:8px`, separated by a 12px spacer row. Inside each card, a two-column row: left `<td width="40" style="padding:18px 0 18px 20px; width:40px;">` holds the numeral (30px / 30px bold blue, `letter-spacing:-1px`); right `<td style="padding:18px 20px 18px 0;">` holds the eyebrow / H3 / description with the same type ramp as the grid version, except the description bumps to 15px / 22px since the card is wider. Card height grows to fit its content — no fixed heights, no equal-height tricks.

**3-across mini-card variant (visual-first emails):** Use this *instead* of the full grid when the email is built visual-first (one-sentence intros, no lead-in paragraphs — e.g. the Uptime Optimization 2026 product emails) and all three items reduce to **a one-word label plus a single short line**. It drops the H3 title entirely — the uppercase label does the naming — so each card stays a compact three-element stack and the row reads as one glance.

Layout: one row of three equal columns (`width:33%` / `34%` / `33%`, classes `col-stack split-text`), gutters via per-cell padding (`0 5px 0 0` / `0 5px` / `0 0 0 5px`). Each card is a `#f7f9fc` rounded box (`border-radius:8px`) with inner cell `padding:22px 18px`. Card contents:
1. Numeral — bright blue `#1e88e5`, **28px / 28px** bold, `letter-spacing:-1px` (smaller than the full grid's 32px). `margin:0 0 8px`.
2. Label — muted `#6e6e6e`, 11px / 14px, uppercase, 2px letter-spacing, bold. `margin:0 0 6px`. One word ("Detect," "Resolve," "Scale").
3. Description — 14px / 21px, `#1a1a1a`, class `dark-text`. `margin:0`. **One line of copy** ("Automation finds problems in real time.").

The cell is `padding:8px 35px 0` directly under a Section Header. Mobile: cards stack via `.col-stack` / `.split-text`. The one-line constraint is the contract: if any description needs two sentences or a title, you've outgrown this variant — use the full grid or stacked form.

**Don't:** force the grid form when copy lengths differ. If card 1's description wraps to 4 lines and card 3 wraps to 2, the grid will look uneven no matter what CSS you throw at it. Either rewrite the copy so all cards have the same shape (same eyebrow length, same title line count, same description line count) or use the stacked variant. Don't add an H3 title to the mini-card variant (that's the full grid) or run mini cards with copy of visibly different lengths — at a third of the card width, even a few words' difference shows.

**Mini-card markup (3-across):**
```html
<!-- NUMBERED OUTCOME GRID (3-across mini cards) -->
<tr>
  <td class="mobile-padding" style="padding:8px 35px 0;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;">
      <tr>
        <!-- Mini card 01 -->
        <td class="col-stack split-text" width="33%" valign="top" style="width:33%; padding:0 5px 0 0;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; background:#f7f9fc; border-radius:8px;">
            <tr>
              <td style="padding:22px 18px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
                <p style="margin:0 0 8px; font-size:28px; line-height:28px; letter-spacing:-1px; color:#1e88e5; font-weight:bold;">01</p>
                <p style="margin:0 0 6px; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#6e6e6e; font-weight:bold;">LABEL</p>
                <p class="dark-text" style="margin:0; font-size:14px; line-height:21px; color:#1a1a1a;">ONE_LINE_DESCRIPTION</p>
              </td>
            </tr>
          </table>
        </td>
        <!-- Mini card 02 — same structure; width:34%, padding:0 5px -->
        <!-- Mini card 03 — same structure; width:33%, padding:0 0 0 5px -->
      </tr>
    </table>
  </td>
</tr>
```

**Why this exists:** to give static lists visual weight that a Linked Session List would falsely imply is clickable. The numerals carry the visual hierarchy that arrows carry elsewhere.

---

## Pattern: Save-the-Date Ticket (event logistics)

**Use when:** an event email needs to surface the practical logistics — dates, venue, and where to find us (booth/room) — as a single scannable unit. Built for pre-event invites, "visit us at booth X" sends, and save-the-dates. Use this for event facts, **not** the Numbered Outcome Grid: dates/venue/booth are *parallel facts*, not ranked outcomes, so numerals would imply a hierarchy they don't have.

**Triggers in the brief:**
- A "Key Event Information" block listing **Dates / Location / Booth (or Room)**
- `**Bold label:** value` lines for date, venue, and booth — no per-item links
- "Visit us at Booth #__," "Find us at __," "Stop by booth __"

**Placement:** Inside the white content card, in the body region. Introduce it with a Section Header (eyebrow + H2, e.g. `Key Event Information`). Sits between the intro and the Closing + Primary CTA. The cell is `padding:0 35px 16px` (`mobile-padding`) — the Section Header above owns the top spacing and the 16px bottom closes the seam before the closing line (per the vertical-rhythm rule).

**Visual:** A soft-tinted `#f7f9fc` rounded box (`border-radius:8px; overflow:hidden`) split into two columns — an event-pass motif:
1. **Date stub** (left, `width:200px`, class `ticket-stub`): solid navy `#0a2540`, centered. Top-to-bottom: month eyebrow sky-blue `#7ec4ff` (11px, uppercase, 3px letter-spacing, bold, `margin:0 0 6px`); day/day-range white `#ffffff` **40px / 40px bold**, `letter-spacing:-1px` (the visual anchor); year `#b8c5d6` 14px, 2px letter-spacing, bold (`margin:6px 0 0`).
2. **Perforation** — the details cell carries `border-left:2px dashed #cdd6e4`, reading as a ticket tear line.
3. **Details** (right, fills remaining width, class `ticket-details`, `valign:middle`, `padding:26px 28px`): label→value pairs. Location — muted `#6e6e6e` eyebrow (11px, uppercase, 2px letter-spacing, bold) + value navy `#0a2540` 15px / 21px bold (class `dark-text`, `margin:0 0 18px`). Find Us — same eyebrow + value in **bright blue `#1e88e5` 20px / 24px bold** (the booth number is the fact recipients scan for, so it gets the emphasis).

**Mobile (`max-width:700px`):** the columns stack via `.ticket-stub` / `.ticket-details` — the stub becomes a full-width navy band on top, details below, and the dashed divider flips from `border-left` to `border-top` (handled in the `.ticket-details` rule). Both classes must be in the media query:
```css
.ticket-stub { display:block !important; width:100% !important; padding:26px 18px !important; }
.ticket-details { display:block !important; width:100% !important; border-left:none !important; border-top:2px dashed #cdd6e4 !important; padding:24px 24px !important; }
```

**Per-campaign variables (structure is locked; these change per send):**
- `MONTH` — stub eyebrow (e.g. `June`)
- `DAY_RANGE` — the big stub number (e.g. `9–10`, or a single `9` for a one-day event)
- `YEAR` — stub year line
- `LOCATION_VALUE` — venue name(s); wraps gracefully, so long venues are fine
- `BOOTH_VALUE` — booth/room (e.g. `Booth 807`); the "Find Us" label can become "Room" / "Stage" / "Find Us" per event

**Don't:** put the booth number in the stub (the stub is dates only); add a third column; use it for non-event content; or stand it right beside a Featured Keynote Callout's navy box (two navy blocks compete — separate them with other content). No CTA inside the ticket — it's an information block; the primary action stays in the Closing + Primary CTA below.

**Markup:**
```html
<!-- SAVE-THE-DATE TICKET -->
<tr>
  <td class="mobile-padding" style="padding:0 35px 16px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; background:#f7f9fc; border-radius:8px; overflow:hidden;">
      <tr>
        <!-- DATE STUB -->
        <td class="ticket-stub" width="200" valign="middle" align="center" style="width:200px; background:#0a2540; padding:30px 18px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
          <p style="margin:0 0 6px; font-size:11px; line-height:14px; letter-spacing:3px; text-transform:uppercase; color:#7ec4ff; font-weight:bold;">MONTH</p>
          <p style="margin:0; font-size:40px; line-height:40px; letter-spacing:-1px; color:#ffffff; font-weight:bold;">DAY_RANGE</p>
          <p style="margin:6px 0 0; font-size:14px; line-height:16px; letter-spacing:2px; color:#b8c5d6; font-weight:bold;">YEAR</p>
        </td>
        <!-- DETAILS (dashed perforation on the left edge) -->
        <td class="ticket-details" valign="middle" style="padding:26px 28px; border-left:2px dashed #cdd6e4; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
          <p style="margin:0 0 4px; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#6e6e6e; font-weight:bold;">Location</p>
          <p class="dark-text" style="margin:0 0 18px; font-size:15px; line-height:21px; color:#0a2540; font-weight:bold;">LOCATION_VALUE</p>
          <p style="margin:0 0 4px; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#6e6e6e; font-weight:bold;">Find Us</p>
          <p style="margin:0; font-size:20px; line-height:24px; color:#1e88e5; font-weight:bold;">BOOTH_VALUE</p>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

**Fallback variant — Detail Card (multi-month or multi-day events):** the stub holds **one** date or a single same-month range. If the dates span months, or the email covers sessions across multiple days, the stub stops reading as a clean calendar block — drop it and use the Detail Card: the same `#f7f9fc` rounded box with a 4px bright-blue `#1e88e5` left accent bar and stacked label→value rows (Dates / Location / Find Us) separated by hairline `#e5e5e5` dividers. Same eyebrow/value type ramp as the Ticket's details column; rows are already single-column, so no stacking classes are needed.
```html
<!-- EVENT DETAILS — Detail Card (fallback for multi-month / multi-day) -->
<tr>
  <td class="mobile-padding" style="padding:0 35px 16px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; background:#f7f9fc; border-radius:8px; overflow:hidden;">
      <tr>
        <td width="4" style="width:4px; background:#1e88e5; font-size:0; line-height:0;">&nbsp;</td>
        <td style="padding:6px 26px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
            <tr><td style="padding:18px 0;">
              <p style="margin:0 0 5px; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#6e6e6e; font-weight:bold;">Dates</p>
              <p class="dark-text" style="margin:0; font-size:16px; line-height:22px; color:#0a2540; font-weight:bold;">DATES_VALUE</p>
            </td></tr>
            <tr><td style="padding:18px 0; border-top:1px solid #e5e5e5;">
              <p style="margin:0 0 5px; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#6e6e6e; font-weight:bold;">Location</p>
              <p class="dark-text" style="margin:0; font-size:16px; line-height:22px; color:#0a2540; font-weight:bold;">LOCATION_VALUE</p>
            </td></tr>
            <tr><td style="padding:18px 0; border-top:1px solid #e5e5e5;">
              <p style="margin:0 0 5px; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#6e6e6e; font-weight:bold;">Find Us</p>
              <p class="dark-text" style="margin:0; font-size:16px; line-height:22px; color:#0a2540; font-weight:bold;">BOOTH_VALUE</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

**Why this exists:** event logistics are parallel facts, and the ticket motif gives the date real presence while keeping venue and booth scannable — building anticipation in a way a flat list can't, without depending on image assets. (Icons are an opt-in-per-send enhancement only, never baked in — a missing icon would break the layout.)

---

## Pattern: Signature Stat Ticket (hero stat + payoff)

**Use when:** a product or campaign email has **one signature number** worth anchoring the pitch on — a savings figure, a capability ceiling, a service level — paired with a single sentence explaining the payoff. The Save-the-Date Ticket's shell repurposed for product emails: navy stub carries the stat instead of a date, details column carries one bold payoff line instead of venue/booth. First used: Uptime Optimization 2026 product emails.

**Triggers in the brief:**
- One standout figure framed as the takeaway ("save 25%+," "up to 20Gbps," "24/7 support")
- A stat + one-sentence benefit with no per-item links
- Visual-first direction where a paragraph of proof points should compress to one number

**Placement:** Inside the white content card, in the body region — typically directly after a Numbered Outcome Grid (cell `padding:16px 35px 0`, closing the section the grid opened) and before the Closing + Primary CTA. It contains a navy stub, so treat it like a navy moment: don't stand it beside another navy box.

**Visual:** Identical shell to the Save-the-Date Ticket — `#f7f9fc` rounded box (`border-radius:8px; overflow:hidden`), 200px navy `#0a2540` stub (class `ticket-stub`), dashed `#cdd6e4` perforation, details cell (class `ticket-details`); same mobile stacking rules (both classes in the media query, divider flips `border-left` → `border-top`). Contents differ:
1. **Stat stub** (centered): framing eyebrow sky-blue `#7ec4ff` (11px, uppercase, 3px letter-spacing, bold, `margin:0 0 6px` — e.g. `Save` / `Up To` / `Always On`); the **stat** white `#ffffff` 40px / 40px bold, `letter-spacing:-1px` (e.g. `25%+`, `20Gbps`, `24/7` — short enough to fit the 200px stub on one line); qualifier `#b8c5d6` 14px / 16px, 2px letter-spacing, uppercase, bold (`margin:6px 0 0` — e.g. `VS LEGACY`, `BANDWIDTH`).
2. **Payoff** (details cell, `valign:middle`, `padding:26px 28px`): one label→value pair only — eyebrow `The Payoff` muted `#6e6e6e` (11px, uppercase, 2px letter-spacing, bold, `margin:0 0 4px`) + a single bold navy `#0a2540` sentence, 15px / 22px, class `dark-text`.

**Per-campaign variables (structure is locked; these change per send):**
- `STAT_EYEBROW` — the framing word(s) above the stat
- `STAT` — the signature figure (keep it to ~6 characters; if it wraps in the stub it's not a stub stat)
- `STAT_QUALIFIER` — the context line under the stat
- `PAYOFF` — the one-sentence value statement (the `The Payoff` label is locked)

**Don't:** stack multiple label→value rows in the details cell (that's the Save-the-Date Ticket's job — this is one stat, one sentence); put a CTA inside (the primary action stays in Closing + Primary CTA); use a stat too long for the stub; use it twice in one email (it's the *signature* stat); or place it beside another navy box.

**Markup:**
```html
<!-- SIGNATURE STAT TICKET -->
<tr>
  <td class="mobile-padding" style="padding:16px 35px 0;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; background:#f7f9fc; border-radius:8px; overflow:hidden;">
      <tr>
        <!-- STAT STUB -->
        <td class="ticket-stub" width="200" valign="middle" align="center" style="width:200px; background:#0a2540; padding:30px 18px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
          <p style="margin:0 0 6px; font-size:11px; line-height:14px; letter-spacing:3px; text-transform:uppercase; color:#7ec4ff; font-weight:bold;">STAT_EYEBROW</p>
          <p style="margin:0; font-size:40px; line-height:40px; letter-spacing:-1px; color:#ffffff; font-weight:bold;">STAT</p>
          <p style="margin:6px 0 0; font-size:14px; line-height:16px; letter-spacing:2px; color:#b8c5d6; font-weight:bold;">STAT_QUALIFIER</p>
        </td>
        <!-- DETAILS (dashed perforation on the left edge) -->
        <td class="ticket-details" valign="middle" style="padding:26px 28px; border-left:2px dashed #cdd6e4; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
          <p style="margin:0 0 4px; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#6e6e6e; font-weight:bold;">The Payoff</p>
          <p class="dark-text" style="margin:0; font-size:15px; line-height:22px; color:#0a2540; font-weight:bold;">PAYOFF</p>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

**Current defaults (Uptime Optimization 2026 sends):** HyperCore = `Save` / `25%+` / `VS LEGACY`; Connect = `Up To` / `20Gbps` / `BANDWIDTH`; AcuVigil = `Always On` / `24/7` / `EXPERT SUPPORT` — each with a one-sentence payoff.

**Why this exists:** one big number on the ticket motif carries more proof than a paragraph of claims, and it reuses the locked ticket shell (classes, mobile rules) rather than inventing a new surface.

---

## Pattern: Linked Action Tiles

**Use when:** the email has two roughly equal-weight CTAs that don't fit a single primary-button model — e.g., "Schedule a demo" *and* "Learn more about solutions" where neither is clearly subordinate. Replaces the Closing Line + Primary CTA when there's no single primary action.

**Triggers in the brief:**
- Two separate CTAs listed with comparable phrasing, neither marked as primary
- A "next step" + a "resource" CTA appearing as a pair
- Any post-event or post-content email offering both a meeting and a self-serve path

**Visual:** 2-column row of **dark navy `#0a2540`** cards (inverted from the light Numbered Outcome Grid tiles to signal action). Each column `td` is `width:50%`; left card has `padding:0 8px 16px 0`, right card `padding:0 0 16px 8px`. Inner cell `padding:24px 22px 22px 22px`. Card contains:
1. Eyebrow — **sky-blue `#7ec4ff`** (the on-navy eyebrow color from Featured Keynote Callout), uppercase, 2px letter-spacing, 11px, bold. `margin:0 0 8px`. Short category label ("See It In Action," "Explore More").
2. H3 title wrapping the link — white text, 18px / 24px bold, `text-decoration:none`, class `mobile-h3`. The link `<a>` is the title itself, ending with a trailing arrow wrapped in `<span style="color:#1e88e5;">&rarr;</span>` so the arrow pops in bright blue against the navy. `margin:0`.

**Mobile:** cards stack to single column via `.col-stack`, `.split-img`, `.split-text` classes.

**Don't:** mix with a Primary CTA button in the same email. The whole point of Linked Action Tiles is that there isn't one primary action — adding a button reintroduces hierarchy and contradicts the choice. If there's a primary action, use Closing Line + Primary CTA and demote the second CTA to an inline link in the closing paragraph.

**Don't:** use more than two tiles. Three becomes a navigation menu, not a closing call to action.

---

## Pattern: Pull Quote

**Use when:** a customer, analyst, or executive quote that earns a moment of breathing room — usually after the main content blocks, before the closing CTA.

**Triggers in the brief:**
- A formatted quote block with attribution ("...quote...")  — Name, Title, Company
- "X said:" / "According to Y:"

**Visual:** Hairline `#e5e5e5` divider above the quote (a `border-top:1px solid #e5e5e5` on its own cell, `padding:36px 35px 0`). Then the quote in its own cell (`padding:28px 35px 0`): navy `#0a2540`, 20px / 30px, **bold italic**, in curly quotes, left-aligned, `margin:0 0 16px`. Below it: attribution in muted `#6e6e6e`, 12px / 16px, uppercase, 1.5px letter-spacing, bold — `Name &mdash; Title, Company`, `margin:0`.

**Don't:** stack multiple pull quotes. One per email max.

---

## Pattern: Closing Line + Primary CTA

**Use when:** every email, immediately before the footer.

**Visual:** One short closing paragraph in body text (`padding:36px 35px 0`, `margin:0`) — frames the action, doesn't repeat what's already said. Then the primary CTA button in its own centered cell (`padding:28px 35px 35px`):
- Background `#0a5db5`, white text, 4px rounded, 48px tall
- Label: 13px, uppercase, bold, 1.5px letter-spacing — `WATCH THE SESSIONS &rarr;`
- Button width 280–300px on desktop (300px is the reference value), full-width on mobile via `.cta-button-primary`
- MSO VML `<v:roundrect arcsize="8%">` fallback wrapped in conditional comments; non-MSO `<a>` uses `line-height:48px` for vertical centering

---

## Pattern: Footer

**Use when:** every email. This is standard and shouldn't vary. The footer is its own 680px table on the gray `#f2f2f2` background, BELOW and outside the white card. **No logo in the footer** — the logo lives in the header bar above the card.

**Order, top to bottom (all 12px / 16px, muted `#6e6e6e`, centered, `mobile-padding` on padded cells):**

1. **Copyright + trademark line** (one paragraph):
   > © 2026 Scale Computing, Inc. All rights reserved. Scale Computing and other Scale Computing marks are trademarks of Scale Computing, Inc. All other trademarks are the property of their respective owners. Information on Scale Computing patents and trademarks is available at [www.scalecomputing.com/legal](https://www.scalecomputing.com/legal).
2. **Social icon row** — Facebook, X, LinkedIn, YouTube (28×28, gray `#b8bcc2`), each in a `td` with `padding:0 8px`, centered.
3. **Address block** — three stacked centered paragraphs: `Scale Computing` / `3307 Northland Dr, Suite 500` / `Austin, TX 78731`.
4. **Contact | Privacy** — `Contact Us` &nbsp;|&nbsp; `Privacy Policy`, both underlined in `#6e6e6e`.
5. **Unsubscribe line** (full sentence, not a bare link):
   > If you wish to unsubscribe or update your email preferences, [click here]({{unsubscribe}})

   The `href` is the Pardot token `{{unsubscribe}}` (link text is "click here").

---

# How to compose an email

When building a new email, walk the brief and ask:

1. **What's the marquee item?** If there is one, use the Featured Keynote Callout. If everything is equally weighted, skip the callout and go straight to a Linked Session List.
2. **Are the secondary items linked or static?** Linked → Linked Session List. Static → Numbered Outcome Grid.
3. **For a Numbered Outcome Grid: do all items have the same copy shape?** Same eyebrow length, same title line count, same description line count. If yes → grid form (3-across or 2×2). If no → stacked variant. Don't try to force a side-by-side grid with mismatched copy — equal-height handling differs across email clients and you'll waste rounds chasing a fix that doesn't render the same everywhere.
4. **Is there a quote worth surfacing?** If yes, drop in a Pull Quote between the main content and the closing CTA.
5. **How many primary actions?** One URL → Closing Line + Primary CTA. Two roughly equal CTAs with no clear primary → Linked Action Tiles instead. Don't combine a Primary CTA button with Linked Action Tiles in the same email.
6. **Is there a "Key Event Information" block (dates / venue / booth)?** Use the Save-the-Date Ticket — never a Numbered Outcome Grid (numerals imply a ranking these parallel facts don't have). Single date or same-month range → Ticket with the date stub. Dates spanning months, or sessions across multiple days → the Detail Card fallback variant.
7. **Is there an explanatory or instructional prose section to set apart** (a report overview, a "how to use / leverage this" passage)? Wrap it in an Informational Card (grey box) rather than leaving it as undifferentiated body text. These often come as a pair (overview + how-to).

Typical compositions:

- **One marquee session + 2–4 follow-up videos:** Hero → Intro → Featured Keynote Callout → Section Header → Linked Session List → Closing + CTA  *(Security Sessions, Edge AI)*
- **One customer story with bullet-list outcomes + a customer quote:** Hero → Intro → Featured Keynote Callout → Section Header → Numbered Outcome Grid → Pull Quote → Closing + CTA  *(Five Star)*
- **2–3 equally-weighted sessions, no marquee:** Hero → Intro → Section Header → Linked Session List → Closing + CTA  *(Networking)*
- **Single session, no breakouts:** Hero → Intro → Featured Keynote Callout → Closing + CTA  *(Bill Morrow Keynote, Lenovo/VMware Alt, GigaOm Keynote)*
- **Post-event follow-up with benefits + two equal CTAs:** Hero (image only, no CTA strip) → Greeting + Intro → Section Header → Numbered Outcome Grid (stacked) → Closing line → Linked Action Tiles  *(ePlus Transform)*
- **Pre-event / "visit our booth" invite:** Hero (image only, no CTA strip) → Greeting + Intro → Section Header → Save-the-Date Ticket → Closing line (+ Primary CTA only if the brief supplies a destination)  *(Southwest Fuel & Convenience Expo)*
- **Partner / channel campaign with an overview + a how-to:** Hero → Greeting + Intro → Informational Card (overview) → Informational Card (how-to) → Closing + Primary CTA  *(GigaOm Radar — Active Partners)*

If the brief doesn't fit any of these, ask before inventing a new pattern.
