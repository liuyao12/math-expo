// Synchronize by explicit editorial correspondence, never by scroll percentage.
// A block may refer to several paper paragraphs. Unmapped passages stay unmapped.
export function containingLink(links,id){return links.find(link=>link.paper.includes(id))??null;}

export function createReadingLinks({paper,commentary,controls,isOpen,getArticle}){
 const label=document.createElement('label'),check=document.createElement('input'),status=document.createElement('span');
 check.type='checkbox';check.checked=new URLSearchParams(location.search).get('sync')!=='off';
 label.append(check,document.createTextNode(' Link scrolling'));
 status.className='work-link-status';status.setAttribute('role','status');
 controls.append(label,status);controls.hidden=true;
 let links=[],active=null,lastSource=paper,frame=0,guideOnly=false;
 const expected=new Map();
 function highlight(link){
  active=link;
  for(const item of links){item.block.classList.toggle('work-link-active',item===link);for(const id of item.paper)document.getElementById(id)?.classList.toggle('work-passage-linked',item===link);}
  status.textContent=(guideOnly?'Section guide · ':'')+(link?link.label:'No matching tag at this position');
 }
 function jump(container,target){
  if(!target)return;
  container.scrollTop+=target.getBoundingClientRect().top-container.getBoundingClientRect().top-20;
  expected.set(container,container.scrollTop);
 }
 function paperAtReadingLine(){
  const box=paper.getBoundingClientRect(),line=box.top+Math.min(100,box.height*.2);
  const candidates=[...paper.querySelectorAll('.passage')].filter(p=>p.getBoundingClientRect().bottom>line);
  const current=candidates.find(p=>p.getBoundingClientRect().top<=line)??candidates.find(p=>p.getBoundingClientRect().top<Math.min(box.bottom,line+180));
  return current?.id??null;
 }
 function commentaryAtReadingLine(){
  const box=commentary.getBoundingClientRect(),line=box.top+Math.min(65,box.height*.15);
  const last=links.at(-1),lastBox=last?.block.getBoundingClientRect();
  if(commentary.scrollTop+commentary.clientHeight>=commentary.scrollHeight-2&&lastBox?.bottom>box.top&&lastBox?.top<box.bottom)return last;
  return links.find(link=>{const r=link.block.getBoundingClientRect();return r.top<=line&&r.bottom>line;})??null;
 }
 function follow(source){
  if(!check.checked||!isOpen()||!links.length)return;
  const link=source===paper?containingLink(links,paperAtReadingLine()):commentaryAtReadingLine();
  if(link===active)return;
  highlight(link);
  if(!link)return;
  if(source===paper)jump(commentary,link.block);
  else if(!link.paper.includes(paperAtReadingLine()))jump(paper,document.getElementById(link.paper[0]));
 }
 function onScroll(source){
  const anticipated=expected.get(source);
  expected.delete(source);
  // The receiving pane's programmatic scroll is consumed, not sent back.
  if(anticipated!==undefined&&Math.abs(source.scrollTop-anticipated)<2)return;
  lastSource=source;
  if(frame)cancelAnimationFrame(frame);
  frame=requestAnimationFrame(()=>{frame=0;follow(source);});
 }
 for(const container of [paper,commentary]){
  container.addEventListener('scroll',()=>onScroll(container),{passive:true});
  for(const event of ['wheel','pointerdown','keydown'])container.addEventListener(event,()=>{expected.delete(container);lastSource=container;},{passive:true});
 }
 check.addEventListener('change',()=>{
  const url=new URL(location.href);url.searchParams.set('sync',check.checked?'on':'off');history.replaceState(null,'',url);
  active=null;
  if(check.checked)follow(lastSource);else{highlight(null);status.textContent='Independent scrolling';}
 });
 function refresh({align=false}={}){
  expected.clear();highlight(null);
  const article=getArticle();
  guideOnly=Boolean(article?.querySelector('.work-section-guide'));
  links=[...article?.querySelectorAll('[data-paper-anchors]')??[]].map(block=>({block,id:block.id,label:block.dataset.linkLabel,paper:block.dataset.paperAnchors.split(/\s+/).filter(Boolean)}));
  controls.hidden=!links.length;
  status.textContent=(guideOnly?'Section guide · ':'')+(check.checked?'Follow tagged sections':'Independent scrolling');
  for(const item of links){
   if(item.block.dataset.linksReady)continue;
   item.block.dataset.linksReady='true';
   for(const tag of item.block.querySelectorAll('[data-paper-jump]'))tag.addEventListener('click',event=>{
    event.preventDefault();event.stopPropagation();
    highlight(item);jump(paper,document.getElementById(tag.dataset.paperJump));
    const url=new URL(location.href);url.hash=tag.dataset.paperJump;history.replaceState(null,'',url);
   });
  }
  if(align&&check.checked&&isOpen())follow(paper);
 }
 return {refresh,followPaper:()=>{active=null;follow(paper);},check};
}
