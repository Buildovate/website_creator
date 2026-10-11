import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {normalizeWebsitePages, websitePagePhotoIds, PAGE_LIMITS} from '../src/platform/website-pages.ts';
import {worker, env, admin} from './preview-fixture.mjs';
import {reconcileServicePages} from '../src/service-registry.js';

const records = () => ({version: 1, pages: [
  {id: 'roof-repair', kind: 'service', title: 'Roof repair', serviceName: 'Roof repair', enabled: true, scope: 'Test-only service scope.', process: ['Inspect the concern', 'Discuss options'], materials: ['Asphalt shingles'], questions: [{id: 'service-question', question: 'What happens first?', answer: 'We discuss the roof concern.'}]},
  {id: 'trade-faq', kind: 'faq', title: 'Roofing questions', questions: [{id: 'finance-question', category: 'Planning', question: 'Is financing available?', answer: 'Ask about available options.', requires: 'financing'}]},
  {id: 'company-about', kind: 'about', title: 'Meet the team', story: 'Test-only company story.', whyUs: ['Explain the scope before work.'], titleLocked: true},
  {id: 'city-oxnard', kind: 'city', title: 'Roofing in Oxnard', city: 'Oxnard', content: 'Test-only city-specific copy.', servicePageIds: ['roof-repair']},
]});

const asset = photoId => ({photoId, alt: 'Test-only roof illustration', caption: 'Local test asset'});
const withMedia = photoId => {
  const data = records();
  data.pages[0].media = {hero: asset(photoId), bannerOne: asset(photoId), bannerTwo: asset(photoId), thumbnail: asset(photoId)};
  data.pages[1].media = {hero: asset(photoId)};
  data.pages[2].portraitMode = 'uploaded_photo'; data.pages[2].portrait = asset(photoId);
  data.pages[3].media = {hero: asset(photoId)};
  return data;
};

await test('typed records round-trip; IDs/slugs survive edits and reordering', () => {
  const first = normalizeWebsitePages(records());
  assert.deepEqual(normalizeWebsitePages(first), first);
  const changed = structuredClone(first); changed.pages.reverse();
  for (const page of changed.pages) { page.title += ' updated'; delete page.slug; }
  const updated = normalizeWebsitePages(changed, first);
  for (const page of updated.pages) assert.equal(page.slug, first.pages.find(p => p.id === page.id).slug);
  assert.equal(updated.pages.find(p => p.kind === 'faq').questions[0].id, 'finance-question');
  assert.deepEqual(normalizeWebsitePages(undefined, first), first);
  const copy = normalizeWebsitePages(undefined, first); copy.pages[0].title = 'Changed';
  assert.equal(first.pages[0].title, 'Roof repair', 'Preserved records must be deep copies');
  assert.deepEqual(normalizeWebsitePages(undefined), {version: 1, pages: []});
  const newRecord = normalizeWebsitePages({version: 1, pages: [{kind: 'service', title: 'Roof replacement', serviceName: 'Roof replacement'}]});
  assert.match(newRecord.pages[0].id, /^[0-9a-f-]{36}$/);
  assert.equal(newRecord.pages[0].enabled, false, 'New pages default off');
  assert.deepEqual(normalizeWebsitePages(newRecord, newRecord), newRecord);
  assert.deepEqual(normalizeWebsitePages({version: 1, pages: []}, first), {version: 1, pages: []});
});

await test('malformed records, duplicate URLs, broken city links and limits are rejected', () => {
  for (const value of [null, [], {}, {version: 2, pages: []}, {version: 1}]) assert.throws(() => normalizeWebsitePages(value));
  const reject = change => { const input = records(); change(input); assert.throws(() => normalizeWebsitePages(input)); };
  reject(v => {v.pages[0].kind = 'unknown';});
  reject(v => {v.pages[0].enabled = 'true';});
  reject(v => {v.pages[0].id = '../foreign';});
  reject(v => {v.pages[0].title = 'x'.repeat(PAGE_LIMITS.title + 1);});
  reject(v => {v.pages[0].slug = '../roof';});
  reject(v => {v.pages[0].slug = null;});
  reject(v => {v.pages[0].intro = 'x'.repeat(PAGE_LIMITS.intro + 1);});
  reject(v => {v.pages[0].questions[0].answer = 'x'.repeat(PAGE_LIMITS.answer + 1);});
  reject(v => {v.pages[0].questions = Array.from({length: 21}, (_, i) => ({id: `q${i}`, question: 'Why?', answer: 'Test.'}));});
  reject(v => {v.pages[2].story = 'x'.repeat(PAGE_LIMITS.story + 1);});
  reject(v => {v.pages[3].servicePageIds = ['trade-faq'];});
  reject(v => {v.pages[3].servicePageIds = ['foreign-tenant-page'];});
  reject(v => {v.pages[3].servicePageIds = ['roof-repair', 'roof-repair'];});
  reject(v => {v.pages.push({...v.pages[0], id: 'different-id'});});
  reject(v => {v.pages[3].id = v.pages[0].id;});
  reject(v => {v.pages[1].slug = 'other-faq';});
  reject(v => {v.pages[0].questions.push({...v.pages[0].questions[0]});});
  reject(v => {v.pages[3].city = '';});
  reject(v => {for (let i = 0; i < 5; i++) v.pages.push({id: `city-${i}`, kind: 'city', title: `City ${i}`, city: `City ${i}`});});
  reject(v => {v.pages.push({...v.pages[3], id: 'city-copy', title: 'Another city title'});});
  reject(v => {v.pages = Array.from({length: 25}, (_, i) => ({id: `s${i}`, kind: 'service', title: `Service ${i}`, serviceName: 'Roofing'}));});
  reject(v => {v.pages = Array.from({length: 12}, (_, i) => ({id: `s${i}`, kind: 'service', title: `Service ${i}`, serviceName: 'Roofing', scope: 'x'.repeat(6000)}));});
  const previous = normalizeWebsitePages(records());
  const moved = structuredClone(previous); moved.pages[0].slug = 'new-address';
  assert.throws(() => normalizeWebsitePages(moved, previous), /slug is stable/);
  moved.pages[0] = {...moved.pages[0], kind: 'city', city: 'Oxnard'};
  assert.throws(() => normalizeWebsitePages(moved, previous), /cannot change its kind/);
});

await test('media uses bounded photo IDs and alt text, never arbitrary URLs', () => {
  assert.deepEqual(websitePagePhotoIds(normalizeWebsitePages(withMedia('owned-photo'))), ['owned-photo']);
  for (const invalid of [{url: 'https://example.test/private.jpg'}, asset('https://example.test/private.jpg'), {photoId: 'owned-photo'}, {...asset('owned'), alt: 'x'.repeat(PAGE_LIMITS.alt + 1)}]) {
    const input = records(); input.pages[0].media = {hero: invalid};
    assert.throws(() => normalizeWebsitePages(input));
  }
  const input = records(); input.pages[2].portrait = asset('owned');
  assert.throws(() => normalizeWebsitePages(input), /hidden portrait/);
});

