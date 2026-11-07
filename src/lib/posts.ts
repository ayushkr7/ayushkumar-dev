import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './url';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts are only visible in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const postUrl = (post: Post | string) => withBase(`/blog/${typeof post === 'string' ? post : post.id}/`);
export const tagUrl = (tag: string) => withBase(`/blog/?tag=${encodeURIComponent(tag)}`);

/** Tags used by the given posts, most used first (ties alphabetical). */
export function getTags(posts: Post[]): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
}

const WORDS_PER_MINUTE = 200;

/** Minutes to read the raw Markdown/MDX body at ~200 wpm, rounded up. */
export function readingTime(body = ''): number {
  const text = body
    .replace(/^\s*(import|export)\s.*$/gm, '') // MDX imports/exports
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ') // HTML/JSX tags (keep their text)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> link text
    .replace(/[#>*_`~|-]+/g, ' '); // markdown punctuation
  const words = text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

const longDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' });
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' });
const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "Oct 24, 2026" */
export const formatDate = (date: Date) => longDate.format(date);
/** "Oct 24" */
export const formatShortDate = (date: Date) => shortDate.format(date);
/** "Oct 2026" */
export const formatMonthYear = (date: Date) => monthYear.format(date);
/** "2026-10-24" for <time datetime> */
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
