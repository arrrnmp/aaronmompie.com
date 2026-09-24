# Showcase video

A ~41 second, 1920×1080 showcase of aaronmompie.com for X, made with [Remotion](https://www.remotion.dev). It's real footage of the built site in a browser frame, scored with "it's complicated", the track that plays on the site's record.

This is a separate npm project. The site's build and Cloudflare deploy never touch it.

## Make it

```bash
# 1. Build the site and serve it on :4400
cd .. && bun run build && npx http-server dist -p 4400 -s &

# 2. Record the footage (Playwright + Chrome screencast, into public/footage/, gitignored)
cd video && npm i && npm run capture          # or: npm run capture -- hero record

# 3. Preview, then render to out/showcase.mp4
npm run dev
npm run render
```

## Layout

- `src/Showcase.tsx`: the timeline (scenes, cuts, music).
- `src/scenes/`: `Hook`, `SiteScene` (captioned browser footage, used five times), `PhoneScene`, `Outro`.
- `src/brand.ts`: the site's fonts and colours.
- `scripts/capture.mjs`: the scripted browser sessions that make each clip.
- `public/og` and `public/media` are symlinks to the site's own share-image fonts and media, so there's only one copy.
