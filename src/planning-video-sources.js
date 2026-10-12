import {e} from './core.js';
// Optional encodes belong to the same reviewed planning slot, not a second player.
export function planningVideoSources(film){return ['clipMobile','clipWebm','clipMobileWebm'].map(key=>film[key]?' data-'+({clipMobile:'src-mobile',clipWebm:'src-webm',clipMobileWebm:'src-mobile-webm'}[key])+'="'+e(film[key])+'"':'').join('');}
