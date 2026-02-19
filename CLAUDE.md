# Portfolio Project

## Project Goal
Migrate portfolio from Squarespace to GitHub Pages, then eventually redesign using Figma.

## Current Status
**Live at:** https://dillonlui.com/

**Completed:**
- Astro project with React integration
- SSH configured for personal GitHub (github.com-personal alias)
- GitHub Actions workflow deploying successfully
- Phase 5: Squarespace design recreated with real content and assets
- Typography system with design tokens (Sansita One display, Archivo Black headings)
- 4 case study pages: GriefShare, Deposify, RMC, Vybe
- About page with experience section, profile photo, resume link
- Code review fixes: shared GSAP utilities, consolidated button styles, design tokens for radius/shadow/z-index, accessibility improvements
- Phase 6: Custom domain (dillonlui.com) with CNAME, no base path

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

### Pages
- Home (`src/pages/index.astro`) — hero + project card grid + CTA footer
- About (`src/pages/about.astro`) — bio, experience, featured project link
- Case studies (`src/pages/projects/{griefshare,deposify,rmc,vybe}.astro`) — unique layouts per project

### Shared Components
- `CaseStudyLayout.astro` — wraps case studies (hero + slot + nav + CTA)
- `CaseStudyHero.astro` — title, description, tags, hero image
- `ProjectNav.astro` — previous/next project links
- `CTAFooter.astro` — "Let's work together" footer with wave divider (supports `surfaceBg` prop)
- `CaseStudyLightbox.astro` — click-to-zoom image lightbox with keyboard nav

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
- All images in `public/images/` organized by: `profile/`, `projects/griefshare/`, `projects/deposify/`, `projects/rmc/`, `projects/vybe/`
- Site serves from root `/` (no base path) — use absolute paths like `/images/...`

## Writing Conventions
- No em dashes (—) in copy. Use commas or regular dashes ( - ) where necessary.
- Regular dashes are acceptable when setting off a parenthetical list that already contains commas (e.g. `hold all of it - item one, item two - and then`), or for emphatic trailing fragments (e.g. `sold it - twice`).

## GitHub Setup
- Personal account: dillonlui
- SSH alias: github.com-personal
- Repository: portfolio (deploys to dillonlui.com)
- Custom domain: dillonlui.com (CNAME in `public/CNAME`)
