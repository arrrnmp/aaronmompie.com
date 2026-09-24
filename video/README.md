# Showcase video

A ~33 second, 1920×1080 showcase of aaronmompie.com for X, made with [Remotion](https://www.remotion.dev). It's one continuous take of the built site in a browser window over a soft wallpaper: small, slow zooms that follow the action, a macOS pointer, and a five-second hold on the footer, scored with "it's complicated", the track that plays on the site's record.

This is a separate npm project. The site's build and Cloudflare deploy never touch it.

## Make it

```bash
# 1. Build the site and serve it on :4400
cd .. && bun run build && npx http-server dist -p 4400 -s &

# 2. Record the take (Playwright + Chrome screencast): public/footage/take.mp4 and take.json, gitignored
cd video && npm i && npm run capture

# 3. Preview, then render to out/showcase.mp4
npm run dev
npm run render
```

## Layout

- `scripts/capture.mjs`: the scripted browser session. It's also where the edit is directed: every `cam(zoom, x, y)` call is a camera move, logged with the cursor path and clicks into `take.json`.
- `src/Showcase.tsx`: the browser window, the camera (zooms stay at or under 1.12 so the window never leaves the frame), the pointer and the music.
- `src/components/Wallpaper.tsx`: the background.
- `src/take.ts`: reads `take.json`: camera easing, cursor interpolation, click presses.
- `src/components/Cursor.tsx`: the macOS arrow and hand.
- `public/og` and `public/media` are symlinks to the site's own fonts and media, so there's only one copy.
