"""Compare Axiom's published Lean declaration graph with the selected readings.

Run with the pinned Stacks source and a directory containing Axiom's public
graph.json, graph-edges.json, summary.json and PlaneCurveGenusExplicit.lean.
"""
import argparse
from collections import defaultdict, deque
import hashlib
import json
from pathlib import Path

from stacks_source import index_source

ROOT = Path(__file__).resolve().parents[1]
PROJECT = 'https://github.com/AxiomMath/Stacks'
CURVE = 'AlgebraicGeometry.ProjectiveSpectrum.Proj.'
GEOMETRY = 'AlgebraicGeometry.'
WRAPPER = 'StacksFrontier/AlgebraicGeometry/Curves/PlaneCurveGenusExplicit.lean'
AUXILIARY = (
    'irreducibleComponents',
    'topologicalKrullDim',
    'topologicalKrullDim_eq_bot_iff_isEmpty',
    CURVE + 'idealOfClosedSubscheme_isHomogeneous',
)


GRR_ROOTS = {
    '02UL': 'Stacks.Chow.exists_splittingMorphism_isProjective',
    '02TX': 'Stacks.Chow.bijective_projectiveBundleFormulaMap',
    '02S1': 'Stacks.Chow.flatPullbackFactorsThroughRationalEquivalence_general',
    '02R4': 'Stacks.Chow.properPushforward',
    '02S2': 'Stacks.Chow.properPushforward_rationallyEquivalent_of_isProper',
    '02G1': GEOMETRY + 'Scheme.Hom.isFiniteLocallyFree_relativeDifferentials',
    '01E4': 'Stacks.Cohomology.HigherDirectImagePresheaf.higherDirectImage_iso_sheafify_preimageCohomology',
    '0FE1': 'Stacks.Chow.canonicalChernClass',
}
# Check the declaration path for each mathematical correspondence reviewed in
# the Stacks audit. Other tags on the same Lean constants do not seed selection.
GRR_MATCHES = {
    ('02R4', '02QP'): 'Stacks.Chow.deltaDimension',
    ('02UL', '01U3'): GEOMETRY + 'Flat',
    ('02UL', '02NJ'): GEOMETRY + 'RelativeDimension',
    ('02TX', '01OB'): 'Stacks.RelativeProj.projectiveBundle',
    ('02S1', '02RB'): 'Stacks.Chow.flatPullback',
    ('02G1', '08RP'): GEOMETRY + 'SheafOfModules.moduleOfDifferentials',
}
GRR_PROSE = ('02UM', '02UN', '02UO')

