const m = String.raw;
export const introduction = [
  {
    id: 'plan-1', label: 'Plan · paragraph 1',
    text: `It is known that geometry assumes, as things given, both the notion of space and the first principles of constructions in space. She gives definitions of them which are merely nominal, while the true determinations appear in the form of axioms. The relation of these assumptions remains consequently in darkness; we neither perceive whether and how far their connection is necessary, nor a priori, whether it is possible.`,
    type: 'Context', title: 'What must geometry assume?',
    note: `Riemann begins one level before theorems: what have we already assumed when we speak of a space? An axiom can specify a mathematical structure without establishing that physical space has that structure. His question concerns both the logical possibilities and their physical interpretation.`
  },
  {
    id: 'plan-2', label: 'Plan · paragraph 2',
    text: `From Euclid to Legendre (to name the most famous of modern reforming geometers) this darkness was cleared up neither by mathematicians nor by such philosophers as concerned themselves with it. The reason of this is doubtless that the general notion of multiply extended magnitudes (in which space-magnitudes are included) remained entirely unworked. I have in the first place, therefore, set myself the task of constructing the notion of a multiply extended magnitude out of general notions of magnitude.`,
    type: 'Vocabulary', title: 'Before “manifold” became a definition',
    note: m`A “multiply extended magnitude” anticipates what we now call a manifold: a space described locally by several independent coordinates. The modern definition adds precise topological and compatibility conditions; those should not be silently read into every historical use. Coordinates name points. They do not yet tell us distances.`,
    figure: 'chart'
  },
  {
    id: 'plan-3', label: 'Plan · paragraph 3',
    text: `It will follow from this that a multiply extended magnitude is capable of different measure-relations, and consequently that space is only a particular case of a triply extended magnitude. But hence flows as a necessary consequence that the propositions of geometry cannot be derived from general notions of magnitude, but that the properties which distinguish space from other conceivable triply extended magnitudes are only to be deduced from experience.`,
    type: 'Modern viewpoint', title: 'A space, then a way to measure',
    note: m`We distinguish a smooth manifold \(M\) from a metric \(g\) placed on it. The same manifold can carry many metrics. Riemann’s “space” here is physical space: experience must inform which mathematical model describes it. This is not a claim that mathematical theorems themselves need experimental proof.`
  },
  {
    id: 'plan-4', label: 'Plan · paragraph 4',
    text: `Thus arises the problem, to discover the simplest matters of fact from which the measure-relations of space may be determined; a problem which from the nature of the case is not completely determinate, since there may be several systems of matters of fact which suffice to determine the measure-relations of space—the most important system for our present purpose being that which Euclid has laid down as a foundation.`,
    type: 'Geometric picture', title: 'Geometry can be measured from within',
    note: m`On a sphere, three great-circle arcs can form a triangle with three right angles. On a Euclidean plane a triangle’s angles sum to \(\pi\). The drawing illustrates different intrinsic geometries; it does not suggest that a sphere and a plane have the same global topology.`,
    figure: 'triangles'
  },
  {
    id: 'plan-5', label: 'Plan · paragraph 5',
    text: `These matters of fact are—like all matters of fact—not necessary, but only of empirical certainty; they are hypotheses. We may therefore investigate their probability, which within the limits of observation is of course very great, and inquire about the justice of their extension beyond the limits of observation, on the side both of the infinitely great and of the infinitely small.`,
    type: 'Reading the title', title: '“Hypotheses” about physical space',
    note: `The lecture separates what is logically possible from what is physically observed. It does not yet supply a theory of gravity or spacetime. Its immediate task is to make room for geometries whose measurements differ from Euclid’s.`
  }
];

