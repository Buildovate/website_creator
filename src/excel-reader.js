import readWorkbook from 'read-excel-file/browser';
const cache=new WeakMap();
async function workbook(file){if(!cache.has(file))cache.set(file,readWorkbook(file));return cache.get(file)}
export async function readSheetNames(file){return (await workbook(file)).map(s=>s.sheet)}
export default async function readSheet(file,{sheet}={}){const sheets=await workbook(file);const selected=sheet?sheets.find(s=>s.sheet===sheet):sheets[0];if(!selected)throw Error('Worksheet not found.');return selected.data}
