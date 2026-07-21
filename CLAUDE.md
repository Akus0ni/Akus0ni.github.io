# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start            # dev server at http://localhost:4200 (ng serve, development config)
npm run build        # production build -> dist/portfolio/browser
npm run watch        # rebuild on change (development config)
npm test             # Karma + Jasmine unit tests (headless Chrome), watch mode
ng test --watch=false --browsers=ChromeHeadless   # single non-watch run (CI-style)
```

Requires Node 22.13+. Pinned to Angular 19 CLI/framework. There is no separate lint step configured.

## What this is

A single-page developer portfolio (no backend, no runtime data fetching). Concept: **"The Workspace"** — a VS Code / editor-inspired identity. All content is static and lives in TypeScript; the app just renders it with signals and scroll-driven UI.

## Architecture

**Content is data, not markup.** `src/app/data/resume.ts` is the single source of truth for all portfolio content (profile, links, roles, projects, skills, education, certs, and the `ARCH_NODES`/`ARCH_EDGES` that drive the animated AWS architecture diagram). Components never import this module directly — they inject `ResumeService` (`src/app/core/resume.service.ts`), a thin injectable facade over `resume.ts`. To change what the site says, edit `resume.ts`; to change how it's structured, edit the interfaces there too.

**Sections are a registry, not hardcoded.** `src/app/core/sections.ts` (`SECTIONS: SectionMeta[]`) is the ordered list of page sections. It drives three things at once: the explorer-rail nav, the scroll-spy target ids, and the numbered section headers. `SectionService` derives the `01..NN` header indices from registry order, so **reordering `SECTIONS` automatically renumbers headers** — never hardcode a section index. Each section component declares only its id: `<app-section-header id="experience" />` pulls its title/eyebrow/file-label from `SectionService.header(id)`.

**Scroll-spy is deterministic.** `ScrollSpyService` (`src/app/core/scroll-spy.service.ts`) recomputes the active section from absolute scroll position against a reference line ~40% down the viewport (rAF-throttled), rather than reacting to IntersectionObserver events — this avoids the "stuck active section" problem. It's initialized once from `AppComponent.ngAfterViewInit` with `sections.ids()`.

**Reveal-on-scroll** uses the `appReveal` directive (`src/app/directives/reveal.directive.ts`) — an IntersectionObserver that adds `.is-visible` (styled globally in `styles.scss`), with an optional `[revealDelay]` stagger.

**Layout of `src/app`:**
- `core/` — app-wide services and the section registry (`sections.ts`, `section.service.ts`, `resume.service.ts`, `scroll-spy.service.ts`)
- `sections/` — one standalone component per page section (hero, about, experience, projects, query-console, skills, education, contact), composed in order by `AppComponent`
- `components/` — reusable UI pieces (`arch-diagram`, `typewriter`, `section-header`, `window-dots`)
- `services/` — `theme.service.ts` (dark/light, persisted to localStorage, respects `prefers-color-scheme`)
- `utils/` — pure helpers (`sql-highlight.ts` tokenizer for the query console, `duration.ts` date math)
- `data/` — `resume.ts` content module

## Conventions

- **Standalone components only** — there are no NgModules. Each component sets `standalone: true` and lists its own `imports`. `app.config.ts` bootstraps with `provideRouter` + zone change detection.
- **Signals throughout** — state is `signal()`/`computed()`, not RxJS subjects or `@Input` mutation. Follow this when adding state.
- **Modern control flow** — templates use `@for` / `@if`, not `*ngFor` / `*ngIf`.
- **Inline templates/styles are common** for smaller section and UI components (`template:` + `styles:` in the `@Component`); larger ones (`AppComponent`) use `templateUrl`/`styleUrl`. Match the neighboring file.
- **Theming via CSS custom properties.** All colors/fonts/tokens are declared at the top of `src/styles.scss` and switched by the `data-theme` attribute (set by `ThemeService` on `<html>`). Reference `var(--accent)`, `var(--border)`, etc. — never hardcode a color in a component.
- **Accessibility floor is intentional** — keyboard focus rings, `prefers-reduced-motion` guards (see reveal directive and the pulse animation), ARIA labels on the diagram/controls. Preserve these when editing.

## Deploy

Fully client-side. Build with `npm run build`; publish `dist/portfolio/browser`. For a repo-subpath host (e.g. GitHub Pages), add `ng build --base-href /<repo>/`.
