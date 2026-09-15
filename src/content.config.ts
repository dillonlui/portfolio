import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: '**/*.{yaml,yml}',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    slug: z.string(),
    tags: z.array(z.string()),
    thumbnailPosition: z.string().default('center center'),
    accentColor: z.string().default('#205d17'),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    archived: z.boolean().default(false),
  }),
});

export const collections = {
  projects: projectsCollection,
};
