import {schoenfeldSource,schoenfeldPrecisionHTML} from './schoenfeld-commentary.mjs';
const m=String.raw;

// Exact counts: OEIS A006880 b-file, checked 20 November 2026.
// Li: mpmath at 80 decimal places, checked by an independent Ei series at 100.
// Keep both as decimal strings: the larger counts exceed machine precision.
export const primeDigitComparisons=[
 {"exponent":3,"count":"168","li":"177.6096579901522266876406239486993179785577025645480810681284511852751","prefix":1},
 {"exponent":6,"count":"78498","li":"78627.54915946218191986291074794726116132187438242176707475931789394168","prefix":2},
 {"exponent":9,"count":"50847534","li":"50849234.95700179800400878908022360785563359242887901959079424663250025","prefix":4},
 {"exponent":12,"count":"37607912018","li":"37607950280.80486548953492709097818869279517315682222599982647854380532","prefix":6},
 {"exponent":15,"count":"29844570422669","li":"29844571475287.58106490589058598594308149535013999906466925702605488461","prefix":7},
 {"exponent":18,"count":"24739954287740860","li":"24739954309690415.02218938383725843483282112195906457058271503009713782","prefix":8},
 {"exponent":21,"count":"21127269486018731928","li":"21127269486616126182.33305833593592352819698972996559598656203540556796","prefix":11},
 {"exponent":24,"count":"18435599767349200867866","li":"18435599767366347775144.15096752021329393317527382886045046423681515497","prefix":12},
 {"exponent":27,"count":"16352460426841680446427399","li":"16352460426842189113085405.3386696984913351797459223395765774400021264","prefix":13},
 {"exponent":29,"count":"1520698109714272166094258063","li":"1520698109714276717287880527.343097152326086315163148600593077003720941","prefix":15}
];

export const primeDigitsContribution={
 id:'prime-count-digits-1859',kind:'comparison',work:'riemann-1859',
 title:'Error term',anchors:['smooth-part','numerical-evidence'],
 scope:'Exact prime counts and the real principal-value logarithmic integral at powers 10^(3n) from 10^3 to 10^27, ending at 10^29, beside a later error estimate conditional on RH. Common leading digits are observations, not a literal prefix guarantee.',
 sources:[
  schoenfeldSource,
  {title:'von Koch · Sur la distribution des nombres premiers (1901)',url:'https://doi.org/10.1007/BF02403071'},
  {title:'OpenAI · The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane (2026)',url:'https://github.com/openai/math/blob/main/preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf'},
  {title:'OpenAI · quasi-Riemann formalization scope',url:'https://github.com/openai/math/blob/main/lean/docs/003.md'},
  {title:'OEIS A006880 · exact counts at powers of ten',url:'https://oeis.org/A006880/b006880.txt'},
  {title:'Walisch and Baugh · prime-count records and double checks',url:'https://github.com/kimwalisch/primecount/blob/master/doc/Records.md'},
  {title:'Büthe · Schoenfeld’s RH error bound, introduction',url:'https://arxiv.org/html/1410.7015v4#S1'},
  {title:'mpmath · logarithmic integral conventions',url:'https://mpmath.org/doc/current/functions/expintegrals.html#li'}
 ]
};

function matched(value,prefix){
 return m`\textcolor{#246642}{\mathbf{${value.slice(0,prefix)}}}${value.slice(prefix)}`;
}
function comparisonRow(row){
 const [whole,fraction]=row.li.split('.');
 return m`<tr><th scope="row">\(10^{${row.exponent}}\)</th><td class="prime-digits-pair">\(\begin{aligned}${matched(row.count,row.prefix)}&\\${matched(whole,row.prefix)}&.${fraction[0]}\ldots\end{aligned}\)</td></tr>`;
}

