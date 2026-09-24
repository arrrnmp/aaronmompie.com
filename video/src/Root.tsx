import { Composition, Folder } from "remotion";
import "./brand";
import { Hook } from "./scenes/Hook";
import { Outro } from "./scenes/Outro";
import { PhoneScene } from "./scenes/PhoneScene";
import { Showcase } from "./Showcase";

// 100 + 180 + 165 + 180 + 170 + 195 + 140 + 190 scene frames, minus 7 cuts of 12.
const SHOWCASE_FRAMES = 1320 - 7 * 12;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="Showcase" component={Showcase} durationInFrames={SHOWCASE_FRAMES} fps={30} width={1920} height={1080} />
			<Folder name="Scenes">
				<Composition id="Hook" component={Hook} durationInFrames={100} fps={30} width={1920} height={1080} />
				<Composition id="Phone" component={PhoneScene} durationInFrames={195} fps={30} width={1920} height={1080} />
				<Composition id="Outro" component={Outro} durationInFrames={190} fps={30} width={1920} height={1080} />
			</Folder>
		</>
	);
};
