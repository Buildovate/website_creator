import fs from 'node:fs';
import {createHash} from 'node:crypto';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const approvedSourceChangesPath = 'frame-initialization/approved-later-source-changes.json';

export function readApprovedSourceChanges(path) {
  const parsed = JSON.parse(fs.readFileSync(path, 'utf8'));
  if (!Array.isArray(parsed.entries)) throw Error('Approved later source changes must contain entries');
  return parsed.entries;
}

export function evaluateFrameSourceLocks({baselineFiles, sourceRoot, approvedEntries, recognitionReport}) {
  return Object.entries(baselineFiles).filter(([path]) => path !== 'src/aws/review-capture.js').map(([path, before]) => {
    const after = sha256(fs.readFileSync(sourceRoot + '/' + path));
    const lock = {path, before, after, approvedChangeStatus: 'none', pass: false};
    if (after === before) {
      lock.approvedChangeStatus = 'baseline exact';
      lock.pass = true;
      return lock;
    }
    if (path !== 'src/aws/qa-browser.js' || approvedEntries.length !== 1) return lock;
    const entry = approvedEntries[0];
    if (entry.path !== path || entry.from !== before || entry.to !== after || entry.proof !== 'checks/recognition-lock.json') return lock;
    if (recognitionReport?.passed !== true || recognitionReport.currentSha256 !== entry.to ||
        recognitionReport.removingOnlyRegisteredRecognitionEntriesRestoresRound4 !== '8e8d6666c77767a07fd1b1156403ea5b11cdf04c762084264063cbdb36732ee8' ||
        recognitionReport.genericChecksUnchanged !== true || recognitionReport.thresholdPx !== 2 || recognitionReport.samplingMs !== 60) return lock;
    lock.approvedChangeStatus = 'approved later recognition entries';
    lock.pass = true;
    return lock;
  });
}
