// A dismissal lasts for the current passage. Entering another passage, or
// returning after leaving, can reveal the exhibit again. Manual opening pins it.
export function drawerState(state,event){
 const next={...state};
 if(event.type==='context'&&event.id!==state.context){next.context=event.id;next.dismissed=false;}
 if(event.type==='toggle'){
  if(state.open){next.manual=false;next.dismissed=true;}
  else{next.manual=true;next.dismissed=false;}
 }
 if(event.type==='close'){next.manual=false;next.dismissed=true;}
 if(event.type==='reveal'){next.manual=true;next.dismissed=false;}
 if(event.type==='suspend')next.suspended=event.value;
 next.open=!next.suspended&&(next.manual||Boolean(next.context)&&!next.dismissed);
 return next;
}

export function mountExhibitDrawer({rail,stage,note}){
 let state={context:null,manual:false,dismissed:false,suspended:false,open:false};
 const tab=document.createElement('button');tab.type='button';tab.className='work-exhibit-tab';
 tab.textContent='Interactives';tab.setAttribute('aria-controls','work-exhibit-drawer');tab.setAttribute('aria-expanded','false');
 const close=document.createElement('button');close.type='button';close.className='work-exhibit-close';close.textContent='Close';close.setAttribute('aria-label','Close the interactive drawer');
 rail.classList.add('work-exhibit-drawer');rail.id='work-exhibit-drawer';rail.setAttribute('aria-label','Passage-linked interactives');
 rail.querySelector('.zeta-panel-heading').append(close);stage.append(tab,rail);stage.classList.add('work-has-exhibit');
 function measure(){
  const box=stage.getBoundingClientRect(),left=note?.getBoundingClientRect().left;
  const width=innerWidth<=700?box.width-44:left===undefined?Math.min(560,box.width-44):Math.min(box.width-44,Math.max(260,box.right-left));
  stage.style.setProperty('--work-exhibit-width',Math.max(0,width)+'px');
 }
 new ResizeObserver(measure).observe(stage);window.addEventListener('resize',measure);measure();
 const notify=()=>window.dispatchEvent(new CustomEvent('paper:exhibit-visibility',{detail:{open:state.open,suspended:state.suspended}}));
 function send(event){
  const previous=state.open;state=drawerState(state,event);
  rail.classList.toggle('is-open',state.open);rail.inert=!state.open;rail.setAttribute('aria-hidden',String(!state.open));
  tab.setAttribute('aria-expanded',String(state.open));tab.textContent=state.open?'Close interactives':'Interactives';
  if(previous!==state.open)notify();
 }
 tab.addEventListener('click',()=>{send({type:'toggle'});if(state.open)close.focus();});
 close.addEventListener('click',()=>{send({type:'close'});tab.focus();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.open){send({type:'close'});tab.focus();}});
 window.addEventListener('paper:commentary-mode',event=>send({type:'suspend',value:event.detail.open}));
 rail.exhibitDrawer={setContext:id=>send({type:'context',id}),reveal:()=>send({type:'reveal'}),dismiss:()=>send({type:'close'}),get isOpen(){return state.open;}};
 send({type:'context',id:null});window.dispatchEvent(new Event('paper:exhibit-ready'));
 return rail.exhibitDrawer;
}
