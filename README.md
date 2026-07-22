# Akash Soni — Portfolio

A distinctive, single-page developer portfolio built with **Angular 19 + TypeScript**.
Concept: **"The Workspace"** — a Visual Studio / VS Code–inspired identity for a
.NET/C# + AWS/Azure engineer. Dark **and** light themes, fully responsive, with a
signature animated AWS architecture diagram built from a real shipped project.

## Run it

```bash
npm install        # first time only
npm start          # dev server at http://localhost:4200
npm run build      # production build -> dist/portfolio
```

> Requires Node 22.13+ (this project is pinned to Angular 19 for that reason).

## Where to edit content

Everything you'd want to change lives in **one file**:

| What | File |
|------|------|
| Name, summary, jobs, projects, skills, education, links | `src/app/data/resume.ts` |
| Photos & résumé PDF | `public/media/` (`akash-portrait.jpg`, `akash-sunset.jpg`, `Akash_Soni_Resume.pdf`) |
| Colors / fonts / theme tokens | `src/styles.scss` (CSS custom properties at the top) |
| Architecture diagram flows | `ARCH_FLOWS` (nodes, edges, narration steps) in `src/app/data/resume.ts` |

Links are already set:
- LinkedIn → `https://www.linkedin.com/in/akus0ni/`
- GitHub → `https://github.com/Akus0ni`

## Design system

- **Palette** derived from the sunset photos: sunset amber `#F6A550` + ocean teal `#4FD1C5` on an ocean-dusk navy base. Full light-theme override.
- **Type**: Space Grotesk (display) · IBM Plex Sans (body) · JetBrains Mono (code/data).
- **Structural devices** that encode real meaning: Experience as a `git log`,
  Skills as a `.csproj` `<PackageReference>` manifest, Contact as `contact.sh`.
- Accessibility floor: keyboard focus rings, `prefers-reduced-motion` respected,
  semantic landmarks, ARIA labels on the diagram and controls.

## Deploy

Any static host works (the app is fully client-side):

- **Netlify / Vercel / Cloudflare Pages**: build command `npm run build`, publish
  directory `dist/portfolio/browser`.
- **GitHub Pages**: serve `dist/portfolio/browser` (set `--base-href` if hosting
  under a repo subpath: `ng build --base-href /<repo>/`).
