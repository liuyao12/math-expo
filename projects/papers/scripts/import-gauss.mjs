// A restricted converter for the complete 1827/1828 paper in the 1902 edition.
// Unknown prose commands fail; no source paragraph or formula is dropped.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const sourceFile=new URL('../src/sources/gauss-morehead-hiltebeitel-1902.tex',import.meta.url);
const raw=fs.readFileSync(sourceFile,'utf8'),clean=raw.replace(/(?<!\\)%[^\n]*(?:\n|$)/g,'');
const url='https://www.gutenberg.org/files/36856/36856-pdf.pdf';
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const modern=[['formulæ','formulas'],['centre','center'],['centres','centers'],['whence','from which'],['Whence','From which'],['henceforth','from now on'],['thereof','of it'],['hitherto','so far'],['connexion','connection']];
let article=0,mathCount=0,footnotes=[],corrections=[],editorialCorrections=[];
const repairs=[{article:7,from:'(1 - t^{2} - u^{2})Z^{2}',to:'(1 + t^{2} + u^{2})Z^{2}',reason:'Unit normal has positive squared length.'},{article:8,from:'z = r \\cos\\phi',to:'x = r \\cos\\phi',reason:'The polar substitution is in the tangent plane.'},{article:11,from:'4(EG - F^{2})k',to:'4(EG - F^{2})^{2}k',reason:'The denominator is the square of the metric determinant; Article 19 and the sphere test confirm it.'},{article:20,from:'{\\partial m}{\\partial q}',to:'{\\partial m}{\\partial p}',reason:'Both occurrences differentiate in the radial variable, as in Article 19.'},{article:24,from:'-n\\cos\\psi = m·\\frac{\\dd\\phi}{\\dd r}',to:'-n\\cos\\psi = m·\\frac{\\dd\\phi}{\\dd p}',reason:'Substitution into Article 22 differentiates phi with respect to p, not r.'}];
const tokens=[];
const token=(html,block=false)=>{tokens.push({html,block});return '\uE000'+(tokens.length-1)+'\uE001';};
function group(s,pos){while(/\s/.test(s[pos]??''))pos++;if(s[pos]!=='{')throw Error('Expected group: '+s.slice(pos,pos+80));let d=1;for(let i=pos+1;i<s.length;i++){if(s[i]==='\\'){i++;continue;}if(s[i]==='{')d++;if(s[i]==='}'&&!--d)return [s.slice(pos+1,i),i+1];}throw Error('Unclosed group');}
function macros(s){let out='';for(let i=0;i<s.length;){const cmd=/^\\(Typo|Erratum|Chg|Add)\b/.exec(s.slice(i));if(!cmd){out+=s[i++];continue;}i+=cmd[0].length;const [first,j]=group(s,i);i=j;let value=first;if(cmd[1]!=='Add'){const [second,k]=group(s,i);i=k;value=second;corrections.push({article,kind:cmd[1],original:first,replacement:second});}out+=macros(value);}return out;}
function math(s,display=false){mathCount++;let marked=s.includes('\\NoteMark');s=macros(s).replaceAll('\\NoteMark','').replaceAll('\\dd','\\partial').replace(/\\(?:Sqrt|SQRT)/g,'\\sqrt').replaceAll('\\Z','\\phantom{0}').replaceAll('·','\\cdot ').replaceAll('±','\\pm ').replaceAll('°','{}^{\\circ}').replaceAll('<','\\lt ').replaceAll('>','\\gt ');
 s=s.replace(/\\PageSep\{\d+\}/g,'').replace(/\\displaybreak(?:\[\d+\])?/g,'').replace(/\\Tag\{([^}]+)\}/g,'\\qquad{$1}').replace(/\\intertext\{([^}]+)\}/g,'\\\\\\text{$1}\\\\');
 s=s.replace(/\\begin\{align\*\}/g,'\\begin{aligned}').replace(/\\end\{align\*\}/g,'\\end{aligned}').replace(/\\begin\{alignat\*\}/g,'\\begin{alignedat}').replace(/\\end\{alignat\*\}/g,'\\end{alignedat}').replace(/\\begin\{(?:gather|multline)\*\}/g,'\\begin{gathered}').replace(/\\end\{(?:gather|multline)\*\}/g,'\\end{gathered}');
 s=s.replaceAll('\\cosec','\\operatorname{cosec}');
 for(const fix of repairs.filter(f=>f.article===article)){const a=fix.from.replaceAll('·','\\cdot ').replaceAll('\\dd','\\partial'),b=fix.to.replaceAll('·','\\cdot ').replaceAll('\\dd','\\partial');if(s.includes(a)){s=s.replaceAll(a,b);editorialCorrections.push(fix);}}
 if(article===29&&s.includes('\\sigma = \\sigma^{*}\\bigl(1')&&!s.includes('\\bigr)')){s=s.trimEnd().replace(/\.$/,'\\bigr).');editorialCorrections.push({article:29,reason:'Close the parenthesis in the area comparison.'});}
 return token((display?'\\[':'\\(')+s.trim()+(display?'\\]':'\\)')+(marked?`<a class="source-footnote-ref" href="${url}#page=58" target="_blank" rel="noopener">1902 notes ↗</a>`:''),display);
}
function inline(s){s=macros(s);let out='';for(let i=0;i<s.length;){const c=s[i];if(c==='$'){let j=i+1;while(j<s.length&&(s[j]!=='$'||s[j-1]==='\\'))j++;if(j===s.length)throw Error('Unclosed inline math');out+=math(s.slice(i+1,j));i=j+1;continue;}
 if(s.startsWith('\\[',i)){const j=s.indexOf('\\]',i+2);if(j<0)throw Error('Unclosed display');out+=math(s.slice(i+2,j),true);i=j+2;continue;}
 if(c==='{'){const [v,j]=group(s,i);out+=inline(v);i=j;continue;}
 if(c!=='\\'){out+=esc(c);i++;continue;}
 const match=/^\\([A-Za-z]+|[\s\S])/.exec(s.slice(i));const cmd=match[1];i+=match[0].length;
 if(['emph','textit','textsc','rlap'].includes(cmd)){const [v,j]=group(s,i);i=j;out+=(cmd==='rlap'?inline(v):'<em>'+inline(v)+'</em>');continue;}
 if(['PageSep','Note'].includes(cmd)){const [,j]=group(s,i);i=j;continue;}
 if(cmd==='Art'||cmd==='Arts'){const [v,j]=group(s,i);i=j;out+=`<a href="#g28-${v}">Article ${v}</a>`;if(cmd==='Arts'){const [w,k]=group(s,i);i=k;out+=` and <a href="#g28-${w}">${w}</a>`;}continue;}
 if(cmd==='Par'){const [v,j]=group(s,i);i=j;out+=token('<p class="source-part-label">'+esc(v)+'</p>',true);continue;}
 if(cmd==='eg'){out+='for example';continue;}if(cmd==='ie'){out+='that is';continue;}if(cmd==='QEA'){out+='<em>Q.E.A. (a contradiction).</em>';continue;}
 if(cmd==='NoteMark'){out+=`<a class="source-footnote-ref" href="${url}#page=58" target="_blank" rel="noopener">1902 notes ↗</a>`;continue;}
 if(cmd==='setlength'){const [,j]=group(s,i);const [,k]=group(s,j);i=k;continue;}
 if(cmd==='footnote'){const [v,j]=group(s,i);i=j;const id='g28-fn-'+(footnotes.length+1);footnotes.push({id,html:blocks(v)});out+=`<a class="source-footnote-ref" href="#${id}">Source footnote</a>`;continue;}
 if(cmd==='begin'){const [env,j]=group(s,i);i=j;
  if(env==='Theorem'){if(s[i]==='[')i=s.indexOf(']',i)+1;const end=s.indexOf('\\end{Theorem}',i);out+=token('<div class="source-theorem">'+blocks(s.slice(i,end))+'</div>',true);i=end+13;continue;}
  const endMark='\\end{'+env+'}',end=s.indexOf(endMark,i);if(end<0)throw Error('Unclosed '+env);let body=s.slice(i,end);i=end+endMark.length;
  if(!['align*','alignat*','gather*','multline*'].includes(env))throw Error('Unknown environment '+env);
  // The final table uses a layout macro combining place names and math.
  body=body.replace(/\\Dotrow\{([^}]+)\}\{([^\n]+)\}/g,(_,label,value)=>`\\text{${label}}&${value}`);
  out+=math('\\begin{'+env+'}'+body+'\\end{'+env+'}',true);continue;
 }
 if(cmd==='\\'||/\s/.test(cmd)){out+=' ';continue;}if(cmd==='-'||cmd==='!')continue;
 throw Error('Unknown prose command \\'+cmd+' in Article '+article);
 }return out;}
