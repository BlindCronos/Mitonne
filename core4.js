
(function(){
'use strict';

var STORES={migros:'Migros',coop:'Coop',denner:'Denner',aldi:'Aldi',lidl:'Lidl'};
var ORDER=['migros','coop','denner','aldi','lidl'];
var RAYONS={fl:'Fruits et légumes',vi:'Viande et charcuterie',po:'Poisson',fr:'Frais',ep:'Épicerie',pl:'Placard'};
var RORDER=['fl','vi','po','fr','ep'];
var TABS=['semaine','courses','batch','actions','reglages'];
var CUIS={ch:'Suisse et montagne',fr:'Française',it:'Italienne',as:'Asiatique',in:'Indienne',me:'Méditerranée et Orient',am:'Américaine et mexicaine'};
var CUSHORT={ch:'Suisse',fr:'Française',it:'Italienne',as:'Asiatique',in:'Indienne',me:'Méditerranéenne',am:'Américaine'};
var CORDER=['ch','fr','it','as','in','me','am'];
var NO={viande:'m',porc:'p',boeuf:'b',agneau:'a',poisson:'f',fruitsmer:'s',champignons:'g',epinards:'e',chou:'h',courge:'c',poivrons:'o',tomates:'T',fromage:'Q',legumineuses:'R',olives:'V',coco:'X',poireaux:'L',gingembre:'G',patatedouce:'D'};
var ALG=[['gluten','Gluten','w'],['lactose','Lactose','l'],['lait','Protéines de lait','l'],['oeufs','Œufs','u'],['poisson','Poisson','f'],['fruitsmer','Crustacés et mollusques','s'],['soja','Soja','y'],['moutarde','Moutarde','d'],['celeri','Céleri','k'],['noix','Fruits à coque','n']];
var SUBST={gluten:{pates:'sans gluten',bouillon:'sans gluten',sauce_soja:'tamari sans gluten',pain:'sans gluten',nouilles:'de riz',lasagne:'sans gluten',tortillas:'de maïs',pain_burger:'sans gluten',farine:'sans gluten',chapelure:'sans gluten'},celeri:{bouillon:'sans céleri'}};
var NO_L=[['viande','Viande'],['porc','Porc'],['boeuf','Bœuf'],['agneau','Agneau'],['poisson','Poisson'],['fruitsmer','Fruits de mer'],['champignons','Champignons'],['epinards','Épinards'],['chou','Chou'],['courge','Courge'],['poivrons','Poivrons'],['tomates','Tomates'],['fromage','Fromage'],['legumineuses','Lentilles, pois chiches, haricots'],['olives','Olives'],['coco','Lait de coco'],['poireaux','Poireaux'],['gingembre','Gingembre'],['patatedouce','Patate douce']];
var DIETS=[['tout','Je mange de tout',''],['flexi','Peu de viande','Un seul plat avec viande ou poisson par semaine'],['sanspork','Sans porc',''],['pesce','Pas de viande, mais du poisson',''],['vege','Végétarien','Ni viande ni poisson']];
var SPICE=[[0,'Doux'],[1,'Un peu relevé'],[2,'J’aime le piquant']];
var PRIO=[['eco','Dépenser le moins possible','Les plus gros rabais et les plats économiques passent en premier'],['var','Me faire plaisir','Tes cuisines préférées passent en premier, les actions ensuite']];
var WD=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
var PRESETS=[['soirs','Tous les soirs'],['tout','Midis et soirs'],['semaine','Lun–ven, midi et soir'],['weekend','Soirs + midis du week-end']];
var HABITS=[['fri','17:30','Vendredi soir'],['sat','09:30','Samedi matin'],['sat','14:00','Samedi après-midi']];
var THAWH=['19:00','20:00','21:00'];
var MEALH=['12:00','19:00'];
var BURNERS=4;
var QN=6;
var COLORS=['var(--c1)','var(--c2)','var(--c3)','var(--c4)','var(--c5)'];
var HEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-7.5-4.6-7.5-10.4A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 2.7c0 5.8-7.5 10.4-7.5 10.4z"/></svg>';

/* Ingrédients : clé, nom, rayon, drapeaux (m viande, b bœuf, p porc, a agneau, f poisson, s fruits de mer,
   g champignons, e épinards, h chou, c courge, o poivrons), unité (g par défaut), poids d'une pièce, nom de la pièce. */
var ING={};
[
 ['poulet_blanc','Blancs de poulet','vi','m'],['poulet_cuisse','Cuisses de poulet','vi','m'],
 ['boeuf_hache','Viande hachée de bœuf','vi','mb'],['boeuf_steak','Steaks de bœuf','vi','mb'],['boeuf_ragout','Ragoût de bœuf','vi','mb'],
 ['porc_cotelette','Côtelettes ou steaks de porc','vi','mp'],['porc_filet','Filet mignon de porc','vi','mp'],['porc_roti','Rôti de porc','vi','mp'],
 ['porc_fume','Jambon roulé ou palette fumée','vi','mp'],['saucisse','Saucisses à rôtir','vi','mp'],['saucisson','Saucisson vaudois','vi','mp'],
 ['lardons','Lardons','vi','mp'],['jambon','Jambon cuit','vi','mp'],['cordon_bleu','Cordons-bleus','vi','mplwQ'],['agneau','Filet d’agneau','vi','ma'],
 ['saumon_frais','Pavés de saumon','po','f'],['saumon_fume','Saumon fumé','po','f'],['poisson_blanc','Filets de poisson blanc','po','f'],
 ['poisson_pane','Poisson pané','po','fw'],['moules','Moules','po','fs'],['crevettes','Crevettes','po','fs'],['thon_boite','Thon en boîte','ep','f'],
 ['pommes_de_terre','Pommes de terre','fl'],['patate_douce','Patates douces','fl','D'],['carottes','Carottes','fl'],['oignons','Oignons','fl'],
 ['ail','Ail','fl','','pc',5,'gousse'],['gingembre','Gingembre frais','fl','G','pc',30,'morceau'],['poireaux','Poireaux','fl','L'],['courge','Courge','fl','c'],
 ['chou_blanc','Chou blanc','fl','h'],['chou_chinois','Chou chinois ou pak-choï','fl','h'],['chou_fleur','Chou-fleur','fl','h'],['brocoli','Brocoli','fl'],
 ['epinards','Épinards','fl','e'],['champignons','Champignons','fl','g'],['poivrons','Poivrons','fl','o'],['tomates','Tomates','fl','T'],
 ['salade','Salade ou rampon','fl'],['avocat','Avocat','fl','','pc',200],['citron','Citron','fl','','pc',100],['persil','Persil','fl','','pc',30,'bouquet'],
 ['oeufs','Œufs','fr','u','pc',60],['creme','Crème','fr','l','ml'],['lait','Lait','fr','l','ml'],['yogourt','Yogourt nature','fr','l'],['sere','Séré nature','fr','l'],
 ['beurre','Beurre','fr','l'],['fromage_rape','Gruyère ou emmental','fr','lQ'],['raclette','Fromage à raclette','fr','lQ'],['mozzarella','Mozzarella','fr','lQ'],['feta','Feta','fr','lQ'],
 ['parmesan','Parmesan ou Grana Padano','fr','lQ'],['pate_gateau','Pâte à gâteau abaissée','fr','lw','pc',270,'rouleau'],['pate_pizza','Pâte à pizza abaissée','fr','w','pc',320,'rouleau'],
 ['gnocchi','Gnocchi','fr','w'],['pates_farcies','Tortelloni ricotta-épinards','fr','lwuQ'],
 ['pates','Pâtes','ep','w'],['lasagne','Feuilles de lasagne','ep','w'],['nouilles','Nouilles chinoises','ep','w'],['riz','Riz','ep'],['riz_risotto','Riz à risotto','ep'],
 ['semoule','Semoule de couscous','ep','w'],['polenta','Polenta','ep'],['lentilles_vertes','Lentilles vertes','ep','R'],['lentilles_corail','Lentilles corail','ep','R'],
 ['pois_chiches','Pois chiches en boîte','ep','R'],['haricots_rouges','Haricots rouges en boîte','ep','R'],['haricots_blancs','Haricots blancs en boîte','ep','R'],
 ['mais','Maïs doux','ep'],['tomates_concassees','Tomates concassées','ep','T'],['concentre_tomate','Concentré de tomate','ep','T'],['lait_coco','Lait de coco','ep','X','ml'],
 ['pesto','Pesto','ep','lnQ'],['tortillas','Tortillas de blé','ep','w','pc',40],['pain','Pain','ep','w'],['pain_burger','Pains à burger','ep','w','pc',60,'pain'],
 ['compote_pommes','Compote de pommes','ep'],['cornichons','Cornichons','ep'],['olives','Olives','ep','V'],['petits_pois','Petits pois surgelés','ep'],
 ['vin_blanc','Vin blanc sec','ep','','ml'],
 ['huile','Huile','pl'],['huile_olive','Huile d’olive','pl'],['moutarde','Moutarde','pl','d'],['bouillon','Bouillon','pl','wk'],['farine','Farine','pl','w'],
 ['chapelure','Chapelure','pl','w'],['miel','Miel','pl'],['curry','Curry en poudre','pl'],['paprika','Paprika','pl'],['cumin','Cumin','pl'],
 ['piment','Piment séché','pl'],['sauce_soja','Sauce soja','pl','wy'],['vinaigre','Vinaigre','pl'],['origan','Origan','pl'],['thym','Thym','pl'],['muscade','Muscade','pl']
].forEach(function(a){ING[a[0]]={n:a[1],r:a[2],f:a[3]||'',u:a[4]||'g',w:a[5]||0,pl:a[6]||''};});

/* Recettes de batch cooking, pour 4 portions.
   ing : cuisiné pendant la session. jour : préparé au moment du repas (féculents, salade, pain).
   fr : jours au frigo après la session (0 = le jour même). co : se congèle.
   st : étapes [travail actif en min, cuisson sans surveillance en min, matériel ('' rien, 'f' une plaque, 'o200' le four à 200 °C), texte, étapes attendues].
   Sans liste d'étapes attendues, une étape attend la précédente ; [] veut dire qu'elle peut démarrer tout de suite. */
var BATCH=[
{id:'bolognaise',n:'Sauce bolognaise',sv:'avec des spaghetti',tg:'it eco',main:['boeuf_hache'],fr:3,co:1,
 ing:[['boeuf_hache',500],['oignons',150],['carottes',150],['ail',2],['tomates_concassees',800],['concentre_tomate',30],['origan',0],['huile_olive',0]],
 jour:[['pates',400],['parmesan',60]],
 j:'Réchauffe la sauce 10 minutes à feu doux. Cuis les pâtes al dente et sers avec le fromage râpé.',
 st:[[10,0,'','Hache l’oignon, l’ail et la carotte en petits dés.'],
  [8,0,'f','Dans une grande casserole, fais revenir les légumes 5 minutes dans l’huile d’olive, puis ajoute la viande et fais-la dorer en l’émiettant.'],
  [2,35,'f','Ajoute le concentré, les tomates, l’origan, du sel et du poivre. Laisse mijoter 35 minutes à couvert, à feu doux.']]},
{id:'chili',n:'Chili con carne',sv:'avec du riz',tg:'am sp1 eco',main:['boeuf_hache'],fr:3,co:1,
 ing:[['boeuf_hache',500],['haricots_rouges',500],['mais',285],['tomates_concassees',800],['oignons',150],['ail',2],['cumin',0],['paprika',0],['huile',0]],
 jour:[['riz',300]],
 j:'Réchauffe le chili 10 minutes à la casserole ou 3 minutes au micro-ondes. Cuis le riz (15 minutes).',
 st:[[8,0,'','Hache l’oignon et l’ail. Égoutte et rince les haricots et le maïs.'],
  [8,0,'f','Fais revenir l’oignon et l’ail dans l’huile, ajoute la viande et fais-la dorer avec 2 cuillères à café de cumin et autant de paprika.'],
  [2,30,'f','Ajoute les tomates, les haricots et le maïs. Laisse mijoter 30 minutes à feu doux.']]},
{id:'chili-sin-carne',n:'Chili sin carne aux haricots',sv:'avec du riz',tg:'am sp1 eco',main:['haricots_rouges'],fr:3,co:1,
 ing:[['haricots_rouges',750],['mais',285],['tomates_concassees',800],['oignons',200],['carottes',200],['ail',2],['cumin',0],['paprika',0],['huile',0]],
 jour:[['riz',300]],
 j:'Réchauffe le chili 10 minutes à la casserole ou 3 minutes au micro-ondes. Cuis le riz (15 minutes).',
 st:[[10,0,'','Hache l’oignon et l’ail, coupe les carottes en petits dés. Égoutte et rince les haricots et le maïs.'],
  [8,0,'f','Fais revenir l’oignon, l’ail et les carottes 8 minutes dans l’huile avec 2 cuillères à café de cumin et de paprika.'],
  [2,25,'f','Ajoute les tomates, les haricots et le maïs. Laisse mijoter 25 minutes.']]},
{id:'curry-poulet',n:'Curry de poulet au lait de coco',sv:'avec du riz',tg:'in sp1',main:['poulet_blanc'],fr:3,co:1,
 ing:[['poulet_blanc',600],['lait_coco',400],['carottes',250],['oignons',150],['ail',2],['gingembre',1],['epinards',150],['curry',0],['huile',0]],
 jour:[['riz',300]],
 j:'Réchauffe le curry à feu doux jusqu’à ce qu’il soit bien chaud. Cuis le riz (15 minutes).',
 st:[[10,0,'','Coupe le poulet en dés. Hache l’oignon, l’ail et le gingembre, coupe les carottes en fines rondelles.'],
  [7,0,'f','Fais revenir l’oignon, l’ail et le gingembre avec 2 cuillères à soupe de curry, puis ajoute le poulet et fais-le dorer 5 minutes.'],
  [2,15,'f','Ajoute les carottes et le lait de coco. Laisse mijoter 15 minutes à couvert.'],
  [2,0,'f','Incorpore les épinards, laisse-les tomber 2 minutes et sale.']]},
{id:'dahl',n:'Dahl de lentilles corail',sv:'avec du riz',tg:'in sp1 eco',main:['lentilles_corail'],fr:3,co:1,
 ing:[['lentilles_corail',350],['lait_coco',400],['tomates_concassees',400],['oignons',150],['ail',2],['gingembre',1],['epinards',150],['curry',0],['huile',0]],
 jour:[['riz',300]],
 j:'Réchauffe avec un peu d’eau, le dahl épaissit au frigo. Cuis le riz (15 minutes).',
 st:[[6,0,'','Hache l’oignon, l’ail et le gingembre. Rince les lentilles.'],
  [4,0,'f','Fais revenir l’oignon, l’ail et le gingembre avec 2 cuillères à soupe de curry dans l’huile.'],
  [2,18,'f','Ajoute les lentilles, les tomates, le lait de coco et 4 dl d’eau. Laisse mijoter 18 minutes en remuant de temps en temps.'],
  [2,0,'f','Incorpore les épinards et sale.']]},
{id:'curry-pois-chiches',n:'Curry de pois chiches et épinards',sv:'avec du riz',tg:'in sp1 eco',main:['pois_chiches'],fr:3,co:1,
 ing:[['pois_chiches',750],['epinards',300],['tomates_concassees',800],['lait_coco',200],['oignons',150],['ail',2],['curry',0],['huile',0]],
 jour:[['riz',300]],
 j:'Réchauffe à feu doux. Cuis le riz (15 minutes).',
 st:[[5,0,'','Hache l’oignon et l’ail. Égoutte et rince les pois chiches.'],
  [4,0,'f','Fais revenir l’oignon et l’ail avec 2 cuillères à soupe de curry dans l’huile.'],
  [2,15,'f','Ajoute les tomates, le lait de coco et les pois chiches. Laisse mijoter 15 minutes.'],
  [2,0,'f','Ajoute les épinards, laisse-les tomber 2 minutes et sale.']]},
{id:'curry-poisson',n:'Curry de poisson blanc au lait de coco',sv:'avec du riz',tg:'in sp1',main:['poisson_blanc'],fr:2,co:1,
 ing:[['poisson_blanc',600],['lait_coco',400],['tomates_concassees',400],['oignons',150],['ail',2],['gingembre',1],['epinards',150],['curry',0],['huile',0]],
 jour:[['riz',300]],
 j:'Réchauffe doucement, sans faire bouillir. Cuis le riz (15 minutes).',
 st:[[6,0,'','Hache l’oignon, l’ail et le gingembre. Coupe le poisson en gros morceaux.'],
  [4,0,'f','Fais revenir l’oignon, l’ail et le gingembre avec 2 cuillères à soupe de curry.'],
  [2,8,'f','Ajoute les tomates et le lait de coco, laisse mijoter 8 minutes.'],
  [2,5,'f','Ajoute le poisson et les épinards, cuis 5 minutes à feu doux sans trop remuer.']]},
{id:'goulache',n:'Goulache de bœuf au paprika',sv:'avec des nouilles au beurre',tg:'ch sp1',main:['boeuf_ragout'],fr:3,co:1,
 ing:[['boeuf_ragout',800],['oignons',500],['carottes',200],['ail',2],['concentre_tomate',40],['paprika',0],['cumin',0],['bouillon',0],['huile',0]],
 jour:[['pates',400],['beurre',20]],
 j:'Réchauffe la goulache 10 minutes à feu doux. Cuis les nouilles et mélange-les au beurre.',
 st:[[10,0,'','Émince les oignons, hache l’ail, coupe les carottes en rondelles.'],
  [12,0,'f','Dans une cocotte, fais dorer la viande en deux fois dans l’huile, puis réserve-la.'],
  [6,0,'f','Fais fondre les oignons dans la cocotte, ajoute 2 cuillères à soupe de paprika, une pincée de cumin, l’ail et le concentré.'],
  [2,90,'f','Remets la viande, ajoute les carottes et 5 dl de bouillon. Laisse mijoter 1 h 30 à couvert, à feu très doux.']]},
{id:'boeuf-carottes',n:'Bœuf mijoté aux carottes',sv:'avec des pommes de terre',tg:'fr',main:['boeuf_ragout'],fr:3,co:1,
 ing:[['boeuf_ragout',800],['carottes',600],['oignons',200],['ail',2],['concentre_tomate',30],['farine',0],['bouillon',0],['thym',0],['huile',0]],
 jour:[['pommes_de_terre',800]],
 j:'Réchauffe 10 minutes à feu doux. Cuis les pommes de terre à l’eau ou à la vapeur (20 minutes).',
 st:[[10,0,'','Coupe les carottes en rondelles, émince les oignons, hache l’ail.'],
  [12,0,'f','Dans une cocotte, fais dorer la viande en deux fois dans l’huile, puis réserve-la.'],
  [4,0,'f','Fais revenir les oignons, ajoute le concentré et 1 cuillère à soupe de farine, remue 1 minute.'],
  [2,120,'f','Remets la viande, ajoute les carottes, l’ail, le thym et 6 dl de bouillon. Laisse mijoter 2 heures à couvert, à feu très doux.']]},
{id:'lasagnes',n:'Lasagnes à la bolognaise',sv:'avec une salade',tg:'it ov',main:['boeuf_hache'],fr:3,co:1,
 ing:[['boeuf_hache',500],['lasagne',250],['tomates_concassees',800],['oignons',150],['carottes',150],['lait',600],['beurre',50],['fromage_rape',120],['farine',0],['muscade',0],['huile_olive',0]],
 jour:[['salade',150]],
 j:'Réchauffe une part 3 minutes au micro-ondes ou 20 minutes au four à 180 °C. Sers avec la salade.',
 st:[[8,0,'','Hache l’oignon et la carotte.'],
  [8,0,'f','Fais revenir l’oignon et la carotte dans l’huile d’olive, ajoute la viande et fais-la dorer.'],
  [2,20,'f','Ajoute les tomates, sale, poivre et laisse mijoter 20 minutes.'],
  [8,0,'f','Béchamel : fais fondre le beurre, ajoute 50 g de farine, puis le lait peu à peu en fouettant. Laisse épaissir 5 minutes, sale et ajoute la muscade.',[0]],
  [10,0,'','Dans un grand plat, alterne sauce à la viande, feuilles de lasagne et béchamel. Termine par la béchamel et le fromage râpé.',[2,3]],
  [1,40,'o190','Enfourne les lasagnes 40 minutes à 190 °C.']]},
{id:'hachis-parmentier',n:'Hachis parmentier',sv:'avec une salade',tg:'fr ov',main:['boeuf_hache'],fr:3,co:1,
 ing:[['boeuf_hache',500],['pommes_de_terre',1200],['oignons',150],['carottes',150],['lait',250],['beurre',50],['fromage_rape',100],['concentre_tomate',30],['bouillon',0]],
 jour:[['salade',150]],
 j:'Réchauffe une part 3 minutes au micro-ondes ou 20 minutes au four à 180 °C. Sers avec la salade.',
 st:[[12,0,'','Épluche les pommes de terre et coupe-les en morceaux. Hache l’oignon et la carotte.'],
  [2,20,'f','Cuis les pommes de terre 20 minutes à l’eau salée.'],
  [8,0,'f','Fais revenir l’oignon et la carotte, ajoute la viande et fais-la dorer. Ajoute le concentré et 1 dl de bouillon, laisse réduire 5 minutes.',[0]],
  [6,0,'','Égoutte les pommes de terre et écrase-les avec le lait chaud et le beurre.',[1]],
  [5,0,'','Étale la viande dans un plat, couvre de purée et de fromage râpé.',[2,3]],
  [1,25,'o200','Gratine le hachis 25 minutes à 200 °C.']]},
{id:'boulettes-tomate',n:'Boulettes de bœuf à la sauce tomate',sv:'avec de la semoule',tg:'me',main:['boeuf_hache'],fr:3,co:1,
 ing:[['boeuf_hache',600],['oeufs',1],['oignons',150],['ail',2],['persil',1],['tomates_concassees',800],['cumin',0],['paprika',0],['chapelure',0],['huile_olive',0]],
 jour:[['semoule',300]],
 j:'Réchauffe 10 minutes à feu doux. Verse de l’eau bouillante salée sur la semoule, couvre 5 minutes et égrène-la.',
 st:[[15,0,'','Mélange la viande avec l’œuf, la moitié de l’oignon râpé, le persil haché, 3 cuillères à soupe de chapelure, du cumin, du sel et du poivre. Forme des boulettes.'],
  [10,0,'f','Dore les boulettes 5 minutes dans l’huile d’olive, puis réserve-les.'],
  [3,0,'f','Fais revenir le reste de l’oignon et l’ail, ajoute les tomates et le paprika.'],
  [1,15,'f','Remets les boulettes et laisse mijoter 15 minutes.']]},
{id:'poulet-basquaise',n:'Poulet basquaise',sv:'avec du riz',tg:'fr',main:['poulet_cuisse'],fr:3,co:1,
 ing:[['poulet_cuisse',1000],['poivrons',400],['tomates_concassees',400],['oignons',200],['ail',3],['paprika',0],['thym',0],['huile_olive',0]],
 jour:[['riz',300]],
 j:'Réchauffe 10 minutes à couvert. Cuis le riz (15 minutes).',
 st:[[8,0,'','Coupe les oignons et les poivrons en lanières, hache l’ail.'],
  [10,0,'f','Dore les cuisses salées dans l’huile d’olive, 5 minutes de chaque côté, puis réserve-les.'],
  [8,0,'f','Fais revenir les oignons et les poivrons, ajoute l’ail et 1 cuillère à café de paprika.'],
  [2,35,'f','Ajoute les tomates et le thym, remets le poulet et laisse mijoter 35 minutes à couvert.']]},
{id:'tajine-poulet',n:'Tajine de poulet au citron et aux olives',sv:'avec de la semoule',tg:'me',main:['poulet_cuisse'],fr:3,co:1,
 ing:[['poulet_cuisse',1000],['oignons',300],['carottes',300],['citron',2],['olives',100],['ail',3],['cumin',0],['bouillon',0],['huile_olive',0]],
 jour:[['semoule',300]],
 j:'Réchauffe 10 minutes à couvert. Verse de l’eau bouillante salée sur la semoule, couvre 5 minutes et égrène-la.',
 st:[[10,0,'','Émince les oignons, coupe les carottes en tronçons et un citron en quartiers, hache l’ail.'],
  [10,0,'f','Dore les cuisses dans l’huile d’olive, puis réserve-les.'],
  [8,0,'f','Fais fondre les oignons avec l’ail et 2 cuillères à café de cumin.'],
  [2,35,'f','Remets le poulet, ajoute les carottes, le citron, les olives et 3 dl de bouillon. Laisse mijoter 35 minutes à couvert, puis arrose du jus du second citron.']]},
{id:'poulet-tandoori',n:'Poulet tandoori au four',sv:'avec du riz et une salade',tg:'in sp1 ov',main:['poulet_cuisse'],fr:3,co:1,
 ing:[['poulet_cuisse',1000],['yogourt',180],['citron',1],['ail',2],['gingembre',1],['curry',0],['paprika',0]],
 jour:[['riz',300],['salade',150]],
 j:'Réchauffe 3 minutes au micro-ondes ou 15 minutes au four. Cuis le riz (15 minutes) et sers avec la salade.',
 st:[[10,0,'','Mélange le yogourt avec le jus du citron, l’ail et le gingembre râpés, 2 cuillères à soupe de curry, 1 de paprika et du sel. Entaille les cuisses et enrobe-les de marinade.'],
  [1,20,'','Laisse mariner le poulet 20 minutes au frigo.'],
  [2,40,'o220','Enfourne le poulet 40 minutes à 220 °C.']]},
{id:'poulet-creme',n:'Émincé de poulet à la crème et aux champignons',sv:'avec du riz',tg:'fr',main:['poulet_blanc'],fr:3,co:1,
 ing:[['poulet_blanc',600],['champignons',300],['oignons',100],['creme',250],['bouillon',0],['huile',0]],
 jour:[['riz',300]],
 j:'Réchauffe à feu doux, avec un peu d’eau si la sauce a épaissi. Cuis le riz (15 minutes).',
 st:[[8,0,'','Coupe le poulet en lanières, émince les champignons et l’oignon.'],
  [6,0,'f','Saisis le poulet 5 minutes à feu vif dans l’huile, puis réserve-le.'],
  [5,0,'f','Fais revenir l’oignon et les champignons 5 minutes.'],
  [2,6,'f','Ajoute 1 dl de bouillon et la crème, laisse réduire 5 minutes, puis remets le poulet.']]},
{id:'poulet-soja-miel',n:'Poulet caramélisé soja-miel et chou sauté',sv:'avec du riz',tg:'as',main:['poulet_blanc'],fr:3,co:0,
 ing:[['poulet_blanc',600],['chou_chinois',500],['carottes',300],['ail',2],['gingembre',1],['sauce_soja',0],['miel',0],['huile',0]],
 jour:[['riz',300]],
 j:'Réchauffe 3 minutes à la poêle ou au micro-ondes. Cuis le riz (15 minutes).',
 st:[[10,0,'','Coupe le poulet en dés, le chou en rubans, râpe les carottes, l’ail et le gingembre. Mélange 5 cuillères à soupe de sauce soja et 2 de miel.'],
  [8,0,'f','Saisis le poulet 5 minutes dans l’huile, verse la sauce et laisse caraméliser 2 minutes. Réserve-le.'],
  [5,0,'f','Fais sauter le chou, les carottes, l’ail et le gingembre 4 minutes, puis mélange avec le poulet.']]},
{id:'cuisses-four',n:'Cuisses de poulet rôties et légumes du four',sv:'',tg:'fr ov eco',main:['poulet_cuisse'],fr:3,co:0,
 ing:[['poulet_cuisse',1000],['pommes_de_terre',900],['carottes',500],['oignons',200],['ail',3],['paprika',0],['thym',0],['huile',0]],
 jour:[],
 j:'Réchauffe 15 minutes au four à 180 °C ou 3 minutes au micro-ondes.',
 st:[[12,0,'','Coupe les pommes de terre en quartiers, les carottes en tronçons et les oignons en quartiers.'],
  [4,0,'','Mélange les légumes sur une plaque avec l’ail, de l’huile, du sel et du thym. Frotte les cuisses d’huile, de paprika et de sel, et pose-les sur les légumes.'],
  [1,45,'o200','Enfourne la plaque 45 minutes à 200 °C, en remuant les légumes à mi-cuisson.']]},
{id:'soupe-legumes',n:'Soupe de légumes maison',sv:'avec du pain et du fromage',tg:'ch eco',main:['poireaux','carottes'],fr:3,co:1,
 ing:[['poireaux',400],['carottes',400],['pommes_de_terre',500],['oignons',150],['creme',100],['bouillon',0]],
 jour:[['pain',300],['fromage_rape',150]],
 j:'Réchauffe la soupe et sers-la avec le pain et le fromage.',
 st:[[15,0,'','Coupe les poireaux en rondelles, les carottes, les pommes de terre et l’oignon en dés.'],
  [3,0,'f','Fais suer les légumes 3 minutes dans une grande casserole avec un peu d’eau.'],
  [1,25,'f','Couvre de 1,5 l de bouillon et laisse cuire 25 minutes.'],
  [4,0,'','Mixe la soupe et ajoute la crème.']]},
{id:'soupe-lentilles',n:'Soupe de lentilles corail et carottes au cumin',sv:'avec du pain',tg:'me eco',main:['lentilles_corail'],fr:3,co:1,
 ing:[['lentilles_corail',300],['carottes',400],['oignons',150],['ail',2],['tomates_concassees',400],['citron',1],['cumin',0],['bouillon',0],['huile_olive',0]],
 jour:[['pain',300]],
 j:'Réchauffe la soupe avec un peu d’eau et sers-la avec le pain.',
 st:[[8,0,'','Hache l’oignon et l’ail, coupe les carottes en dés, rince les lentilles.'],
  [5,0,'f','Fais revenir l’oignon, l’ail et les carottes dans l’huile d’olive avec 2 cuillères à café de cumin.'],
  [1,20,'f','Ajoute les lentilles, les tomates et 1,2 l de bouillon. Laisse cuire 20 minutes.'],
  [4,0,'','Mixe, ajoute le jus du citron et rectifie le sel.']]},
{id:'minestrone',n:'Minestrone aux haricots blancs',sv:'avec du parmesan',tg:'it eco',main:['haricots_blancs'],fr:3,co:1,
 ing:[['carottes',300],['poireaux',300],['pommes_de_terre',400],['tomates_concassees',400],['haricots_blancs',500],['ail',2],['bouillon',0],['huile_olive',0]],
 jour:[['pates',120],['parmesan',60]],
 j:'Réchauffe la soupe, ajoute une poignée de petites pâtes et cuis 8 à 10 minutes. Sers avec le parmesan.',
 st:[[15,0,'','Coupe les carottes, le poireau et les pommes de terre en petits dés, hache l’ail, égoutte les haricots.'],
  [4,0,'f','Fais revenir l’ail, les carottes et le poireau dans l’huile d’olive.'],
  [1,25,'f','Ajoute les pommes de terre, les tomates, les haricots et 1,5 l de bouillon. Laisse cuire 25 minutes.']]},
{id:'veloute-courge',n:'Velouté de courge',sv:'avec des tartines au fromage',tg:'fr eco',main:['courge'],fr:3,co:1,
 ing:[['courge',1200],['pommes_de_terre',300],['oignons',150],['creme',150],['bouillon',0]],
 jour:[['pain',300],['fromage_rape',150]],
 j:'Réchauffe le velouté. Couvre des tranches de pain de fromage et passe-les 5 minutes à la poêle couverte ou sous le gril.',
 st:[[15,0,'','Épluche la courge et coupe-la en cubes avec les pommes de terre. Hache l’oignon.'],
  [3,0,'f','Fais suer l’oignon, ajoute la courge et les pommes de terre.'],
  [1,20,'f','Couvre de 1 l de bouillon et laisse cuire 20 minutes.'],
  [4,0,'','Mixe le velouté et ajoute la crème.']]},
{id:'couscous-legumes',n:'Couscous de légumes et pois chiches',sv:'avec de la semoule',tg:'me eco',main:['pois_chiches'],fr:3,co:1,
 ing:[['pois_chiches',500],['carottes',400],['courge',500],['oignons',150],['tomates_concassees',400],['ail',2],['cumin',0],['paprika',0],['bouillon',0],['huile_olive',0]],
 jour:[['semoule',300]],
 j:'Réchauffe les légumes et leur bouillon. Verse de l’eau bouillante salée sur la semoule, couvre 5 minutes et égrène-la.',
 st:[[15,0,'','Coupe les carottes en tronçons, la courge en cubes, hache l’oignon et l’ail, égoutte les pois chiches.'],
  [4,0,'f','Fais revenir l’oignon et l’ail dans l’huile d’olive avec 2 cuillères à café de cumin et 1 de paprika.'],
  [1,25,'f','Ajoute les carottes, la courge, les tomates et 8 dl de bouillon. Laisse mijoter 25 minutes.'],
  [1,5,'f','Ajoute les pois chiches et poursuis 5 minutes.']]},
{id:'saucisses-lentilles',n:'Saucisses aux lentilles',sv:'',tg:'fr eco',main:['saucisse'],fr:3,co:1,
 ing:[['saucisse',500],['lentilles_vertes',400],['carottes',300],['oignons',150],['ail',2],['bouillon',0],['moutarde',0],['huile',0]],
 jour:[],
 j:'Réchauffe 10 minutes à feu doux, avec un peu d’eau.',
 st:[[8,0,'','Hache l’oignon et l’ail, coupe les carottes en dés, rince les lentilles.'],
  [4,0,'f','Fais revenir l’oignon, l’ail et les carottes dans l’huile.'],
  [1,30,'f','Ajoute les lentilles et 1 l de bouillon. Laisse cuire 30 minutes à couvert.'],
  [2,10,'f','Dore les saucisses à la poêle 10 minutes en les retournant.',[0]],
  [2,0,'','Assaisonne les lentilles avec 1 cuillère à soupe de moutarde et ajoute les saucisses coupées en tronçons.',[2,3]]]},
{id:'gratin-cornettes',n:'Gratin de cornettes au jambon',sv:'avec une salade',tg:'ch ov eco',main:['jambon'],fr:3,co:1,
 ing:[['jambon',250],['pates',500],['creme',250],['lait',150],['oeufs',2],['fromage_rape',180],['muscade',0]],
 jour:[['salade',150]],
 j:'Réchauffe une part 3 minutes au micro-ondes ou 15 minutes au four. Sers avec la salade.',
 st:[[2,10,'f','Cuis les cornettes 2 minutes de moins qu’indiqué sur le paquet.'],
  [6,0,'','Coupe le jambon en lanières. Bats la crème, le lait, les œufs, du poivre et de la muscade.',[]],
  [5,0,'','Égoutte les cornettes, mélange-les avec le jambon dans un plat, verse la crème et couvre de fromage râpé.',[0,1]],
  [1,25,'o200','Gratine les cornettes 25 minutes à 200 °C.']]},
{id:'quiche-lardons',n:'Quiche aux lardons',sv:'avec une salade',tg:'fr ov',main:['lardons'],fr:3,co:1,
 ing:[['lardons',250],['pate_gateau',1],['oeufs',3],['creme',200],['lait',100],['fromage_rape',100],['muscade',0]],
 jour:[['salade',150]],
 j:'Réchauffe une part 10 minutes au four ou 2 minutes au micro-ondes, ou mange-la froide. Sers avec la salade.',
 st:[[3,0,'','Fonce un moule avec la pâte et pique le fond à la fourchette.'],
  [4,0,'f','Fais dorer les lardons à sec et répartis-les sur la pâte avec le fromage râpé.'],
  [3,0,'','Bats les œufs avec la crème, le lait, du poivre et de la muscade, puis verse sur la garniture.'],
  [1,35,'o200','Enfourne la quiche 35 minutes dans le bas du four à 200 °C.']]},
{id:'tarte-poireaux',n:'Tarte aux poireaux',sv:'avec une salade',tg:'fr ov',main:['poireaux'],fr:3,co:1,
 ing:[['poireaux',600],['pate_gateau',1],['oeufs',3],['creme',200],['fromage_rape',120],['beurre',20],['muscade',0]],
 jour:[['salade',150]],
 j:'Réchauffe une part 10 minutes au four ou 2 minutes au micro-ondes. Sers avec la salade.',
 st:[[8,0,'','Émince les poireaux. Fonce un moule avec la pâte et pique le fond.'],
  [2,10,'f','Fais fondre les poireaux 10 minutes dans le beurre.'],
  [4,0,'','Répartis les poireaux et le fromage sur la pâte. Bats les œufs avec la crème, du sel, du poivre et de la muscade, puis verse.'],
  [1,35,'o200','Enfourne la tarte 35 minutes dans le bas du four à 200 °C.']]},
{id:'papet-vaudois',n:'Papet vaudois',sv:'',tg:'ch',main:['saucisson'],fr:3,co:0,
 ing:[['saucisson',400],['poireaux',1000],['pommes_de_terre',600],['oignons',100],['creme',100],['beurre',20],['bouillon',0]],
 jour:[],
 j:'Réchauffe 10 minutes à feu doux, à couvert, avec un peu d’eau.',
 st:[[12,0,'','Coupe les poireaux en tronçons, les pommes de terre en dés et hache l’oignon.'],
  [5,0,'f','Fais suer l’oignon et les poireaux 5 minutes dans le beurre.'],
  [2,45,'f','Ajoute les pommes de terre et 2 dl de bouillon, pose le saucisson entier sans le piquer. Couvre et cuis 45 minutes à feu doux.'],
  [3,0,'','Ajoute la crème et écrase légèrement les légumes. Coupe le saucisson en tranches.']]},
{id:'potee-chou',n:'Potée au chou blanc et au lard',sv:'',tg:'ch eco',main:['chou_blanc','lardons'],fr:3,co:0,
 ing:[['chou_blanc',800],['lardons',200],['pommes_de_terre',800],['carottes',300],['oignons',150],['bouillon',0],['thym',0]],
 jour:[],
 j:'Réchauffe 10 minutes à couvert, avec un peu de bouillon.',
 st:[[12,0,'','Coupe le chou en lanières, les carottes en tronçons, les pommes de terre en gros morceaux, hache l’oignon.'],
  [5,0,'f','Fais revenir les lardons et l’oignon dans une grande cocotte.'],
  [1,30,'f','Ajoute le chou, les carottes, le thym et 1 l de bouillon. Laisse mijoter 30 minutes à couvert.'],
  [1,20,'f','Ajoute les pommes de terre et poursuis 20 minutes.']]},
{id:'roti-porc',n:'Rôti de porc à la moutarde, carottes et oignons',sv:'avec des pommes de terre',tg:'fr ov',main:['porc_roti'],fr:3,co:1,
 ing:[['porc_roti',900],['carottes',500],['oignons',300],['ail',4],['moutarde',0],['bouillon',0],['huile',0]],
 jour:[['pommes_de_terre',800]],
 j:'Réchauffe les tranches dans leur jus 5 minutes à feu doux. Cuis les pommes de terre à l’eau ou à la vapeur (20 minutes).',
 st:[[8,0,'','Coupe les carottes en tronçons et les oignons en quartiers. Badigeonne le rôti de moutarde, sale et poivre.'],
  [8,0,'f','Saisis le rôti sur toutes ses faces dans une cocotte qui va au four.'],
  [2,70,'o180','Ajoute les légumes, l’ail et 2 dl de bouillon autour de la viande. Enfourne 1 h 10 à 180 °C.'],
  [5,10,'','Laisse reposer la viande 10 minutes, puis tranche-la.']]},
{id:'jambon-chou',n:'Jambon roulé et chou braisé',sv:'avec des pommes de terre',tg:'ch',main:['porc_fume'],fr:3,co:1,
 ing:[['porc_fume',900],['chou_blanc',800],['oignons',150],['beurre',20],['bouillon',0]],
 jour:[['pommes_de_terre',800],['moutarde',0]],
 j:'Réchauffe le chou et les tranches de jambon 10 minutes à couvert. Cuis les pommes de terre (20 minutes).',
 st:[[2,60,'f','Plonge le jambon roulé dans une grande casserole d’eau froide, porte à frémissement et laisse cuire 1 heure sans bouillir.'],
  [8,0,'','Émince le chou et l’oignon.',[]],
  [4,0,'f','Fais suer l’oignon dans le beurre et ajoute le chou.',[1]],
  [1,30,'f','Ajoute 2 dl de bouillon et laisse braiser 30 minutes à couvert.'],
  [4,0,'','Égoutte le jambon et coupe-le en tranches.',[0]]]},
{id:'macaronis-chalet',n:'Macaronis du chalet',sv:'avec de la compote de pommes',tg:'ch eco',main:['pates','fromage_rape'],fr:3,co:0,
 ing:[['pates',400],['pommes_de_terre',500],['creme',300],['fromage_rape',250],['oignons',300],['beurre',30]],
 jour:[['compote_pommes',400]],
 j:'Réchauffe à feu doux avec un peu de lait. Sers avec la compote.',
 st:[[10,0,'','Coupe les pommes de terre en dés et les oignons en rondelles.'],
  [2,15,'f','Fais dorer lentement les oignons dans le beurre pendant 15 minutes.',[0]],
  [2,15,'f','Cuis les pommes de terre 5 minutes à l’eau salée, ajoute les pâtes et poursuis jusqu’à ce qu’elles soient al dente.',[0]],
  [4,0,'f','Égoutte, remets dans la casserole avec la crème et le fromage, mélange jusqu’à ce que le fromage file. Couvre d’oignons dorés.',[1,2]]]},
{id:'chakchouka',n:'Chakchouka',sv:'œufs pochés le jour même, avec du pain',tg:'me sp1 eco',main:['poivrons'],fr:3,co:1,
 ing:[['poivrons',500],['tomates_concassees',800],['oignons',200],['ail',2],['cumin',0],['paprika',0],['huile_olive',0]],
 jour:[['oeufs',8],['pain',400]],
 j:'Réchauffe la sauce dans une petite poêle, creuse des puits et casse 2 œufs par personne. Couvre et cuis 6 à 8 minutes. Sers avec le pain.',
 st:[[8,0,'','Coupe l’oignon et les poivrons en lanières, hache l’ail.'],
  [3,0,'f','Fais revenir l’oignon et les poivrons dans l’huile d’olive.'],
  [2,20,'f','Ajoute l’ail, 1 cuillère à café de cumin et de paprika, puis les tomates. Laisse réduire 20 minutes.']]},
{id:'salade-lentilles',n:'Salade de lentilles, feta et carottes',sv:'froide, à emporter',tg:'me eco',main:['lentilles_vertes','feta'],fr:3,co:0,
 ing:[['lentilles_vertes',350],['feta',200],['carottes',300],['oignons',80],['persil',1],['moutarde',0],['vinaigre',0],['huile_olive',0]],
 jour:[],
 j:'Rien à cuire : sors la salade du frigo 15 minutes avant de manger.',
 st:[[2,22,'f','Cuis les lentilles rincées 22 minutes à l’eau non salée : elles doivent rester fermes.'],
  [8,0,'','Râpe les carottes, hache l’oignon et le persil. Prépare une vinaigrette avec 5 cuillères à soupe d’huile d’olive, 2 de vinaigre et 1 cuillère à café de moutarde.',[]],
  [4,0,'','Égoutte et sale les lentilles, mélange-les tièdes avec la vinaigrette, les légumes et la feta émiettée.',[0,1]]]},
{id:'salade-pates-thon',n:'Salade de pâtes au thon et au maïs',sv:'froide, à emporter',tg:'it eco',main:['thon_boite'],fr:2,co:0,
 ing:[['pates',350],['thon_boite',280],['mais',285],['tomates',300],['oignons',80],['huile_olive',0],['vinaigre',0],['moutarde',0]],
 jour:[],
 j:'Rien à cuire : mange-la froide.',
 st:[[2,10,'f','Cuis les pâtes al dente.'],
  [8,0,'','Coupe les tomates en dés, hache l’oignon, égoutte le thon et le maïs. Prépare une vinaigrette à la moutarde.',[]],
  [4,0,'','Rince les pâtes à l’eau froide, égoutte-les et mélange-les avec le reste.',[0,1]]]},
{id:'patates-douces-feta',n:'Patates douces rôties, pois chiches et feta',sv:'tiède ou froid',tg:'me ov',main:['patate_douce'],fr:3,co:0,
 ing:[['patate_douce',1200],['pois_chiches',500],['oignons',150],['paprika',0],['huile_olive',0]],
 jour:[['feta',200],['salade',100],['citron',1]],
 j:'Mange tiède ou froid, avec la feta émiettée, la salade et un filet de citron.',
 st:[[10,0,'','Coupe les patates douces en dés et l’oignon en quartiers, égoutte les pois chiches.'],
  [3,0,'','Mélange-les sur une plaque avec de l’huile d’olive, du paprika et du sel.'],
  [1,30,'o210','Rôtis la plaque 30 minutes à 210 °C en remuant une fois.']]}
];
var B={};
BATCH.forEach(function(r){
  B[r.id]=r;
  r.tags=r.tg.split(' ');
  r.cu=r.tags.filter(function(t){return CUIS[t];})[0]||'fr';
  r.all=r.ing.concat(r.jour);
  r.act=r.st.reduce(function(s,x){return s+x[0];},0)+5;
});
function hasTag(r,t){return r.tags.indexOf(t)>=0;}

var TRIGGER='trig_01BvmFY9Q3YRwHQysfNSv3t2',MCP_SERVER='Claude Code Remote',MCP=null;
var WEB=!(typeof window!=='undefined'&&window.claude&&typeof window.claude.use==='function');
var ART_URL='https://claude.ai/artifact/G9yQDj45P56nhFFdsN8iFr';
var S={
  refresh:{avail:null,busy:false,msg:'',kind:'',waiting:false,sig0:''},
  actions:{},flat:[],aState:'loading',loaded:false,
  prefs:defaults(),week:null,
  ui:{tab:'semaine',fStore:'all',fCat:'all',copyText:null,q:null,wiz:null}
};
function defaults(){
  var g=[];for(var d=0;d<7;d++){g.push(false);g.push(true);}
  return {done:false,people:2,grid:g,diet:'tout',no:[],cu:[],spice:1,oven:true,freezer:true,nDish:0,prio:'eco',stores:ORDER.slice(),
    shopDay:'sat',shopH:'09:30',thawH:'20:00',fav:[],ban:[],hist:[],lastFire:0,alg:[],big:false};
}

/* ---------- dates, formats ---------- */
function iso(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function today(){return iso(new Date());}
function isIso(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s);}
function isHM(s){return typeof s==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(s);}
function parse(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function addDays(s,n){var d=parse(s);d.setDate(d.getDate()+n);return iso(d);}
function wdOf(d){return (parse(d).getDay()+6)%7;}
function toMin(d,h){var p=d.split('-'),q=h.split(':');return Math.round(new Date(+p[0],+p[1]-1,+p[2],+q[0],+q[1]).getTime()/60000);}
function hm(m){var d=new Date(m*60000);return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);}
function dOf(m){return iso(new Date(m*60000));}
function nowMin(){return Math.floor(Date.now()/60000);}
function dur(min){min=Math.round(min);var h=Math.floor(min/60),m=min%60;return h?h+' h'+(m?' '+('0'+m).slice(-2):''):m+' min';}
var JC=['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'];
function fmtDay(s){var d=parse(s);return JC[d.getDay()]+' '+d.getDate()+'.'+(d.getMonth()+1);}
function fmtDM(s){var d=parse(s);return d.getDate()+'.'+(d.getMonth()+1);}
function dayName(s){var t=today();if(s===t) return 'aujourd’hui';if(s===addDays(t,1)) return 'demain';return WD[wdOf(s)].toLowerCase();}
function fmtP(v){var r=Math.round(v*100)/100;return r===Math.floor(r)?r+'.–':r.toFixed(2);}
function fr(n){return String(Math.round(n*10)/10).replace('.',',');}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function plural(w){return /eau$/.test(w)?w+'x':w+'s';}
function fmtQty(k,q){
  if(!q) return '';
  var I=ING[k];
  if(I.u==='pc') return q+(I.pl?' '+(q>1?plural(I.pl):I.pl):'');
  return fmtAmt(k,q);
}
function fmtAmt(k,v){
  if(ING[k].u==='ml') return v>=1000?fr(v/1000)+' l':fr(v/100)+' dl';
  return v>=1000?fr(v/1000)+' kg':v+' g';
}
function lc(s){return s.charAt(0).toLowerCase()+s.slice(1);}

/* ---------- actions ---------- */
function flatten(){
  var out=[];
  ORDER.forEach(function(st){
    var d=S.actions[st];
    if(!d||!Array.isArray(d.items)) return;
    d.items.forEach(function(x){
      if(!x||typeof x.n!=='string'||typeof x.p!=='number'||!(x.p>0)) return;
      var o=typeof x.o==='number'&&x.o>x.p?x.o:0;
      var pct=typeof x.pct==='number'&&x.pct>0&&x.pct<100?Math.round(x.pct):(o?Math.round((1-x.p/o)*100):0);
      out.push({st:st,n:x.n,d:typeof x.d==='string'?x.d:'',k:typeof x.k==='string'&&ING[x.k]?x.k:null,
        c:RAYONS[x.c]&&x.c!=='pl'?x.c:'ep',p:x.p,o:o,pct:pct,u:x.u==='100g'||x.u==='kg'?x.u:'pack',
        g:typeof x.g==='number'&&x.g>0?x.g:0,from:isIso(x.from)?x.from:'',to:isIso(x.to)?x.to:'',
        min:typeof x.min==='number'&&x.min>1?Math.floor(x.min):0,cond:typeof x.cond==='string'?x.cond:''});
    });
  });
  S.flat=out;
}
function valid(a,D){return (!a.from||a.from<=D)&&(!a.to||D<=a.to);}
function cost(a,g){
  var packs=null,total,save=0,deal=true,left=0;
  if(a.u==='100g'||a.u==='kg'){
    var div=a.u==='100g'?100:1000,gg=g||a.g||div;
    if(a.g){packs=Math.max(1,Math.ceil(gg/a.g-0.15));gg=packs*a.g;}
    total=a.p*gg/div;
    if(a.o) save=(a.o-a.p)*gg/div;
  }else{
    packs=a.g&&g?Math.max(1,Math.ceil(g/a.g-0.15)):1;
    if(a.min&&packs<a.min){deal=false;total=packs*(a.o||a.p);}
    else{total=packs*a.p;if(a.o) save=packs*(a.o-a.p);}
  }
  if(a.g&&packs&&g) left=Math.max(0,packs*a.g-g);
  return {total:total,save:Math.max(0,save),packs:packs,deal:deal,left:left};
}
function best(k,g,D,o){
  var stores=o&&o.stores?o.stores:S.prefs.stores,minPct=o&&o.minPct?o.minPct:0,over=o&&o.over?o.over:0,b=null,bc=1e9;
  for(var i=0;i<S.flat.length;i++){
    var a=S.flat[i];
    if(a.k!==k||!valid(a,D)||stores.indexOf(a.st)<0||a.pct<minPct) continue;
    if(over&&a.g&&g&&a.g>over*g) continue;
    var c=cost(a,g);
    if(!c.deal) continue;
    if(c.total<bc-0.005||(Math.abs(c.total-bc)<=0.005&&a.pct>b.pct)){b=a;bc=c.total;}
  }
  return b;
}
function dscore(a,g){
  var b=a.pct||8;
  if(a.g&&g&&a.g>2.5*g) b*=0.6;
  return b;
}

/* ---------- recettes ---------- */
function rflags(r){
  if(r._f==null){var s='';r.all.forEach(function(i){s+=ING[i[0]].f;});r._f=s;}
  return r._f;
}
function rgroup(r){
  if(r._g) return r._g;
  var m=ING[r.main[0]].f,f=rflags(r),g;
  if(m.indexOf('f')>=0) g='poisson';
  else if(r.main[0].indexOf('poulet')===0) g='poulet';
  else if(m.indexOf('b')>=0) g='boeuf';
  else if(m.indexOf('a')>=0) g='agneau';
  else if(m.indexOf('p')>=0) g='porc';
  else if(f.indexOf('f')>=0) g='poisson';
  else g=f.indexOf('m')>=0?'porc':'vege';
  return r._g=g;
}
function allowed(r){
  var p=S.prefs,f=rflags(r);
  if(p.ban.indexOf(r.id)>=0) return false;
  if(!p.oven&&hasTag(r,'ov')) return false;
  if(p.spice===0&&hasTag(r,'sp2')) return false;
  if(p.diet==='vege'&&/[mf]/.test(f)) return false;
  if(p.diet==='pesce'&&f.indexOf('m')>=0) return false;
  if(p.diet==='sanspork'&&f.indexOf('p')>=0) return false;
  if(!algOK(r)) return false;
  return !p.no.some(function(x){return f.indexOf(NO[x])>=0;});
}
function algLetter(a){for(var i=0;i<ALG.length;i++) if(ALG[i][0]===a) return ALG[i][2];return '';}
function algOK(r){
  var A=S.prefs.alg;
  for(var i=0;i<A.length;i++){
    var a=A[i],L=algLetter(a);
    if(!L||a==='lactose') continue;
    for(var j=0;j<r.all.length;j++){
      var k=r.all[j][0];
      if(ING[k].f.indexOf(L)>=0&&!(SUBST[a]&&SUBST[a][k])) return false;
    }
  }
  return true;
}
function variantOf(k){
  var A=S.prefs.alg,out=[];
  A.forEach(function(a){
    var L=algLetter(a);
    if(!L||ING[k].f.indexOf(L)<0) return;
    var v=a==='lactose'?(A.indexOf('lait')>=0?'':'sans lactose'):(SUBST[a]&&SUBST[a][k]);
    if(v&&out.indexOf(v)<0) out.push(v);
  });
  return out.join(', ');
}
function roundQ(k,q){
  if(!q) return 0;
  if(ING[k].u==='pc') return Math.max(1,Math.ceil(q-0.01));
  if(q>=100) return Math.round(q/10)*10;
  return Math.max(5,Math.round(q/5)*5);
}
function grams(k,q){return ING[k].u==='pc'?q*ING[k].w:q;}
function needOf(r,k,p){
  var s=0;r.all.forEach(function(x){if(x[0]===k) s+=x[1];});
  return roundQ(k,s*p/4);
}
function mealDeal(r,D,p){
  var top=null,ts=0;
  r.main.forEach(function(k){
    var g=grams(k,needOf(r,k,p)),a=best(k,g,D);
    if(!a) return;
    var s=dscore(a,g);
    if(s>ts){ts=s;top=a;}
  });
  return top?{a:top,s:ts}:null;
}
function rscore(r,D,p){
  var md=mealDeal(r,D,p),s=md?md.s:0,sec=0;
  r.all.forEach(function(i){
    var k=i[0];
    if(r.main.indexOf(k)>=0||ING[k].r==='pl') return;
    var a=best(k,grams(k,needOf(r,k,p)),D,{minPct:1,over:4});
    if(a) sec+=Math.min(a.pct,50)*0.1;
  });
  return s+Math.min(sec,12);
}
function spiceOf(r){return hasTag(r,'sp2')?2:hasTag(r,'sp1')?1:0;}
function baseScore(r,D,p,thisWeek){
  var P=S.prefs,s=rscore(r,D,p)*(P.prio==='eco'?1.3:1),sp=spiceOf(r);
  if(P.prio==='eco'&&hasTag(r,'eco')) s+=8;
  if(P.cu.length&&P.cu.indexOf(r.cu)>=0) s+=P.prio==='var'?20:12;
  if(P.fav.indexOf(r.id)>=0) s+=12;
  if(P.spice===0&&sp===1) s-=10;
  if(P.spice===2&&sp>0) s+=6;
  if(P.freezer&&r.co) s+=4;
  P.hist.filter(function(x){return x.w!==thisWeek;}).forEach(function(x,ix){if(x.ids.indexOf(r.id)>=0) s-=ix===0?25:12;});
  return s;
}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){var a=seed;return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

/* ---------- semaine : repas couverts et répartition frigo / congélateur ---------- */
function cookOf(shopD,shopH,mode,cookH){
  if(mode==='next') return {d:addDays(shopD,1),h:isHM(cookH)?cookH:'10:00'};
  var m=Math.ceil((toMin(shopD,shopH)+75)/15)*15;
  return {d:dOf(m),h:hm(m)};
}
function slotsBetween(cookD,startMin,endMin){
  var g=S.prefs.grid,out=[];
  for(var o=0;o<=7;o++){
    var d=addDays(cookD,o),wd=wdOf(d);
    for(var m=0;m<2;m++){
      if(!g[wd*2+m]) continue;
      var tm=toMin(d,MEALH[m]);
      if(tm>=endMin&&tm<startMin+7*1440) out.push({d:d,m:m,dd:o});
    }
  }
  return out;
}
/* Les plats qui ne se congèlent pas passent en premier ; chaque plat revient à peu près autant de fois que les autres. */
function assign(slots,ids){
  var P=S.prefs,R=ids.map(function(id){return B[id];}).filter(Boolean),k=R.length,n=slots.length;
  if(!k) return slots.map(function(s){return {d:s.d,m:s.m,r:'',src:'libre'};});
  var L=R.map(function(r){return P.freezer&&r.co?99:r.fr;});
  var order=R.map(function(r,i){return i;}).sort(function(a,b){return L[a]-L[b];});
  var quota=R.map(function(){return Math.floor(n/k);});
  for(var x=0;x<n%k;x++) quota[order[order.length-1-x]]++;
  var res=[],prev=-1,prevDay='',dayUsed={};
  slots.forEach(function(s,si){
    var top=-1,bs=-1e9;
    R.forEach(function(r,i){
      if(s.dd>L[i]) return;
      var rem=0;for(var j=si;j<n;j++) if(slots[j].dd<=L[i]) rem++;
      var sc=quota[i]>0?quota[i]/rem*10:-8+(L[i]>10?2:0);
      if(i===prev&&!(quota[i]>=rem)) sc-=6;
      if(dayUsed[s.d+'#'+i]) sc-=3;
      if(sc>bs){bs=sc;top=i;}
    });
    if(top<0){res.push({d:s.d,m:s.m,r:'',src:'libre'});prev=-1;return;}
    quota[top]--;prev=top;dayUsed[s.d+'#'+top]=1;
    res.push({d:s.d,m:s.m,r:R[top].id,src:s.dd===0?'frais':(s.dd<=R[top].fr?'frigo':'congel')});
  });
  return res;
}
function portionsOf(w,id){var n=0;w.slots.forEach(function(s){if(s.r===id) n++;});return n*w.people;}
function buildWeek(shopD,shopH,mode,cookH,ids){
  var c=cookOf(shopD,shopH,mode,cookH),start=toMin(c.d,c.h);
  var w={shop:{d:shopD,h:shopH},mode:mode,cookH:cookH,cook:c,ids:ids.slice(),people:S.prefs.people,ap:S.prefs.big?1.25:1,slots:[],done:{},checked:{}};
  var end=start+150;
  for(var pass=0;pass<2;pass++){
    w.slots=assign(slotsBetween(c.d,start,end),ids);
    var se=start+session(w).span;
    if(se===end) break;
    end=se;
  }
  w.ids=ids.filter(function(id){return portionsOf(w,id)>0;});
  return w;
}

/* ---------- session de batch cooking ---------- */
var SESS={};
function session(w){
  var key=JSON.stringify([w.cook.d,w.ids,w.slots.map(function(s){return s.r+s.src;}),w.people]);
  if(SESS[key]) return SESS[key];
  var nodes=[{ri:-1,rid:'',a:5,p:0,eq:'',deps:[],txt:'',kind:'start'}];
  w.ids.forEach(function(id,ri){
    var r=B[id],por=portionsOf(w,id);
    if(!r||!por) return;
    var f=Math.min(2,1+0.15*(por/4-1)),base=nodes.length,succ={};
    r.st.forEach(function(s,i){
      var a=s[0],p=s[1],eq=s[2]||'';
      if(!eq&&p===0) a=Math.round(a*f);
      var deps=s[4]===undefined?(i>0?[base+i-1]:[0]):(s[4].length?s[4].map(function(j){return base+j;}):[0]);
      deps.forEach(function(d){succ[d]=1;});
      nodes.push({ri:ri,rid:id,a:Math.max(1,a),p:p,eq:eq,deps:deps,txt:s[3],kind:'step'});
    });
    var sinks=[];for(var i=base;i<nodes.length;i++) if(!succ[i]) sinks.push(i);
    nodes.push({ri:ri,rid:id,a:1,p:25,eq:'',deps:sinks,txt:'Laisse tiédir à découvert, 25 minutes au plus.',kind:'cool'});
    nodes.push({ri:ri,rid:id,a:4,p:0,eq:'',deps:[nodes.length-1],txt:packText(w,r),kind:'pack'});
  });
  var N=nodes.length,pr=new Array(N),succs=nodes.map(function(){return [];});
  nodes.forEach(function(n,i){n.deps.forEach(function(d){succs[d].push(i);});});
  for(var i=N-1;i>=0;i--){var m=0;succs[i].forEach(function(s){if(pr[s]>m) m=pr[s];});pr[i]=nodes[i].a+nodes[i].p+m;}
  var startT=new Array(N).fill(-1),endT=new Array(N).fill(-1),burn=[],oven=[],cook=0,done=0,t=0;
  function okAt(n,t){
    var m,o;
    if(n.eq==='f'){for(m=t;m<t+n.a+n.p;m++) if((burn[m]||0)>=BURNERS) return false;}
    else if(n.eq.charAt(0)==='o'){for(m=t+n.a;m<t+n.a+n.p;m++){o=oven[m];if(o&&(o.temp!==n.eq||o.c>=2)) return false;}}
    return true;
  }
  while(done<N&&t<3000){
    if(cook<=t){
      var top=-1,bp=-1;
      for(i=0;i<N;i++){
        if(startT[i]>=0) continue;
        var n=nodes[i],ready=n.deps.every(function(d){return endT[d]>=0&&endT[d]<=t;});
        if(!ready||!okAt(n,t)) continue;
        if(pr[i]>bp){bp=pr[i];top=i;}
      }
      if(top>=0){
        var nn=nodes[top],m2;
        startT[top]=t;endT[top]=t+nn.a+nn.p;cook=t+nn.a;done++;
        if(nn.eq==='f') for(m2=t;m2<endT[top];m2++) burn[m2]=(burn[m2]||0)+1;
        else if(nn.eq.charAt(0)==='o') for(m2=t+nn.a;m2<endT[top];m2++){if(!oven[m2]) oven[m2]={temp:nn.eq,c:0};oven[m2].c++;}
        continue;
      }
    }
    t++;
  }
  var tasks=nodes.map(function(n,i){return {t:startT[i],a:n.a,p:n.p,eq:n.eq,ri:n.ri,rid:n.rid,txt:n.txt,kind:n.kind};});
  tasks[0].txt='Sors tous les ingrédients, lave les légumes et prépare '+boxCount(w).all+' boîtes avec couvercle.';
  var ov=tasks.filter(function(x){return x.eq.charAt(0)==='o';}).sort(function(a,b){return (a.t+a.a)-(b.t+b.a);}),extra=[];
  if(ov.length){
    var first=ov[0];
    extra.push({t:Math.max(0,first.t+first.a-12),a:1,p:0,eq:'',ri:-1,rid:'',txt:'Préchauffe le four à '+first.eq.slice(1)+' °C.',kind:'oven'});
    for(var k=1;k<ov.length;k++) if(ov[k].eq!==ov[k-1].eq) ov[k].txt='Règle le four à '+ov[k].eq.slice(1)+' °C. '+ov[k].txt;
  }
  tasks=tasks.concat(extra).sort(function(a,b){return a.t-b.t||a.ri-b.ri;});
  var busy=tasks.filter(function(x){return x.kind!=='oven';}).map(function(x){return [x.t,x.t+x.a];}).sort(function(a,b){return a[0]-b[0];});
  var free=[],cur=0;
  busy.forEach(function(b){if(b[0]-cur>=12) free.push({t:cur,a:b[0]-cur,p:0,eq:'',ri:-1,rid:'',txt:'Temps libre : lave la vaisselle et range le plan de travail.',kind:'free'});if(b[1]>cur) cur=b[1];});
  tasks=tasks.concat(free).sort(function(a,b){return a.t-b.t||(a.kind==='free')-(b.kind==='free');});
  var span=0,act=0,maxB=0;
  endT.forEach(function(e){if(e>span) span=e;});
  nodes.forEach(function(n){act+=n.a;});
  burn.forEach(function(b){if(b>maxB) maxB=b;});
  var temps=[];ov.forEach(function(x){var tp=x.eq.slice(1);if(temps.indexOf(tp)<0) temps.push(tp);});
  return SESS[key]={tasks:tasks,span:span,act:act,burners:maxB,temps:temps};
}
function boxCount(w){
  var f=0,c=0,all=0;
  w.slots.forEach(function(s){if(!s.r||s.src==='frais') return;all++;if(s.src==='congel') c++;else f++;});
  return {fridge:f,freezer:c,all:all};
}
function packText(w,r){
  var f=0,c=0,now=0,lastF='';
  w.slots.forEach(function(s){if(s.r!==r.id) return;if(s.src==='frais') now++;else if(s.src==='congel') c++;else{f++;lastF=s.d;}});
  var por=w.people>1?' de '+w.people+' portions':'',parts=[];
  if(now) parts.push('garde '+(w.people>1?w.people+' portions':'une portion')+' pour ce soir');
  if(f) parts.push(f+' boîte'+(f>1?'s':'')+por+' au frigo, à manger d’ici '+WD[wdOf(addDays(w.cook.d,r.fr))].toLowerCase());
  if(c) parts.push(c+' boîte'+(c>1?'s':'')+por+' au congélateur');
  return 'Répartis : '+parts.join(', ')+'. Écris le nom et la date sur chaque couvercle.';
}

/* ---------- agenda ---------- */
function events(w){
  var ev=[],L=shopping(w),ss=session(w),start=toMin(w.cook.d,w.cook.h),P=S.prefs,thaw={};
  ev.push({tm:toMin(w.shop.d,w.shop.h),kind:'shop',k:'Courses',txt:'Chez '+Object.keys(L.byStore).map(function(s){return STORES[s];}).concat(Object.keys(L.byStore).length?[]:P.stores.map(function(s){return STORES[s];})).join(', ')+' · '+L.n+' articles',go:'courses',len:60});
  ev.push({tm:start,kind:'cook',k:'Batch cooking',txt:w.ids.length+' plats en '+dur(ss.span)+', jusqu’à '+hm(start+ss.span)+' environ',go:'batch',len:ss.span});
  w.slots.forEach(function(s){
    var r=B[s.r],tm=toMin(s.d,MEALH[s.m]);
    if(!r){ev.push({tm:tm,kind:'meal',k:s.m?'Soir':'Midi',txt:'Repas libre',sub:P.freezer?'':'Sans congélateur, le batch tient 3 jours.',len:60});return;}
    var j=r.jour.filter(function(x){return ING[x[0]].r!=='pl';}).map(function(x){var vt=variantOf(x[0]);return lc(ING[x[0]].n)+(vt?' '+vt:'')+' '+fmtQty(x[0],roundQ(x[0],x[1]*w.people/4*(w.ap||1)));});
    ev.push({tm:tm,kind:'meal',k:s.m?'Soir':'Midi',rid:r.id,src:s.src,txt:r.n+(r.sv?', '+r.sv:''),sub:r.j+(j.length?' Il te faut : '+j.join(', ')+'.':''),len:90});
    if(s.src==='congel'){
      var td=addDays(s.d,-1),key=td;
      (thaw[key]=thaw[key]||[]).push((w.people>1?'1 boîte':'1 portion')+' de '+lc(r.n)+' pour '+(s.m?'demain soir':'demain midi'));
    }
  });
  Object.keys(thaw).forEach(function(d){
    ev.push({tm:toMin(d,P.thawH),kind:'thaw',k:'Décongeler',txt:'Sors du congélateur et mets au frigo : '+thaw[d].join(' ; ')+'.',len:60});
  });
  return ev.sort(function(a,b){return a.tm-b.tm||(a.kind==='thaw')-(b.kind==='thaw');});
}
function weekOver(w){var start=toMin(w.cook.d,w.cook.h);return nowMin()>start+7*1440-60;}
function nextEvent(ev){var n=nowMin();for(var i=0;i<ev.length;i++) if(ev[i].tm+ev[i].len>=n) return ev[i];return null;}
function programText(w){
  var lines=['Mitonne · semaine du '+fmtDay(w.cook.d),''],last='';
  events(w).forEach(function(e){
    var d=dOf(e.tm);
    if(d!==last){lines.push('');lines.push(WD[wdOf(d)].toUpperCase()+' '+fmtDM(d));last=d;}
    lines.push(hm(e.tm)+'  '+e.k+' : '+e.txt);
  });
  return lines.join('\n').replace(/\n\n\n/g,'\n\n');
}

/* ---------- liste de courses ---------- */
function shopping(w){
  var D=w.shop.d,need={},order=[],mains={};
  w.ids.forEach(function(id){
    var r=B[id],por=portionsOf(w,id);
    if(!r||!por) return;
    r.main.forEach(function(k){mains[k]=1;});
    r.all.forEach(function(x){
      if(!(x[0] in need)){need[x[0]]=0;order.push(x[0]);}
      need[x[0]]+=x[1]*por/4*(w.ap||1);
    });
  });
  var out={byStore:{},rest:{},placard:[],pick:{},pay:0,save:0,n:0},anchors=[];
  var rows=order.map(function(k){var q=roundQ(k,need[k]);return {k:k,q:q,g:grams(k,q),a:null,c:null};});
  rows.forEach(function(row){
    if(!mains[row.k]) return;
    row.a=best(row.k,row.g,D);
    if(row.a&&anchors.indexOf(row.a.st)<0) anchors.push(row.a.st);
  });
  rows.forEach(function(row){if(!mains[row.k]) row.a=best(row.k,row.g,D,{stores:anchors,minPct:1,over:4});});
  rows.forEach(function(row){
    var k=row.k,a=row.a;
    if(a){row.c=cost(a,row.g);out.pick[k]=a;}
    if(ING[k].r==='pl'){out.placard.push(row);return;}
    out.n++;
    if(a){(out.byStore[a.st]=out.byStore[a.st]||[]).push(row);out.pay+=row.c.total;out.save+=row.c.save;}
    else (out.rest[ING[k].r]=out.rest[ING[k].r]||[]).push(row);
  });
  Object.keys(out.byStore).forEach(function(st){out.byStore[st].sort(function(a,b){return RORDER.indexOf(ING[a.k].r)-RORDER.indexOf(ING[b.k].r);});});
  return out;
}
function fmtQtyG(g){return g>=1000?fr(g/1000)+' kg':g+' g';}
function packsTxt(row){
  var a=row.a,c=row.c,parts=[];
  if(a.u==='pack'){
    if(c.packs>1) parts.push(c.packs+' paquets');
    parts.push(fmtP(c.total)+(a.o?' au lieu de '+fmtP(c.packs*a.o):''));
  }else parts.push('env. '+fmtP(c.total)+(c.packs&&a.g?' pour '+c.packs+' pièce'+(c.packs>1?'s':'')+' d’env. '+fmtQtyG(a.g):''));
  return parts.join(' · ');
}
function leftTxt(row){
  var c=row.c,a=row.a;
  if(!c||!c.left||!a.g) return '';
  var whole=c.packs*a.g;
  if(c.left<Math.max(60,whole*0.2)) return '';
  return 'Il t’en restera env. '+fmtAmt(row.k,Math.round(c.left/10)*10);
}
function untilTxt(a){
  if(!a.to) return a.cond||'';
  var t=today(),s=a.to===t?'dernier jour':'jusqu’au '+fmtDay(a.to);
  return a.cond?s+' · '+a.cond:s;
}
function listText(w){
  var L=shopping(w),lines=['Courses du '+fmtDay(w.shop.d)+' à '+w.shop.h+' : batch de '+w.ids.length+' plats pour '+w.slots.filter(function(s){return s.r;}).length+' repas',''];
  ORDER.forEach(function(st){
    var rows=L.byStore[st];if(!rows) return;
    lines.push(STORES[st].toUpperCase());
    rows.forEach(function(r){
      var a=r.a,u=a.u==='100g'?'/100 g':a.u==='kg'?'/kg':'';
      lines.push('- '+ING[r.k].n+(r.q?', '+fmtQty(r.k,r.q):'')+' : '+a.n+' '+fmtP(a.p)+u+(a.pct?' (−'+a.pct+'%)':''));
    });
    lines.push('');
  });
  var any=false;
  RORDER.forEach(function(rc){
    var rows=L.rest[rc];if(!rows) return;
    if(!any){lines.push('SANS ACTION');any=true;}
    rows.forEach(function(r){lines.push('- '+ING[r.k].n+(r.q?', '+fmtQty(r.k,r.q):''));});
  });
  if(L.placard.length){lines.push('');lines.push('PLACARD : '+L.placard.map(function(r){return ING[r.k].n.toLowerCase();}).join(', '));}
  return lines.join('\n');
}

/* ---------- propositions ---------- */
function targetDishes(n){
  var p=S.prefs.nDish;
  if(p) return p;
  return n<=4?2:n<=8?3:n<=12?4:5;
}
function proposals(wz){
  var c=cookOf(wz.shopD,wz.shopH,wz.mode,wz.cookH),start=toMin(c.d,c.h);
  var sl=slotsBetween(c.d,start,start+150),n=S.prefs.freezer?sl.length:sl.filter(function(x){return x.dd<=3;}).length,t=targetDishes(n),por=Math.max(2,Math.round(n/Math.max(1,t)))*S.prefs.people;
  var rand=rng(hash(wz.shopD+'#'+(wz.seed||0)));
  var list=BATCH.filter(allowed).map(function(r){return {r:r,s:baseScore(r,wz.shopD,por,wz.shopD)+rand()*8,md:mealDeal(r,wz.shopD,por)};})
    .sort(function(a,b){return b.s-a.s;});
  return {list:list,n:n,target:t,por:por};
}
function autoPick(wz){
  var pr=proposals(wz),picks=wz.picks.slice(),P=S.prefs;
  function ok(r,strict){
    var g=rgroup(r),groups=picks.map(function(id){return rgroup(B[id]);}),cus=picks.map(function(id){return B[id].cu;});
    var ovens=picks.filter(function(id){return hasTag(B[id],'ov');}).length,fresh=picks.filter(function(id){return !B[id].co;}).length;
    if(P.diet==='flexi'&&g!=='vege'&&groups.some(function(x){return x!=='vege';})) return false;
    if(!strict) return true;
    if(g!=='vege'&&groups.indexOf(g)>=0) return false;
    if(cus.filter(function(x){return x===r.cu;}).length>=1) return false;
    if(hasTag(r,'ov')&&ovens>=2) return false;
    if(!r.co&&(fresh>=1||!P.freezer&&fresh>=2)) return false;
    return true;
  }
  [true,false].forEach(function(strict){
    pr.list.forEach(function(c){
      if(picks.length>=pr.target||picks.indexOf(c.r.id)>=0) return;
      if(ok(c.r,strict)) picks.push(c.r.id);
    });
  });
  return picks;
}

/* ---------- petits morceaux d'interface ---------- */
function tag(a){
  var unit=a.u==='100g'?'/100 g':a.u==='kg'?'/kg':'';
  return '<span class="tag'+(a.pct?'':' plain')+'">'+(a.pct?'<span class="tag-pct">−'+a.pct+'%</span>':'')+
    '<span class="tag-body"><span class="tag-price">'+fmtP(a.p)+'</span>'+(unit?'<span class="tag-unit">'+unit+'</span>':'')+
    (a.o?'<s class="tag-old">'+fmtP(a.o)+'</s>':'')+'</span></span>';
}
function chip(act,v,label,on){
  return '<button class="chip" id="c-'+act+'-'+String(v).replace(/[^a-z0-9-]/gi,'')+'" data-act="'+act+'" data-v="'+v+'" aria-pressed="'+!!on+'">'+label+'</button>';
}
function opt(act,v,label,sub,on,kind){
  return '<button class="opt" id="o-'+act+'-'+v+'" data-act="'+act+'" data-v="'+v+'" aria-pressed="'+!!on+'"><span>'+label+(sub?'<small>'+sub+'</small>':'')+'</span>'+
    (kind==='switch'?'<span class="pill">'+(on?'Oui':'Non')+'</span>':'<span class="dot"></span>')+'</button>';
}
function blk(label,body){return '<div class="block"><p class="label">'+label+'</p>'+body+'</div>';}
function ready(){return S.loaded&&S.aState!=='loading';}
function loadingView(){
  return '<section class="empty"><h1 class="h1">Mitonne lit les actions de la semaine</h1><p class="lede">Migros, Coop, Denner, Aldi et Lidl. Ensuite, tu choisis tes plats et Mitonne organise tes courses, ta session de batch cooking et ta semaine.</p></section>';
}
var ILLU='<svg class="illu" viewBox="0 0 320 150" role="img" aria-label="Une cocotte qui mijote et des boîtes étiquetées pour la semaine"><path d="M8 140H312" stroke="var(--line)" stroke-width="2" stroke-linecap="round"/><g stroke="var(--ink-2)" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"><path d="M64 42c-7-8 7-12 0-23"/><path d="M86 42c-7-8 7-12 0-23"/><path d="M108 42c-7-8 7-12 0-23"/></g><rect x="78" y="44" width="16" height="9" rx="3" fill="var(--ink)"/><rect x="38" y="52" width="96" height="11" rx="5.5" fill="var(--ink)"/><path d="M44 66h84v38a32 32 0 0 1-32 32H76a32 32 0 0 1-32-32z" fill="var(--accent)"/><path d="M28 80h16M128 80h16" stroke="var(--accent)" stroke-width="8" stroke-linecap="round"/><path d="M56 78h60" stroke="var(--accent-ink)" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/><g stroke="var(--ink)" stroke-width="2"><rect x="172" y="104" width="124" height="34" rx="6" fill="var(--surface)"/><rect x="168" y="97" width="132" height="9" rx="3" fill="var(--fresh)"/><rect x="180" y="62" width="108" height="32" rx="6" fill="var(--surface)"/><rect x="176" y="55" width="116" height="9" rx="3" fill="var(--fridge)"/><rect x="188" y="22" width="92" height="30" rx="6" fill="var(--surface)"/><rect x="184" y="15" width="100" height="9" rx="3" fill="var(--cold)"/></g><rect x="180" y="112" width="42" height="18" rx="2" fill="var(--tape)" transform="rotate(-3 201 121)"/><rect x="190" y="69" width="42" height="18" rx="2" fill="var(--tape)" transform="rotate(2 211 78)"/><rect x="198" y="28" width="42" height="18" rx="2" fill="var(--tape)" transform="rotate(-2 219 37)"/><g fill="var(--tape-ink)" style="font-family:var(--f-hand);font-weight:700;font-size:15px"><text x="187" y="126">sam.</text><text x="196" y="83">lun.</text><text x="204" y="42">jeu.</text></g><rect x="236" y="112" width="48" height="18" rx="4" fill="var(--accent-soft)"/><rect x="246" y="70" width="34" height="16" rx="4" fill="var(--accent-soft)"/><g stroke="var(--cold)" stroke-width="2" stroke-linecap="round"><path d="M262 28v14M255 31l14 8M269 31l-14 8"/></g></svg>';
function noWeek(){
  return '<section class="empty">'+ILLU+'<h1 class="h1">Prépare ta semaine</h1><p class="lede">Choisis ton jour de courses et les plats qui te font envie. Mitonne fait la liste, organise ta session de batch cooking à l’heure près et te dit quand décongeler chaque repas.</p>'+
    '<button class="btn fill wide" data-act="w-new">Préparer ma semaine</button></section>';
}
function stateNote(D){
  if(S.aState==='off'||S.aState==='slow') return '<p class="note">Les actions de la semaine ne sont pas joignables pour l’instant. Les plats sont proposés sans prix.</p>';
  if(!S.flat.length) return '<p class="note">Aucune action n’a encore été relevée. Les plats sont proposés sans prix.</p>';
  if(!S.prefs.stores.length) return '<p class="note">Aucun magasin n’est choisi dans Réglages : les plats sont proposés sans prix.</p>';
  var miss=S.prefs.stores.filter(function(st){return !S.flat.some(function(a){return a.st===st&&valid(a,D);});});
  if(miss.length) return '<p class="note">Pas encore d’action relevée pour le '+fmtDay(D)+' chez '+miss.map(function(s){return STORES[s];}).join(', ')+'. Mitonne relève les nouvelles actions le jeudi matin : reviens choisir tes plats après si tu veux en profiter.</p>';
  return '';
}

/* ---------- contrôles des préférences ---------- */
function ctlPeople(){
  var n=S.prefs.people;
  return '<div class="stepper" role="group" aria-label="Nombre de personnes"><button id="people-minus" data-act="people" data-s="-1" aria-label="Une personne de moins">−</button><output id="people-out">'+n+'</output>'+
    '<button id="people-plus" data-act="people" data-s="1" aria-label="Une personne de plus">+</button><span>'+(n>1?'personnes':'personne')+'</span></div>';
}
function presetGrid(v){
  var g=[];
  for(var d=0;d<7;d++){var we=d>=5;g.push(v==='tout'||(v==='semaine'&&!we)||(v==='weekend'&&we));g.push(v!=='semaine'||!we);}
  return g;
}
function ctlGrid(){
  var g=S.prefs.grid,n=g.filter(Boolean).length,cur=g.map(Number).join('');
  var h='<div class="chips">'+PRESETS.map(function(x){return chip('preset',x[0],x[1],presetGrid(x[0]).map(Number).join('')===cur);}).join('')+'</div>';
  h+='<div class="wk" role="group" aria-label="Repas de la semaine"><span></span><span class="wk-h">Midi</span><span class="wk-h">Soir</span>';
  for(var d=0;d<7;d++){
    h+='<span class="wk-d">'+WD[d]+'</span>';
    for(var m=0;m<2;m++){
      var ix=d*2+m;
      h+='<button class="tog" id="g-'+ix+'" data-act="grid" data-g="'+ix+'" aria-pressed="'+!!g[ix]+'" aria-label="'+WD[d]+(m?' soir':' midi')+'">'+(g[ix]?'✓':'')+'</button>';
    }
  }
  return h+'</div><p class="count">'+n+' repas par semaine</p>';
}
function ctlDiet(){return '<div class="opts">'+DIETS.map(function(d){return opt('diet',d[0],d[1],d[2],S.prefs.diet===d[0]);}).join('')+'</div>';}
function ctlAlg(){return '<div class="chips">'+ALG.map(function(x){return chip('alg',x[0],x[1],S.prefs.alg.indexOf(x[0])>=0);}).join('')+'</div>';}
function ctlBig(){return '<div class="chips">'+chip('big','0','Portions normales',!S.prefs.big)+chip('big','1','Portions généreuses, +25 %',S.prefs.big)+'</div>';}
function ctlNo(){return '<div class="chips">'+NO_L.map(function(x){return chip('no',x[0],x[1],S.prefs.no.indexOf(x[0])>=0);}).join('')+'</div>';}
function ctlCuis(){return '<div class="chips">'+chip('cu-all','x','Un peu de tout',!S.prefs.cu.length)+CORDER.map(function(c){return chip('cu',c,CUIS[c],S.prefs.cu.indexOf(c)>=0);}).join('')+'</div>';}
function ctlSpice(){return '<div class="chips">'+SPICE.map(function(x){return chip('spice',x[0],x[1],S.prefs.spice===x[0]);}).join('')+'</div>';}
function ctlOven(){return '<div class="chips">'+chip('oven','1','Oui, j’ai un four',S.prefs.oven)+chip('oven','0','Pas de four',!S.prefs.oven)+'</div>';}
function ctlFreezer(){return '<div class="chips">'+chip('freezer','1','Oui, j’ai un congélateur',S.prefs.freezer)+chip('freezer','0','Pas de congélateur',!S.prefs.freezer)+'</div>'+
  (S.prefs.freezer?'':'<p class="fine">Sans congélateur, un plat cuisiné se garde 3 jours au frigo : ton batch couvrira les 3 premiers jours de la semaine.</p>');}
function ctlDish(){return '<div class="chips">'+[[0,'Selon mes repas'],[2,'2'],[3,'3'],[4,'4'],[5,'5']].map(function(x){return chip('ndish',x[0],x[1],S.prefs.nDish===x[0]);}).join('')+'</div>';}
function ctlHabit(){return '<div class="chips">'+HABITS.map(function(x,i){return chip('habit',i,x[2]+', '+x[1],S.prefs.shopDay===x[0]&&S.prefs.shopH===x[1]);}).join('')+'</div>';}
function ctlThaw(){return '<div class="chips">'+THAWH.map(function(h){return chip('thaw',h,h,S.prefs.thawH===h);}).join('')+'</div>';}
function ctlStores(){return '<div class="chips">'+ORDER.map(function(st){return chip('store',st,STORES[st],S.prefs.stores.indexOf(st)>=0);}).join('')+'</div>';}
function ctlPrio(){return '<div class="opts">'+PRIO.map(function(x){return opt('prio',x[0],x[1],x[2],S.prefs.prio===x[0]);}).join('')+'</div>';}
var ALLERGY='<p class="fine">Mitonne écarte les plats qui contiennent ces aliments. Pour le gluten et le lactose, il garde les plats qui ont une version adaptée et te l’indique dans la liste de courses. Un produit peut contenir des traces : lis toujours les étiquettes.</p>';
var KEEPING='<p class="fine">Frigo à 4 °C au plus. Plats cuisinés : 3 jours au frigo, 2 pour le poisson, et 2 à 3 mois au congélateur. Décongèle toujours au frigo, à couvert, et ne recongèle jamais un plat décongelé.</p>';

/* ---------- questionnaire ---------- */
function quizStep(q){
  var p=S.prefs;
  switch(q){
  case 0: return {i:1,t:'Pour combien de personnes cuisines-tu ?',l:'Six questions rapides. Ensuite, chaque semaine, tu choisis tes plats et Mitonne organise tes courses, ta session de batch cooking et ta semaine.',b:ctlPeople()+ctlBig(),ok:true};
  case 1: return {t:'Quels repas ton batch doit-il couvrir ?',l:'Coche les midis et les soirs. Une seule session de cuisine par semaine peut couvrir jusqu’à 14 repas.',b:ctlGrid(),ok:p.grid.some(Boolean),hint:'Choisis au moins un repas.'};
  case 2: return {t:'Qu’est-ce que tu manges ?',l:'Mitonne n’écartera que ce que tu coches ici.',b:ctlDiet()+blk('Allergies et intolérances',ctlAlg())+blk('Je n’aime pas',ctlNo())+ALLERGY,ok:true};
  case 3: return {t:'Quelles cuisines te font envie ?',l:'Choisis-en autant que tu veux : Mitonne les proposera plus souvent, sans écarter les autres.',b:ctlCuis(),ok:true};
  case 4: return {t:'Comment est ta cuisine ?',l:'Le congélateur permet de tenir toute la semaine avec une seule session.',b:blk('Four',ctlOven())+blk('Congélateur',ctlFreezer())+blk('Côté épices',ctlSpice()),ok:true};
  default: return {t:'Où et quand fais-tu tes courses ?',l:'Mitonne ne cherche les actions que dans ces magasins. Le dimanche, ils sont fermés : tu choisiras chaque semaine entre les autres jours.',b:ctlStores()+blk('D’habitude, je fais mes courses',ctlHabit())+blk('Ta priorité',ctlPrio()),ok:p.stores.length>0,hint:'Choisis au moins un magasin pour profiter des actions.'};
  }
}
function viewQuiz(){
  var q=S.ui.q||0,st=quizStep(q),last=q===QN-1;
  var h='<section class="quiz"><div class="prog" role="progressbar" aria-label="Avancement du questionnaire" aria-valuemin="1" aria-valuemax="'+QN+'" aria-valuenow="'+(q+1)+'"><i style="width:'+Math.round((q+1)/QN*100)+'%"></i></div>'+
    (st.i?ILLU:'')+'<p class="label">Question '+(q+1)+' sur '+QN+'</p><div class="head"><h1 class="h1">'+st.t+'</h1><p class="lede">'+st.l+'</p></div>'+st.b;
  if(!st.ok&&st.hint) h+='<p class="hint">'+st.hint+'</p>';
  h+='<div class="qfoot">'+(q>0?'<button class="btn" id="q-back" data-act="q-back">Retour</button>':(S.prefs.done?'<button class="btn" id="q-cancel" data-act="q-cancel">Annuler</button>':''))+
    '<button class="btn fill" id="q-next" data-act="'+(last?'q-done':'q-next')+'"'+(st.ok?'':' disabled')+'>'+(last?'Préparer ma semaine':'Suivant')+'</button></div></section>';
  return h;
}

/* ---------- préparer la semaine ---------- */
function shopDays(){var out=[],t=today();for(var i=0;out.length<6&&i<9;i++){var d=addDays(t,i);if(parse(d).getDay()!==0) out.push(d);}return out;}
function nextShopDay(pref){var want=pref==='fri'?5:6,t=today();for(var i=0;i<8;i++){var d=addDays(t,i);if(parse(d).getDay()===want) return d;}return t;}
function newWiz(edit){
  var p=S.prefs,w=S.week;
  if(edit&&w) return {step:1,shopD:w.shop.d,shopH:w.shop.h,mode:w.mode,cookH:w.cookH||'10:00',picks:w.ids.slice(),page:0,seed:0,edit:true};
  var d=nextShopDay(p.shopDay),h=p.shopH;
  if(d===today()&&toMin(d,h)<nowMin()) d=shopDays().filter(function(x){return x!==d;})[0];
  return {step:0,shopD:d,shopH:h,mode:p.shopDay==='fri'?'next':'after',cookH:'10:00',picks:[],page:0,seed:0};
}
function viewWiz(){
  var wz=S.ui.wiz;
  return wz.step===0?wizWhen(wz):wizDishes(wz);
}
function wizWhen(wz){
  var c=cookOf(wz.shopD,wz.shopH,wz.mode,wz.cookH),late=wz.mode==='after'&&toMin(c.d,c.h)>=toMin(c.d,'19:45');
  var after=cookOf(wz.shopD,wz.shopH,'after',wz.cookH),nextD=addDays(wz.shopD,1);
  var h='<section class="quiz"><p class="label">Ta semaine · étape 1 sur 2</p><div class="head"><h1 class="h1">Quand fais-tu tes courses ?</h1>'+
    '<p class="lede">Le dimanche, les magasins sont fermés. Les nouvelles actions de Migros, Coop, Denner et Lidl commencent le jeudi.</p></div>';
  h+=blk('Jour','<div class="chips">'+shopDays().map(function(d){return chip('w-day',d,(d===today()?'Aujourd’hui':WD[wdOf(d)])+' '+fmtDM(d),d===wz.shopD);}).join('')+'</div>');
  h+='<div class="block"><label class="label" for="w-shop-h">Heure</label><div class="row"><input class="time" type="time" id="w-shop-h" data-in="shopH" step="900" value="'+wz.shopH+'"></div></div>';
  h+='<div class="block"><p class="label">Et la session de cuisine ?</p><div class="opts">'+
    opt('w-mode','after','Juste après les courses','Vers '+after.h+', le temps de rentrer et de ranger',wz.mode==='after')+
    opt('w-mode','next','Le lendemain',WD[wdOf(nextD)]+' '+fmtDM(nextD)+(parse(nextD).getDay()===0?', les magasins sont fermés mais ta cuisine est ouverte':''),wz.mode==='next')+'</div>';
  if(wz.mode==='next') h+='<div class="row"><label class="fine" for="w-cook-h">Je commence à</label><input class="time" type="time" id="w-cook-h" data-in="cookH" step="900" value="'+wz.cookH+'"></div>';
  h+='</div>';
  if(late) h+='<p class="note">Tu commencerais à cuisiner vers '+c.h+' : la session finirait tard. Tu peux aussi cuisiner le lendemain.</p>';
  h+='<div class="qfoot">'+(S.week||wz.edit?'<button class="btn" id="w-cancel" data-act="w-cancel">Annuler</button>':'')+'<button class="btn fill" id="w-next" data-act="w-next">Choisir mes plats</button></div></section>';
  return h;
}
function estimate(wz){
  if(!wz.picks.length) return null;
  var key=JSON.stringify([wz.shopD,wz.shopH,wz.mode,wz.cookH,wz.picks,S.prefs.people,S.prefs.grid]);
  if(wz._k===key) return wz._e;
  var w=buildWeek(wz.shopD,wz.shopH,wz.mode,wz.cookH,wz.picks),ss=session(w);
  wz._k=key;wz._e={w:w,ss:ss};
  return wz._e;
}
function wizDishes(wz){
  var pr=proposals(wz),c=cookOf(wz.shopD,wz.shopH,wz.mode,wz.cookH),P=S.prefs;
  var picked=pr.list.filter(function(x){return wz.picks.indexOf(x.r.id)>=0;}),others=pr.list.filter(function(x){return wz.picks.indexOf(x.r.id)<0;});
  var per=8,pages=Math.max(1,Math.ceil(others.length/per)),pg=wz.page%pages,show=picked.concat(others.slice(pg*per,pg*per+per));
  var h='<section class="quiz"><p class="label">Ta semaine · étape 2 sur 2</p><div class="head"><h1 class="h1">Qu’est-ce qui te ferait envie ?</h1>'+
    '<p class="lede">'+pr.n+' repas à couvrir à partir de '+dayName(c.d)+'. '+pr.target+' plats suffisent : chacun revient environ '+Math.max(1,Math.round(pr.n/pr.target))+' fois. Les propositions tiennent compte des actions du '+fmtDay(wz.shopD)+'.</p></div>'+blk('Plats différents cette semaine',ctlDish())+stateNote(wz.shopD);
  if(!pr.n) h+='<p class="note">Aucun repas n’est coché après la session. Choisis tes midis et tes soirs dans Réglages.</p>';
  h+='<ul class="cards">'+show.map(function(x){return propCard(x,wz);}).join('')+'</ul>';
  if(others.length>per) h+='<button class="btn wide" data-act="w-more">Voir d’autres plats</button>';
  var e=estimate(wz);
  h+='<div class="wbar"><p class="wbar-s"><b>'+wz.picks.length+' plat'+(wz.picks.length>1?'s':'')+' choisi'+(wz.picks.length>1?'s':'')+'</b> sur '+pr.target+' conseillés'+
    (e?' · session d’environ <b>'+dur(e.ss.span)+'</b>, dont '+dur(e.ss.act)+' de travail':'')+'</p>'+
    '<div class="btns"><button class="btn" data-act="w-back">Retour</button><button class="btn" data-act="w-auto">'+(wz.picks.length?'Compléter pour moi':'Choisir pour moi')+'</button></div>'+
    '<button class="btn fill wide" data-act="w-ok"'+(wz.picks.length?'':' disabled')+'>Valider ma semaine</button></div></section>';
  return h;
}
function propCard(x,wz){
  var r=x.r,on=wz.picks.indexOf(r.id)>=0,fav=S.prefs.fav.indexOf(r.id)>=0,a=x.md&&x.md.a;
  var keep=S.prefs.freezer&&r.co?'<span class="badge cold">Se congèle</span>':'<span class="badge fridge">Frigo, '+r.fr+' jours</span>';
  var h='<li class="card" data-on="'+on+'"><div class="card-head"><span>'+CUSHORT[r.cu]+(rgroup(r)==='vege'?' · végétarien':'')+'</span><span>≈ '+r.act+' min de travail</span></div>'+
    '<h3 class="card-name">'+esc(r.n)+'</h3>'+(r.sv?'<p class="card-sv">'+esc(r.sv)+'</p>':'')+'<div class="badges">'+keep+(hasTag(r,'ov')?'<span class="badge">Four</span>':'')+'</div>';
  if(a){var u=untilTxt(a);h+='<div class="deal"><div class="deal-txt"><span class="store">'+STORES[a.st]+'</span><span class="deal-n">'+esc(a.n)+'</span>'+(u?'<span class="deal-s">'+esc(u)+'</span>':'')+'</div>'+tag(a)+'</div>';}
  h+='<div class="card-acts"><button class="btn'+(on?' fill':'')+'" id="b-pick-'+r.id+'" data-act="w-pick" data-v="'+r.id+'" aria-pressed="'+on+'">'+(on?'Choisi ✓':'Je prends')+'</button>'+
    '<button class="btn icon" id="b-fav-'+r.id+'" data-act="fav" data-v="'+r.id+'" aria-pressed="'+fav+'" aria-label="'+(fav?'Retirer des favoris':'Ajouter aux favoris')+'">'+HEART+'</button>'+
    (on?'':'<button class="btn small" id="b-ban-'+r.id+'" data-act="ban" data-v="'+r.id+'">Pas pour moi</button>')+'</div></li>';
  return h;
}

/* ---------- vues ---------- */
function colorOf(w,id){var i=w.ids.indexOf(id);return COLORS[(i<0?0:i)%COLORS.length];}
function viewSemaine(){
  if(!ready()) return loadingView();
  var w=S.week;
  if(!w) return noWeek();
  var ev=events(w),L=shopping(w),ss=session(w),nx=nextEvent(ev),n=nowMin(),meals=w.slots.filter(function(s){return s.r;}).length;
  var h='<section class="head"><h1 class="h1">Ta semaine</h1><p class="lede">'+meals+' repas · '+w.ids.length+' plats · courses '+dayName(w.shop.d)+' à '+w.shop.h+' · batch '+dayName(w.cook.d)+' de '+w.cook.h+' à '+hm(toMin(w.cook.d,w.cook.h)+ss.span)+'</p>';
  if(L.save>0.005) h+='<div class="save"><span class="save-n">'+fmtP(L.save)+'<small>CHF</small></span><span class="save-l">économisés sur les produits en action de ta liste, par rapport à leur prix normal</span></div>';
  h+='</section>';
  if(weekOver(w)) h+='<div class="note">Cette semaine est terminée. Les actions ont changé : choisis de nouveaux plats.<button class="btn" data-act="w-new">Préparer la semaine suivante</button></div>';
  else if(nx){
    var live=n>=nx.tm&&n<nx.tm+nx.len;
    h+='<div class="next"><span class="next-k">'+(live?'Maintenant':'Prochaine étape · '+dayName(dOf(nx.tm))+' à '+hm(nx.tm))+'</span><p class="next-t">'+esc(nx.k)+' : '+esc(nx.txt)+'</p>'+(nx.sub?'<p class="next-s">'+esc(nx.sub)+'</p>':'')+
      (nx.go?'<a class="btn fill" href="#'+nx.go+'">'+(nx.go==='courses'?'Voir la liste de courses':'Ouvrir la session')+'</a>':'')+'</div>';
  }
  var last='';
  h+='<div class="dayg">';
  ev.forEach(function(e){
    var d=dOf(e.tm);
    if(d!==last){if(last) h+='</ul>';h+='<h2 class="dayh">'+(d===today()?'Aujourd’hui':WD[wdOf(d)])+'<span>'+fmtDM(d)+'</span></h2><ul class="tl">';last=d;}
    var past=e.tm+e.len<n,cls=e.kind==='thaw'?' thaw':(e.kind==='shop'||e.kind==='cook'?' big':'');
    var srcTxt=e.src==='congel'?'<span class="badge cold">Du congélateur</span>':e.src==='frigo'?'<span class="badge fridge">Du frigo</span>':e.src==='frais'?'<span class="badge fresh">Tout juste cuisiné</span>':'';
    h+='<li class="tl-row'+cls+(past?' done':'')+'"><span class="tl-time">'+hm(e.tm)+'</span><div class="tl-body"><span class="tl-k"'+(e.rid?' style="--c:'+colorOf(w,e.rid)+'"':'')+'>'+(e.rid?'<i></i>':'')+esc(e.k)+'</span>'+
      '<span class="tl-txt">'+esc(e.txt)+'</span>'+(srcTxt?'<div class="badges">'+srcTxt+'</div>':'')+(e.sub?'<span class="tl-meta">'+esc(e.sub)+'</span>':'')+'</div>'+
      (e.go?'<a class="btn small" href="#'+e.go+'">Ouvrir</a>':'<span></span>')+'</li>';
  });
  if(last) h+='</ul>';
  h+='</div>';
  h+='<div class="btns">'+(n<toMin(w.shop.d,w.shop.h)?'<button class="btn" data-act="w-edit">Changer mes plats</button>':'')+'<button class="btn" data-act="copy-prog">Copier le programme</button></div>';
  if(S.ui.copyText&&S.ui.copyKind==='prog') h+='<textarea class="copybox" id="copybox" readonly aria-label="Programme à copier">'+esc(S.ui.copyText)+'</textarea>';
  h+='<button class="btn wide" data-act="w-new">Nouvelle semaine</button>';
  h+=(WEB?'<button class="btn fill wide" data-act="ics">Ajouter à mon agenda</button><p class="fine">Les courses, la session et chaque décongélation arrivent dans ton calendrier, avec une alarme à l’heure. Sur iPhone, si rien ne s’ouvre depuis l’icône de l’écran d’accueil, ouvre Mitonne dans Safari et réessaie.</p>':'<p class="fine">Pour être prévenu à l’heure, mets ces étapes dans les rappels de ton téléphone, ou demande à Claude de le faire depuis la conversation.</p>')+KEEPING;
  return h;
}
function shortName(r){var n=r.n.split(',')[0];return n.length>30?n.slice(0,28).replace(/\s+\S*$/,'')+'…':n;}
function cookView(w){
  var ss=session(w),start=toMin(w.cook.d,w.cook.h),bc=boxCount(w);
  var list=ss.tasks.map(function(t,i){return {t:t,i:i};}).filter(function(x){return x.t.kind!=='free';});
  var cur=-1,doneN=0;
  list.forEach(function(x,j){if(w.done[x.i]) doneN++;else if(cur<0) cur=j;});
  var h='<section class="cook"><div class="row" style="justify-content:space-between"><p class="label">'+(cur<0?'Session terminée':'Étape '+(cur+1)+' sur '+list.length)+'</p><button class="btn small" data-act="cookmode">Quitter le mode cuisine</button></div>'+
    '<div class="prog" role="progressbar" aria-label="Avancement de la session" aria-valuemin="0" aria-valuemax="'+list.length+'" aria-valuenow="'+doneN+'"><i style="width:'+Math.round(doneN/Math.max(1,list.length)*100)+'%"></i></div>';
  if(navigator.wakeLock) h+='<button class="btn" data-act="wake">'+(WAKE?'L’écran reste allumé':'Garder l’écran allumé')+'</button>';
  if(cur<0) return h+'<div class="cook-card"><p class="cook-t">C’est fini, bravo.</p><p class="lede">Range les boîtes : '+bc.fridge+' au frigo, '+bc.freezer+' au congélateur. L’onglet Semaine te dira quoi manger et quand décongeler.</p></div></section>';
  var x=list[cur].t,r=B[x.rid],meta=x.p?x.a+' min, puis '+dur(x.p)+(x.eq==='f'?' sur le feu':x.eq.charAt(0)==='o'?' au four':'')+' sans toi':x.a+' min';
  h+='<div class="cook-card"><span class="tl-k" style="--c:'+(r?colorOf(w,x.rid):'var(--ink-2)')+'"><i></i>'+(r?esc(r.n):(x.kind==='oven'?'Four':'Mise en route'))+'</span>'+
    '<p class="cook-when">Prévu à '+hm(start+x.t)+' · '+meta+'</p><p class="cook-t">'+esc(x.txt)+'</p>'+
    '<div class="btns">'+(x.p>=5?'<button class="btn" data-act="timer" data-v="'+list[cur].i+'">Minuteur '+dur(x.p)+'</button>':'')+'<button class="btn fill" data-act="cook-done" data-v="'+list[cur].i+'">Fait, étape suivante</button></div>'+
    (cur>0?'<button class="btn small" data-act="cook-back" data-v="'+list[cur-1].i+'">Revenir à l’étape précédente</button>':'')+'</div>';
  var nx=list[cur+1];
  if(nx){var rn=B[nx.t.rid];h+='<div class="cook-next"><p class="label">Ensuite, vers '+hm(start+nx.t.t)+'</p><p>'+(rn?'<b>'+esc(rn.n)+'</b> · ':'')+esc(nx.t.txt)+'</p></div>';}
  return h+'</section>';
}
function viewBatch(){
  if(!ready()) return loadingView();
  var w=S.week;
  if(!w) return noWeek();
  if(S.ui.cook) return cookView(w);
  var ss=session(w),start=toMin(w.cook.d,w.cook.h),bc=boxCount(w),doneN=0,total=0;
  ss.tasks.forEach(function(t,i){if(t.kind!=='free'){total++;if(w.done[i]) doneN++;}});
  var h='<section class="head"><h1 class="h1">Session de batch cooking</h1><p class="lede">'+WD[wdOf(w.cook.d)]+' '+fmtDM(w.cook.d)+', de '+w.cook.h+' à '+hm(start+ss.span)+' environ. Les heures suivent ton heure de départ : si tu commences plus tard, décale-les d’autant.</p></section>';
  h+='<div class="facts"><div class="fact"><b>'+dur(ss.span)+'</b><span>de session</span></div><div class="fact"><b>'+dur(ss.act)+'</b><span>de travail actif</span></div>'+
    '<div class="fact"><b>'+bc.all+'</b><span>boîtes : '+bc.fridge+' au frigo, '+bc.freezer+' au congélateur</span></div><div class="fact"><b>'+ss.burners+'</b><span>plaque'+(ss.burners>1?'s':'')+' au maximum'+(ss.temps.length?', four à '+ss.temps.join(' puis ')+' °C':'')+'</span></div></div>';
  h+='<section class="block"><h2 class="h2">Les plats</h2><div>'+w.ids.map(function(id){
    var r=B[id],por=portionsOf(w,id);
    return '<div class="dish" style="--c:'+colorOf(w,id)+'"><i></i><div><span class="tape">'+esc(shortName(r))+' · '+fmtDM(w.cook.d)+'</span><div class="dish-s">À écrire sur chaque couvercle · '+por+' portion'+(por>1?'s':'')+' · '+(S.prefs.freezer&&r.co?'se congèle':'frigo, '+r.fr+' jours au plus')+'</div>'+
      '<details><summary>Ingrédients pour la session</summary><ul class="ings">'+r.ing.map(function(x){var q=roundQ(x[0],x[1]*por/4*(w.ap||1)),vt=variantOf(x[0]);return '<li><span>'+esc(ING[x[0]].n)+(vt?' <span class="badge alt">'+vt+'</span>':'')+'</span><span class="q">'+(q?fmtQty(x[0],q):'au goût')+'</span></li>';}).join('')+'</ul></details></div></div>';
  }).join('')+'</div></section>';
  h+='<button class="btn fill wide" data-act="cookmode">Passer en mode cuisine</button><p class="fine">Une seule étape à la fois, en grand, avec son minuteur : pratique quand tu as les mains dans la farine.</p>';
  h+='<section class="block"><div class="row" style="justify-content:space-between"><h2 class="h2">Pas à pas</h2><span class="fine">'+doneN+' sur '+total+' faites</span></div>'+
    '<div class="prog" role="progressbar" aria-label="Avancement de la session" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+doneN+'"><i style="width:'+(total?Math.round(doneN/total*100):0)+'%"></i></div>';
  if(navigator.wakeLock) h+='<button class="btn" data-act="wake">'+(WAKE?'L’écran reste allumé':'Garder l’écran allumé pendant la session')+'</button>';
  h+='<ul class="tl">';
  ss.tasks.forEach(function(t,i){
    var r=B[t.rid],clock=hm(start+t.t),meta='';
    if(t.kind==='free'){h+='<li class="tl-row free"><span class="tl-time">'+clock+'</span><div class="tl-body"><span class="tl-txt">'+t.txt+'</span><span class="tl-meta">environ '+dur(t.a)+'</span></div><span></span></li>';return;}
    if(t.p) meta=t.a+' min, puis '+dur(t.p)+(t.eq==='f'?' sur le feu':t.eq.charAt(0)==='o'?' au four':'')+' sans toi';
    else meta=t.a+' min';
    var label=r?esc(r.n):(t.kind==='oven'?'Four':'Mise en route');
    var timerBtn=t.p>=5?'<button class="btn small" data-act="timer" data-v="'+i+'">Minuteur '+dur(t.p)+'</button>':'';
    h+='<li class="tl-row'+(w.done[i]?' done':'')+'"><span class="tl-time">'+clock+'</span><div class="tl-body"><span class="tl-k" style="--c:'+(r?colorOf(w,t.rid):'var(--ink-2)')+'"><i></i>'+label+'</span>'+
      '<span class="tl-txt">'+esc(t.txt)+'</span><span class="tl-meta">'+meta+'</span>'+(timerBtn?'<div>'+timerBtn+'</div>':'')+'</div>'+
      '<input type="checkbox" id="bt-'+i+'" data-bt="'+i+'"'+(w.done[i]?' checked':'')+' aria-label="Étape faite"></li>';
  });
  h+='</ul></section>';
  h+='<section class="block"><h2 class="h2">Et ensuite</h2><p class="lede">L’onglet Semaine te dit chaque jour quoi manger et, la veille, quoi sortir du congélateur.</p>'+KEEPING+'</section>';
  return h;
}
function itemHtml(row,w){
  var k=row.k,a=row.a,on=w.checked[k],lt=leftTxt(row);
  var sub=a?esc(a.n)+(a.d?' · '+esc(a.d):'')+' · '+esc(packsTxt(row))+(untilTxt(a)?' · '+esc(untilTxt(a)):''):'',vt=variantOf(k);
  return '<li class="item'+(on?' done':'')+'"><input type="checkbox" id="ck-'+k+'" data-ck="'+k+'"'+(on?' checked':'')+'>'+
    '<label class="item-body" for="ck-'+k+'"><span class="item-top"><span class="item-n">'+esc(ING[k].n)+'</span><span class="item-q">'+fmtQty(k,row.q)+'</span></span>'+
    (vt?'<span class="item-left">Prends la version '+vt+'</span>':'')+(sub?'<span class="item-sub">'+sub+'</span>':'')+(lt?'<span class="item-left">'+lt+'</span>':'')+'</label>'+(a?tag(a):'<span></span>')+'</li>';
}
function byRayon(rows,w){
  var h='',cur='';
  rows.forEach(function(r){var rc=ING[r.k].r;if(rc!==cur){if(cur) h+='</ul>';h+='<h3 class="sub-h">'+RAYONS[rc]+'</h3><ul class="items">';cur=rc;}h+=itemHtml(r,w);});
  return cur?h+'</ul>':h;
}
function viewCourses(){
  if(!ready()) return loadingView();
  var w=S.week;
  if(!w) return noWeek();
  var L=shopping(w);
  var h='<section class="head"><h1 class="h1">Liste de courses</h1><p class="lede">'+WD[wdOf(w.shop.d)]+' '+fmtDM(w.shop.d)+' à '+w.shop.h+' · '+L.n+' articles pour '+w.ids.length+' plats</p></section>'+stateNote(w.shop.d);
  ORDER.forEach(function(st){
    var rows=L.byStore[st];if(!rows) return;
    var sum=0;rows.forEach(function(r){sum+=r.c.total;});
    h+='<section class="grp"><h2 class="grp-h">'+STORES[st]+'<span>'+rows.length+' produit'+(rows.length>1?'s':'')+' · env. '+fmtP(sum)+'</span></h2>'+byRayon(rows,w)+'</section>';
  });
  var restKeys=RORDER.filter(function(rc){return L.rest[rc];});
  if(restKeys.length){
    h+='<section class="grp"><h2 class="grp-h">Sans action cette semaine<span>dans le magasin de ton choix</span></h2>';
    restKeys.forEach(function(rc){h+='<h3 class="sub-h">'+RAYONS[rc]+'</h3><ul class="items">'+L.rest[rc].map(function(r){return itemHtml(r,w);}).join('')+'</ul>';});
    h+='</section>';
  }
  if(L.placard.length){
    h+='<section class="grp"><h2 class="grp-h">Placard<span>vérifie ce qu’il te reste</span></h2><p class="lede">'+L.placard.map(function(r){
      var vt=variantOf(r.k);return esc(ING[r.k].n)+(vt?' <b>'+vt+'</b>':'')+(r.a?' (en action chez '+STORES[r.a.st]+', '+fmtP(r.a.p)+')':'');}).join(', ')+', sel, poivre.</p></section>';
  }
  if(L.pay>0) h+='<div class="totals"><span>Produits en action</span><span><b>'+fmtP(L.pay)+'</b>'+(L.save>0.005?' au lieu de '+fmtP(L.pay+L.save):'')+'</span></div>'+
    '<p class="fine">Seuls les produits en action ont un prix. Le reste de la liste n’est pas chiffré, car les prix hors action ne sont pas relevés.</p>';
  h+='<p class="fine">La liste comprend aussi ce qui se prépare le jour du repas : riz, pâtes, pain, salade.</p>';
  if(L.n) h+='<button class="btn fill wide" data-act="copy">Copier la liste</button>';
  if(S.ui.copyText&&S.ui.copyKind==='list') h+='<textarea class="copybox" id="copybox" readonly aria-label="Liste de courses à copier">'+esc(S.ui.copyText)+'</textarea>';
  if(Object.keys(w.checked).length) h+='<button class="btn wide" data-act="uncheck">Tout décocher</button>';
  return h;
}
function viewActions(){
  if(!ready()) return loadingView();
  var D=S.week&&!weekOver(S.week)?S.week.shop.d:(S.ui.wiz?S.ui.wiz.shopD:today()),t=today();
  var list=S.flat.filter(function(a){return valid(a,D);});
  var h='<section class="head"><h1 class="h1">Actions</h1><p class="lede">'+list.length+' action'+(list.length>1?'s':'')+' alimentaire'+(list.length>1?'s':'')+' valable'+(list.length>1?'s':'')+' le '+fmtDay(D)+'</p></section>';
  h+=blk('Magasin','<div class="chips">'+chip('fstore','all','Tous',S.ui.fStore==='all')+ORDER.map(function(st){return chip('fstore',st,STORES[st],S.ui.fStore===st);}).join('')+'</div>');
  h+=blk('Rayon','<div class="chips">'+chip('fcat','all','Tous',S.ui.fCat==='all')+RORDER.map(function(rc){return chip('fcat',rc,RAYONS[rc],S.ui.fCat===rc);}).join('')+'</div>');
  var shown=list.filter(function(a){return (S.ui.fStore==='all'||a.st===S.ui.fStore)&&(S.ui.fCat==='all'||a.c===S.ui.fCat);})
    .sort(function(a,b){return b.pct-a.pct||a.n.localeCompare(b.n,'fr');});
  if(!shown.length) h+='<p class="note">'+(S.flat.length?'Aucune action relevée pour ce filtre le '+fmtDay(D)+'.':'Aucune action n’a encore été relevée.')+'</p>';
  else h+='<ul class="acts">'+shown.map(function(a){
    var until=a.to?(a.to===t?'<span class="last">dernier jour</span>':'jusqu’au '+fmtDay(a.to)):'sans date de fin';
    return '<li class="act"><div class="act-txt"><span class="store">'+STORES[a.st]+'</span><span class="act-n">'+esc(a.n)+'</span><span class="act-d">'+
      (a.d?esc(a.d)+' · ':'')+until+(a.cond?' · '+esc(a.cond):'')+'</span></div>'+tag(a)+'</li>';
  }).join('')+'</ul>';
  return h;
}
function viewReglages(){
  var p=S.prefs;
  var h='<section class="head"><h1 class="h1">Réglages</h1><p class="lede">Tes goûts et ton rythme. Les changements s’appliquent quand tu prépares ta prochaine semaine.</p></section>'+
    '<button class="btn wide" data-act="quiz">Refaire le questionnaire</button>';
  h+='<section class="sect"><h2 class="h2">À table</h2>'+ctlPeople()+ctlBig()+'</section>';
  h+='<section class="sect"><h2 class="h2">Repas couverts par le batch</h2>'+ctlGrid()+'</section>';
  h+='<section class="sect"><h2 class="h2">Ce que je mange</h2>'+ctlDiet()+blk('Allergies et intolérances',ctlAlg())+blk('Je n’aime pas',ctlNo())+ALLERGY+'</section>';
  h+='<section class="sect"><h2 class="h2">Cuisines préférées</h2>'+ctlCuis()+'</section>';
  h+='<section class="sect"><h2 class="h2">Ma cuisine</h2>'+blk('Four',ctlOven())+blk('Congélateur',ctlFreezer())+blk('Côté épices',ctlSpice())+blk('Plats différents par semaine',ctlDish())+'</section>';
  h+='<section class="sect"><h2 class="h2">Courses</h2>'+blk('Mes magasins',ctlStores())+blk('D’habitude, je fais mes courses',ctlHabit())+blk('Ma priorité',ctlPrio())+'</section>';
  h+='<section class="sect"><h2 class="h2">Décongélation</h2>'+blk('Heure du rappel, la veille au soir',ctlThaw())+KEEPING+'</section>';
  h+='<section class="sect"><h2 class="h2">Mes plats</h2>';
  if(p.fav.length) h+=blk('Favoris, proposés plus souvent','<ul class="srcs">'+p.fav.filter(function(id){return B[id];}).map(function(id){
    return '<li><b>'+esc(B[id].n)+'</b><button class="btn small" id="b-unfav-'+id+'" data-act="fav" data-v="'+id+'">Retirer</button></li>';}).join('')+'</ul>');
  else h+='<p class="fine">Touche le cœur d’un plat quand tu prépares ta semaine : Mitonne le proposera plus souvent.</p>';
  if(p.ban.length) h+='<div class="block"><p class="fine">Écartés : '+p.ban.filter(function(id){return B[id];}).map(function(id){return esc(B[id].n);}).join(', ')+'.</p><button class="btn" data-act="unban">Les proposer à nouveau</button></div>';
  h+='</section>';
  if(WEB) h+='<section class="sect"><h2 class="h2">Sauvegarde</h2><p class="fine">Tes réglages et ta semaine restent sur ce téléphone. Garde une copie de temps en temps, pour la retrouver si tu changes de téléphone ou effaces ton navigateur.</p>'+
    '<div class="btns"><button class="btn" data-act="backup">Sauvegarder mes données</button><label class="btn" for="restore" style="display:inline-flex;align-items:center;justify-content:center">Restaurer une sauvegarde</label></div><input type="file" id="restore" accept="application/json,.json" hidden></section>';
  h+='<section class="sect"><h2 class="h2">D’où viennent les prix</h2>'+refreshBlock();
  var rows=ORDER.filter(function(st){return S.actions[st];});
  if(rows.length) h+='<ul class="srcs">'+rows.map(function(st){
    var d=S.actions[st],src=Array.isArray(d.sources)?d.sources.filter(function(x){return typeof x==='string';}).join(', '):'';
    return '<li><b>'+STORES[st]+'</b><span>'+(isIso(d.updated)?'relevé le '+fmtDay(d.updated):'date inconnue')+(src?' · '+esc(src):'')+'</span></li>';
  }).join('')+'</ul>';
  else h+='<p class="fine">Aucun relevé chargé pour l’instant.</p>';
  h+='<p class="fine">Mitonne relève les actions publiées par les enseignes le lundi, le jeudi et le vendredi matin. Les prix hors action ne sont pas suivis.</p>'+
    '<p class="fine">Les relevés Migros, Coop, Aldi et Lidl valent pour la Suisse romande (canton de Vaud). Les actions Migros peuvent différer d’une coopérative régionale à l’autre : l’étiquette en magasin fait foi.</p></section>';
  return h;
}
function actionsSig(){
  return JSON.stringify(ORDER.map(function(st){var d=S.actions[st];return d?[d.updated,JSON.stringify(d.items||[]).length]:0;}));
}
function recentFire(){return Date.now()-(S.prefs.lastFire||0)<20*60000;}
function refreshBlock(){
  var R=S.refresh,recent=recentFire();
  var auto='<p class="fine">Les promotions se mettent aussi à jour toutes seules le lundi, le jeudi et le vendredi à 9:37.</p>';
  if(WEB) return '<button class="btn fill wide" id="b-refresh" data-act="refresh">Recharger les promotions</button><p class="fine">Mitonne relit les derniers prix publiés sur le site. Pour lancer un nouveau relevé tout de suite, ouvre <a href="'+ART_URL+'" target="_blank" rel="noopener">ta version dans Claude</a> et utilise son bouton Actualiser.</p>'+auto;
  if(R.avail===false) return '<p class="fine">L’actualisation à la demande n’est pas disponible dans cet affichage. Ouvre Mitonne dans claude.ai pour l’utiliser.</p>'+auto;
  if(R.avail===null) return auto;
  var label=R.busy?'Lancement du relevé…':(recent&&R.waiting?'Relevé lancé à '+hm(Math.floor(S.prefs.lastFire/60000)):'Actualiser les promotions');
  var h='<button class="btn fill wide" id="b-refresh" data-act="refresh"'+(R.busy||(recent&&R.waiting)?' disabled':'')+'>'+label+'</button>';
  if(R.msg) h+='<p class="'+(R.kind==='err'?'note':'fine')+'">'+esc(R.msg)+'</p>';
  else if(recent&&R.waiting) h+='<p class="fine">Claude visite les sites des magasins. Les nouveaux prix s’affichent ici tout seuls, en général d’ici 5 à 15 minutes. Si rien ne change, c’est que les actions sont restées les mêmes.</p>';
  return h+'<p class="fine">Chaque actualisation lance une courte session de Claude sur ton compte.</p>'+auto;
}
function refreshPromos(){
  if(WEB){fetchActions(true);return;}
  var R=S.refresh;
  if(!MCP||R.busy) return;
  R.busy=true;R.msg='';R.kind='';render();
  MCP.callTool(MCP_SERVER,'fire_trigger',{trigger_id:TRIGGER}).then(function(){
    R.busy=false;R.waiting=true;R.sig0=actionsSig();S.prefs.lastFire=Date.now();
    save();render();toast('Relevé des promotions lancé');
  },function(err){
    var c=err&&err.code;R.busy=false;R.kind='err';
    if(c==='server_unavailable'||c==='upstream_error'||c==='cancelled'){
      R.waiting=true;R.sig0=actionsSig();S.prefs.lastFire=Date.now();save();
      R.msg='Le service n’a pas répondu à temps. Le relevé a peut-être démarré quand même : attends 20 minutes avant de réessayer.';
    }
    else if(c==='approval_required'||c==='not_in_manifest') R.msg='Mitonne a besoin de ton accord pour lancer le relevé. Appuie à nouveau sur le bouton et choisis Autoriser.';
    else if(c==='server_not_connected'||c==='selection_required'||c==='server_not_found') R.msg='Le connecteur Claude Code Remote n’est pas disponible sur ton compte. Ajoute-le dans claude.ai, dans Réglages puis Connecteurs.';
    else if(c==='needs_reauth') R.msg='Reconnecte Claude Code Remote dans claude.ai, dans Réglages puis Connecteurs, puis réessaie.';
    else if(c==='blocked_by_policy') R.msg='Ton organisation ne permet pas de lancer cette tâche depuis une page.';
    else if(c==='tool_error') R.msg='La tâche de relevé n’a pas pu démarrer'+(err.message?' : '+String(err.message).slice(0,160):'.');
    else if(c==='not_granted'||c==='capability_disabled'||c==='capability_removed'){R.avail=false;R.msg='';}
    else R.msg='Le relevé n’a pas pu être lancé. Réessaie dans un moment.';
    render();
  });
}
function downloadFile(name,text,type){
  try{
    var b=new Blob([text],{type:type}),u=URL.createObjectURL(b),a=document.createElement('a');
    a.href=u;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(u);a.remove();},5000);
    return true;
  }catch(e){return false;}
}
function icsDate(m){var d=new Date(m*60000);function z(n){return ('0'+n).slice(-2);}return d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+'T'+z(d.getHours())+z(d.getMinutes())+'00';}
function icsEsc(x){return String(x).replace(/\\/g,'\\\\').replace(/;/g,'\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');}
function icsFold(line){var out=[];while(line.length>60){out.push(line.slice(0,60));line=' '+line.slice(60);}out.push(line);return out.join('\r\n');}
function icsText(w){
  var stamp=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z',L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Mitonne//Batch cooking//FR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Mitonne'];
  events(w).filter(function(e){return e.kind!=='meal';}).forEach(function(e,i){
    var len=e.kind==='cook'?e.len:e.kind==='shop'?60:15;
    var title=e.kind==='shop'?'Mitonne · Courses':e.kind==='cook'?'Mitonne · Batch cooking':'Mitonne · Décongeler';
    var desc=e.txt+(e.kind==='shop'?'\n\n'+listText(w):'');
    L.push('BEGIN:VEVENT','UID:mitonne-'+w.cook.d+'-'+e.kind+'-'+i+'@mitonne','DTSTAMP:'+stamp,'DTSTART:'+icsDate(e.tm),'DTEND:'+icsDate(e.tm+len),
      'SUMMARY:'+icsEsc(title),'DESCRIPTION:'+icsEsc(desc),
      'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+icsEsc(title+' : '+e.txt),'TRIGGER:'+(e.kind==='thaw'?'PT0M':'-PT30M'),'END:VALARM','END:VEVENT');
  });
  L.push('END:VCALENDAR');
  return L.map(icsFold).join('\r\n')+'\r\n';
}
function fetchActions(manual){
  return fetch('data/actions.json',{cache:'no-cache'}).then(function(r){if(!r.ok) throw new Error('http '+r.status);return r.json();}).then(function(j){
    var m={},st=j&&j.stores||{},before=actionsSig();
    ORDER.forEach(function(k){if(st[k]&&typeof st[k]==='object') m[k]=st[k];});
    S.actions=m;flatten();S.aState='ready';
    if(manual) toast(actionsSig()!==before?'Promotions mises à jour':'Pas de nouvelles promotions pour l’instant');
    render();
  }).catch(function(){
    if(S.aState!=='ready') S.aState='off';
    if(manual) toast('Impossible de joindre le site. Vérifie ta connexion.');
    render();
  });
}
var VIEWS={semaine:viewSemaine,courses:viewCourses,batch:viewBatch,actions:viewActions,reglages:viewReglages};
function mode(){if(!S.loaded) return 'loading';if(!S.prefs.done||S.ui.q!=null) return 'quiz';if(S.ui.wiz) return 'wiz';return 'tabs';}
function render(){
  var fresh=document.getElementById('fresh'),view=document.getElementById('view'),tabs=document.getElementById('tabs');
  if(!view) return;
  var fid=document.activeElement&&document.activeElement.id;
  var up='';ORDER.forEach(function(st){var d=S.actions[st];if(d&&isIso(d.updated)&&d.updated>up) up=d.updated;});
  fresh.textContent=S.aState==='loading'?'Lecture des actions…':(S.aState==='ready'&&up?'Actions relevées le '+fmtDay(up):(S.aState==='ready'?'Aucun relevé':'Actions injoignables'));
  var md=mode();
  if(md==='quiz'&&S.ui.q==null) S.ui.q=0;
  tabs.hidden=md==='quiz'||md==='wiz';
  var t=tabs.querySelectorAll('.tab');
  for(var i=0;i<t.length;i++){
    if(t[i].getAttribute('data-tab')===S.ui.tab) t[i].setAttribute('aria-current','page');
    else t[i].removeAttribute('aria-current');
  }
  view.innerHTML=md==='quiz'?viewQuiz():md==='wiz'?viewWiz():md==='tabs'?VIEWS[S.ui.tab]():loadingView();
  if(fid){var f=document.getElementById(fid);if(f&&f.focus) f.focus({preventScroll:true});}
}
var toastT=null;
function toast(msg){
  var el=document.getElementById('toast');
  el.textContent=msg;el.hidden=false;
  clearTimeout(toastT);toastT=setTimeout(function(){el.hidden=true;},2800);
}

