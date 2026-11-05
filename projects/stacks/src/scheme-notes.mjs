// Authored commentary. The main column is rendered separately from upstream LaTeX.
const r=String.raw;
const b=(symbol,value,note='')=>({symbol,value,note});
const model=(title,bindings,check,result,note='')=>({title,bindings,check,result,note,scope:'section'});
const X=b('X',r`\mathbb C`);
const sphereX=b('X',r`\mathbb P^1(\mathbb C)`);
const U=b('U',r`\text{an open subset of }\mathbb C`,r`A domain is a nonempty connected open set. Here \(U\) can also be disconnected or empty.`);
const disk=b('U',r`D(a,r)=\{z:|z-a|<r\}`);
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
 topology:model('Where can a Laurent expansion be used?',[
  X,b('U',r`\mathbb C^\times`),b('V',r`\{w:0<|w|<1\}`),
  b('f',r`(z\mapsto 1/z)`)
 ],r`\[
f^{-1}(V)=\{z:|z|>1\}
\]`,'',r`A neighbourhood tells us where a local formula makes sense. Continuity lets us pull that neighbourhood back through a change of variable.`),
 basis:model('Taylor series only need disks',[X,b(r`\mathcal B`,r`\{D(a,r):a\in\mathbb C,\ r>0\}`),disk],r`\[
h|_{D(a,r)}=\sum_{n\ge0}c_n(z-a)^n
\]`,'',r`To decide whether a function on an arbitrary open set is holomorphic, check for a convergent power series on a small disk around each point.`),
 irreducible:model('An algebraic line is one piece',[A,b('Z',r`V(z(z-1))`),b(r`\eta`,r`(0)`)],r`\[
\overline{\{(0)\}}=X
\]`,r`Every proper closed subset is finite, so any two nonempty opens meet.`,r`An algebraic curve can have separate branches even when it is connected. Irreducibility asks whether it is a single algebraic piece.`),
 compact:model('A finite atlas for local formulas',[
  sphereX,b(r`\mathcal U`,r`\{U_i\}_{i\in I}\text{ an open cover}`)
 ],r`\[
\exists\,J\subset I\text{ finite}\quad X=\bigcup_{i\in J}U_i
\]`,'',r`If local formulas exist near every point of the sphere, finitely many of their domains suffice to cover it.`),
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
 modules:model('A family of linear maps has functions as coefficients',[R,b('M',r`R^{\oplus n}`),b('N',r`R^{\oplus m}`)],r`\[
\begin{gathered}
A\in\operatorname{Mat}_{m\times n}(R),\\
v\longmapsto Av
\end{gathered}
\]`,'',r`A linear map between trivial bundles can vary with the base point. A polynomial matrix gives one module map whose evaluation at each point is the corresponding linear map.`),
 snake:model('Exactness measures vanishing and lifting',[R,b('M',r`\mathbb C[z]`),b('N',r`\mathbb C[z]/(z)`,'The value space at the origin.')],r`\[
0\longrightarrow R\xrightarrow{\ z\ }R\longrightarrow R/(z)\longrightarrow0
\]`,'',r`Prescribing a value at the origin leaves the freedom to add any function vanishing there. An exact sequence records both the prescription and that freedom.`),
 colimits:model('Remember a function only near the point',[
  b('I',r`\{\text{neighbourhoods of }a\}\text{ in reverse inclusion}`),
  b('M_U',r`\operatorname{Hol}(U)`),
  b('M',r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}`)
 ],r`\[
\begin{gathered}
M=\varinjlim_{U\ni a}\operatorname{Hol}(U),\\
[h]_a=[g]_a\iff h|_W=g|_W
\end{gathered}
\]`,r`Here \(W\) is some common neighbourhood of \(a\).`,r`A Taylor series needs a neighbourhood of its centre, but the germ should forget how large that neighbourhood was.`),
 localization:model('Reciprocals become regular away from their poles',[
  R,b('S',r`\{1,z,z^2,\ldots\}`),
  b(r`S^{-1}R`,r`\mathbb C[z,z^{-1}]`)
 ],r`\[
w=1/z\in S^{-1}R
\]`,'',r`The two coordinates on the sphere meet where \(z\ne0\). Localization gives the algebraic ring where both coordinates are regular.`),
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
 moduleSheaf:model('A differential has local coefficients',[
  sphereX,b(r`\mathcal O`,r`\mathcal O_X^{\mathrm{an}}`),b(r`\mathcal F`,r`\Omega_X^1`),
  b('U',r`\text{an open set in the }z\text{-chart}`),
  b(r`\mathcal F(U)`,r`\{h(z)\,dz:h\in\operatorname{Hol}(U)\}`)
 ],r`\[
w=1/z,\qquad dz=-w^{-2}\,dw
\]`,'',r`A holomorphic differential can be multiplied by any holomorphic function. Its coefficient depends on the chart, while the product defines an intrinsic section.`),
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
 exactSheaf:model('A local solution need not be global',[X,b('U',r`\mathbb C^\times`),b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`,'Holomorphic functions, viewed as a sheaf of complex vector spaces.'),b(r`\mathcal G`,r`\mathcal O_X^{\mathrm{an}}`),b(r`\varphi`,r`D=\frac{d}{dz}-1`)],r`\[
D(h)=g\quad\Longleftrightarrow\quad(e^{-z}h)'=e^{-z}g
\]`,r`On a disk, integrate the right-hand side. For \(g=e^z/z\), there is no single-valued primitive on \(\mathbb C^\times\).`),
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
 category:{...model('Vector spaces and linear maps',[
  finiteVect,b('x',r`\mathbb R`),
  b('y',r`\mathbb R^2`),
  b('z',r`\mathbb R`),
  b(r`\psi`,r`(u\mapsto(u,2u))`),
  b(r`\phi`,r`((v,w)\mapsto w)`)
 ],r`\[
(\phi\circ\psi)(u)=\phi(u,2u)=2u
\]`,r``,r`Eilenberg and Mac Lane opened their 1945 paper with the natural map to the double dual.`),source:naturalEquivalences},
 ringPullback:model('A function on two axes must agree at the crossing',[
  b(r`\mathcal C`,r`\mathbf{CRing}`),
  b('x,z',r`\mathbb C[u],\mathbb C[v]`),
  b('y',r`\mathbb C`,'Both maps evaluate at the origin.')
 ],r`\[
\begin{gathered}
x\times_y z=\{(f,g):f(0)=g(0)\},\\
x\times_y z\cong\mathbb C[u,v]/(uv)
\end{gathered}
\]`,'',r`The fibre product keeps the function on each branch and imposes exactly the compatibility at their common point.`),
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
 adjoint:model('A map described on either side',[b('f',r`(z\mapsto z^2)`),b(r`\mathcal F`,r`\mathcal O_Y^{\mathrm{an}}`,'A sheaf of sets or abelian groups on the target.'),b(r`\mathcal G`,r`\mathcal O_X^{\mathrm{an}}`)],r`\[
\operatorname{Hom}(f^{-1}\mathcal F,\mathcal G)\cong\operatorname{Hom}(\mathcal F,f_*\mathcal G)
\]`,r`Composition with \(f\) gives the corresponding maps on functions.`),
 idempotent:model('Separate two components',[b('R',r`\operatorname{Hol}(D_1\amalg D_2)`),b('e',r`(1,0)`)],r`\[
\begin{gathered}
e^2=e,\\
R\cong eR\times(1-e)R
\end{gathered}
\]`,r`The two factors are the function rings on the two disks.`),
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
models.noetherian=model('Algebraic closed sets cannot keep shrinking',[A,b('Z',r`V(p(z)),\quad p(z)\ne 0`)],r`Every proper closed subset of \(X\) is finite.`,r`A descending chain stabilizes once it reaches a proper closed subset.`);
models.constructible=model('Finite combinations of vanishing conditions',[A,b('E',r`D(z)\cap V(z-1)`)],r`\[
E=D(z)\cap V(z-1)=\{(z-1)\}
\]`,r`The constructible subsets are finite sets of closed points and their complements.`);
models.nakayama=model('A fibre can test a finite module',[b('R',r`\mathbb C\{t\}`),b(r`\mathfrak m`,r`(t)`),b('M',r`R^{\oplus n}`)],r`\[
\begin{aligned}
 \det A(0)\ne0 &\Longrightarrow \det A\in R^\times\\
               &\Longrightarrow A\in\operatorname{GL}_n(R).
\end{aligned}
\]`,r`An invertible matrix on the fibre lifts to an invertible matrix of germs.`);
models.connected=model('Components let functions vary independently',[b('X',r`\mathbb C\setminus\mathbb R`),b('x',r`i`),b('Z',r`\{z:\operatorname{Im}(z)>0\}`)],r`\[
\pi_0(X)=\bigl\{\{z:\operatorname{Im}z>0\},\{z:\operatorname{Im}z<0\}\bigr\}
\]`,r`A locally constant function can take an independent value on each component.`);
models.natural=model('Restriction is a functor',[b(r`\mathcal A`,r`\operatorname{Opens}(\mathbb C)^{\mathrm{op}}`),b(r`\mathcal B`,r`\operatorname{Vect}_{\mathbb C}`),b('F',r`(U\mapsto\operatorname{Hol}(U))`),b('t',r`(h\mapsto2h)`)],r`\[
(2h)|_V=2(h|_V)
\]`,r``);
models.twoFibre=model('Keep an identification, rather than demand equality',[b(r`\mathcal A`,r`\mathcal L`,'The groupoid of one-dimensional complex vector spaces and their isomorphisms.'),b(r`\mathcal B`,r`\mathcal L`)],r`\[
\begin{gathered}
(L_1,L_2,\alpha),\\
\alpha:L_1\xrightarrow{\sim}L_2
\end{gathered}
\]`,r``);
models.over=model('A category of functions lying over open sets',[b(r`\mathcal C`,r`\operatorname{Opens}(\mathbb C)`),b(r`\mathcal A`,r`\{(U,h):h\in\operatorname{Hol}(U)\}`),b('p',r`((U,h)\mapsto U)`)],r`\[
(U,h)\longrightarrow(V,g)\quad\Longleftrightarrow\quad U\subseteq V,\ h=g|_U
\]`,r``);
models.presheaf=model('A local equation must restrict to smaller domains',[X,U,
 b(r`\mathcal F`,r`\mathcal O^{\mathrm{an}}_{\mathbb C}`),
 b(r`\mathcal F(U)`,r`\{h:U\to\mathbb C\mid h\text{ holomorphic}\}`),
 b(r`\rho^U_V`,r`(h\mapsto h|_V)`),
 b(r`\mathcal G`,r`\mathcal F`),
 b(r`\varphi`,r`D=\frac{d}{dz}-1`,r`For each open \(U\), the map is \(\varphi_U(h)=h'-h\).`)
],r`\[
\begin{gathered}
D(h)|_V=D(h|_V),\\
(\ker D)(U)=\{h:h'=h\}
\end{gathered}
\]`,r`On a domain, the solutions are \(ce^z\).`,r`We can pose the same differential equation on any open set. A presheaf records the data on each open set and how to pass to a smaller one.`);
models.abelianMorphism={...models.presheaf,title:'Differential operators respect addition',
 check:r`\[
 D(ah+bk)=aD(h)+bD(k)
 \]`,
 result:r`For constant scalars \(a,b\in\mathbb C\). On a domain, \(\ker D=\mathbb C e^z\).`
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
 b(r`\mathcal A`,r`\operatorname{Vect}_{\mathbb C}`),
 b('x',r`\operatorname{Hol}(U)`),b('y',r`\operatorname{Hol}(U)`),
 b('f',r`D:h\mapsto h'-h`),
 b('z',r`\ker D=\mathbb C e^z`),
 b('i',r`(\ker D\hookrightarrow\operatorname{Hol}(U))`)
],r`\[
\operatorname{im}(g)\subseteq\ker D\qquad\text{if }D\circ g=0
\]`,r`Then \(g\) factors uniquely through the inclusion \(i\).`,r`Here \(U\) is a domain.`);

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
const genusCubic=model('Read the genus from the equation of the curve',[
 b('k',r`\mathbb C`),
 b('S',r`k[T_0,T_1,T_2]`),
 b('F',r`T_0^3+T_1^3+T_2^3`),
 b('d',r`3`),
 b('Z',r`V_+(F)`)
],r`\[
0\to\mathcal O_{\mathbb P^2_k}(-3)\xrightarrow{F}\mathcal O_{\mathbb P^2_k}\to i_*\mathcal O_Z\to0
\]`,r`\[
 H^1(Z,\mathcal O_Z)\cong H^2(\mathbb P^2_k,\mathcal O(-3))\cong k.
 \]
 For degree \(d\), count positive triples of exponents summing to \(d\) to get \(g=(d-1)(d-2)/2\).`,r`A smooth complex plane curve is a compact Riemann surface. To find its genus from its defining polynomial, study functions on the curve by restricting functions from the ambient plane. The kernel is the equation, with its degree recorded by a twist.`);
