// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Dates de dernière modification des articles (updatedDate, sinon pubDate), pour le <lastmod> du sitemap.
// Seules des dates réelles sont déclarées : Google ignore les lastmod qui changent à chaque build.
const BLOG_DIR = new URL('./src/content/blog/', import.meta.url);
const blogDates = new Map();
for (const file of readdirSync(BLOG_DIR)) {
  if (!/\.mdx?$/.test(file)) continue;
  const head = readFileSync(new URL(file, BLOG_DIR), 'utf8').split('---')[1] ?? '';
  if (/^draft:\s*true/m.test(head)) continue;
  const date = (head.match(/^updatedDate:\s*["']?([\d-]+)/m) ?? head.match(/^pubDate:\s*["']?([\d-]+)/m))?.[1];
  if (date) blogDates.set(file.replace(/\.mdx?$/, ''), new Date(date));
}
const latestPost = [...blogDates.values()].sort((a, b) => b - a)[0];

// Domaine canonique : le site public répond sur www.janjawish.fr (Vercel).
export const SITE_URL = 'https://www.janjawish.fr';

export default defineConfig({
  site: SITE_URL,
  // URLs propres sans barre finale (/projets/the-exit), cohérentes avec vercel.json.
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '');
        const slug = path.startsWith('/blog/') ? path.slice(6) : null;
        const date = slug ? blogDates.get(slug) : path === '/blog' || path === '' ? latestPost : undefined;
        if (date) item.lastmod = date.toISOString();
        return item;
      },
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR' } },
    }),
  ],
  image: {
    // Formats modernes générés au build par sharp.
    responsiveStyles: true,
  },
  vite: {
    ssr: { noExternal: ['gsap'] },
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'ogl', 'motion/react', '@hugeicons/react', '@hugeicons/core-free-icons'],
    },
  },
});
