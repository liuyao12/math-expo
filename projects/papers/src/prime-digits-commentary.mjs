import {rhStatusNote} from './riemann-hypothesis-status.mjs';
const m=String.raw;

// Counts are exact decimal strings. Never pass the large endpoint through Number.
// Li values: mpmath 1.3.0, li(10**exponent), computed at 80 decimal places
// and independently checked against Ei(log(x)) at 100 decimal places.
export const primeDigitComparisons=[
 {exponent:3,count:'168',li:'177.609657990152226687640623948699317978557703',prefix:1},
 {exponent:6,count:'78498',li:'78627.5491594621819198629107479472611613218744',prefix:2},
 {exponent:9,count:'50847534',li:'50849234.9570017980040087890802236078556335924',prefix:4},
 {exponent:29,count:'1520698109714272166094258063',li:'1520698109714276717287880527.343097152326086315163148600593077003720941',prefix:15}
];

export const primeDigitsContribution={
 id:'prime-count-digits-1859',kind:'comparison',work:'riemann-1859',
 title:'How many digits agree?',anchors:['smooth-part','numerical-evidence'],
 scope:'Exact prime counts and the real principal-value logarithmic integral at four finite endpoints through 10^29, alongside a later error estimate conditional on RH. Common leading digits are observations, not a literal prefix guarantee.',
 sources:[
  {title:'Walisch and Baugh · exact prime-count records and double checks',url:'https://github.com/kimwalisch/primecount/blob/master/doc/Records.md'},
  {title:'Büthe · Schoenfeld’s RH error bound, introduction',url:'https://arxiv.org/html/1410.7015v4#S1'},
  {title:'Alpöge · Remark, claimed proof announced 20 November 2026',url:'https://alpo.ge/remark.pdf'},
  {title:'mpmath · logarithmic integral conventions',url:'https://mpmath.org/doc/current/functions/expintegrals.html#li'}
 ]
};

function matched(value,prefix){
 return m`\(\textcolor{#246642}{\mathbf{${value.slice(0,prefix)}}}${value.slice(prefix)}\)`;
}
function roundedLi(value){
 const [whole,fraction]=value.split('.');
 const rounded=(BigInt(whole+fraction.slice(0,3))+(Number(fraction[3])>=5?1n:0n)).toString();
 return rounded.slice(0,-3)+'.'+rounded.slice(-3);
}
function comparisonRow(row){
 return m`<tr><th scope="row">\(10^{${row.exponent}}\)</th><td>
  <dl class="prime-digits-values"><div><dt>Exact \(\pi(N)\)</dt><dd>${matched(row.count,row.prefix)}</dd></div>
  <div><dt>\(\operatorname{Li}(N)\)</dt><dd>${matched(roundedLi(row.li),row.prefix)}</dd></div></dl>
  <span class="prime-digits-agreement">\(${row.prefix}\) of \(${row.count.length}\) leading digits agree</span>
 </td></tr>`;
}

export function primeDigitsHTML(){return m`
<section id="prime-digits-panel" hidden data-contribution="prime-count-digits-1859" aria-label="Prime-count accuracy and RH">
 <p class="prime-digits-credit">Modern consequence · conditional on RH</p>
 <p>The zero terms control the discrepancy from the smooth approximation. If RH holds, a later estimate gives</p>
 <div class="prime-digits-bound">\[\left|\pi(x)-\operatorname{Li}(x)\right|\le\frac{\sqrt{x}\log x}{8\pi}\]</div>
 <p class="prime-digits-bound-source">for \(x>2657\). This is <a href="https://arxiv.org/html/1410.7015v4#S1" target="_blank" rel="noopener"><span class="person-surname">Schoenfeld</span>’s bound, quoted by <span class="person-surname">Büthe</span></a>; it is not a bound proved in Riemann’s paper.</p>
 <p class="prime-digits-record">${rhStatusNote}</p>
 <p>Green bold digits mark the common leading string. Approximations below are rounded to three decimal places.</p>
 <table class="prime-digits-table"><caption>Finite comparisons, from a thousand to \(10^{29}\)</caption><thead><tr><th scope="col">\(N\)</th><th scope="col">Count and approximation</th></tr></thead><tbody>${primeDigitComparisons.map(comparisonRow).join('')}</tbody></table>
 <p class="prime-digits-record">The \(10^{29}\) count was computed by Kim <a href="https://github.com/kimwalisch/primecount/blob/master/doc/Records.md" target="_blank" rel="noopener"><span class="person-surname">Walisch</span></a> and David <a href="https://github.com/kimwalisch/primecount/blob/master/doc/Records.md" target="_blank" rel="noopener"><span class="person-surname">Baugh</span></a> on 28 February 2022. They report checking it with a second computation using different tuning parameters. It is an exact count, independent of RH, at a selected endpoint; it is not a stored list of every prime.</p>
 <p>At this endpoint, \(\operatorname{Li}(N)-\pi(N)\approx4.55\times10^{12}\), yet the relative error is only about \(3.0\times10^{-15}\): \(15\) leading digits agree in a \(28\)-digit count.</p>
 <div class="prime-digits-infinity"><strong>A theorem must keep control without an endpoint.</strong><p>The RH estimate would hold for every real \(x>2657\), however far out we go. No finite table establishes that claim. The global bound concerns the size of the error; it does not promise that literal digit prefixes improve monotonically.</p></div>
 <details><summary>Why “half the digits”?</summary>
  <p>The count has size \(\pi(x)\sim x/\log x\). An error of size \(x^\theta\), apart from logarithmic factors, therefore corresponds to roughly \((1-\theta)\log_{10}x\) significant decimal digits of accuracy.</p>
  <p>RH gives \(\theta=\tfrac12\): roughly half the digits on this scale. This implication uses the later explicit-formula theory, not a claim made by Riemann.</p>
  <p>These are error scales, not a fixed fraction of identical decimal characters at every input. Logarithmic factors and carries can affect a common prefix. For example, two integers can be very close while lying on opposite sides of a decimal boundary.</p>
 </details>
 <details><summary>Definitions, calculation and sources</summary>
  <p>Here \(\pi(N)\) counts primes at most \(N\), and \(\operatorname{Li}(x)=\operatorname{PV}\int_0^x dt/\log t=\operatorname{Ei}(\log x)\). The three small endpoints are composite, so Riemann’s midpoint count equals the usual count there; the same holds at \(10^{29}\).</p>
  <p>Some authors instead integrate from \(2\), subtracting \(\operatorname{Li}(2)\approx1.04516\). We consistently use the real principal-value convention, as in the corrected explicit formula above.</p>
  <p>The logarithmic integrals were evaluated with <a href="https://mpmath.org/doc/current/functions/expintegrals.html#li" target="_blank" rel="noopener">mpmath</a> at \(80\) decimal places and checked via \(\operatorname{Ei}(\log x)\) at \(100\) places. The displayed digits and prefixes are stored as decimal strings, preserving the large count exactly. The small exact counts were also checked with SymPy’s prime-counting function.</p>
  <p><a href="https://github.com/kimwalisch/primecount/blob/master/doc/Records.md" target="_blank" rel="noopener">Prime-count record and verification</a> · <a href="https://arxiv.org/html/1410.7015v4#S1" target="_blank" rel="noopener">RH error estimate</a>. Sources checked 20 November 2026. These are modern comparisons, separate from the historical counts reported in the paper.</p>
 </details>
</section>`;}
