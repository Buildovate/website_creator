const shapes={
 facebook:'<path d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.4C17.5 1.2 16.3 1 15 1c-3.2 0-5 2-5 5.5V9H7v4h3v9Z"/>',
 instagram:'<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.25"/>',
 youtube:'<path d="M22 7s-.2-2-2-2.5C17.8 4 12 4 12 4S6.2 4 4 4.5C2.2 5 2 7 2 7s-.5 2.4-.5 5 .5 5 .5 5 .2 2 2 2.5C6.2 20 12 20 12 20s5.8 0 8-.5c1.8-.5 2-2.5 2-2.5s.5-2.4.5-5S22 7 22 7Z"/><path d="m10 8 6 4-6 4Z" fill="var(--social-cutout,#18243b)"/>',
 linkedin:'<path d="M3 8h4v14H3zm6 0h4v2c.8-1.4 2-2.3 4-2.3 4 0 4.5 2.6 4.5 6.1V22h-4v-7.3c0-1.8 0-3.7-2.4-3.7-2.3 0-2.6 1.8-2.6 3.6V22H9Z"/><circle cx="5" cy="3.5" r="2.5"/>',
 tiktok:'<path d="M14 2h4c.3 2.8 1.8 4.5 4 4.8v4c-1.7 0-3.1-.5-4-1.2V16a7 7 0 1 1-8-6.9v4a3 3 0 1 0 4 2.9Z"/>',
 nextdoor:'<path d="M3 4h4v8c1-2 2.5-3 5-3 4 0 6 3 6 7v6h-4v-6c0-2-1-3-3-3s-4 2-4 5v4H3Z"/><path d="m11 6 5-4 5 4-2.3 2-2.7-2-2.7 2Z"/>'
};
export function socialIcon(key){return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${shapes[key]||''}</svg>`;}
