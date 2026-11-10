"""Project the pinned Axiom and Mathlib traces onto navigable Stacks passages.

Usage: python3 scripts/project-lean-graph.py AXIOM_DATA MATHLIB_TRACE MATHLIB_REV
"""
from collections import deque
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
G = 'AlgebraicGeometry.'
TARGET = '04L1'
# Anchor declarations by mathematical meaning, rather than using every tag
# that happens to be attached to a general-purpose Mathlib declaration.
MATCHES = {
    TARGET: ('Projective variety', G + 'IsProjectiveVariety',
             G + "isProjectiveVariety_iff_isProjective'",
             G + 'isProjectiveVariety_iff_isProjectiveMorphism'),
    '020D': ('Variety', G + 'IsVariety'),
    '01W8': ('Projective morphisms', G + 'IsProjective', G + 'IsProjectiveMorphism'),
    '01MB': ('Proj is a scheme', G + 'Proj'),
    '01MA': ('Standard opens of Proj are spectra', G + 'projIsoSpec'),
    '01M6': ('Structure sheaf of Proj', G + 'ProjectiveSpectrum.Proj.structureSheaf'),
    '00JM': ('Projective spectrum', 'ProjectiveSpectrum'),
    '00JL': ('Graded rings', 'GradedRing'),
    '01IJ': ('Scheme', G + 'Scheme'),
    '01HB': ('Locally ringed space', G + 'LocallyRingedSpace'),
    '01HV': ('The locally ringed spectrum', G + 'Spec.locallyRingedSpaceObj'),
    '01HU': ('Structure sheaf of the spectrum', G + 'Spec.structureSheaf'),
    '0091': ('Ringed space', G + 'SheafedSpace'),
    '07BI': ('Local ring', 'IsLocalRing'),
    '00E1': ('Zariski topology', 'PrimeSpectrum.zariskiTopology'),
    '00DZ': ('Prime spectrum', 'PrimeSpectrum'),
    '00CO': ('Localization', 'IsLocalization'),
    '0078': ('Stalks', 'TopCat.Presheaf.stalk'),
    '006T': ('Sheaf', 'TopCat.Presheaf.IsSheaf'),
    '006E': ('Presheaf', 'TopCat.Presheaf'),
    '004O': ('Bases', 'TopologicalSpace.IsTopologicalBasis'),
    '004J': ('Neighbourhood', 'TopologicalSpace.OpenNhds'),
    '002F': ('Colimit', 'CategoryTheory.Limits.colimit'),
    '002E': ('Limit', 'CategoryTheory.Limits.limit'),
    '0017': ('Isomorphism', 'CategoryTheory.Iso'),
    '001B': ('Functor', 'CategoryTheory.Functor'),
    '0014': ('Category', 'CategoryTheory.Category'),
}


def reachable(uses, roots):
    seen = set(roots)
    pending = list(roots)
    for name in pending:
        for dependency in uses.get(name, []):
            if dependency not in seen:
                seen.add(dependency)
                pending.append(dependency)
    return seen


def project(uses):
    tag_for = {name: tag for tag, (_, *names) in MATCHES.items() for name in names}
    roots = MATCHES[TARGET][1:]
    closure = reachable(uses, roots)
    graph = {}
    for tag, (title, *names) in MATCHES.items():
        names = [name for name in names if name in closure]
        if not names:
            raise ValueError(f'No matched declaration reached for {tag}')
        queue = deque(names)
        parent = dict.fromkeys(names)
        edges = {}
        while queue:
            consumer = queue.popleft()
            for dependency in uses.get(consumer, []):
                if dependency in parent:
                    continue
                parent[dependency] = consumer
                dependency_tag = tag_for.get(dependency)
                if dependency_tag is None or dependency_tag == tag:
                    queue.append(dependency)
                elif dependency_tag not in edges:
                    chain = [dependency]
                    while parent[chain[-1]] is not None:
                        chain.append(parent[chain[-1]])
                    edges[dependency_tag] = chain[::-1]
        graph[tag] = {'title': title, 'declarations': names, 'uses': edges}

    # Transitive reduction of the displayed graph. Keep witness chains for every
    # visible arrow, and fail rather than silently breaking a projected cycle.
    edges = {tag: list(node['uses']) for tag, node in graph.items()}
    for tag, node in graph.items():
        descendants = {child: reachable(edges, [child]) for child in edges[tag]}
        if any(tag in branch for branch in descendants.values()):
            raise ValueError(f'Cycle in the Stacks projection at {tag}')
        node['uses'] = {
            child: chain for child, chain in node['uses'].items()
            if all(child not in branch for other, branch in descendants.items() if other != child)
        }
    if reachable({tag: node['uses'] for tag, node in graph.items()}, [TARGET]) != set(graph):
        raise ValueError('Unreachable Stacks passage in the projection')
    return graph, closure


def main():
    data, trace, mathlib_commit = sys.argv[1:]
    data, trace = Path(data), Path(trace)
    read = lambda path: json.loads(path.read_text())
    summary = read(data / 'summary.json')
    graph = read(data / 'graph.json')['proof_graph']
    if graph['basis'] != 'lean-declarations':
        raise ValueError('Expected the Axiom declaration graph')
    axiom_names = [node['name'] for node in graph['nodes']]
    uses = {}
    for consumer, dependency in read(data / 'graph-edges.json')['proof_edges']:
        uses.setdefault(axiom_names[consumer], []).append(axiom_names[dependency])
    roots = MATCHES[TARGET][1:]
    if not all(name in uses for name in roots):
        raise ValueError('Missing Axiom declaration roots')
    mathlib_uses = dict(map(json.loads, trace.read_text().splitlines()))
    if not {G + 'Scheme', G + 'Proj'}.issubset(mathlib_uses):
        raise ValueError('Mathlib trace must reach the scheme and Proj declarations')
    if any(name not in mathlib_uses for deps in mathlib_uses.values() for name in deps):
        raise ValueError('Mathlib trace is incomplete')
    uses.update(mathlib_uses)
    nodes, reached = project(uses)
    result = {
        'target': TARGET,
        'axiom_commit': summary['repo_commit'],
        'mathlib_commit': mathlib_commit,
        'mathlib_trace_sha256': hashlib.sha256(trace.read_bytes()).hexdigest(),
        'mathlib_declarations': len(reached & mathlib_uses.keys()),
        'nodes': nodes,
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
