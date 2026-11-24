// Shared by the reading-page enhancer and build-time name references.
(() => {
 const objects='hypothes(?:is|es)|conjecture|theorem|lemma|formula|equation|identit(?:y|ies)|inequality|function|integral|product|series|sum|number|constant|polynomial|surface|sphere|space|manifold|metric|geometry|group|subgroup|algebra|subalgebra|bracket|derivative|form|operator|matrix|determinant|symbol|characteristic|criterion|condition|relation|law|transform|transformation|distribution|problem|bound|estimate|algorithm|character|basis|decomposition|representation|duality|map|mapping|curvature|measure|zeta|principle|connection|diagram|root|lattice|weight|model|cycle|chain|homology|cohomology|torsion|line|postulate|theory|zero|cut|involution|normalization|current|totient|value';
 const modifiers='generalized|general|special|extended|complex|real|prime|counting|mapping|zeta|xi|eta|L|incompleteness|completeness|functional|summation|inversion|normal|reciprocity|quadratic|cubic|quartic|differential|integral|transformation|characteristic|density|analytic|mean|value|fixed|point|representation|root|theta|beta|gamma|last|little|great|fundamental|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|local|global|positive|negative|unit|finite|infinite|algebraic|topological|geometric|elliptic|hyperbolic|parabolic|existence|boundary|principal|conformal';
 const establishedModifiers=modifiers+'|addition|power|modulus|residue|coefficient|oscillation|two|sided|polyhedron|celebrated|well|known';
 const eponymAfter=new RegExp(`^(?:[’']s)?(?:\\s*[-–—]\\s*[\\p{Lu}][\\p{L}]+(?:[’']s)?)*[\\s-]+(?:(?:${establishedModifiers})[\\s-]+){0,5}(?:${objects})(?:s|es)?\\b`,'iu');
 function isPersonalUse(person,text,start,end){
  const before=text.slice(0,start).replace(/<[^>]*>/g,''),after=text.slice(end).replace(/<[^>]*>/g,'');
  if(/^\s*[-–]\s*\p{Lu}\p{L}+/u.test(after)||/\p{Lu}\p{L}+\s*[-–]\s*$/u.test(before))return false;
  if(eponymAfter.test(after))return false;
  if(['newton','euler'].includes(person.id)&&/^(?:[’']s)?\s+method\b/i.test(after))return false;
  if(person.id==='riemann'&&/^(?:[’']s)?\s+explicit\s+formula\b/i.test(after))return false;
  // A method or classification attributed to someone is not automatically
  // an established eponym. In particular, preserve historical attributions
  // such as "a theorem of Kronecker" and "Cauchy's methods".
  if(person.id==='lie'&&!/Sophus\s+$/.test(before)&&/^\s+(?:at|along|on|within|outside|between|over|under|above|below|beyond|across|near|parallel|perpendicular)\b/i.test(after))return false;
  if(person.id==='lie'&&!/Sophus\s+$/.test(before)&&/^\s+in\b(?!\s+\d{4}\b)/i.test(after))return false;
  return true;
 }
 globalThis.MathExpoNameContext={isPersonalUse};
})();
