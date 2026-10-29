"""Independent reference values for the editorial quartet experiment (mpmath 60 digits)."""
import json
from pathlib import Path
import mpmath as mp
mp.mp.dps=60
values=[]
for beta in ['0.5','0.75','0.95']:
 for gamma in ['5','20.5','100']:
  for x in ['2','10','100','10000','1000000']:
   b,g,u=mp.mpf(beta),mp.mpf(gamma),mp.log(mp.mpf(x))
   q=-2*mp.re(mp.ei((b+1j*g)*u)+mp.ei((1-b+1j*g)*u))
   h=-mp.cosh((b-mp.mpf('.5'))*u)*mp.cos(g*u)
   values.append(dict(beta=beta,gamma=gamma,x=x,count=str(q),harmonic=str(h)))
output=Path(__file__).resolve().parent.parent/'src/sources/hypothetical-reference-values.json'
output.write_text(json.dumps(dict(method='mpmath 1.3.0, 60 decimal digits; direct complex Ei and hyperbolic cosine',values=values),indent=2)+'\n')
print(f'Wrote {len(values)} independent quartet samples.')
