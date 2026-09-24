import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { interpolate, staticFile, useVideoConfig } from "remotion";
import "./brand";
import { Hook } from "./scenes/Hook";
import { Outro } from "./scenes/Outro";
import { PhoneScene } from "./scenes/PhoneScene";
import { SiteScene } from "./scenes/SiteScene";

const cut = linearTiming({ durationInFrames: 12 });

/** ~40 s showcase of aaronmompie.com for X, scored with the track from the site's record. */
export const Showcase: React.FC = () => {
	const { durationInFrames } = useVideoConfig();
	return (
		<>
			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={100} name="Hook">
					<Hook />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={cut} />
				<TransitionSeries.Sequence durationInFrames={180} name="Hero">
					<SiteScene tag="01" title="Dot portrait." aside="Hover to reveal." clip="hero.mp4" from={1.0} playbackRate={1.25} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={cut} />
				<TransitionSeries.Sequence durationInFrames={165} name="Scroll">
					<SiteScene tag="02" title="Experience." aside="Projects." clip="scroll.mp4" from={0.2} playbackRate={1.3} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={cut} />
				<TransitionSeries.Sequence durationInFrames={180} name="Record">
					<SiteScene tag="03" title="Two sides." aside="Side B is my own track." clip="record.mp4" from={1.3} playbackRate={1.5} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={cut} />
				<TransitionSeries.Sequence durationInFrames={170} name="Theme">
					<SiteScene tag="04" title="Dark, light." aside="English, español." clip="theme.mp4" from={0.6} playbackRate={1.6} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={cut} />
				<TransitionSeries.Sequence durationInFrames={195} name="Phone">
					<PhoneScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={cut} />
				<TransitionSeries.Sequence durationInFrames={140} name="Finale">
					<SiteScene tag="06" title="And the ending." aside="Open to work." clip="finale.mp4" from={0.8} playbackRate={1.5} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={cut} />
				<TransitionSeries.Sequence durationInFrames={190} name="Outro">
					<Outro />
				</TransitionSeries.Sequence>
			</TransitionSeries>
			<Audio
				src={staticFile("media/its-complicated.mp3")}
				volume={(f) =>
					interpolate(f, [0, 12, durationInFrames - 50, durationInFrames - 1], [0, 0.9, 0.9, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					})
				}
			/>
		</>
	);
};
