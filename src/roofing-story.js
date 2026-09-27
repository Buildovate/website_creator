import {e} from './core.js';
import media from '../public/service-media.json' with {type:'json'};

// Educational scope guidance, never a diagnosis or a claimed contractor project.
export function roofingStory(s,{preview=false}={}){
 if(s.trade!=='Roofing'||s.journey!=='roof-repair'||s.effects?.planning===false)return '';
 const offered=(s.services||[]).find(x=>/^(roof repair|roof replacement|inspections)$/i.test(x.name));
 if(!offered)return '';
 const photo=media.Roofing['roof repair']?.scope;if(!photo)return '';
 return '<section class="rs-chapter" id="roof-planning-story" aria-labelledby="rs-title" data-roof-planning-story data-trade="Roofing">'+
 '<div class="rs-heading"><div><p class="rs-kicker">BEFORE YOU CHOOSE THE WORK</p><h2 id="rs-title">A small leak.<br>A bigger question.</h2></div><p class="rs-intro">Does this spot need a repair, or does the roof need a wider look? Start with what is happening around the leak—not a guess about replacing everything.</p></div>'+
 '<div class="rs-scene"><figure class="rs-photo"><div class="rs-image-frame"><img src="'+e(photo)+'" width="1536" height="1030" loading="lazy" decoding="async" alt="Illustrative roofing inspection at a vent: shingles lifted beside metal flashing"><span class="rs-image-fallback" hidden>Roof detail image unavailable. The planning guide is still here.</span><img class="rs-water-path" src="/assets/stories/roofing.svg" width="600" height="420" alt="" aria-hidden="true"><span class="rs-photo-note">LOOK BEYOND THE SHINGLE</span></div><figcaption>'+(preview?'<span class="rs-sample" data-sample="true">Sample</span> ':'')+'Illustrative roof detail · not a completed customer project</figcaption></figure>'+
 '<ol class="rs-notes"><li><span class="rs-number" aria-hidden="true">01</span><div><h3>Trace the entry point.</h3><p>A ceiling stain may sit away from where water enters. Ask about the flashing, joints and roof covering around the suspected source.</p></div></li><li><span class="rs-number" aria-hidden="true">02</span><div><h3>Check what surrounds it.</h3><p>An isolated detail and widespread wear call for different conversations. Ask which nearby materials can stay and what needs closer inspection.</p></div></li><li><span class="rs-number" aria-hidden="true">03</span><div><h3>Put the boundaries in writing.</h3><p>Before agreeing to work, compare the proposed repair area, included materials and how any concealed damage will be handled.</p></div></li></ol></div>'+
 '<div class="rs-next"><p><strong>Bring the question, not a diagnosis.</strong><span>Describe the stain or drip from inside your home. There is no need to climb onto the roof to start a conversation.</span></p><a href="#contact" data-service-link="'+e(offered.name)+'">Talk through my roof concern <span aria-hidden="true">→</span></a></div></section>';
}
