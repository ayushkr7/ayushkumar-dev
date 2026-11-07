---
title: Container queries in practice
description: Components that adapt to their container instead of the viewport.
pubDate: 2025-06-19
tags: [css]
---

Media queries answer “how wide is the screen?”. Components usually need to know something else: “how wide is the space I was given?”. Container queries answer that.

## Declare a container

Any element can become a query container. `inline-size` is the common case — it tracks width only, which avoids layout loops.

```css title="src/styles/card.css"
.card-grid > * {
  container-type: inline-size;
}

.card {
  display: grid;
  gap: 12px;
}

@container (min-width: 420px) {
  .card {
    grid-template-columns: 120px 1fr;
  }
}
```

The same card now stacks in a narrow sidebar and sits side by side in the main column, without either layout knowing about the other.

## Container units

Inside a container, `cqi` is 1% of its inline size. It is handy for type that should scale with the component rather than the viewport:

```css
.card__title {
  font-size: clamp(1rem, 4cqi, 1.375rem);
}
```

## When to still use media queries

Page-level layout — how many columns, whether the navigation collapses — still depends on the viewport. Use media queries for the page and container queries for the pieces inside it.
