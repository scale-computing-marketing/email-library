# Scale Computing Email — Reusable Content Blocks

## What this file is

A library of **reusable content blocks** that drop into the white content card of any Scale Computing email. These are the recurring sections you reach for across campaigns (standing offers, CTA treatments, content modules) — the Claude-native equivalent of the saved sections previously kept in BeePro.

**Relationship to `house-style.md`:** `house-style.md` is the *locked design system* — how every email is built (layout, colors, typography, paddings, the core Section Pattern Library). This file is the *content block library* — standing blocks with copy/offers/images that rotate more often than the design system does. Keeping them separate means updating a promo's copy never risks touching the locked spec.

**How to use in a chat:** attach this file alongside `house-style.md`, then compose by name — e.g. "after the primary CTA, include the **VMware Alternative Offer** block." Each block below specifies where it belongs in the email and which values change per campaign.

---

## Conventions (read before adding or building a block)

Every block in this file is rendered to match `house-style.md` exactly — same class names (`mobile-padding`, `fluid`, `mobile-h2`, `cta-button-primary`, etc.), same color tokens, same MSO VML button fallbacks, same 35px/24px padding rhythm. Blocks built here are NOT BeePro exports; they are rebuilt to conform to the locked spec so the whole library stays visually consistent with the reference emails.

Each block entry follows this template:

- **Use when** — the brief signal that calls for it
- **Triggers in the brief** — phrases/structures that map to this block
- **Placement** — where it sits in the email (which patterns it follows/precedes)
- **Visual** — the locked structure, top to bottom
- **Per-campaign variables** — the values that change per send (everything else is locked)
- **Don't** — common misuses
- **Markup** — paste-ready HTML row(s) with variables marked
- **Current defaults** — the live values for the most recent send

---

## Index

| # | Block | Type | Status |
|---|-------|------|--------|
| 1 | VMware Alternative Offer | Promo / Offer | ✅ Built |
| 2 | Media + Text Row (image + headline/body/link) | Content | ✅ Built — image URLs/links pending |
| 3 | Media + Text Row — Navy Spotlight (variant) | Content | ✅ Built |
| 4 | Gartner Review Block (navy reward card) | CTA | ✅ Built |
| 5 | Full Stack Cross-Promo (3 layer bars) | CTA | ✅ Built |
| 6 | Layer-Strip Hero (designed HTML hero) | Structural / Hero | ✅ Built |
| 7 | _(next block)_ | — | ⬜ To build |
| … | | | |

> Build backlog: 9+ blocks to migrate from BeePro. Hand them to Claude one at a time — paste the BeePro HTML or describe the block, and it'll be rebuilt in house-style format and added below.

## Approved color tokens (extends house-style.md palette)

These are the ONLY colors approved for the content-block library beyond the locked `house-style.md` palette:

- **Magenta accent `#9c2e91`** — an approved link/CTA accent for content blocks. Use is **case-by-case, specified per send** (not a default). Blue `#0a5db5` remains the standard link color; magenta is the deliberate exception when a campaign calls for it. When in doubt, use blue.
- **Ice blue `#7ec4ff` and slate `#b8c5d6`** — navy-surface accents locked to the Layer-Strip Hero and Full Stack Cross-Promo blocks only (eyebrows/numbers on `#0a2540`, unlit strip segments and labels). Not general-purpose tokens; don't use them outside those two blocks.

---

# Promo / Offer blocks

## Block: VMware Alternative Offer (dark navy box, secondary)

**Use when:** a post-event or nurture email needs a standing secondary offer beneath the primary CTA — the recurring VMware-alternative promo with an incentive image. Always sits AFTER the primary CTA, never above it (it is secondary by definition).

**Triggers in the brief:**
- A "Secondary CTA Section" calling out the VMware alternative / migration offer
- An incentive image (e.g. gift card) paired with a "Book Your Meeting" action
- Phrases like "Looking for a new way to virtualize?" / "cost-effective, hassle-free VMware alternative"

**Placement:** Inside the white content card, AFTER the primary CTA (Closing Line + Primary CTA), typically the last block before the footer.

