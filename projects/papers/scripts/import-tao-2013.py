"""Extract one permitted article, excluding reader comments and site widgets.

Usage: python3 scripts/import-tao-2013.py downloaded-article.html
The author's About page explicitly permits copying a single article with a URL
credit. This importer does not authorize copying a series or reader comments.
"""
from html.parser import HTMLParser
from html import escape
from pathlib import Path
from urllib.parse import urljoin
from collections import Counter
import sys, re, json, hashlib

SOURCE='https://terrytao.wordpress.com/2013/07/19/the-riemann-hypothesis-in-various-settings/'
PERMISSION='https://terrytao.wordpress.com/about/'
raw=Path(sys.argv[1]).read_text()
body=raw.split('<div class="post-content">',1)[1]
# Sharing controls follow the complete article, before the comments.
body=re.split(r'<div[^>]+class=[\"\'][^\"\']*sharedaddy',body,maxsplit=1)[0]
body=body.rstrip()

class Extract(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.output=[];self.math=[];self.words=[];self.tags=Counter();self.anchors=set()
 def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.tags[tag]+=1
  if tag=='img':
   if 'latex' not in a.get('class',''):raise ValueError('Unreviewed non-math image')
   latex=a['alt'].replace('<',r'\lt ').replace('>',r'\gt ')
   self.math.append(latex)
   display=latex.lstrip().startswith(r'\displaystyle')
   self.output.append(('\\[' if display else '\\(')+latex+('\\]' if display else '\\)'));return
  if tag not in {'p','em','strong','b','i','blockquote','ul','ol','li','a','span','div','br','h2','h3','h4','hr'}:raise ValueError('Unreviewed tag '+tag)
  if tag=='a':
   identifier=a.get('name') or a.get('id')
   if identifier:
    if identifier in self.anchors:raise ValueError('Repeated source anchor '+identifier)
    self.anchors.add(identifier);self.output.append('<span id="tao-'+escape(identifier,quote=True)+'"></span>')
   href=a.get('href')
   if not href:return
   href=urljoin(SOURCE,href)
   if href.startswith(SOURCE+'#'):href='#tao-'+href.split('#',1)[1]
   self.output.append('<a href="'+escape(href,quote=True)+'"'+(' target="_blank" rel="noopener"' if href.startswith('https:') else '')+'>');return
  self.output.append('<'+tag+'>')
 def handle_endtag(self,tag):
  # Anchor-only source tags are harmlessly normalized after parsing below.
  if tag not in {'img','br','hr'}:self.output.append('</'+tag+'>')
 def handle_data(self,text):self.words.append(text);self.output.append(escape(text))

e=Extract();e.feed(body)
clean=''.join(e.output)
# The source uses named anchors around paragraph boundaries. They become
# standalone spans; stray closing anchors are discarded, never prose.
clean=re.sub(r'(<span id="tao-[^"]+"></span>)\s*</a>',r'\1',clean)
root=Path(__file__).resolve().parents[1]
target=root/'src/sources/tao-2013.html';target.write_text(clean+'\n')
evidence={'id':'tao-2013','source':SOURCE,'author':'Terence Tao','title':'The Riemann hypothesis in various settings','published':'2013-07-19','retrieved':'2026-10-30','permission':{'url':PERMISSION,'basis':'Author explicitly permits copying a single article with a URL citation.','quote':'Readers are welcome to copy, link to, quote from, or translate reasonable portions of the content of this blog'},'scope':'Complete authored article; reader comments, sharing widgets, and site navigation excluded.','changes':'WordPress formula images converted from their LaTeX alt text to native LaTeX delimiters; links normalized; source wording and equation labels retained. No mathematical corrections silently inserted.','sourceSHA256':hashlib.sha256(raw.encode()).hexdigest(),'articleSHA256':hashlib.sha256(body.encode()).hexdigest(),'htmlSHA256':hashlib.sha256((clean+'\n').encode()).hexdigest(),'mathCount':len(e.math),'sourceProseWords':len(' '.join(e.words).split()),'anchors':sorted(e.anchors),'review':'Automated extraction and formula checks; not a new mathematical peer review.'}
(root/'src/sources/tao-2013-provenance.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'proseWords':evidence['sourceProseWords'],'mathCount':len(e.math),'htmlBytes':len(clean)}))
