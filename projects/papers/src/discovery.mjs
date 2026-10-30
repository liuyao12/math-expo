import {weilTerms} from './weil-catalog.mjs';
import {representationTerms} from './representation-catalog.mjs';
import {discoveryPoincare} from './poincare-catalog.mjs';
// Editorial discovery terms. These identify the subject for modern readers;
// they are not substituted into the author's text or definitions.
export const discoveryTerms={
 ...weilTerms,
 ...representationTerms,
 ...discoveryPoincare,
 'euler-1740':['Basel problem','reciprocal series','sine product','zeta values','Dirichlet beta values','Newton identities'],
 'euler-1741':['Königsberg bridges','bridge crossings','geometry of position','region words','odd and even counts','Eulerian paths','Eulerian circuits','graph theory','fifteen bridges','networks'],
 'euler-1744':['infinite series','Euler product','prime numbers','zeta function','reciprocal primes','prime harmonic series','log log infinity','double logarithm','perfect powers','Goldbach Euler theorem','Liouville function'],
 'euler-1748-circle':['Euler identity','Euler’s identity','Euler formula','complex exponential','imaginary logarithms','unit circle','trigonometry','De Moivre formula','arctangent series','pi computation'],
 'euler-1751':['complex logarithm','logarithms of negative numbers','imaginary logarithms','Leibniz Bernoulli controversy','log(-1)','log -1','logarithm of minus one','branches of logarithm','multivalued logarithm','roots of unity','infinite roots','complex exponential'],
 'leibniz-bernoulli-1745':['correspondence','letters','logarithm controversy','Leibniz Bernoulli','Commercium'],
 'euler-1761':['modular arithmetic','Fermat’s little theorem','residues','number theory','multiplicative order','power residues','finite differences','prime divisors','congruences','quadratic residues'],
 'fourier-1822':['heat equation','Fourier series','partial differential equations','mathematical physics'],
 'gauss-1828':['Theorema Egregium','Gauss map','Gaussian curvature','normal sections','geodesic triangle','angle excess','development','surveying','differential geometry','Gaussian curvature','Theorema Egregium','intrinsic geometry','surfaces'],
 'jacobi-1829':['elliptic functions','theta functions','Jacobi transformation'],
 'dirichlet-1837':['primes in arithmetic progressions','Dirichlet theorem','L-functions','analytic number theory'],
 'riemann-1857':['Abelian functions','Abelian integrals','algebraic curves','Riemann surfaces','Jacobi inversion','theta functions','period matrix','Riemann bilinear relations','Riemann Roch','special divisors','moduli','birational equivalence','meromorphic differentials','hyperelliptic curves'],
 'riemann-1851':['complex analysis','Riemann surfaces','holomorphic functions','conformal mapping','dissertation','Cauchy Riemann equations','Dirichlet principle','harmonic functions','branched coverings','mapping theorem','boundary value problem'],
 'riemann-1854':['Riemannian geometry','manifolds','metric tensor','line element','curvature','sectional curvature','normal coordinates','constant curvature','intrinsic geometry','physical space','finite and unbounded'],
 'riemann-1859':['Riemann hypothesis','zeta function','prime counting','explicit formula','analytic number theory'],
 'dedekind-1872':['Dedekind cuts','real numbers','continuity','foundations of analysis'],
 'dedekind-1888':['natural numbers','Dedekind infinity','induction','chains','foundations of arithmetic'],
 'hadamard-1893':['entire functions','Hadamard factorization','zeta function','zeros'],
 'mangoldt-1895':['explicit formula','Riemann von Mangoldt formula','zero counting','prime counting'],
 'hilbert-1900':['Hilbert problems','foundations','mathematical problems'],
 'noether-1918':['Noether theorem','symmetry','conservation laws','calculus of variations'],
 'monks-2019':['Basel problem','history of mathematics','calculus','reciprocal series'],
 'habermann-2026':['Riemann manuscript','history of geometry','Riemannian geometry'],
};

export const normalizeSearch=value=>String(value).normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();

// Shared by the browser and the functional checks.
export function matchesWork(work,filters){
 const words=normalizeSearch(filters.q??'').split(/\s+/).filter(Boolean);
 const search=normalizeSearch(work.searchText);
 if(!words.every(word=>search.includes(word)))return false;
 // Alternatives within one facet are joined by OR; different facets by AND.
 // Scalars remain accepted for existing callers and older bookmarked URLs.
 const selected=key=>[].concat(filters[key]??[]).filter(Boolean).map(String);
 const authors=selected('author'),languages=selected('language'),decades=selected('decade'),access=selected('access');
 if(authors.length&&!authors.some(author=>work.authors.includes(author)))return false;
 if(languages.length&&!languages.includes(work.language))return false;
 if(decades.length&&!decades.includes(String(Math.floor(work.year/10)*10)))return false;
 if(filters.from&&work.year<Number(filters.from))return false;
 if(filters.to&&work.year>Number(filters.to))return false;
 if(access.length&&!access.some(value=>value==='english'?work.english:value==='edited'?work.edited:false))return false;
 return true;
}

// Count each alternative under the query and all OTHER facets. Keeping the
// current facet out lets readers add alternatives without clearing it first.
export function facetCounts(works,filters,choices){
 return Object.fromEntries(Object.entries(choices).map(([key,values])=>[key,
  Object.fromEntries(values.map(value=>[value,works.filter(work=>matchesWork(work,{...filters,[key]:[value]})).length]))
 ]));
}

// The date printed on each record is primary. Numbered parts keep their order
// within the same author and year; stable title/ID ties never depend on insertion.
export function compareWorks(a,b,order='oldest'){
 const text=(x,y)=>String(x).localeCompare(String(y),'en');
 const tie=()=>text(a.authorSort??a.authors[0],b.authorSort??b.authors[0])||(order==='newest'?-1:1)*((a.chronologyOrder??0)-(b.chronologyOrder??0))||text(a.title,b.title)||text(a.id,b.id);
 if(order==='title')return text(a.title,b.title)||a.year-b.year||tie();
 if(order==='author')return text(a.authorSort??a.authors[0],b.authorSort??b.authors[0])||a.year-b.year||tie();
 return (order==='newest'?b.year-a.year:a.year-b.year)||tie();
}
