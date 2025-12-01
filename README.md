
# Portfolio statique v4 — Jan Jawish (JJ)

## Ce qui change
- **Logo** en haut à gauche (`assets/img/logo.png`), **navbar centrée** sur toutes les pages (sans aperçu d'URL au survol).
- **Accueil** : “Jan Jawish” pile au milieu ; la **Sélection rapide** reste cachée tant qu’on n’a pas scrollé (révélation douce).
- **Barre de scroll masquée** (site et fenêtres).
- **Boutons** convertis en `<button>` → pas d’aperçu d’URL en bas à gauche.
- **Projets** : ouverture/fermeture **animées** façon fenêtre macOS ; clic sur la carte **ou** le bouton “Ouvrir”.
- **Création graphique** : **carousel** intégré dans la fenêtre (flèches sobres).
- **Photographie** : **fenêtre plein écran** avec **grande galerie** scrollable (images encadrées). Scrollbar masquée.
- **À propos** : 
  - fenêtre “Qui suis‑je ?” : **cartes de compétences** avec pictos, bio seule en texte ; **pastille rouge** ferme la fenêtre ; bouton **En savoir plus** la **ré‑ouvre** (animations).
  - fenêtre “Passions” : livres / artistes / films / centres d’intérêt sous forme de **cartes cliquables** → **fenêtre de détail** avec animation.
- **Back‑to‑top** conservé sur `/projets.html`.

## Contenu à éditer
- **Images du carousel** de création graphique : dans `assets/js/projects.js`, propriétés `gallery:[...]`.
- **Photos** : `photos:[...]` pour le projet `photographie` + `PHOTOS` pour l’aperçu sur la page Projets.
- **Passions** (livres, artistes, films, centres d’intérêt) : `assets/js/about.js` (TABLEAUX en haut du fichier).

## Déploiement
Copiez tous les fichiers sur GitHub Pages ou OVH/IONOS.
