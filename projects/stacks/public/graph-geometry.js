// Clip an edge to the two rectangular nodes, leaving room for its arrowhead.
export function edgeEndpoints(from,to){
 const dx=to.x-from.x,dy=to.y-from.y;
 if(!dx&&!dy)return {x1:from.x,y1:from.y,x2:to.x,y2:to.y};
 const boundary=node=>1/Math.max(Math.abs(dx)/(node.width/2+8),Math.abs(dy)/(node.height/2+8));
 const start=boundary(from),end=boundary(to);
 return {x1:from.x+dx*start,y1:from.y+dy*start,x2:to.x-dx*end,y2:to.y-dy*end};
}
