// Authored commentary. The main column is rendered separately from upstream LaTeX.
const r=String.raw;
const b=(symbol,value,note='')=>({symbol,value,note});
const model=(title,bindings,check,result,note='')=>({title,bindings,check,result,note,scope:'section'});
const X=b('X',r`\mathbb C`);
const sphereX=b('X',r`\mathbb P^1(\mathbb C)`);
const U=b('U',r`\text{an open subset of }\mathbb C`,r`A domain is a nonempty connected open set. Here \(U\) can also be disconnected or empty.`);
const O=b(r`\mathcal O`,r`\mathcal O^{\mathrm{an}}_{\mathbb C}`);
const F=b(r`\mathcal F`,r`\mathcal O^{\mathrm{an}}_{\mathbb C}`,'A sheaf; forget multiplication when the source asks for abelian groups or sets.');
const R=b('R',r`\mathbb C[z]`);
const A=b('X',r`\operatorname{Spec}(\mathbb C[z])`);
const finiteVect=b(r`\mathcal C`,r`\mathbf{Vect}^{\mathrm{fd}}_{\mathbb R}`,'Finite-dimensional real vector spaces with linear maps.');
const models={
 topology:model('manifolds',[
  b('X',r`M`),b('U',r`\text{an open chart domain in }M`),
  b('V',r`\text{an open subset of }\mathbb R^n`),
  b('f',r`\varphi:U\xrightarrow{\sim}V`)
 ],r`\[
W\subset V\text{ open}\ \Longrightarrow\ \varphi^{-1}(W)\text{ open}
\]`,'',r`A coordinate chart carries Euclidean neighbourhoods back to the manifold. Both directions of the chart are continuous.`),
 basis:model('Euclidean space',[
  b('X',r`\mathbb R^n`),
  b(r`\mathcal B`,r`\{B_r(q):q\in\mathbb Q^n,\ r\in\mathbb Q_{>0}\}`,r`\(B_r(q)\) is an open ball.`)
 ],'',''),
 irreducible:model('affine line',[A,b('Z',r`V(z(z-1))`),b(r`\eta`,r`(0)`)],r`\[
\overline{\{(0)\}}=X
\]`,r`Every proper closed subset is finite, so any two nonempty opens meet.`,r`An algebraic curve can have separate branches even when it is connected. Irreducibility asks whether it is a single algebraic piece.`),
 compact:{...model('usual topology',[b('X',r`\mathbb C`)],r`\[
\begin{gathered}
\mathbb C=\bigcup_{n\ge1}\{z:|z|<n\},\\
\text{no finite subcover}.
\end{gathered}
\]`,''),kind:'non-example',
 correction:r`Use the Zariski topology on \(\mathbb C\).`,
 examples:[model('Zariski topology',[b('X',r`\mathbb C`)],r`\[
U\ne\varnothing\text{ open}\ \Longrightarrow\ \mathbb C\setminus U\text{ finite}.
\]`,r`Every open cover has a finite subcover.`)]},
 specialization:model('specialization',[A,b('x',r`\eta=(0)`),b("x'",r`(z-a)`)],r`\[
(0)\subset(z-a)\quad\Longrightarrow\quad x'\in\overline{\{x\}}
\]`,'',r`At the generic point, a rational formula is evaluated in \(\mathbb C(z)\). At \(a\), any formula regular there can be specialized by setting \(z=a\).`),
 rings:model('function rings',[
  b('R',r`\mathbb C[z,w]`),
  b('I',r`(w-z^2)`),
  b(r`\varphi`,r`(f(z,w)\mapsto f(z,z^2))`)
 ],r`\[
R/I\cong\mathbb C[z]
\]`,'',r`Two polynomials define the same function on the parabola when their difference vanishes there.`),
 modules:model('vector bundle maps',[
  b('R',r`C^\infty(X)`),b('M',r`\Gamma(X,E)`),b('N',r`\Gamma(X,F)`),
  b('u',r`E\to F\text{ over }X`)
 ],r`\[
\begin{gathered}
\Gamma(u)(s)(x)=u_x(s(x)),\\
\Gamma(u)(hs)=h\,\Gamma(u)(s)
\end{gathered}
\]`,'',r`The linear map may vary with the point. Linearity on each fibre gives module linearity on sections.`),
 snake:model('snake lemma',[
  b(r`A_\bullet`,r`C_\bullet(Y)`),b(r`B_\bullet`,r`C_\bullet(X)`),
  b(r`C_\bullet`,r`C_\bullet(X,Y)`)
 ],r`\[
\begin{gathered}
0\to A_\bullet\to B_\bullet\to C_\bullet\to0,\\
\delta[c]=[\partial b]\in H_{n-1}(Y).
\end{gathered}
\]`,r`Lift the relative cycle \(c\) to \(b\) in \(X\). Its boundary lies in \(Y\).`,r`In the long exact sequence of a pair, the connecting map \(H_n(X,Y)\to H_{n-1}(Y)\) is the lift-and-boundary construction from the snake lemma.`),
 colimits:model('local functions',[
  b('I',r`\{\text{neighbourhoods of }a\}`,'Ordered by reverse inclusion.'),
  b('M_U',r`\operatorname{Hol}(U)`),
  b('M',r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}`)
 ],r`\[
\begin{gathered}
M=\varinjlim_{U\ni a}\operatorname{Hol}(U),\\
[h]_a=[g]_a\iff h|_W=g|_W
\end{gathered}
\]`,r`Here \(W\) is some common neighbourhood of \(a\).`,r`A Taylor series needs a neighbourhood of its centre, but the germ should forget how large that neighbourhood was.`),
 localization:model('general linear group',[
  b('R',r`k[a_{ij}:1\le i,j\le n]`),
  b('A',r`(a_{ij})`),
  b('S',r`\{(\det A)^m:m\ge0\}`),
  b(r`S^{-1}R`,r`R[1/\det A]`)
 ],r`\[
A^{-1}=\frac{\operatorname{adj}(A)}{\det A}
\]`,'',r`Localizing the coordinate ring of all matrices at the determinant gives the coordinate ring of \(\operatorname{GL}_n\).`),
 local:model('holomorphic local ring',[
  b('R',r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}\cong\mathbb C\{z-a\}`),
  b(r`\mathfrak m`,r`(z-a)`),
  b(r`\kappa`,r`\mathbb C`)
 ],r`\[
h\in R^\times\iff h(a)\ne0
\]`,'',r`A function nonzero at \(a\) is nonzero on a smaller neighbourhood. Its reciprocal defines a germ there.`),
 spectrum:model('crossing lines',[
  b('R',r`\mathbb C[x,y]/(xy)`),b('X',r`\operatorname{Spec}R`),
  b(r`\mathfrak p`,r`(x-a,y-b),\quad ab=0`),
  b(r`\eta_1,\eta_2`,r`(x),(y)`)
 ],r`\[
\overline{\{\eta_1\}}=V(x),\qquad \overline{\{\eta_2\}}=V(y)
\]`,'',r`Evaluation recovers the complex points of the two axes. Prime ideals also give each whole axis a generic point.`),
 sheaf:model('gluing holomorphic functions',[
  X,U,b(r`\{U_i\}`,r`\text{an open cover of }U`),
  F,b(r`\mathcal F(U)`,r`\{h:U\to\mathbb C\mid h\text{ holomorphic}\}`),b(r`\rho^U_V`,r`(h\mapsto h|_V)`)
 ],r`\[
\begin{gathered}
h_i|_{U_i\cap U_j}=h_j|_{U_i\cap U_j}\\
\Longrightarrow\ \exists!\,h:\ h|_{U_i}=h_i
\end{gathered}
\]`,'',r`A function can have different formulas on different patches. Agreement on the overlaps is the condition that lets those formulas define a global holomorphic function.`),
 moduleSheaf:model('differential forms',[
  b('X',r`M\text{ a smooth manifold}`),
  b(r`\mathcal O(U)`,r`C^\infty(U)`),
  b(r`\mathcal F(U)`,r`\Gamma(U,T^*M)`)
 ],r`\[
\begin{gathered}
\omega=\sum_j a_j\,dx^j,\\
h\omega=\sum_j(ha_j)\,dx^j.
\end{gathered}
\]`,'',r`A form can be multiplied by a function before or after changing coordinates. This makes the sheaf of one-forms a module over the sheaf of smooth functions.`),
 stalk:model('holomorphic germs',[
 X,b('x',r`a\in\mathbb C`),
 b('t',r`z-a`),F,
 b(r`\mathcal F_x`,r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}\cong\mathbb C\{t\}`,r`The notation \(\mathbb C\{t\}\) means power series in \(t\) with a positive radius of convergence.`),
 b(r`[f]_a`,r`\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}t^n`)
 ],r`\[
[f]_a=[g]_a\quad\Longleftrightarrow\quad f^{(n)}(a)=g^{(n)}(a)\ \ \forall n\ge0
\]`,r`Every convergent series defines a germ.`,r`To study a function at one point, keep its whole Taylor expansion there. The value alone loses the order of vanishing.`),
 moduleStalk:model('germs of differentials',[
  X,O,b('x',r`0`),
  b(r`\mathcal F`,r`\Omega_X^1`),
  b(r`\mathcal F_x`,r`\mathbb C\{z\}\,dz`)
 ],r`\[
\mathcal F_x/\mathfrak m_x\mathcal F_x\cong\mathbb C\,dz|_x
\]`,'',r`The germ remembers the entire Taylor series of the coefficient. Its value in the cotangent fibre keeps only the constant term.`),
 exactSheaf:model('closed differential forms',[
  b('X',r`M\text{ a smooth manifold}`),
  b(r`\mathcal F`,r`\mathcal C^\infty_M`),
  b(r`\mathcal G`,r`\mathcal Z^1_M`,r`The sheaf of closed smooth one-forms.`),
  b(r`\varphi`,r`d:\mathcal F\to\mathcal G`)
 ],r`\[
\begin{gathered}
\operatorname{coker}(\varphi)=0\quad\text{as sheaves},\\
\operatorname{coker}\Gamma(M,\varphi)=H^1_{\mathrm{dR}}(M).
\end{gathered}
\]`,'',r`The Poincaré lemma supplies a primitive on small coordinate balls. Periods can obstruct a global primitive.`),
 chartCover:model('sphere charts',[
  sphereX,b('U',r`X`),
  b('U_0',r`X\setminus\{\infty\}`),b('U_\infty',r`X\setminus\{0\}`)
 ],r`\[
X=U_0\cup U_\infty,\qquad U_0\cap U_\infty=\mathbb C^\times
\]`,'',r`The coordinates \(z\) and \(1/z\) let us use planar holomorphic functions near every point of the sphere.`),
 basisSheaf:model('local holomorphic functions',[
  X,b(r`\mathcal B`,r`\{D(a,r):r>0\}`),
  b(r`\mathcal F(B)`,r`\operatorname{Hol}(B),\quad B\in\mathcal B`)
 ],r`\[
h_B|_C=h_{B'}|_C\qquad(C\in\mathcal B,\ C\subset B\cap B')
\]`,'',r`A local description on disks should already determine the functions on every open set. Glue the disk sections by testing agreement on smaller disks.`),
 sheafify:model('locally constant functions',[
  b('X',r`\mathbb C\setminus\mathbb R`),b('A',r`\mathbb C`),
  b(r`\mathcal F(U)`,r`A`),
  b(r`\mathcal F^\#(U)`,r`\{h:U\to A\text{ locally constant}\}`)
 ],r`\[
\mathcal F(X)\longrightarrow\mathcal F^\#(X),\qquad c\longmapsto(c,c)
\]`,'',r`A holomorphic function with zero derivative is constant on each component. Sheafification turns the presheaf of single constants into precisely these local solutions.`),
 functorial:model('pullback of functions',[b('X',r`\mathbb C_z`),b('Y',r`\mathbb C_t`),b('f',r`(z\mapsto z^2)`),b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),b(r`\mathcal G`,r`\mathcal O_Y^{\mathrm{an}}`)],r`\[
\begin{gathered}
(f_*\mathcal F)(V)=\mathcal F(f^{-1}V),\\
f^\sharp(h)=h\circ f
\end{gathered}
\]`,r``),
 ringed:model('local ring maps',[
  b('X',r`\mathbb C_z`),b('Y',r`\mathbb C_t`),
  b('x',r`0`),b('f',r`(z\mapsto z^2)`),
  b(r`f^\sharp_x`,r`\mathbb C\{t\}\longrightarrow\mathbb C\{z\}`)
 ],r`\[
\begin{gathered}
t\longmapsto z^2,\\
(f_x^\sharp)^{-1}((z))=(t)
\end{gathered}
\]`,'',r`A holomorphic map pulls functions back by substitution. A germ vanishes at the image point exactly when its pullback vanishes at the source point.`),
 open:model('restriction to a chart',[
  sphereX,b('U',r`X\setminus\{\infty\}\cong\mathbb C_z`),
  b('j',r`(U\hookrightarrow X)`),
  b(r`\mathcal O_U`,r`\mathcal O^{\mathrm{an}}_X|_U`)
 ],r`\[
\begin{gathered}
\mathcal O_U(V)=\operatorname{Hol}(V)\quad(V\subseteq U),\\
\mathcal O_{U,a}=\mathcal O_{X,a}
\end{gathered}
\]`,'',r`Passing to a coordinate chart discards the rest of the space but keeps the same function theory at each point of the chart.`),
 algebraGlue:model('zero loci',[
  R,b('M',r`R/(z(z-1))`),
  b(r`\mathfrak m_0,\mathfrak m_1`,r`(z),(z-1)`)
 ],r`\[
\begin{gathered}
M\longrightarrow M_{\mathfrak m_0}\times M_{\mathfrak m_1},\\
[h]\longmapsto(h(0),h(1))
\end{gathered}
\]`,'',r`A function on two reduced points is zero if it vanishes at both. Localization gives a test that also works for modules on nonreduced spaces.`),
 regularGlue:model('rational functions',[
  R,b('f_1,f_2',r`z,1-z`),
  b('R_{f_1}',r`\mathbb C[z,1/z]`),
  b('R_{f_2}',r`\mathbb C[z,1/(1-z)]`)
 ],r`\[
\begin{gathered}
R_{f_1}\cap R_{f_2}=R\\
\text{inside }\mathbb C(z)
\end{gathered}
\]`,'',r`Two local formulas that agree off their possible poles describe one rational function. At each point, at least one formula is regular.`),
 affine:model('polynomial functions',[
  R,A,b(r`\mathcal O_X`,r`\widetilde R`),
  b(r`\mathcal O_X(D(z))`,r`\mathbb C[z,z^{-1}]`),
  b(r`\mathcal O_{X,(z-a)}`,r`\mathbb C[z]_{(z-a)}`)
 ],r`\[
\mathcal O_{X,(z-a)}=\{p/q:q(a)\ne0\}
\]`,r`These rational germs embed into the holomorphic germs at \(a\).`,r`The affine line needs a function ring on each open set, just as a Riemann surface does. The algebraic rule allows rational formulas wherever their denominators are invertible.`),
 affineMaps:model('affine-line maps',[b('R',r`\mathbb C[t]`),b('S',r`\mathbb C[z]`),b(r`\varphi`,r`(p(t)\mapsto p(z^2))`),b('f',r`\operatorname{Spec}(S)\longrightarrow\operatorname{Spec}(R)`)],r`\[
\begin{gathered}
(z-a)\longmapsto(t-a^2),\\
(0)\longmapsto(0)
\end{gathered}
\]`,r`Take inverse images under \(\varphi\).`),
 scheme:model('Riemann sphere',[
  b('X',r`\mathbb P^1_{\mathbb C}`),
  b('U',r`\operatorname{Spec}(\mathbb C[z])`),
  b('V',r`\operatorname{Spec}(\mathbb C[w])`)
 ],r`\[
\begin{gathered}
U\cap V=\operatorname{Spec}\bigl(\mathbb C[z,z^{-1}]\bigr),\\
w=z^{-1}
\end{gathered}
\]`,r`The gluing uses regular functions. On complex points the same coordinate change gives the holomorphic atlas of the sphere.`,r`One affine chart misses infinity. Gluing affine charts with compatible function rings gives a space that is algebraic near every point.`),
 category:{...model('vector spaces',[],'',''),points:[{
  text:r`\(\mathcal C=\mathbf{Vect}_k\) for a field \(k\).`,
  children:[
   r`\(\operatorname{Ob}(\mathcal C)=\{\text{vector spaces }V\text{ over }k\}\)`,
   r`\(\operatorname{Mor}_k(V,W)=\{\text{linear maps }V\to W\}\)`,
   'Composition is composition of linear maps.',
   r`\(\mathrm{id}_V=\text{identity map on }V\)`
  ]
 }]},
 bundlePullback:model('pullback bundles',[
  b(r`\mathcal C`,r`\mathbf{Top}`),
  b('x,z',r`X,E`),
  b('y',r`B`),
  b('f,g',r`f:X\to B,\ p:E\to B`)
 ],r`\[
\begin{gathered}
f^*E=X\times_B E,\\
(f^*E)_x=E_{f(x)}.
\end{gathered}
\]`,'',r`A point of the pullback is a pair \((x,e)\) with \(f(x)=p(e)\). It puts the fibre over \(f(x)\) above the point \(x\).`),
 setLimits:model('compatible local functions',[
  b('U,V',r`\text{open subsets of }\mathbb C`),
  b('A,B',r`\operatorname{Hol}(U),\operatorname{Hol}(V)`),
  b('C',r`\operatorname{Hol}(U\cap V)`)
 ],r`\[
\operatorname{Hol}(U\cup V)\cong A\times_C B
\]`,'',r`The limit of the restriction diagram is the set of choices that agree on the overlap.`),
 limits:model('equalizers',[b('A',r`\prod_i\operatorname{Hol}(U_i)`),b('B',r`\prod_{i,j}\operatorname{Hol}(U_i\cap U_j)`),b('f',r`(s_i)\mapsto(s_i|_{U_i\cap U_j})_{i,j}`),b('g',r`(s_i)\mapsto(s_j|_{U_i\cap U_j})_{i,j}`)],r`\[
\operatorname{Eq}(f,g)\cong\operatorname{Hol}\bigl(\textstyle\bigcup_i U_i\bigr)
\]`,r`The equalizer condition is agreement on overlaps.`),
 adjoint:model('tensor–Hom adjunction',[
  b('F',r`-\otimes_k V`),b('G',r`\operatorname{Hom}_k(V,-)`)
 ],r`\[
\begin{gathered}
\operatorname{Hom}_k(U\otimes_k V,W)\\
\cong \operatorname{Hom}_k(U,G(W)),\\
h\longmapsto (u\mapsto(v\mapsto h(u\otimes v))).
\end{gathered}
\]`,'',r`The tensor–Hom adjunction is the same bilinear operation read in two ways.`),
 idempotent:model('idempotents',[
  b('R',r`C(X,\mathbb R)`),b('U',r`\text{an open and closed subset of }X`),
  b('e',r`\mathbf 1_U`)
 ],r`\[
\begin{gathered}
e^2=e,\\
R\cong eR\times(1-e)R
\end{gathered}
\]`,r`The two factors are the function rings on \(U\) and \(X\setminus U\).`,r`A continuous real-valued idempotent takes only the values zero and one. Its level sets give a decomposition into open and closed parts.`),
 finite:model('finite presentations',[R,b('M',r`R^{\oplus n}`),b('S',r`\mathbb C[z,w]/(w^2-z)`)],r`\[
\begin{gathered}
M=\bigoplus_{i=1}^n R e_i,\\
S=\mathbb C[z,w]/(w^2-z)
\end{gathered}
\]`,r`The first presentation uses \(n\) generators and the second uses one relation.`),
 abelian:model('solutions and obstructions',[
  b(r`\mathcal A`,r`\operatorname{Vect}_{\mathbb C}`),
  b('U',r`\mathbb C^\times`),
  b('M',r`\operatorname{Hol}(U)`),
  b('f',r`D:h\mapsto h'`)
 ],r`\[
\begin{aligned}
\ker D&=\mathbb C,\\
\operatorname{coker}D&\cong\mathbb C\cdot[1/z].
\end{aligned}
\]`,'',r`Constants are the freedom in choosing a primitive. The residue of \(g(z)\,dz\) is the obstruction to solving \(h'=g\) globally.`)
};
models.noetherian=model('polynomial ideals',[
 b('R',r`k[x_1,\ldots,x_n]`),b('X',r`\operatorname{Spec}(R)`),
 b('I',r`(f_1,f_2,\ldots)`)
],r`\[
V(I)=V(f_1,\ldots,f_N)\quad\text{for some }N
\]`,'',r`By the Hilbert basis theorem, adding equations one at a time eventually stops shrinking the common zero set.`);
models.constructible=model('matrix rank strata',[
 b('X',r`\mathbb A_k^{mn}`),b('A',r`(a_{ij})_{m\times n}`),
 b('I_s',r`\text{the ideal of the }s\times s\text{ minors}`)
],r`\[
\{\operatorname{rank}A=r\}
=V(I_{r+1})\setminus V(I_r)
\]`,'',r`An exact rank asks that all minors of size \(r+1\) vanish and some minor of size \(r\) be nonzero. These are closed and open conditions, respectively.`);
models.nakayama=model('fibres of finite modules',[b('R',r`\mathbb C\{t\}`),b(r`\mathfrak m`,r`(t)`),b('M',r`R^{\oplus n}`)],r`\[
\begin{aligned}
 \det A(0)\ne0 &\Longrightarrow \det A\in R^\times\\
               &\Longrightarrow A\in\operatorname{GL}_n(R).
\end{aligned}
\]`,r`An invertible matrix on the fibre lifts to an invertible matrix of germs.`);
models.connected=model('manifold components',[
 b('X',r`M\text{ a manifold}`),b('x',r`x\in M`),
 b('Z',r`\text{the path component of }x`)
],r`\[
H_0(M;\mathbb Z)\cong\bigoplus_{C\in\pi_0(M)}\mathbb Z
\]`,'',r`Manifolds are locally path connected, so connected components are path components. In degree zero, homology has one generator for each component.`);
models.natural=model('exterior differentiation',[
 b(r`\mathcal A`,r`\mathbf{Man}^{\mathrm{op}}`),
 b(r`\mathcal B`,r`\mathbf{Vect}_{\mathbb R}`),
 b('F,G',r`\Omega^q,\Omega^{q+1}`),b('t_M',r`d:\Omega^q(M)\to\Omega^{q+1}(M)`)
],r`\[
f^*(d\omega)=d(f^*\omega)
\]`,'',r`For every smooth \(f:M\to N\), exterior differentiation can be taken before or after pulling a form back from \(N\).`);
models.twoFibre=model('trivialized determinants',[
 b(r`\mathcal A`,r`\operatorname{Vect}_r(M)^\simeq`,r`The groupoid of rank-\(r\) complex vector bundles.`),
 b(r`\mathcal B`,r`\{*\}`),
 b(r`\mathcal C`,r`\operatorname{Line}(M)^\simeq`),
 b('F',r`(E\mapsto \det E)`),
 b('G',r`(*\mapsto M\times\mathbb C)`)
],r`\[
\alpha:\det E\xrightarrow{\sim}M\times\mathbb C
\]`,'',r`The fibre over the trivial line has objects \((E,*,\alpha)\). The trivialization is part of the data.`);
models.over=model('covering spaces',[
 b(r`\mathcal C`,r`\mathbf{Top}`),
 b('X',r`\text{the base space}`),
 b('p,q',r`E\to X,\ F\to X`)
],r`\[
u:(E,p)\to(F,q)\quad\Longleftrightarrow\quad q\circ u=p
\]`,'',r`In the category of spaces over \(X\), a map between two coverings sends each fibre into the fibre over the same point. A deck transformation is an automorphism over \(X\).`);
models.presheaf=model('restriction of holomorphic functions',[
 b('X',r`\text{a Riemann surface}`),b('U',r`\text{an open subset of }X`),
 b(r`\mathcal F`,r`\mathcal O^{\mathrm{an}}_X`),
 b(r`\mathcal F(U)`,r`\{h:U\to\mathbb C\mid h\text{ holomorphic}\}`),
 b(r`\rho^U_V`,r`(h\mapsto h|_V)`),
 b(r`\mathcal G`,r`\Omega_X^1`),
 b(r`\varphi`,r`d:h\mapsto dh`)
],r`\[
(dh)|_V=d(h|_V)
\]`,r`The kernel consists of locally constant functions.`,r`The derivative is computed on each domain, and the formula survives restriction. This compatibility makes differentiation a morphism of presheaves.`);
models.abelianMorphism={...models.presheaf,title:'differential operators',
 check:r`\[
 d(ah+bk)=a\,dh+b\,dk
 \]`,
 result:r`Here \(a,b\in\mathbb C\) are constant scalars.`
};
models.solutionSheaf=model('solution sheaves',[X,U,
 b(r`\mathcal O_X`,r`\underline{\mathbb C}`,'The sheaf of locally constant complex-valued functions, used as scalars.'),
 b(r`\mathcal F`,r`\mathcal O_{\mathbb C}^{\mathrm{an}}`,'Holomorphic functions, as a module over locally constant complex scalars.'),
 b(r`\mathcal G`,r`\mathcal F`),
 b(r`\varphi`,r`D:h\mapsto h'-h`),
 b(r`\operatorname{Ker}(\varphi)(U)`,r`\{h\in\operatorname{Hol}(U):h'-h=0\}`)
],r`\[
\varphi(h)=0\quad\Longleftrightarrow\quad(e^{-z}h)'=0
\]`,r`The constant of integration is locally constant on \(U\).`,r`The scalar sheaf is \(\underline{\mathbb C}\), whose sections have zero derivative.`);
models.kernel=model('homogeneous solutions',[
 b(r`\mathcal A`,r`\mathbf{Vect}_k`),
 b('x,y',r`V,V`),
 b('f',r`T-\lambda\operatorname{id}_V`),
 b('z',r`E_\lambda=\ker f`),
 b('i',r`E_\lambda\hookrightarrow V`)
],r`\[
(T-\lambda\operatorname{id}_V)\circ g=0
\]`,r`Such a map \(g\) factors uniquely through \(E_\lambda\).`,r`For a linear operator \(T\), the \(\lambda\)-eigenspace collects all solutions of \(Tv=\lambda v\).`);