export function primeDigitsHTML(){return m`
<section id="prime-digits-panel" hidden data-contribution="prime-count-digits-1859" aria-label="Error term">
 <p class="prime-digits-credit">Modern consequence · conditional on RH</p>
 <div class="prime-digits-bound">\[\text{Assuming RH:}\qquad\underbrace{\left|\pi(x)-\operatorname{Li}(x)\right|}_{\text{error}}\lt c\sqrt{x}\log x.\]</div>
 <p class="prime-digits-bound-source">Here \(c=1/(8\pi)\) for \(x\ge2657\), by <a href="https://doi.org/10.1090/S0025-5718-1976-0457374-X" target="_blank" rel="noopener"><span class="person-surname">Schoenfeld</span>, <i>Sharper Bounds</i> (1976)</a>.</p>
 <p id="prime-digits-table-help">The exact counts here stop at \(10^{29}\); RH is equivalent to this error bound continuing all the way to infinity.</p>
 <div class="prime-digits-table-scroll" tabindex="0" role="region" aria-label="Prime-count comparison table — scroll horizontally" aria-describedby="prime-digits-table-help">
 <table class="prime-digits-table"><caption>Exact counts and the logarithmic integral · matching digits in green</caption><thead><tr><th scope="col">\(N\)</th><th scope="col">Exact \(\pi(N)\) above<br>Estimate \(\operatorname{Li}(N)\) below</th></tr></thead><tbody>${primeDigitComparisons.map(comparisonRow).join('')}</tbody></table>
 </div>
 <p>RH gives roughly <strong>half</strong> the count’s significant digits of precision; the \(7/8\) quasi-Riemann result gives roughly <strong>one eighth</strong>, with logarithmic corrections in both cases. Green digits mark literal agreement, which can differ from this precision scale because of carries.</p>
 ${schoenfeldPrecisionHTML()}
 <details><summary>Why the bound must hold indefinitely</summary>
 <div class="prime-digits-infinity"><strong>A theorem must keep control without an endpoint.</strong><p>The largest exact power-of-ten count in the <a href="https://github.com/kimwalisch/primecount/blob/master/doc/Records.md" target="_blank" rel="noopener">records cited here</a> is \(\pi(10^{29})\); our table stops there. Finite computations cannot settle what happens beyond that endpoint. The precise statement equivalent to RH is</p>
 \[\operatorname{RH}\quad\Longleftrightarrow\quad\pi(x)-\operatorname{Li}(x)=O\!\left(\sqrt{x}\log x\right)\quad(x\to\infty).\]
 <p>This means that one fixed constant bounds the error for <em>every</em> sufficiently large real \(x\), without an upper endpoint. It is the error trend, or roughly half the significant digits in the precision sense above, that must continue all the way to infinity. Literal matching prefixes alone are not the equivalent statement. The forward implication goes back to <a href="https://doi.org/10.1007/BF02403071" target="_blank" rel="noopener"><span class="person-surname">von Koch</span>, <i>Sur la distribution des nombres premiers</i> (1901)</a>; conversely, this error bound excludes zeros with \(\operatorname{Re}s\gt1/2\), and the functional equation then gives RH. <a href="https://doi.org/10.1090/S0025-5718-1976-0457374-X" target="_blank" rel="noopener"><span class="person-surname">Schoenfeld</span>’s explicit constant</a> makes the forward bound valid for all \(x\ge2657\); the table’s first row, \(10^3\), is below that threshold.</p></div>
 </details>
 <details class="derivation prime-digits-quasi"><summary>Quasi-Riemann: roughly one-eighth of the digits</summary>
  <p>OpenAI’s 2026 analytic preprint <a href="https://github.com/openai/math/blob/main/preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf" target="_blank" rel="noopener"><i>The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane</i></a> proves that \(\zeta(s)\) has no zeros with \(\operatorname{Re}s\gt7/8\); its <a href="https://github.com/openai/math/blob/main/lean/docs/003.md" target="_blank" rel="noopener">accompanying formalization describes this same scope</a>. Applying the standard explicit formula to this zero-free half-plane gives the weaker prime-counting estimate</p>
  \[\pi(x)-\operatorname{Li}(x)=O\!\left(x^{7/8}\log x\right).\]
  <p>The relative error is therefore \(O\!\left(x^{-1/8}(\log x)^2\right)\). Taking decimal logarithms gives guaranteed precision on the scale \(\tfrac18\log_{10}x-2\log_{10}\log x+O(1)\): roughly the first eighth of the count’s digits, with logarithmic corrections. This is a weaker guarantee that continues indefinitely; the actual agreement can be much better. Carries still prevent a universal guarantee about literal matching prefixes. The prime-counting and digit consequences here are deductions from the zero-free statement, rather than claims about the scope of its Lean formalization. Sources checked 23 November 2026.</p>
 </details>
 <p class="prime-digits-record">Counts: <a href="https://oeis.org/A006880/b006880.txt" target="_blank" rel="noopener">OEIS A006880</a>. The \(10^{27}\) and \(10^{29}\) records are documented by Kim <a href="https://github.com/kimwalisch/primecount/blob/master/doc/Records.md" target="_blank" rel="noopener"><span class="person-surname">Walisch</span></a> and David <a href="https://github.com/kimwalisch/primecount/blob/master/doc/Records.md" target="_blank" rel="noopener"><span class="person-surname">Baugh</span></a>; the latter was computed on 28 February 2022 and double-checked. These counts are independent of RH.</p>
 <p>Every error in this finite table has the same sign. <a href="../littlewood-1914/#lw14-theorem"><span class="person-surname">Littlewood</span>’s 1914 theorem</a> proves unconditionally that \(\pi(x)-\operatorname{Li}(x)\) takes both signs arbitrarily far out. An RH bound on the error’s size is compatible with infinitely many reversals of its sign.</p>
 <details><summary>Conventions and precision</summary>
  <p>We use \(\operatorname{Li}(x)=\operatorname{PV}\int_0^x dt/\log t=\operatorname{Ei}(\log x)\), and \(\pi(N)\) counts primes at most \(N\). All tabulated endpoints are composite, so the midpoint convention gives the same count.</p>
  <p>The logarithmic integrals were evaluated with <a href="https://mpmath.org/doc/current/functions/expintegrals.html#li" target="_blank" rel="noopener">mpmath</a> at \(80\) decimal places and checked using a convergent series for \(\operatorname{Ei}(\log x)\) at \(100\) places. Exact counts and decimal values are stored as strings. The displayed integral is truncated after its first fractional digit; the ellipsis represents the remaining digits, without rounding. Sources checked 20 November 2026.</p>
 </details>
</section>`;}
