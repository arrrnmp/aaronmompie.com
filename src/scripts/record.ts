/**
 * The two-sided record on the home page.
 *
 * Side A: only the sleeve shows, centred, with the record inside.
 * Side B: the sleeve flips to the other cover, slides aside, the record slides
 * half out and the tonearm comes in. Play pulls the record out further, spins it
 * and drops the arm. Text changes only once each move has landed.
 */
import { reducedMotion } from "./dot-field";

type Side = "A" | "B";

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const wait = (ms: number) => new Promise((r) => setTimeout(r, reducedMotion.matches ? 0 : ms));

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const i = new Image();
		i.onload = () => resolve(i);
		i.onerror = reject;
		i.src = src;
	});
}

/** Scatter `n` dots over a box following a density image (white = more dots). */
function stipple(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, n: number, color: string) {
	const off = document.createElement("canvas");
	off.width = img.width;
	off.height = img.height;
	const o = off.getContext("2d")!;
	o.drawImage(img, 0, 0);
	const d = o.getImageData(0, 0, img.width, img.height).data;
	const cdf = new Float32Array(img.width * img.height);
	let s = 0;
	for (let i = 0; i < cdf.length; i++) {
		const v = d[i * 4] / 255;
		s += v * v;
		cdf[i] = s;
	}
	const sc = Math.min(w / img.width, h / img.height);
	const ox = x + (w - img.width * sc) / 2;
	const oy = y + h - img.height * sc;
	ctx.fillStyle = color;
	for (let i = 0; i < n; i++) {
		const r = Math.random() * s;
		let lo = 0;
		let hi = cdf.length - 1;
		while (lo < hi) {
			const m = (lo + hi) >> 1;
			if (cdf[m] < r) lo = m + 1;
			else hi = m;
		}
		const z = 0.5 + Math.random() * 0.8;
		ctx.globalAlpha = 0.6 + Math.random() * 0.4;
		ctx.fillRect(ox + ((lo % img.width) + Math.random()) * sc, oy + (((lo / img.width) | 0) + Math.random()) * sc, z, z);
	}
	ctx.globalAlpha = 1;
}

