/**
 * A photo drawn in dots, in two layers: a sharp still stipple, and on top of it
 * dots that are born where the photo is dense, drift along its contours, fade and
 * are reborn. Where the pointer is, the dots move aside and the real photo shows.
 *
 * The density map is a greyscale PNG (white = more dots) made from the cut-out
 * photo; the photo itself must be cropped to the same frame.
 */
export interface DotFieldOptions {
	/** Moving dots. */
	count: number;
	/** Dots in the still layer. */
	stillCount: number;
	/** Opacity of the still layer while the moving dots are on. */
	baseAlpha: number;
	color: string;
	bg: string;
	/** How far a moving dot travels per frame, in density-map pixels. */
	speed: number;
	/** Share of the canvas the figure may fill (0–1). */
	fit: number;
	/** The real photo shown under the pointer. */
	photo?: string;
}

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

interface Particles {
	x: Float32Array;
	y: Float32Array;
	age: Float32Array;
	life: Float32Array;
	sz: Float32Array;
	dir: Float32Array;
}

export class DotField {
	private readonly c: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly o: DotFieldOptions;
	private running = false;
	private visible = false;
	private ready = false;
	private raf = 0;
	private mx = -1e4;
	private my = -1e4;
	private hover = false;
	private lx = 0;
	private ly = 0;
	private lr = 0;
	private tapTimer = 0;
	private photo?: HTMLImageElement;
	// density map
	private w = 0;
	private h = 0;
	private cdf = new Float32Array(0);
	private total = 0;
	private tx = new Float32Array(0);
	private ty = new Float32Array(0);
	private P?: Particles;
	// canvas geometry
	private W = 0;
	private H = 0;
	private dpr = 1;
	private scale = 1;
	private ox = 0;
	private oy = 0;
	private base?: HTMLCanvasElement;
	private trail?: HTMLCanvasElement;
	private reveal?: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement, densitySrc: string, options: DotFieldOptions) {
		this.c = canvas;
		this.ctx = canvas.getContext('2d')!;
		this.o = options;

		const img = new Image();
		img.onload = () => this.init(img);
		img.src = densitySrc;
		if (options.photo) {
			const p = new Image();
			p.onload = () => (this.photo = p);
			p.src = options.photo;
		}

		new ResizeObserver(() => this.resize()).observe(canvas);
		new IntersectionObserver(
			(es) => {
				this.visible = es[0].isIntersecting;
				this.kick();
			},
			{ rootMargin: '80px' },
		).observe(canvas);

		const at = (e: PointerEvent) => {
			const r = canvas.getBoundingClientRect();
			this.mx = e.clientX - r.left;
			this.my = e.clientY - r.top;
		};
		canvas.addEventListener('pointermove', (e) => {
			at(e);
			if (e.pointerType === 'touch') return;
			if (!this.hover) {
				this.lx = this.mx;
				this.ly = this.my;
			}
			this.hover = true;
			this.kick();
		});
		canvas.addEventListener('pointerleave', (e) => {
			if (e.pointerType === 'touch') return;
			this.hover = false;
			this.mx = this.my = -1e4;
			this.kick();
		});
		// Phones: a tap opens the reveal for a moment.
		canvas.addEventListener('pointerdown', (e) => {
			if (e.pointerType !== 'touch') return;
			at(e);
			this.lx = this.mx;
			this.ly = this.my;
			this.hover = true;
			this.kick();
			clearTimeout(this.tapTimer);
			this.tapTimer = window.setTimeout(() => {
				this.hover = false;
				this.kick();
			}, 2400);
		});

		const applyMotion = () => this.setRunning(!reducedMotion.matches);
		reducedMotion.addEventListener('change', applyMotion);
		applyMotion();
	}

	private init(img: HTMLImageElement) {
		const w = img.width;
		const h = img.height;
		const off = document.createElement('canvas');
		off.width = w;
		off.height = h;
		const x = off.getContext('2d')!;
		x.drawImage(img, 0, 0);
		const px = x.getImageData(0, 0, w, h).data;
		const d = new Float32Array(w * h);
		const cdf = new Float32Array(w * h);
		let s = 0;
		for (let i = 0; i < w * h; i++) {
			d[i] = px[i * 4] / 255;
			s += d[i] * d[i];
			cdf[i] = s;
		}
		// Contour direction: perpendicular to the density gradient.
		const tx = new Float32Array(w * h);
		const ty = new Float32Array(w * h);
		for (let yy = 1; yy < h - 1; yy++) {
			for (let xx = 1; xx < w - 1; xx++) {
				const i = yy * w + xx;
				const gx = d[i + 1] - d[i - 1] + 0.5 * (d[i - w + 1] - d[i - w - 1] + d[i + w + 1] - d[i + w - 1]);
				const gy = d[i + w] - d[i - w] + 0.5 * (d[i + w - 1] - d[i - w - 1] + d[i + w + 1] - d[i - w + 1]);
				const m = Math.hypot(gx, gy) || 1;
				tx[i] = -gy / m;
				ty[i] = gx / m;
			}
		}
		const n = this.o.count;
		Object.assign(this, { w, h, cdf, total: s, tx, ty, ready: true });
		this.P = {
			x: new Float32Array(n),
			y: new Float32Array(n),
			age: new Float32Array(n),
			life: new Float32Array(n),
			sz: new Float32Array(n),
			dir: new Float32Array(n),
		};
		for (let i = 0; i < n; i++) this.spawn(i, true);
		this.resize();
	}

	private sample(): number {
		const r = Math.random() * this.total;
		const c = this.cdf;
		let lo = 0;
		let hi = c.length - 1;
		while (lo < hi) {
			const m = (lo + hi) >> 1;
			if (c[m] < r) lo = m + 1;
			else hi = m;
		}
		return lo;
	}

	private spawn(i: number, first: boolean) {
		const k = this.sample();
		const P = this.P!;
		P.x[i] = (k % this.w) + Math.random();
		P.y[i] = ((k / this.w) | 0) + Math.random();
		P.life[i] = 1 + Math.random() * 2.2;
		P.age[i] = first ? Math.random() * P.life[i] : 0;
		P.sz[i] = 0.7 + Math.random() * 0.9;
		P.dir[i] = Math.random() < 0.5 ? -1 : 1;
	}

	private resize() {
		if (!this.ready) return;
		const dpr = Math.min(devicePixelRatio || 1, 2);
		const W = this.c.clientWidth;
		const H = this.c.clientHeight;
		if (!W || !H) return;
		this.c.width = Math.round(W * dpr);
		this.c.height = Math.round(H * dpr);
		const scale = Math.min((W * this.o.fit) / this.w, (H * this.o.fit) / this.h);
		Object.assign(this, { W, H, dpr, scale, ox: (W - this.w * scale) / 2, oy: H - this.h * scale });

		// The still layer, drawn once per size.
		this.base = document.createElement('canvas');
		this.base.width = this.c.width;
		this.base.height = this.c.height;
		const b = this.base.getContext('2d')!;
		b.setTransform(dpr, 0, 0, dpr, 0, 0);
		b.fillStyle = this.o.color;
		for (let i = 0; i < this.o.stillCount; i++) {
			const k = this.sample();
			const x = this.ox + ((k % this.w) + Math.random()) * scale;
			const y = this.oy + (((k / this.w) | 0) + Math.random()) * scale;
			const z = 0.55 + Math.random() * 0.8;
			b.globalAlpha = 0.45 + Math.random() * 0.55;
			b.fillRect(x - z / 2, y - z / 2, z, z);
		}
		this.trail = document.createElement('canvas');
		this.trail.width = this.c.width;
		this.trail.height = this.c.height;
		this.paint();
		this.kick();
	}

	private setRunning(on: boolean) {
		this.running = on;
		if (!on && this.trail) {
			this.trail.getContext('2d')!.clearRect(0, 0, this.trail.width, this.trail.height);
			this.paint();
		}
		this.kick();
	}

	private revealing(): boolean {
		return Boolean(this.o.photo) && (this.hover || this.lr > 0.5);
	}

	private kick() {
		if ((this.running || this.revealing()) && this.visible && this.ready && this.base && !this.raf) {
			this.raf = requestAnimationFrame(() => this.frame());
		}
	}

	private paint() {
		if (!this.base || !this.trail) return;
		const { ctx } = this;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.globalAlpha = 1;
		ctx.fillStyle = this.o.bg;
		ctx.fillRect(0, 0, this.c.width, this.c.height);
		ctx.globalAlpha = this.running ? this.o.baseAlpha : 1;
		ctx.drawImage(this.base, 0, 0);
		ctx.globalAlpha = 1;
		if (this.running) ctx.drawImage(this.trail, 0, 0);

		if (this.photo && this.lr > 0.5) {
			if (!this.reveal || this.reveal.width !== this.c.width || this.reveal.height !== this.c.height) {
				this.reveal = document.createElement('canvas');
				this.reveal.width = this.c.width;
				this.reveal.height = this.c.height;
			}
			const r = this.reveal.getContext('2d')!;
			const { dpr, lx, ly, lr } = this;
			r.setTransform(1, 0, 0, 1, 0, 0);
			r.globalCompositeOperation = 'source-over';
			r.clearRect(0, 0, this.reveal.width, this.reveal.height);
			r.setTransform(dpr, 0, 0, dpr, 0, 0);
			r.fillStyle = this.o.bg;
			r.beginPath();
			r.arc(lx, ly, lr, 0, Math.PI * 2);
			r.fill();
			r.drawImage(this.photo, this.ox, this.oy, this.w * this.scale, this.h * this.scale);
			const g = r.createRadialGradient(lx, ly, lr * 0.55, lx, ly, lr);
			g.addColorStop(0, 'rgba(0,0,0,1)');
			g.addColorStop(1, 'rgba(0,0,0,0)');
			r.globalCompositeOperation = 'destination-in';
			r.fillStyle = g;
			r.fillRect(0, 0, this.W, this.H);
			r.globalCompositeOperation = 'source-over';
			ctx.drawImage(this.reveal, 0, 0);
		}
	}

	private frame() {
		this.raf = 0;
		if (!this.visible) return;
		// Ease the reveal toward the pointer and its target size.
		const R = this.hover ? Math.min(this.W, this.H) * 0.27 : 0;
		this.lr += (R - this.lr) * (reducedMotion.matches ? 1 : 0.14);
		if (this.hover && this.mx > -1e3) {
			this.lx += (this.mx - this.lx) * 0.22;
			this.ly += (this.my - this.ly) * 0.22;
		}
		if (!this.running) {
			this.paint();
			if (this.revealing()) this.kick();
			return;
		}

		const t = this.trail!.getContext('2d')!;
		const { dpr, scale, ox, oy, w, h, tx, ty } = this;
		const P = this.P!;
		const n = this.o.count;
		const dt = 1 / 60;
		t.setTransform(1, 0, 0, 1, 0, 0);
		t.globalCompositeOperation = 'destination-out';
		t.globalAlpha = 0.2;
		t.fillRect(0, 0, this.trail!.width, this.trail!.height);
		t.globalCompositeOperation = 'source-over';
		t.setTransform(dpr, 0, 0, dpr, 0, 0);
		t.fillStyle = this.o.color;

		const on = this.lr > 1;
		const sp = this.o.speed;
		const mx = ((on ? this.lx : this.mx) - ox) / scale;
		const my = ((on ? this.ly : this.my) - oy) / scale;
		const rad = (on ? this.lr + 26 : 34) / scale;
		for (let i = 0; i < n; i++) {
			let x = P.x[i];
			let y = P.y[i];
			const k = (y | 0) * w + (x | 0);
			if (k > 0 && k < w * h) {
				x += tx[k] * sp * P.dir[i];
				y += ty[k] * sp * P.dir[i];
			}
			const ddx = x - mx;
			const ddy = y - my;
			const dd = ddx * ddx + ddy * ddy;
			if (dd < rad * rad) {
				const dl = Math.sqrt(dd) || 1;
				const f = (1 - dl / rad) * 2;
				x += (ddx / dl) * f;
				y += (ddy / dl) * f;
			}
			P.x[i] = x;
			P.y[i] = y;
			P.age[i] += dt;
			if (P.age[i] > P.life[i] || x < 0 || y < 0 || x >= w || y >= h) {
				this.spawn(i, false);
				continue;
			}
			t.globalAlpha = Math.sin((Math.PI * P.age[i]) / P.life[i]);
			const z = P.sz[i];
			t.fillRect(ox + x * scale - z / 2, oy + y * scale - z / 2, z, z);
		}
		this.paint();
		this.kick();
	}
}
