const data=JSON.parse(document.getElementById('parallel-data').textContent);
const choice=document.getElementById('commentary-choice'),scroll=document.getElementById('commentary-scroll'),hide=document.getElementById('commentary-hide');
const primary=document.getElementById('primary-scroll'),pane=document.getElementById('authored-pane'),header=document.querySelector('.parallel-header');
const positions=new Map();let current=choice.value,essayPosition=0;
function setEssay(id){if(!data.essays.some(e=>e.id===id))return;positions.set(current,scroll.scrollTop);current=id;choice.value=id;for(const card of document.querySelectorAll('[data-essay]'))card.hidden=card.dataset.essay!==id;scroll.scrollTop=positions.get(id)??0;}
choice.addEventListener('change',()=>{setEssay(choice.value);const url=new URL(location.href);url.searchParams.set('commentary',choice.value);history.replaceState(null,'',url);});
function readingPosition(){
 const collapsed=document.body.classList.contains('commentary-collapsed');
 if(collapsed?window.scrollY<=1:primary.scrollTop<=1)return null;
 const top=collapsed?header.getBoundingClientRect().bottom:primary.getBoundingClientRect().top;
 const points=[...primary.querySelectorAll('.passage > .original > *')].filter(p=>p.getClientRects().length&&p.getBoundingClientRect().height>0);
 const starting=[...primary.querySelectorAll('.passage > .original')].find(p=>p.getBoundingClientRect().top>=top-4&&p.getBoundingClientRect().top<innerHeight-30);
 // Prefer a paragraph beginning in view over the tail of the preceding
 // passage, whose restored sidenote can be much taller than its text.
 const passage=starting??points.find(p=>p.getBoundingClientRect().top>=top-4&&p.getBoundingClientRect().top<innerHeight-30)??points.find(p=>p.getBoundingClientRect().bottom>top+20);
 return passage&&passage.getBoundingClientRect().top<innerHeight?{passage,offset:passage.getBoundingClientRect().top-top}:null;
}
function setCollapsed(collapsed,{sync=false,preserve=true}={}){
 const changed=collapsed!==document.body.classList.contains('commentary-collapsed');
 const position=changed&&preserve?readingPosition():null;
 if(changed)window.dispatchEvent(new CustomEvent('paper:commentary-mode',{detail:{open:!collapsed}}));
 if(collapsed)essayPosition=scroll.scrollTop;
 document.body.classList.toggle('commentary-collapsed',collapsed);pane.hidden=collapsed;
 hide.textContent=collapsed?'Show authored commentary':'Collapse authored commentary';hide.setAttribute('aria-expanded',String(!collapsed));
 document.getElementById('reading-mode-status').textContent=collapsed?'Passage notes, drawings, and interactives visible.':'Authored commentary open. Passage notes and visuals are preserved beneath it.';
 if(collapsed){document.body.classList.remove('notes-hidden');const notes=document.getElementById('notes-toggle');if(notes){notes.setAttribute('aria-pressed','true');notes.textContent='Hide commentary';}}
 else scroll.scrollTop=essayPosition;
 if(changed)requestAnimationFrame(()=>{
  if(!collapsed)window.scrollTo({top:0,behavior:'instant'});
  if(position){const top=collapsed?header.getBoundingClientRect().bottom:primary.getBoundingClientRect().top,delta=position.passage.getBoundingClientRect().top-top-position.offset;if(collapsed)window.scrollBy({top:delta,behavior:'instant'});else primary.scrollTop+=delta;}
  else if(collapsed)window.scrollTo({top:0,behavior:'instant'});
  else window.scrollTo({top:0,behavior:'instant'});
  window.dispatchEvent(new Event('resize'));window.dispatchEvent(new Event('scroll'));
 });
 if(sync){const url=new URL(location.href);url.searchParams.set('view',collapsed?'notes':'commentary');history.replaceState(null,'',url);}
}
hide.addEventListener('click',()=>setCollapsed(!document.body.classList.contains('commentary-collapsed'),{sync:true}));
const restore=()=>{const params=new URLSearchParams(location.search);setEssay(params.get('commentary')??data.essays[0]?.id);setCollapsed(params.has('view')?params.get('view')!=='commentary':data.defaultCollapsed,{preserve:false});};
window.addEventListener('popstate',restore);restore();
new ResizeObserver(()=>document.documentElement.style.setProperty('--parallel-header-height',header.getBoundingClientRect().height+'px')).observe(header);
// The existing exhibits follow viewport positions; forward column scrolls
// while their DOM and numerical state remain mounted across mode changes.
primary.addEventListener('scroll',()=>window.dispatchEvent(new Event('scroll')),{passive:true});
const render=()=>{renderMathInElement(document.querySelector('.parallel-columns'),{delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false});window.paperNames?.enhance(document.querySelector('.parallel-columns'));};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
