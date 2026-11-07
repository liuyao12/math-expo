import './vendor/katex/katex.min.js';
import {macros} from './math-config.js';

// Complete accessible MathML is present in the document, including closed
// proofs. Add KaTeX's HTML layout only near the viewport, keeping long readings
// light enough to navigate. No source text or mathematical content is fetched.
const render=element=>{
 if(!element.classList.contains('math-lazy'))return;
 element.innerHTML=globalThis.katex.renderToString(element.dataset.tex,{
  displayMode:element.classList.contains('math-display'),macros:{...macros},
  throwOnError:true,strict:'ignore',output:'htmlAndMathml',trust:context=>context.command==='\\href'
 });
 element.classList.remove('math-lazy');
};
const observer=new IntersectionObserver(entries=>{
 for(const entry of entries)if(entry.isIntersecting){render(entry.target);observer.unobserve(entry.target);}
},{rootMargin:'600px 0px'});
const observe=()=>document.querySelectorAll('.math-lazy').forEach(element=>observer.observe(element));
observe();
// The mobile notes panel inserts cards as the reader changes passage.
const dock=document.getElementById('example-dock');
if(dock)new MutationObserver(records=>{
 for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1){
  if(node.matches('.math-lazy'))observer.observe(node);
  node.querySelectorAll('.math-lazy').forEach(element=>observer.observe(element));
 }
}).observe(dock,{childList:true,subtree:true});
addEventListener('beforeprint',()=>document.querySelectorAll('.math-lazy').forEach(render));
