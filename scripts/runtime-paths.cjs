const path=require('node:path');
exports.releaseRepoRoot=path.resolve(__dirname,'..').replaceAll('\\','/');
exports.releaseFfmpegDir=process.env.FFMPEG_BIN_DIR?process.env.FFMPEG_BIN_DIR.replaceAll('\\','/').replace(/\/?$/,'/'):'';
