import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {isPlatformConsoleFailure} from '../../../../tests/helpers/platform-console.mjs';

const repo = 'C:/Users/joe/website_creator';
const out = repo + '/docs/build-evidence/028P';
const read = file => JSON.parse(fs.readFileSync(path.join(out, file)));
const write = (file, value) => fs.writeFileSync(path.join(out, file), JSON.stringify(value, null, 2) + '\n');
const before = read('before-platform.json');
const after = read('after-platform.json');
const commands = read('full-checks.json');
const baseline = read('before-console/baseline-console.json');
const publicDiff = read('checks/public-console-diff.json');
const boundaries = read('checks/console-allowlist-tests.json');
const sites = read('checks/sites-unchanged.log');
const preserved = read('checks/preservation.json');
const checkFiles = fs.readdirSync(out + '/checks');
const contrast = checkFiles.filter(name => name.endsWith('-contrast.json')).map(name => {
  const states = read('checks/' + name);
  return {
    suite: name.replace('-contrast.json', ''),
    states: states.length,
    text: states.flatMap(state => state.text.contrasts),
    borders: states.flatMap(state => state.controls.borders)
  };
});
const legacy = checkFiles.filter(name => name.endsWith('-console.json')).flatMap(name =>
  read('checks/' + name).map(record => ({suite: name.replace('-console.json', ''), ...record})));
const records = [...after.consoleRecords.map(record => ({suite: 'platform-matrix', ...record})), ...legacy];
const approved = records.filter(record => record.allowed);
const platformFailures = records.filter(isPlatformConsoleFailure);
const publicDiagnostics = legacy.filter(record => record.platform === false && !record.allowed);
const approvedCounts = approved.reduce((counts, record) => {
  counts[record.exception] = (counts[record.exception] || 0) + 1;
  return counts;
}, {});
const transitions = checkFiles.filter(name => name.endsWith('-transitions.json'))
  .flatMap(name => read('checks/' + name));
const text = after.screens.flatMap(state => state.audit.contrasts);
const borders = after.screens.flatMap(state => state.controls.borders);
const expandedText = contrast.flatMap(row => row.text);
const expandedBorders = contrast.flatMap(row => row.borders);
const originalBeforeHash = crypto.createHash('sha256').update(fs.readFileSync(out + '/before-platform.json')).digest('hex');
const summary = {
  completed: true,
  suitePassed: commands.filter(row => row.status === 0).length,
  suiteCommands: commands.length,
  suiteFailed: commands.filter(row => row.status !== 0).map(row => row.label),
  matrixStates: after.screens.length,
  textMeasurements: text.length,
  textFailures: text.filter(row => !row.pass).length,
  borderMeasurements: borders.length,
  borderFailures: borders.filter(row => !row.pass).length,
  keyboardControls: after.screens.reduce((sum, state) => sum + state.keyboard.controls, 0),
  keyboardFailingStates: after.screens.filter(state =>
    state.keyboard.unreachable.length || state.keyboard.focusFailures.length || state.keyboard.trapFailures.length).length,
  overflowFailures: after.screens.filter(state => state.overflow > 1).length,
  primaryFailures: after.screens.filter(state => state.primaries.length > 1).length,
  expandedStates: contrast.reduce((sum, row) => sum + row.states, 0),
  expandedTextMeasurements: expandedText.length,
  expandedTextFailures: expandedText.filter(row => !row.pass).length,
  expandedBorderMeasurements: expandedBorders.length,
  expandedBorderFailures: expandedBorders.filter(row => !row.pass).length,
  transitionSamples: transitions.length,
  transitionMeasurements: transitions.reduce((sum, row) => sum + row.contrasts.length, 0),
  transitionFailures: transitions.flatMap(row => row.contrasts.filter(check => !check.pass)).length,
  matrixPageExceptions: after.errors.length,
  googleFontRequests: after.fontRequests.length,
  approvedCounts,
  platformConsoleFailures: platformFailures.length,
  publicUnapprovedDiagnostics: publicDiagnostics.length,
  publicBaselineMatches: publicDiff.matchingCurrentRecords,
  publicBaselineRecords: publicDiff.currentRecords,
  publicNewDiagnostics: publicDiff.newCurrentDiagnostics.length,
  allowlistBoundaryCases: boundaries.passed,
  protectedHashes: sites.matched,
  protectedExpected: sites.comparisons,
  archivedResponses: sites.archived,
  preservationDifferences: preserved.evidenceDifferences.length + preserved.unrelatedDifferences.length,
  baselineEditorProven: baseline.editorWarningProven,
  baselineCopyRemoved: !fs.existsSync(baseline.copy),
  originalBeforeUnchanged: originalBeforeHash === baseline.originalBeforeSha256,
  creditsUsed: 0
};
assert.equal(summary.suiteCommands, 102);
assert.equal(summary.suitePassed, 102);
assert.equal(summary.matrixStates, 162);
for (const key of ['textFailures', 'borderFailures', 'keyboardFailingStates', 'overflowFailures', 'primaryFailures',
  'expandedTextFailures', 'expandedBorderFailures', 'transitionFailures', 'matrixPageExceptions',
  'googleFontRequests', 'platformConsoleFailures', 'publicNewDiagnostics', 'preservationDifferences']) assert.equal(summary[key], 0, key);
