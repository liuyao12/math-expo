import fs from 'node:fs';
import path from 'node:path';
import {escapeHTML as esc} from '../src/latex.mjs';
import {renderDependencyGraph} from '../public/graph-render.js';

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

function schemeGraph({sectionForTag, references}, reading, trace) {
  const byTag = new Map(Object.values(references).map(ref => [ref.tag, ref]));
  const selected = new Set(reading.sections.map(section => section.tag));
  const nodes = {};
  const locations = new Map();
  const groups = new Map();
  const labels = {definitions: {}, namedResults: {}, itemTerms: {}};
  for (const [tag, node] of Object.entries(trace.nodes)) {
    const section = sectionForTag.get(tag);
    if (!section || !selected.has(section.tag) || !byTag.has(tag)) {
      throw Error('Missing Stacks reading location for Lean graph node ' + tag);
    }
    nodes[tag] = {title: node.title, uses: Object.keys(node.uses)};
    locations.set(tag, {slug: reading.slug, readingTitle: reading.readingTitle, section});
    groups.set(section.tag, (groups.get(section.tag) || 0) + 1);
    labels.definitions[tag] = node.title;
    labels.namedResults[tag] = node.title;
    labels.itemTerms[tag] = node.title;
  }
  for (const [tag, count] of groups) {
    if (count < 2 || nodes[tag]) continue;
    const section = sectionForTag.get(tag);
    nodes[tag] = {title: section.title, frameOnly: true, uses: []};
    locations.set(tag, {slug: reading.slug, readingTitle: reading.readingTitle, section});
  }
  return {
    html: renderDependencyGraph({nodes, locations, labels, rootTag: trace.target}, byTag, '../', 'lean-'),
    passages: Object.keys(trace.nodes).length,
    sections: groups.size
  };
}

export function buildLeanComparison({root, dist, head, header, footer, readings, catalog}) {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'upstream/lean-dependency-comparison.json'), 'utf8'));
  const {schemes, curves} = data;
  const mathlib = JSON.parse(fs.readFileSync(path.join(root, 'upstream/lean-scheme-graph.json'), 'utf8'));
  if (mathlib.axiom_commit !== data.axiom_commit) throw Error('Axiom releases differ across the Lean pilot');
  const graph = schemeGraph(catalog, readings.find(reading => reading.slug === 'scheme'), mathlib);
  const projective = `https://github.com/AxiomMath/Stacks/blob/${data.axiom_commit}/StacksFrontier/AlgebraicGeometry/Variety/Defs/Projective.lean#L80-L115`;
  const compare = (trace, slug) => {
    const reading = readings.find(reading => reading.slug === slug);
    const current = new Set(reading.sections.map(section => section.tag));
    if (trace.baseline !== current.size
        || trace.added.some(row => current.has(row.tag))
        || trace.dropped.some(row => !current.has(row.tag))
        || trace.candidate !== trace.baseline + trace.added.length - trace.dropped.length
        || trace.candidate_total !== trace.candidate + trace.reused) {
      throw Error('Stale Lean comparison for ' + slug);
    }
    const reused = trace.reused ? ` Another ${trace.reused} sections are already in the schemes reading.` : '';
    return `<p><a href="../${slug}/">Current reading</a> · ${trace.baseline} sections. The projected Lean selection has ${trace.candidate} sections, with ${trace.retained} in both selections.${reused}</p>
      ${sectionList(trace.added, 'Sections added by the Lean trace')}
      ${sectionList(trace.dropped, 'Sections dropped by the Lean trace')}`;
  };
  const title = 'Lean dependency pilot';
  const description = 'Compare the Stacks reading selections with dependencies traced through AxiomMath’s Lean declarations.';
  const page = head(title, '../', description) + header('../') + `
    <main id="main" class="path-page home">
      <section class="path-intro">
        <p class="eyebrow">Selected readings</p>
        <h1>${title}</h1>
        <p class="lead">Which Stacks sections would we read if we followed the Lean dependencies?</p>
      </section>
      <div class="path-scope">
        <p>The comparison starts with particular Lean declarations, follows AxiomMath’s proof edges, and looks up the Stacks section for each reached tag. It counts a section once even when several declarations point to it. Both readings continue to display the original Stacks prose and proofs.</p>

        <h2 id="schemes">Schemes and projective varieties</h2>
        <p>The roots cover the projective-variety clause of <a href="${stacksTag('04L1')}">Definition 33.26.1</a>, including the characterization by a closed embedding in projective space. <a href="${projective}">Lean declarations</a></p>
      </div>
      <section aria-labelledby="lean-graph">
        <h3 id="lean-graph">Navigate the Lean dependency graph</h3>
        <p>Each numbered node opens its Stacks passage. Arrows point down from prerequisites to the passages that use them. The graph maps ${graph.passages} passages in ${graph.sections} sections from a trace that reaches ${mathlib.mathlib_declarations.toLocaleString('en-US')} Mathlib declarations.</p>
        ${graph.html}
      </section>
      <div class="path-scope">
        <p>In this graph we open the Mathlib declarations for schemes and Proj, and join their dependencies to Axiom’s projective-variety declarations. For example, Mathlib’s locally ringed spaces use stalks, which are colimits of sections over open neighbourhoods. The graph shows reviewed matches to Stacks prose, with unshown Lean declarations folded into the arrows. <a href="../source/lean-scheme-graph.json">Declaration paths behind the arrows</a> · <a href="https://github.com/leanprover-community/mathlib4/tree/${esc(mathlib.mathlib_commit)}">Pinned Mathlib source</a></p>
        <h3>Original Axiom-only comparison</h3>
        ${compare(schemes, 'scheme')}
        <p>For example, the trace drops <a href="${stacksTag('0078')}">§6.11 Stalks</a>. Mathlib supplies schemes as a library object. It adds <a href="${stacksTag('03NB')}">§59.9 Presheaves</a> because the general Lean functor declaration also carries a tag from that section.</p>

        <h2 id="curves">Algebraic curves</h2>
        <p><a href="${stacksTag('0BYD')}">Lemma 53.9.3</a> has two conclusions. Axiom’s explicit wrappers start with a closed plane subscheme of dimension one, with no embedded points and all irreducible components of dimension one, whose homogeneous ideal is generated by the chosen polynomial. The wrappers build the bundled hypotheses and call the two tagged results. <a href="${esc(data.wrapper_url)}">Lean wrappers</a></p>
        <ul>
          <li>Global functions · ${curves.conclusions.structureSheafCohomologyEquiv_of_explicit.sections} sections reached.</li>
          <li>Genus formula · ${curves.conclusions.genus_eq_of_explicit.sections} sections reached.</li>
        </ul>
        <p>The combined trace reaches ${curves.candidate_total} sections before subtracting material available in the current schemes reading. The current prose audit reaches ${curves.baseline_total} before that subtraction.</p>
        ${compare(curves, 'curves')}
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
