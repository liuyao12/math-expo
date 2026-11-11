"""Target-rooted source dependencies, independent of the displayed overview.

Importing a whole section never schedules its statements or introduction.
Section references and definitions in prose have explicit, reviewed scopes.
"""
import collections
import hashlib
import re


def passage_text(tag, nodes, sections, scope):
    node = nodes[tag]
    rule = scope.get('passage_scopes', {}).get(tag)
    if node['kind'] == 'section' and rule is None:
        raise ValueError('Review the referenced section before expanding it: ' + tag + ' ' + node['key'])
    if rule is None:
        return node['text']
    if node['kind'] not in ('section', 'example', 'remark', 'notation', 'discussion'):
        raise ValueError('Do not truncate a required statement or its proof: ' + tag)
    if not rule.get('reason'):
        raise ValueError('Missing scope justification for ' + tag)
    if rule.get('part') == 'none':
        return ''
    if rule.get('part') == 'introduction':
        return nodes[node['section']]['text']
    if rule.get('part') == 'fragments':
        from stacks_source import printing
        source = printing(sections[node['section']]['text'])
        parts = []
        for fragment in rule['fragments']:
            try:
                start = source.index(fragment['from'])
                end = source.index(fragment['to'], start) if fragment.get('to') else len(source)
            except ValueError as error:
                raise ValueError('Prose boundary not found in ' + tag + ': ' + str(fragment)) from error
            if end <= start:
                raise ValueError('Empty prose fragment in ' + tag)
            parts.append(source[start:end])
        return '\n\n'.join(parts)
    raise ValueError('Unknown passage scope for ' + tag)


def direct_dependencies(tag, nodes, sections, tags, scope):
    text = passage_text(tag, nodes, sections, scope)
    chapter = sections[nodes[tag]['section']]['chapter']
    uses = {}
    for label in re.findall(r'\\(?:ref|eqref)\{([^}]+)\}', text):
        key = label if label in tags else chapter + '-' + label
        uses[tags[key]] = 'Reference in the required statement, proof, or selected prose passage.'
    for used, reason in scope.get('implicit_dependencies', {}).get(tag, {}).items():
        uses[used] = reason
    rule = scope.get('passage_scopes', {}).get(tag, {})
    for used in rule.get('requires', []):
        uses[used] = rule['reason']
    uses.pop(tag, None)
    return uses, hashlib.sha256(text.encode()).hexdigest()


def plan(target, nodes, sections, tags, scope):
    keys = {tag: key for key, tag in tags.items()}
    excluded_edges = {**scope.get('excluded_edges', {}),
                      **scope.get('target_excluded_edges', {}).get(target, {})}
    context = scope.get('target_context', {}).get(target, {})
    queue, seen = collections.deque([target]), set()
    paths, excluded, passages = {target: []}, [], {}
    while queue:
        tag = queue.popleft()
        if tag in seen:
            continue
        if tag not in nodes:
            raise ValueError('Missing source for required tag ' + tag)
        seen.add(tag)
        uses, digest = direct_dependencies(tag, nodes, sections, tags, scope)
        if tag == target:
            uses.update(context)
        passages[tag] = dict(section=nodes[tag]['section'], text_sha256=digest, dependencies=[])
        for used, reason in sorted(uses.items()):
            key = keys[used]
            omission = excluded_edges.get(tag + ':' + used) or scope.get('excluded_references', {}).get(key)
            if key.startswith('sets-'):
                omission = 'Sets and functions are assumed.'
            if omission:
                excluded.append(dict(from_tag=tag, to_tag=used, reason=omission))
                continue
            dependency = dict(tag=used, reason=reason)
            if tag == target and used in context:
                dependency['context'] = True
            passages[tag]['dependencies'].append(dependency)
            if used not in paths:
                paths[used] = paths[tag] + [tag]
                queue.append(used)
    required_sections = {nodes[tag]['section'] for tag in seen}
    return dict(required_tags=sorted(seen), required_sections=sorted(required_sections),
                passages=passages, paths=paths,
                excluded_references=sorted(excluded, key=lambda edge: (edge['from_tag'], edge['to_tag'])))
