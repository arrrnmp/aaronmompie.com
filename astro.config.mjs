// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig, fontProviders } from 'astro/config';
import { alternate, isShared } from './src/i18n/routes.ts';

const SITE = 'https://aaronmompie.com';

// The blog stays out of the sitemap until a post is published (drafts are hidden everywhere).
const hasPosts = readdirSync('./src/content/blog').some(
  (f) => /\.mdx?$/.test(f) && !/^draft:\s*true/m.test(readFileSync(`./src/content/blog/${f}`, 'utf8')),
);

// https://astro.build/config
export default defineConfig({
  site: SITE,

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => hasPosts || !new URL(page).pathname.startsWith('/blog'),
      // Pair every page with its other-language version (hreflang), like the <link rel="alternate"> tags in BaseHead.
      serialize(item) {
        const { pathname } = new URL(item.url);
        if (isShared(pathname)) {
          item.links = [
            { lang: 'en', url: new URL(alternate(pathname, 'en'), SITE).href },
            { lang: 'es', url: new URL(alternate(pathname, 'es'), SITE).href },
            { lang: 'x-default', url: new URL(alternate(pathname, 'en'), SITE).href },
          ];
        }
        return item;
      },
    }),
  ],

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