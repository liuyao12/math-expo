// Contents scroll independently. The paper, its passage notes, and its
// exhibits share one reading surface; whole-work essays overlay that surface.
const config=JSON.parse(document.getElementById('reader-layout-data').textContent);
const primary=document.querySelector('.reading-body')??document.getElementById('primary-scroll');
const el=(tag,attrs={},text)=>{const node=document.createElement(tag);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);if(text!==undefined)node.textContent=text;return node;};
const button=(text,attrs={})=>el('button',{type:'button',...attrs},text);
if(primary){
 const oldMain=primary.closest('main'),oldHeader=document.querySelector('.masthead,.parallel-header');
 const nav=document.querySelector('.reading-nav')??new DOMParser().parseFromString(config.nav,'text/html').querySelector('nav')??el('nav');
 nav.className='work-contents';nav.id='work-contents';nav.setAttribute('aria-label','Paper contents — scroll independently');nav.tabIndex=0;
 const tocLinks=[...nav.querySelectorAll('a[href^="#"]')];
 const title=el('span',{class:'work-bar-title'});title.append(el('i',{},config.title),el('span',{},` · ${config.year}`));
 const toolbar=el('header',{class:'work-bar'}),contentsButton=button('Contents',{'aria-controls':'work-contents','aria-expanded':'false',class:'work-contents-button'});
 const collection=el('a',{href:config.base,class:'work-collection'},'← Papers');
 toolbar.append(collection,title,contentsButton);
 const columns=el('main',{class:'work-columns','aria-label':'Paper reader'});
 const textColumn=el('section',{class:'work-text-column','aria-label':'Main paper'});
 const textHeader=el('div',{class:'work-column-heading'},'Paper & passage notes');
 const textScroll=el('div',{class:'work-text-scroll',id:'work-text-scroll',tabindex:'0',role:'region','aria-label':'Paper, sidenotes and visuals — scroll together'});
 textColumn.append(textHeader,textScroll);textScroll.append(primary);primary.classList.remove('parallel-primary-scroll');primary.classList.add('reading-body');
 const margin=el('aside',{class:'work-margin',id:'work-commentary-panel','aria-label':'Whole-work authored commentary',hidden:''});
 const marginHeader=el('div',{class:'work-margin-heading'}),marginTitle=el('span',{},'Authored commentary');
 const essayToggle=button('Authored commentary',{'aria-expanded':'false','aria-controls':'work-commentary-panel',class:'work-commentary-launcher'});
 const essayClose=button('Collapse',{'aria-label':'Collapse authored commentary'});
 toolbar.append(el('a',{href:config.base+'commentaries/',class:'work-browse'},'Browse commentaries'));
 marginHeader.append(marginTitle,essayClose);
 const authored=el('div',{id:'work-authored',class:'work-authored',tabindex:'0',role:'region','aria-label':'Authored commentary — scroll independently'});
 margin.append(marginHeader,authored);
 // Keep every note beside its original passage, including its drawings and
 // controls. Stable note anchors also support links from the previous layout.
 const passageNotes=[...primary.querySelectorAll('.passage > .commentary')];
 for(const note of passageNotes)if(!note.id)note.id='note-'+note.closest('.passage').id;
 // An authored essay belongs to the whole work; it never follows passage scroll.
 const essayChoice=el('select',{'aria-label':'Choose authored commentary',id:'work-essay-choice'});
 if(config.essays.length){
  const choiceLabel=el('label',{for:'work-essay-choice',class:'work-choice-label'},'Authored commentary');
  authored.append(choiceLabel,essayChoice);
  for(const essay of config.essays){
   essayChoice.append(el('option',{value:essay.id},essay.author+' · '+essay.year));
   const article=el('article',{'data-authored-id':essay.id,class:'work-essay'});
   article.append(el('p',{class:'note-type'},essay.kind+' · Source record'),el('h2',{},essay.author));
   const heading=el('h3');heading.append(el('i',{},essay.title));article.append(heading,el('p',{class:'work-publication'},essay.publication),el('p',{},essay.scope),el('a',{href:essay.url,target:'_blank',rel:'noopener'},'Original source ↗'),el('p',{class:'work-availability'},'The full text has not yet been added here. This source is linked; permission to republish its text has not been established.'));
   authored.append(article);
  }
 }else authored.append(el('p',{class:'work-availability'},'No authored commentary has been attached to this paper yet. Passage notes and illustrations remain beside the paper.'));
 for(const item of config.furtherReading){
  const block=el('div',{class:'work-further'});block.append(el('span',{class:'note-type'},'Further reading'));
  const link=el('a',{href:config.base+'further-reading/'+item.id+'/'});link.append(el('i',{},item.title));block.append(link);primary.append(block);
 }
 // The old companion layout is superseded by this shared reader shell.
 primary.querySelectorAll('.parallel-entry,.reading-key,.companion-toolbar,#authored-commentary').forEach(node=>node.remove());
 primary.querySelectorAll('.companion-main,.original-source-section').forEach(node=>{node.hidden=false;});
 const paperTop=el('span',{id:'top'});primary.prepend(paperTop);
 if(oldMain?.id==='top')oldMain.removeAttribute('id');
 if(!tocLinks.length){
  nav.append(el('span',{class:'nav-label'},'In this paper'));
  for(const heading of primary.querySelectorAll('section[id]')){const name=heading.querySelector('h2');if(name)nav.append(el('a',{href:'#'+heading.id},name.textContent));}
 }
 nav.prepend(el('h2',{class:'work-contents-heading'},'Contents'));
 const readingStage=el('div',{class:'work-reading-stage'});readingStage.append(textColumn,essayToggle,margin);
 columns.append(nav,readingStage);
 oldHeader?.replaceWith(toolbar);if(!toolbar.isConnected)document.body.prepend(toolbar);
 oldMain?.replaceWith(columns);if(!columns.isConnected)document.body.append(columns);
 document.documentElement.classList.add('work-reader-root');
 document.body.classList.remove('parallel-reader','commentary-collapsed','notes-hidden');document.body.classList.add('work-reader');
 let essayOpen=false,essayPosition=0;
 const essayPositions=new Map();let selectedEssay='';
 function chooseEssay(id){
  if(!config.essays.some(essay=>essay.id===id))return;
  essayPositions.set(selectedEssay,authored.scrollTop);selectedEssay=id;essayChoice.value=id;
  authored.querySelectorAll('[data-authored-id]').forEach(node=>{node.hidden=node.dataset.authoredId!==id;});
  authored.scrollTop=essayPositions.get(id)??0;
 }
 function setAuthored(open,sync=false){
  const changed=essayOpen!==open;
  if(changed){if(!open)essayPosition=authored.scrollTop;window.dispatchEvent(new CustomEvent('paper:commentary-mode',{detail:{open}}));}
  essayOpen=open;margin.hidden=!open;essayToggle.hidden=open;document.body.classList.toggle('work-essay-open',open);
  if(changed&&open)authored.scrollTop=essayPosition;
  for(const note of passageNotes)note.inert=open;
  for(const rail of primary.querySelectorAll('.zeta-rail,.surfaces-rail'))rail.inert=open;
  essayToggle.textContent=open?'Collapse authored commentary':'Authored commentary';essayToggle.setAttribute('aria-expanded',String(open));
  if(sync){const url=new URL(location.href);url.searchParams.set('view',open?'commentary':'notes');history.replaceState(null,'',url);}
  requestAnimationFrame(()=>{window.dispatchEvent(new Event('resize'));});
 }
 essayToggle.addEventListener('click',()=>setAuthored(!essayOpen,true));
 essayClose.addEventListener('click',()=>{setAuthored(false,true);essayToggle.focus();});
 essayChoice.addEventListener('change',()=>{chooseEssay(essayChoice.value);const url=new URL(location.href);url.searchParams.set('commentary',essayChoice.value);history.replaceState(null,'',url);window.paperNames?.enhance(authored);});
 function restore(){const params=new URLSearchParams(location.search);chooseEssay(params.get('commentary')??config.essays[0]?.id);setAuthored(params.get('view')==='commentary'||(params.has('commentary')&&params.get('view')!=='notes'));}
 restore();window.addEventListener('popstate',restore);
 contentsButton.addEventListener('click',()=>{const open=document.body.classList.toggle('contents-open');contentsButton.setAttribute('aria-expanded',String(open));});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(essayOpen){setAuthored(false,true);essayToggle.focus();}document.body.classList.remove('contents-open');contentsButton.setAttribute('aria-expanded','false');}});
 function scrollWithin(container,target){container.scrollTop+=target.getBoundingClientRect().top-container.getBoundingClientRect().top-18;}
 function navigate(hash){
  let id;try{id=decodeURIComponent(hash.slice(1));}catch{return;}
  const target=document.getElementById(id);if(!target)return;
  if(primary.contains(target)){if(target.closest('.commentary,.zeta-rail,.surfaces-rail'))setAuthored(false,true);scrollWithin(textScroll,target);}
  else return;
  document.body.classList.remove('contents-open');contentsButton.setAttribute('aria-expanded','false');
 }
 document.addEventListener('click',event=>{
  if(event.target.closest('[data-zero-experiment]'))setAuthored(false,true);
  const link=event.target.closest('a[href^="#"]');if(!link)return;
  const target=document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if(!target||!columns.contains(target))return;
  event.preventDefault();if(location.hash!==link.hash)history.pushState(null,'',link.hash);navigate(link.hash);
 });
 window.addEventListener('hashchange',()=>navigate(location.hash));
 // The shared paper-and-notes scroll drives its exhibits. Contents and
 // whole-work commentary scrolls never change the paper's position.
 let frame=0;
 function updateProgress(){
  frame=0;const top=textScroll.getBoundingClientRect().top+70;
  const links=[...nav.querySelectorAll('a[href^="#"]')];let active=links[0];
  for(const link of links){const target=document.getElementById(decodeURIComponent(link.hash.slice(1)));if(target&&primary.contains(target)&&target.getBoundingClientRect().top<=top)active=link;}
  for(const link of links){link.classList.toggle('active',link===active);if(link===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
  window.dispatchEvent(new Event('scroll'));
 }
 textScroll.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(updateProgress);},{passive:true});
 const finish=()=>{window.paperNames?.enhance(columns);window.renderMathInElement?.(authored,{delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false});navigate(location.hash);updateProgress();window.dispatchEvent(new Event('resize'));};
 document.fonts?.ready.then(finish)??finish();
 window.addEventListener('resize',()=>{document.documentElement.style.setProperty('--work-bar-height',toolbar.getBoundingClientRect().height+'px');},{passive:true});
 document.documentElement.style.setProperty('--work-bar-height',toolbar.getBoundingClientRect().height+'px');
}
