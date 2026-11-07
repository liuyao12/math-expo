// Enumerate exact diagram formulas; the ordinary build uses the retained SVGs.
import fs from 'node:fs';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
import {createRenderer} from '../src/latex.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const sections=JSON.parse(fs.readFileSync(root+'upstream/sections.json'));
const gluing=JSON.parse(fs.readFileSync(root+'upstream/manifest.json'));
const diagrams=new Map();let current;
const r=createRenderer(root,{diagramRenderer:tex=>{
 const key=createHash('sha256').update(tex).digest('hex').slice(0,24);
 if(!diagrams.has(key))diagrams.set(key,{key,tex,sections:[]});
 const item=diagrams.get(key);if(!item.sections.includes(current))item.sections.push(current);return '';
}});
for(const section of [...Object.values(sections),...gluing.sections]){current=section.slug;r.section(section);}
process.stdout.write(JSON.stringify([...diagrams.values()],null,2)+'\n');
