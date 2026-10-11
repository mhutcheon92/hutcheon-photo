// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import resizedImages from './src/integrations/resized-images.mjs';

export default defineConfig({
  redirects: {
    '/pricing': '/investment',
  },
  output: 'static',
  adapter: vercel(),
  integrations: [react(), keystatic(), resizedImages()],
});