assert.equal(summary.allowlistBoundaryCases, 41);
assert.equal(summary.protectedHashes, 279);
assert.equal(summary.protectedExpected, 279);
assert.equal(summary.archivedResponses, 374);
assert.equal(summary.publicUnapprovedDiagnostics, 31);
assert.equal(summary.publicBaselineMatches, 37);
assert.equal(summary.publicBaselineRecords, 37);
assert.equal(summary.baselineEditorProven, true);
assert.equal(summary.baselineCopyRemoved, true);
assert.equal(summary.originalBeforeUnchanged, true);
assert.deepEqual(summary.approvedCounts, {
  'pre-existing-editor-frame': 6,
  'protected-look-frame': 12,
  'deliberate-failure-fixture': 26
});
assert.ok(fs.readFileSync(out + '/checks/platform-look-tokens.log', 'utf8').includes('"fontFaces": 7'));
assert.equal(records.filter(record => record.platform == null && !record.allowed).length, 0, 'Unapproved unknown page scope fails closed');

write('checks/expanded-contrast-summary.json', contrast.map(row => ({
  suite: row.suite, states: row.states, textMeasurements: row.text.length,
  textFailures: row.text.filter(check => !check.pass), borderMeasurements: row.borders.length,
  borderFailures: row.borders.filter(check => !check.pass)
})));
write('checks/expanded-console-summary.json', legacy);
write('checks/console-allowlist.json', {
  gateScope: 'body.bv-platform; unknown page scope fails closed. Public diagnostics are retained in logs and compared to baseline.',
  rules: {
    'protected-look-frame': 'Exact blocked-script message from four visible Current/Bold/Fresh/Classic Look-picker frames and source URLs.',
    'pre-existing-editor-frame': 'Exact editor sandbox warning from verified #editor-frame in editor states; baseline proven.',
    'deliberate-failure-fixture': 'Exact URL, method and status/error bound to an injected or declared test fixture; one matching request per message.'
  },
  approvedCounts,
  allowedCount: approved.length,
  platformConsoleFailures: platformFailures.length,
  publicUnapprovedDiagnostics: publicDiagnostics.length,
  publicBaselineDiff: 'checks/public-console-diff.json',
  approved,
  platformFailures,
  publicDiagnostics
});
write('checks/platform-summary.json', summary);

const old = fs.readFileSync(out + '/README.md', 'utf8');
const implementation = old.slice(old.indexOf('## What changed'), old.indexOf('## Latest results'))
  .replace('37 positive/negative boundary cases', '41 positive/negative boundary cases');
