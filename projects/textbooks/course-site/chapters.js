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
          "body": "\n<p>An orthonormal coordinate frame records perpendicular directions of unit length. Keep a displacement separate from its list of components: \\(v\\) denotes the vector, and \\(x=v.c\\) is its coordinate list under a coordinate map \\(c\\). The period means “apply the function on the right.”</p>\n<div class=\"definition\"><span class=\"definition-label\">VECTORS, LISTS, AND MATRICES</span>\n\\[v.c=x=[1,2,3],\\qquad [x]=[[1,2,3]].\\]\n<p>The list \\(x\\) has three entries. The matrix \\([x]\\) has one row and three columns. Its transpose \\([x]^{\\mathsf T}=[[1],[2],[3]]\\) has three rows and one column. The toggle changes matrix representations; the list \\(x\\) and the vector \\(v\\) stay fixed.</p></div>\n<div class=\"definition\"><span class=\"definition-label\">DEFINITION · EUCLIDEAN DOT PRODUCT</span>\n<p>If \\(x=u.c\\) and \\(y=v.c\\) are coordinates in an orthonormal frame,</p>\n\\[u\\cdot v=x_1y_1+x_2y_2+x_3y_3.\\]\n<p>The length is \\(\\|v\\|=\\sqrt{v\\cdot v}\\). For nonzero vectors,</p>\n\\[\\cos\\theta=\\frac{u\\cdot v}{\\|u\\|\\,\\|v\\|}.\\]</div>\n<p>Perpendicular vectors have zero dot product. We will use that fact to find nearest points, split displacements into components, and construct reflections. With a different coordinate map, the <a href=\"#coordinates\">Gram matrix</a> will record how to recover lengths and angles.</p>\n",
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
          "body": "\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · ORTHOGONAL PROJECTION</span><p>For a linear subspace \\(W\\subseteq\\mathbb R^n\\), the orthogonal projection of \\(v\\) onto \\(W\\) is the unique vector \\(v.\\mathcal P\\in W\\) for which</p>\\[v-v.\\mathcal P\\perp W.\\]<p>Thus \\(v=v.\\mathcal P+(v-v.\\mathcal P)\\) is a decomposition into perpendicular components.</p></div>\n            <div data-demo=\"projection\" class=\"inline-animation\"></div><p>If \\(w\\in W\\), the Pythagorean theorem gives</p>\\[\\|v-w\\|^2=\\|v-v.\\mathcal P\\|^2+\\|v.\\mathcal P-w\\|^2.\\]\n            <p>The nearest point is therefore \\(v.\\mathcal P\\). For a line spanned by a nonzero vector \\(u\\),</p>\\[v.\\mathcal P=\\frac{v\\cdot u}{u\\cdot u}\\,u.\\]\n            <p>Projecting again changes nothing: \\(\\mathcal P^2=\\mathcal P\\). Every vector already in \\(W\\) is fixed; every vector in \\(W^\\perp\\) disappears.</p>",
          "note": "For the coordinate plane \\(z=0\\), projection and reflection have particularly simple matrices:\\[P=\\begin{pmatrix}1&0&0\\\\0&1&0\\\\0&0&0\\end{pmatrix},\\]\\[R=\\begin{pmatrix}1&0&0\\\\0&1&0\\\\0&0&-1\\end{pmatrix}.\\]"
        },
        {
          "title": "Two projections bring new surprises.",
          "body": "\n            <p>An oblique projection also keeps the target subspace fixed, but removes components along a different complementary subspace. Its image alone does not determine the map.</p>\n            <div class=\"observation\"><span class=\"observation-label\">COMPOSITION IS NOT INNOCENT</span><p>Two orthogonal projections need not commute, and their composition need not be a projection. The second projection can undo part of what the first one accomplished.</p></div>\n            <p>For orthogonal projections \\(\\mathcal P,\\mathcal Q\\), commutativity is exactly the condition that makes \\(\\mathcal P\\mathcal Q\\) the orthogonal projection onto the intersection of their images.</p>\n            <p>The side example compares successive projections onto two lines. Follow the intermediate point as well as the final one.</p>\n            <p class=\"question\">Why does projecting twice onto the same line differ from projecting successively onto two different lines?</p>",
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
          "body": "\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · REFLECTION ACROSS A SUBSPACE</span><p>If \\(\\mathcal P\\) is orthogonal projection onto a linear subspace \\(W\\), reflection across \\(W\\) is</p>\\[v.\\mathcal R=v.\\mathcal P-v.(\\mathrm{id}-\\mathcal P)=v.(2\\mathcal P-\\mathrm{id}).\\]</div>\n            <p>The map fixes \\(W\\) pointwise and reverses \\(W^\\perp\\). Reflecting twice gives \\(\\mathcal R^2=\\mathrm{id}\\), and reflection preserves lengths and angles.</p>\n            <p>For a plane through the origin with a unit normal \\(n\\), the formula becomes</p>\\[v.\\mathcal R=v-2(v\\cdot n)n.\\]\n            <div class=\"observation\"><span class=\"observation-label\">THE FIXED SET MATTERS</span><p>Reflection across a plane in three dimensions fixes an entire plane. The map \\(v\\mapsto-v\\) fixes only the origin. Both reverse some directions, but they are different geometric operations.</p></div>",
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
      "intro": "A vector, a list of numbers, and a matrix have different roles. Coordinate maps connect them. An oblique or unevenly scaled frame changes the numbers we use, while the Gram matrix keeps track of measurement.",
      "sections": [
        {
          "title": "A coordinate map connects a vector to a list.",
          "body": "\n<div class=\"definition\"><span class=\"definition-label\">OUR NOTATION</span>\n<p>Write \\(v\\) for a vector and \\(x=v.c\\) for its coordinate list. A coordinate map \\(c:V\\to\\mathbb R^n\\) is a linear bijection. Writing \\(v.c\\) means applying \\(c\\) to \\(v\\).</p>\n\\[x=[1,2,3],\\qquad [x]=[[1,2,3]].\\]\n<p>Square brackets around a list make a matrix with that list as its one row. If \\(y=[4,5,6]\\), stacking two lists gives \\(D=[x,y]=[[1,2,3],[4,5,6]]\\). These literal lists do not change when we toggle.</p>\n<p>The active matrix representation of \\(x\\) is</p>\n\\[X=[x]^{\\mathsf T}.\\]\n<p><span data-row-copy=\"Here the representing matrix has one row. A coordinate list and a one-row matrix are still different objects.\" data-column-copy=\"Here the representing matrix has one column. Transposing a matrix does not turn the vector into a covector.\"></span></p></div>\n<p>For linear transformations \\(L:V\\to W\\) and \\(K:W\\to U\\), evaluation always reads from left to right:</p>\n\\[(v.L).K=v.(LK).\\]\n<p>If \\(d\\) supplies coordinates on \\(W\\), the matrix \\(A\\) representing \\(L\\) is characterized by</p>\n\\[[v.L.d]^{\\mathsf T}=A[v.c]^{\\mathsf T}.\\]\n<p>The output of \\(L\\) feeds \\(K\\). Using coordinates \\(e\\) on \\(U\\), their matrices compose as</p>\n\\[[v.L.K.e]^{\\mathsf T}=BA[v.c]^{\\mathsf T}.\\]\n<p><span data-row-copy=\"The matrices appear in the order the transformations act.\" data-column-copy=\"The rightmost matrix acts first.\"></span> The expression \\((v.L).K\\) keeps the same order in both modes. We keep the brackets in matrix equations instead of silently multiplying an abstract vector or a bare list by a matrix.</p>\n",
          "note": "A vector \\(v\\), its list \\(v.c\\), and the matrix \\([v.c]\\) are three distinct objects. Name the coordinate map when its choice matters."
        },
        {
          "title": "A matrix product is still a row meeting a column.",
          "body": "\n<p>The toggle transposes the matrices representing the same transformations. Both modes use ordinary row-by-column multiplication, with row-first indexing. The list \\(x\\) stays a row list; its representing matrix can be \\([x]\\) or \\([x]^{\\mathsf T}\\).</p>\n\\[\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\begin{pmatrix}x_1\\\\x_2\\end{pmatrix}=\\begin{pmatrix}ax_1+bx_2\\\\cx_1+dx_2\\end{pmatrix}.\\]\n<p>The displayed input and output are matrices, with one row or one column. Each scalar entry of a product is</p>\n\\[(BA)_{m,n}=\\sum_k B_{m,k}A_{k,n}.\\]\n\\[A\\in\\mathbb R^{k\\times n},\\qquad B\\in\\mathbb R^{m\\times k}.\\]\n<p>Associativity and the reversal rules retain their familiar forms:</p>\n\\[(AB)C=A(BC),\\qquad (AB)^{\\mathsf T}=B^{\\mathsf T}A^{\\mathsf T}.\\]\n\\[(AB)^{-1}=B^{-1}A^{-1}.\\]\n<p>The inverse formula assumes both factors are square and invertible. The animation follows individual entries as rectangular matrices transpose.</p>\n",
          "demo": "matrix-product"
        },
        {
          "title": "The Gram matrix records the coordinate directions’ geometry.",
          "body": "\n<div class=\"definition\"><span class=\"definition-label\">DEFINITION · GRAM MATRIX</span>\n<p>Let \\(u_1,\\ldots,u_k\\) be the directions specified by a coordinate map \\(c\\). Their Gram matrix is</p>\n\\[G_{ij}=u_i\\cdot u_j.\\]\n<p>If \\(x=v.c\\) and \\(y=w.c\\), then \\(v=\\sum_i x_i u_i\\) and \\(w=\\sum_i y_i u_i\\). Introduce matrices for the coordinate lists:</p>\n\\[X=[x]^{\\mathsf T},\\qquad Y=[y]^{\\mathsf T}.\\]\n\\[[[v\\cdot w]]=X^{\\mathsf T}GY.\\]\n\\[[[\\|v\\|^2]]=X^{\\mathsf T}GX.\\]\n<p>The products here are \\(1\\times1\\) matrices. We write \\([[s]]\\) for the matrix whose only entry is the scalar \\(s\\); the scalar itself is its \\((1,1)\\) entry.</p></div>\n<p>With the literal row wrappers, the same pairing can always be written as \\([[v\\cdot w]]=[x]G[y]^{\\mathsf T}\\), in either mode.</p><p>An orthonormal frame gives \\(G=I\\). Orthogonal directions give a diagonal Gram matrix. Independent directions give a positive-definite Gram matrix.</p>\n<p>Let \\(A\\) collect the directions in orthonormal ambient coordinates, as <span data-row-copy=\"rows\" data-column-copy=\"columns\"></span>. Then</p>\n\\[G=A^{\\mathsf T}A.\\]\n<p>Changing the coordinate directions by \\(A'=AS\\) gives \\(G'=S^{\\mathsf T}GS\\). The list \\(x\\) can stay fixed while its geometric realization changes. The side example fixes \\(x=[1,1]\\), tilts the second direction, and shows the resulting length.</p>\n<p class=\"question\">What happens to the determinant of the Gram matrix as two coordinate directions become almost parallel?</p>\n",
          "demo": "gram"
        },
        {
          "title": "Projection coefficients solve a geometric system.",
          "body": "\n<p>Let \\(u_1,\\ldots,u_k\\) span the target subspace. Write the projected vector as \\(v.\\mathcal P=\\sum_j a_j u_j\\). Perpendicularity of the residual says</p>\n\\[u_i\\cdot\\left(v-\\sum_j a_j u_j\\right)=0.\\]\n<p>The coefficients form a list \\(a\\). The measurements form a list \\(b\\), with \\(b_i=u_i\\cdot v\\). Give each list its matrix representation:</p>\n\\[C=[a]^{\\mathsf T},\\qquad D=[b]^{\\mathsf T}.\\]\n\\[GC=D.\\]\n<div class=\"observation\"><span class=\"observation-label\">INNER PRODUCTS ARE NOT GENERALLY COORDINATES</span>\n<p>Choose directions with ambient lists \\([1,0]\\) and \\([1,1]\\), and let the ambient coordinates of \\(v\\) be \\(x=[1,2]\\). The measurements are \\(b=[1,3]\\), while the reconstruction coefficients are \\(a=[-1,2]\\). Thus \\(v=-u_1+2u_2\\). The Gram matrix connects the two lists:</p></div>\n\\[\\begin{pmatrix}1&1\\\\1&2\\end{pmatrix}\\begin{pmatrix}-1\\\\2\\end{pmatrix}=\\begin{pmatrix}1\\\\3\\end{pmatrix}.\\]\n<p>Let \\(A\\) contain the target directions in orthonormal ambient coordinates. If \\(X\\) represents the input list and \\(Y\\) the projected list, synthesis is \\(Y=AC\\). The projection matrix is</p>\n\\[P=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}.\\]\n\\[Y=PX=A(A^{\\mathsf T}A)^{-1}A^{\\mathsf T}X.\\]\n<p>First take inner products with the target directions, then correct by the inverse Gram matrix, then reconstruct. When the <span data-row-copy=\"rows\" data-column-copy=\"columns\"></span> of \\(A\\) are orthonormal, the correction disappears. The same equations describe least-squares fitting.</p>\n",
          "note": "Further development: kernel and image, rank–nullity, signed volume, and the distinction between \\(G'=S^{\\mathsf T}GS\\) for a Gram matrix and \\(M'=S^{-1}MS\\) for a linear operator."
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
          "body": "<p>The hat–turtle boundary has fourteen fixed vertices in a rank-four lattice. They are stored as integer tuples \\([p,q,r,s]\\). These coefficients refer to two triangular lattice bases. Their Cartesian coordinates are</p>\\[[x_1,x_2,x_3,x_4]=\\left[p+\\frac q2,\\frac{\\sqrt3 q}{2},\\frac{\\sqrt3 r}{2},\\frac r2+s\\right].\\]<p>The corresponding Gram matrix is</p>\\[G=\\begin{pmatrix}1&1/2&0&0\\\\1/2&1&0&0\\\\0&0&1&1/2\\\\0&0&1/2&1\\end{pmatrix}.\\]<p>For the tracked vertex \\(x=[1,-2,0,-1]\\), its squared distance from the first vertex is \\([x]G[x]^{\\mathsf T}=[[4]]\\). Squaring and adding the four integer coefficients would give the wrong measurement.</p>",
          "note": "The basis, its metric, and the viewing map play different roles. Keeping them separate makes the geometry computable."
        },
        {
          "title": "The object stays fixed. Its image changes.",
          "body": "<p>Write the Cartesian coordinate list of a point as \\(x=[x_1,x_2,x_3,x_4]\\). The screen map \\(m_\\theta\\) sends this list to</p>\\[x.m_\\theta=[(\\cos\\theta)x_1+(\\sin\\theta)x_3,(\\cos\\theta)x_2+(\\sin\\theta)x_4].\\]<p>In orthonormal Cartesian coordinates, \\([x.m_\\theta]^{\\mathsf T}=M_\\theta[x]^{\\mathsf T}\\). Its matrix is</p>\\[M_\\theta=\\begin{pmatrix}\\cos\\theta&0&\\sin\\theta&0\\\\0&\\cos\\theta&0&\\sin\\theta\\end{pmatrix}.\\]<p>The same fixed boundary gives the hat at \\(\\theta=\\pi/3\\) and the turtle at \\(\\theta=\\pi/6\\). Its fourteen vertices span four dimensions. A rigid three-dimensional model cannot preserve all of their Euclidean distances.</p><div class=\"definition\"><span class=\"definition-label\">A PROJECTION AND ITS SCREEN COORDINATES</span><p><span data-row-copy=\"The columns of\" data-column-copy=\"The rows of\"></span> \\(M_\\theta\\) are orthonormal, so \\(M_\\theta M_\\theta^{\\mathsf T}=I_2\\). The orthogonal projection within \\(\\mathbb R^4\\) is</p>\\[\\Pi_\\theta=M_\\theta^{\\mathsf T}M_\\theta.\\]<p>The rectangular map \\(M_\\theta\\) records that projection in an orthonormal basis of the viewing plane.</p></div><p>The lift follows <a href=\"https://www.math.univ-toulouse.fr/~cheritat/2023-monotile/4D-lift/index.html\" target=\"_blank\" rel=\"noopener\">Nan Ma and Arnaud Chéritat</a>. Here we use the fixed boundary from <a href=\"https://liuyao12.github.io/geometric-tree-search/apps/hat-turtle-projection/?view=tile\" target=\"_blank\" rel=\"noopener\">the existing hat–turtle construction</a>.</p><p>Use <em>Hat</em> and <em>Turtle</em> to turn the viewing plane smoothly, or play the whole transition. The live matrix gives the same map used to place every dot and every boundary vertex.</p>\n<div class=\"observation\"><span class=\"observation-label\">A DENSE IMAGE DOES NOT REQUIRE A DENSE LATTICE</span><p>For this lattice, put \\(t=\\tan\\theta/\\sqrt3\\). A rational value of \\(t\\) gives a discrete lattice image; an irrational value gives an image dense in the plane. Hat and turtle have \\(t=1\\) and \\(t=1/3\\). They are not the only exceptions: the <em>Other lattice view</em> button uses \\(t=1/2\\), at an angle of about \\(40.9^\\circ\\).</p></div>\n<details class=\"tile-math-note\"><summary>Why the rational slope matters</summary><p>After dividing the projected coordinates by \\(\\cos\\theta\\) and expressing them in the first triangular basis, a lattice point has coordinates</p>\\[\\bigl(p+t(r-s),\\ q+t(r+2s)\\bigr).\\]<p>For rational \\(t\\), these lie in a grid with a fixed common denominator. For irrational \\(t\\), the image contains all pairs whose coordinates belong to \\(\\mathbb Z+3t\\mathbb Z\\), which is dense in \\(\\mathbb R\\). The displayed dots are always a finite sample; increasing the sample can suggest this density but cannot prove it.</p></details>\n<p>The two perpendicular coordinates are</p>\\[x.n_\\theta=[-(\\sin\\theta)x_1+(\\cos\\theta)x_3,-(\\sin\\theta)x_2+(\\cos\\theta)x_4].\\]\n<p>The lower view shows these hidden coordinates relative to the tile’s center. A round window selects a thickened affine viewing plane in the original space; the opacity falls smoothly with perpendicular distance from its center. Move or narrow the window and watch different lattice points come forward.</p><p>The lifted boundary spans four dimensions, so it is not contained in a single affine plane. The initial window is thick enough to include all its vertices. Keeping a bounded window gives a locally finite selection of projected points, even when the image of the entire lattice is dense. The fading display is a soft illustration of this selection, not a reconstruction of a full hat tiling.</p>",
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
          "body": "\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · EIGENVECTOR AND EIGENVALUE</span><p>A nonzero vector \\(v\\) is an eigenvector of a linear map \\(T\\) if</p>\\[v.T=\\lambda v\\]<p>for some scalar \\(\\lambda\\), its eigenvalue.</p></div>\n            <p>Along an eigenvector, iteration is simple: \\(v.T^m=\\lambda^mv\\). A basis of eigenvectors separates the transformation into independent scalings.</p>\n            <div class=\"observation\"><span class=\"observation-label\">A BASIS OF EIGENVECTORS IS NOT GUARANTEED</span><p>A nontrivial shear has only one line of eigenvectors in the plane. A rotation through an angle other than a multiple of \\(\\pi\\) has no real eigenvectors in the plane.</p></div>\n            <p>The side example compares a stretch, a shear, and a rotation. Move the initial direction and look for a transformed vector on the same line.</p>",
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
          "body": "\n            <p>Take real continuous functions on \\([0,2\\pi]\\), with pointwise addition and scaling. Set</p>\\[\\langle f,g\\rangle=\\int_0^{2\\pi}(x.f)(x.g)\\,dx.\\]\n            <p>This is an inner product. In particular, continuity ensures that a nonzero function has strictly positive squared length.</p>\\[\\|f\\|^2=\\int_0^{2\\pi}(x.f)^2\\,dx.\\]\n            <p>For sine and cosine, the signed contributions cancel:</p>\\[\\langle\\sin,\\cos\\rangle=\\int_0^{2\\pi}\\sin x\\cos x\\,dx=0.\\]\n            <div class=\"observation\"><span class=\"observation-label\">THE INTERVAL IS PART OF THE GEOMETRY</span><p>On \\([0,\\pi/2]\\), the same product has integral \\(1/2\\). Orthogonality belongs to the functions together with the chosen inner product, including its interval.</p></div>\n            <p class=\"question\">Which parts of the definition can you verify directly from properties of the integral?</p>",
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
          "body": "\n            <p>For independent functions \\(u_1,\\ldots,u_k\\), the best approximation \\(p=\\sum_jc_ju_j\\), in the integral norm, satisfies the same matrix equations. Use the coefficient list \\(a=[c_1,\\ldots,c_k]\\), measurement list \\(b\\), and their matrices \\(C,D\\) as in the finite-dimensional chapter:</p>\\[GC=D,\\qquad G_{ij}=\\langle u_i,u_j\\rangle,\\qquad b_i=\\langle u_i,f\\rangle.\\]\n            <p>For the trigonometric family \\(1,\\cos x,\\sin x,\\ldots,\\cos Nx,\\sin Nx\\), the Gram matrix is diagonal:</p>\\[G=\\operatorname{diag}(2\\pi,\\pi,\\pi,\\ldots,\\pi,\\pi).\\]\n            <p>The resulting projection is</p>\\[x.(f.P_N)=\\frac{a_0}{2}+\\sum_{n=1}^{N}\\bigl(a_n\\cos nx+b_n\\sin nx\\bigr),\\]\n            \\[a_n=\\frac1\\pi\\int_0^{2\\pi}(x.f)\\cos nx\\,dx,\\qquad b_n=\\frac1\\pi\\int_0^{2\\pi}x.f\\sin nx\\,dx.\\]\n            <p>The constant direction has squared length \\(2\\pi\\), which accounts for the factor \\(a_0/2\\).</p>",
          "demo": "fourier"
        },
        {
          "title": "Finite projection first. Infinite expansion next.",
          "body": "\n            <p>Every finite partial sum is an ordinary projection onto a finite-dimensional subspace. Its residual is perpendicular to every retained mode.</p>\\[\\|f\\|^2=\\|f.P_N\\|^2+\\|f-f.P_N\\|^2.\\]\n            <p>As the approximation spaces grow, the projection error cannot increase. This is already a rigorous geometric statement, without resolving every question about infinite series.</p>\n            <div class=\"observation\"><span class=\"observation-label\">CONVERGENCE NEEDS ITS OWN QUESTION</span><p>Convergence in the integral norm, pointwise convergence, and uniform convergence are different claims. An infinite orthogonal expansion also differs from a finite algebraic basis expansion.</p></div>\n            <p>The side example approximates a continuous periodic triangle wave. Further examples can explore discontinuities and introduce the space of square-integrable functions, with functions equal almost everywhere identified.</p>",
          "note": "For a periodic triangle wave \\(x.f=|x-\\pi|-\\pi/2\\), the only nonzero Fourier coefficients are \\(a_n=4/(\\pi n^2)\\) for positive odd \\(n\\). Its average is zero."
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
          "body": "\n            <p>On the finite-dimensional trigonometric space</p>\\[V_N=\\operatorname{span}\\{1,\\cos x,\\sin x,\\ldots,\\cos Nx,\\sin Nx\\},\\]\n            <p>the operator \\(T=-d^2/dx^2\\) preserves the space. Write \\(x.c_n=\\cos nx\\) and \\(x.s_n=\\sin nx\\); then</p>\\[c_n.T=n^2c_n,\\qquad s_n.T=n^2s_n.\\]\n            <div class=\"definition\"><span class=\"definition-label\">DEFINITION · EIGENFUNCTION</span><p>A nonzero function \\(f\\) in an operator's domain is an eigenfunction if</p>\\[f.T=\\lambda f.\\]</div>\n            <p>In this finite-dimensional setting, the trigonometric basis diagonalizes \\(T\\). Moving to a larger function space will require us to specify the operator's domain and boundary conditions.</p>",
          "demo": "eigenfunction"
        },
        {
          "title": "Modes turn evolution into scalar equations.",
          "body": "\n            <p>For the heat equation on a periodic interval, an individual mode evolves as</p>\\[(x,t).u=e^{-n^2t}\\cos nx.\\]\n            <p>Its shape stays the same while its amplitude decreases. Higher-frequency modes decay more quickly. A finite sum evolves by letting each mode follow its own scalar equation.</p>\n            <p>This connects two uses of the same functions: they provide perpendicular directions for approximation and simple modes for an operator.</p>\n            <h3>Beyond this first draft</h3><p>We can now separate addition and scaling from measurement to introduce general vector spaces. Later, composition of invertible maps leads to groups; changing the field leads to finite geometries, coding, and matrix groups.</p>\n            <p>The Fano plane and its matrix symmetries will supply a final motivation for the Sylow theorems, without requiring their proofs.</p>",
          "note": "The later algebraic chapters are planned rather than drafted. They will preserve the same pattern: a concrete example alongside the structure it motivates."
        }
      ]
    }
  ]
};
