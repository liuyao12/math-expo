"""Render unmodified source diagrams with LaTeX/Xy-pic and dvisvgm.

Only needed when the pinned selection changes. Normal builds use checked-in SVGs.
Usage: python3 scripts/render-diagrams.py --node /path/to/node --dvisvgm /path/to/dvisvgm [--texmf-home /path/to/texmf]
"""
from pathlib import Path
import argparse,subprocess,tempfile,json,os,re,hashlib
p=argparse.ArgumentParser();p.add_argument('--node',default='node');p.add_argument('--latex',default='latex');p.add_argument('--dvisvgm',default='dvisvgm');p.add_argument('--texmf-home');args=p.parse_args()
root=Path(__file__).resolve().parents[1]
diagrams=json.loads(subprocess.check_output([args.node,str(root/'scripts/collect-diagrams.mjs')],text=True))
preamble=(root/'upstream/preamble.tex').read_text().split('% Macros\n%\n',1)[1].split('% Boxtimes',1)[0]
tex='\\documentclass{amsart}\n\\usepackage{amsmath,amssymb}\n\\usepackage[all]{xy}\n\\xyoption{2cell}\n\\UseAllTwocells\n\\pagestyle{empty}\n'+preamble+'\n\\begin{document}\n'
tex+='\n'.join('\\thispagestyle{empty}\\noindent\\hbox{$\\displaystyle '+d['tex']+'$}\\par\\newpage\n' for d in diagrams)+'\\end{document}\n'
env=os.environ.copy()
if args.texmf_home:env['TEXMFHOME']=args.texmf_home
# A separately supplied dvisvgm binary must use the same fonts/configuration as LaTeX.
texmf_root=subprocess.check_output(['kpsewhich','-var-value=TEXMFROOT'],env=env,text=True).strip()
env.setdefault('TEXMFROOT',texmf_root)
env.setdefault('TEXMFCNF',texmf_root+':'+texmf_root+'/texmf-dist/web2c')
assets=root/'public/diagrams';assets.mkdir(exist_ok=True)
with tempfile.TemporaryDirectory(prefix='stacks-diagrams-') as tmp:
    tmp=Path(tmp);(tmp/'diagrams.tex').write_text(tex)
    result=subprocess.run([args.latex,'-interaction=nonstopmode','-halt-on-error','diagrams.tex'],cwd=tmp,env=env,capture_output=True,text=True)
    if result.returncode:raise SystemExit(result.stdout[-7000:])
    result=subprocess.run([args.dvisvgm,'--page=1-','--bbox=min','--no-fonts','--exact','--output=diagram-%p.svg','diagrams.dvi'],cwd=tmp,env=env,capture_output=True,text=True)
    if result.returncode:raise SystemExit(result.stderr[-7000:])
    pages=sorted(tmp.glob('diagram-*.svg'),key=lambda p:int(re.search(r'diagram-(\d+)',p.name)[1]))
    if len(pages)!=len(diagrams):raise SystemExit(f'Diagram page mismatch: {len(pages)} != {len(diagrams)}')
    for i,d in enumerate(diagrams,1):
        data=pages[i-1].read_bytes();text=data.decode()
        ids=set(re.findall(r"\bid=['\"]([^'\"]+)",text))
        uses=set(re.findall(r"xlink:href=['\"]#([^'\"]+)",text))
        if uses-ids:raise SystemExit('Unresolved font glyphs in diagram '+d['key']+': '+str(uses-ids))
        w=float(re.search(r"width='([\d.]+)pt'",text)[1]);h=float(re.search(r"height='([\d.]+)pt'",text)[1])
        name=d['key']+'.svg';(assets/name).write_bytes(data)
        d.update(file=name,width=w,height=h,svg_sha256=hashlib.sha256(data).hexdigest())
(root/'src/diagrams.json').write_text(json.dumps({d['key']:d for d in diagrams},indent=2)+'\n')
print(f'Rendered {len(diagrams)} original Xy-pic diagrams directly from the retained source.')
