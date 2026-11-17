// Signale des URL nouvelles ou modifiées à IndexNow (Bing, Yandex, Seznam, Naver…).
// Bing alimente aussi la recherche de ChatGPT et Copilot.
// Usage, après un déploiement en production :
//   node scripts/indexnow.mjs                      → envoie toutes les URL du sitemap
//   node scripts/indexnow.mjs /blog/mon-article    → envoie seulement ces chemins
const HOST = 'www.janjawish.fr';
const KEY = 'c172bd934dbfe42d4508e658f3a8500e'; // fichier public/c172bd934dbfe42d4508e658f3a8500e.txt (ne pas le supprimer)

const paths = process.argv.slice(2);
let urls = paths.map((p) => `https://${HOST}${p.startsWith('/') ? p : `/${p}`}`);

if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap-0.xml`)).text();
  urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow : ${res.status} ${res.statusText} (${urls.length} URL)`);
if (!res.ok && res.status !== 202) process.exit(1);
