export async function initExplicitPlot(root,{version,onManual=()=>{}}={}){
 const panel=root.querySelector('#explicit-panel');if(!panel)return null;
 const {approximation,exactCount,jumps,buildCurves,countLabel,zeroStripModel,hypotheticalQuartet,quartetHarmonic}=await import('./explicit-math.mjs?v='+encodeURIComponent(version));
 const $=id=>root.querySelector('#'+id),canvas=$('explicit-plot'),ctx=canvas.getContext('2d'),axes=$('explicit-axes'),slider=$('explicit-pairs'),status=$('explicit-status');
 let zeros=[],curves=null,n=0,mode='pi',max=30,selection=10,playing=false,lastPlay=0,animation=0,pointerFrame=0,pendingX=null,w=0,h=0,scale=null,ready=false;
 let active=false,visible=false,userPaused=false,dwellUntil=0,cycles=0;
 let commentarySuspended=false,resumeAfterCommentary=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const tex=(el,value)=>window.katex?window.katex.render(value,el,{throwOnError:false}):el.textContent=value;
 const number=x=>String(Number(x.toFixed(5)));
 const {createZeroStrip}=await import('./explicit-strip.mjs?v='+encodeURIComponent(version));
 const strip=createZeroStrip(root,{model:zeroStripModel,tex});
 const {createZeroExperiment}=await import('./explicit-experiment.mjs?v='+encodeURIComponent(version));
 const experiment=createZeroExperiment(root,{tex,quartet:hypotheticalQuartet,harmonic:quartetHarmonic,onChange(value){hold();strip.setHypothesis(value);$('explicit-hypothetical-key').hidden=!value;}});
 function motionStatus(){
  panel.dataset.motion=playing?'playing':userPaused?'paused':'idle';
  panel.dataset.cycle=String(cycles);
  if(ready)status.textContent=playing?'Looping through 200 published pairs · finite approximation':userPaused?'Paused · move the slider or press Play pairs':'200 published pairs ready · finite numerical approximation';
 }
 function stop(){playing=false;cancelAnimationFrame(animation);$('explicit-play').textContent='Play pairs';motionStatus();}
 function hold(){userPaused=true;stop();}
 function start(){
  if(playing||!ready||!active||!visible||document.hidden||userPaused||commentarySuspended)return;
  playing=true;$('explicit-play').textContent='Pause';lastPlay=0;motionStatus();animation=requestAnimationFrame(animate);
 }
 function setActive(next){
  if(commentarySuspended)return;
  if(active===next)return;active=next;
  if(!active){stop();return;}
  if(resumeAfterCommentary){resumeAfterCommentary=false;update();start();return;}
  n=0;userPaused=reduced||experiment.isOpen;dwellUntil=performance.now()+600;update();start();
  if(reduced&&ready)status.textContent='Autoplay paused for reduced motion · press Play pairs to start';
 }
 function valueAt(x){return approximation(x,n,zeros,mode);}
 function readout(){
  if(!zeros.length)return;
  const a=valueAt(selection),target=exactCount(selection,mode),symbol=mode==='pi'?'\\widehat{\\pi}':'\\widehat{f}',exactSymbol=mode==='pi'?'\\pi_0':'f';
  tex($('explicit-readout'),'\\begin{gathered}x='+number(selection)+',\\quad '+symbol+'_{'+n+'}(x)\\approx '+number(a)+'\\\\'+exactSymbol+'(x)='+number(target)+',\\quad\\text{error}\\approx '+number(a-target)+'\\end{gathered}');
 }
 function curveValue(i,count=n){return curves[mode][count*curves.samples+i];}
 function axis(latex,x,y,kind){
  const e=document.createElement('span');e.className='explicit-tick '+kind;e.style.left=x+'px';e.style.top=y+'px';tex(e,latex);axes.append(e);
 }
 function plot(){
  const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
  w=rect.width;h=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#faf9f3';ctx.fillRect(0,0,w,h);
  const left=31,right=w-10,top=17,bottom=h-28,ystep=max===30?2:5,high=(Math.ceil(exactCount(max,mode,false)/ystep)+1)*ystep;
  scale={left,right,top,bottom,high};const px=x=>left+(x-2)/(max-2)*(right-left),py=y=>bottom-y/high*(bottom-top);
  axes.replaceChildren();ctx.lineWidth=.65;ctx.strokeStyle='#d9decf';ctx.beginPath();
  for(let y=0;y<=high;y+=ystep){ctx.moveTo(left,py(y));ctx.lineTo(right,py(y));axis(String(y),left-7,py(y),'y');}ctx.stroke();
  const xticks=max===30?[2,10,20,30]:[2,25,50,75,100];
  for(const x of xticks)axis(String(x),px(x),bottom+12,'x');
  axis('x',right-1,bottom+25,'x');
  ctx.save();ctx.beginPath();ctx.rect(left,top,right-left,bottom-top);ctx.clip();
  ctx.strokeStyle='#263b2c';ctx.lineWidth=1.4;ctx.beginPath();let previous=exactCount(2-1e-8,mode,false);ctx.moveTo(px(2),py(previous));
  for(const jump of jumps(mode)){if(jump.x>max)break;ctx.lineTo(px(jump.x),py(previous));previous+=jump.weight;ctx.moveTo(px(jump.x),py(previous));}
  ctx.lineTo(px(max),py(previous));ctx.stroke();
  // Midpoint dots represent the value produced by symmetric inversion.
  for(const jump of jumps(mode)){if(jump.x>max)break;ctx.beginPath();ctx.arc(px(jump.x),py(exactCount(jump.x,mode)),2,0,2*Math.PI);ctx.fillStyle='#263b2c';ctx.fill();}
  if(curves){
   ctx.beginPath();ctx.strokeStyle='#ac532f';ctx.lineWidth=1.6;let started=false;
   for(let i=0;i<curves.samples;i++){const x=curves.xs[i];if(x>max)break;const y=curveValue(i);if(!started){ctx.moveTo(px(x),py(y));started=true;}else ctx.lineTo(px(x),py(y));}ctx.stroke();
   const a=valueAt(selection);ctx.strokeStyle='#a5ae99';ctx.lineWidth=.8;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(px(selection),top);ctx.lineTo(px(selection),bottom);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle='#ac532f';ctx.beginPath();ctx.arc(px(selection),py(a),3,0,2*Math.PI);ctx.fill();
  }
  ctx.restore();panel.dataset.pairs=String(n);panel.dataset.mode=mode;panel.dataset.window=String(max);
 }
 function update(){
  $('explicit-count-label').textContent=countLabel(n);slider.value=String(n);slider.setAttribute('aria-valuetext',countLabel(n));
  if(n)tex($('explicit-height'),'\\gamma_{'+n+'}\\approx '+zeros[n-1].toFixed(9));else $('explicit-height').textContent='No oscillatory terms';
  tex($('explicit-exact-key'),mode==='pi'?'\\pi_0(x)':'f(x)');tex($('explicit-approx-key'),(mode==='pi'?'\\widehat{\\pi}':'\\widehat{f}')+'_{'+n+'}(x)');
  $('explicit-truncation').textContent=mode==='pi'?'The loop pauses when you use the slider. Dots mark prime midpoints; finite sums can overshoot.':'The loop pauses when you use the slider. Each prime power has its fractional jump and midpoint.';
  canvas.setAttribute('aria-label',(mode==='pi'?'Prime-counting':'Weighted prime-power')+' staircase and an explicit-formula approximation using '+countLabel(n)+'. Move over the plot to inspect a point; left and right arrow keys move the selected input.');
  strip.setCount(n);$('explicit-count-title').textContent=mode==='pi'?'Prime count':'Prime powers';plot();readout();
 }
 function setMode(next,{manual=false}={}){if(!['pi','f'].includes(next))return;mode=next;$('explicit-mode').value=mode;if(manual){hold();onManual();}update();}
 function select(x){selection=Math.min(max,Math.max(2,x));$('explicit-x').value=String(Number(selection.toFixed(4)));plot();readout();}
 slider.addEventListener('input',()=>{hold();n=Number(slider.value);onManual();update();});
 $('explicit-reset').addEventListener('click',()=>{hold();n=0;onManual();update();});
 function animate(now){
  if(!playing)return;
  if(now>=dwellUntil&&now-lastPlay>(reduced?200:45)){
   if(n===zeros.length){n=0;cycles++;dwellUntil=now+600;}
   else{n=Math.min(zeros.length,n+(reduced?10:1));if(n===zeros.length)dwellUntil=now+1200;}
   lastPlay=now;update();panel.dataset.cycle=String(cycles);
  }
  animation=requestAnimationFrame(animate);
 }
 $('explicit-play').addEventListener('click',()=>{if(playing){hold();return;}userPaused=false;if(n===zeros.length)n=0;dwellUntil=0;start();});
 $('explicit-mode').addEventListener('change',()=>setMode($('explicit-mode').value,{manual:true}));
 $('explicit-range').addEventListener('change',()=>{hold();max=Number($('explicit-range').value);$('explicit-x').max=String(max);selection=Math.min(selection,max);$('explicit-x').value=String(selection);onManual();update();});
 $('explicit-inspect-form').addEventListener('submit',e=>{e.preventDefault();select(Number($('explicit-x').value));});
 canvas.addEventListener('pointermove',e=>{if(!scale)return;const rect=canvas.getBoundingClientRect();pendingX=2+(e.clientX-rect.left-scale.left)/(scale.right-scale.left)*(max-2);if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;select(Math.round(pendingX*10)/10);});});
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();select(e.key==='Home'?2:e.key==='End'?max:Math.round((selection+(e.key==='ArrowLeft'?-.1:.1))*10)/10);});
 new ResizeObserver(()=>plot()).observe(canvas.parentElement);
 // Opening another reading pane suspends this exhibit without treating its
 // return as a new scroll entry, which would reset the chosen zero count.
 window.addEventListener('paper:commentary-mode',event=>{
  if(event.detail.open){resumeAfterCommentary=active;commentarySuspended=true;active=false;stop();}
  else commentarySuspended=false;
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{threshold:0}).observe(panel);
 function progress(v){status.textContent='Preparing zero contributions · '+v+' / 200 pairs';}
 function accept(data){curves=data;ready=true;panel.dataset.ready='true';for(const id of ['explicit-pairs','explicit-play','explicit-reset'])$(id).disabled=false;update();motionStatus();start();if(reduced&&userPaused)status.textContent='Autoplay paused for reduced motion · press Play pairs to start';}
 try{
  const response=await fetch(new URL('./zeta-zeros-200.json?v='+encodeURIComponent(version),import.meta.url));if(!response.ok)throw Error('The published zero data could not load.');
  const data=await response.json();zeros=data.ordinates;strip.setData(zeros);if(zeros.length!==200)throw Error('The zero table is incomplete.');update();
  let worker;
  const fallback=()=>buildCurves(zeros,{onProgress:progress}).then(accept).catch(failed);
  function failed(error){status.textContent='The approximation could not be prepared. Reload to try again.';panel.dataset.error=error.message;}
  try{worker=new Worker(new URL('./explicit-worker.mjs?v='+encodeURIComponent(version),import.meta.url),{type:'module'});worker.addEventListener('message',({data})=>{if(data.kind==='ready'){accept(data);worker.terminate();}else if(data.kind==='progress')progress(data.n);else if(data.kind==='error'){worker.terminate();failed(Error(data.message));}});worker.addEventListener('error',()=>{worker.terminate();fallback();},{once:true});worker.postMessage({zeros});}catch{fallback();}
 }catch(error){status.textContent=error.message;panel.dataset.error=error.message;}
 return{setMode,setActive,stop,openExperiment:()=>experiment.open(),resize:()=>{plot();strip.draw();experiment.draw();},get ready(){return ready;}};
}

