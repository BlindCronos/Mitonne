# Chantiers de Mitonne

Un chantier = une session Claude Code. Chaque chantier est prévu pour tenir dans une session et laisser le site publié, testé et utilisable à la fin.

**Pour lancer un chantier :** dans Claude Code, ouvre une nouvelle session avec l'environnement **Mitonne** (le dépôt `BlindCronos/Mitonne` s'ajoute tout seul) et écris simplement :
- « Chantier 3 » pour un chantier précis ;
- « Prochain chantier » pour le premier chantier « à faire » dont les prérequis sont remplis.

Claude lit alors `CLAUDE.md` (règles et méthode), ce fichier et `AMELIORATIONS.md`, fait le chantier, publie et met à jour son statut ici.

Statuts possibles : **à faire**, **fait (AAAA-MM-JJ, commit)**, **en attente** (un prérequis manque).

---

## Phase 1 : une app simple et agréable, prête pour des testeurs

### Chantier 0 : nouvelle identité visuelle « Étiquette »
- **Statut :** fait (2026-11-19, bea695e)
- **Prérequis :** aucun
- **Pourquoi :** audit du design du 2026-11-19 : 4 polices, 4 styles de boutons, 9 arrondis différents, l'orange utilisé partout, du texte à 13 px et des cases à cocher de 22 px. Diogo a choisi, parmi 3 maquettes, la mise en page « Étiquette » avec la typographie « Prune ».
- **Contenu :** noir et blanc francs, jaune d'étiquette pour ce qui compte (économies, prochaine étape, prix), rouge réservé aux promotions ; Outfit pour les titres et les chiffres, Plus Jakarta Sans pour le texte ; angles de 2 à 6 px, filets noirs de 2 px entre les sections ; zones à toucher de 44 px au moins, cases à cocher de 28 px ; en sombre, le jaune devient la couleur d'action. Nouveau logo (« MITONNE » sur étiquette jaune), nouvelle icône, onglet « Batch » renommé « Cuisine ». Aucun changement de fonctionnement : les chantiers 1 et 2 simplifient ensuite les écrans dans ce style.