function blocks(s){let html=inline(s).replaceAll('~',' ').replaceAll('``','“').replaceAll("''",'”').replaceAll('---','—').replaceAll('--','–');for(const [a,b] of modern)html=html.replace(new RegExp('(?<!\\p{L})'+a+'(?!\\p{L})','gu'),b);
 let result='',current='';const flush=()=>{if(current.trim())result+='<p>'+current.replace(/\s+/g,' ').trim()+'</p>';current='';};
 for(const part of html.split(/(\uE000\d+\uE001|\n\s*\n)/)){const t=/^\uE000(\d+)\uE001$/.exec(part);if(t){const value=tokens[+t[1]];if(value.block){flush();result+=value.html;}else current+=value.html;}else if(/^\n\s*\n$/.test(part))flush();else current+=part;}
 flush();return result;
}
const marks=[...clean.matchAll(/\\Article\{(\d+)\.\}/g)],rows=[];let page=3;
for(let i=0;i<marks.length;i++){article=+marks[i][1];const text=clean.slice(marks[i].index+marks[i][0].length,marks[i+1]?.index??clean.length);const startPage=page;const pageMarks=[...text.matchAll(/\\PageSep\{(\d+)\}/g)];if(pageMarks.length)page=+pageMarks.at(-1)[1];const before=mathCount;footnotes=[];let html=blocks(text);if(footnotes.length)html+='<div class="source-footnotes">'+footnotes.map(n=>`<details id="${n.id}"><summary>Source footnote</summary>${n.html}</details>`).join('')+'</div>';rows.push({id:'g28-'+article,label:'Article '+article,number:article,printPage:startPage,text:html,math:mathCount-before,sourceChars:text.length,footnotes:footnotes.length});}
if(rows.length!==29)throw Error('Must retain all 29 articles');
const data={sourceURL:'https://www.gutenberg.org/files/36856/36856-t/36856-t.tex',pinnedSourceSha256:createHash('sha256').update(raw).digest('hex'),scope:'Complete 1827/1828 paper, Articles 1–29; excludes separate abstract, 1825 fragment, translators’ appendix and bibliography. The paper’s one footnote is retained; links identify the separate 1902 notes.',translation:'James Caddall Morehead and Adam Miller Hiltebeitel, 1902',modernization:modern,sourceCorrections:corrections,editorialCorrections,rows};
const dest=new URL('../src/gauss-text.json',import.meta.url),json=JSON.stringify(data,null,2)+'\n';if(process.argv.includes('--check')){if(fs.readFileSync(dest,'utf8')!==json)throw Error('Gauss import stale');}else fs.writeFileSync(dest,json);
console.log('Imported complete Gauss paper:',rows.length,'articles,',rows.reduce((n,r)=>n+r.math,0),'formulas.');
