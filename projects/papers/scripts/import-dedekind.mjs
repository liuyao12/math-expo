// Restricted, loss-intolerant converter for the pinned public-domain Beman TeX.
// Unknown text commands throw. Layout commands are explicitly listed below.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const sourceURL='https://www.gutenberg.org/files/21016/21016-t/21016-t.tex';
const sourceFile=new URL('../src/sources/dedekind-beman-1901.tex',import.meta.url);
const raw=fs.readFileSync(sourceFile,'utf8');
const clean=raw.replace(/(?<!\\)%[^\n]*(?:\n|$)/g,'');
const first=clean.indexOf('\\mychap{I}{CONTINUITY AND IRRATIONAL NUMBERS}');
const second=clean.indexOf('\\mychap{II}{THE NATURE AND MEANING OF NUMBERS}');
const end=clean.indexOf('\\pagestyle{empty}',second);
if(first<0||second<0||end<0)throw Error('Missing essay boundary');
const labelNames={EISIII:'Section III',EISIV:'Section IV',EISViv:'Section V, iv',EISVI:'Section VI',Ind132:'§132',chain:'§42',psi1:'§125'};
const labels={EISIII:['dedekind-1872','d72-iii'],EISIV:['dedekind-1872','d72-iv'],EISViv:['dedekind-1872','d72-v'],EISVI:['dedekind-1872','d72-vi'],Ind132:['dedekind-1888','d88-132'],chain:['dedekind-1888','d88-42'],psi1:['dedekind-1888','d88-125']};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const modernization=[['scrutinise','examine'],['scrutinize','examine'],['hitherto','so far'],['connexion','connection'],['whence','from which'],['Whence','From which'],['viz.,','namely,'],['viz.:','namely:'],['viz.','namely'],['oftener','more often'],['therewith','with it'],['hereafter','from now on'],['therefrom','from it'],['thereof','of it'],['herein','here'],['aforesaid','previously mentioned'],['heretofore','previously'],['endeavor','try'],['endeavour','try'],['labors','work'],['labour','work']];
let edition,notes=[],footnoteCount=0,mathCount=0;
const tokens=[];
function token(html,block=false){const id=tokens.length;tokens.push({html,block});return `\uE000${id}\uE001`;}
function group(s,pos){while(/\s/.test(s[pos]??''))pos++;if(s[pos]!=='{')throw Error(`Expected group near ${s.slice(pos,pos+80)}`);let d=1,i=pos+1;for(;i<s.length;i++){if(s[i]==='\\'){i++;continue;}if(s[i]==='{')d++;if(s[i]==='}'&&!--d)return [s.slice(pos+1,i),i+1];}throw Error('Unclosed TeX group');}
function math(s,display=false){mathCount++;s=s.replaceAll('\\partof','\\subseteq').replaceAll('\\wholeof','\\supseteq').replaceAll('\\@','').replaceAll('<','\\lt ').replaceAll('>','\\gt ');s=s.replace(/\\tag\{\$([^$]+)\$\}/g,'\\qquad($1)');s=s.replace(/\\shortintertext\s*\{([^}]+)\}/g,(_,t)=>`\\text{${t.trim()}}\\\\`);return token(`${display?'\\[':'\\('}${s.trim()}${display?'\\]':'\\)'}`,display);}
function inline(s){let out='';for(let i=0;i<s.length;){let c=s[i];
 if(c==='$'){let j=i+1;while(j<s.length&&(s[j]!=='$'||s[j-1]==='\\'))j++;if(j===s.length)throw Error('Unclosed math');out+=math(s.slice(i+1,j));i=j+1;continue;}
 if(c==='{' ){const [v,j]=group(s,i);out+=inline(v);i=j;continue;}
 if(c!== '\\'){out+=esc(c);i++;continue;}
 if(s.startsWith('\\[',i)){let j=s.indexOf('\\]',i+2);if(j<0)throw Error('Unclosed display');out+=math(s.slice(i+2,j),true);i=j+2;continue;}
 const m=/^\\([A-Za-z]+|[\s\S])/.exec(s.slice(i));if(!m)throw Error('Dangling slash');const cmd=m[1];i+=m[0].length;
 if(cmd==='mbox'&&s.slice(i).trimStart().startsWith('\\qquad'))continue;
 if(['textit','emph','textbf','textsc','mbox','textgreek','rlap'].includes(cmd)){const [v,j]=group(s,i);i=j;const tag=cmd==='textbf'?'strong':cmd==='textsc'?'span':['mbox','rlap'].includes(cmd)?'span':'em';out+=`<${tag}${cmd==='textsc'?' class="small-caps"':''}>${inline(v)}</${tag}>`;continue;}
 if(cmd==='footnote'){const [v,j]=group(s,i);i=j;const n=++footnoteCount,id=`${edition}-fn-${n}`;out+=`<a class="source-footnote-ref" id="${id}-ref" href="#${id}" aria-label="Source footnote ${n}">[${n}]</a>`;notes.push({id,n,html:blocks(v)});continue;}
 if(cmd==='label'){const [v,j]=group(s,i);if(!labels[v])throw Error(`Unmapped label ${v}`);i=j;continue;}
 if(cmd==='pageref'){const [v,j]=group(s,i);i=j;const [w,a]=labels[v]??[];if(!w)throw Error(`Unknown page reference ${v}`);out+=`<a href="../${w}/#${a}">${labelNames[v]}</a>`;continue;}
 if(cmd==='par'){out+='\n\n';continue;}
 if(cmd==='begin'){const [env,j]=group(s,i);i=j;const endMark=`\\end{${env}}`,k=s.indexOf(endMark,i);if(k<0)throw Error(`Unclosed environment ${env}`);const v=s.slice(i,k);i=k+endMark.length;
  if(['align*','gather*','eqnarray*'].includes(env)){out+=math(`\\begin{${env!=='gather*'?'aligned':'gathered'}}${v}\\end{${env!=='gather*'?'aligned':'gathered'}}`,true);}
  else if(env==='tabular'){const config=/^\s*(?:\[[^\]]*\])?/.exec(v)[0];const [,after]=group(v,config.length);const items=v.slice(after).split(/\\\\/).filter(t=>t.trim());out+=token(`<div class="source-conditions">${items.map(item=>blocks(item.replaceAll('&',''))).join('')}</div>`,true);}
  else if(['center','flushright','quote','small'].includes(env)){out+=token(blocks(v),true);}
  else if(env==='itemize'){const items=v.split(/\\item(?:\[\])?\s*/).slice(1);out+=token(`<ul class="source-list">${items.map(item=>`<li>${blocks(item)}</li>`).join('')}</ul>`,true);}
  else throw Error(`Unknown environment ${env}`);continue;}
 if(cmd==='addcontentsline'){for(let n=0;n<3;n++){const [,j]=group(s,i);i=j;}continue;}
 if(cmd==='mychap'){for(let n=0;n<2;n++){const [,j]=group(s,i);i=j;}continue;}
 if(cmd==='hspace'){const [,j]=group(s,i);i=j;continue;}
 if(['smallskip','medskip','bigskip','newpage','normalsize','small','large','Large','footnotesize','scriptsize','nopagebreak','noindent','hfill','null','quad','qquad'].includes(cmd)){out+=' ';continue;}
 if(cmd==='ldots'){out+='…';continue;}
 if(cmd==='S'){out+='§';continue;}
 if(/\s/.test(cmd)||cmd===','||cmd==='\\'){out+=' ';continue;}
 if(cmd==='@'||cmd==='-'){continue;}
 if(cmd==='&'||cmd==='%'){out+=esc(cmd);continue;}
 throw Error(`Unknown text command \\${cmd} near ${s.slice(i-20,i+70)}`);
 }return out;}
