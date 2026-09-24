import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BLUE, COND, TEXT } from "../brand";

type Props = {
	/** Small blue tag, e.g. "01". */
	tag: string;
	title: string;
	/** Optional second, muted part of the title. */
	aside?: string;
	delay?: number;
	style?: React.CSSProperties;
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** A scene headline in the site's condensed uppercase, rising out of a mask. */
export const Caption: React.FC<Props> = ({ tag, title, aside, delay = 6, style }) => {
	const frame = useCurrentFrame();
	return (
		<div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 28, ...style }}>
			<div
				style={{
					fontFamily: COND,
					fontSize: 40,
					letterSpacing: 2,
					color: "white",
					backgroundColor: BLUE,
					padding: "6px 16px 4px",
					clipPath: `inset(0 ${interpolate(frame, [delay - 4, delay + 8], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })}% 0 0)`,
				}}
			>
				{tag}
			</div>
			<div style={{ overflow: "hidden", paddingTop: 6 }}>
				<div
					style={{
						fontFamily: COND,
						fontSize: 100,
						lineHeight: 0.95,
						textTransform: "uppercase",
						color: TEXT,
						whiteSpace: "nowrap",
						translate: interpolate(frame, [delay, delay + 16], ["0px 110px", "0px 0px"], {
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
							easing: ease,
						}),
					}}
				>
					{title}
					{aside ? <span style={{ color: "#66656b" }}> {aside}</span> : null}
				</div>
			</div>
		</div>
	);
};
