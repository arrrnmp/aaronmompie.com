/** macOS-style pointers, drawn with their hotspot at (0, 0). Sizes are in viewport pixels. */
export const Cursor: React.FC<{ x: number; y: number; hand: boolean; press: number; size: number }> = ({ x, y, hand, press, size }) => {
	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: 0,
				height: 0,
				filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.45))",
			}}
		>
			{hand ? (
				// Hotspot at the fingertip.
				<svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: -size * 0.43, top: -size * 0.04, scale: press, transformOrigin: "43% 4%" }}>
					<path
						d="M9 2.4c0-.8.7-1.4 1.5-1.4s1.5.6 1.5 1.4V9c0-.8.6-1.3 1.3-1.3s1.3.5 1.3 1.3v.6c0-.8.6-1.3 1.3-1.3s1.3.5 1.3 1.3v.7c0-.7.6-1.2 1.2-1.2s1.2.5 1.2 1.2V15c0 3.4-2.3 6.2-5.7 6.2h-1.6c-1.7 0-2.8-.8-3.8-2.1l-3.4-4.5c-.5-.6-.4-1.5.2-1.9.6-.5 1.5-.3 2 .3L9 15z"
						fill="white"
						stroke="black"
						strokeWidth="1.2"
						strokeLinejoin="round"
					/>
					<path d="M12 9v4.6M14.6 9.6v4M17.2 10.3v3.3" stroke="black" strokeWidth="1" strokeLinecap="round" />
				</svg>
			) : (
				<svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: -size * 0.2, top: -size * 0.08, scale: press, transformOrigin: "20% 8%" }}>
					<path d="M4.8 1.9v17.6l4.3-4.2 2.7 6.3 3-1.3-2.6-6.1h6z" fill="black" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
				</svg>
			)}
		</div>
	);
};
