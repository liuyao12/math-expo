import fs from 'node:fs';
import {createHash} from 'node:crypto';
const dir=new URL('../src/',import.meta.url);
const english=fs.readFileSync(new URL('sources/riemann-WKCGeom-1998.tex',dir),'utf8');
const german=fs.readFileSync(new URL('sources/riemann-Geom-1998.tex',dir),'utf8');
let body=english.slice(english.indexOf('It is known that geometry'),english.indexOf('\\newpage',english.indexOf('It is known that geometry')));
body=body.replace(/\\begin\{center\}[\s\S]*?\\end\{center\}/g,'').replace(/\\bigbreak/g,'').replace(/\\S~\d+\./g,'').replace(/\s+/g,' ').trim();
// Consecutive source intervals cover the entire lecture body, without gaps.
// Divisions below are editorial, not claimed to be the printed paragraphs.
const starts=[
 ['plan-1','It is known that geometry'],['plan-2','From Euclid to Legendre'],['plan-3','It will follow from this'],['plan-4','Thus arises the problem'],['plan-5','These matters of fact are'],
 ['magnitude-preface','In proceeding to attempt'],['magnitude-1','Magnitude-notions are only possible'],['magnitude-2','Notions whose specialisations'],['magnitude-3','Definite portions of a manifoldness'],['magnitude-4','The researches which can'],
 ['construction','If in the case of a notion'],['coordinates-1','I shall show how conversely'],['coordinates-2','Hereby the determination of position'],
 ['metric-plan','Having constructed the notion'],
 ['line-1','Measure-determinations require'],['line-2','Position-fixing being reduced'],['line-3','I shall treat this problem'],['line-4','I shall suppose, secondly'],['line-5','To find the simplest cases'],['line-6','This differential expression'],['line-7','For Space, when'],['line-8','Such an expression we can'],['line-9','In order now to review'],
 ['curvature-1','For this purpose let us imagine'],['curvature-2','When we introduce these quantities'],['curvature-3','For the determination of the measure-relations'],['curvature-4','A method entirely similar'],
 ['surface-1','In the idea of surfaces'],['surface-2','According to our previous investigation'],['surface-3','To give an intelligible meaning'],
 ['flat-1','Before we make the application'],['flat-2','Manifoldnesses whose curvature is constantly zero'],['flat-3','The measure-relations of these manifoldnesses depend'],
 ['models-1','The theory of \\emph{surfaces}'],['models-2','If we regard these surfaces'],
 ['space-1','By means of these inquiries'],['space-2','Secondly, if we assume'],['space-3','Thirdly, one might'],
 ['large-1','In the course of our previous inquiries'],['large-2','In the extension of space-construction'],
 ['small-1','The questions about the infinitely great'],['small-2','If we suppose that bodies exist'],['small-3','The question of the validity'],['small-4','The answer to these questions'],['small-5','This leads us into the domain']
];
function html(tex){
 const math=[];
 let t=tex.replace(/\\\[([\s\S]*?)\\\]|\$([^$]*?)\$/g,(_,a,b)=>{const i=math.length;math.push(a!==undefined?`\\[${a.trim()}\\]`:`\\(${b.trim()}\\)`);return `@@M${i}@@`;});
 t=t.replace(/G\\"\{o\}ttingen/g,'Göttingen');
 t=t.replace(/\\emph\{([^{}]*)\}/g,'<em>$1</em>').replace(/\\textmd\{([^{}]*)\}/g,'$1').replace(/G\\"\{o\}ttingen/g,'Göttingen').replace(/formul\{\\ae\}/g,'formulae').replace(/\\&/g,'&amp;').replace(/---/g,'—').replace(/--/g,'–').replace(/~/g,' ').replace(/\\ /g,' ').replace(/\\,/g,' ').replace(/\s+/g,' ').trim();
 if(/\\[A-Za-z]/.test(t))throw Error('Unhandled prose command: '+t.match(/.{0,20}\\[A-Za-z].{0,35}/)?.[0]);
 return t.replace(/@@M(\d+)@@/g,(_,i)=>math[i]);
}
const offsets=starts.map(([id,start])=>{const i=body.indexOf(start);if(i<0)throw Error('Missing source boundary '+id);return i;});
if(offsets[0]!==0||offsets.some((v,i)=>i&&v<=offsets[i-1]))throw Error('Source boundaries out of order');
const passages=starts.map(([id],i)=>{const start=offsets[i],end=offsets[i+1]??body.length,tex=body.slice(start,end);return {id,start,end,tex,historical:html(tex)};});
if(passages.map(p=>p.tex).join('')!==body)throw Error('Incomplete source coverage');
const synopsisTex=english.slice(english.indexOf('\\begin{description}'),english.indexOf('\\end{document}')).trim();
const synopsisParts=synopsisTex.replace(/\\(?:begin|end)\{description\}|\\penalty-1000/g,'').split(/\\item\[([^\]]*)\]/);
let synopsisHistorical='';
for(let i=1;i<synopsisParts.length;i+=2)synopsisHistorical+=`<p><strong>${html(synopsisParts[i].replace(/\\S/g,'§'))}</strong> ${html(synopsisParts[i+1])}</p>`;
const data={work:'riemann-1854',checked:'2026-10-22',english:{translator:'William Kingdon Clifford',publication:'Nature 8 (1873), 14–17, 36–37',transcription:'D. R. Wilkins, preliminary version, December 1998',url:'https://www.maths.tcd.ie/pub/HistMath/People/Riemann/Geom/WKCGeom.tex',sha256:createHash('sha256').update(english).digest('hex')},german:{transcription:'D. R. Wilkins, December 1998',url:'https://www.maths.tcd.ie/pub/HistMath/People/Riemann/Geom/Geom.tex',sha256:createHash('sha256').update(german).digest('hex')},editorialVariations:[{passage:'curvature-1',change:'The modern rendering distinguishes initial dx^0 from transformed d-alpha, following the German rather than Clifford’s repeated dx.'},{passage:'surface-2',change:'The modern rendering retains the German’s half-excess claim; Clifford omits half. The margin gives the correct curvature normalization.'}],bodyChars:body.length,passages,synopsisTex,synopsisHistorical};
const output=JSON.stringify(data,null,2)+'\n',out=new URL('riemann-1854-source.json',dir);
if(process.argv.includes('--check')){if(fs.readFileSync(out,'utf8')!==output)throw Error('Riemann source import is stale');}else fs.writeFileSync(out,output);
console.log(`Riemann 1854: ${passages.length} consecutive source passages; ${body.length} source characters; complete synopsis retained.`);
