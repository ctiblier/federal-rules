// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import rehypeSubsectionAnchors from './plugins/rehype-subsection-anchors.mjs';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  markdown: {
    rehypePlugins: [rehypeSubsectionAnchors],
  },
});