// Usage : node scripts/generate-portfolio-cards.cjs "<chemin du projet>"
// Nécessite playwright-core (npm i -D playwright-core) et Google Chrome installé.
// Régénère src/assets/portfolios/{dev,creatif}.png (visuels des cartes Holo Card).
const { chromium } = require('playwright-core');
const path = require('path');
const root = process.argv[2];
const fontUrl = (p) => 'data:font/woff2;base64,' + require('fs').readFileSync(path.join(root, 'node_modules', p)).toString('base64');
const cards = [
  { id: 'dev', label: 'En préparation', icon: '&lt;/&gt;', title: 'Portfolio développeur', desc: 'Applications web, outils métier, architectures et code : une sélection technique, dépôt par dépôt.', tags: ['React · TypeScript', 'PHP · MySQL', 'Applications locales', 'Automatisation'], url: 'dev.janjawish.fr' },
  { id: 'creatif', label: 'En préparation', icon: '◐', title: 'Portfolio créatif', desc: 'Identités visuelles, vidéo, photographie et motion design : le versant image et récit du travail.', tags: ['Identité visuelle', 'Audiovisuel', 'Photographie', 'Motion design'], url: 'creatif.janjawish.fr' },
];
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await (await b.newContext({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 })).newPage();
  for (const c of cards) {
    await p.setContent(`<!doctype html><html><head><style>
@font-face{font-family:B;src:url('${fontUrl('@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2')}') format('woff2');font-weight:200 800;font-stretch:75% 100%}
@font-face{font-family:G;src:url('${fontUrl('@fontsource-variable/geist/files/geist-latin-wght-normal.woff2')}') format('woff2');font-weight:100 900}
html,body{margin:0;background:#0b0b0c}
.c{box-sizing:border-box;width:640px;height:400px;padding:40px 42px;display:flex;flex-direction:column;color:#f5f3ee;font-family:G;
background:radial-gradient(90% 80% at 100% 0%,rgba(133,139,185,.22),transparent 60%),radial-gradient(70% 60% at 0% 100%,rgba(169,174,214,.10),transparent 65%),#17181c}
.top{display:flex;justify-content:space-between;align-items:center}
.l{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#a9aed6}
.i{font-family:B;font-weight:700;font-size:26px;color:#a8aab5}
h3{font-family:B;font-weight:700;font-size:46px;letter-spacing:-.045em;line-height:1;margin:auto 0 14px}
p{margin:0 0 22px;font-size:17px;line-height:1.45;color:#b9bbc5;max-width:30em}
ul{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
li{font-size:13px;padding:6px 12px;border:1px solid rgba(245,243,238,.2);border-radius:999px;color:#d6d7de}
.u{margin-top:22px;font-size:13px;letter-spacing:.04em;color:#8e909b}
</style></head><body><div class="c"><div class="top"><span class="l">${c.label}</span><span class="i">${c.icon}</span></div>
<h3>${c.title}</h3><p>${c.desc}</p><ul>${c.tags.map((t) => `<li>${t}</li>`).join('')}</ul><div class="u">${c.url} ↗</div></div></body></html>`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(200);
    await p.locator('.c').screenshot({ path: path.join(root, 'src/assets/portfolios', `${c.id}.png`) });
  }
  await b.close();
})();
