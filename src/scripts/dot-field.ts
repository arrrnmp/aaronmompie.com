/**
 * A photo drawn in dots, in two layers: a sharp still stipple, and on top of it
 * dots that are born where the photo is dense, drift along its contours, fade and
 * are reborn. Where the pointer is, the dots move aside and the real photo shows.
 *
 * The density map is a greyscale PNG (white = more dots) made from the cut-out
 * photo; the photo itself must be cropped to the same frame.
 *
 * This side only watches the canvas (size, visibility, pointer, motion setting);
 * the drawing happens in a worker (dot-field-engine.ts), off the main thread.
 */
import type { DotFieldMessage, DotFieldOptions } from './dot-field-engine';

export type { DotFieldOptions };

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
/** Phones and tablets in portrait get fewer dots (same breakpoint as responsive.css). */
export const compact = matchMedia('(max-width: 819.98px)');

export class DotField {
	private send: (m: DotFieldMessage) => void = () => {};

	/**
	 * `watchVisibility: false` leaves it to the caller to say when the canvas can be seen
	 * (see `setVisible`), for canvases an observer can't judge, like the footer under the sheet.
	 */
	constructor(canvas: HTMLCanvasElement, densitySrc: string, options: DotFieldOptions, watchVisibility = true) {
		// Browsers without OffscreenCanvas keep the plain blue panel behind the canvas.
		if (!('transferControlToOffscreen' in canvas) || typeof Worker === 'undefined') return;

		const worker = new Worker(new URL('./dot-field.worker.ts', import.meta.url), { type: 'module' });
		const send = (this.send = (m: DotFieldMessage) => worker.postMessage(m));
		const offscreen = canvas.transferControlToOffscreen();
		const abs = (src: string) => new URL(src, location.href).href;
		worker.postMessage(
			{
				type: 'init',
				canvas: offscreen,
				density: abs(densitySrc),
				options: { ...options, photo: options.photo && abs(options.photo) },
				running: !reducedMotion.matches,
			} satisfies DotFieldMessage,
			[offscreen],
		);

		// Sizes come from the observer, so nothing here forces a layout.
		new ResizeObserver(([e]) => {
			const box = e.contentBoxSize?.[0];
			send({
				type: 'size',
				W: box ? box.inlineSize : e.contentRect.width,
				H: box ? box.blockSize : e.contentRect.height,
				dpr: Math.min(devicePixelRatio || 1, 2),
			});
		}).observe(canvas);
		if (watchVisibility) {
			new IntersectionObserver((es) => send({ type: 'visible', visible: es[0].isIntersecting }), { rootMargin: '80px' }).observe(canvas);
		}

		let hover = false;
		let tapTimer = 0;
		const pointer = (e: PointerEvent, on: boolean, snap: boolean) => {
			hover = on;
			send({ type: 'pointer', x: on ? e.offsetX : -1e4, y: on ? e.offsetY : -1e4, hover: on, snap });
		};
		canvas.addEventListener('pointermove', (e) => {
			// A finger dragging during a tap's reveal still pushes the dots.
			if (e.pointerType === 'touch') {
				if (hover) pointer(e, true, false);
				return;
			}
			pointer(e, true, !hover);
		});
		canvas.addEventListener('pointerleave', (e) => {
			if (e.pointerType === 'touch') return;
			pointer(e, false, false);
		});
		// Phones: a tap opens the reveal for a moment.
		canvas.addEventListener('pointerdown', (e) => {
			if (e.pointerType !== 'touch') return;
			pointer(e, true, true);
			clearTimeout(tapTimer);
			tapTimer = window.setTimeout(() => {
				hover = false;
				send({ type: 'pointer', x: e.offsetX, y: e.offsetY, hover: false, snap: false });
			}, 2400);
		});

		const applyMotion = () => {
			send({ type: 'reducedMotion', reduced: reducedMotion.matches });
			send({ type: 'running', running: !reducedMotion.matches });
		};
		reducedMotion.addEventListener('change', applyMotion);
		applyMotion();
	}

	/** Only for fields made with `watchVisibility: false`. */
	setVisible(visible: boolean) {
		this.send({ type: 'visible', visible });
	}
}
