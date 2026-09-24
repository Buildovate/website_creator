import {mountPortfolio} from './portfolio.js';
import {mountInquiries} from './inquiries.js';
document.querySelectorAll<HTMLInputElement>('.comparison input').forEach(input=>input.oninput=()=>input.parentElement?.style.setProperty('--split',input.value+'%'));
mountPortfolio();
mountInquiries();
const hero=document.querySelector('.showcase .kit-hero');
if(hero && 'IntersectionObserver' in window) new IntersectionObserver(entries=>document.body.classList.toggle('hero-in-view',entries[0].isIntersecting)).observe(hero);
