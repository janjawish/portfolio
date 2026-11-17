# Provenance des contenus

Règle suivie : **aucun contenu biographique ou professionnel inventé**. Chaque information vient d'une des sources ci-dessous.

| Source | Contenus repris |
|---|---|
| Brief de Jan (11/11/2026) | 3e année BUT MMI, IUT de Vélizy, parcours développement web, alternant chez Alphalives |
| Site public www.janjawish.fr (HTML pré-rendu, 11/11/2026) | Textes « À propos », compétences, outils, 5 études de cas (The Exit, HOP, Fidal, Chourak Consulting, Oopticien Pro), images et documents associés (copiés depuis `../deuxieme portfolio/public`) |
| CV (`public/documents/cv-jan-jawish.pdf`) | Stage The Exit avril–juin 2026, BUT à l'IUT de Rouen (site d'Elbeuf), langues, outils (InDesign, Canva, GA4, Semrush…) |
| Ancien dépôt (`legacy/`) | 26 projets 2023–2025, albums photo et leurs textes, passions (livres, artistes, films, centres d'intérêt), réseaux |
| Dépôts GitHub publics de Jan | Folio, À cours sûr, MMI Hub (descriptions des README) et dates de création |
| YouTube (pages publiques) | Dates de publication des vidéos, miniatures |
| Sites en ligne des projets | Captures d'écran (Chourak Consulting, HOP, The Exit, Ministral Arcade Cam, Foodtruck) |

## Choix éditoriaux à connaître

- **OpticalPro** (ex « Oopticien Pro », renommé à la demande de Jan le 17/11/2026) : application réalisée bénévolement pour une boutique d’optique dont le réseau s’agrandit ; le nom de la boutique n’apparaît plus sur le site (captures retouchées : « Optical PRO », `vous@opticalpro.local`). Dépôt GitHub renommé `janjawish/OpticalPro`. Le projet vitrine s’appelle désormais « Boutique d’optique » (le lien vers le site réel de la boutique est conservé).

- **Portrait** : photo studio fournie et validée par Jan le 15/11/2026 (`src/assets/about/jan-jawish-portrait-studio.jpg`, aussi `public/og/jan-jawish-portrait.jpg` pour les données structurées). L'ancienne illustration (`jan-jawish-illustration.png`) est conservée mais n'est plus utilisée.

- **Cartes des portfolios spécialisés** : visuels `src/assets/portfolios/*.png` générés à partir du design du site (mêmes textes que `SPECIALIZED` dans `src/data/site.ts`). Pour les modifier, changer le texte dans `site.ts` et régénérer les images (`scripts/generate-portfolio-cards.cjs`) ou les remplacer à l'identique (640 × 400, @2x).

- **Blog** : 3 articles rédigés à la première personne **uniquement à partir des faits des études de cas** (chiffres du rapport de stage The Exit, fiche Oopticien Pro, organisation en trois portfolios). À relire et valider par Jan.
- **Showcase Pointer** : le projet « Atelier Lumen » est **fictif** et annoncé comme tel à l'écran.
- **Approche** : les cinq étapes reformulent des phrases de Jan (site public, enseignements de The Exit) ; les exemples viennent exclusivement des études de cas.
- **Non repris** : les avis clients et les données structurées `Review` de l'ancien site (avis non vérifiables et données d'auto-évaluation déconseillées par Google), Google Analytics de l'ancien site (à reconfigurer par Jan), dates de vie des artistes et acteurs des films (erreurs dans l'ancien fichier).
- **Liens inaccessibles signalés** (vérifiés le 11/11/2026) : ablfrance.fr (domaine inexistant), etukit.fr (erreur 520), démos sur tpweb.univ-rouen.fr (authentification CAS). Aucun n'est présenté comme démo active.
