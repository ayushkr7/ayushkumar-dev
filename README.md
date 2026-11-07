# elliotalderson.dev — Astro tech blog

A minimal, static technical blog built with Astro 5: Home, Article, All posts, Projects and About pages, a site-wide
Pagefind search pop-up, light/dark themes and a single 768px breakpoint.

## Commands

| Command                | What it does                                                                      |
| ---------------------- | --------------------------------------------------------------------------------- |
| `npm install`          | Install dependencies                                                              |
| `npm run dev`          | Dev server at `localhost:4321` (search shows a notice — no index in dev)          |
| `npm run build`        | `astro check` → `astro build` → `pagefind --site dist` (static output in `dist/`) |
| `npm run preview`      | Serve `dist/` locally — use this to try search                                    |
| `npm run format`       | Format every file with Prettier                                                   |
| `npm run format:check` | Check formatting without changing any files (useful in CI)                        |

Requires Node 20.3+ (Node 22 recommended). `@astrojs/language-server` is pinned via `overrides` in `package.json` so
`astro check` keeps working on Node < 20.19; you can remove the override once you're on Node 22.

## Where things live

| Path                           | Purpose                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `src/content/blog/`            | Posts (`.md` / `.mdx`). Frontmatter: `title`, `description`, `pubDate`, `updatedDate?`, `tags`, `draft`      |
| `src/content.config.ts`        | `blog` and `projects` collection schemas                                                                     |
| `src/data/about.ts`            | **All personal data**: name, role, bio, now, experience, uses, email, socials, résumé, portrait              |
| `src/data/projects.json`       | Projects (`status`: `active` / `maintained` / `archived`; `post` references a blog slug)                     |
| `src/data/site.ts`             | Site name, title and description                                                                             |
| `src/styles/tokens.css`        | Design tokens (all colours, both themes)                                                                     |
| `src/lib/shiki.ts`             | Syntax theme colours + code-block figure (file name + Copy button)                                           |
| `src/lib/page-load.ts`         | `onPageLoad()`: use it for any `<script>` that touches the page, because ClientRouter only runs scripts once |
| `src/layouts/BaseLayout.astro` | `<head>`, no-flash theme script, header, footer, skip link, search                                           |

## Writing posts

- Tags are lowercased automatically; Home topics and archive filters are generated from them.
- Read time is computed from the post body at ~200 words/min.
- Code block titles: ` ```astro title="src/pages/index.astro" `.
- Callouts (MDX): `import Note from '../../components/Note.astro'` then `<Note>…</Note>`.
- Diagrams: use a ` ```mermaid ` block (any diagram type Mermaid supports). Add `title="…"` for a caption and
  `accTitle:` / `accDescr:` lines inside the diagram for screen readers:

  ````md
  ```mermaid title="The pre-deploy checklist"
  flowchart LR
    accTitle: The pre-deploy checklist
    accDescr: Build, check links, run Lighthouse, then deploy.
    build[astro build] --> links{Broken links?}
    links -- no --> ship([Deploy])
  ```
  ````

  Mermaid is loaded only on posts that contain a diagram, when it scrolls near the viewport; it uses the colour
  tokens and re-renders when the theme changes. Without JavaScript (or on a syntax error) the diagram source is shown.
  Code lives in `src/lib/rehype-mermaid.ts` (build) and `src/lib/mermaid-client.ts` (browser).

- `draft: true` posts appear in `npm run dev` only; they are excluded from every list, route, RSS and the search index in builds.

## Sample data to replace

The site ships with a sample persona, Elliot Alderson from _Mr. Robot_, so every page looks finished. The domain,
email and social handles are made up and the links lead nowhere, so replace them before you deploy:

- `site` in `astro.config.mjs` and the sitemap URL in `public/robots.txt` (`https://elliotalderson.dev`)
- `site.name` and `site.title` in `src/data/site.ts`
- Name, role, bio, now, experience, uses, email and social URLs in `src/data/about.ts`
- Project links in `src/data/projects.json`
- `public/resume.pdf` (a sample résumé) — or set `resume: undefined` in `about.ts` to hide the link
- Portrait: add `src/assets/portrait.jpg`, import it in `about.ts` and set `portrait` (until then initials are shown)
