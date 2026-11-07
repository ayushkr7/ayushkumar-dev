// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { lightTheme, darkTheme, codeFigure } from './src/lib/shiki.ts';
import rehypeMermaid from './src/lib/rehype-mermaid.ts';

// https://astro.build/config
export default defineConfig({
  // Used for canonical URLs, RSS and the sitemap. Keep in sync with site.name and public/robots.txt.
  site: 'https://ayushkumar.dev',
  output: 'static',
  integrations: [mdx(), sitemap()],
  experimental: {
    // Astro also generates a fallback for each font, scaled to match its size, so text barely moves when it swaps in.
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: 'IBM Plex Sans',
        cssVariable: '--font-sans',
        weights: [400, 500, 600],
        styles: ['normal'],
        display: 'swap',
        fallbacks: ['system-ui'],
      },
      {
        provider: fontProviders.fontsource(),
        name: 'IBM Plex Mono',
        cssVariable: '--font-mono',
        weights: [400, 500],
        styles: ['normal'],
        display: 'swap',
        fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    ],
  },
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
