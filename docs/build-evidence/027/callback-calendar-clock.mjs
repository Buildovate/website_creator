// Existing callback-browser.mjs assumes today + four days is in this calendar month.
// Run its unchanged source with a shared mid-month Node/browser clock; no app code changes.
import {createRequire} from 'node:module';
// Next month's midpoint keeps local test cookies unexpired in Chromium's native clock.
const today=new Date(),fixed=Date.UTC(today.getUTCFullYear(),today.getUTCMonth()+1,15,18),RealDate=Date;
globalThis.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[fixed]))}static now(){return fixed}};
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const launch=chromium.launch.bind(chromium);chromium.launch=async(...args)=>{const browser=await launch(...args),newContext=browser.newContext.bind(browser);browser.newContext=async(...args)=>{const context=await newContext(...args);await context.addInitScript(fixed=>{const RealDate=Date;globalThis.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[fixed]))}static now(){return fixed}}},fixed);return context};return browser};
await import('file:///C:/Users/joe/website_creator/tests/callback-browser.mjs');
