# dillonlui.com

Personal portfolio site for Dillon Lui, product designer.

**Live at:** [dillonlui.com](https://dillonlui.com)

## Tech Stack

- [Astro](https://astro.build/) 5.x (static output)
- [GSAP](https://gsap.com/) scroll animations
- GitHub Pages hosting
- Google Fonts (Sansita One, Archivo Black)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Deployed automatically via GitHub Actions on push to `main`.

## Project Structure

```
src/
  components/     # Reusable Astro components
  content/        # YAML data collection (project card metadata)
  layouts/        # BaseLayout, CaseStudyLayout
  pages/          # Routes (index, about, projects/*)
  scripts/        # GSAP scroll animation utilities
  styles/         # global.css, case-study.css
public/
  images/         # Project screenshots, profile photo
  CNAME           # Custom domain config
```

## Case Studies

1. Unifying an Investigative Platform (featured)
2. ClearCase
3. GriefShare
4. LeadSuite
5. Deposify