/* ---------- minuteurs ---------- */
var TIMERS=[],TICK=null,AUDIO=null,WAKE=null;
function beep(){
  try{
    if(!AUDIO) return;
    [0,0.35,0.7].forEach(function(d){
      var o=AUDIO.createOscillator(),g=AUDIO.createGain();
      o.frequency.value=880;o.connect(g);g.connect(AUDIO.destination);
      g.gain.setValueAtTime(0.2,AUDIO.currentTime+d);g.gain.exponentialRampToValueAtTime(0.001,AUDIO.currentTime+d+0.3);
      o.start(AUDIO.currentTime+d);o.stop(AUDIO.currentTime+d+0.3);
    });
  }catch(e){}
}
function startTimer(label,min){
  try{if(!AUDIO){var C=window.AudioContext||window.webkitAudioContext;if(C) AUDIO=new C();}else if(AUDIO.resume) AUDIO.resume();}catch(e){}
  TIMERS.push({id:String(Date.now())+TIMERS.length,label:label,end:Date.now()+min*60000,rang:false});
  if(!TICK) TICK=setInterval(tick,1000);
  tick();toast('Minuteur lancé : '+label+', '+dur(min));
}
function tick(){
  var box=document.getElementById('timers'),inn=document.getElementById('timers-in'),now=Date.now();
  TIMERS=TIMERS.filter(function(x){return !(x.rang&&now-x.end>60000);});
  if(!TIMERS.length){box.hidden=true;clearInterval(TICK);TICK=null;return;}
  box.hidden=false;
  inn.innerHTML=TIMERS.map(function(x){
    var s=Math.max(0,Math.round((x.end-now)/1000)),txt=s?(Math.floor(s/3600)?Math.floor(s/3600)+':':'')+('0'+Math.floor(s%3600/60)).slice(-2)+':'+('0'+s%60).slice(-2):'Prêt';
    if(!s&&!x.rang){x.rang=true;beep();toast(x.label+' : c’est prêt');}
    return '<div class="timer'+(s?'':' ring')+'"><span>'+esc(x.label)+'</span><b>'+txt+'</b><button data-act="timer-x" data-v="'+x.id+'" aria-label="Arrêter le minuteur">×</button></div>';
  }).join('');
}

