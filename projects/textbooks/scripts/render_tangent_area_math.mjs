// Typeset the animation's mathematical labels with the reader's own KaTeX.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const args=process.argv.slice(2);
const option=name=>args[args.indexOf(name)+1];
const modulePath=args.includes('--playwright')?option('--playwright'):'playwright';
const {chromium}=await import(modulePath.startsWith('/')?pathToFileURL(modulePath).href:modulePath);
const browser=await chromium.launch({headless:true,...(args.includes('--browser')?{executablePath:option('--browser')}:{})});
try{
  const page=await browser.newPage({viewport:{width:1500,height:900},deviceScaleFactor:2});
  const vendor=path.join(root,'course-site/vendor/katex');
  const css=fs.readFileSync(path.join(vendor,'katex.min.css'),'utf8').replace(/url\((fonts\/[^)]+)\)/g,(_,name)=>{
    const mime=name.endsWith('woff2')?'font/woff2':name.endsWith('woff')?'font/woff':'font/ttf';
    return 'url(data:'+mime+';base64,'+fs.readFileSync(path.join(vendor,name)).toString('base64')+')';
  });
  await page.setContent('<html><head></head><body></body></html>');
  await page.addStyleTag({content:css+'\nbody{margin:0;padding:12px;background:transparent;color:#f1f3f7;display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start}.label{padding:8px 10px;line-height:1.5}.katex{font-size:1em}'});
  await page.addScriptTag({path:path.join(vendor,'katex.min.js')});
  const items=[
    {key:'u',tex:'u',size:40,color:'#ffd166'},{key:'v',tex:'v',size:40,color:'#58c4dd'},
    {key:'origin',tex:'0',size:24},{key:'x',tex:'x',size:26},{key:'y',tex:'y',size:26},
    {key:'tangent',tex:'T_pS^2',size:32},{key:'eps',tex:'\\epsilon\\to0',size:32},
    {key:'coordinate_plane',tex:'\\mathbb R^2',size:30},
    {key:'omega',tex:'\\omega=\\mathrm dx_p\\wedge\\mathrm dy_p',size:32},
    {key:'pair',tex:'(u,v).\\omega',size:30},
    {key:'determinant',tex:'u_xv_y-u_yv_x',size:32},
    {key:'swap',tex:'(v,u).\\omega=-(u,v).\\omega',size:31},
    {key:'parallel',tex:'v=c u\\quad\\Longrightarrow\\quad(u,v).\\omega=0',size:29},
    {key:'oneform',tex:'\\alpha:T_pS^2\\to\\mathbb R',size:32},
    {key:'twoform',tex:'\\omega:T_pS^2\\times T_pS^2\\to\\mathbb R',size:31},
    ...['x','y','z'].flatMap(axis=>[
      {key:'form_'+axis,tex:'\\mathrm d'+axis+'_p:w\\longmapsto w_'+axis,size:33},
      {key:'u_'+axis,tex:'u.\\mathrm d'+axis+'_p',size:26,color:'#ffd166'},
      {key:'v_'+axis,tex:'v.\\mathrm d'+axis+'_p',size:26,color:'#58c4dd'},
      {key:'name_'+axis,tex:'\\mathrm d'+axis+'_p',size:28}
    ]),
    {key:'tick_plus',tex:'1',size:23},{key:'tick_zero',tex:'0',size:23},{key:'tick_minus',tex:'-1',size:23},
    ...Array.from({length:201},(_,i)=>({key:'number_'+(i-100),tex:Math.abs(i-100)<.5?'0':((i-100)/100).toFixed(2),size:29}))
  ];
  const bounds=await page.evaluate(items=>{
    items.forEach(item=>{
      const node=document.createElement('div');node.className='label';node.dataset.key=item.key;
      node.style.fontSize=item.size+'px';node.style.color=item.color||'#f1f3f7';
      node.innerHTML=katex.renderToString(item.tex,{throwOnError:true});document.body.appendChild(node);
    });
    return document.fonts.ready.then(()=>Object.fromEntries([...document.querySelectorAll('.label')].map(node=>{
      const rect=node.getBoundingClientRect();return [node.dataset.key,{x:rect.x,y:rect.y,w:rect.width,h:rect.height}];
    })));
  },items);
  const out=path.join(root,'assets');fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,'tangent-area-math.png'),fullPage:true,omitBackground:true});
  fs.writeFileSync(path.join(out,'tangent-area-math.json'),JSON.stringify({scale:2,labels:bounds},null,2)+'\n');
  console.log('Typeset '+items.length+' mathematical labels using the reader’s KaTeX.');
}finally{await browser.close();}
