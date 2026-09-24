import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./brand";
import { Cursor } from "./components/Cursor";
import { Wallpaper } from "./components/Wallpaper";
import { cameraAt, cursorAt, pressAt, type Take } from "./take";

export type ShowcaseProps = { take: Take | null };

// The browser window at rest: 1500px of page, centred, under a 44px title bar.
// Zooms stay small (≤ 1.12), so the whole window is always on screen.
const WIN_W = 1500;
const BAR = 44;
const SCALE = WIN_W / 1920;
const WIN_H = 1080 * SCALE + BAR;
const MARGIN = 28;

/**
 * Where the window sits for a camera cue: scaled by `zoom`, nudged so the focus
 * point (viewport px) drifts toward the centre, but never past the frame's edges.
 */
function place(zoom: number, x: number, y: number, width: number, height: number) {
	const w = WIN_W * zoom;
	const h = WIN_H * zoom;
	const left = width / 2 - x * SCALE * zoom;
	const top = height / 2 - (BAR + y * SCALE) * zoom;
	const clamp = (v: number, size: number, screen: number) =>
		size + 2 * MARGIN >= screen ? (screen - size) / 2 : Math.min(screen - size - MARGIN, Math.max(MARGIN, v));
	return { x: clamp(left, w, width), y: clamp(top, h, height) };
}

/** One take of the site in a browser window over a wallpaper, with gentle zooms and a macOS pointer. */
export const Showcase: React.FC<ShowcaseProps> = ({ take }) => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames, width, height } = useVideoConfig();
	if (!take) return null;
	const t = frame / fps;

	// Cues are placed first and then eased between, so a clamp never cuts a move short.
	const shots = take.camera.map((c) => ({ t: c.t, zoom: c.zoom, ...place(c.zoom, c.x, c.y, width, height) }));
	const cam = cameraAt({ ...take, camera: shots }, t);
	const pointer = cursorAt(take, t);

	return (
		<AbsoluteFill>
			<Wallpaper />
			<div
				style={{
					position: "absolute",
					left: cam.x,
					top: cam.y,
					width: WIN_W,
					height: WIN_H,
					scale: cam.zoom,
					transformOrigin: "0 0",
					borderRadius: 14,
					overflow: "hidden",
					backgroundColor: "#1c1c1f",
					boxShadow: "0 40px 100px rgba(4, 6, 40, 0.55), 0 10px 30px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)",
				}}
			>
				<div style={{ height: BAR, display: "flex", alignItems: "center", padding: "0 18px", gap: 9, position: "relative" }}>
					<div style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: "#ff5f57" }} />
					<div style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: "#febc2e" }} />
					<div style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: "#28c840" }} />
					<div
						style={{
							position: "absolute",
							left: "50%",
							translate: "-50% 0",
							padding: "5px 90px",
							borderRadius: 8,
							backgroundColor: "#2a2a2e",
							fontFamily: SANS,
							fontSize: 16,
							color: "#d8d6d0",
						}}
					>
						aaronmompie.com
					</div>
				</div>
				<div style={{ position: "relative", width: WIN_W, height: 1080 * SCALE, overflow: "hidden" }}>
					<Video src={staticFile("footage/take.mp4")} muted style={{ width: WIN_W, height: 1080 * SCALE, display: "block" }} />
					<div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, scale: SCALE, transformOrigin: "0 0" }}>
						<Cursor x={pointer.x} y={pointer.y} hand={pointer.hand} press={pressAt(take, t)} size={42} />
					</div>
				</div>
			</div>

			<Audio
				src={staticFile("media/its-complicated.mp3")}
				volume={(f) =>
					interpolate(f, [0, 10, durationInFrames - 60, durationInFrames - 1], [0, 0.9, 0.9, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					})
				}
			/>
		</AbsoluteFill>
	);
};
