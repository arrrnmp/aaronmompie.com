import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_EMAIL, SITE_LINKEDIN_URL, SITE_TITLE, SITE_X_URL } from "../consts";

// https://llmstxt.org — a Markdown map of the site for language models.
export const GET: APIRoute = async ({ site }) => {
	const url = (path: string) => new URL(path, site).toString();
	const projects = (await getCollection("projects", ({ data }) => !data.draft)).sort(
		(a, b) => a.data.order - b.data.order,
	);
	const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	const lines = [
		`# ${SITE_TITLE}`,
		"",
		`> ${SITE_DESCRIPTION}`,
		"",
		`Personal site of ${SITE_TITLE}. Contact: ${SITE_EMAIL}.`,
		"",
		"## Pages",
		"",
		`- [About](${url("/about/")}): Background, what he's doing now, and why he builds things`,
		`- [Work](${url("/projects/")}): Selected projects with stack and links`,
		...(posts.length > 0 ? [`- [Writing](${url("/blog/")}): Essays and notes`] : []),
		"",
		"## Projects",
		"",
		...projects.map(({ data: p }) => `- [${p.title}](${p.url ?? p.github ?? url("/projects/")}): ${p.description}`),
		...(posts.length > 0
			? ["", "## Writing", "", ...posts.map((p) => `- [${p.data.title}](${url(`/blog/${p.id}/`)}): ${p.data.description}`)]
			: []),
		"",
		"## Optional",
		"",
		`- [RSS](${url("/rss.xml")})`,
		`- [LinkedIn](${SITE_LINKEDIN_URL})`,
		`- [X](${SITE_X_URL})`,
		"",
	];

	return new Response(lines.join("\n"), {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
