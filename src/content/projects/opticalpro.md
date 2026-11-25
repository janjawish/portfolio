---
title: "OpticalPro"
headline: "Le cockpit de la boutique"
summary: "Application métier full stack réalisée bénévolement pour une boutique d’optique dont le réseau s’agrandit : dossiers, mutuelles, facturation, paiements et commandes réunis dans un cockpit déployé sur le réseau local."
year: 2026
order: 2
featured: true
disciplines: ["web"]
context: "Projet bénévole"
role: "Conception fonctionnelle et développement full stack"
team: "En collaboration avec une équipe"
platform: "Application web locale sur Windows"
tools: ["PHP 8.2", "MariaDB / MySQL", "PDO", "Apache", "JavaScript", "Poppler", "Tesseract OCR", "PHPMailer", "PowerShell"]
cover: "../../assets/projects/opticalpro-dashboard.png"
coverAlt: "Tableau de bord d’OpticalPro"
links:
  - { label: "Essayer la démo", href: "https://demo-opticalpro.janjawish.fr/" }
  - { label: "Site vitrine", href: "https://oopticien-pro-vitrine.vercel.app/" }
highlights:
  - { label: "Quoi", value: "Un cockpit interne qui réunit clients, dossiers lunettes et lentilles, PEC mutuelles, facturation, paiements, avoirs, commandes verriers et communications." }
  - { label: "Pour qui", value: "L’équipe d’une boutique d’optique dont le réseau s’agrandit, qui doit suivre chaque dossier et déclencher la bonne action au bon moment. Projet mené bénévolement." }
  - { label: "Défi principal", value: "Compléter Cosium sans dupliquer le travail, migrer un historique volumineux et protéger des données de santé sensibles." }
  - { label: "Résultat", value: "1 317 clients, 2 293 dossiers et 6 879 paiements structurés sans doublon dans une application déployée sur le réseau local." }
metrics:
  - { value: "1 317", label: "clients migrés sans doublon" }
  - { value: "2 293", label: "dossiers structurés" }
  - { value: "6 879", label: "paiements rapprochés" }
  - { value: "AES-256", label: "chiffrement des numéros de Sécurité sociale" }
steps:
  - { title: "Importer", text: "Reprendre les données historiques, les fichiers CSV et les PDF Cosium." }
  - { title: "Centraliser", text: "Réunir clients, dossiers, mutuelles, commandes et documents." }
  - { title: "Prioriser", text: "Afficher les dossiers à facturer, les urgences et les prochaines actions." }
  - { title: "Communiquer", text: "Préparer les e-mails et relances puis les envoyer après contrôle." }
  - { title: "Sécuriser", text: "Limiter les accès et conserver les données sensibles sur le réseau local." }
gallery:
  - { src: "../../assets/projects/opticalpro-login.png", alt: "Écran de connexion d’OpticalPro", caption: "Un accès réservé à l’équipe depuis le réseau local de la boutique." }
  - { src: "../../assets/projects/opticalpro-dashboard.png", alt: "Tableau de bord d’OpticalPro", caption: "Les dossiers en cours, urgences et prochaines actions réunis dans un seul cockpit." }
  - { src: "../../assets/projects/opticalpro-aide.png", alt: "Centre d’aide d’OpticalPro", caption: "Des procédures métier intégrées pour guider l’équipe dans les opérations courantes." }
  - { src: "../../assets/projects/opticalpro-import-csv.png", alt: "Import CSV dans OpticalPro", caption: "Un import contrôlé pour reprendre les dossiers historiques sans doublon." }
  - { src: "../../assets/projects/opticalpro-import-pdf.png", alt: "Import PDF Cosium avec OCR", caption: "Poppler et Tesseract lisent localement les PDF Cosium avant validation par l’opticien." }
notice: "Application interne : aucune donnée métier n’est publiée. La démonstration en ligne utilise des données fictives."
---

## Contexte & problématique

Le suivi opérationnel dépassait le périmètre de Cosium : plusieurs outils et documents devaient être rapprochés pour savoir où en était un dossier et quelle action lancer ensuite.

- Centraliser les dossiers lunettes, lentilles, mutuelles et commandes verriers
- Suivre la facturation, les paiements et les avoirs à l’échelle d’une famille
- Importer des documents Cosium parfois enregistrés comme de simples images
- Automatiser les relances et communications sans perdre la validation humaine
- Garantir la confidentialité des documents et des numéros de Sécurité sociale

> L’application ne remplace pas Cosium : elle transforme les informations existantes en priorités de travail claires.

## Choix de conception

### Lire les exports Cosium, même lorsqu’ils sont des images

Conversion des pages PDF avec Poppler, reconnaissance du contenu avec Tesseract OCR en français, prévisualisation des champs avant toute création ou modification. **Résultat :** les dossiers historiques deviennent exploitables sans ressaisie complète et restent contrôlés par l’opticien.

### Migrer beaucoup de données sans créer de doublons

Analyse d’une fiche de suivi colorée de 32 pages, conversion en SQL transactionnel et idempotent, rapprochement de 1 317 clients, 2 293 dossiers et 6 879 paiements. **Résultat :** la migration peut être rejouée proprement et conserve la cohérence de l’historique.

### Une architecture locale pensée pour la confidentialité

- Rôles utilisateurs, protections CSRF et requêtes PDO préparées
- Documents stockés hors de l’espace public
- Numéros de Sécurité sociale chiffrés en AES-256-GCM
- Assistant local limité à la recherche, au résumé et à la préparation d’actions à valider

**Résultat :** les données restent dans la boutique et aucune modification sensible n’est exécutée sans validation humaine.

## Défis & solutions

**Faire dialoguer l’ancien et le nouveau.** Les informations existaient dans plusieurs formats et certains PDF ne contenaient pas de texte sélectionnable. Réponse : combiner migration SQL, import CSV et OCR avec une étape de contrôle systématique avant écriture.

**Automatiser sans retirer le contrôle métier.** Une action erronée peut affecter un dossier client, une mutuelle ou une communication réelle. Réponse : l’assistant et les automatisations préparent les actions ; l’opticien garde la validation finale.

## Ce que j’en retiens

- Concevoir un outil métier autour des priorités réelles d’une équipe
- Transformer des sources hétérogènes en données fiables et rejouables
- Déployer et superviser une application PHP sur un serveur Windows local
- Intégrer la sécurité et la confidentialité dès l’architecture
- Trouver le bon équilibre entre automatisation et validation humaine

OpticalPro transforme un suivi dispersé en une vue opérationnelle : chaque dossier indique enfin la prochaine bonne action.
