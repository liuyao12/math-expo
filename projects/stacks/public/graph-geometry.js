export const nodeCornerRadius=4;
export const sectionBoxPadding=14;

// Clip the edge to each box. The SVG marker already places its tip at the end.
export function edgeEndpoints(from,to){
 // A section connects at its dependency level, along the side of its frame.
 const anchor=(node,other)=>node.portY===undefined?node:{
  x:node.x+(other.x<node.x?-1:1)*node.width/2,y:node.portY
 };
 const start=anchor(from,to),end=anchor(to,from);
 const dx=end.x-start.x,dy=end.y-start.y;
 if(!dx&&!dy)return {x1:start.x,y1:start.y,x2:end.x,y2:end.y};
 const length=Math.hypot(dx,dy),ux=dx/length,uy=dy/length;
 const ax=Math.abs(ux),ay=Math.abs(uy);
 const boundary=node=>{
  const halfWidth=node.width/2,halfHeight=node.height/2;
  const distance=Math.min(halfWidth/ax,halfHeight/ay);
  const radius=nodeCornerRadius,cx=halfWidth-radius,cy=halfHeight-radius;
  if(ax*distance<=cx||ay*distance<=cy)return distance;
  // The straight sides end here, so intersect the corner's circular arc.
  const perpendicular=ax*cy-ay*cx;
  return ax*cx+ay*cy+Math.sqrt(Math.max(0,radius**2-perpendicular**2));
 };
 const fromOffset=from.portY===undefined?boundary(from):0,toOffset=to.portY===undefined?boundary(to):0;
 return {x1:start.x+ux*fromOffset,y1:start.y+uy*fromOffset,x2:end.x-ux*toOffset,y2:end.y-uy*toOffset};
}
