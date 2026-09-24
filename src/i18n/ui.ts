/**
 * All site copy, in English and in Spanish (written for a Spain audience).
 * English is the source shape; Spanish must match it key for key.
 * Strings used with `set:html` may contain <b> for highlights.
 */
import { SITE_DESCRIPTION, SITE_ROLE, SITE_TITLE } from '../consts';

export const LANGS = ['en', 'es'] as const;
export type Lang = (typeof LANGS)[number];

export interface Role {
	when: string;
	/** Drives the badge colour: `now` is ongoing and highlighted. */
	kind: 'now' | 'done' | 'grad';
	org: string;
	role: string;
	note?: string;
	did: string[];
}

const en = {
	meta: {
		locale: 'en_GB',
		/** The home page <title>; other pages get "Page | Aaron Mompié". */
		homeTitle: `${SITE_TITLE} · ${SITE_ROLE} in Madrid`,
		role: SITE_ROLE,
		description: SITE_DESCRIPTION,
		cv: '/cv_en.pdf',
		email: 'hello@aaronmompie.com',
		/** Alt text for the share image (Open Graph / X card). */
		shareAlt: 'Aaron Mompié, infrastructure engineer in Madrid, next to a dot portrait of him in a cap and hoodie.',
	},
	nav: {
		label: 'Primary',
		home: 'home',
		work: 'Work',
		experience: 'Experience',
		about: 'About',
		writing: 'Writing',
		contact: 'Contact',
		hire: 'Hire me ↗',
		openMenu: 'Open menu',
		closeMenu: 'Close menu',
		toLight: 'Switch to light theme',
		toDark: 'Switch to dark theme',
		langName: 'Español',
		langShort: 'ES',
		skip: 'Skip to content',
	},
	hero: {
		role: ['Infrastructure', 'engineer.'],
		lede: 'Servers, networks and virtualization by day. Learning to produce music and sing by night.',
		stance: 'Strong opinions, held calmly.',
		hire: 'Hire me ↗',
		work: 'See the work',
		cv: 'CV (PDF)',
		portrait: 'Portrait of Aaron in a cap and hoodie, drawn in white dots. Hovering reveals the photo.',
		facts: [SITE_ROLE, 'Based in Madrid', 'Open to remote roles', 'Spanish & English', 'Proxmox · Linux · Windows Server', 'Self-hosted everything'],
	},
	experience: {
		title: 'Experience',
		badges: { now: 'Nightly', done: 'Played', grad: 'Graduated' },
		jobs: [
			{
				when: '2025 →',
				kind: 'now',
				org: 'The Homelab',
				role: 'Owner & operator',
				did: [
					'Two-node <b>Proxmox</b> cluster built from hardware other people retired.',
					'Self-hosts <b>Matrix</b> and <b>Nextcloud</b>; runs local LLM inference on an RTX 5070 Ti.',
				],
			},
			{
				when: 'Mar–May 2026',
				kind: 'done',
				org: 'Abalun',
				role: 'Intern',
				did: [
					'Designed and built sites in <b>Webflow</b> and <b>Elementor</b>, tuned for performance and responsiveness.',
					'Managed <b>MySQL</b> and <b>PostgreSQL</b>: schema design, query optimization and migrations.',
				],
			},
			{
				when: 'Apr–May 2025',
				kind: 'done',
				org: 'Ibertronica',
				role: 'Intern',
				did: [
					'Assembled custom servers and workstations end to end, from component compatibility to cable management.',
					'Validated every build with <b>MemTest86+</b> and thermal monitoring before it shipped.',
				],
			},
			{
				when: '2023–2024',
				kind: 'done',
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
				kind: 'grad',
				org: 'Colegio G. Nicoli',
				role: 'CFGM · Microcomputer Systems & Networks',
				did: ['Formal credential for what I was already doing: systems, networks, hardware.'],
			},
		] as Role[],
	},
	projects: {
		title: 'Projects',
		all: 'All the details ↗',
		featured: 'Featured',
		inProgress: 'in progress',
		live: 'live',
		soon: 'Release coming soon',
		open: 'Open it ↗',
		source: 'Source',
		liveLink: 'Live',
	},
	sides: {
		title: 'Two sides',
		flipTo: (side: string) => `Tap the cover to flip to Side ${side}`,
		sleeve: (side: string) => `Flip the record to side ${side}`,
		sideWord: 'SIDE',
		coverB: 'SIDE B — STUDIO',
		aLabel: 'Side A · Origin',
		aTitle: 'Online since six.',
		origin: [
			{ age: 6, text: 'First website.' },
			{ age: 8, text: 'Minecraft servers. Hated the Java, loved the server.' },
			{ age: 13, text: 'TypeScript and Discord bots.' },
			{ age: 15, text: 'Turing AI: the experience of 767,000+ users.' },
			{ age: 17, text: 'The homelab. Still running.' },
			{ age: 18, text: 'CFGM done. Next room: infrastructure.' },
		],
		readMore: 'Read the full story ↗',
		bLabel: 'Side B · Studio',
		bTitle: 'In the studio.',
		bText: 'Learning to produce music and to sing. Early days, solid foundations. This one has no words yet.',
		trackMeta: 'Aaron Mompié · Instrumental demo · 2026',
		play: 'Play “it\'s complicated”',
		pause: 'Pause “it\'s complicated”',
		seek: 'Seek in “it\'s complicated”',
		essay: 'Also on this side: my first essay, on being present and on nostalgia. Coming soon.',
	},
	finale: {
		label: 'Open to work',
		title: "Let's talk.",
		cv: 'CV (PDF)',
		pose: 'Aaron framing the camera with his hand, drawn in white dots. Hovering reveals the photo.',
		place: 'Madrid, ES',
	},
	about: {
		title: 'About',
		description: `Madrid born and raised. ${SITE_ROLE}. The full story, from a first website at six to a homelab that never sleeps.`,
		back: '← Back home',
		label: 'About · the full story',
		heading: ['The full', 'story.'],
		lead: `Madrid born and raised. ${SITE_ROLE}. ADHD, Asperger's, gifted. Building things that close the gap between people and what they need.`,
		yearsOld: 'years old',
		chapters: [
			{ age: '6', title: 'The first website.', text: 'Before I could explain what a server was, I wanted one. The website came first, and with it the habit of taking things apart to see how they run.' },
			{ age: '8', title: 'Minecraft servers.', text: 'Plugins in Java, which I hated. But it was the first time I cared more about how the server worked than what I was building on top of it. The systems instinct was there before I had a name for it.' },
			{ age: '13', title: 'TypeScript and Discord bots.', text: 'By thirteen I had most of the technical foundations I still carry. Code that other people actually used, and broke, and needed fixed.' },
			{ age: '15', title: 'Turing AI.', text: 'Product and community manager for an AI product with <b>767,000+ users</b>, later acquired by shapes.inc. I turned what people told us into fixes, and helped put the AI APIs behind RabbitMQ load balancing so the service held up while it grew.' },
			{ age: '17', title: 'Burnout, then the homelab.', text: 'Then burnout hit. A hard stop. The homelab brought me back: a Proxmox cluster built from hardware other people retired, running my own Matrix and Nextcloud and local AI. Fixing real errors on real machines, with real consequences, fixed something in me too. Around the same time I built servers at Ibertronica, testing every one before it shipped.' },
			{ age: '18', title: 'Abalun, and the paper trail.', text: 'Practice hours at Abalun pulled me into real work fast enough that the line blurred: sites in Webflow and Elementor, schemas and migrations in MySQL and PostgreSQL. What it mostly did was kill the impostor syndrome. Turns out the impostor was the lie, not me. The CFGM in Microcomputer Systems and Networks made it official in June 2026.' },
		],
		nowAge: 'Now',
		nowTitle: 'Choosing the next room.',
		nowText: "I'm looking for infrastructure work with people who care how things run, in Madrid or remote. Moxen, my control plane for AI coding agents, is taking shape on the side.",
		threadLabel: 'The thread',
		thread: 'The distance between people and what they need is always smaller than it looks.',
		threadText: "Every project I build closes that gap a little. A scheduler that stops a manager carrying the week in their head. An AI that shows up where your people already are. A phone that stops gatekeeping your own life. Music pulls at me for the same reason: a good song doesn't create emotion, it removes what's in the way of it.",
		trio: [
			{ label: 'Writing', title: 'How I think.', text: "I'll type three paragraphs to understand one sentence. I want to write about whatever I'm trying to understand: systems, neurodivergence as it's lived, the parts of a person that don't fit on a CV. First essay: being present, and nostalgia." },
			{ label: 'Music', title: 'Side B.', text: 'Learning to produce and to sing. Early days, solid foundations, and a first instrumental you can already play on the home page.', link: 'Play “it\'s complicated” ↗' },
			{ label: 'Madrid', title: 'Home, for now.', text: "The place that made me, and the people I love most are here. But I've started to feel the edges. One day I'll find out what happens when I leave. Until then: Madrid, and open to remote." },
		],
		hire: 'Hire me ↗',
	},
	work: {
		title: 'Work',
		description: "Everything I've built, with the stack and the reasoning behind it.",
		label: 'Work · every project',
		heading: 'Work.',
		lead: 'Infrastructure first. Software when the problem asks for it.',
		live: 'Live ↗',
		source: 'Source ↗',
	},
};

