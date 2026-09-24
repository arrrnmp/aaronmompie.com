import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// The site's own fonts: the static latin subsets the share images use (src/assets/og).
loadFont({ family: "Unbounded", url: staticFile("og/unbounded-900.ttf"), weight: "900" });
loadFont({ family: "Big Shoulders", url: staticFile("og/big-shoulders-800.ttf"), weight: "800" });
loadFont({ family: "Instrument Sans", url: staticFile("og/instrument-sans-500.ttf"), weight: "500" });

// Mirrors src/styles/tokens.css (dark palette).
export const BG = "#0b0b0c";
export const TEXT = "#f3f1ec";
export const MUTED = "#b3b0a8";
export const LINE = "#2c2c2f";
export const BLUE = "#2b3bff";
export const BLUE_INK = "#9aa4ff";

export const DISPLAY = "Unbounded, sans-serif";
export const COND = "'Big Shoulders', sans-serif";
export const SANS = "'Instrument Sans', sans-serif";

export const FPS = 30;