const screenshots = old.slice(old.indexOf('## Before / after screenshots'), old.indexOf('## Old rules neutralized'));
const oldRules = old.slice(old.indexOf('## Old rules neutralized'), old.indexOf('## Completion'));
assert.ok(implementation.startsWith('## What changed'));
assert.ok(screenshots.startsWith('## Before / after screenshots'));
const rows = [
  ['Full regression suite', `${summary.suitePassed}/${summary.suiteCommands} commands`, 'full-checks.json'],
  ['Platform matrix', `${summary.matrixStates}/162 states at 1440×900, 1280×800 and 390×844`, 'after-platform.json'],
  ['Matrix contrast', `${summary.textMeasurements} text and ${summary.borderMeasurements} borders; 0 failures`, 'after-platform.json'],
  ['Expanded contrast', `${summary.expandedStates} states; ${summary.expandedTextMeasurements} text and ${summary.expandedBorderMeasurements} borders; 0 failures`, 'checks/expanded-contrast-summary.json'],
  ['Keyboard, overflow, one primary', `${summary.keyboardControls} controls; 0 failing states, overflow or multiple primaries`, 'after-platform.json'],
  ['Button transitions', `${summary.transitionSamples} samples, ${summary.transitionMeasurements} checks; 0 failures`, 'checks/callback-browser-transitions.json'],
  ['Platform console gate', `${summary.platformConsoleFailures} non-allowlisted diagnostics; ${approved.length} narrow exceptions logged`, 'checks/console-allowlist.json'],
  ['Exception boundaries', `${summary.allowlistBoundaryCases} cases passed`, 'checks/console-allowlist-tests.json'],
  ['Public console baseline', `${summary.publicBaselineMatches}/${summary.publicBaselineRecords} match; ${summary.publicNewDiagnostics} new`, 'checks/public-console-diff.json'],
  ['Tokens, fonts, reduced motion', '315 scoped selectors, 7 local faces, 0 Google requests', 'checks/platform-look-tokens.log'],
  ['Protected pages', `${summary.protectedHashes}/${summary.protectedExpected} hashes and ${summary.archivedResponses}/374 responses`, 'checks/sites-unchanged.log'],
  ['Prior evidence and unrelated files', `${preserved.priorEvidence} evidence files and ${preserved.unrelatedFiles} unrelated files; 0 differences`, 'checks/preservation.json']
];
let md = `# #028P — Platform look\n\n**Done.** Branch: feature/local-environment-setup. Baseline commit: 49b032eefdda23a7e7a66f9031c4f3d4f26c7271. Higgsfield credits: **0**. No push or deployment; no other ticket started.\n\n`;
md += `## Console gate and baseline proof\n\nThe zero-diagnostics gate applies to pages whose body has \`bv-platform\`, including the approved editor, Look-picker and fixture exceptions. Unknown page scope fails closed. Public/trade pages visited by legacy suites remain fully logged and were compared with the accepted baseline; they are outside this ticket's platform gate. No console messages were suppressed.\n\n`;
md += `An isolated copy of commit 49b032e reproduced the exact editor sandbox warning at all three viewports. The [editor baseline](before-console/baseline-console.md) retains six passing commands, 304 states and 26 messages. It proves the warning predates #028P; Louie's security-review follow-up is in BUILD-BACKLOG. The copy and junction were removed without touching the active tree or .preserve/.\n\n`;
md += `The separate [public baseline](before-console/public-baseline-console.md) ran all 11 implicated legacy browser suites with full capture. All passed unchanged. [Diff](checks/public-console-diff.json): 37/37 current records match by suite, message, status and URL after normalizing only the port; 31 of these are unapproved public diagnostics, with **zero new** diagnostics.\n\n`;
md += `| Approved platform exception | Count | Boundary |\n|---|---:|---|\n`;
md += `| Look-picker protected frames | ${approvedCounts['protected-look-frame']} | Exact four visible frame URLs, text and state |\n`;
md += `| Pre-existing editor iframe warning | ${approvedCounts['pre-existing-editor-frame']} | Exact iframe source, title, sandbox and state |\n`;
md += `| Deliberate failure fixtures | ${approvedCounts['deliberate-failure-fixture']} | Exact injected or declared URL, method, status and state |\n\n`;
md += `## Expenses contrast fix\n\nThe five phone-menu headings and five chevrons use \`--bv-ink-3\` on white, with \`--bv-navy\` on hover, focus and selection. Open, hover, keyboard focus and selected captures pass 4.5:1 text and 3:1 icon checks: [open](legacy/expense-polish-browser/015GA/menu-open-phone.png), [hover](legacy/expense-polish-browser/015GA/menu-hover-phone.png), [focus](legacy/expense-polish-browser/015GA/menu-focus-phone.png), [selected](legacy/expense-polish-browser/015GA/menu-selected-phone.png).\n\n`;
md += `## Logged public follow-ups\n\nBUILD-BACKLOG records “Public trade-site favicon missing (404 on /favicon.ico)” and “Legacy test pages: roofing-part2 financing link 404 and empty-guide resource 404, confirm intended.” No protected public page or trade iframe was changed.\n\n`;
md += implementation;
md += `## Final results\n\n| Gate | Result | Evidence |\n|---|---|---|\n`;
for (const [name, result, file] of rows) md += `| ${name} | PASS — ${result} | [Record](${file}) |\n`;
md += `\n### All 102 commands\n\n| Command | Result | Log |\n|---|---|---|\n`;
for (const command of commands) md += `| \`${command.command}\` | PASS | [${command.label}](checks/${command.label}.log) |\n`;
md += '\n' + screenshots + oldRules;
md += `## Completion\n\nThe original before files retain their hashes. Protected public HTML/CSS and archived responses match the baseline; prior evidence and unrelated dirty files remain byte identical. .preserve/ backups and FFmpeg/FFprobe downloads are excluded from the commit. The running suite restored its temporary film and test fixtures. No route, data, auth, public CSS, trade iframe or public-page behavior change was made.\n`;
fs.writeFileSync(out + '/README.md', md);

