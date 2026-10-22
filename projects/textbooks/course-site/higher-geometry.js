(() => {
  'use strict';
  const distanceSquared=(a,b)=>a.reduce((sum,x,i)=>sum+(x-b[i])**2,0);
  const cube=Array.from({length:16},(_,i)=>Array.from({length:4},(_,j)=>(i>>j)&1?1:-1));
  const cross=Array.from({length:8},(_,i)=>Array.from({length:4},(_,j)=>j===Math.floor(i/2)?(i%2?1:-1):0));
  const cell24=[];
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)for(const a of [-1,1])for(const b of [-1,1]){
    const v=[0,0,0,0];v[i]=a;v[j]=b;cell24.push(v);
  }
  const models={
    cube:{name:'Tesseract',vertices:cube,cells:8,cellShape:'cubes',edgeSquared:4},
    cross:{name:'16-cell',vertices:cross,cells:16,cellShape:'tetrahedra',edgeSquared:2},
    cell24:{name:'24-cell',vertices:cell24,cells:24,cellShape:'octahedra',edgeSquared:2}
  };
  for(const model of Object.values(models)){
    model.edges=[];
    model.vertices.forEach((a,i)=>model.vertices.forEach((b,j)=>{
      if(i<j&&distanceSquared(a,b)===model.edgeSquared)model.edges.push([i,j]);
    }));
  }
  function ballVolume(n){return n===0?1:n===1?2:2*Math.PI/n*ballVolume(n-2);}
  window.HIGHER_GEOMETRY={models,ballVolume,distanceSquared};
  const NS='http://www.w3.org/2000/svg';
  function svgElement(tag,attrs,parent){
    const node=document.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);
    parent.appendChild(node);return node;
  }
  window.mountHigherGeometry=(holder,name,{math})=>{
    if(name==='polytopes'){
      holder.innerHTML='<span class="margin-label">A FIRST LOOK INTO FOUR DIMENSIONS</span><div class="figure polytope-figure"><h3>Regularity survives the shadow.</h3><p class="figure-sub">A projected edge graph, not a solid in three dimensions.</p><svg class="polytope-svg" viewBox="0 0 320 270" role="img" aria-label="A projection of a four-dimensional regular polytope"></svg><div class="figure-controls polytope-choices"><button type="button" data-solid="cube">Tesseract</button><button type="button" data-solid="cross">16-cell</button><button type="button" data-solid="cell24" aria-pressed="true">24-cell</button></div><label class="range-control">Rotate in a coordinate plane involving the fourth direction<input class="polytope-angle" type="range" min="0" max="180" value="27"></label><div class="math-readout polytope-count"></div><div class="polytope-cells"></div><p class="figure-caption">The original edges stay equal. Their projected lengths and crossings change. The green edge tracks the same pair of vertices as you turn the object.</p></div>';
      const root=holder.querySelector('.figure'),svg=root.querySelector('svg'),input=root.querySelector('input');
      let selected='cell24';
      function draw(){
        const model=models[selected],a=Number(input.value)*Math.PI/180,b=.31;
        const c=Math.cos(a),s=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);
        const points=model.vertices.map(v=>{
          const x=c*v[0]-s*v[3],w=s*v[0]+c*v[3],y=cb*v[1]-sb*v[2],z=sb*v[1]+cb*v[2];
          return [160+73*(x+z)/Math.sqrt(2),135-73*(y+w)/Math.sqrt(2)];
        });
        svg.replaceChildren();
        model.edges.forEach(([i,j],edge)=>svgElement('line',{x1:points[i][0],y1:points[i][1],x2:points[j][0],y2:points[j][1],stroke:edge===0?'#285746':'#7393ac','stroke-opacity':edge===0?1:.46,'stroke-width':edge===0?3:1},svg));
        points.forEach((p,i)=>svgElement('circle',{cx:p[0],cy:p[1],r:i<2?2.5:1.7,fill:'#425c49'},svg));
        math(root.querySelector('.polytope-count'),'V='+model.vertices.length+',\\qquad E='+model.edges.length);
        root.querySelector('.polytope-cells').textContent=model.cells+' cells · '+model.cellShape;
        input.setAttribute('aria-valuetext',input.value+' degrees');
        root.querySelectorAll('[data-solid]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.solid===selected)));
      }
      root.querySelectorAll('[data-solid]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.solid;draw();}));
      input.addEventListener('input',draw);draw();
    }else if(name==='ball-cube'){
      holder.innerHTML='<span class="margin-label">KEEP THE SLICE. CHANGE THE DIMENSION.</span><div class="figure ball-cube-figure"><h3>Touching every facet.</h3><p class="figure-sub">A fixed central two-dimensional slice; a changing volume fraction.</p><svg viewBox="0 0 280 210" class="ball-cube-svg" role="img" aria-label="A unit disk inscribed in a square, showing a central coordinate-plane slice"><rect x="55" y="20" width="170" height="170" fill="#ece1d4" stroke="#b58e64"/><circle cx="140" cy="105" r="85" fill="#dce5d8" stroke="#688265"/><circle cx="140" cy="105" r="2" fill="#425c49"/><line x1="140" y1="105" x2="225" y2="105" stroke="#688265"/><line x1="140" y1="105" x2="225" y2="20" stroke="#b58e64" stroke-dasharray="4 4"/></svg><label class="range-control">Ambient dimension<input class="ball-dimension" type="range" min="2" max="30" step="1" value="3"></label><div class="math-readout ball-dimension-label"></div><div class="ball-volume-label"></div><div class="ball-volume-track" role="img"><span></span></div><div class="math-readout ball-fraction"></div><div class="math-readout ball-corner"></div><p class="figure-caption">Green is the fraction of the cube’s volume occupied by the ball. The disk above remains the same slice at every dimension; it is not a picture of the full volume.</p></div>';
      const root=holder.querySelector('.figure'),input=root.querySelector('input'),track=root.querySelector('.ball-volume-track');
      const scientific=x=>{
        if(x>=.01)return x.toFixed(2);
        const [mantissa,exponent]=x.toExponential(2).split('e');
        return mantissa+'\\times10^{'+Number(exponent)+'}';
      };
      function draw(){
        const n=Number(input.value),fraction=ballVolume(n)/2**n;
        root.dataset.dimension=n;
        math(root.querySelector('.ball-dimension-label'),'n='+n);
        root.querySelector('.ball-volume-label').textContent='Volume of ball / volume of cube';
        track.firstElementChild.style.width=(100*fraction)+'%';
        track.setAttribute('aria-label',(fraction*100).toPrecision(3)+' percent of the cube volume');
        math(root.querySelector('.ball-fraction'),scientific(100*fraction)+'\\%');
        math(root.querySelector('.ball-corner'),'\\text{corner distance}=\\sqrt{'+n+'}\\approx'+Math.sqrt(n).toFixed(2));
        input.setAttribute('aria-valuetext',String(n));
      }
      input.addEventListener('input',draw);draw();
    }
    return ()=>{};
  };
})();
