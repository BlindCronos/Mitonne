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
      const chip = await page.$('[id^="c-w-cat-"]:not([id$="-all"])');
      if (chip) { await chip.click(); await page.waitForTimeout(150); }
      await page.click('[data-act="w-auto"]'); await page.waitForTimeout(150);
      const n = await page.$$eval('.card[data-on="true"]', e => e.length);
      if (!n) throw new Error('« Choisir pour moi » ne choisit aucun plat');
      await page.click('[data-act="w-ok"]'); await page.waitForTimeout(300);
    });
    for (const tab of ['semaine', 'courses', 'batch', 'actions', 'reglages']) {
      await step('onglet ' + tab, async () => {
        await page.evaluate(t => { location.hash = '#' + t; }, tab); await page.waitForTimeout(200);
        const txt = await page.evaluate(() => document.body.innerText);
        const bad = txt.match(/.{0,30}(undefined|NaN|\[object ).{0,30}/);
        if (bad) throw new Error('texte invalide « ' + bad[0] + ' »');
        await noHScroll('l’onglet ' + tab); await snap('3-' + tab);
      });
    }
    if (errs.length) { fails++; console.error('ÉCHEC [' + scheme + '] erreurs JavaScript : ' + errs.join(' | ')); }
    await ctx.close();
  }
  await browser.close(); server.close();
  if (fails) { console.error(fails + ' échec(s) dans le test d’interface.'); process.exit(1); }
  console.log('OK : interface testée en clair et en sombre, au format téléphone.');
})();
