---
title: Type-safe environment variables in Astro
description: Using astro:env to validate config at build time instead of discovering a typo in production.
pubDate: 2026-09-21
tags: [typescript, astro]
---

`import.meta.env.API_URL` is typed as `string | undefined` at best, and as `any` at worst. A missing variable shows up as a broken request in production rather than a failed build. Astro’s `astro:env` module fixes that by letting you declare a schema.

## Declare a schema

Variables are declared in the config with a type, a context (`client` or `server`) and an access level (`public` or `secret`).

```js title="astro.config.mjs"
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  env: {
    schema: {
      SITE_URL: envField.string({ context: 'client', access: 'public' }),
      API_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      CACHE_TTL: envField.number({ context: 'server', access: 'public', default: 300 }),
    },
  },
});
```

If `SITE_URL` is missing or `CACHE_TTL` is not a number, the build fails with a message that names the variable.

## Import, don’t reach

Instead of reading `import.meta.env`, import the value from the virtual module that matches its context:

```ts title="src/lib/api.ts"
import { API_TOKEN, CACHE_TTL } from 'astro:env/server';

export async function fetchStats() {
  const res = await fetch('https://api.example.com/stats', {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  return { data: await res.json(), ttl: CACHE_TTL };
}
```

`CACHE_TTL` is a `number` here, not a string you have to parse.

## Secrets stay on the server

Importing `astro:env/server` from client code is a build error, so a secret can’t end up in a browser bundle by accident. That one guarantee is worth the few minutes it takes to write the schema.
