// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://aaronmompie.com',

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  integrations: [mdx(), sitemap()],

  // Downloaded at build time and served from our own domain (all three are OFL-licensed).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Unbounded',
      cssVariable: '--font-unbounded',
      weights: ['500 900'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Arial Black', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Big Shoulders',
      cssVariable: '--font-big-shoulders',
      weights: ['700 900'],
      // The tall "Display" cut is the top of the optical-size axis.
      options: { experimental: { variableAxis: { opsz: ['72'] } } },
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Arial Narrow', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Instrument Sans',
      cssVariable: '--font-instrument-sans',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

  vite: {
    css: {
      transformer: 'lightningcss',
    },
    build: {
      cssMinify: 'lightningcss',
    },
  },

  output: 'static',

  build: {
    assets: 'assets',
    inlineStylesheets: 'always',
  },
});