### Chantier 1 : écran « Plats », la semaine proposée d'emblée
- **Statut :** fait (2026-11-19, 0e90650)
- **Fait :** la semaine est proposée dès l'ouverture de l'étape « Plats » (plats numérotés 01, 02, 03, avec le nombre de repas de chacun), un bouton « Échanger » par plat, « Autre proposition » pour tout refaire, les filtres et le nombre de plats repliés derrière « Envie de… » (changer d'envie remplace les plats qui ne vont plus), le détail au toucher, et la liste complète derrière « Ajouter un plat à la main ». 2 touches entre « Choisir mes plats » et une semaine validée ; l'écran tient en un seul écran de téléphone.
- **Prérequis :** aucun
- **Pourquoi :** l'audit du 2026-11-13 (format téléphone, 390 px) compte 9 touches entre le premier lancement et une semaine prête. L'écran de choix des plats fait 4,7 écrans de haut et 542 mots ; les filtres occupent tout le premier écran et aucun plat n'est visible sans défiler. Les concurrents vont plus vite : Miamz échange un repas « en un clic », Jow et Mealime proposent la semaine directement.
- **Contenu :**
  - À l'ouverture de l'étape « Plats », la semaine est déjà proposée (3 à 4 plats choisis par `autoPick`), avec un bouton « Échanger » par plat qui propose le meilleur plat suivant.
  - Les filtres (catégories, protéines) sont repliés derrière un seul bouton « Envie de… ».
  - Cartes courtes : nom, puis une ligne « kcal · protéines · minutes · action en cours ». Le détail (ingrédients, macros complètes, badge Fit) s'ouvre au toucher.
  - On peut toujours ajouter un plat à la main depuis la liste complète.
- **Terminé quand :**
  - le premier plat proposé est visible sans défiler, sur téléphone ;
  - 4 touches au plus entre l'ouverture de l'assistant et une semaine validée (hors questionnaire du premier lancement) ;
  - `tests/ui.js` couvre « Échanger » et « Envie de… » ; les anciennes sauvegardes s'ouvrent sans erreur ; la version Claude fonctionne.

### Chantier 2 : écrans « Semaine », « Batch », « Actions » et « Réglages » allégés
- **Statut :** fait (2026-11-19, 32aa3fc)
- **Fait :** sections repliables partout (l'état choisi est gardé pendant la visite). Semaine : un jour par section, seul le jour en cours est ouvert, les autres résument leurs repas ; agenda, copie et conservation regroupés. Cuisine (batch) : bouton du mode cuisine en haut, plats et étiquettes repliés, pas à pas limité à l'étape en cours et aux 2 suivantes, étapes faites et suivantes derrière un bouton. Actions : une section par magasin (tes magasins d'abord, le premier ouvert), les 10 meilleures actions puis « Tout voir », filtre de rayon sur une ligne. Réglages : Mon foyer, Mes goûts, Courses, Cuisine, Données et promotions. Hauteur à l'ouverture (400 × 860) : Semaine 1630 px, Cuisine 1597, Actions 1636, Réglages 860 (avant : 2710, 4339, 14808, 4760). `tests/ui.js` vérifie la limite de 2 écrans et l'ouverture d'une section sur chaque onglet (sauf Courses, hors chantier).
- **Prérequis :** chantier 1 fait
- **Pourquoi :** audit du 2026-11-13 : Semaine 3,6 écrans (619 mots), Batch 5,8 écrans (917 mots), Actions 16 écrans (1841 mots), Réglages 5,9 écrans (104 réglages visibles).
- **Contenu :**
  - Semaine et Batch : étapes repliables, seule l'étape en cours est ouverte.
  - Actions : les 10 meilleures actions par enseigne, puis « Tout voir ».
  - Réglages : regroupés en sections repliables (Mon foyer, Mes goûts, Courses, Cuisine, Données).
- **Terminé quand :** chaque écran tient en 2 écrans de haut au plus à l'ouverture, aucune fonctionnalité n'a disparu, tests verts.

### Chantier 3 : recettes, lot 1 (63 → environ 90)
- **Statut :** fait (2026-11-19, 91c158f)
- **Fait :** 27 recettes virales des réseaux en version fit et batch (bouchées de saumon, crevettes bang bang, feta pasta, dense bean salad, pâtes au cottage cheese, bowl bœuf patate douce et miel pimenté, Big Mac bowl, soupe lasagne, poulet marry me, egg roll in a bowl…). 90 recettes, dont 53 « Fit » ; 12 au poisson, 25 végétariennes, 12 soupes, 15 bowls. Nouveaux ingrédients : `cottage`, `risoni`, `poulet_hache` (à ajouter à la liste de clés de la tâche du jeudi pour leurs promotions).
- **Prérequis :** aucun
- **Pourquoi :** les applications de batch cooking annoncent de 250 (Batchii) à plus de 500 recettes (Basta), et leurs avis se plaignent de répétitions. Mitonne vise environ 120 recettes, toutes vraiment adaptées au batch.
- **Contenu :** environ 27 recettes au format `BATCH`, en priorité dans les catégories les moins fournies (compter avec `CATS` et `protOf` avant de commencer) : végétarien, poisson, soupes, express, mijotés. Chaque ingrédient dans `ING` et `NUT`, valeurs nutritionnelles moyennes et honnêtes, règles de sécurité alimentaire de `CLAUDE.md`.
- **Terminé quand :** `tests/check.js` passe (le seuil minimal de recettes est relevé à 85), chaque nouvelle recette se planifie seule et dans une semaine type.

### Chantier 4 : recettes, lot 2 (environ 90 → environ 120) et variété
- **Statut :** fait (2026-11-19, d0eee1b)
- **Fait :** 120 recettes, dont 72 « Fit ». 22 plats (curry vert de crevettes, tacos de poisson, pad thaï léger, poulet teriyaki à la plaque, bœuf coréen, boulettes suédoises, porc au caramel, bœuf brocoli, moussaka aux courgettes, butter tofu, quiche sans pâte au cottage, gnocchi au four…) et 8 desserts et en-cas (`ds:1` : flan protéiné, cheesecake de nuit, overnight oats, baked oats, mousse au chocolat au skyr, muffins aux œufs, boules d’énergie, écorce glacée au skyr). Un en-cas ne prend jamais de repas : 2 portions par personne, préparé pendant la session, dans la liste de courses ; section facultative « Un dessert ou un en-cas ? » sur l’écran Plats. Variété : `pickOK` a 3 niveaux, et le niveau intermédiaire interdit deux plats de même protéine et de même cuisine avant toute autre concession. Nouveaux ingrédients : `flocons_avoine`, `fruits_rouges`, `cacao`, `banane`.
- **Prérequis :** chantier 3 fait
- **Contenu :** environ 30 recettes de plus, dont des desserts et en-cas fit préparés pendant la session (flans protéinés, cheesecake de nuit…). Renforcer la variété : `baseScore` pénalise déjà les plats des semaines précédentes (`hist`) ; ajouter une pénalité quand deux plats de la même semaine se ressemblent trop (même protéine et même cuisine).
- **Terminé quand :** tests verts, seuil relevé à 115 recettes, une semaine type ne propose jamais deux plats de même protéine et même cuisine quand une alternative existe.

### Chantier 5 : score de compatibilité « % pour toi »
- **Statut :** fait (2026-11-19, ea2cf8e)
- **Fait :** « 92 % pour toi » sur chaque plat de l'écran Plats, avec la promo et 1 ou 2 raisons courtes (`reasons`). Le score part de `baseScore` et ajoute `affinity` : une note apprise par plat (`prefs.taste`, entre -3 et 3) et, plus faiblement, celle des plats proches (même protéine, même cuisine, même ingrédient principal). Signaux : 👍 +1 et 👎 -1,5 après le repas (onglet Semaine, un avis par plat et par semaine, `week.votes`), Échanger -0,3, ajouter à la main +0,3, plat gardé dans une semaine validée +0,15 (jusqu'à 1). Liste et semaine proposée triées par score. Nouveaux champs `prefs.taste` et `week.votes`, vides par défaut ; anciennes sauvegardes testées.
- **Prérequis :** chantier 1 fait
- **Pourquoi :** pousser chacun vers les plats qu'il aimera le plus. Jow recommande selon les goûts et l'équipement, Yummly apprend des avis explicites et du comportement, Plaite apprend des balayages.
- **Contenu :**
  - Un score sur 100 par plat, affiché « 92 % pour toi », avec 1 ou 2 raisons courtes (« en action chez Coop », « tu aimes l'asiatique », « riche en protéines, comme ton objectif »).
  - Il part de `baseScore` (objectif, cuisines aimées, favoris, piquant, promotions, historique) et ajoute l'apprentissage : 👍/👎 après le repas, plat échangé (signal négatif léger), plat gardé ou ajouté à la main (signal positif léger).
  - Tout reste dans le navigateur : pas de serveur, pas de traceur. Nouveau champ dans `snapshot()`/`apply()` avec une valeur par défaut.
  - Le pourcentage est un indice de préférence, pas une promesse : le dire simplement dans l'app.
- **Terminé quand :** les plats sont triés par score, les raisons ne sont jamais vides, un 👎 fait baisser le plat et les plats proches, les tests couvrent le calcul et l'ancienne sauvegarde.

### Chantier 6 : version pour testeurs
- **Statut :** fait (2026-11-19, 3138ec7)
- **Prérequis :** chantiers 1 et 2 faits ; Diogo a choisi le moyen de recevoir les avis des testeurs.
- **Contenu :** accueil du premier lancement pensé pour quelqu'un qui ne connaît pas Mitonne, page « À propos » (ce que fait l'app, d'où viennent les prix, valeurs nutritionnelles estimées), bouton « Donner mon avis ».
- **Terminé quand :** une personne qui découvre l'app prépare sa première semaine sans aide (à tester avec `tests/ui.js` en partant d'un navigateur vide).
- **Fait :** écran d’accueil au premier lancement (ce que fait Mitonne en 3 étapes, « Commencer », « À propos »), page « À propos » (ce que fait l’app, d’où viennent les prix, calories estimées, « % pour toi », conservation, données), accessible aussi depuis Réglages, et bouton « Donner mon avis » vers un formulaire Google (`FEEDBACK_URL`), affiché dans À propos, Réglages et Semaine dès que le lien est renseigné. Texte corrigé : les promotions sont relevées chaque jeudi matin (et non lundi, jeudi et vendredi). `tests/ui.js` part d’un navigateur vide : accueil, À propos, questionnaire, choix des plats, semaine validée.

### Chantier 6 bis : lien du formulaire d’avis
- **Statut :** en attente
- **Prérequis :** Diogo a créé le formulaire Google Forms (questions proposées dans la session du 2026-11-19, sans collecte d’adresse e-mail) et donne son lien.
- **Contenu :** renseigner `FEEDBACK_URL` dans `index.html` (lien `https://forms.gle/…` ou `https://docs.google.com/forms/…`), incrémenter le cache, tester, publier. Le bouton « Donner mon avis » apparaît alors tout seul.

### Chantier 10 : prix du panier estimé
- **Statut :** fait (2026-11-19, dde52fd)
- **Pourquoi :** Diogo veut que la personne connaisse le prix de son panier avant d’aller au magasin, pas seulement ses économies.
- **Fait :** prix habituel estimé pour chaque ingrédient acheté (`PRICE` : paquet courant et prix moyen des grandes surfaces suisses), arrondi au paquet entier ; les produits en action gardent leur prix relevé. Total estimé et prix par portion dans Courses et Semaine, prix du panier dès l’écran Plats, total dans la liste copiée, prix estimé sur chaque article sans action. Un ingrédient secondaire n’est pris en action que s’il coûte moins que son paquet habituel. Les sources n’affichent plus rappn.

### Chantier 11 : promotions et prix en direct
- **Statut :** en attente
- **Prérequis :** chantier 8 fait (hébergement) ; Diogo a choisi le service qui fera tourner le relevé (par exemple GitHub Actions ou une tâche planifiée Cloudflare) ; conditions d’utilisation des sites relevés vérifiées.
- **Pourquoi :** Diogo veut que tout soit affiché en direct : les actions publiées par les enseignes doivent arriver dans l’app sans intervention, aussitôt relevées.
- **Architecture proposée :** voir « Proposition pour la version publique » dans `EVALUATION.md` (un robot par magasin, base de prix avec historique et correspondance ingrédient ↔ produits, fichiers de prix par canton servis par un CDN, contrôles de cohérence).
- **Contenu :** relevé automatique et fréquent des actions (et, si possible, des prix habituels pour remplacer les estimations de `PRICE`), contrôle de cohérence avant publication, publication automatique de `data/actions.json` sur le site, date et heure du dernier relevé affichées dans l’app. Garder la règle d’exactitude de la tâche actuelle : aucun prix inventé.
- **Attention :** ce chantier remplace ou modifie la tâche planifiée « Mitonne : relevé des actions et site ». Préparer pour Diogo le nouveau texte de ses instructions, ou la désactiver une fois le relevé automatique en place.


### Chantier 12 : fruits et légumes de saison
- **Statut :** à faire
- **Prérequis :** aucun
- **Pourquoi :** des plats meilleurs et moins chers, et une demande de Diogo pour la version publique (voir `EVALUATION.md`).
- **Contenu :** un calendrier mensuel des fruits et légumes suisses (récolte locale, stockage ou importé) pour chaque ingrédient du rayon « fl » ; bonus de score pour les recettes de saison, malus pour les légumes hors saison (tomates, courgettes, poivrons en hiver) ; badge « de saison » dans le détail du plat et raison « de saison » dans « % pour toi ». Pas de nouveau champ dans la sauvegarde.
- **Terminé quand :** en novembre, une semaine type propose surtout des légumes de saison quand une alternative existe ; les tests couvrent le calendrier (chaque ingrédient « fl » a ses 12 mois) et le score.

### Chantier 13 : mon canton
- **Statut :** à faire
- **Prérequis :** chantier 12 conseillé
- **Pourquoi :** Diogo veut que le client choisisse son canton, pour des propositions et des prix de sa région.
- **Contenu :** question « Ton canton » dans le questionnaire et les Réglages (nouveau champ `prefs.canton`, vide par défaut) ; magasins proposés par défaut selon la région ; recettes régionales (spécialités de Suisse romande, alémanique et italienne) mises en avant avec la raison « spécialité de ta région » ; mention claire « prix relevés pour le canton de Vaud » tant que le chantier 11 n'existe pas. Prévoir le champ pour les prix par canton.
- **Terminé quand :** les anciennes sauvegardes s'ouvrent avec un canton vide, les tests couvrent le choix du canton et ses effets sur les propositions.

---

## Phase 2 : passage en version pro (après les retours des testeurs)

### Chantier 7 : restructurer le code
- **Statut :** en attente
- **Prérequis :** phase 1 faite et décision de Diogo de passer en version pro.
- **Contenu :** séparer `index.html` (environ 2 250 lignes) en fichiers (styles, logique, recettes en fichiers de données), ajouter une étape de construction simple, faire tourner les tests automatiquement à chaque envoi (GitHub Actions). Mettre à jour `CLAUDE.md`, `tools/build-artifact.py` et les tests.
- **Attention :** les deux tâches planifiées citent `index.html`, `data/actions.json` et `tools/build-artifact.py`. Si un chemin change, préparer pour Diogo le nouveau texte de leurs instructions : il doit le coller lui-même dans claude.ai/code.

### Chantier 8 : hébergement commercial et nom de domaine
- **Statut :** en attente
- **Prérequis :** Diogo a créé un compte Cloudflare et acheté le nom de domaine.
- **Contenu :** publication sur Cloudflare Pages avec le domaine, redirection depuis l'ancienne adresse GitHub Pages, contrôle que l'app installée (PWA) et les sauvegardes suivent.

### Chantier 9 : comptes et synchronisation
- **Statut :** en attente
- **Prérequis :** chantier 8 fait, service choisi avec Diogo, déclaration de confidentialité prête.
- **Contenu :** compte facultatif pour retrouver sa semaine sur téléphone et ordinateur, et partager la liste de courses. Sans compte, l'app continue de fonctionner comme aujourd'hui.
