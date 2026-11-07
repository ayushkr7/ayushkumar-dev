---
title: Notes from a year of TypeScript strict mode
description: What strict caught, what it got in the way of, and the flags I would turn on first.
pubDate: 2025-12-11
tags: [typescript, notes]
---

A year ago I turned on `"strict": true` in a codebase that had grown up without it. The first build had a few hundred errors. Here is what was worth it.

## What it caught

Most errors came from `strictNullChecks`. Many were noise — values that could not actually be `null` — but a handful were real bugs: an optional config field read without a fallback, a `find()` result used without checking it found anything.

```ts
const post = posts.find((p) => p.slug === slug);
// Before: post.title — crashes on an unknown slug.
// After strict: the compiler makes you decide.
if (!post) return notFound();
```

## What got in the way

`noImplicitAny` on old modules produced errors that were tedious rather than useful. Typing a third-party callback correctly can take longer than writing it. A few `// @ts-expect-error` comments with a reason attached were the honest answer.

## The order I’d turn things on

1. `strictNullChecks` — the most real bugs per error.
2. `noImplicitAny` — file by file, starting with new code.
3. `noUncheckedIndexedAccess` — noisy, but it catches off-by-one reads from arrays and records.

## Was it worth it?

Yes. The code didn’t become correct, but the places where it could be wrong became visible — and that is most of what a type system is for.
