const m=String.raw;
const label=(tex,x,y)=>m`<span class="surface-label" style="left:${x}%;top:${y}%" aria-hidden="true">\(${tex}\)</span>`;
export const sheetsIllustration1851=m`<figure class="margin-figure surface-illustration">
 <div id="sheet-bridge-picture" class="surface-diagram surface-bridge-picture"><svg viewBox="0 0 360 280" role="img" aria-label="A schematic pen-and-ink picture of two broad sheets, with cut banks curling between levels like a bridge. Solid edges pass in front and dashed edges behind. Both marked copies of the winding point represent one surface point.">
 <defs><pattern id="bridge-engraving" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><path d="M0 0V7" stroke="#756c5b" stroke-width=".5" opacity=".45"/></pattern></defs>
 <g stroke="#4b493e" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
  <path d="M26 189 264 143 333 192 95 239Z" fill="#f8f6f0"/>
  <path d="M26 189 264 143 333 192" fill="none" stroke-dasharray="4 4"/>
  <path d="M165 83 302 57C278 91 271 151 302 178L165 204C125 174 128 112 165 83Z" fill="url(#bridge-engraving)" stroke-dasharray="4 4"/>
  <path d="M26 79 264 33 333 82 95 129Z" fill="#f8f6f0"/>
  <path d="M165 86 305 60" stroke="#f8f6f0" stroke-width="6"/>
  <path d="M165 89 302 63C348 77 345 147 302 173L165 199C200 168 201 116 165 89Z" fill="#f0eee4"/>
  <path d="M165 89 302 63C348 77 345 147 302 173L165 199C200 168 201 116 165 89Z" fill="url(#bridge-engraving)" stroke="none"/>
  <path d="M165 83 302 57" fill="none"/>
  <path d="M165 199 302 173" fill="none"/>
  <path d="M165 204C141 186 132 158 137 131" fill="none" stroke-dasharray="4 4"/>
  <path d="M305 63C322 88 323 112 314 139" fill="none" stroke-width=".65"/>
  <path d="M299 65C316 90 316 115 307 142M293 66C309 91 309 118 300 145M287 67C302 93 302 120 293 147" fill="none" stroke-width=".45" opacity=".7"/>
  <circle cx="165" cy="86" r="2.4" fill="#4b493e"/><circle cx="165" cy="201" r="2.4" fill="#4b493e"/>
 </g></svg>${label('S_1',22,22)}${label('S_2',22,79)}${label('\\sigma',43,27)}${label('\\sigma',43,76)}</div>
 <figcaption>A mental picture of crosswise joining: a sheet curls into the other level like a bridge. Solid and dashed edges distinguish front from back; an apparent crossing is not an additional join. The two marked copies of \(\sigma\) represent <em>one</em> winding point. Height, curvature, and separation are drawing conventions.</figcaption>
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
