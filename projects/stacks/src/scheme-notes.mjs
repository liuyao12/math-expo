// Authored commentary. The main column is rendered separately from upstream LaTeX.
import sharedPassageNotes from '../../../shared/passage-notes.json' with {type:'json'};
const r=String.raw;
const b=(symbol,value,note='')=>({symbol,value,note});
const model=(title,bindings,check,result,note='')=>({title,bindings,check,result,note,scope:'section'});
const X=b('X',r`\mathbb C`);
const sphereX=b('X',r`\mathbb P^1(\mathbb C)`);
const U=b('U',r`\text{an open subset of }\mathbb C`);
const O=b(r`\mathcal O`,r`\mathcal O^{\mathrm{an}}_{\mathbb C}`);
const F=b(r`\mathcal F`,r`\mathcal O^{\mathrm{an}}_{\mathbb C}`);
const R=b('R',r`\mathbb C[z]`);
const A=b('X',r`\operatorname{Spec}(\mathbb C[z])`);
const models={
 topology:model('manifolds',[
  b('X',r`M`),b('U',r`\text{an open chart domain in }M`),
  b('V',r`\text{an open subset of }\mathbb R^n`),
  b('f',r`\varphi:U\xrightarrow{\sim}V`)
 ],r`\[
W\subset V\text{ open}\ \Longrightarrow\ \varphi^{-1}(W)\text{ open}
\]`,'',r`A chart gives \(M\) Euclidean neighbourhoods.`),
 basis:model('Euclidean space',[
  b('X',r`\mathbb R^n`),
  b(r`\mathcal B`,r`\{B_r(q):q\in\mathbb Q^n,\ r\in\mathbb Q_{>0}\}`)
 ],'',''),
 irreducible:model('affine line',[A,b(r`\eta`,r`(0)`)],r`\[
\overline{\{(0)\}}=X
\]`,`Any two nonempty opens meet at the generic point.`),
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
\]`,'',r`Specialization evaluates rational functions regular at \(a\).`),
 rings:model('function rings',[
  b('R',r`\mathbb C[z,w]`),
  b('I',r`(w-z^2)`),
  b(r`\varphi`,r`(f(z,w)\mapsto f(z,z^2))`)
 ],r`\[
R/I\cong\mathbb C[z]
\]`,'',r`Restrict functions to the parabola \(w=z^2\).`),
 modules:model('vector bundle maps',[
  b('R',r`C^\infty(X)`),b('M',r`\Gamma(X,E)`),b('N',r`\Gamma(X,F)`),
  b('u',r`E\to F\text{ over }X`)
 ],r`\[
\begin{gathered}
\Gamma(u)(s)(x)=u_x(s(x)),\\
\Gamma(u)(hs)=h\,\Gamma(u)(s)
\end{gathered}
\]`,'',r`A bundle map acts on sections fibre by fibre.`),
 snake:model('snake lemma',[
  b(r`A_\bullet`,r`C_\bullet(Y)`),b(r`B_\bullet`,r`C_\bullet(X)`),
  b(r`C_\bullet`,r`C_\bullet(X,Y)`)
 ],r`\[
\begin{gathered}
0\to A_\bullet\to B_\bullet\to C_\bullet\to0,\\
b\longmapsto c,\qquad \delta[c]=[\partial b].
\end{gathered}
\]`,'',r`The connecting map of a pair comes from the snake lemma.`),
 colimits:model('local functions',[
  b('I',r`\{\text{neighbourhoods of }a\}`,'Ordered by reverse inclusion.'),
  b('M_U',r`\operatorname{Hol}(U)`),
  b('M',r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}`)
 ],r`\[
\begin{gathered}
M=\varinjlim_{U\ni a}\operatorname{Hol}(U),\\
[h]_a=[g]_a\iff h|_W=g|_W
\end{gathered}
\]`,r`Here \(W\) is some common neighbourhood of \(a\).`,r`A germ forgets how large its original domain was.`),
 localization:model('general linear group',[
  b('R',r`k[a_{ij}:1\le i,j\le n]`),
  b('A',r`(a_{ij})`),
  b('S',r`\{(\det A)^m:m\ge0\}`),
  b(r`S^{-1}R`,r`R[1/\det A]`)
 ],r`\[
A^{-1}=\frac{\operatorname{adj}(A)}{\det A}
\]`,'',r`Invert the determinant to make the universal matrix invertible.`),
 local:{...model('germs of holomorphic functions',[],'',''),points:[
  r`\(R=\{\text{holomorphic functions }f\text{ defined at }a\in\mathbb C\}\), i.e., defined on some neighborhood of \(a\)`,
  r`addition and multiplication are defined by restricting to a smaller domain, if necessary`,
  r`\(\mathfrak m=\{f\in R:f(a)=0\}\)`,
  r`\(\kappa=R/\mathfrak m\cong\mathbb C\)`,
  r`Such an \(f\) may be better identified with the convergent power series \(\sum c_n(z-a)^n\), and referred to as the germ of holomorphic functions. The ring \(R\) is sometimes denoted \(\mathbb C\{z-a\}\) as a subset of \(\mathbb C[[z-a]]\) of formal power series.`
 ]},
 spectrum:model('crossing lines',[
  b('R',r`\mathbb C[x,y]/(xy)`),b('X',r`\operatorname{Spec}R`),
  b(r`\mathfrak p`,r`(x-a,y-b),\quad ab=0`),
  b(r`\eta_1,\eta_2`,r`(x),(y)`)
 ],r`\[
\overline{\{\eta_1\}}=V(x),\qquad \overline{\{\eta_2\}}=V(y)
\]`,'',r`Each axis has a generic point.`),
 sheaf:model('gluing holomorphic functions',[
  X,U,b(r`\{U_i\}`,r`\text{an open cover of }U`),
  F,b(r`\mathcal F(U)`,r`\{h:U\to\mathbb C\mid h\text{ holomorphic}\}`),b(r`\rho^U_V`,r`(h\mapsto h|_V)`)
 ],r`\[
\begin{gathered}
h_i|_{U_i\cap U_j}=h_j|_{U_i\cap U_j}\\
\Longrightarrow\ \exists!\,h:\ h|_{U_i}=h_i
\end{gathered}
\]`,'',r`Local holomorphic formulas glue when they agree on overlaps.`),
 moduleSheaf:model('differential forms',[
  b('X',r`M\text{ a smooth manifold}`),
  b('U',r`\text{a coordinate chart in }M`),
  b(r`\mathcal O(U)`,r`C^\infty(U)`),
  b(r`\mathcal F(U)`,r`\Omega^1(U)=\Gamma(U,T^*M)`)
 ],r`\[
\begin{gathered}
\omega=\sum_j a_j\,dx^j\in\mathcal F(U),\qquad h\in\mathcal O(U),\\
h\omega=\sum_j(ha_j)\,dx^j.
\end{gathered}
\]`,''),
 stalk:model('holomorphic germs',[
 X,b('x',r`a\in\mathbb C`),
 b('t',r`z-a`),F,
 b(r`\mathcal F_x`,r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}\cong\mathbb C\{t\}`,r`Convergent power series in \(t\).`),
 b(r`[f]_a`,r`\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}t^n`)
 ],r`\[
[f]_a=[g]_a\quad\Longleftrightarrow\quad f^{(n)}(a)=g^{(n)}(a)\ \ \forall n\ge0
\]`,'',r`The Taylor expansion records the order of vanishing.`),
 moduleStalk:model('germs of differentials',[
  X,O,b('x',r`0`),
  b(r`\mathcal F`,r`\Omega_X^1`),
  b(r`\mathcal F_x`,r`\mathbb C\{z\}\,dz`)
 ],r`\[
\mathcal F_x/\mathfrak m_x\mathcal F_x\cong\mathbb C\,dz|_x
\]`,'',r`Passing to the fibre keeps the constant term.`),
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
\]`,'',r`The Poincaré lemma gives local primitives. Periods can obstruct a global one.`),
 basisSheaf:model('local holomorphic functions',[
  X,b(r`\mathcal B`,r`\{D(a,r):r>0\}`),
  b(r`\mathcal F(B)`,r`\operatorname{Hol}(B),\quad B\in\mathcal B`)
 ],r`\[
h_B|_C=h_{B'}|_C\qquad(C\in\mathcal B,\ C\subset B\cap B')
\]`,'',r`Test gluing on disks contained in the overlaps.`),
 sheafify:model('locally constant functions',[
  b('X',r`\mathbb C\setminus\mathbb R`),b('A',r`\mathbb C`),
  b(r`\mathcal F(U)`,r`A`),
  b(r`\mathcal F^\#(U)`,r`\{h:U\to A\text{ locally constant}\}`)
 ],r`\[
\mathcal F(X)\longrightarrow\mathcal F^\#(X),\qquad c\longmapsto(c,c)
\]`,'',r`The equation \(h'=0\) allows one constant per component.`),
 functorial:model('pullback of functions',[b('X',r`\mathbb C_z`),b('Y',r`\mathbb C_t`),b('f',r`(z\mapsto z^2)`),b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),b(r`\mathcal G`,r`\mathcal O_Y^{\mathrm{an}}`)],r`\[
\begin{gathered}
(f_*\mathcal F)(V)=\mathcal F(f^{-1}V),\\
f^\sharp(h)=h\circ f
\end{gathered}
\]`,''),
 ringed:model('local ring maps',[
  b('X',r`\mathbb C_z`),b('Y',r`\mathbb C_t`),
  b('x',r`0`),b('f',r`(z\mapsto z^2)`),
  b(r`f^\sharp_x`,r`\mathbb C\{t\}\longrightarrow\mathbb C\{z\}`)
 ],r`\[
\begin{gathered}
t\longmapsto z^2,\\
(f_x^\sharp)^{-1}((z))=(t)
\end{gathered}
\]`,''),
 open:model('restriction to a chart',[
  sphereX,b('U',r`X\setminus\{\infty\}\cong\mathbb C_z`),
  b('j',r`(U\hookrightarrow X)`),
  b(r`\mathcal O_U`,r`\mathcal O^{\mathrm{an}}_X|_U`)
 ],r`\[
\begin{gathered}
\mathcal O_U(V)=\operatorname{Hol}(V)\quad(V\subseteq U),\\
\mathcal O_{U,a}=\mathcal O_{X,a}\qquad(a\in U).
\end{gathered}
\]`,''),
 algebraGlue:model('zero loci',[
  R,b('M',r`R/(z(z-1))`),
  b(r`\mathfrak m_0,\mathfrak m_1`,r`(z),(z-1)`)
 ],r`\[
\begin{gathered}
M\xrightarrow{\sim}M_{\mathfrak m_0}\times M_{\mathfrak m_1}
\cong\mathbb C\times\mathbb C,\\
[h]\longmapsto(h(0),h(1)).
\end{gathered}
\]`,''),
 regularGlue:model('rational functions',[
  R,b('f_1,f_2',r`z,1-z`),
  b('R_{f_1}',r`\mathbb C[z,1/z]`),
  b('R_{f_2}',r`\mathbb C[z,1/(1-z)]`)
 ],r`\[
\begin{gathered}
f_1+f_2=1,\\
R_{f_1}\cap R_{f_2}=R\qquad\text{inside }\mathbb C(z).
\end{gathered}
\]`,''),
 affine:model('polynomial functions',[
  R,A,b(r`\mathcal O_X`,r`\widetilde R`),
  b(r`\mathcal O_X(D(z))`,r`\mathbb C[z,z^{-1}]`),
  b(r`\mathcal O_{X,(z-a)}`,r`\mathbb C[z]_{(z-a)}=\{p/q:q(a)\ne0\}`)
 ],'',''),
 affineMaps:model('affine-line maps',[b('R',r`\mathbb C[t]`),b('S',r`\mathbb C[z]`),b(r`\varphi`,r`(p(t)\mapsto p(z^2))`),b('f',r`\operatorname{Spec}(S)\longrightarrow\operatorname{Spec}(R)`)],r`\[
\begin{gathered}
f((z-a))=\varphi^{-1}((z-a))=(t-a^2),\\
f((0))=(0).
\end{gathered}
\]`,''),
 scheme:model('Riemann sphere',[
  b('X',r`\mathbb P^1_{\mathbb C}`),
  b('U',r`\operatorname{Spec}(\mathbb C[z])`),
  b('V',r`\operatorname{Spec}(\mathbb C[w])`)
 ],r`\[
\begin{gathered}
U\cap V=\operatorname{Spec}\bigl(\mathbb C[z,z^{-1}]\bigr),\\
w=z^{-1}
\end{gathered}
\]`,r`On complex points, this is the holomorphic atlas of the sphere.`,r`The chart at infinity fills the gap in the affine line.`),
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
X\times_B E=\{(x,e):f(x)=p(e)\},\\
(f^*E)_x=E_{f(x)}.
\end{gathered}
\]`,'',''),
 setLimits:model('compatible local functions',[
  b('U,V',r`\text{open subsets of }\mathbb C`),
  b('A,B',r`\operatorname{Hol}(U),\operatorname{Hol}(V)`),
  b('C',r`\operatorname{Hol}(U\cap V)`)
 ],r`\[
\operatorname{Hol}(U\cup V)\cong A\times_C B
\]`,'',''),
 limits:model('equalizers',[b('A',r`\prod_i\operatorname{Hol}(U_i)`),b('B',r`\prod_{i,j}\operatorname{Hol}(U_i\cap U_j)`),b('f',r`(s_i)\mapsto(s_i|_{U_i\cap U_j})_{i,j}`),b('g',r`(s_i)\mapsto(s_j|_{U_i\cap U_j})_{i,j}`)],r`\[
\operatorname{Eq}(f,g)\cong\operatorname{Hol}\bigl(\textstyle\bigcup_i U_i\bigr)
\]`,''),
 adjoint:model('tensor–Hom adjunction',[
  b('F',r`-\otimes_k V`),b('G',r`\operatorname{Hom}_k(V,-)`)
 ],r`\[
\begin{gathered}
\operatorname{Hom}_k(U\otimes_k V,W)\\
\cong \operatorname{Hom}_k(U,G(W)),\\
h\longmapsto (u\mapsto(v\mapsto h(u\otimes v))).
\end{gathered}
\]`,'',r`A bilinear map can be read one input at a time.`),
 idempotent:model('idempotents',[
  b('R',r`C(X,\mathbb R)`),b('U',r`\text{an open and closed subset of }X`),
  b('e',r`\mathbf 1_U`)
 ],r`\[
\begin{gathered}
e^2=e,\\
R\cong eR\times(1-e)R
\cong C(U,\mathbb R)\times C(X\setminus U,\mathbb R).
\end{gathered}
\]`,''),
 finite:model('finite presentations',[R,b('M',r`R/(z)`),b('S',r`R[w]/(w^2-z)`)],r`\[
\begin{gathered}
R\xrightarrow{\cdot z}R\to M\to0,\\
w\text{ generates }S\text{ over }R,\quad w^2=z.
\end{gathered}
\]`,''),
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
\]`,'',r`The residue of \(g(z)\,dz\) obstructs a global primitive.`)
};
models.noetherian=model('polynomial ideals',[
 b('R',r`k[x_1,\ldots,x_n]`),b('X',r`\operatorname{Spec}(R)`),
 b('I',r`(f_1,f_2,\ldots)`)
],r`\[
I=(f_1,\ldots,f_N),\qquad V(I)=V(f_1,\ldots,f_N).
\]`,'',r`Hilbert’s basis theorem gives a finite \(N\).`);
models.constructible=model('matrix rank strata',[
 b('X',r`\mathbb A_k^{mn}`),b('A',r`(a_{ij})_{m\times n}`),
 b('I_s',r`\text{the ideal of the }s\times s\text{ minors}`)
],r`\[
\{\operatorname{rank}A=r\}
=V(I_{r+1})\setminus V(I_r)
\]`,'','');
models.nakayama=model('lifting a basis from the fibre',[
 b('R',r`\mathbb C\{t\}`),b(r`\mathfrak m`,r`(t)`),
 b('M',r`R^n`),b(r`M/\mathfrak mM`,r`\mathbb C^n`),
 b('A',r`(m_1\ \cdots\ m_n)\quad(m_i\in M)`)
],r`\[
\begin{gathered}
\det A(0)\ne0\ \Longrightarrow\ \det A\in R^\times,\\
M=Rm_1+\cdots+Rm_n.
\end{gathered}
\]`,'');
models.connected=model('manifold components',[
 b('X',r`M\text{ a manifold}`),b('x',r`x\in M`),
 b('Z',r`\text{the path component of }x`)
],r`\[
H_0(M;\mathbb Z)\cong\bigoplus_{C\in\pi_0(M)}\mathbb Z
\]`,'',r`On a manifold, connected components are path components.`);
models.natural=model('exterior differentiation',[
 b(r`\mathcal A`,r`\mathbf{Man}^{\mathrm{op}}`),
 b(r`\mathcal B`,r`\mathbf{Vect}_{\mathbb R}`),
 b('F,G',r`\Omega^q,\Omega^{q+1}`),b('t_M',r`d:\Omega^q(M)\to\Omega^{q+1}(M)`)
],r`\[
f^*(d\omega)=d(f^*\omega)
\]`,'',r`For a smooth map \(f:M\to N\).`);
models.twoFibre=model('trivialized determinants',[
 b(r`\mathcal A`,r`\operatorname{Vect}_r(M)^\simeq`,r`The groupoid of rank-\(r\) complex vector bundles.`),
 b(r`\mathcal B`,r`\{*\}`),
 b(r`\mathcal C`,r`\operatorname{Line}(M)^\simeq`),
 b('F',r`(E\mapsto \det E)`),
 b('G',r`(*\mapsto M\times\mathbb C)`)
],r`\[
\alpha:\det E\xrightarrow{\sim}M\times\mathbb C
\]`,'',r`The object is a bundle with a chosen determinant trivialization.`);
models.over=model('covering spaces',[
 b(r`\mathcal C`,r`\mathbf{Top}`),
 b('X',r`\text{the base space}`),
 b('p,q',r`E\to X,\ F\to X`)
],r`\[
u:(E,p)\to(F,q)\quad\Longleftrightarrow\quad q\circ u=p
\]`,'',r`Deck transformations are automorphisms over \(X\).`);
models.abelianMorphism=model('differential operators',[
 X,F,b(r`\mathcal G`,r`\Omega_X^1`),b(r`\varphi_U`,r`(h\mapsto dh):\mathcal F(U)\to\mathcal G(U)`)
],r`\[
\begin{gathered}
(dh)|_V=d(h|_V),\\
d(ah+bk)=a\,dh+b\,dk\quad(a,b\in\mathbb C).
\end{gathered}
\]`,'');
models.solutionSheaf=model('solution sheaves',[X,U,
 b(r`\mathcal O_X`,r`\underline{\mathbb C}`),
 F,
 b(r`\mathcal G`,r`\mathcal F`),
 b(r`\varphi`,r`D:h\mapsto h'-h`),
 b(r`\operatorname{Ker}(\varphi)(U)`,r`\{h\in\operatorname{Hol}(U):h'-h=0\}`)
],r`\[
\begin{gathered}
\varphi(h)=0\iff(e^{-z}h)'=0,\\
h(z)=c(z)e^z,\quad c\text{ locally constant}.
\end{gathered}
\]`,'',r`Use locally constant scalars so differentiation is linear over the scalar sheaf.`);
models.kernel=model('homogeneous solutions',[
 b(r`\mathcal A`,r`\mathbf{Vect}_k`),
 b('x,y',r`V,V`),
 b('f',r`T-\lambda\operatorname{id}_V`),
 b('z',r`E_\lambda=\ker f`),
 b('i',r`E_\lambda\hookrightarrow V`)
],r`\[
(T-\lambda\operatorname{id}_V)\circ g=0
\]`,r`Such a map \(g\) factors uniquely through \(E_\lambda\).`,r`Fix a linear operator \(T\).`);

