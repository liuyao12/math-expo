// Global essays are not tied to the passage observer. Hiding a pane preserves
// its DOM, document viewer, and independent scroll position.
const work=document.querySelector('.companion-work');
if(work){
 const essay=document.querySelector('#authored-commentary');
 const guide=document.querySelector('#weil-guide');
 const original=document.querySelector('#weil-original');
 const expand=essay.querySelector('.essay-expand');
 const loadDocument=id=>{const frame=document.getElementById(id);if(frame&&!frame.hasAttribute('src'))frame.src=frame.dataset.documentSrc;const button=work.querySelector(`[data-load-document="${id}"]`);if(button)button.hidden=true;};
 essay.querySelector('.essay-close').addEventListener('click',()=>{setSide('notes',true);work.querySelector('button[data-side-mode="notes"]').focus();});
 const setSide=(mode,sync=false)=>{
  if(!['notes','essay'].includes(mode))return;
  work.dataset.sideMode=mode;essay.hidden=mode!=='essay';
  for(const button of work.querySelectorAll('button[data-side-mode]'))button.setAttribute('aria-pressed',String(button.dataset.sideMode===mode));
  if(mode==='notes'){work.classList.remove('essay-expanded');expand.setAttribute('aria-pressed','false');expand.textContent='Expand essay';}
  if(sync){const url=new URL(location.href);if(mode==='essay')url.searchParams.set('commentary','goresky-2018');else url.searchParams.delete('commentary');history.replaceState(null,'',url);}
 };
 const setReading=(mode,sync=false)=>{
  if(!['guide','original'].includes(mode))return;
  work.dataset.readingMode=mode;guide.hidden=mode!=='guide';original.hidden=mode!=='original';
  for(const button of work.querySelectorAll('button[data-reading-mode]'))button.setAttribute('aria-pressed',String(button.dataset.readingMode===mode));
  if(sync){const url=new URL(location.href);if(mode==='original')url.searchParams.set('text','original');else url.searchParams.delete('text');history.replaceState(null,'',url);}
 };
 for(const button of work.querySelectorAll('button[data-side-mode]'))button.addEventListener('click',()=>setSide(button.dataset.sideMode,true));
 for(const button of work.querySelectorAll('button[data-reading-mode]'))button.addEventListener('click',()=>setReading(button.dataset.readingMode,true));
 expand.addEventListener('click',()=>{const expanded=work.classList.toggle('essay-expanded');expand.setAttribute('aria-pressed',String(expanded));expand.textContent=expanded?'Restore width':'Expand essay';});
 for(const button of work.querySelectorAll('[data-load-document]'))button.addEventListener('click',()=>loadDocument(button.dataset.loadDocument));
 const restore=()=>{const params=new URLSearchParams(location.search);setSide(params.get('commentary')==='goresky-2018'?'essay':'notes');setReading(params.get('text')==='original'?'original':'guide');};
 // A passage link always reveals the guide, even when the external original
 // was selected through a shared URL. It never changes the essay's scroll.
 const revealGuide=()=>{if(document.getElementById(location.hash.slice(1))?.closest('#weil-guide'))setReading('guide',true);};
 window.addEventListener('popstate',restore);window.addEventListener('hashchange',revealGuide);
 work.addEventListener('keydown',event=>{if(event.key==='Escape'&&work.dataset.sideMode==='essay'){setSide('notes',true);work.querySelector('button[data-side-mode="notes"]').focus();}});
 restore();revealGuide();
}
