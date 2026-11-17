import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const DISCIPLINES = {
  web: 'Développement web',
  'ui-ux': 'UI / UX',
  graphisme: 'Graphisme',
  audiovisuel: 'Audiovisuel',
  photo: 'Photographie',
  communication: 'Communication',
  'marketing-seo': 'Marketing & SEO',
  '3d': '3D',
} as const;

export type Discipline = keyof typeof DISCIPLINES;
const disciplineKeys = Object.keys(DISCIPLINES) as [Discipline, ...Discipline[]];

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Titre éditorial affiché en tête de fiche. */
      headline: z.string().optional(),
      summary: z.string(),
      year: z.number(),
      /** Ordre d'affichage (plus petit = plus haut). */
      order: z.number().default(100),
      featured: z.boolean().default(false),
      disciplines: z.array(z.enum(disciplineKeys)).min(1),
      context: z.enum(['Stage', 'Projet scolaire', 'Projet personnel', 'Projet client', 'Projet bénévole', 'Projet d’équipe']),
      role: z.string().optional(),
      team: z.string().optional(),
      platform: z.string().optional(),
      tools: z.array(z.string()).default([]),
      cover: image(),
      coverAlt: z.string(),
      /** contain = logo ou visuel à ne pas recadrer. */
      coverFit: z.enum(['cover', 'contain']).default('cover'),
      coverBackground: z.string().optional(),
      links: z
        .array(z.object({ label: z.string(), href: z.string(), note: z.string().optional() }))
        .default([]),
      videos: z
        .array(z.object({ youtubeId: z.string(), title: z.string(), vertical: z.boolean().default(false), uploadDate: z.string().optional() }))
        .default([]),
      /** Affiche le titre de chaque vidéo sous le lecteur (le titre reste lisible par les lecteurs d'écran). */
      videoCaptions: z.boolean().default(true),
      documents: z
        .array(z.object({ label: z.string(), href: z.string(), description: z.string().optional() }))
        .default([]),
      highlights: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      gallery: z
        .array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() }))
        .default([]),
      /** Albums photo : dossier relatif à src/assets/img/photos. */
      albums: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            year: z.number(),
            folder: z.string(),
            description: z.string(),
            role: z.string().optional(),
          }),
        )
        .default([]),
      notice: z.string().optional(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      /** Projets liés (slugs). */
      related: z.array(z.string()).default([]),
    }),
});

export const collections = { projects, blog };