const projectiveRing=b('S',r`k[T_0,T_1]`);
const projectiveLine=b('X',r`\operatorname{Proj}(S)=\mathbb P^1_k`);
const twistCharts=model('projective coordinates',[
 projectiveRing,projectiveLine,
 b('U_0',r`D_+(T_0)=\operatorname{Spec}k[z]`),
 b('U_1',r`D_+(T_1)=\operatorname{Spec}k[w]`),
 b(r`\mathcal O_X(n)(U_0)`,r`k[z]\,T_0^n`),
 b(r`\mathcal O_X(n)(U_1)`,r`k[w]\,T_1^n`)
],r`\[
\begin{gathered}
z=T_1/T_0,\qquad w=1/z,\\
S(n)_j=S_{n+j},\\
T_1^n=z^nT_0^n
\end{gathered}
\]`,r`Chart coefficients glue when \(a(z)=z^n b(1/z)\).`,r`The twist absorbs the scaling of a homogeneous polynomial.`);
const twistSections=model('global sections',[
 projectiveRing,projectiveLine,
 b(r`\mathcal O_X(1)`,r`\widetilde{S(1)}`),
 b(r`T_0`,r`(1,w)`),
 b(r`T_1`,r`(z,1)`)
],r`\[
\begin{gathered}
H^0(X,\mathcal O_X(n))=S_n,\\
a(z)\longmapsto T_0^n a(T_1/T_0)\quad(\deg a\le n),\\
S_n=0\quad(n<0).
\end{gathered}
\]`,'');
const twistTensor=model('tensor products of line bundles',[
 projectiveRing,projectiveLine,
 b(r`\mathcal O_X(n)|_{U_i}`,r`\mathcal O_{U_i}\,T_i^n`),
 b(r`\mathcal O_X(m)|_{U_i}`,r`\mathcal O_{U_i}\,T_i^m`)
],r`\[
\begin{gathered}
T_i^n\otimes T_i^m\longmapsto T_i^{n+m},\\
z^n z^m=z^{n+m}
\end{gathered}
\]`,'');
const twistOpen=model('standard projective charts',[
 projectiveRing,projectiveLine,b('f',r`T_0`),
 b('W',r`X`)
],r`\[
\begin{gathered}
T_0=wT_1\text{ on }U_1,\\
X\setminus Z(T_0)=D_+(T_0)
\end{gathered}
\]`,'');
Object.assign(models,{twistCharts,twistTensor});

