import {attachTextCoverage} from './text-coverage.mjs';
import {representationWorks,representationPeople,representationBibliography,representationEnglish,representationCitations,conceptsLie1874} from './representation-catalog.mjs';
import {concepts1902,citations1902,externalReferences1902} from './poincare-1902-surfaces-catalog.mjs';
import {concepts1900} from './poincare-1900-catalog.mjs';
import {people1899,concepts1899,externalReferences1899} from './poincare-1899-catalog.mjs';
import {people1895,concepts1895,externalReferences1895} from './poincare-1895-catalog.mjs';
import {work1857,bibliography1857,english1857,people1857,weierstrass1857,concepts1857,citations1857} from './riemann-1857-catalog.mjs';
import {concepts1851,citations1851,externalReferences1851,english1851} from './riemann-1851-catalog.mjs';
import {worksPoincare,peoplePoincare,bibliographyPoincare,englishPoincare,citationsPoincare,conceptsPoincare} from './poincare-catalog.mjs';
import {peopleGauss,conceptsGauss} from './gauss-1828-catalog.mjs';
import {people1854,concepts1854,citations1854} from './riemann-1854-catalog.mjs';
import {additionalWorks,additionalPeople,additionalBibliographicFields,additionalCitations,englishSources} from './translation-sources.mjs';
export {englishSources};
import {conceptsEuler} from './concepts-euler-1740.mjs';
import {peopleDedekind,conceptsDedekind} from './dedekind.mjs';
import {circleWork,peopleEulerMore,conceptsEulerMore,bibliographyCircle,englishEulerMore} from './euler-more-catalog.mjs';
import {worksLogarithms,peopleLogarithms,conceptsLogarithms,bibliographyLogarithms,englishLogarithms,citationsLogarithms} from './euler-1751-catalog.mjs';
import {conceptsBridges} from './euler-1741-catalog.mjs';
import {peopleResidues,conceptsResidues,externalReferencesResidues} from './euler-1761-catalog.mjs';
englishSources['riemann-1851']=english1851;
englishSources['riemann-1857']=english1857;
Object.assign(englishSources,englishPoincare,representationEnglish);
Object.assign(englishSources,englishEulerMore);
Object.assign(englishSources,englishLogarithms);
const m = String.raw;

export const sources = {
  german1859: 'https://www.claymath.org/wp-content/uploads/2023/04/Wilkins-transcription.pdf',
  manuscript1859: 'https://www.claymath.org/collections/riemanns-1859-manuscript/',
  english1859: 'https://www.claymath.org/wp-content/uploads/2023/04/Wilkins-translation.pdf',
  mangoldt1895: 'https://gdz.sub.uni-goettingen.de/id/PPN243919689_0114',
};

additionalWorks.find(w=>w.id==='euler-1761').externalReferences=externalReferencesResidues;
worksPoincare.find(w=>w.id==='poincare-1895').externalReferences=externalReferences1895;
worksPoincare.find(w=>w.id==='poincare-1895').citationChecked='24 October 2026';

worksPoincare.find(w=>w.id==='poincare-1899').externalReferences=externalReferences1899;
worksPoincare.find(w=>w.id==='poincare-1899').citationChecked='25 October 2026';
worksPoincare.find(w=>w.id==='poincare-1900').citationChecked='25 October 2026';

worksPoincare.find(w=>w.id==='poincare-1902-surfaces').externalReferences=externalReferences1902;
worksPoincare.find(w=>w.id==='poincare-1902-surfaces').citationChecked='26 October 2026';

