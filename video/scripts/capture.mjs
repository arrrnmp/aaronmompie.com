// Records one continuous take of the built site into public/footage/take.mp4,
// plus public/footage/take.json: the cursor path, clicks and camera moves, timed
// against the clip, so the video can draw a cursor and zoom in sync.
// Usage: from video/, with the site built and served at http://localhost:4400 (see README):
//   npm run capture
// Frames come from Chrome's screencast (sharp JPEGs, real timestamps) and are
// stitched into a constant 30 fps clip with Remotion's bundled ffmpeg.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const BASE = process.env.SITE_URL ?? "http://localhost:4400";
const OUT = resolve("public/footage");
const TMP = resolve(".capture");
const W = 1920;
const H = 1080;
// Recorded at 1.5x so the zoomed-in shots stay sharp; 2x drops the screencast to ~24 fps.
const DPR = 1.5;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR, colorScheme: "dark" });
await context.addInitScript(() => {
	localStorage.setItem("theme", "dark");
	// The cursor log lives in the page: every move, with arrow vs hand from the CSS under it.
	const log = (window.__cursor = []);
	window.__logCursor = (x, y) => {
		const el = document.elementFromPoint(x, y);
		log.push([Date.now() / 1000, Math.round(x), Math.round(y), el && getComputedStyle(el).cursor === "pointer" ? 1 : 0]);
	};
	addEventListener("mousemove", (e) => window.__logCursor(e.clientX, e.clientY), { capture: true, passive: true });
});
const page = await context.newPage();

// Everything is timed in epoch seconds, the clock screencast frames use.
const now = () => Date.now() / 1000;
const clicks = []; // t
const camera = []; // { t, zoom, x, y }
let mouse = { x: 1700, y: 1000 };

/** Human-ish pointer move: eased and timed by the clock, however slowly frames come. */
async function glide(x, y, ms = 800) {
	const from = { ...mouse };
	const start = Date.now();
	for (;;) {
		const k = easeInOut(Math.min(1, (Date.now() - start) / ms));
		mouse = { x: from.x + (x - from.x) * k, y: from.y + (y - from.y) * k };
		await page.mouse.move(mouse.x, mouse.y);
		if (k === 1) break;
		await wait(8);
	}
}

async function click() {
	clicks.push(now());
	await page.mouse.down();
	await wait(90);
	await page.mouse.up();
}

async function center(selector) {
	const b = await page.locator(selector).first().boundingBox();
	return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}

/** Eased scroll to a y position, driven by rAF in the page. */
async function scroll(to, ms) {
	await page.evaluate(
		([to, ms]) =>
			new Promise((done) => {
				const from = scrollY;
				const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
				const t0 = performance.now();
				const step = (now) => {
					const t = Math.min(1, (now - t0) / ms);
					scrollTo(0, from + (to - from) * ease(t));
					t < 1 ? requestAnimationFrame(step) : done();
				};
				requestAnimationFrame(step);
			}),
		[to, ms],
	);
	// The pointer stays put while the page moves under it; log what it's over now.
	await page.evaluate(([x, y]) => window.__logCursor(x, y), [mouse.x, mouse.y]);
}

/** Page y that puts an element's top (plus an offset) at the top of the viewport. */
const topOf = (selector, offset = 0) =>
	page.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + scrollY + o, [selector, offset]);

/** Ask the video's camera to ease to `zoom`, centred on (x, y) in viewport pixels. */
const cam = (zoom, x = W / 2, y = H / 2) => camera.push({ t: now(), zoom, x: Math.round(x), y: Math.round(y) });

// --- The take -------------------------------------------------------------
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.mouse.move(mouse.x, mouse.y);
await wait(1500);

const dir = join(TMP, "take");
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
const frames = [];
let recording = true;
const cdp = await context.newCDPSession(page);
cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
	if (recording) {
		const file = join(dir, `${String(frames.length).padStart(5, "0")}.jpg`);
		writeFileSync(file, Buffer.from(data, "base64"));
		frames.push({ file, t: metadata.timestamp });
	}
	await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
});
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: W * DPR, maxHeight: H * DPR, everyNthFrame: 1 });
await wait(300);