const affineModule=model('A sheaf concentrated at a zero of a function',[
 b('A',r`k[z]`),
 b('X',r`\operatorname{Spec} A`),
 b('M',r`A/(z)`),
 b(r`\mathcal F`,r`\widetilde M`)
],r`\[
\Gamma(X,\mathcal F)=k,\qquad \Gamma(D(z),\mathcal F)=0
\]`,'',r`The module \(A/(z)\) records evaluation at the origin. Localizing it tells us where that data is still present. It disappears on every open set that avoids the origin.`);
const closedPoint=model('A closed immersion remembers the equation',[
 b('X',r`\operatorname{Spec} k[z]`),
 b('Z',r`\operatorname{Spec}(k[z]/(z^2))`),
 b('i',r`Z\hookrightarrow X`)
],r`\[
i^{-1}(D(f))=\operatorname{Spec}\bigl((k[z]/(z^2))_f\bigr)
\]`,'',r`The equations \(z=0\) and \(z^2=0\) have the same zero set. The quotient for \(z^2=0\) also retains the linear term of a function at the origin.`);
const affineDoubleCover=model('Describe a cover by an equation over each chart',[
 b('Y',r`\operatorname{Spec}\mathbb C[t]`),
 b('X',r`\operatorname{Spec}\mathbb C[z]`),
 b('f',r`(t=z^2)`)
],r`\[
\begin{aligned}
A&=\mathbb C[t,1/g(t)],\\
f^{-1}(D(g))&=\operatorname{Spec}\bigl(A[z]/(z^2-t)\bigr).
\end{aligned}
\]`,'',r`A branched double cover can be described by adjoining a square root to the ring of each target chart. An affine morphism is one whose inverse images of affine charts admit such ring descriptions.`);
const gradedPolynomial=model('Which equations make sense on projective points?',[
 b('S',r`k[T_0,T_1]`),
 b('S_2',r`kT_0^2\oplus kT_0T_1\oplus kT_1^2`),
 b('F',r`T_1^2-T_0T_1\in S_2`)
],r`\[
F(\lambda T_0,\lambda T_1)=\lambda^2 F(T_0,T_1)
\]`,'',r`A projective point has many coordinate representatives. The zero set of a homogeneous polynomial is independent of the representative. Grading keeps track of the weight under rescaling.`);
const projCharts=model('The two standard charts of projective space',[
 b('S',r`k[T_0,T_1]`),
 b('X',r`\operatorname{Proj}S=\mathbb P^1_k`),
 b('z',r`T_1/T_0`),
 b('w',r`T_0/T_1`)
],r`\[
\begin{gathered}
D_+(T_0)=\operatorname{Spec} k[z],\\
D_+(T_1)=\operatorname{Spec} k[w],\\
D_+(T_0T_1)=\operatorname{Spec} k[z,z^{-1}]
\end{gathered}
\]`,r`On the overlap, \(w=z^{-1}\).`,r`On the sphere we divide by the nonzero homogeneous coordinate to get a chart. \(\operatorname{Proj}\) does this with degree-zero fractions in a graded ring.`);
const properLine=model('A family has a limit at infinity',[
 b('S',r`\operatorname{Spec}\mathbb C`),
 b('X',r`\mathbb P^1_{\mathbb C}`),
 b('f',r`X\to S`),
 b('R',r`\mathbb C[[t]]`),
 b('K',r`\mathbb C((t))`)
],r`\[
[1:t^{-1}]=[t:1]\longrightarrow [0:1]\quad(t=0)
\]`,'',r`A point that runs off the affine chart can still have a limit on the sphere. The valuative criterion captures this extension property algebraically.`);
const complexExample=model('A holomorphic differential may have no primitive',[
 b('U',r`\mathbb C^\times`),
 b('K^0',r`\operatorname{Hol}(U)`),
 b('K^1',r`\Omega^1(U)`),
 b('d^0',r`(h\mapsto dh)`)
],r`\[
\begin{aligned}
H^1(K^\bullet)&=\Omega^1(U)/d\operatorname{Hol}(U),\\
\oint_{|z|=1}\frac{dz}{z}&=2\pi i.
\end{aligned}
\]`,'',r`Integration is locally possible, but a nonzero period prevents a single-valued primitive. Cohomology identifies forms that differ by an exact differential.`);
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
const cohomologySphere=model('The residue measures a failure to glue',[
 sphereX,
 b(r`\mathcal F`,r`\Omega_X^1`)
],r`\[
H^1(X,\mathcal F)=\mathbb C\cdot[dz/z]
\]`,r`The two chart differentials can account for all the other Laurent terms.`,r`A differential on the overlap may fail to be a difference of two chart sections. Sheaf cohomology measures that failure. For the sphere, it is exactly the residue.`);
const cechDifferential=model('The Čech differential on three charts',[
 b('X',r`\mathbb P^2_k`),
 b('U_i',r`D_+(T_i)`),
 b(r`\mathcal F`,r`\mathcal O_X(-3)`),
 b('s_{ij}',r`\text{a section on }U_i\cap U_j`)
],r`\[
(\delta s)_{012}=s_{12}-s_{02}+s_{01}
\]`,r`All terms are restricted to the triple overlap.`,r`Local choices produce pairwise differences. On a triple overlap, passing from chart zero to chart two directly or through chart one must give the same difference.`);
const cechDoubleComplex=model('Restrictions in one direction, a resolution in the other',[
 b(r`\mathcal U`,r`\{U_0,U_1\}`),
 b(r`\mathcal I^\bullet`,r`\text{an injective resolution of }\mathcal F`),
 b('K^{p,q}',r`\check{\mathcal C}_{\mathrm{ord}}^p(\mathcal U,\mathcal I^q)`)
],r`\[
\begin{aligned}
K^{1,q}&=\mathcal I^q(U_0\cap U_1),\\
\operatorname{Tot}(K)^1&=K^{0,1}\oplus K^{1,0}.
\end{aligned}
\]`,'',r`One direction compares sections across overlaps. The other keeps track of local cohomology using a resolution. The double complex combines the two calculations.`);
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
const genusExample=model('The genus of the Fermat cubic',[
 b('k',r`\mathbb C`),
 b('X',r`V_+(T_0^3+T_1^3+T_2^3)\subset\mathbb P^2_k`)
],r`\[
g=\dim_k H^1(X,\mathcal O_X)=1
\]`,'',r`The same smooth complex cubic is a compact surface with one handle. The algebraic definition asks for the dimension of a cohomology group of its functions.`);
const embeddedPoint=model('An embedded point on an affine line',[
 b('A',r`k[x,y]/(x^2,xy)`),
 b('X',r`\operatorname{Spec}A`)
],r`\[
\operatorname{Ann}_A(\bar x)=(\bar x,\bar y)
\]`,r`The origin is an associated point. The minimal prime is \((\bar x)\).`);
Object.assign(models,{tangentDivisor,conicDegree,conicIntersection,cechLine,cechPlane,genusCubic,
 affineModule,closedPoint,affineDoubleCover,gradedPolynomial,projCharts,properLine,complexExample,injectiveExample,
 injectivePoint,injectiveModulePoint,injectiveResolution,residueObstruction,cohomologySphere,cechDifferential,cechDoubleComplex,cechSpectral,affinePushforward,genusExample,embeddedPoint});
