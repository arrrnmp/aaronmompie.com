# aaronmompie.com

My personal site: who I am, what I build, and eventually what I write.

**Live:** https://aaronmompie.com

## Stack

- [Astro 6](https://astro.build), fully static, with MDX for writing
- Plain CSS split into per-concern files (`src/styles/`), no framework
- Self-hosted Unbounded, Big Shoulders and Instrument Sans through Astro's fonts API
- Deployed to **Cloudflare Workers** (static assets) with Workers Builds

## Develop

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev        # http://localhost:4321
bun run check      # type-check
bun run build      # static output in ./dist
bun run preview    # build + serve through wrangler, like production
```

## Deploy

Every push to `main` builds and deploys on Cloudflare automatically. Other branches get preview URLs. There's no manual step.

## Where things live

| What | Where |
| --- | --- |
| Site name, job title, email, links | `src/consts.ts` |
| Projects | `src/content/projects/` (one file each, `order` sorts them) |
| Blog posts | `src/content/blog/` (`draft: true` hides a post) |
| CV | `public/cv.pdf` |
| Styles and design tokens | `src/styles/` (`tokens.css` for colors, fonts, motion) |
| Notes for coding agents | [`AGENTS.md`](AGENTS.md) |

