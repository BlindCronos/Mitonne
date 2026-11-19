# Bilan de Mitonne et suite du projet

Bilan du 19 novembre 2026, après les chantiers 0 à 6 et 10. Les tâches à faire sont détaillées dans `CHANTIERS.md`, et ce qui a changé pour l'utilisateur dans `AMELIORATIONS.md`.

## En bref

La phase 1 est terminée : Mitonne est une app simple, jolie, testée et prête pour de premiers testeurs. Il ne manque que le lien du formulaire d'avis (chantier 6 bis). Le prochain cap est la **version publique** : des prix en direct de tous les magasins, des produits de saison et des propositions adaptées au canton de chacun. Elle demande un vrai serveur de données, ce que GitHub Pages ne peut pas offrir.

## Ce qui a été fait le 19 novembre

| Chantier | Résultat |
|---|---|
| 0. Nouvelle identité « Étiquette » | Noir et blanc, jaune d'étiquette, rouge pour les promos, 2 polices au lieu de 4, zones à toucher de 44 px, nouveau logo et nouvelle icône. |
| 1. Écran « Plats » | La semaine est proposée d'emblée, « Échanger » pour chaque plat, filtres repliés sous « Envie de… ». 2 touches pour valider une semaine. |
| 2. Écrans allégés | Sections repliables partout. Chaque écran tient en 2 écrans de téléphone (Actions : 14 808 px → 1 636 px). |
| 3 et 4. Recettes | De 63 à 120 recettes, dont 72 « Fit », 8 desserts et en-cas, beaucoup de recettes virales. Jamais deux plats de même protéine et même cuisine dans une semaine. |
| 5. « % pour toi » | Score et raisons pour chaque plat. L'app apprend des avis après le repas et des plats échangés ou ajoutés. |
| 6. Version pour testeurs | Écran d'accueil, page « À propos », bouton « Donner mon avis » prêt. |
| 10. Prix du panier | Total estimé et prix par portion avant d'aller au magasin. Plus de mention de rappn. |

## L'état actuel en chiffres

| Mesure | Valeur |
|---|---|
| Recettes | 120 (34 volaille, 29 bœuf, porc ou agneau, 17 poisson, 40 végétariennes dont 8 desserts et en-cas) |
| Recettes « Fit » | 72 |
| Ingrédients | 122, dont 104 achetés (avec un prix habituel estimé) et 18 au placard (huile, épices, bouillon…) |
| Promotions de la semaine | 142, dont 99 reliées à un ingrédient. 42 des 95 ingrédients achetés ont au moins une promo cette semaine. |
| Exemple de panier (3 plats, 2 personnes) | env. 80 CHF, dont 26 CHF économisés, soit env. 5 CHF par portion |
| Code | `index.html` : 3 032 lignes, 262 Ko (71 Ko compressé), sans bibliothèque |
| Tests | 9 083 vérifications logiques, et un parcours complet dans un navigateur, en clair et en sombre |
| Vitesse | Proposer une semaine : 2 ms. Afficher un écran : moins de 2 ms. |

## Évaluation

### Points forts
- **Utile dès la première semaine** : courses, session minutée, frigo et congélateur, décongélation, agenda, prix du panier. Peu d'apps couvrent tout ce parcours.
- **Simple** : 2 touches pour une semaine, des écrans courts, du texte clair en français.
- **Respect de la vie privée** : pas de compte, pas de serveur, pas de traceur. C'est un vrai argument face aux concurrents.
- **Solide** : chaque recette est testée seule et dans une semaine type. Les règles de sécurité alimentaire sont vérifiées automatiquement (poisson 2 jours, riz cuit le jour même).
- **Coût nul** : GitHub Pages et une tâche planifiée Claude par semaine.

### Limites et risques

