---
title: A tiny CI pipeline for static sites
description: Type-check, build and link-check on every push, then deploy the dist folder.
pubDate: 2025-08-05
tags: [devops, tooling]
---

A static site needs very little CI, but it needs it on every push. Mine does four things, in order, and fails fast.

## The workflow

```yaml title=".github/workflows/ci.yml"
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx astro check
      - run: npm run build
      - run: npx linkinator ./dist --recurse --silent
```

## Why this order

`astro check` is the fastest way to fail: a type error in a component or a frontmatter field that doesn’t match the schema. The build comes next, then the link check runs against real output.

## Deploying

On the main branch, upload `dist/` to the host. Most static hosts accept a folder; the deploy step is a single command, and the previous version stays available for an instant rollback.

## Keep it small

Every step added to CI runs thousands of times. If a check hasn’t caught anything in six months, it is a candidate for removal — not because it is wrong, but because the pipeline should stay fast enough that nobody is tempted to skip it.