export function initRecord() {
	const deck = $("deck");
	const sleeve = $("sleeve");
	const audio = $<HTMLAudioElement>("audio");
	const seek = $<HTMLInputElement>("seek");
	const wave = $<HTMLCanvasElement>("wave");
	const play = $("play");
	if (!deck || !audio) return;
	const L = JSON.parse($("sides").dataset.strings ?? "{}") as Record<string, string>;

	// Fonts are self-hosted under hashed family names; read the real one off the page.
	const cond = getComputedStyle($("hint").closest(".sides")!.querySelector(".cond")!).fontFamily;

	const art: Partial<Record<Side, { cover: HTMLCanvasElement; label: HTMLCanvasElement }>> = {};
	const cover = (side: Side, img: HTMLImageElement) => {
		const c = document.createElement("canvas");
		c.width = c.height = 1100;
		const x = c.getContext("2d")!;
		x.drawImage(img, 0, 0, 1100, 1100);
		if (side === "B") {
			x.fillStyle = "#0b0b0c";
			x.font = `900 112px ${cond}`;
			["IT'S", "COMPLI-", "CATED"].forEach((l, i) => x.fillText(l, 64, 200 + i * 104));
			x.fillStyle = "#2b3bff";
			x.font = `800 34px ${cond}`;
			x.fillText(L.coverB, 68, 1030);
		}
		return c;
	};
	const label = (side: Side, head: HTMLImageElement, body: HTMLImageElement) => {
		const c = document.createElement("canvas");
		c.width = c.height = 400;
		const x = c.getContext("2d")!;
		x.fillStyle = side === "A" ? "#2b3bff" : "#f3f1ec";
		x.beginPath();
		x.arc(200, 200, 200, 0, Math.PI * 2);
		x.fill();
		x.save();
		x.clip();
		if (side === "A") stipple(x, head, 70, 60, 260, 290, 16000, "#ffffff");
		else stipple(x, body, 130, 40, 140, 330, 9000, "#0b0b0c");
		x.restore();
		x.fillStyle = side === "A" ? "#fff" : "#2b3bff";
		x.font = `900 34px ${cond}`;
		x.textAlign = "center";
		x.fillText(`${L.sideWord} ${side}`, 200, 360);
		return c;
	};
	const paint = (canvas: HTMLCanvasElement, src: HTMLCanvasElement) => {
		canvas.width = src.width;
		canvas.height = src.height;
		canvas.getContext("2d")!.drawImage(src, 0, 0);
	};

	let side: Side = "A";
	Promise.all([
		loadImage("/media/head-density.png"),
		loadImage("/media/body-density.png"),
		loadImage("/media/cover-a.webp"),
		loadImage("/media/cover-b.webp"),
		// Only the real face; its size-matched fallback can point at a local font that is missing.
		document.fonts.load(`900 112px ${cond.split(",")[0]}`).catch(() => []),
	]).then(([head, body, coverA, coverB]) => {
		art.A = { cover: cover("A", coverA), label: label("A", head, body) };
		art.B = { cover: cover("B", coverB), label: label("B", head, body) };
		paint($<HTMLCanvasElement>("cover"), art[side]!.cover);
		paint($<HTMLCanvasElement>("labelArt"), art[side]!.label);
	});

	let busy = false;
	async function setSide(s: Side) {
		if (s === side || busy) return;
		busy = true;
		side = s;
		const from = $(s === "A" ? "panelB" : "panelA");
		const to = $(s === "A" ? "panelA" : "panelB");
		if (s === "A") {
			if (!audio.paused) {
				audio.pause();
				await wait(200);
			}
			deck.classList.remove("is-b"); // arm leaves, record slides home, sleeve recentres
			await wait(300);
		}
		sleeve.classList.add("flip-out");
		await wait(130);
		if (art[s]) {
			paint($<HTMLCanvasElement>("cover"), art[s]!.cover);
			paint($<HTMLCanvasElement>("labelArt"), art[s]!.label);
		}
		sleeve.classList.remove("flip-out");
		from.classList.add("is-out");
		await wait(130);
		if (s === "B") deck.classList.add("is-b"); // sleeve slides aside, record out, arm in
		from.classList.add("is-hidden");
		from.inert = true;
		from.setAttribute("aria-hidden", "true");
		to.classList.add("is-out");
		to.classList.remove("is-hidden");
		to.inert = false;
		to.removeAttribute("aria-hidden");
		void to.offsetWidth;
		to.classList.remove("is-out");
		const next = s === "A" ? "B" : "A";
		sleeve.setAttribute("aria-label", next === "A" ? L.sleeveA : L.sleeveB);
		$("hint").textContent = next === "A" ? L.flipToA : L.flipToB;
		if (s === "B") await wait(300);
		busy = false;
	}
	sleeve.addEventListener("click", () => setSide(side === "A" ? "B" : "A"));

	/* ---------- Player ---------- */
	const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "–:––");
	const PLAY = '<path d="M8 5.5v13l11-6.5z"/>';
	const PAUSE = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';
	let actx: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let freq = new Uint8Array(0);
	let peaks: number[] | null = null;
	let waveRaf = 0;

	play.addEventListener("click", () => {
		if (!actx) {
			try {
				actx = new AudioContext();
				const src = actx.createMediaElementSource(audio);
				analyser = actx.createAnalyser();
				analyser.fftSize = 128;
				analyser.smoothingTimeConstant = 0.72;
				src.connect(analyser);
				analyser.connect(actx.destination);
				freq = new Uint8Array(analyser.frequencyBinCount);
			} catch {
				analyser = null;
			}
		}
		actx?.resume();
		if (audio.paused) audio.play().catch(() => {});
		else audio.pause();
	});

	function drawWave() {
		const dpr = Math.min(devicePixelRatio || 1, 2);
		const W = wave.clientWidth;
		const H = wave.clientHeight;
		if (!W) return;
		if (wave.width !== Math.round(W * dpr)) {
			wave.width = Math.round(W * dpr);
			wave.height = Math.round(H * dpr);
		}
		const x = wave.getContext("2d")!;
		x.setTransform(dpr, 0, 0, dpr, 0, 0);
		x.clearRect(0, 0, W, H);
		const bars = Math.floor(W / 4);
		const head = (audio.duration ? audio.currentTime / audio.duration : 0) * bars;
		const live = !audio.paused && !reducedMotion.matches && analyser;
		if (live) analyser!.getByteFrequencyData(freq);
		const cs = getComputedStyle(document.documentElement);
		const played = cs.getPropertyValue("--blue-ink");
		const rest = cs.getPropertyValue("--track"); // 3:1 against the page: the bars double as the seek track
		for (let i = 0; i < bars; i++) {
			let v = peaks?.length ? peaks[Math.floor((i / bars) * peaks.length)] : 0.12 + 0.08 * Math.sin(i * 0.7);
			if (live) {
				// Bars around the playhead move with the music, fading out with distance.
				const d = Math.abs(i - head);
				const reach = 26;
				if (d < reach) {
					const f = freq[Math.min(freq.length - 1, Math.floor(d * 1.3))] / 255;
					v = v * 0.55 + f * (1 - d / reach) * 0.9 + v * 0.45 * (d / reach);
				}
			}
			const bh = Math.max(2, Math.min(1, v) * H);
			x.fillStyle = i < head ? played : rest;
			x.fillRect(i * 4, (H - bh) / 2, 2.5, bh);
		}
		if (audio.currentTime > 0) {
			x.fillStyle = played;
			x.fillRect(Math.min(W - 2, head * 4), 0, 2, H);
		}
	}
	const waveLoop = () => {
		waveRaf = 0;
		drawWave();
		if (!audio.paused) waveRaf = requestAnimationFrame(waveLoop);
	};

	audio.addEventListener("play", () => {
		deck.classList.add("is-playing");
		if (!waveRaf) waveRaf = requestAnimationFrame(waveLoop);
		$("playIcon").innerHTML = PAUSE;
		play.setAttribute("aria-label", L.pause);
	});
	audio.addEventListener("pause", () => {
		deck.classList.remove("is-playing");
		$("playIcon").innerHTML = PLAY;
		play.setAttribute("aria-label", L.play);
	});
	audio.addEventListener("loadedmetadata", () => ($("dur").textContent = fmt(audio.duration)));
	audio.addEventListener("timeupdate", () => {
		$("cur").textContent = fmt(audio.currentTime);
		if (audio.duration) seek.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
		if (audio.paused) drawWave();
	});
	seek.addEventListener("input", () => {
		if (audio.duration) audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
		drawWave();
	});
	new ResizeObserver(drawWave).observe(wave);

	// The waveform comes from the real audio, decoded once the section is near.
	new IntersectionObserver(
		async (es) => {
			if (!es[0].isIntersecting || peaks) return;
			peaks = [];
			try {
				const buf = await (await fetch(audio.currentSrc || audio.src)).arrayBuffer();
				const ac = new AudioContext();
				const data = (await ac.decodeAudioData(buf)).getChannelData(0);
				const n = 400;
				const step = Math.floor(data.length / n);
				const out = new Float32Array(n);
				let max = 0;
				for (let i = 0; i < n; i++) {
					let m = 0;
					for (let j = i * step; j < (i + 1) * step; j += 16) m = Math.max(m, Math.abs(data[j]));
					out[i] = m;
					max = Math.max(max, m);
				}
				peaks = Array.from(out, (v) => Math.pow(v / (max || 1), 0.8));
				ac.close();
			} catch {
				peaks = null;
			}
			drawWave();
		},
		{ rootMargin: "400px" },
	).observe($("sides"));
}
