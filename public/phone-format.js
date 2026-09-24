(()=>{'use strict';
 const selector='input[type="tel"],input[autocomplete="tel"],input[name="phone"],input[name="mobile"],input[name="cellPhone"],input[name="senderPhone"],input[name="contractorPhone"],input[name="escalationPhone"]';
 function format(value){let d=String(value||'').replace(/\D/g,'');if(d.length===11&&d[0]==='1')d=d.slice(1);if(d.length>10)return value;if(!d)return '';return d.length<4?'('+d:d.length<7?'('+d.slice(0,3)+') '+d.slice(3):'('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6)}
 function decorate(el){if(el.dataset.phoneFormat)return;el.dataset.phoneFormat='us';el.type='tel';el.inputMode='tel';el.placeholder='(805) 555-0123';if(el.maxLength>0&&el.maxLength<14)el.removeAttribute('maxlength');el.value=format(el.value)}
 function scan(root){if(root.matches?.(selector))decorate(root);root.querySelectorAll?.(selector).forEach(decorate)}
 document.addEventListener('input',event=>{const el=event.target;if(!el.matches(selector)||event.isComposing)return;decorate(el);if(event.inputType?.startsWith('delete'))return;const before=el.value,pos=el.selectionStart??before.length,digits=before.slice(0,pos).replace(/\D/g,'').length,after=format(before);if(after===before)return;el.value=after;let p=0,n=0;while(p<after.length&&n<digits){if(/\d/.test(after[p]))n++;p++}if(pos===before.length)p=after.length;el.setSelectionRange(p,p)});
 document.addEventListener('blur',e=>{if(e.target.matches?.(selector))e.target.value=format(e.target.value)},true);
 scan(document);new MutationObserver(list=>list.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)}))).observe(document.documentElement,{childList:true,subtree:true});
 window.BuildovatePhone={format};
})();
