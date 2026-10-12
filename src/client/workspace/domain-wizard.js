import {esc} from '../shared/html.js';
import {PROVIDERS} from '../../domain/guide.js';
import {renderDomainInstructions,renderDomainProgress} from '../../domain/view.js';
let disposePrevious=()=>{};
export async function mountDomainWizard(root,{tenant,api}){
 disposePrevious();const base='/tenants/'+tenant.id+'/domain-plan';let data,disposed=false,busy=false;
 const abort=new AbortController();let timer;
 const observer=new MutationObserver(()=>{if(!root.isConnected)dispose();});
 function dispose(){disposed=true;clearInterval(timer);abort.abort();observer.disconnect();}
 disposePrevious=dispose;observer.observe(document.body,{subtree:true,childList:true});
 root.innerHTML='<p class="bv-loading" role="status">Loading your domain setup…</p>';
 const message=(text,error=false)=>{const el=root.querySelector('[data-domain-message]');if(el){el.textContent=text;el.className=error?'bv-callout bv-callout-error':'bv-callout';el.setAttribute('role',error?'alert':'status');}};
 function render(){if(disposed)return;const p=data.plan;
 root.innerHTML='<section class="bv-domain"><p class="bv-eyebrow">YOUR WEBSITE · YOUR ADDRESS</p><h2>Connect a domain you own</h2><p class="bv-domain-lead">Your current site stays up until you approve the switch.</p><ol class="bv-domain-rail"><li>Choose domain</li><li>Add records</li><li>Check connection</li></ol><div data-domain-message role="status"></div><section class="bv-card"><p class="bv-eyebrow">1 · CHOOSE YOUR DOMAIN</p><form data-domain-form><label>Domain you already own<input name="hostname" autocomplete="url" placeholder="example.com" required value="'+esc(p?.hostname||'')+'"></label><label>Where is your domain?<select name="provider">'+PROVIDERS.map(x=>'<option '+(x===(p?.provider||'Detect automatically')?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label>'+(p?'<p>'+esc(p.detection)+(p.nameservers?.length?' · '+esc(p.nameservers.join(', ')):'')+'</p>':'<p>We check the nameservers when detection is connected. You can always choose the provider yourself.</p>')+'<button class="'+(p?'bv-button':'bv-button-primary')+'">'+(p?'Update domain instructions':'Get my instructions')+'</button></form></section>'+renderDomainInstructions(data)+ (p?'<section class="bv-card"><label class="check"><input type="checkbox" data-domain-approve '+(p.switchApprovedAt?'checked':'')+'>I approve switching website DNS when I apply these records.</label><button type="button" class="'+(!p.addedAt?'bv-button-primary':'bv-button')+'" data-domain-added>I’ve added them</button><p>Apply these records only when you are ready to switch. Your old-site archive is a separate follow-up.</p></section>'+renderDomainProgress(data)+'<button type="button" class="'+(p.addedAt?'bv-button-primary':'bv-button')+'" data-domain-check>Check again</button>'+(p.disconnectedAt?'':'<button type="button" class="bv-button" data-domain-disconnect>Disconnect domain</button>')+'<p><a href="/domain-guide/'+esc(tenant.id)+'">Open printable instructions</a></p>':'')+'<p><a class="bv-link" target="_blank" rel="noopener" href="/s/'+esc(tenant.slug)+(tenant.published?'':'?preview=1')+'">'+(tenant.published?'Open your working Buildovate site':'Open your Buildovate preview')+'</a></p></section>';
 }
 async function action(op,value,success){if(busy||disposed)return;busy=true;message('Checking…');root.setAttribute('aria-busy','true');try{data=await api(base+op,'POST',{...value,version:data.version});render();message(success);}catch(error){message(error.message,true);}finally{busy=false;root.removeAttribute('aria-busy');}}
 root.addEventListener('submit',event=>{if(!event.target.matches('[data-domain-form]'))return;event.preventDefault();action('',Object.fromEntries(new FormData(event.target)),'Instructions saved. Add the records only when you approve the switch.');},{signal:abort.signal});
 root.addEventListener('click',async event=>{
 const el=event.target.closest('button');if(!el)return;
 if(el.hasAttribute('data-domain-copy')){try{await navigator.clipboard.writeText(el.dataset.domainCopy);message('Copied. Paste this value at your DNS provider.');}catch{message('Copy unavailable. Select the record value and copy it manually.',true);}return;}
 if(el.hasAttribute('data-domain-added'))return action('/added',{approved:root.querySelector('[data-domain-approve]').checked},'Records marked added. Connection status is shown below.');
 if(el.hasAttribute('data-domain-check'))return action('/check',{},'Check finished. Review each connection status.');
 if(el.hasAttribute('data-domain-disconnect'))return action('/disconnect',{},'Domain disconnected. Hosting cleanup will retry automatically if needed.');
 },{signal:abort.signal});
 try{data=await api(base);render();}catch(error){root.innerHTML='<section class="bv-card"><h2>Domain setup unavailable</h2><p role="alert">'+esc(error.message)+'</p><button type="button" data-domain-reload>Try again</button></section>';root.querySelector('button').onclick=()=>mountDomainWizard(root,{tenant,api});}
 timer=setInterval(()=>{if(root.isConnected&&data?.plan?.addedAt&&!data.plan.disconnectedAt&&!document.hidden)action('/check',{},'Automatic check finished.');},data?.recheckMs||180000);
}
