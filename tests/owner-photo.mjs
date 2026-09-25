import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {ROBLES,settings} from '../src/core.js';
import {ownerSection} from '../src/design-personality.js';
import {readiness} from '../src/builder.js';
import {worker,env,admin} from './preview-fixture.mjs';

test('Roofing owner sample is marked in site data and media readiness',()=>{
 const site=settings(ROBLES);
 assert.equal(site.ownerPhoto.isSample,true);
 assert.match(site.ownerPhoto.src,/owner-sample-960\.webp$/);
 const html=ownerSection(site,[]);
 assert.match(html,/data-sample-media="owner-photo"/);
 assert.match(html,/YOUR PHOTO HERE/);
 assert.match(html,/Upload your photo/);
 assert.match(html,/alt="Owner of Robles Roofing"/);
 assert.match(html,/loading="lazy"/);
 assert.match(html,/srcset="[^"]+480w,[^"]+960w"/);
 assert.equal(readiness(site,[],[]).find(x=>x.label==='Real owner photo')?.ready,false);
});

test('a saved upload replaces the sample and removes its overlay',()=>{
 const site=settings({...ROBLES,ownerPhotoId:'owner-upload-1'});
 assert.deepEqual(site.ownerPhoto,{photoId:'owner-upload-1',isSample:false});
 const html=ownerSection(site,[{id:'owner-upload-1'}]);
 assert.match(html,/src="\/media\/owner-upload-1"/);
 assert.doesNotMatch(html,/YOUR PHOTO HERE|Upload your photo|data-sample-media/);
 assert.equal(readiness(site,[{id:'owner-upload-1'}],[]).find(x=>x.label==='Real owner photo')?.ready,true);
});

test('the existing brand-image upload and owner selection remove the sample from a draft preview',async()=>{
 const origin='https://test.local';
 const headers={'origin':origin,'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email};
 const call=async(path,method='GET',body,contentType='application/json')=>{
  const response=await worker.fetch(new Request(origin+path,{method,headers:{...headers,'content-type':contentType},body:body instanceof Uint8Array?body:body?JSON.stringify(body):undefined}),env);
  assert.equal(response.status,200,await response.clone().text());
  return response;
 };
 const tenant=(await (await call('/api/tenants')).json()).tenants.find(item=>item.slug==='robles-roofing');
 assert.ok(tenant);
 const jpeg=new Uint8Array(readFileSync('./public/assets/roofing.jpg'));
 const photo=await (await call(`/api/tenants/${tenant.id}/photos?stage=brand&caption=Owner%20upload%20test`,'POST',jpeg,'image/jpeg')).json();
 const saved=await (await call(`/api/tenants/${tenant.id}`,'PUT',{settings:{...tenant.settings,ownerPhotoId:photo.id},version:tenant.version})).json();
 assert.deepEqual(saved.tenant.settings.ownerPhoto,{photoId:photo.id,isSample:false});
 const page=await (await call('/s/robles-roofing?preview=1')).text();
 assert.match(page,new RegExp(`/media/${photo.id}`));
 assert.doesNotMatch(page,/YOUR PHOTO HERE|data-sample-media="owner-photo"/);
});
