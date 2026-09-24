import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";

/** The site's blue finale, as the call to action. */
export const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Backdrop color="#2b3bff" dots="rgba(255, 255, 255, 0.1)" />
			<Img
				name="Dot portrait"
				src={staticFile("og/portrait.png")}
				style={{
					position: "absolute",
					right: 30,
					bottom: 0,
					height: 760,
					opacity: interpolate(frame, [4, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
					clipPath: `inset(${interpolate(frame, [4, 40], [100, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					})}% 0 0 0)`,
				}}
			/>
			<Interactive.Div
				name="Open to work"
				style={{
					position: "absolute",
					left: 160,
					top: 130,
					display: "flex",
					alignItems: "center",
					gap: 18,
					fontFamily: "'Big Shoulders', sans-serif",
					fontSize: 52,
					letterSpacing: 3,
					color: "white",
					opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
				}}
			>
				<div
					style={{
						width: 20,
						height: 20,
						borderRadius: 10,
						backgroundColor: "#7dffa8",
						boxShadow: "0 0 0 8px rgba(125, 255, 168, 0.25)",
						opacity: interpolate(frame % 30, [0, 15, 30], [1, 0.45, 1]),
					}}
				/>
				OPEN TO WORK
			</Interactive.Div>
			<div style={{ position: "absolute", left: 150, top: 210, overflow: "hidden" }}>
				<Interactive.Div
					name="Let's talk"
					style={{
						fontFamily: "'Big Shoulders', sans-serif",
						fontSize: 270,
						lineHeight: 0.9,
						color: "white",
						translate: interpolate(frame, [4, 24], ["0px 250px", "0px 0px"], {
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
							easing: Easing.bezier(0.16, 1, 0.3, 1),
						}),
					}}
				>
					LET'S TALK.
				</Interactive.Div>
			</div>
			<Interactive.Div
				name="Role"
				style={{
					position: "absolute",
					left: 160,
					top: 480,
					fontFamily: "'Instrument Sans', sans-serif",
					fontSize: 48,
					color: "white",
					opacity: interpolate(frame, [18, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
				}}
			>
				Infrastructure engineer · Madrid or remote
			</Interactive.Div>
			<Interactive.Div
				name="Site"
				style={{
					position: "absolute",
					left: 160,
					top: 620,
					fontFamily: "Unbounded, sans-serif",
					fontSize: 64,
					color: "white",
					translate: interpolate(frame, [26, 44], ["0px 40px", "0px 0px"], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					}),
					opacity: interpolate(frame, [26, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
				}}
			>
				aaronmompie.com
			</Interactive.Div>
			<Interactive.Div
				name="Handles"
				style={{
					position: "absolute",
					left: 160,
					top: 740,
					fontFamily: "'Instrument Sans', sans-serif",
					fontSize: 40,
					color: "rgba(255, 255, 255, 0.82)",
					opacity: interpolate(frame, [36, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
				}}
			>
				@arrrnmp · hello@aaronmompie.com
			</Interactive.Div>
			<Interactive.Div
				name="Credit"
				style={{
					position: "absolute",
					left: 160,
					bottom: 70,
					fontFamily: "'Big Shoulders', sans-serif",
					fontSize: 30,
					letterSpacing: 2,
					color: "rgba(255, 255, 255, 0.7)",
					opacity: interpolate(frame, [48, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
				}}
			>
				BUILT WITH CLAUDE OPUS 5.5 · MUSIC: “IT’S COMPLICATED” BY ME
			</Interactive.Div>
		</AbsoluteFill>
	);
};
