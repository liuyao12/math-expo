// A zero-location map shares the explicit formula's count and published table.
export function createZeroStrip(root,{model,tex}){
 const group=root.querySelector('#explicit-zero-strip'),canvas=root.querySelector('#explicit-strip-plot'),ctx=canvas.getContext('2d'),axes=root.querySelector('#explicit-strip-axes');
 let zeros=[],count=0,axisKey='',axisNodes=[];
 function draw(){
  const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;
  const w=box.width,h=box.height,dpr=Math.min(devicePixelRatio||1,2),view=model(count,zeros);
  const width=Math.round(w*dpr),height=Math.round(h*dpr);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle='#faf9f3';ctx.fillRect(0,0,w,h);
  const left=27,right=w-6,top=19,bottom=h-35;
  const px=x=>left+(x-view.xmin)/(view.xmax-view.xmin)*(right-left),py=y=>bottom-(y-view.ymin)/(view.ymax-view.ymin)*(bottom-top);
  ctx.fillStyle='#e9eedf';ctx.fillRect(px(0),top,px(1)-px(0),bottom-top);
  ctx.strokeStyle='#d6ddce';ctx.lineWidth=.6;ctx.beginPath();
  for(const y of view.ticks){ctx.moveTo(left,py(y));ctx.lineTo(right,py(y));}ctx.stroke();
  ctx.strokeStyle='#788b6c';ctx.lineWidth=.8;ctx.beginPath();for(const x of [0,1]){ctx.moveTo(px(x),top);ctx.lineTo(px(x),bottom);}ctx.stroke();
  ctx.setLineDash([3,4]);ctx.strokeStyle='#9cae8d';ctx.beginPath();ctx.moveTo(px(.5),top);ctx.lineTo(px(.5),bottom);ctx.stroke();ctx.setLineDash([]);
  // Known but unused zeros stay hollow. Every included zero has its true height.
  for(const included of [false,true])for(const p of view.points){
   if(p.included!==included||p.latest)continue;ctx.beginPath();ctx.arc(px(p.re),py(p.im),included?1.8:2.1,0,2*Math.PI);
   if(included){ctx.fillStyle='#ac532f';ctx.fill();}else{ctx.strokeStyle='#a6afa0';ctx.lineWidth=.85;ctx.stroke();}
  }
  for(const p of view.points.filter(p=>p.latest)){
   ctx.strokeStyle='#ac532f';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(px(0),py(p.im));ctx.lineTo(px(1),py(p.im));ctx.stroke();
   ctx.beginPath();ctx.arc(px(p.re),py(p.im),3.2,0,2*Math.PI);ctx.fillStyle='#ac532f';ctx.fill();
   ctx.beginPath();ctx.arc(px(p.re),py(p.im),5.5,0,2*Math.PI);ctx.strokeStyle='#825526';ctx.lineWidth=1.1;ctx.stroke();
  }
  const key=JSON.stringify(view.ticks);
  if(key!==axisKey){
   axes.replaceChildren();axisNodes=[];axisKey=key;
   function label(latex,kind,value){const el=document.createElement('span');el.className='explicit-strip-tick '+kind;tex(el,latex);axes.append(el);axisNodes.push({el,kind,value});}
   for(const y of view.ticks)label(String(y),'y',y);
   for(const x of [0,.5,1])label(x===.5?'\\tfrac12':String(x),'x',x);
   label('\\operatorname{Im}s','imaginary-title',0);label('\\operatorname{Re}s','real-title',0);
  }
  for(const a of axisNodes){
   let x,y;if(a.kind==='y'){x=left-4;y=py(a.value);}else if(a.kind==='x'){x=px(a.value);y=bottom+12;}else if(a.kind==='imaginary-title'){x=(left+right)/2;y=7;}else{x=(left+right)/2;y=h-4;}
   a.el.style.left=x+'px';a.el.style.top=y+'px';
  }
  group.dataset.height=String(view.ymax);group.dataset.includedZeros=String(view.included);group.dataset.latestIndex=String(count);group.dataset.visibleZeros=String(view.points.length);
  canvas.setAttribute('aria-label','Published zero locations in the critical strip. '+count+' conjugate pairs, or '+view.included+' zeros, are included in the sum. Imaginary coordinates from '+(-view.ymax).toFixed(1)+' to '+view.ymax.toFixed(1)+(view.latest===null?'. No pairs selected.':'. The newest pair is ringed at plus and minus '+view.latest.toFixed(9)+'.'));
 }
 new ResizeObserver(draw).observe(canvas.parentElement);
 return{setData(data){zeros=data;axisKey='';draw();},setCount(value){if(value===count)return;count=value;draw();},draw};
}

