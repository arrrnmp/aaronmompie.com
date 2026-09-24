// schema.org data (JSON-LD) shared by the pages that describe Aaron.
import { SITE_GITHUB_URL, SITE_LINKEDIN_URL, SITE_TITLE, SITE_X_URL } from '../consts';
import { path } from '../i18n/routes';
import { type Lang, t } from '../i18n/ui';

/** One stable id, so every page's Person is recognised as the same person. */
export const personId = (site: URL) => new URL('/#person', site).href;

export function person(lang: Lang, site: URL) {
	const { meta } = t(lang);
	return {
		'@type': 'Person',
		'@id': personId(site),
		name: SITE_TITLE,
		url: new URL('/', site).href,
		mainEntityOfPage: new URL(path('home', lang), site).href,
		image: new URL(`/og/${lang}/home.png`, site).href,
		description: meta.description,
		jobTitle: meta.role,
		email: `mailto:${meta.email}`,
		address: { '@type': 'PostalAddress', addressLocality: 'Madrid', addressCountry: 'ES' },
		nationality: { '@type': 'Country', name: 'Spain' },
		sameAs: [SITE_LINKEDIN_URL, SITE_GITHUB_URL, SITE_X_URL],
		knowsLanguage: ['es', 'en'],
		knowsAbout: ['Infrastructure', 'Virtualization', 'Proxmox', 'Linux', 'Windows Server', 'Networking', 'Self-hosting', 'Local LLM inference'],
	};
}

export const jsonLd = (graph: object[]) => JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
