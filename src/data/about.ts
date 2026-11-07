import type { ImageMetadata } from 'astro';

/**
 * Everything personal on the site lives here: the About page, the header/footer links,
 * the Home intro and RSS metadata all read from this file. Update it without touching
 * any page code. The current values are a fictional sample persona; replace them with your own.
 */

export interface Job {
  /** e.g. "2024 — now" */
  when: string;
  role: string;
  company: string;
  summary: string;
}

export interface About {
  name: string;
  /** Shown in the round portrait until `portrait` is set. */
  initials: string;
  role: string;
  company: string;
  location: string;
  /**
   * Optional portrait, rendered with astro:assets. To add one:
   *   import portrait from '../assets/portrait.jpg';  …  portrait,
   */
  portrait?: ImageMetadata;
  portraitAlt: string;
  /** 2–3 paragraphs. */
  bio: string[];
  now: { updated: Date; items: string[] };
  experience: Job[];
  uses: { label: string; value: string }[];
  email: string;
  social: { github?: string; linkedin?: string; mastodon?: string };
  /** Path to a file in public/, e.g. "/resume.pdf". Leave undefined to hide the download link. */
  resume?: string;
}

export const about: About = {
  name: 'Elliot Alderson',
  initials: 'EA',
  role: 'Software Engineer',
  company: 'E Corp',
  location: 'New York, USA',
  portraitAlt: 'Portrait of Elliot Alderson',
  bio: [
    'I’m a Software Engineer who spends the day working out how systems fail. Most evenings I end up rebuilding something small to understand it better, which is how I started caring about fast, accessible websites.',
    'This blog is where I write those experiments down — notes on Astro, CSS, web performance and the build and deploy steps around them. Posts are practical and short enough to read over a coffee.',
    'I learned computers at my father’s repair shop, Mr. Robot, and taught myself the rest. Some people know me online as samsepi0l.',
  ],
  now: {
    updated: new Date('2026-10-01'),
    items: [
      'Writing a short series on Astro content collections.',
      'Maintaining astro-minimal-blog, the starter theme behind this site.',
      'Taking Flipper on longer walks, away from every screen I own.',
    ],
  },
  experience: [
    {
      when: '2024 — now',
      role: 'Software Engineer',
      company: 'E Corp',
      summary: 'Work on the cybersecurity team at the conglomerate I still call Evil Corp.',
    },
    {
      when: '2021 — 2024',
      role: 'Senior Software Engineer',
      company: 'Allsafe Cybersecurity',
      summary: 'Protected client networks, with E Corp as the largest account.',
    },
    {
      when: '2018 — 2021',
      role: 'Security Engineer',
      company: 'Amaya',
      summary: 'Worked in the encryption division of a San Francisco quantum computing company.',
    },
  ],
  uses: [
    { label: 'Editor', value: 'Vim' },
    { label: 'Terminal', value: 'GNOME Terminal' },
    { label: 'Machine', value: 'Kali Linux laptop, Raspberry Pi' },
    { label: 'Languages', value: 'TypeScript, CSS' },
    { label: 'Framework', value: 'Astro' },
    { label: 'Search', value: 'Pagefind' },
    { label: 'Type', value: 'IBM Plex Sans & Mono' },
    { label: 'Hosting', value: 'Steel Mountain' },
  ],
  email: 'samsepi0l@elliotalderson.dev',
  social: {
    github: 'https://github.com/elliotalderson-dev',
    linkedin: 'https://www.linkedin.com/in/elliotalderson-dev',
    mastodon: 'https://mastodon.social/@elliot_alderson_dev',
  },
  resume: '/resume.pdf',
};
