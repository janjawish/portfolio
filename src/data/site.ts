/**
 * Source de vérité éditoriale du portfolio général.
 *
 * Provenance des informations (voir docs/CONTENT_SOURCES.md) :
 * - Jan Jawish, brief du 11/11/2026 : 3e année BUT MMI, IUT de Vélizy, parcours développement web,
 *   alternant chez Alphalives ; intitulé du poste donné par Jan le 16/11/2026 : Développeur web full-stack.
 * - Site public janjawish.fr et CV (cv-jan-jawish.pdf) : stage The Exit (avril-juin 2026), BUT MMI à
 *   l'IUT de Rouen, site d'Elbeuf, parcours Création numérique, langues, compétences, outils.
 * - Ancien dépôt (legacy/) : projets 2023-2025, passions, réseaux.
 *
 * Règle : aucune information biographique ou professionnelle n'est inventée. Les champs inconnus
 * restent absents plutôt que d'être supposés.
 */

export const SITE = {
  url: 'https://www.janjawish.fr',
  name: 'Jan Jawish',
  shortName: 'JJ',
  locale: 'fr_FR',
  lang: 'fr',
  title: 'Jan Jawish | Portfolio web, design et audiovisuel',
  description:
    "Portfolio de Jan Jawish, étudiant en BUT MMI à l’IUT de Vélizy et alternant chez Alphalives : développement web, design, audiovisuel, communication et SEO.",
  email: 'jawishjan@gmail.com',
  cv: '/documents/cv-jan-jawish.pdf',
  ogImage: '/og/default.png',
} as const;

export const PERSON = {
  name: 'Jan Jawish',
  role: 'Développeur web full-stack',
  status: 'Développeur web full-stack en alternance chez Alphalives · BUT MMI, 3e année',
  school: 'IUT de Vélizy',
  track: 'parcours Développement web',
  company: 'Alphalives',
  motto: 'Comprendre d’abord. Concevoir juste. Produire concrètement.',
  /** Phrase d'accroche issue du site public. */
  pitch:
    'Comprendre précisément un besoin, concevoir la bonne réponse et la produire concrètement - de la stratégie à l’interface, du contenu au développement.',
  location: 'Paris · Île-de-France · Normandie',
  languages: [
    { name: 'Français', level: 'langue maternelle' },
    { name: 'Anglais', level: 'courant' },
    { name: 'Arabe', level: 'courant' },
    { name: 'Kurde', level: 'courant' },
    { name: 'Turc', level: 'niveau scolaire' },
    { name: 'Allemand', level: 'niveau scolaire' },
  ],
} as const;

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/janjawish/' },
  { label: 'GitHub', href: 'https://github.com/janjawish' },
  { label: 'YouTube', href: 'https://www.youtube.com/@trafalgar7330' },
] as const;

export type NavItem = { label: string; href: string; description?: string };

export const NAV: NavItem[] = [
  { label: 'À propos', href: '/a-propos', description: 'Parcours, valeurs, passions' },
  { label: 'Compétences', href: '/competences', description: 'Dix domaines, une même méthode' },
  { label: 'Projets', href: '/projets', description: 'Fiches détaillées et filtres' },
  { label: 'Approche', href: '/approche', description: 'Ma façon de travailler' },
  { label: 'Blog', href: '/blog', description: 'Notes et retours d’expérience' },
  { label: 'Contact', href: '/contact', description: 'Parlons de votre besoin' },
];

/** Parcours : uniquement des éléments attestés. */
export type TimelineEntry = {
  period: string;
  kind: 'Alternance' | 'Formation' | 'Stage';
  title: string;
  place: string;
  description: string;
  link?: { label: string; href: string };
  current?: boolean;
};

export const TIMELINE: TimelineEntry[] = [
  {
    period: '2026 - 2027',
    kind: 'Alternance',
    title: 'Développeur web full-stack',
    place: 'Alphalives',
    description:
      'Alternance menée en parallèle de la 3e année de BUT MMI, au rythme de l’entreprise et de la formation.',
    current: true,
  },
  {
    period: '2026 - 2027',
    kind: 'Formation',
    title: 'BUT Métiers du Multimédia et de l’Internet - 3e année',
    place: 'IUT de Vélizy · parcours Développement web',
    description:
      'Dernière année du BUT, orientée développement web : conception, intégration, back-end et déploiement d’applications.',
    current: true,
  },
  {
    period: 'Avril - juin 2026',
    kind: 'Stage',
    title: 'Assistant communication digitale & développement web',
    place: 'The Exit · escape game, Poissy et Saint-Germain-en-Laye',
    description:
      'Charte graphique, stratégie éditoriale, six vidéos promotionnelles, optimisation SEO du site WordPress et deux applications internes en PHP/MySQL.',
    link: { label: 'Voir l’étude de cas', href: '/projets/the-exit' },
  },
  {
    period: '1re et 2e années',
    kind: 'Formation',
    title: 'BUT Métiers du Multimédia et de l’Internet',
    place: 'IUT de Rouen, site d’Elbeuf · parcours Création numérique',
    description:
      'Une formation pluridisciplinaire qui relie développement, design d’interface, communication, audiovisuel et création numérique.',
  },
];

