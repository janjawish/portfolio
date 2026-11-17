# Composants React Bits et ReactDrops

Les composants sont les **sources originales** copiées depuis les dépôts officiels (variante TypeScript + CSS), sans réécriture. Les seules modifications sont des adaptations minimales, signalées dans le code par `[Adaptation portfolio]` et listées ci-dessous.

## Provenance

| Bibliothèque | Dépôt | Commit copié (11/11/2026) | Licence |
|---|---|---|---|
| React Bits | github.com/DavidHDev/react-bits (`src/ts-default/…`) | `9d9c687dc4f55b23539aa5417b703078047efa74` | MIT + Commons Clause (`src/components/reactbits/LICENSE.md`) |
| ReactDrops | github.com/crisjavr/reactdrops (`packages/components/src/…`) | `1643ff59ad2f9068652ce674509736c5ba611b60` | ReactDrops Component License 1.0 (`src/components/reactdrops/LICENSE`) |

**Vérifications de sécurité avant intégration** : aucun script d'installation exécuté (copie de fichiers, pas de CLI tierce) ; recherche d'appels réseau, `eval`, `new Function`, cookies et stockage local dans tous les fichiers copiés → rien, hormis des URL d'images Unsplash de démonstration dans Flex Carousel (jamais utilisées : le site fournit toujours ses propres images). Dépendances ajoutées : `gsap`, `ogl`, `motion`, `@hugeicons/react`, `@hugeicons/core-free-icons` (`npm audit` : 0 vulnérabilité).

**Licences** : les deux licences autorisent l'usage dans un site fini (« End Product ») et interdisent de redistribuer les composants comme bibliothèque, kit ou template. Le portfolio est un site fini ; les fichiers de licence sont conservés à côté des sources. ⚠️ Le dépôt GitHub `janjawish/portfolio` étant public, le code des composants y sera visible comme partie du site : c'est couvert par la licence ReactDrops (« integrated part of an End Product ») et par l'usage habituel de React Bits, mais ne republiez jamais ces dossiers seuls.

## Utilisation

