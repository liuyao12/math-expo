const r=String.raw;
export const examples={
  'local-functions':{
    title:'The sphere, with its local functions',
    html:r`<p>Keep the Riemann sphere \(S=\mathbb P^1(\mathbb C)\) in mind. Its structure sheaf assigns to each open set the holomorphic functions on it.</p><p>Two coordinate charts cover it:</p>\[U_0=S\setminus\{\infty\},\qquad U_\infty=S\setminus\{0\}.\]<p>The coordinates are related by \(w=1/z\). The same point has two descriptions on the overlap.</p>`,
    focus:'sphere'
  },
  'stalks':{
    title:'A germ remembers a neighbourhood',
    html:r`<p>At a finite point \(a\), the stalk \(\mathcal O_{S,a}\) consists of germs of holomorphic functions near \(a\). A germ is invertible exactly when its value at \(a\) is nonzero.</p>\[\mathfrak m_a=\{f:f(a)=0\},\qquad \mathcal O_{S,a}/\mathfrak m_a\cong\mathbb C.\]<p>The local ring records the functions close to the point; its residue field records their values at the point.</p>`,
    focus:'point'
  },
  'pullback':{
    title:'Functions travel back along a map',
    html:r`<p>A holomorphic map \(f:S\to S\) takes points forward. It takes functions backward by composition:</p>\[h\longmapsto h\circ f.\]<p>If \(h\) vanishes at \(f(a)\), then \(h\circ f\) vanishes at \(a\). This is the geometric meaning of the local homomorphism condition on stalks.</p><p>For a coordinate change, the pullback is simply substitution \(w=1/z\).</p>`,
    focus:'charts'
  },
  'isomorphisms':{
    title:'Changing coordinates preserves the germ',
    html:r`<p>On the overlap, inversion is a holomorphic isomorphism with itself as inverse.</p>\[z\longmapsto 1/z\longmapsto z.\]<p>Substitution identifies the local rings in the two coordinates. A function vanishes at our chosen point in one coordinate exactly when its expression in the other coordinate vanishes there.</p>`,
    focus:'charts'
  },
  'sheaf-maps':{
    title:'A rule specified on both charts',
    html:r`<p>Suppose a map between two sheaves on the sphere is described separately on \(U_0\) and \(U_\infty\).</p><p>To make it a single global rule, the two descriptions must agree after passing to the overlap. The lemma constructs its value on any open set by gluing the locally prescribed outputs.</p><p>For functions, the identity map expressed in the two coordinates is the simplest instance.</p>`,
    focus:'charts'
  },
  'transitions':{
    title:'The transition map is the instruction',
    html:r`<p>On the punctured coordinate planes, a function written as \(f(z)\) becomes \(f(1/w)\).</p><p>A transition map tells us how to compare two local descriptions. The cocycle condition says that changing descriptions directly or through a third chart has the same result.</p>\[\varphi_{jk}\circ\varphi_{ij}=\varphi_{ik}.\]<p>For the two standard sphere charts, the essential check is that the two inversion maps undo each other.</p>`,
    focus:'charts'
  },
  'compatible-sections':{
    title:'One section, written in two ways',
    html:r`<p>The constructive proof describes a section as a compatible pair:</p>\[\mathcal O_S(W)=\left\{(f_0,f_\infty):\ f_0(z)=f_\infty(1/z)\text{ on the overlap}\right\}.\]<p>Here the functions are defined on \(W\cap U_0\) and \(W\cap U_\infty\), respectively.</p><p>On an open set contained in a single chart, its local function determines the entire compatible pair. This explains why the glued sheaf restricts to the original one.</p>`,
    focus:'overlap'
  },
  'operations':{
    title:'The operations glue, too',
    html:r`<p>Add and multiply compatible pairs component by component:</p>\[(f_0,f_\infty)+(g_0,g_\infty)=(f_0+g_0,f_\infty+g_\infty).\]<p>Because substitution respects these operations, the resulting pair is still compatible. We obtain a sheaf of rings.</p><p>The same construction works for modules when the transition maps respect the module operations.</p>`,
    focus:'overlap'
  },
  'uniqueness':{
    title:'Local data and the global object',
    html:r`<p>Restrict a sheaf on the sphere to the two charts and remember how its restrictions are identified. Gluing this data recovers the original sheaf up to the appropriate isomorphism.</p><p>The equivalence of categories also remembers maps: compatible local maps determine a unique global map. Both objects and their morphisms can be described locally.</p>`,
    focus:'sphere'
  },
  'maps':{
    title:'Maps can be read chart by chart',
    html:r`<p>Once the sheaf has been glued, a map into or out of it is specified by its chartwise descriptions, subject to agreement on overlaps.</p><p>Keep track of the transition map when comparing the two expressions. “The same section” need not mean “the same formula”: on our sphere it means formulas related by \(w=1/z\).</p>`,
    focus:'charts'
  },
  'charts':{
    title:'Now construct the sphere itself',
    html:r`<p>Begin with two separate copies of the complex plane, with coordinates \(z\) and \(w\). Identify their punctured planes by</p>\[w=1/z.\]<p>The first chart retains its origin. The second retains its own origin, which becomes the point at infinity in the first coordinate.</p><p>The gluing data specifies the open pieces, their overlaps, and the identifications between overlaps.</p>`,
    focus:'charts'
  },
  'quotient':{
    title:'Glue points, then topology, then functions',
    html:r`<p>The proof builds the global object in three stages:</p><ol><li>Identify \(z\ne0\) with \(w=1/z\).</li><li>Give the quotient the topology detected by the two charts.</li><li>Glue the local sheaves of functions using the transition map.</li></ol><p>For complex planes with holomorphic functions, this produces the Riemann sphere as a locally ringed space. Expanding the proof shows each of these stages in the general construction.</p>`,
    focus:'sphere'
  },
  'scheme':{
    title:'The algebraic version of the two charts',
    html:r`<p>Replace the analytic charts by affine schemes:</p>\[X_0=\operatorname{Spec}\mathbb C[z],\qquad X_\infty=\operatorname{Spec}\mathbb C[w].\]<p>The overlap rings are the Laurent polynomial rings, identified by \(w\mapsto z^{-1}\). Gluing gives \(\mathbb P^1_{\mathbb C}\).</p><p>Its complex points, with their analytic topology and holomorphic structure sheaf, form our Riemann sphere. The scheme itself also has a generic point and an algebraic structure sheaf.</p>`,
    focus:'charts'
  },
  'double-origin':{
    title:'The identification changes the space',
    html:r`<p>The Stacks example uses the same kind of pieces but identifies punctured charts by \(w=z\).</p><p>The two origins remain distinct. In the complex analytic picture, every neighbourhood of one origin meets every neighbourhood of the other, so the resulting space is not Hausdorff. Algebraically, the doubled-origin line is not separated.</p><p>Compare this with \(w=1/z\), which places the two origins at opposite ends of the sphere.</p>`,
    focus:'charts'
  },
  'global-functions':{
    title:'Local coordinates, global constants',
    html:r`<p>For the algebraic projective line, a global regular function must be polynomial in both coordinates:</p>\[f(z)=g(1/z).\]<p>A positive power of \(z\) becomes a pole at \(w=0\). Thus only constants survive.</p><p>On the analytic sphere, global holomorphic functions are also constant, by compactness and the maximum modulus principle. The two arguments meet at the same phenomenon: a local coordinate need not extend to a global function.</p>`,
    focus:'sphere'
  }
};

export function exampleFor(section,block,index){
  const mapping={
    'definition-locally-ringed-space':'stalks',
    'lemma-isomorphism-locally-ringed':'isomorphisms',
    'lemma-glue-maps':'sheaf-maps',
    'lemma-glue-sheaves':'compatible-sections',
    'lemma-glue-sheaves-structures':'operations',
    'lemma-mapping-property-glue':'uniqueness',
    'lemma-glue':'quotient',
    'lemma-glue-schemes':'scheme',
    'example-affine-space-zero-doubled':'double-origin',
    'example-projective-line':'global-functions'
  };
  if(mapping[block.label])return mapping[block.label];
  if(section.slug==='local-functions')return index===0?'local-functions':'pullback';
  if(section.slug==='gluing-sheaves')return index===0?'sheaf-maps':index>6?'maps':'transitions';
  return 'charts';
}