/** Dix domaines de compétences. `projects` référence des slugs de la collection projets. */
export type Skill = {
  id: string;
  index: string;
  title: string;
  short: string;
  description: string;
  tools: string[];
  projects: string[];
};

export const SKILLS: Skill[] = [
  {
    id: 'developpement-web',
    index: '01',
    title: 'Développement web',
    short: 'Sites, applications métier et outils internes.',
    description:
      'Du site vitrine à l’application métier : intégration responsive, back-end PHP/MySQL, applications React et TypeScript, sécurité (rôles, CSRF, requêtes préparées) et déploiement.',
    tools: ['HTML / CSS', 'JavaScript', 'TypeScript', 'React', 'PHP', 'MySQL / MariaDB', 'WordPress', 'Git / GitHub'],
    projects: ['opticalpro', 'the-exit', 'folio', 'a-cours-sur', 'mmi-hub'],
  },
  {
    id: 'ui-ux',
    index: '02',
    title: 'UI / UX design',
    short: 'Parcours clairs, interfaces lisibles.',
    description:
      'Architecture de l’information, wireframes, maquettes Figma et parcours utilisateurs pensés pour plusieurs rôles, du premier écran jusqu’à l’action principale.',
    tools: ['Figma', 'Wireframes', 'Prototypage', 'Architecture de l’information', 'Design system'],
    projects: ['hop', 'chourak-consulting', 'wireframe-maquette-pet-sitting'],
  },
  {
    id: 'graphisme',
    index: '03',
    title: 'Graphisme & identité',
    short: 'Logos, chartes, affiches, supports print.',
    description:
      'Création d’identités visuelles et de chartes graphiques, logos et déclinaisons, affiches et supports print, avec une attention particulière à la hiérarchie typographique.',
    tools: ['Illustrator', 'Photoshop', 'InDesign', 'Canva'],
    projects: ['mmi-hub', 'elbeuf-immersif', 'monogramme-jj', 'affiche-festival-du-livre'],
  },
  {
    id: 'audiovisuel',
    index: '04',
    title: 'Audiovisuel',
    short: 'Écriture, tournage, son, montage, motion.',
    description:
      'Production de vidéos de l’écriture à la diffusion : scénario, prise de vue, prise de son, montage, sound design et motion design, pour le web et les réseaux sociaux.',
    tools: ['Premiere Pro', 'After Effects', 'Audition', 'Prise de vue', 'Prise de son'],
    projects: ['fidal', 'the-exit', 'elbeuf-immersif', 'interview-maison-sport-sante'],
  },
  {
    id: 'photographie',
    index: '05',
    title: 'Photographie',
    short: 'Portrait, reportage, produit.',
    description:
      'Organisation de shootings, direction des personnes photographiées, portraits, reportage et photographie produit, puis retouche et étalonnage.',
    tools: ['Lightroom', 'Photoshop', 'Direction de shooting', 'Retouche'],
    projects: ['photographie'],
  },
  {
    id: 'communication',
    index: '06',
    title: 'Communication',
    short: 'Stratégie, contenus, réseaux sociaux.',
    description:
      'Stratégie de communication interne et externe, ligne éditoriale, création de contenus, community management et campagnes digitales.',
    tools: ['Instagram', 'TikTok', 'Facebook', 'Stratégie éditoriale', 'Rédaction web'],
    projects: ['the-exit', 'hop', 'projet-cvec', 'sol-agency'],
  },
  {
    id: 'marketing',
    index: '07',
    title: 'Marketing digital',
    short: 'Acquisition, conversion, mesure.',
    description:
      'Relier contenus, acquisition et conversion dans une même stratégie, puis piloter avec des indicateurs : KPI, ROI/ROAS, parcours utilisateur et fidélisation.',
    tools: ['GA4', 'Google Ads', 'Semrush', 'CRM', 'Analyse de KPI'],
    projects: ['the-exit', 'chourak-consulting', 'vertuose'],
  },
  {
    id: 'seo',
    index: '08',
    title: 'SEO',
    short: 'Référencement technique, local et éditorial.',
    description:
      'Audit, structure sémantique, contenus et métadonnées, référencement local, performances et suivi dans Google Search Console et PageSpeed Insights.',
    tools: ['Google Search Console', 'PageSpeed Insights', 'Yoast SEO', 'SEO local', 'Données structurées'],
    projects: ['the-exit', 'chourak-consulting', 'boutique-optique'],
  },
  {
    id: '3d',
    index: '09',
    title: 'Modélisation 3D',
    short: 'Visuels et éléments de campagne.',
    description:
      'Modélisation d’objets et de visuels 3D intégrés à des projets de communication et de design produit.',
    tools: ['Blender', 'Outils de modélisation 3D'],
    projects: ['hop'],
  },
  {
    id: 'gestion-de-projet',
    index: '10',
    title: 'Gestion de projet',
    short: 'Cadrer, prioriser, livrer.',
    description:
      'Cadrage du besoin, priorisation par impact, calendrier de production, travail d’équipe en méthode agile, tests et documentation utilisateur.',
    tools: ['Méthodes agiles', 'Priorisation', 'Documentation', 'Tests'],
    projects: ['the-exit', 'hop', 'fidal'],
  },
];