| Composant | Où | Réglages principaux |
|---|---|---|
| **Prism** (React Bits) | Fond du hero | palette iris/papier, `scale` 1,75 (1,45 mobile), `glow` 0,9, `noise` 0, résolution réduite sur mobile |
| **Refracted Text** (ReactDrops) | Nom « JAN JAWISH » du hero | police Bricolage Grotesque 800, `decorative` (le `<h1>` texte reste dans le DOM) |
| **Specular Button** (React Bits) | CTA « Découvrir Jan », envoi du formulaire | teinte iris, rayon 26–30 px |
| **Gooey Nav** (React Bits) | Navigation desktop (≥ 1024 px) : Accueil, À propos, Compétences, Projets, Approche, Blog, Contact | thème sombre, pastille papier, particules iris ; index actif contrôlé ; l'en-tête persiste d'une page à l'autre (ClientRouter) |
| **Staggered Menu** (React Bits) | Menu plein écran, mobile et tablette uniquement (< 1024 px) | panneau encre (thème du site), couches iris foncé/graphite, titres Bricolage en casse normale |
| **Showcase Pointer** (ReactDrops) | Section « Une idée. Plusieurs expertises. Un seul interlocuteur. » | 3 curseurs scénarisés, `loop={false}`, aucun bouton : rejoué quand la section revient à l'écran |
| **Flex Carousel** (React Bits) | Projets phares (accueil) | preset `ribbon`, piloté par le défilement de la page (scène fixée au milieu de l'écran, un pas de défilement par projet), clic sur la carte active = ouverture de la fiche |
| **Scroll Reveal** (React Bits) | Manifeste de l'accueil, citation (/a-propos) | réglages choisis par Jan : highlight (iris #A9AED6), stagger 0,5, smoothing 1,2, baseOffset 25, blurStrength 7, reste par défaut |
| **Halftone Reveal** (React Bits) | Portrait studio (accueil, /a-propos) | trame mono, points clairs (#F5F3EE) sur fond encre (#0B0B0C), détourage du fond désactivé, cellSize 5, revealRadius 170, softness 0,8, linger 1,6 ; la photo se fond dans la trame quand le portrait arrive à l'écran, la vraie image se révèle au survol ; shaders pré-compilés hors du fil principal (sources exportées) |
| **Border Glow** (React Bits) | Cartes de compétences | lueur iris |
| **Circular Text** (React Bits) | Badge sur le portrait (« WEB • DESIGN • IMAGE • COM ») | réglages choisis par Jan : survol = ralentit, 21 s par tour, inclinaison 7°, taille 190, corps 26, départ 180° ; couleurs iris (#A9AED6 / #858BB9) au lieu du violet de la démo |
| **Topographic Flow** (ReactDrops) | Fond des sections « Approche » | lignes graphite/iris, `grain` 0 |
| **Holo Card** (React Bits) | Cartes des portfolios spécialisés (liens vers dev.janjawish.fr et creatif.janjawish.fr) | preset `rainbow`, intensité 0,4, reflet iris, inclinaison 10° ; visuels générés depuis le design du site (`src/assets/portfolios`) ; image simple affichée tant que le shader n'est pas compilé (hors du fil principal) |
| **Stepper** (React Bits) | Méthode pas à pas (/approche) | libellés français, accent iris |
| **Strands** (React Bits) | Bouton de l'assistant (bas à droite), sans libellé | couleurs du site, `speed` 2, `amplitude` 1,6, `waviness` 1,6 ; démarre après le chargement de la page (orbe CSS statique en attendant) |
| **Fuzzy Text** (React Bits) | Page 404 | seul texte volontairement brouillé du site |

Plus utilisé : **Star Border** (remplacé par Holo Card sur les cartes ; source conservée). Non retenus : **Magic Bento** (redondant avec Border Glow), **Glass Icons** (les liens sociaux restent textuels, plus lisibles), **Sling Button** (bouton icône seul, libellé d'aide en anglais : un bouton d'envoi explicite est préférable).

## Adaptations

| Composant | Modification | Raison |
|---|---|---|
| Staggered Menu | props `logo`, `menuLabel`, `closeLabel`, `socialsTitle`, `footer` ; `inert` quand fermé ; fermeture au clic sur un lien et avec Échap | français, logo-lien, accessibilité clavier |
| Refracted Text | prop `decorative` (masqué aux lecteurs d'écran sans suspendre le rendu) ; prop `maxPixelRatio` ; props `holdReveal` et `onReady` ; fonction `prewarmRefractedShaders()` (compilation parallèle du shader dans un contexte jetable) ; canvas en alpha prémultiplié (`premultipliedAlpha: true` + sortie du shader multipliée par l'alpha) | doublon visuel d'un vrai `<h1>` ; coût CPU sur mobile ; intro de l'accueil (le verre attend la fin du « prisme seul ») ; la compilation du shader bloquait Chrome ~1 s sous Windows ; sur certains pilotes graphiques, l'alpha non prémultiplié faisait apparaître un rectangle blanc derrière le titre |
| Scroll Reveal | prop `as` (h2/h3/p/div) et texte accessible pour les paragraphes | sémantique |
| Flex Carousel | props `ariaLabel`, `ofLabel` ; prop `progress` (0 → 1) qui pilote la position ; prop `onScrub` (glisser et défilement latéral convertis en défilement de la page) | libellés français ; tous les gestes (molette, pavé tactile latéral, glisser) passent par le défilement de la page |
| Halftone Reveal | sources des shaders exportées ; prop `keyMatte` (détourage automatique du fond uni, actif par défaut comme l'original) | pré-compilation parallèle ; sur la photo à fond sombre, le détourage retirait aussi le pull et les cheveux (rendu négatif) |
| Holo Card | sources des shaders exportées (`VERTEX`, `FRAGMENT`) | pré-compilation parallèle via `src/lib/prewarmShader.ts` |
| Strands | compilation du shader avec `KHR_parallel_shader_compile` quand l'extension existe | la compilation bloquait la page ~2 s (surtout sous Windows / ANGLE) |
| Tous | fins de ligne normalisées (LF) | cohérence du dépôt |

Les styles propres au portfolio sont dans les fichiers CSS des îlots (`src/components/islands/*.css`) ; les CSS d'origine ne sont pas modifiés.
