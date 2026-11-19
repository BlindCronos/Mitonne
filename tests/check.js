#!/usr/bin/env node
/* Tests automatiques de Mitonne.
   Lancer depuis la racine du dépôt : node tests/check.js
   Aucune dépendance. Sort avec le code 1 au premier groupe de tests en échec.
   Toute publication sur main doit passer ces tests. */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
let fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; console.error('ÉCHEC : ' + msg); } }
function section(name, fn) {
  try { fn(); } catch (e) { fails++; console.error('ÉCHEC (' + name + ') : ' + (e && e.stack || e)); }
}
const BAD = /undefined|NaN|\[object /;

// ---------- chargement du script de la page dans Node ----------
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error('ÉCHEC : index.html ne contient pas de <script> principal'); process.exit(1); }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mitonne-'));
const corePath = path.join(tmp, 'core.js');
fs.writeFileSync(corePath, m[1]);
if (typeof navigator === 'undefined') global.navigator = {};
let P;
try { P = require(corePath); } catch (e) { console.error('ÉCHEC : le script de la page ne se charge pas : ' + e.message); process.exit(1); }

section('exports', () => {
  ['S', 'ING', 'BATCH', 'B', 'NUT', 'CATS', 'flatten', 'buildWeek', 'session', 'shopping', 'proposals', 'autoPick',
   'viewSemaine', 'viewCourses', 'viewBatch', 'viewActions', 'viewReglages', 'viewQuiz', 'viewWiz',
   'defaults', 'apply', 'snapshot', 'allowed', 'macros', 'isFit', 'matchWz'].forEach(k => ok(k in P, 'export manquant : ' + k));
});

