import {mathExpoMonogram,mathExpoSignature} from '../../../scripts/build-editorial-mark.mjs';

// One drawing supplies the favicon, collection mark, and editorial signature.
export const meMonogram=mathExpoMonogram;
const signature=mathExpoSignature;

export function signEditorialNotes(html){
 // Only our passage notes receive this credit. Whole-work authored essays
 // use different containers and keep their own bylines.
 html=html.replace(/<aside\b([^>]*\bclass="[^"]*"[^>]*)>(\s*)<span class="note-type">([\s\S]*?)<\/span>/g,(match,attrs,space,type)=>{
  const classes=attrs.match(/\bclass="([^"]*)"/)?.[1].split(/\s+/)??[];
  if(!classes.includes('commentary'))return match;
  return `<aside${attrs} data-editorial-author="math-expo">${space}<div class="commentary-meta"><span class="note-type">${type}</span>${signature}</div>`;
 });
 html=html.replace(/<section class="modern-comparison"><span class="note-type">([\s\S]*?)<\/span>/g,(_,type)=>`<section class="modern-comparison" data-editorial-author="math-expo"><div class="commentary-meta"><span class="note-type">${type}</span>${signature}</div>`);
 // The scroll-linked drawings and interactives are editorial commentary too.
 html=html.replace(/<header class="zeta-panel-heading"><div>([\s\S]*?<\/h2>)<\/div>/g,(_,heading)=>`<header class="zeta-panel-heading"><div class="zeta-panel-credit" data-editorial-author="math-expo">${signature}<div>${heading}</div></div>`);
 return html;
}
