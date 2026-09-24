import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {normalizeWebsitePages, websitePagePhotoIds, PAGE_LIMITS} from '../src/platform/website-pages.ts';
import {worker, env, admin} from './preview-fixture.mjs';

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
  assert.deepEqual(foreign.settings.websitePages, normalizeWebsitePages(records()), 'Creation persists page contracts without copying another tenant’s media');
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
    assert.equal(savedPages.pages.length, 4);
    assert.equal(JSON.stringify(tenant.published), initialPublished);
    const stored = await env.DB.prepare('SELECT settings,published FROM tenants WHERE id=?').bind(tenant.id).first();
    assert.deepEqual(JSON.parse(stored.settings).websitePages, savedPages);
    assert.equal(stored.published, initialPublished);
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
    // This data-only ticket does not make unpublished page routes or their media public.
    assert.equal((await request('/media/' + photo.id, 'GET', undefined, null)).status, 401);
    assert.equal((await request('/s/' + tenant.slug + '/services/roof-repair', 'GET', undefined, null)).status, 404);
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
    assert.equal(tenant.settings.websitePages.pages.length, 0);
    assert.deepEqual(tenant.published.websitePages, savedPages);
    await api(path + '/publish', 'POST', {version: tenant.version, approved: true}, owner);
    await reload(); assert.equal(tenant.published.websitePages.pages.length, 0);
    await api(path + '/backups/' + backup.id + '/restore', 'POST', {version: tenant.version, confirm: true}, owner);
    await reload(); assert.deepEqual(tenant.settings.websitePages, beforeClear);
    assert.equal(tenant.published, null, 'Restore remains a draft-only action');
    const duplicate = await api(path + '/duplicate', 'POST', {slug: 'page-contract-copy', name: 'Local test copy'});
    assert.equal((await api('/tenants/' + duplicate.id)).tenant.settings.websitePages, undefined, 'Layout duplication must not copy page facts or media');
  });
});
