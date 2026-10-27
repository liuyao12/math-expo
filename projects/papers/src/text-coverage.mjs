// Coverage concerns the primary text available in this site's modern-English reading.
// It is independent of linked translations, commentary, proof repair, and formal verification.
// Explicit scope entries prevent a chapter from being mistaken for a whole book.
import cartanSource from './cartan-1913-source.json' with {type:'json'};
const completeScopes = {
  "lie-1874": "The complete 1874 note: introduction, §§1–5, and author footnotes.",
  "riemann-1857": "The complete memoir: introduction, three preliminaries, and §§1–27.",
  "poincare-1892": "The complete preliminary note.",
  "poincare-1895": "The complete memoir: introduction and §§1–18.",
  "poincare-1899": "The complete first supplement, §§1–11.",
  "poincare-1900": "The complete second supplement: introduction and §§1–6.",
  "poincare-1902-surfaces": "The complete third supplement, including its author footnotes.",
  "euler-1740": "The complete paper, §§1–19.",
  "euler-1741": "The complete bridges paper, §§1–21.",
  "euler-1761": "The complete residues paper, §§1–78.",
  "dedekind-1872": "The complete essay, Sections I–VII.",
  "dedekind-1888": "The complete essay, §§1–172.",
  "euler-1748-circle": "Chapter VIII only, §§126–142; this record does not represent the whole book.",
  "euler-1751": "The complete paper on logarithms, including all four problems.",
  "riemann-1859": "The complete prime-counting paper, across all nine pages of the German source transcription.",
  "riemann-1854": "The complete geometry lecture, including the author’s synopsis.",
  "riemann-1851": "The complete dissertation: all 22 sections, author footnotes, and contents.",
  "euler-1744": "The complete paper, Theorems 1–19 and their accompanying text.",
  "gauss-1828": "The complete memoir, Articles 1–29."
};
const queued = ["lie-1880", "cartan-1894", "weyl-1925", "weyl-1926-representations-2", "weyl-1926-representations-3", "weyl-1926-addendum", "peter-weyl-1927", "poincare-1902-cycles", "poincare-1904", "monks-2019", "hilbert-1900", "noether-1918", "leibniz-bernoulli-1745", "jacobi-1829", "fourier-1822", "dirichlet-1837", "hadamard-1893", "mangoldt-1895", "habermann-2026"];
export const textCoveragePolicy = {
  label:'On-site text',
  definition:'Percentage of the source work represented in our on-site modern-English reading. External PDFs and commentary do not contribute. Complete means all author text within the stated scope is rendered; it does not mean every proof or editorial issue has been resolved.',
  partialMethod:'Partial percentages are approximate source-text coverage, rounded to the nearest whole percent. The evidence records the covered source intervals and the counting method; passage counts and translation word counts are not used.'
};
export const textCoverage = Object.fromEntries([
  ...Object.entries(completeScopes).map(([id,scope])=>[id,{status:'complete',percent:100,approximate:false,scope,available:scope,basis:'Complete modern-English rendering within the scope stated for this record; see Sources & edition for collation and proof limitations.',checked:'2026-10-26'}]),
  ...queued.map(id=>[id,{status:'not-started',percent:0,approximate:false,scope:'The complete work identified by this bibliographic record.',available:'No primary text is rendered on site yet.',basis:'External original texts, English translations, abstracts, and bibliographic summaries are excluded.',checked:'2026-10-26'}]),
  ['cartan-1913',{status:'partial',percent:cartanSource.coverage.percent,approximate:true,scope:'The complete memoir, printed pp. 53–96.',available:'The complete unnumbered introduction, pp. 53–56, with its two author footnotes. Sections I–XXII are not yet rendered.',basis:cartanSource.coverage.method,evidence:'cartan-1913/source-evidence.json',checked:'2026-10-26'}]
]);
export function attachTextCoverage(works){
  const ids=new Set(works.map(w=>w.id));
  for(const id of Object.keys(textCoverage))if(!ids.has(id))throw Error('Coverage has no work: '+id);
  for(const w of works){
    const c=textCoverage[w.id];
    if(!c)throw Error('Missing explicit text coverage: '+w.id);
    if(!Number.isInteger(c.percent)||c.percent<0||c.percent>100)throw Error('Invalid text coverage: '+w.id);
    if((c.status==='complete')!==(c.percent===100)||Boolean(w.edition)!==(c.percent>0))throw Error('Reading and coverage disagree: '+w.id);
    w.textCoverage=c;
  }
}
