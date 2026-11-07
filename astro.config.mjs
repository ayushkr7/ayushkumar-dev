// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { lightTheme, darkTheme, codeFigure } from './src/lib/shiki.ts';
import rehypeMermaid from './src/lib/rehype-mermaid.ts';

// https://astro.build/config
export default defineConfig({
  // Sample domain — replace with your real domain (used for canonical URLs, RSS and the sitemap).
  site: 'https://elliotalderson.dev',
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: {
    build: {
      // Mermaid's chunks are large but only lazy-loaded on posts that contain a diagram.
      chunkSizeWarningLimit: 1000,
    },
  },
  markdown: {
    // ```mermaid blocks are rendered as diagrams, not highlighted as code.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid', 'math'] },
    rehypePlugins: [rehypeMermaid],
    shikiConfig: {
      themes: { light: lightTheme, dark: darkTheme },
      // Emit only --shiki-light / --shiki-dark variables; CSS picks one based on [data-theme].
      defaultColor: false,
      transformers: [codeFigure()],
    },
  },
});