const es: typeof en = {
	meta: {
		locale: 'es_ES',
		homeTitle: 'Aaron Mompié · Técnico de infraestructura en Madrid',
		role: 'Técnico de infraestructura',
		description: 'Técnico de infraestructura en Madrid. Construyo cosas que acortan la distancia entre las personas y lo que necesitan.',
		cv: '/cv_es.pdf',
		email: 'hola@aaronmompie.com',
		shareAlt: 'Aaron Mompié, técnico de infraestructura en Madrid, junto a un retrato de puntos suyo con gorra y sudadera.',
	},
	nav: {
		label: 'Principal',
		home: 'inicio',
		work: 'Proyectos',
		experience: 'Experiencia',
		about: 'Sobre mí',
		writing: 'Escritos',
		contact: 'Contacto',
		hire: 'Contrátame ↗',
		openMenu: 'Abrir menú',
		closeMenu: 'Cerrar menú',
		toLight: 'Cambiar a tema claro',
		toDark: 'Cambiar a tema oscuro',
		langName: 'English',
		langShort: 'EN',
		skip: 'Saltar al contenido',
	},
	hero: {
		role: ['Técnico de', 'infraestructura.'],
		lede: 'Servidores, redes y virtualización de día. De noche, aprendiendo a producir música y a cantar.',
		stance: 'Opiniones firmes, manteniendo la calma.',
		hire: 'Contrátame ↗',
		work: 'Ver proyectos',
		cv: 'CV (PDF)',
		portrait: 'Retrato de Aaron con gorra y sudadera, dibujado con puntos blancos. Al pasar el ratón aparece la foto.',
		facts: ['Técnico de infraestructura', 'Desde Madrid', 'Abierto a remoto', 'Español e inglés', 'Proxmox · Linux · Windows Server', 'Servidores propios'],
	},
	experience: {
		title: 'Experiencia',
		badges: { now: 'En curso', done: 'Completado', grad: 'Titulado' },
		jobs: [
			{
				when: '2025 →',
				kind: 'now',
				org: 'Homelab',
				role: 'Propietario y administrador',
				did: [
					'Clúster <b>Proxmox</b> de dos nodos montado con hardware obsoleto.',
					'Mis propios servidores de <b>Matrix</b> y <b>Nextcloud</b>, e inferencia de LLM en local con una RTX 5070 Ti.',
				],
			},
			{
				when: 'mar–may 2026',
				kind: 'done',
				org: 'Abalun',
				role: 'Prácticas',
				did: [
					'Diseño y maquetación de webs en <b>Webflow</b> y <b>Elementor</b>, optimizadas en rendimiento y adaptadas a móvil.',
					'Bases de datos <b>MySQL</b> y <b>PostgreSQL</b>: diseño de esquemas, optimización de consultas y migraciones.',
				],
			},
			{
				when: 'abr–may 2025',
				kind: 'done',
				org: 'Ibertronica',
				role: 'Prácticas',
				did: [
					'Montaje completo de servidores y equipos a medida, desde la compatibilidad de componentes hasta el cableado.',
					'Validación de cada equipo con <b>MemTest86+</b> y control de temperaturas antes de la entrega.',
				],
			},
			{
				when: '2023–2024',
				kind: 'done',
				org: 'Turing AI',
				role: 'Product & Community Manager',
				note: 'Adquirida por shapes.inc',
				did: [
					'Responsable de la experiencia de <b>más de 767.000 usuarios</b>, convirtiendo su feedback en mejoras de producto.',
					'Colaboré en llevar las APIs de IA a un balanceo de carga con <b>RabbitMQ</b> para que el servicio siguiera estable mientras crecía.',
				],
			},
			{
				when: '2024–2026',
				kind: 'grad',
				org: 'Colegio G. Nicoli',
				role: 'CFGM · Sistemas Microinformáticos y Redes (SMR)',
				did: ['El título oficial sobre lo que ya hacía: sistemas, redes y hardware.'],
			},
		],
	},
	projects: {
		title: 'Proyectos',
		all: 'Todos los detalles ↗',
		featured: 'Destacado',
		inProgress: 'en desarrollo',
		live: 'publicado',
		soon: 'Lanzamiento muy pronto',
		open: 'Abrir ↗',
		source: 'Código',
		liveLink: 'Web',
	},
	sides: {
		title: 'Dos caras',
		flipTo: (side: string) => `Toca la portada para pasar a la cara ${side}`,
		sleeve: (side: string) => `Darle la vuelta al disco, cara ${side}`,
		sideWord: 'CARA',
		coverB: 'CARA B — ESTUDIO',
		aLabel: 'Cara A · Origen',
		aTitle: 'Trasteando desde los seis.',
		origin: [
			{ age: 6, text: 'Mi primera web.' },
			{ age: 8, text: 'Servidores de Minecraft. Odiaba Java, me encantaba el servidor.' },
			{ age: 13, text: 'TypeScript y bots de Discord.' },
			{ age: 15, text: 'Turing AI: la experiencia de más de 767.000 usuarios.' },
			{ age: 17, text: 'Mi homelab. Sigue en marcha.' },
			{ age: 18, text: 'SMR terminado. Siguiente paso: infraestructura.' },
		],
		readMore: 'Lee la historia completa ↗',
		bLabel: 'Cara B · Estudio',
		bTitle: 'En el estudio.',
		bText: 'Aprendiendo a producir música y a cantar. Primeros pasos, bases sólidas. Esta todavía no tiene letra.',
		trackMeta: 'Aaron Mompié · Maqueta instrumental · 2026',
		play: 'Reproducir «it\'s complicated»',
		pause: 'Pausar «it\'s complicated»',
		seek: 'Avanzar o retroceder en «it\'s complicated»',
		essay: 'También en esta cara: mi primer ensayo, sobre vivir el presente y la nostalgia. Muy pronto.',
	},
	finale: {
		label: 'Disponible para trabajar',
		title: '¿Hablamos?',
		cv: 'CV (PDF)',
		pose: 'Aaron encuadrando la cámara con la mano, dibujado con puntos blancos. Al pasar el ratón aparece la foto.',
		place: 'Madrid, España',
	},
	about: {
		title: 'Sobre mí',
		description: 'Nacido y criado en Madrid. Técnico de infraestructura. La historia completa, desde mi primera web a los seis años hasta un homelab que nunca duerme.',
		back: '← Volver al inicio',
		label: 'Sobre mí · la historia completa',
		heading: ['La historia', 'completa.'],
		lead: 'Nacido y criado en Madrid. Técnico de infraestructura. TDAH, Asperger, altas capacidades. Construyo cosas que acortan la distancia entre las personas y lo que necesitan.',
		yearsOld: 'años',
		chapters: [
			{ age: '6', title: 'Mi primera web.', text: 'Antes de saber explicar qué era un servidor, ya quería uno. Primero llegó la web, y con ella la costumbre de desmontar las cosas para ver cómo funcionan.' },
			{ age: '8', title: 'Servidores de Minecraft.', text: 'Plugins en Java, que odiaba. Pero fue la primera vez que me importó más cómo funcionaba el servidor que lo que construía encima. El instinto de sistemas ya estaba ahí antes de que supiera ponerle nombre.' },
			{ age: '13', title: 'TypeScript y bots de Discord.', text: 'Con trece años ya tenía casi todas las bases técnicas que sigo usando hoy. Código que otra gente usaba de verdad, rompía y necesitaba que arreglara.' },
			{ age: '15', title: 'Turing AI.', text: 'Product y community manager de un producto de IA con <b>más de 767.000 usuarios</b>, que acabó adquiriendo shapes.inc. Convertía lo que nos contaba la gente en mejoras, y ayudé a llevar las APIs de IA a un balanceo de carga con RabbitMQ para que el servicio aguantara mientras crecía.' },
			{ age: '17', title: 'El burnout, y después mi homelab.', text: 'Entonces llegó el burnout. Un parón en seco. Mi homelab me devolvió a la vida: un clúster Proxmox montado con hardware obsoleto, con mis propios servidores de Matrix y Nextcloud e IA en local. Arreglar errores reales en máquinas reales, con consecuencias reales, también arregló algo en mí. Por esa época monté servidores en Ibertronica, probando cada uno antes de entregarlo.' },
			{ age: '18', title: 'Abalun, y el título.', text: 'Las prácticas en Abalun me metieron en trabajo real tan rápido que la línea se difuminó: webs en Webflow y Elementor, esquemas y migraciones en MySQL y PostgreSQL. Sobre todo, acabaron con el síndrome del impostor. Resulta que la mentira era el impostor, no yo. El Grado Medio en SMR lo hizo oficial en junio de 2026.' },
		],
		nowAge: 'Hoy',
		nowTitle: 'Eligiendo el siguiente paso.',
		nowText: 'Busco trabajo en infraestructura con gente a la que le importe cómo funcionan las cosas, en Madrid o en remoto. Mientras tanto, Moxen, mi panel de control para agentes de IA de programación, va tomando forma.',
		threadLabel: 'El hilo',
		thread: 'La distancia entre las personas y lo que necesitan siempre es más corta de lo que parece.',
		threadText: 'Cada proyecto que construyo acorta un poco esa distancia. Un planificador para que un responsable deje de cargar con la semana en la cabeza. Una IA que aparece donde ya está tu gente. Un móvil que deja de ponerle puertas a tu propia vida. La música me atrae por lo mismo: una buena canción no crea la emoción, quita lo que se interpone.',
		trio: [
			{ label: 'Escribir', title: 'Cómo pienso.', text: 'Soy capaz de escribir tres párrafos para entender una sola frase. Quiero escribir sobre lo que esté intentando entender: sistemas, la neurodivergencia tal y como se vive, las partes de una persona que no caben en un CV. Primer ensayo: vivir el presente, y la nostalgia.' },
			{ label: 'Música', title: 'Cara B.', text: 'Aprendiendo a producir y a cantar. Primeros pasos, bases sólidas, y un primer instrumental que ya puedes escuchar en la página de inicio.', link: 'Escucha «it\'s complicated» ↗' },
			{ label: 'Madrid', title: 'Mi casa, por ahora.', text: 'El lugar que me hizo, y donde está la gente que más quiero. Pero he empezado a notar sus límites. Algún día descubriré qué pasa cuando me vaya. Hasta entonces: Madrid, y abierto a remoto.' },
		],
		hire: 'Contrátame ↗',
	},
	work: {
		title: 'Proyectos',
		description: 'Todo lo que he construido, con la tecnología y el porqué de cada decisión.',
		label: 'Proyectos · todos',
		heading: 'Proyectos.',
		lead: 'Primero la infraestructura. Software cuando el problema lo pide.',
		live: 'Web ↗',
		source: 'Código ↗',
	},
};

export const UI: Record<Lang, typeof en> = { en, es };

export const t = (lang: Lang) => UI[lang];
