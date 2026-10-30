const m=String.raw;
const label=(tex,x,y)=>m`<span class="surface-label" style="left:${x}%;top:${y}%" aria-hidden="true">\(${tex}\)</span>`;
export const sheetsIllustration1851=m`<figure class="margin-figure surface-illustration">
 <div id="sheet-joining-picture" class="surface-diagram"><svg viewBox="0 0 320 240" role="img" aria-label="Two copies of a disk slit to the right of their centers. The upper bank of the first joins the lower bank of the second, and the lower bank joins the upper. The two drawn centers represent one surface point."><g fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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

export const connectivityIllustration1851=m`<figure class="margin-figure surface-illustration">
 <div id="connectivity-handle-picture" class="surface-diagram"><svg viewBox="0 0 340 240" role="img" aria-label="A simple pen-and-ink sketch of one flat surface with a low arching handle. Both ends of the handle merge into the same sheet; the surface remains visible through the tunnel below.">
 <defs>
  <pattern id="handle-hatching" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(24)"><path d="M0 0V5" stroke="#746f61" stroke-width=".5"/></pattern>
 </defs>
 <path d="M22 148Q130 133 243 117L319 169Q197 191 83 211Z" fill="#f8f6f0" stroke="#575348" stroke-width="1.1" stroke-linejoin="round"/>
 <path d="M112 160Q163 142 228 156Q224 165 217 174Q164 170 123 181Z" fill="url(#handle-hatching)" opacity=".35"/>
 <path d="M80 162C90 153 90 145 90 128C90 49 217 39 238 117C244 141 248 151 266 156L228 172C207 164 213 145 205 124C190 87 136 91 125 128C119 146 127 160 115 174Z" fill="#f8f6f0"/>
 <path d="M88 159C101 148 99 134 101 122C111 66 202 59 226 116C238 145 237 154 250 163L228 172C207 164 213 145 205 124C190 87 136 91 125 128C119 146 127 160 115 174Z" fill="url(#handle-hatching)" opacity=".32"/>
 <g fill="none" stroke="#514e44" stroke-linecap="round" stroke-linejoin="round">
  <path d="M80 162C90 153 90 145 90 128C90 49 217 39 238 117C244 141 248 151 266 156" stroke-width="1.5"/>
  <path d="M115 174C127 160 119 146 125 128C136 91 190 87 205 124C213 145 207 164 228 172" stroke-width="1.5"/>
  <path d="M93 156C106 139 102 121 113 103M99 162C112 145 109 130 117 115M106 166C117 151 114 139 120 126" stroke-width=".55"/>
  <path d="M222 107C233 128 229 150 242 159M217 116C226 133 222 152 235 164" stroke-width=".5"/>
  <path d="M129 161Q165 155 199 158" stroke-width=".5" opacity=".45"/>
 </g></svg></div>
 <figcaption>One sheet with a handle: the arch joins back into the same surface, and the surface continues beneath it. The outer edge is its only boundary. An editorial mental picture for §6’s connectivity discussion; the shading gives depth, not geometric data.</figcaption>
</figure>`;
