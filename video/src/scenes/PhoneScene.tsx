import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BLUE, COND, LINE, SANS, TEXT } from "../brand";
import { Backdrop } from "../components/Backdrop";
import { Caption } from "../components/Caption";

const facts = ["Astro 6, fully static", "English & Spanish", "Dark & light, reduced-motion aware", "Served from Cloudflare Workers"];

/** The phone layout next to what the site is made of. */
export const PhoneScene: React.FC = () => {
	const frame = useCurrentFrame();
	const screenH = 880;
	const screenW = Math.round((screenH * 1170) / 2532);
	return (
		<AbsoluteFill>
			<Backdrop />
			<Caption tag="05" title="Phone-first, too." style={{ left: 160, top: 150 }} />
			<div style={{ position: "absolute", left: 160, top: 360, display: "flex", flexDirection: "column", gap: 30 }}>
				{facts.map((f, i) => (
					<div
						key={f}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 26,
							fontFamily: SANS,
							fontSize: 54,
							color: TEXT,
							opacity: interpolate(frame, [18 + i * 7, 30 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
							translate: interpolate(frame, [18 + i * 7, 34 + i * 7], ["-40px 0px", "0px 0px"], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
								easing: Easing.bezier(0.16, 1, 0.3, 1),
							}),
						}}
					>
						<div style={{ width: 16, height: 16, backgroundColor: BLUE, flexShrink: 0 }} />
						{f}
					</div>
				))}
				<div
					style={{
						marginTop: 34,
						paddingTop: 30,
						borderTop: `2px solid ${LINE}`,
						fontFamily: COND,
						fontSize: 58,
						letterSpacing: 1,
						color: "#9aa4ff",
						opacity: interpolate(frame, [50, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
					}}
				>
					NO FRAMEWORK CSS. NO UI LIBRARY.
				</div>
			</div>
			<div
				style={{
					position: "absolute",
					right: 230,
					top: (1080 - screenH) / 2 - 16,
					padding: 16,
					borderRadius: 64,
					backgroundColor: "#1b1b1e",
					border: `2px solid #34343a`,
					boxShadow: "0 40px 120px rgba(0,0,0,.6)",
					translate: interpolate(frame, [0, 22], ["0px 140px", "0px 0px"], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					}),
					rotate: interpolate(frame, [0, 22], ["4deg", "0deg"], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					}),
				}}
			>
				<div style={{ width: screenW, height: screenH, borderRadius: 48, overflow: "hidden", backgroundColor: "#0b0b0c" }}>
					<Video src={staticFile("footage/phone.mp4")} trimBefore={9} playbackRate={1.3} muted style={{ width: screenW, height: screenH, display: "block" }} />
				</div>
			</div>
		</AbsoluteFill>
	);
};
