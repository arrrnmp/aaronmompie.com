import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			/** Describes the hero image for screen readers; falls back to the post title. */
			heroImageAlt: z.string().optional(),
			draft: z.boolean().default(false),
			tags: z.array(z.string()).default([]),
		}),
});

const projects = defineCollection({
	// One Markdown file per project in `src/content/projects/`; the body is the long description.
	loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			/** One-liner used in lists and llms.txt. */
			description: z.string(),
			role: z.string(),
			techStack: z.array(z.string()),
			url: z.url().optional(),
			github: z.url().optional(),
			/** Screenshot, relative to the project file. */
			cover: image().optional(),
			/** Sort position on the Work page, lowest first. */
			order: z.number(),
			featured: z.boolean().default(false),
			draft: z.boolean().default(false),
			/** Spanish copy for /es/. The Markdown body is the English long description. */
			es: z
				.object({
					description: z.string(),
					role: z.string(),
					long: z.string(),
					techStack: z.array(z.string()).optional(),
				})
				.optional(),
		}),
});

export const collections = { blog, projects };
