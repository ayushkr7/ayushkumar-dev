import { about } from './about';

/** Site-wide metadata. The canonical origin is `site` in astro.config.mjs. */
export const site = {
  name: 'elliotalderson.dev',
  title: 'elliotalderson.dev — notes on building fast, durable software for the web',
  description: `${about.name} writes about TypeScript, Astro, CSS, web performance and the tools used to ship them.`,
  author: about.name,
  email: about.email,
  github: about.social.github,
  year: 2026,
};
