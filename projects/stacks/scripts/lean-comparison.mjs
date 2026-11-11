import fs from 'node:fs';
import path from 'node:path';
import {createRenderer,escapeHTML as esc} from '../src/latex.mjs';
import {renderDependencyGraph} from '../public/graph-render.js';
import {createLeanSchemeGraph} from '../src/lean-scheme-graph.mjs';

const stacksTag = tag => 'https://stacks.math.columbia.edu/tag/' + tag;
const sectionLink = row => `<a href="${stacksTag(row.tag)}">§${esc(row.number)} ${esc(row.title)}</a>`;

function sectionList(rows, label) {
  return `<details><summary>${label} (${rows.length})</summary><ul>${rows.map(row => {
    const witness = row.witness;
    const source = witness
      ? ` · <a href="https://stacks.axiommath.ai/library?tag=${esc(witness.tag)}"><code>${esc(witness.chain.at(-1))}</code></a>`
      : '';
    return `<li>${sectionLink(row)}${source}</li>`;
  }).join('')}</ul></details>`;
}

export function buildLeanComparison({root, dist, head, header, footer, readings, catalog}) {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'upstream/lean-dependency-comparison.json'), 'utf8'));
  const {schemes, curves} = data;
  const mathlib = JSON.parse(fs.readFileSync(path.join(root, 'upstream/lean-scheme-graph.json'), 'utf8'));
  if (mathlib.axiom_commit !== data.axiom_commit) throw Error('Axiom releases differ across the Lean pilot');
  const graph = createLeanSchemeGraph(catalog, readings.find(reading => reading.slug === 'scheme'), mathlib);
  const byTag = new Map(Object.values(catalog.references).map(ref => [ref.tag, ref]));
  const projective = `https://github.com/AxiomMath/Stacks/blob/${data.axiom_commit}/StacksFrontier/AlgebraicGeometry/Variety/Defs/Projective.lean#L80-L115`;
  const compare = (trace, slug) => {
    const reused = trace.reused ? ` The earlier schemes reading supplied another ${trace.reused} sections.` : '';
    return `<p><a href="../${slug}/">Reading</a> · ${trace.baseline} sections. The projected Lean selection has ${trace.candidate} sections, with ${trace.retained} in both selections.${reused}</p>
      ${sectionList(trace.added, 'Sections added by the Lean trace')}
      ${sectionList(trace.dropped, 'Sections dropped by the Lean trace')}`;
  };
  const title = 'Lean dependencies';
  const description = 'Compare the Stacks reading selections with dependencies traced through AxiomMath’s Lean declarations.';
  const page = head(title, '../', description) + header('../') + `
    <main id="main" class="path-page home">
      <section class="path-intro">
        <p class="eyebrow">Selected readings</p>
        <h1>${title}</h1>
        <p class="lead">The Lean trace for schemes and projective varieties.</p>
      </section>
      <div class="path-scope">
        <p>The comparison starts with particular Lean declarations, follows AxiomMath’s proof edges, and looks up the Stacks section for each reached tag. It counts a section once even when several declarations point to it. The schemes reading follows the Stacks definitions and proofs. The comparison below helps identify prerequisites those passages leave implicit. The projected Lean selections are shown here for comparison.</p>

        <h2 id="schemes">Schemes and projective varieties</h2>
        <p>The roots cover the projective-variety clause of <a href="${stacksTag('04L1')}">Definition 33.26.1</a>, including the characterization by a closed embedding in projective space. <a href="${projective}">Lean declarations</a></p>
      </div>
      <section aria-labelledby="lean-graph">
        <h3 id="lean-graph">Navigate the Lean dependency graph</h3>
        <p>Each numbered node opens its Stacks passage. Arrows point down from prerequisites to the passages that use them. The graph maps ${graph.passages} passages in ${graph.sections} sections from a trace that reaches ${mathlib.mathlib_declarations.toLocaleString('en-US')} Mathlib declarations.</p>
        ${renderDependencyGraph(graph, byTag, '../', 'lean-', undefined, createRenderer(root).math)}
      </section>
      <div class="path-scope">
        <p>The trace follows Axiom’s projective-variety declarations and expands the Mathlib declarations reached by that export. For example, Mathlib’s locally ringed spaces use stalks, which are colimits of sections over open neighbourhoods. The graph shows reviewed matches to Stacks prose, with unshown Lean declarations folded into the arrows. <a href="../source/lean-scheme-graph.json">Declaration paths behind the arrows</a> · <a href="https://github.com/leanprover-community/mathlib4/tree/${esc(mathlib.mathlib_commit)}">Pinned Mathlib source</a></p>
        <h3>Axiom-only projection</h3>
        ${compare(schemes, 'scheme')}
        <p>For example, the trace drops <a href="${stacksTag('0078')}">§6.11 Stalks</a>. Mathlib supplies schemes as a library object. It adds <a href="${stacksTag('03NB')}">§59.9 Presheaves</a> because the general Lean functor declaration also carries a tag from that section.</p>

        <h2 id="curves">Algebraic curves</h2>
        <p><a href="${stacksTag('0BYD')}">Lemma 53.9.3</a> has two conclusions. Axiom’s explicit wrappers start with a closed plane subscheme of dimension one, with no embedded points and all irreducible components of dimension one, whose homogeneous ideal is generated by the chosen polynomial. The wrappers build the bundled hypotheses and call the two tagged results. <a href="${esc(data.wrapper_url)}">Lean wrappers</a></p>
        <ul>
          <li>Global functions · ${curves.conclusions.structureSheafCohomologyEquiv_of_explicit.sections} sections reached.</li>
          <li>Genus formula · ${curves.conclusions.genus_eq_of_explicit.sections} sections reached.</li>
        </ul>
        <p>The combined trace reaches ${curves.candidate_total} sections before subtracting material available in the earlier schemes reading. The prose audit reaches ${curves.baseline_total} before that subtraction.</p>
        ${compare(curves, 'curves')}
        <p>The Stacks proof uses exact sheafification on Proj, the cohomology of twists, the affine pushforward comparison, and the long exact sequence. The Lean proof helped check the implicit identification of the quotient with the closed subscheme cut out by its equation. The reading keeps the Stacks route through the Leray and Čech results.</p>
        <p>The projection drops <a href="${stacksTag('01X8')}">§30.2 Čech cohomology of quasi-coherent sheaves</a>. This section is still useful for reading the Stacks proof, which cites it to compare cohomology on a closed subscheme with cohomology of its pushforward.</p>

        <h2>How to read the differences</h2>
        <p>Axiom’s graph treats Mathlib declarations as leaves and contracts paths through untagged project helpers. The explicit curve wrappers themselves sit outside that export. This pilot follows their source calls into the two tagged conclusions and also seeds the tagged references visible in the hypothesis bridge. The wrapper portion is a source audit and may miss elaborated references that the public graph does not expose.</p>
        <p>An added section may be the location of a different tag attached to the same Lean declaration. A dropped section can still be necessary to read the Stacks proof, especially when Lean uses Mathlib or takes a different route. The lists show the effect of the projection before any editorial adjustments.</p>
        <p><a href="https://stacks.axiommath.ai/graph">AxiomMath graph</a> · <a href="https://github.com/AxiomMath/Stacks/tree/${esc(data.axiom_commit)}">Lean release <code>${esc(data.axiom_commit.slice(0, 12))}</code></a> · <a href="../source/lean-dependency-comparison.json">Comparison data and witness paths</a></p>
      </div>
    </main><script type="module" src="../dependency-graph.js"></script>` + footer('../') + '</body></html>';
  const destination = path.join(dist, 'lean-dependencies');
  fs.mkdirSync(destination, {recursive: true});
  fs.writeFileSync(path.join(destination, 'index.html'), page);
}