// A work record exists independently of whether we have edited its text.
// Titles are our English renderings; original titles identify the source edition.
export const works = [
  ...representationWorks,
  work1857,
  ...worksPoincare,
  ...additionalWorks,
  circleWork,
  ...worksLogarithms,
  { id: 'riemann-1859', authors: ['riemann'], year: 1859,
    title: 'On the number of primes below a given quantity',
    originalTitle: 'Ueber die Anzahl der Primzahlen unter einer gegebenen Grösse',
    publication: 'Monatsberichte der Berliner Akademie, November 1859, pp. 671–680.',
    language: 'German', edition: 'Modern-English reading edition',
    summary: 'From Euler’s product to analytic continuation, zeros, and a formula for counting primes.',
    links: [{label: 'Manuscript & source collection', url: sources.manuscript1859}, {label: 'German transcription', url: sources.german1859}, {label: 'Wilkins’s English translation · 1998', url: sources.english1859}] },
  { id: 'riemann-1854', authors: ['riemann'], year: 1854,
    title: 'On the hypotheses underlying geometry',
    originalTitle: 'Ueber die Hypothesen, welche der Geometrie zu Grunde liegen',
    publication: 'Habilitation lecture, Göttingen, 1854. Published posthumously; linked offprint: Göttingen, 1867.',
    language: 'German', edition: 'Complete modern-English reading',
    summary: 'The complete geometry lecture: dimensions, the line element, curvature, and physical space, with scoped commentary and ten margin drawings.',
    links: [{label: 'Göttingen manuscript', url: 'https://gdz.sub.uni-goettingen.de/id/DE-611-HS-3206822'}, {label: 'Original print · 1867', url: 'https://doi.org/10.3931/e-rara-49481'}, {label: 'Clifford’s English translation · 1873', url: 'https://www.maths.tcd.ie/pub/HistMath/People/Riemann/Geom/WKCGeom.html'}] },
  { id: 'riemann-1851', authors: ['riemann'], year: 1851, edition:'Complete dissertation', externalReferences:externalReferences1851,
    title: 'Foundations for a general theory of functions of a complex variable',
    originalTitle: 'Grundlagen für eine allgemeine Theorie der Functionen einer veränderlichen complexen Grösse',
    publication: 'Doctoral dissertation, Göttingen: E. A. Huth, 1851. 32 pages.', language: 'German',
    summary: 'Complex differentiability, branched sheets, harmonic functions, the minimum principle, and a normalized conformal mapping to the disk.',
    links: [{label:'German text · Wilkins transcription',url:'https://www.maths.tcd.ie/pub/HistMath/People/Riemann/Grund/'},{label:'1851 printing · Göttingen digitized copy',url:'https://gdz.sub.uni-goettingen.de/id/DE-611-HS-3206233'},{label:'English edition · Baker, Christenson & Orde, 2004',url:english1851.url}] },
  { id: 'jacobi-1829', authors: ['jacobi'], year: 1829,
    title: 'New foundations of the theory of elliptic functions',
    originalTitle: 'Fundamenta nova theoriae functionum ellipticarum',
    publication: 'Regiomonti: Bornträger, 1829.', language: 'Latin',
    summary: 'Elliptic functions, their transformations, and the theta functions used to express them.',
    links: [{label: 'Original edition · ETH / e-rara', url: 'https://doi.org/10.3931/e-rara-3926'}] },
  { id: 'euler-1744', authors: ['euler'], year: 1744,
    title: 'Various observations on infinite series', originalTitle: 'Variae observationes circa series infinitas',
    publication: 'Commentarii academiae scientiarum Petropolitanae 9, pp. 160–188. Written in 1737; published in 1744. Eneström E72.', language: 'Latin',
    edition: 'Complete paper · Theorems 1–19',
    summary: 'Perfect powers, prime products, signed series, and reciprocal primes. All nineteen theorems, with finite-cutoff proofs and the double-logarithm growth reconstructed.',
    links: [{label: 'Original work & publication record · Euler Archive', url: 'https://scholarlycommons.pacific.edu/euler-works/72/'}, {label:'Original Latin · 1744',url:'https://math.dartmouth.edu/~euler/docs/originals/E072.pdf'}, {label:'English translation · Viader, Bibiloni & Viader',url:'https://math.dartmouth.edu/~euler/docs/translations/E072en.pdf'}] },
  { id: 'gauss-1828', authors: ['gauss'], year: 1828,
    title: 'General investigations of curved surfaces', originalTitle: 'Disquisitiones generales circa superficies curvas',
    publication: 'Göttingen: Dieterich, 1828. Presented to the Royal Society in 1827.', language: 'Latin', edition: 'Complete modern-English reading',
    summary: 'All 29 articles: the normal-direction map, intrinsic curvature, development, geodesics, and surveying triangles, with drawings and six rigorous reconstructions.',
    links: [{label: 'Original print · ETH / e-rara', url: 'https://doi.org/10.3931/e-rara-59755'}, {label: 'English translation · 1902', url: 'https://www.gutenberg.org/ebooks/36856'}] },
  { id: 'fourier-1822', authors: ['fourier'], year: 1822,
    title: 'The analytical theory of heat', originalTitle: 'Théorie analytique de la chaleur',
    publication: 'Paris: Firmin Didot, 1822.', language: 'French',
    summary: 'Heat conduction, separation of variables, and representation by trigonometric series.',
    links: [{label: 'Original edition · HKUST Library', url: 'https://doi.org/10.14711/spcol/b458351'}] },
  { id: 'dirichlet-1837', authors: ['dirichlet'], year: 1837,
    title: 'Proof that every unbounded arithmetic progression with coprime first term and difference contains infinitely many primes',
    originalTitle: 'Beweis des Satzes, dass jede unbegrenzte arithmetische Progression, deren erstes Glied und Differenz ganze Zahlen ohne gemeinschaftlichen Factor sind, unendlich viele Primzahlen enthält',
    publication: 'Abhandlungen der Königlich Preussischen Akademie der Wissenschaften, 1837, pp. 45–71.', language: 'German',
    summary: 'Infinitely many primes in each arithmetic progression whose first term and difference are coprime.',
    links: [{label: 'Original print · scan hosted at Rutgers', url: 'https://sites.math.rutgers.edu/~alexk/2022S572/Dirichlet1837.pdf'}] },
  { id: 'hadamard-1893', authors: ['hadamard'], year: 1893,
    title: 'A study of entire functions, especially a function considered by Riemann',
    originalTitle: 'Étude sur les propriétés des fonctions entières et en particulier d’une fonction considérée par Riemann',
    publication: 'Journal de Mathématiques Pures et Appliquées, series 4, vol. 9 (1893), pp. 171–215.', language: 'French',
    summary: 'The growth, zeros, and product representations of entire functions.',
    links: [{label: 'Bibliographic record & original scan · NUMDAM / Gallica', url: 'https://www.numdam.org/item/JMPA_1893_4_9__171_0/'}] },
  { id: 'mangoldt-1895', authors: ['mangoldt'], year: 1895,
    title: 'On Riemann’s paper “On the number of primes below a given quantity”',
    originalTitle: 'Zu Riemanns Abhandlung „Ueber die Anzahl der Primzahlen unter einer gegebenen Grösse“',
    publication: 'Journal für die reine und angewandte Mathematik 114 (1895), pp. 255–305.', language: 'German', doi: '10.1515/crll.1895.114.255',
    summary: 'A later treatment of Riemann’s zero count and prime-counting argument.',
    links: [{label: 'Digitized journal volume · Göttingen · pp. 255–305', url: sources.mangoldt1895}, {label: 'Publisher DOI', url: 'https://doi.org/10.1515/crll.1895.114.255'}] },
  { id: 'habermann-2026', authors: ['habermann'], year: 2026,
    title: 'Bernhard Riemann’s original manuscript on the hypotheses underlying geometry',
    originalTitle: 'Bernhard Riemann’s original manuscript on the hypotheses underlying geometry',
    publication: 'Mathematische Semesterberichte (2026).', language: 'English', doi: '10.1007/s00591-026-00416-0',
    summary: 'A study of the original geometry manuscript and its transmission into print.',
    links: [{label: 'Publisher article', url: 'https://doi.org/10.1007/s00591-026-00416-0'}] },
];

