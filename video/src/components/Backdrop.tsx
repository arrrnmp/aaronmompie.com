import { AbsoluteFill } from "remotion";

/** The site's near-black with a faint dot grid, a nod to the dot portraits. */
export const Backdrop: React.FC<{ color?: string; dots?: string }> = ({
	color = "#0b0b0c",
	dots = "rgba(243, 241, 236, 0.07)",
}) => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: color,
				backgroundImage: `radial-gradient(${dots} 1.6px, transparent 1.7px)`,
				backgroundSize: "28px 28px",
			}}
		/>
	);
};
