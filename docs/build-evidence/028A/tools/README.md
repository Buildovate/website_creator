# #028A QA tools

These helpers run inside C:/Users/joe/website_creator and write evidence only for this ticket, with existing evidence backed up and restored. The repository tests themselves write their original evidence locations temporarily; 028A-preserve-rerun.mjs restores prior bytes.

The suite's media checks use FFmpeg and ffprobe 9.0.2 (Gyan essentials Windows build), downloaded from https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip directly into tools/bin. Dependencies are excluded from the local commit. No OneDrive client or other unrelated application was changed.

The approved color corrections are in public/design-studio.css and public/flow.css. 028A-current-colors-capture.mjs records before/after colors and layout. 028A-aa-final.mjs runs all four styles. 028A-suite.mjs runs the full 102-command regression set; its temporary legacy Promotions fixture waits for the style audit to finish. 028A-response-lock.mjs checks all 374 archived responses. Final review gates are in 028A-final-verify.mjs and 028A-commit.mjs.
