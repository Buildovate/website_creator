import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const releaseRepoRoot=path.resolve(fileURLToPath(new URL('../',import.meta.url))).replaceAll('\\','/');
export const releaseFfmpegDir=process.env.FFMPEG_BIN_DIR?process.env.FFMPEG_BIN_DIR.replaceAll('\\','/').replace(/\/?$/,'/'):'';