export const lineElement = [
  {
    id: 'line-1', label: 'II, §1 · paragraph 1',
    text: `Measure-determinations require that quantity should be independent of position, which may happen in various ways. The hypothesis which first presents itself, and which I shall here develop, is that according to which the length of lines is independent of their position, and consequently every line is measurable by means of every other.`,
    type: 'Interpretation', title: 'A transferable standard of length',
    note: m`Read this with the later allowance that coefficients vary from point to point. Riemann needs a common standard for comparing lengths, not constant metric coefficients everywhere. Modern Riemannian metrics can vary with position.`
  },
  {
    id: 'line-2', label: 'II, §1 · paragraph 2',
    text: m`Position-fixing being reduced to quantity-fixings, and the position of a point in the \(n\)-dimensioned manifoldness being consequently expressed by means of \(n\) variables \(x_1,x_2,x_3,\ldots,x_n\), the determination of a line comes to the giving of these quantities as functions of one variable. The problem consists then in establishing a mathematical expression for the length of a line, and to this end we must consider the quantities \(x\) as expressible in terms of certain units.`,
    type: 'Modern notation', title: 'A curve is a moving point',
    note: m`Write a curve as \(\gamma(t)=(x_1(t),\ldots,x_n(t))\). Its velocity lives in the tangent space at its current point. A local rule assigns a length to that velocity; integrating along the curve gives its total length.`
  },
  {
    id: 'line-3', label: 'II, §1 · paragraphs 3–4',
    text: m`I shall treat this problem only under certain restrictions, and I shall confine myself in the first place to lines in which the ratios of the increments \(dx\) of the respective variables vary continuously.</p><p>We may then conceive these lines broken up into elements, within which the ratios of the quantities \(dx\) may be regarded as constant; and the problem is then reduced to establishing for each point a general expression for the linear element \(ds\) starting from that point, an expression which will thus contain the quantities \(x\) and the quantities \(dx\).`,
    type: 'Reconstruction', title: 'From a small step to a length',
    note: m`Replace informal infinitesimal steps by tangent vectors. A length rule \(F(x,v)\) gives the curve length
    \[L(\gamma)=\int_a^b F\bigl(\gamma(t),\dot\gamma(t)\bigr)\,dt.\]
    For a Riemannian metric, \(F(x,v)=\sqrt{g_x(v,v)}\). Piecewise smooth curves suffice for the usual length construction.`,
    figure: 'tangent'
  },
  {
    id: 'line-4', label: 'II, §1 · paragraphs 5–6',
    text: m`I shall suppose, secondly, that the length of the linear element, to the first order, is unaltered when all the points of this element undergo the same infinitesimal displacement, which implies at the same time that if all the quantities \(dx\) are increased in the same ratio, the linear element will vary also in the same ratio.</p><p>On these suppositions, the linear element may be any homogeneous function of the first degree of the quantities \(dx\), which is unchanged when we change the signs of all the \(dx\), and in which the arbitrary constants are continuous functions of the quantities \(x\).`,
    type: 'Assumptions', title: 'Scaling does not force a quadratic form',
    note: m`At a fixed point, the proposed rule is positively homogeneous and reversible:
    \[F(x,\lambda v)=|\lambda|F(x,v).\]
    This condition alone does not force an inner product. Positivity and suitable convexity are additional conditions for a norm-like length rule. General Finsler geometry allows nonquadratic rules; it can also drop reversibility.`
  },
  {
    id: 'line-5', label: 'II, §1 · paragraphs 7–8',
    text: m`To find the simplest cases, I shall seek first an expression for manifoldnesses of \(n-1\) dimensions which are everywhere equidistant from the origin of the linear element; that is, I shall seek a continuous function of position whose values distinguish them from one another. In going outwards from the origin, this must either increase in all directions or decrease in all directions; I assume that it increases in all directions, and therefore has a minimum at that point.</p><p>If, then, the first and second differential coefficients of this function are finite, its first differential must vanish, and the second differential cannot become negative; I assume that it is always positive.`,
    type: 'A hypothesis to notice', title: 'Positive, not merely nonnegative',
    note: m`A smooth function at a minimum has a nonnegative Hessian. It need not have a positive definite one. Riemann explicitly adds this stronger assumption. For instance, \(f(v)=\sum_i v_i^4\) has a strict minimum at the origin but zero Hessian there.`
  },
  {
    id: 'line-6', label: 'II, §1 · paragraph 9',
    text: m`This differential expression, of the second order remains constant when \(ds\) remains constant, and increases in the duplicate ratio when the \(dx\), and therefore also \(ds\), increase in the same ratio; it must therefore be \(ds^2\) multiplied by a constant, and consequently \(ds\) is the square root of an always positive integral homogeneous function of the second order of the quantities \(dx\), in which the coefficients are continuous functions of the quantities \(x\).`,
    type: 'Modern reconstruction', title: 'An inner product at each point',
    note: m`“Duplicate ratio” means the square of the scale factor; “integral homogeneous” here means a homogeneous polynomial, not an integral. In modern notation:
    \[ds^2=\sum_{i,j=1}^{n}g_{ij}(x)\,dx_i\,dx_j.\]
    The matrix \(G(x)=(g_{ij}(x))\) is symmetric and positive definite. Modern smooth Riemannian geometry assumes smooth coefficients, more than the continuity mentioned here.`,
    detail: m`<h4>A precise sufficient condition</h4><p>At a fixed point, suppose \(Q(v)=F(v)^2\) is twice continuously differentiable at the zero vector and homogeneous of degree two. Taylor’s formula and homogeneity give</p>\[t^2Q(v)=Q(tv)=\frac{t^2}{2}D^2Q(0)[v,v]+o(t^2).\]<p>Divide by \(t^2\) and let \(t\to0\). Then \(Q(v)=\tfrac12D^2Q(0)[v,v]\), a quadratic form. Requiring the Hessian to be positive definite gives an inner product. This is a modern sufficient-condition argument, not a verbatim expansion of Riemann’s reasoning. A general Finsler squared norm need not be twice differentiable at zero.</p>`,
    figure: 'indicatrix'
  },
  {
    id: 'line-7', label: 'II, §1 · paragraphs 10–11',
    text: m`For Space, when the position of points is expressed by rectilinear co-ordinates, \(ds=\sqrt{\sum(dx)^2}\); Space is therefore included in this simplest case. The next case in simplicity includes those manifoldnesses in which the line-element may be expressed as the fourth root of a quartic differential expression.</p><p>The investigation of this more general kind would require no really different principles, but would take considerable time and throw little new light on the theory of space, especially as the results cannot be geometrically expressed; I restrict myself, therefore, to those manifoldnesses in which the line element is expressed as the square root of a quadric differential expression.`,
    type: 'Scope, not correction', title: 'Riemann sees the alternative',
    note: m`He chooses the quadratic case rather than claiming that it is the only possible one. For example,
    \[F(v)=\bigl(v_1^4+v_2^4\bigr)^{1/4}\]
    is a reversible norm with a nonelliptical unit curve. This example illustrates the broader idea; it fails the strong convexity required of a modern smooth Finsler metric at some nonzero vectors.`,
    figure: 'quartic'
  },
  {
    id: 'line-8', label: 'II, §1 · paragraphs 12–14',
    text: m`Such an expression we can transform into another similar one if we substitute for the \(n\) independent variables functions of \(n\) new independent variables. In this way, however, we cannot transform any expression into any other; since the expression contains \(\tfrac12 n(n+1)\) coefficients which are arbitrary functions of the independent variables; now by the introduction of new variables we can only satisfy \(n\) conditions, and therefore make no more than \(n\) of the coefficients equal to given quantities.</p><p>The remaining \(\tfrac12 n(n-1)\) are then entirely determined by the nature of the continuum to be represented, and consequently \(\tfrac12 n(n-1)\) functions of positions are required for the determination of its measure-relations.</p><p>Manifoldnesses in which, as in the Plane and in Space, the line-element may be reduced to the form \(\sqrt{\sum dx^2}\), are therefore only a particular case of the manifoldnesses to be here investigated; they require a special name, and therefore these manifoldnesses in which the square of the line-element may be expressed as the sum of the squares of complete differentials I will call flat.`,
    type: 'Qualification', title: 'At a point is not throughout a region',
    note: m`The counting is a heuristic about functional freedom, not a proof of a coordinate normal form. At one point we can always arrange \(G=I\); normal coordinates also remove first derivatives there. Flattening a whole neighbourhood is stronger: for a smooth Riemannian metric it is possible exactly when the Riemann curvature vanishes throughout that neighbourhood, after restricting to a sufficiently small coordinate patch.`,
    detail: m`<h4>Curved coordinates need not mean curved geometry</h4><p>The Euclidean plane in polar coordinates has</p>\[ds^2=dr^2+r^2\,d\theta^2.\]<p>The coefficients vary, but setting \(x=r\cos\theta\), \(y=r\sin\theta\) gives \(ds^2=dx^2+dy^2\) on a suitable patch away from the origin. A sphere cannot be flattened this way, even locally on an open patch, because its intrinsic curvature is nonzero.</p>`
  }
];
