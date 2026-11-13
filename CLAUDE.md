# Mitonne : règles du projet

Mitonne est l'application de batch cooking de Diogo : choix des plats selon les promotions Migros, Coop, Denner, Aldi et Lidl, liste de courses, session de cuisine minutée, frigo, congélateur et décongélation. Elle est gratuite, à usage personnel, sans compte ni serveur.

## Comment le site est fait
- `index.html` : toute l'application (HTML, CSS et JavaScript dans un seul fichier, sans étape de build). Publiée telle quelle par GitHub Pages depuis la branche `main` : https://blindcronos.github.io/Mitonne/
- `sw.js` et `manifest.webmanifest` : application installable (PWA). Le cache s'appelle `mitonne-vN`.
- `data/actions.json` : les promotions. **Ce fichier appartient à la tâche planifiée « Mitonne : relevé des actions et site » : ne le modifie jamais à la main ni dans une autre tâche.**
- `icons/` : icônes de l'application.
- `tests/check.js` : tests logiques, sans dépendance (`node tests/check.js`).
- `tests/ui.js` : test dans un navigateur au format téléphone, en clair et en sombre (`node tests/ui.js [dossier-captures]`, ignoré si Playwright manque).
- `tools/build-artifact.py` : fabrique la version Claude (artefact) à partir d'`index.html`.
- `AMELIORATIONS.md` : journal des améliorations et idées en attente.

## Règles à respecter
- **Tests obligatoires** : `node tests/check.js` doit réussir, et `node tests/ui.js` aussi quand Playwright est disponible, avant tout envoi sur `main`. Ne publie jamais un site qui échoue aux tests. Quand tu ajoutes une fonctionnalité, ajoute ou adapte les tests qui la couvrent.
- **Service worker** : à chaque changement d'`index.html`, incrémente le numéro du cache dans `sw.js` (`mitonne-v3` → `mitonne-v4`…).
- **Sauvegardes des utilisateurs** : les réglages et la semaine sont dans le navigateur (clé `mitonne-state`, ancienne clé `popote-state`). Garde `snapshot()` et `apply()` compatibles avec les anciennes sauvegardes : un champ nouveau a une valeur par défaut, un champ supprimé est ignoré sans erreur.
- **Deux versions du même fichier** : `index.html` tourne sur GitHub Pages (`WEB` vrai) et dans Claude (artefact, `window.claude.use` présent, base de données `actions`, bouton « Actualiser les promotions » qui lance la tâche `TRIGGER`). Ne casse aucune des deux.
- **Tests dans Node** : garde l'export `module.exports = {...}` en fin de script, utilisé par `tests/check.js`.
- **Ressources externes** : seulement Google Fonts. Pas de bibliothèque ni de service payant, pas de traceur, pas de publicité.
- **Données personnelles** : le dépôt est public. Aucune donnée personnelle de Diogo (adresse, e-mail, santé, habitudes) dans le code, les tests ou le journal.
- **Langue** : interface en français, tutoiement, phrases simples. Prix en CHF.
- **Recettes** : format `BATCH` (ingrédients pour 4 portions, étapes `[actif, passif, équipement, texte, dépendances]`), chaque ingrédient présent dans `ING` et `NUT`. Valeurs nutritionnelles moyennes et honnêtes, marquées comme estimations. Sécurité alimentaire : poisson et fruits de mer 2 jours au frigo au plus, riz cuit le jour même sauf exception justifiée.
- **Commits** : auteur `Claude <noreply@anthropic.com>`, messages en français, envoi direct sur `main` (c'est la branche publiée).