/** Futurs portfolios spécialisés (en préparation). */
/** Certifications (profil LinkedIn de Jan, 23/11/2026). Ajouter `href` quand l'adresse de vérification est connue. */
export type Certification = { title: string; issuer: string; date: string; expires?: string; credentialId?: string; href?: string };
export const CERTIFICATIONS: Certification[] = [
  { title: 'Claude Academy : Claude Code in action', issuer: 'Anthropic', date: 'Novembre 2026', credentialId: 'a92b681e6cc00136d58bfa2b2f5d6518', href: 'https://academy.claude.com/verify/a92b681e6cc00136d58bfa2b2f5d6518' },
  { title: 'Google Analytics Certification (2026)', issuer: 'Google Analytics for Business', date: 'Octobre 2026', expires: 'Octobre 2027', href: 'https://skillshop.credential.net/833d85bc-b441-464d-bcbd-db17624e8c54#acc.wk4g2dBN' },
  { title: 'Cours de SEO axé sur le contenu avec Brian Dean', issuer: 'Semrush', date: 'Octobre 2026', expires: 'Octobre 2027', href: 'https://static.semrush.com/academy/certificates/93db75c201/jan-jawish_2.pdf' },
  { title: 'Introduction to Generative AI', issuer: 'Google Skills (Google Cloud)', date: 'Octobre 2026', href: 'https://www.skills.google/public_profiles/799c7fee-5025-45b5-8a08-12d73ac0a2d2/badges/29229886' },
  { title: 'Introduction to Image Generation', issuer: 'Google Skills (Google Cloud)', date: 'Octobre 2026', href: 'https://www.skills.google/public_profiles/799c7fee-5025-45b5-8a08-12d73ac0a2d2/badges/29230253' },
];
export const CERTIFICATIONS_URL = 'https://www.linkedin.com/in/janjawish/details/certifications/';

export const SPECIALIZED = [
  {
    id: 'dev',
    title: 'Portfolio développeur',
    description: 'Applications web, outils métier, architectures et code : une sélection technique, dépôt par dépôt.',
    focus: ['React · TypeScript', 'PHP · MySQL', 'Applications locales', 'Automatisation'],
    status: 'En préparation',
    href: 'https://dev.janjawish.fr',
  },
  {
    id: 'creatif',
    title: 'Portfolio créatif',
    description: 'Identités visuelles, vidéo, photographie et motion design : le versant image et récit du travail.',
    focus: ['Identité visuelle', 'Audiovisuel', 'Photographie', 'Motion design'],
    status: 'En préparation',
    href: 'https://creatif.janjawish.fr',
  },
] as const;

/**
 * Méthode de travail - reformulation fidèle de phrases de Jan (site public, étude de cas The Exit).
 */
export const APPROACH = [
  {
    title: 'Comprendre',
    text: 'Échanger directement avec les personnes concernées, poser les bonnes questions et cadrer la demande avant de produire quoi que ce soit.',
    source: 'Quand le besoin est encore flou, je cherche ce qui sera réellement utile à l’entreprise et à ses utilisateurs.',
  },
  {
    title: 'Concevoir',
    text: 'Structurer une réponse cohérente : parcours, hiérarchie des contenus, identité visuelle, architecture technique.',
    source: 'Hiérarchiser avant de décorer.',
  },
  {
    title: 'Produire',
    text: 'Mobiliser les bons savoir-faire selon le contexte : développer, filmer, rédiger, mettre en page - sans perdre le fil commun.',
    source: 'Relier création de contenu, acquisition et conversion dans une même stratégie.',
  },
  {
    title: 'Mesurer',
    text: 'Suivre des indicateurs concrets - Search Console, PageSpeed, statistiques des réseaux - et ajuster à partir de ce qui fonctionne.',
    source: 'Mesurer l’effet d’une optimisation avant d’en revendiquer le résultat.',
  },
  {
    title: 'Transmettre',
    text: 'Documenter, former et livrer des outils que l’équipe peut reprendre seule : tutoriels, guides et vidéos explicatives.',
    source: 'Documenter un outil fait partie du produit, pas de l’après-projet.',
  },
] as const;
