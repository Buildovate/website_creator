// Descriptions use catalog facts only. They never imply a contractor created the work.
export function libraryDescription(asset,catalog){
 if(!asset)return 'Trade design detail';
 const record=asset.source||{},trade=asset.originalTrade||record.trade||Object.values(catalog.trades).find(t=>JSON.stringify(t).includes('"'+asset.id+'"'))?.trade||'Trade';
 const service=String(record.subject||asset.subject||record.service||trade).trim();
 const section=String(record.setting||asset.setting||record.section||'').trim().toLowerCase();
 const detail=/process|craft/.test(section+' '+record.record)?' detail':/scope/.test(section)?' materials and setting':/build/.test(record.record||'')?' construction detail':' design setting';
 const title=service.charAt(0).toUpperCase()+service.slice(1);
 return (title+detail).replace(/\s+/g,' ').slice(0,160);
}