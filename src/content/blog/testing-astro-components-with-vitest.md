---
title: Testing Astro components with Vitest
description: Rendering components to strings with the container API and asserting on the HTML.
pubDate: 2026-05-18
tags: [testing, astro]
---

Astro components run on the server and produce HTML, which makes them pleasant to test: render to a string, then assert on the string. The container API does the rendering without starting a server.

## Set up Vitest

Use Astro’s `getViteConfig` so tests understand `.astro` files, aliases and virtual modules.

```ts title="vitest.config.ts"
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'node',
  },
});
```

## Render and assert

```ts title="src/components/PostList.test.ts"
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Note from './Note.astro';

test('Note starts with a bold label', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Note, {
    slots: { default: 'components ship no JavaScript by default.' },
  });

  expect(html).toContain('<strong>Note:</strong>');
  expect(html).toContain('aria-label="Note"');
});
```

## What to test

Test the logic you wrote, not the framework: date formatting, read-time calculation, which links a project card shows. Those are plain functions — test them directly and keep component tests for markup that carries meaning, like ARIA attributes.

Snapshot tests of whole pages tend to fail on every copy edit and get updated without being read. A handful of targeted `toContain` assertions age much better.
