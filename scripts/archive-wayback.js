// scripts/archive-simple.js

const https = require('https');

const SITEMAP_URL = 'https://euaggelion.com.br/sitemap.xml';

async function fetchSitemap() {
  return new Promise((resolve, reject) => {
    https.get(SITEMAP_URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const urls = data.match(/<loc>(.*?)<\/loc>/g)
          .map(m => m.replace(/<\/?loc>/g, '').trim());
        resolve(urls);
      });
    }).on('error', reject);
  });
}

async function archiveUrl(url) {
  return new Promise((resolve) => {
    console.log(`${url}`);
    https.get(`https://web.archive.org/save/${url}`, (res) => {
      console.log(res.statusCode === 200 ? '   ' : `   ${res.statusCode}`);
      resolve();
    }).on('error', (e) => {
      console.log(`   ${e.message}`);
      resolve();
    });
  });
}

async function main() {
  console.log('Arquivando Euaggelion...\n');
  
  const urls = await fetchSitemap();
  console.log(`${urls.length} URLs encontradas\n`);
  
  for (let i = 0; i < urls.length; i++) {
    await archiveUrl(urls[i]);
    if (i < urls.length - 1) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  console.log('Concluído!');
  console.log('https://web.archive.org/web/*/https://euaggelion.com.br');
}

main();