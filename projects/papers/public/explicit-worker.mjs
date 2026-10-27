const version=new URL(self.location).searchParams.get('v')??'1';
const math=import('./explicit-math.mjs?v='+encodeURIComponent(version));
self.addEventListener('message',async({data})=>{
 try{
  const {buildCurves}=await math;
  const curves=await buildCurves(data.zeros,{onProgress:n=>self.postMessage({kind:'progress',n})});
  self.postMessage({kind:'ready',...curves},[curves.xs.buffer,curves.f.buffer,curves.pi.buffer]);
 }catch(error){self.postMessage({kind:'error',message:error.message});}
},{once:true});

