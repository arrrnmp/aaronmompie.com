// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';
import { alternate, isShared } from './src/i18n/routes.ts';

const SITE = 'https://aaronmompie.com';

// The blog stays out of the sitemap until a post is published (drafts are hidden everywhere).
const hasPosts = readdirSync('./src/content/blog').some(
  (f) => /\.mdx?$/.test(f) && !/^draft:\s*true/m.test(readFileSync(`./src/content/blog/${f}`, 'utf8')),
);

/**
 * Astro loads each component script as its own module, and Vite puts code they share
 * (dot-field.ts) in a chunk that only starts downloading once the script importing it
 * has arrived. This lists those static imports as <link rel="modulepreload"> in each
 * page's <head>, so everything downloads at once instead of one after the other.
 * @returns {import('astro').AstroIntegration}
 */
function preloadModules() {
  return {
    name: 'preload-modules',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        const html = readdirSync(root, { recursive: true }).filter((f) => String(f).endsWith('.html'));
        for (const file of html) {
          const path = join(root, String(file));
          const page = readFileSync(path, 'utf8');
          const deps = new Set();
          for (const [, src] of page.matchAll(/<script type="module" src="(\/assets\/[^"]+\.js)"/g)) {
            const code = readFileSync(join(root, src), 'utf8');
            // Static imports only (`from"./x.js"`, `import"./x.js"`); dynamic `import("./x.js")` stays lazy.
            for (const [, dep] of code.matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)) deps.add(`/assets/${dep}`);
          }
          if (!deps.size) continue;
          const links = [...deps].map((d) => `<link rel="modulepreload" href="${d}">`).join('');
          writeFileSync(path, page.replace('</head>', `${links}</head>`));
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE,

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  integrations: [
    mdx(),
    preloadModules(),
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