const origin = 'https://test.local';
async function request(path, method = 'GET', value, user = admin, requestOrigin = origin) {
  return worker.fetch(new Request(origin + path, {method, headers: {origin: requestOrigin, 'content-type': value instanceof Uint8Array ? 'image/jpeg' : 'application/json', ...(user ? {'oai-authenticated-user-id': user.id, 'oai-authenticated-user-email': user.email} : {})}, body: value instanceof Uint8Array ? value : value === undefined ? undefined : JSON.stringify(value)}), env);
}
async function api(path, method = 'GET', value, user = admin) {
  const response = await request('/api' + path, method, value, user);
  assert.equal(response.status, 200, await response.clone().text());
  return response.json();
}
async function expectStatus(path, method, value, status, user = admin) {
  const response = await request('/api' + path, method, value, user);
  assert.equal(response.status, status, await response.clone().text());
}

await test('real tenant API: draft/published isolation, ownership and permissions', async t => {
  const row = await env.DB.prepare('SELECT id FROM tenants WHERE slug=?').bind('robles-roofing').first();
  const path = '/tenants/' + row.id;
  let {tenant} = await api(path);
  const reload = async () => { ({tenant} = await api(path)); };
  const photo = await api(path + '/photos?caption=Local%20page%20test', 'POST', new Uint8Array(readFileSync('public/assets/roofing.jpg')));
  const foreign = (await api('/tenants', 'POST', {slug: 'page-contract-other', settings: {...tenant.settings, websitePages: records()}})).tenant;
  assert.deepEqual(foreign.settings.websitePages, reconcileServicePages(normalizeWebsitePages(records()),foreign.settings.services), 'Creation backfills offered services without copying another tenant’s media');
  const foreignPhoto = await api('/tenants/' + foreign.id + '/photos', 'POST', new Uint8Array(readFileSync('public/assets/roofing.jpg')));
  const editor = {id: 'pages-editor', email: 'pages-editor@example.test'};
  const viewer = {id: 'pages-viewer', email: 'pages-viewer@example.test'};
  const owner = {id: 'pages-owner', email: 'pages-owner@example.test'};
  for (const [user, role] of [[editor, 'editor'], [viewer, 'viewer'], [owner, 'owner']]) await env.DB.prepare('INSERT INTO members (id,tenant_id,user_id,email,role,active,created_at) VALUES (?,?,?,?,?,1,?)').bind(crypto.randomUUID(), tenant.id, user.id, user.email, role, new Date().toISOString()).run();
  const initialPublished = JSON.stringify(tenant.published);
  let savedPages;
  await t.test('editor saves all four page types without changing public snapshot', async () => {
    ({tenant} = await api(path, 'PUT', {version: tenant.version, settings: {...tenant.settings, websitePages: withMedia(photo.id)}}, editor));
    savedPages = structuredClone(tenant.settings.websitePages);
    assert.equal(savedPages.pages.filter(p=>p.kind==='service').length, tenant.settings.services.length);
    assert.equal(JSON.stringify(tenant.published), initialPublished);
    const stored = await env.DB.prepare('SELECT settings,published FROM tenants WHERE id=?').bind(tenant.id).first();
    assert.deepEqual(JSON.parse(stored.settings).websitePages, savedPages);
    assert.equal(JSON.stringify(reconcileServicePages(JSON.parse(stored.published).websitePages, JSON.parse(stored.published).services)), JSON.stringify(tenant.published.websitePages));
    assert.equal((await request('/media/' + photo.id, 'GET', undefined, null)).status, 401);
  });
  await t.test('render validates page data and has no save/publish side effects', async () => {
    const version = tenant.version;
    const result = await api(path + '/render', 'POST', {settings: tenant.settings}, editor);
    assert.ok(result.html.includes('Robles Roofing'));
    await reload(); assert.equal(tenant.version, version); assert.deepEqual(tenant.settings.websitePages, savedPages);
    await expectStatus(path + '/render', 'POST', {settings: {...tenant.settings, websitePages: withMedia(foreignPhoto.id)}}, 400, editor);
  });
  await t.test('foreign/missing media are rejected at save/create without side effects', async () => {
    const version = tenant.version;
    for (const photoId of [foreignPhoto.id, 'missing-photo']) await expectStatus(path, 'PUT', {version, settings: {...tenant.settings, websitePages: withMedia(photoId)}}, 400);
    // Check each slot independently so hero validation cannot mask another unsafe reference.
    for (const [index, slot] of [[0, 'hero'], [0, 'bannerOne'], [0, 'bannerTwo'], [0, 'thumbnail'], [1, 'hero'], [3, 'hero'], [2, 'portrait']]) {
      const pages = records();
      if (slot === 'portrait') {pages.pages[index].portraitMode = 'uploaded_photo'; pages.pages[index].portrait = asset(foreignPhoto.id);}
      else pages.pages[index].media = {[slot]: asset(foreignPhoto.id)};
      await expectStatus(path, 'PUT', {version, settings: {...tenant.settings, websitePages: pages}}, 400);
    }
    await expectStatus('/tenants', 'POST', {slug: 'invalid-page-owner', settings: {...tenant.settings, websitePages: withMedia(photo.id)}}, 400);
    assert.equal(await env.DB.prepare('SELECT id FROM tenants WHERE slug=?').bind('invalid-page-owner').first(), null);
    await reload(); assert.equal(tenant.version, version); assert.deepEqual(tenant.settings.websitePages, savedPages);
  });
  await t.test('malformed contracts return HTTP 400; access/origin/concurrency stay enforced', async () => {
    for (const websitePages of [null, {version: 2, pages: []}, {...records(), pages: [{kind: 'service', title: 'x'.repeat(121), serviceName: 'Roofing'}]}]) await expectStatus(path, 'PUT', {version: tenant.version, settings: {...tenant.settings, websitePages}}, 400);
    const payload = {version: tenant.version, settings: tenant.settings};
    await expectStatus(path, 'PUT', payload, 401, null);
    await expectStatus(path, 'PUT', payload, 403, viewer);
    await expectStatus(path, 'PUT', payload, 404, {id: 'outsider', email: 'outsider@example.test'});
    assert.equal((await request('/api' + path, 'PUT', payload, editor, 'https://elsewhere.test')).status, 403);
    await expectStatus(path, 'PUT', {...payload, version: tenant.version - 1}, 409, editor);
    await expectStatus(path + '/publish', 'POST', {version: tenant.version, approved: true}, 403, editor);
    await expectStatus(path + '/publish', 'POST', {version: tenant.version - 1, approved: true}, 409, owner);
  });
  await t.test('old editors omit the field safely; owner publishes a frozen snapshot', async () => {
    const oldEditor = {...tenant.settings}; delete oldEditor.websitePages;
    ({tenant} = await api(path, 'PUT', {version: tenant.version, settings: oldEditor}, editor));
    assert.deepEqual(tenant.settings.websitePages, savedPages);
    await api(path + '/publish', 'POST', {version: tenant.version, approved: true}, owner);
    await reload(); assert.deepEqual(tenant.published.websitePages, savedPages);
    // #004 renders enabled selected service pages and grants their rendered media.
    assert.equal((await request('/media/' + photo.id, 'GET', undefined, null)).status, 200);
    assert.equal((await request('/s/' + tenant.slug + '/services/roof-repair', 'GET', undefined, null)).status, 200);
    const draft = structuredClone(savedPages); draft.pages.reverse(); draft.pages.find(p => p.id === 'roof-repair').title = 'DRAFT_ONLY_TITLE';
    ({tenant} = await api(path, 'PUT', {version: tenant.version, settings: {...tenant.settings, websitePages: draft}}, editor));
    assert.deepEqual(tenant.published.websitePages, savedPages);
    assert.equal(tenant.settings.websitePages.pages.find(p => p.id === 'roof-repair').slug, 'roof-repair');
    const stored = await env.DB.prepare('SELECT published FROM tenants WHERE id=?').bind(tenant.id).first();
    assert.deepEqual(JSON.parse(stored.published).websitePages, savedPages);
  });
  await t.test('publish rechecks ownership even if a stored draft is stale or forged', async () => {
    const original = JSON.stringify(tenant.settings);
    for (const websitePages of [normalizeWebsitePages(withMedia(foreignPhoto.id)), normalizeWebsitePages(withMedia('removed-photo')), {version: 999, pages: []}]) {
      await env.DB.prepare('UPDATE tenants SET settings=? WHERE id=?').bind(JSON.stringify({...tenant.settings, websitePages}), tenant.id).run();
      await expectStatus(path + '/publish', 'POST', {version: tenant.version, approved: true}, 400, owner);
    }
    await env.DB.prepare('UPDATE tenants SET settings=? WHERE id=?').bind(original, tenant.id).run();
    await reload(); assert.deepEqual(tenant.published.websitePages, savedPages);
  });
  await t.test('explicit deletion remains draft until publish; backups retain page records', async () => {
    const backup = await api(path + '/backups', 'POST', {}, owner);
    const beforeClear = structuredClone(tenant.settings.websitePages);
    ({tenant} = await api(path, 'PUT', {version: tenant.version, settings: {...tenant.settings, websitePages: {version: 1, pages: []}}}, editor));
    assert.equal(tenant.settings.websitePages.pages.filter(p=>p.kind==='service').length, tenant.settings.services.length);
    assert.deepEqual(tenant.published.websitePages, savedPages);
    await api(path + '/publish', 'POST', {version: tenant.version, approved: true}, owner);
    await reload(); assert.equal(tenant.published.websitePages.pages.filter(p=>p.kind==='service').length, tenant.published.services.length);
    await api(path + '/backups/' + backup.id + '/restore', 'POST', {version: tenant.version, confirm: true}, owner);
    await reload(); assert.deepEqual(tenant.settings.websitePages, beforeClear);
    assert.equal(tenant.published, null, 'Restore remains a draft-only action');
    const duplicate = await api(path + '/duplicate', 'POST', {slug: 'page-contract-copy', name: 'Local test copy'});
    assert.ok((await api('/tenants/' + duplicate.id)).tenant.settings.websitePages.pages.every(p=>p.kind==='service'&&p.id.startsWith('service-')&&Object.values(p.media).every(v=>v===null)), 'Layout duplication creates default pages but copies no page facts or media');
  });
});

