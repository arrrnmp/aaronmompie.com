import { Easing, interpolate } from "remotion";

/** What scripts/capture.mjs writes next to take.mp4. Times are seconds into the clip. */
export type Take = {
	width: number;
	height: number;
	duration: number;
	/** [t, x, y, hand]: viewport pixels; hand is 1 over something clickable. */
	cursor: [number, number, number, number][];
	clicks: number[];
	camera: { t: number; zoom: number; x: number; y: number }[];
};

type Cam = { zoom: number; x: number; y: number };

/** How long each camera move takes, in seconds: slow, symmetric ease so nothing snaps. */
const MOVE = 1.8;
const ease = Easing.bezier(0.45, 0, 0.55, 1);

/**
 * The camera at time t: each cue eases from wherever the camera was when the
 * cue fired, so a move that interrupts another still flows.
 */
export function cameraAt(take: Take, t: number): Cam {
	const cues = take.camera;
	if (cues.length === 0) return { zoom: 1, x: take.width / 2, y: take.height / 2 };
	let cam: Cam = { zoom: cues[0].zoom, x: cues[0].x, y: cues[0].y };
	for (let i = 1; i < cues.length && cues[i].t <= t; i++) {
		const from = cameraAtCue(take, i);
		const p = ease(Math.min(1, (t - cues[i].t) / MOVE));
		cam = {
			// Zoom eases in log space, so zooming in and out feel equally fast.
			zoom: Math.exp(Math.log(from.zoom) + (Math.log(cues[i].zoom) - Math.log(from.zoom)) * p),
			x: from.x + (cues[i].x - from.x) * p,
			y: from.y + (cues[i].y - from.y) * p,
		};
	}
	return cam;
}

/** Where the camera was the moment cue i fired. */
function cameraAtCue(take: Take, i: number): Cam {
	return cameraAt({ ...take, camera: take.camera.slice(0, i) }, take.camera[i].t);
}

/** The pointer at time t, interpolated along the logged path. */
export function cursorAt(take: Take, t: number): { x: number; y: number; hand: boolean } {
	const path = take.cursor;
	if (t <= path[0][0]) return { x: path[0][1], y: path[0][2], hand: path[0][3] === 1 };
	for (let i = 1; i < path.length; i++) {
		if (path[i][0] >= t) {
			const [t0, x0, y0, h0] = path[i - 1];
			const [t1, x1, y1] = path[i];
			const k = t1 === t0 ? 1 : (t - t0) / (t1 - t0);
			return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, hand: h0 === 1 };
		}
	}
	const last = path[path.length - 1];
	return { x: last[1], y: last[2], hand: last[3] === 1 };
}

/** 1 at rest, dipping briefly when a click lands. */
export function pressAt(take: Take, t: number): number {
	let scale = 1;
	for (const c of take.clicks) {
		scale = Math.min(scale, interpolate(t - c, [-0.02, 0.06, 0.3], [1, 0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
	}
	return scale;
}