attachTextCoverage(works);

export const people = [
  ...representationPeople,
  ...people1899,
  ...people1895,
  ...people1857,
  ...peoplePoincare,
  ...peopleGauss,
  ...people1854,
  ...peopleResidues,
  ...additionalPeople,
  ...peopleDedekind,
  ...peopleEulerMore,
  ...peopleLogarithms,
  {id:'riemann',name:'Bernhard Riemann',note:'The works recorded here concern geometry, complex functions, and the distribution of primes.',source:'https://www.maths.tcd.ie/pub/HistMath/People/Riemann/'},
  {id:'jacobi',name:'Carl Gustav Jacob Jacobi',note:'The selected book develops elliptic functions and their transformations.',source:'https://doi.org/10.3931/e-rara-3926'},
  {id:'euler',name:'Leonhard Euler',note:'The works recorded here concern reciprocal series, products over primes, circular arcs and imaginary exponentials, the bridges problem, and residues of powers.',source:'https://scholarlycommons.pacific.edu/euler-works/72/'},
  {id:'gauss',name:'Carl Friedrich Gauss',note:'The selected work develops the geometry and curvature of surfaces.',source:'https://doi.org/10.3931/e-rara-59755'},
  {id:'dirichlet',name:'Peter Gustav Lejeune Dirichlet',note:'The selected paper proves the existence of infinitely many primes in coprime arithmetic progressions.',source:'https://sites.math.rutgers.edu/~alexk/2022S572/Dirichlet1837.pdf'},
  {id:'fourier',name:'Joseph Fourier',note:'The selected book develops an analytical theory of heat conduction using trigonometric series.',source:'https://doi.org/10.14711/spcol/b458351'},
  {id:'goldschmidt',name:'Goldschmidt',note:'Historical name record. A verified identification and a bibliography have not yet been established.',source:sources.german1859+'#page=10'},
  {id:'hadamard',name:'Jacques Hadamard',note:'The selected paper studies the growth and zeros of entire functions.',source:'https://www.numdam.org/item/JMPA_1893_4_9__171_0/'},
  {id:'mangoldt',name:'Hans von Mangoldt',note:'The selected work studies zeta zeros and explicit prime-counting formulas. It begins on p. 255 of the linked volume.',source:sources.mangoldt1895},
  {id:'habermann',name:'Katharina Habermann',note:'Author of the manuscript study recorded below.',source:'https://doi.org/10.1007/s00591-026-00416-0'},
  {id:'euclid',name:'Euclid',note:'The selected source is an edition of the Elements, with Greek text and an English translation.',source:'https://farside.ph.utexas.edu/Books/Euclid/Elements.pdf',bibliography:[{title:'Elements · Greek text and modern English translation by Richard Fitzpatrick',url:'https://farside.ph.utexas.edu/Books/Euclid/Elements.pdf'}]},
  {id:'legendre',name:'Adrien-Marie Legendre',note:'The selected source is the fifth edition of the Elements of Geometry, published in 1804.',source:'https://doi.org/10.3931/e-rara-61309',bibliography:[{title:'Elements of geometry · linked fifth edition, 1804 (French)',url:'https://doi.org/10.3931/e-rara-61309'}]},
  {id:'clifford',name:'William Kingdon Clifford',note:'Translator of the geometry lecture into English in 1873. The complete reading’s modern-English revision is based on that public-domain translation.',source:'https://www.maths.tcd.ie/pub/HistMath/People/Riemann/Geom/WKCGeom.html',bibliography:[{title:'On the hypotheses which lie at the bases of geometry · English translation, Nature, 1873',url:'https://www.maths.tcd.ie/pub/HistMath/People/Riemann/Geom/WKCGeom.html'}]},
];

