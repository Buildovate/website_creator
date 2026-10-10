// OWNER-DOWNLOAD: only these unused Leaflet CSS sprites may be absent.
const unusedLeafletImages = new Set(['layers.png','layers-2x.png','marker-icon.png'].map(name => '/assets/images/' + name));
export const mayOmitLeafletImage = (url,referrer) => referrer === '/assets/leaflet.css' && unusedLeafletImages.has(url);
