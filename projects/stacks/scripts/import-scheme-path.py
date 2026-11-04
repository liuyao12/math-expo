"""Import the scheme foundation reading from a pinned Stacks source checkout.

Usage: python3 scripts/import-scheme-path.py /absolute/path/to/stacks-project
The ordinary site build is offline; this command is only needed to update sources.
"""
from pathlib import Path
import re,sys,json,subprocess,collections

root=Path(__file__).resolve().parents[1]
src=Path(sys.argv[1])
expected=json.loads((root/'upstream/manifest.json').read_text())['commit']
commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=src,text=True).strip()
if commit!=expected:raise SystemExit('Use the pinned source commit '+expected)
chapters=json.loads((root/'src/chapters.json').read_text())
tags={label:tag for tag,label in (l.split(',',1) for l in (src/'tags/tags').read_text().splitlines() if l and not l.startswith('#'))}
sections={};refs={};owners={}
envs='lemma|theorem|proposition|definition|example|remark|exercise|situation|discussion|notation|corollary'
for c in chapters:
    p=src/(c['slug']+'.tex')
    if not p.exists():continue
    full=p.read_text()
    starts=list(re.finditer(r'\\section\{([^\n]+)\}',full))
    for n,m in enumerate(starts,1):
        end=starts[n].start() if n<len(starts) else full.find('\\input{chapters}',m.end())
        if end<0:end=len(full)
        text=full[m.start():end].strip()+'\n'
        label=re.search(r'\\label\{([^}]+)\}',text)
        if not label:continue
        key=c['slug']+'-'+label[1]
        if key not in tags:continue
        sections[key]=dict(chapter=c['slug'],label=label[1],title=m[1],tag=tags[key],number=f"{c['number']}.{n}",kind='section',text=text)
        num=0;kind='section';list_stack=[]
        for token in re.finditer(r'\\begin\{('+envs+r')\}|\\begin\{(enumerate|itemize)\}|\\end\{(enumerate|itemize)\}|\\item\b|\\label\{([^}]+)\}',text):
            if token[1]:num+=1;kind=token[1]
            elif token[2]:list_stack.append([token[2],0])
            elif token[3]:
                if list_stack:list_stack.pop()
            elif token[0].startswith('\\item'):
                if list_stack:list_stack[-1][1]+=1
            elif token[4]:
                full_label=c['slug']+'-'+token[4]
                if full_label not in tags:continue
                number=f"{c['number']}.{n}"+(f'.{num}' if kind!='section' else '')
                ref_kind=kind
                if token[4].startswith('item-') and list_stack:
                    number=str(list_stack[-1][1]) if len(list_stack)==1 else chr(96+list_stack[-1][1]);ref_kind='item'
                refs[full_label]=dict(tag=tags[full_label],number=number,kind=ref_kind)
                owners[full_label]=key

# A definition/construction path, with module and categorical variants retained.
# Optional later-theory cross-references in the source remain marked upstream links.
spec=[
('topology-functions','Topology for local functions','Disks, open sets, and the topology used by spectra','topology',[2,5,8,12,19]),
('rings-and-germs','Rings, localization, and germs','From functions to fractions and local rings','algebra',[2,3,4,8,9,18]),
('spectra','The spectrum of a ring','Polynomial functions, evaluation, and the generic point','algebra',[17]),
('sheaves-and-stalks','Sheaves and stalks','Holomorphic functions as the guiding sheaf','sheaves',list(range(2,17))),
('sheafification-and-bases','Sheafification and bases','Recovering local data and extending it from basic opens','sheaves',[17,18,19,20,30]),
('ringed-spaces','Spaces equipped with functions','Pullback, local homomorphisms, and open subspaces',None,[('sheaves',[21,22,23,24,25,26,31]),('schemes',[2,3])]),
('affine-schemes','Constructing an affine scheme','The structure sheaf on a spectrum',None,[('algebra',[23,24]),('modules',[3]),('schemes',[5,6])]),
('schemes','The definition of a scheme','An atlas made of affine schemes','schemes',[9]),
('scheme-support','Supporting algebra and category language','Reference sections used by the construction',None,[('categories',[2,6,10,14,15,19,21,23,24]),('algebra',[5,6,10,15,20,21,29]),('topology',[9,15,16]),('homology',[3,5,7])])
]
units=[];selected={};routes={}
for slug,title,subtitle,chapter,orders in spec:
    pairs=[(chapter,orders)] if chapter else orders
    unit=[]
    for chapter,nums in pairs:
        for n in nums:
            matches=[(k,s) for k,s in sections.items() if s['chapter']==chapter and s['number'].split('.')[-1]==str(n)]
            if len(matches)!=1:raise ValueError((chapter,n,matches))
            key,s=matches[0];filename=s['chapter']+'-'+s['label'].removeprefix('section-')
            (root/'upstream/sections'/(filename+'.tex')).write_text(s['text'])
            clean={k:v for k,v in s.items() if k!='text'};clean['slug']=filename;clean['route']=slug;clean['key']=key
            selected[key]=clean;unit.append(clean)
            for label,owner in owners.items():
                if owner==key:routes[label]=slug
    units.append(dict(slug=slug,title=title,subtitle=subtitle,support=slug=='scheme-support',sections=unit))

needed=set()
for key in selected:
    for lab in re.findall(r'\\(?:ref|eqref|label)\{([^}]+)\}',sections[key]['text']):
        needed.add(lab if lab in refs else sections[key]['chapter']+'-'+lab)
old=json.loads((root/'upstream/references.json').read_text())
old.update({k:refs[k] for k in needed if k in refs})
(root/'upstream/references.json').write_text(json.dumps(old,indent=2)+'\n')
source_references=[]
for key,s in selected.items():
    links=[]
    for label in re.findall(r'\\(?:ref|eqref)\{([^}]+)\}',sections[key]['text']):
        full=label if label in refs else s['chapter']+'-'+label
        if full in refs:links.append(dict(label=full,tag=refs[full]['tag'],included=full in routes))
    source_references.append(dict(section=key,tag=s['tag'],references=links))
data=dict(title='From complex functions to schemes',commit=commit,units=units,routes=routes,
          assumed_background=['Sets and functions','Basic undergraduate algebra','Familiarity with holomorphic functions, germs, and Riemann surfaces'],
          scope='The definitions and construction leading to a scheme, retaining complete source sections and their module variants. Later-theory cross-references and alternative viewpoints remain linked to Stacks.',
          source_reference_audit=source_references)
(root/'upstream/scheme-path.json').write_text(json.dumps(data,indent=2)+'\n')
(root/'upstream/preamble.tex').write_text((src/'preamble.tex').read_text())
print(f'Imported {len(selected)} complete sections in {len(units)} readings; {len(routes)} source anchors.')
print(collections.Counter(s['chapter'] for s in selected.values()))