const existingWeierstrass=people.find(p=>p.id==='weierstrass');
existingWeierstrass.note+=' '+weierstrass1857.note;
existingWeierstrass.bibliography=[...(existingWeierstrass.bibliography??[]),...weierstrass1857.bibliography];

// Only direct, checked work-to-work citations belong here. Reverse lists are
// derived from these edges; related works and editorial sources stay separate.
export const citations = [
  ...representationCitations,
  ...citations1902,
  ...citations1857,
  ...citations1851,
  ...citationsPoincare,
  ...citations1854,
  ...citationsLogarithms,
  ...additionalCitations,
  {from:'riemann-1859',to:'jacobi-1829',locator:'German transcription, p. 3 (PDF p. 4), “Jacobi, Fund. S. 184”',url:sources.german1859+'#page=4',anchor:'theta',evidence:'Riemann supplies the author, abbreviated title, and page in the theta transformation passage.'},
  {from:'mangoldt-1895',to:'riemann-1859',locator:'Digitized volume, p. 255, opening paragraph and footnote **',url:sources.mangoldt1895,evidence:'The opening names Riemann’s paper; the footnote identifies the November 1859 publication and collected editions.'},
  {from:'mangoldt-1895',to:'hadamard-1893',locator:'Digitized volume, p. 255, opening paragraph and footnote ***',url:sources.mangoldt1895,evidence:'Von Mangoldt names Hadamard’s article and gives its journal, year, volume, and pages.'},
];

