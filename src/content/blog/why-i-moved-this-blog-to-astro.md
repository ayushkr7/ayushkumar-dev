---
title: Why I moved this blog to Astro
description: Content first, zero JavaScript by default, and Markdown that stays Markdown.
pubDate: 2025-02-14
tags: [astro, notes]
---

This blog spent five years on Jekyll. It worked, but every change meant fighting Ruby versions and Liquid templates. Astro looked like the smallest step to something I’d enjoy maintaining.

## Content first

Posts are still Markdown files in a folder. Content collections add a schema, so a typo in a date or a missing description fails the build instead of quietly rendering a broken page.

## Zero JavaScript by default

Astro renders components to HTML and ships no client runtime unless a component asks for one. The pages on this site load a theme script, a menu toggle and — only when you open it — the search index. Everything else is HTML and CSS.

## Components without a framework tax

Layouts and components are `.astro` files: HTML with a frontmatter script. When a page needs real interactivity, an island can use any framework, but none of this site does.

## The migration

The move took a weekend. A small script rewrote Jekyll front matter to the new schema and moved images next to their posts; the rest was rebuilding the layout.

```bash
node scripts/migrate.mjs ../old-blog/_posts src/content/blog
```

## What I’d tell myself

Start with the content model, not the design. Once every post validated against the schema, the pages were the easy part.
