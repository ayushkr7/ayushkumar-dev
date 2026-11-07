/**
 * GitHub Pages serves the site from a sub-path (`base` in astro.config.mjs, e.g. /ayushkumar-dev), so every
 * internal link and every file in public/ needs that prefix. Write root-relative paths through withBase():
 *   withBase('/blog/')  →  '/ayushkumar-dev/blog/'
 * With no `base` (a custom domain), it returns the path unchanged.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path: string) => `${base}${path}`;
