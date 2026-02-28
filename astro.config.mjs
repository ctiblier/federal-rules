// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import rehypeSubsectionAnchors from './plugins/rehype-subsection-anchors.mjs';

export default defineConfig({
  site: 'https://federal-rules.com',
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