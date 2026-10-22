// Chapter sketches. All mathematics uses LaTeX delimiters and is rendered by KaTeX.
window.COURSE = {
  "parts": [
    {
      "id": "I",
      "title": "Euclidean geometry"
    },
    {
      "id": "II",
      "title": "The geometry of functions"
    }
  ],
  "chapters": [
    {
      "id": "geometry",
      "part": "I",
      "number": "01",
      "short": "From Platonic solids to four dimensions",
      "title": "Five solids.<br>A fourth dimension.",
      "subtitle": "Begin where Euclid ends: with regular solids. Ask what survives, and what surprises us, when space has another independent direction.",
      "concepts": [
        "Regular polytopes",
        "Symmetry and dimension",
        "Vectors and measurement"
      ],
      "intro": "The final book of Euclid’s Elements constructs and compares the five regular solids. What happens if we ask the same question in four dimensions? There are six answers there, but only three families in every higher dimension. This is our opening puzzle: how can we reason about shapes that we cannot see whole?",
      "sections": [
        {
          "title": "The classification is a starting map.",
          "body": "<p>The tetrahedron, cube, octahedron, dodecahedron, and icosahedron are the five <em>convex regular polyhedra</em>. Their higher-dimensional relatives are called regular polytopes. The classification has an unexpected shape:</p>\n<div class=\"classification-table\"><table><caption>Convex regular polytopes, up to similarity</caption><thead><tr><th>Dimension</th><th>How many?</th><th>Which ones?</th></tr></thead><tbody><tr><td>\\(3\\)</td><td>\\(5\\)</td><td>The five Platonic solids</td></tr><tr><td>\\(4\\)</td><td>\\(6\\)</td><td>The simplex, tesseract, and \\(16\\)-cell; also the \\(24\\)-cell, \\(120\\)-cell, and \\(600\\)-cell</td></tr><tr><td>\\(n\\geq5\\)</td><td>\\(3\\)</td><td>The \\(n\\)-simplex, \\(n\\)-cube, and \\(n\\)-dimensional cross-polytope</td></tr></tbody></table></div>\n<p>In four dimensions the bounding solids are three-dimensional <em>cells</em>: the tesseract has eight cubical cells, while the \\(24\\)-cell has twenty-four octahedral cells. More dimensions do not simply mean more regular shapes.</p>\n<div class=\"definition\"><span class=\"definition-label\">WHAT REGULAR MEANS</span><p>A convex polytope is the convex hull of finitely many points. A <em>flag</em> is a nested choice of one face of each dimension: a vertex inside an edge inside a two-dimensional face, and so on. A polytope is regular if its Euclidean symmetries can carry any flag to any other.</p></div>\n<p>Equal edge lengths alone do not guarantee regularity. We need to understand the whole pattern of faces and symmetries. We will take the classification as a guide while learning the tools that make such questions precise.</p>\n<p class=\"reading-source\">Starting points: <a href=\"https://mathcs.clarku.edu/~djoyce/elements/bookXIII/bookXIII.html\" target=\"_blank\" rel=\"noopener\">Euclid, Book XIII</a>; <a href=\"https://math.ucr.edu/home/baez/platonic_lowtech.html\" target=\"_blank\" rel=\"noopener\">John Baez’s dimensional tour</a>. Coxeter describes <em>Regular Polytopes</em> as a sequel to Euclid in <a href=\"https://mathshistory.st-andrews.ac.uk/Extras/Coxeter_prefaces/\" target=\"_blank\" rel=\"noopener\">his preface</a>.</p>",
          "demo": "polytopes"
        },
        {
          "title": "A picture suggests. Coordinates let us check.",
          "body": "<p>The side example shows shadows of three regular four-dimensional polytopes. In the original space each has equal-length edges. Their images can have different lengths, overlap, or cross. A drawing does not preserve every geometric fact.</p><p>For the tesseract, a complete vertex list fits into one rule:</p>\\[\\{(\\varepsilon_1,\\varepsilon_2,\\varepsilon_3,\\varepsilon_4):\\varepsilon_i\\in\\{-1,1\\}\\}.\\]\n<p>There are \\(2^4=16\\) vertices. Two are joined by an edge exactly when one coordinate changes sign, so every edge has length \\(2\\). Each vertex meets four edges, giving \\(16\\cdot4/2=32\\) edges altogether.</p>\n<p>We have established facts in four dimensions without relying on a four-dimensional picture. Vectors will describe displacements and measure distances. Matrices will describe symmetries and projections. We begin by recovering those tools in familiar Euclidean space, then use them where spatial intuition is incomplete.</p>\n<p class=\"question\">When a rotation makes two projected vertices coincide, have the original vertices collided?</p>"
        },
        {
          "title": "A point is a place. A vector is a displacement.",
          "body": "\n            <p>Two points determine a displacement. The same displacement can start at many different points. This distinction lets us separate a direction from the location of a line or plane.</p>\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · LINE AND AFFINE PLANE</span><p>A line through a point \\(p\\), in a nonzero direction \\(u\\), is</p>\\[\\{p+tu:t\\in\\mathbb R\\}.\\]<p>An affine plane through \\(p\\), with independent directions \\(u,v\\), is</p>\\[\\{p+su+tv:s,t\\in\\mathbb R\\}.\\]</div>\n            <p>A plane through the origin is also a linear subspace. Moving the plane changes its location while preserving its directions.</p>\n            <div class=\"observation\"><span class=\"observation-label\">A PICTURE CAN HIDE AN INTERSECTION</span><p>Two lines in space can be neither parallel nor intersecting. Such lines are <em>skew</em>. Their shadows may cross even though the original lines never meet.</p></div>\n            <p class=\"question\">When two lines cross on the screen, what additional information would convince you that they meet in space?</p>",
          "demo": "space"
        },
        {
          "title": "Coordinates make geometry calculable.",
          "body": "\n            <p>An orthonormal coordinate frame records perpendicular directions of unit length. In these coordinates, familiar measurements have compact formulas.</p>\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · EUCLIDEAN DOT PRODUCT</span><p>For \\(u=(u_1,u_2,u_3)\\) and \\(v=(v_1,v_2,v_3)\\),</p>\\[u\\cdot v=u_1v_1+u_2v_2+u_3v_3.\\]<p>The length is \\(\\|v\\|=\\sqrt{v\\cdot v}\\). For nonzero vectors, their angle satisfies</p>\\[\\cos\\theta=\\frac{u\\cdot v}{\\|u\\|\\,\\|v\\|}.\\]</div>\n            <p>Perpendicular vectors have zero dot product. We will use that fact to find nearest points, split displacements into components, and construct reflections.</p>\n            <p>These coordinate formulas assume an orthonormal frame. With a different basis, the <a href=\"#coordinates\">Gram matrix</a> will record how to recover lengths and angles.</p>",
          "note": "The chapter develops two complementary habits: inspect a picture, then identify the geometric claim that the algebra must verify."
        }
      ]
    },
    {
      "id": "projections",
      "part": "I",
      "number": "02",
      "short": "Projections",
      "title": "Keep one component.<br>Lose another.",
      "subtitle": "Orthogonal projection turns perpendicular decomposition into a map—and a nearest-point problem into an algebraic formula.",
      "concepts": [
        "Orthogonal decomposition",
        "Nearest points",
        "Compositions"
      ],
      "intro": "A shadow retains some information and discards the rest. An orthogonal projection does this in a particularly useful way: the discarded displacement is perpendicular to the space we keep.",
      "sections": [
        {
          "title": "The nearest point has a perpendicular residual.",
          "body": "\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · ORTHOGONAL PROJECTION</span><p>For a linear subspace \\(W\\subseteq\\mathbb R^n\\), the orthogonal projection of \\(v\\) onto \\(W\\) is the unique vector \\(Pv\\in W\\) for which</p>\\[v-Pv\\perp W.\\]<p>Thus \\(v=Pv+(v-Pv)\\) is a decomposition into perpendicular components.</p></div>\n            <div data-demo=\"projection\" class=\"inline-animation\"></div><p>If \\(w\\in W\\), the Pythagorean theorem gives</p>\\[\\|v-w\\|^2=\\|v-Pv\\|^2+\\|Pv-w\\|^2.\\]\n            <p>The nearest point is therefore \\(Pv\\). For a line spanned by a nonzero vector \\(u\\),</p>\\[Pv=\\frac{v\\cdot u}{u\\cdot u}\\,u.\\]\n            <p>Projecting again changes nothing: \\(P^2=P\\). Every vector already in \\(W\\) is fixed; every vector in \\(W^\\perp\\) disappears.</p>",
          "note": "For the coordinate plane \\(z=0\\), projection and reflection have particularly simple matrices:\\[P=\\begin{pmatrix}1&0&0\\\\0&1&0\\\\0&0&0\\end{pmatrix},\\]\\[R=\\begin{pmatrix}1&0&0\\\\0&1&0\\\\0&0&-1\\end{pmatrix}.\\]"
        },
        {
          "title": "Two projections bring new surprises.",
          "body": "\n            <p>An oblique projection also keeps the target subspace fixed, but removes components along a different complementary subspace. Its image alone does not determine the map.</p>\n            <div class=\"observation\"><span class=\"observation-label\">COMPOSITION IS NOT INNOCENT</span><p>Two orthogonal projections need not commute, and their composition need not be a projection. The second projection can undo part of what the first one accomplished.</p></div>\n            <p>For orthogonal projections \\(P,Q\\), commutativity is exactly the condition that makes \\(PQ\\) the orthogonal projection onto the intersection of their images.</p>\n            <p>The side example compares successive projections onto two lines. Follow the intermediate point as well as the final one.</p>\n            <p class=\"question\">Why does projecting twice onto the same line differ from projecting successively onto two different lines?</p>",
          "demo": "projection-composition"
        }
      ]
    },
    {
      "id": "reflections",
      "part": "I",
      "number": "03",
      "short": "Reflections and rotations",
      "title": "Geometry through<br>its transformations.",
      "subtitle": "Reflect a vector by reversing its perpendicular component. Compose reflections to discover rotations and the importance of order.",
      "concepts": [
        "Fixed subspaces",
        "Reflections",
        "Order of composition"
      ],
      "intro": "Projection gives us a way to take a vector apart. Reflection puts the same components back together with one sign reversed.",
      "sections": [
        {
          "title": "A reflection is a signed decomposition.",
          "body": "\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · REFLECTION ACROSS A SUBSPACE</span><p>If \\(P\\) is orthogonal projection onto a linear subspace \\(W\\), reflection across \\(W\\) is</p>\\[Rv=Pv-(I-P)v=(2P-I)v.\\]</div>\n            <p>The map fixes \\(W\\) pointwise and reverses \\(W^\\perp\\). Reflecting twice gives \\(R^2=I\\), and reflection preserves lengths and angles.</p>\n            <p>For a plane through the origin with a unit normal \\(n\\), the formula becomes</p>\\[Rv=v-2(v\\cdot n)n.\\]\n            <div class=\"observation\"><span class=\"observation-label\">THE FIXED SET MATTERS</span><p>Reflection across a plane in three dimensions fixes an entire plane. The map \\(v\\mapsto-v\\) fixes only the origin. Both reverse some directions, but they are different geometric operations.</p></div>",
          "note": "For an affine plane, first translate it through the origin, apply the linear reflection, and translate back. A reflection across an affine plane need not be a linear map."
        },
        {
          "title": "Two reflections make a rotation.",
          "body": "\n            <p>In a plane, reflect first across a line at angle \\(\\alpha\\), then across a line at angle \\(\\beta\\), with both lines passing through the origin. The result is rotation by</p>\\[2(\\beta-\\alpha).\\]\n            <p>Reversing the order reverses the rotation. In three dimensions, reflecting across two intersecting planes produces a rotation about their intersection line.</p>\n            <p>Changing the angle between the reflecting lines changes the rotation continuously. Composition turns two simple operations into a family of new ones.</p>\n            <p class=\"question\">What happens when the two reflecting planes are parallel and distinct?</p>",
          "demo": "reflection"
        }
      ]
    },
    {
      "id": "higher-dimensions",
      "part": "I",
      "number": "04",
      "short": "Beyond three dimensions",
      "title": "When a picture<br>is no longer enough.",
      "subtitle": "Keep the algebraic tools. Reconsider the habits that depend on living in three dimensions.",
      "concepts": [
        "Dimension",
        "Sections and shadows",
        "Orthogonal complements"
      ],
      "intro": "The regular polytopes gave us a reason to enter four dimensions. We now ask what dimension counts, how a ball fits inside a cube, and why rotation can lose its familiar fixed axis. Coordinates let us separate these facts from their shadows.",
      "sections": [
        {
          "title": "Dimension counts independent directions.",
          "body": "\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · SPAN AND INDEPENDENCE</span><p>The span of \\(u_1,\\ldots,u_k\\) consists of all linear combinations</p>\\[c_1u_1+\\cdots+c_ku_k.\\]<p>The vectors are independent if</p>\\[\\sum_i c_i u_i=0\\quad\\Longrightarrow\\quad c_i=0\\text{ for every }i.\\]<p>A basis is an independent spanning family. Its size is the dimension.</p></div>\n            <p>In \\(\\mathbb R^4\\), the coordinate planes spanned by \\(e_1,e_2\\) and by \\(e_3,e_4\\) intersect only at the origin. Each is the other's orthogonal complement.</p>\n            <p>More generally, \\(\\dim W+\\dim W^\\perp=n\\) in \\(\\mathbb R^n\\). A plane in four dimensions has a plane of perpendicular directions.</p>"
        },
        {
          "title": "A ball can touch every facet and occupy almost none of the cube.",
          "body": "<p>Place the unit ball inside the cube of side length \\(2\\):</p>\\[B^n=\\{x\\in\\mathbb R^n:x_1^2+\\cdots+x_n^2\\leq1\\},\\qquad C^n=[-1,1]^n.\\]\n<p>Its boundary is the sphere \\(S^{n-1}\\). Thus the ball in \\(n\\)-dimensional space has an \\((n-1)\\)-dimensional boundary; this keeps the dimension in our notation unambiguous.</p>\n<p>The ball touches every facet of the cube at its center. A facet is a face of codimension one. Yet a corner is distance \\(\\sqrt n\\) from the origin, while every boundary point of the ball is distance \\(1\\). As dimension grows, the corners move farther away.</p>\n\\[\\frac{\\operatorname{vol}_n(B^n)}{\\operatorname{vol}_n(C^n)}=\\frac{\\pi^{n/2}}{2^n\\Gamma(n/2+1)}\\longrightarrow0.\\]\n<p>Here \\(\\Gamma\\) extends the factorial: \\(\\Gamma(k+1)=k!\\). The side calculation uses the equivalent recurrence \\(V_n=(2\\pi/n)V_{n-2}\\), with \\(V_0=1\\) and \\(V_1=2\\), so no special-function machinery is needed to explore the numbers.</p>\n<div class=\"observation\"><span class=\"observation-label\">THE SAME SLICE CAN HIDE A DIFFERENT VOLUME</span><p>Every central coordinate-plane slice is the same disk inside the same square. That unchanged picture does not show how the fraction of the total volume changes. A point chosen uniformly in the cube has probability equal to the displayed volume fraction of lying inside the ball.</p></div>\n<p class=\"question\">Is touching every facet a good guide to how much of a high-dimensional cube a ball fills?</p>",
          "demo": "ball-cube"
        },
        {
          "title": "Rotation no longer requires a fixed axis.",
          "body": "\n            <p>Rotate simultaneously in the two coordinate planes:</p>\\[R=\\begin{pmatrix}R_\\alpha&0\\\\0&R_\\beta\\end{pmatrix},\\qquad R_\\theta=\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{pmatrix}.\\]\n            <p>If neither angle is a multiple of \\(2\\pi\\), this transformation fixes no nonzero vector. The familiar fixed axis of a three-dimensional rotation is not a universal feature of rotation.</p>\n            <div class=\"observation\"><span class=\"observation-label\">SECTION AND PROJECTION ANSWER DIFFERENT QUESTIONS</span><p>A section asks which points lie in a chosen slice. A projection records the image of every point. Apparent crossings in a shadow do not establish intersections in the original space.</p></div><p>The tesseract lets us explore independent rotations while keeping the object separate from its displayed image.</p><p>A simple rotation has one angle zero and fixes the other coordinate plane pointwise. A double rotation with both angles nonzero modulo \\(2\\pi\\) fixes only the origin. When the two angles agree, this example is <em>isoclinic</em>: every nonzero vector makes the same angle with its image (taking the angle in \\([0,\\pi]\\)).</p><p>Try the presets: one rotating plane, two independent planes, and equal turns. The displayed wireframe is always a projection of the same tesseract.</p>",
          "note": "A three-dimensional or two-dimensional display can provide evidence about a four-dimensional object. Coordinate calculations establish which claims that evidence supports.",
          "demo": "four-d"
        }
      ]
    },
    {
      "id": "coordinates",
      "part": "I",
      "number": "05",
      "short": "Coordinates and the Gram matrix",
      "title": "Coordinates change.<br>Geometry remains.",
      "subtitle": "Separate a transformation from its matrix, and a vector from its coordinates. The Gram matrix carries measurement into an arbitrary basis.",
      "concepts": [
        "Matrices and bases",
        "Gram matrix",
        "Projection equations"
      ],
      "intro": "A basis is a language for describing vectors. A convenient language may use perpendicular unit directions, but we should also be able to work when the basis is tilted or unevenly scaled.",
      "sections": [
        {
          "title": "Read a transformation in the order it acts.",
          "body": "<p>This draft lets us try two matrix conventions. The toggle above follows you through the book; changing it rewrites the formulas while keeping every matrix’s physical entries in place.</p>\n<div class=\"definition\"><span class=\"definition-label\">THE ACTIVE CONVENTION</span><p><span data-reading-copy=\"Square brackets mark the experimental convention. Put the input column on the left and the transformation on the right. Multiply a column of the left factor by a row of the right factor.\" data-standard-copy=\"Parentheses mark the standard convention. Put the transformation on the left and the input column on the right. Multiply a row of the left factor by a column of the right factor.\"></span></p>\n\\[\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}ax+by\\\\cx+dy\\end{pmatrix}.\\]\n<p><span data-reading-copy=\"An entry is indexed across first, then down. Dimensions follow the same order: number of columns, then number of rows.\" data-standard-copy=\"An entry is indexed by row first, then column. Dimensions follow the same order: number of rows, then number of columns.\"></span></p>\n\\[(BA)_{m,n}=\\sum_k B_{m,k}A_{k,n}.\\]\n\\[A\\in\\mathbb R^{k\\times n},\\qquad B\\in\\mathbb R^{m\\times k}.\\]</div>\n<p><span data-reading-copy=\"The output of the first transformation feeds the second, so their factors appear in the order of action.\" data-standard-copy=\"The output of the first transformation feeds the second, so the rightmost transformation acts first.\"></span></p>\\[(BA)v=B(Av).\\]\n<p>These are two ways of writing the same maps. Ordinary juxtaposition denotes multiplication in either convention. Changing the convention does not transpose a matrix; an actual transpose still exchanges its rows and columns. Function notation, such as \\(T(f)\\), continues to name a function’s argument.</p>",
          "demo": "matrix-product"
        },
        {
          "title": "The Gram matrix records a basis’s geometry.",
          "body": "\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · GRAM MATRIX</span><p>For basis vectors \\(u_1,\\ldots,u_k\\), their Gram matrix is</p>\\[G_{ij}=u_i\\cdot u_j.\\]<p>If \\(v=\\sum_i c_i u_i\\) and \\(w=\\sum_i d_i u_i\\), then</p>\\[v\\cdot w=c^{\\mathsf T}Gd,\\qquad \\|v\\|^2=c^{\\mathsf T}Gc.\\]</div>\n            <p>An orthonormal basis gives \\(G=I\\). An orthogonal basis gives a diagonal Gram matrix. For an independent family, \\(G\\) is positive definite.</p>\n            <p>When the basis columns form a matrix \\(A\\) in orthonormal ambient coordinates, \\(G=A^{\\mathsf T}A\\). A basis change \\(A'=AS\\) gives \\(G'=S^{\\mathsf T}GS\\).</p>\n            <p class=\"question\">What happens to the determinant of the Gram matrix as two basis directions become almost parallel?</p>",
          "demo": "gram"
        },
        {
          "title": "Projection coefficients solve a geometric system.",
          "body": "\n            <p>Let \\(u_1,\\ldots,u_k\\) be a basis for the target subspace, and write \\(Pv=\\sum_j c_j u_j\\). Perpendicularity of the residual says</p>\\[u_i\\cdot\\left(v-\\sum_jc_j u_j\\right)=0.\\]\n            <p>These equations assemble into</p>\\[Gc=b,\\qquad b_i=u_i\\cdot v.\\]\n            <div class=\"observation\"><span class=\"observation-label\">INNER PRODUCTS ARE NOT GENERALLY COORDINATES</span><p>Take \\(u_1=(1,0)\\), \\(u_2=(1,1)\\), and \\(v=(1,2)\\). Then \\(b=(1,3)^{\\mathsf T}\\), but the coordinate column is \\(c=(-1,2)^{\\mathsf T}\\). The Gram matrix connects them.</p></div>\n            \\[\\begin{pmatrix}1&1\\\\1&2\\end{pmatrix}\\begin{pmatrix}-1\\\\2\\end{pmatrix}=\\begin{pmatrix}1\\\\3\\end{pmatrix}.\\]\n            <p>For a rectangular basis matrix \\(A\\), projection is \\(P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}\\). The same equations describe least-squares fitting.</p><p>To project, first take inner products with the basis columns, then correct by the inverse Gram matrix, then reconstruct the vector:</p>\\[Pv=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}v.\\]<p>The order of these three actions stays the same when we switch notation. When the columns are orthonormal the Gram matrix is the identity, and the correction disappears.</p>",
          "note": "Further development: kernel and image, rank–nullity, the determinant as signed volume, and the distinction between \\(G'=S^{\\mathsf T}GS\\) for a Gram matrix and \\(M'=S^{-1}MS\\) for a linear operator."
        }
      ]
    },
    {
      "id": "lattices",
      "part": "I",
      "number": "06",
      "short": "Lattices and a four-dimensional tile",
      "title": "Discrete points.<br>A space underneath.",
      "subtitle": "A lattice retains the geometry of its ambient space but restricts the allowed coordinates to integers. The hat and turtle meet here, on a four-dimensional lattice.",
      "concepts": [
        "Integer coordinates",
        "Oblique lattice bases",
        "Hat–turtle projections"
      ],
      "intro": "A vector space allows every real combination of its basis directions. A lattice keeps only integer combinations. This is a precise way to make space discrete, and a reason to distinguish a coordinate grid from the Euclidean geometry it carries.",
      "sections": [
        {
          "title": "A lattice is built from whole steps.",
          "body": "<div class=\"definition\"><span class=\"definition-label\">DEFINITION · LATTICE</span><p>For linearly independent vectors \\(u_1,\\ldots,u_k\\) in \\(\\mathbb R^n\\), the lattice they generate is</p>\\[L=\\left\\{\\sum_{i=1}^k z_i u_i:z_i\\in\\mathbb Z\\right\\}.\\]<p>It is discrete in its span. It has full rank when \\(k=n\\).</p></div><p>The familiar square grid is one example. A triangular grid uses two equal-length basis vectors at an angle of \\(\\pi/3\\). Perpendicular coordinates are convenient but are not part of the definition.</p><p>Adding lattice points or taking integer multiples stays in the lattice. Arbitrary real scaling does not. Allowing rational coefficients instead of integers would give a dense set in the span, so it would lose this discreteness.</p><p>The Gram matrix measures lengths and angles in any such basis. Integer coordinates describe which points belong to the lattice; the Gram matrix describes their geometry.</p>"
        },
        {
          "title": "The tile’s lattice coordinates carry a Gram matrix.",
          "body": "<p>The hat–turtle boundary has fourteen fixed vertices in a rank-four lattice. They are stored as integer tuples \\((p,q,r,s)\\). These coefficients refer to two triangular lattice bases. Their Cartesian coordinates are</p>\\[(u_x,u_y,v_x,v_y)=\\left(p+\\frac q2,\\frac{\\sqrt3 q}{2},\\frac{\\sqrt3 r}{2},\\frac r2+s\\right).\\]<p>The corresponding Gram matrix is</p>\\[G=\\begin{pmatrix}1&1/2&0&0\\\\1/2&1&0&0\\\\0&0&1&1/2\\\\0&0&1/2&1\\end{pmatrix}.\\]<p>For the tracked vertex \\(c=(1,-2,0,-1)^{\\mathsf T}\\), its squared distance from the first vertex is \\(c^{\\mathsf T}Gc=4\\). Squaring and adding the four integer coefficients would give the wrong measurement.</p>",
          "note": "The basis, its metric, and the viewing map play different roles. Keeping them separate makes the geometry computable."
        },
        {
          "title": "The object stays fixed. Its image changes.",
          "body": "<p>Write a point in \\(\\mathbb R^4\\) as \\((u,v)\\), with \\(u,v\\in\\mathbb R^2\\). The hat–turtle family uses the screen map</p>\\[M_\\theta(u,v)=\\cos\\theta\\,u+\\sin\\theta\\,v.\\]<p>In orthonormal Cartesian coordinates, its matrix is</p>\\[M_\\theta=\\begin{pmatrix}\\cos\\theta&0&\\sin\\theta&0\\\\0&\\cos\\theta&0&\\sin\\theta\\end{pmatrix}.\\]<p>The same fixed boundary gives the hat at \\(\\theta=\\pi/3\\) and the turtle at \\(\\theta=\\pi/6\\). Its fourteen vertices span four dimensions. A rigid three-dimensional model cannot preserve all of their Euclidean distances.</p><div class=\"definition\"><span class=\"definition-label\">A PROJECTION AND ITS SCREEN COORDINATES</span><p>The rows of \\(M_\\theta\\) are orthonormal, so \\(M_\\theta M_\\theta^{\\mathsf T}=I_2\\). The orthogonal projection within \\(\\mathbb R^4\\) is</p>\\[\\Pi_\\theta=M_\\theta^{\\mathsf T}M_\\theta.\\]<p>The rectangular map \\(M_\\theta\\) records that projection in an orthonormal basis of the viewing plane.</p></div><p>The lift follows <a href=\"https://www.math.univ-toulouse.fr/~cheritat/2023-monotile/4D-lift/index.html\" target=\"_blank\" rel=\"noopener\">Nan Ma and Arnaud Chéritat</a>. Here we use the fixed boundary from <a href=\"https://liuyao12.github.io/geometric-tree-search/apps/hat-turtle-projection/?view=tile\" target=\"_blank\" rel=\"noopener\">the existing hat–turtle construction</a>.</p><p>Use <em>Hat</em> and <em>Turtle</em> to turn the viewing plane smoothly, or play the whole transition. The live matrix gives the same map used to place every dot and every boundary vertex.</p>\n<div class=\"observation\"><span class=\"observation-label\">A DENSE IMAGE DOES NOT REQUIRE A DENSE LATTICE</span><p>For this lattice, put \\(t=\\tan\\theta/\\sqrt3\\). A rational value of \\(t\\) gives a discrete lattice image; an irrational value gives an image dense in the plane. Hat and turtle have \\(t=1\\) and \\(t=1/3\\). They are not the only exceptions: the <em>Other lattice view</em> button uses \\(t=1/2\\), at an angle of about \\(40.9^\\circ\\).</p></div>\n<details class=\"tile-math-note\"><summary>Why the rational slope matters</summary><p>After dividing the projected coordinates by \\(\\cos\\theta\\) and expressing them in the first triangular basis, a lattice point has coordinates</p>\\[\\bigl(p+t(r-s),\\ q+t(r+2s)\\bigr).\\]<p>For rational \\(t\\), these lie in a grid with a fixed common denominator. For irrational \\(t\\), the image contains all pairs whose coordinates belong to \\(\\mathbb Z+3t\\mathbb Z\\), which is dense in \\(\\mathbb R\\). The displayed dots are always a finite sample; increasing the sample can suggest this density but cannot prove it.</p></details>\n<p>The two perpendicular coordinates are</p>\\[N_\\theta(u,v)=-\\sin\\theta\\,u+\\cos\\theta\\,v.\\]\n<p>The lower view shows these hidden coordinates relative to the tile’s center. A round window selects a thickened affine viewing plane in the original space; the opacity falls smoothly with perpendicular distance from its center. Move or narrow the window and watch different lattice points come forward.</p><p>The lifted boundary spans four dimensions, so it is not contained in a single affine plane. The initial window is thick enough to include all its vertices. Keeping a bounded window gives a locally finite selection of projected points, even when the image of the entire lattice is dense. The fading display is a soft illustration of this selection, not a reconstruction of a full hat tiling.</p>",
          "demo": "hat-turtle"
        }
      ]
    },
    {
      "id": "eigenvectors",
      "part": "I",
      "number": "07",
      "short": "Directions that persist",
      "title": "Find the directions<br>a map preserves.",
      "subtitle": "Eigenvectors identify directions whose behavior under a transformation is especially simple.",
      "concepts": [
        "Eigenvectors",
        "Repeated maps",
        "Spectral theorem"
      ],
      "intro": "A transformation can mix coordinate directions. Occasionally there is a better choice of directions: ones the transformation only scales.",
      "sections": [
        {
          "title": "A preserved direction becomes a scalar equation.",
          "body": "\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · EIGENVECTOR AND EIGENVALUE</span><p>A nonzero vector \\(v\\) is an eigenvector of a linear map \\(T\\) if</p>\\[Tv=\\lambda v\\]<p>for some scalar \\(\\lambda\\), its eigenvalue.</p></div>\n            <p>Along an eigenvector, iteration is simple: \\(T^mv=\\lambda^mv\\). A basis of eigenvectors separates the transformation into independent scalings.</p>\n            <div class=\"observation\"><span class=\"observation-label\">A BASIS OF EIGENVECTORS IS NOT GUARANTEED</span><p>A nontrivial shear has only one line of eigenvectors in the plane. A rotation through an angle other than a multiple of \\(\\pi\\) has no real eigenvectors in the plane.</p></div>\n            <p>The side example compares a stretch, a shear, and a rotation. Move the initial direction and look for a transformed vector on the same line.</p>",
          "demo": "eigenvectors"
        },
        {
          "title": "Symmetry supplies an orthogonal basis.",
          "body": "\n            <p>The finite-dimensional spectral theorem is an especially strong conclusion: a real symmetric matrix admits an orthonormal basis of eigenvectors.</p>\\[M=Q\\Lambda Q^{\\mathsf T},\\qquad Q^{\\mathsf T}Q=I.\\]\n            <p>In those coordinates, a symmetric transformation becomes a diagonal scaling. Orthogonal projection and reflection are examples we already understand: their eigenvalues describe which components are kept, removed, or reversed.</p>\n            <p>In the second part, functions will become vectors and operators will replace matrices. We will look again for shapes whose identity survives an operation.</p>",
          "note": "Projection onto a nontrivial proper subspace has eigenvalues \\(0\\) and \\(1\\). Reflection across it has eigenvalues \\(1\\) and \\(-1\\). The eigenspaces are the geometric components already visible in the projection animation."
        }
      ]
    },
    {
      "id": "inner-products",
      "part": "II",
      "number": "08",
      "short": "Functions acquire geometry",
      "title": "What if a function<br>were a vector?",
      "subtitle": "The first abstract definition grows out of a concrete surprise: functions can have lengths, angles, and perpendicular components.",
      "concepts": [
        "Function spaces",
        "Inner product",
        "Orthogonal functions"
      ],
      "intro": "We already add functions and multiply them by scalars. Now ask what could play the role of the dot product. The geometry of the first part gives us a precise set of expectations.",
      "sections": [
        {
          "title": "Abstract the structure we have been using.",
          "body": "\n            <p>A real inner product space packages vector addition, real scalar multiplication, and measurement together. We introduce that whole structure here; a later part will ask what remains when measurement is set aside.</p>\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · REAL INNER PRODUCT SPACE</span><p>A real inner product space is a set \\(V\\) with addition and real scalar multiplication satisfying the linear rules below, together with a pairing \\(\\langle\\cdot,\\cdot\\rangle:V\\times V\\to\\mathbb R\\) satisfying</p>\\[\\begin{aligned}\\langle au+bv,w\\rangle&=a\\langle u,w\\rangle+b\\langle v,w\\rangle,\\\\\\langle u,v\\rangle&=\\langle v,u\\rangle,\\\\\\langle v,v\\rangle&\\geq0,\\\\\\langle v,v\\rangle=0&\\iff v=0.\\end{aligned}\\]<p>Define \\(\\|v\\|=\\sqrt{\\langle v,v\\rangle}\\). Vectors are orthogonal when their inner product is zero.</p></div>\n            <details><summary>Linear rules for addition and scaling</summary><p>Addition is associative and commutative, has a zero, and every vector has an additive inverse. For real scalars \\(a,b\\),</p>\\[\\begin{aligned}a(u+v)&=au+av,\\\\(a+b)v&=av+bv,\\\\a(bv)&=(ab)v,\\\\1v&=v.\\end{aligned}\\]</details>\n            <p>These conditions retain exactly the features needed for perpendicularity, the Pythagorean theorem, and projection onto finite-dimensional subspaces.</p>",
          "demo": "sine-cosine"
        },
        {
          "title": "Sine and cosine are perpendicular functions.",
          "body": "\n            <p>Take real continuous functions on \\([0,2\\pi]\\), with pointwise addition and scaling. Set</p>\\[\\langle f,g\\rangle=\\int_0^{2\\pi}f(x)g(x)\\,dx.\\]\n            <p>This is an inner product. In particular, continuity ensures that a nonzero function has strictly positive squared length.</p>\\[\\|f\\|^2=\\int_0^{2\\pi}f(x)^2\\,dx.\\]\n            <p>For sine and cosine, the signed contributions cancel:</p>\\[\\langle\\sin,\\cos\\rangle=\\int_0^{2\\pi}\\sin x\\cos x\\,dx=0.\\]\n            <div class=\"observation\"><span class=\"observation-label\">THE INTERVAL IS PART OF THE GEOMETRY</span><p>On \\([0,\\pi/2]\\), the same product has integral \\(1/2\\). Orthogonality belongs to the functions together with the chosen inner product, including its interval.</p></div>\n            <p class=\"question\">Which parts of the definition can you verify directly from properties of the integral?</p>",
          "note": "For the ordered pair \\(\\sin x,\\cos x\\), the Gram matrix is \\(\\pi I\\). Dividing each function by \\(\\sqrt{\\pi}\\) gives an orthonormal pair."
        }
      ]
    },
    {
      "id": "fourier",
      "part": "II",
      "number": "09",
      "short": "Projection becomes Fourier",
      "title": "Approximation is<br>a geometric operation.",
      "subtitle": "Use a finite family of perpendicular functions as directions. Fourier coefficients are projection coordinates.",
      "concepts": [
        "Fourier coefficients",
        "Gram matrix",
        "Finite projections"
      ],
      "intro": "The nearest-point construction returns in a new setting. Replace a plane by a finite-dimensional space of functions, and replace the dot product by an integral.",
      "sections": [
        {
          "title": "The projection equations survive unchanged.",
          "body": "\n            <p>For independent functions \\(u_1,\\ldots,u_k\\), the best approximation \\(p=\\sum_jc_ju_j\\), in the integral norm, satisfies</p>\\[Gc=b,\\qquad G_{ij}=\\langle u_i,u_j\\rangle,\\qquad b_i=\\langle u_i,f\\rangle.\\]\n            <p>For the trigonometric family \\(1,\\cos x,\\sin x,\\ldots,\\cos Nx,\\sin Nx\\), the Gram matrix is diagonal:</p>\\[G=\\operatorname{diag}(2\\pi,\\pi,\\pi,\\ldots,\\pi,\\pi).\\]\n            <p>The resulting projection is</p>\\[P_Nf=\\frac{a_0}{2}+\\sum_{n=1}^{N}\\bigl(a_n\\cos nx+b_n\\sin nx\\bigr),\\]\n            \\[a_n=\\frac1\\pi\\int_0^{2\\pi}f(x)\\cos nx\\,dx,\\qquad b_n=\\frac1\\pi\\int_0^{2\\pi}f(x)\\sin nx\\,dx.\\]\n            <p>The constant direction has squared length \\(2\\pi\\), which accounts for the factor \\(a_0/2\\).</p>",
          "demo": "fourier"
        },
        {
          "title": "Finite projection first. Infinite expansion next.",
          "body": "\n            <p>Every finite partial sum is an ordinary projection onto a finite-dimensional subspace. Its residual is perpendicular to every retained mode.</p>\\[\\|f\\|^2=\\|P_Nf\\|^2+\\|f-P_Nf\\|^2.\\]\n            <p>As the approximation spaces grow, the projection error cannot increase. This is already a rigorous geometric statement, without resolving every question about infinite series.</p>\n            <div class=\"observation\"><span class=\"observation-label\">CONVERGENCE NEEDS ITS OWN QUESTION</span><p>Convergence in the integral norm, pointwise convergence, and uniform convergence are different claims. An infinite orthogonal expansion also differs from a finite algebraic basis expansion.</p></div>\n            <p>The side example approximates a continuous periodic triangle wave. Further examples can explore discontinuities and introduce the space of square-integrable functions, with functions equal almost everywhere identified.</p>",
          "note": "For a periodic triangle wave \\(f(x)=|x-\\pi|-\\pi/2\\), the only nonzero Fourier coefficients are \\(a_n=4/(\\pi n^2)\\) for positive odd \\(n\\). Its average is zero."
        }
      ]
    },
    {
      "id": "operators",
      "part": "II",
      "number": "10",
      "short": "Eigenfunctions and modes",
      "title": "A shape that<br>keeps its identity.",
      "subtitle": "Return to eigenvectors through operators on functions. The same modes used for approximation can have simple dynamics.",
      "concepts": [
        "Linear operators",
        "Eigenfunctions",
        "Independent modes"
      ],
      "intro": "An eigenvector retains its direction under a map. An eigenfunction retains its shape under an operator, changing only by a scalar factor.",
      "sections": [
        {
          "title": "Differentiation becomes a geometric operation.",
          "body": "\n            <p>On the finite-dimensional trigonometric space</p>\\[V_N=\\operatorname{span}\\{1,\\cos x,\\sin x,\\ldots,\\cos Nx,\\sin Nx\\},\\]\n            <p>the operator \\(T=-d^2/dx^2\\) preserves the space and satisfies</p>\\[T(\\cos nx)=n^2\\cos nx,\\qquad T(\\sin nx)=n^2\\sin nx.\\]\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · EIGENFUNCTION</span><p>A nonzero function \\(f\\) in an operator's domain is an eigenfunction if</p>\\[Tf=\\lambda f.\\]</div>\n            <p>In this finite-dimensional setting, the trigonometric basis diagonalizes \\(T\\). Moving to a larger function space will require us to specify the operator's domain and boundary conditions.</p>",
          "demo": "eigenfunction"
        },
        {
          "title": "Modes turn evolution into scalar equations.",
          "body": "\n            <p>For the heat equation on a periodic interval, an individual mode evolves as</p>\\[u(x,t)=e^{-n^2t}\\cos nx.\\]\n            <p>Its shape stays the same while its amplitude decreases. Higher-frequency modes decay more quickly. A finite sum evolves by letting each mode follow its own scalar equation.</p>\n            <p>This connects two uses of the same functions: they provide perpendicular directions for approximation and simple modes for an operator.</p>\n            <h3>Beyond this first draft</h3><p>We can now separate addition and scaling from measurement to introduce general vector spaces. Later, composition of invertible maps leads to groups; changing the field leads to finite geometries, coding, and matrix groups.</p>\n            <p>The Fano plane and its matrix symmetries will supply a final motivation for the Sylow theorems, without requiring their proofs.</p>",
          "note": "The later algebraic chapters are planned rather than drafted. They will preserve the same pattern: a concrete example alongside the structure it motivates."
        }
      ]
    }
  ]
};
