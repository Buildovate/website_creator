import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {DEFAULT, ROBLES, settings} from '../src/core.js';
import {visibleServicePages} from '../src/service-registry.js';
import {serviceBrief, serviceContent, serviceLayoutVariant} from '../src/service-content.js';
import {renderUniversalServicePage} from '../src/service-detail.js';
import {plannedTrades} from '../scripts/service-content-source.mjs';

const library = JSON.parse(readFileSync('public/trade-library.json', 'utf8'));
const normalize = value => value.trim().toLowerCase();

test('all 16 trade briefs and Robles extra services have complete, unique service copy', () => {
  assert.equal(Object.keys(serviceContent).length, 16);
  for (const [trade, names] of Object.entries({...library, ...plannedTrades})) {
    for (const name of names) assert.ok(serviceBrief(trade, name), trade + ': ' + name);
    assert.equal(Object.keys(serviceContent[trade]).length, names.length + (trade === 'Roofing' ? 4 : 0));
  }
  for (const service of ROBLES.services) assert.ok(serviceBrief('Roofing', service.name), service.name);
  const all = new Map();
  for (const [trade, entries] of Object.entries(serviceContent)) {
    for (const [name, item] of Object.entries(entries)) {
      assert.ok(item.headline.split(/\s+/).length >= 4 && item.headline.split(/\s+/).length <= 6, name);
      assert.equal(item.includes.length, 3); assert.equal(item.signs.length, 3);
      assert.equal(item.process.length, 4); assert.ok(item.faq.length >= 3 && item.faq.length <= 5);
      for (const [field, list] of Object.entries({
        card: [item.card], headline: [item.headline], includes: item.includes, signs: item.signs,
        process: item.process, faqQuestion: item.faq.map(faq => faq.question),
        faqAnswer: item.faq.map(faq => faq.answer),
      })) for (const line of list) {
        const key = normalize(line);
        assert.ok(!all.has(key), trade + '/' + name + '/' + field + ' duplicates ' + all.get(key) + ': ' + line);
        all.set(key, trade + '/' + name + '/' + field);
      }
    }
  }
});

test('pages on one site never repeat card blurbs, signs, steps, or FAQ questions', () => {
  for (const [trade, names] of Object.entries({...library, ...plannedTrades})) {
    const site = library[trade] ? settings({...DEFAULT, name: trade + ' Example', trade, area: 'Ventura County', serviceAreas: [{city: 'Oxnard'}], services: names.map(name => ({name, description: ''}))}) : null;
    const pages = site ? visibleServicePages(site) : names.map(name => ({serviceName: name}));
    const used = new Map();
    const openings = new Set();
    for (const page of pages) {
      const item = serviceBrief(trade, page.serviceName);
      assert.ok(item);
      const opening=(item.card.toLowerCase().match(/[a-z0-9]+/g)||[]).slice(0,3).join(' ');
      assert.ok(!openings.has(opening), trade+' cards repeat the opening '+opening);
      openings.add(opening);
      assert.ok(!normalize(item.card).includes(normalize(page.serviceName)), trade+' card repeats its title: '+page.serviceName);
      for (const [field, lines] of Object.entries({card: [item.card], signs: item.signs, process: item.process, faq: item.faq.map(faq => faq.question)})) {
        for (const value of lines) {
          const key = normalize(value.replaceAll('{{city}}', 'Oxnard'));
          assert.ok(!used.has(key), trade + ' pages repeat ' + field + ': ' + key);
          used.set(key, page.serviceName);
        }
      }
    }
  }
});

test('service pages use the curated copy, city and area, three visuals, and real work only', () => {
  const s = settings({...ROBLES});
  const page = visibleServicePages(s).find(item => item.serviceName === 'Roof repair');
  const args = {slug: 'robles-roofing', origin: 'https://test.local', photos: [], projects: []};
  const html = renderUniversalServicePage(s, page, args);
  const brief = serviceBrief('Roofing', 'Roof repair');
  assert.ok(html.includes(brief.headline));
  assert.ok(html.includes(brief.card));
  assert.ok(html.includes('Oxnard and Ventura County'));
  for (const line of [...brief.includes, ...brief.signs, ...brief.process]) assert.ok(html.includes(line), line);
  assert.ok(html.includes('Can we plan roof repair in Oxnard?'));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/<figure class="sd-(?:hero|detail|process)-art"/g) || []).length, 3);
  assert.ok(!html.includes('id="work"'));
  assert.ok(!html.includes('Understand the starting point'));
  assert.ok(!html.includes('Your plans have changed'));
  const real = {id: 'project-one', published: JSON.stringify({title: 'Oxnard roof repair', city: 'Oxnard', service: 'Roof repair', coverId: 'photo-one'})};
  const sample = {id: 'project-two', published: JSON.stringify({title: 'Sample repair', city: 'Oxnard', service: 'Roof repair', coverId: 'photo-two', isSample: true})};
  const withWork = renderUniversalServicePage(s, page, {...args, photos: [{id: 'photo-one'}, {id: 'photo-two'}], projects: [real, sample]});
  assert.ok(withWork.includes('id="work"'));
  assert.ok(withWork.includes('Oxnard roof repair'));
  assert.ok(!withWork.includes('Sample repair'));
  assert.ok([0, 1, 2].includes(serviceLayoutVariant('robles-roofing')));
  assert.equal(serviceLayoutVariant('robles-roofing'), serviceLayoutVariant('robles-roofing'));
});
