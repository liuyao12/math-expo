// Authored commentary. The main column is rendered separately from upstream LaTeX.
const r=String.raw;
const b=(symbol,value,note='')=>({symbol,value,note});
const model=(title,bindings,check,result,note='')=>({title,bindings,check,result,note,scope:'section'});
const X=b('X',r`\mathbb C`);
const U=b('U',r`\text{an open subset of }\mathbb C`,r`A domain is a nonempty connected open set. Here \(U\) can also be disconnected or empty.`);
const disk=b('U',r`D(a,r)=\{z:|z-a|<r\}`);
const O=b(r`\mathcal O`,r`\mathcal O^{\mathrm{an}}_{\mathbb C}`);
const F=b(r`\mathcal F`,r`\mathcal O^{\mathrm{an}}_{\mathbb C}`,'A sheaf; forget multiplication when the source asks for abelian groups or sets.');
const R=b('R',r`\mathbb C[z]`);
const A=b('X',r`\operatorname{Spec}(\mathbb C[z])`);
const integers=b('R',r`\mathbb Z`);
const arithmeticSpectrum=b('X',r`\operatorname{Spec}(\mathbb Z)`);
const twoPoints=b('X',r`\{a,b\}\quad\text{(discrete)}`);
const naturalEquivalences={
 url:'https://www.ams.org/journals/tran/1945-058-00/S0002-9947-1945-0013131-6/S0002-9947-1945-0013131-6.pdf',
 label:'Eilenberg and Mac Lane, General Theory of Natural Equivalences (1945), introduction'
};
const finiteVect=b(r`\mathcal C`,r`\mathbf{Vect}^{\mathrm{fd}}_{\mathbb R}`,'Finite-dimensional real vector spaces with linear maps.');
const models={
 topology:model('A topology with a generic point',[
  b('X',r`\{\eta,s\}`),
  b(r`\mathcal T`,r`\{\varnothing,\{\eta\},X\}`)
 ],r`\[
\begin{gathered}
\overline{\{\eta\}}=X,\\
\overline{\{s\}}=\{s\}
\end{gathered}
\]`,r`This is the topology of \(\operatorname{Spec}\mathbb Z_{(p)}\).`),
 basis:model('Disks are enough',[X,b(r`\mathcal B`,r`\{D(a,r):a\in\mathbb C,\ r>0\}`),disk],r`For \(a\in U\) open, choose \(r>0\) with \(D(a,r)\subseteq U\).`,r`Intersections of disks are unions of smaller disks.`),
 irreducible:model('A different topology on the complex line',[A,b('Z',r`V(z(z-1))`),b(r`\eta`,r`(0)`)],r`\[
\overline{\{(0)\}}=X
\]`,r`Every proper closed subset is finite, so any two nonempty opens meet.`),
 compact:model('Two denominators cover the integer spectrum',[
  arithmeticSpectrum,b('U_1',r`D(2)`),
  b('U_2',r`D(3)`)
 ],r`\[
3-2=1\quad\Longrightarrow\quad D(2)\cup D(3)=X
\]`,r`For any standard open cover, an expression for \(1\) in the generators already uses finitely many of them.`),
 specialization:model('The point that has no analytic counterpart',[A,b('x',r`\eta=(0)`),b("x'",r`(z-a)`,'A closed point, specified by evaluation at a complex number.')],r`\[
(0)\subset(z-a)\quad\Longrightarrow\quad x'\in\overline{\{x\}}
\]`,r``),
 rings:model('Reduction modulo an integer',[
  integers,b('I',r`(6)`),
  b(r`\varphi`,r`(n\mapsto n\bmod 6)`)
 ],r`\[
\begin{gathered}
\ker(\varphi)=(6),\\
\overline{2}\,\overline{3}=0
\end{gathered}
\]`,r`The quotients by \((2)\) and \((3)\) are fields.`),
 modules:model('Vector-valued functions',[R,b('M',r`R^{\oplus n}`),b('N',r`R^{\oplus m}`)],r`\[
\begin{gathered}
A\in\operatorname{Mat}_{m\times n}(R),\\
v\longmapsto Av
\end{gathered}
\]`,r``),
 snake:model('Exactness measures vanishing and lifting',[R,b('M',r`\mathbb C[z]`),b('N',r`\mathbb C[z]/(z)`,'The value space at the origin.')],r`\[
0\longrightarrow R\xrightarrow{\ z\ }R\longrightarrow R/(z)\longrightarrow0
\]`,r`A polynomial vanishes at zero exactly when it is divisible by \(z\).`),
 colimits:model('Doubling builds dyadic fractions',[
  b('I',r`\mathbb Z_{\ge 0}`),
  b('M_i',r`\mathbb Z`,r`The additive group at stage \(i\). The transition to stage \(i+1\) doubles each integer.`),
  b('M',r`\mathbb Z[1/2]`)
 ],r`\[
\begin{gathered}
(a,i)\sim(2a,i+1),\\
(a,i)\longmapsto a/2^i
\end{gathered}
\]`,r`Equal fractions agree after passage to a common stage.`),
 localization:model('Allow powers of two in denominators',[
  integers,b('S',r`\{1,2,2^2,\ldots\}`),
  b(r`S^{-1}R`,r`\mathbb Z[1/2]`)
 ],r`\[
\begin{gathered}
\mathbb Z\longrightarrow\mathbb Z[1/2],\\
2\longmapsto 2\in\mathbb Z[1/2]^\times
\end{gathered}
\]`,r`A map out of \(\mathbb Z\) that inverts \(2\) extends uniquely to \(\mathbb Z[1/2]\).`),
 local:model('Localize the integers at a prime',[
  b('R',r`\mathbb Z_{(p)}`),
  b(r`\mathfrak m`,r`p\mathbb Z_{(p)}`),
  b(r`\kappa`,r`\mathbb F_p`)
 ],r`\[
\frac ab\in R^\times\quad\Longleftrightarrow\quad p\nmid a
\]`,r`The inverse is \(b/a\), and reduction sends \(a/b\) to \(\bar a/\bar b\).`),
 spectrum:model('Prime numbers as closed points',[
  integers,arithmeticSpectrum,
  b(r`\mathfrak p`,r`(p)`),
  b(r`\eta`,r`(0)`),
  b(r`D(6)`,r`X\setminus\{(2),(3)\}`)
 ],r`\[
\begin{gathered}
(p)\in D(n)\iff p\nmid n,\\
\overline{\{(0)\}}=X
\end{gathered}
\]`,r``),
 sheaf:model('Holomorphic functions, with restriction',[X,U,F,b(r`\mathcal F(U)`,r`\{h:U\to\mathbb C\mid h\text{ holomorphic}\}`),b(r`\rho^U_V`,r`(h\mapsto h|_V)`)],r`\[
h_i|_{U_i\cap U_j}=h_j|_{U_i\cap U_j}\quad\Longrightarrow\quad \exists!\,h:\ h|_{U_i}=h_i
\]`,r`Define \(h\) locally by the \(h_i\). Holomorphicity is local.`),
 moduleSheaf:model('Sections of a trivial holomorphic bundle',[X,O,b(r`\mathcal F`,r`(\mathcal O^{\mathrm{an}}_{\mathbb C})^{\oplus n}`),b(r`\mathcal F(U)`,r`\operatorname{Hol}(U)^n`)],r`\[
(h_1,\ldots,h_n)|_V=(h_1|_V,\ldots,h_n|_V)
\]`,r`Restriction and gluing act in each coordinate.`),
 stalk:model('A holomorphic germ is its convergent Taylor series',[
 X,b('x',r`a\in\mathbb C`),
 b('t',r`z-a`),F,
 b(r`\mathcal F_x`,r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}\cong\mathbb C\{t\}`,r`The notation \(\mathbb C\{t\}\) means power series in \(t\) with a positive radius of convergence.`),
 b(r`[f]_a`,r`\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}t^n`)
 ],r`\[
[f]_a=[g]_a\quad\Longleftrightarrow\quad f^{(n)}(a)=g^{(n)}(a)\ \ \forall n\ge0
\]`,r`Both functions equal their Taylor series on a small disk. Conversely, a convergent series defines a germ.`,r`The argument uses holomorphicity. Compare the smooth germs in Example 6.11.4.`),
 moduleStalk:model('A bundle near a point',[X,O,b('x',r`0`),b(r`\mathcal F`,r`\mathcal O^{\oplus n}`),b(r`\mathcal F_x`,r`\mathbb C\{t\}^{\oplus n}`,r`Each component is identified with its convergent Taylor series at the origin.`)],r`\[
\mathcal F_x/\mathfrak m_x\mathcal F_x\cong\mathbb C^n
\]`,r`Evaluation at the point gives the fibre.`),
 exactSheaf:model('A local solution need not be global',[X,b('U',r`\mathbb C^\times`),b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`,'Holomorphic functions, viewed as a sheaf of complex vector spaces.'),b(r`\mathcal G`,r`\mathcal O_X^{\mathrm{an}}`),b(r`\varphi`,r`D=\frac{d}{dz}-1`)],r`\[
D(h)=g\quad\Longleftrightarrow\quad(e^{-z}h)'=e^{-z}g
\]`,r`On a disk, integrate the right-hand side. For \(g=e^z/z\), there is no single-valued primitive on \(\mathbb C^\times\).`),
 discreteCover:model('Cover a discrete space by its two points',[
  twoPoints,b('U',r`X`),
  b('U_1',r`\{a\}`),b('U_2',r`\{b\}`)
 ],r`\[
U=U_1\sqcup U_2
\]`,r`There is no compatibility condition between sections on the disjoint opens.`),
 discreteFunctions:model('Functions into the field of two elements',[
  twoPoints,b(r`\mathcal F(U)`,r`\operatorname{Map}(U,\mathbb F_2)`,'The ring of functions on an open set, with pointwise operations.'),
  b(r`\mathcal F(X)`,r`\mathbb F_2\times\mathbb F_2`)
 ],r`\[
\begin{gathered}
\mathcal F(X)\longrightarrow\mathcal F(\{a\}),\\
(u,v)\longmapsto u
\end{gathered}
\]`,r``),
 discreteBasis:model('A basis of two singletons',[
  twoPoints,b(r`\mathcal B`,r`\{\{a\},\{b\}\}`),
  b(r`\mathcal F(\{a\})`,r`\mathbb F_2`),
  b(r`\mathcal F(\{b\})`,r`\mathbb F_2`)
 ],r`\[
\mathcal F(X)=\mathcal F(\{a\})\times\mathcal F(\{b\})
\]`,r`The two basis opens are disjoint.`),
 discreteMap:model('Pull back functions along a map to a point',[
  twoPoints,b('Y',r`\{c\}`),b('f',r`(a\mapsto c,\ b\mapsto c)`),
  b(r`\mathcal O_X(U)`,r`\operatorname{Map}(U,\mathbb F_2)`),
  b(r`\mathcal O_Y(V)`,r`\operatorname{Map}(V,\mathbb F_2)`)
 ],r`\[
\begin{gathered}
\bigl(f_*\mathcal O_X\bigr)(Y)=\mathbb F_2\times\mathbb F_2,\\
v\longmapsto(v,v)
\end{gathered}
\]`,r``),
 sheafify:model('Independent values at two points',[
  twoPoints,b('A',r`\mathbb F_2`),
  b(r`\mathcal F(U)`,r`A`,'The constant presheaf on every open set.'),
  b(r`\mathcal F^\#(U)`,r`\operatorname{Map}(U,A)`)
 ],r`\[
\begin{gathered}
A=\mathcal F(X)\longrightarrow \mathcal F^\#(X)=A^2,\\
c\longmapsto(c,c)
\end{gathered}
\]`,r`Sheafification permits independent values on the two open singletons.`),
 functorial:model('Pull a function back by a holomorphic map',[b('X',r`\mathbb C_z`),b('Y',r`\mathbb C_t`),b('f',r`(z\mapsto z^2)`),b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),b(r`\mathcal G`,r`\mathcal O_Y^{\mathrm{an}}`)],r`\[
\begin{gathered}
(f_*\mathcal F)(V)=\mathcal F(f^{-1}V),\\
f^\sharp(h)=h\circ f
\end{gathered}
\]`,r``),
 ringed:model('The closed point at a prime number',[
  b('X',r`\operatorname{Spec}(\mathbb F_p)`),
  b('Y',r`\operatorname{Spec}(\mathbb Z)`),
  b('x',r`(0)`),
  b('f',r`(X\longrightarrow Y)`),
  b(r`f^\sharp_x`,r`(\mathbb Z_{(p)}\longrightarrow\mathbb F_p)`)
 ],r`\[
\begin{gathered}
f(x)=(p),\\
f_x^\sharp(a/b)=\bar a/\bar b
\end{gathered}
\]`,r`The inverse image of the maximal ideal \((0)\) is \(p\mathbb Z_{(p)}\).`),
 open:model('Remove the prime at two',[
  arithmeticSpectrum,b('U',r`D(2)\cong\operatorname{Spec}(\mathbb Z[1/2])`),
  b('j',r`(U\hookrightarrow X)`),
  b(r`\mathcal O_U`,r`\mathcal O_X|_U`)
 ],r`\[
\begin{gathered}
\mathcal O_U(V)=\mathcal O_X(V)\quad(V\subseteq U),\\
\mathcal O_{U,(p)}=\mathbb Z_{(p)}\quad(p\ne2)
\end{gathered}
\]`,r``),
 algebraGlue:model('Detect a module element at its primes',[
  integers,b('M',r`\mathbb Z/6\mathbb Z`),
  b(r`M_{(2)}`,r`\mathbb Z/2\mathbb Z`),
  b(r`M_{(3)}`,r`\mathbb Z/3\mathbb Z`)
 ],r`\[
\begin{gathered}
M\longrightarrow M_{(2)}\times M_{(3)},\\
[m]_6\longmapsto([m]_2,[m]_3)
\end{gathered}
\]`,r`A class that vanishes in both localizations is zero modulo six.`),
 arithmeticGlue:model('Glue fractions with different allowed denominators',[
  integers,b('f_1,f_2',r`2,3`),
  b('R_{f_1}',r`\mathbb Z[1/2]`),
  b('R_{f_2}',r`\mathbb Z[1/3]`),
  b('R_{f_1 f_2}',r`\mathbb Z[1/6]`)
 ],r`\[
\mathbb Z[1/2]\cap\mathbb Z[1/3]=\mathbb Z\quad\text{inside }\mathbb Z[1/6]
\]`,r`A compatible pair has reduced denominator \(1\).`),
 affine:model('The structure sheaf of the integer spectrum',[
  integers,arithmeticSpectrum,b(r`\mathcal O_X`,r`\widetilde{\mathbb Z}`),
  b(r`\mathcal O_X(D(2))`,r`\mathbb Z[1/2]`),
  b(r`\mathcal O_{X,(2)}`,r`\mathbb Z_{(2)}`)
 ],r`\[
\begin{gathered}
D(n)\longmapsto\mathbb Z[1/n],\\
(p)\longmapsto\mathbb Z_{(p)}
\end{gathered}
\]`,r`The section \(1/2\) lives on \(D(2)\), which omits \((2)\).`),
 affineMaps:model('Maps pull functions in the opposite direction',[b('R',r`\mathbb C[t]`),b('S',r`\mathbb C[z]`),b(r`\varphi`,r`(p(t)\mapsto p(z^2))`),b('f',r`\operatorname{Spec}(S)\longrightarrow\operatorname{Spec}(R)`)],r`\[
\begin{gathered}
(z-a)\longmapsto(t-a^2),\\
(0)\longmapsto(0)
\end{gathered}
\]`,r`Take inverse images under \(\varphi\).`),
 scheme:model('An affine atlas over a finite field',[
  b('X',r`\mathbb P^1_{\mathbb F_2}`),
  b('U',r`\operatorname{Spec}(\mathbb F_2[z])`),
  b('V',r`\operatorname{Spec}(\mathbb F_2[w])`)
 ],r`\[
\begin{gathered}
U\cap V=\operatorname{Spec}\bigl(\mathbb F_2[z,z^{-1}]\bigr),\\
w=z^{-1}
\end{gathered}
\]`,r`The two affine charts cover \(X\).`),
 category:{...model('Vector spaces and linear maps',[
  finiteVect,b('x',r`\mathbb R`),
  b('y',r`\mathbb R^2`),
  b('z',r`\mathbb R`),
  b(r`\psi`,r`(u\mapsto(u,2u))`),
  b(r`\phi`,r`((v,w)\mapsto w)`)
 ],r`\[
(\phi\circ\psi)(u)=\phi(u,2u)=2u
\]`,r``,r`Eilenberg and Mac Lane opened their 1945 paper with the natural map to the double dual.`),source:naturalEquivalences},
 ringPullback:model('Pairs of integers that agree modulo two',[
  b(r`\mathcal C`,r`\mathbf{CRing}`,'The category of commutative rings with unit.'),
  b('x,z',r`\mathbb Z,\mathbb Z`),
  b('y',r`\mathbb F_2`,'The common target. Both maps are reduction modulo two.'),
  b(r`x\times_y z`,r`\{(m,n)\in\mathbb Z^2:m\equiv n\pmod{2}\}`,'The fibre product, with coordinatewise operations.')
 ],r`\[
\begin{gathered}
f\circ p=g\circ q,\\
\gamma(w)=(\alpha(w),\beta(w))
\end{gathered}
\]`,r`The equality of reductions makes \(\gamma\) land in the fibre product.`),
 setLimits:model('Compatible choices and identified elements',[
  b('M_0',r`\{b\}`),
  b('M_1',r`\{a,b\}`),
  b('M_2',r`\{b,c\}`)
 ],r`\[
\begin{gathered}
\lim M=\{(b,b,b)\},\\
\operatorname{colim}M=\{a,b,c\}
\end{gathered}
\]`,r`The colimit identifies the three copies of \(b\).`),
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
 abelian:model('Kernels are spaces of solutions',[b(r`\mathcal A`,r`\operatorname{Vect}_{\mathbb C}`),b('M',r`\operatorname{Hol}(U)`),b('f',r`D:h\mapsto h'-h`)],r`\[
D(h)=0\iff (e^{-z}h)'=0\iff h=ce^z
\]`,r`On a domain the kernel is \(\mathbb C e^z\).`)
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
models.presheaf=model('Domains, functions, and a differential operator',[X,U,
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
\]`,r`On a domain, the solutions are \(ce^z\).`);
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
const twistCharts=model('Glue the two local generators',[
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
\]`,r`Chart coefficients glue when \(a(z)=z^n b(1/z)\).`);
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
models.twistCharts=twistCharts;

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