const groups={
 affineModule:['modules-quasi-coherent','schemes-quasi-coherent-affine'],
 closedPoint:['schemes-immersions'],
 affineDoubleCover:['morphisms-affine'],
 properLine:['morphisms-proper'],
 gradedPolynomial:['algebra-graded'],
 projCharts:['constructions-proj','constructions-projective-space'],
 twistTensor:['constructions-quasi-coherent-proj'],
 complexExample:['homology-complexes'],
 injectiveExample:['homology-injectives'],
 injectiveResolution:['derived-injective-resolutions'],
 injectivePoint:['injectives-abelian-sheaves-space'],
 injectiveModulePoint:['injectives-sheaves-modules-space'],
 residueObstruction:['derived-right-derived-functor','homology-cohomological-delta-functor'],
 cohomologySphere:['cohomology-cohomology-sheaves'],
 cechDifferential:['cohomology-cech','cohomology-cech-functor','cohomology-alternating-cech'],
 cechDoubleComplex:['homology-double-complexes'],
 cechSpectral:['homology-spectral-sequence','homology-double-complex','cohomology-cech-cohomology-cohomology'],
 affinePushforward:['cohomology-locality','cohomology-Leray','derived-composition-right-derived-functors'],
 genusExample:['curves-genus','varieties-curves'],
 cechLine:['coherent-cech-quasi-coherent'],
 cechPlane:['coherent-cohomology-projective-space'],
 genusCubic:['curves-plane-curves','divisors-closed-in-relative-proj'],
 tangentDivisor:['divisors-effective-Cartier-divisors','divisors-Noetherian-effective-Cartier','divisors-effective-Cartier-invertible'],
 embeddedPoint:['divisors-embedded'],
 conicDegree:['varieties-divisors-curves'],
 conicIntersection:['intersection-computing-intersection-multiplicities'],
 twistCharts:['modules-invertible','constructions-invertible-on-proj','divisors-invertible-modules'],
 solutionSheaf:['modules-kernels'],connected:['topology-connected-components'],natural:['categories-opposite','categories-formal-cat-cat'],twoFibre:['categories-2-fibre-products'],over:['categories-categories-over-categories'],topology:['topology-topology-basic'],basis:['topology-bases'],irreducible:['topology-irreducible-components'],noetherian:['topology-noetherian'],compact:['topology-quasi-compact'],specialization:['topology-specialization'],
 snake:['algebra-snake'],colimits:['categories-cofinal','algebra-colimits','categories-directed-colimits','categories-posets-limits'],localization:['algebra-localization'],local:['algebra-radical','algebra-local-rings'],spectrum:['algebra-spectrum-ring'],constructible:['topology-constructible','topology-constructible-Noetherian'],
 sheaf:['sheaves-presheaves','sheaves-abelian-presheaves','sheaves-sheaves','sheaves-abelian-sheaves','sheaves-presheaves-structures','sheaves-sheaves-structures','sheaves-algebraic-structures'],
 moduleSheaf:['sheaves-presheaves-modules','sheaves-sheaves-modules','sheaves-sheafification-presheaves-modules'],
 stalk:['sheaves-stalks','sheaves-stalks-abelian-presheaves','sheaves-stalks-presheaves-structures'],moduleStalk:['sheaves-stalk-presheaves-modules'],exactSheaf:['sheaves-exactness-points'],
 sheafify:['sheaves-sheafification','sheaves-sheafify-abelian-presheaves','sheaves-sheafification-presheaves-structures'],
 functorial:['sheaves-presheaves-functorial','sheaves-abelian-presheaves-functorial','sheaves-presheaves-structures-functorial','sheaves-presheaves-modules-functorial','sheaves-ringed-spaces-functoriality-modules'],
 ringed:['sheaves-ringed-spaces','schemes-locally-ringed-spaces'],open:['sheaves-open-immersions','schemes-open-immersion'],
 algebraGlue:['algebra-more-glueing'],affine:['schemes-affine-schemes'],affineMaps:['schemes-category-affine-schemes'],scheme:['schemes-schemes'],
 category:['categories-definition-categories'],limits:['categories-connected-limits','categories-finite-limits','categories-equalizers','categories-limits'],adjoint:['categories-adjoint'],
 nakayama:['algebra-nakayama'],modules:['algebra-hom'],finite:['algebra-module-finite-type','algebra-finite-type','algebra-images-finite-presentation'],idempotent:['algebra-open-and-closed'],rings:['algebra-conventions','algebra-rings-basic','algebra-miscellany'],
 chartCover:['sheaves-sheaves-basic'],basisSheaf:['sheaves-bases'],
 regularGlue:['algebra-tilde-module-sheaf'],ringPullback:['categories-fibre-products'],setLimits:['categories-limit-sets'],
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
 b('A',r`\mathbb Z/3\mathbb Z`),
 b('F',r`H_n(-;A)`,r`Singular homology in a fixed degree \(n\) with these coefficients.`),
 b('x,y',r`S^1,S^1`),
 b(r`\phi`,r`(z\mapsto z^2)`)
],r`\[
\begin{gathered}
\sigma\longmapsto\phi\circ\sigma,\\
H_1(\phi;A):A\xrightarrow{\times2}A
\end{gathered}
\]`,r`Postcomposition commutes with taking faces, so it descends to homology.`);
const tangentSpace=model('The chain rule makes tangent spaces functorial',[
 b(r`\mathcal A`,r`\mathbf{Man}_*`,'Pointed smooth manifolds and smooth maps preserving the marked points.'),
 b(r`\mathcal B`,r`\mathbf{Vect}_{\mathbb R}`),
 b('F',r`((M,p)\mapsto T_pM)`),
 b('x',r`(\mathbb R,2)`),
 b('y',r`(\mathbb R,4)`),
 b(r`\phi`,r`(u\mapsto u^2)`),
 b(r`F(\phi)`,r`\mathrm d\phi_2`)
],r`\[
\begin{gathered}
\mathrm d(g\circ f)_p=\mathrm dg_{f(p)}\circ\mathrm df_p,\\
\mathrm d\phi_2(v)=4v
\end{gathered}
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
  return {...genusCubic,scope:'statement'};
 if(section.slug==='divisors-effective-Cartier-invertible'&&
    ['definition-zero-scheme-s','lemma-zero-scheme','lemma-characterize-OD'].includes(block.label))return {...tangentDivisor,scope:'statement'};
 if(section.slug==='varieties-divisors-curves'&&block.label==='lemma-degree-effective-Cartier-divisor')return {...conicDegree,scope:'statement'};
 if(section.slug==='intersection-computing-intersection-multiplicities'&&block.label==='lemma-multiplicity-with-effective-Cartier-divisor')return {...conicIntersection,scope:'statement'};
 if(section.slug==='categories-definition-categories'&&block.label==='definition-functor')return {...fundamentalGroup,scope:'statement',examples:[singularHomology,tangentSpace].map(example=>({...example,scope:'statement'}))};
 if(section.slug==='categories-definition-categories'&&block.label==='definition-transformation-functors')return {...doubleDual,scope:'statement'};
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
