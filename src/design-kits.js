import kits from '../public/design-kits.json' with {type:'json'};
import mediaLibrary from '../public/trade-media-library.json' with {type:'json'};
for(const [id,kit] of Object.entries(kits))kit.mediaLibrary=mediaLibrary.trades[id];
export {kits};
export const effectKeys=['reveal','parallax','marquee','servicePicker','process','stickyNav','cutaway','serviceImages','commercial','ctaBands','projectMap','readingProgress','spotlight','chapterRail','planning','titleMotion','scrollStory'];
export function kitDefaults(id,values){const kit=kits[id];if(!kit)return values;return {...values,trade:kit.trade,designKit:id,color:values.color||kit.color,template:values.template||({immersive:'cinematic',editorial:'editorial',studio:'blueprint'}[kit.layout]),hero:kit.headline.replace(/\n/g,' '),intro:kit.intro||'Tell us what you have in mind. Explore the services below and start a conversation about your property.',creativeBrief:values.creativeBrief||kit.prompt,effects:Object.fromEntries(effectKeys.map(k=>[k,values.effects?.[k]!==false]))}}