const conic=r`V_+(T_0T_2-T_1^2)`;
const conicCurve=b('X',conic+r`\subset\mathbb P^2_k`);
const doublePoint=b('D',r`\operatorname{Spec}(k[z]/(z^2))`);
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
\]`,r`The tangent meets the conic in a double point.`);
const conicDegree=model('tangency multiplicity',[
 conicCurve,doublePoint,
 b(r`\mathcal E`,r`\mathcal O_X`),
 b(r`\mathcal E(D)`,r`\mathcal O_X(D)\cong\mathcal O_X(1)`)
],r`\[
\deg\mathcal O_X(1)=\deg D=\dim_k k[z]/(z^2)=2
\]`,r`The secant \(T_1=0\) gives two simple zeros.`);
const conicIntersection=model('intersection multiplicity',[
 b('X',r`\mathbb P^2_k`),
 b('V',r`V_+(T_2)`),
 b('W',conic),
 b('Z',r`\{\xi\}=\{[1:0:0]\}`),
 b('f_1',r`T_2/T_0`)
],r`\[
e(X,V\cdot W,Z)=\operatorname{length}\bigl(k[z]_{(z)}/(z^2)\bigr)=2
\]`,'');

const cechLine=model('overlap sections',[
 projectiveLine,
 b(r`\mathcal U`,r`\{\operatorname{Spec}k[z],\operatorname{Spec}k[w]\}`),
 b(r`\mathcal F`,r`\mathcal O_X(-2)`),
 b(r`\Gamma(U_0\cap U_1,\mathcal F)`,r`k[z,z^{-1}]e_0`)
],r`\[
\begin{gathered}
z=T_1/T_0,\quad w=1/z,\\
e_0=T_0^{-2},\quad e_1=z^{-2}e_0,\\
\delta(a,b)=z^{-2}b(1/z)-a(z),\\
H^1(X,\mathcal F)=k\cdot[z^{-1}e_0]
\end{gathered}
\]`,r`Only the Laurent power \(z^{-1}\) is missing from both chart expansions.`,'');
const cechAffine=model('affine overlap sections',[
 b('U',r`\operatorname{Spec}(k[z])`),
 b(r`\mathcal U`,r`\{D(z),D(1-z)\}`),
 b(r`\mathcal F`,r`\mathcal O_U`)
],r`\[
\begin{gathered}
z+(1-z)=1,\\
\frac{1}{z(1-z)}=\frac1z+\frac1{1-z}.
\end{gathered}
\]`,r`Each summand extends to its own chart.`);
const cechSphere={...model('residues on the sphere',[
 b('X',r`\mathbb P^1(\mathbb C)`),
 b(r`\mathcal U`,r`\{\mathbb C_z,\mathbb C_w\}`),
 b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}(-2)\cong\Omega_X^1`,r`
 \[
 \begin{aligned}
 w&=1/z, & dw&=-z^{-2}\,dz,\\
 e_1&=z^{-2}e_0, & -dw&=z^{-2}\,dz.
 \end{aligned}
 \]
 \[
 (e_0,e_1)\longleftrightarrow(dz,-dw).
 \]
 `),
 b(r`\omega`,r`\left(\sum_{j\in\mathbb Z}c_jz^j\right)dz`)
],r`
 \[
 \begin{aligned}
 a(z)\,dz &= \sum_{j\geq 0} a_j z^j\,dz,\\
 b(w)\,dw &= -z^{-2}b(1/z)\,dz\\
          &= \sum_{j\leq -2} \widetilde b_j z^j\,dz.
 \end{aligned}
 \]
 `,r`Only the residue term \(j=-1\) extends to neither chart, leaving \([dz/z]\).`,r`Cartan’s Theorem B lets the two charts compute \(H^1\).`),
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
\]`,r`Only the monomial with three negative exponents survives the double overlaps.`,'');
const planeCurveGenus=model('plane curve genus',[
 b('k',r`\mathbb C`),
 b('S',r`k[T_0,T_1,T_2]`),
 b('F',r`\text{a homogeneous polynomial of degree }d`),
 b('Z',r`V_+(F)\subset X=\mathbb P^2_k`),
 b('i',r`Z\hookrightarrow X`)
],r`\[
0\to\mathcal O_X(-d)\xrightarrow{F}\mathcal O_X\to i_*\mathcal O_Z\to0
\]`,r`\[
 \begin{gathered}
 H^1(Z,\mathcal O_Z)\cong H^2(X,\mathcal O_X(-d)),\\
 g=\frac{(d-1)(d-2)}2.
 \end{gathered}
 \]
 Count Laurent monomials with three negative exponents summing to \(-d\).`,r`Let \(Z\) be a smooth plane curve cut out by a section of \(\mathcal O_X(d)\).`);
const affineModule=model('localization of bundles',[
 b('A',r`\Gamma(X,\mathcal O_X)`),
 b('X',r`\operatorname{Spec} A`),
 b('M',r`\Gamma(X,E)`),
 b(r`\mathcal F`,r`\widetilde M`)
],r`\[
\Gamma(D(f),E)=M_f
\]`,'',r`Let \(E\) be the sheaf of sections of an algebraic vector bundle.`);
const closedPoint=model('closed immersions',[
 b('X',r`\operatorname{Spec} k[z]`),
 b('Z',r`\operatorname{Spec}(k[z]/(z^2))`),
 b('i',r`Z\hookrightarrow X`)
],r`\[
i^{-1}(D(f))=\operatorname{Spec}\bigl((k[z]/(z^2))_f\bigr)
\]`,'',r`The doubled point keeps the linear term at the origin.`);
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
\]`,'','');
const gradedPolynomial={...model('homogeneous polynomials',[],'',''),points:[
 {text:r`\(S=\mathbb C[t_0,\ldots,t_n]\) \(\displaystyle=\bigoplus_{d\geq 0}S_d\)`,children:[
  r`\(S_d=\{f\in S:f\text{ is homogeneous of degree }d\}\)`
 ]},
 {text:r`\(M=S/(t_0)\cong\mathbb C[t_1,\ldots,t_n]\)`,children:[
  r`\(M_e=\{g\in M:g\text{ is homogeneous of degree }e\}\)`,
  r`\(f\cdot g=f(0,t_1,\ldots,t_n)g\), so \(S_dM_e\subseteq M_{d+e}\).`,
  r`\(M\) is the ring of polynomial functions on the affine hyperplane \(t_0=0\) and the homogeneous coordinate ring of the projective hyperplane \(t_0=0\) in \(\mathbb P^n_{\mathbb C}\).`
 ]}
]};
const projCharts=model('homogeneous coordinate charts',[
 b('S',r`k[T_0,\ldots,T_n]`),
 b('X',r`\operatorname{Proj}S=\mathbb P^n_k`),
 b('U_i',r`D_+(T_i)`)
],r`\[
\begin{gathered}
S_{(T_i)}=k[T_j/T_i:j\ne i],\\
U_i=\operatorname{Spec}S_{(T_i)}\cong\mathbb A_k^n.
\end{gathered}
\]`,'',r`Normalize the nonzero coordinate \(T_i\) to one.`);
const properLine=model('limits at infinity',[
 b('S',r`\operatorname{Spec}\mathbb C`),
 b('X',r`\mathbb P^1_{\mathbb C}`),
 b('f',r`X\to S`),
 b('R',r`\mathbb C[[t]]`),
 b('K',r`\mathbb C((t))`)
],r`\[
\begin{aligned}
\operatorname{Spec}K\to X&\quad\text{given by }[1:t^{-1}],\\
\operatorname{Spec}R\to X&\quad\text{given by }[t:1].
\end{aligned}
\]
\[
t=0\longmapsto[0:1].
\]`,'');
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
\]
\[
U\text{ open}\iff U\cap S^n\text{ open in }S^n\ \text{for all }n.
\]`,'');
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
\partial_i\sigma=\sum_{j=0}^i(-1)^j\sigma_j\quad(i>0),\\
\partial_0=0.
\end{gathered}
\]`,r`Each codimension-two face occurs twice with opposite signs.`,r`Order the vertices of a triangulated manifold.`);
const pairConnectingMap={...model('relative cohomology',[
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
\]`,r`Extend \(\alpha\) to a cochain \(\widetilde\alpha\) on \(M\).`,r`The connecting map detects whether a boundary class extends across \(M\).`),
 source:{url:'https://pi.math.cornell.edu/~hatcher/AT/ATch3.pdf#page=15',label:'Hatcher, Algebraic Topology, §3.1'}};
const injectiveExample=model('extending into the rationals',[
 b(r`\mathcal A`,r`\mathbf{Ab}`),b('J',r`\mathbb Q`),
 b('A,B',r`n\mathbb Z,\mathbb Z\quad(n\ge1)`)
],r`\[
\varphi:A\to J,\qquad \widetilde\varphi:B\to J,
\qquad \widetilde\varphi(1)=\frac{\varphi(n)}n.
\]`,'',r`Baer’s criterion reduces injectivity here to extensions from ideals of \(\mathbb Z\).`);
const injectivePoint=model('products of stalks',[
 X,b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),
 b('I_a',r`\mathcal F_a=\mathbb C\{z-a\}`,r`Its additive group is divisible, hence injective.`),
 b(r`\mathcal I(U)`,r`\prod_{a\in U} I_a`)
],r`\[
h\longmapsto([h]_a)_{a\in U}
\]`,'',r`Independent germs extend to larger opens by adding zero germs.`);
const injectiveModulePoint=model('meromorphic germs',[
 X,b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),
 b('R_a',r`\mathbb C\{z-a\}`),
 b('I_a',r`\operatorname{Frac}(R_a)`)
],r`\[
\begin{gathered}
\mathcal I(U)=\prod_{a\in U} I_a,\\
h\longmapsto([h]_a)_{a\in U}
\end{gathered}
\]`,r`Each fraction field is injective over its discrete valuation ring.`,r`Allow independent meromorphic germs at every point.`);
const injectiveResolution=model('injective resolutions',[
 X,b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`),
 b(r`\mathcal I^0(U)`,r`\prod_{a\in U}\mathcal F_a`),
 b(r`\mathcal Q`,r`\mathcal I^0/\mathcal F`)
],r`\[
\begin{aligned}
\mathcal I^1(U)&=\prod_{a\in U}\mathcal Q_a,\\
0\to\mathcal F\to\mathcal I^0&\longrightarrow\mathcal Q\hookrightarrow\mathcal I^1.
\end{aligned}
\]`,'',r`Embed in independent germs, then repeat with the cokernel.`);
const residueObstruction=model('residue obstruction',[
 sphereX,b('p',r`0`),
 b(r`\mathcal A`,r`\Omega_X^1`),
 b(r`\mathcal B`,r`\Omega_X^1(p)`),
 b(r`\mathcal C`,r`\mathbb C_p`),
 b('F',r`\Gamma(X,-)`)
],r`\[
\begin{gathered}
0\to\mathcal A\to\mathcal B
  \xrightarrow{\operatorname{res}_p}\mathcal C\to0,\\
\delta:\mathbb C\xrightarrow{\sim} H^1(X,\mathcal A).
\end{gathered}
\]`,r`The boundary class is represented by \(dz/z\) on the overlap, up to sign.`,r`The residue theorem rules out a global differential with a single nonzero residue.`);
const deRhamCohomology=model('de Rham cohomology',[
 b('X',r`M\text{ a smooth manifold}`),
 b(r`\mathcal F`,r`\underline{\mathbb R}_M`)
],r`\[
\begin{gathered}
0\to\underline{\mathbb R}_M\to\Omega_M^0
\xrightarrow{d}\Omega_M^1\xrightarrow{d}\cdots,\\
H^q(M,\underline{\mathbb R}_M)\cong H^q_{\mathrm{dR}}(M).
\end{gathered}
\]`,'',r`The Poincaré lemma gives exactness. Partitions of unity give acyclicity.`);
const cechDifferential=model('Čech differential',[
 b('X',r`\mathbb P^2_k`),
 b('U_i',r`D_+(T_i)`),
 b(r`\mathcal F`,r`\mathcal O_X(-3)`)
],r`\[
\begin{gathered}
s_{ij}\in\mathcal F(U_i\cap U_j),\quad V=U_0\cap U_1\cap U_2,\\
(\delta s)_{012}=s_{12}|_V-s_{02}|_V+s_{01}|_V.
\end{gathered}
\]`,'');
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
\]`,'',r`Choose local frames \(e_i\) for a real line bundle \(L\).`);
const cechDeRham=model('Čech–de Rham complex',[
 b('M',r`\text{a smooth manifold}`),
 b(r`\mathcal U`,r`\{U_i\}\text{ an open cover}`),
 b('K^{p,q}',r`\check C^p(\mathcal U,\Omega^q)`)
],r`\[
\begin{gathered}
K^{p,q}=\prod_{i_0<\cdots<i_p}\Omega^q(U_{i_0\cdots i_p}),\\
d_{\operatorname{Tot}}=\delta+(-1)^p d_{\mathrm{dR}}.
\end{gathered}
\]`,'',r`Exterior differentiation commutes with restriction.`);
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
\]`,'',r`The cohomology of the fibre supplies coefficients on the base.`),
 source:{url:'https://pi.math.cornell.edu/~hatcher/SSAT/SSch1.pdf',label:'Hatcher, The Serre Spectral Sequence, §1.2'}};