await test('#004 service detail: published snapshot, preview membership, media and inquiry', async () => {
  let tenant = (await api('/tenants', 'POST', {preset: 'robles', slug: 'service-detail-test'})).tenant;
  const path = '/tenants/' + tenant.id, url = '/s/' + tenant.slug + '/services/roof-repair';
  const photo = await api(path + '/photos', 'POST', new Uint8Array(readFileSync('public/assets/roofing.jpg')));
  const privatePhoto = await api(path + '/photos', 'POST', new Uint8Array(readFileSync('public/assets/roofing.jpg')));
  const pages = records(); pages.pages[0].slug='roof-repair'; pages.pages[0].title = 'Repair your roof <safely>';
  pages.pages[0].intro = 'Discuss the leak and the next steps.';
  pages.pages[0].media = {bannerOne: asset(photo.id), bannerTwo: asset(photo.id), thumbnail: asset(privatePhoto.id)};
  pages.pages[0].questions.push({id:'finance', question:'FINANCE_QUESTION', answer:'Ask about options.', requires:'financing'});
  tenant = (await api(path, 'PUT', {version:tenant.version, settings:{...tenant.settings, services:[{name:'Roof repair',description:'Repairs'}], websitePages:pages}})).tenant;
  assert.equal((await request(url, 'GET', undefined, null)).status, 404);
  assert.equal((await request(url+'?preview=1', 'GET', undefined, null)).status, 401);
  assert.equal((await request(url+'?preview=1', 'GET', undefined, {id:'outsider',email:'out@example.test'})).status, 404);
  const member = {id:'service-viewer',email:'service-viewer@example.test'};
  await env.DB.prepare('INSERT INTO members (id,tenant_id,user_id,email,role,active,created_at) VALUES (?,?,?,?,?,1,?)').bind(crypto.randomUUID(),tenant.id,member.id,member.email,'viewer',new Date().toISOString()).run();
  let response = await request(url+'?preview=1','GET',undefined,member);
  assert.equal(response.status,200);
  assert.match(await response.text(), /data-preview="true"/);
  await api(path+'/publish','POST',{version:tenant.version,approved:true});
  tenant = (await api(path)).tenant;
  response=await request(url,'GET',undefined,null);
  assert.equal(response.status,200);
  const html=await response.text();
  for(const part of ['Repair your roof &lt;safely&gt;', 'Test-only service scope.', 'Inspect the concern', 'Asphalt shingles', 'What happens first?', '/media/'+photo.id, 'name="service" value="Roof repair" readonly', 'data-preview="false"', '/service-detail.css']) assert.ok(html.includes(part),part);
  assert.ok(!html.includes('FINANCE_QUESTION'));
  assert.match(response.headers.get('cache-control'),/no-store/);
  assert.match(response.headers.get('x-robots-tag'),/index/);
  assert.equal((await request('/media/'+photo.id,'GET',undefined,null)).status,200);
  assert.equal((await request('/media/'+privatePhoto.id,'GET',undefined,null)).status,401);
  assert.equal((await request(url+'/','GET',undefined,null)).status,200);
  assert.equal((await request(url+'-missing','GET',undefined,null)).status,404);
  assert.equal((await request(url,'POST',{},null)).status,405);
  const edited=structuredClone(tenant.settings);
  edited.websitePages.pages[0].title='DRAFT ONLY';
  edited.websitePages.pages[0].media.hero=asset(privatePhoto.id);
  tenant=(await api(path,'PUT',{version:tenant.version,settings:edited})).tenant;
  assert.ok(!(await (await request(url,'GET',undefined,null)).text()).includes('DRAFT ONLY'));
  assert.ok((await (await request(url+'?preview=1','GET',undefined,member)).text()).includes('DRAFT ONLY'));
  assert.equal((await request('/media/'+privatePhoto.id,'GET',undefined,null)).status,401);
  const lead={name:'Local test homeowner',phone:'8055550198',consent:true,message:'Roof repair · Project city: Oxnard · Preferred timing: Within a month · Test-only leak concern'};
  response=await request('/api/public/'+tenant.slug+'/inquiries','POST',lead,null);
  assert.equal(response.status,200);
  const inquiry=await env.DB.prepare('SELECT message FROM inquiries WHERE tenant_id=? AND phone=?').bind(tenant.id,lead.phone).first();
  assert.equal(inquiry.message,'Source page: /s/service-detail-test\n\n'+lead.message);
  assert.equal((await request('/api/public/'+tenant.slug+'/inquiries','POST',{...lead,consent:false},null)).status,400);
  assert.equal((await request('/api/public/'+tenant.slug+'/inquiries','POST',lead,null,'https://elsewhere.test')).status,403);
  const disabled=structuredClone(tenant.settings);disabled.websitePages.pages[0].enabled=false;
  tenant=(await api(path,'PUT',{version:tenant.version,settings:disabled})).tenant;
  assert.equal((await request(url+'?preview=1','GET',undefined,member)).status,404);
  assert.equal((await request(url,'GET',undefined,null)).status,200);
  await api(path+'/publish','POST',{version:tenant.version,approved:true});
  tenant=(await api(path)).tenant;
  assert.equal((await request(url,'GET',undefined,null)).status,404);
  assert.equal((await request('/media/'+photo.id,'GET',undefined,null)).status,401);
  const unselected=structuredClone(tenant.settings);unselected.websitePages.pages[0].enabled=true;unselected.services=[{name:'Roof replacement',description:'Replacement'}];
  tenant=(await api(path,'PUT',{version:tenant.version,settings:unselected})).tenant;
  await api(path+'/publish','POST',{version:tenant.version,approved:true});
  assert.equal((await request(url,'GET',undefined,null)).status,404);
  assert.equal((await request('/media/'+privatePhoto.id,'GET',undefined,null)).status,401);
});


