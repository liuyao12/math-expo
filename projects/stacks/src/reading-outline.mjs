import {escapeHTML as esc} from './latex.mjs';

export function renderOutline(sections, bookTitle){
 const branch=(id,label,children)=>`<li><div class="outline-row"><button type="button" class="outline-toggle" aria-expanded="false" aria-controls="${id}">${esc(label)}</button></div><ul id="${id}" hidden>${children}</ul></li>`;
 const renderSection=section=>`<li><div class="outline-row"><a href="#${section.tag}" data-outline="${section.tag}"><span class="outline-section-number">${section.number}</span>${esc(section.title)}</a></div></li>`;

 const groups=[];
 for(const section of sections){
  if(section.stage||!groups.length)groups.push({title:section.stage,sections:[]});
  groups.at(-1).sections.push(section);
 }
 const entries=groups.map(({title,sections})=>{
  const children=sections.map(renderSection).join('');
  if(!title)return children;
  return branch(`outline-stage-${sections[0].tag}`,title,children);
 }).join('');
 return `<ul class="outline-tree">${bookTitle?branch('outline-book',bookTitle,entries):entries}</ul>`;
}
