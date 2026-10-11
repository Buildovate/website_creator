// Presentation only: stored values and calculation precision are unchanged.
export function displayPhone(value){const raw=String(value||''),digits=raw.replace(/\D/g,'');const local=digits.length===11&&digits[0]==='1'?digits.slice(1):digits;return local.length===10?'('+local.slice(0,3)+') '+local.slice(3,6)+'-'+local.slice(6):raw;}
export const displayMoney=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:Number.isInteger(Number(value))?0:2,maximumFractionDigits:2}).format(Number(value));
