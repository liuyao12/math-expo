// The Riemann reading's English paper stays in the middle. Editorial headings,
// paragraph metadata, proofs and edition apparatus belong to its passage notes.
export function separateRiemannApparatus(primary){
 const reading=primary.querySelector('.zeta-illustrated-reading');if(!reading)return;
 const notes=[...reading.querySelectorAll('.passage > .commentary')];if(!notes.length)return;
 const makeDetails=(label,content)=>{const details=document.createElement('details'),summary=document.createElement('summary');details.className='work-reading-apparatus';summary.textContent=label;details.append(summary,content);return details;};
 for(const part of reading.querySelectorAll('.paper-part')){
  const heading=part.querySelector(':scope > .section-heading'),note=part.querySelector('.commentary');
  if(heading&&note)note.prepend(heading);
 }
 for(const passage of reading.querySelectorAll('.passage')){
  const meta=passage.querySelector('.original > .passage-meta'),note=passage.querySelector('.commentary');
  if(meta&&note)note.prepend(meta);
 }
 let previousNote;
 for(const passage of reading.querySelectorAll('.passage')){
  const note=passage.querySelector(':scope > .commentary');
  if(passage.classList.contains('editorial-passage')&&previousNote&&note){
   const original=passage.querySelector('.original'),bridge=document.createElement('div');
   bridge.append(...original.childNodes);original.remove();note.prepend(bridge);
   passage.classList.remove('passage','editorial-passage');passage.classList.add('work-editorial-bridge');
   previousNote.append(makeDetails('Editorial bridge',passage));
  }else previousNote=note;
 }
 const claim=reading.querySelector('#rh-proof-claim');
 if(claim)claim.closest('.commentary').prepend(claim);
 const proofIndex=document.createElement('ul'),proofSection=primary.querySelector('.precise-statements');
 for(const statement of primary.querySelectorAll('.precise-statements .statement')){
  const origin=statement.querySelector('.statement-origin')?.getAttribute('href');
  const passage=origin&&reading.querySelector(`[id="${origin.slice(1)}"]`),note=passage?.querySelector('.commentary');
  if(note){
   const item=document.createElement('li'),link=document.createElement('a');link.href='#'+statement.id;link.textContent=statement.querySelector('h3')?.textContent??'Precise statement';item.append(link);proofIndex.append(item);
   note.append(makeDetails('Precise statement and proof',statement));
  }
 }
 if(proofIndex.childElementCount)proofSection?.append(proofIndex);
 const header=primary.querySelector('.paper-heading');
 if(header){
  const information=document.createElement('div');
  for(const child of [...header.children])if(!child.matches('h1,.author'))information.append(child);
  if(information.childElementCount)notes[0].prepend(makeDetails('Edition and sources',information));
 }
 const supporting=document.createElement('div');supporting.className='work-reading-support';
 for(const child of [...primary.children]){
  if(child===header||child===reading)continue;
  const label=child.querySelector('h2')?.textContent??(child.matches('.site-footer')?'About this reading':child.matches('.work-further')?'Further reading':'Edition information');
  supporting.append(makeDetails(label,child));
 }
 if(supporting.childElementCount)notes.at(-1).append(supporting);
 primary.classList.add('original-only-reading');
}
