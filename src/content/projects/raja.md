---
title: "Raja"
headline: "Ne plus oublier une facturation"
summary: "Application interne de suivi des dossiers d’un centre d’audition : échéances, mutuelles et facturation réunies pour ne plus laisser passer un dossier."
year: 2026
order: 0.5
featured: true
disciplines: ["web"]
context: "Projet personnel"
role: "Conception et développement full stack"
team: "Seul"
platform: "Application web interne"
tools: ["PHP", "MySQL / MariaDB", "PDO", "Tesseract OCR", "Poppler"]
cover: "../../assets/projects/raja-dashboard.jpg"
coverAlt: "Tableau de bord de Raja avec des données fictives"
links:
  - { label: "Site vitrine", href: "https://raja-vitrine.vercel.app/" }
  - { label: "Code source sur GitHub", href: "https://github.com/janjawish/raja-audition" }
highlights:
  - { label: "Quoi", value: "Une application de suivi des dossiers : échéances, mutuelles, facturation et historique des actions." }
  - { label: "Pour qui", value: "L’équipe d’un centre d’audition, qui doit suivre chaque appareillage jusqu’à la facturation." }
  - { label: "Défi principal", value: "Ne laisser passer aucune échéance alors que les dossiers s’étalent sur plusieurs semaines." }
  - { label: "Résultat", value: "Une application en usage réel, qui affiche chaque jour les dossiers prioritaires." }
steps:
  - { title: "Importer", text: "Reprendre les dossiers par CSV ou lire les fiches PDF Cosium avec un OCR local." }
  - { title: "Calculer", text: "Poser automatiquement les échéances carte vitale (J+23) et facturation (J+30)." }
  - { title: "Prioriser", text: "Afficher les dossiers urgents et les prochaines actions sur le tableau de bord." }
  - { title: "Tracer", text: "Garder l’historique de chaque modification, par utilisateur." }
gallery:
  - { src: "../../assets/projects/raja-dashboard.jpg", alt: "Tableau de bord de Raja : compteurs par statut, priorités du jour et activité récente (données fictives).", caption: "Les priorités du jour et l’activité récente sur un seul écran." }
  - { src: "../../assets/projects/raja-dossiers.jpg", alt: "Liste des dossiers actifs dans Raja, avec statut, priorité et échéances (données fictives).", caption: "Les dossiers actifs avec leur statut et leurs échéances." }
  - { src: "../../assets/projects/raja-dossier.jpg", alt: "Détail d’un dossier dans Raja : échéances, facturation, actions rapides et historique (données fictives).", caption: "Le détail d’un dossier, ses échéances et ses actions rapides." }
  - { src: "../../assets/projects/raja-import-pdf.jpg", alt: "Import d’une fiche PDF Cosium dans Raja, lue localement par OCR.", caption: "Les fiches PDF Cosium sont lues sur le poste, sans service externe." }
  - { src: "../../assets/projects/raja-historique.jpg", alt: "Historique des actions dans Raja, par utilisateur (données fictives).", caption: "Chaque modification est tracée." }
notice: "Les captures viennent du site vitrine et montrent des données fictives : aucune donnée de patient."
---

## Le projet

Dans un centre d’audition, un dossier passe par plusieurs étapes sur plusieurs semaines : essai, carte vitale, mutuelle, facturation. Un oubli, et la facturation est perdue.

**Le défi :** suivre chaque dossier jusqu’au bout sans demander à l’équipe de tout retenir.

## Ce que j’ai construit

- Échéances calculées automatiquement (J+23 pour la carte vitale, J+30 pour la facturation), mises en pause pendant un SAV.
- Import CSV avec prévisualisation et correspondance des colonnes ; lecture des fiches PDF Cosium avec un OCR local (Tesseract et Poppler).
- Comptes nominatifs avec rôles et historique des actions.

Une démonstration en ligne arrive bientôt.