**Visual:** Dark navy `#0a2540` **rounded box (`border-radius:8px`)** — same shell as the Featured Keynote Callout — inside the white card. The card cell has `padding:0 35px 35px` (gutters + bottom rhythm since it's usually the last block before the footer); the navy box's own inner cells supply the vertical rhythm. Centered. Contents top-to-bottom:
1. Incentive image — linked (`<a>` wrapping the `<img>`), centered, ~240px wide, `border-radius:6px`, class `fluid`. (Top cell padding ~`28px 32px 0`.) Links to the offer landing page.
2. White headline, 26px / 32px, bold, centered, `letter-spacing:-0.3px`, class `mobile-h2`. (Cell padding ~`24px 32px 0`.)
3. Description paragraph `#dbe4f0`, centered, 15px / 24px. (Cell padding ~`16px 32px 0`.)
4. Bright-blue `#1e88e5` secondary CTA button — rounded 4px, ~260px wide, 44px tall, 12px uppercase label with 1.4px letter-spacing, MSO VML fallback. (Bottom cell padding ~`24px 32px 36px`.) Links to the same landing page as the image.

**Per-campaign variables (structure is locked; these change per send):**
- `IMAGE_URL` — the incentive image (e.g. gift card asset)
- `LANDING_URL` — destination for both the image and the button
- `HEADLINE` — e.g. `Looking for a new way to virtualize?`
- `BODY` — the offer description
- `BUTTON_LABEL` — e.g. `BOOK YOUR MEETING NOW &rArr;`

**Don't:** place this above the primary CTA; give it a sky-blue eyebrow (that's the Featured Keynote Callout's marker — this block leads with the image instead); or stack it with a Featured Keynote Callout in the same email (two navy boxes compete).

**Markup:**
```html
<!-- SECONDARY: VMware Alternative Offer (navy box) with linked incentive image -->
<tr>
  <td class="mobile-padding" style="padding:0 35px 35px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; background:#0a2540; border-radius:8px;">
      <tr>
        <td style="padding:28px 32px 0;" align="center">
          <a href="LANDING_URL" target="_blank" style="text-decoration:none;">
            <img src="IMAGE_URL" alt="Offer" width="240" class="fluid" style="width:240px; max-width:100%; height:auto; display:block; margin:0 auto; border-radius:6px;" />
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px 0; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;" align="center">
          <p class="mobile-h2" style="margin:0; font-size:26px; line-height:32px; letter-spacing:-0.3px; color:#ffffff; font-weight:bold;">HEADLINE</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px 0; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;" align="center">
          <p style="margin:0; font-size:15px; line-height:24px; color:#dbe4f0;">BODY</p>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px 36px;" align="center">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="LANDING_URL" style="height:44px;v-text-anchor:middle;width:260px;" arcsize="9%" strokecolor="#1e88e5" fillcolor="#1e88e5">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:'Trebuchet MS',Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;">BUTTON_LABEL</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-- -->
          <a href="LANDING_URL" target="_blank" style="display:inline-block; width:260px; max-width:260px; background:#1e88e5; color:#ffffff; font-family:'Trebuchet MS',Arial,sans-serif; font-size:12px; line-height:44px; font-weight:bold; letter-spacing:1.4px; text-transform:uppercase; text-align:center; text-decoration:none; border-radius:4px;">BUTTON_LABEL</a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
  </td>
</tr>
```

**Current defaults (NCLGISA 2026 send):**
- `IMAGE_URL` = `https://info.scalecomputing.com/l/46782/2025-03-31/9g9kgb/46782/17434308349ZLLs5em/Amazon_gift_card.png`
- `LANDING_URL` = `https://www.scalecomputing.com/landing-pages/vmware-alternative-break-free-of-complexity`
- `HEADLINE` = `Looking for a new way to virtualize?`
- `BODY` = `Upgrade your infrastructure with a cost-effective, hassle-free VMware alternative. Scale Computing offers a future-proof alternative with a seamless, stress-free migration.`
- `BUTTON_LABEL` = `BOOK YOUR MEETING NOW &rArr;`

---

# CTA blocks

## Block: Gartner Review Block (navy reward card)

**Use when:** an email asks customers to leave a peer review on a third-party review site (Gartner&reg;, and by extension G2, PeerSpot, etc.), usually with an incentive. Presents the ask as a single dark "reward card" with one tappable tile per review category, so a reader can pick whichever categories apply to them. Built for customer / advocacy sends, not prospects.

**Triggers in the brief:**
- A "leave a review" / "share your experience" ask tied to a review site (Gartner&reg; Peer Insights, etc.)
- An incentive or reward (gift card, "Earn up to $X") attached to completing reviews
- Two or more review **categories** the reader can choose between (e.g. Hyper Converged Infrastructure / Integrated Systems / Server Virtualization), each with its own deep link
- Language like "review us in one, two, or all three categories"

**Placement:** Inside the white content card, in the body region or as the closing ask before the footer. It is a navy box, so — like the VMware Alternative Offer, Featured Keynote Callout, and Navy Spotlight — **don't stack it with another navy box in the same email** (two navy boxes compete). One navy moment per email.

**Visual:** Dark navy `#0a2540` **rounded box (`border-radius:8px`, `overflow:hidden`)** inside the white card, centered. Card cell `padding:35px` (`mobile-padding`). Top-to-bottom:
1. **Top accent bar** — a 3px `#1e88e5` strip flush to the top of the rounded box (full width).
2. **Inner content cell** — `padding:36px 30px 36px`, centered.
3. **Reward badge** (optional) — a pill, bg `#1e88e5`, `border-radius:999px`, `padding:8px 20px`, 13px uppercase white label with 1px letter-spacing, bold. `margin:0 auto 18px`. Omit if there's no incentive.
4. **Eyebrow** — sky blue `#5aa9ff`, 11px, `letter-spacing:2.5px`, uppercase, bold, class `mobile-eyebrow`. `margin:0 0 10px`.
5. **Headline** — white `#ffffff`, 24px / 30px, bold, `letter-spacing:-0.3px`, class `mobile-h2`. `margin:0 0 12px`. Trademark marks render as `<sup style="font-size:60%; line-height:0;">`.
6. **Body** — `#c7d2dd`, 15px / 24px, class `mobile-body` (NOT `dark-text` — that forces `#1a1a1a` in dark mode, illegible on navy). `margin:0 0 26px`.
7. **Review category tiles** — one per category, stacked, 12px spacer between. Each tile: a full-width cell, bg `#102f52`, `border-left:3px solid #1e88e5`, `border-radius:4px`; the whole tile is a single block-level link (`display:block`, `padding:15px 18px`), 17px / 22px bold white, **left-aligned**, class `mobile-h3`, with a trailing sky-blue `#5aa9ff` arrow `&rarr;` in a `<span>`. Each tile links to that category's review URL.

On mobile the card cell drops to 24px sides (`mobile-padding`); the eyebrow/headline/body/tiles inherit their mobile type-ramp classes.

**Per-campaign variables (structure is locked; these change per send):**
- `REWARD_LABEL` — e.g. `Earn up to $75` (omit the whole badge if there's no reward)
- `EYEBROW` — e.g. `Share Your Experience`
- `HEADLINE` — e.g. `Review Scale Computing on Gartner&reg;!`
- `BODY` — the framing sentence
- `REVIEW_TILES` — a repeating list of `{ LABEL, URL }`, typically 1–3. Add/remove `<tr>` tile blocks to match the number of categories.

**Don't:** leave the headline/body in dark colors (illegible on navy); use `dark-text` on the body; stack it with another navy box in the same email; center the tile labels (they're left-aligned with a trailing arrow); or send it to prospects (this is a customer/advocacy ask).

**Markup (3 category tiles shown; add or remove tile `<table>` blocks + their 12px spacers to change the count):**
```html
<!-- CTA: Gartner Review Block (navy reward card) -->
<tr>
  <td class="mobile-padding" style="padding:35px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; background:#0a2540; border-radius:8px; overflow:hidden;">
      <!-- top accent bar -->
      <tr>
        <td style="height:3px; line-height:3px; font-size:0; background:#1e88e5;">&nbsp;</td>
      </tr>
      <tr>
        <td style="padding:36px 30px 36px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; text-align:center;">

          <!-- reward badge (optional) -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 18px;">
            <tr>
              <td style="background:#1e88e5; border-radius:999px; padding:8px 20px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:13px; line-height:16px; letter-spacing:1px; font-weight:bold; color:#ffffff; text-transform:uppercase;">REWARD_LABEL</td>
            </tr>
          </table>

          <p class="mobile-eyebrow" style="margin:0 0 10px; font-size:11px; line-height:14px; letter-spacing:2.5px; text-transform:uppercase; color:#5aa9ff; font-weight:bold;">EYEBROW</p>
          <h2 class="mobile-h2" style="margin:0 0 12px; font-size:24px; line-height:30px; letter-spacing:-0.3px; color:#ffffff; font-weight:bold;">HEADLINE</h2>
          <p class="mobile-body" style="margin:0 0 26px; font-size:15px; line-height:24px; color:#c7d2dd;">BODY</p>

          <!-- Review tile (repeat per category; 12px spacer between) -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;">
            <tr>
              <td style="background:#102f52; border-left:3px solid #1e88e5; border-radius:4px;">
                <a href="TILE_URL" target="_blank" class="mobile-h3" style="display:block; padding:15px 18px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:17px; line-height:22px; font-weight:bold; color:#ffffff; text-decoration:none; text-align:left;">TILE_LABEL <span style="color:#5aa9ff;">&rarr;</span></a>
              </td>
            </tr>
          </table>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="height:12px; line-height:12px; font-size:0;">&nbsp;</td></tr></table>
          <!-- ...repeat tile + spacer for each remaining category (drop the final spacer)... -->

        </td>
      </tr>
    </table>
  </td>
</tr>
```

**Current defaults (Q2-2026 GigaOm&reg; Radar — customers send):**
- `REWARD_LABEL` = `Earn up to $75`
- `EYEBROW` = `Share Your Experience`
- `HEADLINE` = `Review Scale Computing on Gartner&reg;!`
- `BODY` = `Technology review sites like Gartner&reg; are paramount sources of information for IT decision-makers. Share your anonymous review of Scale Computing&trade; in one, two, or all three categories:`
- `REVIEW_TILES`:
  - `Hyper Converged Infrastructure` &rarr; `https://gtnr.io/saDTrAjMA`
  - `Integrated Systems` &rarr; `https://gtnr.io/bIeELmBQj`
  - `Server Virtualization` &rarr; `https://gtnr.io/9rZQPkzlo`

---

## Block: Full Stack Cross-Promo (3 layer bars)

**Use when:** a campaign email must cross-promote **all three products as both callouts and CTAs** — SC//HyperCore&trade; (Compute + Virtualization), SC//Connect&trade; (Network), SC//AcuVigil&trade; (Visibility + Security). Three stacked full-width "layer bars," each a tappable product CTA; in a product-specific email the layer that email covers is **lit bright blue with a "You're Here" tag**. Built for the standing directive that every campaign email carries all three products (first used: Uptime Optimization 2026).

**Triggers in the brief:**
- A campaign rule like "every email must include all three products / equal CTAs for each"
- A product-line email inside a stack- or layer-framed campaign
- "You're Here" / "one platform, three ways in" cross-promo language

**Placement:** Inside the white content card. In a product email: AFTER the primary CTA, last block before the footer, opened by a **hairline top divider** (`border-top:1px solid #e5e5e5`) above its section header. In an overview/platform email: mid-body (e.g. after an Informational Card), no divider, **all three bars navy** (no lit bar — the hero's layer strip lights all segments instead, see Layer-Strip Hero). This module is the email's **navy moment** — don't pair it with the VMware Alternative Offer, Gartner Review Block, Navy Spotlight, or Featured Keynote Callout in the same email.

**Visual:** Section header, then three bars:
1. **Section header** — eyebrow `The Full Stack` (11px, `letter-spacing:2.5px`, uppercase, `#1e88e5`, bold, class `mobile-eyebrow`) + H2 `One Platform. Three Ways In.` (24px / 30px, `letter-spacing:-0.3px`, `#1a1a1a`, bold, classes `mobile-h2 dark-text`). Header copy is locked.
2. **Three layer bars**, stacked with 10px spacer tables, each a full-width table, `border-radius:8px`, two cells:
   - Number cell — `width:48px`, `padding:16px 0 16px 20px`, 26px / 26px bold, `letter-spacing:-1px` (`01` / `02` / `03`).
   - Text cell — `padding:16px 18px 16px 12px`: layer label (11px, `letter-spacing:2px`, uppercase, bold) over the product title (18px / 24px bold, class `mobile-h3`) — the title is a block link wrapping product name + one-line descriptor + trailing arrow `<span>`.
   - **Unlit bar** (default): bg `#0a2540` (+ matching `bgcolor` attr), number and label `#7ec4ff`, title white, arrow `#1e88e5`.
   - **Lit bar** (the email's own layer): bg `#1e88e5`, number white, label `#dbe4f0` with ` &nbsp;&middot;&nbsp; <span style="color:#ffffff;">You&rsquo;re Here</span>` appended, title white, arrow `#0a2540`.

**Variants (set per instance):**
- `LIT_LAYER` — `01`, `02`, `03`, or `none` (overview/platform email: all bars navy)
- Divider header (product email, after primary CTA) vs. plain header (overview email, mid-body)

**Per-campaign variables:** none in the bars themselves — layer numbers, layer names, product names, descriptors, and URLs are the standing product set (defaults below). The bars' order is fixed: 01 Compute + Virtualization, 02 Network, 03 Visibility + Security.

**Don't:** light more than one bar; reorder or renumber the layers; drop a product to make room (the whole point is all three); use `#0a5db5` for links on navy (illegible — arrows are `#1e88e5` on navy, `#0a2540` on the lit bar); light a bar that disagrees with the hero's lit strip segment; or stack this with another navy-box block.

**Markup (product email shown: divider header + layer 01 lit; for layers 02/03 move the lit treatment to that bar; for the overview variant use the plain header and make all three bars the unlit pattern):**
```html
<!-- ============ THE FULL STACK (every email carries all three layers; -->
<!-- the layer this email covers is lit bright blue) ============ -->
<tr>
  <td class="mobile-padding" style="padding:28px 35px 10px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; border-top:1px solid #e5e5e5;">
      <tr><td style="padding:24px 0 0;">
        <p class="mobile-eyebrow" style="margin:0 0 6px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:11px; line-height:14px; letter-spacing:2.5px; text-transform:uppercase; color:#1e88e5; font-weight:bold;">The Full Stack</p>
        <h2 class="mobile-h2 dark-text" style="margin:0; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:24px; line-height:30px; letter-spacing:-0.3px; color:#1a1a1a; font-weight:bold;">One Platform. Three Ways In.</h2>
      </td></tr>
    </table>
  </td>
</tr>
<tr>
  <td class="mobile-padding" style="padding:6px 35px 35px;">

    <!-- Layer 01 — COMPUTE + VIRTUALIZATION (this email: lit) -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#1e88e5" style="width:100%; background:#1e88e5; border-radius:8px;">
      <tr>
        <td width="48" valign="middle" style="width:48px; padding:16px 0 16px 20px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:26px; line-height:26px; letter-spacing:-1px; color:#ffffff; font-weight:bold;">01</td>
        <td valign="middle" style="padding:16px 18px 16px 12px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
          <p style="margin:0 0 4px; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#dbe4f0; font-weight:bold;">Compute + Virtualization &nbsp;&middot;&nbsp; <span style="color:#ffffff;">You&rsquo;re Here</span></p>
          <h3 class="mobile-h3" style="margin:0; font-size:18px; line-height:24px; font-weight:bold;"><a href="https://www.scalecomputing.com/sc-hypercore" target="_blank" style="color:#ffffff; text-decoration:none;">SC//HyperCore&trade; &mdash; self-healing infrastructure <span style="color:#0a2540;">&rarr;</span></a></h3>
        </td>
      </tr>
    </table>

    <!-- spacer -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="height:10px; line-height:10px; font-size:0;">&nbsp;</td></tr></table>

    <!-- Layer 02 — NETWORK -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0a2540" style="width:100%; background:#0a2540; border-radius:8px;">
      <tr>
        <td width="48" valign="middle" style="width:48px; padding:16px 0 16px 20px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:26px; line-height:26px; letter-spacing:-1px; color:#7ec4ff; font-weight:bold;">02</td>
        <td valign="middle" style="padding:16px 18px 16px 12px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
          <p style="margin:0 0 4px; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#7ec4ff; font-weight:bold;">Network</p>
          <h3 class="mobile-h3" style="margin:0; font-size:18px; line-height:24px; font-weight:bold;"><a href="https://www.scalecomputing.com/sc-connect" target="_blank" style="color:#ffffff; text-decoration:none;">SC//Connect&trade; &mdash; SD-WAN with seamless failover <span style="color:#1e88e5;">&rarr;</span></a></h3>
        </td>
      </tr>
    </table>

    <!-- spacer -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="height:10px; line-height:10px; font-size:0;">&nbsp;</td></tr></table>

    <!-- Layer 03 — VISIBILITY + SECURITY -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0a2540" style="width:100%; background:#0a2540; border-radius:8px;">
      <tr>
        <td width="48" valign="middle" style="width:48px; padding:16px 0 16px 20px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:26px; line-height:26px; letter-spacing:-1px; color:#7ec4ff; font-weight:bold;">03</td>
        <td valign="middle" style="padding:16px 18px 16px 12px; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
          <p style="margin:0 0 4px; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#7ec4ff; font-weight:bold;">Visibility + Security</p>
          <h3 class="mobile-h3" style="margin:0; font-size:18px; line-height:24px; font-weight:bold;"><a href="https://www.scalecomputing.com/acuvigil" target="_blank" style="color:#ffffff; text-decoration:none;">SC//AcuVigil&trade; &mdash; every site on one dashboard <span style="color:#1e88e5;">&rarr;</span></a></h3>
        </td>
      </tr>
    </table>

  </td>
</tr>
```

**Current defaults (Uptime Optimization 2026 sends — the standing product set):**
- Layer 01: `Compute + Virtualization` — `SC//HyperCore&trade; &mdash; self-healing infrastructure` &rarr; `https://www.scalecomputing.com/sc-hypercore`
- Layer 02: `Network` — `SC//Connect&trade; &mdash; SD-WAN with seamless failover` &rarr; `https://www.scalecomputing.com/sc-connect`
- Layer 03: `Visibility + Security` — `SC//AcuVigil&trade; &mdash; every site on one dashboard` &rarr; `https://www.scalecomputing.com/acuvigil`

---

# Content blocks

## Block: Media + Text Row (image + headline / body / arrow link)

**Use when:** a horizontal block pairing a single image with a short text stack — the recurring two-up module for product tours, event logistics, secondary offers, resource downloads, and calls for action. Sits on the white card; reads as a self-contained row.

**Triggers in the brief:**
- A short headline + 1–2 sentence body + a single arrow link (`⇒` / `&rArr;`), paired with an image
- Event-logistics items ("Book your hotel," "Submit a nomination," "Download the letter template")
- A product/pricing teaser with an icon illustration and a "Get a Quote" / "Schedule Your Demo" link

**Placement:** Inside the white content card, in the body region (between the intro and the closing CTA). Multiple Media + Text Rows can stack; alternate the image side (left/right) when stacking two or more for visual rhythm.

**Visual:** Two-column row inside the white card. One column holds the image, the other holds the text stack; the order swaps per the `IMAGE_SIDE` variant. Card cell `padding:35px` (`mobile-padding`), drops bottom padding to 16px if another content cell follows (see house-style vertical-rhythm rule). On mobile both columns stack to full width via `.col-stack` / `.split-img` / `.split-text` (image on top).

Columns:
1. **Image column** (`width:40%`, class `col-stack split-img`): a single `<img>`, class `fluid`. Two shape variants:
   - **Circle** — a cropped square photo, `border-radius:50%`, ~220px (event/people photography). 
   - **Square/icon** — a square illustration or icon, no radius (or 6px), ~175px (product/pricing icons).
   The image is linked (`<a>` wrapping `<img>`) to the same destination as the arrow link.
2. **Text column** (`width:60%`, class `col-stack split-text`), vertically centered, top-to-bottom:
   - Headline — `#1a1a1a`, 22px / 28px, bold, `letter-spacing:-0.3px`, class `mobile-h2`. `margin:0 0 12px`.
   - Body paragraph — body text 15px / 24px, `#1a1a1a`, class `mobile-body dark-text`. `margin:0 0 16px`.
   - Arrow link — bold, 15px, trailing `&rArr;` with a leading space, no underline, color per `LINK_COLOR` (`#0a5db5` default, `#9c2e91` when specified). `margin:0`.

**Variants (set per instance):**
- `IMAGE_SIDE` — `left` or `right` (swap column order)
- `IMAGE_SHAPE` — `circle` (people/event photo) or `square` (product/pricing icon)
- `LINK_COLOR` — `#0a5db5` (default) or `#9c2e91` (magenta, when specified)

**Per-instance variables:**
- `IMAGE_URL` — the image asset
- `LINK_URL` — destination for both image and arrow link
- `HEADLINE`, `BODY`, `LINK_LABEL` (label always ends with ` &rArr;`)

**Don't:** use this for clickable *lists* of sessions (that's the Linked Session List in house-style.md); put more than one image in a row; or default to magenta — magenta is opt-in per send.

**Markup (IMAGE_SIDE = left shown; for right, swap the two `<td>` blocks):**
```html
<!-- CONTENT: Media + Text Row -->
<tr>
  <td class="mobile-padding" style="padding:35px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;">
      <tr>
        <!-- IMAGE COLUMN -->
        <td class="col-stack split-img" width="40%" valign="middle" style="width:40%; padding:0 24px 0 0;" align="center">
          <a href="LINK_URL" target="_blank" style="text-decoration:none;">
            <!-- circle: border-radius:50%; width ~220.  square/icon: border-radius:0 (or 6px); width ~175 -->
            <img src="IMAGE_URL" alt="" width="220" class="fluid" style="width:220px; max-width:100%; height:auto; display:block; margin:0 auto; border-radius:50%;" />
          </a>
        </td>
        <!-- TEXT COLUMN -->
        <td class="col-stack split-text" width="60%" valign="middle" style="width:60%; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
          <p class="mobile-h2" style="margin:0 0 12px; font-size:22px; line-height:28px; letter-spacing:-0.3px; color:#1a1a1a; font-weight:bold;">HEADLINE</p>
          <p class="mobile-body dark-text" style="margin:0 0 16px; font-size:15px; line-height:24px; color:#1a1a1a;">BODY</p>
          <p style="margin:0; font-size:15px; line-height:24px;"><a href="LINK_URL" target="_blank" style="color:LINK_COLOR; font-weight:bold; text-decoration:none;">LINK_LABEL &nbsp;&rArr;</a></p>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

**Live instances (from BeePro — fill IMAGE_URL + LINK_URL):**

| Instance | Image side | Shape | Link color | Headline | Body | Link label | IMAGE_URL | LINK_URL |
|----------|-----------|-------|-----------|----------|------|-----------|-----------|----------|
| Product Tour | left | square/icon | `#0a5db5` blue | Scale Computing Platform&trade; edge computing solution Product Tour | Scale Computing Platform brings simplicity, high availability and scalability together, replacing the existing infrastructure and providing high availability for running VMs in a single, easy-to-manage platform. | Schedule Your Demo &rArr; | `https://info.scalecomputing.com/l/46782/2025-10-13/9kjg58/46782/1760369724psmgY98e/TCO_demo_icon_blue.png` | _(add)_ |
| Awards Nomination | right | circle | `#9c2e91` magenta | Nominate Someone Today! | Don&rsquo;t forget&mdash;our Call for Awards Nominations is still open! Help us celebrate excellence in the community by submitting your nomination before the deadline on **April 25**. | Submit a Nomination &rArr; | _(placeholder)_ | _(add)_ |
| Boss Letter Template | right | circle | `#9c2e91` magenta | Need help getting your boss on board? | Look no further - we&rsquo;ve got you covered! Download our letter template to help you pitch your case. | Download Letter Template &rArr; | _(placeholder)_ | _(add)_ |
| Pricing Transparency | left | square/icon | `#0a5db5` blue | We believe in pricing transparency. | The Scale Computing&trade; Pricing Tool makes purchasing hardware and software simple and painless. | Get a Quote &rArr; | `https://info.scalecomputing.com/l/46782/2026-01-07/9llcx5/46782/1767794258nahrN58F/sc_cta_pricing_300x300.png` | _(add)_ |
| Book Your Hotel | left | circle | `#9c2e91` magenta | Book your hotel! | Your registration includes a hotel room at Resorts World Las Vegas! Just click the &ldquo;book hotel&rdquo; button below to reserve your room. And if you&rsquo;re planning to join one of our training and certification courses, plan to arrive by **May 12, 2025**&mdash;because learning never sleeps, but you definitely should! | Book Now &rArr; | _(placeholder)_ | _(add)_ |

> Note: Dated copy (April 25, May 12 2025) and Resorts World specifics are per-campaign — treat as variables, not locked text. The Product Tour and Pricing icons are square assets (~300px source, render ~175px). Remaining circle-photo asset URLs and all link destinations to be supplied.

---

## Block: Media + Text Row — Navy Spotlight (variant)

> **Product Tour treatments — Option 1 / Option 2.** The white Media + Text Row (above) and this navy panel are the two approved CTA treatments for the Product Tour. Refer to them by number in a brief: **Option 1 (On-Card)** = the light, inline row that blends into the body; **Option 2 (Navy Spotlight)** = this navy panel, which stands apart and self-separates (the stronger choice directly after a primary CTA). Same copy and CTA either way — only the surface changes.

**Use when:** the two-column Media + Text Row needs to read as a distinct, self-contained module rather than blend into the white card — most often as a **secondary CTA placed directly after the primary CTA**, where a hairline divider feels too weak to separate the two actions. The navy surface does the separating on its own, so no divider is needed. This is the navy sibling of the white Media + Text Row above; same two-column layout, emphasis surface.

**Triggers in the brief:**
- A secondary CTA / product spotlight that should sit apart from the primary CTA as its own block
- Direction like "make it more visually separate" / "give it its own panel" / "make it stand out"
- A product or pricing icon paired with a short text stack on an emphasis background

**Placement:** Inside the white content card, typically immediately AFTER the primary CTA (Closing Line + Primary CTA) and the last block before the footer — the navy surface self-separates, so drop any hairline divider. Like the other navy boxes, **don't pair it with a Featured Keynote Callout or the VMware Alternative Offer in the same email** (two navy boxes compete).

**Visual:** Dark navy `#0a2540` **rounded box (`border-radius:8px`)** inside the white card — same shell family as the VMware Alternative Offer and Featured Keynote Callout, but laid out as a two-column row instead of a centered stack. The card cell has `padding:0 35px 35px` (gutters + bottom rhythm since it's usually the last block before the footer); a padded wrapper inside the navy box (`30px`, class `mobile-padding` → 24px on mobile) supplies the interior rhythm. Two columns, vertically centered, order set by `IMAGE_SIDE`:
1. **Image column** (`width:40%`, class `col-stack split-img`): the icon seated on a **white rounded tile** (`#ffffff`, `border-radius:14px`, `padding:18px`) so it reads cleanly on navy regardless of the asset's own background. Icon ~150px, class `fluid`, linked (`<a>` wrapping `<img>`) to the same destination as the arrow link.
2. **Text column** (`width:60%`, class `col-stack split-text`), top-to-bottom:
   - Headline — **white `#ffffff`**, 22px / 28px, bold, `letter-spacing:-0.3px`, class `mobile-h2`. `margin:0 0 12px`.
   - Body paragraph — **`#dbe4f0`**, 15px / 24px, class `mobile-body` (do **not** add `dark-text` — it forces `#1a1a1a` in dark mode, which is illegible on navy). `margin:0 0 16px`.
   - Arrow link — **bright blue `#1e88e5`** (the standard `#0a5db5` link is too dark on navy), bold, 15px, trailing `&rArr;`. `margin:0`.
   On mobile both columns stack to full width (tile on top) via `.col-stack` / `.split-img` / `.split-text`, and the `30px` wrapper drops to 24px.

**Variants (set per instance):**
- `IMAGE_SIDE` — `left` or `right` (swap column order)
- Surface is **locked to navy** (that's the point of this variant); the white-card version is the base Media + Text Row above.
- Link color is **locked to bright blue `#1e88e5`** on navy — magenta and `#0a5db5` are not used on this surface.

**Per-instance variables:**
- `IMAGE_URL` — the icon asset (square icons work best; circle people-photos belong on the white-surface variant)
- `LINK_URL` — destination for both the linked tile and the arrow link
- `HEADLINE`, `BODY`, `LINK_LABEL` (label always ends with ` &rArr;`)

**Don't:** leave the headline/body in dark colors (illegible on navy); use `#0a5db5` or magenta for the link on navy; drop the white tile when the icon's background is unknown (default to the tile — only remove it if you've confirmed the icon is transparent/dark-friendly and reads well on navy); or stack two navy boxes in one email.

**Markup (IMAGE_SIDE = left shown; for right, swap the two inner `<td>` blocks):**
```html
<!-- SECONDARY: Media + Text Row — Navy Spotlight (self-separating; no divider) -->
<tr>
  <td class="mobile-padding" style="padding:0 35px 35px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; background:#0a2540; border-radius:8px;">
      <tr>
        <td class="mobile-padding" style="padding:30px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;">
            <tr>
              <!-- IMAGE COLUMN — icon on a white tile so it reads cleanly on navy -->
              <td class="col-stack split-img" width="40%" valign="middle" style="width:40%; padding:0 24px 0 0;" align="center">
                <a href="LINK_URL" target="_blank" style="text-decoration:none;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
                    <tr>
                      <td style="background:#ffffff; border-radius:14px; padding:18px;" align="center">
                        <img src="IMAGE_URL" alt="" width="150" class="fluid" style="width:150px; max-width:100%; height:auto; display:block; margin:0 auto;" />
                      </td>
                    </tr>
                  </table>
                </a>
              </td>
              <!-- TEXT COLUMN -->
              <td class="col-stack split-text" width="60%" valign="middle" style="width:60%; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;">
                <p class="mobile-h2" style="margin:0 0 12px; font-size:22px; line-height:28px; letter-spacing:-0.3px; color:#ffffff; font-weight:bold;">HEADLINE</p>
                <p class="mobile-body" style="margin:0 0 16px; font-size:15px; line-height:24px; color:#dbe4f0;">BODY</p>
                <p style="margin:0; font-size:15px; line-height:24px;"><a href="LINK_URL" target="_blank" style="color:#1e88e5; font-weight:bold; text-decoration:none;">LINK_LABEL &nbsp;&rArr;</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

**Current defaults (Q2-2026 GigaOm&reg; Radar send):**
- `IMAGE_SIDE` = `left`
- `IMAGE_URL` = `https://info.scalecomputing.com/l/46782/2026-01-07/9llcwk/46782/1767794257tdQjKZzy/sc_cta_demo_300x300.png`
- `LINK_URL` = `{consumer:FDeeplink_Landingpage_Url}#csp_page:/page/sc-platform`
- `HEADLINE` = `Scale Computing Platform&trade; Product Tour`
- `BODY` = `Scale Computing Platform&trade; brings simplicity, high availability and scalability together, replacing the existing infrastructure and providing high availability for running VMs in a single, easy-to-manage platform.`
- `LINK_LABEL` = `Schedule Your Demo`

---



# Structural blocks

## Block: Layer-Strip Hero (designed HTML hero, navy band)

**Use when:** a campaign has **no Pardot-hosted hero banner** — this is a fully designed HTML hero (no images), so it renders even with images blocked. A navy band carrying the campaign eyebrow, headline, and one-line campaign hook, plus a **3-segment "layer strip"** that lights the segment for the layer this email covers (or all three for an overview email), and an optional bright-blue hero CTA strip that puts the primary CTA above the fold. First used: Uptime Optimization 2026. If a hosted banner exists or gets created, use the house-style.md Hero Block instead.

**Triggers in the brief:**
- A multi-email campaign framed as layers/stages of one stack, each email covering one
- No hero banner asset supplied (or "no hosted assets exist for this campaign")
- Direction like "carry the campaign hook in the hero" / "put the CTA above the fold"

**Placement:** The **top of the white content card** — these are the card's first rows, replacing the image Hero Block. The card's `overflow:hidden` rounds the accent bar's top corners. The greeting/intro follows on the white surface.

**Visual (top to bottom; all rows `background:#0a2540` except where noted):**
1. **Top accent bar** — 3px `#1e88e5` strip, full width.
2. **Campaign eyebrow** — ice blue `#7ec4ff`, 12px, `letter-spacing:2.5px`, uppercase, bold, centered, class `mobile-eyebrow`. Cell `padding:46px 35px 0`.
3. **Headline** — `<h1>`, white, 28px / 34px, bold, `letter-spacing:-0.3px`, centered, class `mobile-h1`. Cell `padding:14px 35px 0`.
4. **Campaign hook** — `#dbe4f0`, 15px / 24px, centered, class `mobile-body` (one sentence; same line across the campaign's emails). Cell `padding:12px 35px 0`.
5. **Layer strip** — a centered 300px table: three 96px-wide segments, 6px tall, `border-radius:3px`, separated by 6px gap cells. Lit segment `#1e88e5`, unlit `#b8c5d6`. Cell `padding:26px 35px 10px`.
6. **Layer label** — slate `#b8c5d6`, 11px, `letter-spacing:2px`, uppercase, bold, centered: `Layer 0X &middot; <Layer Name>` (one lit) or the all-layers line, e.g. `Compute &middot; Network &middot; Visibility` (all lit). Cell `padding:0 35px 44px`.
7. **Hero CTA strip (optional)** — full-width `#1e88e5` band, cell `padding:14px 35px`, a single centered link: white, 13px / 18px, bold, `letter-spacing:1.5px`, uppercase, trailing ` &nbsp;&rarr;`. **Same destination and matching label as the email's primary CTA** — it's the primary action surfaced above the fold, not a second offer. Product emails carry it; the overview email omits it.

**Variants (set per instance):**
- `LIT_SEGMENT` — `1`, `2`, `3`, or `all` (overview email)
- Hero CTA strip — include (product email) or omit (overview email)

**Per-campaign variables:**
- `EYEBROW` — the campaign banner line (e.g. `Optimize Your Uptime`)
- `HEADLINE` — per-email hero headline
- `HOOK` — the one-line campaign hook (shared across the campaign's emails)
- `LAYER_LABEL` — the line under the strip
- `CTA_URL` / `CTA_LABEL` — when the CTA strip is included (mirror the primary CTA)

**Don't:** use it when a hosted hero banner exists (that's the house-style Hero Block); light a segment that disagrees with the email's lit Full Stack Cross-Promo bar; point the CTA strip somewhere other than the primary CTA's destination; recolor the layer label white (it's slate `#b8c5d6` by design); or use `#7ec4ff` / `#b8c5d6` outside this block and the Full Stack Cross-Promo (see Approved color tokens).

**Markup (product email shown: segment 1 lit, CTA strip included; for the overview variant light all three segments, use the all-layers label, and drop the CTA strip row):**
```html
<!-- DESIGNED HTML HERO (image-free: renders even with images blocked).      -->
<!-- The layer strip lights the layer this email covers. A Pardot-hosted     -->
<!-- banner can replace this via house-style.md "Hero Block" if one is made. -->
<tr>
  <td style="height:3px; line-height:3px; font-size:0; background:#1e88e5;">&nbsp;</td>
</tr>
<tr>
  <td align="center" class="mobile-padding" style="padding:46px 35px 0; background:#0a2540;">
    <p class="mobile-eyebrow" style="margin:0; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:12px; line-height:14px; color:#7ec4ff; letter-spacing:2.5px; font-weight:bold; text-transform:uppercase; text-align:center;">EYEBROW</p>
  </td>
</tr>
<tr>
  <td align="center" class="mobile-padding" style="padding:14px 35px 0; background:#0a2540;">
    <h1 class="mobile-h1" style="margin:0; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:28px; line-height:34px; color:#ffffff; font-weight:bold; text-align:center; letter-spacing:-0.3px;">HEADLINE</h1>
  </td>
</tr>
<tr>
  <td align="center" class="mobile-padding" style="padding:12px 35px 0; background:#0a2540;">
    <p class="mobile-body" style="margin:0; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:15px; line-height:24px; color:#dbe4f0; text-align:center;">HOOK</p>
  </td>
</tr>
<!-- Layer strip: lit segment = #1e88e5, unlit = #b8c5d6 -->
<tr>
  <td align="center" style="padding:26px 35px 10px; background:#0a2540;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="300" align="center" style="width:300px;">
      <tr>
        <td width="96" style="width:96px; height:6px; line-height:6px; font-size:0; background:#1e88e5; border-radius:3px;">&nbsp;</td>
        <td width="6" style="width:6px; font-size:0; line-height:6px;">&nbsp;</td>
        <td width="96" style="width:96px; height:6px; line-height:6px; font-size:0; background:#b8c5d6; border-radius:3px;">&nbsp;</td>
        <td width="6" style="width:6px; font-size:0; line-height:6px;">&nbsp;</td>
        <td width="96" style="width:96px; height:6px; line-height:6px; font-size:0; background:#b8c5d6; border-radius:3px;">&nbsp;</td>
      </tr>
    </table>
  </td>
</tr>
<tr>
  <td align="center" class="mobile-padding" style="padding:0 35px 44px; background:#0a2540;">
    <p style="margin:0; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; color:#b8c5d6; font-weight:bold;">LAYER_LABEL</p>
  </td>
</tr>
<!-- HERO CTA STRIP (optional — mirrors the primary CTA; omit on overview emails) -->
<tr>
  <td align="center" class="mobile-padding" style="padding:14px 35px; background:#1e88e5;">
    <a href="CTA_URL" target="_blank" style="font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande',Arial,sans-serif; font-size:13px; line-height:18px; color:#ffffff; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase; text-decoration:none;">CTA_LABEL &nbsp;&rarr;</a>
  </td>
</tr>
```

**Current defaults (Uptime Optimization 2026 sends):**
- `EYEBROW` = `Optimize Your Uptime`
- `HOOK` = `At the edge, a minute of downtime is a mile of lost revenue.`
- Per email: HyperCore = segment 1 lit, `Layer 01 &middot; Compute + Virtualization`, headline `Infrastructure That Fixes Itself`; Connect = segment 2, `Layer 02 &middot; Network`; AcuVigil = segment 3, `Layer 03 &middot; Visibility + Security`; Platform (overview) = all segments lit, label `Compute &middot; Network &middot; Visibility`, headline `Always On. Automatically.`, no CTA strip.
