---
title: "Concevoir une application métier : cinq leçons d’OpticalPro"
description: "Migration sans doublon, OCR local, données de santé, validation humaine : ce que la conception d’OpticalPro, outil interne d’un opticien, m’a appris."
pubDate: 2026-09-20
tags: ["Développement web", "PHP", "Application métier"]
cover: "../../assets/projects/opticalpro-dashboard.png"
coverAlt: "Tableau de bord d’OpticalPro"
related: ["opticalpro"]
---

**OpticalPro** est une application métier que j’ai conçue et développée bénévolement pour une boutique d’optique dont le réseau s’agrandit : un cockpit qui réunit clients, dossiers lunettes et lentilles, prises en charge des mutuelles, facturation, paiements et commandes verriers. Elle tourne sur le réseau local de la boutique.

Ce projet n’avait rien d’un exercice : il fallait reprendre des années d’historique, manipuler des données de santé et s’intégrer dans les habitudes d’une équipe. Voici ce que j’en retiens.

## 1. Compléter l’outil existant, pas le remplacer

La boutique utilise Cosium au quotidien. OpticalPro ne cherche pas à le remplacer : il transforme les informations existantes en **priorités de travail claires** - dossiers à facturer, urgences, prochaine action à lancer.

## 2. Une migration doit pouvoir être rejouée

L’historique tenait notamment dans une fiche de suivi colorée de 32 pages. Je l’ai convertie en **SQL transactionnel et idempotent** : la migration peut être relancée sans créer de doublons. Résultat : 1 317 clients, 2 293 dossiers et 6 879 paiements structurés proprement.

## 3. Lire les documents, même quand ce sont des images

Certains exports Cosium étaient de simples images. Les pages PDF sont converties avec **Poppler**, puis lues par **Tesseract OCR** en français - localement. Surtout, chaque champ reconnu est **prévisualisé avant toute écriture** : l’opticien garde la main.

## 4. La confidentialité se décide dans l’architecture

Rôles utilisateurs, protection CSRF, requêtes PDO préparées, documents stockés hors de l’espace public et numéros de Sécurité sociale chiffrés en **AES-256-GCM** : la sécurité n’a pas été ajoutée à la fin, elle a dicté la structure.

## 5. Automatiser, oui - décider, non

Les relances et e-mails sont préparés automatiquement, mais **envoyés après contrôle**. L’assistant local se limite à la recherche, au résumé et à la préparation d’actions. Une erreur sur un dossier de mutuelle a des conséquences réelles : l’humain valide.

> Chaque dossier. La bonne action. Au bon moment.

Pour le détail des écrans et des choix techniques, voir [la fiche OpticalPro](/projets/opticalpro).
