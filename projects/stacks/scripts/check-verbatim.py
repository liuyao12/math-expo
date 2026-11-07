"""Independent prose-fidelity check, plus exact retained-source checks.

Compares source prose (including proofs and source-only notes) with text from
rendered source-body containers. Math, citation markers, and cross-reference
numbers are excluded from both streams; they are verified by the JS checks.
"""
from pathlib import Path
from html.parser import HTMLParser
import re,json,hashlib,unicodedata,difflib
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'upstream/scheme-path.json').read_text())
class Prose(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.sections={};self.section=None;self.source_json='';self.capture_source=False
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs);classes=attrs.get('class','').split()
  if tag=='script' and attrs.get('id')=='source-data':self.capture_source=True
  if 'source-section' in classes:self.section=attrs['id'];self.sections[self.section]=[]
  if tag not in ['img','br','hr','input','link','meta','wbr','source','area']:self.stack.append((tag,classes))
 def handle_endtag(self,tag):
  if tag=='script':self.capture_source=False
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:del self.stack[i:];break
 def handle_data(self,text):
  if self.capture_source:self.source_json+=text
  if self.section and any('source-body' in c for t,c in self.stack) and not any(t in ['math','script','style','summary'] or any(x in c for x in ['katex','source-ref','bibliography-ref','item-label'])for t,c in self.stack):self.sections[self.section].append(text)
def words(s):
 s=unicodedata.normalize('NFKD',s)
 return re.findall(r'[A-Za-z0-9]+',''.join(c for c in s if not unicodedata.combining(c)))
def source_prose(s):
 s=s.replace(r'{\v C}','Č')
 s=re.sub(r'(?<!\\)%[^\n]*','',s)
 s=re.sub(r'^\\section\{[^\n]+\}\s*\\label\{[^}]+\}','',s)
 s=re.sub(r'\$\$[\s\S]*?\$\$',' ',s)
 s=re.sub(r'\\begin\{(align\*|eqnarray\*|equation)\}[\s\S]*?\\end\{\1\}',' ',s)
 s=re.sub(r'\$[^$]*\$',' ',s)
 s=re.sub(r'\\(?:ref|eqref|label)\{[^}]+\}','',s)
 s=re.sub(r'\\cite(?:\[[^\]]*\])?\{[^}]+\}','',s)
 s=re.sub(r'\\href\{https?://[^{}]+\}\{([^{}]+)\}',r'\1',s)
 s=re.sub(r'\\(?:begin|end)\{[^}]+\}(?:\[[^\]]*\])?','',s)
 s=re.sub(r'\\item(?:\[[^\]]*\])?','',s)
 s=re.sub(r"\\'\{?([A-Za-z])\}?",r'\1',s)
 s=re.sub(r'\\[a-zA-Z]+\b','',s)
 return words(s)
count=0
gluing=json.loads((root/'upstream/manifest.json').read_text())
catalog=json.loads((root/'upstream/sections.json').read_text())
specs=json.loads((root/'src/readings.json').read_text())+json.loads((root/'src/reference-readings.json').read_text())
selected_readings=[dict(spec,sections=sorted([catalog[tag] for tag in spec['sections']],key=lambda s:tuple(map(int,s['number'].split('.')))))for spec in specs]
core_tags=set(next(spec['sections'] for spec in specs if spec.get('role')=='foundation'))
core_units=[]
for unit in manifest['units']:
 sections=[section for section in unit['sections'] if section['tag'] in core_tags]
 if sections:core_units.append(dict(slug='core-'+unit['slug'],sections=sections))
for unit in manifest['units']+core_units+selected_readings+[dict(slug='gluing',sections=gluing['sections'])]:
 parser=Prose();parser.feed((root/'dist/read'/unit['slug']/'index.html').read_text())
 if list(parser.sections)!=[section['tag'] for section in unit['sections']]:raise SystemExit('Unexpected sections in '+unit['slug'])
 for section in unit['sections']:
  raw=(root/'upstream/sections'/(section['slug']+'.tex')).read_bytes()
  if section.get('sha256') and hashlib.sha256(raw).hexdigest()!=section['sha256']:raise SystemExit('Source hash mismatch '+section['slug'])
  if 'readingTitle' not in unit:
   full=(root/'upstream/chapters'/(section['chapter']+'.tex')).read_text()
   if raw.decode() not in full:raise SystemExit('Section differs from original chapter '+section['slug'])
  elif not section.get('sha256'):
   raise SystemExit('Missing pinned section hash '+section['slug'])
  printing=re.sub(r'\\begin\{(history|slogan|reference)\}[\s\S]*?\\end\{\1\}','',raw.decode())
  expected=source_prose(printing);actual=words(' '.join(parser.sections[section['tag']]))
  if expected!=actual:
   for op,a,b,c,d in difflib.SequenceMatcher(None,expected,actual,autojunk=False).get_opcodes():
    if op!='equal':
     print('PROSE MISMATCH',section['slug'],op,'source:',expected[max(0,a-6):b+6],'rendered:',actual[max(0,c-6):d+6]);break
   raise SystemExit(1)
  records=json.loads(parser.source_json);record=records[section['tag']]
  meta='\n\n'.join(m[1] for m in re.findall(r'\\begin\{(history|slogan|reference)\}([\s\S]*?)\\end\{\1\}',raw.decode()))
  notes=Prose();notes.feed('<section class="source-section" id="notes"><div class="source-body">'+record['notesHtml']+'</div></section>')
  if source_prose(meta)!=words(' '.join(notes.sections['notes'])):raise SystemExit('Source margin note mismatch '+section['slug'])
  count+=1
print(f'Verified verbatim source bytes and rendered prose in all {count} source-section readings, including every proof; verified source-only notes separately in the margin.')
