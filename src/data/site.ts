import { about } from './about';

/** Site-wide metadata. The canonical origin is `site` in astro.config.mjs. */
export const site = {
  // Shown as the logo and in page titles.
  name: 'ayushkumar.dev',
  title: `${about.name} — notes on software engineering and the systems behind it`,
  description: `${about.name} writes about software engineering, with a focus on web applications and how they work under the hood.`,
  author: about.name,
  email: about.email,
  github: about.social.github,
  year: 2026,
};
