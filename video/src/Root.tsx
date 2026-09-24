import { type CalculateMetadataFunction, Composition, staticFile } from "remotion";
import "./brand";
import { END_FRAMES, Showcase, type ShowcaseProps } from "./Showcase";
import type { Take } from "./take";

/** Loads the take's cursor and camera log; the video runs the length of the take plus the end card. */
const calculateMetadata: CalculateMetadataFunction<ShowcaseProps> = async ({ props }) => {
	const take: Take = await fetch(staticFile("footage/take.json")).then((r) => r.json());
	return {
		durationInFrames: Math.round(take.duration * 30) - 15 + END_FRAMES,
		props: { ...props, take },
	};
};

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="Showcase"
			component={Showcase}
			durationInFrames={900}
			fps={30}
			width={1920}
			height={1080}
			defaultProps={{ take: null }}
			calculateMetadata={calculateMetadata}
		/>
	);
};
