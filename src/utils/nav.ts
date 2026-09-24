/** Strip trailing slashes so "/blog/" and "/blog" compare equal; "" becomes "/". */
export function normalizePath(path: string): string {
	const cleaned = path.replace(/\/+$/, "");
	return cleaned === "" ? "/" : cleaned;
}

/** "/" only matches itself; any other link also matches its sub-paths (e.g. /blog/post). */
export function isActivePath(currentPath: string, href: string): boolean {
	const current = normalizePath(currentPath);
	const target = normalizePath(href);
	return target === "/"
		? current === "/"
		: current === target || current.startsWith(`${target}/`);
}
