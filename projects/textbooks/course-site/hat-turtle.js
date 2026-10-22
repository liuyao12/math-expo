// One fixed boundary from the coherent lift in the user's hat/turtle project.
// Integer coordinates refer to two triangular bases, not orthonormal axes.
// Source: https://liuyao12.github.io/geometric-tree-search/apps/hat-turtle-projection/
// Lift: Nan Ma and Arnaud Cherit'at. Underlying hatviz data: Craig S. Kaplan.
// See vendor/hatviz/LICENSE for the retained BSD 3-Clause license.
(() => {
  const vertices = [[0,0,0,0],[0,0,0,1],[-1,0,0,1],[-1,-1,0,1],[-1,-2,0,1],[0,-3,0,1],[0,-3,-1,1],[0,-3,-1,0],[1,-3,-1,0],[1,-2,-1,0],[1,-2,0,-1],[1,-2,1,-1],[0,-1,1,-1],[0,0,1,-1]];
  const toCartesian = ([p,q,r,s])=>[p+q/2,Math.sqrt(3)*q/2,Math.sqrt(3)*r/2,r/2+s];
  const cartesian = vertices.map(toCartesian);
  const center = [0,1,2,3].map(k=>cartesian.reduce((sum,v)=>sum+v[k],0)/vertices.length);
  const centered = cartesian.map(v=>v.map((x,k)=>x-center[k]));
  const view = (v,theta)=>[Math.cos(theta)*v[0]+Math.sin(theta)*v[2],Math.cos(theta)*v[1]+Math.sin(theta)*v[3]];
  const internal = (v,theta)=>[-Math.sin(theta)*v[0]+Math.cos(theta)*v[2],-Math.sin(theta)*v[1]+Math.cos(theta)*v[3]];
  const matrix=theta=>{const c=Math.cos(theta),s=Math.sin(theta);return [[c,0,s,0],[0,c,0,s]];};
  const sampleLattice=radius=>{
    const origin=[0,1,2,3].map(k=>Math.round(vertices.reduce((sum,v)=>sum+v[k],0)/vertices.length));
    const sample=[];
    for(let p=-radius;p<=radius;p++)for(let q=-radius;q<=radius;q++)for(let r=-radius;r<=radius;r++)for(let s=-radius;s<=radius;s++){
      const coefficients=[p,q,r,s].map((x,k)=>x+origin[k]);
      sample.push({coefficients,relative:toCartesian(coefficients).map((x,k)=>x-center[k])});
    }
    return sample;
  };
  window.HAT_TURTLE = Object.freeze({
    vertices, cartesian, centered, center, toCartesian, view, internal, matrix, sampleLattice,
    project:theta=>centered.map(v=>view(v,theta)),
    rawProject:theta=>cartesian.map(v=>view(v,theta)),
    edgeFamily:i=>{const a=vertices[i],b=vertices[(i+1)%vertices.length];return a[0]!==b[0]||a[1]!==b[1]?'first':'second';}
  });
})();
