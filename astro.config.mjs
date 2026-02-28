// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeSubsectionAnchors from './plugins/rehype-subsection-anchors.mjs';

export default defineConfig({
  site: 'https://federal-rules.com',
  integrations: [
    sitemap({
      filter: (page) =>
        // Exclude historical year pages (they're noindex'd)
        !/\/(civil|criminal|appellate|evidence|bankruptcy)\/[^/]+\/\d{4}\/$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  build: {
    concurrency: 2,
  },
  markdown: {
    rehypePlugins: [rehypeSubsectionAnchors],
  },
});