export const concepts = [
  ...conceptsLie1874,
  ...concepts1902,
  ...concepts1900,
  ...concepts1899,
  ...concepts1895,
  ...concepts1857,
  ...concepts1851,
  ...conceptsPoincare,
  ...conceptsGauss,
  ...concepts1854,
  ...conceptsEuler,
  ...conceptsDedekind,
  ...conceptsEulerMore,
  ...conceptsLogarithms,
  ...conceptsBridges,
  ...conceptsResidues,
  {id:'function-1859',title:'“Function” in the 1859 argument',kind:'Editorial reading guide',anchor:'euler-product',
    body:m`<p>Here the objects are specific expressions with specified uses: a convergent series and product for \(\zeta(s)\), integrals that continue it, a theta series, and step functions that count primes. Riemann does not introduce an arbitrary mapping between arbitrary sets in this paper.</p><p>We follow these constructions and their domains rather than replacing every occurrence of “function” with the most general modern definition. Nor does this paper establish that every function Riemann would admit must be given by a finite formula.</p>`,
    comparison:'A comparison with computable analysis would require a representation of inputs and outputs and effective error bounds for the operations in question. Convergence or a written formula alone does not supply those data. That comparison is an editorial research direction, not an attribution to Riemann.'},
  {id:'zeta-1859',title:'The zeta function',kind:'Author-defined object',anchor:'euler-product',
    body:m`<p>Riemann first identifies these two expressions in the half-plane \(\operatorname{Re}s>1\):</p>\[\zeta(s)=\sum_{n=1}^{\infty}n^{-s}=\prod_{p\,\mathrm{prime}}(1-p^{-s})^{-1}.\]<p>Here \(n\) runs over positive integers. The series and the product converge absolutely in this half-plane. The later contour and theta integrals extend this particular function; the original series is not used outside its convergence domain.</p>`,
    comparison:m`The continuation is meromorphic on the complex plane with a simple pole at \(s=1\). “The same function” refers to agreement on the original domain and analytic continuation, not to convergence of the original formula everywhere.`},
  {id:'pi-1859',title:'Riemann’s factorial function',kind:'Historical notation',anchor:'gamma-integral',
    body:m`<p>The symbol is \(\Pi\), not the circle constant \(\pi\). Riemann uses the factorial interpolation with the shift</p>\[\Pi(z)=\Gamma(z+1),\qquad \Pi(s-1)=\Gamma(s).\]<p>Thus the real-axis integral \(\int_0^\infty e^{-nx}x^{s-1}\,dx=\Pi(s-1)n^{-s}\) initially requires \(\operatorname{Re}s>0\) and a positive integer \(n\).</p>`,
    comparison:m`Keeping the shift matters: \(\Pi(s/2)\) means \(\Gamma(1+s/2)\), whereas \(\Pi(s/2-1)\) means \(\Gamma(s/2)\). We retain Riemann’s notation in the reading text.`},
  {id:'theta-1859',title:'The theta tail and Jacobi’s transformation',kind:'Author-defined object · cited identity',anchor:'theta',
    body:m`<p>For positive real \(x\), Riemann defines</p>\[\psi(x)=\sum_{n=1}^{\infty}e^{-\pi n^2x}.\]<p>The identity attributed to [[person:jacobi@jacobi-1829|Jacobi]], with a citation to [[work:jacobi-1829|his book, p. 184]], is</p>\[1+2\psi(x)=x^{-1/2}\bigl(1+2\psi(1/x)\bigr).\]<p>These are the positive real arguments used in Riemann’s integrals.</p>`,
    comparison:m`This \(\psi(x)\) is a theta-series tail. It is not the prime-power sum often denoted by \(\psi(x)\) in later analytic number theory. We do not silently substitute that later convention.`},
  {id:'xi-1859',title:'The completed entire function',kind:'Author-defined object',anchor:'xi',
    body:m`<p>With \(s=\tfrac12+it\), Riemann sets</p>\[\xi(t)=\Pi(s/2)(s-1)\pi^{-s/2}\zeta(s).\]<p>It is an even entire function of the complex variable \(t\). In particular, \(t\) is not restricted to real values when he discusses its zeros.</p>`,
    comparison:m`If a modern source writes \(\xi_{\mathrm{std}}(s)=\tfrac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)\), the correspondence is \(\xi(t)=\xi_{\mathrm{std}}(\tfrac12+it)\). The arguments of the two functions differ.`},
  {id:'hypothesis-1859',title:'The hypothesis about the zeros',kind:'Author’s conjecture',anchor:'hypothesis',
    body:m`<p>Riemann conjectures that all zeros of his \(\xi(t)\) are real. If \(\alpha\) is such a zero, the corresponding zeta zero is \(\rho=\tfrac12+i\alpha\). Thus his conjecture concerns the nontrivial zeros of this particular zeta function.</p><p>He explicitly says that he has not supplied a rigorous proof. Neither a zero-count asymptotic nor a finite numerical computation proves the conjecture.</p>`,
    comparison:'This is the Riemann hypothesis in its original variable. Clay Mathematics Institute lists it as unsolved (status checked 21 October 2026).',
    source:'https://www.claymath.org/millennium/riemann-hypothesis/'},
  {id:'prime-count-1859',title:'The prime count with half-values at jumps',kind:'Author-defined object',anchor:'prime-count',
    body:m`<p>For a positive real \(x\) that is not prime, \(F(x)\) counts primes strictly below \(x\). At a prime, add one half to that strict count. Equivalently,</p>\[F(x)=\sum_{p\lt x}1+\frac12\mathbf{1}_{\{x\text{ is prime}\}}.\]<p>For example, \(F(5)=\tfrac52\), and \(F(6)=3\). The midpoint convention is chosen for the later inversion integral.</p>`,
    comparison:m`This differs from the usual right-continuous count \(\pi(x)=\#\{p:p\leq x\}\) at primes. A linked definition must preserve that difference.`},
  {id:'prime-powers-1859',title:'The weighted prime-power count',kind:'Author-defined object',anchor:'prime-powers',
    body:m`<p>Using his half-value count, Riemann defines</p>\[f(x)=\sum_{k\geq1}\frac1kF(x^{1/k}).\]<p>A prime power \(p^k\) contributes weight \(1/k\) after it is crossed, and half that at the crossing. For each fixed positive real \(x\), only finitely many terms are nonzero.</p>`,
    comparison:m`For instance, \(f(4)=2+\tfrac14=\tfrac94\). The extra quarter is the half-value of the square of \(2\), whose full weight is \(\tfrac12\). This is not an arbitrary real-valued function: it is the specific weighted count used in the Mellin integral.`},
  {id:'inversion-1859',title:'The Fourier–Mellin inversion used here',kind:'Invoked result · hypotheses supplied editorially',anchor:'fourier',
    body:m`<p>Riemann’s application is the transform of the weighted prime count, with a fixed real \(a>1\):</p>\[\frac{\log\zeta(s)}s=\int_1^\infty f(x)x^{-s-1}\,dx,\qquad \operatorname{Re}s=a.\]<p>His inversion uses a vertical contour, interpreted as a symmetric limit, and recovers midpoint values at jumps. The logarithm here is the analytic branch supplied by the convergent Euler-product expansion in this half-plane.</p>`,
    comparison:m`After \(x=e^u\), the application concerns \(e^{-au}f(e^u)\), extended by zero for \(u<0\). It is integrable and has bounded variation locally. These are concrete conditions to check for this count; the paper does not assert inversion for every set-theoretic mapping.`},
  {id:'li-1859',title:'The logarithmic integral and its branches',kind:'Special function · branch convention',anchor:'branches',
    body:m`<p>The real expression \(\operatorname{Li}(x)\), for \(x>1\), uses a principal value at \(1\):</p>\[\operatorname{Li}(x)=\operatorname{PV}\int_0^x\frac{du}{\log u}.\]<p>For a nonreal zero \(\rho\), put \(w=\rho\log x\), with real \(\log x\), and use the horizontal-path normalization</p>\[\operatorname{Li}(x^\rho)=\int_{-\infty+i\operatorname{Im}w}^{w}\frac{e^z}{z}\,dz.\]<p>The positive and negative imaginary parts select the corresponding upper and lower paths. Taking a principal logarithm of the numerical value \(x^\rho\) would discard the required branch information.</p>`,
    comparison:'The paths and limiting prescription are part of the meaning of the formula. Riemann discusses them in the preceding contour calculation; the real-axis integral alone does not define the complex terms.'},
  {id:'mobius-1859',title:'Inverting the prime-power weights',kind:'Author’s formula · modern identification',anchor:'mobius',
    body:m`<p>Riemann sums over positive squarefree integers \(m\), using \(\mu\) for the number of prime factors of that particular \(m\):</p>\[F(x)=\sum_{m\ \mathrm{squarefree}}\frac{(-1)^\mu}{m}f(x^{1/m}).\]<p>For fixed \(x>1\), the exact count makes the sum finite.</p>`,
    comparison:m`In modern Möbius notation, write \(\sum_{m\geq1}\mu_{\mathrm{Mob}}(m)f(x^{1/m})/m\). Riemann’s exponent \(\mu\) is a count, not that modern arithmetic function. The coefficients cancel because \(\sum_{d\mid n}\mu_{\mathrm{Mob}}(d)\) vanishes for \(n>1\).`},
];

