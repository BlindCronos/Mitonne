# Mitonne

Batch cooking de la semaine selon les promotions Migros, Coop, Denner, Aldi et Lidl : choix des plats, liste de courses, session minutée, frigo, congélateur et rappels de décongélation.

Site statique publié avec GitHub Pages. Les prix sont lus dans `data/actions.json`, mis à jour chaque jeudi par une tâche planifiée. Les réglages et la semaine restent dans le navigateur de chaque personne.

## Tests

Avant chaque publication sur `main` :

```
node tests/check.js
node tests/ui.js
```

Le premier vérifie les recettes, les promotions et le calcul des semaines. Le second parcourt l'application dans un navigateur au format téléphone (il demande Playwright). Les règles du projet sont dans `CLAUDE.md`, le journal des changements dans `AMELIORATIONS.md`.
