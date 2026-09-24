// Records real footage of the built site (../dist) into public/footage/*.mp4.
// Usage: from video/, with the site built and served at http://localhost:4400 (see README):
//   npm run capture [-- clip ...]
// Frames come from Chrome's screencast (sharp JPEGs, real timestamps) and are
// stitched into constant 30 fps clips with Remotion's bundled ffmpeg.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const BASE = process.env.SITE_URL ?? "http://localhost:4400";
const OUT = resolve("public/footage");
const TMP = resolve(".capture");
const DESKTOP = { width: 1920, height: 1080, dpr: 1 };
const PHONE = { width: 390, height: 844, dpr: 3 };

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Eased scroll to a y position (or an element's top), driven by rAF in the page. */
async function scrollTo(page, target, ms) {
	await page.evaluate(
		([target, ms]) =>
			new Promise((done) => {
				const from = scrollY;
				const to =
					typeof target === "number"
						? target
						: target === "bottom"
							? document.documentElement.scrollHeight - innerHeight
							: document.querySelector(target).getBoundingClientRect().top + scrollY;
				const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
				const t0 = performance.now();
				const step = (now) => {
					const t = Math.min(1, (now - t0) / ms);
					scrollTo(0, from + (to - from) * ease(t));
					t < 1 ? requestAnimationFrame(step) : done();
				};
				requestAnimationFrame(step);
			}),
		[target, ms],
	);
}

/** Moves the pointer along a list of points, a step every ~16 ms. */
async function glide(page, points, msPerLeg) {
	for (const [x, y] of points) {
		await page.mouse.move(x, y, { steps: Math.round(msPerLeg / 16) });
	}
}

async function record(name, view, script, { theme = "dark" } = {}) {
	const browser = await chromium.launch();
	const context = await browser.newContext({
		viewport: { width: view.width, height: view.height },
		deviceScaleFactor: view.dpr,
		isMobile: view.width < 800,
		hasTouch: view.width < 800,
		colorScheme: theme,
	});
	await context.addInitScript((theme) => localStorage.setItem("theme", theme), theme);
	const page = await context.newPage();
	const dir = join(TMP, name);
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });

	const frames = [];
	let recording = false;
	const cdp = await context.newCDPSession(page);
	cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
		if (recording) {
			const file = join(dir, `${String(frames.length).padStart(5, "0")}.jpg`);
			writeFileSync(file, Buffer.from(data, "base64"));
			frames.push({ file, t: metadata.timestamp });
		}
		await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
	});

	await page.goto(BASE + "/", { waitUntil: "networkidle" });
	await page.evaluate(() => document.fonts.ready);
	await wait(1200);
	await cdp.send("Page.startScreencast", {
		format: "jpeg",
		quality: 94,
		maxWidth: view.width * view.dpr,
		maxHeight: view.height * view.dpr,
		everyNthFrame: 1,
	});
	recording = true;
	const start = Date.now();
	await script(page);
	const end = Date.now();
	recording = false;
	await cdp.send("Page.stopScreencast");
	await browser.close();

	// Concat list: each frame holds until the next one arrived.
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
			"-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "-r", "30", "-fps_mode", "cfr",
			"-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p",
			join(OUT, `${name}.mp4`),
		],
		{ stdio: "inherit" },
	);
	console.log(`${name}: ${frames.length} frames over ${((end - start) / 1000).toFixed(1)}s`);
}

const clips = {
	// The hero: dot portrait breathing, then the pointer reveals the photo.
	hero: [DESKTOP, async (page) => {
		await page.mouse.move(1400, 950);
		await wait(1200);
		await glide(page, [[520, 470], [660, 640], [420, 720], [560, 400], [1400, 950]], 1100);
		await wait(800);
	}],
	// One long scroll: facts ticker, experience, projects, down to the record.
	scroll: [DESKTOP, async (page) => {
		await page.mouse.move(1900, 540);
		await wait(500);
		await scrollTo(page, "#work", 2600);
		await wait(900);
		await scrollTo(page, "#sides", 2400);
		await wait(1000);
	}],
	// The two-sided record: flip to side B, drop the needle.
	record: [DESKTOP, async (page) => {
		await page.evaluate(() => document.querySelector("#sides").scrollIntoView({ block: "center" }));
		await wait(1500);
		const sleeve = page.locator("#sleeve");
		const box = await sleeve.boundingBox();
		await page.mouse.move(box.x + box.width / 2 - 200, box.y + box.height / 2 + 200, { steps: 1 });
		await glide(page, [[box.x + box.width / 2, box.y + box.height / 2]], 700);
		await wait(300);
		await sleeve.click();
		await wait(2600);
		const play = page.locator("#play");
		const pb = await play.boundingBox();
		await glide(page, [[pb.x + pb.width / 2, pb.y + pb.height / 2]], 900);
		await play.click();
		await wait(3500);
	}],
	// Dark to light and back, then English to Spanish.
	theme: [DESKTOP, async (page) => {
		await page.mouse.move(1500, 500);
		await wait(600);
		const btn = page.locator("#themeBtn");
		const b = await btn.boundingBox();
		await glide(page, [[b.x + b.width / 2, b.y + b.height / 2]], 900);
		await btn.click();
		await wait(1800);
		await btn.click();
		await wait(900);
		const es = page.locator('header a[hreflang="es"]').first();
		const e = await es.boundingBox();
		await glide(page, [[e.x + e.width / 2, e.y + e.height / 2]], 700);
		await Promise.all([page.waitForURL("**/es/"), es.click()]);
		await page.evaluate(() => document.fonts.ready);
		await wait(2200);
	}],
	// The page lifts off the blue contact footer.
	finale: [DESKTOP, async (page) => {
		await page.evaluate(() => {
			const s = document.querySelector("#sides");
			scrollTo(0, s.getBoundingClientRect().bottom + scrollY - innerHeight * 0.6);
		});
		await wait(900);
		await scrollTo(page, "bottom", 2800);
		await wait(600);
		await glide(page, [[1300, 600], [1450, 420], [1350, 780], [1600, 560]], 1000);
		await wait(900);
	}],
	// Phone: scroll the hero, open the full-screen menu.
	phone: [PHONE, async (page) => {
		await wait(1200);
		await scrollTo(page, 900, 2000);
		await wait(600);
		await scrollTo(page, 0, 1400);
		await wait(500);
		await page.locator("#menu").tap();
		await wait(2200);
		await page.locator("#menu").tap();
		await wait(900);
	}],
};

const wanted = process.argv.slice(2);
for (const [name, [view, script]] of Object.entries(clips)) {
	if (wanted.length && !wanted.includes(name)) continue;
	await record(name, view, script);
}
rmSync(TMP, { recursive: true, force: true });
