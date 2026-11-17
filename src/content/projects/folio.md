---
title: "Folio"
headline: "Retrouver ses cours, même hors ligne"
summary: "Bibliothèque de cours local-first : import, scanner multipage, OCR local et recherche plein texte, sans configuration cloud."
year: 2026
order: 6
featured: true
disciplines: ["web","ui-ux"]
context: "Projet personnel"
role: "Conception et développement"
platform: "PWA · stockage local"
tools: ["React","TypeScript","IndexedDB","PDF.js","Tesseract.js","MiniSearch"]
cover: "../../assets/projects/folio-desktop.png"
coverAlt: "Bibliothèque et matières de Folio"
links:
  - { label: "Code source sur GitHub", href: "https://github.com/janjawish/folio-cours" }
---

## Le projet

Une bibliothèque de cours qui réunit documents, scanner multipage, lecture PDF et recherche plein texte, avec une organisation par matière et semestre.

**Le défi :** rendre les documents recherchables tout en conservant les fichiers et les traitements OCR sur l’appareil.

## Ce que j’ai construit

- React et TypeScript, export statique.
- Lecture et extraction avec PDF.js ; OCR avec Tesseract.js.
- Indexation par page avec MiniSearch et recherche avec extraits.
- Stockage IndexedDB, sauvegarde ZIP et fonctionnement hors ligne.

Les captures du dépôt utilisent des cours de démonstration. La bibliothèque reste utilisable sans configuration cloud.
