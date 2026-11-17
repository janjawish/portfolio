import { getCollection, type CollectionEntry } from 'astro:content';
import { DISCIPLINES, type Discipline } from '@/content.config';

export type Project = CollectionEntry<'projects'>;

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

export async function getFeatured(limit = 7): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.featured).slice(0, limit);
}

export function disciplineLabel(d: Discipline) {
  return DISCIPLINES[d];
}

export function projectUrl(p: Project | string) {
  return `/projets/${typeof p === 'string' ? p : p.id}`;
}

export { DISCIPLINES };
