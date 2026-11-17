import type { APIRoute } from 'astro';
import { SITE, PERSON, SKILLS, SOCIALS, TIMELINE, APPROACH, SPECIALIZED } from '@/data/site';
import { INTERESTS } from '@/data/passions';
import { getProjects, projectUrl, disciplineLabel } from '@/lib/projects';
import { getPosts } from '@/lib/blog';

/**
 * Base de connaissances de l'assistant, générée au build à partir des mêmes données que le site.
 * Chargée par le navigateur uniquement à l'ouverture de l'assistant.
 */
export const GET: APIRoute = async () => {
  const projects = await getProjects();
  const posts = await getPosts();
  const data = {
    person: { ...PERSON, email: SITE.email, cv: SITE.cv },
    socials: SOCIALS,
    timeline: TIMELINE,
    approach: APPROACH.map((a) => ({ title: a.title, text: a.text })),
    specialized: SPECIALIZED.map((s) => ({ title: s.title, status: s.status, description: s.description, href: s.href })),
    interests: INTERESTS.map((i) => i.name),
    skills: SKILLS.map((s) => ({ id: s.id, title: s.title, description: s.description, tools: s.tools, projects: s.projects })),
    projects: projects.map((p) => ({
      slug: p.id,
      url: projectUrl(p),
      title: p.data.title,
      headline: p.data.headline ?? '',
      summary: p.data.summary,
      year: p.data.year,
      context: p.data.context,
      role: p.data.role ?? '',
      featured: p.data.featured,
      disciplines: p.data.disciplines.map(disciplineLabel),
      tools: p.data.tools,
    })),
    posts: posts.map((p) => ({ title: p.data.title, url: `/blog/${p.id}`, description: p.data.description })),
  };
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
