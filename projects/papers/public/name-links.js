(() => {
 const data=document.getElementById('personal-name-data');
 if(!data)return;
 const people=JSON.parse(data.textContent),byAlias=new Map();
 for(const person of people)for(const alias of person.aliases)byAlias.set(alias,person);
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const aliases=[...byAlias.keys()].sort((a,b)=>b.length-a.length);
 const pattern=new RegExp(`(?<![\\p{L}\\p{N}_])(${aliases.map(escape).join('|')})(?![\\p{L}\\p{N}_])`,'gu');
 const {isPersonalUse}=window.MathExpoNameContext;
 const titleSelector='i,em,cite,.work-title,.work-bar-title,.paper-heading h1,.work-record h3,.work-heading,.bibliography h3,.profile-bibliography,.authored-essay-title,.guide-passage-title,.parallel-essay h3,.work-essay h3,a[data-work]';
 function localContext(node){
  const block=node.parentElement.closest('p,h1,h2,h3,h4,h5,h6,li,figcaption,summary,button,label,option,dt,dd,td,th')??node.parentElement;
  const range=document.createRange();range.selectNodeContents(block);range.setEnd(node,0);
  return {text:block.textContent,offset:range.toString().length};
 }
 function enhance(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode()){
   const node=walker.currentNode,parent=node.parentElement;
   if(!parent||parent.closest('script,style,textarea,pre,code,svg,math,.katex,.person-surname,.parallel-surname,[data-no-person-names]')||parent.closest(titleSelector))continue;
   pattern.lastIndex=0;
   if(pattern.test(node.data))nodes.push(node);
  }
  for(const node of nodes){
   const text=node.data,fragment=document.createDocumentFragment(),context=localContext(node);let last=0;
   pattern.lastIndex=0;
   for(const match of text.matchAll(pattern)){
    const person=byAlias.get(match[0]);
    if(!isPersonalUse(person,context.text,context.offset+match.index,context.offset+match.index+match[0].length))continue;
    fragment.append(document.createTextNode(text.slice(last,match.index)));
    const surname=document.createElement('span');surname.className='person-surname';surname.textContent=match[0];
    // Existing citations keep their precise destinations; avoid nested anchors
    // and links inside controls, whose clicks already have another purpose.
    const container=node.parentElement.closest('a,button,label,summary,option');
    const self=new URL(person.href,location.href).pathname===location.pathname;
    if(container||self)fragment.append(surname);
    else{
     const link=document.createElement('a');link.className='entity-link person-link';link.dataset.person=person.id;
     const cited=node.parentElement.closest('.passage')?.querySelector(`a[data-person="${person.id}"][data-reference-work]`);
     link.href=cited?.getAttribute('href')??person.href;
     link.title=cited?.title??('All works by '+person.name);
     if(cited)link.dataset.referenceWork=cited.dataset.referenceWork;
     link.append(surname);fragment.append(link);
    }
    last=match.index+match[0].length;
   }
   fragment.append(document.createTextNode(text.slice(last)));node.replaceWith(fragment);
  }
 }
 window.paperNames={enhance,isPersonalUse};
})();