const cechLine=model('Two affine charts and their mismatch',[
 projectiveLine,
 b(r`\mathcal U`,r`\{U_0,U_1\}`,r`The two standard affine charts, with coordinates \(z=T_1/T_0\) and \(w=1/z\).`),
 b(r`\mathcal F`,r`\mathcal O_X(-2)`,r`The twist with local generators \(e_0=T_0^{-2}\) and \(e_1=z^{-2}e_0\).`),
 b(r`\Gamma(U_0\cap U_1,\mathcal F)`,r`k[z,z^{-1}]e_0`)
],r`\[
\begin{gathered}
\delta(a,b)=z^{-2}b(1/z)-a(z),\\
H^1(X,\mathcal F)=k\cdot[z^{-1}e_0]
\end{gathered}
\]`,r`The two charts supply powers \(j\geq0\) and \(j\leq-2\), leaving the class of \(z^{-1}e_0\).`);
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
 `,r`The two Laurent tails give sections on the two charts. Only the \(j=-1\) term survives their differences. Its coefficient is the residue, and \(dz/z\) has residue \(1\), so \([dz/z]\) generates \(H^1(X,\Omega_X^1)\). Cartan’s Theorem B makes the two charts and their overlap acyclic for this sheaf.`),
 source:{url:'https://www.numdam.org/item/SB_1951-1954__2__213_0/',label:'Serre’s Bourbaki exposé on Cartan’s Theorem B'}};
const cechPlane=model('Three charts leave one class for the negative cubic twist',[
 b('R',r`k`),
 b('n,d',r`2,-3`),
 b('X',r`\mathbb P^2_k`),
 b(r`\mathcal F`,r`\mathcal O_X(-3)`),
 b(r`\eta`,r`\frac{1}{T_0T_1T_2}`)
],r`\[
H^2(X,\mathcal F)=k\cdot\left[\frac1{T_0T_1T_2}\right]
\]`,r`A double overlap inverts only two coordinates. The only degree minus three monomial with all three exponents negative survives.`);
const genusCubic=model('The negative twist supplies the genus of a cubic',[
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
 For degree \(d\), count positive triples of exponents summing to \(d\) to get \(g=(d-1)(d-2)/2\).`);
