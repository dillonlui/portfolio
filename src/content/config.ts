import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    slug: z.string(),
    tags: z.array(z.string()),
    accentColor: z.string().default('#1a1a1a'),
    order: z.number().default(0),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  projects: projectsCollection,
};
