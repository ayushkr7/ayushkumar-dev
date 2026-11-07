import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string().transform((tag) => tag.trim().toLowerCase())).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: file('src/data/projects.json'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    status: z.enum(['active', 'maintained', 'archived']),
    stack: z.array(z.string()).default([]),
    year: z.number().int(),
    /** Last meaningful update; used to order cards within a status. Falls back to `year`. */
    updated: z.coerce.date().optional(),
    demo: z.string().url().optional(),
    source: z.string().url().optional(),
    npm: z.string().url().optional(),
    post: reference('blog').optional(),
  }),
});

export const collections = { blog, projects };