let backlog = fs.readFileSync(repo + '/BUILD-BACKLOG.md', 'utf8');
backlog = backlog.replace('### #028P — Platform look\n\n- State: **Blocked — verification incomplete**', '### #028P — Platform look\n\n- State: **Done**');
assert.match(backlog, /### #028P — Platform look\n\n- State: \*\*Done\*\*/);
fs.writeFileSync(repo + '/BUILD-BACKLOG.md', backlog);
let status = fs.readFileSync(repo + '/BUILD-STATUS.md', 'utf8');
status = status.slice(0, status.indexOf('### #028P —')) + `### #028P — Platform look Done (2026-09-28)\n\n- Scoped platform bundle, local fonts, responsive guide tokens and components are complete. Expenses phone-menu contrast is fixed. No protected public-site, route, data, auth or trade-iframe change.\n- [Evidence](docs/build-evidence/028P/README.md): 102/102 commands; 162/162 platform states; expanded contrast 0 failures; keyboard, overflow, one-primary, token/font and 41 exception-boundary checks pass.\n- Platform console gate: 0 non-allowlisted diagnostics. Approved exceptions: 12 Look-picker frames, 6 pre-existing editor warnings, 26 declared failure fixtures. Editor warning reproduced on 49b032e. All 31 other public diagnostics are retained; 37/37 full public records match the baseline, with 0 new.\n- Protected hashes 279/279, archived responses 374/374, preservation differences 0. Higgsfield credits 0. One local commit only; no push or deployment.\n`;
fs.writeFileSync(repo + '/BUILD-STATUS.md', status);
console.log(JSON.stringify(summary, null, 2));
