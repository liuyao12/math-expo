"""Check/refresh prerequisite coverage for the three selected readings.

Check offline: python3 scripts/audit-dependencies.py
Refresh from the pinned source: python3 scripts/audit-dependencies.py --refresh SOURCE

Explicit references are followed at statement/proof level. Definitions in prose
are attached by their section tags in dependency-scope.json. This is a source
reference audit with a reviewed terminology map, not an automatic proof checker.
"""
from pathlib import Path
import argparse, hashlib, json, re, shutil
from stacks_source import index_source, printing

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
keys = {tag: key for key, tag in tags.items()}
sections, nodes, refs = index_source(source, chapters, tags)
base_refs = read('upstream/references.json')
exceptions = scope['excluded_references']
edges = scope['excluded_edges']
reports, prior = {}, set()
resolved = {}
for spec in specs:
    prior = set().union(*(resolved[slug] for slug in spec.get('prerequisites', [])))
    graph = read('src/' + spec['graph'] + '-dependencies.json')
    seen, todo, reasons, excluded = set(), list(graph), {}, []
    while todo:
        tag = todo.pop()
        if tag in seen: continue
        if tag not in nodes: raise SystemExit('Missing source chapter for required tag ' + tag)
        seen.add(tag)
        node = nodes[tag]
        implicit = scope['implicit_dependencies'].get(tag, {})
        uses = set(node['uses']) | set(graph.get(tag, {}).get('uses', [])) | set(implicit)
        # The setup and definitions preceding a statement belong to its context.
        # Referencing a section imports it whole, but does not recursively turn
        # all its unrelated later theorems into prerequisites of our target.
        if node['section'] != tag:
            uses.add(node['section'])
        for used in sorted(uses):
            key = keys[used]
            reason = edges.get(tag + ':' + used) or exceptions.get(key)
            if key.startswith('sets-'):
                reason = 'Sets and basic undergraduate algebra are assumed.'
            if reason:
                excluded.append(dict(from_tag=tag, to_tag=used, reason=reason)); continue
            reasons.setdefault(used, []).append(dict(from_tag=tag, reason=implicit.get(used, 'Explicit source reference or reviewed graph prerequisite.')))
            todo.append(used)
    required = {nodes[tag]['section'] for tag in seen}
    selected = set(spec['sections'])
    missing = required - selected - prior
    if args.refresh:
        selected = required | set(scope['context_sections'][spec['slug']])
        selected -= prior
        spec['sections'] = sorted(selected, key=lambda t: tuple(map(int, sections[t]['number'].split('.'))))
        # The formula, not a later result cited for comparison, remains the endpoint.
        target_section = nodes[spec['target']]['section']
        later = [t for t in selected if tuple(map(int, sections[t]['number'].split('.'))) > tuple(map(int, sections[target_section]['number'].split('.')))]
        if later: raise SystemExit('Required material occurs after target: ' + ', '.join(later))
    elif missing:
        raise SystemExit(spec['slug'] + ': missing prerequisite sections ' + ', '.join(sorted(missing)))
    reports[spec['slug']] = dict(target=spec['target'], required_tags=sorted(seen),
                                required_sections=sorted(required),
                                reused_sections=sorted(required & prior),
                                implicit_dependencies={t: scope['implicit_dependencies'][t] for t in sorted(seen) if t in scope['implicit_dependencies']},
                                excluded_references=sorted(excluded, key=lambda e: (e['from_tag'], e['to_tag'])))
    resolved[spec['slug']] = prior | selected
    print(f"{spec['slug']}: {len(seen)} required source passages; {len(required)} owner sections; {len(required & (prior-selected))} reused sections; no uncovered prerequisites" + (f" ({len(missing)} sections added)" if args.refresh else ''))

report = dict(commit=read('upstream/manifest.json')['commit'], assumed_background=['Sets and functions', 'Basic undergraduate algebra'], readings=reports)
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
