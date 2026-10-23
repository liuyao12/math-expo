// Original-work dates identify routes. Translation and online revision dates
// describe the linked English edition; neither implies an edition by us.
export const additionalWorks = [
  {id:'monks-2019',authors:['monks'],year:2019,title:'Euler’s calculation of the sum of the reciprocals of the squares: a mini-primary source project for Calculus 2 students',originalTitle:'Euler’s Calculation of the Sum of the Reciprocals of the Squares: A Mini-Primary Source Project for Calculus 2 Students',language:'English',
    publication:'Convergence, August 2019. DOI: 10.4169/convergence20190801.',doi:'10.4169/convergence20190801',
    summary:'A primary-source teaching project for Calculus 2 students, developing the reciprocal-square sum through Euler’s calculation.',
    links:[{label:'Article & references · Mathematical Association of America',url:'https://old.maa.org/node/1880109'}]},
  {id:'euler-1740',authors:['euler'],year:1740,title:'On the sums of series of reciprocals',originalTitle:'De summis serierum reciprocarum',language:'Latin',
    publication:'Commentarii academiae scientiarum Petropolitanae 7 (1740), pp. 123–134. Written in 1735. Eneström E41.',
    edition:'Complete reading · §§1–19',
    summary:'Reciprocal powers, arcs with a given sine, and the circle constant. A full modern-English reading with proofs of the sine products and coefficient calculations.',
    links:[{label:'Original work & publication record · Euler Archive',url:'https://scholarlycommons.pacific.edu/euler-works/41/'},{label:'Latin text · PDF p. 10',url:'https://kirkmcd.princeton.edu/17centurymaths/contents/euler/e041tr.pdf#page=10'},{label:'English translation · Ian Bruce',url:'https://kirkmcd.princeton.edu/17centurymaths/contents/euler/e041tr.pdf'}]},
  {id:'euler-1741',authors:['euler'],year:1741,title:'A solution to a problem in the geometry of position',originalTitle:'Solutio problematis ad geometriam situs pertinentis',language:'Latin',
    publication:'Commentarii academiae scientiarum Petropolitanae 8 (1741), pp. 128–140. Archive composition date: 1735. Eneström E53.',
    edition:'Complete paper · §§1–21',
    summary:'The Königsberg crossing question, region words, odd and even bridge counts, and a fifteen-bridge worked journey. Complete modern-English reading with the original labels, seven drawings, and scoped proofs.',
    links:[{label:'Original Latin · 1741',url:'https://math.dartmouth.edu/~euler/docs/originals/E053.pdf'},{label:'Original plate · PDF page 2',url:'https://math.dartmouth.edu/~euler/docs/originals/E053.pdf#page=2'},{label:'Publication record & English translation lead · Euler Archive',url:'https://scholarlycommons.pacific.edu/euler-works/53/'}]},
  {id:'euler-1761',authors:['euler'],year:1761,title:'Theorems on residues obtained by the division of powers',originalTitle:'Theoremata circa residua ex divisione potestatum relicta',language:'Latin',
    publication:'Novi Commentarii academiae scientiarum Petropolitanae 7 (1761), pp. 49–82. Presented in 1755. Eneström E262.',
    summary:'Powers and their remainders for a prime modulus, including a proof of Fermat’s theorem. The original cases should precede any abstract group-theoretic extension.',
    links:[{label:'Original work & publication record · Euler Archive',url:'https://scholarlycommons.pacific.edu/euler-works/262/'}]},
  {id:'dedekind-1872',authors:['dedekind'],year:1872,title:'Continuity and irrational numbers',originalTitle:'Stetigkeit und irrationale Zahlen',language:'German',
    publication:'Braunschweig: Friedrich Vieweg und Sohn, 1872. A separately published essay.',
    edition:'Complete essay · Sections I–VII',
    summary:'Rational cuts, irrational numbers, and the completeness needed for limits. Complete text with commentary, drawings, and scoped proofs.',
    links:[{label:'Original edition · ETH / e-rara',url:'https://doi.org/10.3931/e-rara-71757'}]},
  {id:'dedekind-1888',authors:['dedekind'],year:1888,title:'The nature and meaning of numbers',originalTitle:'Was sind und was sollen die Zahlen?',language:'German',
    publication:'Braunschweig: Friedrich Vieweg und Sohn, 1888. A separately published foundational essay.',
    edition:'Complete essay · §§1–172',
    summary:'Systems, transformations, chains, and the positive natural numbers. All 172 numbered paragraphs, with commentary on the definitions and foundational assumptions.',
    links:[{label:'Original first edition · ETH / e-rara',url:'https://doi.org/10.3931/e-rara-71758'}]},
  {id:'hilbert-1900',authors:['hilbert'],year:1900,title:'Mathematical problems',originalTitle:'Mathematische Probleme',language:'German',
    publication:'Nachrichten von der Königlichen Gesellschaft der Wissenschaften zu Göttingen, Mathematisch-physikalische Klasse (1900), pp. 253–297. Paris ICM address, 1900.',
    summary:'Hilbert’s problem list, in the authorized English translation published in 1902. The historical formulations need to be distinguished from later reformulations and solutions.',
    links:[{label:'English edition & publication history · Clark University',url:'https://math.clarku.edu/~djoyce/hilbert/problems.html'},{label:'English edition · Project Gutenberg',url:'https://www.gutenberg.org/ebooks/71655'}]},
  {id:'noether-1918',authors:['noether'],year:1918,title:'Invariant variation problems',originalTitle:'Invariante Variationsprobleme',language:'German',
    publication:'Nachrichten von der Königlichen Gesellschaft der Wissenschaften zu Göttingen, Mathematisch-physikalische Klasse (1918), pp. 235–257.',
    summary:'Continuous transformation groups and variational identities. Tavel’s translation offers a starting point for reconstructing the paper’s exact hypotheses and its two theorems.',
    links:[{label:'Translation record & original publication details · arXiv',url:'https://arxiv.org/abs/physics/0503066'}]},
];

