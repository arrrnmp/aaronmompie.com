import { Video } from "@remotion/media";
import { staticFile } from "remotion";
import { BLUE, COND, LINE, MUTED, SANS, TEXT } from "../brand";

type Props = {
	/** File in public/footage. */
	clip: string;
	/** Seconds into the clip to start from. */
	from: number;
	playbackRate: number;
	url?: string;
	width: number;
	style?: React.CSSProperties;
};

/** A minimal browser window playing a screen recording of the site. */
export const BrowserFrame: React.FC<Props> = ({ clip, from, playbackRate, url = "aaronmompie.com", width, style }) => {
	const bar = 46;
	return (
		<div
			style={{
				position: "absolute",
				width,
				borderRadius: 14,
				overflow: "hidden",
				border: `1.5px solid ${LINE}`,
				backgroundColor: "#141416",
				boxShadow: "0 40px 120px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.4)",
				...style,
			}}
		>
			<div style={{ height: bar, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: `1.5px solid ${LINE}` }}>
				{["#3a3a3f", "#3a3a3f", "#3a3a3f"].map((c, i) => (
					<div key={i} style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: c }} />
				))}
				<div
					style={{
						marginLeft: 24,
						flex: 1,
						maxWidth: 520,
						height: 28,
						borderRadius: 8,
						backgroundColor: "#0b0b0c",
						display: "flex",
						alignItems: "center",
						padding: "0 14px",
						gap: 2,
						fontFamily: SANS,
						fontSize: 17,
						color: TEXT,
					}}
				>
					<span style={{ color: MUTED }}>https://</span>
					{url}
				</div>
				<div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, fontFamily: COND, fontSize: 20, letterSpacing: 1.5, color: MUTED }}>
					<div style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: BLUE }} />
					BUILT WITH CLAUDE OPUS 5.5
				</div>
			</div>
			<Video
				src={staticFile(`footage/${clip}`)}
				trimBefore={Math.round(from * 30)}
				playbackRate={playbackRate}
				muted
				style={{ display: "block", width, height: (width * 9) / 16 }}
			/>
		</div>
	);
};
