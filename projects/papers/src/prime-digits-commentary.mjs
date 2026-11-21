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
 title:'Prime-count accuracy',anchors:['smooth-part','numerical-evidence'],
 scope:'Exact prime counts and the real principal-value logarithmic integral at powers 10^(3n) from 10^3 to 10^27, ending at 10^29, beside a later error estimate conditional on RH. Common leading digits are observations, not a literal prefix guarantee.',
 sources:[
  {title:'OEIS A006880 · exact counts at powers of ten',url:'https://oeis.org/A006880/b006880.txt'},
  {title:'Walisch and Baugh · prime-count records and double checks',url:'https://github.com/kimwalisch/primecount/blob/master/doc/Records.md'},
  {title:'Büthe · Schoenfeld’s RH error bound, introduction',url:'https://arxiv.org/html/1410.7015v4#S1'},
  {title:'mpmath · logarithmic integral conventions',url:'https://mpmath.org/doc/current/functions/expintegrals.html#li'}
 ]
};

function matched(value,prefix){
 return m`\(\textcolor{#246642}{\mathbf{${value.slice(0,prefix)}}}${value.slice(prefix)}\)`;
}
function thousandths(value){
 const [whole,fraction]=value.split('.');
 return BigInt(whole+fraction.slice(0,3))+(Number(fraction[3])>=5?1n:0n);
}
function decimal(value){
 const digits=value.toString().padStart(4,'0');
 return digits.slice(0,-3)+'.'+digits.slice(-3);
}
function comparisonRow(row){
 const li=thousandths(row.li),error=li-BigInt(row.count)*1000n;
 return m`<tr><th scope="row">\(10^{${row.exponent}}\)</th><td>${matched(row.count,row.prefix)}</td><td>${matched(decimal(li),row.prefix)}</td><td>\(${decimal(error)}\)</td><td>\(${row.prefix}/${row.count.length}\)</td></tr>`;
}

export function primeDigitsHTML(){return m`
<section id="prime-digits-panel" hidden data-contribution="prime-count-digits-1859" aria-label="Prime-count accuracy">
 <p class="prime-digits-credit">Modern consequence · conditional on RH</p>
 <div class="prime-digits-bound">\[\left|\pi(x)-\operatorname{Li}(x)\right|\le\frac{\sqrt{x}\log x}{8\pi}\]</div>
 <p class="prime-digits-bound-source">For \(x>2657\), assuming RH: <a href="https://arxiv.org/html/1410.7015v4#S1" target="_blank" rel="noopener"><span class="person-surname">Schoenfeld</span>’s bound, quoted by <span class="person-surname">Büthe</span></a>. This later estimate is not proved in Riemann’s paper.</p>
 <p class="prime-digits-table-key" id="prime-digits-table-help">Green bold digits mark the common leading string; values are rounded to three decimal places. Scroll sideways to compare all columns.</p>
 <div class="prime-digits-table-scroll" tabindex="0" role="region" aria-label="Prime-count comparison table — scroll horizontally" aria-describedby="prime-digits-table-help">
 <table class="prime-digits-table"><caption>Exact counts and the logarithmic integral</caption><thead><tr><th scope="col">\(N\)</th><th scope="col">Exact \(\pi(N)\)</th><th scope="col">\(\operatorname{Li}(N)\)</th><th scope="col">\(\operatorname{Li}(N)-\pi(N)\)</th><th scope="col">Leading digits<br>that agree</th></tr></thead><tbody>${primeDigitComparisons.map(comparisonRow).join('')}</tbody></table>
 </div>
 <div class="prime-digits-infinity"><strong>A theorem must keep control without an endpoint.</strong><p>The RH estimate would hold for every real \(x>2657\), however far out we go. The table is finite evidence; literal digit prefixes need not improve monotonically.</p></div>
 <p class="prime-digits-record">Counts: <a href="https://oeis.org/A006880/b006880.txt" target="_blank" rel="noopener">OEIS A006880</a>. The \(10^{27}\) and \(10^{29}\) records are documented by Kim <a href="https://github.com/kimwalisch/primecount/blob/master/doc/Records.md" target="_blank" rel="noopener"><span class="person-surname">Walisch</span></a> and David <a href="https://github.com/kimwalisch/primecount/blob/master/doc/Records.md" target="_blank" rel="noopener"><span class="person-surname">Baugh</span></a>; the latter was computed on 28 February 2022 and double-checked. These counts are independent of RH.</p>
 <details><summary>Conventions and precision</summary>
  <p>We use \(\operatorname{Li}(x)=\operatorname{PV}\int_0^x dt/\log t=\operatorname{Ei}(\log x)\), and \(\pi(N)\) counts primes at most \(N\). All tabulated endpoints are composite, so the midpoint convention gives the same count.</p>
  <p>Since \(\pi(x)\sim x/\log x\), RH’s square-root error corresponds to roughly half the significant digits, apart from logarithmic factors. This concerns the scale of the error; decimal carries can affect the matching prefix.</p>
  <p>The logarithmic integrals were evaluated with <a href="https://mpmath.org/doc/current/functions/expintegrals.html#li" target="_blank" rel="noopener">mpmath</a> at \(80\) decimal places and checked using a convergent series for \(\operatorname{Ei}(\log x)\) at \(100\) places. Exact counts and decimal values are stored as strings; rounding and subtraction use exact integer arithmetic. Sources checked 20 November 2026.</p>
 </details>
</section>`;}
