const m=String.raw;
export const weilSources={
 original:'https://doi.org/10.1090/S0002-9904-1949-09219-4',
 scan:'https://math.ucr.edu/~res/math205B-2021/app2number-theory/weil-conjectures1949.pdf',
 commentary:'https://doi.org/10.1090/bull/1617',
 commentaryPdf:'https://www.ams.org/journals/bull/2018-55-03/S0273-0979-2018-01617-0/S0273-0979-2018-01617-0.pdf',
 goresky:'https://www.math.ias.edu/~goresky/MathPubl.html',
 characters:'https://kconrad.math.uconn.edu/blurbs/gradnumthy/Gauss-Jacobi-sums.pdf',
 deligne:'https://www.numdam.org/item/PMIHES_1974__43__273_0/',
 grothendieck:'https://www.numdam.org/item/SB_1964-1966__9__41_0/'
};
export const weilWorks=[
 {id:'weil-1949',authors:['weil'],year:1949,language:'English',companionReader:true,
 title:'Numbers of solutions of equations in finite fields',originalTitle:'Numbers of solutions of equations in finite fields',
 doi:'10.1090/S0002-9904-1949-09219-4',publication:'Bulletin of the American Mathematical Society 55, no. 5 (May 1949), pp. 497–508. Received 2 October 1948.',
 summary:'Diagonal equations, character sums, counts over field extensions, and the conjectures connecting arithmetic with topology. Original English source with an editorial reading guide and a separate pane for authored commentary.',
 citationChecked:'30 October 2026',links:[{label:'Original English · AMS record',url:weilSources.original},{label:'Original printing · university-hosted scan',url:weilSources.scan},{label:'Goresky’s commentary · 2018',url:weilSources.commentary}]},
 {id:'goresky-2018',authors:['goresky'],year:2018,language:'English',
 title:'Commentary on “Numbers of solutions of equations in finite fields” by André Weil',originalTitle:'Commentary on “Numbers of solutions of equations in finite fields” by André Weil',
 doi:'10.1090/bull/1617',publication:'Bulletin of the American Mathematical Society (New Series) 55, no. 3 (2018), pp. 327–329.',
 summary:'An authored commentary on Weil’s 1949 paper. Recorded as a whole-work companion in the separate commentary pane. Its full text is linked through the publisher and has not been transcribed here.',
 citationChecked:'30 October 2026',links:[{label:'Publisher’s essay',url:weilSources.commentary},{label:'Author’s publication list · 2018 entry',url:weilSources.goresky},{label:'Read alongside Weil',url:'https://liuyao12.github.io/math-expo/papers/weil-1949/?commentary=goresky-2018#reading'}]}
];
export const weilPeople=[
 {id:'weil',name:'André Weil',source:weilSources.original,note:'The selected 1949 paper studies diagonal equations over finite fields and proposes a connection between point counts and topology. Distinct from Hermann Weyl.'},
 {id:'goresky',name:'Mark Goresky',source:weilSources.goresky,note:'Author of the 2018 commentary on Weil’s finite-field paper. His essay is kept separate from the collection’s passage notes.'},
 {id:'grothendieck',name:'Alexander Grothendieck',source:weilSources.grothendieck,note:'The later work linked here develops the cohomological setting for finite-field zeta functions.',bibliography:[{title:'Formule de Lefschetz et rationalité des fonctions L · 1966',url:weilSources.grothendieck}]},
 {id:'deligne',name:'Pierre Deligne',source:weilSources.deligne,note:'The 1974 paper linked here proves the finite-field Riemann hypothesis in the smooth projective setting.',bibliography:[{title:'La conjecture de Weil : I · 1974',url:weilSources.deligne}]}
];
export const weilBibliography={
 'weil-1949':{type:'article',journal:'Bulletin of the American Mathematical Society',volume:'55',number:'5',pages:'497--508',month:'May'},
 'goresky-2018':{type:'article',journal:'Bulletin of the American Mathematical Society (New Series)',volume:'55',number:'3',pages:'327--329'}
};
export const weilCitations=[{from:'goresky-2018',to:'weil-1949',url:weilSources.goresky,locator:'Author’s publication list · 2018 entry and full essay title',evidence:'The title explicitly identifies Weil’s Numbers of Solutions of Equations in Finite Fields as the work being commented on. The essay body was not retrieved during this source check.'}];
export const weilTerms={
 'weil-1949':['Weil conjectures','finite fields','diagonal equations','Gauss sums','Jacobi sums','point counting','zeta functions','Frobenius','arithmetic geometry','Betti numbers'],
 'goresky-2018':['Weil conjectures','authored commentary','finite fields','arithmetic geometry','topology','cohomology']
};
export const weilConcepts=[
 {id:'diagonal-weil-1949',anchor:'weil-equations',title:'The diagonal equations considered in 1949',kind:'Specified finite-field counting problem',body:m`<p>The initial problem has the form \(\sum_{i=0}^{r}a_i x_i^{n_i}=b\) over a finite field \(k\), with nonzero coefficients and positive integer exponents. The variables range independently over \(k\). The paper first takes \(b=0\).</p>`,comparison:'This is a particular family of polynomial equations. The later conjectural discussion has a broader geometric scope; it is not a proof for arbitrary equations.'},
 {id:'characters-weil-1949',anchor:'weil-characters',title:'Multiplicative characters and the value at zero',kind:'Character convention in the point-counting calculation',body:m`<p>A multiplicative character on \(k^*\) takes values in complex roots of unity. Weil extends nontrivial characters by zero at \(0\), and the trivial character by \(1\) there. This convention lets a character sum count the roots of \(x^n=u\), including \(u=0\).</p>`,comparison:'Some modern accounts extend even the trivial multiplicative character by zero. Their formulas must be adjusted before they are used in this calculation.'},
 {id:'zeta-weil-1949',anchor:'weil-zeta',title:'Point counts over all finite extensions',kind:'Formal power series and the smooth projective comparison',body:m`<p>For a fixed variety over \(\mathbf F_q\), write \(N_m\) for its number of points over \(\mathbf F_{q^m}\). The normalized zeta series is \(Z(T)=\exp(\sum_{m\ge1}N_m T^m/m)\). Thus \(Z(0)=1\) and \(T Z'(T)/Z(T)=\sum_{m\ge1}N_mT^m\).</p>`,comparison:'The cohomological factorization and the usual absolute-value statements discussed in the guide are stated for smooth projective varieties. An affine curve and its projective completion have different point counts and different zeta functions.'}
].map(c=>({...c,work:'weil-1949',sourceEdition:{url:weilSources.scan,label:'Original English printing · 1949'}}));
// The eight groups in the original bibliography are preserved as external
// records; they do not create unverified work-to-work citation edges.
export const weilExternalReferences=[
 ['Carl Friedrich Gauss','Werke · cited volumes I, II, and X, part 1','Vol. I, pp. 445–449; vol. II, pp. 67–92; vol. X, part 1, p. 571.'],
 ['Carl Gustav Jacob Jacobi','Gesammelte Werke · cited volumes VII and VI','Vol. VII, pp. 393–400; vol. VI, pp. 254–274.'],
 ['Victor-Amédée Lebesgue','Two papers cited in the bibliography','Journal de Mathématiques Pures et Appliquées 2 (1837), pp. 253–292; 3 (1838), pp. 113–144.'],
 ['G. H. Hardy and J. E. Littlewood','Paper cited in bibliography, item 4','Mathematische Zeitschrift 12 (1922), pp. 161–188.'],
 ['H. Davenport and H. Hasse','Paper cited in bibliography, item 5','Journal für die reine und angewandte Mathematik 172 (1935), pp. 151–182.'],
 ['L. K. Hua and H. S. Vandiver','Paper cited in bibliography, item 6','Proceedings of the National Academy of Sciences USA 34 (1948), pp. 258–263.'],
 ['L. Stickelberger','Paper cited in bibliography, item 7','Mathematische Annalen 37 (1890), pp. 321–367.'],
 ['Charles Ehresmann','Paper cited in bibliography, item 8','Annals of Mathematics 35 (1934), pp. 396–443.']
].map(([author,title,publication],i)=>({author,title,publication,url:weilSources.scan+'#page=12',sourceUrl:weilSources.scan+'#page=12',locator:'Printed p. 508 · bibliography, item '+(i+1),evidence:'Bibliographic coordinates transcribed from the original’s numbered bibliography; abbreviated entries have not been expanded into guessed article titles.'}));