export const additionalPeople = [
  {id:'monks',name:'Kenneth M. Monks',note:'Author of the 2019 Convergence teaching project on the reciprocal-square sum for Calculus 2 students.',source:'https://old.maa.org/node/1880109'},
  {id:'leibniz',name:'Gottfried Wilhelm Leibniz',note:'Euler names Leibniz in §10 of the reciprocal-series paper, when recovering the alternating odd-reciprocal series for the circle constant. No particular Leibniz work is identified in that passage.',source:'https://kirkmcd.princeton.edu/17centurymaths/contents/euler/e041tr.pdf#page=13'},
  {id:'newton',name:'Isaac Newton',note:'Euler names Newton in §14 of the reciprocal-series paper in connection with a signed odd-reciprocal series. The coefficient identities in §8 are labelled Newton identities editorially; Euler gives no work citation there.',source:'https://kirkmcd.princeton.edu/17centurymaths/contents/euler/e041tr.pdf#page=14'},
  {id:'dedekind',name:'Richard Dedekind',note:'Author of the two foundational essays recorded here. English translations by Wooster Woodruff Beman appeared together in Essays on the Theory of Numbers (1901).',source:'https://www.gutenberg.org/ebooks/21016'},
  {id:'hilbert',name:'David Hilbert',note:'His 1900 address is available in the authorized English translation by Mary Frances Winston Newson, published in 1902. The work record separates those two dates.',source:'https://www.gutenberg.org/ebooks/71655'},
  {id:'noether',name:'Emmy Noether',note:'Author of Invariant Variation Problems (1918). M. A. Tavel is credited as translator of the English edition, rather than as a coauthor of the original work.',source:'https://arxiv.org/abs/physics/0503066'},
];

export const additionalBibliographicFields = {
  'monks-2019':{type:'article',journal:'Convergence',month:'August'},
  'euler-1740':{type:'article',journal:'Commentarii academiae scientiarum Petropolitanae',volume:'7',pages:'123--134',note:'Eneström E41; written in 1735'},
  'euler-1741':{type:'article',journal:'Commentarii academiae scientiarum Petropolitanae',volume:'8',pages:'128--140',note:'Eneström E53; archive composition date 1735'},
  'euler-1761':{type:'article',journal:'Novi Commentarii academiae scientiarum Petropolitanae',volume:'7',pages:'49--82',note:'Eneström E262; presented in 1755'},
  'dedekind-1872':{type:'book',publisher:'Friedrich Vieweg und Sohn',address:'Braunschweig'},
  'dedekind-1888':{type:'book',publisher:'Friedrich Vieweg und Sohn',address:'Braunschweig'},
  'hilbert-1900':{type:'article',journal:'Nachrichten von der Königlichen Gesellschaft der Wissenschaften zu Göttingen, Mathematisch-physikalische Klasse',pages:'253--297'},
  'noether-1918':{type:'article',journal:'Nachrichten von der Königlichen Gesellschaft der Wissenschaften zu Göttingen, Mathematisch-physikalische Klasse',pages:'235--257'},
};

