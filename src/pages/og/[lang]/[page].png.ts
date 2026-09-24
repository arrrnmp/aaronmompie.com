import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import sharp from "sharp";
import { SITE_TITLE } from "../../../consts";
import type { Page } from "../../../i18n/routes";
import { type Lang, t } from "../../../i18n/ui";

// Share images (Open Graph / X), one per page and language, drawn at build time
// in the site's own fonts. Static TTFs live in src/assets/og (satori can't read woff2).
const PAGES: Page[] = ["home", "about", "work"];
const LANGS: Lang[] = ["en", "es"];

export const getStaticPaths = (() =>
	LANGS.flatMap((lang) => PAGES.map((page) => ({ params: { lang, page } })))) satisfies GetStaticPaths;

const asset = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));
const assets = Promise.all([
	asset("unbounded-900.ttf"),
	asset("big-shoulders-800.ttf"),
	asset("instrument-sans-500.ttf"),
	asset("portrait.png"),
]);

type Node = { type: string; props: Record<string, unknown> & { style?: Record<string, unknown>; children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown, props: Record<string, unknown> = {}): Node => ({
	type,
	props: { ...props, style, children },
});

export const GET: APIRoute = async ({ params }) => {
	const lang = params.lang as Lang;
	const page = params.page as Page;
	const ui = t(lang);
	const [display, cond, sans, portrait] = await assets;
	const [first, ...rest] = SITE_TITLE.toUpperCase().split(" ");
	const chip = page === "about" ? ui.about.title : page === "work" ? ui.work.title : null;

	const tree = h("div", { width: 1200, height: 630, display: "flex", position: "relative", background: "#2b3bff", color: "#fff", fontFamily: "Instrument Sans" }, [
		h("img", { position: "absolute", right: -130, bottom: -30, width: 620, height: 644 }, undefined, {
			src: `data:image/png;base64,${portrait.toString("base64")}`,
		}),
		h("div", { display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 72px", width: "100%", height: "100%" }, [
			h("div", { display: "flex", alignItems: "center", gap: 18, fontFamily: "Big Shoulders", fontSize: 30, letterSpacing: 3, textTransform: "uppercase" }, [
				chip ? h("span", { background: "#fff", color: "#2b3bff", padding: "4px 14px 2px", borderRadius: 6 }, chip) : null,
				h("span", {}, `${ui.finale.label} · Madrid`),
			]),
			h("div", { display: "flex", flexDirection: "column" }, [
				h("div", { fontFamily: "Unbounded", fontSize: 128, lineHeight: 0.9, letterSpacing: -5 }, first),
				h("div", { fontFamily: "Unbounded", fontSize: 128, lineHeight: 0.9, letterSpacing: -5, marginTop: 6 }, rest.join(" ")),
				h("div", { fontFamily: "Big Shoulders", fontSize: 58, lineHeight: 1, letterSpacing: 2, textTransform: "uppercase", marginTop: 30 }, ui.meta.role),
			]),
			h("div", { fontSize: 26, color: "#dfe2ff" }, "aaronmompie.com"),
		]),
	]);

	const svg = await satori(tree as Parameters<typeof satori>[0], {
		width: 1200,
		height: 630,
		fonts: [
			{ name: "Unbounded", data: display, weight: 900, style: "normal" },
			{ name: "Big Shoulders", data: cond, weight: 800, style: "normal" },
			{ name: "Instrument Sans", data: sans, weight: 500, style: "normal" },
		],
	});
	const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: false }).toBuffer();
	return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
