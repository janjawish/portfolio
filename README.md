# Jan Jawish — Portfolio général

Portfolio général de Jan Jawish : développement web, UI/UX, graphisme, audiovisuel, photographie, communication, marketing, SEO, 3D et gestion de projet.

**Stack** : [Astro 7](https://astro.build) (pages HTML pré-rendues) + îlots **React 19** pour les parties interactives, composants originaux **React Bits** et **ReactDrops**, contenus en **Markdown**. Défilement amorti **Lenis** synchronisé avec **GSAP ScrollTrigger**.

## Commandes

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # vérification TypeScript (astro check) + build statique → dist/
npm run preview    # sert dist/ en local
```

Node ≥ 22.12 (Astro est épinglé en 7.3.8, voir `docs/PROGRESS.md`).

## Ajouter du contenu

- **Un article de blog** : créer `src/content/blog/mon-article.md` (ou `.mdx`) avec l'en-tête :
  ```yaml
  ---
  title: "Titre"
  description: "Résumé de 120 à 160 caractères (balise meta)."
  pubDate: 2026-12-01
  tags: ["SEO"]
  cover: "../../assets/projects/une-image.png"   # facultatif
  coverAlt: "Description de l’image"
  related: ["the-exit"]                           # slugs de projets, facultatif
  draft: false
  ---
  ```
  La page, le sitemap, le flux RSS, `llms.txt` et l'assistant se mettent à jour au build.
- **Un projet** : créer `src/content/projects/mon-projet.md` (schéma complet dans `src/content.config.ts` ; s'inspirer de `the-exit.md`). Images dans `src/assets/projects/`, PDF dans `public/documents/`.
- **Identité, parcours, compétences, approche** : `src/data/site.ts`.

## Formulaire de contact

Sans configuration, le formulaire **n'envoie rien** et le dit : il prépare le message dans la messagerie du visiteur (mailto). Pour un envoi direct, créer un compte gratuit Web3Forms ou Formspree puis définir dans Vercel (ou `.env`) :

```
PUBLIC_CONTACT_ENDPOINT=https://api.web3forms.com/submit
PUBLIC_CONTACT_ACCESS_KEY=<clé publique Web3Forms>
```

Le succès n'est affiché qu'après une réponse HTTP 2xx du service. En production, ces variables sont déjà définies dans le projet Vercel **portfolio-general** (16/11/2026). Pour tester le formulaire en local, les copier dans un fichier `.env` (ignoré par Git).

## Déploiement (Vercel)

Projet Vercel : **portfolio-general** (domaines `www.janjawish.fr` et `janjawish.fr` → www). Le dossier est relié au projet (`.vercel/`) : `npm run build` pour vérifier, puis `vercel deploy --prod` pour publier.


`vercel.json` définit la commande de build, les URL propres sans barre finale, les redirections des anciennes adresses (`/projects/*`, `*.html`, anciens PDF, `/page.html`) et des en-têtes de sécurité et de cache.

## Documentation

- `docs/PROGRESS.md` — avancement, tests, problèmes restants, prochaine étape
- `docs/COMPONENTS.md` — composants React Bits / ReactDrops : sources, licences, adaptations
- `docs/CONTENT_SOURCES.md` — provenance des contenus
- `legacy/` — ancien site statique (conservé pour référence, non publié)
