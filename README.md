# Ayush Kumar — Astro tech blog

A minimal, static technical blog built with Astro 5: Home, Article, All posts, Projects and About pages, a site-wide
Pagefind search pop-up, light/dark themes and a single 768px breakpoint.

## Commands

| Command                | What it does                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `npm install`          | Install dependencies                                                                     |
| `npm run dev`          | Dev server at `localhost:4321/ayushkumar-dev/` (search shows a notice — no index in dev) |
| `npm run build`        | `astro check` → `astro build` → `pagefind --site dist` (static output in `dist/`)        |
| `npm run preview`      | Serve `dist/` locally — use this to try search                                           |
| `npm run format`       | Format every file with Prettier                                                          |
| `npm run format:check` | Check formatting without changing any files (useful in CI)                               |

Requires Node 20.3+ (Node 22 recommended). `@astrojs/language-server` is pinned via `overrides` in `package.json` so
`astro check` keeps working on Node < 20.19; you can remove the override once you're on Node 22.

## Deploying

`.github/workflows/deploy.yml` runs on every push to `main` and every pull request, on Node 24: `npm ci`, the Prettier
check, then `npm run build` (type check, build and search index). Pushes to `main` are then deployed to GitHub Pages;
pull requests are only checked.

The site is served at **https://ayushkr7.github.io/ayushkumar-dev/**. Because that is a sub-path, `astro.config.mjs`
sets `base: '/ayushkumar-dev'`, and every internal link and file in `public/` goes through `withBase()` from
`src/lib/url.ts`. Use it for any new link, e.g. `href={withBase('/blog/')}`. `base` must match the repository name.

One-time setup on GitHub: **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**. GitHub
Pages needs a public repository, or a paid plan for a private one.

To move to a custom domain later: set `site` to the domain and remove `base` in `astro.config.mjs`, update the sitemap
URL in `public/robots.txt`, then add the domain under Settings → Pages and point its DNS at GitHub Pages
([GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).

## Where things live

| Path                           | Purpose                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `src/content/blog/`            | Posts (`.md` / `.mdx`). Frontmatter: `title`, `description`, `pubDate`, `updatedDate?`, `tags`, `draft`      |
| `src/content.config.ts`        | `blog` and `projects` collection schemas                                                                     |
| `src/data/about.ts`            | **All personal data**: name, role, bio, now, experience, stack, languages, email, socials, résumé, portrait  |
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

## Placeholders to replace

Personal details come from the public GitHub profile ([github.com/ayushkr7](https://github.com/ayushkr7)) and a
LinkedIn profile export: name, role, bio, location, portrait, experience, projects, email and social links.
`public/resume.pdf` is generated from the same data. Anything neither source had is a placeholder in
`[square brackets]`, so every page still looks finished. Replace these before you deploy:

- In `src/data/about.ts`: the summaries of the two Victoria’s Secret & Co. roles in `experience`
- The posts in `src/content/blog/` are still sample content
