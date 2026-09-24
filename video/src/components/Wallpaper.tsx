import { AbsoluteFill, useCurrentFrame } from "remotion";

const GRAIN =
	"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Soft, slowly drifting colour fields in the site's blues, with a little grain. */
export const Wallpaper: React.FC = () => {
	const frame = useCurrentFrame();
	const drift = (speed: number, amp: number, phase: number) => Math.sin(frame / (30 * speed) + phase) * amp;
	const blob = (color: string, size: number, x: number, y: number, speed: number, phase: number): React.CSSProperties => ({
		position: "absolute",
		width: size,
		height: size,
		borderRadius: "50%",
		background: color,
		left: x + drift(speed, 60, phase) - size / 2,
		top: y + drift(speed * 1.3, 40, phase + 1) - size / 2,
		filter: "blur(140px)",
	});
	return (
		<AbsoluteFill style={{ backgroundColor: "#070a2b", overflow: "hidden" }}>
			<div style={blob("#2b3bff", 1100, 380, 260, 7, 0)} />
			<div style={blob("#7b5cff", 900, 1600, 900, 9, 2)} />
			<div style={blob("#1aa3ff", 700, 1650, 120, 8, 4)} />
			<div style={blob("#0b0b0c", 900, 300, 1100, 10, 1)} />
			<div style={blob("#9aa4ff", 520, 980, 560, 6, 3)} />
			<AbsoluteFill style={{ backgroundImage: GRAIN, opacity: 0.07, mixBlendMode: "overlay" }} />
		</AbsoluteFill>
	);
};
