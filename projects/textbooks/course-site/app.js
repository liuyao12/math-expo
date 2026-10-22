(() => {
  'use strict';
  const { chapters, parts } = window.COURSE;
  const chapterElement = document.getElementById('chapter');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const colors = { ink:'#394d3c', muted:'#8a9681', grid:'#d8dfd1', blue:'#396fa2', orange:'#b36a35', green:'#3c7555', pale:'#e3e9dc' };
  const NS = 'http://www.w3.org/2000/svg';
  let observers = [];
  let cleanups = [];
  window.mathErrors = [];
  const raw = String.raw;
  const format = n => Math.abs(n) < 0.0005 ? '0' : Number(n.toFixed(3)).toString();
  function math(node, expression, display = false) {
    if (!window.katex) { node.textContent = expression; return; }
    try { window.MATRIX_NOTATION.render(node,expression,display); }
    catch(error) { window.mathErrors.push(error.message); node.textContent = expression; node.classList.add('math-error'); }
  }
  function renderMath(node) {
    if (!window.renderMathInElement) return;
    renderMathInElement(node, { delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}], throwOnError:false, preProcess:window.MATRIX_NOTATION.preProcess, trust:window.MATRIX_NOTATION.trust, errorCallback:(message,error)=>window.mathErrors.push(error?.message || message) });
  }
  function element(tag, attributes, parent) {
    const node = document.createElementNS(NS, tag);
    for (const [key,value] of Object.entries(attributes || {})) node.setAttribute(key, String(value));
    if(parent) parent.appendChild(node);
    return node;
  }
  function line(svg, points, color = colors.grid, width = 1, dash = '') {
    return element('polyline', {points:points.map(p=>p.join(',')).join(' '),fill:'none',stroke:color,'stroke-width':width,...(dash?{'stroke-dasharray':dash}:{})}, svg);
  }
  function arrow(svg, start, end, color, width=2) {
    line(svg,[start,end],color,width);
    const dx=end[0]-start[0],dy=end[1]-start[1],len=Math.hypot(dx,dy);
    if(len<2) return;
    const ux=dx/len,uy=dy/len,h=7;
    element('polygon',{points:[end,[end[0]-h*ux-h*.4*uy,end[1]-h*uy+h*.4*ux],[end[0]-h*ux+h*.4*uy,end[1]-h*uy-h*.4*ux]].map(p=>p.join(',')).join(' '),fill:color},svg);
  }
  function dot(svg,p,color,r=3){element('circle',{cx:p[0],cy:p[1],r,fill:color},svg);}
  function text(svg,p,value,anchor='start'){const node=element('text',{x:p[0],y:p[1],'text-anchor':anchor},svg);node.textContent=value;return node;}
  function mathLabel(svg,p,expression,width=46) {
    const box=element('foreignObject',{x:p[0]-width/2,y:p[1]-11,width,height:29},svg);
    const label=document.createElementNS('http://www.w3.org/1999/xhtml','div');
    label.style.cssText='font-size:12px;text-align:center;color:#465b43;'; box.appendChild(label);math(label,expression);return box;
  }
  function scene(svg,heightFactor=.8) {
    svg.replaceChildren();const w=svg.getBoundingClientRect().width || 300,h=Math.max(210,Math.min(310,w*heightFactor));
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('height',h);return {w,h};
  }
  function observe(svg,draw){const observer=new ResizeObserver(draw);observer.observe(svg);observers.push(observer);draw();}
  function range(id,label,min,max,value,step=1){return `<label class="range-control" for="${id}"><span class="range-label"><span>${label}</span><output data-value-for="${id}"></output></span><input id="${id}" type="range" min="${min}" max="${max}" value="${value}" step="${step}"></label>`;}
  function outputRange(root,input,expression){math(root.querySelector(`[data-value-for="${input.id}"]`),expression);input.setAttribute('aria-valuetext',input.value);}
  const descriptions = {
    'hat-turtle':['One outline, two projections','Fourteen fixed vertices in four dimensions.','The blue and orange edges belong to two fixed families. The outline stays fixed in four dimensions while the viewing plane changes.'],
    space:['A change of viewpoint','Two lines, one spatial relationship.','Changing the viewpoint changes their shadows. The distance between the lines does not change.'],
    'projection-composition':['Project, then project again','Follow the intermediate point.','The dotted path records the two steps. Reverse their order and compare the endpoint.'],
    reflection:['Two mirrors, one rotation','Order becomes visible.','The first image and the final image are shown together. Reverse the mirrors to reverse the rotation.'],
    'four-d':['Two independent rotations','A projected tesseract.','Each control rotates a different coordinate plane in four dimensions. The display is a two-dimensional view of a three-dimensional projection.'],
    gram:['Tilt the basis','Two unit vectors, a changing Gram matrix.','The dashed sides complete the sum of the two basis vectors. Their coordinates stay fixed while its length changes.'],
    eigenvectors:['Which directions persist?','Compare a vector with its image.','An eigenvector and its image lie on the same line through the origin.'],
    'sine-cosine':['Perpendicular functions','An integral collects signed contributions.','The product is shaded up to the selected endpoint. Over a full period, the positive and negative contributions cancel.'],
    fourier:['Build a function from modes','A periodic triangle wave.','The dashed curve is the target. Add odd cosine modes to improve its finite orthogonal approximation.'],
    eigenfunction:['A mode changes amplitude','A heat-equation example.','The original shape is dashed. Its evolving multiple retains the same spatial pattern.']
  };
  function mountDemo(holder,name) {
    if(name==='polytopes'||name==='ball-cube'){cleanups.push(window.mountHigherGeometry(holder,name,{math}));return;}
    if(name==='matrix-product'){cleanups.push(window.mountMatrixProductDemo(holder,{math}));return;}
    if(name==='projection'){
      const playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;
      holder.innerHTML=`<span class="margin-label">THE GEOMETRY IN MOTION</span><figure class="figure animation-figure"><img src="assets/orthogonal-projection${playing?'.gif':'-still.png'}" width="720" height="480" alt="A vector moving along its perpendicular residual to its nearest point on a plane."><div class="figure-controls"><button class="play-toggle" type="button" aria-pressed="${playing}">${playing?'Pause animation':'Play animation'}</button></div><figcaption class="figure-caption">The component in the plane stays fixed. The perpendicular component is removed.</figcaption></figure>`;
      let running=playing;
      holder.querySelector('button').addEventListener('click',event=>{running=!running;holder.querySelector('img').src=`assets/orthogonal-projection${running?'.gif':'-still.png'}`;event.currentTarget.textContent=running?'Pause animation':'Play animation';event.currentTarget.setAttribute('aria-pressed',String(running));});return;
    }
    const [title,sub,caption]=descriptions[name];
    holder.innerHTML=`<span class="margin-label">EXPLORE ALONGSIDE THE TEXT</span><div class="figure"><h3>${title}</h3><p class="figure-sub">${sub}</p><svg class="diagram" role="img" aria-label="${title}. ${caption}"></svg><div class="figure-controls"></div><div class="math-readout" aria-live="polite"></div><p class="figure-caption">${caption}</p></div>`;
    const root=holder.querySelector('.figure'),svg=root.querySelector('svg'),controls=root.querySelector('.figure-controls'),readout=root.querySelector('.math-readout');
    const drawMap={'hat-turtle':tileDemo,space:spaceDemo,'projection-composition':projectionDemo,reflection:reflectionDemo,'four-d':fourDemo,gram:gramDemo,eigenvectors:eigenDemo,'sine-cosine':sineDemo,fourier:fourierDemo,eigenfunction:modeDemo};
    drawMap[name](root,svg,controls,readout);
  }
  function tileDemo(root,svg,controls,readout){
    const id=`tile-angle-${document.querySelectorAll('[id^="tile-angle-"]').length}`;
    controls.innerHTML=`<button type="button" data-angle="60" aria-pressed="true">Hat</button><button type="button" data-angle="30" aria-pressed="false">Turtle</button>${range(id,'Viewing plane',30,60,60,.1)}`;
    const input=controls.querySelector('input'),model=window.HAT_TURTLE;
    const coordinates=document.createElement('div');coordinates.className='tile-coordinate';math(coordinates,'q=(1,-2,0,-1)');root.insertBefore(coordinates,readout);
    const all=Array.from({length:121},(_,i)=>model.project((30+i/4)*Math.PI/180)).flat();
    const maxX=Math.max(...all.map(v=>Math.abs(v[0]))),maxY=Math.max(...all.map(v=>Math.abs(v[1])));
    const source=document.createElement('p');source.className='tile-source';source.innerHTML='<a href="https://liuyao12.github.io/geometric-tree-search/apps/hat-turtle-projection/?view=tile" target="_blank" rel="noopener">Explore the original construction ↗</a>';root.appendChild(source);
    const draw=()=>{const {w,h}=scene(svg,.95),theta=+input.value*Math.PI/180,points=model.project(theta),scale=Math.min((w-40)/(2*maxX),(h-34)/(2*maxY)),p=v=>[w/2+scale*v[0],h/2-scale*v[1]];
      element('polygon',{points:points.map(p).map(v=>v.join(',')).join(' '),fill:colors.pale},svg);
      points.forEach((v,i)=>{line(svg,[p(v),p(points[(i+1)%points.length])],model.edgeFamily(i)==='first'?colors.blue:colors.orange,2.5);dot(svg,p(v),colors.ink,2);});
      dot(svg,p(points[10]),colors.green,4);mathLabel(svg,[p(points[10])[0]-10,p(points[10])[1]-16],'q');
      const q=model.rawProject(theta)[10];math(readout,`q\\mapsto(${format(q[0])},${format(q[1])})`);
      outputRange(root,input,`\\theta=${format(+input.value)}^{\\circ}`);
      controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.angle===+input.value)));
    };
    controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.angle;draw();}));input.addEventListener('input',draw);observe(svg,draw);
  }
  function spaceDemo(root,svg,controls,readout){
    controls.innerHTML=`<button type="button" data-mode="skew" aria-pressed="true">Skew lines</button><button type="button" data-mode="meeting" aria-pressed="false">Intersecting</button>${range('space-view','Viewpoint',-65,65,25)}`;
    const input=controls.querySelector('input');let skew=true;
    const draw=()=>{const {w,h}=scene(svg);const a=+input.value*Math.PI/180,e=28*Math.PI/180,s=Math.min(w*.27,h*.35),o=[w*.5,h*.67];
      const p=([x,y,z])=>[o[0]+s*(Math.cos(a)*x-Math.sin(a)*y),o[1]+s*(Math.sin(e)*(Math.sin(a)*x+Math.cos(a)*y)-Math.cos(e)*z)];
      element('polygon',{points:[[-1.5,-1.25,0],[1.5,-1.25,0],[1.5,1.25,0],[-1.5,1.25,0]].map(p).map(q=>q.join(',')).join(' '),fill:colors.pale},svg);
      for(const i of [-1,0,1]){line(svg,[p([i,-1.25,0]),p([i,1.25,0])]);line(svg,[p([-1.5,i,0]),p([1.5,i,0])]);}
      line(svg,[p([-1.35,0,0]),p([1.35,0,0])],colors.blue,2.5);
      line(svg,[p([0,-1.25,skew?1:0]),p([0,1.25,skew?1:0])],colors.orange,2.5);
      line(svg,[p([0,0,0]),p([0,0,skew?1:0])],colors.muted,1,'3 4');dot(svg,p([0,0,0]),colors.blue);dot(svg,p([0,0,skew?1:0]),colors.orange);
      mathLabel(svg,p([1.5,0,0]),'\\ell_1');mathLabel(svg,p([0,1.4,skew?1:0]),'\\ell_2');
      math(readout,`\\operatorname{dist}(\\ell_1,\\ell_2)=${skew?'1':'0'}`);outputRange(root,input,`${input.value}^{\\circ}`);
    };
    controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{skew=button.dataset.mode==='skew';controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));draw();}));input.addEventListener('input',draw);observe(svg,draw);
  }
  function projectionDemo(root,svg,controls,readout){
    controls.innerHTML=`<button type="button" aria-pressed="false">Reverse the order</button>${range('projection-angle','Angle between the lines',10,80,40)}`;
    let reverse=false;const input=controls.querySelector('input');
    const draw=()=>{const {w,h}=scene(svg);const theta=+input.value*Math.PI/180,s=Math.min(w*.25,h*.28),o=[w*.37,h*.79],v=[1,1.65],a=[1,0],b=[Math.cos(theta),Math.sin(theta)],first=reverse?b:a,second=reverse?a:b;
      const p=([x,y])=>[o[0]+x*s,o[1]-y*s];const project=(u,v)=>{const d=u[0]*v[0]+u[1]*v[1];return [d*u[0],d*u[1]];};const mid=project(first,v),end=project(second,mid);
      for(const u of [a,b])line(svg,[p(u.map(x=>-.6*x)),p(u.map(x=>2.1*x))],colors.grid,1.5);
      arrow(svg,p([0,0]),p(v),colors.muted,1.5);arrow(svg,p([0,0]),p(mid),colors.blue,2);arrow(svg,p([0,0]),p(end),colors.green,2.5);
      line(svg,[p(v),p(mid),p(end)],colors.orange,1,'4 4');dot(svg,p(mid),colors.blue);dot(svg,p(end),colors.green);
      mathLabel(svg,p([1.9,-.15]),'A');mathLabel(svg,p(b.map(x=>2.2*x)),'B');mathLabel(svg,[p(v)[0]+12,p(v)[1]-7],'v');
      math(readout,reverse?'P_A P_B v':'P_B P_A v');outputRange(root,input,`${input.value}^{\\circ}`);
    };
    controls.querySelector('button').addEventListener('click',event=>{reverse=!reverse;event.currentTarget.setAttribute('aria-pressed',String(reverse));draw();});input.addEventListener('input',draw);observe(svg,draw);
  }
  function reflectionDemo(root,svg,controls,readout){
    controls.innerHTML=`<button type="button" aria-pressed="false">Reverse the order</button>${range('mirror-angle','Angle between mirrors',10,70,35)}`;let reverse=false;const input=controls.querySelector('input');
    const draw=()=>{const {w,h}=scene(svg);const a=+input.value*Math.PI/180,o=[w*.5,h*.53],s=Math.min(w*.34,h*.37),p=angle=>[o[0]+s*Math.cos(angle),o[1]-s*Math.sin(angle)],initial=20*Math.PI/180,mid=reverse?2*a-initial:-initial,end=initial+(reverse?-2*a:2*a);
      for(const angle of [0,a])line(svg,[[o[0]-s*1.12*Math.cos(angle),o[1]+s*1.12*Math.sin(angle)],[o[0]+s*1.12*Math.cos(angle),o[1]-s*1.12*Math.sin(angle)]],colors.grid,1.5);
      const arc=[];for(let i=0;i<=40;i++){const t=initial+(end-initial)*i/40;arc.push([o[0]+s*.52*Math.cos(t),o[1]-s*.52*Math.sin(t)]);}line(svg,arc,colors.orange,1.5);
      arrow(svg,o,p(initial),colors.muted,1.5);arrow(svg,o,p(mid),colors.blue,1.5);arrow(svg,o,p(end),colors.green,2.5);
      mathLabel(svg,[p(initial)[0]+11,p(initial)[1]+14],'v');mathLabel(svg,[p(mid)[0]+8,p(mid)[1]+14],'v_1');mathLabel(svg,[p(end)[0],p(end)[1]-15],'v_2');dot(svg,o,colors.ink,2);
      math(readout,`\\text{Rotation: }${reverse?'-':''}${2*+input.value}^{\\circ}`);outputRange(root,input,`${input.value}^{\\circ}`);
    };controls.querySelector('button').addEventListener('click',event=>{reverse=!reverse;event.currentTarget.setAttribute('aria-pressed',String(reverse));draw();});input.addEventListener('input',draw);observe(svg,draw);
  }
  function fourDemo(root,svg,controls,readout){
    controls.innerHTML='<button type="button" data-turn="simple">One plane</button><button type="button" data-turn="double" aria-pressed="true">Two planes</button><button type="button" data-turn="equal">Equal turns</button>'+range('four-first','First rotation plane',0,180,20)+range('four-second','Second rotation plane',0,180,30);const [first,second]=controls.querySelectorAll('input');
    const draw=()=>{const {w,h}=scene(svg);const a=+first.value*Math.PI/180,b=+second.value*Math.PI/180,s=Math.min(w*.65,h*.68);
      const vertices=Array.from({length:16},(_,i)=>[0,1,2,3].map(j=>(i>>j&1)?.72:-.72));
      const transformed=vertices.map(([x,y,z,t])=>{const X=x*Math.cos(a)-y*Math.sin(a),Y=x*Math.sin(a)+y*Math.cos(a),Z=z*Math.cos(b)-t*Math.sin(b),T=z*Math.sin(b)+t*Math.cos(b),d=2.5-T;return {x:(X*.86-Y*.5)/d,y:(X*.2+Y*.35-Z*.88)/d,depth:Z/d};});
      const p=v=>[w*.5+s*v.x,h*.5+s*v.y];const edges=[];for(let i=0;i<16;i++)for(let j=0;j<4;j++){const k=i^(1<<j);if(k>i)edges.push({i,k,depth:transformed[i].depth+transformed[k].depth,bridge:j===3});}
      edges.sort((x,y)=>x.depth-y.depth).forEach(({i,k,bridge})=>line(svg,[p(transformed[i]),p(transformed[k])],bridge?colors.orange:(i&8?colors.green:colors.blue),1.5));transformed.forEach(v=>dot(svg,p(v),colors.ink,2));
      outputRange(root,first,`${first.value}^{\\circ}`);outputRange(root,second,`${second.value}^{\\circ}`);math(readout,'\\dim\\ker(R-I)='+((+first.value===0?2:0)+(+second.value===0?2:0)));
    };[first,second].forEach(input=>input.addEventListener('input',()=>{controls.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed','false'));draw();}));
    controls.querySelectorAll('[data-turn]').forEach(button=>button.addEventListener('click',()=>{const angles={simple:[45,0],double:[25,65],equal:[45,45]}[button.dataset.turn];first.value=angles[0];second.value=angles[1];controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));draw();}));observe(svg,draw);
  }
  function gramDemo(root,svg,controls,readout){
    controls.innerHTML=range('basis-angle','Angle between unit basis vectors',5,175,65);const input=controls.querySelector('input');
    const draw=()=>{const {w,h}=scene(svg);const a=+input.value*Math.PI/180,c=Math.cos(a),sine=Math.sin(a),s=Math.min(w*.27,h*.34),o=[w*.31,h*.72],p=([x,y])=>[o[0]+s*x,o[1]-s*y],u=[1,0],v=[c,sine],sum=[1+c,sine];
      element('circle',{cx:o[0],cy:o[1],r:s,fill:'none',stroke:colors.grid,'stroke-width':1},svg);
      line(svg,[p(u),p(sum),p(v)],colors.muted,1,'4 4');arrow(svg,o,p(u),colors.blue,2);arrow(svg,o,p(v),colors.orange,2);arrow(svg,o,p(sum),colors.green,2.5);dot(svg,o,colors.ink,2);
      mathLabel(svg,[p(u)[0]+7,p(u)[1]+17],'u_1');mathLabel(svg,[p(v)[0]-9,p(v)[1]-14],'u_2');mathLabel(svg,[p(sum)[0]+6,p(sum)[1]-17],'u_1+u_2',75);
      math(readout,`G=\\begin{pmatrix}1&${format(c)}\\\\${format(c)}&1\\end{pmatrix}`,true);outputRange(root,input,`${input.value}^{\\circ}`);
    };input.addEventListener('input',draw);observe(svg,draw);
  }
  function eigenDemo(root,svg,controls,readout){
    controls.innerHTML=`<button type="button" data-map="stretch" aria-pressed="true">Stretch</button><button type="button" data-map="shear" aria-pressed="false">Shear</button><button type="button" data-map="rotation" aria-pressed="false">Rotation</button>${range('eigen-angle','Initial direction',0,180,35)}`;let mode='stretch';const input=controls.querySelector('input');
    const draw=()=>{const {w,h}=scene(svg),a=+input.value*Math.PI/180,v=[Math.cos(a),Math.sin(a)],c=Math.cos(Math.PI/6),sn=Math.sin(Math.PI/6);let transformed,expression;
      if(mode==='stretch'){transformed=[1.5*v[0],.6*v[1]];expression='M=\\begin{pmatrix}1.5&0\\\\0&0.6\\end{pmatrix}';}
      else if(mode==='shear'){transformed=[v[0]+v[1],v[1]];expression='M=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}';}
      else{transformed=[c*v[0]-sn*v[1],sn*v[0]+c*v[1]];expression='M=R_{\\pi/6}';}
      const s=Math.min(w*.26,h*.32),o=[w*.5,h*.6],p=([x,y])=>[o[0]+s*x,o[1]-s*y];
      line(svg,[p([-1.65,0]),p([1.65,0])]);line(svg,[p([0,-1.05]),p([0,1.65])]);element('circle',{cx:o[0],cy:o[1],r:s,fill:'none',stroke:colors.grid,'stroke-width':1},svg);
      arrow(svg,o,p(v),colors.blue,2);arrow(svg,o,p(transformed),colors.green,2.5);mathLabel(svg,[p(v)[0]-10,p(v)[1]-10],'v');mathLabel(svg,[p(transformed)[0]+13,p(transformed)[1]-11],'Mv');math(readout,expression,true);outputRange(root,input,`${input.value}^{\\circ}`);
    };controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.map;controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));draw();}));input.addEventListener('input',draw);observe(svg,draw);
  }
  function sineDemo(root,svg,controls,readout){
    controls.innerHTML=range('integral-end','Integration endpoint',0,200,200);const input=controls.querySelector('input');
    const draw=()=>{const {w}=scene(svg,1);const h=275;svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('height',h);const left=24,right=w-17,x=t=>left+(right-left)*t/(2*Math.PI),t=+input.value*Math.PI/100,upper=71,lower=191,amp=35;
      text(svg,[left,14],'Functions');text(svg,[left,139],'Signed product');
      line(svg,[[w-143,10],[w-128,10]],colors.blue,1.8);mathLabel(svg,[w-104,10],'\\sin x',43);
      line(svg,[[w-74,10],[w-59,10]],colors.orange,1.8,'5 3');mathLabel(svg,[w-34,10],'\\cos x',43);
      for(const y of [upper,lower])line(svg,[[left,y],[right,y]],colors.grid);
      for(const [fn,color,dash] of [[Math.sin,colors.blue,''],[Math.cos,colors.orange,'5 3']]){const points=Array.from({length:161},(_,i)=>{const a=2*Math.PI*i/160;return [x(a),upper-amp*fn(a)];});line(svg,points,color,1.8,dash);}
      const sample=Array.from({length:161},(_,i)=>{const a=t*i/160;return {a,value:Math.sin(a)*Math.cos(a)};});
      for(const positive of [true,false]){const points=[[left,lower],...sample.map(({a,value})=>[x(a),lower-70*(positive?Math.max(0,value):Math.min(0,value))]),[x(t),lower]];element('polygon',{points:points.map(p=>p.join(',')).join(' '),fill:positive?colors.blue:colors.orange,'fill-opacity':.18},svg);}
      line(svg,Array.from({length:201},(_,i)=>{const a=2*Math.PI*i/200;return[x(a),lower-70*Math.sin(a)*Math.cos(a)];}),colors.ink,1.4);
      line(svg,[[x(t),30],[x(t),232]],colors.muted,1,'3 4');for(const [a,label] of [[0,'0'],[Math.PI,'\\pi'],[2*Math.PI,'2\\pi']])mathLabel(svg,[x(a),247],label);
      const end=+input.value===200?'2\\pi':+input.value===100?'\\pi':+input.value===0?'0':`${format(+input.value/100)}\\pi`;
      math(readout,`\\int_0^{${end}}\\sin x\\cos x\\,dx=${format(.5*Math.sin(t)**2)}`);outputRange(root,input,`t=${end}`);
    };input.addEventListener('input',draw);observe(svg,draw);
  }
  function fourierDemo(root,svg,controls,readout){
    controls.innerHTML=range('fourier-modes','Number of odd cosine modes',1,12,3);const input=controls.querySelector('input');
    const draw=()=>{const {w,h}=scene(svg);const left=21,right=w-16,top=28,bottom=h-35,mid=(top+bottom)/2,amp=(bottom-top)/3.7,x=t=>left+(right-left)*t/(2*Math.PI),p=(t,y)=>[x(t),mid-amp*y],count=+input.value;
      line(svg,[[left,mid],[right,mid]],colors.grid);const target=[],approx=[];for(let i=0;i<=240;i++){const t=2*Math.PI*i/240;target.push(p(t,Math.abs(t-Math.PI)-Math.PI/2));let y=0;for(let j=0;j<count;j++){const n=2*j+1;y+=4*Math.cos(n*t)/(Math.PI*n*n);}approx.push(p(t,y));}
      line(svg,target,colors.muted,1.5,'5 4');line(svg,approx,colors.blue,2);for(const [t,label] of [[0,'0'],[Math.PI,'\\pi'],[2*Math.PI,'2\\pi']])mathLabel(svg,[x(t),h-16],label);
      math(readout,`S(x)=\\frac4\\pi\\sum_{j=0}^{${count-1}}\\frac{\\cos((2j+1)x)}{(2j+1)^2}`);outputRange(root,input,String(count));
    };input.addEventListener('input',draw);observe(svg,draw);
  }
  function modeDemo(root,svg,controls,readout){
    controls.innerHTML=range('heat-time','Elapsed time',0,150,15);const input=controls.querySelector('input');
    const draw=()=>{const {w,h}=scene(svg);const left=20,right=w-16,mid=h*.48,amp=h*.3,t=+input.value/100,x=a=>left+(right-left)*a/(2*Math.PI);line(svg,[[left,mid],[right,mid]],colors.grid);
      for(const [scale,color,dash] of [[1,colors.muted,'5 4'],[Math.exp(-4*t),colors.blue,'']])line(svg,Array.from({length:201},(_,i)=>{const a=2*Math.PI*i/200;return[x(a),mid-amp*scale*Math.cos(2*a)];}),color,1.7,dash);
      for(const [a,label] of [[0,'0'],[Math.PI,'\\pi'],[2*Math.PI,'2\\pi']])mathLabel(svg,[x(a),h-13],label);math(readout,`u(x,t)=${format(Math.exp(-4*t))}\\cos 2x`);outputRange(root,input,`t=${format(t)}`);
    };input.addEventListener('input',draw);observe(svg,draw);
  }
  function buildNavigation(current) {
    document.getElementById('contents').innerHTML=`<a class="nav-overview ${current==='outline'?'active':''}" href="#outline" ${current==='outline'?'aria-current="page"':''}><span aria-hidden="true">☷</span> The course at a glance</a>`+parts.map(part=>`<div class="nav-group"><h2>PART ${part.id} · ${part.title.toUpperCase()}</h2>${chapters.filter(c=>c.part===part.id).map(c=>`<a class="chapter-link ${current===c.id?'active':''}" href="#${c.id}" ${current===c.id?'aria-current="page"':''}><span class="number">${c.number}</span><span>${c.short}</span></a>`).join('')}</div>`).join('');
  }
  function renderOutline(){
    document.getElementById('breadcrumb').textContent='CONTENTS';
    document.getElementById('reader-chapter-title').textContent='The course at a glance';
    chapterElement.innerHTML=`<header class="chapter-heading"><p class="eyebrow">THE COURSE AT A GLANCE</p><h1>Linear Algebra</h1><p class="dek">From Euclidean geometry to higher and even infinite-dimensional spaces.</p><div class="chapter-meta"><span>Ten chapter sketches</span><span>Two parts drafted</span></div></header><hr class="chapter-rule"><div class="course-map"><p class="map-intro">Begin with the Platonic solids and their four-dimensional relatives. Develop vectors, projections, rotations, and the Gram matrix; then explore lattices and a hat–turtle boundary in four dimensions. Discover the same geometry in functions and Fourier approximation.</p>${parts.map(part=>`<div class="part-heading"><span>PART ${part.id}</span><h2>${part.title}</h2></div>${chapters.filter(c=>c.part===part.id).map(c=>`<a class="map-row" href="#${c.id}"><span class="map-number">${c.number}</span><div><h3>${c.short}</h3><p>${c.concepts.join(' · ')}</p></div><span class="arrow" aria-hidden="true">↗</span></a>`).join('')}`).join('')}<div class="part-heading"><span>LATER</span><h2>Structure, fields, and symmetry</h2></div><div class="future-note"><p><strong>General vector spaces, then groups.</strong> Ask what remains when we set measurement aside; later, organize invertible transformations by composition.</p><p><strong>Finite geometries and matrix groups.</strong> Return to the same tools over finite fields: the Fano plane, error-correcting codes, and geometric motivation for the Sylow theorems. These chapters remain to be drafted.</p></div></div>`;
    document.getElementById('chapter-footer').innerHTML='<a href="#geometry"><span>BEGIN PART I</span>From Platonic solids to four dimensions →</a>';
    document.title='The course at a glance — Linear Algebra';
  }
  function renderChapter(chapter){
    document.getElementById('breadcrumb').textContent=`CHAPTER ${chapter.number}`;
    document.getElementById('reader-chapter-title').textContent=chapter.short;
    chapterElement.innerHTML=`<header class="chapter-heading"><p class="eyebrow">CHAPTER ${chapter.number}</p><h1>${chapter.title}</h1><p class="dek">${chapter.subtitle}</p><div class="chapter-meta"><span>Chapter sketch</span><span>Definitions & examples</span></div></header><hr class="chapter-rule"><p class="chapter-intro">${chapter.intro}</p>${chapter.sections.map((section,i)=>`<section class="section-grid"><div class="prose"><h2><span class="section-number">${Number(chapter.number)}.${i+1}</span>${section.title}</h2>${section.body}</div><aside class="margin" aria-label="Example for ${section.title}">${section.demo?`<div data-demo="${section.demo}"></div>`:`<span class="margin-label">IN THE MARGIN</span><p class="margin-note">${section.note || ''}</p>`}</aside></section>`).join('')}<div class="next-concepts"><h3>IDEAS TO TAKE WITH YOU</h3><div class="concept-list">${chapter.concepts.map(concept=>`<span>${concept}</span>`).join('')}</div></div>`;
    const index=chapters.indexOf(chapter),previous=chapters[index-1],next=chapters[index+1];
    document.getElementById('chapter-footer').innerHTML=`${previous?`<a href="#${previous.id}"><span>PREVIOUS CHAPTER</span>← ${previous.short}</a>`:'<a href="#outline"><span>STEP BACK</span>← The course at a glance</a>'}${next?`<a href="#${next.id}"><span>NEXT CHAPTER</span>${next.short} →</a>`:'<a href="#outline"><span>RETURN TO</span>The course at a glance →</a>'}`;
    chapterElement.querySelectorAll('[data-demo]').forEach(holder=>mountDemo(holder,holder.dataset.demo));
    renderMath(chapterElement);window.MATRIX_NOTATION.remember(chapterElement);window.MATRIX_NOTATION.applyCopy(chapterElement);document.title=`${chapter.short} — Linear Algebra`;
  }
  function navigate(){
    observers.forEach(observer=>observer.disconnect());observers=[];
    cleanups.forEach(cleanup=>cleanup());cleanups=[];
    const id=location.hash.slice(1)||'geometry',chapter=chapters.find(c=>c.id===id);
    buildNavigation(id==='outline'?'outline':chapter?.id||'geometry');
    if(id==='outline')renderOutline();else renderChapter(chapter||chapters[0]);
    window.MATRIX_NOTATION.remember(chapterElement);window.MATRIX_NOTATION.applyCopy(chapterElement);
    sidebar.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');window.scrollTo({top:0,behavior:'instant'});
  }
  menuToggle.addEventListener('click',()=>{const open=sidebar.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){sidebar.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}});
  document.addEventListener('click',event=>{if(!sidebar.contains(event.target)&&!menuToggle.contains(event.target)){sidebar.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}});
  const readerTop=document.querySelector('.reader-top');
  const updateReaderTopHeight=()=>document.documentElement.style.setProperty('--reader-top-height',readerTop.getBoundingClientRect().height+'px');
  const readerTopObserver=new ResizeObserver(updateReaderTopHeight);readerTopObserver.observe(readerTop);updateReaderTopHeight();
  window.addEventListener('hashchange',navigate);navigate();
})();
