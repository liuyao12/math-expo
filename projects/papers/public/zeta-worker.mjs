const version=new URL(self.location).searchParams.get('v')??'1';
const {zeta,domainColor,pointAt}=await import('./zeta-math.mjs?v='+encodeURIComponent(version));
let current=0;
self.addEventListener('message',async({data})=>{
 const {id,width,height,view,contours}=data;current=id;const pixels=new Uint8ClampedArray(width*height*4);
 for(let y=0;y<height;y++){
  if(current!==id)return;
  for(let x=0;x<width;x++){
   const [re,im]=pointAt(x+.5,y+.5,width,height,view),v=zeta(re,im),rgb=domainColor(v.re,v.im,contours),i=4*(y*width+x);
   pixels[i]=rgb[0];pixels[i+1]=rgb[1];pixels[i+2]=rgb[2];pixels[i+3]=255;
  }
  if(y%12===0)await new Promise(resolve=>setTimeout(resolve,0));
 }
 if(current===id)self.postMessage({id,width,height,view,pixels:pixels.buffer},[pixels.buffer]);
});
