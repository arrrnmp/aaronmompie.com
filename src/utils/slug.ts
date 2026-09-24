/** URL-safe slug: "Home Lab" → "home-lab", "Mompié" → "mompie". */
export function slugify(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
