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
 def __init__(self):super().__init__();self.stack=[];self.sections={};self.section=None
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs);classes=attrs.get('class','').split()
  if 'source-section' in classes:self.section=attrs['id'];self.sections[self.section]=[]
  if tag not in ['img','br','hr','input','link','meta','wbr','source','area']:self.stack.append((tag,classes))
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:del self.stack[i:];break
 def handle_data(self,text):
  if self.section and any('source-body' in c for t,c in self.stack) and not any(t in ['math','script','style','summary'] or any(x in c for x in ['katex','source-ref','bibliography-ref','item-label'])for t,c in self.stack):self.sections[self.section].append(text)
def words(s):
 s=unicodedata.normalize('NFKD',s)
 return re.findall(r'[A-Za-z0-9]+',''.join(c for c in s if not unicodedata.combining(c)))
def source_prose(s):
 s=re.sub(r'(?<!\\)%[^\n]*','',s)
 s=re.sub(r'^\\section\{[^\n]+\}\s*\\label\{[^}]+\}','',s)
 s=re.sub(r'\$\$[\s\S]*?\$\$',' ',s)
 s=re.sub(r'\\begin\{(align\*|eqnarray\*|equation)\}[\s\S]*?\\end\{\1\}',' ',s)
 s=re.sub(r'\$[^$]*\$',' ',s)
 s=re.sub(r'\\(?:ref|eqref|label)\{[^}]+\}','',s)
 s=re.sub(r'\\cite(?:\[[^\]]*\])?\{[^}]+\}','',s)
 s=re.sub(r'\\(?:begin|end)\{[^}]+\}(?:\[[^\]]*\])?','',s)
 s=re.sub(r'\\item(?:\[[^\]]*\])?','',s)
 s=re.sub(r"\\'\{?([A-Za-z])\}?",r'\1',s)
 s=re.sub(r'\\[a-zA-Z]+\b','',s)
 return words(s)
count=0
for unit in manifest['units']:
 parser=Prose();parser.feed((root/'dist/read'/unit['slug']/'index.html').read_text())
 for section in unit['sections']:
  raw=(root/'upstream/sections'/(section['slug']+'.tex')).read_bytes()
  if hashlib.sha256(raw).hexdigest()!=section['sha256']:raise SystemExit('Source hash mismatch '+section['slug'])
  full=(root/'upstream/chapters'/(section['chapter']+'.tex')).read_text()
  if raw.decode() not in full:raise SystemExit('Section differs from original chapter '+section['slug'])
  expected=source_prose(raw.decode());actual=words(' '.join(parser.sections[section['tag']]))
  if expected!=actual:
   for op,a,b,c,d in difflib.SequenceMatcher(None,expected,actual,autojunk=False).get_opcodes():
    if op!='equal':
     print('PROSE MISMATCH',section['slug'],op,'source:',expected[max(0,a-6):b+6],'rendered:',actual[max(0,c-6):d+6]);break
   raise SystemExit(1)
  count+=1
print(f'Verified verbatim source bytes and rendered prose in all {count} sections, including every proof and source-only note.')
