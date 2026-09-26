import {readFileSync, writeFileSync} from 'node:fs';
import {source, plannedTrades} from './service-content-source.mjs';

const root = new URL('../', import.meta.url);
const library = JSON.parse(readFileSync(new URL('public/trade-library.json', root), 'utf8'));
const blurbs = JSON.parse(readFileSync(new URL('public/service-copy.json', root), 'utf8'));
// The runtime library owns the editorial card line. Rebuilding scope/process
// copy must not silently replace reviewed card writing with template fallback.
const editorialCards = JSON.parse(readFileSync(new URL('public/service-content.json', root), 'utf8'));
const content = {};
const normalized = value => value.trim().toLocaleLowerCase('en-US');
const seen = new Map();
const openings = new Map();

for (const [trade, block] of Object.entries(source)) {
  const expected = library[trade] || plannedTrades[trade];
  if (!expected) throw Error(`Unknown trade: ${trade}`);
  const entries = {};
  for (const row of block.trim().split('\n')) {
    const parts = row.split('|').map(value => value.trim());
    if (parts.length !== 5) throw Error(`Expected five fields: ${trade}: ${row}`);
    const [name, headline, includedText, signText, stepText] = parts;
    const key = normalized(name);
    const includes = includedText.split(';').map(value => value.trim());
    const signs = signText.split(';').map(value => value.trim());
    const process = stepText.split(';').map(value => value.trim());
    if (includes.length !== 3 || signs.length !== 3 || process.length !== 4) throw Error(`Wrong item count: ${trade} / ${name}`);
    if (headline.split(/\s+/).length < 4 || headline.split(/\s+/).length > 6) throw Error(`Hero must have 4–6 words: ${trade} / ${name}`);
    const card = editorialCards[trade]?.[key]?.card || blurbs[trade]?.[key];
    if(!card)throw Error(`Write a card blurb before adding ${trade} / ${name}.`);
    const opening=(card.toLowerCase().match(/[a-z0-9]+/g)||[]).slice(0,3).join(' ');
    if(!openings.has(trade))openings.set(trade,new Set());
    if(openings.get(trade).has(opening))throw Error(`Repeated card opening in ${trade}: ${opening}`);
    openings.get(trade).add(opening);
    if(normalized(card).includes(key))throw Error(`Card repeats its service title: ${trade} / ${name}`);
    // Questions draw on the homeowner symptoms and scope selected for this
    // exact service; the third gets the contractor's actual service region.
    const faq = editorialCards[trade]?.[key]?.faq || [
      {question: `What should I do about ${signs[0].toLowerCase()}?`, answer: `Start by telling us where you see it. ${process[0]}. ${process[1]}.`},
      {question: `Does ${name.toLowerCase()} include ${includes[1].toLowerCase()}?`, answer: `We look at ${includes[1].toLowerCase()} alongside ${includes[2].toLowerCase()}. ${process[2]}.`},
      {question: `Can we plan ${name.toLowerCase()} in {{city}}?`, answer: `{{business}} can discuss ${name.toLowerCase()} in {{region}}. ${process[3]}.`},
    ];
    const item = {card, headline, includes, signs, process, faq};
    for (const [field, values] of Object.entries({card: [card], headline: [headline], includes, signs, process, faqQuestions: faq.map(row => row.question), faqAnswers: faq.map(row => row.answer)})) {
      for (const value of values) {
        const token = normalized(value);
        if (seen.has(token)) throw Error(`Duplicate copy: ${trade} / ${name} / ${field} matches ${seen.get(token)}: ${value}`);
        seen.set(token, `${trade} / ${name} / ${field}`);
      }
    }
    if (entries[key]) throw Error(`Duplicate service: ${trade} / ${name}`);
    entries[key] = item;
  }
  const wanted = new Set(expected.map(normalized));
  const listed = Object.keys(entries);
  if (expected.some(name => !entries[normalized(name)]) || (trade !== 'Roofing' && (listed.length !== wanted.size || listed.some(key => !wanted.has(key))))) {
    throw Error(`Content does not match service list: ${trade}; expected ${[...wanted].join(', ')}; received ${Object.keys(entries).join(', ')}`);
  }
  content[trade] = entries;
}
if (Object.keys(content).length !== Object.keys(library).length + Object.keys(plannedTrades).length) throw Error('Missing trade content');

writeFileSync(new URL('public/service-content.json', root), JSON.stringify(content, null, 2) + '\n');
const lines = [
  '# Service content library',
  '',
  'Generated from `scripts/service-content-source.mjs` and reviewed card blurbs in `public/service-content.json` using `node scripts/build-service-content.mjs`. The JSON file is the runtime data source. Concrete and Pools are prepared for their queued rollouts; the current live trade selector has 14 trades.',
  '',
  'Every entry has a unique card blurb, a four-to-six-word hero, three specific scope items, three homeowner signs, four process steps, and three FAQs. The third FAQ receives the contractor’s city and service region at render time. No cost, credential, warranty, statistic, or legal claim is supplied by this library.',
  '',
];
for (const [trade, entries] of Object.entries(content)) {
  lines.push(`## ${trade} (${Object.keys(entries).length})`, '');
  for (const [key, item] of Object.entries(entries)) {
    const name = (library[trade] || plannedTrades[trade]).find(value => normalized(value) === key) || key.replace(/\b\w/g, value => value.toUpperCase());
    lines.push(`### ${name}`, '', `- Card: ${item.card}`, `- Hero: ${item.headline}`, `- Includes: ${item.includes.join(' · ')}`, `- Signs: ${item.signs.join(' · ')}`, `- Process: ${item.process.join(' → ')}`, '- FAQs:');
    for (const faq of item.faq) lines.push(`  - **${faq.question}** ${faq.answer}`);
    lines.push('');
  }
}
writeFileSync(new URL('docs/product/SERVICE-CONTENT.md', root), lines.join('\n').trimEnd() + '\n');
console.log(`Built ${Object.values(content).reduce((n, group) => n + Object.keys(group).length, 0)} service briefs across ${Object.keys(content).length} trades.`);
