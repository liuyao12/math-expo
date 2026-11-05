const r=String.raw;
const row=(symbol,value,note='')=>({symbol,value,note});
const sphere=row(r`X`,r`S=\mathbb P^1(\mathbb C)`);
const cover=[row(r`I`,r`\{0,\infty\}`),row(r`U_i`,r`\begin{cases}S\setminus\{\infty\}&i=0\\S\setminus\{0\}&i=\infty\end{cases}`,r`The coordinates are \(z\) on \(U_0\) and \(w=1/z\) on \(U_\infty\).`)];
const localSheaves=[row(r`\mathcal F_i`,r`\mathcal O_{U_i}`,r`Holomorphic functions on each chart, regarded as sets.`),row(r`\varphi_{ij}`,r`\text{coordinate substitution}`,r`In particular, \(\varphi_{0\infty}:s_0(z)\mapsto s_0(1/w)\). The reverse transition is its inverse.`)];
const pair=[row(r`W`,r`S\setminus\{1\}`),row(r`s_0`,r`\frac1{z-1}`),row(r`s_\infty`,r`\frac w{1-w}`)];
const entry=(title,bindings,check,result,extra={})=>({title,bindings,check,result,...extra});

export const examples={
  'local-functions':entry(r`Spaces equipped with functions`,[
    sphere,row(r`\mathcal O_X`,r`\mathcal O_S`,r`\(\mathcal O_S(V)\) is the ring of holomorphic functions on \(V\subset S\).`),
    row(r`Y`,r`S`,r`target locally ringed space`),
    row(r`\mathcal O_Y`,r`\mathcal O_S`),
    row(r`M`,r`S`,r`smooth manifold in the source’s illustration`),row(r`N`,r`S`,r`target smooth manifold in that illustration`),
    row(r`f`,r`[z\mapsto z^2]`,r`It extends over infinity, taking infinity to infinity.`),
    row(r`f^\sharp`,r`[h\mapsto h\circ f]`),
    row(r`f_*\mathcal O_X`,r`[V\mapsto\mathcal O_S(f^{-1}(V))]`)
  ],r`Composition with a holomorphic map preserves holomorphic functions and commutes with restriction.`,r`These choices give a morphism of ringed spaces.`,{note:r`In the source’s smooth-manifold paragraph, choose \(M=N=S\) as smooth manifolds. There \(\mathcal C^\infty_M\) means smooth functions; our \(\mathcal O_S\) means holomorphic functions.`}),
  'stalks':entry(r`The local ring at a chosen point`,[
    sphere,row(r`x`,r`a=1`),
    row(r`\mathcal O_{X,x}`,r`\mathcal O_{S,1}`,r`Germs of holomorphic functions near \(1\). Functions have the same germ if they agree on some neighbourhood of \(1\).`),
    row(r`\mathfrak m_x`,r`\{h:h(1)=0\}`),row(r`\kappa(x)`,r`\mathbb C`,r`The quotient map is evaluation at \(1\).`),
    row(r`f`,r`[z\mapsto z^2]`)
  ],r`A germ is invertible exactly when its value is nonzero. If \(h(1)=0\), then \(h(z^2)\) vanishes at \(z=1\).`,r`Pullback on stalks sends the target maximal ideal into the source maximal ideal, as the definition requires.`),
  'pullback':entry(r`Composition in this case`,[
    row(r`X`,r`S`),row(r`Y`,r`S`),row(r`Z`,r`S`),
    row(r`f`,r`[z\mapsto z^2]`),row(r`g`,r`[t\mapsto t^3]`),row(r`g\circ f`,r`[z\mapsto z^6]`),
    row(r`x`,r`a`),row(r`\mathcal O_{Z,g(f(x))}`,r`\mathcal O_{S,a^6}`)
  ],r`A germ \(h\) near \(a^6\) first pulls back to \(h(t^3)\) near \(a^2\), then to \(h(z^6)\) near \(a\).`,r`The two pullbacks compose in the direction displayed in the main text.`),
  'isomorphisms':entry(r`An actual isomorphism`,[
    row(r`X`,r`S`),row(r`Y`,r`S`),row(r`f`,r`[z\mapsto1/z]`,r`For this lemma use inversion; it exchanges zero and infinity and is its own inverse.`),row(r`f^\sharp`,r`[h\mapsto h(1/z)]`)
  ],r`The pullback is an invertible ring map on the corresponding local rings. Such a map preserves the unique maximal ideal.`,r`The ringed-space isomorphism is also an isomorphism of locally ringed spaces.`,{proof:r`A germ vanishes at \(f(a)\) exactly when its pullback vanishes at \(a\). This verifies the local-ring observation used by the source proof.`}),
  'sheaf-maps':entry(r`Glue one rule on two charts`,[
    sphere,...cover,row(r`\mathcal F`,r`\mathcal O_S`,r`sheaf of sets`),row(r`\mathcal G`,r`\mathcal O_S`,r`sheaf of sets`),row(r`\varphi_i`,r`[s\mapsto s^2]`,r`Square a holomorphic function. These are sheaves of sets, so additivity is not a hypothesis.`),row(r`\varphi`,r`[s\mapsto s^2]`)
  ],r`Squaring commutes with restriction. On an overlap both local rules give the same squared function.`,r`The unique global map is \(\varphi:s\mapsto s^2\).`,{
    proofBindings:[row(r`U`,r`V\subset S`),row(r`s`,r`h\in\mathcal O_S(V)`),row(r`\varphi_U(s)`,r`h^2`)],
    proof:r`The local outputs \((h|_{V\cap U_i})^2\) agree on overlaps and glue uniquely to \(h^2\). The later restriction check is \((h^2)|_T=(h|_T)^2\).`
  }),
  'transitions':entry(r`The gluing data for local functions`,[
    sphere,...cover,...localSheaves
  ],r`Set \(\varphi_{ii}=\mathrm{id}\). With two charts the cocycle identities follow from the fact that the two inversion substitutions are inverse to one another.`,r`These are the gluing data required by the next lemma.`,{note:r`In this section \(X=S\) is already given. We construct a sheaf on it. Substitution is the coordinate expression of identifying functions on the same overlap.`}),
  'compatible-sections':entry(r`Apply the section formula`,[
    sphere,...localSheaves,...pair,row(r`\mathcal F`,r`\mathcal O_S`),row(r`\varphi_i`,r`[(s_0,s_\infty)\mapsto s_i]`)
  ],r`Substitution gives \(1/(1/w-1)=w/(1-w)\). Each expression is holomorphic on its specified open set.`,r`The pair gives one section on \(W=S\setminus\{1\}\), holomorphic at infinity with value zero there.`,{
    proofBindings:pair,proof:r`In the first proof, the section is the compatible pair \((1/(z-1),w/(1-w))\). Restrict each component to restrict the section. On an open set lying in one chart, that component determines the other by the transition map.`
  }),
  'operations':entry(r`Retain the ring and module structures`,[
    sphere,row(r`\mathcal O`,r`\mathcal O_S`),row(r`\mathcal F_i`,r`\mathcal O_{U_i}`,r`sheaf of rings and modules`),row(r`\varphi_{ij}`,r`\text{coordinate substitution}`),row(r`\mathcal F(W)`,r`\{(s_0,s_\infty):s_0(z)=s_\infty(1/z)\}`)
  ],r`Substitution respects sums, products, and multiplication by scalar functions. Adding or multiplying compatible pairs again gives a compatible pair.`,r`The glued sheaf has its ring structure and its \(\mathcal O_S\)-module structure.`,{proof:r`The parallel maps give the two descriptions on the overlap. Their equalizer selects the pairs for which these descriptions agree. Because both maps preserve the operations, the equalizer is closed under the operations.`}),
  'uniqueness':entry(r`Our object in the equivalence`,[
    sphere,row(r`\operatorname{Sh}(X)`,r`\operatorname{Sh}(S)`),row(r`\mathcal F`,r`\mathcal O_S`),row(r`\mathcal F|_{U_i}`,r`\mathcal O_{U_i}`),row(r`\varphi_{ij}`,r`\text{canonical overlap identification}`)
  ],r`Restrict the holomorphic-function sheaf to the two charts, retaining the overlap identifications, then apply the gluing construction.`,r`This round trip recovers \(\mathcal O_S\) up to canonical isomorphism. The lemma asserts the same for every sheaf, and also identifies compatible local maps with global maps.`,{proof:r`The local squaring maps illustrate full faithfulness: exactly one global map has those restrictions. The compatible-pair construction illustrates essential surjectivity: the specified local function sheaves come from a global sheaf.`}),
  'maps':entry(r`The two mapping properties`,[
    sphere,row(r`\mathcal F_i`,r`\mathcal O_{U_i}`),row(r`\mathcal G`,r`\mathcal O_S`),row(r`f_i`,r`[s_i\mapsto s_i^2]`),row(r`f`,r`[s\mapsto s^2]`),row(r`g_i`,r`\mathrm{id}_{\mathcal O_{U_i}}`),row(r`g`,r`\mathrm{id}_{\mathcal O_S}`)
  ],r`Both families of local maps commute with the overlap identifications.`,r`They specify the global squaring map and the global identity map, respectively.`),
  'charts':entry(r`Assign the gluing data`,[

    row(r`I`,r`\{1,2\}`),
    row(r`X_i`,r`\begin{cases}\mathbb C_z&i=1\\\mathbb C_w&i=2\end{cases}`,r`separate locally ringed spaces`),
    row(r`\mathcal O_i`,r`\mathcal O_{X_i}`),
    row(r`U_{ij}`,r`\begin{cases}X_i&i=j\\X_i\setminus\{0\}&i\ne j\end{cases}`),
    row(r`\varphi_{ij}`,r`\begin{cases}\mathrm{id}&i=j\\z\mapsto1/z&(i,j)=(1,2)\\w\mapsto1/w&(i,j)=(2,1)\end{cases}`)
  ],r`Set \(U_{11}=X_1\), \(U_{22}=X_2\), and use identity self-transitions. Inversion is an isomorphism of punctured planes and the two composites are identities.`,r`The separate chart spaces and overlap maps satisfy the gluing hypotheses.`,{note:r`Here \(X_i\) is a separate chart space. In the next lemma \(U_i\) is its image in the constructed global space.`}),
  'quotient':entry(r`Identify the constructed objects`,[

    row(r`X`,r`S=\mathbb P^1(\mathbb C)`),
    row(r`X_i`,r`\begin{cases}\mathbb C_z&i=1\\\mathbb C_w&i=2\end{cases}`),
    row(r`U_i`,r`\begin{cases}S\setminus\{\infty\}&i=1\\S\setminus\{0\}&i=2\end{cases}`),
    row(r`\varphi_i`,r`\begin{cases}z\mapsto[z:1]&i=1\\w\mapsto[1:w]&i=2\end{cases}`),
    row(r`\varphi_{ij}`,r`\text{the overlap identification}`,r`inversion for distinct charts; identity otherwise`),
    row(r`\mathcal O_X`,r`\mathcal O_S`),
    row(r`Y`,r`S`),
    row(r`f_i`,r`\begin{cases}z\mapsto[z^2:1]&i=1\\w\mapsto[1:w^2]&i=2\end{cases}`),
    row(r`f`,r`[[u:v]\mapsto[u^2:v^2]]`),
    row(r`g`,r`\mathrm{id}_S`),
    row(r`V_i`,r`U_i`,r`the inverse-image cover for this choice of \(g\)`),
    row(r`g_i`,r`\varphi_i^{-1}`)
  ],r`On the overlap, \([z^2:1]=[1:w^2]\) because \(w=1/z\).`,r`The maps glue to \([u:v]\mapsto[u^2:v^2]\). This is the first displayed mapping property in this case. For the second, choose \(g=\mathrm{id}_S\): its cover is \(V_i=U_i\) and its local maps are \(g_i=\varphi_i^{-1}\).`,{
    proofBindings:[row(r`x`,r`2\in X_1`),row(r`x'`,r`1/2\in X_2`),row(r`\varphi_{i,*}\mathcal O_i`,r`\mathcal O_{U_i}`)],
    proof:r`The quotient identifies \(2\in\mathbb C_z\) with \(1/2\in\mathbb C_w\), while retaining the two chart origins as distinct points. The topology makes the chart inclusions open embeddings. The sheaf step uses the same substitution as the preceding sheaf construction. The source leaves the mapping-property verification to the reader.`
  }),
  'scheme':entry(r`The scheme specialization`,[

    row(r`X_i`,r`\begin{cases}\operatorname{Spec}\mathbb C[z]&i=1\\\operatorname{Spec}\mathbb C[w]&i=2\end{cases}`),
    row(r`U_i`,r`\varphi_i(X_i)`),
    row(r`U_{12}`,r`D(z)`,r`Coordinate ring \(\mathbb C[z,z^{-1}]\).`),
    row(r`U_{21}`,r`D(w)`,r`Coordinate ring \(\mathbb C[w,w^{-1}]\).`),
    row(r`\varphi_{12}^\sharp`,r`[w\mapsto z^{-1}]`),
    row(r`X`,r`\mathbb P^1_{\mathbb C}`),
    row(r`\mathcal O_X`,r`\mathcal O_{\mathbb P^1_{\mathbb C}}`)
  ],r`Both pieces are affine schemes, as this lemma requires; the overlap maps are scheme isomorphisms.`,r`The glued locally ringed space is a scheme. Its analytification is our Riemann sphere.`,{note:r`For this statement use the algebraic projective line with regular functions. The analytic planes with holomorphic functions instantiate the preceding locally ringed-space lemma.`,proof:r`The two chart images give an affine open cover of the result. Every point has an affine neighbourhood, which is the step used by the source proof.`}),
  'double-origin':entry(r`The comparison example`,[
    row(r`k`,r`\mathbb C`),row(r`n`,r`1`),row(r`X_1`,r`\operatorname{Spec}\mathbb C[z]`),row(r`X_2`,r`\operatorname{Spec}\mathbb C[w]`),row(r`\varphi_{12}`,r`[z\mapsto z]`),row(r`X`,r`\text{the doubled-origin line}`),row(r`f`,r`[z\mapsto z,\ w\mapsto w]`,r`map to \(\operatorname{Spec}\mathbb C[t]\)`)
  ],r`Identity gluing agrees on the punctured lines while retaining both origins.`,r`The two origins have the same image under \(f\). This is the source’s doubled-origin example.`,{note:r`This example changes the transition map. Here \(X\) is the doubled-origin line; the sphere construction uses inversion.`}),
  'global-functions':entry(r`The projective-line example`,[
    row(r`k`,r`\mathbb C`),row(r`x`,r`z`),row(r`y`,r`w`),row(r`\mathbf P^1_k`,r`\mathbb P^1_{\mathbb C}`),row(r`g(x)`,r`g(z)`),row(r`g(1/y)`,r`g(1/w)`),row(r`U`,r`\mathbb P^1_{\mathbb C}\setminus\{1\}`),row(r`s`,r`\frac1{z-1}=\frac w{1-w}`)
  ],r`A polynomial in \(z\) remains polynomial after substituting \(z=1/w\) only if it is constant. On \(U\), the displayed section \(s\) is regular in both chart expressions.`,r`Thus \(\Gamma(\mathbb P^1_{\mathbb C},\mathcal O)=\mathbb C\), while \(\Gamma(U,\mathcal O_U)=\mathbb C[s]\). This is the compatible pair we used in the sheaf example.`)
};
