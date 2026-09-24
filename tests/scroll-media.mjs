// Release check: ffprobe decodes/counts every video frame, not just its header.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const films={...Object.fromEntries(Object.entries(JSON.parse(readFileSync('public/trade-build-films.json'))).map(([id,film])=>['hero-'+id,film])),...Object.fromEntries(Object.entries(JSON.parse(readFileSync('public/trade-craft-films.json'))).map(([id,film])=>['craft-'+id,film]))};
for(const [trade,film] of Object.entries(films)){
 const path='public'+new URL(film.scrubUrl||film.url,'https://test.local').pathname;
 const probe=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=duration,nb_frames,nb_read_frames','-of','json',path],{encoding:'utf8'});
 assert.equal(probe.status,0,`${trade}: ${probe.error||probe.stderr}`);
 assert.equal(probe.stderr.trim(),'',`${trade}: decoding errors`);
 const stream=JSON.parse(probe.stdout).streams[0];
 assert.ok(Number(stream.duration)>0,trade+' has a finite duration');
 assert.ok(Number(stream.nb_frames)>0,trade+' has frames');
 assert.equal(stream.nb_read_frames,stream.nb_frames,trade+' decodes through the final frame');
 const bytes=readFileSync(path);let moov=-1,mdat=-1;
 for(let offset=0;offset+8<=bytes.length;){
  const size=bytes.readUInt32BE(offset),type=bytes.toString('ascii',offset+4,offset+8);
  if(type==='moov')moov=offset;if(type==='mdat')mdat=offset;
  if(size<8)break;offset+=size;
 }
 assert.ok(moov>=0&&mdat>moov,trade+' has fast-start metadata before its media');
}
console.log(`PASS: all ${Object.keys(films).length} scroll films decode every frame and have fast-start metadata.`);