// Open on the name, then the dot portrait: push in and paint the photo out from under the dots.
cam(1.4, 960, 330);
await page.evaluate(([x, y]) => window.__logCursor(x, y), [mouse.x, mouse.y]);
await wait(1000);
cam(1.9, 500, 640);
await glide(560, 520, 1000);
await glide(420, 700, 700);
await glide(640, 760, 600);
await glide(470, 430, 700);
await glide(600, 600, 600);
await wait(300);

// Back out, flip the theme to light and back.
cam(1);
const theme = await center("#themeBtn");
await glide(theme.x, theme.y, 1000);
await wait(200);
await click();
await wait(1500);
await click();
await wait(700);

// Down to the projects, a look at the featured card.
await glide(1500, 760, 600);
await scroll(await topOf("#work", -80), 1600);
const moxen = await center("#work .feature");
cam(1.35, moxen.x, moxen.y);
await glide(moxen.x + 300, moxen.y + 40, 800);
await wait(700);

// The record: flip the sleeve, drop the needle.
cam(1);
await scroll(
	await page.evaluate(() => {
		const r = document.querySelector("#sides .sides").getBoundingClientRect();
		return r.top + scrollY + r.height / 2 - innerHeight / 2 + 40;
	}),
	1500,
);
const deck = await center("#deck");
cam(1.6, deck.x + 60, deck.y);
const sleeve = await center("#sleeve");
await glide(sleeve.x, sleeve.y, 900);
await wait(200);
await click();
await wait(1800);
const play = await center("#play");
cam(1.6, play.x + 250, play.y + 20);
await glide(play.x, play.y, 900);
await wait(150);
await click();
await wait(1900);

// All the way down: the page lifts off the blue footer.
cam(1);
await glide(1200, 800, 500);
await scroll(await page.evaluate(() => document.documentElement.scrollHeight - innerHeight), 2200);
await wait(300);
const pose = await center("#poseDots");
cam(1.5, pose.x, pose.y);
await glide(pose.x - 60, pose.y - 120, 900);
await glide(pose.x + 40, pose.y + 80, 800);
const mail = await center("#mail");
cam(1.45, mail.x + 60, mail.y - 60);
await glide(mail.x, mail.y, 1000);
await wait(1500);

recording = false;
await cdp.send("Page.stopScreencast");
const cursor = await page.evaluate(() => window.__cursor);
await browser.close();

// --- Stitch -----------------------------------------------------------------
const t0 = frames[0].t;
const rel = (t) => Math.round((t - t0) * 1000) / 1000;
const lines = [];
frames.forEach((f, i) => {
	const next = frames[i + 1]?.t ?? f.t + 1 / 30;
	lines.push(`file '${f.file}'`, `duration ${Math.max(0.001, next - f.t).toFixed(4)}`);
});
lines.push(`file '${frames.at(-1).file}'`);
writeFileSync(join(dir, "list.txt"), lines.join("\n"));
mkdirSync(OUT, { recursive: true });
execFileSync(
	"npx",
	[
		"remotion", "ffmpeg", "-y", "-loglevel", "error",
		"-f", "concat", "-safe", "0", "-i", join(dir, "list.txt"),
		"-r", "30", "-fps_mode", "cfr",
		"-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p",
		join(OUT, "take.mp4"),
	],
	{ stdio: "inherit" },
);
writeFileSync(
	join(OUT, "take.json"),
	JSON.stringify({
		width: W,
		height: H,
		duration: rel(frames.at(-1).t),
		cursor: cursor.filter(([t]) => t >= t0).map(([t, x, y, hand]) => [rel(t), x, y, hand]),
		clicks: clicks.map(rel),
		camera: camera.map((c) => ({ ...c, t: rel(c.t) })),
	}),
);
rmSync(TMP, { recursive: true, force: true });
console.log(`take: ${frames.length} frames over ${rel(frames.at(-1).t)}s, ${cursor.length} cursor points`);
