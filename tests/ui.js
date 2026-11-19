#!/usr/bin/env node
/* Test de l'interface dans un vrai navigateur (Playwright + Chromium), au format téléphone.
   Lancer depuis la racine du dépôt : node tests/ui.js [dossier-captures]
   Si Playwright n'est pas installé, le test est ignoré (code 0) et le dit.
   Vérifie : aucune erreur JavaScript, pas de défilement horizontal, parcours complet
   questionnaire → choix des plats → semaine → courses → batch → réglages, en clair et en sombre. */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let chromium;
try { chromium = require('playwright').chromium; } catch (e) {
  console.log('IGNORÉ : Playwright n’est pas installé (npm i playwright puis npx playwright install chromium).');
  process.exit(0);
}
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, path.normalize(p).replace(/^(\.\.[\/\\])+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
const shots = process.argv[2];
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const url = 'http://127.0.0.1:' + server.address().port + '/';
  let browser;
  try { browser = await chromium.launch(); } catch (e) {
    console.log('IGNORÉ : Chromium ne démarre pas (' + e.message.split('\n')[0] + ').'); server.close(); process.exit(0);
  }
  let fails = 0;
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 400, height: 860 }, colorScheme: scheme });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|Failed to load resource/.test(m.text())) errs.push(m.text()); });
    const step = async (name, fn) => {
      try { await fn(); } catch (e) { fails++; console.error('ÉCHEC [' + scheme + '] ' + name + ' : ' + e.message.split('\n')[0]); }
    };
    const noHScroll = async where => {
      const w = await page.evaluate(() => document.documentElement.scrollWidth);
      if (w > 400) throw new Error('défilement horizontal (' + w + ' px) sur ' + where);
    };
    const snap = async n => { if (shots) { fs.mkdirSync(shots, { recursive: true }); await page.screenshot({ path: path.join(shots, scheme + '-' + n + '.png'), fullPage: true }); } };
    await step('chargement', async () => { await page.goto(url); await page.waitForSelector('#q-next', { timeout: 8000 }); await noHScroll('le questionnaire'); await snap('1-questionnaire'); });
    await step('questionnaire', async () => {
      for (let i = 0; i < 6; i++) { await page.click('#q-next'); await page.waitForTimeout(120); }
      await page.waitForSelector('#w-next', { timeout: 5000 });
    });
    await step('choix des plats', async () => {
      await page.click('#w-next'); await page.waitForTimeout(200);
      await page.waitForSelector('.card', { timeout: 5000 });
      await noHScroll('le choix des plats'); await snap('2-plats');
      // La semaine est proposée d'emblée et le premier plat se voit sans défiler.
      const n0 = await page.$$eval('.picks .card[data-on="true"]', e => e.length);
      if (n0 < 2) throw new Error('semaine non proposée d’emblée (' + n0 + ' plat)');
      const top = await page.$eval('.picks .card', e => e.getBoundingClientRect().bottom);
      if (top > 860) throw new Error('le premier plat proposé n’est pas visible sans défiler (' + Math.round(top) + ' px)');
      // Échanger
      const first = await page.$eval('.picks .card', e => e.dataset.id);
      await page.click('.picks .card [data-act="w-swap"]'); await page.waitForTimeout(150);
      const after = await page.$eval('.picks .card', e => e.dataset.id);
      if (after === first) throw new Error('« Échanger » ne change pas le plat');
      // Détail au toucher
      await page.click('.picks .card .mini-main'); await page.waitForTimeout(100);
      if (!(await page.$('.picks .mini-det'))) throw new Error('le détail du plat ne s’ouvre pas');
      // Envie de…
      await page.click('#w-filt'); await page.waitForTimeout(100);
      await page.click('#c-w-cat-sou'); await page.waitForTimeout(150);
      const n1 = await page.$$eval('.picks .card[data-on="true"]', e => e.length);
      if (!n1) throw new Error('« Envie de… » soupes ne propose aucun plat');
      await noHScroll('les filtres'); await snap('2-plats-envie');
      await page.click('#c-w-cat-all'); await page.waitForTimeout(150);
      await page.click('[data-act="w-auto"]'); await page.waitForTimeout(150);
      const n = await page.$$eval('.card[data-on="true"]', e => e.length);
      if (!n) throw new Error('« Autre proposition » ne choisit aucun plat');
      // Ajouter un dessert ou un en-cas
      await page.click('.wz-ds [data-act="w-pick"]'); await page.waitForTimeout(150);
      const bar = await page.$eval('.wbar-s', e => e.textContent);
      if (!/\+ 1 en-cas/.test(bar)) throw new Error('l’en-cas ajouté n’apparaît pas dans le résumé (' + bar + ')');
      await page.click('[data-act="w-ok"]'); await page.waitForTimeout(300);
      if (!(await page.evaluate(() => location.hash === '#semaine'))) throw new Error('« Valider ma semaine » ne mène pas à la semaine');
    });
    for (const tab of ['semaine', 'courses', 'batch', 'actions', 'reglages']) {
      await step('onglet ' + tab, async () => {
        await page.evaluate(t => { location.hash = '#' + t; }, tab); await page.waitForTimeout(200);
        const txt = await page.evaluate(() => document.body.innerText);
        const bad = txt.match(/.{0,30}(undefined|NaN|\[object ).{0,30}/);
        if (bad) throw new Error('texte invalide « ' + bad[0] + ' »');
        await noHScroll('l’onglet ' + tab); await snap('3-' + tab);
        // Chantier 2 : chaque écran tient en 2 écrans de haut au plus à l'ouverture.
        await page.evaluate(() => window.scrollTo(0, 0));
        const hgt = await page.evaluate(() => document.documentElement.scrollHeight);
        if (tab !== 'courses' && hgt > 2 * 860) throw new Error('écran trop long à l’ouverture (' + hgt + ' px pour 1720 au plus)');
        // Une section repliée s'ouvre au toucher.
        const closed = await page.$('.fold:not(.open) .fold-h');
        if (closed) {
          const id = await closed.getAttribute('id');
          await closed.click(); await page.waitForTimeout(120);
          if (!(await page.$('#' + id + '[aria-expanded="true"]'))) throw new Error('une section repliée ne s’ouvre pas (' + id + ')');
          const txt2 = await page.evaluate(() => document.body.innerText);
          if (/undefined|NaN|\[object /.test(txt2)) throw new Error('texte invalide après ouverture d’une section');
          await noHScroll('une section ouverte de l’onglet ' + tab);
          await page.click('#' + id); await page.waitForTimeout(80);
        }
      });
    }
    await step('panier', async () => {
      await page.evaluate(() => { location.hash = '#courses'; }); await page.waitForTimeout(200);
      if (!(await page.$eval('#basket', e => e.hidden))) throw new Error('le compteur du panier s’affiche alors que rien n’est coché');
      await page.click('.item input[type=checkbox]'); await page.waitForTimeout(100);
      const txt = await page.$eval('#basket', e => e.hidden ? '' : e.textContent);
      if (!/^1 sur \d+ dans ton panier$/.test(txt)) throw new Error('compteur du panier inattendu : « ' + txt + ' »');
      if (await page.$eval('#b-uncheck', e => e.hidden)) throw new Error('« Tout décocher » n’apparaît pas après avoir coché');
      await snap('4-panier');
      await page.click('#b-uncheck'); await page.waitForTimeout(100);
      if (!(await page.$eval('#basket', e => e.hidden))) throw new Error('« Tout décocher » ne remet pas le compteur à zéro');
    });
    if (errs.length) { fails++; console.error('ÉCHEC [' + scheme + '] erreurs JavaScript : ' + errs.join(' | ')); }
    await ctx.close();
  }
  await browser.close(); server.close();
  if (fails) { console.error(fails + ' échec(s) dans le test d’interface.'); process.exit(1); }
  console.log('OK : interface testée en clair et en sombre, au format téléphone.');
})();
