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
  ],r`\[
(h\circ f)|_{f^{-1}V}=(h|_V)\circ f|_{f^{-1}V}
\]`,r``,{note:r`Use \(M=N=S\) in the source’s smooth-manifold example.`}),
  'stalks':entry(r`The local ring at a chosen point`,[
    sphere,row(r`x`,r`a=1`),
    row(r`\mathcal O_{X,x}`,r`\mathcal O_{S,1}`,r`Germs of holomorphic functions near \(1\). Functions have the same germ if they agree on some neighbourhood of \(1\).`),
    row(r`\mathfrak m_x`,r`\{h:h(1)=0\}`),row(r`\kappa(x)`,r`\mathbb C`,r`The quotient map is evaluation at \(1\).`),
    row(r`f`,r`[z\mapsto z^2]`)
  ],r`\[
h\in\mathfrak m_1\quad\Longrightarrow\quad (h\circ f)(1)=h(1)=0
\]`,r``),
  'pullback':entry(r`Composition in this case`,[
    row(r`X`,r`S`),row(r`Y`,r`S`),row(r`Z`,r`S`),
    row(r`f`,r`[z\mapsto z^2]`),row(r`g`,r`[t\mapsto t^3]`),row(r`g\circ f`,r`[z\mapsto z^6]`),
    row(r`x`,r`a`),row(r`\mathcal O_{Z,g(f(x))}`,r`\mathcal O_{S,a^6}`)
  ],r`\[
h\longmapsto (t\mapsto h(t^3))\longmapsto (z\mapsto h(z^6))
\]`,r``),
  'isomorphisms':entry(r`An actual isomorphism`,[
    row(r`X`,r`S`),row(r`Y`,r`S`),row(r`f`,r`[z\mapsto1/z]`,r`For this lemma use inversion; it exchanges zero and infinity and is its own inverse.`),row(r`f^\sharp`,r`[h\mapsto h(1/z)]`)
  ],r`\[
\begin{gathered}
f\circ f=\operatorname{id}_S,\\
f^\sharp(h)(z)=h(1/z)
\end{gathered}
\]`,r`The inverse pullback preserves the maximal ideal at the corresponding point.`,{proof:r`\[h(f(a))=0\quad\Longleftrightarrow\quad (f^\sharp h)(a)=0.\]`}),
  'sheaf-maps':entry(r`Glue one rule on two charts`,[
    sphere,...cover,row(r`\mathcal F`,r`\mathcal O_S`,r`sheaf of sets`),row(r`\mathcal G`,r`\mathcal O_S`,r`sheaf of sets`),row(r`\varphi_i`,r`[s\mapsto s^2]`,r`Square a holomorphic function. These are sheaves of sets, so additivity is not a hypothesis.`),row(r`\varphi`,r`[s\mapsto s^2]`)
  ],r`\[
(s^2)|_{U_i\cap U_j}=(s|_{U_i\cap U_j})^2
\]`,r``,{
    proofBindings:[row(r`U`,r`V\subset S`),row(r`s`,r`h\in\mathcal O_S(V)`),row(r`\varphi_U(s)`,r`h^2`)],
    proof:r`\[(h^2)|_T=(h|_T)^2.\]`
  }),
  'transitions':entry(r`The gluing data for local functions`,[
    sphere,...cover,...localSheaves
  ],r`\[
\varphi_{ii}=\operatorname{id},\qquad\varphi_{\infty 0}=\varphi_{0\infty}^{-1}
\]`,r``,{note:r`Here the sphere \(S\) is given and the sheaf is glued.`}),
  'compatible-sections':entry(r`Apply the section formula`,[
    sphere,...localSheaves,...pair,row(r`\mathcal F`,r`\mathcal O_S`),row(r`\varphi_i`,r`[(s_0,s_\infty)\mapsto s_i]`)
  ],r`\[
\frac1{1/w-1}=\frac w{1-w}
\]`,r`The expressions agree on the overlap and glue on \(W\).`,{
    proofBindings:pair,proof:r`\[(s_0,s_\infty)|_V=(s_0|_{V\cap U_0},s_\infty|_{V\cap U_\infty}).\]`
  }),
  'operations':entry(r`Retain the ring and module structures`,[
    sphere,row(r`\mathcal O`,r`\mathcal O_S`),row(r`\mathcal F_i`,r`\mathcal O_{U_i}`,r`sheaf of rings and modules`),row(r`\varphi_{ij}`,r`\text{coordinate substitution}`),row(r`\mathcal F(W)`,r`\{(s_0,s_\infty):s_0(z)=s_\infty(1/z)\}`)
  ],r`\[
\begin{gathered}
\varphi_{ij}(s+t)=\varphi_{ij}(s)+\varphi_{ij}(t),\\
\varphi_{ij}(st)=\varphi_{ij}(s)\varphi_{ij}(t)
\end{gathered}
\]`,r``,{proof:r`The equalizer is closed under addition and multiplication because both restriction maps preserve them.`}),
  'uniqueness':entry(r`Our object in the equivalence`,[
    sphere,row(r`\operatorname{Sh}(X)`,r`\operatorname{Sh}(S)`),row(r`\mathcal F`,r`\mathcal O_S`),row(r`\mathcal F|_{U_i}`,r`\mathcal O_{U_i}`),row(r`\varphi_{ij}`,r`\text{canonical overlap identification}`)
  ],r`\[
\mathcal O_S\longmapsto(\mathcal O_{U_i},\varphi_{ij})\longmapsto\mathcal O_S
\]`,r``,{proof:r`The squaring maps glue uniquely, and the compatible pairs recover the original sheaf.`}),
  'maps':entry(r`The two mapping properties`,[
    sphere,row(r`\mathcal F_i`,r`\mathcal O_{U_i}`),row(r`\mathcal G`,r`\mathcal O_S`),row(r`f_i`,r`[s_i\mapsto s_i^2]`),row(r`f`,r`[s\mapsto s^2]`),row(r`g_i`,r`\mathrm{id}_{\mathcal O_{U_i}}`),row(r`g`,r`\mathrm{id}_{\mathcal O_S}`)
  ],r`\[
\begin{gathered}
f_i(s_i)=s_i^2\ \longmapsto\ f(s)=s^2,\\
g_i=\operatorname{id}\ \longmapsto\ g=\operatorname{id}
\end{gathered}
\]`,r``),
  'charts':entry(r`Assign the gluing data`,[

    row(r`I`,r`\{1,2\}`),
    row(r`X_i`,r`\begin{cases}\mathbb C_z&i=1\\\mathbb C_w&i=2\end{cases}`,r`separate locally ringed spaces`),
    row(r`\mathcal O_i`,r`\mathcal O_{X_i}`),
    row(r`U_{ij}`,r`\begin{cases}X_i&i=j\\X_i\setminus\{0\}&i\ne j\end{cases}`),
    row(r`\varphi_{ij}`,r`\begin{cases}\mathrm{id}&i=j\\z\mapsto1/z&(i,j)=(1,2)\\w\mapsto1/w&(i,j)=(2,1)\end{cases}`)
  ],r`\[
\begin{gathered}
U_{ii}=X_i,\\
\varphi_{ji}\circ\varphi_{ij}=\operatorname{id}_{U_{ij}}
\end{gathered}
\]`,r``,{note:r`The next lemma denotes the image of \(X_i\) by \(U_i\).`}),
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
  ],r`\[
[z^2:1]=[1:w^2]\quad(w=1/z)
\]`,r`The maps glue to \([u:v]\mapsto[u^2:v^2]\).`,{
    proofBindings:[row(r`x`,r`2\in X_1`),row(r`x'`,r`1/2\in X_2`),row(r`\varphi_{i,*}\mathcal O_i`,r`\mathcal O_{U_i}`)],
    proof:r`\[2\in\mathbb C_z\ \sim\ 1/2\in\mathbb C_w.\] The two chart origins remain distinct.`
  }),
  'scheme':entry(r`The scheme specialization`,[

    row(r`X_i`,r`\begin{cases}\operatorname{Spec}\mathbb C[z]&i=1\\\operatorname{Spec}\mathbb C[w]&i=2\end{cases}`),
    row(r`U_i`,r`\varphi_i(X_i)`),
    row(r`U_{12}`,r`D(z)`,r`Coordinate ring \(\mathbb C[z,z^{-1}]\).`),
    row(r`U_{21}`,r`D(w)`,r`Coordinate ring \(\mathbb C[w,w^{-1}]\).`),
    row(r`\varphi_{12}^\sharp`,r`[w\mapsto z^{-1}]`),
    row(r`X`,r`\mathbb P^1_{\mathbb C}`),
    row(r`\mathcal O_X`,r`\mathcal O_{\mathbb P^1_{\mathbb C}}`)
  ],r`The chart images are affine opens and cover \(X\).`,r``,{note:r`Use the algebraic projective line with regular functions.`,proof:r`\[
\begin{gathered}
X=U_1\cup U_2,\\
U_i\cong X_i\ \text{affine}.
\end{gathered}
\]`}),
  'double-origin':entry(r`The comparison example`,[
    row(r`k`,r`\mathbb C`),row(r`n`,r`1`),row(r`X_1`,r`\operatorname{Spec}\mathbb C[z]`),row(r`X_2`,r`\operatorname{Spec}\mathbb C[w]`),row(r`\varphi_{12}`,r`[z\mapsto z]`),row(r`X`,r`\text{the doubled-origin line}`),row(r`f`,r`[z\mapsto z,\ w\mapsto w]`,r`map to \(\operatorname{Spec}\mathbb C[t]\)`)
  ],r`\[
\begin{gathered}
z=w\quad(z,w\ne0),\\
0_{X_1}\ne0_{X_2}\text{ in }X
\end{gathered}
\]`,r``,{note:r`The doubled-origin line uses the identity transition.`}),
  'global-functions':entry(r`The projective-line example`,[
    row(r`k`,r`\mathbb C`),row(r`x`,r`z`),row(r`y`,r`w`),row(r`\mathbf P^1_k`,r`\mathbb P^1_{\mathbb C}`),row(r`g(x)`,r`g(z)`),row(r`g(1/y)`,r`g(1/w)`),row(r`U`,r`\mathbb P^1_{\mathbb C}\setminus\{1\}`),row(r`s`,r`\frac1{z-1}=\frac w{1-w}`)
  ],r`\[
\begin{gathered}
\Gamma(\mathbb P^1_{\mathbb C},\mathcal O)=\mathbb C,\\
\Gamma(U,\mathcal O_U)=\mathbb C[s]
\end{gathered}
\]`,r`A polynomial in \(z\) stays polynomial in \(w=1/z\) only when constant.`)
};