const projectiveRing=b('S',r`k[T_0,T_1]`,r`The polynomial ring over a field \(k\), graded by total degree with both variables in degree one.`);
const projectiveLine=b('X',r`\operatorname{Proj}(S)=\mathbb P^1_k`);
const twistCharts=model('projective coordinates',[
 projectiveRing,projectiveLine,
 b('U_0',r`D_+(T_0)=\operatorname{Spec}k[z]`,r`The chart with coordinate \(z=T_1/T_0\).`),
 b('U_1',r`D_+(T_1)=\operatorname{Spec}k[w]`,r`The chart with coordinate \(w=T_0/T_1\).`),
 b(r`\mathcal O_X(n)(U_0)`,r`k[z]\,T_0^n`),
 b(r`\mathcal O_X(n)(U_1)`,r`k[w]\,T_1^n`)
],r`\[
\begin{gathered}
S(n)_j=S_{n+j},\\
T_1^n=z^nT_0^n
\end{gathered}
\]`,r`Chart coefficients glue when \(a(z)=z^n b(1/z)\).`,r`A degree-\(n\) polynomial changes by a factor of \(\lambda^n\) when homogeneous coordinates are rescaled by \(\lambda\). The twist absorbs this change, so the polynomial defines a section on projective space.`);
const twistSections=model('global sections',[
 projectiveLine,
 b(r`\mathcal O_X(1)`,r`\widetilde{S(1)}`),
 b(r`T_0`,r`(1,w)`),
 b(r`T_1`,r`(z,1)`)
],r`\[
\begin{gathered}
H^0(X,\mathcal O_X(n))=S_n,\\
a(z)\longmapsto T_0^n a(T_1/T_0)\quad(n\ge0)
\end{gathered}
\]`,r`For \(n\ge0\), gluing gives \(\deg a\le n\). For \(n<0\), the Laurent powers cannot match.`);
const twistTensor=model('tensor products of line bundles',[
 projectiveRing,projectiveLine,
 b(r`\mathcal O_X(n)|_{U_i}`,r`\mathcal O_{U_i}\,T_i^n`),
 b(r`\mathcal O_X(m)|_{U_i}`,r`\mathcal O_{U_i}\,T_i^m`)
],r`\[
\begin{gathered}
T_i^n\otimes T_i^m\longmapsto T_i^{n+m},\\
z^n z^m=z^{n+m}
\end{gathered}
\]`,r`The tautological frames \((1,z)\) and \((w,1)\) differ by \(z^{-1}\), giving \(\mathcal O_X(-1)\).`);
const twistOpen=model('standard projective charts',[
 projectiveRing,projectiveLine,b('f',r`T_0`),
 b('W',r`X`)
],r`\[
\begin{gathered}
T_0=wT_1\text{ on }U_1,\\
X\setminus Z(T_0)=D_+(T_0)
\end{gathered}
\]`,r``);
Object.assign(models,{twistCharts,twistTensor});

