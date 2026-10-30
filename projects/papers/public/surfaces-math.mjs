// The two-sheet local example in §§5 and 14, followed without branch resetting.
export function squareRootLift(turns){
 if(!Number.isFinite(turns)||turns<0||turns>2)throw new RangeError('Follow between zero and two circuits.');
 const theta=2*Math.PI*turns;
 return{theta,z:[Math.cos(theta),Math.sin(theta)],w:[Math.cos(theta/2),Math.sin(theta/2)],sheet:turns===2?1:Math.floor(turns)+1};
}
