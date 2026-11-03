// A one-form is drawn by its level sets; only its metric representative is an arrow.
(() => {
  'use strict';
  const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
  const add=(a,b)=>a.map((x,i)=>x+b[i]);
  const scale=(a,k)=>a.map(x=>k*x);
  const extent=.68;
  const startAngle=Math.atan(Math.sqrt(2));
  function state(angle){
    const c=Math.cos(angle),s=Math.sin(angle),h=Math.SQRT1_2;
    const p=[c,s*h,s*h],q=[-s,c*h,c*h],r=[0,-h,h];
    const gradient=[1-c*c,-c*s*h,-c*s*h];
    const normal=scale(p,c);
    const tangent=scale(add(q,r),.5);
    return {p,q,r,gradient,normal,tangent,value:tangent[0]};
  }
  function levelVectors(angle,value){
    const {q,r}=state(angle);
    if(Math.abs(q[0])<1e-10)return value===0?{wholePlane:true}:null;
    const a=value/q[0];
    if(Math.abs(a)>extent)return null;
    return {wholePlane:false,vectors:[add(scale(q,a),scale(r,-extent)),add(scale(q,a),scale(r,extent))]};
  }
  const formulas={
    point:'p',
    negative:'-\\frac12',
    zero:'0',
    positive:'\\frac12',
    ambient:'e_x=[1,0,0]',
    representative:'(\\mathrm dx_p)^\\sharp',
    test:'v',
    coordinate:'\\mathrm dx_p:v\\longmapsto v_x',
    projection:'(\\mathrm dx_p)^\\sharp=e_x-(p.x)p.',
    pairing:'v.\\mathrm dx_p=\\langle v,(\\mathrm dx_p)^\\sharp\\rangle.'
  };
  const pointFormula=p=>'p=['+p.map(number).join(',')+']';
  const valueFormula=value=>'v.\\mathrm dx_p='+number(value);
  function number(x){return Math.abs(x)<.005?'0':x.toFixed(2);}
  window.SPHERE_TANGENT={state,levelVectors,extent,startAngle,formulas,pointFormula,valueFormula};

  window.mountSphereTangentDemo=(holder,{math})=>{
    holder.innerHTML='<figure class="figure sphere-tangent-example">'+
      '<h3>A coordinate on a moving tangent plane.</h3>'+
      '<p class="sphere-intro">The point moves on the unit sphere. Read a tangent vector’s first ambient component with <span data-formula="coordinate"></span>.</p>'+
      '<div class="sphere-tangent-stage">'+
      '<canvas width="880" height="800" role="img" aria-label="A moving sphere point and its tangent plane. Level lines on the plane depict a scalar coordinate, not an arrow. An orange ambient direction projects to a blue tangent vector. A purple tangent vector has a changing coordinate value shown below."></canvas>'+
      '<span class="sphere-point-label" data-formula="point" aria-hidden="true"></span>'+
      '<span class="sphere-level-label" data-level="-0.5" data-formula="negative" aria-hidden="true"></span>'+
      '<span class="sphere-level-label" data-level="0" data-formula="zero" aria-hidden="true"></span>'+
      '<span class="sphere-level-label" data-level="0.5" data-formula="positive" aria-hidden="true"></span></div>'+
      '<div class="sphere-legend"><span class="sphere-ambient" data-formula="ambient"></span><span class="sphere-representative" data-formula="representative"></span><span class="sphere-test" data-formula="test"></span></div>'+
      '<p class="sphere-level-caption">The level lines label the tangent vectors by their coordinate value. The plane is drawn at the moving point; an arrow from that point depicts a tangent vector.</p>'+
      '<div class="sphere-coordinate-readout"><span class="sphere-readout-label">POINT AND TANGENT COORDINATE</span><div data-live="point"></div><div data-live="value"></div></div>'+
      '<div class="sphere-projection-formula" data-formula="projection"></div>'+
      '<div class="sphere-pairing-formula" data-formula="pairing"></div>'+
      '<div class="figure-controls"><button type="button" class="sphere-play"></button></div>'+
      '<figcaption class="figure-caption">The blue arrow represents the coordinate through the inner product. The coordinate itself is a scalar-valued function of tangent vectors. The globe is shown transparently so the tangent plane remains visible on the far side. At either pole of the first coordinate axis, the projection is zero: every tangent vector has first component zero.</figcaption></figure>';
    const root=holder.querySelector('.sphere-tangent-example');
    root.querySelectorAll('[data-formula]').forEach(node=>math(node,formulas[node.dataset.formula]));
    const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');
    ctx.scale(2,2);
    const button=root.querySelector('.sphere-play'),pointLabel=root.querySelector('.sphere-point-label');
    const levelLabels=[...root.querySelectorAll('[data-level]')];
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const camera=[4/Math.sqrt(29),-3/Math.sqrt(29),2/Math.sqrt(29)];
    const horizontal=[.6,.8,0],vertical=[-8/(5*Math.sqrt(29)),6/(5*Math.sqrt(29)),25/(5*Math.sqrt(29))];
    const project=p=>[207+120*dot(p,horizontal),205-120*dot(p,vertical)];
    const colors={ink:'#3b5942',grid:'#9eaf95',plane:'#dfe7d7',ambient:'#b46c32',gradient:'#347ba5',test:'#8a5f94'};
    let angle=startAngle,phase=0,raf=0,last=0,lastMath=-Infinity,visible=false,disposed=false,playing=!reduced.matches;
    // Begin at the diagonal point used in the accompanying worked example.
    let low=0,high=Math.PI;
    for(let i=0;i<50;i++){const mid=(low+high)/2;if(mid-.28*Math.sin(2*mid)<startAngle)low=mid;else high=mid;}
    phase=(low+high)/2;
    function path(points,fill,stroke,width=1,dash=[]){
      ctx.beginPath();
      points.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
      if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
      if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
    }
    function arrow(from,to,color,width=2){
      const a=project(from),b=project(to),dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
      if(length<.4)return;
      path([from,to],null,color,width);
      if(length<3)return;
      const ux=dx/length,uy=dy/length,size=Math.min(7,length*.4);
      ctx.beginPath();ctx.moveTo(...b);
      ctx.lineTo(b[0]-size*ux+size*.4*uy,b[1]-size*uy-size*.4*ux);
      ctx.lineTo(b[0]-size*ux-size*.4*uy,b[1]-size*uy+size*.4*ux);
      ctx.closePath();ctx.fillStyle=color;ctx.fill();
    }
    function position(node,p,dx=0,dy=0){
      const [x,y]=project(p);node.style.left=(100*(x+dx)/440)+'%';node.style.top=(100*(y+dy)/400)+'%';
    }
    function draw(timestamp=0,forceMath=false){
      const model=state(angle),{p,q,r,gradient,normal,tangent,value}=model;
      root.dataset.angle=String(angle);root.dataset.coordinate=String(value);
      ctx.clearRect(0,0,440,400);
      const globe=ctx.createRadialGradient(168,164,16,207,205,127);
      globe.addColorStop(0,'#f7f9f2');globe.addColorStop(1,'#dce6d3');
      ctx.beginPath();ctx.arc(207,205,120,0,Math.PI*2);ctx.fillStyle=globe;ctx.fill();ctx.strokeStyle='#b0c2a3';ctx.lineWidth=1;ctx.stroke();
      for(let axis=0;axis<3;axis++){
        for(let j=0;j<100;j++){
          const a=[0,0,0],b=[0,0,0];
          a[(axis+1)%3]=Math.cos(j*2*Math.PI/100);a[(axis+2)%3]=Math.sin(j*2*Math.PI/100);
          b[(axis+1)%3]=Math.cos((j+1)*2*Math.PI/100);b[(axis+2)%3]=Math.sin((j+1)*2*Math.PI/100);
          path([a,b],null,dot(a,camera)<0?'#ccd7c3':'#b5c5a9',.7);
        }
      }
      const onPlane=(u,v)=>add(p,add(scale(q,u),scale(r,v)));
      // Color the patch by the one-form value of the displacement, not by height.
      for(let i=0;i<32;i++){
        const a=-extent+2*extent*i/32,b=-extent+2*extent*(i+1)/32;
        const coordinate=(a+b)/2*q[0],opacity=.10+.26*Math.abs(coordinate);
        const fill=Math.abs(coordinate)<.025?'rgba(222,230,214,.72)':coordinate>0?'rgba(75,135,174,'+opacity+')':'rgba(190,130,77,'+opacity+')';
        path([onPlane(a,-extent),onPlane(b,-extent),onPlane(b,extent),onPlane(a,extent)],fill);
      }
      path([onPlane(-extent,-extent),onPlane(extent,-extent),onPlane(extent,extent),onPlane(-extent,extent),onPlane(-extent,-extent)],null,'#8fa781',1.15);
      for(const c of [-.5,-.25,0,.25,.5]){
        const level=levelVectors(angle,c);
        if(level&&!level.wholePlane)path(level.vectors.map(v=>add(p,v)),null,c===0?'#839b79':'#a6b59c',c===0?1.2:.8);
      }
      levelLabels.forEach(node=>{
        const level=levelVectors(angle,Number(node.dataset.level));
        node.hidden=!level;
        if(level)position(node,level.wholePlane?p:add(p,level.vectors[1]),0,-7);
      });
      path([[0,0,0],scale(p,1.33)],null,'#8fa180',1,[4,4]);
      const ambientEnd=add(p,[1,0,0]),projectionEnd=add(p,gradient);
      path([projectionEnd,ambientEnd],null,colors.ambient,1,[4,3]);
      // Never draw the covector as an arrow. This is its metric representative.
      arrow(p,ambientEnd,colors.ambient,2.1);
      arrow(p,projectionEnd,colors.gradient,2.8);
      arrow(p,add(p,tangent),colors.test,1.9);
      const [px,py]=project(p);ctx.beginPath();ctx.arc(px,py,3.8,0,Math.PI*2);ctx.fillStyle=colors.ink;ctx.fill();
      position(pointLabel,p,-10,-14);
      if(!document.documentElement.classList.contains('notation-moving')&&(forceMath||timestamp-lastMath>180)){
        math(root.querySelector('[data-live="point"]'),pointFormula(p));
        math(root.querySelector('[data-live="value"]'),valueFormula(value));
        lastMath=timestamp;
      }
    }
    function active(){return playing&&visible&&!document.hidden&&!disposed;}
    function frame(timestamp){
      raf=0;
      if(!active()){last=0;return;}
      if(last)phase+=(timestamp-last)*2*Math.PI/22000;
      last=timestamp;angle=phase-.28*Math.sin(2*phase);draw(timestamp);
      raf=requestAnimationFrame(frame);
    }
    function schedule(){
      button.textContent=playing?'Pause animation':'Play animation';
      button.setAttribute('aria-pressed',String(playing));
      root.dataset.playing=String(playing);
      if(active()&&!raf){last=0;raf=requestAnimationFrame(frame);}
      else if(!active()&&raf){cancelAnimationFrame(raf);raf=0;last=0;}
    }
    function toggle(){playing=!playing;schedule();}
    function motionChange(){if(reduced.matches)playing=false;schedule();}
    function settled(){draw(performance.now(),true);}
    button.addEventListener('click',toggle);
    reduced.addEventListener('change',motionChange);
    document.addEventListener('visibilitychange',schedule);
    document.addEventListener('matrixconventionsettled',settled);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{rootMargin:'80px'});
    observer.observe(canvas);
    draw(0,true);schedule();
    return ()=>{
      disposed=true;cancelAnimationFrame(raf);observer.disconnect();
      reduced.removeEventListener('change',motionChange);
      document.removeEventListener('visibilitychange',schedule);
      document.removeEventListener('matrixconventionsettled',settled);
      button.removeEventListener('click',toggle);
    };
  };
})();
