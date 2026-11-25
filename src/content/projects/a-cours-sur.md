---
title: "À cours sûr"
headline: "Enregistrer, transcrire, réviser"
summary: "Application Windows locale qui réunit l’audio, les notes et la transcription d’un cours sur un même écran."
year: 2026
order: 7
featured: true
disciplines: ["web"]
context: "Projet personnel"
role: "Conception et développement"
platform: "Application Windows"
tools: ["React","TypeScript","Tauri","Rust","whisper.cpp"]
cover: "../../assets/projects/a-cours-sur.png"
coverAlt: "Interface de cours de À cours sûr"
links:
  - { label: "Site vitrine", href: "https://a-cours-sur-vitrine.vercel.app/" }
  - { label: "Télécharger pour Windows", href: "https://github.com/janjawish/a-cours-sur/releases/latest" }
  - { label: "Code source sur GitHub", href: "https://github.com/janjawish/a-cours-sur" }
gallery:
  - { src: "../../assets/projects/a-cours-sur-vue-ensemble.png", alt: "Vue d’ensemble de l’application À cours sûr", caption: "Les cours rangés et retrouvables par recherche plein texte." }
  - { src: "../../assets/projects/a-cours-sur-live.png", alt: "Écran de cours en direct de À cours sûr", caption: "Notes et transcription côte à côte pendant le cours." }
---

## Le projet

Une application pour enregistrer un cours, prendre des notes et retrouver sa transcription sur le même écran. L’audio et la transcription restent sur l’ordinateur.

**Le défi :** relier capture audio, prise de notes et transcription locale dans un parcours cohérent, même quand la transcription s’interrompt.

## Ce que j’ai construit

- Interface React et TypeScript, empaquetée avec Tauri 2.
- Transcription locale avec whisper.cpp.
- Organisation des cours, notes et marqueurs de révision.
- Analyse facultative après le cours avec Gemini.

La transcription nécessite l’installation du moteur local ; l’analyse cloud est facultative.