// ---------- fichiers du site ----------
section('fichiers', () => {
  ['index.html', 'sw.js', 'manifest.webmanifest', 'data/actions.json', 'icons/icon-192.png', 'icons/icon-512.png'].forEach(f =>
    ok(fs.existsSync(path.join(ROOT, f)), 'fichier manquant : ' + f));
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8'));
  ok(man.name === 'Mitonne', 'le manifeste doit garder le nom Mitonne');
  ok(/var V='mitonne-v\d+'/.test(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8')), 'sw.js doit garder un cache nommé mitonne-vN');
  ok(/<title>Mitonne<\/title>/.test(html), 'le titre de la page doit rester Mitonne');
  ok(html.includes("LS='mitonne-state'") && html.includes("'popote-state'"), 'les clés de sauvegarde locales (mitonne-state et popote-state) doivent rester');
});

// ---------- données des promotions ----------
let data = null;
section('data/actions.json', () => {
  data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/actions.json'), 'utf8'));
  ok(/^\d{4}-\d{2}-\d{2}$/.test(data.updated), 'updated doit être une date AAAA-MM-JJ');
  ['migros', 'coop', 'denner', 'aldi', 'lidl'].forEach(s => {
    const d = data.stores && data.stores[s];
    ok(d && Array.isArray(d.items), 'enseigne manquante : ' + s);
    if (!d) return;
    d.items.forEach((x, i) => {
      const id = s + '[' + i + '] ' + x.n;
      ok(typeof x.n === 'string' && x.n, id + ' : nom manquant');
      ok(typeof x.p === 'number' && x.p > 0, id + ' : prix invalide');
      ok(['vi', 'po', 'fl', 'fr', 'ep'].includes(x.c), id + ' : rayon invalide');
      ok(['pack', '100g', 'kg'].includes(x.u), id + ' : unité invalide');
      ok(!x.k || P.ING[x.k], id + ' : clé d’ingrédient inconnue ' + x.k);
    });
  });
});

// ---------- recettes ----------
section('recettes', () => {
  const spices = ['curry', 'paprika', 'cumin', 'piment', 'origan', 'thym', 'muscade'];
  const ids = new Set();
  ok(P.BATCH.length >= 115, 'au moins 115 recettes attendues');
  P.BATCH.forEach(r => {
    ok(!ids.has(r.id), 'id de recette en double : ' + r.id); ids.add(r.id);
    ok(r.n && Array.isArray(r.ing) && r.ing.length && Array.isArray(r.st) && r.st.length, r.id + ' : structure incomplète');
    ok(r.fr >= 1 && r.fr <= 4, r.id + ' : jours de frigo hors limites');
    r.main.forEach(k => ok(P.ING[k], r.id + ' : ingrédient principal inconnu ' + k));
    r.ing.concat(r.jour || []).forEach(x => {
      ok(P.ING[x[0]], r.id + ' : ingrédient inconnu ' + x[0]);
      ok(x[0] in P.NUT || spices.includes(x[0]), r.id + ' : valeurs nutritionnelles manquantes pour ' + x[0]);
      ok(typeof x[1] === 'number' && x[1] >= 0, r.id + ' : quantité invalide pour ' + x[0]);
    });
    r.st.forEach((s, i) => {
      ok(/^(|f|o\d{3})$/.test(s[2]), r.id + ' étape ' + i + ' : équipement invalide ' + s[2]);
      ok(typeof s[3] === 'string' && s[3].length > 10, r.id + ' étape ' + i + ' : texte manquant');
      (s[4] || []).forEach(j => ok(j < i, r.id + ' étape ' + i + ' : dépendance vers une étape suivante'));
    });
    // Sécurité alimentaire : poisson et fruits de mer 2 jours au frigo au plus, riz cuit le jour même.
    const sea = r.ing.concat(r.jour || []).some(x => /[fs]/.test(P.ING[x[0]] ? P.ING[x[0]].f : ''));
    ok(!sea || r.fr <= 2, r.id + ' : poisson ou fruits de mer gardés plus de 2 jours au frigo');
    ok(!r.ing.some(x => x[0] === 'riz'), r.id + ' : le riz doit être cuit le jour même (dans « jour »)');
    const mm = P.macros(r);
    ok(mm.k > 150 && mm.k < 1500 && mm.p >= 0, r.id + ' : calories par portion invraisemblables (' + Math.round(mm.k) + ')');
  });
  ok(P.BATCH.filter(P.isFit).length >= 65, 'au moins 65 recettes « Fit » attendues');
  ok(P.BATCH.filter(r => r.ds).length >= 6, 'au moins 6 desserts ou en-cas attendus');
  ['poisson', 'vege'].forEach(g => ok(P.BATCH.filter(r => P.protOf(r) === g).length >= 10, 'au moins 10 recettes ' + g + ' attendues'));
});

// ---------- état et préférences ----------
function freshState() {
  P.S.prefs = Object.assign(P.defaults(), { done: true, people: 2, stores: ['migros', 'coop', 'denner', 'aldi', 'lidl'] });
  P.S.week = null; P.S.ui.wiz = null; P.S.ui.q = null;
  if (data) { Object.keys(P.S.actions).forEach(k => delete P.S.actions[k]); Object.assign(P.S.actions, data.stores); P.flatten(); }
  P.S.aState = 'ready'; P.S.loaded = true;
}
const WZ = { shopD: '2026-11-14', shopH: '09:30', mode: 'after', cookH: '10:00', picks: [], seed: 0, page: 0 };

section('chaque recette seule', () => {
  freshState();
  P.BATCH.forEach(r => {
    const w = P.buildWeek(WZ.shopD, WZ.shopH, WZ.mode, WZ.cookH, [r.id]);
    const s = P.session(w);
    ok(!s.tasks.some(t => t.t < 0), r.id + ' : une étape de la session n’est pas planifiée');
    ok(s.span > 0 && s.span < 400, r.id + ' : durée de session invraisemblable (' + s.span + ' min)');
  });
});

section('chaque recette dans une semaine de 3 plats', () => {
  freshState();
  const ids = P.BATCH.map(r => r.id);
  ids.forEach((id, i) => {
    const pick = [id, ids[(i + 31) % ids.length], ids[(i + 59) % ids.length]];
    const w = P.buildWeek(WZ.shopD, WZ.shopH, WZ.mode, WZ.cookH, pick);
    const s = P.session(w);
    ok(!s.tasks.some(t => t.t < 0), pick.join(' + ') + ' : une étape de la session n’est pas planifiée');
    ok(s.span > 0 && s.span < 480, pick.join(' + ') + ' : durée de session invraisemblable (' + s.span + ' min)');
    P.S.week = w;
    ['viewCourses', 'viewBatch', 'viewSemaine'].forEach(v => ok(!BAD.test(P[v]()), pick.join(' + ') + ' : ' + v + ' affiche un texte invalide'));
    P.S.week = null;
  });
});

section('écran Plats : semaine proposée, Échanger, Envie de', () => {
  freshState();
  const z = Object.assign({}, WZ, { cat: 'all', prot: 'all', picks: [], step: 1 });
  z.picks = P.autoPick(z);
  const n0 = z.picks.length;
  ok(n0 >= 2, 'la semaine proposée d’emblée a moins de 2 plats (' + n0 + ')');
  P.S.ui.wiz = z;
  let html = P.viewWiz();
  ok(!BAD.test(html), 'écran Plats invalide');
  ok(html.indexOf('data-act="w-swap"') >= 0 && html.indexOf('data-act="w-filt"') >= 0, 'boutons « Échanger » ou « Envie de… » absents');
  // Échanger plusieurs fois le premier plat : toujours un plat autorisé, différent des autres, sans doublon.
  const seen = new Set([z.picks[0]]);
  for (let i = 0; i < 6; i++) {
    const old = z.picks[0], nw = P.swapPick(z, old);
    ok(nw && nw !== old, 'Échanger ne propose pas d’autre plat (tour ' + i + ')');
    ok(z.picks.length === n0 && new Set(z.picks).size === n0, 'Échanger change le nombre de plats ou crée un doublon');
    ok(P.allowed(P.B[z.picks[0]]), 'Échanger propose un plat non autorisé : ' + z.picks[0]);
    seen.add(z.picks[0]);
  }
  ok(seen.size >= 5, 'Échanger tourne en rond sur trop peu de plats (' + seen.size + ')');
  // Envie de : les plats qui ne vont pas sont remplacés.
  ['sou', 'bowl', 'express', 'fit'].forEach(cat => {
    z.cat = cat; z.prot = 'all'; P.repick(z);
    ok(z.picks.length > 0, 'Envie « ' + cat + ' » : plus aucun plat proposé');
    ok(z.picks.every(id => P.catOK(P.B[id], cat)), 'Envie « ' + cat + ' » : un plat proposé ne correspond pas');
    ok(!BAD.test(P.viewWiz()), 'Envie « ' + cat + ' » : écran invalide');
  });
  z.cat = 'all'; z.prot = 'poisson'; P.repick(z);
  ok(z.picks.length > 0 && z.picks.every(id => P.protOf(P.B[id]) === 'poisson'), 'Avec « poisson » : un plat proposé n’est pas au poisson');
  // Ouvrir le détail et la liste complète.
  z.prot = 'all'; P.repick(z); z.open = {}; z.open[z.picks[0]] = true; z.lopen = true; z.fopen = true;
  html = P.viewWiz();
  ok(!BAD.test(html) && html.indexOf('Pas pour moi') >= 0 && html.indexOf('data-act="w-pick"') >= 0, 'détail ou liste complète invalides');
  P.S.ui.wiz = null;
});

section('desserts et en-cas', () => {
  freshState();
  const ds = P.BATCH.filter(r => r.ds), meal = ['bolognaise', 'dense-bean-salad'];
  ds.forEach(r => {
    const w = P.buildWeek(WZ.shopD, WZ.shopH, WZ.mode, WZ.cookH, meal.concat([r.id]));
    ok(w.ids.includes(r.id), r.id + ' : l’en-cas disparaît de la semaine');
    ok(!w.slots.some(s => s.r === r.id), r.id + ' : un en-cas ne doit jamais prendre la place d’un repas');
    ok(P.portionsOf(w, r.id) === 2 * w.people, r.id + ' : un en-cas donne 2 portions par personne');
    const s = P.session(w);
    ok(s.tasks.some(t => t.rid === r.id), r.id + ' : les étapes de l’en-cas manquent dans la session');
    const L = P.shopping(w), keys = [];
    Object.keys(L.byStore).forEach(st => L.byStore[st].forEach(x => keys.push(x.k)));
    Object.keys(L.rest).forEach(rc => L.rest[rc].forEach(x => keys.push(x.k)));
    (L.placard || []).forEach(x => keys.push(x.k));
    ok(r.ing.every(x => keys.includes(x[0])), r.id + ' : des ingrédients de l’en-cas manquent dans la liste de courses');
    P.S.week = w;
    ['viewSemaine', 'viewBatch', 'viewCourses'].forEach(v => ok(!BAD.test(P[v]()), r.id + ' : ' + v + ' invalide'));
    ok(/en-cas/.test(P.viewSemaine()), r.id + ' : l’en-cas n’est pas annoncé dans la semaine');
    P.S.week = null;
  });
  // L'écran Plats propose les en-cas à part ; le choix automatique n'en prend jamais ; valider demande au moins un plat.
  const z = Object.assign({}, WZ, { cat: 'all', prot: 'all', picks: [], step: 1 });
  const pr = P.proposals(z);
  ok(!pr.list.some(x => x.r.ds) && pr.snacks.length === ds.filter(P.allowed).length, 'les en-cas doivent être proposés à part');
  z.picks = P.autoPick(z);
  ok(!z.picks.some(id => P.B[id].ds), 'le choix automatique ne doit pas prendre d’en-cas');
  z.picks.push(pr.snacks[0].r.id);
  const n0 = z.picks.length;
  z.picks = P.autoPick(z);
  ok(z.picks.length === n0 && z.picks.includes(pr.snacks[0].r.id), 'compléter la semaine ne doit pas enlever l’en-cas choisi');
  P.repick(Object.assign(z, { cat: 'sou' }));
  ok(z.picks.includes(pr.snacks[0].r.id), 'changer d’envie ne doit pas enlever l’en-cas choisi');
  z.cat = 'all'; P.S.ui.wiz = z;
  const html = P.viewWiz();
  ok(!BAD.test(html) && /Un dessert ou un en-cas/.test(html) && /\+ 1 en-cas/.test(html), 'écran Plats : section en-cas absente ou invalide');
  P.S.ui.wiz = Object.assign({}, z, { picks: [pr.snacks[0].r.id] });
  ok(/data-act="w-ok" disabled/.test(P.viewWiz()), 'valider une semaine sans aucun plat doit être impossible');
  P.S.ui.wiz = null;
});

section('variété : jamais deux plats de même protéine et même cuisine', () => {
  const profiles = [{}, { goal: 'fit' }, { goal: 'muscle' }, { diet: 'vege' }, { cu: ['it'], prio: 'var' }, { nDish: 5 }, { nDish: 5, goal: 'fit', cu: ['as', 'jk'] }, { diet: 'pesce' }];
  const cats = ['all', 'fit', 'bowl', 'sou', 'express', 'mij'];
  profiles.forEach(pf => cats.forEach(cat => [0, 1, 2].forEach(seed => {
    freshState(); Object.assign(P.S.prefs, pf);
    const z = Object.assign({}, WZ, { cat, prot: 'all', picks: [], seed });
    const pk = P.autoPick(z), pr = P.proposals(z);
    for (let i = 0; i < pk.length; i++) for (let j = i + 1; j < pk.length; j++) {
      const a = P.B[pk[i]], b = P.B[pk[j]];
      if (P.protOf(a) !== P.protOf(b) || a.cu !== b.cu) continue;
      // Doublon admis seulement si aucun autre plat de la sélection ne l'évite.
      const others = pk.filter(id => id !== b.id).map(id => P.B[id]);
      const alt = pr.list.some(x => !pk.includes(x.r.id) && P.matchWz(x.r, z) && !others.some(o => P.protOf(o) === P.protOf(x.r) && o.cu === x.r.cu));
      ok(!alt, JSON.stringify(pf) + ' ' + cat + ' : ' + a.id + ' et ' + b.id + ' ont la même protéine et la même cuisine');
    }
  })));
});

section('semaines types', () => {
  const cases = [
    { goal: 'eq' }, { goal: 'fit' }, { goal: 'muscle' },
    { goal: 'eq', diet: 'vege' }, { goal: 'fit', alg: ['gluten', 'lait'] }, { goal: 'eq', people: 4, big: true },
    { goal: 'eq', cat: 'ff' }, { goal: 'fit', cat: 'sou' }, { goal: 'eq', prot: 'poisson' }, { goal: 'eq', cat: 'express', prot: 'vege' }
  ];
  cases.forEach(c => {
    freshState();
    ['goal', 'diet', 'alg', 'people', 'big'].forEach(k => { if (c[k] !== undefined) P.S.prefs[k] = c[k]; });
    const z = Object.assign({}, WZ, { cat: c.cat || 'all', prot: c.prot || 'all', picks: [] });
    const pr = P.proposals(z);
    ok(pr.list.length > 0, JSON.stringify(c) + ' : aucune proposition');
    z.picks = P.autoPick(z);
    ok(z.picks.length > 0, JSON.stringify(c) + ' : le choix automatique ne choisit rien');
    z.picks.forEach(id => ok(P.allowed(P.B[id]), JSON.stringify(c) + ' : plat non autorisé choisi ' + id));
    P.S.ui.wiz = Object.assign(z, { step: 1 });
    ok(!BAD.test(P.viewWiz()), JSON.stringify(c) + ' : écran de choix des plats invalide');
    const w = P.buildWeek(z.shopD, z.shopH, z.mode, z.cookH, z.picks);
    P.S.week = w; P.S.ui.wiz = null;
    const s = P.session(w);
    ok(!s.tasks.some(t => t.t < 0), JSON.stringify(c) + ' : session incomplète');
    ['viewSemaine', 'viewCourses', 'viewBatch', 'viewActions', 'viewReglages'].forEach(v => {
      const out = P[v]();
      const bad = out.match(/.{0,40}(undefined|NaN|\[object ).{0,40}/);
      ok(!bad, JSON.stringify(c) + ' : ' + v + ' affiche « ' + (bad && bad[0]) + ' »');
    });
    const L = P.shopping(w);
    ok(L && L.placard, JSON.stringify(c) + ' : liste de courses vide');
  });
});

section('agenda et liste de courses', () => {
  freshState();
  const z = Object.assign({}, WZ, { cat: 'all', prot: 'all', picks: [] });
  z.picks = P.autoPick(z);
  const w = P.buildWeek(z.shopD, z.shopH, z.mode, z.cookH, z.picks);
  P.S.week = w; P.S.ui.wiz = null;
  ok(P.icsEsc('a;b,c\nd') === 'a\\;b\\,c\\nd', 'le fichier agenda doit échapper ; , et les retours à la ligne');
  const ics = P.icsText(w);
  ok(/^BEGIN:VCALENDAR/.test(ics) && /END:VCALENDAR\r\n$/.test(ics), 'fichier agenda mal formé');
  ok(!/[^\\];/.test(ics.replace(/\r\n /g, '').split('\r\n').filter(l => /^(DESCRIPTION|SUMMARY):/.test(l)).join('\n')), 'point-virgule non échappé dans le fichier agenda');
  const L = P.shopping(w);
  let bk = P.basket(w, L);
  ok(bk.tot === L.n && bk.got === 0, 'le compteur du panier doit compter tous les articles hors placard');
  ok(/id="basket"[^>]*hidden/.test(P.viewCourses()) && /id="b-uncheck"[^>]*hidden/.test(P.viewCourses()), 'compteur et « Tout décocher » doivent être cachés tant que rien n’est coché');
  const first = (Object.values(L.byStore)[0] || Object.values(L.rest)[0])[0];
  w.checked[first.k] = 1; w.checked.inconnu = 1;
  bk = P.basket(w, L);
  ok(bk.got === 1, 'le compteur du panier doit ignorer les articles qui ne sont plus dans la liste');
  ok(P.basketTxt(bk) === '1 sur ' + bk.tot + ' dans ton panier', 'texte du compteur du panier inattendu');
  ok(P.basketTxt({ got: bk.tot, tot: bk.tot }).startsWith('Tout est dans ton panier'), 'le panier complet doit être signalé');
  ok(!/id="basket"[^>]*hidden/.test(P.viewCourses()), 'le compteur doit s’afficher dès qu’un article est coché');
  ok(!/data-act="share"/.test(P.viewCourses()), 'sans partage dans le navigateur, pas de bouton Envoyer');
  navigator.share = () => Promise.resolve();
  ok(/data-act="share"/.test(P.viewCourses()) && /data-act="copy"/.test(P.viewCourses()), 'avec le partage, les boutons Envoyer et Copier doivent apparaître');
  delete navigator.share;
});

section('questionnaire', () => {
  freshState(); P.S.prefs.done = false;
  for (let q = 0; q < 6; q++) { P.S.ui.q = q; ok(!BAD.test(P.viewQuiz()), 'question ' + (q + 1) + ' invalide'); }
});

section('sauvegarde', () => {
  freshState(); P.S.prefs.goal = 'fit'; P.S.prefs.alg = ['arachides'];
  const snap = JSON.parse(JSON.stringify(P.snapshot()));
  P.S.prefs = P.defaults(); P.apply(snap);
  ok(P.S.prefs.goal === 'fit' && P.S.prefs.alg.includes('arachides'), 'les préférences ne survivent pas à une sauvegarde');
  P.S.prefs = P.defaults(); P.apply({ v: 3, prefs: { cu: ['am'], done: true } });
  ok(P.S.prefs.cu.includes('mx'), 'la migration de l’ancienne cuisine américaine et mexicaine ne fonctionne plus');
});

section('prix du panier', () => {
  // Chaque ingrédient acheté a un prix habituel estimé, plausible.
  const used = new Set(); P.BATCH.forEach(r => r.all.forEach(x => used.add(x[0])));
  used.forEach(k => {
    if (P.ING[k].r === 'pl') return;
    const pr = P.PRICE[k];
    ok(pr && pr[0] > 0 && pr[1] > 0 && pr[1] < 60, k + ' : prix habituel estimé manquant ou invraisemblable');
  });
  // Chaque article de la liste a un prix (action ou estimation), et le total est la somme des deux.
  const weeks = [['bolognaise', 'curry-poulet', 'dense-bean-salad'], ['saumon-bites-bowl', 'chili-blanc', 'soupe-toscane', 'flan-proteine'], ['lasagnes', 'tofu-coreen']];
  [{}, { people: 4, big: true }].forEach(pf => weeks.forEach(ids => {
    freshState(); Object.assign(P.S.prefs, pf);
    const w = P.buildWeek(WZ.shopD, WZ.shopH, WZ.mode, WZ.cookH, ids), L = P.shopping(w);
    let pay = 0, est = 0;
    Object.keys(L.byStore).forEach(st => L.byStore[st].forEach(r => { ok(r.c && r.c.total > 0, r.k + ' : article en action sans prix'); pay += r.c.total; }));
    Object.keys(L.rest).forEach(rc => L.rest[rc].forEach(r => { ok(r.e && r.e.total > 0, r.k + ' : article sans prix estimé'); est += r.e.total; }));
    // Une promo sur un ingrédient secondaire doit coûter moins que le paquet habituel.
    Object.keys(L.byStore).forEach(st => L.byStore[st].forEach(r => { const e = P.estCost(r.k, r.q); const main = w.ids.some(id => P.B[id].main.includes(r.k)); ok(main || !e || r.c.total <= e.total + 0.05, r.k + ' : promo plus chère que le paquet habituel (' + r.c.total.toFixed(2) + ' > ' + e.total.toFixed(2) + ')'); }));
    ok(Math.abs(L.pay - pay) < 0.01 && Math.abs(L.est - est) < 0.01 && Math.abs(L.total - pay - est) < 0.01, ids.join('+') + ' : total du panier incohérent');
    const pp = L.total / L.por;
    ok(L.por > 0 && pp > 1.5 && pp < 15, ids.join('+') + ' : prix par portion invraisemblable (' + pp.toFixed(2) + ' CHF)');
    P.S.week = w;
    ok(/Total estimé de ton panier/.test(P.viewCourses()) && /Panier estimé/.test(P.viewSemaine()), ids.join('+') + ' : le prix du panier n’est pas affiché');
    ok(/TOTAL ESTIMÉ : env\. \d/.test(P.listText(w)), ids.join('+') + ' : la liste copiée ne donne pas le total estimé');
    P.S.week = null;
  }));
  // L'écran Plats annonce le prix du panier avant de valider.
  freshState();
  const z = Object.assign({}, WZ, { cat: 'all', prot: 'all', picks: [], step: 1 });
  z.picks = P.autoPick(z); P.S.ui.wiz = z;
  ok(/panier ≈ <b>\d/.test(P.viewWiz()), 'l’écran Plats n’annonce pas le prix du panier');
  P.S.ui.wiz = null;
  // Les sources n'affichent jamais rappn.
  freshState();
  const keep = P.S.actions.migros && P.S.actions.migros.sources;
  if (P.S.actions.migros) P.S.actions.migros.sources = ['migros.ch', 'rappn.ch'];
  P.S.ui.fold = { 'r-donnees': true };
  ok(!/rappn/i.test(P.viewReglages()) && !/rappn/i.test(P.viewAbout()), 'une source « rappn » est encore affichée');
  P.S.ui.fold = {}; if (P.S.actions.migros) P.S.actions.migros.sources = keep;
});

section('premier lancement : accueil et à propos', () => {
  P.S.prefs = P.defaults(); P.S.week = null; P.S.ui.q = null; P.S.ui.started = false; P.S.ui.about = false; P.S.loaded = true;
  ok(P.mode() === 'welcome', 'un navigateur vide doit commencer par l’écran d’accueil (' + P.mode() + ')');
  const wl = P.viewWelcome();
  ok(!BAD.test(wl) && wl.indexOf('id="b-start"') >= 0 && wl.indexOf('data-act="about"') >= 0, 'écran d’accueil invalide');
  P.S.ui.started = true;
  ok(P.mode() === 'quiz', 'après « Commencer », le questionnaire doit s’ouvrir');
  P.S.ui.about = true;
  ok(P.mode() === 'about', 'la page À propos doit pouvoir s’ouvrir à tout moment');
  const ab = P.viewAbout();
  ok(!BAD.test(ab) && /D’où viennent les prix/.test(ab) && /estimations/.test(ab) && /chaque jeudi/i.test(ab), 'page À propos invalide ou incomplète');
  ok(P.FEEDBACK_URL === '' || P.feedbackOK(), 'le lien du formulaire d’avis doit être un formulaire Google (docs.google.com/forms ou forms.gle)');
  ok(!P.feedbackOK() || ab.indexOf('id="b-feedback"') >= 0, 'le bouton « Donner mon avis » manque dans À propos');
  ok(html.indexOf('le lundi, le jeudi et le vendredi') < 0, 'l’app annonce encore des relevés le lundi et le vendredi');
  P.S.ui.about = false; P.S.ui.started = false;
});

section('% pour toi : score, raisons, apprentissage', () => {
  // Les plats sont triés par score, le pourcentage reste dans ses bornes et les raisons ne sont jamais vides.
  const profiles = [{}, { goal: 'fit', cu: ['it', 'as'] }, { goal: 'muscle', prio: 'var', spice: 2 }, { diet: 'vege', freezer: false }];
  profiles.forEach(pf => {
    freshState(); Object.assign(P.S.prefs, pf);
    const z = Object.assign({}, WZ, { cat: 'all', prot: 'all', picks: [] });
    const pr = P.proposals(z);
    for (let i = 1; i < pr.list.length; i++) ok(pr.list[i - 1].pct >= pr.list[i].pct, JSON.stringify(pf) + ' : les plats ne sont pas triés par « % pour toi »');
    const pk = P.autoPick(z).map(id => pr.list.find(x => x.r.id === id).pct);
    for (let i = 1; i < pk.length; i++) ok(pk[i - 1] >= pk[i], JSON.stringify(pf) + ' : la semaine proposée n’est pas triée par « % pour toi »');
    pr.list.forEach(x => {
      ok(x.pct >= 40 && x.pct <= 98, x.r.id + ' : pourcentage hors bornes (' + x.pct + ')');
      [false, true].forEach(np => {
        const rs = P.reasons(x.r, x.md, np);
        ok(rs.length >= 1 && rs.length <= 2 && rs.every(t => typeof t === 'string' && t.length > 3 && !BAD.test(t)), x.r.id + ' : raisons vides ou invalides ' + JSON.stringify(rs));
      });
    });
  });
  // Un 👎 fait baisser le plat et les plats proches, pas les plats sans rapport.
  freshState();
  const r = P.B['curry-poulet'], near = P.BATCH.find(x => x.id !== r.id && P.rgroup(x) === P.rgroup(r) && x.cu === r.cu);
  const far = P.BATCH.find(x => P.rgroup(x) !== P.rgroup(r) && x.cu !== r.cu && x.main[0] !== r.main[0]);
  const sc = x => P.baseScore(x, WZ.shopD, 6, WZ.shopD);
  const s0 = [sc(r), sc(near), sc(far)];
  P.learn(r.id, P.SIG.down);
  const s1 = [sc(r), sc(near), sc(far)];
  ok(s1[0] < s0[0] - 10, '👎 ne fait pas assez baisser le plat (' + s0[0].toFixed(1) + ' → ' + s1[0].toFixed(1) + ')');
  ok(s1[1] < s0[1], '👎 ne fait pas baisser un plat proche (' + near.id + ')');
  ok(Math.abs(s1[2] - s0[2]) < 1e-9, '👎 change le score d’un plat sans rapport (' + far.id + ')');
  P.learn(r.id, -P.SIG.down);
  ok(!(r.id in P.S.prefs.taste), 'annuler un 👎 ne remet pas la note à zéro');
  // Signaux légers : échanger fait baisser un peu, ajouter à la main fait monter un peu.
  P.learn(far.id, P.SIG.swap); ok(sc(far) < s0[2] && sc(far) > s0[2] - 10, 'Échanger doit faire baisser un peu le plat');
  P.learn(far.id, -P.SIG.swap); P.learn(far.id, P.SIG.add); ok(sc(far) > s0[2], 'Ajouter un plat à la main doit le faire monter');
  ok(P.reasons(far, null, true).length >= 1, 'raisons vides après apprentissage');
  // Note bornée
  for (let i = 0; i < 10; i++) P.learn(r.id, P.SIG.up);
  ok(P.S.prefs.taste[r.id] === 3, 'la note apprise doit rester entre -3 et 3');
  ok(P.reasons(r, null, true).includes('tu as aimé ce plat'), 'la raison « tu as aimé ce plat » manque après des 👍');
  // Votes de la semaine : voter, changer d'avis, annuler.
  freshState();
  const w = P.buildWeek(WZ.shopD, WZ.shopH, WZ.mode, WZ.cookH, ['bolognaise', 'curry-poulet', 'dense-bean-salad']);
  P.S.week = w;
  ok(w.votes && !Object.keys(w.votes).length, 'une nouvelle semaine doit commencer sans vote');
  const e1 = P.voteEff(1) - P.voteEff(0), e2 = P.voteEff(-1) - P.voteEff(1);
  P.learn('bolognaise', e1); P.learn('bolognaise', e2);
  ok(P.S.prefs.taste.bolognaise === P.SIG.down, 'changer son vote de 👍 à 👎 doit donner exactement un 👎');
  // Sauvegarde : la note et les votes survivent ; une ancienne sauvegarde s'ouvre sans erreur.
  w.votes.bolognaise = -1;
  const snap = JSON.parse(JSON.stringify(P.snapshot()));
  P.S.prefs = P.defaults(); P.S.week = null; P.apply(snap);
  ok(P.S.prefs.taste.bolognaise === P.SIG.down, 'la note apprise ne survit pas à une sauvegarde');
  ok(P.S.week && P.S.week.votes.bolognaise === -1, 'les votes de la semaine ne survivent pas à une sauvegarde');
  const old = JSON.parse(JSON.stringify(snap)); delete old.prefs.taste; delete old.week.votes;
  P.S.prefs = P.defaults(); P.S.week = null; P.apply(old);
  ok(P.S.prefs.taste && !Object.keys(P.S.prefs.taste).length && P.S.week && P.S.week.votes && !Object.keys(P.S.week.votes).length, 'une ancienne sauvegarde sans note ni vote ne s’ouvre pas proprement');
  P.S.prefs = P.defaults(); P.apply({ v: 3, prefs: { done: true, taste: { bolognaise: 'x', inconnu: 2, chili: 9 } } });
  ok(!('bolognaise' in P.S.prefs.taste) && !('inconnu' in P.S.prefs.taste) && P.S.prefs.taste.chili === 3, 'les notes invalides d’une sauvegarde doivent être ignorées ou bornées');
  // Les votes s'affichent après le repas.
  freshState(); P.S.week = P.buildWeek('2026-11-14', '09:30', 'after', '10:00', ['bolognaise', 'curry-poulet']);
  P.S.ui.fold = {}; P.S.week.slots.forEach(sl => { P.S.ui.fold['j-' + P.S.week.shop.d + '-' + sl.d] = true; });
  const hv = P.viewSemaine(); P.S.ui.fold = {};
  ok(!BAD.test(hv) && hv.indexOf('data-act="vote"') >= 0, 'les boutons 👍 et 👎 n’apparaissent pas après un repas passé');
  P.S.week = null;
});

fs.rmSync(tmp, { recursive: true, force: true });
if (fails) { console.error('\n' + fails + ' échec(s) sur ' + checks + ' vérifications.'); process.exit(1); }
console.log('OK : ' + checks + ' vérifications, ' + P.BATCH.length + ' recettes.');
