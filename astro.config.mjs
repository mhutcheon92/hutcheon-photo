// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [react(), keystatic()],
  vite: {
    ssr: {
      noExternal: ['@keystatic/astro', '@keystatic/core'],
    },
  },
});
