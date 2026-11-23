# Suivi du chantier — Portfolio général de Jan Jawish

> Fichier de reprise : état d'avancement, tests, problèmes restants, prochaine étape.
> Dernière mise à jour : 12/11/2026.

## Démarrer

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # astro check + build statique dans dist/
npm run preview    # sert dist/ (http://localhost:4321 par défaut)
```

Node de la machine : **22.20.0**. Astro est épinglé en **7.3.8** avec `@astrojs/react` 7.0.1 et `@astrojs/mdx` 8.0.3 : ce sont les versions corrigées des failles d'Astro ≤ 7.3.1 compatibles avec Node ≥ 22.12. Astro 7.4+ exige Node ≥ 22.23.4 : mettre Node à jour avant de monter de version. `npm audit` : 0 vulnérabilité.

⚠️ Ne pas lancer `npm run build` pendant que `npm run dev` tourne dans le même dossier (le cache Vite se mélange : erreur `_jsxDEV is not a function`). Arrêter le serveur de dev, ou supprimer `node_modules/.vite`, puis relancer.

## Étapes

| # | Étape | État |
|---|-------|------|
| 1 | Audit et architecture | ✅ |
| 2 | Migration (Astro + îlots React) | ✅ |
| 3 | Direction artistique et hero | ✅ |
| 4 | Navigation et sections principales | ✅ |
| 5 | Showcase Pointer | ✅ |
| 6 | Projets et fiches (31 fiches, filtres) | ✅ |
| 7 | Blog et SEO | ✅ |
| 8 | Contact et assistant | ✅ |
| 9 | Responsive, animations, finitions | ✅ |
| 10 | Tests et corrections | ✅ (voir ci-dessous) |

## Retours de Jan du 12/11/2026 (traités)

- Hero : « Portfolio · 2026 » et « Alternant chez Alphalives » retirés ; le nom en texte plein n'apparaît plus avant le verre (affiché seulement sans WebGL 2 ou après 6 s sans rendu).
- Assistant : la pastille « Une question ? » est remplacée par l'orbe Strands seul (plus animé, couleurs du site).
- Tirets longs (— et –) remplacés partout par « - » (texte) ou « | » (titres de page).
- Showcase : aperçu « Atelier Lumen » en thème sombre ; bouton « Rejouer » retiré (relance automatique au retour sur la section).
- Projets phares : le carrousel avance avec le défilement de la page (premier projet quand la section est au centre, dernier projet puis la page reprend) ; « Glissez pour parcourir · cliquez pour ouvrir » retiré.
- « Bientôt » retiré ; plus de formulation de recherche d'alternance (pied de page, sujets du formulaire).
- En-tête : logo JJ retiré (le nom reste), « Accueil » ajouté (et « Contact », puisque le bouton Menu n'est plus affiché sur ordinateur) ; bouton Menu réservé au mobile et à la tablette.
- Transitions de page : Astro ClientRouter, en-tête et assistant persistants. La pastille Gooey Nav finit son animation pendant le changement de page. Les scripts de page (apparitions, filtres, visionneuse, YouTube) se relancent sur `astro:page-load`.
- Fluidité : Prism rendu à une résolution plus basse ; Strands compilé hors du fil principal et démarré après le chargement.

## Retours de Jan du 23/11/2026

- Section **Certifications** sur l’accueil, juste avant « Deux portfolios » : 3 certifications (Anthropic, Google Analytics, Semrush) en cartes React Bits « Spotlight Card » (halo iris qui suit le curseur, CSS seul). Liens vers la page Certifications du profil LinkedIn ; ajouter `href` dans `CERTIFICATIONS` (src/data/site.ts) pour chaque certificat.
- **Mode allégé automatique retiré** : effets complets partout ; la version sans WebGL ne sert qu’aux navigateurs sans WebGL 2. Testé : CPU ×20 → effets conservés.

## Retours de Jan du 17/11/2026 (traités, en ligne)

- **OpticalPro** : « Oopticien Pro » renommé partout (fiche `/projets/opticalpro`, article, approche, assistant), présenté comme réalisé bénévolement pour une boutique d’optique dont le réseau s’agrandit (contexte « Projet bénévole »). Captures retouchées (logo « Optical PRO », `vous@opticalpro.local`, texte de l’aide). Projet vitrine renommé « Boutique d’optique » (`/projets/boutique-optique`). Dépôt GitHub renommé `janjawish/OpticalPro` (l’ancienne adresse redirige). Redirections 301 des anciennes URL. Anciens visuels archivés dans `legacy/assets-retires/`.
- Accueil : section « Dix domaines, une même méthode. » placée juste avant « Comprendre d’abord… ».
- Clic droit désactivé (sauf dans les champs du formulaire).
- **Niveau d’effets adaptatif** (`src/lib/effects.ts`) : mode allégé décidé avant l’affichage (économie de données, ≤ 2 Go de mémoire ou ≤ 2 cœurs, mobile modeste, pas de WebGL 2) ou en cours de visite si l’affichage passe sous ~24 images/s (décision mémorisée 14 jours). En mode allégé : pas d’intro ni de WebGL (halo CSS, nom en texte, navigation simple, carrousel en rangée de cartes, Showcase affiché terminé, boutons simples, défilement natif). Testé : CPU ×20 → bascule à 10,9 images/s.
- **Responsive** : audit sur 15 formats (320 px à 2560 px, paysage, tablettes) × 11 pages, aucun débordement. Corrections : menu plein écran jusqu’à 1179 px (panneau coupé sur tablette), titres du menu proportionnés à la hauteur (téléphone à l’horizontale), réseaux qui passent à la ligne, jambages rognés, badge circulaire recentré sur téléphone, navigation centrale à partir de 1180 px.

## Mise en ligne (16/11/2026)

- Projet Vercel **portfolio-general** (déploiement depuis le dossier local : `vercel deploy --prod`), domaines `www.janjawish.fr` (site) et `janjawish.fr` (redirection 308 vers www) basculés depuis l'ancien projet `portfolio-janjawish`, conservé pour un retour arrière (configuration d'origine : apex → www en 308).
- Anciennes adresses vérifiées et redirigées (dont `/projects/fidal-normandie` → `/projets/fidal`, adresses de l'ancien portfolio développeur).
- Nouveau CV (16/11/2026) ; l'ancien est archivé dans `legacy/` (non publié). Poste chez Alphalives : **Développeur web full-stack**.
- Portrait : effet Halftone Reveal seulement sur appareils avec souris (sur écran tactile, photo seule ; /a-propos mobile 60 → 92).
- Formulaire de contact **actif** (Web3Forms) : variables `PUBLIC_CONTACT_ENDPOINT` et `PUBLIC_CONTACT_ACCESS_KEY` définies dans le projet Vercel (Production) ; envoi testé le 16/11/2026 (réponse 200, message reçu). Web3Forms refuse les navigateurs automatisés (« HeadlessChrome ») : pour un test automatique, utiliser un user-agent Chrome standard.
- CV remplacé par la version sans téléphone ni adresse (16/11/2026).
- Reste : sous-domaines dev/creatif à rallumer côté serveur, Search Console et statistiques.

## Retours de Jan du 15/11/2026, second lot (traités)

- Portrait remplacé par la photo studio validée par Jan (trame claire sur fond encre, détourage désactivé).
- Texte circulaire moins épais (graisse 500).
- Accueil : section teaser « Une idée, plusieurs expertises. » retirée (le composant `TeaserVideo.astro` reste dans le projet, inutilisé).
- Pied de page : dernière ligne (© et « Conçu et développé par… ») retirée.
- Pages de rubrique (À propos, Compétences, Projets, Approche, Blog, Contact, Portfolios, Mentions légales) : paragraphe sous le titre et trait retirés ; les résumés des fiches projet et des articles sont conservés.
- À propos : titre « Le code, l’image et les mots. », citation « Une marque attire… » retirée.
- Blog : étiquettes sous le titre retirées. Contact : titre placé plus bas, près du formulaire.

## Retours de Jan du 15/11/2026 (traités)

- Hero : sous-titre « Développement web, design… » et trait retirés ; accroche : « Développeur web junior, en alternance chez Alphalives et en dernière année de BUT MMI à l'IUT de Vélizy… » (même formule en tête de /a-propos).
- Tous les petits libellés à point (« À propos », « Compétences », « Projets · 31 fiches »…) retirés sur tout le site.
- Accueil : les deux paragraphes de présentation retirés ; textes d'introduction des sections Compétences, Showcase, Approche et Portfolios retirés ; en-tête de la section Projets retiré (titre conservé pour les lecteurs d'écran).
- Effets : Scroll Reveal, Circular Text et Halftone Reveal avec les réglages demandés (voir COMPONENTS.md).
- Contact : texte d'introduction et trait retirés, bloc « Situation » retiré ; « Ailleurs » renommé « Réseaux » (aussi dans le pied de page et le menu).

## Retours de Jan du 12/11/2026, cinquième lot (traités)

- Showcase : les flèches des curseurs étaient invisibles (largeur 0, écrasées par la règle globale `svg { max-width: 100% }`) ; exception ajoutée pour `.showcase-pointer svg`. Curseurs à 1,05 (desktop) et 0,82 (mobile).
- Showcase : le titre pouvait être tapé plusieurs fois à la suite si le scénario était relancé (ex. rechargement à chaud en développement) ; le champ est vidé juste avant la saisie et l'état du tableau est réinitialisé au début de chaque lecture.

## Retours de Jan du 12/11/2026, quatrième lot (traités)

- Menu mobile (Staggered Menu) au thème du site : panneau encre avec lueur iris, titres Bricolage en casse normale, numéros iris qui ne débordent plus, bouton « Fermer » sombre.
- Sous-titre sous « JAN JAWISH » plus lisible (plus clair, ombre portée sur la lumière du prisme).
- Showcase : curseurs plus petits (0,9 desktop, 0,72 mobile) et positions finales ramenées dans le tableau sur petit écran ; le curseur Com attend désormais que Dev ait déplacé ses cartes (sur mobile, les deux glisser simultanés dans la même colonne faisaient rater « Textes & SEO », bloquant la progression à 75 %).
- Carrousel : légende (titre, année, disciplines) au premier plan, plus grande et avec ombre portée.
- Logo JJ retiré partout : pied de page et icônes (favicon, icône d'écran d'accueil) remplacées par une pastille iris neutre.
- Fidal : titres des vidéos masqués sous les lecteurs (champ `videoCaptions: false` du projet ; le titre reste annoncé aux lecteurs d'écran).

## Passe SEO du 12/11/2026

- **Titres** : suffixe « | Jan Jawish » ajouté seulement s'il tient dans 60 caractères et si le nom n'est pas déjà présent (`Seo.astro`). Titres des pages principales enrichis de mots-clés (accueil, à propos, compétences, projets, approche, blog, contact).
- **Descriptions** : toutes ramenées sous 160 caractères ; les fiches projets au résumé court (< 110) sont complétées automatiquement.
- **Balise robots** explicite (`max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1`) : grandes vignettes autorisées dans Google Discover et les résultats.
- **hreflang** `fr` + `x-default` sur chaque page indexable.
- **Articles** : `article:author` et `article:tag` (depuis les tags du front matter).
- **Sitemap** : `<lastmod>` réel pour les articles (updatedDate, sinon pubDate), `/blog` et l'accueil (date du dernier article). Pas de lastmod artificiel ailleurs.
- **Vérification** Search Console / Bing via `PUBLIC_GOOGLE_SITE_VERIFICATION` et `PUBLIC_BING_SITE_VERIFICATION` (facultatif, la vérification DNS est préférable).
- **IndexNow** : clé dans `public/c172bd934dbfe42d4508e658f3a8500e.txt`, script `npm run indexnow` (tout le sitemap) ou `npm run indexnow -- /blog/mon-article` après chaque mise en ligne.
- **Teaser vidéo** (accueil, section « En mouvement » avant le Showcase) : `src/components/TeaserVideo.astro`, carré 1080×1080, 22 s en boucle (vrais composants Prism, Refracted Text et Showcase Pointer filmés image par image), lecture muette seulement quand visible, aucune lecture auto si « réduire les animations », données structurées VideoObject. ⚠️ Déposer `jan-jawish-teaser.webm`, `jan-jawish-teaser.mp4` et `jan-jawish-teaser-poster.jpg` dans `public/motion/` (fichiers livrés dans la conversation du 12/11/2026).
- ⚠️ Build non relancé après ces changements (registre npm inaccessible depuis l'environnement de test) : lancer `npm run build` puis `npm run preview` avant de pousser.

## Retours de Jan du 12/11/2026, troisième lot (traités)

- 404 : étiquette « Erreur 404 » retirée.
- Barre de défilement masquée (le défilement reste possible).
- Rectangle blanc sur « JAN JAWISH » : deux causes corrigées. 1) Surlignage de sélection du canvas : les canvas et le titre ne sont plus sélectionnables. 2) Le canvas du verre était le seul en alpha non prémultiplié : sur certains pilotes graphiques, le faisceau lumineux apparaissait dans les pixels transparents. Passage en alpha prémultiplié (rendu identique ailleurs).
- Petit trait animé « scroll » en bas du hero retiré.
- Showcase : mention « Démonstration narrative… » retirée (le badge « Projet fictif » reste dans le tableau de bord).
- Carrousel des projets en pleine largeur (bord à bord de l'écran).
- Portfolios spécialisés : liens vers https://dev.janjawish.fr et https://creatif.janjawish.fr (nouvel onglet) et effet **Holo Card** sur les cartes. ⚠️ Au 12/11/2026, les deux adresses répondent « 530 » (pas encore en ligne).

## Retours de Jan du 12/11/2026, second lot (traités)

- **Intro de l'accueil** (arrivée sur le site uniquement, pas au retour arrière ni avec « réduire les animations ») : prisme seul ~2 s, puis montée des lettres « JAN JAWISH », puis en-tête, texte, boutons et assistant en fondu. Défilement bloqué pendant l'intro (débloqué au plus tard au bout de 9 s). Le nom en texte plein n'apparaît plus (sauf sans WebGL 2 ou si le verre n'est pas rendu à temps).
- **Lenteur au lancement** : la compilation du shader du verre (≈ 1 s de blocage sous Windows) se fait désormais hors du fil principal pendant la phase « prisme seul ». Tâches longues au chargement (Chrome réel, sans bridage) : ~1,7 s → ~0,7 s. Lighthouse accueil : mobile 58 → 65 (TBT ~5,5 s → 1,1 s), desktop 69 → 93 (TBT 0,2 s).
- **Défilement amorti Lenis** (`src/lib/smoothScroll.ts`, réglages lerp 0,07 / wheelMultiplier 0,85), synchronisé avec GSAP ScrollTrigger, démarré une seule fois (script du layout racine, conservé par le ClientRouter) ; retour en haut à chaque changement de page (sauf retour arrière) ; ancres et sommaires via `defilerVers()` avec décalage de 96 px ; inactif si « réduire les animations ».
- **Carrousel des projets** : molette verticale, défilement latéral (pavé tactile, Maj + molette) et glisser font tous avancer ou reculer le carrousel en faisant défiler la page.

## Ce qui existe

**Pages (43 pré-rendues)** : `/`, `/a-propos`, `/competences`, `/projets` (filtres par discipline, état dans l'URL `?discipline=`), 31 × `/projets/[slug]`, `/approche`, `/portfolios`, `/blog`, 3 × `/blog/[slug]`, `/contact`, `/mentions-legales`, `404`. Plus `sitemap-index.xml`, `robots.txt`, `rss.xml`, `llms.txt`, `assistant.json`.

**Fonctionnalités** : hero Prism + Refracted Text ; Gooey Nav (desktop) + Staggered Menu ; récit Showcase Pointer scénarisé avec seulement « Rejouer » ; carrousel Flex Carousel ; fiches projets (En bref, chiffres clés, vidéos YouTube sans cookie avant clic, étapes, récit, galerie avec visionneuse, albums photo, documents, projets voisins) ; blog Markdown avec sommaire ; formulaire de contact honnête ; assistant local avec Strands ; page 404 Fuzzy Text.

**SEO** : URL propres sans barre finale, canonical, title et description par page, Open Graph et Twitter (image par projet, image par défaut `public/og/default.png`), JSON-LD (Person, WebSite, ProfilePage, AboutPage, CollectionPage + ItemList, CreativeWork, VideoObject, Blog, BlogPosting, BreadcrumbList, ContactPage), sitemap, robots, RSS, `llms.txt`, images WebP responsives, redirections 301 des anciennes URL dans `vercel.json`.

## Tests réalisés (Chrome réel, build de production)

- **Fonctionnels** (`scratchpad/tools/interact.cjs`), 25/25 : scénario Showcase complet (4/4 tâches livrées, mise en ligne, titre réécrit, accent changé, aucun bouton, relance au retour sur la section), bouton Menu masqué sur desktop, Accueil dans la navigation, assistant (alternance, projet nommé, compétence, contact, question hors périmètre → aucune invention, Échap), filtres (clic, URL, lecture du paramètre), contact (3 erreurs de validation, aucun faux succès sans service configuré, mailto prérempli), menu (ouverture, Échap), Stepper, statut 404. Seul message console : la réponse 404 de la page de test inexistante.
- **Liens** (`crawl.cjs`) : 43 pages, 788 URL internes (liens, images, srcset, scripts, PDF) → aucune cassée ; title, description, canonical, h1 unique, Open Graph et JSON-LD présents partout.
- **Accessibilité** (axe-core, WCAG 2.1 AA + bonnes pratiques) : 0 violation sur 13 pages. Lighthouse accessibilité : 100.
- **Mobile 390 px** : menu, compétences (2 colonnes), Showcase (scénario complet), fiche projet, assistant ; aucun défilement horizontal réel.
- **Lighthouse** (mobile, CPU ×4) : SEO 100 et bonnes pratiques 100 partout. Performance : fiches projets / à propos 92-93, /projets 86, **accueil 65** (desktop 93). CLS ≤ 0,06.
- **Lenis** (`scratchpad/tools/lenis.cjs`) : molette amortie sur 9 pages, ancre de sommaire et « Découvrir Jan » à 96 px, retour en haut au changement de page, position conservée au retour arrière, aucune erreur console, mouvements réduits = défilement natif sans intro.
- **Intro** : défilement bloqué pendant l'intro puis rétabli ; ordre prisme → nom → reste vérifié sur desktop et mobile.
- **Carrousel** : molette verticale, latérale et glisser, dans les deux sens, cohérents avec la position de la page.
- **Transitions** : navigation Accueil → Projets → À propos → Blog → Accueil → Contact puis retour arrière : un seul en-tête et un seul assistant, page active correcte, apparitions et filtres fonctionnels après navigation.

## Problèmes restants

1. **Performance de l'accueil sur mobile en laboratoire** (65) : il reste ~0,3 s de calcul des masques du verre (pendant la phase « prisme seul ») et la compilation du shader du prisme. LCP mobile 3,6 s, lié à l'intro voulue (le texte du hero apparaît à la fin). Le serveur de développement (`npm run dev`) est beaucoup plus lent que le site construit : juger la fluidité sur `npm run build` + `npm run preview`.
2. Le **dev server** et le build ne doivent pas tourner en même temps (voir plus haut).

## À vérifier ou fournir par Jan

- **CV** : `public/documents/cv-jan-jawish.pdf` mentionne encore l'IUT de Rouen (site d'Elbeuf) et une recherche d'alternance → le remplacer par un CV à jour (Vélizy, Alphalives), même nom de fichier.
- **Alphalives** : intitulé exact du poste et dates (affiché : « Alternant », 2026–2027) → `src/data/site.ts`, `TIMELINE`.
- **Elbeuf** : années affichées « 1re et 2e années » (déduit de l'ancien site et du CV).
- **Fidal** : le site public indiquait 2026, la vidéo a été publiée en décembre 2025 → affiché 2025.
- **3D** : outil affiché « Blender » (des fichiers .blend existent sur la machine) → confirmer.
- **Blog** : relire les 3 articles (écrits à partir des études de cas).
- **Formulaire** : créer une clé Web3Forms/Formspree pour l'envoi direct (voir README).
- **Suivi** : Search Console et outil d'analyse à brancher (l'ancien Google Analytics n'a pas été repris).
- **Avis clients** de l'ancien site non repris (non vérifiables) : à réintégrer si Jan dispose d'accords écrits.

## Prochaine étape

Relecture des contenus par Jan, décision sur l'option mobile du hero, nouveau CV, clé de formulaire, puis déploiement sur Vercel (non effectué : aucun déploiement, push ni commit n'a été fait).
