# AGENTS.md

Guidance for coding agents (Claude Code, Codex, OpenCode) working in this repository. `CLAUDE.md` imports this file, so keep everything here.

## Project

Personal site for Aaron Mompié at https://aaronmompie.com. It's a fully static Astro 6 site with an MDX blog, deployed to Cloudflare Workers as static assets.

## Commands

```bash
bun install          # Install dependencies (Bun is the package manager, and Cloudflare builds with it too)
bun run dev          # Dev server at localhost:4321
bun run build        # Production build to ./dist/
bun run check        # Type-check (astro check)
bun run preview      # Build, then serve through wrangler like production
```

There are no test or lint scripts. Before you finish a change, run `bun run check` and `bun run build`; both must pass.

## Deployment

- Cloudflare **Workers Builds** is connected to GitHub. A push to `main` builds and deploys the Worker `personal-brand-astro` (see `wrangler.jsonc`). Pushes to other branches upload preview versions.
- There are no GitHub Actions. The Worker serves `./dist` as static assets, with no server code.
- Commit `bun.lock` whenever dependencies change, because Cloudflare installs from it.

## Structure

```
src/
├── assets/                 # Images processed by astro:assets
├── components/
│   ├── BaseHead.astro      # <head>: SEO/OG/Twitter meta, self-hosted fonts, view transitions, page-load scripts
│   ├── Header.astro        # Site header + mobile menu (transition:persist)
│   ├── HeaderLink.astro    # Desktop nav link with active state
│   ├── ContactSection.astro# Shared "Contact" section with the full-width email
│   ├── Footer.astro
│   ├── FormattedDate.astro
│   └── TableOfContents.astro
├── content/blog/           # Blog posts (.md/.mdx)
├── content/projects/       # One .md per project; the body is the long description
├── content.config.ts       # Collection schemas (blog, projects)
├── consts.ts               # Site name, role (SITE_ROLE), email, CV and social URLs: import from here and never hardcode
├── layouts/
│   ├── BlogPost.astro      # Article layout: TOC, reading time, tags, BlogPosting JSON-LD
│   └── Page.astro          # Simple page layout (used by 404)
├── pages/
│   ├── index.astro         # Home: hero, latest writing (only if posts exist), contact
│   ├── projects.astro      # Work: the projects collection, sorted by `order`
│   ├── about.astro
│   ├── 404.astro
│   ├── blog/index.astro, blog/[...slug].astro, blog/tag/[tag].astro
│   ├── rss.xml.js
│   ├── llms.txt.ts         # /llms.txt (llmstxt.org), generated from consts, projects and posts
│   └── og-image.png.ts     # Default OG image, rendered to PNG with sharp at build time
├── styles/                 # See "Styling"
└── utils/                  # nav.ts (active-link matching), slug.ts, reading-time.ts
public/                     # Served as-is (favicon, robots.txt, cv.pdf)
```

## Styling

- Plain CSS: there's no Tailwind or other framework. Write hand-made classes that use the design tokens.
- `src/styles/global.css` is only an ordered list of `@import`s. **The import order is the cascade order**, so put new rules in the file that owns them and keep the order intact:
  `reset` → `tokens` → `base` → `layout` → `typography` → `components/*` → `pages/*` → `motion` → `responsive` → `reduced-motion`.
- `reset.css` sits in `@layer base`, so any unlayered rule beats it.
- The design tokens live on `:root` in `tokens.css` (`--paper*`, `--ink*`, `--accent*`, `--font-*`, motion and layout values). Use them instead of hardcoded values.
- Page-only styles can go in a scoped `<style>` block in the page.

## Fonts

- Archivo (variable, 100–900, roman and italic) and Instrument Serif (400, roman and italic) are configured in the `fonts` array of `astro.config.mjs`.
- Astro downloads them at build time and serves them from our own domain. Both are SIL OFL 1.1, which allows self-hosting.
- `BaseHead.astro` renders them with `<Font cssVariable="…" />`. `tokens.css` maps `--font-sans`, `--font-display` and `--font-serif` to those variables.

## Animation

Both systems below respect `prefers-reduced-motion`; the overrides are in `reduced-motion.css`.

1. **Entrance animations**: the `anim-fade-up`, `anim-fade-down`, `anim-slide-right` and `reveal-line` classes, staggered with the `--delay` custom property.
   - On pages already visited this session they're skipped via `html.has-visited`, which `BaseHead.astro` sets from `sessionStorage`.
   - Line reveals wait for `html.fonts-loaded`.
2. **Scroll reveal**: `.reveal` becomes `.is-visible`. It's driven by one `IntersectionObserver` in `BaseHead.astro` that re-runs on every `astro:page-load`. Don't add observers in pages.

## Conventions

- **View transitions** (`ClientRouter`) are on:
  - The header and mobile menu use `transition:persist`.
  - `Header.astro` recomputes the active link on `astro:page-load` and closes the menu on `astro:before-swap`. Keep both.
- **Active link matching**: use `isActivePath` from `src/utils/nav.ts`. The server (`HeaderLink.astro`) and the client script in `Header.astro` share it.
- **Components**: `.astro` components declare a typed `Props` interface and destructure `Astro.props`.
- **Blog content**:
  - Frontmatter needs `title`, `description` and `pubDate`. It can also have `updatedDate`, `heroImage` (an `image()` asset path relative to the post, not a URL), `draft` and `tags`.
  - `draft: true` hides a post everywhere: list, pages, tags, RSS, llms.txt and the nav's "Writing" link.
  - Tag URLs go through `slugify()`.
  - The list and article views share `transition:name={`post-image-${post.id}`}`, so keep them in sync.
- **Job title**: always `SITE_ROLE` ("Infrastructure engineer"). It's used in the footer, meta description, JSON-LD and OG image, so never type it out.
- **Projects**:
  - Frontmatter needs `title`, `description` (one line), `role`, `techStack` and `order`. It can also have `url`, `github`, `cover` (an `image()` screenshot next to the file), `featured` and `draft`.
  - The Markdown body is the long description shown on the Work page.
- **Images**: use `astro:assets` (`Image` / `Picture`) with `formats={["avif", "webp"]}`.
- **Reading time**: `src/utils/reading-time.ts` counts 200 words per minute over the raw Markdown body.
- **TypeScript**: strict mode. Avoid `any`, and use kebab-case filenames for utilities.
- **Line endings**: LF with tab indentation (see `.editorconfig`).
