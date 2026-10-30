const m=String.raw;
const label=(tex,x,y)=>m`<span class="surface-label" style="left:${x}%;top:${y}%" aria-hidden="true">\(${tex}\)</span>`;
export const sheetsIllustration1851=m`<figure class="margin-figure surface-illustration">
 <div class="surface-diagram"><svg viewBox="0 0 320 240" role="img" aria-label="Two copies of a disk slit to the right of their centers. The upper bank of the first joins the lower bank of the second, and the lower bank joins the upper. The two drawn centers represent one surface point."><g fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
 <circle cx="80" cy="65" r="44" fill="#edf0e5" stroke="#a4b19b"/><circle cx="225" cy="175" r="44" fill="#edf0e5" stroke="#a4b19b"/>
 <path d="M80 65h44M225 175h44" stroke="#faf9f3" stroke-width="8"/>
 <path d="M80 62h44M225 178h44" stroke="#a55c39" stroke-width="2.5"/><path d="M80 68h44M225 172h44" stroke="#397d69" stroke-width="2.5"/>
 <path d="M124 62C230 25 300 110 269 178" stroke="#a55c39" stroke-dasharray="4 4"/><path d="M124 68C140 160 165 225 269 172" stroke="#397d69" stroke-dasharray="4 4"/>
 <path d="M270 163l-1 15 10-9M256 173l13-1-8 10" stroke="#775f42"/>
 <circle cx="80" cy="65" r="3" fill="#34482e" stroke="#34482e"/><circle cx="225" cy="175" r="3" fill="#34482e" stroke="#34482e"/>
 </g></svg>${label('S_1',25,7)}${label('S_2',70,98)}${label('z=0',19,39)}${label('z=0',65,84)}${label('\\mathrm A',38,20)}${label('\\mathrm B',35,35)}${label('\\mathrm B',85,65)}${label('\\mathrm A',87,80)}</div>
 <figcaption>The matching banks join crosswise. The two drawn centers represent <em>one</em> winding point on the surface. The slit is a chosen seam; the gaps and separated sheets are drawing conventions.</figcaption>
 <section id="root-lift-demo" class="root-lift-demo" aria-labelledby="root-lift-title" data-turns="0">
  <h4 id="root-lift-title">Follow one point around the branch</h4><p class="surface-editorial">Editorial example for §5 · \(w^2=z\)</p>
  <div class="root-lift-plots"><svg viewBox="0 0 320 205" role="img" id="root-lift-plot" aria-label="A loop around zero in the z-plane and its continuously followed square root in the w-plane. One z circuit reaches the other root; two return to the starting root.">
   <g fill="none" stroke="#d0d8c8" stroke-width="1"><path d="M20 99h120M80 39v120M180 99h120M240 39v120"/><circle cx="80" cy="99" r="47"/><circle cx="240" cy="99" r="47"/></g>
   <path d="M80 99h47" stroke="#bca47d" stroke-dasharray="3 3"/><path id="root-z-trail" fill="none" stroke="#397d69" stroke-width="2"/><path id="root-w-trail" fill="none" stroke="#a55c39" stroke-width="2"/>
   <circle cx="80" cy="99" r="2" fill="#34482e"/><circle cx="240" cy="99" r="2" fill="#34482e"/>
   <circle cx="287" cy="99" r="3" fill="#faf9f3" stroke="#87977a"/><circle cx="193" cy="99" r="3" fill="#faf9f3" stroke="#87977a"/>
   <circle id="root-z-point" cx="127" cy="99" r="4" fill="#397d69"/><circle id="root-w-point" cx="287" cy="99" r="4" fill="#a55c39"/>
  </svg>${label('\\text{Projection }z',25,9)}${label('\\text{Value }w',75,9)}${label('0',22,55)}${label('0',72,55)}${label('1',40,57)}${label('1',92,57)}${label('-1',60,57)}</div>
  <label class="root-progress-label" for="root-lift-progress">Circuit progress <output id="root-lift-angle"></output></label><input id="root-lift-progress" type="range" min="0" max="720" step="1" value="0">
  <div class="root-lift-actions"><button id="root-lift-play" type="button">Play two circuits</button><button id="root-lift-next" type="button">Next circuit</button><button id="root-lift-reset" type="button">Reset</button></div>
  <div id="root-lift-values" class="root-lift-values"></div><p id="root-lift-caption">The same projected input has two surface points above it, with opposite square-root values.</p>
  <p>We follow \(z=e^{i\theta}\) and \(w=e^{i\theta/2}\) continuously. We never reset to a principal square root at the slit. A closed path in the base need not lift to a closed path on the surface.</p>
  <p class="root-lift-status" id="root-lift-status" role="status">Ready · move the slider or play.</p>
 </section>
</figure>`;
export const coordinateIllustration1851=m`<figure class="margin-figure surface-illustration">
 <div class="surface-diagram"><svg viewBox="0 0 320 245" role="img" aria-label="The upper and lower halves of two sheets are colored separately. Taking the square-root coordinate maps them in order to four quarter sectors of a single disk. The disk center is an ordinary surface point.">
 <g stroke="#f8f6ee" stroke-width="2">
 <path d="M28 66a34 34 0 0 1 68 0Z" fill="#c58b69"/><path d="M28 66a34 34 0 0 0 68 0Z" fill="#d1b876"/>
 <path d="M28 171a34 34 0 0 1 68 0Z" fill="#7eab95"/><path d="M28 171a34 34 0 0 0 68 0Z" fill="#88a5bf"/>
 <path d="M238 119h62a62 62 0 0 0-62-62Z" fill="#c58b69"/><path d="M238 119V57a62 62 0 0 0-62 62Z" fill="#d1b876"/>
 <path d="M238 119h-62a62 62 0 0 0 62 62Z" fill="#7eab95"/><path d="M238 119v62a62 62 0 0 0 62-62Z" fill="#88a5bf"/>
 </g><g stroke="#687e5b" fill="none" stroke-width="1.3"><path d="M115 119h39m-7-5 7 5-7 5"/><circle cx="238" cy="119" r="62"/></g><circle cx="238" cy="119" r="3" fill="#34482e"/>
 </svg>${label('a_1',19,21)}${label("a'_1",19,34)}${label('a_2',19,64)}${label("a'_2",19,77)}${label('a_1',83,35)}${label("a'_1",66,35)}${label('a_2',66,62)}${label("a'_2",83,62)}${label('\\zeta=0',75,89)}</div>
 <div class="surface-coordinate-formula">\(\zeta=(z-z_0)^{1/2},\quad z=z_0+\zeta^2\)</div>
 <figcaption>The two-sheet case of §14. The four colored half-sheets become four consecutive quarter-sectors of <em>one</em> coordinate disk. The root \(\zeta\) is single-valued on this surface neighborhood.</figcaption>
 <p class="surface-coordinate-note">At its center the surface is regular in \(\zeta\). The projection \(z=z_0+\zeta^2\) has zero derivative there: the branching belongs to the projection. Separated pieces in the drawing do not represent cracks in the surface.</p>
</figure>`;
