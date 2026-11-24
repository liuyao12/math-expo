import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';

// The italic x is U+0078 from the bundled KaTeX_Math-Italic font.
export const mathExpoSVG=readFileSync(new URL('../shared/mex.svg',import.meta.url),'utf8').trim();
export const mathExpoMonogram=mathExpoSVG.replace('<svg ','<svg aria-hidden="true" focusable="false" ');
export const mathExpoSignature=`<span class="me-signature" role="img" aria-label="MEx · Math Expo" title="Commentary by Math Expo">${mathExpoMonogram}</span>`;

export function buildEditorialMark(destination){
 const style=readFileSync(new URL('../shared/editorial-mark.css',import.meta.url),'utf8');
 const version=createHash('sha256').update(style).update(mathExpoSVG).digest('hex').slice(0,12);
 const css=`editorial-mark-${version}.css`;
 writeFileSync(path.join(destination,css),style);
 return {css,version};
}
