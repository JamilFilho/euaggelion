import { findBibleReferences } from '../lib/bibleParser';

async function run() {
  const examples = [
    "... em sua segunda carta, capítulo 2 versículos 1 ao 3...",
    "Veja Oséias 1:1-3 e compare",
    "Mateus 5:24,27 é citado aqui",
    "Referência isolada: os 1",
    "Algum texto com versiculos 10 e mais"
  ];

  for (const ex of examples) {
    const refs = await findBibleReferences(ex);
    console.log('Input:', ex);
    console.log('Matches:', JSON.stringify(refs, null, 2));
    console.log('---');
  }
}

run().catch(err => { console.error(err); process.exit(1); });
