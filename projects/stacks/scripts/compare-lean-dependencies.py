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
    }
    for name, root in wrappers.items():
        parents = trace([root, *AUXILIARY])
        result['curves'].setdefault('conclusions', {})[name] = {
            'declarations': len(parents), 'sections': len(section_witnesses(parents))}
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
