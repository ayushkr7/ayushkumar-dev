---
title: A minimal dark mode without a flash
description: Reading the preferred theme before first paint with a tiny inline script and CSS custom properties.
pubDate: 2026-10-09
tags: [css, astro]
---

The classic dark-mode bug is the flash: the page paints in light colours, then a script runs and swaps everything to dark. The fix is to decide the theme _before_ the browser paints anything, and to make every colour depend on a single attribute.

## One attribute, two sets of tokens

Define every colour as a custom property on `:root`, then override them under `[data-theme="dark"]`. Components never use raw colours — only the tokens.

```css title="src/styles/tokens.css"
:root {
  color-scheme: light;
  --bg: #fbfbfa;
  --text: #16171a;
  --accent: #2b50d6;
}

[data-theme='dark'] {
  color-scheme: dark;
  --bg: #0f1012;
  --text: #ececea;
  --accent: #8fa8ff;
}
```

Setting `color-scheme` as well means form controls and scrollbars follow the theme too.

## Decide before first paint

A small inline script in `<head>` runs synchronously, before the body is parsed. In Astro, `is:inline` keeps it out of the bundle so it is not deferred.

```astro title="src/layouts/BaseLayout.astro"
<script is:inline>
  const saved = localStorage.getItem('theme');
  const theme =
    saved === 'light' || saved === 'dark'
      ? saved
      : matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  document.documentElement.dataset.theme = theme;
</script>
```

A saved choice wins; otherwise the operating system preference decides. Wrap the `localStorage` call in `try` if you need to support browsers that block storage.

## The toggle

The button only has to flip the attribute and save the result. Because the icon is chosen with CSS from the same attribute, it is already correct on first paint — no hydration needed.

Keep the toggle accessible: give it an `aria-label` that describes the action ("Switch to dark theme"), not the current state, and update it whenever the theme changes.
