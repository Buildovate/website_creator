import {safeHttps} from './constitution.ts';
export interface ServiceProfile { years: string; warranty: string; rating: string; ratingSource: string; confirmed: boolean }
export function cleanServiceProfile(value: any = {}): ServiceProfile {
 const trim=(v:unknown,max:number)=>typeof v==='string'?v.trim().slice(0,max):'';
 const years=trim(value.years,3),rating=trim(value.rating,4);
 if(years && (!/^\d+$/.test(years)||Number(years)>200))throw Error('Years in business must be from 0 to 200.');
 if(rating && (!/^\d(?:\.\d{1,2})?$/.test(rating)||Number(rating)<1||Number(rating)>5))throw Error('Rating must be from 1 to 5.');
 const ratingSource=safeHttps(value.ratingSource);
 if(rating&&!ratingSource)throw Error('Add a source link for the displayed rating.');
 return {years,warranty:trim(value.warranty,180),rating,ratingSource,confirmed:value.confirmed===true};
}
