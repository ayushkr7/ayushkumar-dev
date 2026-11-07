---
title: Content collections, three ways
description: Markdown, MDX and a remote CMS behind the same typed collection API.
pubDate: 2026-09-02
tags: [astro, content]
---

Content collections give every entry a schema and every query a type. Since the Content Layer API, where the content comes from is a detail of the loader — the pages that render it don’t change.

## 1. Markdown files

The `glob` loader reads files from a folder. This blog uses exactly this setup.

```ts title="src/content.config.ts"
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

## 2. MDX for the posts that need components

Add `@astrojs/mdx` and the same glob picks up `.mdx` files. Posts can import components — a callout, a chart, an interactive demo — while staying in the same collection with the same schema.

## 3. A remote CMS

A loader is just an object with a `load` function. Fetch entries from an API and hand them to the store:

```ts title="src/loaders/cms.ts"
import type { Loader } from 'astro/loaders';

export function cmsLoader(endpoint: string): Loader {
  return {
    name: 'cms',
    async load({ store, parseData }) {
      const items = await fetch(endpoint).then((res) => res.json());
      store.clear();
      for (const item of items) {
        store.set({ id: item.slug, data: await parseData({ id: item.slug, data: item }) });
      }
    },
  };
}
```

## The part that stays the same

Whichever loader you use, pages call `getCollection('blog')` and get typed entries back. Moving from files to a CMS later is a change to one config file, not to every page.
