const data=JSON.parse(document.getElementById('parallel-data').textContent);
const choice=document.getElementById('commentary-choice'),scroll=document.getElementById('commentary-scroll'),hide=document.getElementById('commentary-hide');
const positions=new Map();let current=choice.value;
function setEssay(id){if(!data.essays.some(e=>e.id===id))return;positions.set(current,scroll.scrollTop);current=id;choice.value=id;for(const card of document.querySelectorAll('[data-essay]'))card.hidden=card.dataset.essay!==id;scroll.scrollTop=positions.get(id)??0;}
choice.addEventListener('change',()=>{setEssay(choice.value);const url=new URL(location.href);url.searchParams.set('commentary',choice.value);history.replaceState(null,'',url);});
hide.addEventListener('click',()=>{const hidden=document.body.classList.toggle('commentary-collapsed');scroll.hidden=hidden;hide.textContent=hidden?'Show':'Hide';hide.setAttribute('aria-expanded',String(!hidden));});
const restore=()=>setEssay(new URLSearchParams(location.search).get('commentary')??data.essays[0].id);
window.addEventListener('popstate',restore);restore();
const render=()=>{renderMathInElement(document.querySelector('.parallel-columns'),{delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false});window.paperNames?.enhance(document.querySelector('.parallel-columns'));};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
