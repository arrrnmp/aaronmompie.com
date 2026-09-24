import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";

/** Cold open: the claim, in the site's condensed type. */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Backdrop />
			<Interactive.Div
				name="URL"
				style={{
					position: "absolute",
					left: 160,
					top: 130,
					fontFamily: "'Instrument Sans', sans-serif",
					fontSize: 44,
					color: "#b3b0a8",
					opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
				}}
			>
				aaronmompie.com
			</Interactive.Div>
			<div style={{ position: "absolute", left: 160, top: 220, fontFamily: "'Big Shoulders', sans-serif", fontSize: 250, lineHeight: 0.86, color: "#f3f1ec" }}>
				<div style={{ overflow: "hidden" }}>
					<Interactive.Div
						name="Line 1"
						style={{
							translate: interpolate(frame, [2, 20], ["0px 230px", "0px 0px"], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
								easing: Easing.bezier(0.16, 1, 0.3, 1),
							}),
						}}
					>
						I BUILT MY SITE
					</Interactive.Div>
				</div>
				<div style={{ overflow: "hidden" }}>
					<Interactive.Div
						name="Line 2"
						style={{
							translate: interpolate(frame, [9, 27], ["0px 230px", "0px 0px"], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
								easing: Easing.bezier(0.16, 1, 0.3, 1),
							}),
						}}
					>
						WITH CLAUDE
					</Interactive.Div>
				</div>
				<div style={{ overflow: "hidden", display: "inline-block", marginTop: 16 }}>
					<Interactive.Div
						name="Line 3"
						style={{
							backgroundColor: "#2b3bff",
							color: "white",
							padding: "10px 26px 0",
							clipPath: `inset(0 ${interpolate(frame, [20, 38], [100, 0], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
								easing: Easing.bezier(0.65, 0, 0.35, 1),
							})}% 0 0)`,
						}}
					>
						OPUS 5.5.
					</Interactive.Div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