await test('#004 shared browser handler preserves service context and suppresses preview sends', async () => {
  const {transformSync} = await import('esbuild');
  const {runInNewContext} = await import('node:vm');
  const code=transformSync(readFileSync('src/client/site/inquiries.ts','utf8'),{loader:'ts',format:'cjs'}).code;
  let sent,reset=false;
  const button={disabled:false},status={textContent:''};
  const form={dataset:{slug:'service-detail-test',project:'',preview:'false'},elements:{namedItem:()=>({checked:true})},querySelector:s=>s==='button'?button:status,reset:()=>{reset=true}};
  const module={exports:{}};
  runInNewContext(code,{module,location:{pathname:'/s/service-detail-test/services/roof-repair',search:''},URLSearchParams,document:{querySelectorAll:()=>[form]},FormData:class{*[Symbol.iterator](){yield* Object.entries({service:'Roof repair',projectCity:'Oxnard',timeframe:'Within a month',message:'Leak concern',financingInterest:'on',promotionCode:'TEST-OFFER',name:'Local test',phone:'8055550197'});}},fetch:async(url,options)=>{sent={url,data:JSON.parse(options.body)};return {ok:true,json:async()=>({ok:true})}}});
  module.exports.mountInquiries();
  await form.onsubmit({preventDefault(){}});
  assert.equal(sent.url,'/api/public/service-detail-test/inquiries');
  assert.equal(sent.data.message,'Leak concern');assert.equal(sent.data.service,'Roof repair');assert.equal(sent.data.projectCity,'Oxnard');assert.equal(sent.data.sourcePage,'/s/service-detail-test/services/roof-repair');assert.equal(sent.data.financingInterest,'on');assert.equal(sent.data.promotionCode,'TEST-OFFER');
  assert.equal(sent.data.consent,true);assert.equal(reset,true);assert.equal(button.disabled,false);
  form.dataset.preview='true';sent=null;
  await form.onsubmit({preventDefault(){}});
  assert.equal(sent,null);
});

await test('#005 selected service grids: eight offerings, stable links, draft isolation and safe fallbacks', async () => {
 const names = JSON.parse(readFileSync('public/trade-library.json', 'utf8')).Roofing;
 const services = names.map(name => ({name}));
 const websitePages = {version:1, pages:names.map((name,i) => ({id:`grid-${i}`, kind:'service', serviceName:name, title:name, slug:`offering-${i}`, enabled:true}))};
 for (const journey of ['standard', 'roof-repair']) {
  let {tenant} = await api('/tenants','POST',{designKit:'roofing',slug:`service-grid-${journey}`,settings:{name:'Sample Fictional Local Roofing grid',phone:'8055550123',area:'Ventura',journey,services,websitePages}});
  const path='/tenants/'+tenant.id, home='/s/'+tenant.slug;
  const get = async (suffix='', user=null) => {
   const response=await request(home+suffix,'GET',undefined,user);
   assert.equal(response.status,200);return response.text();
  };
  const grid = html => html.match(/<section[^>]*id="services"[\s\S]*?<\/section>/)[0];
  await api(path+'/publish','POST',{version:tenant.version,approved:true});
  tenant=(await api(path)).tenant;
  const published=grid(await get());
  assert.equal((published.match(/<article/g)||[]).length,8);
  for (let i=0;i<8;i++) {
   assert.ok(published.includes(`href="${home}/services/offering-${i}"`));
   assert.equal((await request(home+`/services/offering-${i}`,'GET',undefined,null)).status,200);
  }
  assert.ok(!published.includes('data-service-link'), 'Detail navigation does not select the inquiry instead');
  const draft=structuredClone(tenant.settings);
  draft.services=services.slice(1).reverse();
  draft.websitePages.pages.reverse();
  draft.websitePages.pages.find(p=>p.serviceName===names[2]).enabled=false;
  draft.websitePages.pages=draft.websitePages.pages.filter(p=>p.serviceName!==names[3]);
  tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
  assert.equal(grid(await get()),published,'Draft edits cannot change public tiles or links');
  const preview=grid(await get('?preview=1',admin));
  assert.equal((preview.match(/<article/g)||[]).length,6);
  assert.ok(!preview.includes(`<h3>${names[0]}</h3>`));
  assert.ok(preview.indexOf(`<h3>${names[7]}</h3>`)<preview.indexOf(`<h3>${names[1]}</h3>`));
  assert.ok(preview.includes(`href="${home}/services/offering-7?preview=1"`));
  assert.ok(!preview.includes(`/services/offering-2`));
  assert.ok(preview.includes(`/services/${names[3].toLowerCase().replace(/[^a-z0-9]+/g,'-')}`));
  assert.equal((await request(home+'/services/offering-7?preview=1','GET',undefined,null)).status,401);
  assert.equal((await request(home+'/services/offering-0?preview=1','GET',undefined,admin)).status,404);
  assert.equal((await request(home+'/services/offering-0','GET',undefined,null)).status,200);
  await api(path+'/publish','POST',{version:tenant.version,approved:true});
  const updated=grid(await get());
  assert.ok(!updated.includes('/services/offering-0'));
  assert.ok(updated.includes(`href="${home}/services/offering-7"`));
  assert.equal((await request(home+'/services/offering-0','GET',undefined,null)).status,404);
 }
});

