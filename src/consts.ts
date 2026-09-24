// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Aaron Mompié';
export const SITE_DESCRIPTION =
	'Engineer and writer. Building things that close the gap between people and what they need. Madrid.';
export const SITE_TWITTER_HANDLE = '@arrrnmp';

export const SITE_EMAIL = 'hello@aaronmompie.com';
export const SITE_CV_URL = '/cv.pdf';
export const SITE_LINKEDIN_URL = 'https://www.linkedin.com/in/aaron-mompie/';
export const SITE_X_URL = 'https://x.com/arrrnmp';
export const SITE_INSTAGRAM_URL = 'https://instagram.com/arrrnmp';

export const CAROUSEL_ENABLED = true;

export interface Project {
	title: string;
	description: string;
	longDescription: string;
	techStack: string[];
	role: string;
	url?: string;
	github?: string;
}

export const PROJECTS: Project[] = [
	{
		title: 'Staff Planner AI',
		description:
			'AI-assisted scheduling where the model parses intent and OR-Tools enforces the math.',
		longDescription:
			'Weekly staff scheduling is a constraint problem. This app lets a manager describe rules in plain language — the AI parses intent, a Python OR-Tools solver enforces feasibility, and a React frontend handles the rest. Gemini or NVIDIA inference, PostgreSQL persistence, and an infeasibility diagnostic when the constraints can\'t be satisfied.',
		techStack: ['React 19', 'Bun', 'TypeScript', 'Python', 'OR-Tools', 'PostgreSQL'],
		role: 'Design & Engineering',
		github: 'https://github.com/arrrnmp/staff-planner-ai',
	},
	{
		title: 'Discord MCP Server',
		description:
			'Your server\'s co-op. Every member, every channel, every action — one AI away.',
		longDescription:
			'Hand your AI the controls: member management, moderation, message handling, channel organisation across 80+ Discord API endpoints. Built with a guild allowlist and dry-run mode so everything runs reviewed and on-purpose. Making Discord servers has never been easier.',
		techStack: ['TypeScript', 'Bun', 'MCP', 'Discord API'],
		role: 'Systems Engineering',
		github: 'https://github.com/arrrnmp/discord-mcp',
	},
	{
		title: 'Caynac: Caymann & Maniac',
		description:
			'Game repacking CLI tools with a React-powered TUI — 13 releases shipped.',
		longDescription:
			'A TypeScript monorepo of two tools for game repacking. The interface is built in Ink — React for the terminal — which means component-driven layout and declarative rendering in your shell. Thirteen releases in, still going.',
		techStack: ['TypeScript', 'Bun', 'Ink', 'React'],
		role: 'Tool Development',
		github: 'https://github.com/arrrnmp/caynac',
	},
	{
		title: 'aPhone Mirroring',
		description:
			'Android on macOS, natively. The other side of the mirror.',
		longDescription:
			'A native macOS app that mirrors Android screens and surfaces Messages, Calls, Photos, Contacts, and Notifications through a SwiftUI interface. The Android side is Kotlin; they communicate over a TCP JSON bridge using the scrcpy v3.3.4 protocol. Two native apps, one coherent experience.',
		techStack: ['Swift', 'SwiftUI', 'Kotlin', 'scrcpy', 'TCP'],
		role: 'Native Engineering',
		github: 'https://github.com/arrrnmp/aphone-mirroring',
	},
	{
		title: 'Dispatch',
		description:
			'AI-researched daily briefings delivered every morning — be the most interesting one in the standup.',
		longDescription:
			'A Claude Routine that runs every morning before work: researches the past day\'s news, organises it by category, and pushes a fresh MDX file to the repo. Built to learn how Claude Code Cloud Routines work; turned out to be genuinely useful.',
		techStack: ['Claude Code', 'Cloud Routines', 'MDX', 'Astro'],
		role: 'Automation & Research',
		url: 'https://dispatch.aaronmompie.com',
		github: 'https://github.com/arrrnmp/dispatch',
	},
	{
		title: 'Personal Assistant',
		description:
			'A local-first macOS menu bar AI, connected to your own model, not someone else\'s.',
		longDescription:
			'A SwiftUI menu bar app that connects to LM Studio over an OpenAI-compatible API with streaming responses and MCP tool support. Everything runs on your machine. No telemetry, no subscription, no cloud dependency.',
		techStack: ['Swift', 'SwiftUI', 'LM Studio', 'MCP'],
		role: 'Native Engineering',
		github: 'https://github.com/arrrnmp/personal-assistant',
	},
];
