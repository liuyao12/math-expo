export const nodeCornerRadius=4;

// Clip the edge to each box. The SVG marker already places its tip at the end.
export function edgeEndpoints(from,to){
 const dx=to.x-from.x,dy=to.y-from.y;
 if(!dx&&!dy)return {x1:from.x,y1:from.y,x2:to.x,y2:to.y};
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
 const start=boundary(from),end=boundary(to);
 return {x1:from.x+ux*start,y1:from.y+uy*start,x2:to.x-ux*end,y2:to.y-uy*end};
}
