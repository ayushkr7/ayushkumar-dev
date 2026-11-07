---
title: Self-hosting fonts the boring way
description: Subsetting, preloading and font-display choices that keep text visible while fonts load.
pubDate: 2026-03-27
tags: [performance, css]
---

A third-party font CDN costs a DNS lookup, a connection and a request before the first glyph renders. Self-hosting removes all three, and with Fontsource it takes one install.

## Install only the weights you use

This site uses three weights of IBM Plex Sans and two of Plex Mono. Import exactly those:

```ts title="src/layouts/BaseLayout.astro"
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
```

Each import brings a set of `@font-face` rules split by `unicode-range`, so a page in English only downloads the Latin subset.

## Choose font-display

Fontsource uses `font-display: swap`: text renders immediately in a fallback font and swaps when the web font arrives. Readers never stare at invisible text, which matters more than a brief change of typeface.

## Preload the one that matters

Preload the body font so it is requested with the HTML instead of after the CSS is parsed:

```html
<link rel="preload" href="/fonts/plex-sans-latin-400.woff2" as="font" type="font/woff2" crossorigin />
```

Preload two or three files at most. Preloading everything just moves the queue.

## Check the result

In DevTools, throttle to “Slow 4G” and reload. The text should appear at once and shift very little when the font swaps. If it jumps, look at a fallback with `size-adjust` so the two fonts take up the same space.
