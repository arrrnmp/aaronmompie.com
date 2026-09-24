import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrowserFrame } from "../components/BrowserFrame";
import { Caption } from "../components/Caption";

export type SiteSceneProps = {
	tag: string;
	title: string;
	aside?: string;
	clip: string;
	from: number;
	playbackRate: number;
	url?: string;
};

/** A captioned screen recording of the site in a browser window, with a slow push-in. */
export const SiteScene: React.FC<SiteSceneProps> = ({ tag, title, aside, clip, from, playbackRate, url }) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();
	return (
		<AbsoluteFill>
			<Backdrop />
			<Caption tag={tag} title={title} aside={aside} style={{ left: 295, top: 78 }} />
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 222,
					display: "flex",
					justifyContent: "center",
					transformOrigin: "50% 0%",
					scale: interpolate(frame, [0, durationInFrames], [1, 1.035], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
					translate: interpolate(frame, [0, 18], ["0px 70px", "0px 0px"], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					}),
				}}
			>
				<BrowserFrame clip={clip} from={from} playbackRate={playbackRate} url={url} width={1330} style={{ position: "relative" }} />
			</div>
		</AbsoluteFill>
	);
};
