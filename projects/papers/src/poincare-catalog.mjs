const translation='https://webhomes.maths.ed.ac.uk/~v1ranick/papers/poincare2009.pdf';
const archive='https://henripoincarepapers.univ-nantes.fr/en/bibliohp/';
const companion='https://analysis-situs.math.cnrs.fr/';
const records=[
 {id:'poincare-1892',year:1892,title:'On analysis situs',originalTitle:'Sur l’Analysis Situs',
  journal:'Comptes rendus hebdomadaires des séances de l’Académie des sciences',volume:'115',pages:'633--636',
  source:companion+'Sur-l-Analysis-Situs-1892.html',original:archive+'?a=on&action=go&yr=1892',page:19,
  summary:'The preliminary announcement: monodromy, a group attached to a manifold, and explicit three-dimensional examples with the same Betti numbers. Complete modern-English reading with corrections and worked examples.',
  edition:'Complete note · 1892'},
 {id:'poincare-1895',year:1895,title:'Analysis situs',originalTitle:'Analysis situs',
  journal:'Journal de l’École polytechnique',series:'2',volume:'1',pages:'1--121',edition:'Complete memoir · 1895',
  source:companion+'-Analysis-Situs-42-.html',original:'https://gallica.bnf.fr/ark:/12148/bpt6k4337198/f7',page:22,
  summary:'The complete 1895 memoir in modern English: manifolds, homologies, intersection, the fundamental group, explicit polyhedral quotients, and the Euler formula. Drawings and scoped proofs mark torsion, filling, quotient, and subdivision gaps.'},
 {id:'poincare-1899',year:1899,title:'First supplement to Analysis situs',originalTitle:'Complément à l’Analysis situs',
  journal:'Rendiconti del Circolo Matematico di Palermo',volume:'13',pages:'285--343',doi:'10.1007/BF03024461',edition:'Complete first supplement · 1899',
  source:companion+'-Premier-complement-a-l-Analysis-Situs-.html',original:'https://henripoincarepapers.univ-nantes.fr/chp/hp-pdf/hp1899rc.pdf',page:104,
  summary:'Heegaard’s objection, revised Betti numbers, incidence tables, subdivisions, and reciprocal polyhedra. The complete eleven-section reading in modern English, with drawings, scoped proofs, and explicit corrections.'},
 {id:'poincare-1900',year:1900,title:'Second supplement to Analysis situs',originalTitle:'Second complément à l’Analysis Situs',
  journal:'Proceedings of the London Mathematical Society',volume:'32',series:'1',pages:'277--308',doi:'10.1112/plms/s1-32.1.277',
  source:companion+'-Deuxieme-complement-a-l-Analysis-Situs-.html',original:'https://doi.org/10.1112/plms/s1-32.1.277',page:145,
  summary:'Integer reduction of incidence tables, torsion coefficients, worked three-dimensional examples, and the refinement of duality. Introduction and six sections.'},
 {id:'poincare-1902-surfaces',year:1902,title:'On certain algebraic surfaces · Third supplement to Analysis situs',originalTitle:'Sur certaines surfaces algébriques. Troisième complément à l’« Analysis sitûs »',
  journal:'Bulletin de la Société Mathématique de France',volume:'30',pages:'49--70',doi:'10.24033/bsmf.657',
  source:companion+'-Sur-certaines-surfaces-algebriques-Troisieme-complement-a-l-Analysis-Situs-.html',original:'https://www.numdam.org/item/BSMF_1902__30__49_0/',page:174,
  summary:'The fundamental group of the particular algebraic double covers described in the paper, studied through branched curves and their monodromy. Hypotheses on singularities must remain explicit.'},
 {id:'poincare-1902-cycles',year:1902,title:'On cycles of algebraic surfaces · Fourth supplement to Analysis situs',originalTitle:'Sur les cycles des surfaces algébriques. Quatrième complément à l’Analysis Situs',
  journal:'Journal de Mathématiques Pures et Appliquées',volume:'8',series:'5',pages:'169--214',
  source:companion+'-Sur-les-cycles-des-surfaces-algebriques-Quatrieme-complement-a-l-Analysis-Situs-.html',original:'https://www.numdam.org/item/JMPA_1902_5_8__169_0/',page:191,
  summary:'Three-, two-, and one-dimensional cycles on algebraic surfaces, with Picard’s transformations and singular members of a family. Five sections; complex surfaces have real dimension four.'},
 {id:'poincare-1904',year:1904,title:'Fifth supplement to Analysis situs',originalTitle:'Cinquième complément à l’Analysis situs',
  journal:'Rendiconti del Circolo Matematico di Palermo',volume:'18',pages:'45--110',doi:'10.1007/BF03014091',
  source:companion+'-Cinquieme-complement-.html',original:'https://doi.org/10.1007/BF03014091',page:224,
  summary:'Closed curves on surfaces, three-dimensional manifolds, the homology sphere, and the final question about simple connectivity. Six sections distinguishing homology data from the fundamental group.'},
];