def read(path):
    return json.loads(path.read_text())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('axiom', type=Path)
    args = parser.parse_args()
    source = args.source
    for retained in (ROOT / 'upstream/chapters').glob('*.tex'):
        if retained.read_bytes() != (source / retained.name).read_bytes():
            raise ValueError(f'Stacks source differs from the pinned edition: {retained.name}')
    tag_lines = (source / 'tags/tags').read_text().splitlines()
    if [line.rstrip() for line in tag_lines] != (ROOT / 'upstream/tags').read_text().splitlines():
        raise ValueError('Stacks tag index differs from the pinned edition')
    tags = {label: tag for tag, label in (line.split(',', 1) for line in tag_lines
                                        if line and not line.startswith('#'))}
    sections, passages, _ = index_source(source, read(ROOT / 'src/chapters.json'), tags)
    axiom = args.axiom
    summary = read(axiom / 'summary.json')
    graph = read(axiom / 'graph.json')['proof_graph']
    if graph['basis'] != 'lean-declarations':
        raise ValueError('Expected the declaration graph')
    nodes = graph['nodes']
    declarations = {node['name']: index for index, node in enumerate(nodes)}
    uses = defaultdict(list)
    for consumer, prerequisite in read(axiom / 'graph-edges.json')['proof_edges']:
        uses[consumer].append(prerequisite)

    def trace(names):
        roots = [declarations[name] for name in names]
        parents = {index: None for index in roots}
        todo = deque(roots)
        while todo:
            index = todo.popleft()
            for dependency in uses[index]:
                if dependency not in parents:
                    parents[dependency] = index
                    todo.append(dependency)
        return parents

    def section_witnesses(parents):
        result = {}
        for index in parents:
            for tag in nodes[index]['tags']:
                owner = passages[tag]['section']
                if owner in result:
                    continue
                chain = []
                current = index
                while current is not None:
                    chain.append(nodes[current]['name'])
                    current = parents[current]
                result[owner] = {'tag': tag, 'chain': chain[::-1]}
        return result

    specs = {spec['slug']: set(spec['sections']) for spec in read(ROOT / 'src/readings.json')}
    audit = read(ROOT / 'upstream/dependency-audit.json')['readings']

    def rows(tags, witnesses):
        return [
            {'tag': tag, 'number': sections[tag]['number'],
             'title': sections[tag]['title'].replace(r'{\v C}', 'Č'),
             **({'witness': witnesses[tag]} if tag in witnesses else {})}
            for tag in sorted(tags, key=lambda tag: tuple(map(int, sections[tag]['number'].split('.'))))
        ]

    def compare(slug, roots, prior):
        parents = trace(roots)
        owners = section_witnesses(parents)
        candidate = set(owners) - prior
        old = specs[slug]
        return {'declarations': len(parents), 'baseline': len(old), 'candidate': len(candidate),
                'retained': len(candidate & old), 'reused': len(set(owners) & prior),
                'baseline_total': len(audit[slug]['required_sections']), 'candidate_total': len(owners),
                'added': rows(candidate - old, owners), 'dropped': rows(old - candidate, owners),
                'roots': roots}

    scheme_roots = [GEOMETRY + name for name in ('IsProjectiveVariety',
                    "isProjectiveVariety_iff_isProjective'", 'isProjectiveVariety_iff_isProjectiveMorphism')]
    global_functions = CURVE + 'planeCurveGlobalSectionsEquiv'
    genus = CURVE + 'genus_planeCurve'
    wrapper_file = axiom / Path(WRAPPER).name
    wrapper = wrapper_file.read_text()
    # The explicit wrappers are absent from the tag graph. Verify the source
    # handoff to the two proof roots and the named, tagged bridge references.
    wrappers = {'structureSheafCohomologyEquiv_of_explicit': global_functions,
                'genus_eq_of_explicit': genus}
    for name, root in wrappers.items():
        declaration = wrapper.split(name + ' {Z', 1)[1]
        if root.rsplit('.', 1)[1] + ' (planeCurveDataOfExplicit' not in declaration.split('\n\n', 1)[0]:
            raise ValueError(f'Explicit wrapper no longer calls {root}')
    for name in AUXILIARY:
        if name.rsplit('.', 1)[-1] not in wrapper.split('theorem nonempty_of_topologicalKrullDim_eq_one', 1)[1]:
            raise ValueError(f'Missing explicit bridge reference {name}')
    curve_roots = [global_functions, genus, *AUXILIARY]
    grr_traces = {tag: trace([name]) for tag, name in GRR_ROOTS.items()}
    grr_links = []
    for (start, end), name in GRR_MATCHES.items():
        index = declarations[name]
        parents = grr_traces[start]
        if start not in nodes[declarations[GRR_ROOTS[start]]]['tags'] or end not in nodes[index]['tags']:
            raise ValueError(f'GRR correspondence has changed: {start} to {end}')
        chain = []
        while index is not None:
            chain.append(nodes[index]['name'])
            index = parents[index]
        grr_links.append({'from_tag': start, 'to_tag': end, 'chain': chain[::-1]})
    result = {
        'stacks_commit': read(ROOT / 'upstream/manifest.json')['commit'],
        'axiom_commit': summary['repo_commit'],
        'axiom_reference_commit': summary['ilean_commit'],
        'export_date': summary['generated_at'],
        'boundary': graph['boundary'],
        'input_hashes': {name: hashlib.sha256((axiom / name).read_bytes()).hexdigest()
                         for name in ('graph.json', 'graph-edges.json', 'summary.json', wrapper_file.name)},
        'wrapper_url': f'{PROJECT}/blob/{summary["repo_commit"]}/{WRAPPER}',
        'wrapper_roots': wrappers,
        'bridge_references': list(AUXILIARY),
        'schemes': compare('scheme', scheme_roots, set()),
        'curves': compare('curves', curve_roots, specs['scheme']),
        'grr': {
            'roots': GRR_ROOTS,
            'unmatched_sections': [tag for tag in GRR_PROSE if not any(tag in node['tags'] for node in nodes)],
            'links': grr_links,
        },
    }
    for name, root in wrappers.items():
        parents = trace([root, *AUXILIARY])
        result['curves'].setdefault('conclusions', {})[name] = {
            'declarations': len(parents), 'sections': len(section_witnesses(parents))}
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
