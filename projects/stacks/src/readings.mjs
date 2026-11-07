import fs from 'node:fs';
import path from 'node:path';

// An overview may omit prerequisites; it must never add to the selection.
// Keep only audited nodes reachable from the displayed target.
export function selectedOverview(nodes,target,requiredTags){
 const allowed=new Set(requiredTags),selected={};
 const visit=tag=>{
  if(selected[tag]||!allowed.has(tag)||!nodes[tag])return;
  selected[tag]={...nodes[tag],uses:(nodes[tag].uses||[]).filter(used=>allowed.has(used)&&nodes[used])};
  selected[tag].uses.forEach(visit);
 };
 visit(target);
 if(!selected[target])throw Error('Overview target is outside the audited dependencies: '+target);
 return selected;
}

export function loadReadingCatalog(root){
 const sections=JSON.parse(fs.readFileSync(path.join(root,'upstream/sections.json'),'utf8'));
 const references=JSON.parse(fs.readFileSync(path.join(root,'upstream/references.json'),'utf8'));
 const chapters=JSON.parse(fs.readFileSync(path.join(root,'src/chapters.json'),'utf8'));
 const chaptersBySlug=new Map(chapters.map(chapter=>[chapter.slug,chapter]));
 const sectionsByTag=new Map(Object.entries(sections));
 const sectionForTag=new Map();
 for(const section of sectionsByTag.values()){
  const source=fs.readFileSync(path.join(root,'upstream/sections',section.slug+'.tex'),'utf8');
  sectionForTag.set(section.tag,section);
  for(const match of source.matchAll(/\\label\{([^}]+)\}/g)){
   const ref=references[section.chapter+'-'+match[1]];
   if(ref)sectionForTag.set(ref.tag,section);
  }
 }
 return {sectionsByTag,sectionForTag,chaptersBySlug,references};
}

export function assembleReading(spec,catalog){
 if(!spec.slug||!spec.readingTitle||!spec.sections?.length)throw Error('Incomplete reading specification');
 if(new Set(spec.sections).size!==spec.sections.length)throw Error('Repeated section tag in '+spec.slug);
 const sections=spec.sections.map(tag=>{
  const section=catalog.sectionsByTag.get(tag);
  if(!section)throw Error('Unknown section tag '+tag+' in '+spec.slug);
  return {...section,chapterTitle:catalog.chaptersBySlug.get(section.chapter).title};
 }).sort((a,b)=>a.number.localeCompare(b.number,'en',{numeric:true}));
 const chapter=catalog.chaptersBySlug.get(sections[0].chapter);
 if(spec.target){
  const targetSection=catalog.sectionForTag.get(spec.target);
  if(!targetSection||!spec.sections.includes(targetSection.tag))throw Error('Target '+spec.target+' is outside '+spec.slug);
 }
 for(let i=0;i<sections.length;i++){
  if(!i||sections[i].chapter!==sections[i-1].chapter){
   const original=catalog.chaptersBySlug.get(sections[i].chapter);
   sections[i].stage=original.number+'. '+original.title;
  }
 }
 return {...spec,title:chapter.title,number:chapter.number,core:spec.role==='foundation',sections};
}

export function loadReadings(root,catalog=loadReadingCatalog(root)){
 const specs=JSON.parse(fs.readFileSync(path.join(root,'src/readings.json'),'utf8'));
 const readings=specs.map(spec=>assembleReading(spec,catalog));
 const bySlug=new Map(readings.map(reading=>[reading.slug,reading]));
 if(bySlug.size!==readings.length)throw Error('Duplicate reading slug');
 const resolved=new Set(),active=new Set();
 const visit=reading=>{
  if(active.has(reading.slug))throw Error('Cyclic reading prerequisite at '+reading.slug);
  if(resolved.has(reading.slug))return;
  active.add(reading.slug);
  for(const slug of reading.prerequisites||[]){
   const prerequisite=bySlug.get(slug);
   if(!prerequisite)throw Error('Unknown prerequisite reading '+slug);
   visit(prerequisite);
  }
  active.delete(reading.slug);
  resolved.add(reading.slug);
 };
 readings.forEach(visit);
 const prerequisiteSlugs=reading=>{
  const slugs=new Set();
  for(const slug of reading.prerequisites||[]){
   for(const ancestor of prerequisiteSlugs(bySlug.get(slug)))slugs.add(ancestor);
   slugs.add(slug);
  }
  return [...slugs];
 };
 return readings.map(reading=>({...reading,prerequisiteSlugs:prerequisiteSlugs(reading)}));
}

export function loadReferenceReadings(root,catalog=loadReadingCatalog(root)){
 return JSON.parse(fs.readFileSync(path.join(root,'src/reference-readings.json'),'utf8'))
  .map(spec=>assembleReading(spec,catalog));
}
