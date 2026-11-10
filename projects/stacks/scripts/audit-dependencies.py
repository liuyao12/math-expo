"""Check/refresh prerequisite coverage for the three selected readings.

Check offline: python3 scripts/audit-dependencies.py
Refresh from the pinned source: python3 scripts/audit-dependencies.py --refresh SOURCE

Schemes uses the mapped Lean declaration graph. Later readings follow
explicit references at statement/proof level. Definitions in prose
have explicit passage boundaries in dependency-scope.json. Only the final target
seeds traversal. Complete owner sections and overview graphs never schedule
additional prerequisites. This is not an automatic proof checker.
"""
from pathlib import Path
import argparse, hashlib, json, re, shutil
from stacks_source import index_source
from dependency_plan import plan

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--refresh', type=Path)
args = parser.parse_args()
read = lambda name: json.loads((root / name).read_text())
write = lambda name, value: (root / name).write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')
scope = read('src/dependency-scope.json')
specs = read('src/readings.json')
chapters = read('src/chapters.json')
source = args.refresh or root / 'upstream/chapters'
if args.refresh:
    for file in (root / 'upstream/chapters').glob('*.tex'):
        if (source / file.name).exists() and file.read_bytes() != (source / file.name).read_bytes():
            raise SystemExit('Source differs from the retained pinned edition: ' + file.name)
tagfile = source / 'tags/tags' if args.refresh else root / 'upstream/tags'
tags = {label: tag for tag, label in (line.split(',', 1) for line in tagfile.read_text().splitlines()
                                    if line and not line.startswith('#'))}
sections, nodes, refs = index_source(source, chapters, tags)
base_refs = read('upstream/references.json')

def lean_plan(target, trace):
    if trace['target'] != target:
        raise ValueError('Lean graph target differs from the reading target')
    graph = trace['nodes']
    paths, passages = {target: []}, {}
    pending = [target]
    for tag in pending:
        dependencies = []
        for used, chain in graph[tag]['uses'].items():
            if len(chain) < 2 or chain[0] not in graph[tag]['declarations'] or chain[-1] not in graph[used]['declarations']:
                raise ValueError(f'Invalid Lean witness for {used} → {tag}')
            dependencies.append(dict(tag=used, reason='Lean declaration dependency.', lean_path=chain))
            if used not in paths:
                paths[used] = paths[tag] + [tag]
                pending.append(used)
        node = nodes[tag]
        passages[tag] = dict(section=node['section'], text_sha256=hashlib.sha256(node['text'].encode()).hexdigest(),
                             dependencies=dependencies)
    if set(pending) != set(graph):
        raise ValueError('Unreachable node in the Lean graph')
    return dict(required_tags=sorted(graph), required_sections=sorted({p['section'] for p in passages.values()}),
                passages=passages, paths=paths, excluded_references=[], method='lean')

reports, prior = {}, set()
resolved = {}
for spec in specs:
    prior = set().union(*(resolved[slug] for slug in spec.get('prerequisites', [])))
    try:
        if spec.get('dependencySource') == 'lean':
            result = lean_plan(spec['target'], read('upstream/lean-scheme-graph.json'))
        else:
            result = plan(spec['target'], nodes, sections, tags, scope)
    except (ValueError, KeyError) as error:
        raise SystemExit(str(error))
    required = set(result['required_sections'])
    selected = set(spec['sections'])
    missing = required - selected - prior
    if args.refresh:
        selected = required.copy()
        selected -= prior
        spec['sections'] = sorted(selected, key=lambda t: tuple(map(int, sections[t]['number'].split('.'))))
        # The formula, not a later result cited for comparison, remains the endpoint.
        target_section = nodes[spec['target']]['section']
        later = [t for t in selected if tuple(map(int, sections[t]['number'].split('.'))) > tuple(map(int, sections[target_section]['number'].split('.')))]
        if later: raise SystemExit('Required material occurs after target: ' + ', '.join(later))
    elif missing:
        raise SystemExit(spec['slug'] + ': missing prerequisite sections ' + ', '.join(sorted(missing)))
    for tag, reason in scope.get('excluded_branches', {}).get(spec['slug'], {}).items():
        if tag in result['required_tags']:
            raise SystemExit('Unrelated branch reintroduced in ' + spec['slug'] + ': ' + tag + ' (' + reason + ')')
    expected_sections = required - prior
    if not args.refresh and selected != expected_sections:
        raise SystemExit(spec['slug'] + ': sections outside target dependencies: ' + ', '.join(sorted(selected - expected_sections)))
    reports[spec['slug']] = dict(target=spec['target'], target_label=spec.get('targetLabel'), **result,
                                reused_sections=sorted(required & prior),
                                implicit_dependencies={t: scope['implicit_dependencies'][t] for t in result['required_tags']
                                                       if result.get('method') != 'lean' and t in scope['implicit_dependencies']})
    resolved[spec['slug']] = prior | selected
    print(f"{spec['slug']}: {len(result['required_tags'])} required source passages; {len(required)} owner sections; {len(required & (prior-selected))} reused sections; target dependency coverage verified" + (f" ({len(missing)} sections added)" if args.refresh else ''))

report = dict(format_version=2, traversal='Final target only; whole sections are import units, not traversal seeds.', commit=read('upstream/manifest.json')['commit'], assumed_background=['Sets and functions', 'Basic undergraduate algebra'], readings=reports)
if args.refresh:
    write('src/readings.json', specs)
    # The tag index is metadata, not mathematical text; normalize trailing space
    # in upstream comments without changing any tag/label pairs.
    (root / 'upstream/tags').write_text('\n'.join(line.rstrip() for line in tagfile.read_text().splitlines()) + '\n')
    # Store each whole source section once, preserving the original source bytes.
    catalog = read('upstream/sections.json')
    selected_tags = set(catalog) | {t for spec in specs for t in spec['sections']}
    needed_refs = set()
    for tag in selected_tags:
        s = sections[tag]
        filename = s['chapter'] + '-' + s['label'].removeprefix('section-')
        (root / 'upstream/sections' / (filename + '.tex')).write_text(s['text'])
        shutil.copyfile(source / (s['chapter'] + '.tex'), root / 'upstream/chapters' / (s['chapter'] + '.tex'))
        entry = {k: v for k, v in s.items() if k not in ('text', 'key')}
        entry.update(slug=filename, kind='section', sha256=hashlib.sha256(s['text'].encode()).hexdigest())
        entry['title'] = entry['title'].replace(r'{\v C}', 'Č')
        catalog[tag] = entry
        for label in re.findall(r'\\(?:ref|eqref|label)\{([^}]+)\}', s['text']):
            needed_refs.add(label if label in refs else s['chapter'] + '-' + label)
    for key in needed_refs:
        if key not in refs: raise SystemExit('Missing source reference metadata ' + key)
        base_refs.setdefault(key, refs[key])
    write('upstream/sections.json', catalog)
    write('upstream/references.json', base_refs)
    write('upstream/dependency-audit.json', report)
else:
    if read('upstream/dependency-audit.json') != report:
        raise SystemExit('Dependency audit is stale; refresh against the pinned source.')
