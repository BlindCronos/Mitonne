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
  ok(P.BATCH.length >= 40, 'au moins 40 recettes attendues');
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
    const mm = P.macros(r);
    ok(mm.k > 150 && mm.k < 1500 && mm.p >= 0, r.id + ' : calories par portion invraisemblables (' + Math.round(mm.k) + ')');
  });
  ok(P.BATCH.filter(P.isFit).length >= 10, 'au moins 10 recettes « Fit » attendues');
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

fs.rmSync(tmp, { recursive: true, force: true });
if (fails) { console.error('\n' + fails + ' échec(s) sur ' + checks + ' vérifications.'); process.exit(1); }
console.log('OK : ' + checks + ' vérifications, ' + P.BATCH.length + ' recettes.');
