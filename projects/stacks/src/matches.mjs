const r=String.raw;
const row=(symbol,value,note='')=>({symbol,value,note});
const sphere=row(r`X`,r`S=\mathbb P^1(\mathbb C)`);
const cover=[row(r`I`,r`\{0,\infty\}`),row(r`U_i`,r`\begin{cases}S\setminus\{\infty\}&i=0\\S\setminus\{0\}&i=\infty\end{cases}`,r`\(z\) on \(U_0\), \(w=1/z\) on \(U_\infty\).`)];
const localSheaves=[row(r`\mathcal F_i`,r`\mathcal O_{U_i}`,r`Holomorphic functions, as sets.`),row(r`\varphi_{ij}`,r`\text{coordinate substitution}`,r`\(\varphi_{0\infty}:s_0(z)\mapsto s_0(1/w)\).`)];
const pair=[row(r`W`,r`S\setminus\{1\}`),row(r`s_0`,r`\frac1{z-1}`),row(r`s_\infty`,r`\frac w{1-w}`)];
const entry=(title,bindings,check,result,extra={})=>({title,bindings,check,result,...extra});

export const examples={
  'local-functions':entry(r`functions on the sphere`,[
    sphere,row(r`\mathcal O_X`,r`\mathcal O_S`,r`\(\mathcal O_S(V)=\{h:V\to\mathbb C\mid h\text{ holomorphic}\}\).`),
    row(r`Y`,r`S`,r`target locally ringed space`),
    row(r`\mathcal O_Y`,r`\mathcal O_S`),
    row(r`M`,r`S`,r`smooth manifold in the source’s illustration`),row(r`N`,r`S`,r`target smooth manifold in that illustration`),
    row(r`f`,r`[z\mapsto z^2]`,r`\(f(\infty)=\infty\).`),
    row(r`f^\sharp`,r`[h\mapsto h\circ f]`),
    row(r`f_*\mathcal O_X`,r`[V\mapsto\mathcal O_S(f^{-1}(V))]`)
  ],r`\[
(h\circ f)|_{f^{-1}V}=(h|_V)\circ f|_{f^{-1}V}
\]`,r``,{note:r`Use \(M=N=S\) in the source’s smooth-manifold example.`}),
  'stalks':entry(r`local ring`,[
    sphere,row(r`x`,r`a=1`),
    row(r`\mathcal O_{X,x}`,r`\mathcal O_{S,1}`,r`Convergent Taylor series at \(1\).`),
    row(r`\mathfrak m_x`,r`\{h:h(1)=0\}`),row(r`\kappa(x)`,r`\mathbb C`,r`Evaluation at \(1\).`),
    row(r`f`,r`[z\mapsto z^2]`)
  ],r`\[
h\in\mathfrak m_1\quad\Longrightarrow\quad (h\circ f)(1)=h(1)=0
\]`,r``),
  'pullback':entry(r`composition of pullbacks`,[
    row(r`X`,r`S`),row(r`Y`,r`S`),row(r`Z`,r`S`),
    row(r`f`,r`[z\mapsto z^2]`),row(r`g`,r`[t\mapsto t^3]`),row(r`g\circ f`,r`[z\mapsto z^6]`),
    row(r`x`,r`a`),row(r`\mathcal O_{Z,g(f(x))}`,r`\mathcal O_{S,a^6}`)
  ],r`\[
h\longmapsto (t\mapsto h(t^3))\longmapsto (z\mapsto h(z^6))
\]`,r``),
  'isomorphisms':entry(r`inversion`,[
    row(r`X`,r`S`),row(r`Y`,r`S`),row(r`f`,r`[z\mapsto1/z]`,r`Inversion exchanges \(0\) and \(\infty\).`),row(r`f^\sharp`,r`[h\mapsto h(1/z)]`)
  ],r`\[
\begin{gathered}
f\circ f=\operatorname{id}_S,\\
f^\sharp(h)(z)=h(1/z)
\end{gathered}
\]`,r`The inverse pullback preserves the maximal ideal at the corresponding point.`,{proof:r`\[h(f(a))=0\quad\Longleftrightarrow\quad (f^\sharp h)(a)=0.\]`}),
  'sheaf-maps':entry(r`exponential map`,[
    sphere,...cover,row(r`\mathcal F`,r`\mathcal O_S`),row(r`\mathcal G`,r`\mathcal O_S^\times`),row(r`\varphi_i`,r`\exp|_{U_i}`),row(r`\varphi`,r`\exp:\mathcal O_S\to\mathcal O_S^\times`)
  ],r`\[
(\exp s)|_V=\exp(s|_V)
\]`,r``,{
    note:r`Exponentiation produces a nowhere vanishing holomorphic function.`,
    proofBindings:[row(r`U`,r`V\subset S`),row(r`s`,r`h\in\mathcal O_S(V)`),row(r`\varphi_U(s)`,r`e^h`)],
    proof:r`\[(e^h)|_T=e^{h|_T}.\]`
  }),
  'transitions':entry(r`gluing local functions`,[
    sphere,...cover,...localSheaves
  ],r`\[
\varphi_{ii}=\operatorname{id},\qquad\varphi_{\infty 0}=\varphi_{0\infty}^{-1}
\]`,r``,{note:r`Here the sphere \(S\) is given and the sheaf is glued.`}),
  'compatible-sections':entry(r`a rational function`,[
    sphere,...localSheaves,...pair,row(r`\mathcal F`,r`\mathcal O_S`),row(r`\varphi_i`,r`[(s_0,s_\infty)\mapsto s_i]`)
  ],r`\[
\frac1{1/w-1}=\frac w{1-w}
\]`,r`The fractions glue on \(W\).`,{
    proofBindings:pair,proof:r`\[(s_0,s_\infty)|_V=(s_0|_{V\cap U_0},s_\infty|_{V\cap U_\infty}).\]`
  }),
  'operations':entry(r`rings and modules`,[
    sphere,row(r`\mathcal O`,r`\mathcal O_S`),row(r`\mathcal F_i`,r`\mathcal O_{U_i}`,r`sheaf of rings and modules`),row(r`\varphi_{ij}`,r`\text{coordinate substitution}`),row(r`\mathcal F(W)`,r`\{(s_0,s_\infty):s_0(z)=s_\infty(1/z)\}`)
  ],r`\[
\begin{gathered}
\varphi_{ij}(s+t)=\varphi_{ij}(s)+\varphi_{ij}(t),\\
\varphi_{ij}(st)=\varphi_{ij}(s)\varphi_{ij}(t)
\end{gathered}
\]`,r``,{proof:r`Both restriction maps preserve addition and multiplication.`}),
  'uniqueness':entry(r`a sheaf from its charts`,[
    sphere,row(r`\operatorname{Sh}(X)`,r`\operatorname{Sh}(S)`),row(r`\mathcal F`,r`\mathcal O_S`),row(r`\mathcal F|_{U_i}`,r`\mathcal O_{U_i}`),row(r`\varphi_{ij}`,r`\text{canonical overlap identification}`)
  ],r`\[
\mathcal O_S\longmapsto(\mathcal O_{U_i},\varphi_{ij})\longmapsto\mathcal O_S
\]`,r``,{proof:r`Chartwise maps respecting the transitions act on compatible pairs.`}),
  'maps':entry(r`exponential and units`,[
    sphere,row(r`\mathcal F_i`,r`\mathcal O_{U_i}`),row(r`\mathcal G`,r`\mathcal O_S^\times`),row(r`f_i`,r`[s_i\mapsto e^{s_i}]`),row(r`f`,r`\exp`),row(r`g_i`,r`\mathcal O_{U_i}^\times\hookrightarrow\mathcal O_{U_i}`),row(r`g`,r`\mathcal O_S^\times\hookrightarrow\mathcal O_S`)
  ],r`\[
\begin{gathered}
f_i(s_i)=e^{s_i}\ \longmapsto\ f(s)=e^s,\\
g_i(u_i)=u_i\ \longmapsto\ g(u)=u.
\end{gathered}
\]`,r``),
  'charts':entry(r`gluing data`,[

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
  'quotient':entry(r`glued objects`,[

    row(r`X`,r`S=\mathbb P^1(\mathbb C)`),
    row(r`X_i`,r`\begin{cases}\mathbb C_z&i=1\\\mathbb C_w&i=2\end{cases}`),
    row(r`U_i`,r`\begin{cases}S\setminus\{\infty\}&i=1\\S\setminus\{0\}&i=2\end{cases}`),
    row(r`\varphi_i`,r`\begin{cases}z\mapsto[z:1]&i=1\\w\mapsto[1:w]&i=2\end{cases}`),
    row(r`\varphi_{ij}`,r`\text{the overlap identification}`,r`Inversion between charts.`),
    row(r`\mathcal O_X`,r`\mathcal O_S`),
    row(r`Y`,r`S`),
    row(r`f_i`,r`\begin{cases}z\mapsto[z^2:1]&i=1\\w\mapsto[1:w^2]&i=2\end{cases}`),
    row(r`f`,r`[[u:v]\mapsto[u^2:v^2]]`),
    row(r`g`,r`\mathrm{id}_S`),
    row(r`V_i`,r`U_i`,r``),
    row(r`g_i`,r`\varphi_i^{-1}`)
  ],r`\[
[z^2:1]=[1:w^2]\quad(w=1/z)
\]`,r``,{
    proofBindings:[row(r`x`,r`2\in X_1`),row(r`x'`,r`1/2\in X_2`),row(r`\varphi_{i,*}\mathcal O_i`,r`\mathcal O_{U_i}`)],
    proof:r`\[2\in\mathbb C_z\ \sim\ 1/2\in\mathbb C_w.\] The two chart origins remain distinct.`
  }),
  'scheme':entry(r`algebraic charts`,[

    row(r`X_i`,r`\begin{cases}\operatorname{Spec}\mathbb C[z]&i=1\\\operatorname{Spec}\mathbb C[w]&i=2\end{cases}`),
    row(r`U_i`,r`\varphi_i(X_i)`),
    row(r`U_{12}`,r`D(z)`,r`Coordinate ring \(\mathbb C[z,z^{-1}]\).`),
    row(r`U_{21}`,r`D(w)`,r`Coordinate ring \(\mathbb C[w,w^{-1}]\).`),
    row(r`\varphi_{12}^\sharp`,r`[w\mapsto z^{-1}]`),
    row(r`X`,r`\mathbb P^1_{\mathbb C}`),
    row(r`\mathcal O_X`,r`\mathcal O_{\mathbb P^1_{\mathbb C}}`)
  ],r`\(X=U_1\cup U_2\), with each \(U_i\) affine.`,r``,{note:r`Use regular functions on the algebraic projective line.`,proof:r`\[
\begin{gathered}
X=U_1\cup U_2,\\
U_i\cong X_i\ \text{affine}.
\end{gathered}
\]`}),
  'double-origin':entry(r`doubled origin`,[
    row(r`k`,r`\mathbb C`),row(r`n`,r`1`),row(r`X_1`,r`\operatorname{Spec}\mathbb C[z]`),row(r`X_2`,r`\operatorname{Spec}\mathbb C[w]`),row(r`\varphi_{12}`,r`[z\mapsto z]`),row(r`X`,r`\text{the doubled-origin line}`),row(r`f`,r`[z\mapsto z,\ w\mapsto w]`,r`map to \(\operatorname{Spec}\mathbb C[t]\)`)
  ],r`\[
\begin{gathered}
z=w\quad(z,w\ne0),\\
0_{X_1}\ne0_{X_2}\text{ in }X
\end{gathered}
\]`,r``,{note:r`Both origins share the same punctured neighbourhood.`}),
  'global-functions':entry(r`projective line`,[
    row(r`k`,r`\mathbb C`),row(r`x`,r`z`),row(r`y`,r`w`),row(r`\mathbf P^1_k`,r`\mathbb P^1_{\mathbb C}`),row(r`g(x)`,r`g(z)`),row(r`g(1/y)`,r`g(1/w)`),row(r`U`,r`\mathbb P^1_{\mathbb C}\setminus\{1\}`),row(r`s`,r`\frac1{z-1}=\frac w{1-w}`)
  ],r`\[
\begin{gathered}
\Gamma(\mathbb P^1_{\mathbb C},\mathcal O)=\mathbb C,\\
\Gamma(U,\mathcal O_U)=\mathbb C[s]
\end{gathered}
\]`,r`A polynomial in \(z\) stays polynomial in \(w=1/z\) only when constant.`)
};
