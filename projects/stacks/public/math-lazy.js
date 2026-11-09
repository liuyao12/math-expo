import './vendor/katex/katex.min.js';
import {macros} from './math-config.js';

// Native MathML is present from the first paint. Apply KaTeX's HTML layout
// only to formulas on screen, in batches that leave time for interaction.
function render(element){
 if(!element.classList.contains('math-lazy'))return;
 element.innerHTML=globalThis.katex.renderToString(element.dataset.tex,{
  displayMode:element.classList.contains('math-display'),macros:{...macros},
  throwOnError:true,strict:'ignore',output:'htmlAndMathml',trust:context=>context.command==='\\href'
 });
 element.classList.remove('math-lazy');
}

const pending=new Set();
let frame=0;
function schedule(){
 if(!frame&&pending.size)frame=requestAnimationFrame(renderVisible);
}
function renderVisible(){
 frame=0;
 const linkedSection=document.getElementById(location.hash.slice(1))?.closest('.source-section');
 const linked=[],other=[];
 // Check again before writing. A reader may have jumped since the observer fired.
 for(const element of pending){
  const box=element.getBoundingClientRect();
  if(!element.isConnected||!box.height||box.bottom<0||box.top>innerHeight){
   pending.delete(element);
  }else if(linkedSection&&element.closest('.source-section')===linkedSection){
   linked.push(element);
  }else{
   other.push(element);
  }
 }
 const deadline=performance.now()+6;
 let count=0;
 for(const element of [...linked,...other]){
  pending.delete(element);
  formulaObserver.unobserve(element);
  render(element);
  if(++count>=12||performance.now()>=deadline)break;
 }
 schedule();
}

const formulaObserver=new IntersectionObserver(entries=>{
 for(const entry of entries){
  if(entry.isIntersecting)pending.add(entry.target);
  else pending.delete(entry.target);
 }
 schedule();
});

// Observe reading sections and scroll panes first. Register individual
// formulas only once their containing section or pane is on screen.
const scopeSelector='.source-section,.proof-body,.example-body';
const activeScopes=new Map();
function stopScope(scope){
 const formulas=activeScopes.get(scope);
 if(!formulas)return;
 for(const element of formulas){
  formulaObserver.unobserve(element);
  pending.delete(element);
 }
 activeScopes.delete(scope);
}
const scopeObserver=new IntersectionObserver(entries=>{
 for(const {target,isIntersecting} of entries){
  if(!isIntersecting){stopScope(target);continue;}
  if(!target.isConnected||activeScopes.has(target))continue;
  const formulas=[...target.querySelectorAll('.math-lazy')].filter(element=>element.closest(scopeSelector)===target);
  activeScopes.set(target,formulas);
  for(const element of formulas)formulaObserver.observe(element);
 }
});
for(const scope of document.querySelectorAll(scopeSelector))scopeObserver.observe(scope);

// The examples panel inserts and removes cards as the reader changes passage.
const dock=document.getElementById('example-dock');
if(dock)new MutationObserver(records=>{
 for(const record of records){
  if(record.target.closest('.math-inline,.math-display'))continue;
  for(const node of record.removedNodes)if(node.nodeType===1){
   for(const scope of exampleBodies(node)){scopeObserver.unobserve(scope);stopScope(scope);}
  }
  for(const node of record.addedNodes)if(node.nodeType===1){
   for(const scope of exampleBodies(node))scopeObserver.observe(scope);
  }
 }
}).observe(dock,{childList:true,subtree:true});
function exampleBodies(node){
 return node.matches('.example-body')?[node]:node.querySelectorAll('.example-body');
}

addEventListener('beforeprint',()=>{
 cancelAnimationFrame(frame);
 frame=0;
 pending.clear();
 document.querySelectorAll('.math-lazy').forEach(render);
});
