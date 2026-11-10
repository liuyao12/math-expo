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
    '01HB': ('Locally ringed space', G + 'LocallyRingedSpace', G + 'LocallyRingedSpace.Hom'),
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
    '004J': ('Open neighbourhood', 'TopologicalSpace.OpenNhds'),
    '004K': ('Open covering', 'TopologicalSpace.IsOpenCover'),
    '002F': ('Colimit', 'CategoryTheory.Limits.colimit'),
    '002E': ('Limit', 'CategoryTheory.Limits.limit'),
    '0017': ('Isomorphism', 'CategoryTheory.Iso'),
    '001B': ('Functor', 'CategoryTheory.Functor'),
    '0014': ('Category', 'CategoryTheory.Category'),
    '001M': ('Opposite category', 'CategoryTheory.Category.opposite'),
    '001V': ('Fibre products', 'CategoryTheory.Limits.pullback'),
    '01JM': ('Existence of fibre products of schemes', G + 'Scheme.Pullback.instHasPullbacks'),
    '01NF': ('Projective space', G + 'projectiveSpaceOver'),
    '01OE': ('Projective bundle of a free module',
             'Stacks.SymGraded.projectiveBundleIsoProjectiveSpace'),
    '01OK': ('Integral schemes', G + 'IsIntegral'),
    '01KK': ('Separated morphisms', G + 'IsSeparated'),
    '01T1': ('Morphisms of finite type', G + 'LocallyOfFiniteType'),
    '01K3': ('Quasi-compact morphisms', G + 'QuasiCompact'),
    '01IO': ('Open and closed immersions', G + 'IsOpenImmersion', G + 'IsClosedImmersion'),
    '01IK': ('Open subschemes', G + 'Scheme.Opens.toScheme'),
    '01HW': ('Affine scheme', G + 'IsAffine'),
    '01I7': ('Sheaf associated to a module', G + 'tilde',
             G + 'instIsQuasicoherentOpensCarrierCarrierCommRingCatSpecTilde'),
    '01BE': ('Quasi-coherent modules', 'SheafOfModules.IsQuasicoherent'),
    '01B5': ('Modules of finite type', 'SheafOfModules.IsFiniteType'),
    '01AM': ('Generating sections', 'SheafOfModules.GeneratingSections'),
    '01B2': ('Locally generated modules', 'SheafOfModules.LocalGeneratorsData'),
    '0077': ('Sheaves of modules', 'SheafOfModules'),
    '006Q': ('Presheaves of modules', 'PresheafOfModules'),
    '01LH': ('Relative gluing', G + 'Scheme.Cover.RelativeGluingData.glued'),
    '01NN': ('Graded algebra for relative Proj',
             'Stacks.AlgebraicGeometry.RelativeProjBridge.SheafGradedAlgebra'),
    '01NQ': ('Relative Proj', 'Stacks.AlgebraicGeometry.RelativeProj.relativeProj'),
    '01NO': ('The affine charts of relative Proj',
             'Stacks.AlgebraicGeometry.RelativeProj.projInclusionDomain_eq_top'),
    '01MY': ('Functoriality of Proj', 'Stacks.AlgebraicGeometry.ProjShared.mapDomain'),
    '01CK': ('Symmetric powers and quasi-coherence',
             'Stacks.SymGraded.isQuasicoherentPieces_of_isQuasicoherent'),
    '01W9': ('H-projective implies projective', G + 'IsProjectiveMorphism.isProjective'),
    '005A': ('Quasi-compact spaces', 'IsCompact'),
    '002U': ('Colimits of sets', 'CategoryTheory.Limits.Types.colimitCocone'),
    '04AX': ('Filtered colimits', 'CategoryTheory.IsFiltered'),
    '006M': ('Presheaves of algebraic structures', G + 'PresheafedSpace'),
    '0071': ('Sheaves of algebraic structures', 'TopCat.Sheaf'),
    '007X': ('Sheafification', 'CategoryTheory.GrothendieckTopology.sheafify'),
    '008C': ('Pushforward of presheaves', 'TopCat.Presheaf.pushforward'),
    '00E0': ('Standard opens form a basis', 'PrimeSpectrum.isBasis_basic_opens'),
    '02C5': ('Localization at a prime', 'Localization.AtPrime'),
    '00F3': ('Ring maps of finite type', 'RingHom.FiniteType'),
    '00HB': ('Flat modules', 'Module.Flat'),
    '00CV': ('Tensor products', 'TensorProduct'),
    '0517': ('Finite modules', 'Module.Finite'),
    '01IR': ('Affine opens and open covers of schemes', G + 'IsAffineOpen'),
    '01JY': ('Base change of open immersions', G + 'isOpenImmersion_stableUnderBaseChange'),
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
    axiom_reached = reachable(uses, roots)
    library = read(data / 'library.json')['entities']
    mathlib_modules = {
        decl['name']: decl['module']
        for entity in library.values() for decl in entity.get('declarations', [])
        if decl['name'] in axiom_reached and decl['module'].startswith('Mathlib.')
    }
    missing = set(mathlib_modules) - set(mathlib_uses)
    if missing:
        raise ValueError('Mathlib trace misses declarations from the Axiom export: ' + ', '.join(sorted(missing)))
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
        'mathlib_roots': dict(sorted(mathlib_modules.items())),
        'nodes': nodes,
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
