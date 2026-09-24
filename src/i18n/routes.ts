import type { Lang } from './ui';

/** Pages that exist in both languages. English lives at the root, Spanish under /es/. Trailing slashes match the canonical URLs Cloudflare serves. */
const PAGES = {
	home: { en: '/', es: '/es/' },
	about: { en: '/about/', es: '/es/sobre-mi/' },
	work: { en: '/projects/', es: '/es/proyectos/' },
} as const;

export type Page = keyof typeof PAGES;

export const path = (page: Page, lang: Lang) => PAGES[page][lang];

export const langFromUrl = (url: URL): Lang => (url.pathname === '/es' || url.pathname.startsWith('/es/') ? 'es' : 'en');

/** True when the page exists in both languages. */
export function isShared(pathname: string): boolean {
	const clean = pathname.replace(/\/+$/, '') || '/';
	return Object.values(PAGES).some((p) => [p.en, p.es].some((x) => (x.replace(/\/+$/, '') || '/') === clean));
}

/** The same page in the other language; pages that only exist in English map to the other home page. */
export function alternate(pathname: string, to: Lang): string {
	const clean = pathname.replace(/\/+$/, '') || '/';
	for (const p of Object.values(PAGES)) {
		const en = p.en.replace(/\/+$/, '') || '/';
		const es = p.es.replace(/\/+$/, '') || '/';
		if (clean === en || clean === es) return p[to];
	}
	return PAGES.home[to];
}

/** Which shared page a path is, if any (used to pick its share image). */
export function pageFromPath(pathname: string): Page | undefined {
	const clean = pathname.replace(/\/+$/, '') || '/';
	return (Object.keys(PAGES) as Page[]).find((page) =>
		[PAGES[page].en, PAGES[page].es].some((p) => (p.replace(/\/+$/, '') || '/') === clean),
	);
}
