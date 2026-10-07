import {e} from './core.js';
// Reuse the existing contact route and "Get my price" action, with no new claim.
export function qaPageAction(base,preview=false){const [path,query]=base.split('?'),suffix=query?'?'+query:preview?'?preview=1':'',href=path.startsWith('/s/')?path+'/contact'+suffix:base+'#contact';return '<p class="qa-page-action"><a class="qa-primary" data-primary href="'+e(href)+'">Get my price</a></p>';}
