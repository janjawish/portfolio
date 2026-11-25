---
title: "Maison Fidèle"
headline: "La carte de fidélité dans le téléphone"
summary: "Carte de fidélité numérique pour un commerce : le client s’inscrit, cumule des points et ajoute sa carte à Apple Wallet ou Google Wallet."
year: 2026
order: 7.5
featured: true
disciplines: ["web", "ui-ux"]
context: "Projet personnel"
role: "Conception et développement"
team: "Seul"
platform: "Application web"
tools: ["SvelteKit", "TypeScript", "SQLite", "Drizzle", "Zod", "Apple Wallet", "Google Wallet"]
cover: "../../assets/projects/maison-fidele-accueil.png"
coverAlt: "Page d’accueil de Maison Fidèle"
links:
  - { label: "Site vitrine", href: "https://maison-fidele-vitrine.vercel.app/" }
  - { label: "Code source sur GitHub", href: "https://github.com/janjawish/maison-fidele" }
gallery:
  - { src: "../../assets/projects/maison-fidele-carte-membre.png", alt: "Espace membre Maison Fidèle : carte de fidélité, QR code et historique des points.", caption: "L’espace membre : la carte, son QR code et l’historique des points." }
  - { src: "../../assets/projects/maison-fidele-administration.png", alt: "Administration Maison Fidèle : recherche d’un membre et ajustement de points.", caption: "Côté commerce : retrouver un membre et ajuster ses points." }
---

## Le projet

Remplacer la carte de fidélité en carton par une carte qui vit dans le téléphone du client, dans Apple Wallet ou Google Wallet.

**Le défi :** générer de vraies cartes Wallet signées tout en gardant un parcours simple pour le client et pour le commerce.

## Ce que j’ai construit

- Cartes Apple Wallet signées (.pkpass) avec passkit-generator, et cartes Google Wallet via l’API Loyalty.
- Ajustements de points en transaction (Drizzle + SQLite), avec historique par membre et QR code unique.
- Un mode développement qui fonctionne sans identifiants Wallet.
