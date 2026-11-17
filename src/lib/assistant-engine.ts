/**
 * Moteur de réponses locales de l'assistant.
 * Aucune génération libre : chaque réponse est construite à partir de la base de connaissances du site
 * (assistant.json). Si aucune réponse vérifiée n'existe, l'assistant le dit et oriente vers le contact.
 */

export type KB = {
  person: {
    name: string;
    status: string;
    school: string;
    track: string;
    company: string;
    motto: string;
    pitch: string;
    location: string;
    languages: readonly { name: string; level: string }[];
    email: string;
    cv: string;
  };
  socials: readonly { label: string; href: string }[];
  timeline: { period: string; kind: string; title: string; place: string; description: string; link?: { href: string } }[];
  approach: { title: string; text: string }[];
  specialized: { title: string; status: string; description: string; href?: string }[];
  interests: string[];
  skills: { id: string; title: string; description: string; tools: string[]; projects: string[] }[];
  projects: {
    slug: string;
    url: string;
    title: string;
    headline: string;
    summary: string;
    year: number;
    context: string;
    role: string;
    featured: boolean;
    disciplines: string[];
    tools: string[];
  }[];
  posts: { title: string; url: string; description: string }[];
};

export type Answer = { text: string[]; links: { label: string; href: string }[] };

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9\s+#.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

type Intent = { id: string; keys: string[]; answer: (kb: KB) => Answer };

const SKILL_KEYS: Record<string, string[]> = {
  'developpement-web': ['web', 'developpement web', 'developpeur', 'dev', 'code', 'coder', 'php', 'react', 'javascript', 'typescript', 'html', 'css', 'mysql', 'wordpress', 'site web', 'application', 'full stack', 'back end', 'front end'],
  'ui-ux': ['ui', 'ux', 'figma', 'maquette', 'wireframe', 'interface', 'design', 'designer', 'prototype'],
  graphisme: ['graphisme', 'graphique', 'graphiste', 'logo', 'identite', 'charte', 'affiche', 'illustrator', 'photoshop', 'indesign', 'print'],
  audiovisuel: ['video', 'videos', 'audiovisuel', 'montage', 'tournage', 'film', 'premiere', 'after effects', 'motion', 'prise de son', 'sound design'],
  photographie: ['photo', 'photos', 'photographie', 'photographe', 'portrait', 'shooting', 'lightroom'],
  communication: ['communication', 'reseaux sociaux', 'instagram', 'tiktok', 'community', 'contenu', 'redaction', 'copywriting'],
  marketing: ['marketing', 'acquisition', 'conversion', 'ads', 'kpi', 'ga4', 'analytics', 'semrush', 'crm'],
  seo: ['seo', 'referencement', 'google', 'search console', 'pagespeed', 'yoast'],
  '3d': ['3d', 'blender', 'modelisation'],
  'gestion-de-projet': ['gestion de projet', 'agile', 'organisation', 'planning', 'priorisation', 'chef de projet'],
};

const has = (q: string, key: string) => (key.includes(' ') ? q.includes(key) : new RegExp(`(^|\\s)${key.replace(/[.+#]/g, '\\$&')}(s|x)?(\\s|$)`).test(q));
const score = (q: string, keys: string[]) => keys.reduce((n, k) => n + (has(q, k) ? (k.includes(' ') ? 2 : 1) : 0), 0);

const list = (items: string[]) => items.join(' · ');

