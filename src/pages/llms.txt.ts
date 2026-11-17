import type { APIRoute } from 'astro';
import { SITE, PERSON, SKILLS, SOCIALS } from '@/data/site';
import { getProjects, projectUrl } from '@/lib/projects';
import { getPosts } from '@/lib/blog';

/** Résumé du site pour les agents et modèles de langage (convention llms.txt). */
export const GET: APIRoute = async () => {
  const projects = await getProjects();
  const posts = await getPosts();
  const body = `# Jan Jawish | Portfolio général

> ${PERSON.name} : ${PERSON.status} (${PERSON.school}, ${PERSON.track}). Profil digital polyvalent : ${SKILLS.map((s) => s.title.toLowerCase()).join(', ')}. Langue principale : français.

## Pages principales

- [Accueil](${SITE.url}/): vue d’ensemble.
- [À propos](${SITE.url}/a-propos): parcours, formation, expériences, langues.
- [Compétences](${SITE.url}/competences): dix domaines, outils et projets associés.
- [Projets](${SITE.url}/projets): ${projects.length} fiches détaillées, filtrables par discipline.
- [Approche](${SITE.url}/approche): méthode de travail.
- [Blog](${SITE.url}/blog): retours d’expérience.
- [Contact](${SITE.url}/contact): formulaire et e-mail (${SITE.email}).

## Projets

${projects.map((p) => `- [${p.data.title}](${SITE.url}${projectUrl(p)}): ${p.data.summary}`).join('\n')}

## Articles

${posts.map((p) => `- [${p.data.title}](${SITE.url}/blog/${p.id}): ${p.data.description}`).join('\n')}

## Réseaux

${SOCIALS.map((s) => `- [${s.label}](${s.href})`).join('\n')}

## Optional

- [Plan du site](${SITE.url}/sitemap-index.xml)
- [Flux RSS](${SITE.url}/rss.xml)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
