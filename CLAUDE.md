# Portfolio Project

## Project Goal
Personal portfolio site for Dillon Lui, product designer. Built with Astro, hosted on GitHub Pages.

## Current Status
**Live at:** https://dillonlui.com/
**Branch:** `main` (production)

**Completed:**
- Astro project with static output
- 5 case studies with real images and refined copy
- Shared case study CSS extracted to `src/styles/case-study.css`
- Featured project overlay card (desktop) / stacked card (mobile)
- Typography system with design tokens
- Custom domain with GitHub Pages deployment
- Code review cleanup: removed unused components, eliminated CSS duplication
- Case study layout refresh: hero titles, accent colors, section heading lines, image shadows, reflection cards, pull quotes
- Pill-shaped sticky nav with frosted glass on scroll (desktop), full-width on mobile
- Per-project accent color theming via `--color-project-accent`
- ViewTransitions-compatible script initialization (`astro:page-load` pattern)
- Lightbox with keyboard nav and prev/next controls
- ProjectNav with category tags from YAML data
- Compact CTA footer with responsive sizing

## Tech Stack
- Astro 5.x (static output)
- GSAP for scroll animations (shared via `src/scripts/scroll-animations.ts`)
- GitHub Pages hosting
- Google Fonts: Sansita One, Archivo Black

## Architecture

### Content Collection
- Type: `data` (YAML), not `content` (Markdown)
- YAML files in `src/content/projects/` hold card-level metadata only
- Individual case study pages are separate `.astro` files (not dynamic `[slug].astro`)

### Case Studies (in portfolio order)
1. **Unified Platform** (`unified-platform`) - featured, order 1
2. **ClearCase** (`clearcase`) - order 2
3. **GriefShare** (`griefshare`) - order 3
4. **LeadSuite** (`leadsuite`) - order 4
5. **Deposify** (`deposify`) - order 5

Nav chain: Unified Platform > ClearCase > GriefShare > LeadSuite > Deposify > (loops back)

### Pages
- Home (`src/pages/index.astro`) - hero + featured project card + project grid + CTA footer
- About (`src/pages/about.astro`) - bio, experience, featured project link
- Case studies (`src/pages/projects/{unified-platform,clearcase,griefshare,leadsuite,deposify}.astro`)

### Shared Components
- `CaseStudyLayout.astro` - wraps case studies (hero + slot + nav + CTA), imports shared case study CSS, injects `--color-project-accent` via `<Fragment set:html>`
- `CaseStudyHero.astro` - accent strip, title (display font), description, tags, hero image with colored shadow
- `ProjectNav.astro` - previous/next project links with category tags from YAML data
- `CTAFooter.astro` - "Let's work together" footer with angled clip-path divider
- `CaseStudyLightbox.astro` - click-to-zoom image lightbox with keyboard nav
- `Header.astro` - pill-shaped nav (desktop) with scroll-aware background, full-width on mobile, Work dropdown
- `ScrollProgress.astro` - scroll progress bar using project accent color
- `FeaturedProjectCard.astro` - overlay on desktop, stacked on mobile
- `ProjectCard.astro` - standard project card for grid

### Section Components
- `SectionHeading` - heading with accent-colored line decoration
- `FullWidthImage` - images with layered shadow system and left-aligned captions with em-dash
- `InsightCallout` - insight cards with optional decorative number and project accent border
- `BeforeAfter`, `FeatureCard`, `FeatureShowcase`

### Styles
- `src/styles/global.css` - design tokens, reset, base typography, button utilities
- `src/styles/case-study.css` - shared case study styles (design-question callout, image-pair grid, insights-grid, reflections-grid with numbered cards, pull-quote with decorative quotation mark, image-elevated, image-browser chrome)

### Design Tokens (`src/styles/global.css`)
- Typography: `--text-display` through `--text-xs`, `--leading-tight` through `--leading-relaxed`
- Fonts: `--font-display` (Sansita One), `--font-heading` (Archivo Black), `--font-sans`
- Colors: `--color-accent` (#205d17), `--color-dark-accent`, `--color-dark-accent-hover`, `--color-text-muted`
- Per-project: `--color-project-accent` (set dynamically per case study via CaseStudyLayout)
- Radius: `--radius-sm`, `--radius-md`, `--radius-full`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Z-index: `--z-header`, `--z-mobile-menu`, `--z-overlay`, `--z-overlay-controls`, `--z-cursor`

### Images
- All case study images: `public/images/projects/{unified-platform,clearcase,griefshare,leadsuite,deposify}/`
- Archived projects: `public/images/projects/rmc/`, `public/images/projects/vybe/`
- Profile photo: `public/images/profile/dillon.jpg`
- Site serves from root `/` (no base path) - use absolute paths like `/images/...`

### Key Patterns
- **ViewTransitions**: All component scripts must use `document.addEventListener('astro:page-load', initFn)` to re-initialize after page transitions
- **Accent color cascading**: Use `<Fragment set:html={...} />` to inject `<style>:root { --color-project-accent: ... }</style>` - do NOT use Astro's `define:vars` for CSS variables that need to cascade to child components
- **Scoped style specificity**: Astro scoped styles can beat global CSS. Use `!important` on shared overrides (e.g. `.image-pair > figure + figure { margin-top: 0 !important }`) when scoped component styles conflict

## Writing Conventions
- No em dashes in copy. Use commas or regular dashes ( - ) where necessary.
- Regular dashes are acceptable when setting off a parenthetical list that already contains commas (e.g. `hold all of it - item one, item two - and then`), or for emphatic trailing fragments (e.g. `sold it - twice`).

## GitHub Setup
- Personal account: dillonlui
- SSH alias: github.com-personal
- Repository: portfolio (deploys to dillonlui.com)
- Custom domain: dillonlui.com (CNAME in `public/CNAME`)
