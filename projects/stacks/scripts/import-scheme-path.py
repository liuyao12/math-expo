"""Import the scheme foundation reading from a pinned Stacks source checkout.

Usage: python3 scripts/import-scheme-path.py /absolute/path/to/stacks-project
The ordinary site build is offline; this command is only needed to update sources.
"""
from pathlib import Path
import re,sys,json,subprocess,collections,hashlib

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
        text=full[m.start():end]
        label=re.search(r'\\label\{([^}]+)\}',text)
        if not label:continue
        key=c['slug']+'-'+label[1]
        if key not in tags:continue
        sections[key]=dict(chapter=c['slug'],label=label[1],title=m[1],tag=tags[key],number=f"{c['number']}.{n}",kind='section',text=text,source_start_line=full.count('\n',0,m.start())+1,source_end_line=full.count('\n',0,end)+(0 if full[end-1:end]=='\n' else 1))
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

# Follow references until every required reference has an included owner section.
# Exceptions are explicit, human-reviewed source comparisons, alternative proofs,
# and assumed background, rather than an implicit limit on the import size.
selection=json.loads((root/'upstream/scheme-selection.json').read_text())
exceptions=selection['reference_exceptions']
def printing(text):
    text=re.sub(r'(?<!\\)%[^\n]*','',text)
    return re.sub(r'\\begin\{(slogan|history|reference)\}[\s\S]*?\\end\{\1\}','',text)
def links(s):
    for lab in re.findall(r'\\(?:ref|eqref)\{([^}]+)\}',printing(s['text'])):
        yield lab if lab in refs else s['chapter']+'-'+lab
required=set(selection['seeds']);reasons={k:'Foundation selection: definitions and construction of schemes.' for k in required}
while True:
    added={}
    for key in sorted(required):
        for label in links(sections[key]):
            if label in exceptions:continue
            if label not in owners:raise ValueError('Unresolved prerequisite '+label)
            owner=owners[label]
            if owner not in required:added[owner]='Referenced by '+key+' ('+label+').'
    if not added:break
    required.update(added);reasons.update(added)
units=[];selected={};routes={}
chapter_dir=root/'upstream/chapters';chapter_dir.mkdir(exist_ok=True)
for chapter in chapters:
    source_sections=sorted((sections[k] for k in required if sections[k]['chapter']==chapter['slug']),key=lambda s:int(s['number'].split('.')[1]))
    if not source_sections:continue
    unit=[]
    (chapter_dir/(chapter['slug']+'.tex')).write_bytes((src/(chapter['slug']+'.tex')).read_bytes())
    for s in source_sections:
        key=s['chapter']+'-'+s['label'];filename=s['chapter']+'-'+s['label'].removeprefix('section-')
        (root/'upstream/sections'/(filename+'.tex')).write_text(s['text'])
        clean={k:v for k,v in s.items() if k!='text'}
        clean.update(slug=filename,route=chapter['slug'],key=key,sha256=hashlib.sha256(s['text'].encode()).hexdigest(),included_because=reasons[key])
        selected[key]=clean;unit.append(clean)
        for label,owner in owners.items():
            if owner==key:routes[label]=chapter['slug']
    units.append(dict(slug=chapter['slug'],title=chapter['title'],number=chapter['number'],tag=chapter['tag'],subtitle='The Stacks Project — '+chapter['title'],support=chapter['slug'] in ['categories','homology','modules'],sections=unit))
