---
title: View transitions between static pages
description: Animating navigation in a multi-page site with the View Transitions API and Astro’s router.
pubDate: 2026-07-03
tags: [astro, css]
---

Multi-page sites used to choose between instant, jarring navigations and a client-side router. Cross-document view transitions remove that trade-off: the browser animates between two full page loads.

## Opt in with CSS

For same-origin navigations, one rule is enough in browsers that support it:

```css title="src/styles/global.css"
@view-transition {
  navigation: auto;
}
```

The default is a cross-fade. Browsers without support simply navigate normally, which is the right fallback.

## Name the things that move

Give an element the same `view-transition-name` on both pages and the browser morphs it from one position to the other — a post title on the archive growing into the article heading, for example.

```css
.post-title {
  view-transition-name: var(--vt-name);
}
```

Names must be unique on a page, so set them per item (from the slug) rather than per class.

## Astro’s router, when you need more

Astro’s `<ClientRouter />` adds transitions in browsers without native support and keeps state such as a playing video across pages. It does that by intercepting navigation, so it ships a little JavaScript. For a blog, the CSS-only version is usually enough.

## Respect reduced motion

Wrap any custom animation in `@media (prefers-reduced-motion: no-preference)`. A cross-fade is mild; a sliding page is not.