/* ---------- gestes ---------- */
function toggleIn(arr,v){var ix=arr.indexOf(v);if(ix>=0) arr.splice(ix,1);else arr.push(v);}
function prefChanged(){save();render();}
function go(tab){S.ui.tab=tab;try{if(location.hash!=='#'+tab) history.replaceState(null,'','#'+tab);}catch(e){}}
function validateWeek(){
  var wz=S.ui.wiz,P=S.prefs;
  var w=buildWeek(wz.shopD,wz.shopH,wz.mode,wz.cookH,wz.picks);
  if(wz.edit&&S.week&&S.week.shop.d===w.shop.d) w.checked=S.week.checked;
  S.week=w;
  P.hist=P.hist.filter(function(x){return x.w!==w.shop.d;});
  P.hist.unshift({w:w.shop.d,ids:w.ids.slice()});
  P.hist=P.hist.slice(0,3);
  P.shopH=wz.shopH;
  S.ui.wiz=null;S.ui.copyText=null;go('semaine');
  save();render();window.scrollTo(0,0);toast('Ta semaine est prête');
}
function onClick(e){
  var el=e.target.closest?e.target.closest('[data-act]'):null;
  if(!el||el.disabled) return;
  var act=el.getAttribute('data-act'),v=el.getAttribute('data-v'),p=S.prefs,wz=S.ui.wiz;
  switch(act){
  case 'w-new': S.ui.wiz=newWiz(false);render();window.scrollTo(0,0);break;
  case 'w-edit': S.ui.wiz=newWiz(true);render();window.scrollTo(0,0);break;
  case 'w-cancel': S.ui.wiz=null;render();break;
  case 'w-day': if(wz&&isIso(v)){wz.shopD=v;render();}break;
  case 'w-mode': if(wz){wz.mode=v;render();}break;
  case 'w-next': if(wz){wz.step=1;wz.page=0;render();window.scrollTo(0,0);}break;
  case 'w-back': if(wz){wz.step=0;render();window.scrollTo(0,0);}break;
  case 'w-more': if(wz){wz.page++;render();}break;
  case 'w-pick': if(wz){toggleIn(wz.picks,v);render();}break;
  case 'w-auto': if(wz){wz.picks=autoPick(wz);render();}break;
  case 'w-ok': if(wz&&wz.picks.length) validateWeek();break;
  case 'fav': toggleIn(p.fav,v);save();render();break;
  case 'ban': if(p.ban.indexOf(v)<0) p.ban.push(v);if(wz) wz.picks=wz.picks.filter(function(x){return x!==v;});save();render();toast('Ce plat ne sera plus proposé');break;
  case 'unban': p.ban=[];save();render();toast('Tous les plats peuvent revenir');break;
  case 'refresh': refreshPromos();break;
  case 'alg': toggleIn(p.alg,v);prefChanged();break;
  case 'big': p.big=v==='1';prefChanged();break;
  case 'cookmode': S.ui.cook=!S.ui.cook;render();window.scrollTo(0,0);break;
  case 'cook-done': if(S.week){S.week.done[v]=1;save();render();window.scrollTo(0,0);}break;
  case 'cook-back': if(S.week){delete S.week.done[v];save();render();window.scrollTo(0,0);}break;
  case 'ics':
    if(S.week&&downloadFile('mitonne-semaine-'+S.week.cook.d+'.ics',icsText(S.week),'text/calendar;charset=utf-8')) toast('Ouvre le fichier pour ajouter les rappels à ton agenda');
    else toast('Le fichier n’a pas pu être créé.');
    break;
  case 'backup':
    if(downloadFile('mitonne-sauvegarde-'+today()+'.json',JSON.stringify(snapshot(),null,1),'application/json')) toast('Sauvegarde téléchargée');
    else toast('La sauvegarde n’a pas pu être créée.');
    break;
  case 'fstore': S.ui.fStore=v;render();break;
  case 'fcat': S.ui.fCat=v;render();break;
  case 'people':
    var nv=Math.min(8,Math.max(1,p.people+(+el.getAttribute('data-s'))));
    if(nv!==p.people){p.people=nv;prefChanged();}
    break;
  case 'grid': var g=+el.getAttribute('data-g');if(g>=0&&g<14){p.grid[g]=!p.grid[g];prefChanged();}break;
  case 'preset': p.grid=presetGrid(v);prefChanged();break;
  case 'diet': p.diet=v;prefChanged();break;
  case 'no': toggleIn(p.no,v);prefChanged();break;
  case 'cu': toggleIn(p.cu,v);prefChanged();break;
  case 'cu-all': p.cu=[];prefChanged();break;
  case 'spice': p.spice=+v;prefChanged();break;
  case 'oven': p.oven=v==='1';prefChanged();break;
  case 'freezer': p.freezer=v==='1';prefChanged();break;
  case 'ndish': p.nDish=+v;prefChanged();break;
  case 'habit': var hb=HABITS[+v];if(hb){p.shopDay=hb[0];p.shopH=hb[1];prefChanged();}break;
  case 'thaw': p.thawH=v;prefChanged();break;
  case 'prio': p.prio=v;prefChanged();break;
  case 'store': toggleIn(p.stores,v);p.stores=ORDER.filter(function(x){return p.stores.indexOf(x)>=0;});prefChanged();break;
  case 'q-next': S.ui.q=Math.min(QN-1,(S.ui.q||0)+1);render();window.scrollTo(0,0);break;
  case 'q-back': S.ui.q=Math.max(0,(S.ui.q||0)-1);render();window.scrollTo(0,0);break;
  case 'q-cancel': S.ui.q=null;render();break;
  case 'q-done': p.done=true;S.ui.q=null;if(!S.week||weekOver(S.week)) S.ui.wiz=newWiz(false);save();render();window.scrollTo(0,0);break;
  case 'quiz': S.ui.q=0;render();window.scrollTo(0,0);break;
  case 'uncheck': if(S.week){S.week.checked={};save();render();}break;
  case 'timer':
    var ss=S.week&&session(S.week),tk=ss&&ss.tasks[+v];
    if(tk) startTimer(B[tk.rid]?B[tk.rid].n:'Four',tk.p);
    break;
  case 'timer-x': TIMERS=TIMERS.filter(function(x){return x.id!==v;});tick();break;
  case 'wake':
    if(WAKE){try{WAKE.release();}catch(err){}WAKE=null;render();break;}
    try{navigator.wakeLock.request('screen').then(function(l){WAKE=l;l.addEventListener('release',function(){WAKE=null;});render();},function(){toast('L’écran ne peut pas rester allumé ici.');});}catch(err){toast('L’écran ne peut pas rester allumé ici.');}
    break;
  case 'copy': case 'copy-prog':
    if(!S.week) break;
    var kind=act==='copy'?'list':'prog',txt=kind==='list'?listText(S.week):programText(S.week);
    var fallback=function(){S.ui.copyText=txt;S.ui.copyKind=kind;render();var b=document.getElementById('copybox');if(b){b.focus();b.select();}toast('Sélectionne le texte et copie-le.');};
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function(){toast(kind==='list'?'Liste copiée':'Programme copié');},fallback);
      else fallback();
    }catch(err){fallback();}
    break;
  }
}
function onChange(e){
  var t=e.target;if(!t||!t.getAttribute) return;
  if(t.id==='restore'&&t.files&&t.files[0]){
    var fr=new FileReader();
    fr.onload=function(){try{var d=JSON.parse(fr.result);if(!d||!d.prefs) throw new Error('vide');S.week=null;S.prefs=defaults();apply(d);save();render();toast('Sauvegarde restaurée');}catch(err){toast('Ce fichier n’est pas une sauvegarde de Mitonne.');}};
    fr.readAsText(t.files[0]);t.value='';return;
  }
  var k=t.getAttribute('data-ck'),bt=t.getAttribute('data-bt'),inp=t.getAttribute('data-in');
  if(k&&S.week){
    if(t.checked) S.week.checked[k]=1;else delete S.week.checked[k];
    var li=t.closest('.item');if(li) li.classList.toggle('done',t.checked);
    save();
  }else if(bt!=null&&S.week){
    if(t.checked) S.week.done[bt]=1;else delete S.week.done[bt];
    save();render();
  }else if(inp&&S.ui.wiz&&isHM(t.value)){
    S.ui.wiz[inp]=t.value;render();
  }
}
function onHash(e){
  var t=(location.hash||'').replace('#','');
  S.ui.tab=TABS.indexOf(t)>=0?t:'semaine';
  if(S.ui.wiz&&e) S.ui.wiz=null;
  render();
  if(e) window.scrollTo(0,0);
}

