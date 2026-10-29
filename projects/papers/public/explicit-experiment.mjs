// Editorial finite-term experiment. Published zeros and prime counts stay fixed.
export function createZeroExperiment(root,{tex,quartet,harmonic,onChange}){
 const $=id=>root.querySelector('#'+id),details=$('zero-experiment'),canvas=$('experiment-plot'),ctx=canvas.getContext('2d'),axes=$('experiment-axes');
 let beta=.75,gamma=20.5,max=10000,mode='harmonic',selected=100,cache=null,scale=null,queued=0;
 const fmt=n=>{if(!n)return '0';if(Math.abs(n)>=10000||Math.abs(n)<.001){const [m,e]=n.toExponential(2).split('e');return Number(m)+'\\cdot10^{'+Number(e)+'}';}return String(Number(n.toPrecision(5)));};
 function value(x,b){return mode==='harmonic'?harmonic(x,b,gamma):quartet(x,b,gamma);}
 function readout(){
  const moved=value(selected,beta),center=value(selected,.5),name=mode==='harmonic'?'H':'Q';
  tex($('experiment-readout'),'\\begin{gathered}x='+fmt(selected)+',\\quad '+name+'_{\\beta}(x)\\approx '+fmt(moved)+'\\\\'+name+'_{1/2}(x)\\approx '+fmt(center)+',\\quad\\Delta\\approx '+fmt(moved-center)+'\\end{gathered}');
 }
 function describe(){
  tex($('experiment-beta-value'),'\\beta='+beta.toFixed(2));
  tex($('experiment-positions'),'\\rho='+beta.toFixed(2)+'\\pm '+fmt(gamma)+'i,\\quad '+(1-beta).toFixed(2)+'\\pm '+fmt(gamma)+'i');
  $('experiment-meaning').textContent=mode==='harmonic'?'Both density contributions are multiplied by the same positive scale factor. The centered wave has unit amplitude; the purple envelope shows how the off-line amplitude changes with scale.':'Only the quartet’s contribution to the weighted count is plotted. This is neither the full count nor an approximation to the prime staircase.';
  tex($('experiment-formula'),mode==='harmonic'?String.raw`H_\beta(x)=-\cosh\!\bigl((\beta-\tfrac12)\log x\bigr)\cos(\gamma\log x)`:String.raw`Q_\beta(x)=-2\operatorname{Re}\!\left[\operatorname{Ei}((\beta+i\gamma)\log x)+\operatorname{Ei}((1-\beta+i\gamma)\log x)\right]`);
  details.dataset.beta=String(beta);details.dataset.gamma=String(gamma);details.dataset.view=mode;details.dataset.window=String(max);
 }
 function rebuild(){
  const points=[],u0=Math.log(2),span=Math.log(max)-u0;let high=mode==='harmonic'?Math.cosh((beta-.5)*Math.log(max)):0;
  for(let i=0;i<=1600;i++){
   const x=i===1600?max:Math.exp(u0+span*i/1600),a=value(x,beta),b=value(x,.5);points.push({x,a,b});high=Math.max(high,Math.abs(a),Math.abs(b));
  }
  const raw=high/2,power=10**Math.floor(Math.log10(raw)),step=[1,2,5,10].find(n=>n*power>=raw)*power;
  high=Math.ceil(high/step)*step;cache={points,high,step};
 }
 function draw(){
  if(!details.open)return;const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;if(!cache)rebuild();
  const w=box.width,h=box.height,dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle='#faf9f3';ctx.fillRect(0,0,w,h);
  const left=43,right=w-12,top=15,bottom=h-30,u0=Math.log(2),span=Math.log(max)-u0;
  const px=x=>left+(Math.log(x)-u0)/span*(right-left),py=y=>top+(cache.high-y)/(2*cache.high)*(bottom-top);
  scale={left,right,u0,span};axes.replaceChildren();
  function axis(latex,x,y,kind){const el=document.createElement('span');el.className='experiment-tick '+kind;el.style.left=x+'px';el.style.top=y+'px';tex(el,latex);axes.append(el);}
  ctx.strokeStyle='#d9decf';ctx.lineWidth=.6;ctx.beginPath();
  for(const y of [-cache.high,0,cache.high]){ctx.moveTo(left,py(y));ctx.lineTo(right,py(y));axis(fmt(y),left-5,py(y),'y');}ctx.stroke();
  const ticks=max===100?[2,10,100]:max===10000?[2,100,10000]:[2,100,10000,1000000];
  for(const x of ticks)axis(x>=10000?'10^{'+Math.round(Math.log10(x))+'}':String(x),px(x),bottom+12,'x');
  axis('x\\quad\\text{(log scale)}',(left+right)/2,h-3,'x');
  ctx.save();ctx.beginPath();ctx.rect(left,top,right-left,bottom-top);ctx.clip();
  if(mode==='harmonic')for(const sign of [-1,1]){ctx.beginPath();ctx.setLineDash([2,4]);ctx.strokeStyle='#bba6ca';ctx.lineWidth=.8;cache.points.forEach((p,i)=>{const x=px(p.x),y=py(sign*Math.cosh((beta-.5)*Math.log(p.x)));if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.stroke();}
  for(const [key,color,dash] of [['b','#8b9681',[3,3]],['a','#77549b',[]]]){
   ctx.beginPath();ctx.setLineDash(dash);ctx.strokeStyle=color;ctx.lineWidth=1.25;cache.points.forEach((p,i)=>{if(i)ctx.lineTo(px(p.x),py(p[key]));else ctx.moveTo(px(p.x),py(p[key]));});ctx.stroke();
  }
  ctx.setLineDash([]);ctx.strokeStyle='#a5ae99';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(px(selected),top);ctx.lineTo(px(selected),bottom);ctx.stroke();ctx.restore();
  canvas.setAttribute('aria-label',(mode==='harmonic'?'Scaled density harmonic':'Weighted count contribution')+' of a hypothetical quartet with beta '+beta+' and gamma '+gamma+', compared with four centered zeros. Logarithmic input range from 2 to '+max+'. Published zeros and prime counts are unchanged.');
  readout();
 }
 function changed(){cache=null;describe();if(details.open)onChange({beta,gamma});draw();}
 $('experiment-beta').addEventListener('input',()=>{beta=Number($('experiment-beta').value);changed();});
 $('experiment-gamma').addEventListener('input',()=>{if(!$('experiment-gamma').validity.valid)return;gamma=Number($('experiment-gamma').value);changed();});
 $('experiment-view').addEventListener('change',()=>{mode=$('experiment-view').value;changed();});
 $('experiment-window').addEventListener('change',()=>{max=Number($('experiment-window').value);selected=Math.min(selected,max);changed();});
 details.addEventListener('toggle',()=>{onChange(details.open?{beta,gamma}:null);if(details.open){describe();draw();}});
 canvas.addEventListener('pointermove',event=>{if(!scale)return;const r=canvas.getBoundingClientRect(),t=Math.max(0,Math.min(1,(event.clientX-r.left-scale.left)/(scale.right-scale.left)));selected=Math.max(2,Math.min(max,Math.exp(scale.u0+t*scale.span)));if(!queued)queued=requestAnimationFrame(()=>{queued=0;draw();});});
 canvas.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();selected=event.key==='Home'?2:event.key==='End'?max:Math.max(2,Math.min(max,selected*Math.exp((event.key==='ArrowLeft'?-.01:.01)*(Math.log(max)-Math.log(2)))));draw();});
 new ResizeObserver(draw).observe(canvas.parentElement);describe();
 return{draw,open(){details.open=true;},get isOpen(){return details.open;}};
}
