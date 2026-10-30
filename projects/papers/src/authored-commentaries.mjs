// Access describes the linked source, not a license to republish its text.
// These are companion relationships, not inferred citation-index edges.
export const authoredCommentaries=[
 {id:'goresky-2018',works:['weil-1949'],author:'Mark Goresky',year:2018,
  title:'Commentary on “Numbers of solutions of equations in finite fields” by André Weil',
  publication:'Bulletin of the AMS 55 (2018), pp. 327–329',kind:'Essay',access:'Publisher-hosted article',
  url:'https://doi.org/10.1090/bull/1617',document:'https://www.ams.org/journals/bull/2018-55-03/S0273-0979-2018-01617-0/S0273-0979-2018-01617-0.pdf',
  scope:'An essay on Weil’s 1949 paper, presented independently of our passage notes.',
  evidence:'https://www.math.ias.edu/~goresky/MathPubl.html',verification:'Publication and attribution verified. The publisher blocked automated retrieval of the essay body.'},
 {id:'kosmann-schwarzbach-2018',works:['noether-1918'],author:'Yvette Kosmann-Schwarzbach',year:2018,
  title:'In Noether’s Words: Invariant Variational Problems',publication:'IAMP News Bulletin, October 2018, pp. 5–9',kind:'Essay',access:'Free publisher PDF',
  url:'https://www.iamp.org/bulletins/old-bulletins/Bulletin-October2018-print.pdf#page=5',document:'https://www.iamp.org/bulletins/old-bulletins/Bulletin-October2018-print.pdf#page=5',
  scope:'A short centenary essay on the origins of Noether’s paper and its two theorems. The linked issue contains other articles after page 9.',
  evidence:'https://www.iamp.org/bulletins/old-bulletins/Bulletin-October2018-print.pdf#page=5',verification:'Byline, title, and printed pages checked in the publisher’s issue.'},
 {id:'dombrowski-1979',works:['gauss-1828'],author:'Peter Dombrowski',year:1979,
  title:'150 Years after Gauss’ “Disquisitiones generales circa superficies curvas”',publication:'Astérisque 62 (1979)',kind:'Commentary volume',access:'Free digitized volume',
  url:'https://www.numdam.org/item/AST_1979__62__R1_0/',document:'https://www.numdam.org/item/AST_1979__62__R1_0.pdf',
  scope:'A discussion of Gauss’s contents, presentation, and historical importance, in a volume also containing original texts. English translation of Dombrowski’s commentary by Michael Keane and David Trotman.',
  evidence:'https://smf.emath.fr/publications/150-years-after-gauss-disquisitiones-generales-circa-superficies-curvas-2e-edition',verification:'Scope, author, language, and translation credits verified against the SMF publisher record.'},
 {id:'stillwell-2010',works:['poincare-1892','poincare-1895','poincare-1899','poincare-1900','poincare-1902-surfaces','poincare-1902-cycles','poincare-1904'],author:'John Stillwell',year:2010,
  title:'Papers on Topology: Analysis Situs and Its Five Supplements',publication:'History of Mathematics 37, AMS / London Mathematical Society (2010)',kind:'Translation with commentary',access:'Publisher’s book record',
  url:'https://doi.org/10.1090/hmath/037',scope:'Stillwell’s commentary accompanies his translations of the topology papers. It is a companion to the sequence, rather than a separate essay on each supplement.',
  evidence:'https://doi.org/10.1090/hmath/037',verification:'Translation and commentary attribution verified against the AMS publisher description.'},
 {id:'hopkins-wilson-2004',works:['euler-1741'],author:'Brian Hopkins and Robin J. Wilson',year:2004,
  title:'The Truth about Königsberg',publication:'The College Mathematics Journal 35, no. 3 (2004), pp. 198–207',kind:'Article',access:'Publisher’s article record',
  url:'https://doi.org/10.1080/07468342.2004.11922073',scope:'A focused historical and mathematical companion to the Königsberg bridge problem.',
  evidence:'https://doi.org/10.1080/07468342.2004.11922073',verification:'Authors, title, original publication year, and pagination verified against the publisher record.'},
 {id:'bradley-2007',works:['euler-1751'],author:'Robert E. Bradley',year:2007,
  title:'Euler, D’Alembert and the Logarithm Function',publication:'In Leonhard Euler: Life, Work and Legacy (2007), pp. 255–277',kind:'Book chapter',access:'Publisher’s book record',
  url:'https://shop.elsevier.com/books/leonhard-euler/bradley/978-0-444-52728-8',scope:'A historical companion on the logarithm dispute, covering several texts and the correspondence rather than only Euler’s 1751 paper.',
  evidence:'https://www.adelphi.edu/Adelphi-Magazine/Adelphi-Magazine-Fall-2008.pdf',verification:'Chapter and author verified against the publisher contents; pagination corroborated by the author’s university publication report.'},
 {id:'jost-2016',works:['riemann-1854'],author:'Jürgen Jost',year:2016,
  title:'On the Hypotheses Which Lie at the Bases of Geometry',publication:'Classic Texts in the Sciences, Birkhäuser (2016)',kind:'Translation with commentary',access:'Publisher’s book record',
  url:'https://doi.org/10.1007/978-3-319-26042-6',scope:'A revised translation of the lecture accompanied by Jost’s mathematical, historical, and philosophical commentary. Riemann is the primary author; Jost is the editor and commentator.',
  evidence:'https://link.springer.com/book/10.1007/978-3-319-26042-6',verification:'Credits and scope verified against the publisher description.'},
 {id:'reck-dedekind',works:['dedekind-1872','dedekind-1888'],author:'Erich Reck',year:2025,
  title:'Dedekind’s Contributions to the Foundations of Mathematics',publication:'Stanford Encyclopedia of Philosophy; first published 2008, substantially revised 2025',kind:'Scholarly survey',access:'Free web essay',
  url:'https://plato.stanford.edu/entries/dedekind-foundations/',scope:'A broader survey of Dedekind’s foundational writings, including the two essays on continuity and numbers. It is not a line-by-line commentary.',
  evidence:'https://plato.stanford.edu/entries/dedekind-foundations/',verification:'Author, revision date, and scope verified in the encyclopedia entry.'}
].map(c=>({...c,checked:'2026-10-30',reuse:c.html?'Complete single article reproduced under the author’s express reuse permission; source URL credited.':'Linked external source; no full-text republication license established.'}));

export const commentariesFor=id=>authoredCommentaries.filter(c=>c.works.includes(id));


// Broader exposition is kept separate from a reading of a specific paper.
export const furtherReading=[ {id:'tao-2013',works:['riemann-1859','weil-1949'],author:'Terence Tao',year:2013,
  title:'The Riemann hypothesis in various settings',publication:'What’s new, 19 July 2013',kind:'Modern exposition',access:'Complete HTML article',html:'tao-2013.html',
  url:'https://terrytao.wordpress.com/2013/07/19/the-riemann-hypothesis-in-various-settings/',
  scope:'A broader modern exposition connecting zeta zeros, prime counting, and finite-field analogues. It goes beyond both historical papers and is not presented as their original scope.',
  evidence:'https://terrytao.wordpress.com/about/',verification:'Complete authored post extracted from the source, excluding reader comments and site widgets; all 866 formula images recovered as LaTeX. The author explicitly permits copying a single article with a source credit.',
  permission:'https://terrytao.wordpress.com/about/'}].map(c=>({...c,relation:'further-reading',checked:'2026-10-30',reuse:'Complete single article reproduced under the author’s express reuse permission; source URL credited.'}));
export const furtherReadingFor=id=>furtherReading.filter(c=>c.works.includes(id));
