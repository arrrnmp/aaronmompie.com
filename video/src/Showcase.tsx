import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BLUE, DISPLAY, SANS } from "./brand";
import { Cursor } from "./components/Cursor";
import { cameraAt, cursorAt, pressAt, type Take } from "./take";

export type ShowcaseProps = { take: Take | null };

/** Frames the end card runs after the take, including its 15-frame crossfade. */
export const END_FRAMES = 90;

// The browser window at rest: 1600px of page, centred, under a 44px title bar.
const WIN_W = 1600;
const BAR = 44;
const SCALE = WIN_W / 1920;
const WIN_H = 1080 * SCALE + BAR;
const WIN_X = (1920 - WIN_W) / 2;
const WIN_Y = (1080 - WIN_H) / 2;

/** One take of the site in a browser window: eased zooms that follow the action, a macOS pointer, then the end card. */
export const Showcase: React.FC<ShowcaseProps> = ({ take }) => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames, width, height } = useVideoConfig();
	if (!take) return null;
	const t = frame / fps;
	const takeFrames = Math.round(take.duration * fps);

	// Camera: put the focus point (viewport px) at the centre, never showing past the window's edges once it fills the frame.
	const cam = cameraAt(take, t);
	const z = cam.zoom;
	const fx = WIN_X + cam.x * SCALE;
	const fy = WIN_Y + BAR + cam.y * SCALE;
	const fit = (edge: number, size: number, screen: number) =>
		size >= screen ? Math.min(0, Math.max(screen - size, edge)) : Math.max(0, Math.min(screen - size, edge));
	const left = fit(width / 2 - (fx - WIN_X) * z, WIN_W * z, width);
	const top = fit(height / 2 - (fy - WIN_Y) * z, WIN_H * z, height);

	const pointer = cursorAt(take, t);

	return (
		<AbsoluteFill style={{ backgroundColor: "#0b0b0c" }}>
			<AbsoluteFill style={{ background: "radial-gradient(60% 70% at 50% 55%, rgba(43, 59, 255, 0.35), rgba(43, 59, 255, 0) 70%)" }} />
			<div
				style={{
					position: "absolute",
					left,
					top,
					width: WIN_W,
					height: WIN_H,
					scale: z,
					transformOrigin: "0 0",
					borderRadius: 14,
					overflow: "hidden",
					backgroundColor: "#1c1c1f",
					boxShadow: "0 50px 140px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)",
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

			<Sequence from={takeFrames - 15} name="End card">
				<EndCard />
			</Sequence>

			<Audio
				src={staticFile("media/its-complicated.mp3")}
				volume={(f) =>
					interpolate(f, [0, 10, durationInFrames - 45, durationInFrames - 1], [0, 0.9, 0.9, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					})
				}
			/>
		</AbsoluteFill>
	);
};

/** The only words in the video. */
const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				backgroundColor: BLUE,
				justifyContent: "center",
				alignItems: "center",
				gap: 28,
				opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
			}}
		>
			<div
				style={{
					fontFamily: DISPLAY,
					fontSize: 120,
					color: "white",
					translate: interpolate(frame, [4, 26], ["0px 30px", "0px 0px"], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: Easing.bezier(0.22, 1, 0.36, 1),
					}),
				}}
			>
				aaronmompie.com
			</div>
			<div
				style={{
					fontFamily: SANS,
					fontSize: 52,
					color: "rgba(255, 255, 255, 0.85)",
					opacity: interpolate(frame, [14, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
				}}
			>
				Built with Claude Opus 5.5. Open to work.
			</div>
		</AbsoluteFill>
	);
};
