import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
// QA only: the exact URL template in src/client/site/portfolio.js.
// The schematic PNG has no geographic meaning and never reaches a provider.
export const MAP_TILE_PATTERN=/^https:\/\/tile\.openstreetmap\.org\/(?:0|[1-9]\d*)\/(?:0|[1-9]\d*)\/(?:0|[1-9]\d*)\.png$/;
export const mapTile=readFileSync(new URL('./fixtures/neutral-map-tile.png',import.meta.url));
export const mapTileSha256=createHash('sha256').update(mapTile).digest('hex');
export function isLocalMapTile(request){return request.method()==='GET'&&MAP_TILE_PATTERN.test(request.url());}