const intents: Intent[] = [
  {
    id: 'greeting',
    keys: ['bonjour', 'salut', 'hello', 'coucou', 'hey', 'bonsoir'],
    answer: () => ({
      text: [
        'Bonjour ! Je suis l’assistant du portfolio de Jan Jawish.',
        'Je réponds à partir des informations publiées sur ce site : parcours, compétences, projets, méthode et contact.',
      ],
      links: [],
    }),
  },
  {
    id: 'who',
    keys: ['qui', 'presente', 'presentation', 'profil', 'parle moi', 'biographie', 'bio'],
    answer: (kb) => ({
      text: [
        `${kb.person.name} est développeur web full-stack en alternance chez ${kb.person.company} et en 3e année de BUT MMI à l’${kb.person.school} (${kb.person.track}).`,
        'Profil digital polyvalent, il relie marketing digital, communication, développement web, UI/UX et audiovisuel pour passer d’une idée à une réalisation cohérente.',
        `Sa devise : « ${kb.person.motto} »`,
      ],
      links: [{ label: 'À propos', href: '/a-propos' }],
    }),
  },
  {
    id: 'formation',
    keys: ['formation', 'etude', 'etudes', 'etudiant', 'iut', 'but', 'mmi', 'ecole', 'universite', 'velizy', 'elbeuf', 'diplome', 'cursus'],
    answer: (kb) => ({
      text: kb.timeline.filter((t) => t.kind === 'Formation').map((t) => `${t.period} - ${t.title}, ${t.place}.`),
      links: [{ label: 'Voir le parcours', href: '/a-propos#parcours' }],
    }),
  },
  {
    id: 'work',
    keys: ['alternance', 'alternant', 'alphalives', 'entreprise', 'travaille', 'travail', 'poste', 'experience', 'experiences', 'stage', 'stagiaire', 'the exit'],
    answer: (kb) => ({
      text: kb.timeline.filter((t) => t.kind !== 'Formation').map((t) => `${t.period} - ${t.kind} : ${t.title}, ${t.place}. ${t.description}`),
      links: [
        { label: 'Parcours complet', href: '/a-propos#parcours' },
        { label: 'Étude de cas The Exit', href: '/projets/the-exit' },
      ],
    }),
  },
  {
    id: 'skills',
    keys: ['competence', 'competences', 'savoir faire', 'sait faire', 'expertise', 'expertises', 'domaine', 'domaines', 'specialite', 'polyvalent'],
    answer: (kb) => ({
      text: [`Jan couvre dix domaines : ${list(kb.skills.map((s) => s.title))}.`, 'Demandez-moi le détail d’un domaine, par exemple « SEO » ou « vidéo ».'],
      links: [{ label: 'Toutes les compétences', href: '/competences' }],
    }),
  },
  {
    id: 'tools',
    keys: ['outil', 'outils', 'logiciel', 'logiciels', 'stack', 'technologie', 'technologies', 'techno', 'langage', 'langages'],
    answer: (kb) => ({
      text: [`Principaux outils : ${list([...new Set(kb.skills.flatMap((s) => s.tools))].slice(0, 22))}.`],
      links: [{ label: 'Compétences et outils', href: '/competences' }],
    }),
  },
  {
    id: 'projects',
    keys: ['projet', 'projets', 'realisation', 'realisations', 'travaux', 'exemple', 'exemples', 'portfolio'],
    answer: (kb) => {
      const f = kb.projects.filter((p) => p.featured);
      return {
        text: [`Le portfolio compte ${kb.projects.length} fiches. Les projets phares : ${list(f.map((p) => `${p.title} (${p.year})`))}.`, 'Citez un projet pour en savoir plus.'],
        links: [{ label: 'Tous les projets', href: '/projets' }, ...f.slice(0, 3).map((p) => ({ label: p.title, href: p.url }))],
      };
    },
  },
  {
    id: 'contact',
    keys: ['contact', 'contacter', 'mail', 'email', 'e mail', 'joindre', 'ecrire', 'message', 'telephone', 'numero', 'appeler'],
    answer: (kb) => ({
      text: [`Le plus simple : écrire à ${kb.person.email} ou passer par le formulaire de contact.`],
      links: [
        { label: 'Formulaire de contact', href: '/contact' },
        { label: kb.person.email, href: `mailto:${kb.person.email}` },
      ],
    }),
  },
  {
    id: 'cv',
    keys: ['cv', 'curriculum', 'resume'],
    answer: (kb) => ({ text: ['Le CV de Jan est disponible au format PDF.'], links: [{ label: 'Ouvrir le CV (PDF)', href: kb.person.cv }] }),
  },
  {
    id: 'location',
    keys: ['ou habite', 'ou vit', 'habite', 'localisation', 'localise', 'ville', 'region', 'mobilite', 'mobile', 'paris', 'normandie', 'ile de france', 'deplacer'],
    answer: (kb) => ({ text: [`Zone : ${kb.person.location}.`], links: [{ label: 'Contact', href: '/contact' }] }),
  },
  {
    id: 'languages',
    keys: ['langue', 'langues', 'anglais', 'arabe', 'kurde', 'turc', 'allemand', 'parle', 'parler', 'bilingue'],
    answer: (kb) => ({ text: [`Langues : ${list(kb.person.languages.map((l) => `${l.name} (${l.level})`))}.`], links: [{ label: 'À propos', href: '/a-propos' }] }),
  },
  {
    id: 'approach',
    keys: ['methode', 'approche', 'facon de travailler', 'process', 'processus', 'travailler avec', 'comment travaille', 'demarche'],
    answer: (kb) => ({
      text: [`Cinq temps : ${list(kb.approach.map((a) => a.title))}.`, kb.approach[0].text],
      links: [{ label: 'Mon approche', href: '/approche' }],
    }),
  },
  {
    id: 'availability',
    keys: ['disponible', 'disponibilite', 'freelance', 'mission', 'recruter', 'recrutement', 'embaucher', 'tarif', 'prix', 'devis'],
    answer: (kb) => ({
      text: [
        `Jan est actuellement alternant chez ${kb.person.company}, en parallèle de sa 3e année de BUT MMI.`,
        'Je n’ai pas d’information vérifiée sur ses disponibilités ou tarifs : le mieux est de lui écrire directement.',
      ],
      links: [{ label: 'Écrire à Jan', href: '/contact' }],
    }),
  },
  {
    id: 'blog',
    keys: ['blog', 'article', 'articles', 'lire', 'ecrit'],
    answer: (kb) => ({
      text: kb.posts.length ? [`Derniers articles : ${list(kb.posts.slice(0, 3).map((p) => `« ${p.title} »`))}.`] : ['Le blog arrive bientôt.'],
      links: [{ label: 'Le blog', href: '/blog' }, ...kb.posts.slice(0, 2).map((p) => ({ label: p.title, href: p.url }))],
    }),
  },
  {
    id: 'specialized',
    keys: ['portfolio developpeur', 'portfolio creatif', 'specialise', 'specialises', 'autres portfolios', 'autre portfolio'],
    answer: (kb) => ({
      text: kb.specialized.map((s) => `${s.title} (${s.status.toLowerCase()}) : ${s.description}`),
      links: [
        ...kb.specialized.filter((s) => s.href).map((s) => ({ label: s.title, href: s.href as string })),
        { label: 'Portfolios spécialisés', href: '/portfolios' },
      ],
    }),
  },
  {
    id: 'passions',
    keys: ['passion', 'passions', 'loisir', 'loisirs', 'aime', 'hobby', 'hobbies', 'musique', 'cinema', 'livre', 'livres', 'sport', 'mma', 'jeux'],
    answer: (kb) => ({ text: [`Centres d’intérêt : ${list(kb.interests)}. Livres, artistes et films préférés sont détaillés sur la page À propos.`], links: [{ label: 'Ce qui le nourrit', href: '/a-propos' }] }),
  },
  {
    id: 'social',
    keys: ['linkedin', 'github', 'youtube', 'reseau', 'reseaux'],
    answer: (kb) => ({ text: ['Retrouvez Jan sur :'], links: kb.socials.map((s) => ({ label: s.label, href: s.href })) }),
  },
  {
    id: 'thanks',
    keys: ['merci', 'super', 'parfait', 'top', 'genial'],
    answer: () => ({ text: ['Avec plaisir ! Une autre question ?'], links: [] }),
  },
];