const cechSpectral=model('acyclic covers',[
 b('X',r`\mathbb P^1_k`),
 b(r`\mathcal U`,r`\{D_+(T_0),D_+(T_1)\}`),
 b(r`\mathcal F`,r`\mathcal O_X(-2)`)
],r`\[
\begin{gathered}
H^q(U_{i_0\cdots i_p},\mathcal F)=0\quad(q>0),\\
E_2^{p,0}=\check H^p(\mathcal U,\mathcal F)\cong H^p(X,\mathcal F).
\end{gathered}
\]`,'');
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
\]`,'',r`Compute the curve’s cohomology on the ambient plane’s charts.`);
const fibreCohomology=model('cohomology local systems',[
 b('f',r`E\to B`,r`A locally trivial bundle of manifolds with fibre \(F\).`),
 b(r`\mathcal F`,r`\underline{\mathbb Z}_E`)
],r`\[
\begin{gathered}
(R^q f_*\mathcal F)_b\cong H^q(E_b;\mathbb Z),\\
E_2^{p,q}=H^p(B,R^q f_*\mathcal F),\\
E_2^{p,q}\Longrightarrow H^{p+q}(E;\mathbb Z).
\end{gathered}
\]`,'',r`The higher direct image records fibre cohomology and monodromy.`);
const invertibleLine=model('invertible sheaves',[
 b('X',r`M\text{ a smooth manifold}`),
 b(r`\mathcal O_X`,r`\mathcal C^\infty_M`),
 b(r`\mathcal L`,r`\text{the sheaf of sections of a real line bundle}`)
],r`\[
\mathcal L\otimes_{\mathcal O_X}\mathcal L^\vee
\xrightarrow[\sim]{\mathrm{ev}}\mathcal O_X
\]`,'',r`In a local frame, \(e\otimes e^\vee\mapsto1\).`);
const genusExample={...model('compact Riemann surfaces',[
 b('k',r`\mathbb C`),
 b('X',r`\text{a smooth connected projective curve}`),
 b('M',r`X^{\mathrm{an}}`)
],r`\[
\begin{gathered}
g=\tfrac12\dim_{\mathbb R}H^1(M;\mathbb R),\\
g=\dim_{\mathbb C}H^0(M,\Omega_M^1)
 =\dim_{\mathbb C}H^1(X,\mathcal O_X).
\end{gathered}
\]`,'',r`Here \(g\) is the number of handles of the Riemann surface.`),kind:'analogy'};
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
 curve,b('f',r`(C\to C')\text{ finite}`),b('p',r`\text{a closed point of }C`)
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
const curveNorm=model('norm under the squaring map',[
 b('X,Y',r`\mathbb P^1_z,\mathbb P^1_t\quad\text{over }\mathbb C`),
 b('f',r`(t=z^2)`),b('h',r`z-a`)
],r`\[
\begin{gathered}
N(h)=(z-a)(-z-a)=a^2-t,\\
f_*\operatorname{div}(h)=[a^2]-[\infty]
=\operatorname{div}(N(h)).
\end{gathered}
\]`,'');
const curveFirstChern=model('divisor of a section',[
 curve,curveLine,b('s',r`\text{a nonzero meromorphic section of }\mathcal L`),
 b('D',r`\operatorname{div}(s)`)
],r`\[
\begin{gathered}
c_1(\mathcal L)\cap[C]=[D]\quad\text{in }\operatorname{CH}_0(C),\\
\operatorname{div}(hs)=D+\operatorname{div}(h)
\qquad(h\in\mathbb C(C)^\times).
\end{gathered}
\]`,'');
const curveBivariant=model('first Chern class',[
 curve,curveLine,b('f',r`(C'\to C)\text{ finite between smooth curves}`),
 b('t_p',r`\text{a local parameter at }p`)
],r`\[
\begin{gathered}
c_1(\mathcal L)_f:[C']\longmapsto[f^*D],\\
f^*[p]=\sum_{q\in f^{-1}(p)}e_q[q],
\qquad e_q=\operatorname{ord}_q(f^*t_p).
\end{gathered}
\]`,'');
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
\]`,r`The tangent line’s first Chern class is the Euler class of the real tangent plane.`);
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
\]`,r`Pushforward takes degrees, with \(\deg c_1(T_C)=2-2g\).`);
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
 solutionSheaf:['01AF'],connected:['004R'],natural:['003D'],twoFibre:['003O'],over:['02XG'],topology:['004E'],basis:['004O'],irreducible:['004U'],noetherian:['0050'],compact:['0059'],specialization:['0060'],
 snake:['07JV'],colimits:['09WN','07N7','002Z'],localization:['00CM'],spectrum:['00DY'],constructible:['04ZC','053X'],
 sheaf:['006G','006S','006Z','006M','0071','007L'],
 moduleSheaf:['0076','0088'],
 stalk:['0078','007E','007G'],moduleStalk:['007I'],exactSheaf:['007S'],
 sheafify:['007X','0083','0086'],
 functorial:['008C','008N','008P','008R','0094'],
 ringed:['0090','01HA'],open:['009Z','01HD'],
 algebraGlue:['00EN'],affine:['01HR'],affineMaps:['01HX'],scheme:['01II'],
 category:['0013'],limits:['04AQ','04AS','0027'],adjoint:['0036'],
 nakayama:['07RC'],modules:['0581'],finite:['0517','00F2','00F5'],idempotent:['04PN'],rings:['00AQ','00AR','00DR'],
 basisSheaf:['009H'],
 regularGlue:['00EI'],bundlePullback:['001U'],setLimits:['002U'],
 abelian:['09SE','00ZX','010M','0033']
};
const fundamentalGroup=model('fundamental group',[
 b(r`\mathcal A`,r`\mathbf{Top}_*`),
 b(r`\mathcal B`,r`\mathbf{Groups}`),
 b('F',r`((X,x_0)\mapsto\pi_1(X,x_0))`),
 b('x,y',r`(S^1,1),(S^1,1)`),
 b(r`\phi`,r`(z\mapsto z^2)`)
],r`\[
\begin{gathered}
F(\phi)[\gamma]=[\phi\circ\gamma],\\
F(\phi):\mathbb Z\xrightarrow{\times2}\mathbb Z
\end{gathered}
\]`,'',r`A map acts on based loops by postcomposition.`);
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
 b(r`\mathcal A`,r`\mathbf{Man}_*`),
 b(r`\mathcal B`,r`\mathbf{Vect}_{\mathbb R}`),
 b('F',r`((M,p)\mapsto T_pM)`),
 b('x',r`(M,p)`),
 b('y',r`(N,\phi(p))`),
 b(r`\phi`,r`M\to N`),
 b(r`F(\phi)`,r`d\phi_p:T_pM\to T_{\phi(p)}N`)
],r`\[
d(g\circ f)_p=dg_{f(p)}\circ df_p
\]`,'',r`Functoriality is the chain rule.`);
const bundlesOver={...model('vector bundles',[],r`\(\begin{array}{ccc}
E & \xrightarrow{\text{bundle map }u} & E' \\
{\scriptstyle p}\,\searrow && \swarrow\,{\scriptstyle p'} \\
& X &
\end{array}\)`,'',''),kind:'analogy'};
const pointedSpacesUnder={...model('pointed spaces',[],'',''),points:[
 r`\(\mathcal C=\mathbf{Top}\)`,
 r`\(X=*\), a point`,
 r`\(\begin{array}{ccc}
& * & \\
{\scriptstyle y_0}\,\swarrow && \searrow\,{\scriptstyle y'_0} \\
Y & \xrightarrow{\ u\ } & Y'
\end{array}\)`,
 r`\(*/\mathbf{Top}=\mathbf{Top}_*\), the category of pointed spaces`
]};
const hurewicz={...model('Hurewicz map',[],'',''),points:[
 r`\(\mathcal A=\mathbf{Top}_*,\quad \mathcal B=\mathbf{Groups}\)`,
 r`\(F=\pi_n(-),\quad G=H_n(-,\mathbb Z)\), for \(n\geq 1\)`,
 r`\(\begin{gathered}
h_X:\pi_n(X,x_0)\longrightarrow H_n(X,\mathbb Z),\\
[\alpha:S^n\to X]\longmapsto\alpha_*[S^n].
\end{gathered}\)`,
 r`\(\begin{array}{ccc}
\pi_n(X,x_0) & \xrightarrow{h_X} & H_n(X,\mathbb Z) \\
\big\downarrow\mathrlap{\scriptstyle \pi_n(f)} && \big\downarrow\mathrlap{\scriptstyle H_n(f,\mathbb Z)} \\
\pi_n(Y,y_0) & \xrightarrow{h_Y} & H_n(Y,\mathbb Z)
\end{array}\)`
]};
const coordinateSpaces={...model('coordinate vector spaces',[],'',''),points:[
 r`\(\mathcal B=\mathbf{Vect}_{\mathbb R}\)`,
 {
  text:r`\(\mathcal A\) is the subcategory of \(\mathcal B\) with`,
  children:[
   r`\(\operatorname{Ob}(\mathcal A)=\{\mathbb R^n:n\geq 0\}\)`,
   r`\(\operatorname{Mor}(\mathbb R^n,\mathbb R^m)\cong\operatorname{Mat}_{m\times n}(\mathbb R)\)`
  ]
 },
 'It is a full subcategory.'
]};
const matrixEquivalence={...model('matrices',[],'',''),points:[
 {
  text:r`\(\mathcal A=\mathbf{Mat}_k\)`,
  children:[
   r`\(\operatorname{Ob}(\mathcal A)=\{n:n\geq 0\}\)`,
   r`\(\operatorname{Mor}_{\mathcal A}(n,m)=\operatorname{Mat}_{n\times m}(k)\)`
  ]
 },
 r`\(\mathcal B=\mathbf{Vect}^{\mathrm{fd}}_k\), the category of finite-dimensional \(k\)-vector spaces`,
 r`An equivalence \(F:\mathcal A\to\mathcal B\) sends \(n\mapsto k^n\) and \(M\mapsto (v\mapsto vM)\) for row vectors \(v\).`
]};
const singularCohomology={...model('singular cohomology',[],'',''),points:[
 r`\(\mathcal C=\mathbf{Top}\), \(\mathcal S=\mathbf{Ab}\).`,
 r`\(F=H^n(-,\mathbb Z):\mathbf{Top}\to\mathbf{Ab}\), the \(n\)th singular cohomology.`,
 r`For a morphism \(\psi:X\to Y\) in \(\mathbf{Top}\), \(F(\psi)=\psi^*:H^n(Y,\mathbb Z)\to H^n(X,\mathbb Z)\) is the pullback map.`,
 r`It satisfies \((\phi\circ\psi)^*=\psi^*\circ\phi^*\) (reversing order).`,
 r`Thus, we may form the opposite category of \(\mathbf{Top}\), so the continuous map \(\psi:X\to Y\) becomes \(\psi:Y\to X\) in \(\mathbf{Top}^{\mathrm{opp}}\), and \(H^n(-,\mathbb Z)\) becomes a (covariant) functor from \(\mathbf{Top}^{\mathrm{opp}}\) to \(\mathbf{Ab}\).`
]};
const vectorFunctorSetup=[
 r`\(\mathcal C=\mathbf{Vect}_k^{\mathrm{opp}}\), \(U=k\).`,
 r`\(h_U(V)=\operatorname{Hom}_k(k,V)\), \(F(V)=V\) as a set.`
];
const vectorYoneda={...model('scalar multiplication',[],'',''),points:[
 ...vectorFunctorSetup,
 r`For a natural transformation \(s:h_U\to F\), let \(\lambda=s_k(\mathrm{id}_k)\in k\).`,
 r`For \(f:k\to V\) with \(f(1)=v\), naturality gives \(s_V(f)=f(\lambda)=\lambda v\).`
]};
const vectorRepresentability={...model('the underlying set of a vector space',[],'',''),points:[
 ...vectorFunctorSetup,
 r`The bijection \(h_U(V)\to F(V)\), \(f\mapsto f(1)\), is natural in \(V\).`,
 r`The universal vector is \(1\in F(k)\).`
]};
const topologicalPresheaf={...model('presheaves on a topological space',[],'',''),points:[
 {
  text:r`\(\mathcal C=\operatorname{Open}(X)\)`,
  children:[
   r`\(\operatorname{Ob}(\mathcal C)=\{U\subseteq X: U\text{ open}\}\) for a topological space \(X\).`,
   r`\(\operatorname{Mor}_{\mathcal C}(U,V)=\{\text{inclusion } U\to V\}\) if \(U\subseteq V\), and \(\emptyset\) otherwise.`
  ]
 },
 {
  text:r`A contravariant functor \(F:\operatorname{Open}(X)\to\mathbf{Sets}\) assigns`,
  children:[
   r`a set \(F(U)\) to each open set \(U\)`,
   r`a restriction map \(F(V)\to F(U)\) to each inclusion \(U\to V\)`
  ]
 },
 r`The restriction maps are compatible with chains of inclusions.`
]};
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
\]`,'',r`A single point with its first-order Taylor data.`)]
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
 '0A23':{...model('a plane conic',[],'',''),points:[
  r`\(S=k[T_0,T_1,T_2]\), \(F=T_0T_2-T_1^2\).`,
  r`\(C=V_+(F)=\operatorname{Proj}(S/(F))\subset\mathbb P_k^2\).`,
  r`\([s:t]\mapsto[s^2:st:t^2]\) identifies \(\mathbb P_k^1\) with \(C\). Thus \(C\) is a projective variety of dimension \(1\).`
 ]},
 '001G':bundlesOver,
 '001H':pointedSpacesUnder,
 '001I':hurewicz,
 '001J':matrixEquivalence,
 '001N':singularCohomology,
 '001P':vectorYoneda,
 '001Q':vectorRepresentability,
 '02X6':topologicalPresheaf,
 '006E':{...model('sheaf of holomorphic functions',[],'',''),points:[
  r`\(X=\mathbb C\) or a Riemann surface`,
  r`\(\mathcal F(U)=\{h:U\to\mathbb C\mid h\text{ holomorphic}\}\)`,
  r`\(\rho^U_V\) is literally restriction to \(V\), \(h\mapsto h|_V\)`
 ],examples:[
  {...model('sheaf of sections of a vector bundle',[],'',''),points:[
   r`\(X\) a smooth manifold`,
   r`\(p:E\to X\) a smooth vector bundle`,
   r`\(\mathcal F(U)=\{\text{smooth sections }s:U\to E\}\), with \(p(s(x))=x\) for \(x\in U\)`,
   r`\(\rho^U_V\) is literally restriction of sections, \(s\mapsto s|_V\)`
  ]}
 ]},
 '006K':models.abelianMorphism,
 '006Q':{...model('sheaf of differential forms',[],'',''),points:[
  r`\(X\) a smooth manifold`,
  r`\(\mathcal O(U)=C^\infty(U)=\{f:U\to\mathbb R\mid f\text{ smooth}\}\)`,
  r`\(\mathcal F(U)=\Omega^p(U)\) \(=\{\text{differential }p\text{-forms }\omega\text{ on }U\}\)`,
  r`\(\mathcal O\times\mathcal F\to\mathcal F\), \((f,\omega)\mapsto f\omega\)`,
  r`\(d:\Omega^p\to\Omega^{p+1}\) is a morphism of presheaves of \(\mathbb R\)-vector spaces. The term \(df\wedge\omega\) in \(d(f\omega)=df\wedge\omega+f\,d\omega\) obstructs \(\mathcal O\)-linearity.`
 ]},
 '0106':models.kernel,
 '07BI':models.local,
 '05CF':{...model('a line bundle over the affine line',[],'',''),points:[
  r`\(R=\mathbb C[z]\), \(X=\operatorname{Spec}R\), and \(F=R^2\) is the module of sections of the trivial plane bundle.`,
  r`The line \(v=zu\) in each fibre gives the module of sections \(P=\{(f,zf):f\in R\}\).`,
  r`Project onto that line by
