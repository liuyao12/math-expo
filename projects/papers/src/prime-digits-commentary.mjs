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
 const [whole,fraction]=row.li.split('.'),li=m`${whole}.${fraction[0]}\ldots`;
 return m`<tr><th scope="row">\(10^{${row.exponent}}\)</th><td class="prime-digits-pair">\(\begin{aligned}\pi(N)&=${matched(row.count,row.prefix)}\\\operatorname{Li}(N)&=${matched(li,row.prefix)}\end{aligned}\)</td></tr>`;
}

export function primeDigitsHTML(){return m`
<section id="prime-digits-panel" hidden data-contribution="prime-count-digits-1859" aria-label="Error term">
 <p class="prime-digits-credit">Modern consequence · conditional on RH</p>
 <div class="prime-digits-bound">\[\text{Assuming RH:}\qquad\underbrace{\left|\pi(x)-\operatorname{Li}(x)\right|}_{\text{error}}\lt c\sqrt{x}\log x.\]</div>
 <p class="prime-digits-bound-source">The constant can be taken to be \(c=1/(8\pi)\) for every real \(x\ge2657\), by Lowell <a href="https://doi.org/10.1090/S0025-5718-1976-0457374-X" target="_blank" rel="noopener"><span class="person-surname">Schoenfeld</span></a>, <a href="https://doi.org/10.1090/S0025-5718-1976-0457374-X" target="_blank" rel="noopener"><i>Sharper Bounds</i></a> (1976), Corollary 1. Here \(\log\) is the natural logarithm. This later estimate is not proved in Riemann’s paper.</p>
 <p>Why “half the digits”? Since \(\pi(x)\sim x/\log x\), the count has about \(\log_{10}x\) digits, while an error of size \(\sqrt{x}\log x\) has about half as many, with logarithmic corrections. Thus \(\operatorname{Li}(x)\) estimates the count to roughly half its significant digits. The green prefixes below agree <strong>digit for digit</strong>. The bound alone does not guarantee a literal matching prefix of that length at every input: a carry across a decimal boundary can change an earlier digit.</p>
 ${schoenfeldPrecisionHTML()}
 <p class="prime-digits-table-key" id="prime-digits-table-help">Each exact count sits above its logarithmic integral, with corresponding digits aligned. Green bold digits mark the common leading string. The logarithmic integral shows one decimal place followed by an ellipsis. Scroll sideways for the larger values.</p>
 <div class="prime-digits-table-scroll" tabindex="0" role="region" aria-label="Prime-count comparison table — scroll horizontally" aria-describedby="prime-digits-table-help">
 <table class="prime-digits-table"><caption>Exact counts and the logarithmic integral</caption><thead><tr><th scope="col">\(N\)</th><th scope="col">Exact count / logarithmic integral</th></tr></thead><tbody>${primeDigitComparisons.map(comparisonRow).join('')}</tbody></table>
 </div>
 <div class="prime-digits-infinity"><strong>A theorem must keep control without an endpoint.</strong><p>Assuming RH, the estimate holds for every real \(x\ge2657\), however far out we go. The table gives finite comparisons; it cannot establish an error bound all the way to infinity. Its first row, \(10^3\), is below Schoenfeld’s threshold. Literal digit prefixes need not improve monotonically.</p></div>
 <p class="prime-digits-record">Counts: <a href="https://oeis.org/A006880/b006880.txt" target="_blank" rel="noopener">OEIS A006880</a>. The \(10^{27}\) and \(10^{29}\) records are documented by Kim <a href="https://github.com/kimwalisch/primecount/blob/master/doc/Records.md" target="_blank" rel="noopener"><span class="person-surname">Walisch</span></a> and David <a href="https://github.com/kimwalisch/primecount/blob/master/doc/Records.md" target="_blank" rel="noopener"><span class="person-surname">Baugh</span></a>; the latter was computed on 28 February 2022 and double-checked. These counts are independent of RH.</p>
 <p>Every error in this finite table has the same sign. <a href="../littlewood-1914/#lw14-theorem"><span class="person-surname">Littlewood</span>’s 1914 theorem</a> proves unconditionally that \(\pi(x)-\operatorname{Li}(x)\) takes both signs arbitrarily far out. An RH bound on the error’s size is compatible with infinitely many reversals of its sign.</p>
 <details><summary>Conventions and precision</summary>
  <p>We use \(\operatorname{Li}(x)=\operatorname{PV}\int_0^x dt/\log t=\operatorname{Ei}(\log x)\), and \(\pi(N)\) counts primes at most \(N\). All tabulated endpoints are composite, so the midpoint convention gives the same count.</p>
  <p>The logarithmic integrals were evaluated with <a href="https://mpmath.org/doc/current/functions/expintegrals.html#li" target="_blank" rel="noopener">mpmath</a> at \(80\) decimal places and checked using a convergent series for \(\operatorname{Ei}(\log x)\) at \(100\) places. Exact counts and decimal values are stored as strings. The displayed integral is truncated after its first fractional digit; the ellipsis represents the remaining digits, without rounding. Sources checked 20 November 2026.</p>
 </details>
</section>`;}
