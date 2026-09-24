/** Work history shown on the home page, newest first. `did` items may contain <b> for highlights. */
export interface Role {
	when: string;
	/** Nightly = ongoing, Played = finished, Graduated = education. */
	badge: 'Nightly' | 'Played' | 'Graduated';
	org: string;
	role: string;
	note?: string;
	did: string[];
}

export const EXPERIENCE: Role[] = [
	{
		when: '2025 →',
		badge: 'Nightly',
		org: 'The Homelab',
		role: 'Owner & operator',
		did: [
			'Two-node <b>Proxmox</b> cluster built from hardware other people retired.',
			'Self-hosts <b>Matrix</b> and <b>Nextcloud</b>; runs local LLM inference on an RTX 5070 Ti.',
		],
	},
	{
		when: 'Mar–May 2026',
		badge: 'Played',
		org: 'Abalun',
		role: 'Intern',
		did: [
			'Designed and built sites in <b>Webflow</b> and <b>Elementor</b>, tuned for performance and responsiveness.',
			'Managed <b>MySQL</b> and <b>PostgreSQL</b>: schema design, query optimization and migrations.',
		],
	},
	{
		when: 'Apr–May 2025',
		badge: 'Played',
		org: 'Ibertronica',
		role: 'Intern',
		did: [
			'Assembled custom servers and workstations end to end, from component compatibility to cable management.',
			'Validated every build with <b>MemTest86+</b> and thermal monitoring before it shipped.',
		],
	},
	{
		when: '2023–2024',
		badge: 'Played',
		org: 'Turing AI',
		role: 'Product & Community Manager',
		note: 'Acquired by shapes.inc',
		did: [
			'Owned the user experience for <b>767,000+ users</b>, turning their feedback into product fixes.',
			'Helped put the AI APIs behind <b>RabbitMQ</b> load balancing to keep the service stable while it grew.',
		],
	},
	{
		when: '2024–2026',
		badge: 'Graduated',
		org: 'Colegio G. Nicoli',
		role: 'CFGM · Microcomputer Systems & Networks',
		did: ['Formal credential for what I was already doing: systems, networks, hardware.'],
	},
];

/** Side A of the record: ages, not years. */
export const ORIGIN: { age: number; text: string }[] = [
	{ age: 6, text: 'First website.' },
	{ age: 8, text: 'Minecraft servers. Hated the Java, loved the server.' },
	{ age: 13, text: 'TypeScript and Discord bots.' },
	{ age: 15, text: 'Turing AI: the experience of 767,000+ users.' },
	{ age: 17, text: 'The homelab. Still running.' },
	{ age: 18, text: 'CFGM done. Next room: infrastructure.' },
];

/** The quick facts in the scrolling band under the hero. */
export const FACTS = [
	'Infrastructure engineer',
	'Based in Madrid',
	'Open to remote roles',
	'Spanish & English',
	'Proxmox · Linux · Windows Server',
	'Self-hosted everything',
];