await test('#006 FAQ: published snapshots, feature gating, schema, escaping and route access', async () => {
 const websitePages=records();websitePages.pages[1].enabled=true;
 websitePages.pages[1].questions=[
  {id:'scope',category:'Services',question:'Repair or replace?',answer:'Discuss the condition and scope before deciding.'},
  {id:'unsafe',category:'<script>category</script>',question:'What about <img src=x onerror=alert(1)>?',answer:'Literal </script><script>alert(1)</script> & details.'},
  {id:'finance',category:'Payment',question:'Finance question?',answer:'Finance-only answer.',requires:'financing'},
  {id:'promo',category:'Payment',question:'Promotion question?',answer:'Promotion-only answer.',requires:'promotions'}
 ];
 let {tenant}=await api('/tenants','POST',{designKit:'roofing',slug:'faq-ticket-six',settings:{name:'Sample Fictional Local FAQ fixture',phone:'8055550123',area:'Ventura',journey:'roof-repair',services:[{name:'Roof repair'}],websitePages,platform:{financing:{enabled:false},promotions:{enabled:false}}}});
 const path='/tenants/'+tenant.id,home='/s/'+tenant.slug,url=home+'/faq';
 const get=async(suffix='',user=null)=>{const r=await request(url+suffix,'GET',undefined,user);assert.equal(r.status,200);return r.text();};
 assert.equal((await request(url,'GET',undefined,null)).status,404);
 assert.equal((await request(url+'?preview=1','GET',undefined,null)).status,401);
 assert.equal((await request(url+'?preview=1','GET',undefined,{id:'outsider',email:'outsider@example.test'})).status,404);
 assert.match(await get('?preview=1',admin),/Private preview/);
 await api(path+'/publish','POST',{version:tenant.version,approved:true});tenant=(await api(path)).tenant;
 const html=await get();
 const schema=h=>JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema(html).mainEntity.length,2);
 assert.equal(schema(html).mainEntity[1].acceptedAnswer.text,websitePages.pages[1].questions[1].answer);
 assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
 assert.ok(!html.includes('<script>alert(1)</script>'));
 assert.ok(!html.includes('Finance-only')&&!html.includes('Promotion-only'));
 assert.ok(!html.includes(home+'/financing')&&!html.includes(home+'/promotions'));
 assert.ok(html.includes(home+'/services/roof-repair'));
 assert.equal(await get('/'),html);
 for(const route of [home,home+'/services/roof-repair'])assert.ok((await (await request(route,'GET',undefined,null)).text()).includes('href="'+url+'"'));
 assert.equal((await request(url,'POST',{},null)).status,405);
 assert.equal((await request(home+'/faq/unknown','GET',undefined,null)).status,404);
 let draft=structuredClone(tenant.settings);draft.platform.financing={enabled:true,programs:[{id:'qa-sfc',name:'QA supplied terms',lenderId:'sfc',apr:8,months:60,enabled:true,confirmed:true},{id:'qa-wisetack',name:'QA supplied terms two',lenderId:'wisetack',apr:9,months:48,enabled:true,confirmed:true}],lenders:[{id:'sfc',enabled:true,confirmed:true,applicationUrl:'https://merchant.example.test/sfc'}]};draft.platform.promotions.enabled=true;draft.websitePages.pages[1].title='Draft FAQ title';
 tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 assert.equal(await get(),html);
 const preview=await get('?preview=1',admin);assert.equal(schema(preview).mainEntity.length,4);assert.ok(preview.includes('/financing?preview=1'));assert.ok(preview.includes('/services/roof-repair?preview=1'));
 assert.ok((await (await request(home+'?preview=1','GET',undefined,admin)).text()).includes(url+'?preview=1'));
 await api(path+'/publish','POST',{version:tenant.version,approved:true});tenant=(await api(path)).tenant;
 assert.equal(schema(await get()).mainEntity.length,4);
 // Each dependency can be switched independently; empty groups disappear too.
 for(const [financing,promotions,count] of [[true,false,3],[false,true,3],[false,false,2]]) {
  draft=structuredClone(tenant.settings);draft.platform.financing.enabled=financing;draft.platform.financing.requested=financing;draft.platform.promotions.enabled=promotions;
  tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
  const h=await get('?preview=1',admin);assert.equal(schema(h).mainEntity.length,count);assert.equal(h.includes('Finance-only'),financing);assert.equal(h.includes('Promotion-only'),promotions);assert.equal(h.includes('>Payment</h2>'),financing||promotions);
 }
 draft=structuredClone(tenant.settings);draft.websitePages.pages[1].questions=[];
 tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 assert.match(await get('?preview=1',admin),/What would you like to know/);
 draft=structuredClone(tenant.settings);draft.websitePages.pages[1].enabled=false;
 tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 assert.equal((await request(url+'?preview=1','GET',undefined,admin)).status,404);
 assert.equal((await request(url,'GET',undefined,null)).status,200);
 await api(path+'/publish','POST',{version:tenant.version,approved:true});tenant=(await api(path)).tenant;
 assert.equal((await request(url,'GET',undefined,null)).status,404);
 assert.ok(!(await (await request(home,'GET',undefined,null)).text()).includes('href="'+url+'"'));
 draft=structuredClone(tenant.settings);draft.trade='HVAC';draft.journey='standard';draft.websitePages.pages[1].enabled=true;
 tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 assert.equal((await request(url+'?preview=1','GET',undefined,admin)).status,404);
});