function blocks(s){let rendered=inline(s).replace(/~/g,' ').replace(/``/g,'“').replace(/''/g,'”').replace(/---/g,'—').replace(/--/g,'–');
 // Modernize prose only, never LaTeX, formulas, quoted terminology, or references.
 for(const [a,b] of modernization)rendered=rendered.replace(new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?=\\W|$)`,'g'),b);
 const paragraphs=rendered.split(/\n\s*\n/).filter(s=>s.trim());let html='';
 for(let p of paragraphs){p=p.replace(/\s+/g,' ').trim();let current='';
  const flush=()=>{if(current.trim())html+=`<p>${current.trim()}</p>`;current='';};
  for(const part of p.split(/(\uE000\d+\uE001)/)){const m=/^\uE000(\d+)\uE001$/.exec(part);if(!m){current+=part;continue;}const t=tokens[+m[1]];if(t.block){flush();html+=t.html;}else current+=t.html;}
  flush();
 }return html;}
function render(s){notes=[];const startMath=mathCount,html=blocks(s);const fnotes=notes;notes=[];return {html:html+(fnotes.length?`<div class="source-footnotes" aria-label="Source footnotes">${fnotes.map(n=>`<details id="${n.id}"><summary>Source footnote ${n.n}</summary>${n.html}<a href="#${n.id}-ref">Return to text ↑</a></details>`).join('')}</div>`:''),footnotes:fnotes.length,math:mathCount-startMath};}
function essay(text,year){
 text=text.replace(/\b[Pp]ages?\s*(\\pageref\{[^}]+\})/g,'$1').replace(/(\\pageref\{[^}]+\})\s+et seq\.\\?\s+of (?:the present|this) volume\./g,'$1.').replace(/translated at (\\pageref)/g,'translated in $1');
 edition=`d${String(year).slice(2)}`;footnoteCount=0;const sections=[],rows=[];const prefix=`d${String(year).slice(2)}`;
 // Translate the human-language motto rather than silently dropping Greek.
 text=text.replace('\\textit{\\textgreek{\\as e\\ig{} \\oR{} \\asa njrwpos \\as rijmht\\ia zai}}','\\textit{the human being always arithmetizes}');
 text=text.replace(/\\begin\{center\}\s*\{\\large PREFACE TO THE (FIRST|SECOND) EDITION\.\}\s*\\end\{center\}/g,(_,which)=>`\\mysect{0}{preface-${which.toLowerCase()}}{Preface to the ${which.toLowerCase()} edition}`);
 text=text.replace(/\\begin\{center\}\s*\\large THE NATURE AND MEANING OF NUMBERS\.\s*\\end\{center\}/g,'');
 if(year===1872)text=text.replace(/\\mychap\{I\}\{[^}]+\}/,'\\mysect{0}{preface}{Preface}');
 else text=text.replace(/\\mychap\{II\}\{[^}]+\}/,'');
 const marks=[...text.matchAll(/\\mysect\{[^}]*\}\{([^}]+)\}\{([^}]+)\}/g)];
 for(let si=0;si<marks.length;si++){const mark=marks[si],roman=mark[1],id=`${prefix}-${roman.toLowerCase()}`,title=mark[2];let body=text.slice(mark.index+mark[0].length,marks[si+1]?.index??text.length);const nums=[...body.matchAll(/\\mypara\{(\d+)\.\}/g)];const ids=[];
  if(nums.length){if(body.slice(0,nums[0].index).replace(/\\label\{[^}]+\}/g,'').trim())throw Error('Unparsed text before numbered paragraph');
   for(let ri=0;ri<nums.length;ri++){const n=+nums[ri][1],rawText=body.slice(nums[ri].index+nums[ri][0].length,nums[ri+1]?.index??body.length);const r=render(rawText),rid=`${prefix}-${n}`;rows.push({id:rid,label:`§${n}`,number:n,text:r.html,sourceChars:rawText.length,footnotes:r.footnotes,math:r.math});ids.push(rid);}
  }else{
   // Keep paragraph-sized units for the unnumbered essay and prefaces. Never
   // split inside a footnote or display: scan brace, math, and environment depth.
   let start=0,depth=0,dollar=false,display=false,envDepth=0,parts=[];
   for(let i=0;i<body.length;i++){if(body[i]==='\\'){if(body.startsWith('\\[',i))display=true;if(body.startsWith('\\]',i))display=false;if(body.startsWith('\\begin{',i))envDepth++;if(body.startsWith('\\end{',i))envDepth--;i++;continue;}if(body[i]==='{')depth++;if(body[i]==='}')depth--;if(body[i]==='$')dollar=!dollar;if(!depth&&!dollar&&!display&&!envDepth&&/^\n\s*\n/.test(body.slice(i))){parts.push(body.slice(start,i));const m=/^\n\s*\n/.exec(body.slice(i));i+=m[0].length-1;start=i+1;}}
   parts.push(body.slice(start));
   for(const rawText of parts.filter(p=>p.trim())){const r=render(rawText);if(!r.html.trim())continue;const rid=`${id}-${ids.length+1}`;rows.push({id:rid,label:`${roman.startsWith('preface')?'Preface':roman} · ${ids.length+1}`,text:r.html,sourceChars:rawText.length,footnotes:r.footnotes,math:r.math});ids.push(rid);}
  }
  sections.push({id,title,range:roman.startsWith('preface')?'Author’s preface':`Section ${roman}`,rows:ids});
 }
 // Parenthesized proposition references are resolved only in prose text nodes.
 if(year===1888)for(const row of rows)row.text=row.text.split(/(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|<[^>]+>)/g).map(t=>t.startsWith('\\')||t.startsWith('<')?t:t.replace(/\((\d{1,3})\)/g,(all,n)=>+n>=1&&+n<=172?`<a class="proposition-link" href="#d88-${n}">(${n})</a>`:all)).join('');
 return {id:`dedekind-${year}`,sections,rows,footnotes:footnoteCount,math:rows.reduce((n,r)=>n+r.math,0)};
}
const essays=[essay(clean.slice(first,second),1872),essay(clean.slice(second,end),1888)];
const manifest={sourceURL,downloadSha256:'f837b8376cbbfca11690cea3bc0fac14fffecb88ae669e4f15158f096c915f44',sourceSha256:createHash('sha256').update(raw).digest('hex'),sourceEncoding:'UTF-8, converted from the download’s ISO-8859-1; CRLF normalized to LF; trailing spaces removed',translator:'Wooster Woodruff Beman',translationYear:1901,digitalEdition:'Project Gutenberg #21016 (2007)',producers:['Jonathan Ingram','Keith Edkins','Online Distributed Proofreading Team'],scope:'Both complete essays, their author prefaces, and all source footnotes; excludes the translator’s prefatory note, publisher advertisements, and index.',modernization,essays};
const dest=new URL('../src/dedekind-text.json',import.meta.url);
const json=JSON.stringify(manifest,null,2)+'\n';
if(process.argv.includes('--check')){if(fs.readFileSync(dest,'utf8')!==json)throw Error('Dedekind import is stale');}
else fs.writeFileSync(dest,json);
console.log(`Dedekind source: ${essays.map(e=>`${e.id}: ${e.sections.length} sections, ${e.rows.length} passages, ${e.footnotes} footnotes, ${e.math} formulas`).join('; ')}`);