\[
e(f,g)=(f,zf),\qquad e^2=e,\qquad P=\operatorname{im}e.
\]`,
  r`\(F=P\oplus R(0,1)\). The section \((1,z)\) is a basis of \(P\).`,
  r`Evaluation at the basis section gives
\[
\operatorname{Hom}_R(P,N)\xrightarrow{\sim}N,\qquad h\mapsto h(1,z).
\]
Thus \(\operatorname{Hom}_R(P,-)\) is exact and \(\operatorname{Ext}^1_R(P,N)=0\) for every \(R\)-module \(N\).`
 ]},
 '01IJ':{...models.scheme,bindings:[...models.scheme.bindings,b(r`\Sch`,r`\text{the category of schemes}`)]},
 '01IL':model('punctured affine plane',[
  b('k',r`\mathbb F_2`),
  b('X',r`\operatorname{Spec}(k[x,y])`),
  b('U',r`X\setminus\{(x,y)\}`)
 ],r`\[
\Gamma(U,\mathcal O_U)=k[x,y,1/x]\cap k[x,y,1/y]=k[x,y]
\]`,r`If \(U\) were affine, its global ring would recover all of \(X\), including the origin.`),
};
const sectionNotes=Object.fromEntries(Object.entries(sectionGroups)
 .flatMap(([name,tags])=>tags.map(tag=>[tag,models[name]])));

export const proseNotes={
 '07BH':{
  id:'localization-at-a-prime',
  start:r`\medskip\noindent