export const bibliographicFields = {
  ...representationBibliography,
  'riemann-1857':bibliography1857,
  ...bibliographyPoincare,
  ...additionalBibliographicFields,
  ...bibliographyLogarithms,
  'euler-1748-circle':bibliographyCircle,
  'riemann-1859':{type:'article',journal:'Monatsberichte der Berliner Akademie',pages:'671--680',month:'November'},
  'riemann-1854':{type:'unpublished',note:'Habilitation lecture, Göttingen, 1854; published posthumously, linked offprint 1867'},
  'riemann-1851':{type:'phdthesis',school:'Universität Göttingen'},
  'jacobi-1829':{type:'book',publisher:'Bornträger',address:'Regiomonti'},
  'euler-1744':{type:'article',journal:'Commentarii academiae scientiarum Petropolitanae',volume:'9',pages:'160--188',note:'Eneström E72; written in 1737'},
  'gauss-1828':{type:'book',publisher:'Dieterich',address:'Göttingen',note:'Presented in 1827'},
  'fourier-1822':{type:'book',publisher:'Firmin Didot',address:'Paris'},
  'dirichlet-1837':{type:'article',journal:'Abhandlungen der Königlich Preussischen Akademie der Wissenschaften',pages:'45--71'},
  'hadamard-1893':{type:'article',journal:'Journal de Mathématiques Pures et Appliquées',volume:'9',series:'4',pages:'171--215'},
  'mangoldt-1895':{type:'article',journal:'Journal für die reine und angewandte Mathematik',volume:'114',pages:'255--305'},
  'habermann-2026':{type:'article',journal:'Mathematische Semesterberichte'},
};
