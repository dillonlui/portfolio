# Portfolio Project

## Project Goal
Migrate portfolio from Squarespace to GitHub Pages, then eventually redesign using Figma.

## Current Status
- Astro project with React integration
- GitHub Actions workflow configured for deployment
- Deploying to: dillonlui.github.io/portfolio (eventually dillonlui.com)

## Tech Stack
- Astro 5.x (static output)
- React for interactive components
- GSAP for animations
- GitHub Pages hosting

## Pages
- Home (index.astro)
- About (about.astro)
- Projects (projects/[slug].astro with content collection)

## GitHub Setup
- Personal account: dillonlui
- SSH alias: github.com-personal
- Repository: portfolio (deploys to dillonlui.github.io/portfolio)

## Design Approach
1. First: Recreate Squarespace design from screenshots
2. Later: Redesign using Figma

## Custom Domain (Phase 6)
- Domain: dillonlui.com
- DNS: Configure A records to GitHub IPs + CNAME for www
- Only switch after new site is ready (keep Squarespace live until then)