The localization $R_\mathfrak p$`,
  end:r`\medskip\noindent
Let $\varphi : R \to S$ be a ring map.`,
  example:{...model('rational functions regular at a point',[],'',''),points:[
   r`\(R=\mathbb C[z]\)`,
   r`\(\mathfrak p=(z-a),\quad a\in\mathbb C\)`,
   r`\(\displaystyle R_{\mathfrak p}=R(R\setminus\mathfrak p)^{-1}\)
\(\displaystyle =\{f=p/q:q\notin\mathfrak p\}\)
\(\displaystyle =\left\{\frac{p(z)}{q(z)}\in\mathbb C(z):q(a)\ne0\right\}\)`,
   r`\(\kappa_{\mathfrak p}\cong\mathbb C\)`
  ]}
 }
};

const sharedNotes=Object.fromEntries(Object.entries(sharedPassageNotes.stacks).map(([tag,{title,body,points}])=>[
 tag,{...model(title||'example',[],'','',body),points}
]));
export const noteTags=[...Object.keys(sectionNotes),...Object.keys(passageNotes),...Object.keys(sharedNotes)];

export function notesFor(sectionTag,passageTag){
 const prose=proseNotes[sectionTag];
 const passage=sharedNotes[passageTag]||passageNotes[passageTag]||(prose?.id===passageTag?prose?.example:null);
 const primary=passage?{...passage,scope:'statement'}:sectionNotes[sectionTag];
 if(!primary)return {tag:sectionTag,examples:[]};
 return {
  tag:passage?passageTag:sectionTag,
  examples:[primary,...(primary.examples??additionalExamples[sectionTag]??[])]
 };
}
