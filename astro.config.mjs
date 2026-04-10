// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/projects/rmc') && !page.includes('/projects/vybe') && !page.includes('/sponsorship'),
    }),
  ],
  site: 'https://dillonlui.com',
  output: 'static',
});
