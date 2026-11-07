"""Index the pinned source without mistaking a section for a single theorem.

Numbered statements include their proofs. Section nodes describe introductory
prose, not every later theorem in that section. Labelled items/equations inside
a statement inherit that statement's dependencies. Complete sections are still
the unit imported into a reader.
"""
import re

KINDS = 'lemma|theorem|proposition|definition|example|remark|remarks|exercise|situation|discussion|notation|corollary'


def printing(text):
    text = re.sub(r'(?<!\\)%[^\n]*', '', text)
    return re.sub(r'\\begin\{(slogan|history|reference)\}[\s\S]*?\\end\{\1\}', '', text)


def index_source(source, chapters, tags):
    sections, nodes, labels, refs = {}, {}, {}, {}
    for chapter in chapters:
        file = source / (chapter['slug'] + '.tex')
        if not file.exists():
            continue
        full = file.read_text()
        starts = list(re.finditer(r'\\section\{([^\n]+)\}', full))
        for index, match in enumerate(starts, 1):
            end = starts[index].start() if index < len(starts) else full.find('\\input{chapters}', match.end())
            if end < 0:
                end = len(full)
            raw = full[match.start():end]
            label = re.search(r'\\label\{([^}]+)\}', raw)
            key = chapter['slug'] + '-' + label[1] if label else None
            if key not in tags:
                continue
            tag, number = tags[key], f"{chapter['number']}.{index}"
            section = dict(tag=tag, label=label[1], key=key, chapter=chapter['slug'], number=number,
                           title=match[1], text=raw, source_start_line=full.count('\n', 0, match.start()) + 1,
                           source_end_line=full.count('\n', 0, end) + (0 if full[end-1:end] == '\n' else 1))
            sections[tag] = section
            text = printing(raw)
            statements = list(re.finditer(r'\\begin\{(' + KINDS + r')\}', text))
            ranges = []
            for i, start in enumerate(statements, 1):
                stop = text.find('\\end{' + start[1] + '}', start.end())
                if stop < 0:
                    raise ValueError('Unclosed statement in ' + key)
                stop += len('\\end{' + start[1] + '}')
                next_start = statements[i].start() if i < len(statements) else len(text)
                # Stacks sometimes inserts explanatory prose between a result
                # and its proof (notably the Grothendieck spectral sequence).
                # It can also supply more than one proof.
                proof_end = text.rfind('\\end{proof}', stop, next_start)
                if proof_end >= 0:
                    stop = proof_end + len('\\end{proof}')
                body = text[start.start():stop]
                own = re.search(r'\\label\{([^}]+)\}', body)
                ownkey = chapter['slug'] + '-' + own[1] if own else None
                if ownkey not in tags:
                    continue
                t = tags[ownkey]
                nodes[t] = dict(tag=t, key=ownkey, kind=start[1], number=number + '.' + str(i), section=tag, text=body)
                ranges.append((start.start(), stop, t))
            intro = text[:statements[0].start()] if statements else text
            nodes[tag] = dict(tag=tag, key=key, kind='section', number=number, section=tag, text=intro)
            # Reference numbering, including equations and nested labelled items.
            current_kind, theorem, equation, lists = 'section', 0, 0, []
            token = r'\\begin\{(' + KINDS + r')\}|\\begin\{(enumerate|itemize)\}|\\end\{(enumerate|itemize)\}|\\begin\{equation\}|\\item\b|\\label\{([^}]+)\}'
            for m in re.finditer(token, text):
                if m[1]:
                    theorem += 1; equation = 0; current_kind = m[1]
                elif m[2]:
                    lists.append([m[2], 0, m.start(), None])
                elif m[3]:
                    if lists: lists.pop()
                elif m[0] == '\\begin{equation}':
                    equation += 1
                elif m[0].startswith('\\item'):
                    if lists:
                        lists[-1][1] += 1
                        lists[-1][3] = m.start()
                elif m[4]:
                    k = chapter['slug'] + '-' + m[4]
                    if k not in tags: continue
                    t = tags[k]; labels[k] = t
                    n = number + ('.' + str(theorem) if current_kind != 'section' else '')
                    kind = current_kind
                    if m[4].startswith('equation-'):
                        n = number + '.' + str(theorem) + '.' + str(max(1, equation)); kind = 'equation'
                    if m[4].startswith('item-') and lists:
                        n = str(lists[-1][1]) if len(lists) == 1 else chr(96 + lists[-1][1]); kind = 'item'
                    refs[k] = dict(tag=t, number=n, kind=kind)
                    if t in nodes: continue
                    parent = next((p for a, b, p in ranges if a <= m.start() < b), None)
                    if parent:
                        body = nodes[parent]['text']
                    elif m[4].startswith('item-'):
                        a = lists[-1][3] if lists else text.rfind('\\item', 0, m.start())
                        depth, b = 0, len(text)
                        for token in re.finditer(r'\\begin\{(?:enumerate|itemize)\}|\\end\{(?:enumerate|itemize)\}|\\item\b', text[m.end():]):
                            if token[0].startswith('\\begin'): depth += 1
                            elif token[0].startswith('\\end'):
                                if not depth: b = m.end() + token.start(); break
                                depth -= 1
                            elif not depth: b = m.end() + token.start(); break
                        body = text[max(0, a):b if b >= 0 else len(text)]
                    else:
                        a = text.rfind('\n\n', 0, m.start())
                        b = text.find('\n\n', m.end())
                        body = text[max(0, a):b if b >= 0 else len(text)]
                    nodes[t] = dict(tag=t, key=k, kind=kind, number=n, section=tag, text=body, parent=parent)
    for node in nodes.values():
        uses = set()
        for label in re.findall(r'\\(?:ref|eqref)\{([^}]+)\}', node['text']):
            key = label if label in tags else sections[node['section']]['chapter'] + '-' + label
            if key not in tags:
                raise ValueError('Unresolved reference ' + key)
            uses.add(tags[key])
        node['uses'] = sorted(uses - {node['tag']})
    return sections, nodes, refs
