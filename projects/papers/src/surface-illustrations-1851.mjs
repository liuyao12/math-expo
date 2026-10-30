const m=String.raw;
const label=(tex,x,y)=>m`<span class="surface-label" style="left:${x}%;top:${y}%" aria-hidden="true">\(${tex}\)</span>`;
export const sheetsIllustration1851=m`<figure class="margin-figure surface-illustration">
 <div id="sheet-joining-picture" class="surface-diagram"><svg viewBox="0 0 340 190" role="img" aria-label="The two-sheet case of Riemann's winding point. Two disks are slit from their centers to the right edge. Bank A on the first disk matches bank A on the second; the two B banks also match. Curved arrows show one circuit on each sheet, interrupted at the slit. The two marked centers are identified as one surface point.">
 <defs><pattern id="sheet-ink-hatching" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0V5" stroke="#827968" stroke-width=".45"/></pattern></defs>
 <g stroke="#565044" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="82" cy="94" r="59" fill="#f8f6f0" stroke-width="1.25"/>
  <circle cx="258" cy="94" r="59" fill="#f8f6f0" stroke-width="1.25"/>
  <path d="M27 113A59 59 0 0 0 126 137A63 63 0 0 1 27 113M203 113A59 59 0 0 0 302 137A63 63 0 0 1 203 113" fill="url(#sheet-ink-hatching)" stroke="none" opacity=".6"/>
  <path d="M82 94h60M258 94h60" stroke="#f8f6f0" stroke-width="9"/>
  <path d="M82 90h59M258 98h59" stroke="#a55c39" stroke-width="1.8"/>
  <path d="M82 98h59M258 90h59" stroke="#397d69" stroke-width="1.8"/>
  <path d="M114 82A34 34 0 1 0 114 106M290 82A34 34 0 1 0 290 106" fill="none" stroke-width="1.1"/>
  <path d="M108 109 114 106 115 113M284 109 290 106 291 113" fill="none" stroke-width="1.1"/>
  <circle cx="82" cy="94" r="2.6" fill="#565044"/>
  <circle cx="258" cy="94" r="2.6" fill="#565044"/>
 </g></svg>${label('S_1',24,9)}${label('S_2',76,9)}${label('\\sigma',21,57)}${label('\\sigma',73,57)}${label('\\mathrm A',38,40)}${label('\\mathrm B',38,59)}${label('\\mathrm B',90,40)}${label('\\mathrm A',90,59)}</div>
 <div class="surface-coordinate-formula">\(S_1\xrightarrow{\text{one circuit}}S_2\xrightarrow{\text{one circuit}}S_1\)</div>
 <figcaption>The two-sheet cycle in §5. Join each bank \(\mathrm A\) to \(\mathrm A\), and \(\mathrm B\) to \(\mathrm B\): crossing the seam continues the path on the other sheet. One circuit about \(\sigma\) changes sheets; the next returns. The two marked centers are <em>one</em> winding point. The slit and the separation on the page are drawing conventions.</figcaption>
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
