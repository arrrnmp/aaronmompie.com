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
├── components/
│   ├── BaseHead.astro        # <head>: SEO/OG/Twitter meta, self-hosted fonts
│   ├── Header.astro          # Sticky header: AM mark (grows into the name), nav, Hire me button, phone menu
│   ├── Finale.astro          # Full-screen blue contact footer, revealed as the page lifts off it
│   ├── home/                 # Home sections: Hero (+ facts band), Experience, Projects, TwoSides (the record)
│   ├── PostList.astro, TableOfContents.astro, FormattedDate.astro
├── content/blog/             # Blog posts (.md/.mdx); all drafts for now, so "Writing" is hidden
├── content/projects/         # One .md per project; the body is the long description; `featured: true` = the big card
├── content.config.ts         # Collection schemas (blog, projects)
├── i18n/
│   ├── ui.ts                 # ALL page copy, English and Spanish (Spain), incl. experience, timeline and the About story
│   └── routes.ts             # Page paths per language, the EN/ES switch target, hreflang
├── consts.ts                 # Site name, role (SITE_ROLE), email, CV and social URLs: import from here and never hardcode
├── layouts/
│   ├── Site.astro            # Every page: the "sheet" (header + content) over the fixed Finale footer
│   └── BlogPost.astro        # Article layout: TOC, reading time, tags, BlogPosting JSON-LD
├── views/                    # Home, About, Work: one view per page, rendered by both the English and the Spanish route
├── pages/                    # index, about, projects (+ es/index, es/sobre-mi, es/proyectos), 404, blog/…, rss.xml, llms.txt, og-image.png
├── scripts/
│   ├── dot-field.ts          # The dot portraits (hero and footer) with the photo reveal under the pointer
│   └── record.ts             # The two-sided record: sleeve/record/tonearm moves, cover and label art, audio player
├── styles/                   # See "Styling"
└── utils/                    # nav.ts (active-link matching), slug.ts, reading-time.ts
public/
├── cv_en.pdf, cv_es.pdf    # One CV per language
└── media/                    # Dot density maps, cut-out photos, record covers, its-complicated.mp3
```

## Styling

- Plain CSS: there's no Tailwind or other framework. Write hand-made classes that use the design tokens.
- `src/styles/global.css` is only an ordered list of `@import`s. **The import order is the cascade order**:
  `reset` → `tokens` → `base` → `components/*` → `pages/*` → `responsive` → `reduced-motion`.
- `reset.css` sits in `@layer base`, so any unlayered rule beats it.
- Tokens live on `:root` in `tokens.css`. The site is **dark-first**: bare `:root` is the dark palette, and `data-theme="light"` (or `prefers-color-scheme: light` before any script runs) swaps in the light one. `BaseHead.astro` sets `data-theme` before first paint from the saved choice (`localStorage.theme`) or the device setting; the header button flips and saves it. Key tokens: `--bg`, `--text`, `--muted`, `--line`, `--blue` (#2b3bff), `--blue-ink` (accent text), `--g` (side gutter), `--name` (size of the big name).
- Breakpoints (in `responsive.css`): 1100px tablet, 820px tablet portrait and phones (collapsed nav, stacked hero), 640px phones.
- Check new work at real browser sizes, not just 1440×900: 1920×937, 1536×730, 1366×657, iPad both ways, 390×844 and 360×740.

## Fonts

- Unbounded (the big name, headings), Big Shoulders at its 72pt "Display" optical size (condensed uppercase labels and titles) and Instrument Sans (body). All three are SIL OFL and configured in the `fonts` array of `astro.config.mjs`; Astro downloads them at build time and serves them from our own domain.
- `tokens.css` maps `--display`, `--cond` and `--sans` to the font variables. Use those tokens, never family names: Astro renames families with a hash. In canvas code, read the real family from an element's computed `fontFamily` (see `record.ts`).

## Motion

- Everything that moves on its own (the dot portraits, the facts ticker, the spinning record) follows `prefers-reduced-motion`. Viewers who ask for less motion get the still stipple and a stopped ticker. Keep it that way for anything new.
- There are no view transitions (`ClientRouter`); pages are plain multi-page navigations with hover prefetching.

## Languages

- English lives at the root, Spanish under `/es/` with Spanish slugs (`/es/sobre-mi`, `/es/proyectos`). Add a page to both by listing it in `src/i18n/routes.ts` and rendering the same view from both routes.
- Components get the language from the URL with `langFromUrl(Astro.url)` and their copy from `t(lang)`. Never hardcode visible text in a component; add it to both languages in `ui.ts` (the Spanish object is typed against the English one, so a missing key fails `astro check`).
- Spanish copy is written for a Spain audience, not translated word for word: Spanish number format (767.000), SMR/Grado Medio naming, "Técnico de infraestructura" rather than "Ingeniero" (a regulated title in Spain).
- Projects keep their English copy in the file and Spanish in the `es:` frontmatter block.
- The blog is English-only for now; `/es/` pages link to it as is.

## Conventions

- **Active nav link**: `Header.astro` marks the current page with `aria-current` using `isActivePath` from `src/utils/nav.ts`.
- **Contact**: every page ends with the Finale footer (`id="contact"`); `href="#contact"` links scroll to the very bottom.
- **Components**: `.astro` components declare a typed `Props` interface and destructure `Astro.props`.
- **Blog content**:
  - Frontmatter needs `title`, `description` and `pubDate`. It can also have `updatedDate`, `heroImage` (an `image()` asset path relative to the post, not a URL), `draft` and `tags`.
  - `draft: true` hides a post everywhere: list, pages, tags, RSS, llms.txt and the nav's "Writing" link.
  - Tag URLs go through `slugify()`.
- **Job title**: always `SITE_ROLE` ("Infrastructure engineer"). It's used in the hero, meta description, JSON-LD and OG image, so never type it out.
- **Projects**:
  - Frontmatter needs `title`, `description` (one line, used on the home cards and llms.txt), `role`, `techStack` and `order`. It can also have `url`, `github`, `cover`, `featured` and `draft`.
  - The Markdown body is the long description shown on the Work page (and on the home page for the featured project).
  - Exactly one project should be `featured: true`; it gets the big card on the home page.
- **Images**: use `astro:assets` (`Image` / `Picture`) with `formats={["avif", "webp"]}`.
- **Reading time**: `src/utils/reading-time.ts` counts 200 words per minute over the raw Markdown body.
- **TypeScript**: strict mode. Avoid `any`, and use kebab-case filenames for utilities.
- **Line endings**: LF with tab indentation (see `.editorconfig`).