// "inspected" means the English text and credit were checked. It does not mean
// a translation was collated against the original or all its mathematics checked.
export const englishSources = {
  'euler-1740':{status:'inspected',translator:'Ian Bruce',dateLabel:'Translation undated',format:'PDF',url:'https://kirkmcd.princeton.edu/17centurymaths/contents/euler/e041tr.pdf',evidenceUrl:'https://kirkmcd.princeton.edu/17centurymaths/contents/euler/e041tr.pdf#page=1',scope:'Complete paper, with translator’s annotations.',note:'The opening page names Ian Bruce. The original work dates from 1735 and was published in 1740; neither is asserted to be the date of this translation.'},
  'euler-1741':{status:'listed',translator:null,dateLabel:'Translation credit and date not yet verified',format:'Archive listing',url:'https://scholarlycommons.pacific.edu/euler-works/53/',evidenceUrl:'https://scholarlycommons.pacific.edu/euler-works/53/',scope:'The archive lists E053tr.pdf as an additional file.',note:'The archive record is accessible, but its named translation download was unavailable in the 22 October 2026 check. Our on-site English reading is independently translated from the Latin; this external file remains an unverified sourcing lead.'},
  'euler-1744':{status:'listed',translator:null,dateLabel:'Translation credit and date not yet verified',format:'Archive listing',url:'https://scholarlycommons.pacific.edu/euler-works/72/',evidenceUrl:'https://scholarlycommons.pacific.edu/euler-works/72/',scope:'The archive explicitly lists E072en.pdf.',note:'An English file is listed by the archive. Its text and translator credit have not yet been inspected, so English access remains unverified.'},
  'euler-1761':{status:'inspected',translator:'Jordan Bell',year:2006,dateLabel:'2006 · revised 2007',format:'PDF',url:'https://arxiv.org/pdf/math/0608467v2',evidenceUrl:'https://arxiv.org/abs/math/0608467',scope:'Complete paper; English PDF, 27 pages.',note:'The opening footnote identifies Jordan Bell and dates the translation 18 August 2006. The linked revision is the 2007 version.'},
  'gauss-1828':{status:'inspected',translator:'James Caddall Morehead and Adam Miller Hiltebeitel',year:1902,dateLabel:'1902',format:'PDF',url:'https://www.gutenberg.org/files/36856/36856-pdf.pdf',evidenceUrl:'https://www.gutenberg.org/ebooks/36856',scope:'Complete 1827/1828 paper in a volume also containing its abstract, notes, and an earlier fragment.',note:'The volume’s title mentions both 1827 and 1825. The work record here identifies the paper presented in 1827 and printed in 1828.'},
  'fourier-1822':{status:'inspected',translator:'Alexander Freeman',year:1878,dateLabel:'1878',format:'Digitized book',url:'https://archive.org/details/analyticaltheory00fourrich',evidenceUrl:'https://www.cambridge.org/core/books/the-analytical-theory-of-heat/F6D4802336FABD1116DDA4AA3FE6EFAA',scope:'Complete book-length translation, with notes; read online or download from Internet Archive.',note:'The title page identifies Freeman and the 1878 Cambridge edition. The linked scan is contributed by the University of California Libraries. This is a book, retained as a source work alongside the papers.'},
  'dirichlet-1837':{status:'inspected',translator:'Ralf Stephan',year:2008,dateLabel:'2008 · corrected 2014',format:'PDF',url:'https://arxiv.org/pdf/0808.1408v2',evidenceUrl:'https://arxiv.org/abs/0808.1408',scope:'Complete paper; 22-page English PDF with an added reference section.',note:'The arXiv record credits R. Stephan. Its 2014 revision corrects typographical errors. Our original page range follows the German scan, pp. 45–71; the translation’s opening footnote appears to misprint it as pp. 45–81.'},
  'riemann-1854':{status:'inspected',translator:'William Kingdon Clifford',year:1873,dateLabel:'1873',format:'HTML',url:'https://www.maths.tcd.ie/pub/HistMath/People/Riemann/Geom/WKCGeom.html',evidenceUrl:'https://www.maths.tcd.ie/pub/HistMath/People/Riemann/Geom/',scope:'Complete lecture in the historical English translation.',note:'Our modern-English reading sample covers the introduction and part II, §1. The linked Clifford text contains the intervening and remaining sections.'},
  'riemann-1859':{status:'inspected',translator:'David R. Wilkins',year:1998,dateLabel:'1998',format:'PDF',url:'https://www.claymath.org/wp-content/uploads/2023/04/Wilkins-translation.pdf',evidenceUrl:'https://www.claymath.org/collections/riemanns-1859-manuscript/',scope:'Complete paper in an existing English translation.',note:'Our modern-English edition is a separate rendering from the German. This source gives readers an independent English translation to compare.'},
  'dedekind-1872':{status:'inspected',readingBasis:true,translator:'Wooster Woodruff Beman',year:1901,dateLabel:'1901',format:'PDF',url:'https://www.gutenberg.org/files/21016/21016-pdf.pdf#page=6',evidenceUrl:'https://www.gutenberg.org/ebooks/21016',scope:'First essay in Essays on the Theory of Numbers. In this digital PDF it begins on PDF page 6.',note:'The English title page credits Beman and the 1901 edition. The two essays share one downloadable volume; its digital pagination differs from the original print.'},
  'dedekind-1888':{status:'inspected',readingBasis:true,translator:'Wooster Woodruff Beman',year:1901,dateLabel:'1901',format:'PDF',url:'https://www.gutenberg.org/files/21016/21016-pdf.pdf#page=19',evidenceUrl:'https://www.gutenberg.org/ebooks/21016',scope:'Second essay in Essays on the Theory of Numbers. Its first-edition preface begins on PDF page 19.',note:'The German first edition is dated 1888. Beman’s 1901 English volume retains the essay’s numbered definitions and propositions.'},
  'hilbert-1900':{status:'inspected',translator:'Mary Frances Winston Newson',year:1902,dateLabel:'1902',format:'HTML',url:'https://www.gutenberg.org/cache/epub/71655/pg71655-images.html',evidenceUrl:'https://www.gutenberg.org/ebooks/71655',scope:'Complete English text of the published problem address.',note:'Authorized translation in Bulletin of the American Mathematical Society 8 (1902), pp. 437–479. The original address and German publication date from 1900.'},
  'noether-1918':{status:'inspected',translator:'M. A. Tavel',year:1971,dateLabel:'1971 · corrected online version 2018',format:'PDF',url:'https://arxiv.org/pdf/physics/0503066v3',evidenceUrl:'https://arxiv.org/abs/physics/0503066',scope:'Complete English translation; the linked online version incorporates corrigenda.',note:'The PDF identifies the original English publication as Transport Theory and Statistical Physics 1 (3), pp. 183–207 (1971). Tavel is the translator; Noether is the author of the 1918 work.'},
};

for(const source of Object.values(englishSources))source.checked='2026-10-21';
englishSources['euler-1741'].checked='2026-10-22';

export const additionalCitations = [
  {from:'monks-2019',to:'euler-1740',locator:'References · Euler, Leonhard. 1740',url:'https://old.maa.org/node/1880109',evidence:'The article’s reference list names De summis serierum reciprocarum, gives 1740, Commentarii volume 7, and pp. 123–134. The body explicitly identifies the primary source as E41.'},
  {from:'dedekind-1888',to:'dedekind-1872',anchor:'d88-preface-first-1',locator:'First-edition preface, footnote 5 · digital PDF p. 19',url:'https://www.gutenberg.org/files/21016/21016-pdf.pdf#page=19',evidence:'Dedekind identifies his earlier Continuity and Irrational Numbers, gives Braunschweig and 1872, and refers to section III. Checked in Beman’s English translation.'},
  {from:'hilbert-1900',to:'riemann-1859',locator:'Problem 8, opening paragraph',url:'https://math.clarku.edu/~djoyce/hilbert/problems.html',evidence:'Hilbert explicitly names Riemann’s prime-counting paper by its German title. Checked in Newson’s English translation.'},
];
