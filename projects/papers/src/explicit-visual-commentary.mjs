const m=String.raw;
export const explicitVisualContribution={
 id:'explicit-formula-1859',kind:'interactive',work:'riemann-1859',
 title:'Zeros into primes',anchors:['formula','mobius','density'],
 scope:'Finite conjugate-pair truncations of Riemann’s corrected weighted prime-power formula and its fixed six-term Möbius inversion for real x from 2 to 100.',
 sources:[
  {title:'Odlyzko · published zeta-zero table',url:'https://www-users.cse.umn.edu/~odlyzko/zeta_tables/'},
  {title:'Riesel and Göhl · normalized explicit formula, equations (4)–(5)',url:'https://doi.org/10.1090/S0025-5718-1970-0277489-3'},
  {title:'NIST DLMF · exponential integrals',url:'https://dlmf.nist.gov/6.2'}
 ]
};
export function explicitVisualHTML(){return m`
<div id="explicit-panel" hidden data-ready="false" data-contribution="explicit-formula-1859" aria-label="Interactive explicit formula">
 <div class="explicit-options">
  <label for="explicit-mode">Count<select id="explicit-mode"><option value="pi">Prime count</option><option value="f">Weighted prime powers</option></select></label>
  <label for="explicit-range">Window<select id="explicit-range"><option value="30">Close-up · 2–30</option><option value="100">Wider · 2–100</option></select></label>
 </div>
 <div class="explicit-zero-control">
  <div><label for="explicit-pairs">Include zero pairs</label><output id="explicit-count-label" for="explicit-pairs">0 conjugate pairs · 0 zeros</output></div>
  <input id="explicit-pairs" type="range" min="0" max="200" step="1" value="0" disabled aria-describedby="explicit-truncation">
  <div class="explicit-pair-actions"><button id="explicit-play" type="button" disabled>Play pairs</button><button id="explicit-reset" type="button" disabled>Reset to zero</button><span id="explicit-height"></span></div>
 </div>
 <div class="explicit-plot-frame">
  <canvas id="explicit-plot" width="400" height="300" tabindex="0" role="img" aria-label="Prime-counting staircase and an explicit-formula approximation. Move over the plot to inspect a point; left and right arrow keys move the selected input." aria-describedby="explicit-truncation"></canvas>
  <div id="explicit-axes" aria-hidden="true"></div>
 </div>
 <div class="explicit-legend"><span><i class="exact-key"></i><span id="explicit-exact-key">\(\pi_0(x)\)</span></span><span><i class="approx-key"></i><span id="explicit-approx-key">\(\widehat{\pi}_N(x)\)</span></span></div>
 <p id="explicit-truncation" class="explicit-explainer">Add pairs to recover the steps. At a prime the target is the midpoint of the jump; finite sums can overshoot, and more pairs need not improve every point.</p>
 <div id="explicit-readout" class="explicit-readout"></div>
 <details class="explicit-inspect"><summary>Inspect an input</summary><form id="explicit-inspect-form"><label for="explicit-x">\(x\)<input id="explicit-x" type="number" min="2" max="30" step="any" value="10" required></label><button type="submit">Inspect</button></form></details>
 <details class="explicit-method"><summary>The formula, zero data &amp; conventions</summary>
  <p>Riemann’s weighted count \(f(x)\) gives weight \(1/k\) to a prime power \(p^k\), with half that weight at its jump. The colored curve keeps the first \(N\) positive zero heights and their conjugates:</p>
  \[\begin{aligned}\widehat{f}_N(x)&=\operatorname{Li}(x)-\log2+T(x)\\&\quad-2\operatorname{Re}\sum_{n=1}^{N}\operatorname{Ei}\bigl((\tfrac12+i\gamma_n)\log x\bigr),\\T(x)&=\int_x^\infty\frac{du}{u(u^2-1)\log u}.\end{aligned}\]
  <p>The displayed constant is the corrected normalization discussed beside the paper. The complex exponential integral retains the exponent’s logarithm; we never reduce the argument by evaluating a principal \(\log(x^\rho)\).</p>
  <p>To recover the prime count on this exhibit’s window \(2\le x\le100\), we use</p>
  \[\widehat{\pi}_N(x)=\sum_{m=1}^{6}\frac{\mu(m)}m \widehat{f}_N(x^{1/m}).\]
  <p>Here \(\mu\) is the modern Möbius function. Six terms suffice for the exact \(f\), since \(100\lt 2^7\) and \(f(y)=0\) for \(1\lt y\lt 2\). We keep the cutoff fixed throughout the picture. Substituting the truncated \(\widehat{f}_N\) makes this a numerical approximation.</p>
  <p>The usual \(\pi(x)\) counts primes up to and including \(x\). The black staircase’s dots mark the half-values \(\pi_0(p)=\pi(p)-\tfrac12\). Away from primes, \(\pi_0(x)=\pi(x)\). In weighted mode, all prime powers have their appropriate jumps and midpoint dots.</p>
  <p>The zero data are the first \(200\) positive ordinates in <a href="https://www-users.cse.umn.edu/~odlyzko/zeta_tables/" target="_blank" rel="noopener">Andrew <span class="person-surname">Odlyzko</span>’s published table</a>, whose stated accuracy is within \(3\times10^{-9}\). Each supplies \(\tfrac12\pm i\gamma_n\), so the slider includes up to \(400\) zeros. This is modern numerical data, not Riemann’s historical computation. Their finite locations do not establish the Riemann hypothesis.</p>
  <p>The curves are computed from these data in your browser, using exponential-integral continued fractions and a convergent series for \(T(x)\). The finite zero sum has truncation error, especially near jumps; the display gives no certified bound for the omitted zeros. There is no artificial smoothing of the sum.</p>
  <p><a href="../zeta-zeros-200.json">Imported zero data &amp; provenance</a> · <a href="explicit-reference-values.json">Independent high-precision checks</a> · <a href="https://doi.org/10.1090/S0025-5718-1970-0277489-3" target="_blank" rel="noopener"><span class="person-surname">Riesel</span> and <span class="person-surname">Göhl</span>, equations (4)–(5)</a> · <a href="https://dlmf.nist.gov/8.9" target="_blank" rel="noopener">NIST · continued fractions</a></p>
 </details>
 <p id="explicit-status" class="zeta-render-status" role="status">Preparing the zero contributions…</p>
</div>`;}

