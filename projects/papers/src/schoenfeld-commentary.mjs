const m=String.raw;
export const schoenfeldSource={title:'Schoenfeld · Sharper Bounds (1976)',url:'https://doi.org/10.1090/S0025-5718-1976-0457374-X'};

export function schoenfeldPrecisionHTML(){return m`
<details class="derivation schoenfeld-precision-note"><summary>Schoenfeld’s bound and “half the digits”</summary><div>
 <p>Lowell <a href="https://doi.org/10.1090/S0025-5718-1976-0457374-X" target="_blank" rel="noopener"><span class="person-surname">Schoenfeld</span></a>, <a href="https://doi.org/10.1090/S0025-5718-1976-0457374-X" target="_blank" rel="noopener"><i>Sharper bounds for the Chebyshev functions \(\theta(x)\) and \(\psi(x)\). II</i></a>, <i>Mathematics of Computation</i> 30, no. 134 (1976), pp. 337–360. <a href="https://www.ams.org/mcom/1976-30-134/S0025-5718-1976-0457374-X/S0025-5718-1976-0457374-X.pdf#page=3" target="_blank" rel="noopener">Publisher PDF</a>. The RH estimate is also stated in <a href="https://arxiv.org/html/1410.7015v4#S1" target="_blank" rel="noopener"><span class="person-surname">Büthe</span>’s introduction</a>.</p>
 <p>Here is the decimal interpretation of the bound, rather than an additional assertion by Riemann. Put</p>
 \[E(x)=\frac{\sqrt{x}\log x}{8\pi}.\]
 <p>Assuming RH, the error is strictly less than \(E(x)\) for \(x\ge2657\). Since the prime number theorem gives \(\pi(x)\sim x/\log x\), the permitted relative error has scale</p>
 \[\frac{E(x)}{\pi(x)}\sim\frac{(\log x)^2}{8\pi\sqrt{x}}.\]
 <p>Taking base-ten logarithms converts this into a significant-digit accuracy estimate:</p>
 \[\begin{aligned}P(x)&:=\log_{10}\frac{\pi(x)}{E(x)}\\&=\tfrac12\log_{10}x-2\log_{10}\log x+O(1).\end{aligned}\]
 <p>The count itself has \(D(x)=1+\lfloor\log_{10}\pi(x)\rfloor\) decimal digits. Thus \(P(x)/D(x)\to\tfrac12\): <strong>roughly the first half of the digits, on a relative-accuracy scale, with a logarithmic loss.</strong> The actual error can be much smaller than the bound.</p>
 <p>This does not guarantee that a literal prefix of half the decimal characters agrees at every input: carries can change a prefix. The table records observed common prefixes. The theorem concerns an error bound that holds all the way to infinity, conditional on RH.</p>
</div></details>`;}
