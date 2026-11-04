// Coordinate forms read vectors; their wedges read oriented parallelograms.
(() => {
  'use strict';
  const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  const add=(a,b)=>a.map((x,i)=>x+b[i]);
  const scale=(a,k)=>a.map(x=>x*k);
  const p=[1,1,1].map(x=>x/Math.sqrt(3)),q=[1,-1,0].map(x=>x/Math.sqrt(2)),r=[1,1,-2].map(x=>x/Math.sqrt(6));
  const vector=coordinates=>add(scale(q,coordinates[0]),scale(r,coordinates[1]));
  const pairs=[[0,1],[1,2],[2,0]],names=['x','y','z'];
  const wedge=(u,v,i,j)=>u[i]*v[j]-u[j]*v[i];
  function patch(w,epsilon){
    if(epsilon===0)return w.slice();
    // Stable form of (normalize(p + epsilon*w) - p)/epsilon for tangent w.
    const n=Math.sqrt(1+epsilon*epsilon*dot(w,w));
    return add(scale(w,1/n),scale(p,-epsilon*dot(w,w)/(n*(n+1))));
  }
  const readings=[
    ...names.map((name,axis)=>({degree:1,axis,tex:'\\mathrm d'+name,aria:'Read the '+name+' coordinate'})),
    ...pairs.map(([i,j])=>({degree:2,axes:[i,j],tex:'\\mathrm d'+names[i]+'\\wedge\\mathrm d'+names[j],aria:'Measure signed '+names[i]+names[j]+' projected area'}))
  ];
  function measure(u,v,reading){
    return reading.degree===1?[u[reading.axis],v[reading.axis]]:[wedge(u,v,...reading.axes)];
  }
  const formulas={
    u:'u',v:'v',origin:'0',high:'1',zero:'0',low:'-1',
    positive:'\\text{positive}',negative:'\\text{negative}',
    p:'p=\\frac1{\\sqrt3}[1,1,1]',
    plane:'T_pS^2',epsilon:'\\epsilon',
    area:'(u,v).(\\mathrm dx\\wedge\\mathrm dy)'
  };
  const valueTex=value=>Math.abs(value)<.0005?'0':value.toFixed(3);
  const evaluationTex=(reading,slot)=>reading.degree===1?(slot===0?'u':'v')+'.('+reading.tex+')':'(u,v).('+reading.tex+')';
  const rowTex=(name,v)=>name+'=['+v.map(valueTex).join(',')+']';
  window.TANGENT_AREA={p,q,r,vector,wedge,patch,readings,measure,formulas,evaluationTex,rowTex,valueTex};


  window.mountTangentAreaDemo=(holder,{math})=>{
    holder.innerHTML='<figure class="figure tangent-area-film">'+
      '<picture><source media="(prefers-reduced-motion: reduce)" srcset="assets/tangent-area-still.png">'+
      '<img src="assets/tangent-area.gif" width="720" height="720" alt="A dark mathematical animation zooms a curved surface patch into its tangent plane. Yellow and blue vectors change while red and blue thermometers read their x, y, and z components. The parallelogram projects to the xy plane. Exchanging the vectors reverses its signed area; making them parallel returns the area thermometer to zero."></picture>'+
      '<figcaption>Coordinate functions read tangent vectors. A wedge reads an ordered pair.<span class="film-wedge-formula"></span>Red is positive; blue is negative. Exchanging the inputs reverses the area reading, and parallel inputs give zero.</figcaption></figure>';
    math(holder.querySelector('.film-wedge-formula'),'(u,v).(\\mathrm dx_p\\wedge\\mathrm dy_p)=u_xv_y-u_yv_x');
    return ()=>{};
  };
})();