# Additional readings have their own scope and do not expand the foundation path.
reading_specs=[
    ('twists-and-genus','Sheaf cohomology and the genus of a plane curve',
     'Starting from schemes, build projective space and sheaf cohomology, then prove the plane-curve genus formula.',
     ['modules-section-quasi-coherent',
      'schemes-section-quasi-coherent-affine',
      'schemes-section-immersions',
      'morphisms-section-affine',
      'morphisms-section-proper',
      'algebra-section-graded',
      'constructions-section-proj',
      'constructions-section-quasi-coherent-proj',
      'modules-section-invertible',
      'constructions-section-invertible-on-proj',
      'constructions-section-projective-space',
      'homology-section-complexes',
      'homology-section-cohomological-delta-functor',
      'homology-section-injectives',
      'injectives-section-abelian-sheaves-space',
      'injectives-section-sheaves-modules-space',
      'derived-section-injective-resolutions',
      'derived-section-right-derived-functor',
      'cohomology-section-cohomology-sheaves',
      'cohomology-section-locality',
      'cohomology-section-cech',
      'cohomology-section-cech-functor',
      'homology-section-double-complexes',
      'homology-section-spectral-sequence',
      'homology-section-double-complex',
      'derived-section-composition-right-derived-functors',
      'cohomology-section-cech-cohomology-cohomology',
      'cohomology-section-alternating-cech',
      'cohomology-section-Leray',
      'coherent-section-cech-quasi-coherent',
      'coherent-section-cohomology-projective-space',
      'divisors-section-embedded',
      'divisors-section-effective-Cartier-divisors',
      'divisors-section-Noetherian-effective-Cartier',
      'divisors-section-invertible-modules',
      'divisors-section-closed-in-relative-proj',
      'varieties-section-curves',
      'curves-section-genus',
      'curves-section-plane-curves']),
    ('projective-twists','Twisting sheaves and intersection multiplicity',
     'Follow the twists from the projective line to Cartier divisors and the intersection of a line with a conic.',
     ['constructions-section-invertible-on-proj',
      'divisors-section-effective-Cartier-invertible',
      'varieties-section-divisors-curves',
      'intersection-section-computing-intersection-multiplicities']),
]
readings=[]
core_sections=json.loads((root/'upstream/scheme-core.json').read_text())
genus_stages={
    'modules-section-quasi-coherent':'Modules and projective space',
    'homology-section-complexes':'Sheaf cohomology and Čech complexes',
    'divisors-section-embedded':'Plane curves and genus',
}
for slug, title, deck, keys in reading_specs:
    entries=[]
    for key in keys:
        if slug=='twists-and-genus' and sections[key]['number'] in core_sections:
            raise ValueError('Section already in the scheme definition path: '+key)
        s=sections[key]
        filename=s['chapter']+'-'+s['label'].removeprefix('section-')
        (root/'upstream/sections'/(filename+'.tex')).write_text(s['text'])
        entry={k:v for k,v in s.items() if k!='text'}
        chapter=next(c for c in chapters if c['slug']==s['chapter'])
        entry['title']=entry['title'].replace(r'{\v C}', 'Č')
        entry.update(slug=filename,chapterTitle=chapter['title'],sha256=hashlib.sha256(s['text'].encode()).hexdigest())
        if slug=='twists-and-genus' and key in genus_stages:
            entry['stage']=genus_stages[key]
        entries.append(entry)
    chapter=next(c for c in chapters if c['slug']==entries[0]['chapter'])
    reading=dict(slug=slug,readingTitle=title,deck=deck,title=chapter['title'],
                 number=chapter['number'],sections=entries)
    if slug=='twists-and-genus':
        reading['target']='0BYD'
    readings.append(reading)
(root/'upstream/selected-readings.json').write_text(json.dumps(readings,indent=2)+'\n')

# Stacks numbers equations within the subsection, including subsection zero.
reading_keys=[key for _,_,_,keys in reading_specs for key in keys]
for key in set(reading_keys)|{owners[label] for key in reading_keys
                             for label in links(sections[key]) if '-equation-' in label}:
    s=sections[key]
    theorem=equation=0
    for match in re.finditer(r'\\begin\{('+envs+r')\}|\\begin\{equation\}\s*\\label\{([^}]+)\}',s['text']):
        if match[1]:
            theorem+=1
            equation=0
        else:
            equation+=1
            label=s['chapter']+'-'+match[2]
            if label in refs:
                refs[label].update(number=f"{s['number']}.{theorem}.{equation}",kind='equation')

needed=set()
for key in [*selected,*reading_keys]:
    for lab in re.findall(r'\\(?:ref|eqref|label)\{([^}]+)\}',sections[key]['text']):
        needed.add(lab if lab in refs else sections[key]['chapter']+'-'+lab)
old=json.loads((root/'upstream/references.json').read_text());old.update({k:refs[k] for k in sorted(needed) if k in refs})
(root/'upstream/references.json').write_text(json.dumps(old,indent=2)+'\n')
source_references=[]
for key,s in selected.items():
    audit=[]
    for label in links(sections[key]):
        included=label in routes
        if not included and label not in exceptions:raise ValueError('Uncovered reference '+label)
        audit.append(dict(label=label,tag=refs[label]['tag'],included=included,classification='included' if included else 'background' if label.startswith(('sets-','fields-')) else 'additional-reference',reason=None if included else exceptions[label]))
    source_references.append(dict(section=key,tag=s['tag'],references=audit))
legacy={}
for route,keys in json.loads((root/'upstream/legacy-readings.json').read_text()).items():
    if route in [u['slug']for u in units]:continue
    anchors={refs[label]['tag']:routes[label]for label,owner in owners.items() if owner in keys and label in routes}
    legacy[route]=dict(default_route=selected[keys[0]]['route'],default_tag=selected[keys[0]]['tag'],anchors=anchors)
data=dict(title='The Stacks Project',commit=commit,units=units,routes=routes,legacy_routes=legacy,
          assumed_background=['Sets and functions','Basic undergraduate algebra'],
          companion_background='Familiar complex function theory is used for the separate motivating examples.',
          scope='Complete original sections required for the definition and construction of schemes, with recursively audited references. Original chapter titles, section titles, numbering, wording, and proofs are retained. Explicitly identified additional comparisons and assumed background remain source links.',
          source_reference_audit=source_references)
(root/'upstream/scheme-path.json').write_text(json.dumps(data,indent=2)+'\n')
(root/'upstream/preamble.tex').write_bytes((src/'preamble.tex').read_bytes())
print(f'Imported {len(selected)} verbatim source sections in {len(units)} original chapters; {len(routes)} source anchors.')
print(collections.Counter(s['chapter'] for s in selected.values()))