Object.assign(models,{tangentDivisor,conicDegree,conicIntersection,cechLine,cechPlane,genusCubic});
const groups={
 cechLine:['coherent-cech-quasi-coherent'],
 cechPlane:['coherent-cohomology-projective-space'],
 genusCubic:['curves-plane-curves'],
 tangentDivisor:['divisors-effective-Cartier-invertible'],
 conicDegree:['varieties-divisors-curves'],
 conicIntersection:['intersection-computing-intersection-multiplicities'],
 twistCharts:['constructions-invertible-on-proj'],
 solutionSheaf:['modules-kernels'],connected:['topology-connected-components'],natural:['categories-opposite','categories-formal-cat-cat'],twoFibre:['categories-2-fibre-products'],over:['categories-categories-over-categories'],topology:['topology-topology-basic'],basis:['topology-bases'],irreducible:['topology-irreducible-components'],noetherian:['topology-noetherian'],compact:['topology-quasi-compact'],specialization:['topology-specialization'],
 snake:['algebra-snake'],colimits:['categories-cofinal','algebra-colimits','categories-directed-colimits','categories-posets-limits'],localization:['algebra-localization'],local:['algebra-radical','algebra-local-rings'],spectrum:['algebra-spectrum-ring'],constructible:['topology-constructible','topology-constructible-Noetherian'],
 sheaf:['sheaves-presheaves','sheaves-abelian-presheaves','sheaves-sheaves','sheaves-abelian-sheaves'],
 moduleSheaf:['sheaves-presheaves-modules','sheaves-sheaves-modules','sheaves-sheafification-presheaves-modules'],
 stalk:['sheaves-stalks','sheaves-stalks-abelian-presheaves','sheaves-stalks-presheaves-structures'],moduleStalk:['sheaves-stalk-presheaves-modules'],exactSheaf:['sheaves-exactness-points'],
 sheafify:['sheaves-sheafification','sheaves-sheafify-abelian-presheaves','sheaves-sheafification-presheaves-structures'],
 functorial:['sheaves-abelian-presheaves-functorial','sheaves-presheaves-modules-functorial','sheaves-ringed-spaces-functoriality-modules'],
 ringed:['schemes-locally-ringed-spaces'],open:['sheaves-open-immersions','schemes-open-immersion'],
 algebraGlue:['algebra-more-glueing'],affine:['schemes-affine-schemes'],affineMaps:['schemes-category-affine-schemes'],scheme:['schemes-schemes'],
 category:['categories-definition-categories'],limits:['categories-connected-limits','categories-finite-limits','categories-equalizers','categories-limits'],adjoint:['categories-adjoint'],
 nakayama:['algebra-nakayama'],modules:['algebra-hom'],finite:['algebra-module-finite-type','algebra-finite-type','algebra-images-finite-presentation'],idempotent:['algebra-open-and-closed'],rings:['algebra-conventions','algebra-rings-basic','algebra-miscellany'],
 discreteCover:['sheaves-sheaves-basic'],discreteBasis:['sheaves-bases'],
 discreteFunctions:['sheaves-presheaves-structures','sheaves-sheaves-structures','sheaves-algebraic-structures'],
 discreteMap:['sheaves-presheaves-functorial','sheaves-presheaves-structures-functorial','sheaves-ringed-spaces'],
 arithmeticGlue:['algebra-tilde-module-sheaf'],ringPullback:['categories-fibre-products'],setLimits:['categories-limit-sets'],
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
\]`,r``);
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
\]`,r``);
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
 'sheaves-presheaves':[model('Functions on a discrete two-point space',[
  twoPoints,b('U',r`\{a\}`),
  b(r`\mathcal F(U)`,r`\operatorname{Map}(U,\mathbb F_2)\cong\mathbb F_2`),
  b(r`\mathcal F(X)`,r`\mathbb F_2\times\mathbb F_2`)
 ],r`\[
(u,v)\longmapsto u\longmapsto\text{the empty function}
\]`,r``)],
 'sheaves-stalks':[model('A germ on a discrete space is a value',[
  twoPoints,b('x',r`a`),
  b(r`\mathcal F(U)`,r`\operatorname{Map}(U,\mathbb F_2)`),
  b(r`\mathcal F_x`,r`\mathbb F_2`)
 ],r`\[
[h]_a=[g]_a\quad\Longleftrightarrow\quad h(a)=g(a)
\]`,r`The open singleton \(\{a\}\) is the smallest neighbourhood.`)],
 'schemes-schemes':[model('An affine scheme supported at one point',[
  b('R',r`\mathbb F_2[\epsilon]/(\epsilon^2)`,'The ring of dual numbers over the field of two elements.'),
  b('X',r`\operatorname{Spec}(R)`),
  b('x',r`(\epsilon)`,'The unique prime ideal. Every prime contains the nilpotent element.'),
  b('U',r`X`)
 ],r`\[
\begin{gathered}
\mathcal O_{X,x}=R,\\
\mathfrak m_x=(\epsilon)
\end{gathered}
\]`,r`The whole space is an affine neighbourhood of its only point.`)]
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