export const poincareSeries=records.map(r=>({id:r.id,title:r.title,year:r.year}));
export const worksPoincare=records.map(r=>({id:r.id,authors:['poincare'],year:r.year,title:r.title,originalTitle:r.originalTitle,
 language:'French',...(r.edition?{edition:r.edition}:{}),...(r.doi?{doi:r.doi}:{}),series:'poincare-analysis-situs',
 publication:`${r.journal}${r.series?', series '+r.series:''} ${r.volume} (${r.year}), pp. ${r.pages.replace('--','–')}.`,summary:r.summary,
 links:[{label:'Original publication / archive',url:r.original},{label:'French text & commentary · Analysis Situs',url:r.source},{label:'English translation · John Stillwell · 2009 manuscript',url:translation+'#page='+r.page}]}));
export const bibliographyPoincare=Object.fromEntries(records.map(r=>[r.id,{type:'article',journal:r.journal,volume:r.volume,pages:r.pages,...(r.series?{series:r.series}:{})}]));
export const englishPoincare=Object.fromEntries(records.map(r=>[r.id,{status:'inspected',translator:'John Stillwell',year:2009,dateLabel:'2009 manuscript · book published 2010',format:'PDF',
 url:translation+'#page='+r.page,evidenceUrl:translation+'#page=1',checked:'2026-10-22',
 scope:`Complete ${r.id==='poincare-1892'?'preliminary note':r.id==='poincare-1895'?'memoir':'supplement'} within Papers on Topology: Analysis Situs and Its Five Supplements. Begins on PDF page ${r.page}.`,
 note:'The linked file is dated 31 July 2009. Its title page credits John Stillwell; its contents include this work. The published AMS/LMS volume appeared in 2010. PDF page numbers here refer to the linked manuscript, not the book. This translation is linked for comparison, not reproduced.'}]));
export const peoplePoincare=[
 {id:'poincare',name:'Henri Poincaré',note:'The topology sequence recorded here comprises the preliminary 1892 note, Analysis situs, and its five supplements. Each has its own source record; later revisions are kept distinct from earlier claims.',source:archive,bibliography:[{title:'Complete bibliography · Henri Poincaré Papers',url:archive},{title:'Papers on Topology · Stillwell’s English translation (2010 publication record)',url:'https://research.monash.edu/en/publications/papers-on-topology-analysis-situs-and-its-five-supplements/'}]},
 {id:'betti',name:'Enrico Betti',note:'Named in Poincaré’s 1892 announcement for work extending connectivity numbers beyond surfaces. The note identifies an Annali di Matematica volume; a work record has not yet been collated.',source:companion+'Sur-l-Analysis-Situs-1892.html'},
 {id:'picard',name:'Émile Picard',note:'Named in the 1892 announcement for applications to algebraic surfaces, and in the later supplements. No particular work is inferred from a name alone.',source:companion+'Sur-l-Analysis-Situs-1892.html'},
];
export const citationsPoincare=[
 {from:'poincare-1899',to:'poincare-1895',locator:'§I, opening paragraph',anchor:'p99-1a',url:companion+'pI-Introduction.html',evidence:'Poincaré names Analysis situs, identifies the Journal de l’École polytechnique centenary volume, and specifies that later short references point to that memoir.'},
 ...['poincare-1895','poincare-1899'].map(to=>({from:'poincare-1900',to,locator:'Introduction, first and last paragraphs',url:companion+'Introduction-155.html',evidence:'The introduction identifies both earlier memoirs by title and journal, then distinguishes references to the original memoir from those prefixed c for the first supplement.'})),
 ...['poincare-1895','poincare-1899','poincare-1900','poincare-1902-surfaces','poincare-1902-cycles'].map(to=>({from:'poincare-1904',to,locator:'§1, opening paragraph',url:companion+'p1-du-cinquieme-complement.html',evidence:'The opening explicitly identifies the original memoir and four supplements by their journals. Its stated years for the third and fourth supplements are 1901; their verified publication records give 1902. The citation endpoints follow those publication records.'})),
];
export const discoveryPoincare={
 'poincare-1892':['Analysis situs','algebraic topology','fundamental group','monodromy','Betti numbers','torus bundles','mapping torus'],
 'poincare-1895':['Analysis situs','algebraic topology','fundamental group','homology','Betti numbers','Poincare duality','Euler characteristic','manifolds','orientability','signed intersection','polyhedral quotients','torus bundles','mapping torus','quaternion group','Q8','integral homology','torsion','symmetric square','real projective plane','complex projective plane'],
 'poincare-1899':['Analysis situs','first supplement','Heegaard','polyhedral homology','incidence matrices','dual cell decomposition','Poincare duality','triangulation'],
 'poincare-1900':['Analysis situs','second supplement','torsion coefficients','integer homology','Smith normal form','Poincare duality'],
 'poincare-1902-surfaces':['Analysis situs','third supplement','algebraic surfaces','branched double covers','fundamental group','monodromy'],
 'poincare-1902-cycles':['Analysis situs','fourth supplement','algebraic surfaces','vanishing cycles','Picard group','monodromy','Betti numbers'],
 'poincare-1904':['Analysis situs','fifth supplement','Poincare homology sphere','Poincare conjecture','Heegaard splitting','three manifolds','Morse theory','fundamental group'],
};

