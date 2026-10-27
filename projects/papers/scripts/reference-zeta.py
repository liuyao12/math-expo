"""Regenerate the visual-commentary reference fixture: mpmath 1.3.0, 80 digits.
Run with mpmath available; this optional generator is not a build dependency.
The decimal input spellings denote the same binary floats used by JavaScript.
"""
import json
from pathlib import Path
import mpmath as mp
mp.mp.dps=80
points={(i/2,j/2) for i in range(-8,9) for j in range(-8,9)}
for r in [-4,-3.5,-1,-.50000001,-.5,-.49999999,0,.5,1,1.5,4]:
 for t in [-32,-25.01085758014569,-21.022039638771555,-14.134725141734693,-10,10,14.134725141734693,21.022039638771555,25.01085758014569,32]:points.add((r,t))
for t in [14.134725141734693,21.022039638771555,25.01085758014569]:
 for e in [-1e-7,0,1e-7]:points.add((.5,t+e));points.add((.5+e,t))
for e in [-1e-9,-1e-7,1e-7,1e-9]:points.add((1+e,0));points.add((1,e))
points.discard((1,0));rows=[]
for r,t in sorted(points):
 value=mp.zeta(mp.mpc(mp.mpf(float(r)),mp.mpf(float(t))))
 rows.append({'re':r,'im':t,'valueRe':mp.nstr(value.real,70),'valueIm':mp.nstr(value.imag,70)})
p=Path(__file__).resolve().parents[1]/'src/sources/zeta-reference-values.json'
p.write_text(json.dumps({'generator':'mpmath 1.3.0 · 80 decimal digits','checked':'2026-10-27','purpose':'Independent numerical reference samples for the domain-coloring contribution; finite checks, not certified error bounds on every point.','inputConvention':'Coordinates are first converted to binary floats, then passed exactly to mpmath. The decimal spellings round to the same JavaScript numbers.','values':rows},indent=2)+'\n')
print('Generated',len(rows),'high-precision samples')