const conic=r`V_+(T_0T_2-T_1^2)`;
const conicCurve=b('X',conic,r`A smooth conic in \(\mathbb P^2_k\), with \(k\) algebraically closed.`);
const doublePoint=b('D',r`\operatorname{Spec}(k[z]/(z^2))`,r`The zero scheme supported at \(p=[1:0:0]\).`);
const tangentDivisor=model('tangent line',[
 conicCurve,
 b(r`\mathcal L`,r`\mathcal O_{\mathbb P^2_k}(1)|_X`),
 b('s',r`T_2|_X`),
 doublePoint
],r`\[
\begin{gathered}
\frac{T_2}{T_0}=\left(\frac{T_1}{T_0}\right)^2=z^2,\\
\mathcal O_X(D)\cong\mathcal L
\end{gathered}
\]`,r`Under \([u:v]\mapsto[u^2:uv:v^2]\), the tangent section becomes \(v^2\) in \(\mathcal O_{\mathbb P^1_k}(2)\).`);
const conicDegree=model('tangency multiplicity',[
 conicCurve,doublePoint,
 b(r`\mathcal E`,r`\mathcal O_X`),
 b(r`\mathcal E(D)`,r`\mathcal O_X(D)\cong\mathcal L`)
],r`\[
\deg\mathcal L=\deg D=\dim_k k[z]/(z^2)=2
\]`,r`The secant \(T_1=0\) gives two simple zeros of a section of the same bundle.`);
const conicIntersection=model('intersection multiplicity',[
 b('X',r`\mathbb P^2_k`,'The ambient nonsingular surface over an algebraically closed field.'),
 b('V',r`V_+(T_2)`),
 b('W',conic,'The smooth conic.'),
 b(r`Z=\{\xi\}`,r`\{[1:0:0]\}`),
 b('f_1',r`T_2/T_0`)
],r`\[
e(X,V\cdot W,Z)=\operatorname{length}\bigl(k[z]_{(z)}/(z^2)\bigr)=2
\]`,r`The two factors of the filtration by \(z\) have length one.`);

