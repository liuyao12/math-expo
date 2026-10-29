const root=document.querySelector('#zeta-visual');
if(root){
 const version=new URL(import.meta.url).searchParams.get('v')??'1';
 const {zeta,domainColor,squareView,firstZerosView,clampView,zoomView,pointAt,allowedByStage,scenes,sceneAt,firstZeros}=await import('./zeta-math.mjs?v='+encodeURIComponent(version));
 const $=id=>document.getElementById(id),canvas=$('zeta-plot'),ctx=canvas.getContext('2d'),frame=canvas.parentElement,labels=$('zeta-axis-labels');
 const follow=$('zeta-follow'),selector=$('zeta-scene'),status=$('zeta-render-state');
 const {initExplicitPlot}=await import('./explicit-reader.mjs?v='+encodeURIComponent(version));
 let explicitPlot=null,readingActive=true,experimentRequested=false;
 function showExhibit(kind){
  const isExplicit=kind==='explicit';$('zeta-plane-panel').hidden=isExplicit;$('explicit-panel').hidden=!isExplicit;
  $('zeta-exhibit-title').textContent=isExplicit?'Music of the primes':'Zeta, in color';
  $('zeta-plane-tab').setAttribute('aria-pressed',String(!isExplicit));$('explicit-tab').setAttribute('aria-pressed',String(isExplicit));root.dataset.exhibit=kind;
  explicitPlot?.setActive(isExplicit&&readingActive);if(isExplicit)explicitPlot?.resize();
 }
 initExplicitPlot(root,{version}).then(plot=>{explicitPlot=plot;if(experimentRequested)plot.openExperiment();if(scene.exhibit==='explicit'){explicitPlot.setMode(scene.mode);explicitPlot.setActive(readingActive);}});
 document.addEventListener('click',event=>{
  if(!event.target.closest('[data-zero-experiment]'))return;
  event.preventDefault();experimentRequested=true;follow.checked=true;
  updateScene(scenes.find(s=>s.id==='prime-inversion'));explicitPlot?.openExperiment();
  if(location.hash!=='#density')history.pushState(null,'','#density');
  $('density').scrollIntoView({block:'start',behavior:'instant'});syncScroll();
 });
 $('zeta-plane-tab').addEventListener('click',()=>{follow.checked=false;updateScene(scene.exhibit?scenes[3]:scene,true);requestPixels();});
 $('explicit-tab').addEventListener('click',()=>{follow.checked=false;updateScene(scenes.find(s=>s.id==='prime-inversion'),true);});

 let scene=scenes[0],view={...squareView},selection=[2,0],cache=null,job=0,timer=0,worker=null,drag=null,scrollFrame=0,labelKey='',frameWidth=0,frameHeight=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const typeset=(el,latex)=>{if(window.katex)window.katex.render(latex,el,{throwOnError:false});else el.textContent=latex;};
 const texNumber=n=>{if(n===0)return '0';const a=Math.abs(n);if(a<.0001||a>=10000){const [m,e]=n.toExponential(4).split('e');return `${Number(m)}\\cdot10^{${Number(e)}}`;}return String(Number(n.toPrecision(7)));};
 const complex=(r,i)=>i===0?texNumber(r):r===0?`${texNumber(i)}i`:`${texNumber(r)}${i<0?'-':'+'}${texNumber(Math.abs(i))}i`;
 function announce(text){$('zeta-announcement').textContent=text;}
 function pointReadout(explicit=false){
  const [r,i]=selection,p=complex(r,i),el=$('zeta-readout');
  if(!allowedByStage(r,scene.id)){typeset(el,`s=${p}\\quad\\text{outside the series domain}`);if(explicit)announce('This point is outside the defining series domain. Continue to analytic continuation.');return;}
  const v=zeta(r,i);
  if(v.kind==='pole'){typeset(el,String.raw`s=1:\quad\text{simple pole}`);if(explicit)announce('At s equals one the zeta function has a simple pole.');return;}
  typeset(el,`\\begin{gathered}s=${p}\\\\\\zeta(s)\\approx ${complex(v.re,v.im)}\\end{gathered}`);
  if(explicit)announce(`At real part ${r}, imaginary part ${i}, zeta is approximately ${v.re.toPrecision(7)} plus ${v.im.toPrecision(7)} i.`);
 }
 function pixel(r,i){return[(r-view.xmin)/(view.xmax-view.xmin)*frameWidth,(view.ymax-i)/(view.ymax-view.ymin)*frameHeight];}
 function visible(r,i){return r>=view.xmin&&r<=view.xmax&&i>=view.ymin&&i<=view.ymax;}
 function ticks(min,max){const span=max-min,raw=span/5,power=10**Math.floor(Math.log10(raw)),step=[1,2,5,10].find(n=>n*power>=raw)*power;const out=[];for(let n=Math.ceil(min/step)*step;n<=max+step*1e-6;n+=step)out.push(Math.abs(n)<step/1000?0:Number(n.toPrecision(10)));return out;}
 function axisLabels(){
  const k=JSON.stringify([view,frameWidth,frameHeight]);if(k===labelKey)return;labelKey=k;labels.replaceChildren();
  const put=(n,left,top,axis)=>{const el=document.createElement('span');el.className='zeta-tick '+axis;el.style.left=left+'px';el.style.top=top+'px';typeset(el,texNumber(n));labels.append(el);};
  for(const r of ticks(view.xmin,view.xmax)){const [x]=pixel(r,0);put(r,Math.min(frameWidth-12,Math.max(12,x)),frameHeight-14,'x');}
  for(const i of ticks(view.ymin,view.ymax)){const [,y]=pixel(0,i);if(y>22&&y<frameHeight-31)put(i,5,y,'y');}
 }
 function mark(r,i,pole=false){if(!visible(r,i)||!allowedByStage(r,scene.id))return;const [x,y]=pixel(r,i);ctx.beginPath();ctx.arc(x,y,pole?5:4,0,2*Math.PI);ctx.fillStyle=pole?'#fff':'#11180f';ctx.fill();ctx.strokeStyle=pole?'#536349':'#f8f6ef';ctx.lineWidth=1.3;ctx.stroke();}
 function draw(){
  const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
  frameWidth=rect.width;frameHeight=rect.height;const ratio=Math.min(devicePixelRatio||1,1.5),w=Math.round(rect.width*ratio),h=Math.round(rect.height*ratio);
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,frameWidth,frameHeight);ctx.fillStyle='#e8ebdf';ctx.fillRect(0,0,frameWidth,frameHeight);
  if(cache){const [x,y]=pixel(cache.view.xmin,cache.view.ymax),[u,v]=pixel(cache.view.xmax,cache.view.ymin);ctx.drawImage(cache.image,x,y,u-x,v-y);}
  if(scene.id==='series'){const [boundary]=pixel(1,0);ctx.fillStyle='#e8ebdf';ctx.fillRect(0,0,Math.min(frameWidth,Math.max(0,boundary)),frameHeight);$('zeta-unrevealed').hidden=boundary<=0;$('zeta-unrevealed').style.width=Math.min(frameWidth,Math.max(0,boundary))+'px';}else $('zeta-unrevealed').hidden=true;
  ctx.lineWidth=.6;ctx.strokeStyle='rgba(248,247,240,.48)';ctx.beginPath();
  for(const r of ticks(view.xmin,view.xmax)){const [x]=pixel(r,0);ctx.moveTo(x,0);ctx.lineTo(x,frameHeight);}
  for(const i of ticks(view.ymin,view.ymax)){const [,y]=pixel(0,i);ctx.moveTo(0,y);ctx.lineTo(frameWidth,y);}ctx.stroke();
  function vertical(x,dash,color,width){if(x<view.xmin||x>view.xmax)return;const [p]=pixel(x,0);ctx.setLineDash(dash);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(p,0);ctx.lineTo(p,frameHeight);ctx.stroke();ctx.setLineDash([]);}
  if(scene.id==='series')vertical(1,[5,4],'#748367',1.2);
  if(scene.strip){vertical(0,[],'rgba(255,255,255,.8)',1);vertical(1,[],'rgba(255,255,255,.8)',1);vertical(.5,[4,4],'#f8f7ef',1.5);}
  if(scene.id!=='series'){mark(1,0,true);mark(-2,0);mark(-4,0);}
  if(scene.strip)for(const t of firstZeros){mark(.5,t);mark(.5,-t);}
  const [r,i]=selection;if(visible(r,i)&&allowedByStage(r,scene.id)){
   const [x,y]=pixel(r,i);ctx.lineWidth=1;ctx.strokeStyle='#fff';ctx.beginPath();ctx.arc(x,y,6,0,2*Math.PI);ctx.moveTo(x-9,y);ctx.lineTo(x+9,y);ctx.moveTo(x,y-9);ctx.lineTo(x,y+9);ctx.stroke();
   if(scene.reflect&&visible(1-r,-i)){const [u,v]=pixel(1-r,-i);ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(u,v);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(u,v,6,0,2*Math.PI);ctx.stroke();}
  }
  axisLabels();root.dataset.scene=scene.id;root.dataset.view=JSON.stringify(view);
 }
 async function acceptPixels(data){
  if(data.id!==job)return;const image=document.createElement('canvas');image.width=data.width;image.height=data.height;image.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(data.pixels),data.width,data.height),0,0);
  cache={image,view:data.view};root.dataset.ready='true';root.dataset.renderedView=JSON.stringify(data.view);status.textContent='Color field ready · finite numerical window';draw();
 }
 async function renderLocally(data){
  const {id,width,height,view:v}=data,pixels=new Uint8ClampedArray(width*height*4);
  for(let y=0;y<height;y++){
   if(id!==job)return;for(let x=0;x<width;x++){const [r,i]=pointAt(x+.5,y+.5,width,height,v),z=zeta(r,i),rgb=domainColor(z.re,z.im),at=4*(y*width+x);pixels[at]=rgb[0];pixels[at+1]=rgb[1];pixels[at+2]=rgb[2];pixels[at+3]=255;}
   if(y%6===0)await new Promise(resolve=>setTimeout(resolve,0));
  }acceptPixels({...data,pixels:pixels.buffer});
 }
 function requestPixels(){
  clearTimeout(timer);draw();const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
  const id=++job;root.dataset.ready='false';status.textContent='Computing colors…';
  timer=setTimeout(()=>{const scale=Math.min(1.5,devicePixelRatio||1,480/Math.max(rect.width,rect.height));const data={id,width:Math.max(80,Math.round(rect.width*scale)),height:Math.max(80,Math.round(rect.height*scale)),view:{...view},contours:true};if(worker)worker.postMessage(data);else renderLocally(data);},reduced?0:55);
 }
 try{worker=new Worker(new URL('./zeta-worker.mjs?v='+encodeURIComponent(version),import.meta.url),{type:'module'});worker.addEventListener('message',({data})=>acceptPixels(data));worker.addEventListener('error',()=>{worker.terminate();worker=null;requestPixels();},{once:true});}catch{worker=null;}
 function updateScene(next,explicit=false){
  const changed=scene.id!==next.id;if(changed&&next.exhibit==='explicit')explicitPlot?.setActive(false);scene=next;root.dataset.scene=scene.id;selector.value=scene.id;showExhibit(scene.exhibit??'plane');if(changed&&scene.exhibit==='explicit')explicitPlot?.setMode(scene.mode);$('zeta-stage-name').textContent=scene.name;window.paperNames?.enhance?.($('zeta-stage-name'));
  $('zeta-stage-formula').textContent=scene.formula;window.renderMathInElement?.($('zeta-stage-formula'),{delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false});
  $('zeta-caption').textContent=scene.id==='zeros'&&view.ymax>=firstZeros[0]?'This higher window reaches the first nontrivial zeros. The markers give their approximate locations; the color field is evaluated independently.':scene.caption;
  draw();pointReadout();if(explicit||changed)announce(scene.name+'. '+$('zeta-caption').textContent);
 }
 function syncScroll(){const trigger=innerWidth<=900?Math.min(innerHeight*.8,root.getBoundingClientRect().bottom+35):innerHeight*.33;readingActive=($('euler-product')?.getBoundingClientRect().top??Infinity)<=trigger&&($('numerical-evidence')?.getBoundingClientRect().bottom??-Infinity)>trigger;explicitPlot?.setActive(scene.exhibit==='explicit'&&readingActive);if(!follow.checked)return;const next=sceneAt(scenes.map(s=>document.getElementById(s.anchor)?.getBoundingClientRect().top??Infinity),trigger);if(next.id!==scene.id)updateScene(next);}
 addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;syncScroll();});},{passive:true});
 selector.addEventListener('change',()=>{follow.checked=false;updateScene(scenes.find(s=>s.id===selector.value),true);});follow.addEventListener('change',()=>{if(follow.checked){syncScroll();announce('Following the paper.');}else announce('Manual exploration.');});
 function setView(next){view=clampView(next);labelKey='';requestPixels();updateScene(scene);}
 $('zeta-square').addEventListener('click',()=>{selection=[2,0];$('zeta-real').value='2';$('zeta-imag').value='0';setView({...squareView});announce('Square window restored: real and imaginary parts from minus four to four.');});
 $('zeta-first-zeros').addEventListener('click',()=>{selection=[.5,firstZeros[0]];$('zeta-real').value='.5';$('zeta-imag').value=String(firstZeros[0]);follow.checked=false;updateScene(scenes[3]);setView({...firstZerosView});announce('Higher window: real part minus one to two, imaginary part ten to twenty-seven.');});
 $('zeta-zoom-in').addEventListener('click',()=>setView(zoomView(view,.7)));$('zeta-zoom-out').addEventListener('click',()=>setView(zoomView(view,1/.7)));
 $('zeta-fold').addEventListener('click',()=>{const folded=root.classList.toggle('is-folded');$('zeta-fold').setAttribute('aria-expanded',String(!folded));$('zeta-fold').textContent=folded?'Show plot':'Fold plot';if(!folded)requestPixels();});
 function inspect(r,i,explicit=false){selection=[r,i];draw();pointReadout(explicit);}
 $('zeta-inspect-form').addEventListener('submit',event=>{event.preventDefault();inspect(Number($('zeta-real').value),Number($('zeta-imag').value),true);});
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0||drag)return;const rect=canvas.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,view:{...view},width:rect.width,height:rect.height,moved:false};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{
  if(drag){const dx=(e.clientX-drag.x)/drag.width*(drag.view.xmax-drag.view.xmin),dy=(e.clientY-drag.y)/drag.height*(drag.view.ymax-drag.view.ymin);if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>3)drag.moved=true;if(drag.moved)setView({xmin:drag.view.xmin-dx,xmax:drag.view.xmax-dx,ymin:drag.view.ymin+dy,ymax:drag.view.ymax+dy});}
  else {const rect=canvas.getBoundingClientRect();inspect(...pointAt(e.clientX-rect.left,e.clientY-rect.top,rect.width,rect.height,view));}
 });
 canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved){const rect=canvas.getBoundingClientRect();inspect(...pointAt(e.clientX-rect.left,e.clientY-rect.top,rect.width,rect.height,view),true);}drag=null;});canvas.addEventListener('pointercancel',()=>{drag=null;});
 canvas.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();const rect=canvas.getBoundingClientRect(),center=pointAt(e.clientX-rect.left,e.clientY-rect.top,rect.width,rect.height,view);setView(zoomView(view,Math.exp(Math.max(-.25,Math.min(.25,e.deltaY*.006))),center));},{passive:false});
 canvas.addEventListener('dblclick',()=>setView({...squareView}));
 canvas.addEventListener('keydown',e=>{
  if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const dx=.1*(view.xmax-view.xmin),dy=.1*(view.ymax-view.ymin);if(e.key==='0')setView({...squareView});else if(['+','=','-'].includes(e.key))setView(zoomView(view,e.key==='-'?1/.7:.7));else{const x=e.key==='ArrowLeft'?-dx:e.key==='ArrowRight'?dx:0,y=e.key==='ArrowDown'?-dy:e.key==='ArrowUp'?dy:0;setView({xmin:view.xmin+x,xmax:view.xmax+x,ymin:view.ymin+y,ymax:view.ymax+y});}}else if(e.key==='Enter'){e.preventDefault();pointReadout(true);}
 });
 const key=$('zeta-key'),keyCtx=key.getContext('2d');for(let x=0;x<key.width;x++){const angle=-Math.PI+2*Math.PI*x/(key.width-1);keyCtx.fillStyle='rgb('+domainColor(Math.cos(angle),Math.sin(angle),false).join(',')+')';keyCtx.fillRect(x,0,1,key.height);}
 new ResizeObserver(entries=>{const rect=canvas.getBoundingClientRect();if(rect.width&&rect.height&&(Math.abs(rect.width-frameWidth)>.5||Math.abs(rect.height-frameHeight)>.5))requestPixels();}).observe(frame);
 addEventListener('resize',()=>{labelKey='';requestPixels();syncScroll();},{passive:true});
 document.fonts?.ready.then(()=>{draw();syncScroll();});updateScene(scene);requestPixels();syncScroll();
}