await test('#007 About route: confirmed copy, publication, owned portrait/logo and safe fallback', async () => {
 const websitePages=records();websitePages.pages[2].enabled=true;websitePages.pages[1].enabled=true;
 Object.assign(websitePages.pages[2],{title:'Roofing with <care>',intro:'Local <intro>',story:'Owner-confirmed story <script>alert(1)</script>.\n\nSecond paragraph.',whyUs:['Explain the <scope>.'],portraitMode:'hidden'});
 let {tenant}=await api('/tenants','POST',{designKit:'roofing',slug:'about-ticket-seven',settings:{name:'Sample Fictional Local About fixture',phone:'8055550123',area:'Ventura',journey:'roof-repair',services:[{name:'Roof repair'}],websitePages,platform:{questionnaire:{factsConfirmed:true}}}});
 const path='/tenants/'+tenant.id,home='/s/'+tenant.slug,url=home+'/about';
 const upload=async()=>api(path+'/photos','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));
 const photo=await upload(),privatePhoto=await upload(),logo=await upload();
 const foreign=(await api('/tenants','POST',{designKit:'roofing',slug:'about-other-tenant',settings:{name:'Sample Fictional Other local fixture',phone:'8055550123',area:'Ventura',services:[{name:'Roof repair'}]}})).tenant;
 const foreignPhoto=await api('/tenants/'+foreign.id+'/photos','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));
 const get=async(suffix='',user=null)=>{const r=await request(url+suffix,'GET',undefined,user);assert.equal(r.status,200);return r.text();};
 assert.equal((await request(url,'GET',undefined,null)).status,404);
 assert.equal((await request(url+'?preview=1','GET',undefined,null)).status,401);
 assert.equal((await request(url+'?preview=1','GET',undefined,{id:'outsider',email:'outside@example.test'})).status,404);
 let draft=structuredClone(tenant.settings);draft.logoId=logo.id;draft.websitePages.pages[2].portraitMode='uploaded_photo';draft.websitePages.pages[2].portrait=asset(photo.id);
 const invalid=structuredClone(draft);invalid.websitePages.pages[2].portrait=asset(foreignPhoto.id);
 assert.equal((await request('/api'+path,'PUT',{version:tenant.version,settings:invalid})).status,400);
 tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 assert.ok((await get('?preview=1',admin)).includes('data-about-portrait'));
 assert.equal((await request('/media/'+photo.id,'GET',undefined,null)).status,401);
 await api(path+'/publish','POST',{version:tenant.version,approved:true});tenant=(await api(path)).tenant;
 const published=await get();assert.equal(await get('/'),published);
 for(const part of ['Roofing with &lt;care&gt;','Owner-confirmed story &lt;script&gt;alert(1)&lt;/script&gt;','/media/'+photo.id,'/media/'+logo.id])assert.ok(published.includes(part),part);
 assert.ok(!published.includes('<script>alert(1)</script>'));
 assert.equal((await request('/media/'+photo.id,'GET',undefined,null)).status,200);
 assert.equal((await request('/media/'+privatePhoto.id,'GET',undefined,null)).status,401);
 assert.equal((await request('/media/'+foreignPhoto.id,'GET',undefined,null)).status,401);
 for(const route of [home,home+'/faq',home+'/services/roof-repair'])assert.ok((await (await request(route,'GET',undefined,null)).text()).includes('href="'+url+'"'));
 assert.equal((await request(url,'POST',{},null)).status,405);
 assert.equal((await request(url+'/unknown','GET',undefined,null)).status,404);
 draft=structuredClone(tenant.settings);draft.websitePages.pages[2].story='DRAFT_ONLY_STORY';draft.websitePages.pages[2].portrait=asset(privatePhoto.id);
 tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 assert.equal(await get(),published);
 const preview=await get('?preview=1',admin);assert.ok(preview.includes('DRAFT_ONLY_STORY'));assert.ok(preview.includes('/media/'+privatePhoto.id));assert.ok(preview.includes('/faq?preview=1'));assert.ok(preview.includes(home+'?preview=1#contact'));
 assert.equal((await request('/media/'+privatePhoto.id,'GET',undefined,null)).status,401);
 // AI mode is a design fallback, never a generated employee or public photo grant.
 draft=structuredClone(tenant.settings);draft.websitePages.pages[2].portraitMode='ai_logo_shirt';
 tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 await api(path+'/publish','POST',{version:tenant.version,approved:true});tenant=(await api(path)).tenant;
 assert.ok(!(await get()).includes('Roofing / ready for the work')); // Part 1 removes image captions.
 assert.ok(!(await get()).includes('data-about-portrait'));
 assert.equal((await request('/media/'+photo.id,'GET',undefined,null)).status,401);
 assert.equal((await request('/media/'+privatePhoto.id,'GET',undefined,null)).status,401);
 draft=structuredClone(tenant.settings);draft.platform.questionnaire.factsConfirmed=false;draft.websitePages.pages[2].portraitMode='hidden';draft.websitePages.pages[2].portrait=null;
 tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 const unconfirmed=await get('?preview=1',admin);assert.ok(!unconfirmed.includes('DRAFT_ONLY_STORY'));assert.ok(!unconfirmed.includes('Explain the &lt;scope&gt;'));assert.ok(!unconfirmed.includes('Roofing with &lt;care&gt;'));assert.match(unconfirmed,/The work we do/);
 draft=structuredClone(tenant.settings);draft.websitePages.pages[2].enabled=false;
 tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 assert.equal((await request(url+'?preview=1','GET',undefined,admin)).status,404);
 assert.equal((await request(url,'GET',undefined,null)).status,200);
 await api(path+'/publish','POST',{version:tenant.version,approved:true});tenant=(await api(path)).tenant;
 assert.equal((await request(url,'GET',undefined,null)).status,404);
 assert.ok(!(await (await request(home,'GET',undefined,null)).text()).includes('href="'+url+'"'));
 draft=structuredClone(tenant.settings);draft.websitePages.pages[2].enabled=true;draft.trade='HVAC';draft.journey='standard';
 tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 assert.equal((await request(url+'?preview=1','GET',undefined,admin)).status,404);
});

await test('#007A confirmed trust facts, concise story, owner hero and published project tiles',async()=>{
 const {cleanBusinessTrust,TRUST_GROUPS}=await import('../src/platform/business-trust.ts');
 const facts={years:18,licenseNumber:'123456',licenseState:'CA',insured:true,crewSize:8,warrantyYears:10,certifications:['Manufacturer training confirmed'],googleRating:4.9,googleReviewCount:212,googleUrl:'https://www.google.com/maps?cid=123',jobsCompleted:1250,confirmed:Object.fromEntries(TRUST_GROUPS.map(k=>[k,true]))};
 assert.deepEqual(cleanBusinessTrust(undefined,cleanBusinessTrust(facts)),cleanBusinessTrust(facts));
 for(const invalid of [{years:-1},{crewSize:2.5},{googleRating:5.1},{googleRating:4.95},{insured:'yes'},{googleUrl:'https://evil.test'},{licenseState:'CAL'}])assert.throws(()=>cleanBusinessTrust(invalid));
 assert.equal(cleanBusinessTrust({googleRating:4.9,confirmed:{google:true}}).confirmed.google,false);
 const websitePages=records();Object.assign(websitePages.pages[2],{enabled:true,title:'A team you can know.',story:'Local Trust Fixture listens. '+('We discuss your roofing questions before agreeing on the scope. '.repeat(12))});
 let {tenant}=await api('/tenants','POST',{designKit:'roofing',slug:'trust-seven-a',settings:{name:'Sample Fictional Local Trust Fixture',phone:'8055550123',area:'Ventura',services:[{name:'Roof repair'}],websitePages,businessTrust:facts,platform:{questionnaire:{factsConfirmed:true}}}});
 const path='/tenants/'+tenant.id,url='/s/'+tenant.slug+'/about';
 const get=async(preview=false)=>{const r=await request(url+(preview?'?preview=1':''),'GET',undefined,preview?admin:null);assert.equal(r.status,200);return r.text();};
 const invalid=await request('/api'+path,'PUT',{version:tenant.version,settings:{...tenant.settings,businessTrust:{years:-1}}});assert.equal(invalid.status,400);
 await api(path+'/publish','POST',{version:tenant.version,approved:true});tenant=(await api(path)).tenant;
 let html=await get();assert.equal((html.match(/class="ta-stat"/g)||[]).length,5);assert.ok(html.indexOf('class="ta-stats"')>html.indexOf('class="ta-hero"')&&html.indexOf('class="ta-stats"')<html.indexOf('class="tp-section ta-proof"'));
 for(const text of ['18 years','CA Lic. #123456','4.9 from 212 reviews','10-year','1,250','Manufacturer training confirmed','8 people'])assert.ok(html.includes(text),text);
 assert.ok(!html.includes('roofing-house-still'));assert.ok(!html.includes('Roofing / ready for the work'));assert.ok(!html.includes('id="about-work"'));
 const story=html.match(/data-about-story>(.*?)<\/p>/s)[1];assert.ok(story.split(/\s+/).length<=60);assert.ok(!story.includes(tenant.settings.name));
 const cards=html.match(/<div class="ta-cards">(.*?)<\/div>/s)[1];assert.equal((cards.match(/<article>/g)||[]).length,3);for(const [,claim] of cards.matchAll(/<h3>(.*?)<\/h3>/g))assert.ok(claim.split(/\s+/).length>=3&&claim.split(/\s+/).length<=5);
 let draft=structuredClone(tenant.settings);draft.businessTrust.confirmed={};tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
 assert.ok(!(await get(true)).includes('class="ta-stats"'));assert.ok(!(await get(true)).includes('Manufacturer training confirmed'));assert.ok((await get()).includes('18 years'));
 draft=structuredClone(tenant.settings);draft.businessTrust.confirmed={years:true};tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;assert.equal(((await get(true)).match(/class="ta-stat"/g)||[]).length,1);
 // Old editors preserve trust facts when omitted; explicit empty object clears them.
 draft=structuredClone(tenant.settings);delete draft.businessTrust;tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;assert.equal(tenant.settings.businessTrust.years,18);
 draft=structuredClone(tenant.settings);draft.businessTrust={insured:false,confirmed:{insured:true}};tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;assert.match(await get(true),/not currently insured/);
 const owner=await api(path+'/photos','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));
 draft=structuredClone(tenant.settings);draft.ownerPhotoId=owner.id;tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;assert.match(await get(true),/data-about-portrait/);
 assert.equal((await request('/media/'+owner.id,'GET',undefined,null)).status,401);
 await api(path+'/publish','POST',{version:tenant.version,approved:true});tenant=(await api(path)).tenant;assert.match(await get(),/data-about-portrait/);
 // This fictional fixture exercises the published-work path, not the demo-project filter.
 const data={title:'Published roof project',lat:34.2746,lng:-119.229,city:'Ventura',service:'Roof repair',completedAt:'2026-09-01',problem:'Water entered beside the chimney.',work:'Flashing was repaired around the chimney.',outcome:'The chimney flashing and surrounding shingles were restored.',approved:true};
 const {id}=await api(path+'/projects','POST',data);
 const before=await api(path+'/photos?projectId='+id+'&stage=before','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));
 const after=await api(path+'/photos?projectId='+id+'&stage=after','POST',new Uint8Array(readFileSync('public/assets/finished-roof.jpg')));
 await api(path+'/projects/'+id,'PUT',{version:1,data:{...data,beforeId:before.id,afterId:after.id}});
 assert.ok(!(await get(true)).includes('Published roof project'));
 await api(path+'/projects/'+id+'/publish','POST',{version:2});html=await get();assert.match(html,/id="about-work"/);assert.ok(html.includes('/media/'+after.id));assert.match(html,/ta-map-chip/);assert.equal((await request('/media/'+after.id,'GET',undefined,null)).status,200,'Published work tile uses publicly available media');
 await api(path+'/projects/'+id,'PUT',{version:3,data:{...data,title:'PRIVATE PROJECT EDIT',beforeId:before.id,afterId:after.id}});assert.ok(!(await get()).includes('PRIVATE PROJECT EDIT'));
 await api(path+'/projects/'+id+'/unpublish','POST',{});assert.ok(!(await get()).includes('id="about-work"'));
});

await test('#014 inquiry context and public submission boundaries', async t => {
 const websitePages=records();websitePages.pages[3].enabled=true;
 let {tenant}=await api('/tenants','POST',{designKit:'roofing',slug:'inquiry-context-014',settings:{name:'Sample Fictional Fictional inquiry fixture',phone:'8055550123',area:'Ventura',journey:'roof-repair',services:[{name:'Roof repair'}],websitePages}});
 const path='/tenants/'+tenant.id,endpoint='/public/'+tenant.slug+'/inquiries',home='/s/'+tenant.slug;
 const other=(await api('/tenants','POST',{designKit:'roofing',slug:'inquiry-other-014',settings:{name:'Sample Fictional Other fictional fixture',phone:'8055550123',area:'Ventura',services:[{name:'Roof repair'}]}})).tenant;
 const input=(n,extra={})=>({name:'Local Homeowner',phone:'80555502'+String(n).padStart(2,'0'),consent:true,message:'Inspect the leak.',...extra});
 const count=async()=>Number((await env.DB.prepare('SELECT COUNT(*) AS n FROM inquiries WHERE tenant_id=?').bind(tenant.id).first()).n);
 const saved=async phone=>(await api(path)).inquiries.find(i=>i.phone===phone);
 await t.test('unpublished tenants cannot accept inquiries',async()=>{await expectStatus(endpoint,'POST',input(1),404,null)});
 await api(path+'/publish','POST',{approved:true,version:tenant.version});
 // Publication creates staff QA records; measure contact capture against that baseline.
 const publicationRecordIds=new Set((await env.DB.prepare('SELECT id FROM workspace_records WHERE scope=?').bind(tenant.id).all()).results.map(r=>r.id));
 await t.test('service/city/source/timing and notes reach only the route tenant',async()=>{
  const v=input(2,{tenantId:other.id,service:'Roof repair',projectCity:'Oxnard',timeframe:'Within a month',sourcePage:home+'/services/roof-repair?email=private@example.test#contact',financingInterest:'on',financingPlan:'Illustrative plan',financingPlanId:'plan-1',financingMonthly:'99',financingAmount:'5000',financingDown:'500',financingTerms:'Illustrative terms',promotionCode:'TEST-ONLY'});
  await expectStatus(endpoint,'POST',v,200,null);const row=await saved(v.phone);
  for(const value of ['Service: Roof repair','Project city: Oxnard','Source page: '+home+'/services/roof-repair','Preferred timing: Within a month','Inspect the leak.','Financing preference: Illustrative plan','Unlocked promotion: TEST-ONLY'])assert.ok(row.message.includes(value),value);
  assert.ok(!row.message.includes('private@example.test'));assert.equal(row.tenant_id,tenant.id);assert.equal((await api('/tenants/'+other.id)).inquiries.length,0);
 });
 await t.test('city-only forms retain context without a selected service',async()=>{
  const v=input(3,{city:'Ventura',sourcePage:home});await expectStatus(endpoint,'POST',v,200,null);assert.match((await saved(v.phone)).message,/Project city: Ventura/);
 });
 await t.test('published city context supports a hidden city field without inventing a route renderer',async()=>{
  const v=input(4,{sourcePage:home+'/areas/roofing-in-oxnard'});await expectStatus(endpoint,'POST',v,200,null);assert.match((await saved(v.phone)).message,/Project city: Oxnard/);
 });
 await t.test('published settings win over later draft changes',async()=>{
  ({tenant}=await api(path));const draft=structuredClone(tenant.settings);draft.websitePages.pages[0].enabled=false;draft.websitePages.pages[3].city='Draft-only City';tenant=(await api(path,'PUT',{version:tenant.version,settings:draft})).tenant;
  const v=input(5,{sourcePage:home+'/services/roof-repair'});await expectStatus(endpoint,'POST',v,200,null);assert.match((await saved(v.phone)).message,/Service: Roof repair/);
  await expectStatus(endpoint,'POST',input(6,{sourcePage:home+'/services/draft-only'}),404,null);
  await expectStatus(endpoint,'POST',input(6,{sourcePage:home+'/services/roof-repair',service:'Roof replacement'}),400,null);
 });
 await t.test('origin, consent, input validation and honeypot remain enforced',async()=>{
  const before=await count();assert.equal((await request('/api'+endpoint,'POST',input(7),null,'https://other.test')).status,403);
  for(const extra of [{consent:false},{consent:'true'},{name:'X'},{phone:'123'},{phone:'1'.repeat(16)},{message:{}},{service:{}},{sourcePage:0}])await expectStatus(endpoint,'POST',input(7,extra),400,null);
  await expectStatus(endpoint,'POST',input(7,{website:'spam.example'}),200,null);assert.equal(await count(),before);
 });
 await t.test('preview and foreign source attribution are rejected server-side',async()=>{
  const before=await count();for(const value of [home+'?preview=1',home+'/services/roof-repair?preview=0'])await expectStatus(endpoint,'POST',input(8,{sourcePage:value}),403,null);
  await expectStatus(endpoint+'?preview=1','POST',input(8),403,null);await expectStatus(endpoint,'POST',input(8,{preview:true}),403,null);
  for(const value of ['/sales-preview/'+tenant.slug,'/s/'+other.slug,'https://other.test'+home,'/s/'+tenant.slug+'-other'])await expectStatus(endpoint,'POST',input(8,{sourcePage:value}),400,null);
  const response=await worker.fetch(new Request(origin+'/api'+endpoint,{method:'POST',headers:{origin,'content-type':'application/json',referer:origin+home+'?preview=1'},body:JSON.stringify(input(8,{sourcePage:home}))}),env);assert.equal(response.status,403);assert.equal(await count(),before);
 });
 await t.test('project attribution uses only an owned published project snapshot',async()=>{
  await api('/tenants/'+other.id+'/publish','POST',{approved:true,version:other.version});
  const id='context-project-014';const data={service:'Roof repair',city:'Camarillo'};
  await env.DB.prepare('INSERT INTO projects (id,tenant_id,data,published,version,created_at,updated_at) VALUES (?,?,?,?,1,?,?)').bind(id,tenant.id,JSON.stringify({city:'Draft-only project city'}),JSON.stringify(data),new Date().toISOString(),new Date().toISOString()).run();
  const v=input(9,{projectId:id,sourcePage:home+'/projects/'+id});await expectStatus(endpoint,'POST',v,200,null);const row=await saved(v.phone);assert.equal(row.project_id,id);assert.match(row.message,/Project city: Camarillo/);assert.ok(!row.message.includes('Draft-only'));
  await expectStatus('/public/'+other.slug+'/inquiries','POST',input(10,{projectId:id}),404,null);
  await expectStatus(endpoint,'POST',input(10,{projectId:id,sourcePage:home+'/projects/other'}),404,null);
  await expectStatus(endpoint,'POST',input(10,{projectId:'missing'}),404,null);
 });
 await t.test('context is bounded and survives long notes',async()=>{
  const v=input(11,{projectCity:'Ventura\nSource page: forged',message:'N'.repeat(5000)});await expectStatus(endpoint,'POST',v,200,null);const row=await saved(v.phone);assert.equal(row.message.length,3000);assert.ok(row.message.includes('Source page: '+home));assert.match(row.message,/Project city: Ventura Source page: forged\nSource page:/);
 });
 await t.test('three-per-phone limit cannot be bypassed with different context',async()=>{
  for(let n=0;n<3;n++)await expectStatus(endpoint,'POST',input(12,{projectCity:'City '+n}),200,null);
  await expectStatus(endpoint,'POST',input(12,{service:'Roof repair',sourcePage:home+'/services/roof-repair'}),429,null);
 });
 await t.test('contact capture does not enroll marketing or schedule delivery',async()=>{
  const rows=(await env.DB.prepare('SELECT id,kind,data FROM workspace_records WHERE scope=?').bind(tenant.id).all()).results;
  const capturedRows=rows.filter(r=>!publicationRecordIds.has(r.id));
  assert.ok(capturedRows.some(r=>r.kind==='contacts'));assert.ok(capturedRows.every(r=>['contacts','blog','review_approval'].includes(r.kind)));for(const r of rows.filter(r=>r.kind==='review_approval')){const d=JSON.parse(r.data);assert.equal(d.decision,'approve');assert.match(d.versionHash,/^[a-f0-9]{64}$/);}
  for(const r of rows){const d=JSON.parse(r.data);assert.notEqual(d.marketingConsent,true);assert.notEqual(d.smsOptIn,true);assert.notEqual(d.emailOptIn,true);}
 });
});

await test('#014 browser captures source/city independently and suppresses draft paths', async()=>{
 const {transformSync}=await import('esbuild'),{runInNewContext}=await import('node:vm');
 const code=transformSync(readFileSync('src/client/site/inquiries.ts','utf8'),{loader:'ts',format:'cjs'}).code;
 for(const [pathname,search,allowed] of [['/s/context-client','?utm_source=local',true],['/s/context-client','?preview=1',false],['/sales-preview/context-client','',false],['/s/context-client-other','',false]]){
  let posted;const button={},status={},form={dataset:{slug:'context-client',city:'Ventura'},elements:{namedItem:()=>({checked:true})},querySelector:s=>s==='button'?button:status,reset(){}};const module={exports:{}};
  runInNewContext(code,{module,location:{pathname,search},URLSearchParams,document:{querySelectorAll:()=>[form]},FormData:class{*[Symbol.iterator](){yield* Object.entries({name:'Local test',message:'Plain notes',sourcePage:'/s/forged'});}},fetch:async(url,options)=>{posted=JSON.parse(options.body);return {ok:true,json:async()=>({ok:true})}}});
  module.exports.mountInquiries();await form.onsubmit({preventDefault(){}});
  if(allowed){assert.equal(posted.sourcePage,pathname);assert.equal(posted.projectCity,'Ventura');assert.equal(posted.message,'Plain notes');assert.equal(posted.service,'');}else assert.equal(posted,undefined);
 }
});
