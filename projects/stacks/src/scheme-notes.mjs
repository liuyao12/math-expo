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
const naturalEquivalences={
 url:'https://www.ams.org/journals/tran/1945-058-00/S0002-9947-1945-0013131-6/S0002-9947-1945-0013131-6.pdf',
 label:'Eilenberg and Mac Lane, General Theory of Natural Equivalences (1945), introduction'
};
const finiteVect=b(r`\mathcal C`,r`\mathbf{Vect}^{\mathrm{fd}}_{\mathbb R}`,'Finite-dimensional real vector spaces with linear maps.');
const models={
 topology:model('A manifold is locally Euclidean',[
  b('X',r`M`),b('U',r`\text{an open chart domain in }M`),
  b('V',r`\text{an open subset of }\mathbb R^n`),
  b('f',r`\varphi:U\xrightarrow{\sim}V`)
 ],r`\[
W\subset V\text{ open}\ \Longrightarrow\ \varphi^{-1}(W)\text{ open}
\]`,'',r`A coordinate chart carries Euclidean neighbourhoods back to the manifold. Both directions of the chart are continuous.`),
 basis:model('Open balls generate the metric topology',[
  b('X',r`(X,d)\text{ a metric space}`),
  b(r`\mathcal B`,r`\{B(x,r):x\in X,\ r>0\}`)
 ],r`\[
x\in U\text{ open}\ \Longrightarrow\ B(x,r)\subset U
\]`,r`Choose a sufficiently small \(r>0\) at each \(x\).`,r`Open balls are why continuity between metric spaces can be tested with the usual \(\varepsilon\) and \(\delta\).`),
 irreducible:model('An algebraic line is one piece',[A,b('Z',r`V(z(z-1))`),b(r`\eta`,r`(0)`)],r`\[
\overline{\{(0)\}}=X
\]`,r`Every proper closed subset is finite, so any two nonempty opens meet.`,r`An algebraic curve can have separate branches even when it is connected. Irreducibility asks whether it is a single algebraic piece.`),
 compact:model('A finite atlas for local formulas',[
  b('X',r`M\text{ a compact manifold}`),b(r`\mathcal U`,r`\{U_i\}_{i\in I}\text{ a chart cover}`)
 ],r`\[
\exists\,J\subset I\text{ finite}\quad X=\bigcup_{i\in J}U_i
\]`,'',r`A compact manifold admits a finite atlas. Any atlas already covering it has a finite subcover.`),
 specialization:model('From a generic point to a particular value',[A,b('x',r`\eta=(0)`),b("x'",r`(z-a)`)],r`\[
(0)\subset(z-a)\quad\Longrightarrow\quad x'\in\overline{\{x\}}
\]`,'',r`At the generic point, a rational formula is evaluated in \(\mathbb C(z)\). At \(a\), any formula regular there can be specialized by setting \(z=a\).`),
 rings:model('Functions on a curve inherit a ring',[
  b('R',r`\mathbb C[z,w]`),
  b('I',r`(w-z^2)`),
  b(r`\varphi`,r`(f(z,w)\mapsto f(z,z^2))`)
 ],r`\[
R/I\cong\mathbb C[z]
\]`,'',r`Two polynomials define the same function on the parabola when their difference vanishes there.`),
 modules:model('A vector bundle map is linear over functions',[
  b('R',r`C^\infty(X)`),b('M',r`\Gamma(X,E)`),b('N',r`\Gamma(X,F)`),
  b('u',r`E\to F\text{ over }X`)
 ],r`\[
\begin{gathered}
\Gamma(u)(s)(x)=u_x(s(x)),\\
\Gamma(u)(hs)=h\,\Gamma(u)(s)
\end{gathered}
\]`,'',r`The linear map may vary with the point. Linearity on each fibre gives module linearity on sections.`),
 snake:model('The boundary of a lifted cycle',[
  b(r`A_\bullet`,r`C_\bullet(Y)`),b(r`B_\bullet`,r`C_\bullet(X)`),
  b(r`C_\bullet`,r`C_\bullet(X,Y)`)
 ],r`\[
\begin{gathered}
0\to A_\bullet\to B_\bullet\to C_\bullet\to0,\\
\delta[c]=[\partial b]\in H_{n-1}(Y).
\end{gathered}
\]`,r`Lift the relative cycle \(c\) to \(b\) in \(X\). Its boundary lies in \(Y\).`,r`In the long exact sequence of a pair, the connecting map \(H_n(X,Y)\to H_{n-1}(Y)\) is the lift-and-boundary construction from the snake lemma.`),
 colimits:model('Remember a function only near the point',[
  b('I',r`\{\text{neighbourhoods of }a\}`,'Ordered by reverse inclusion.'),
  b('M_U',r`\operatorname{Hol}(U)`),
  b('M',r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}`)
 ],r`\[
\begin{gathered}
M=\varinjlim_{U\ni a}\operatorname{Hol}(U),\\
[h]_a=[g]_a\iff h|_W=g|_W
\end{gathered}
\]`,r`Here \(W\) is some common neighbourhood of \(a\).`,r`A Taylor series needs a neighbourhood of its centre, but the germ should forget how large that neighbourhood was.`),
 localization:model('Cramer’s rule works where the determinant is invertible',[
  b('R',r`k[a_{ij}:1\le i,j\le n]`),
  b('A',r`(a_{ij})`),
  b('S',r`\{(\det A)^m:m\ge0\}`),
  b(r`S^{-1}R`,r`R[1/\det A]`)
 ],r`\[
A^{-1}=\frac{\operatorname{adj}(A)}{\det A}
\]`,'',r`Localizing the coordinate ring of all matrices at the determinant gives the coordinate ring of \(\operatorname{GL}_n\).`),
 local:model('Which germs have a reciprocal?',[
  b('R',r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}\cong\mathbb C\{z-a\}`),
  b(r`\mathfrak m`,r`(z-a)`),
  b(r`\kappa`,r`\mathbb C`)
 ],r`\[
h\in R^\times\iff h(a)\ne0
\]`,'',r`A function nonzero at \(a\) is nonzero on a smaller neighbourhood. Its reciprocal defines a germ there.`),
 spectrum:model('Recover points and components from functions',[
  b('R',r`\mathbb C[x,y]/(xy)`),b('X',r`\operatorname{Spec}R`),
  b(r`\mathfrak p`,r`(x-a,y-b),\quad ab=0`),
  b(r`\eta_1,\eta_2`,r`(x),(y)`)
 ],r`\[
\overline{\{\eta_1\}}=V(x),\qquad \overline{\{\eta_2\}}=V(y)
\]`,'',r`Evaluation recovers the complex points of the two axes. Prime ideals also give each whole axis a generic point.`),
 sheaf:model('When do local holomorphic formulas give one function?',[
  X,U,b(r`\{U_i\}`,r`\text{an open cover of }U`),
  F,b(r`\mathcal F(U)`,r`\{h:U\to\mathbb C\mid h\text{ holomorphic}\}`),b(r`\rho^U_V`,r`(h\mapsto h|_V)`)
 ],r`\[
\begin{gathered}
h_i|_{U_i\cap U_j}=h_j|_{U_i\cap U_j}\\
\Longrightarrow\ \exists!\,h:\ h|_{U_i}=h_i
\end{gathered}
\]`,'',r`A function can have different formulas on different patches. Agreement on the overlaps is the condition that lets those formulas define a global holomorphic function.`),
 moduleSheaf:model('Differential forms are a module over smooth functions',[
  b('X',r`M\text{ a smooth manifold}`),
  b(r`\mathcal O(U)`,r`C^\infty(U)`),
  b(r`\mathcal F(U)`,r`\Gamma(U,T^*M)`)
 ],r`\[
\begin{gathered}
\omega=\sum_j a_j\,dx^j,\\
h\omega=\sum_j(ha_j)\,dx^j.
\end{gathered}
\]`,'',r`A form can be multiplied by a function before or after changing coordinates. This makes the sheaf of one-forms a module over the sheaf of smooth functions.`),
 stalk:model('A holomorphic germ is its convergent Taylor series',[
 X,b('x',r`a\in\mathbb C`),
 b('t',r`z-a`),F,
 b(r`\mathcal F_x`,r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}\cong\mathbb C\{t\}`,r`The notation \(\mathbb C\{t\}\) means power series in \(t\) with a positive radius of convergence.`),
 b(r`[f]_a`,r`\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}t^n`)
 ],r`\[
[f]_a=[g]_a\quad\Longleftrightarrow\quad f^{(n)}(a)=g^{(n)}(a)\ \ \forall n\ge0
\]`,r`Every convergent series defines a germ.`,r`To study a function at one point, keep its whole Taylor expansion there. The value alone loses the order of vanishing.`),
 moduleStalk:model('A germ of a differential remembers more than its fibre',[
  X,O,b('x',r`0`),
  b(r`\mathcal F`,r`\Omega_X^1`),
  b(r`\mathcal F_x`,r`\mathbb C\{z\}\,dz`)
 ],r`\[
\mathcal F_x/\mathfrak m_x\mathcal F_x\cong\mathbb C\,dz|_x
\]`,'',r`The germ remembers the entire Taylor series of the coefficient. Its value in the cotangent fibre keeps only the constant term.`),
 exactSheaf:model('Closed forms are locally exact',[
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
 chartCover:model('The sphere needs a chart at infinity',[
  sphereX,b('U',r`X`),
  b('U_0',r`X\setminus\{\infty\}`),b('U_\infty',r`X\setminus\{0\}`)
 ],r`\[
X=U_0\cup U_\infty,\qquad U_0\cap U_\infty=\mathbb C^\times
\]`,'',r`The coordinates \(z\) and \(1/z\) let us use planar holomorphic functions near every point of the sphere.`),
 basisSheaf:model('Build the sheaf from small disks',[
  X,b(r`\mathcal B`,r`\{D(a,r):r>0\}`),
  b(r`\mathcal F(B)`,r`\operatorname{Hol}(B),\quad B\in\mathcal B`)
 ],r`\[
h_B|_C=h_{B'}|_C\qquad(C\in\mathcal B,\ C\subset B\cap B')
\]`,'',r`A local description on disks should already determine the functions on every open set. Glue the disk sections by testing agreement on smaller disks.`),
 sheafify:model('Locally constant means one constant per component',[
  b('X',r`\mathbb C\setminus\mathbb R`),b('A',r`\mathbb C`),
  b(r`\mathcal F(U)`,r`A`),
  b(r`\mathcal F^\#(U)`,r`\{h:U\to A\text{ locally constant}\}`)
 ],r`\[
\mathcal F(X)\longrightarrow\mathcal F^\#(X),\qquad c\longmapsto(c,c)
\]`,'',r`A holomorphic function with zero derivative is constant on each component. Sheafification turns the presheaf of single constants into precisely these local solutions.`),
 functorial:model('Pull a function back by a holomorphic map',[b('X',r`\mathbb C_z`),b('Y',r`\mathbb C_t`),b('f',r`(z\mapsto z^2)`),b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),b(r`\mathcal G`,r`\mathcal O_Y^{\mathrm{an}}`)],r`\[
\begin{gathered}
(f_*\mathcal F)(V)=\mathcal F(f^{-1}V),\\
f^\sharp(h)=h\circ f
\end{gathered}
\]`,r``),
 ringed:model('A map should preserve vanishing at the corresponding points',[
  b('X',r`\mathbb C_z`),b('Y',r`\mathbb C_t`),
  b('x',r`0`),b('f',r`(z\mapsto z^2)`),
  b(r`f^\sharp_x`,r`\mathbb C\{t\}\longrightarrow\mathbb C\{z\}`)
 ],r`\[
\begin{gathered}
t\longmapsto z^2,\\
(f_x^\sharp)^{-1}((z))=(t)
\end{gathered}
\]`,'',r`A holomorphic map pulls functions back by substitution. A germ vanishes at the image point exactly when its pullback vanishes at the source point.`),
 open:model('Use one chart without changing its local functions',[
  sphereX,b('U',r`X\setminus\{\infty\}\cong\mathbb C_z`),
  b('j',r`(U\hookrightarrow X)`),
  b(r`\mathcal O_U`,r`\mathcal O^{\mathrm{an}}_X|_U`)
 ],r`\[
\begin{gathered}
\mathcal O_U(V)=\operatorname{Hol}(V)\quad(V\subseteq U),\\
\mathcal O_{U,a}=\mathcal O_{X,a}
\end{gathered}
\]`,'',r`Passing to a coordinate chart discards the rest of the space but keeps the same function theory at each point of the chart.`),
 algebraGlue:model('Check vanishing point by point',[
  R,b('M',r`R/(z(z-1))`),
  b(r`\mathfrak m_0,\mathfrak m_1`,r`(z),(z-1)`)
 ],r`\[
\begin{gathered}
M\longrightarrow M_{\mathfrak m_0}\times M_{\mathfrak m_1},\\
[h]\longmapsto(h(0),h(1))
\end{gathered}
\]`,'',r`A function on two reduced points is zero if it vanishes at both. Localization gives a test that also works for modules on nonreduced spaces.`),
 regularGlue:model('Can a rational formula have a pole anywhere?',[
  R,b('f_1,f_2',r`z,1-z`),
  b('R_{f_1}',r`\mathbb C[z,1/z]`),
  b('R_{f_2}',r`\mathbb C[z,1/(1-z)]`)
 ],r`\[
\begin{gathered}
R_{f_1}\cap R_{f_2}=R\\
\text{inside }\mathbb C(z)
\end{gathered}
\]`,'',r`Two local formulas that agree off their possible poles describe one rational function. At each point, at least one formula is regular.`),
 affine:model('The regular functions on the affine line',[
  R,A,b(r`\mathcal O_X`,r`\widetilde R`),
  b(r`\mathcal O_X(D(z))`,r`\mathbb C[z,z^{-1}]`),
  b(r`\mathcal O_{X,(z-a)}`,r`\mathbb C[z]_{(z-a)}`)
 ],r`\[
\mathcal O_{X,(z-a)}=\{p/q:q(a)\ne0\}
\]`,r`These rational germs embed into the holomorphic germs at \(a\).`,r`The affine line needs a function ring on each open set, just as a Riemann surface does. The algebraic rule allows rational formulas wherever their denominators are invertible.`),
 affineMaps:model('Maps pull functions in the opposite direction',[b('R',r`\mathbb C[t]`),b('S',r`\mathbb C[z]`),b(r`\varphi`,r`(p(t)\mapsto p(z^2))`),b('f',r`\operatorname{Spec}(S)\longrightarrow\operatorname{Spec}(R)`)],r`\[
\begin{gathered}
(z-a)\longmapsto(t-a^2),\\
(0)\longmapsto(0)
\end{gathered}
\]`,r`Take inverse images under \(\varphi\).`),
 scheme:model('The algebraic atlas behind the Riemann sphere',[
  b('X',r`\mathbb P^1_{\mathbb C}`),
  b('U',r`\operatorname{Spec}(\mathbb C[z])`),
  b('V',r`\operatorname{Spec}(\mathbb C[w])`)
 ],r`\[
\begin{gathered}
U\cap V=\operatorname{Spec}\bigl(\mathbb C[z,z^{-1}]\bigr),\\
w=z^{-1}
\end{gathered}
\]`,r`The gluing uses regular functions. On complex points the same coordinate change gives the holomorphic atlas of the sphere.`,r`One affine chart misses infinity. Gluing affine charts with compatible function rings gives a space that is algebraic near every point.`),
 category:model('Vector spaces and linear maps over a field',[
  b(r`\mathcal C`,r`\mathbf{Vect}_k`),
  b('x,y,z',r`U,V,W`),
  b(r`\psi`,r`U\to V`),
  b(r`\phi`,r`V\to W`)
 ],r`\[
(\phi\circ\psi)(u)=\phi(\psi(u))
\]`,'',r`The objects are vector spaces over \(k\). The morphisms are \(k\)-linear maps, with the usual composition and identity maps.`),
 bundlePullback:model('Pull a vector bundle back along a map',[
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
 setLimits:model('Assemble compatible local functions',[
  b('U,V',r`\text{open subsets of }\mathbb C`),
  b('A,B',r`\operatorname{Hol}(U),\operatorname{Hol}(V)`),
  b('C',r`\operatorname{Hol}(U\cap V)`)
 ],r`\[
\operatorname{Hol}(U\cup V)\cong A\times_C B
\]`,'',r`The limit of the restriction diagram is the set of choices that agree on the overlap.`),
 limits:model('Compatibility is an equalizer',[b('A',r`\prod_i\operatorname{Hol}(U_i)`),b('B',r`\prod_{i,j}\operatorname{Hol}(U_i\cap U_j)`),b('f',r`(s_i)\mapsto(s_i|_{U_i\cap U_j})_{i,j}`),b('g',r`(s_i)\mapsto(s_j|_{U_i\cap U_j})_{i,j}`)],r`\[
\operatorname{Eq}(f,g)\cong\operatorname{Hol}\bigl(\textstyle\bigcup_i U_i\bigr)
\]`,r`The equalizer condition is agreement on overlaps.`),
 adjoint:model('The tensor–Hom adjunction for bilinear maps',[
  b('F',r`-\otimes_k V`),b('G',r`\operatorname{Hom}_k(V,-)`)
 ],r`\[
\begin{gathered}
\operatorname{Hom}_k(U\otimes_k V,W)\\
\cong \operatorname{Hom}_k(U,G(W)),\\
h\longmapsto (u\mapsto(v\mapsto h(u\otimes v))).
\end{gathered}
\]`,'',r`The tensor–Hom adjunction is the same bilinear operation read in two ways.`),
 idempotent:model('An idempotent selects an open and closed part',[
  b('R',r`C(X,\mathbb R)`),b('U',r`\text{an open and closed subset of }X`),
  b('e',r`\mathbf 1_U`)
 ],r`\[
\begin{gathered}
e^2=e,\\
R\cong eR\times(1-e)R
\end{gathered}
\]`,r`The two factors are the function rings on \(U\) and \(X\setminus U\).`,r`A continuous real-valued idempotent takes only the values zero and one. Its level sets give a decomposition into open and closed parts.`),
 finite:model('Finitely many equations and generators',[R,b('M',r`R^{\oplus n}`),b('S',r`\mathbb C[z,w]/(w^2-z)`)],r`\[
\begin{gathered}
M=\bigoplus_{i=1}^n R e_i,\\
S=\mathbb C[z,w]/(w^2-z)
\end{gathered}
\]`,r`The first presentation uses \(n\) generators and the second uses one relation.`),
 abelian:model('The kernel gives solutions and the cokernel gives obstructions',[
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
models.noetherian=model('Infinitely many polynomial equations reduce to finitely many',[
 b('R',r`k[x_1,\ldots,x_n]`),b('X',r`\operatorname{Spec}(R)`),
 b('I',r`(f_1,f_2,\ldots)`)
],r`\[
V(I)=V(f_1,\ldots,f_N)\quad\text{for some }N
\]`,'',r`By the Hilbert basis theorem, adding equations one at a time eventually stops shrinking the common zero set.`);
models.constructible=model('Rank strata of matrices',[
 b('X',r`\mathbb A_k^{mn}`),b('A',r`(a_{ij})_{m\times n}`),
 b('I_s',r`\text{the ideal of the }s\times s\text{ minors}`)
],r`\[
\{\operatorname{rank}A=r\}
=V(I_{r+1})\setminus V(I_r)
\]`,'',r`An exact rank asks that all minors of size \(r+1\) vanish and some minor of size \(r\) be nonzero. These are closed and open conditions, respectively.`);
models.nakayama=model('A fibre can test a finite module',[b('R',r`\mathbb C\{t\}`),b(r`\mathfrak m`,r`(t)`),b('M',r`R^{\oplus n}`)],r`\[
\begin{aligned}
 \det A(0)\ne0 &\Longrightarrow \det A\in R^\times\\
               &\Longrightarrow A\in\operatorname{GL}_n(R).
\end{aligned}
\]`,r`An invertible matrix on the fibre lifts to an invertible matrix of germs.`);
models.connected=model('The components of a manifold',[
 b('X',r`M\text{ a manifold}`),b('x',r`x\in M`),
 b('Z',r`\text{the path component of }x`)
],r`\[
H_0(M;\mathbb Z)\cong\bigoplus_{C\in\pi_0(M)}\mathbb Z
\]`,'',r`Manifolds are locally path connected, so connected components are path components. In degree zero, homology has one generator for each component.`);
models.natural=model('Exterior differentiation commutes with pullback',[
 b(r`\mathcal A`,r`\mathbf{Man}^{\mathrm{op}}`),
 b(r`\mathcal B`,r`\mathbf{Vect}_{\mathbb R}`),
 b('F,G',r`\Omega^q,\Omega^{q+1}`),b('t_M',r`d:\Omega^q(M)\to\Omega^{q+1}(M)`)
],r`\[
f^*(d\omega)=d(f^*\omega)
\]`,'',r`For every smooth \(f:M\to N\), exterior differentiation can be taken before or after pulling a form back from \(N\).`);
models.twoFibre=model('A vector bundle with trivialized determinant',[
 b(r`\mathcal A`,r`\operatorname{Vect}_r(M)^\simeq`,r`The groupoid of rank-\(r\) complex vector bundles.`),
 b(r`\mathcal B`,r`\{*\}`),
 b(r`\mathcal C`,r`\operatorname{Line}(M)^\simeq`),
 b('F',r`(E\mapsto \det E)`),
 b('G',r`(*\mapsto M\times\mathbb C)`)
],r`\[
\alpha:\det E\xrightarrow{\sim}M\times\mathbb C
\]`,'',r`The fibre over the trivial line has objects \((E,*,\alpha)\). The trivialization is part of the data.`);
models.over=model('Covering spaces over a fixed base',[
 b(r`\mathcal C`,r`\mathbf{Top}`),
 b('X',r`\text{the base space}`),
 b('p,q',r`E\to X,\ F\to X`)
],r`\[
u:(E,p)\to(F,q)\quad\Longleftrightarrow\quad q\circ u=p
\]`,'',r`In the category of spaces over \(X\), a map between two coverings sends each fibre into the fibre over the same point. A deck transformation is an automorphism over \(X\).`);
models.presheaf=model('Holomorphic functions can be restricted to smaller domains',[
 b('X',r`\text{a Riemann surface}`),b('U',r`\text{an open subset of }X`),
 b(r`\mathcal F`,r`\mathcal O^{\mathrm{an}}_X`),
 b(r`\mathcal F(U)`,r`\{h:U\to\mathbb C\mid h\text{ holomorphic}\}`),
 b(r`\rho^U_V`,r`(h\mapsto h|_V)`),
 b(r`\mathcal G`,r`\Omega_X^1`),
 b(r`\varphi`,r`d:h\mapsto dh`)
],r`\[
(dh)|_V=d(h|_V)
\]`,r`The kernel consists of locally constant functions.`,r`The derivative is computed on each domain, and the formula survives restriction. This compatibility makes differentiation a morphism of presheaves.`);
models.abelianMorphism={...models.presheaf,title:'Differential operators respect addition',
 check:r`\[
 d(ah+bk)=a\,dh+b\,dk
 \]`,
 result:r`Here \(a,b\in\mathbb C\) are constant scalars.`
};
models.solutionSheaf=model('The kernel is a sheaf of solutions',[X,U,
 b(r`\mathcal O_X`,r`\underline{\mathbb C}`,'The sheaf of locally constant complex-valued functions, used as scalars.'),
 b(r`\mathcal F`,r`\mathcal O_{\mathbb C}^{\mathrm{an}}`,'Holomorphic functions, as a module over locally constant complex scalars.'),
 b(r`\mathcal G`,r`\mathcal F`),
 b(r`\varphi`,r`D:h\mapsto h'-h`),
 b(r`\operatorname{Ker}(\varphi)(U)`,r`\{h\in\operatorname{Hol}(U):h'-h=0\}`)
],r`\[
\varphi(h)=0\quad\Longleftrightarrow\quad(e^{-z}h)'=0
\]`,r`The constant of integration is locally constant on \(U\).`,r`The scalar sheaf is \(\underline{\mathbb C}\), whose sections have zero derivative.`);
models.kernel=model('A kernel represents homogeneous solutions',[
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
const twistCharts=model('A projective coordinate is a section of a line bundle',[
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
const twistSections=model('Find the global sections from the gluing rule',[
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
const twistTensor=model('Multiply the generators on each chart',[
 projectiveRing,projectiveLine,
 b(r`\mathcal O_X(n)|_{U_i}`,r`\mathcal O_{U_i}\,T_i^n`),
 b(r`\mathcal O_X(m)|_{U_i}`,r`\mathcal O_{U_i}\,T_i^m`)
],r`\[
\begin{gathered}
T_i^n\otimes T_i^m\longmapsto T_i^{n+m},\\
z^n z^m=z^{n+m}
\end{gathered}
\]`,r`The tautological frames \((1,z)\) and \((w,1)\) differ by \(z^{-1}\), giving \(\mathcal O_X(-1)\).`);
const twistOpen=model('A coordinate section picks out an affine chart',[
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
const tangentDivisor=model('A tangent line cuts out a double point',[
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
const conicDegree=model('The degree counts both copies at the point of tangency',[
 conicCurve,doublePoint,
 b(r`\mathcal E`,r`\mathcal O_X`),
 b(r`\mathcal E(D)`,r`\mathcal O_X(D)\cong\mathcal L`)
],r`\[
\deg\mathcal L=\deg D=\dim_k k[z]/(z^2)=2
\]`,r`The secant \(T_1=0\) gives two simple zeros of a section of the same bundle.`);
const conicIntersection=model('Compute the intersection multiplicity by local length',[
 b('X',r`\mathbb P^2_k`,'The ambient nonsingular surface over an algebraically closed field.'),
 b('V',r`V_+(T_2)`),
 b('W',conic,'The smooth conic.'),
 b(r`Z=\{\xi\}`,r`\{[1:0:0]\}`),
 b('f_1',r`T_2/T_0`)
],r`\[
e(X,V\cdot W,Z)=\operatorname{length}\bigl(k[z]_{(z)}/(z^2)\bigr)=2
\]`,r`The two factors of the filtration by \(z\) have length one.`);

const cechLine=model('Which overlap terms can be removed by changing local sections?',[
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
const cechAffine=model('Split an overlap section on an affine line',[
 b('U',r`\operatorname{Spec}(k[z])`),
 b(r`\mathcal U`,r`\{D(z),D(1-z)\}`,r`These opens cover \(U\) because \(z+(1-z)=1\).`),
 b(r`\mathcal F`,r`\mathcal O_U`)
],r`\[
\frac{1}{z(1-z)}=\frac1z+\frac1{1-z}
\]`,r`The summands extend to the two charts. The lemma gives the same splitting for every overlap section.`);
const cechSphere={...model('The residue on the Riemann sphere',[
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
 source:{url:'https://www.numdam.org/item/SB_1951-1954__2__213_0/',label:'Serre’s Bourbaki exposé on Cartan’s Theorem B'}};
const cechPlane=model('The residue idea with three projective charts',[
 b('R',r`k`),
 b('n,d',r`2,-3`),
 b('X',r`\mathbb P^2_k`),
 b(r`\mathcal F`,r`\mathcal O_X(-3)`),
 b(r`\eta`,r`\frac{1}{T_0T_1T_2}`)
],r`\[
H^2(X,\mathcal F)=k\cdot\left[\frac1{T_0T_1T_2}\right]
\]`,r`A double overlap inverts only two coordinates. The only degree minus three monomial with all three exponents negative survives.`,r`On the sphere, a Laurent term survives because neither chart can supply it. On the projective plane, look for a term on the triple overlap that none of the double overlaps can supply.`);
const planeCurveGenus=model('Read the genus from the equation of the curve',[
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
const affineModule=model('A vector bundle restricts by localization',[
 b('A',r`\Gamma(X,\mathcal O_X)`),
 b('X',r`\operatorname{Spec} A`),
 b('M',r`\Gamma(X,E)`),
 b(r`\mathcal F`,r`\widetilde M`)
],r`\[
\Gamma(D(f),E)=M_f
\]`,'',r`Here \(E\) is an algebraic vector bundle, viewed as its sheaf of sections. On an affine scheme, the module of global sections recovers the bundle.`);
const closedPoint=model('A closed immersion remembers the equation',[
 b('X',r`\operatorname{Spec} k[z]`),
 b('Z',r`\operatorname{Spec}(k[z]/(z^2))`),
 b('i',r`Z\hookrightarrow X`)
],r`\[
i^{-1}(D(f))=\operatorname{Spec}\bigl((k[z]/(z^2))_f\bigr)
\]`,'',r`The equations \(z=0\) and \(z^2=0\) have the same zero set. The quotient for \(z^2=0\) also retains the linear term of a function at the origin.`);
const affineBundle=model('The projection from a vector bundle is affine',[
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
const gradedPolynomial=model('The graded ring of projective space',[
 b('S',r`k[t_0,\ldots,t_n]`),
 b('S_d',r`\left\{\begin{gathered}\text{homogeneous polynomials}\\\text{of degree }d\end{gathered}\right\}`),
 b(r`\operatorname{Proj}(S)`,r`\mathbb P^n_k`)
],'','');
const projCharts=model('Affine charts from homogeneous coordinates',[
 b('S',r`k[T_0,\ldots,T_n]`),
 b('X',r`\operatorname{Proj}S=\mathbb P^n_k`),
 b('U_i',r`D_+(T_i)`)
],r`\[
\begin{gathered}
S_{(T_i)}=k[T_j/T_i:j\ne i],\\
U_i=\operatorname{Spec}S_{(T_i)}\cong\mathbb A_k^n.
\end{gathered}
\]`,'',r`Normalizing the nonzero coordinate to one gives the usual affine chart. The ratios are precisely the degree-zero generators after inverting \(T_i\).`);
const properLine=model('A family has a limit at infinity',[
 b('S',r`\operatorname{Spec}\mathbb C`),
 b('X',r`\mathbb P^1_{\mathbb C}`),
 b('f',r`X\to S`),
 b('R',r`\mathbb C[[t]]`),
 b('K',r`\mathbb C((t))`)
],r`\[
[1:t^{-1}]=[t:1]\longrightarrow [0:1]\quad(t=0)
\]`,'',r`A point that runs off the affine chart can still have a limit on the sphere. The valuative criterion captures this extension property algebraically.`);
const padicLimit={...model('The inverse limit of congruences',[
 b(r`\mathcal C`,r`\mathbf{CRing}`),
 b(r`\mathcal I`,r`(\mathbb Z_{\ge1},\le)^{\mathrm{op}}`,
  r`There is one arrow \(m\to n\) when \(m\ge n\). It acts by reduction modulo \(p^n\).`),
 b('M_n',r`\mathbb Z/p^n\mathbb Z`),
 b('p_n',r`\bigl((a_j)_j\mapsto a_n\bigr)`)
],r`\[
\begin{aligned}
\mathbb Z_p&=\varprojlim_n\mathbb Z/p^n\mathbb Z,\\
a_{n+1}&\equiv a_n\pmod{p^n}.
\end{aligned}
\]`,'',r`Reducing from \(p^{n+1}\) to \(p^n\) forgets the last digit. A \(p\)-adic integer is one compatible choice of residue at every precision.`),
 source:{url:'https://math.mit.edu/classes/18.782/2023sp/LectureNotes4.pdf',label:'Sutherland, Introduction to Arithmetic Geometry, Lecture 4'}};
const sphereColimit=model('The infinite sphere from finite spheres',[
 b(r`\mathcal C`,r`\mathbf{Top}`),
 b(r`\mathcal I`,r`(\mathbb Z_{\ge0},\le)`,
  r`There is one arrow \(n\to m\) when \(n\le m\). It acts by appending \(m-n\) zero coordinates.`),
 b('M_n',r`S^n`),
 b('s_n',r`S^n\hookrightarrow S^\infty`)
],r`\[
\begin{gathered}
S^n\hookrightarrow S^{n+1},\quad x\mapsto(x,0),\\
\varinjlim_n S^n=S^\infty=\bigcup_{n\geq0}S^n.
\end{gathered}
\]`,'',r`A map out of \(S^\infty\) is continuous exactly when its restrictions to all the finite spheres are continuous.`);
const triangulatedChains=model('Chains of a triangulated manifold',[
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
const pairConnectingMap={...model('The connecting map for a manifold and its boundary',[
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
const injectiveExample=model('Division lets homomorphisms extend',[
 b('A',r`\mathbb Z`),
 b('I',r`\mathbb Q`),
 b('B',r`n\mathbb Z\subset A`)
],r`\[
\varphi:B\to I,\qquad \widetilde\varphi(1)=\varphi(n)/n
\]`,'',r`An extension may require dividing the prescribed value. In an injective abelian group such an extension exists for every inclusion.`);
const injectivePoint=model('Put each Taylor germ in a sheaf with independent point data',[
 X,b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),
 b('I_a',r`\mathcal F_a=\mathbb C\{z-a\}`,r`Its additive group is divisible, hence injective.`),
 b(r`\mathcal I(U)`,r`\prod_{a\in U} I_a`)
],r`\[
h\longmapsto([h]_a)_{a\in U}
\]`,'',r`Taylor series of one holomorphic function must agree where they meet. In the larger sheaf each germ can be chosen independently, so any family extends to a larger open set.`);
const injectiveModulePoint=model('Enlarge the stalks while keeping their local scalars',[
 X,b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),
 b('R_a',r`\mathbb C\{z-a\}`),
 b('I_a',r`\operatorname{Frac}(R_a)`,r`The field of meromorphic germs at \(a\).`)
],r`\[
\begin{gathered}
\mathcal I(U)=\prod_{a\in U} I_a,\\
h\longmapsto([h]_a)_{a\in U}
\end{gathered}
\]`,r`Each \(R_a\) is a discrete valuation ring. Its fraction field is an injective \(R_a\)-module.`,r`Allow meromorphic germs at each point independently. This gives an injective sheaf of modules containing the holomorphic functions, with multiplication defined germ by germ.`);
const injectiveResolution=model('Resolve compatibility one quotient at a time',[
 X,b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),
 b(r`\mathcal I^0(U)`,r`\prod_{a\in U}\mathcal F_a`),
 b(r`\mathcal Q`,r`\mathcal I^0/\mathcal F`)
],r`\[
\begin{aligned}
\mathcal I^1(U)&=\prod_{a\in U}\mathcal Q_a,\\
\mathcal I^0&\longrightarrow\mathcal Q\longrightarrow\mathcal I^1.
\end{aligned}
\]`,'',r`The first enlargement allows independent Taylor germs. The quotient records what those choices add beyond actual holomorphic functions. Repeat with that quotient to build an injective resolution of abelian sheaves.`);
const residueObstruction=model('Can one prescribe a single nonzero residue?',[
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
const deRhamCohomology=model('Sheaf cohomology via differential forms',[
 b('X',r`M\text{ a smooth manifold}`),
 b(r`\mathcal F`,r`\underline{\mathbb R}_M`)
],r`\[
\begin{gathered}
0\to\underline{\mathbb R}_M\to\Omega_M^0
\xrightarrow{d}\Omega_M^1\xrightarrow{d}\cdots,\\
H^q(M,\underline{\mathbb R}_M)\cong H^q_{\mathrm{dR}}(M).
\end{gathered}
\]`,'',r`The Poincaré lemma makes the de Rham resolution exact. Partitions of unity make the sheaves of forms acyclic, so the complex of global forms computes sheaf cohomology.`);
const cechDifferential=model('The Čech differential on three charts',[
 b('X',r`\mathbb P^2_k`),
 b('U_i',r`D_+(T_i)`),
 b(r`\mathcal F`,r`\mathcal O_X(-3)`),
 b('s_{ij}',r`\text{a section on }U_i\cap U_j`)
],r`\[
(\delta s)_{012}=s_{12}-s_{02}+s_{01}
\]`,r`All terms are restricted to the triple overlap.`,r`Local choices produce pairwise differences. On a triple overlap, passing from chart zero to chart two directly or through chart one must give the same difference.`);
const lineBundleCocycle=model('Transition functions are Čech cocycles',[
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
const cechDeRham=model('The Čech–de Rham double complex',[
 b('M',r`\text{a smooth manifold}`),
 b(r`\mathcal U`,r`\{U_i\}\text{ an open cover}`),
 b('K^{p,q}',r`\check C^p(\mathcal U,\Omega^q)`)
],r`\[
\begin{gathered}
K^{p,q}=\prod_{i_0<\cdots<i_p}\Omega^q(U_{i_0\cdots i_p}),\\
d_{\operatorname{Tot}}=\delta+(-1)^p d_{\mathrm{dR}}.
\end{gathered}
\]`,'',r`The Čech differential changes the overlap degree. Exterior differentiation changes the form degree and commutes with restriction. The sign makes their cross terms cancel in the total complex.`);
const serreSequence={...model('The Serre spectral sequence of a fibration',[
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
const cechSpectral=model('An acyclic cover leaves one row',[
 b('X',r`\mathbb P^1_k`),
 b(r`\mathcal U`,r`\{D_+(T_0),D_+(T_1)\}`),
 b(r`\mathcal F`,r`\mathcal O_X(-2)`)
],r`\[
\begin{gathered}
H^q(U_{i_0\cdots i_p},\mathcal F)=0\quad(q>0),\\
E_2^{p,0}=\check H^p(\mathcal U,\mathcal F)
\end{gathered}
\]`,r`The Čech complex computes \(H^p(X,\mathcal F)\).`,r`Overlap data should compute global cohomology if the patches and their intersections have no higher cohomology of their own. The spectral sequence makes this test precise.`);
const affinePushforward=model('View a closed subscheme from its ambient space',[
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
const fibreCohomology=model('The cohomology of the fibres forms a local system',[
 b('f',r`E\to B`,r`A locally trivial bundle of manifolds with fibre \(F\).`),
 b(r`\mathcal F`,r`\underline{\mathbb Z}_E`)
],r`\[
\begin{gathered}
(R^q f_*\mathcal F)_b\cong H^q(E_b;\mathbb Z),\\
E_2^{p,q}=H^p(B,R^q f_*\mathcal F),\\
E_2^{p,q}\Longrightarrow H^{p+q}(E;\mathbb Z).
\end{gathered}
\]`,'',r`On a contractible trivializing neighbourhood, the preimage retracts to a fibre. The higher direct image retains the fibre cohomology and its monodromy. Leray then takes cohomology on the base.`);
const invertibleLine=model('Tensoring by a line bundle has an inverse',[
 b('X',r`M\text{ a smooth manifold}`),
 b(r`\mathcal O_X`,r`\mathcal C^\infty_M`),
 b(r`\mathcal L`,r`\text{the sheaf of sections of a real line bundle}`)
],r`\[
\mathcal L\otimes_{\mathcal O_X}\mathcal L^\vee
\xrightarrow[\sim]{\mathrm{ev}}\mathcal O_X
\]`,'',r`In a local frame, evaluation pairs the frame with its dual and gives one. Tensoring by the dual therefore undoes tensoring by the line bundle.`);
const genusExample=model('The genus of a compact Riemann surface',[
 b('k',r`\mathbb C`),
 b('X',r`\text{a smooth connected curve}`,r`Projective over \(k\).`),
 b('M',r`X^{\mathrm{an}}`)
],r`\[
\begin{gathered}
g=\tfrac12\dim_{\mathbb R}H^1(M;\mathbb R),\\
g=\dim_{\mathbb C}H^0(M,\Omega_M^1)
 =\dim_{\mathbb C}H^1(X,\mathcal O_X).
\end{gathered}
\]`,'',r`The number of handles is also the dimension of the space of holomorphic differentials. On the projective curve the same number is computed from its structure sheaf.`);
const embeddedPoint=model('An embedded point on an affine line',[
 b('A',r`k[x,y]/(x^2,xy)`),
 b('X',r`\operatorname{Spec}A`)
],r`\[
\operatorname{Ann}_A(\bar x)=(\bar x,\bar y)
\]`,r`The origin is an associated point. The minimal prime is \((\bar x)\).`);
Object.assign(models,{tangentDivisor,conicDegree,conicIntersection,cechLine,cechPlane,planeCurveGenus,
 affineModule,closedPoint,affineBundle,gradedPolynomial,projCharts,properLine,sphereColimit,triangulatedChains,pairConnectingMap,injectiveExample,
 injectivePoint,injectiveModulePoint,injectiveResolution,residueObstruction,deRhamCohomology,cechDifferential,
 lineBundleCocycle,cechDeRham,serreSequence,cechSpectral,affinePushforward,fibreCohomology,invertibleLine,genusExample,embeddedPoint});
const groups={
 affineModule:['modules-quasi-coherent','schemes-quasi-coherent-affine'],
 closedPoint:['schemes-immersions'],
 affineBundle:['morphisms-affine'],
 properLine:['morphisms-proper'],
 gradedPolynomial:['algebra-graded'],
 projCharts:['constructions-proj','constructions-projective-space'],
 twistTensor:['constructions-quasi-coherent-proj'],
 sphereColimit:['categories-limits','categories-directed-colimits'],
 triangulatedChains:['homology-complexes'],
 pairConnectingMap:['homology-cohomological-delta-functor'],
 injectiveExample:['homology-injectives'],
 injectiveResolution:['derived-injective-resolutions'],
 injectivePoint:['injectives-abelian-sheaves-space'],
 injectiveModulePoint:['injectives-sheaves-modules-space'],
 residueObstruction:['derived-right-derived-functor'],
 deRhamCohomology:['cohomology-cohomology-sheaves'],
 lineBundleCocycle:['cohomology-cech','cohomology-alternating-cech'],
 cechDifferential:['cohomology-cech-functor'],
 cechDeRham:['homology-double-complexes','homology-double-complex'],
 serreSequence:['homology-spectral-sequence'],
 cechSpectral:['cohomology-cech-cohomology-cohomology'],
 fibreCohomology:['cohomology-locality','cohomology-Leray'],
 affinePushforward:['derived-composition-right-derived-functors'],
 genusExample:['curves-genus','varieties-curves'],
 cechLine:['coherent-cech-quasi-coherent'],
 cechPlane:['coherent-cohomology-projective-space'],
 planeCurveGenus:['curves-plane-curves','divisors-closed-in-relative-proj'],
 tangentDivisor:['divisors-effective-Cartier-divisors','divisors-Noetherian-effective-Cartier','divisors-effective-Cartier-invertible'],
 embeddedPoint:['divisors-embedded'],
 conicDegree:['varieties-divisors-curves'],
 conicIntersection:['intersection-computing-intersection-multiplicities'],
 invertibleLine:['modules-invertible'],
 twistCharts:['constructions-invertible-on-proj','divisors-invertible-modules'],
 solutionSheaf:['modules-kernels'],connected:['topology-connected-components'],natural:['categories-opposite','categories-formal-cat-cat'],twoFibre:['categories-2-fibre-products'],over:['categories-categories-over-categories'],topology:['topology-topology-basic'],basis:['topology-bases'],irreducible:['topology-irreducible-components'],noetherian:['topology-noetherian'],compact:['topology-quasi-compact'],specialization:['topology-specialization'],
 snake:['algebra-snake'],colimits:['categories-cofinal','algebra-colimits','categories-posets-limits'],localization:['algebra-localization'],local:['algebra-radical','algebra-local-rings'],spectrum:['algebra-spectrum-ring'],constructible:['topology-constructible','topology-constructible-Noetherian'],
 sheaf:['sheaves-presheaves','sheaves-abelian-presheaves','sheaves-sheaves','sheaves-abelian-sheaves','sheaves-presheaves-structures','sheaves-sheaves-structures','sheaves-algebraic-structures'],
 moduleSheaf:['sheaves-presheaves-modules','sheaves-sheaves-modules','sheaves-sheafification-presheaves-modules'],
 stalk:['sheaves-stalks','sheaves-stalks-abelian-presheaves','sheaves-stalks-presheaves-structures'],moduleStalk:['sheaves-stalk-presheaves-modules'],exactSheaf:['sheaves-exactness-points'],
 sheafify:['sheaves-sheafification','sheaves-sheafify-abelian-presheaves','sheaves-sheafification-presheaves-structures'],
 functorial:['sheaves-presheaves-functorial','sheaves-abelian-presheaves-functorial','sheaves-presheaves-structures-functorial','sheaves-presheaves-modules-functorial','sheaves-ringed-spaces-functoriality-modules'],
 ringed:['sheaves-ringed-spaces','schemes-locally-ringed-spaces'],open:['sheaves-open-immersions','schemes-open-immersion'],
 algebraGlue:['algebra-more-glueing'],affine:['schemes-affine-schemes'],affineMaps:['schemes-category-affine-schemes'],scheme:['schemes-schemes'],
 category:['categories-definition-categories'],limits:['categories-connected-limits','categories-finite-limits','categories-equalizers'],adjoint:['categories-adjoint'],
 nakayama:['algebra-nakayama'],modules:['algebra-hom'],finite:['algebra-module-finite-type','algebra-finite-type','algebra-images-finite-presentation'],idempotent:['algebra-open-and-closed'],rings:['algebra-conventions','algebra-rings-basic','algebra-miscellany'],
 chartCover:['sheaves-sheaves-basic'],basisSheaf:['sheaves-bases'],
 regularGlue:['algebra-tilde-module-sheaf'],bundlePullback:['categories-fibre-products'],setLimits:['categories-limit-sets'],
 abelian:['homology-additive-categories','homology-abelian-categories','homology-functors','categories-exact-functor']
};
const fundamentalGroup=model('Fundamental groups send loops along a map',[
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
const singularHomology=model('Singular homology sends cycles along a map',[
 b(r`\mathcal A`,r`\mathbf{Top}`),
 b(r`\mathcal B`,r`\mathbf{Ab}`),
 b('A',r`\text{an abelian group of coefficients}`),
 b('F',r`H_n(-;A)`,r`Singular homology in a fixed degree \(n\) with these coefficients.`),
 b('x,y',r`X,Y`),
 b(r`\phi`,r`X\to Y`)
],r`\[
\begin{gathered}
\sigma\longmapsto\phi\circ\sigma,\\
H_n(\phi;A):[\textstyle\sum_i a_i\sigma_i]
\\
\mapsto[\textstyle\sum_i a_i(\phi\circ\sigma_i)]
\end{gathered}
\]`,r`Postcomposition commutes with taking faces, so it descends to homology.`);
const tangentSpace=model('The chain rule makes tangent spaces functorial',[
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
const doubleDual={...model('The natural map to the double dual',[
 b(r`\mathcal A`,r`\mathbf{Vect}^{\mathrm{fd}}_{\mathbb R}`),
 b(r`\mathcal B`,r`\mathcal A`),
 b('F',r`\operatorname{Id}`),
 b('G',r`((-)^{**})`,r`The double-dual functor. A linear map \(\phi:V\to W\) goes to \(\phi^{**}:V^{**}\to W^{**}\).`),
 b('x,y',r`V,W`),
 b('t_x',r`(v\mapsto[\lambda\mapsto\lambda(v)])`,r`Evaluation gives a linear map \(V\to V^{**}\). The component \(t_y\) is the same construction on \(W\).`)
],r`\[
\begin{aligned}
\bigl(G(\phi)t_V(v)\bigr)(\lambda)&=\lambda(\phi(v))\\
 &=\bigl(t_W F(\phi)(v)\bigr)(\lambda).
\end{aligned}
\]`,r`The evaluation maps are isomorphisms in finite dimension.`,r`This example opens Eilenberg and Mac Lane’s 1945 paper.`),source:naturalEquivalences};
const matrixEquivalence=model('Finite-dimensional vector spaces and matrices',[
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
const dual=model('Dualizing reverses the arrows',[
 finiteVect,b(r`\mathcal S`,r`\mathbf{Vect}^{\mathrm{fd}}_{\mathbb R}`),
 b('F',r`(V\mapsto V^*)`),
 b(r`\psi`,r`(V\to W)`),
 b(r`F(\psi)`,r`(\lambda\mapsto\lambda\circ\psi)`,r`Precomposition sends \(W^*\) to \(V^*\).`)
],r`\[
F(\phi\circ\psi)=F(\psi)\circ F(\phi)
\]`,r`Precomposition gives the reversed order.`);
const additionalExamples={
 'schemes-schemes':[model('A point with a first-order neighbourhood',[
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
export function extraExamples(section){
 return additionalExamples[section.slug]||[];
}
const bySection=Object.fromEntries(Object.entries(groups).flatMap(([name,slugs])=>slugs.map(slug=>[slug,name])));
export function sectionNote(section){
 const name=bySection[section.slug];if(!name)throw Error('Missing example commentary: '+section.slug);
 return models[name];
}
export function passageNote(section,block){
 const base=sectionNote(section);
 if(section.slug==='categories-limits'&&block.label==='definition-limit')
  return {...padicLimit,scope:'statement'};
 if(section.slug==='cohomology-cech-cohomology-cohomology'&&block.label==='lemma-cech-spectral-sequence-application')
  return {...cechSpectral,scope:'statement',examples:[cechSphere]};
 if(section.slug==='constructions-invertible-on-proj'){
  const examples={
   'definition-twist':{...twistCharts,examples:[{...twistSections,scope:'statement'},{...twistTensor,scope:'statement'}]},
   'lemma-when-invertible':twistCharts,
   'lemma-apply-modules':twistTensor,
   'lemma-where-invertible':twistTensor,
   'lemma-principal-open':twistOpen,
   'lemma-ample-on-proj':twistOpen,
   'lemma-comparison-proj-quasi-coherent':twistSections
  };
  const example=examples[block.label];
  if(example)return {...example,scope:'statement'};
 }
 if(section.slug==='coherent-cech-quasi-coherent'&&block.label==='lemma-cech-cohomology-quasi-coherent-trivial')
  return {...cechAffine,scope:'statement'};
 if(section.slug==='coherent-cech-quasi-coherent'&&block.label==='lemma-cech-cohomology-quasi-coherent')
  return {...cechLine,scope:'statement',examples:[cechSphere]};
 if(section.slug==='coherent-cohomology-projective-space'&&block.label==='lemma-cohomology-projective-space-over-ring')
  return {...cechPlane,scope:'statement',examples:[cechLine]};
 if(section.slug==='curves-plane-curves'&&block.label==='lemma-genus-plane-curve')
  return {...planeCurveGenus,scope:'statement'};
 if(section.slug==='divisors-effective-Cartier-invertible'&&
    ['definition-zero-scheme-s','lemma-zero-scheme','lemma-characterize-OD'].includes(block.label))return {...tangentDivisor,scope:'statement'};
 if(section.slug==='varieties-divisors-curves'&&block.label==='lemma-degree-effective-Cartier-divisor')return {...conicDegree,scope:'statement'};
 if(section.slug==='intersection-computing-intersection-multiplicities'&&block.label==='lemma-multiplicity-with-effective-Cartier-divisor')return {...conicIntersection,scope:'statement'};
 if(section.slug==='categories-definition-categories'&&block.label==='definition-functor')return {...fundamentalGroup,scope:'statement',examples:[singularHomology,tangentSpace].map(example=>({...example,scope:'statement'}))};
 if(section.slug==='categories-definition-categories'&&block.label==='definition-transformation-functors')return {...doubleDual,scope:'statement'};
 if(section.slug==='categories-definition-categories'&&
    ['definition-equivalence-categories','lemma-construct-quasi-inverse','lemma-equivalence-categories'].includes(block.label))
  return {...matrixEquivalence,scope:'statement'};
 if(section.slug==='categories-opposite'&&block.label==='definition-contravariant')return {...dual,scope:'statement'};
 if(section.slug==='sheaves-presheaves'&&block.label==='definition-presheaf')return {...models.presheaf,scope:'statement'};
 if(section.slug==='sheaves-abelian-presheaves'&&block.label==='definition-abelian-presheaves')return {...models.abelianMorphism,scope:'statement'};
 if(section.chapter==='homology'&&block.label==='definition-kernel')return {...models.kernel,scope:'statement'};
 if(block.label==='definition-local-ring')return {...models.local,scope:'statement'};
 if(block.label==='definition-scheme')return {...models.scheme,scope:'statement',bindings:[...models.scheme.bindings,b(r`\Sch`,r`\text{the category of schemes}`) ]};
 if(block.label==='example-not-affine')return {...model('The punctured affine plane over a finite field',[
  b('k',r`\mathbb F_2`),
  b('X',r`\operatorname{Spec}(k[x,y])`),
  b('U',r`X\setminus\{(x,y)\}`)
 ],r`\[
\Gamma(U,\mathcal O_U)=k[x,y,1/x]\cap k[x,y,1/y]=k[x,y]
\]`,r`An affine \(U\) would make \(U\hookrightarrow X\) an isomorphism by the equality of global rings. The origin lies outside \(U\).`),scope:'statement'};
 return base;
}
