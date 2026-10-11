import assert from 'node:assert/strict';
// All active opt-in sections declare their actual composition, independent of copy and colors.
export function assertDistinctPatterns(html){
 const patterns=[...html.matchAll(/data-section-pattern="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(new Set(patterns).size,patterns.length,'Duplicate structural pattern on one page: '+patterns.join(', '));
}