| Sujet | Constat | Importance |
|---|---|---|
| Prix | Seules les actions sont relevées, une fois par semaine, et pour le canton de Vaud. Les autres prix sont mes estimations. | Élevée pour la version publique |
| Source unique | Une seule tâche planifiée relève les prix. Si elle échoue ou si un site change, les prix vieillissent sans alerte. | Élevée |
| Clés manquantes | 7 ingrédients récents (cottage cheese, risoni, viande hachée de poulet, flocons d'avoine, fruits rouges, cacao, banane) sont inconnus de la tâche du jeudi : leurs promos ne sont pas reliées. | Moyenne, se corrige en 5 minutes |
| Données personnelles | Le dépôt est public : `data/actions.json` cite encore rappn.ch dans ses sources (l'app le masque). | Faible |
| Code | Un seul fichier de 3 000 lignes. Il reste lisible, mais chaque ajout devient plus risqué. | Moyenne, à traiter avant la version publique (chantier 7) |
| Écran Courses | Encore 3,5 écrans de haut. | Faible |
| Version Claude | Le bouton « Ajouter à mon agenda » ne marche pas dans l'artefact (téléchargement non permis). | Faible |
| Nutrition | Valeurs moyennes estimées, sans contrôle par un professionnel. | Moyenne si l'app devient publique |
| Juridique | Relever des sites marchands peut être limité par leurs conditions d'utilisation et par la loi contre la concurrence déloyale (reprise du travail d'autrui). | Élevée pour la version publique : à faire vérifier |

### Potentiel d'amélioration, du plus rentable au plus long
1. **Tout de suite (moins d'une heure)** : coller le lien du formulaire (6 bis), ajouter les 7 clés à la tâche du jeudi, retirer rappn des sources dans cette tâche.
2. **Saisons (chantier 12)** : favoriser les fruits et légumes de saison en Suisse. Fait sans serveur, gros effet sur le goût et le prix.
3. **Mon canton (chantier 13)** : choisir son canton, voir les magasins de sa région et ses spécialités. La première partie se fait sans serveur.
4. **Écran Courses repliable par magasin** : petite amélioration, prévue dans les idées en attente.
5. **Restructurer le code et tester à chaque envoi (chantier 7)** : indispensable avant d'ouvrir l'app au public.
6. **Version publique avec prix en direct (chantiers 8 et 11)** : le plus gros chantier, détaillé ci-dessous.
7. **Comptes et synchronisation (chantier 9)** : seulement si les testeurs le demandent.

## Proposition pour la version publique : prix en direct, saisons et cantons

### Ce que verra le client
- Au premier lancement, il choisit son **canton**. Mitonne en déduit ses magasins proches, les prix de sa région (les actions Migros varient d'une coopérative régionale à l'autre) et les spécialités locales.
- Chaque prix affiché est un **vrai prix du moment**, en action ou non, avec l'heure du relevé (« mis à jour il y a 20 min »). Les estimations disparaissent.
- Les plats proposés privilégient les **produits de saison** (« de saison » sur la carte, raison « carottes et poireaux de saison » dans « % pour toi »).
- Le panier compare les magasins : « ce panier coûte env. 78 CHF chez Coop, 72 CHF chez Migros, 69 CHF en combinant Migros et Aldi ».

### L'architecture proposée

```
 Relevé automatique (toutes les 1 à 4 h)        Base de prix                    Site public
 ┌──────────────────────────────┐        ┌───────────────────────┐        ┌────────────────────┐
 │ un robot par magasin :       │ ─────▶ │ produits, prix,       │ ─────▶ │ fichiers de prix   │
 │ Migros (par coopérative),    │        │ historique, magasins, │ publie │ par canton, servis │
 │ Coop, Denner, Aldi, Lidl     │        │ correspondance        │        │ par un CDN         │
 │ contrôle de cohérence        │        │ ingrédient ↔ produits │        │ (prix-VD.json…)    │
 └──────────────────────────────┘        └───────────────────────┘        └─────────┬──────────┘
                                                                                    │ l'app relit les
                                                                                    ▼ prix à l'ouverture
                                                                          Mitonne (téléphone)
```

1. **Relevé** : une petite tâche par magasin, lancée automatiquement (Cloudflare Workers avec déclencheur planifié, ou GitHub Actions). Les actions sont relevées toutes les 1 à 4 heures, les prix habituels une fois par jour. Une tâche qui échoue garde les derniers prix connus et envoie une alerte.
2. **Base de prix** : une base SQLite hébergée (Cloudflare D1 ou Supabase), avec les tables magasins, régions, produits, prix (avec historique) et correspondance ingrédient ↔ produits.
3. **Correspondance ingrédient ↔ produits** : c'est le cœur du travail. Pour chaque ingrédient (« pâtes », « blancs de poulet »), on garde les produits courants de chaque magasin, avec leur prix au kilo. Des règles automatiques font le premier tri (rayon, mots-clés, prix au kilo plausible). Claude peut proposer des correspondances par lots, et une personne les valide. Le « prix habituel » d'un ingrédient devient le produit courant le moins cher de la gamme standard.
4. **Publication** : après chaque relevé, la base produit un fichier de prix par canton, publié sur le CDN. L'app le lit à l'ouverture et toutes les heures. Il n'y a toujours ni compte ni traceur : le téléphone télécharge seulement le fichier de son canton.
5. **Contrôles** : un prix qui varie de plus de 50 % d'un relevé à l'autre, une promo sans date ou un prix au kilo absurde sont mis de côté. La règle actuelle reste : aucun prix inventé.

### Saisons
- Un calendrier mensuel des fruits et légumes suisses (environ 60 produits : récolte locale, stockage, importé), tenu dans l'app. Il ne demande pas de relevé en direct, car les saisons changent peu d'une année à l'autre.
- Il donne un bonus de score aux recettes dont les légumes sont de saison, un malus aux tomates ou courgettes en plein hiver, un badge « de saison » et une raison dans « % pour toi ».
- Les écarts régionaux sont faibles (plaine ou montagne) : un seul calendrier suisse suffit au début.

### Cantons et régions
- Le canton est un nouveau réglage, demandé au questionnaire.
- Il sert à quatre choses :
  - les prix Migros de la bonne coopérative ;
  - les magasins proposés par défaut, selon ceux présents dans la région ;
  - les spécialités locales mises en avant (papet vaudois dans le canton de Vaud, raclette en Valais, fondue moitié-moitié à Fribourg, risotto au Tessin…) ;
  - la langue plus tard (allemand pour la Suisse alémanique, italien pour le Tessin).
- Tant que les prix en direct n'existent pas, l'app dit clairement : « prix relevés pour le canton de Vaud ».

### Points à régler avant de commencer
- **Juridique** : lire les conditions d'utilisation de chaque magasin. Demander si possible un accès officiel (programme partenaires, flux de données). Sinon, relever lentement, en respectant le fichier robots.txt, et faire valider la démarche par un juriste : la loi contre la concurrence déloyale protège le travail des autres.
- **Données personnelles** : une déclaration de confidentialité, même sans compte (loi suisse sur la protection des données).
- **Coût** : les offres gratuites de Cloudflare (Workers, D1, R2) couvrent largement le début, plus env. 15 CHF par an pour le nom de domaine.
- **Maintenance** : les sites des magasins changent. Il faut prévoir une alerte et un peu de temps chaque mois pour réparer un robot.

### Ordre conseillé
1. Chantier 12 (saisons) et chantier 13 (canton) : sans serveur, utiles dès maintenant.
2. Chantier 7 (code restructuré, tests à chaque envoi), puis chantier 8 (hébergement et nom de domaine).
3. Chantier 11 : d'abord un seul magasin et un seul canton, pour valider la chaîne relevé → base → site, puis les autres magasins et les prix par canton.
4. Chantier 9 (comptes) seulement si les testeurs le demandent.

## Prochaines tâches

| Ordre | Tâche | Qui | Effort |
|---|---|---|---|
| 1 | Créer le formulaire Google et envoyer son lien (chantier 6 bis) | Diogo, puis Claude | 10 min |
| 2 | Ajouter les 7 clés d'ingrédients et retirer rappn des sources dans la tâche du jeudi | Claude, avec l'accord de Diogo | 5 min |
| 3 | Inviter 5 à 10 testeurs avec l'adresse du site | Diogo | 1 semaine de test |
| 4 | Chantier 12 : fruits et légumes de saison | Claude | 1 session |
| 5 | Chantier 13 : mon canton | Claude | 1 session |
| 6 | Écran Courses repliable par magasin (idée en attente) | Tâche du mardi | petite |
| 7 | Chantier 7 : restructurer le code, tests automatiques sur GitHub | Claude | 1 à 2 sessions |
| 8 | Chantiers 8 puis 11 : hébergement, prix en direct | Diogo (comptes) et Claude | plusieurs sessions |
