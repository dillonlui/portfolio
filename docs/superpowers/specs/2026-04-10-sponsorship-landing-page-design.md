# Sponsorship Landing Page - Design Spec

## Overview

A standalone landing page at `/sponsorship` that Dillon can share via DM or email with churches and non-profits to explain his web sponsorship program. Not linked from site nav or discoverable organically - it's a digital business card / brochure.

**Tone:** Personal, ministry-minded, honest. Reads like a letter, not a pitch. Lead with heart and story, capabilities come second.

**Primary action:** Email Dillon directly.

## Route & Discoverability

- **Route:** `/sponsorship`
- **Not linked** from nav, footer, or any other page
- **`noindex: true`** via BaseLayout prop - search engines won't index it
- **Shareable URL:** `dillonlui.com/sponsorship`

## Page Structure

Uses `BaseLayout` with `noindex: true`. The standard site Header will render (for consistency and to allow navigation back to the main site if desired), but the page content itself starts with a small centered DL logo as a visual anchor for the letter. No CTAFooter at the bottom - just the email CTA to keep the standalone feel.

**Layout:** Narrow centered column, max-width ~640px. Generous whitespace between sections. Letter-style reading experience.

## Content Flow

### 1. Logo + Headline

Small centered DL favicon/logo at top. Then:

**Headline:** "A Better Web Presence for Your Church or Non-Profit"

Clear, direct, speaks to who they are.

### 2. Personal Intro (2-3 sentences)

Who Dillon is - a product designer who spent years in ministry and non-profit work. Bridges the two worlds immediately so the reader knows he understands their context.

### 3. Your Story / Why This Matters (3-4 sentences)

The ministry-to-tech bridge:
- InterVarsity: participated as a college student, then interned with this parachurch ministry serving college campuses
- Church Initiative: worked as their first product designer, building tools for support group programs (GriefShare, DivorceCare)
- First Chinese Baptist Church of Dallas: 5 years as College & Career Pastor

The thread: years of being embedded in these communities, seeing firsthand how much a good (or bad) web presence matters. Now has the technical skills to actually do something about it.

### 4. The Problem (2-3 sentences)

Name the reality without punching down: many churches and non-profits are stuck on outdated platforms that are hard to update, don't reflect the community well, and create friction for visitors trying to find basic information. Staff don't have the technical skills or budget to fix it. This doesn't have to be the case anymore.

### 5. The Offer (2-3 sentences)

Dillon volunteers to rebuild their web presence on a modern stack that non-technical staff can maintain long-term. This is a sponsorship - not a product, not a sales pitch. He handles design, development, and content modeling. They get a site that works for them.

No mention of cost - pricing varies by situation (some free, some discounted). The word "sponsorship" communicates the spirit without specifics.

### 6. What the Site Includes (lightweight list)

Short, scannable list for mildly technical folks:
- Modern, fast, mobile-friendly design
- Content management system (easy updates without a developer)
- Bilingual support if needed
- Accessibility built in
- Forms (contact, prayer requests, event registration, etc.)
- Hosting and deployment handled

Not a feature matrix - just enough to signal competence and scope.

### 7. FICCC Showcase

Brief intro line like "Here's a recent project I completed for First Ithaca Chinese Christian Church - a bilingual site with CMS-driven content and full accessibility."

Reuse existing screenshots from `src/assets/images/projects/personal/`:
- `ficcc-homepage.png` (English homepage)
- `ficcc-about.png` (Our Story timeline)
- `ficcc-visit.png` (Visit page with schedule)

Display: row on desktop, scroll-snap carousel on mobile (same pattern as personal page).

### 8. CTA

Warm, low-pressure closing: "If this sounds like something your community could use, I'd love to hear from you."

Email link button: `mailto:dillonlui@gmail.com`

## Visual Treatment

- **Typography:** `--font-display` (Sansita One) for headline only. `--font-sans` for all body text. No `--font-heading` (Archivo Black) - too bold for letter tone.
- **Color:** Standard `--color-background`, `--color-text`, `--color-text-secondary`. Green accent (`--color-accent`) used sparingly on email link and any subtle dividers.
- **Logo:** Small centered DL favicon at top (reuse `/favicon.ico`).
- **Screenshots:** Processed via Astro `Picture` component with AVIF/WebP. Same shadow/radius treatment as personal page.
- **Whitespace:** Generous spacing between sections. Should feel like reading a letter, not scanning a webpage.
- **No animations:** No GSAP, no fade-ins. Page loads immediately and feels direct.
- **Responsive:** Single column at all widths (already narrow). Screenshots use scroll-snap carousel on mobile.

## Accessibility

- Semantic heading hierarchy: H1 (headline), H2 (section breaks if needed, but letter-style may not need them)
- Alt text on all screenshots
- Email link is keyboard accessible
- Design tokens ensure accessible color contrast

## Files

| File | Action | Notes |
|------|--------|-------|
| `src/pages/sponsorship.astro` | Create | The page |

No other files changed. Images already exist from the personal page. No nav updates. No new components needed.

## Writing Conventions

- No em dashes (per project convention). Use commas or regular dashes.
- Natural, first-person voice. Not AI-sounding.
- No buzzwords or marketing-speak. Just honest, direct language.
- Copy will be refined during implementation to sound like Dillon, not a language model.

## Success Criteria

- Someone opens the link and within 60 seconds understands: who Dillon is, why he does this, what he's offering, and how to reach him
- The page feels like it came from a person, not a business
- A non-technical church leader feels comfortable and understood, not intimidated
- A mildly technical person sees enough specifics to trust the technical competence
