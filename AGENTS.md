# Agent Guidelines

## Project Context
- Personal portfolio site for Dillon Lui, a product designer. Built with Astro and deployed to GitHub Pages at `dillonlui.com`.
- Prioritize polish, readability, and consistency with the established visual language over novel abstractions.

## Code Map
- `src/pages/`: top-level routes, including case study pages under `src/pages/projects/`
- `src/components/`: shared Astro UI components
- `src/styles/`: global design tokens and shared case study styles
- `src/content/projects/`: YAML metadata for project cards and navigation
- `src/scripts/`: client-side interaction scripts
- `tests/`: Playwright end-to-end tests

## How to Work in This Repo
- Reuse existing page, component, and styling patterns before introducing new abstractions.
- Prefer small, incremental edits unless a larger structural change is explicitly requested.
- Preserve project ordering, navigation flow, and per-project accent theming unless the task requires changing them.
- For copy edits, avoid em dashes. Use commas or regular dashes instead.
- For OpenAI API or Codex questions, prefer the official OpenAI docs MCP before relying on memory.

## Key Implementation Rules
- Project card metadata lives in `src/content/projects/` YAML files, while case study content lives in dedicated `.astro` pages. Keep that split intact unless a migration is explicitly requested.
- Use the `astro:page-load` pattern for scripts that must re-initialize after Astro view transitions.
- For shared theme variables that must cascade, prefer the existing root CSS variable approach instead of Astro `define:vars`.
- Be careful with Astro scoped styles. If a shared global style is being overridden by component scoping, match the existing approach rather than inventing a new one.

## How to Run Things
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- E2E tests: `npm test`

Run the relevant build or tests after non-trivial changes. At minimum, run `npm run build` for content/layout work and `npm test` when behavior or navigation changes.

## Coding Standards
- Follow existing Astro component patterns and CSS token usage.
- Keep components focused and avoid unnecessary indirection.
- Avoid introducing new dependencies unless there is a clear need and approval.
- Use absolute `/images/...` paths for site assets where the codebase already expects them.

## Workflow for Larger Tasks
1. Summarize the task and identify the affected pages, components, or styles.
2. Propose a short plan before making broad multi-file or structural edits.
3. Implement in small, reviewable steps.
4. Run relevant validation commands and report results.

## Things to Avoid
- Do not do sweeping visual refactors without being asked.
- Do not change public URLs, case study slugs, or GitHub Pages deployment assumptions without explicit approval.
- Do not commit secrets, credentials, or generated artifacts that do not belong in the repo.

## Definition of Done
- The site builds successfully and relevant tests pass.
- Changes match the existing brand and interaction patterns.
- New behavior is covered by tests when appropriate.
- A brief summary of changes and rationale is provided.
