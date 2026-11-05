// Authored commentary. The main column is rendered separately from upstream LaTeX.
const r=String.raw;
const b=(symbol,value,kind,detail='')=>({symbol,value,kind,detail});
const model=(title,bindings,check,result,note='')=>({title,bindings,check,result,note,scope:'section'});
const X=b('X',r`\mathbb C`,'The complex plane with its usual topology.');
const U=b('U',r`\text{an open set in }\mathbb C`,'An arbitrary open subset of the complex plane.',r`A nonempty connected open set is called a domain. Picture such a domain first; the presheaf is defined on every open set, including disconnected opens and the empty set.`);
const disk=b('U',r`D(a,r)=\{z:|z-a|<r\}`,'An open disk, used here as a basis neighbourhood.');
const O=b(r`\mathcal O`,r`\mathcal O^{\mathrm{an}}_{\mathbb C}`,'The sheaf of holomorphic functions.');
const F=b(r`\mathcal F`,r`\mathcal O^{\mathrm{an}}_{\mathbb C}`,'A sheaf; forget multiplication when the source asks for abelian groups or sets.');
const R=b('R',r`\mathbb C[z]`,'The ring of polynomial functions on the complex line.');
const A=b('X',r`\operatorname{Spec}(\mathbb C[z])`,'The algebraic affine line, with its Zariski topology.');
const integers=b('R',r`\mathbb Z`,'The ring of integers.');
const arithmeticSpectrum=b('X',r`\operatorname{Spec}(\mathbb Z)`,'The spectrum of the integers.');
const twoPoints=b('X',r`\{a,b\}`,'A discrete space with two points.');
const generic=r`Section model. Additional objects and hypotheses in individual statements and proofs retain their source meanings.`;
const models={
 topology:model('A topology with a generic point',[
  b('X',r`\{\eta,s\}`,'A space with a generic point and a closed point.'),
  b(r`\mathcal T`,r`\{\varnothing,\{\eta\},X\}`,'The collection of open sets.')
 ],r`These opens are closed under arbitrary unions and finite intersections. The only open neighbourhood of \(s\) is \(X\), so it contains \(\eta\).`,r`The closure of \(\{\eta\}\) is \(X\), while \(\{s\}\) is closed. This is the topology of \(\operatorname{Spec}(\mathbb Z_{(p)})\) for a prime number \(p\).`),
 basis:model('Disks are enough',[X,b(r`\mathcal B`,r`\{D(a,r):a\in\mathbb C,\ r>0\}`,'A basis for the usual topology.'),disk],r`Every point of an open subset lies in a smaller disk inside it. An intersection of two disks need not be a disk, but can be covered by disks.`,r`Knowing local functions and their restrictions on disks is enough to reconstruct them on all opens. Later, standard opens play the same role on a spectrum.`),
 irreducible:model('A different topology on the complex line',[A,b('Z',r`V(z(z-1))`,'The closed set consisting of two closed points.'),b(r`\eta`,r`(0)`,'The generic point of the algebraic line.')],r`A proper Zariski closed subset of this spectrum is finite. Two nonempty opens therefore meet, and the closure of the generic point is the whole spectrum.`,r`This is an irreducible space. The usual complex plane is Hausdorff and has disjoint disks; its usual topology is a different example.`),
 compact:model('Two denominators cover the integer spectrum',[
  arithmeticSpectrum,b('U_1',r`D(2)`,'The primes that do not contain two.'),
  b('U_2',r`D(3)`,'The primes that do not contain three.')
 ],r`Since \(3-2=1\), no prime ideal contains both \(2\) and \(3\). Thus \(D(2)\cup D(3)=X\).`,r`For any cover of \(X\) by standard opens \(D(f_i)\), the \(f_i\) generate the unit ideal. An expression for \(1\) uses finitely many of them, and those opens already cover. An arbitrary open cover can first be refined by standard opens.`),
 specialization:model('The point that has no analytic counterpart',[A,b('x',r`\eta=(0)`,'The generic point.'),b("x'",r`(z-a)`,'A closed point, specified by evaluation at a complex number.')],r`The prime ideal inclusion \((0)\subset(z-a)\) says that the closed point lies in the closure of the generic point.`,r`The generic point specializes to every closed point. In a Hausdorff Riemann surface every singleton is closed, so specialization between distinct points disappears.`),
 rings:model('Reduction modulo an integer',[
  integers,b('I',r`(6)`,'The ideal of multiples of six.'),
  b(r`\varphi`,r`(n\mapsto n\bmod 6)`,'The quotient ring homomorphism.')
 ],r`The reduction map respects addition and multiplication and sends \(1\) to \(1\). Its kernel is \((6)\).`,r`The ideals \((2)\) and \((3)\) are prime because their quotients are fields. The quotient by \((6)\) has nonzero zero divisors, since \(2\cdot3=0\) there.`),
 modules:model('Vector-valued functions',[R,b('M',r`R^{\oplus n}`,'Polynomial vector-valued functions, a free module.'),b('N',r`R^{\oplus m}`,'A second free module.')],r`Multiplying a vector-valued function by a scalar function is the module operation. A matrix of polynomials gives a module map.`,r`Modules generalize sections of trivial bundles. A general module or sheaf of modules need not come from a vector bundle; local freeness is an extra condition.`),
 snake:model('Exactness measures vanishing and lifting',[R,b('M',r`\mathbb C[z]`,'A module over the polynomial ring.'),b('N',r`\mathbb C[z]/(z)`,'The value space at the origin.')],r`The sequence \(0\to R\xrightarrow{\,z\,}R\to R/(z)\to0\) is exact: vanishing at the origin is precisely divisibility by the coordinate.`,r`Kernels and cokernels record the conditions for solving a local equation. The snake lemma tracks how these conditions change in a commutative diagram. The displayed sequence is a model for exactness, not a full substitution into each diagram.`),
 colimits:model('Doubling builds dyadic fractions',[
  b('I',r`\mathbb Z_{\ge 0}`,'Stages indexed by the nonnegative integers.'),
  b('M_i',r`\mathbb Z`,r`The additive group at stage \(i\). The transition to stage \(i+1\) doubles each integer.`),
  b('M',r`\mathbb Z[1/2]`,'The colimit as an additive group.')
 ],r`Send \(a\) at stage \(i\) to \(a/2^i\). This gives the same fraction as \(2a\) at stage \(i+1\). Every dyadic fraction has a representative, and any two equal fractions have the same numerator when moved to a common stage.`,r`For example, \(1\) at stage \(0\) and \(2\) at stage \(1\) represent the same element of the colimit.`),
 localization:model('Allow powers of two in denominators',[
  integers,b('S',r`\{1,2,2^2,\ldots\}`,'The multiplicative set generated by two.'),
  b(r`S^{-1}R`,r`\mathbb Z[1/2]`,'The ring of dyadic fractions.')
 ],r`Fractions have the form \(m/2^n\). For example, \(1/2\) and \(2/4\) represent the same element.`,r`A ring map out of \(\mathbb Z\) that sends \(2\) to a unit extends uniquely to \(\mathbb Z[1/2]\). The fraction \(1/3\) is absent, since no power of two is divisible by three.`),
 local:model('Localize the integers at a prime',[
  b('R',r`\mathbb Z_{(p)}`,r`Fractions with denominator prime to the prime number \(p\).`),
  b(r`\mathfrak m`,r`p\mathbb Z_{(p)}`,'The ideal of fractions whose numerator is divisible by the prime.'),
  b(r`\kappa`,r`\mathbb F_p`,'The residue field.')
 ],r`A fraction \(a/b\) with \(p\nmid b\) is a unit exactly when \(p\nmid a\). In that case \(b/a\) belongs to the same ring.`,r`Every element outside \(\mathfrak m\) is a unit, so \(\mathfrak m\) is the unique maximal ideal. The residue map sends \(a/b\) to \(\bar a\,\bar b^{-1}\).`),
 spectrum:model('Prime numbers as closed points',[
  integers,arithmeticSpectrum,
  b(r`\mathfrak p`,r`(p)`,'A closed point indexed by a prime number.'),
  b(r`\eta`,r`(0)`,'The generic point.'),
  b(r`D(6)`,r`X\setminus\{(2),(3)\}`,'The open where six is invertible.')
 ],r`The prime ideals of \(\mathbb Z\) are \((0)\) and \((p)\) for prime numbers \(p\). A closed point \((p)\) lies in \(D(n)\) exactly when \(p\nmid n\).`,r`The point \((0)\) lies in every nonempty open, and its closure is the entire space. A nonzero integer cuts out precisely the closed points indexed by its prime divisors.`),
 sheaf:model('Holomorphic functions, with restriction',[X,U,F,b(r`\mathcal F(U)`,r`\operatorname{Hol}(U)`,'The set of all holomorphic functions on this open set.',r`An element \(h\in\mathcal F(U)\) is a holomorphic map \(h:U\to\mathbb C\), defined on all of \(U\).`),b(r`\rho^U_V`,r`(h\mapsto h|_V)`,'Restriction to any smaller open subset.',r`Here \(V\subseteq U\) is open; it need not be connected.`)],r`Restriction preserves identity and composition. Functions that agree on overlaps glue uniquely, because being holomorphic is local.`,r`A sheaf records compatible functions on all opens. When the source speaks of a presheaf, only the restriction rules are required; the gluing axiom is additional.`),
 moduleSheaf:model('Sections of a trivial holomorphic bundle',[X,O,b(r`\mathcal F`,r`(\mathcal O^{\mathrm{an}}_{\mathbb C})^{\oplus n}`,'Holomorphic vector-valued functions, a sheaf of modules.'),b(r`\mathcal F(U)`,r`\operatorname{Hol}(U)^n`,'The sections of the trivial rank-n bundle over this open.')],r`Restriction and gluing work coordinate by coordinate, and multiplication by a holomorphic function commutes with restriction.`,r`Locally free sheaves behave like bundles. The source allows arbitrary sheaves of modules, which can also contain torsion and need not describe a bundle.`),
 stalk:model('A holomorphic germ is its convergent Taylor series',[
 X,b('x',r`a\in\mathbb C`,'The point at which we take germs.'),
 b('t',r`z-a`,'The local coordinate centred at this point.'),F,
 b(r`\mathcal F_x`,r`\mathcal O^{\mathrm{an}}_{\mathbb C,a}\cong\mathbb C\{t\}`,'Holomorphic germs, identified with convergent Taylor series.',r`The notation \(\mathbb C\{t\}\) means power series in \(t\) with a positive radius of convergence.`),
 b(r`[f]_a`,r`\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}t^n`,'The Taylor series corresponding to this germ under the identification above.')
 ],r`A representative \(f\) is holomorphic on some neighbourhood of \(a\). Shrinking that neighbourhood leaves all derivatives at \(a\) unchanged. Two representatives give the same germ exactly when their Taylor series at \(a\) agree: each function equals its series on a sufficiently small disk.`,r`Conversely, a power series with positive radius of convergence sums to a holomorphic function near \(a\), hence defines a germ. Addition and multiplication agree, so this is an isomorphism of rings. The ring \(\mathbb C\{t\}\) contains convergent series; \(\mathbb C[[t]]\) also allows formal series with zero radius of convergence.`,r`This Taylor description uses holomorphicity. Smooth germs, such as those in the main text’s Example 6.11.4, need not be determined by their Taylor series.`),
 moduleStalk:model('A bundle near a point',[X,O,b('x',r`0`,'The origin.'),b(r`\mathcal F`,r`\mathcal O^{\oplus n}`,'The sheaf of holomorphic sections of a trivial bundle.'),b(r`\mathcal F_x`,r`\mathbb C\{t\}^{\oplus n}`,'A module of vector-valued germs, not the fibre itself.',r`Each component is identified with its convergent Taylor series at the origin.`)],r`Taking germs preserves scalar multiplication. The stalk is a module over the local ring of scalar germs.`,r`To obtain the vector-space fibre, take \(\mathcal F_x/\mathfrak m_x\mathcal F_x\cong\mathbb C^n\). A stalk and a fibre retain different amounts of information.`),
 exactSheaf:model('A local solution need not be global',[X,b('U',r`\mathbb C^\times`,'A domain inside the complex plane on which global solvability can fail.'),b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`,'Holomorphic functions, viewed as a sheaf of complex vector spaces.'),b(r`\mathcal G`,r`\mathcal O_X^{\mathrm{an}}`,'The same sheaf, as the target.'),b(r`\varphi`,r`D=\frac{d}{dz}-1`,'A differential operator, acting by differentiation minus the original function.')],r`On a small disk, solve \(D(h)=g\) by integrating \((e^{-z}h)'=e^{-z}g\). Thus every germ in the target has a preimage: the operator is surjective on stalks.`,r`On the domain \(U=\mathbb C^\times\), the equation \(D(h)=e^z/z\) has no holomorphic solution on all of \(U\), since it would give a single-valued primitive of \(1/z\). Surjectivity of sheaves means local solvability; it does not imply solvability on every open set. The homogeneous kernel consists of solutions of \(h'-h=0\).`),
 discreteCover:model('Cover a discrete space by its two points',[
  twoPoints,b('U',r`X`,'The open set being covered.'),
  b('U_1',r`\{a\}`,'One open in the cover.'),b('U_2',r`\{b\}`,'The other open in the cover.')
 ],r`The union is \(U\) and the intersection is empty. Each point lies in an open belonging to the cover.`,r`Sections on the two opens can be chosen independently for a sheaf, since their restrictions to the empty overlap agree.`),
 discreteFunctions:model('Functions into the field of two elements',[
  twoPoints,b(r`\mathcal F(U)`,r`\operatorname{Map}(U,\mathbb F_2)`,'The ring of functions on an open set, with pointwise operations.'),
  b(r`\mathcal F(X)`,r`\mathbb F_2\times\mathbb F_2`,'One coordinate for each point.')
 ],r`Restriction from \(X\) to \(\{a\}\) projects to the first coordinate. This preserves addition, multiplication, and the unit.`,r`Two singleton sections glue to the unique function with those two values. On the empty open there is one function, forming the zero ring.`),
 discreteBasis:model('A basis of two singletons',[
  twoPoints,b(r`\mathcal B`,r`\{\{a\},\{b\}\}`,'A basis for the discrete topology.'),
  b(r`\mathcal F(\{a\})`,r`\mathbb F_2`,'The possible values at the first point.'),
  b(r`\mathcal F(\{b\})`,r`\mathbb F_2`,'The possible values at the second point.')
 ],r`The intersection of the two distinct basis opens is empty, so no basis neighbourhood imposes a compatibility condition between their sections.`,r`Extending the sheaf to all opens gives \(\mathcal F(X)=\mathbb F_2\times\mathbb F_2\), with the projections as restriction maps.`),
 discreteMap:model('Pull back functions along a map to a point',[
  twoPoints,b('Y',r`\{c\}`,'A one-point space.'),b('f',r`(X\longrightarrow Y)`,'The map sending both points to the single point.'),
  b(r`\mathcal O_X(U)`,r`\operatorname{Map}(U,\mathbb F_2)`,'Functions on opens of the source.'),
  b(r`\mathcal O_Y(V)`,r`\operatorname{Map}(V,\mathbb F_2)`,'Functions on opens of the target.')
 ],r`Since \(f^{-1}(Y)=X\), the direct image has \((f_*\mathcal O_X)(Y)=\mathbb F_2\times\mathbb F_2\).`,r`The map on functions \(\mathcal O_Y\to f_*\mathcal O_X\) takes \(v\) to \((v,v)\) over \(Y\). A value at the target point pulls back to the same value at both source points.`),
 sheafify:model('Independent values at two points',[
  twoPoints,b('A',r`\mathbb F_2`,'The field of two elements, used as the constant values.'),
  b(r`\mathcal F(U)`,r`A`,'The constant presheaf on every open set.'),
  b(r`\mathcal F^\#(U)`,r`\operatorname{Map}(U,A)`,'The sheaf of functions with values in the set of constants.')
 ],r`The stalk at either point is \(A\). Since each singleton is open, every assignment of values to the two points is locally represented by constant sections.`,r`The map \(\mathcal F(X)\to\mathcal F^\#(X)\) sends \(c\) to \((c,c)\). Sheafification adds the two mixed pairs, which come from compatible sections on the disjoint singletons.`),
 functorial:model('Pull a function back by a holomorphic map',[b('X',r`\mathbb C_z`,'The source complex line.'),b('Y',r`\mathbb C_t`,'The target complex line.'),b('f',r`(z\mapsto z^2)`,'A holomorphic map.'),b(r`\mathcal F`,r`\mathcal O_X^{\mathrm{an}}`,'A sheaf on the source.'),b(r`\mathcal G`,r`\mathcal O_Y^{\mathrm{an}}`,'A sheaf on the target.')],r`For an open set in the target, \((f_*\mathcal F)(V)=\mathcal F(f^{-1}(V))\). Composition sends a holomorphic function \(h(t)\) to \(h(z^2)\).`,r`The inverse-image sheaf collects local information from neighbourhoods in the target; the direct image reads sections on their inverse images. A ringed-space map supplies the extra homomorphism \(f^{-1}\mathcal O_Y\to\mathcal O_X\). Module pullback additionally changes scalars.`),
 ringed:model('The closed point at a prime number',[
  b('X',r`\operatorname{Spec}(\mathbb F_p)`,'A scheme with one point.'),
  b('Y',r`\operatorname{Spec}(\mathbb Z)`,'The spectrum of the integers.'),
  b('x',r`(0)`,'The unique point of the source.'),
  b('f',r`(X\longrightarrow Y)`,'The morphism induced by reduction modulo the prime.'),
  b(r`f^\sharp_x`,r`(\mathbb Z_{(p)}\longrightarrow\mathbb F_p)`,'The residue homomorphism on stalks.')
 ],r`The inverse image of \((0)\) under \(\mathbb Z\to\mathbb F_p\) is \((p)\), so \(f(x)=(p)\). The map on stalks reduces the numerator and denominator modulo \(p\).`,r`The inverse image of the maximal ideal \((0)\) of \(\mathbb F_p\) is \(p\mathbb Z_{(p)}\). This is the local homomorphism condition for the morphism of locally ringed spaces.`),
 open:model('Remove the prime at two',[
  arithmeticSpectrum,b('U',r`D(2)\cong\operatorname{Spec}(\mathbb Z[1/2])`,'The open subspace where two is invertible.'),
  b('j',r`(U\hookrightarrow X)`,'The inclusion.'),
  b(r`\mathcal O_U`,r`\mathcal O_X|_U`,'The restricted structure sheaf.')
 ],r`For any open \(V\subseteq U\), the restriction has sections \(\mathcal O_X(V)\). The neighbourhoods contained in \(U\) suffice for taking germs at every point of \(U\).`,r`The stalk at an odd prime \((p)\) is still \(\mathbb Z_{(p)}\). Sections over \(U\) form \(\mathbb Z[1/2]\), and the point \((2)\) is outside their domain.`),
 algebraGlue:model('Detect a module element at its primes',[
  integers,b('M',r`\mathbb Z/6\mathbb Z`,'A module supported at the primes two and three.'),
  b(r`M_{(2)}`,r`\mathbb Z/2\mathbb Z`,'The localization at the prime two.'),
  b(r`M_{(3)}`,r`\mathbb Z/3\mathbb Z`,'The localization at the prime three.')
 ],r`Localizing at \((2)\) inverts \(3\), so \(6m=0\) becomes \(2m=0\). At \((3)\), the relation becomes \(3m=0\). At every other point, \(6\) is invertible and the localized module is zero.`,r`An element that maps to zero at both surviving primes is zero modulo six. This illustrates the test for vanishing by localization.`),
 arithmeticGlue:model('Glue fractions with different allowed denominators',[
  integers,b('f_1,f_2',r`2,3`,'The generators of a standard open cover.'),
  b('R_{f_1}',r`\mathbb Z[1/2]`,'Fractions with powers of two as denominators.'),
  b('R_{f_2}',r`\mathbb Z[1/3]`,'Fractions with powers of three as denominators.'),
  b('R_{f_1 f_2}',r`\mathbb Z[1/6]`,'The ring on the overlap.')
 ],r`Since \(3-2=1\), the two standard opens cover the spectrum. Compatibility means equality of the two fractions in \(\mathbb Z[1/6]\).`,r`A fraction lying in both rings must have reduced denominator \(1\). Every compatible pair is therefore the restriction of a unique integer.`),
 affine:model('The structure sheaf of the integer spectrum',[
  integers,arithmeticSpectrum,b(r`\mathcal O_X`,r`\widetilde{\mathbb Z}`,'The structure sheaf.'),
  b(r`\mathcal O_X(D(2))`,r`\mathbb Z[1/2]`,'Sections over the open where two is invertible.'),
  b(r`\mathcal O_{X,(2)}`,r`\mathbb Z_{(2)}`,'Germs at the point corresponding to the prime two.')
 ],r`The rule \(D(n)\mapsto\mathbb Z[1/n]\) gives sections on the standard opens. Compatible fractions glue, and these opens form a basis.`,r`The section \(1/2\) is defined on \(D(2)\), which omits \((2)\). A germ at \((2)\) can have an odd denominator, since it comes from an open neighbourhood of that point.`),
 affineMaps:model('Maps pull functions in the opposite direction',[b('R',r`\mathbb C[t]`,'Functions on the target affine line.'),b('S',r`\mathbb C[z]`,'Functions on the source affine line.'),b(r`\varphi`,r`(p(t)\mapsto p(z^2))`,'A homomorphism from the target ring to the source ring.'),b('f',r`\operatorname{Spec}(S)\longrightarrow\operatorname{Spec}(R)`,'The induced morphism of affine schemes.')],r`A prime ideal is sent to its inverse image. A closed point \((z-a)\) maps to \((t-a^2)\), and the generic point maps to the generic point.`,r`This recovers the familiar holomorphic map \(z\mapsto z^2\) on complex points. Functions pull back contravariantly; the scheme morphism also includes the map on local rings.`),
 scheme:model('An affine atlas over a finite field',[
  b('X',r`\mathbb P^1_{\mathbb F_2}`,'The projective line over the field with two elements.'),
  b('U',r`\operatorname{Spec}(\mathbb F_2[z])`,r`The chart with coordinate \(z\).`),
  b('V',r`\operatorname{Spec}(\mathbb F_2[w])`,r`The chart with coordinate \(w\).`)
 ],r`The two charts are identified on the standard opens where their coordinates are units. The overlap has ring \(\mathbb F_2[z,z^{-1}]\), with \(w=1/z\).`,r`Each point lies in one of the affine charts, so the glued locally ringed space satisfies the definition of a scheme.`),
 category:model('Objects and maps in abelian groups',[
  b(r`\mathcal C`,r`\text{a full subcategory of }\operatorname{Ab}`,r`The category with the three groups below as objects and all group homomorphisms between them.`),
  b('x',r`\mathbb Z`,'The additive group of integers.'),
  b('y',r`\mathbb Z/6\mathbb Z`,'The quotient group modulo six.'),
  b('z',r`\mathbb Z/2\mathbb Z`,'The quotient group modulo two.'),
  b(r`\psi`,r`(x\longrightarrow y)`,'Reduction modulo six.'),
  b(r`\phi`,r`(y\longrightarrow z)`,'Reduction of a residue class modulo two.')
 ],r`The second reduction is well defined on residue classes modulo \(6\) because \(2\) divides \(6\). The composite \(\phi\circ\psi\) is reduction modulo \(2\) directly.`,r`Group homomorphisms supply the arrows, ordinary composition supplies their composition, and each group has an identity homomorphism.`),
 ringPullback:model('Pairs of integers that agree modulo two',[
  b(r`\mathcal C`,r`\mathbf{CRing}`,'The category of commutative rings with unit.'),
  b('x,z',r`\mathbb Z,\mathbb Z`,'The two rings mapping to a common quotient.'),
  b('y',r`\mathbb F_2`,'The common target. Both maps are reduction modulo two.'),
  b(r`x\times_y z`,r`\{(m,n)\in\mathbb Z^2:m\equiv n\pmod{2}\}`,'The fibre product, with coordinatewise operations.')
 ],r`The coordinate projections give the maps \(p\) and \(q\). Reducing either coordinate gives the same result.`,r`Given two ring maps \(\alpha,\beta\) with equal reductions, the unique map to the fibre product sends \(w\) to \((\alpha(w),\beta(w))\).`),
 setLimits:model('Compatible choices and identified elements',[
  b('M_0',r`\{b\}`,'The set mapping into both other sets by inclusion.'),
  b('M_1',r`\{a,b\}`,'The first set receiving an inclusion.'),
  b('M_2',r`\{b,c\}`,'The second set receiving an inclusion.')
 ],r`In the limit, the choice \(m_0=b\) forces both \(m_1\) and \(m_2\) to be \(b\). The only compatible tuple is \((b,b,b)\).`,r`In the colimit, the two arrows identify the three copies of \(b\) in the disjoint union. The resulting set is \(\{a,b,c\}\), the pushout of the two inclusions.`),
 limits:model('Compatibility is an equalizer',[b('A',r`\prod_i\operatorname{Hol}(U_i)`,'Collections of local functions on a cover.'),b('B',r`\prod_{i,j}\operatorname{Hol}(U_i\cap U_j)`,'Functions on pairwise overlaps.'),b('f',r`(s_i)\mapsto(s_i|_{U_i\cap U_j})_{i,j}`,'One restriction map.'),b('g',r`(s_i)\mapsto(s_j|_{U_i\cap U_j})_{i,j}`,'The other restriction map.')],r`The equalizer consists of the families on which the two restriction maps agree. By holomorphic gluing it is precisely the space of global functions on the union.`,r`Limits encode compatibility conditions. Colimits encode identifications and passage to germs; they are different universal constructions.`),
 adjoint:model('A map described on either side',[b('f',r`(z\mapsto z^2)`,'A continuous map between complex lines.'),b(r`\mathcal F`,r`\mathcal O_Y^{\mathrm{an}}`,'A sheaf of sets or abelian groups on the target.'),b(r`\mathcal G`,r`\mathcal O_X^{\mathrm{an}}`,'A sheaf on the source.')],r`Giving a sheaf map \(f^{-1}\mathcal F\to\mathcal G\) is equivalent to giving \(\mathcal F\to f_*\mathcal G\). Pullback of functions is one such map.`,r`The adjunction explains the two interchangeable descriptions of the function map in a morphism of ringed spaces.`),
 idempotent:model('Separate two components',[b('R',r`\operatorname{Hol}(D_1\amalg D_2)`,'Functions on a disjoint union of two disks.'),b('e',r`(1,0)`,'An idempotent function, one on the first disk and zero on the second.')],r`A holomorphic function satisfying \(e^2=e\) takes only the values zero and one, so it is locally constant.`,r`An idempotent splits the ring as a product. On a spectrum this is exactly a decomposition into two open and closed pieces.`),
 finite:model('Finitely many equations and generators',[R,b('M',r`R^{\oplus n}`,'A finitely generated and finitely presented module.'),b('S',r`\mathbb C[z,w]/(w^2-z)`,'A finitely presented algebra over the complex numbers.')],r`The module has finitely many coordinate sections. The algebra describes a plane curve with a finite list of coordinates and relations.`,r`Finiteness hypotheses make local algebra manageable. A finite type algebra and a finitely generated module are different notions; the source states which is intended.`),
 abelian:model('Kernels are spaces of solutions',[b(r`\mathcal A`,r`\operatorname{Vect}_{\mathbb C}`,'An abelian category.'),b('M',r`\operatorname{Hol}(U)`,'Holomorphic functions on a nonempty connected open set, viewed as a complex vector space.'),b('f',r`D:h\mapsto h'-h`,'A complex-linear differential operator.')],r`The equation \(D(h)=0\) is \(h'=h\). Since \((e^{-z}h)'=0\), every solution on a domain is \(h=ce^z\) for a constant \(c\in\mathbb C\).`,r`The kernel is the vector space of homogeneous solutions. The cokernel \(\operatorname{Hol}(U)/D(\operatorname{Hol}(U))\) measures the obstruction to solving an inhomogeneous equation \(D(h)=g\). This is a model in complex vector spaces; differentiation is not linear over arbitrary holomorphic functions.`)
};
models.noetherian=model('Algebraic closed sets cannot keep shrinking',[A,b('Z',r`V(p(z))`,'A finite closed set when the polynomial is nonzero.')],r`Every proper closed set in this spectrum is finite. A descending chain of closed sets therefore stabilizes after it first becomes proper.`,r`This is the Noetherian condition on a topological space. The usual topology on a complex disk has shrinking closed disks and does not satisfy it.`);
models.constructible=model('Finite combinations of vanishing conditions',[A,b('E',r`D(z)\cap V(z-1)`,'The closed point at one, expressed using an open and a closed condition.')],r`On this algebraic line the nonempty open sets are complements of finite sets of closed points. They are quasi-compact, including as subsets of other opens.`,r`Constructible sets are finite Boolean combinations of these conditions. Here they are finite sets of closed points or their complements. The generic singleton is not constructible; a small analytic disk is not a Zariski open.`);
models.nakayama=model('A fibre can test a finite module',[b('R',r`\mathbb C\{t\}`,'A local ring of holomorphic germs.'),b(r`\mathfrak m`,r`(t)`,'Its maximal ideal.'),b('M',r`R^{\oplus n}`,'A finitely generated module of vector-valued germs.')],r`Choose a square matrix of holomorphic germs whose value at the origin is invertible. Its determinant is a unit germ, so the matrix is invertible over the local ring.`,r`Nakayama generalizes the principle that generators of the fibre lift to generators of a finite module over a local ring. Finiteness and the maximal-ideal condition are essential.`);
models.connected=model('Components let functions vary independently',[b('X',r`\mathbb C\setminus\mathbb R`,'The plane with the real axis removed.'),b('x',r`i`,'A point in the upper half-plane.'),b('Z',r`\{z:\operatorname{Im}(z)>0\}`,'The connected component containing this point.')],r`The upper and lower half-planes are disjoint connected open subsets, and together they cover the space.`,r`A locally constant function is constant on each component, while its values on the two components may differ. This gives a familiar setting for the distinction between local and global data.`);
models.natural=model('Restriction is a functor',[b(r`\mathcal A`,r`\operatorname{Opens}(\mathbb C)^{\mathrm{op}}`,'Open sets, with arrows directed toward restriction.'),b(r`\mathcal B`,r`\operatorname{Vect}_{\mathbb C}`,'Complex vector spaces and linear maps.'),b('F',r`(U\mapsto\operatorname{Hol}(U))`,'The functor of holomorphic functions.'),b('t',r`(h\mapsto2h)`,'A natural transformation from this functor to itself.')],r`Multiplication by two commutes with restriction on every inclusion of opens. That commuting square is the naturality condition.`,r`The formal rules for functors and their transformations express compatibility of local function operations. This model explains the language; it does not specialize every possible category or transformation in the section.`);
models.twoFibre=model('Keep an identification, rather than demand equality',[b(r`\mathcal A`,r`\mathcal L`,'The groupoid of one-dimensional complex vector spaces and their isomorphisms.'),b(r`\mathcal B`,r`\mathcal L`,'A second copy of the same groupoid.')],r`Take both functors to be the identity on the groupoid of complex lines. An object of their 2-fibre product is a pair of complex lines together with a specified isomorphism between them. The chosen isomorphism is part of the data.`,r`This resembles identifying bundle fibres on overlaps: one supplies an isomorphism instead of insisting that two independently described fibres are literally equal. The source develops the general categorical construction.`);
models.over=model('A category of functions lying over open sets',[b(r`\mathcal C`,r`\operatorname{Opens}(\mathbb C)`,'Open subsets, ordered by inclusion.'),b(r`\mathcal A`,r`\{(U,h):h\in\operatorname{Hol}(U)\}`,'Objects are a domain and a holomorphic function on it.'),b('p',r`((U,h)\mapsto U)`,'The functor that forgets the function and remembers the domain.')],r`There is an arrow from one such object to another when their domains are included and the smaller-domain function is the restriction of the larger-domain function.`,r`The category lies over the category of opens. This keeps track of both local data and where that data lives; later formal constructions organize maps that respect this projection.`);
models.presheaf=model('Domains, functions, and a differential operator',[X,U,
 b(r`\mathcal F`,r`(V\mapsto\operatorname{Hol}(V))`,'The rule assigning a set of holomorphic functions to every open set, together with restriction maps.'),
 b(r`\mathcal F(U)`,r`\operatorname{Hol}(U)`,'The set of all holomorphic functions on this open set.',r`An element \(h\in\mathcal F(U)\) is a holomorphic map \(h:U\to\mathbb C\). A section is one such function on all of \(U\).`),
 b(r`\rho^U_V`,r`(h\mapsto h|_V)`,'Restrict a function to a smaller open set.'),
 b(r`\mathcal G`,r`\mathcal F`,'The same presheaf, as the target of the morphism.'),
 b(r`\varphi`,r`D=\frac{d}{dz}-1`,'A differential operator defining a morphism of presheaves of sets.',r`For each open \(U\), the map is \(\varphi_U(h)=h'-h\).`)
],r`Restriction preserves a holomorphic function and its derivative: \(D(h)|_V=D(h|_V)\). This is exactly the commuting square in the definition of a morphism. The identity and composition rules for restrictions are the ordinary rules for restricting functions.`,r`The operator acts consistently on every open set. Later its kernel will be the presheaf of solutions: \((\ker D)(U)=\{h\in\operatorname{Hol}(U):h'-h=0\}\). On a domain these are \(ce^z\); on disconnected opens the constant may differ on each connected component.`,r`The first item in the definition supplies the function spaces and restrictions; the second allows an operation that commutes with those restrictions.`);
models.abelianMorphism={...models.presheaf,title:'Differential operators respect addition',check:r`The operator is complex-linear: \(D(ah+bk)=aD(h)+bD(k)\) for constants \(a,b\in\mathbb C\), and it commutes with restriction. It therefore gives a morphism of abelian presheaves.`,result:r`The kernel over \(U\) is the additive group of solutions of \(h'-h=0\). On a domain it is the one-dimensional complex vector space \(\mathbb C e^z\). The operator is not a ring homomorphism or a morphism of modules over holomorphic functions: \(D(ah)=a'h+aD(h)\) when \(a\) varies holomorphically.`,note:r`Here the same holomorphic function spaces carry their pointwise addition, rather than only their underlying sets.`};
models.abelianMorphism.bindings=models.presheaf.bindings.map(binding=>{
 if(binding.symbol===r`\mathcal F`)return {...binding,kind:'Holomorphic functions with pointwise addition, an abelian presheaf.'};
 if(binding.symbol===r`\mathcal F(U)`)return {...binding,kind:'Holomorphic functions, forming an abelian group and a complex vector space.'};
 if(binding.symbol===r`\varphi`)return {...binding,kind:'A complex-linear differential operator, hence a morphism of abelian presheaves.'};
 return binding;
});
models.solutionSheaf=model('The kernel is a sheaf of solutions',[X,U,
 b(r`\mathcal O_X`,r`\underline{\mathbb C}`,'The sheaf of locally constant complex-valued functions, used as scalars.'),
 b(r`\mathcal F`,r`\mathcal O_{\mathbb C}^{\mathrm{an}}`,'Holomorphic functions, as a module over locally constant complex scalars.'),
 b(r`\mathcal G`,r`\mathcal F`,'The same sheaf, as the target.'),
 b(r`\varphi`,r`D:h\mapsto h'-h`,'A differential operator linear over these locally constant scalars.'),
 b(r`\operatorname{Ker}(\varphi)(U)`,r`\{h\in\operatorname{Hol}(U):h'-h=0\}`,'The solution space on this open set.')
],r`Restriction takes a solution to a solution. Compatible local solutions glue to a holomorphic function, and its differential equation holds locally, hence everywhere. Thus the kernel really is a sheaf.`,r`On a domain the solutions are \(ce^z\); for an arbitrary open set they are \(h(z)=c(z)e^z\) with \(c\) locally constant. At a point the kernel consists of solution germs.`,r`For this module example the source ring sheaf is explicitly \(\underline{\mathbb C}\). The operator is not linear over the sheaf of holomorphic functions, since \(D(ah)=a'h+aD(h)\).`);
models.kernel=model('A kernel represents homogeneous solutions',[
 b(r`\mathcal A`,r`\operatorname{Vect}_{\mathbb C}`,'The category of complex vector spaces.'),
 b('x',r`\operatorname{Hol}(U)`,'Holomorphic functions on a domain.'),b('y',r`\operatorname{Hol}(U)`,'The target space.'),
 b('f',r`D:h\mapsto h'-h`,'A complex-linear differential operator.'),
 b('z',r`\ker D=\mathbb C e^z`,'The space of solutions of the homogeneous equation.'),
 b('i',r`(\ker D\hookrightarrow\operatorname{Hol}(U))`,'Include a solution as a holomorphic function.')
],r`The composite \(D\circ i\) is zero. Any complex-linear map into \(\operatorname{Hol}(U)\) annihilated by \(D\) has its image in the solution space, so it factors uniquely through this inclusion.`,r`This is the universal property of the kernel, expressed in familiar differential-equation language. The cokernel is \(\operatorname{Hol}(U)/D(\operatorname{Hol}(U))\): it records inhomogeneous right-hand sides modulo those for which a global solution exists.`,r`For the kernel part of this definition, \(U\) is any nonempty connected open subset of \(\mathbb C\), called a domain; it need not be a disk.`);
const groups={
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
const additionalExamples={
 'sheaves-presheaves':[model('Functions on a discrete two-point space',[
  twoPoints,b('U',r`\{a\}`,'One open subset. Every subset of this space is open.'),
  b(r`\mathcal F(U)`,r`\operatorname{Map}(U,\mathbb F_2)\cong\mathbb F_2`,'A function on this singleton is specified by one value.'),
  b(r`\mathcal F(X)`,r`\mathbb F_2\times\mathbb F_2`,'A function on the whole space is specified by two values.')
 ],r`Restriction to \(\{a\}\) is the projection \((u,v)\mapsto u\). Restricting further to the empty open gives the unique empty function, whether we start on \(X\) or on \(\{a\}\).`,r`These assignments define a presheaf of sets. The pointwise ring operations also make it a presheaf of rings.`)],
 'sheaves-stalks':[model('A germ on a discrete space is a value',[
  twoPoints,b('x',r`a`,'The point at which we take the stalk.'),
  b(r`\mathcal F(U)`,r`\operatorname{Map}(U,\mathbb F_2)`,'Functions on each open subset, with ordinary restriction.'),
  b(r`\mathcal F_x`,r`\mathbb F_2`,'The possible values at the chosen point.')
 ],r`Every neighbourhood of \(a\) contains the open singleton \(\{a\}\). Two sections represent the same germ at \(a\) exactly when their restrictions to this singleton agree.`,r`The germ represented by \(h\) is determined by \(h(a)\). On this space the stalk computation reduces to restricting once to the smallest neighbourhood.`)],
 'schemes-schemes':[model('An affine scheme supported at one point',[
  b('R',r`\mathbb F_2[\epsilon]/(\epsilon^2)`,'The ring of dual numbers over the field of two elements.'),
  b('X',r`\operatorname{Spec}(R)`,'The spectrum with its structure sheaf.'),
  b('x',r`(\epsilon)`,'The unique prime ideal. Every prime contains the nilpotent element.'),
  b('U',r`X`,'An affine open neighbourhood of the only point.')
 ],r`The ring \(R\) is local with maximal ideal \((\epsilon)\). The stalk at the only point is \(R\), and the whole space is an affine neighbourhood of that point.`,r`This satisfies the definition with a single chart. The nonzero nilpotent \(\epsilon\) remains visible in the structure sheaf even though the underlying space has just one point.`)]
};
export function extraExamples(section){
 return additionalExamples[section.slug]||[];
}
const bySection=Object.fromEntries(Object.entries(groups).flatMap(([name,slugs])=>slugs.map(slug=>[slug,name])));
export function sectionNote(section){
 const name=bySection[section.slug];if(!name)throw Error('Missing example commentary: '+section.slug);
 const item=models[name];return {...item,note:generic+' '+item.note};
}
export function passageNote(section,block){
 const base=sectionNote(section);
 if(section.slug==='sheaves-presheaves'&&block.label==='definition-presheaf')return {...models.presheaf,scope:'statement'};
 if(section.slug==='sheaves-abelian-presheaves'&&block.label==='definition-abelian-presheaves')return {...models.abelianMorphism,scope:'statement'};
 if(section.chapter==='homology'&&block.label==='definition-kernel')return {...models.kernel,scope:'statement'};
 if(block.label==='definition-local-ring')return {...models.local,scope:'statement'};
 if(block.label==='definition-scheme')return {...models.scheme,scope:'statement',note:r`The two affine charts exhibit the condition in the definition.`,bindings:[...models.scheme.bindings,b(r`\Sch`,r`\text{the category of schemes}`,'Its objects are schemes; its arrows are local morphisms of locally ringed spaces.') ]};
 if(block.label==='example-not-affine')return {...model('The punctured affine plane over a finite field',[
  b('k',r`\mathbb F_2`,'The base field.'),
  b('X',r`\operatorname{Spec}(k[x,y])`,'The affine plane.'),
  b('U',r`X\setminus\{(x,y)\}`,'The open complement of the origin.')
 ],r`The opens \(D(x)\) and \(D(y)\) cover \(U\). Their coordinate rings intersect in \(k[x,y]\) inside \(k(x,y)\), since the denominators are powers of relatively prime polynomials.`,r`The restriction map on global functions is an isomorphism. If \(U\) were affine, the inclusion \(U\hookrightarrow X\) would therefore be an isomorphism of affine schemes. The missing origin rules this out.`),scope:'statement'};
 return base;
}