const m=String.raw;
export const conceptsPoincare=[
 {id:'quotient-poincare-1892',work:'poincare-1892',title:'The affine quotient in the 1892 note',kind:'Author’s explicit family · hypotheses supplied',anchor:'p92-transformations',sourceEdition:{url:companion+'Sur-l-Analysis-Situs-1892.html',label:'French preliminary note'},
  body:m`<p>For the integer matrix \(A=\begin{pmatrix}\alpha&\beta\\\gamma&\delta\end{pmatrix}\) with \(\det A=1\), Poincaré generates a group from two unit translations and \((q,z)\mapsto(Aq,z+1)\). Its elements are</p>\[(q,z)\mapsto(A^kq+m,z+k),\qquad k\in\mathbb Z,\quad m\in\mathbb Z^2.\]<p>The quotient of \(\mathbb R^2\times\mathbb R\) by this action is the particular compact three-dimensional manifold used in the reading. The linked proof establishes freeness, proper discontinuity, and compactness.</p>`,
  comparison:m`This is an affine torus-bundle family, not a definition of all manifolds. Invariant coordinates in four-dimensional space are a separate claim and are not assumed in constructing the quotient.`},
 {id:'betti-poincare-1892',work:'poincare-1892',title:'Betti numbers for the explicit torus quotients',kind:'Historical convention · editorial correction',anchor:'p92-table',sourceEdition:{url:companion+'Sur-l-Analysis-Situs-1892.html',label:'French preliminary note'},
  body:m`<p>For the particular quotient \(M_A\) constructed in the note, modern rational Betti numbers mean \(b_j=\dim_{\mathbb Q}H_j(M_A;\mathbb Q)\). The worked reconstruction gives</p>\[b_1=b_2=1+\dim_{\mathbb Q}\ker(A-I),\qquad b_0=b_3=1.\]<p>The dimension of the kernel is zero, one, or two according as the trace is not two, the trace is two but the matrix is not the identity, or the matrix is the identity.</p>`,
  comparison:m`The historical connectivity labels are preserved in the main text. Under the later convention shifted by one, the two variable numbers are both double, triple, or quadruple in these respective cases. The printed assertion that one is always quadruple is not used. Rational ranks do not record finite torsion in integral homology.`},
];

englishPoincare['poincare-1895'].checked='2026-10-24';
englishPoincare['poincare-1895'].note+=' Credits and memoir boundaries rechecked for the 1895 on-site reading. The French transcription, rather than this translation, is the rendering’s basis.';

englishPoincare['poincare-1899'].checked='2026-10-25';
englishPoincare['poincare-1899'].note+=' Title credit and extent rechecked: PDF pages 104–144. The on-site reading is independently rendered from the French.';
worksPoincare.find(w=>w.id==='poincare-1899').links.push({label:'Original publication · DOI',url:'https://doi.org/10.1007/BF03024461'});
