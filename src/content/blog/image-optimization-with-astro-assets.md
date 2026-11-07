---
title: Image optimization with astro:assets
description: Responsive images, modern formats and layout shift, handled at build time.
pubDate: 2025-10-30
tags: [astro, performance]
---

Images are usually the heaviest thing on a page. `astro:assets` resizes and converts them during the build, so the browser gets a file sized for the layout instead of the original from your camera.

## Import, then render

Importing a local image gives Astro its dimensions, which it writes into the `width` and `height` attributes. That alone prevents layout shift: the browser reserves the space before the file arrives.

```astro title="src/pages/about.astro"
---
import { Image } from 'astro:assets';
import portrait from '../assets/portrait.jpg';
---

<Image src={portrait} alt="Portrait of the author" width={176} height={176} />
```

The output is a WebP at the requested size, with a hashed file name that can be cached forever.

## Responsive sizes

For images that change width with the layout, pass `widths` and `sizes` so the browser can pick:

```astro
<Image src={hero} alt="" widths={[480, 960, 1440]} sizes="(min-width: 768px) 696px, 100vw" />
```

## Alt text is part of the job

An optimized image without meaningful `alt` text is still a broken image for some readers. Describe what the image shows in context — and use `alt=""` for purely decorative images so screen readers skip them.
