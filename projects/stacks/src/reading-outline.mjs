import {escapeHTML as esc} from './latex.mjs';

export function renderOutline(sections, statements){
 const list=(children,id)=>id
  ? `<ul id="${id}" hidden>${children}</ul>`
  : `<ul class="outline-tree">${children}</ul>`;
 const branch=(id,label,link,children)=>`<li><div class="outline-row"><button type="button" class="outline-toggle${link?'':' outline-stage-toggle'}" aria-label="Toggle ${esc(label)}" aria-expanded="false" aria-controls="${id}">${link?'':esc(label)}</button>${link}</div>${list(children,id)}</li>`;
 const renderSection=section=>{
  const link=`<a href="#${section.tag}" data-outline="${section.tag}"><span class="outline-section-number">${section.number}</span>${esc(section.title)}</a>`;
  const children=statements.get(section.tag);
  if(!children?.length)return `<li><div class="outline-row">${link}</div></li>`;
  const entries=children.map(({tag,label})=>`<li><a href="#${tag}" data-outline-statement="${tag}">${esc(label)}</a></li>`).join('');
  return branch(`outline-section-${section.tag}`,section.title,link,entries);
 };

 const groups=[];
 for(const section of sections){
  if(section.stage||!groups.length)groups.push({title:section.stage,sections:[]});
  groups.at(-1).sections.push(section);
 }
 return list(groups.map(({title,sections})=>{
  const children=sections.map(renderSection).join('');
  if(!title)return children;
  return branch(`outline-stage-${sections[0].tag}`,title,'',children);
 }).join(''));
}
