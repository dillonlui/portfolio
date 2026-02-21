# Portfolio Project

## Project Goal
Migrate portfolio from Squarespace to GitHub Pages, then eventually redesign using Figma.

## Current Status
**Live at:** https://dillonlui.com/
**Active branch:** `2026-case-study-updates`

**Completed:**
- Astro project with React integration
- SSH configured for personal GitHub (github.com-personal alias)
- GitHub Actions workflow deploying successfully
- Phase 5: Squarespace design recreated with real content and assets
- Typography system with design tokens (Sansita One display, Archivo Black headings)
- Phase 6: Custom domain (dillonlui.com) with CNAME, no base path
- Phase 7: 5 case studies with refined copy, updated about page, new portfolio order

**Pending:**
- Images for ClearCase, LeadSuite, and Unified Platform case studies (all placeholder currently)
- Image directories to create: `public/images/projects/clearcase/`, `public/images/projects/leadsuite/`, `public/images/projects/unified-platform/`

## Tech Stack
- Astro 5.x (static output)
- React for interactive components (ImageCarousel, Lightbox)
- GSAP for scroll animations (shared via `src/scripts/scroll-animations.ts`)
- GitHub Pages hosting
- Google Fonts: Sansita One, Archivo Black

## Architecture

### Content Collection
- Type: `data` (YAML), not `content` (Markdown)
- YAML files in `src/content/projects/` hold card-level metadata only
- Individual case study pages are separate `.astro` files (not dynamic `[slug].astro`)

### Case Studies (in portfolio order)
1. **Unified Platform** (`unified-platform`) — featured, order 1 — `public/images/projects/unified-platform/`
2. **ClearCase** (`clearcase`) — order 2 — `public/images/projects/clearcase/`
3. **GriefShare** (`griefshare`) — order 3 — `public/images/projects/griefshare/`
4. **LeadSuite** (`leadsuite`) — order 4 — `public/images/projects/leadsuite/`
5. **Deposify** (`deposify`) — order 5 — `public/images/projects/deposify/`

Nav chain: Unified Platform → ClearCase → GriefShare → LeadSuite → Deposify → (loops back)

### Pages
- Home (`src/pages/index.astro`) - hero + featured project card + project grid + CTA footer
- About (`src/pages/about.astro`) - bio, experience, featured project link (points to Unified Platform)
- Case studies (`src/pages/projects/{unified-platform,clearcase,griefshare,leadsuite,deposify}.astro`)

### Shared Components
- `CaseStudyLayout.astro` - wraps case studies (hero + slot + nav + CTA)
- `CaseStudyHero.astro` - title, description, tags, hero image
- `ProjectNav.astro` - previous/next project links
- `CTAFooter.astro` - "Let's work together" footer with wave divider (supports `surfaceBg` prop)
- `CaseStudyLightbox.astro` - click-to-zoom image lightbox with keyboard nav
- `Header.astro` - nav with Work dropdown listing all 5 case studies in order

### Section Components
- `BeforeAfter`, `FeatureCard`, `FeatureShowcase`, `InsightCallout`, `FullWidthImage`, `SectionHeading`

### Design Tokens (`src/styles/global.css`)
- Typography: `--text-display` through `--text-xs`, `--leading-tight` through `--leading-relaxed`
- Fonts: `--font-display` (Sansita One), `--font-heading` (Archivo Black)
- Colors: `--color-accent`, `--color-dark-accent`, `--color-dark-accent-hover`, `--color-text-muted`
- Radius: `--radius-sm`, `--radius-md`, `--radius-full`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Z-index: `--z-header`, `--z-mobile-menu`, `--z-overlay`, `--z-overlay-controls`

### Images
- Existing images: `public/images/projects/griefshare/`, `public/images/projects/deposify/`, `public/images/projects/rmc/`, `public/images/projects/vybe/`
- Placeholder images still needed: `clearcase/`, `leadsuite/`, `unified-platform/` (Unified Platform)
- Profile photo: `public/images/profile/dillon.jpg`
- Site serves from root `/` (no base path) - use absolute paths like `/images/...`

## Writing Conventions
- No em dashes (—) in copy. Use commas or regular dashes ( - ) where necessary.
- Regular dashes are acceptable when setting off a parenthetical list that already contains commas (e.g. `hold all of it - item one, item two - and then`), or for emphatic trailing fragments (e.g. `sold it - twice`).

## GitHub Setup
- Personal account: dillonlui
- SSH alias: github.com-personal
- Repository: portfolio (deploys to dillonlui.com)
- Custom domain: dillonlui.com (CNAME in `public/CNAME`)