const projectAnswer = (p: KB['projects'][number]): Answer => ({
  text: [
    `${p.title}${p.headline ? ` - ${p.headline}` : ''} (${p.context.toLowerCase()}, ${p.year}).`,
    p.summary,
    p.role ? `Rôle de Jan : ${p.role}.` : '',
  ].filter(Boolean),
  links: [{ label: `Fiche ${p.title}`, href: p.url }],
});

const skillAnswer = (kb: KB, s: KB['skills'][number]): Answer => {
  const related = s.projects.map((slug) => kb.projects.find((p) => p.slug === slug)).filter((p): p is KB['projects'][number] => Boolean(p));
  return {
    text: [`${s.title} : ${s.description}`, `Outils : ${list(s.tools)}.`],
    links: [{ label: s.title, href: `/competences#${s.id}` }, ...related.slice(0, 3).map((p) => ({ label: p.title, href: p.url }))],
  };
};

export function respond(kb: KB, input: string): Answer {
  const q = normalize(input);
  if (!q) return { text: ['Posez-moi une question sur Jan, ses projets ou ses compétences.'], links: [] };

  // 1. Projet cité nommément
  const project = kb.projects
    .map((p) => {
      const t = normalize(p.title);
      const words = t.split(' ').filter((w) => w.length > 2);
      const hit = q.includes(t) ? 10 : words.length && words.every((w) => has(q, w)) ? 6 : 0;
      return { p, hit };
    })
    .sort((a, b) => b.hit - a.hit)[0];
  if (project && project.hit > 0) return projectAnswer(project.p);

  // 2. Intentions générales et domaines de compétence
  const ranked = intents.map((i) => ({ i, s: score(q, i.keys) })).sort((a, b) => b.s - a.s);
  const skill = kb.skills.map((s) => ({ s, n: score(q, SKILL_KEYS[s.id] ?? []) })).sort((a, b) => b.n - a.n)[0];
  const best = ranked[0];

  if (skill && skill.n > 0 && (!best || best.s <= skill.n || ['skills', 'tools', 'projects'].includes(best.i.id))) {
    return skillAnswer(kb, skill.s);
  }
  if (best && best.s > 0) return best.i.answer(kb);

  return {
    text: [
      'Je n’ai pas de réponse vérifiée à cette question : je ne réponds qu’à partir des informations publiées sur ce site.',
      'Essayez « compétences », « projets », « parcours » ou « contact » - ou posez directement la question à Jan.',
    ],
    links: [{ label: 'Écrire à Jan', href: '/contact' }],
  };
}

export const SUGGESTIONS = ['Qui est Jan ?', 'Quelles compétences ?', 'Son alternance', 'Un projet web', 'Parle-moi de The Exit', 'Comment le contacter ?'];
