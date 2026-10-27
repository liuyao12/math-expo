"""Independent 60-digit checks, using the imported published zero ordinates."""
from pathlib import Path
import json
from functools import lru_cache
import mpmath as mp
mp.mp.dps=60
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'public/zeta-zeros-200.json').read_text())
zeros=[mp.mpf(float(t)) for t in data['ordinates']]
@lru_cache(None)
def base(x):
 u=mp.log(x)
 correction=mp.quad(lambda t: 1/(t*mp.expm1(2*t)),[u,1,mp.inf]) if u<1 else mp.quad(lambda t: 1/(t*mp.expm1(2*t)),[u,mp.inf])
 return mp.ei(u)-mp.log(2)+correction
def f(x,n):
 u=mp.log(x)
 return base(x)-2*sum(mp.re(mp.ei(mp.mpc(.5,g)*u)) for g in zeros[:n])
def pi(x,n):
 return sum(mp.mpf(mu)/m*f(x**(mp.mpf(1)/m),n) for m,mu in [(1,1),(2,-1),(3,-1),(5,-1),(6,1)])
rows=[]
for x in [2,2.0001,3,4,5,10,16,20.5,30,64,97,100]:
 xx=mp.mpf(float(x))
 for n in [0,1,10,50,200]:
  rows.append({'x':x,'pairs':n,'f':mp.nstr(f(xx,n),45),'pi':mp.nstr(pi(xx,n),45)})
 print('Checked x =',x,flush=True)
e1=[]
for u in [mp.log(2)/6,mp.log(2),mp.log(100)]:
 for g in [zeros[0],zeros[99],zeros[199]]:
  z=mp.mpc(-u/2,-g*u);v=mp.e1(z)
  e1.append({'re':float(z.real),'im':float(z.imag),'valueRe':mp.nstr(v.real,45),'valueIm':mp.nstr(v.imag,45)})
out={'generator':'mpmath 1.3.0, 60 decimal digits; direct numerical quadrature for the trivial-zero correction','checked':'2026-10-27','purpose':'Tests of the finite formula and branch-preserving Ei evaluation, not a bound for omitted zeros.','values':rows,'e1':e1}
(root/'src/sources/explicit-reference-values.json').write_text(json.dumps(out,indent=2)+'\n')

