import { about } from './about';

/** Site-wide metadata. The canonical origin is `site` in astro.config.mjs. */
export const site = {
  // The domain, shown as the logo. Keep in sync with `site` in astro.config.mjs and public/robots.txt.
  name: 'ayushkumar.dev',
  title: `${about.name} — notes on building fast, durable software for the web`,
  description: `${about.name} writes about TypeScript, Astro, CSS, web performance and the tools used to ship them.`,
  author: about.name,
  email: about.email,
  github: about.social.github,
  year: 2026,
};