const cechLine=model('overlap sections',[
 projectiveLine,
 b(r`\mathcal U`,r`\{U_0,U_1\}`,r`The two standard affine charts, with coordinates \(z=T_1/T_0\) and \(w=1/z\).`),
 b(r`\mathcal F`,r`\mathcal O_X(-2)`,r`The twist with local generators \(e_0=T_0^{-2}\) and \(e_1=z^{-2}e_0\).`),
 b(r`\Gamma(U_0\cap U_1,\mathcal F)`,r`k[z,z^{-1}]e_0`)
],r`\[
\begin{gathered}
\delta(a,b)=z^{-2}b(1/z)-a(z),\\
H^1(X,\mathcal F)=k\cdot[z^{-1}e_0]
\end{gathered}
\]`,r`The two charts supply powers \(j\geq0\) and \(j\leq-2\), leaving the class of \(z^{-1}e_0\).`,r`A discrepancy on the overlap is harmless if it is the difference of two chart sections. The quotient measures the discrepancies that cannot be repaired.`);
const cechAffine=model('affine overlap sections',[
 b('U',r`\operatorname{Spec}(k[z])`),
 b(r`\mathcal U`,r`\{D(z),D(1-z)\}`,r`These opens cover \(U\) because \(z+(1-z)=1\).`),
 b(r`\mathcal F`,r`\mathcal O_U`)
],r`\[
\frac{1}{z(1-z)}=\frac1z+\frac1{1-z}
\]`,r`The summands extend to the two charts. The lemma gives the same splitting for every overlap section.`);
const cechSphere={...model('residues on the sphere',[
 b('X',r`\mathbb P^1(\mathbb C)`),
 b(r`\mathcal U`,r`\{\mathbb C_z,\mathbb C_w\}`,r`The overlap is \(\mathbb C^\times\).`),
 b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}(-2)\cong\Omega_X^1`,r`
 \[
 \begin{aligned}
 w&=1/z, & dw&=-z^{-2}\,dz,\\
 e_1&=z^{-2}e_0, & -dw&=z^{-2}\,dz.
 \end{aligned}
 \]
 The frames \(e_0,e_1\) of the twist therefore correspond to \(dz,-dw\).`),
 b(r`\omega`,r`\left(\sum_{j\in\mathbb Z}c_jz^j\right)dz`)
],r`
 \[
 \begin{aligned}
 a(z)\,dz &= \sum_{j\geq 0} a_j z^j\,dz,\\
 b(w)\,dw &= -z^{-2}b(1/z)\,dz\\
          &= \sum_{j\leq -2} \widetilde b_j z^j\,dz.
 \end{aligned}
 \]
 `,r`The two Laurent tails extend to the two charts. The \(j=-1\) term is the residue and gives the surviving class \([dz/z]\).`,r`Can a differential on the overlap be written as a difference of holomorphic differentials on the two charts? Cartan’s Theorem B lets this overlap question compute \(H^1\).`),
 kind:'analogy',
 source:{url:'https://www.numdam.org/item/SB_1951-1954__2__213_0/',label:'Serre’s Bourbaki exposé on Cartan’s Theorem B'}};
const cechPlane=model('three-chart residues',[
 b('R',r`k`),
 b('n,d',r`2,-3`),
 b('X',r`\mathbb P^2_k`),
 b(r`\mathcal F`,r`\mathcal O_X(-3)`),
 b(r`\eta`,r`\frac{1}{T_0T_1T_2}`)
],r`\[
H^2(X,\mathcal F)=k\cdot\left[\frac1{T_0T_1T_2}\right]
\]`,r`A double overlap inverts only two coordinates. The only degree minus three monomial with all three exponents negative survives.`,r`On the sphere, a Laurent term survives because neither chart can supply it. On the projective plane, look for a term on the triple overlap that none of the double overlaps can supply.`);
const planeCurveGenus=model('plane curve genus',[
 b('k',r`\mathbb C`),
 b('S',r`k[T_0,T_1,T_2]`),
 b('F',r`\text{a homogeneous polynomial of degree }d`),
 b('Z',r`V_+(F)\subset X=\mathbb P^2_k`,r`Assume the curve is smooth.`),
 b('i',r`Z\hookrightarrow X`)
],r`\[
0\to\mathcal O_X(-d)\xrightarrow{F}\mathcal O_X\to i_*\mathcal O_Z\to0
\]`,r`\[
 H^1(Z,\mathcal O_Z)\cong H^2(X,\mathcal O_X(-d)).
 \]
 Counting the Laurent monomials with three negative exponents summing to \(-d\) gives \(g=(d-1)(d-2)/2\).`,r`A smooth complex plane curve is a compact Riemann surface. Its defining equation gives a restriction sequence on the ambient plane, with the degree recorded by the twist.`);
const affineModule=model('localization of bundles',[
 b('A',r`\Gamma(X,\mathcal O_X)`),
 b('X',r`\operatorname{Spec} A`),
 b('M',r`\Gamma(X,E)`),
 b(r`\mathcal F`,r`\widetilde M`)
],r`\[
\Gamma(D(f),E)=M_f
\]`,'',r`Here \(E\) is an algebraic vector bundle, viewed as its sheaf of sections. On an affine scheme, the module of global sections recovers the bundle.`);
const closedPoint=model('closed immersions',[
 b('X',r`\operatorname{Spec} k[z]`),
 b('Z',r`\operatorname{Spec}(k[z]/(z^2))`),
 b('i',r`Z\hookrightarrow X`)
],r`\[
i^{-1}(D(f))=\operatorname{Spec}\bigl((k[z]/(z^2))_f\bigr)
\]`,'',r`The equations \(z=0\) and \(z^2=0\) have the same zero set. The quotient for \(z^2=0\) also retains the linear term of a function at the origin.`);
const affineBundle=model('bundle projections',[
 b('Y',r`\text{the base scheme}`),
 b('E',r`\text{a rank }r\text{ vector bundle on }Y`),
 b('X',r`\operatorname{Spec}_Y(\operatorname{Sym}E^\vee)`),
 b('f',r`X\to Y`)
],r`\[
\begin{gathered}
U=\operatorname{Spec}A,\quad E|_U\cong\mathcal O_U^r,\\
f^{-1}(U)\cong\operatorname{Spec}A[t_1,\ldots,t_r].
\end{gathered}
\]`,'',r`Over a trivializing affine chart the total space is a product with affine space. Over any affine chart its ring is the symmetric algebra of the module of dual sections.`);
const gradedPolynomial=model('homogeneous polynomials',[
 b('S',r`k[t_0,\ldots,t_n]`),
 b('S_d',r`\left\{\begin{gathered}\text{homogeneous polynomials}\\\text{of degree }d\end{gathered}\right\}`),
 b(r`\operatorname{Proj}(S)`,r`\mathbb P^n_k`)
],'','');
const projCharts=model('homogeneous coordinate charts',[
 b('S',r`k[T_0,\ldots,T_n]`),
 b('X',r`\operatorname{Proj}S=\mathbb P^n_k`),
 b('U_i',r`D_+(T_i)`)
],r`\[
\begin{gathered}
S_{(T_i)}=k[T_j/T_i:j\ne i],\\
U_i=\operatorname{Spec}S_{(T_i)}\cong\mathbb A_k^n.
\end{gathered}
\]`,'',r`Normalizing the nonzero coordinate to one gives the usual affine chart. The ratios are precisely the degree-zero generators after inverting \(T_i\).`);
const properLine=model('limits at infinity',[
 b('S',r`\operatorname{Spec}\mathbb C`),
 b('X',r`\mathbb P^1_{\mathbb C}`),
 b('f',r`X\to S`),
 b('R',r`\mathbb C[[t]]`),
 b('K',r`\mathbb C((t))`)
],r`\[
[1:t^{-1}]=[t:1]\longrightarrow [0:1]\quad(t=0)
\]`,'',r`A point that runs off the affine chart can still have a limit on the sphere. The valuative criterion captures this extension property algebraically.`);
const padicLimit={...model('p-adic integers',[
 b(r`\mathcal C`,r`\mathbf{CRing}`),
 b(r`\mathcal I`,r`(\mathbb Z_{\ge1},\ge)`,
  r`One arrow \(m\to n\) for \(m\ge n\).`)
],r`\[
\mathbb Z/p\mathbb Z
\longleftarrow\mathbb Z/p^2\mathbb Z
\longleftarrow\mathbb Z/p^3\mathbb Z
\longleftarrow\cdots
\]
\[
\mathbb Z_p=\varprojlim_{n\ge1}\mathbb Z/p^n\mathbb Z.
\]`,'',r`For a prime \(p\), with reduction maps.`),
 source:{url:'https://stacks.math.columbia.edu/tag/08YH',label:'Also in Stacks, §5.26 (08YH)'}};
const sphereColimit=model('infinite sphere',[
 b(r`\mathcal C`,r`\mathbf{Top}`),
 b(r`\mathcal I`,r`(\mathbb Z_{\ge0},\le)`,
  r`One arrow \(n\to m\) for \(n\le m\).`)
],r`\[
\begin{gathered}
S^0\hookrightarrow S^1\hookrightarrow S^2\hookrightarrow\cdots,\\
x\longmapsto(x,0).
\end{gathered}
\]
\[
S^\infty=\varinjlim_{n\ge0}S^n=\bigcup_{n\ge0}S^n.
\]`,r`Give the union the colimit topology.`);
const triangulatedChains=model('simplicial chains',[
 b(r`\mathcal A`,r`\mathbf{Ab}`),
 b('K',r`\text{a triangulation of }M`),
 b(r`A_\bullet`,r`C_\bullet(K;\mathbb Z)`),
 b('A_i',r`\bigoplus_{\sigma\in K_i}\mathbb Z[\sigma]`),
 b('d_i',r`\partial_i:A_i\to A_{i-1}`)
],r`\[
\begin{gathered}
\sigma=[v_0,\ldots,v_i],\\
\sigma_j=[v_0,\ldots,\widehat v_j,\ldots,v_i],\\
\partial_i\sigma=\sum_{j=0}^i(-1)^j\sigma_j.
\end{gathered}
\]`,r`Each face obtained by deleting two vertices occurs twice with opposite signs, so \(\partial_{i-1}\partial_i=0\).`,r`Order the vertices and take one generator for each \(i\)-simplex in \(K_i\). For \(i>0\), the boundary is the alternating sum of its faces. Set \(\partial_0=0\).`);
const pairConnectingMap={...model('relative homology',[
 b('X',r`M`),
 b('Y',r`\partial M`),
 b('A',r`C^\bullet(X,Y;\mathbb Z)`),
 b('B',r`C^\bullet(X;\mathbb Z)`),
 b('C',r`C^\bullet(Y;\mathbb Z)`),
 b('F^n',r`H^n`)
],r`\[
0\to A\to B\to C\to0
\]
\[
\begin{gathered}
H^n(X)\to H^n(Y)\xrightarrow{\delta}H^{n+1}(X,Y),\\
H^{n+1}(X,Y)\to H^{n+1}(X)\to H^{n+1}(Y),\\[4pt]
\delta[\alpha]=[d\widetilde\alpha].
\end{gathered}
\]`,r`Extend the boundary cocycle \(\alpha\) to a cochain \(\widetilde\alpha\) on \(M\). Its coboundary vanishes on \(\partial M\), so it defines a relative class.`,r`The long exact sequence of \((M,\partial M)\) measures which boundary cohomology classes extend across the manifold. They are exactly the classes in \(\ker\delta\).`),
 source:{url:'https://pi.math.cornell.edu/~hatcher/AT/ATch3.pdf#page=15',label:'Hatcher, Algebraic Topology, §3.1'}};
const injectiveExample=model('divisible groups',[
 b('A',r`\mathbb Z`),
 b('I',r`\mathbb Q`),
 b('B',r`n\mathbb Z\subset A`)
],r`\[
\varphi:B\to I,\qquad \widetilde\varphi(1)=\varphi(n)/n
\]`,'',r`An extension may require dividing the prescribed value. In an injective abelian group such an extension exists for every inclusion.`);
const injectivePoint=model('products of stalks',[
 X,b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),
 b('I_a',r`\mathcal F_a=\mathbb C\{z-a\}`,r`Its additive group is divisible, hence injective.`),
 b(r`\mathcal I(U)`,r`\prod_{a\in U} I_a`)
],r`\[
h\longmapsto([h]_a)_{a\in U}
\]`,'',r`Taylor series of one holomorphic function must agree where they meet. In the larger sheaf each germ can be chosen independently, so any family extends to a larger open set.`);
const injectiveModulePoint=model('meromorphic germs',[
 X,b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),
 b('R_a',r`\mathbb C\{z-a\}`),
 b('I_a',r`\operatorname{Frac}(R_a)`,r`The field of meromorphic germs at \(a\).`)
],r`\[
\begin{gathered}
\mathcal I(U)=\prod_{a\in U} I_a,\\
h\longmapsto([h]_a)_{a\in U}
\end{gathered}
\]`,r`Each \(R_a\) is a discrete valuation ring. Its fraction field is an injective \(R_a\)-module.`,r`Allow meromorphic germs at each point independently. This gives an injective sheaf of modules containing the holomorphic functions, with multiplication defined germ by germ.`);
const injectiveResolution=model('injective resolutions',[
 X,b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),
 b(r`\mathcal I^0(U)`,r`\prod_{a\in U}\mathcal F_a`),
 b(r`\mathcal Q`,r`\mathcal I^0/\mathcal F`)
],r`\[
\begin{aligned}
\mathcal I^1(U)&=\prod_{a\in U}\mathcal Q_a,\\
\mathcal I^0&\longrightarrow\mathcal Q\longrightarrow\mathcal I^1.
\end{aligned}
\]`,'',r`The first enlargement allows independent Taylor germs. The quotient records what those choices add beyond actual holomorphic functions. Repeat with that quotient to build an injective resolution of abelian sheaves.`);
const residueObstruction=model('residue obstruction',[
 sphereX,b('p',r`0`),
 b(r`\mathcal A`,r`\Omega_X^1`),
 b(r`\mathcal B`,r`\Omega_X^1(p)`,r`Differentials allowed a simple pole at \(p\).`),
 b(r`\mathcal C`,r`\mathbb C_p`,r`The skyscraper sheaf of residues at \(p\).`),
 b('F',r`\Gamma(X,-)`)
],r`\[
\begin{gathered}
0\to\mathcal A\to\mathcal B
  \xrightarrow{\operatorname{res}_p}\mathcal C\to0,\\
\delta:\mathbb C\xrightarrow{\sim} H^1(X,\mathcal A).
\end{gathered}
\]`,r`The boundary class is represented by \(dz/z\) on the overlap, up to sign.`,r`Locally, \(dz/z\) has residue \(1\). The residue theorem rules out a global lift with just that one pole. The connecting map records the obstruction.`);
const deRhamCohomology=model('de Rham cohomology',[
 b('X',r`M\text{ a smooth manifold}`),
 b(r`\mathcal F`,r`\underline{\mathbb R}_M`)
],r`\[
\begin{gathered}
0\to\underline{\mathbb R}_M\to\Omega_M^0
\xrightarrow{d}\Omega_M^1\xrightarrow{d}\cdots,\\
H^q(M,\underline{\mathbb R}_M)\cong H^q_{\mathrm{dR}}(M).
\end{gathered}
\]`,'',r`The Poincaré lemma makes the de Rham resolution exact. Partitions of unity make the sheaves of forms acyclic, so the complex of global forms computes sheaf cohomology.`);
const cechDifferential=model('Čech differential',[
 b('X',r`\mathbb P^2_k`),
 b('U_i',r`D_+(T_i)`),
 b(r`\mathcal F`,r`\mathcal O_X(-3)`),
 b('s_{ij}',r`\text{a section on }U_i\cap U_j`)
],r`\[
(\delta s)_{012}=s_{12}-s_{02}+s_{01}
\]`,r`All terms are restricted to the triple overlap.`,r`Local choices produce pairwise differences. On a triple overlap, passing from chart zero to chart two directly or through chart one must give the same difference.`);
const lineBundleCocycle=model('transition functions',[
 b('X',r`M\text{ a smooth manifold}`),
 b(r`\mathcal F`,r`(\mathcal C_M^\infty)^\times`),
 b(r`\mathcal U`,r`\{U_i\}\text{ a trivializing cover of }L`),
 b('g_{ij}',r`e_j/e_i\quad\text{on }U_i\cap U_j`)
],r`\[
\begin{gathered}
(\delta g)_{ijk}=g_{jk}\,g_{ik}^{-1}\,g_{ij}=1,\\
e_i'=h_i e_i\ \Longrightarrow\ g'_{ij}=h_i^{-1}h_jg_{ij}.
\end{gathered}
\]`,'',r`Choose local frames \(e_i\) for a real line bundle \(L\). On triple overlaps the coordinate changes compose. Changing the frames multiplies the cocycle by a coboundary.`);
const cechDeRham=model('Čech–de Rham complex',[
 b('M',r`\text{a smooth manifold}`),
 b(r`\mathcal U`,r`\{U_i\}\text{ an open cover}`),
 b('K^{p,q}',r`\check C^p(\mathcal U,\Omega^q)`)
],r`\[
\begin{gathered}
K^{p,q}=\prod_{i_0<\cdots<i_p}\Omega^q(U_{i_0\cdots i_p}),\\
d_{\operatorname{Tot}}=\delta+(-1)^p d_{\mathrm{dR}}.
\end{gathered}
\]`,'',r`The Čech differential changes the overlap degree. Exterior differentiation changes the form degree and commutes with restriction. The sign makes their cross terms cancel in the total complex.`);
const serreSequence={...model('Serre spectral sequence',[
 b(r`\mathcal A`,r`\mathbf{Ab}`),
 b(r`F\to E\to B`,r`\text{a fibration}`),
 b('B',r`\text{a simply connected CW complex}`)
],r`\[
\begin{gathered}
E_2^{p,q}=H^p(B;H^q(F;\mathbb Z)),\\
d_r:E_r^{p,q}\to E_r^{p+r,q-r+1},\\
E_2^{p,q}\Longrightarrow H^{p+q}(E;\mathbb Z).
\end{gathered}
\]`,'',r`The fibre gives the coefficients for cohomology on the base. Passing to cohomology page by page eventually gives the graded pieces of a filtration of the total space’s cohomology.`),
 source:{url:'https://pi.math.cornell.edu/~hatcher/SSAT/SSch1.pdf',label:'Hatcher, The Serre Spectral Sequence, §1.2'}};
const cechSpectral=model('acyclic covers',[
 b('X',r`\mathbb P^1_k`),
 b(r`\mathcal U`,r`\{D_+(T_0),D_+(T_1)\}`),
 b(r`\mathcal F`,r`\mathcal O_X(-2)`)
],r`\[
\begin{gathered}
H^q(U_{i_0\cdots i_p},\mathcal F)=0\quad(q>0),\\
E_2^{p,0}=\check H^p(\mathcal U,\mathcal F)
\end{gathered}
\]`,r`The Čech complex computes \(H^p(X,\mathcal F)\).`,r`Overlap data should compute global cohomology if the patches and their intersections have no higher cohomology of their own. The spectral sequence makes this test precise.`);
const affinePushforward=model('a closed subscheme',[
 b('Y',r`\mathbb P^2_k`),
 b('X',r`V_+(T_0^3+T_1^3+T_2^3)`),
 b('f',r`X\hookrightarrow Y`),
 b(r`\mathcal F`,r`\mathcal O_X`)
],r`\[
\begin{gathered}
R^qf_*\mathcal O_X=0\quad(q>0),\\
H^1(Y,f_*\mathcal O_X)=H^1(X,\mathcal O_X)
\end{gathered}
\]`,'',r`The plane has standard charts on which the equation of the cubic is explicit. Pushforward lets us calculate the curve’s cohomology on those ambient charts.`);
const fibreCohomology=model('cohomology local systems',[
 b('f',r`E\to B`,r`A locally trivial bundle of manifolds with fibre \(F\).`),
 b(r`\mathcal F`,r`\underline{\mathbb Z}_E`)
],r`\[
\begin{gathered}
(R^q f_*\mathcal F)_b\cong H^q(E_b;\mathbb Z),\\
E_2^{p,q}=H^p(B,R^q f_*\mathcal F),\\
E_2^{p,q}\Longrightarrow H^{p+q}(E;\mathbb Z).
\end{gathered}
\]`,'',r`On a contractible trivializing neighbourhood, the preimage retracts to a fibre. The higher direct image retains the fibre cohomology and its monodromy. Leray then takes cohomology on the base.`);
const invertibleLine=model('invertible sheaves',[
 b('X',r`M\text{ a smooth manifold}`),
 b(r`\mathcal O_X`,r`\mathcal C^\infty_M`),
 b(r`\mathcal L`,r`\text{the sheaf of sections of a real line bundle}`)
],r`\[
\mathcal L\otimes_{\mathcal O_X}\mathcal L^\vee
\xrightarrow[\sim]{\mathrm{ev}}\mathcal O_X
\]`,'',r`In a local frame, evaluation pairs the frame with its dual and gives one. Tensoring by the dual therefore undoes tensoring by the line bundle.`);
const genusExample={...model('compact Riemann surfaces',[
 b('k',r`\mathbb C`),
 b('X',r`\text{a smooth connected curve}`,r`Projective over \(k\).`),
 b('M',r`X^{\mathrm{an}}`)
],r`\[
\begin{gathered}
g=\tfrac12\dim_{\mathbb R}H^1(M;\mathbb R),\\
g=\dim_{\mathbb C}H^0(M,\Omega_M^1)
 =\dim_{\mathbb C}H^1(X,\mathcal O_X).
\end{gathered}
\]`,'',r`The number of handles is also the dimension of the space of holomorphic differentials. On the projective curve the same number is computed from its structure sheaf.`),kind:'analogy'};
const embeddedPoint=model('embedded point',[
 b('A',r`k[x,y]/(x^2,xy)`),
 b('X',r`\operatorname{Spec}A`)
],r`\[
\operatorname{Ann}_A(\bar x)=(\bar x,\bar y)
\]`,r`The origin is an associated point. The minimal prime is \((\bar x)\).`);
Object.assign(models,{tangentDivisor,conicDegree,conicIntersection,cechLine,cechPlane,planeCurveGenus,
 affineModule,closedPoint,affineBundle,gradedPolynomial,projCharts,properLine,sphereColimit,triangulatedChains,pairConnectingMap,injectiveExample,
 injectivePoint,injectiveModulePoint,injectiveResolution,residueObstruction,deRhamCohomology,cechDifferential,
 lineBundleCocycle,cechDeRham,serreSequence,cechSpectral,affinePushforward,fibreCohomology,invertibleLine,genusExample,embeddedPoint});
const curve=b('X',r`C\text{, a smooth connected projective curve over }\mathbb C`);
const curveBase=b('S',r`\operatorname{Spec}\mathbb C`);
const curveLine=b(r`\mathcal L`,r`\mathcal O_C(D)`);
const curveDifferentials=model('holomorphic differentials',[
 curve,b('Y',r`\operatorname{Spec}\mathbb C`),b('f',r`(C\to Y)`)
],r`\[
\Omega_{C/\mathbb C}^{1,\mathrm{an}}|_U=\mathcal O_U\,dz,
\qquad T_C^{\mathrm{an}}|_U=\mathcal O_U\,\partial_z
\]`,r`Here \(z\) is a local holomorphic coordinate on \(U\subset C^{\mathrm{an}}\).`);
const curveSetup=model('points on a curve',[
 curveBase,curve,b(r`\eta`,r`\text{the generic point of }C`),b('p',r`\text{a closed point of }C`)
],r`\[
\delta(\ast)=0,\qquad\delta_C(\eta)=1,\qquad\delta_C(p)=0.
\]`,'');
const curveCycles=model('zero-cycles on a curve',[
 curve,b('D',r`\textstyle\sum_p n_p[p]`)
],r`\[
Z_1(C)=\mathbb Z[C],
\qquad Z_0(C)=\bigoplus_{p\in C(\mathbb C)}\mathbb Z[p].
\]`,'');
const curvePushforward=model('pushforward of divisors',[
 curve,b('f',r`(C\to C')\text{ finite}`),b('p',r`p\in C(\mathbb C)`)
],r`\[
f_*[p]=[f(p)],\qquad f_*[C]=\deg(f)[C'].
\]`,'');
const curveRationalEquivalence=model('zeros and poles',[
 curve,b('h',r`\text{a nonzero meromorphic function on }C^{\mathrm{an}}`)
],r`\[
\begin{gathered}
\operatorname{div}(h)=\sum_p\operatorname{ord}_p(h)[p],\\
\operatorname{CH}_0(C)=\operatorname{Div}(C)/\operatorname{Prin}(C).
\end{gathered}
\]`,'');
const curveNorm=model('norm of a function',[
 curve,b('f',r`(C\to C')\text{ finite}`),b('h',r`h\in\mathbb C(C)^\times`)
],r`\[
 f_*\operatorname{div}(h)
 =\operatorname{div}\bigl(N_{\mathbb C(C)/\mathbb C(C')}(h)\bigr).
\]`,'');
const curveFirstChern=model('divisor of a section',[
 curve,curveLine,b('s',r`\text{a nonzero meromorphic section of }\mathcal L`)
],r`\[
c_1(\mathcal L)\cap[C]=[\operatorname{div}(s)]=[D]
\quad\text{in }\operatorname{CH}_0(C).
\]`,r`Changing \(s\) multiplies it by a meromorphic function, adding a principal divisor.`);
const curveBivariant=model('first Chern class',[
 curve,curveLine,b('f',r`(C'\to C)`)
],r`\[
c_1(\mathcal L)_f:[C']\longmapsto[f^*D].
\]`,r`For a finite map, the coefficient of a point in the pullback of a single point is its ramification index.`);
const curveProjectiveBundle=model('trivial projective bundle',[
 curve,b(r`\mathcal E`,r`\mathcal O_C^{\oplus r}`),b(r`P`,r`C\times\mathbb P^{r-1}`),
 b(r`\xi`,r`c_1(\mathcal O_P(1))`)
],r`\[
\operatorname{CH}^*(P)
=\operatorname{CH}^*(C)[\xi]/(\xi^r).
\]`,'');
const curveChernClasses=model('split bundles',[
 curve,b(r`\mathcal E`,r`L_1\oplus L_2`),b('x_i',r`c_1(L_i)`)
],r`\[
\begin{gathered}
c(\mathcal E)=(1+x_1)(1+x_2),\\
c_1(\mathcal E)=c_1(L_1\otimes L_2),\quad c_2(\mathcal E)=0.
\end{gathered}
\]`,'');
const curveDegree=model('degree of a point',[
 curve,b('p',r`(C\to\operatorname{Spec}\mathbb C)`),b('D',r`\textstyle\sum_x n_x[x]`)
],r`\[
p_*[D]=\sum_x n_x=\deg D.
\]`,'');
const curveCharacter=model('Chern character',[
 curve,curveLine,b(r`\mathcal E`,r`\mathcal L`)
],r`\[
\operatorname{ch}(\mathcal L)=e^{c_1(\mathcal L)}
=1+c_1(\mathcal L).
\]`,'');
const curveTodd=model('Todd class',[
 curve,b(r`\mathcal E`,r`T_C`),b('x',r`c_1(T_C)`)
],r`\[
\operatorname{Td}(T_C)=1+\tfrac12 c_1(T_C),
\qquad\deg c_1(T_C)=2-2g.
\]`,r`On the Riemann surface, the first Chern class of the complex tangent line is the Euler class of the real tangent plane.`);
const curveRiemannRoch=model('Riemann–Roch on a curve',[
 curve,b('Y',r`\operatorname{Spec}\mathbb C`),b('f',r`(C\to Y)`),
 b(r`\mathcal E`,r`L=\mathcal O_C(D)`),b('r','1'),
 b(r`R^i f_*\mathcal E`,r`H^i(C,L)`),b(r`T_{X/Y}`,r`T_C`)
],r`\[
\begin{aligned}
[\operatorname{ch}(L)\operatorname{Td}(T_C)]_1
 &=c_1(L)+\tfrac12c_1(T_C),\\
h^0(C,L)-h^1(C,L)
 &=\deg D+1-g.
\end{aligned}
\]`,r`Pushforward to the point takes the degree of the codimension-one term.`);
Object.assign(models,{
 curveDifferentials,curveSetup,curveCycles,curvePushforward,curveRationalEquivalence,
 curveNorm,curveFirstChern,curveBivariant,curveProjectiveBundle,curveChernClasses,
 curveDegree,curveCharacter,curveTodd,curveRiemannRoch
});
const sectionGroups={
 curveDifferentials:['01UM','01V4'],
 curveSetup:['02QK'],
 curveCycles:['02QQ'],
 curvePushforward:['02R3'],
 curveRationalEquivalence:['02RN','02RV'],
 curveNorm:['02S0'],
 curveFirstChern:['02SI','02SN'],
 curveBivariant:['0B75','0FDV'],
 curveProjectiveBundle:['02TV'],
 curveChernClasses:['02TZ','02U4','02UK'],
 curveDegree:['0AZ0'],
 curveCharacter:['02UM'],
 curveTodd:['02UN'],
 curveRiemannRoch:['02UO'],
 affineModule:['01BD','01I6'],
 closedPoint:['01IM'],
 affineBundle:['01S5'],
 properLine:['01W0'],
 gradedPolynomial:['00JL'],
 projCharts:['01M3','01ND'],
 twistTensor:['01MJ'],
 sphereColimit:['04AX'],
 triangulatedChains:['010V'],
 pairConnectingMap:['010P'],
 injectiveExample:['0134'],
 injectiveResolution:['013G'],
 injectivePoint:['01DF'],
 injectiveModulePoint:['01DH'],
 residueObstruction:['0156'],
 deRhamCohomology:['01DZ'],
 lineBundleCocycle:['01ED','01FG'],
 cechDifferential:['01EH'],
 cechDeRham:['0FNB','012X'],
 serreSequence:['011M'],
 cechSpectral:['01EO'],
 fibreCohomology:['01E0','01EY'],
 affinePushforward:['015L'],
 genusExample:['0BY6','0A22'],
 cechLine:['01X8'],
 cechPlane:['01XS'],
 planeCurveGenus:['0BYA','084M'],
 tangentDivisor:['01WQ','0B3Q','0C4S'],
 embeddedPoint:['05AJ'],
 conicDegree:['0AYQ'],
 conicIntersection:['0B01'],
 invertibleLine:['01CR'],
 twistCharts:['01MM','0BD6'],
 solutionSheaf:['01AF'],connected:['004R'],natural:['001L','003D'],twoFibre:['003O'],over:['02XG'],topology:['004E'],basis:['004O'],irreducible:['004U'],noetherian:['0050'],compact:['0059'],specialization:['0060'],
 snake:['07JV'],colimits:['09WN','07N7','002Z'],localization:['00CM'],local:['0AMD','07BH'],spectrum:['00DY'],constructible:['04ZC','053X'],
 presheaf:['006D'],
 sheaf:['006G','006S','006Z','006M','0071','007L'],
 moduleSheaf:['006P','0076','0088'],
 stalk:['0078','007E','007G'],moduleStalk:['007I'],exactSheaf:['007S'],
 sheafify:['007X','0083','0086'],
 functorial:['008C','008N','008P','008R','0094'],
 ringed:['0090','01HA'],open:['009Z','01HD'],
 algebraGlue:['00EN'],affine:['01HR'],affineMaps:['01HX'],scheme:['01II'],
 category:['0013'],limits:['04AQ','04AS','0027'],adjoint:['0036'],
 nakayama:['07RC'],modules:['0581'],finite:['0517','00F2','00F5'],idempotent:['04PN'],rings:['00AQ','00AR','00DR'],
 chartCover:['006C'],basisSheaf:['009H'],
 regularGlue:['00EI'],bundlePullback:['001U'],setLimits:['002U'],
 abelian:['09SE','00ZX','010M','0033']
};
const fundamentalGroup=model('fundamental group',[
 b(r`\mathcal A`,r`\mathbf{Top}_*`,'Pointed topological spaces with basepoint-preserving continuous maps.'),
 b(r`\mathcal B`,r`\mathbf{Groups}`),
 b('F',r`\pi_1`,'The functor assigning the group of based loops up to based homotopy.'),
 b('x,y',r`(S^1,1),(S^1,1)`),
 b(r`\phi`,r`(z\mapsto z^2)`)
],r`\[
\begin{gathered}
F(\phi)[\gamma]=[\phi\circ\gamma],\\
F(\phi):\mathbb Z\xrightarrow{\times2}\mathbb Z
\end{gathered}
\]`,'',r`Winding number gives a geometric invariant of loops. Sending loops along a map also gives a map of their invariants, and this must respect composition.`);
const singularHomology={...model('singular homology',[],'',''),points:[
 r`\(\mathcal A=\mathbf{Top}\) of topological spaces.`,
 r`\(\mathcal B=\mathbf{Ab}\) of abelian groups.`,
 r`\[
\begin{aligned}
F=H_n(-;\mathbb Z):\mathbf{Top}&\longrightarrow\mathbf{Ab}\\
X&\longmapsto H_n(X;\mathbb Z)
\end{aligned}
\]`,
 r`For a morphism \(f:X\to Y\) in the category \(\mathbf{Top}\),
\[
F(f)=f_*:H_n(X;\mathbb Z)\longrightarrow H_n(Y;\mathbb Z)
\]
is a homomorphism of abelian groups.`,
 r`\[
(f\circ g)_*=f_*\circ g_*\qquad\text{(functoriality)}
\]`
]};
const tangentSpace=model('tangent space',[
 b(r`\mathcal A`,r`\mathbf{Man}_*`,'Pointed smooth manifolds and smooth maps preserving the marked points.'),
 b(r`\mathcal B`,r`\mathbf{Vect}_{\mathbb R}`),
 b('F',r`((M,p)\mapsto T_pM)`),
 b('x',r`(M,p)`),
 b('y',r`(N,\phi(p))`),
 b(r`\phi`,r`M\to N`),
 b(r`F(\phi)`,r`d\phi_p:T_pM\to T_{\phi(p)}N`)
],r`\[
d(g\circ f)_p=dg_{f(p)}\circ df_p
\]`,'',r`The differential replaces a smooth map by its linear approximation at a point. The chain rule says that these approximations still compose.`);
const bundlesOver=model('vector bundles',[
 b(r`\mathcal C`,r`\mathbf{Man}`)
],r`\[
\begin{CD}
E @>{u}>> F \\
@V{p}VV @VV{q}V \\
X @= X
\end{CD}
\]
\[
u_x:E_x\longrightarrow F_x\quad\text{linear}.
\]`,r`The bundle projections are objects of \(\mathbf{Man}/X\), and bundle maps give morphisms there.`,r`Vector bundles \(p:E\to X\) and \(q:F\to X\) over a fixed smooth manifold \(X\).`);
const pointedSpacesUnder=model('pointed spaces',[
 b(r`\mathcal C`,r`\mathbf{Top}`),
 b('X',r`\{*\}`)
],r`\[
\begin{CD}
\{*\} @= \{*\} \\
@V{y_0}VV @VV{y'_0}V \\
Y @>>{u}> Y'
\end{CD}
\]
\[
\{*\}/\mathbf{Top}\cong\mathbf{Top}_*,
\qquad u(y_0)=y'_0.
\]`,'',r`A map \(\{*\}\to Y\) chooses a basepoint \(y_0\in Y\).`);
const hurewicz={...model('Hurewicz map',[],r`\[
\begin{gathered}
h_X:\pi_n(X,x_0)\longrightarrow H_n(X;\mathbb Z),\\
[\alpha:S^n\to X]\longmapsto\alpha_*[S^n].
\end{gathered}
\]
\[
\begin{CD}
\pi_n(X,x_0) @>{h_X}>> H_n(X;\mathbb Z) \\
@V{\pi_n(f)}VV @VV{H_n(f;\mathbb Z)}V \\
\pi_n(Y,y_0) @>>{h_Y}> H_n(Y;\mathbb Z)
\end{CD}
\]`,r`A based map from a sphere carries its fundamental class to a homology class.`,r`For fixed \(n\ge1\) and a based continuous map \(f:(X,x_0)\to(Y,y_0)\).`),source:{
 url:'https://people.math.rochester.edu/faculty/doug/otherpapers/MayConcise.pdf',
 label:'May, A Concise Course in Algebraic Topology, §15.1'
}};
const coordinateSpaces={...model('coordinate vector spaces',[],'',''),points:[
 r`\(\mathcal B=\mathbf{Vect}_{\mathbb R}\)`,
 {
  text:r`\(\mathcal A\) is the subcategory of \(\mathcal B\) with`,
  children:[
   r`\(\operatorname{Ob}(\mathcal A)=\{\mathbb R^n:n\geq 0\}\)`,
   r`\(\operatorname{Mor}(\mathbb R^n,\mathbb R^m)\cong\) \(\operatorname{Mat}_{m\times n}(\mathbb R)\), the set of \(m\times n\) matrices over \(\mathbb R\)`
  ]
 },
 'It is a full subcategory.'
]};
const matrixEquivalence=model('matrices',[
 b(r`\mathcal A`,r`\mathbf{Mat}_k`),
 b(r`\operatorname{Ob}(\mathcal A)`,r`\mathbb Z_{\ge0}`),
 b(r`\operatorname{Hom}_{\mathcal A}(n,m)`,r`\operatorname{Mat}_{m\times n}(k)`),
 b(r`\mathcal B`,r`\mathbf{Vect}^{\mathrm{fd}}_k`),
 b('F',r`(n\mapsto k^n,\ A\mapsto(v\mapsto Av))`),
 b('G',r`(V\mapsto \dim_k V,\ f\mapsto [f])`)
],r`\[
\begin{gathered}
G\circ F=\mathrm{id}_{\mathcal A},\\
\mathrm{id}_{\mathcal B}\xrightarrow{\sim}F\circ G.
\end{gathered}
\]`,r`Choose a basis for each \(V\), using the standard basis for \(k^n\). The coordinates \(V\to k^{\dim_k V}\) give the natural isomorphism.`,r`Composition in \(\mathbf{Mat}_k\) is matrix multiplication, and the identity at \(n\) is \(I_n\).`);
const dual=model('dual vector spaces',[
 finiteVect,b(r`\mathcal S`,r`\mathbf{Vect}^{\mathrm{fd}}_{\mathbb R}`),
 b('F',r`(V\mapsto V^*)`),
 b(r`\psi`,r`(V\to W)`),
 b(r`F(\psi)`,r`(\lambda\mapsto\lambda\circ\psi)`,r`Precomposition sends \(W^*\) to \(V^*\).`)
],r`\[
F(\phi\circ\psi)=F(\psi)\circ F(\phi)
\]`,r`Precomposition gives the reversed order.`);
const additionalExamples={
 '01II':[model('first-order neighbourhood',[
  b('R',r`\mathbb C[\epsilon]/(\epsilon^2)`),
  b('X',r`\operatorname{Spec}(R)`),
  b('x',r`(\epsilon)`),
  b('U',r`X`)
 ],r`\[
\begin{gathered}
\mathcal O_{X,x}\cong\mathbb C\{z\}/(z^2),\\
h\longmapsto h(0)+h'(0)\epsilon
\end{gathered}
\]`,'',r`The underlying space is a single point. Its structure ring also remembers the linear term of a Taylor expansion.`)]
};
const passageNotes={
 '004P':models.basis,
 '005A':models.compact,
 '002E':padicLimit,
 '002F':sphereColimit,
 '01ET':{...cechSpectral,examples:[cechSphere]},
 '01MN':{...twistCharts,examples:[{...twistSections,scope:"statement"},{...twistTensor,scope:"statement"}]},
 '01MS':twistCharts,
 '01MT':twistTensor,
 '01MU':twistTensor,
 '01MV':twistOpen,
 '01MW':twistOpen,
 '0B5I':twistSections,
 '01X9':cechAffine,
 '01XD':{...cechLine,examples:[cechSphere]},
 '01XT':{...cechPlane,examples:[cechLine]},
 '0BYD':planeCurveGenus,
 '02OQ':tangentDivisor,
 '02OR':tangentDivisor,
 '01X0':tangentDivisor,
 '0AYY':conicDegree,
 '0B05':conicIntersection,
 '001B':{...singularHomology,examples:[fundamentalGroup,tangentSpace].map(example=>({...example,scope:"statement"}))},
 '001D':coordinateSpaces,
 '001G':bundlesOver,
 '001H':pointedSpacesUnder,
 '001I':hurewicz,
 '001J':matrixEquivalence,
 '05SG':matrixEquivalence,
 '02C3':matrixEquivalence,
 '001N':dual,
 '006E':models.presheaf,
 '006K':models.abelianMorphism,
 '0106':models.kernel,
 '07BI':models.local,
 '01IJ':{...models.scheme,bindings:[...models.scheme.bindings,b(r`\Sch`,r`\text{the category of schemes}`)]},
 '01IL':model('punctured affine plane',[
  b('k',r`\mathbb F_2`),
  b('X',r`\operatorname{Spec}(k[x,y])`),
  b('U',r`X\setminus\{(x,y)\}`)
 ],r`\[
\Gamma(U,\mathcal O_U)=k[x,y,1/x]\cap k[x,y,1/y]=k[x,y]
\]`,r`An affine \(U\) would make \(U\hookrightarrow X\) an isomorphism by the equality of global rings. The origin lies outside \(U\).`),
};
const sectionNotes=Object.fromEntries(Object.entries(sectionGroups)
 .flatMap(([name,tags])=>tags.map(tag=>[tag,models[name]])));

export const noteTags=[...Object.keys(sectionNotes),...Object.keys(passageNotes)];

export function notesFor(sectionTag,passageTag){
 const passage=passageNotes[passageTag];
 const primary=passage?{...passage,scope:'statement'}:sectionNotes[sectionTag];
 if(!primary)return {tag:sectionTag,examples:[]};
 return {
  tag:passage?passageTag:sectionTag,
  examples:[primary,...(primary.examples??additionalExamples[sectionTag]??[])]
 };
}
