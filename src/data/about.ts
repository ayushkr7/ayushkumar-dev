import type { ImageMetadata } from 'astro';
import portrait from '../assets/portrait.jpg';

/**
 * Everything personal on the site lives here: the About page, the header/footer links,
 * the Home intro and RSS metadata all read from this file. Update it without touching
 * any page code.
 *
 * Filled in from the public GitHub profile (github.com/ayushkr7) and a LinkedIn profile export.
 * Anything neither had is a placeholder in [square brackets]. Replace those.
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
  /** Shown as chips under “Stack & languages” on the About page. */
  stack: string[];
  languages: string[];
  email: string;
  social: { github?: string; linkedin?: string; x?: string; mastodon?: string };
  /** Path to a file in public/, e.g. "/resume.pdf". Leave undefined to hide the download link. */
  resume?: string;
}

export const about: About = {
  name: 'Ayush Kumar',
  initials: 'AK',
  role: 'Frontend Developer',
  company: 'Victoria’s Secret & Co.',
  location: 'Bengaluru, India',
  portrait,
  portraitAlt: 'Portrait of Ayush Kumar',
  bio: [
    'I’m a frontend developer at Victoria’s Secret & Co. in Bengaluru. I work across the MERN stack — MongoDB, Express, React and Node.js — and have also built web applications with Django and Dash.',
    'I’m passionate about building for the web, solving problems and learning how systems work under the hood. This blog is where I write down what I learn — notes on Astro, CSS, web performance and the build and deploy steps around them.',
    'On the side I’m building Solve Problemset, a client-side problem-set generator for DSA and competitive-programming practice.',
  ],
  now: {
    updated: new Date('2026-11-07'),
    items: [
      'Working as a Frontend Developer at Victoria’s Secret & Co. in Bengaluru.',
      'Building Solve Problemset, a client-side generator for DSA and competitive-programming problem sets.',
    ],
  },
  experience: [
    {
      when: '2026 — now',
      role: 'Frontend Developer',
      company: 'Victoria’s Secret & Co.',
      summary: '[One sentence on what you work on there.]',
    },
    {
      when: '2023 — 2026',
      role: 'Associate Frontend Web Developer',
      company: 'Victoria’s Secret & Co.',
      summary: '[One sentence on what you worked on there.]',
    },
    {
      when: '2023',
      role: 'Software Engineer Intern',
      company: 'Honeywell',
      summary:
        'Built a remote network-device monitoring tool on SNMPv3, with a Dash dashboard inside a Django app showing live telemetry.',
    },
  ],
  stack: ['React', 'Redux', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Jest'],
  languages: ['JavaScript', 'TypeScript', 'Python', 'C++'],
  email: 'krayush.ak@gmail.com',
  social: {
    github: 'https://github.com/ayushkr7',
    linkedin: 'https://www.linkedin.com/in/krayush-ak/',
    x: 'https://x.com/krayush_ak',
  },
  resume: '/resume.pdf',
};