/* ---------- mémoire ---------- */
var LS='mitonne-state',LS_OLD='popote-state',stateRef=null,saveT=null,saving=false,dirty=false;
function snapshot(){
  var p=S.prefs,w=S.week;
  return {v:3,
    prefs:{done:!!p.done,people:p.people,grid:p.grid.map(Boolean),diet:p.diet,no:p.no.slice(),cu:p.cu.slice(),spice:p.spice,oven:!!p.oven,freezer:!!p.freezer,nDish:p.nDish,
      prio:p.prio,stores:p.stores.slice(),shopDay:p.shopDay,shopH:p.shopH,thawH:p.thawH,fav:p.fav.slice(),ban:p.ban.slice(),hist:p.hist.slice(),lastFire:p.lastFire||0,alg:p.alg.slice(),big:!!p.big},
    week:w?{shop:w.shop,mode:w.mode,cookH:w.cookH,cook:w.cook,ids:w.ids.slice(),people:w.people,ap:w.ap||1,slots:w.slots.map(function(s){return {d:s.d,m:s.m,r:s.r,src:s.src};}),done:Object.assign({},w.done),checked:Object.assign({},w.checked)}:null};
}
function apply(d){
  if(!d||typeof d!=='object') return;
  var p=d.prefs,P=S.prefs;
  if(p&&typeof p==='object'){
    if(p.people>=1&&p.people<=8) P.people=Math.round(p.people);
    if(Array.isArray(p.grid)&&p.grid.length===14) P.grid=p.grid.map(Boolean);
    if(DIETS.some(function(x){return x[0]===p.diet;})) P.diet=p.diet;
    if(Array.isArray(p.no)) P.no=p.no.filter(function(x){return NO[x];});
    if(Array.isArray(p.cu)) P.cu=p.cu.filter(function(x){return CUIS[x];});
    if(p.spice===0||p.spice===1||p.spice===2) P.spice=p.spice;
    if(typeof p.oven==='boolean') P.oven=p.oven;
    if(typeof p.freezer==='boolean') P.freezer=p.freezer;
    if([0,2,3,4,5].indexOf(p.nDish)>=0) P.nDish=p.nDish;
    if(p.prio==='eco'||p.prio==='var') P.prio=p.prio;
    if(Array.isArray(p.stores)) P.stores=ORDER.filter(function(s){return p.stores.indexOf(s)>=0;});
    if(p.shopDay==='fri'||p.shopDay==='sat') P.shopDay=p.shopDay;
    if(isHM(p.shopH)) P.shopH=p.shopH;
    if(THAWH.indexOf(p.thawH)>=0) P.thawH=p.thawH;
    if(Array.isArray(p.fav)) P.fav=p.fav.filter(function(id){return B[id];});
    if(Array.isArray(p.ban)) P.ban=p.ban.filter(function(id){return B[id];});
    if(Array.isArray(p.hist)) P.hist=p.hist.filter(function(x){return x&&isIso(x.w)&&Array.isArray(x.ids);}).slice(0,3).map(function(x){return {w:x.w,ids:x.ids.filter(function(id){return B[id];})};});
    if(typeof p.lastFire==='number'&&p.lastFire>0) P.lastFire=p.lastFire;
    if(Array.isArray(p.alg)) P.alg=p.alg.filter(function(x){return algLetter(x);});
    if(typeof p.big==='boolean') P.big=p.big;
    P.done=(d.v===2||d.v===3)&&p.done===true;
  }
  var w=d.week;
  if(d.v===3&&w&&w.shop&&isIso(w.shop.d)&&isHM(w.shop.h)&&w.cook&&isIso(w.cook.d)&&isHM(w.cook.h)&&Array.isArray(w.ids)&&Array.isArray(w.slots)){
    var ids=w.ids.filter(function(id){return B[id];});
    var slots=w.slots.filter(function(s){return s&&isIso(s.d)&&(s.m===0||s.m===1);}).map(function(s){
      var r=B[s.r]?s.r:'';return {d:s.d,m:s.m,r:r,src:r&&['frais','frigo','congel'].indexOf(s.src)>=0?s.src:'libre'};});
    if(ids.length&&slots.length) S.week={shop:{d:w.shop.d,h:w.shop.h},mode:w.mode==='next'?'next':'after',cookH:isHM(w.cookH)?w.cookH:'10:00',cook:{d:w.cook.d,h:w.cook.h},
      ids:ids,people:w.people>=1&&w.people<=8?w.people:P.people,ap:w.ap===1.25?1.25:1,slots:slots,done:w.done&&typeof w.done==='object'?w.done:{},checked:w.checked&&typeof w.checked==='object'?w.checked:{}};
  }
}
function loadLocal(){try{var raw=localStorage.getItem(LS)||localStorage.getItem(LS_OLD);if(raw) apply(JSON.parse(raw));}catch(e){}}
function save(){
  if(!S.loaded) return;
  dirty=true;clearTimeout(saveT);saveT=setTimeout(flush,500);
}
function flush(){
  if(saving||!dirty) return;
  dirty=false;
  var body=snapshot();
  if(!stateRef){try{localStorage.setItem(LS,JSON.stringify(body));}catch(e){}return;}
  saving=true;
  stateRef.set(body).then(function(){saving=false;if(dirty) flush();},function(){
    saving=false;stateRef=null;
    try{localStorage.setItem(LS,JSON.stringify(body));}catch(e){}
  });
}
function timeout(p,ms){return Promise.race([p,new Promise(function(res){setTimeout(function(){res(undefined);},ms);})]);}
function loaded(){S.loaded=true;render();}
function init(){
  if(WEB){
    loadLocal();S.loaded=true;S.refresh.avail=true;render();
    fetchActions(false);
    try{if(navigator.storage&&navigator.storage.persist) navigator.storage.persist();}catch(e){}
    if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function(){});
    document.addEventListener('visibilitychange',function(){if(!document.hidden) fetchActions(false);});
    return;
  }
  var slowT=setTimeout(function(){if(S.aState==='loading'){S.aState='slow';render();}},10000);
  var use=window.claude&&typeof window.claude.use==='function'?function(n){return window.claude.use(n).catch(function(){return null;});}:function(){return Promise.resolve(null);};
  use('mcp').then(function(m){
    if(!m){S.refresh.avail=false;render();return;}
    MCP=m;
    m.listTools(MCP_SERVER).then(function(r){
      var sv=(r&&r.servers||[]).filter(function(x){return x.server===MCP_SERVER;})[0];
      S.refresh.avail=!!(sv&&sv.tools.some(function(t){return t.name==='fire_trigger';}));
      if(sv&&sv.authStatus==='needs_reauth'){S.refresh.kind='err';S.refresh.msg='Reconnecte Claude Code Remote dans claude.ai, dans Réglages puis Connecteurs, pour actualiser les promotions.';}
      render();
    },function(){S.refresh.avail=false;render();});
  });
  Promise.all([use('db'),use('user')]).then(function(r){
    var db=r[0],user=r[1];
    if(!db){clearTimeout(slowT);S.aState='off';loadLocal();loaded();return;}
    db.collection('actions').onSnapshot(function(snap){
      var m={};
      snap.docs.forEach(function(d){var b=d.data();if(b&&ORDER.indexOf(d.id)>=0) m[d.id]=b;});
      S.actions=m;flatten();
      if(S.refresh.waiting&&actionsSig()!==S.refresh.sig0){S.refresh.waiting=false;S.refresh.kind='';S.refresh.msg='Promotions mises à jour à '+hm(nowMin())+'.';toast('Promotions mises à jour');}
      if(!snap.metadata||!snap.metadata.fromCache||snap.size){clearTimeout(slowT);S.aState='ready';}
      render();
    },function(){clearTimeout(slowT);if(S.aState!=='ready') S.aState='off';render();});
    var idP=user?Promise.resolve(user.id()).catch(function(){return null;}):Promise.resolve(null);
    timeout(idP,8000).then(function(uid){
      if(!uid){loadLocal();loaded();return;}
      var ref=db.doc('data/users/'+uid+'/state');
      timeout(ref.get().catch(function(){return null;}),8000).then(function(snap){
        if(snap===undefined||snap===null) loadLocal();
        else{stateRef=ref;if(snap.exists) apply(snap.data());}
        loaded();
      });
    });
  });
}
function boot(){
  window.addEventListener('hashchange',onHash);
  document.addEventListener('click',onClick);
  document.addEventListener('change',onChange);
  setInterval(function(){if(mode()==='tabs'&&(S.ui.tab==='semaine'||S.ui.tab==='reglages'&&S.refresh.waiting)&&!document.hidden){if(S.refresh.waiting&&!recentFire()) S.refresh.waiting=false;render();}},60000);
  onHash();
  init();
}
if(typeof module==='object'&&module.exports) module.exports={S:S,ING:ING,BATCH:BATCH,B:B,CUIS:CUIS,flatten:flatten,buildWeek:buildWeek,session:session,assign:assign,shopping:shopping,events:events,
  listText:listText,programText:programText,proposals:proposals,autoPick:autoPick,newWiz:newWiz,cookOf:cookOf,slotsBetween:slotsBetween,portionsOf:portionsOf,
  viewSemaine:viewSemaine,viewCourses:viewCourses,viewBatch:viewBatch,viewActions:viewActions,viewReglages:viewReglages,viewQuiz:viewQuiz,viewWiz:viewWiz,
  defaults:defaults,apply:apply,snapshot:snapshot,today:today,allowed:allowed,rgroup:rgroup,toMin:toMin,hm:hm};
else boot();
})();
