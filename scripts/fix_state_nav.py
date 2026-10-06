from pathlib import Path
import re
changed=0
for p in Path("mapa").glob("*/*/index.html"):
    m=re.fullmatch(r"mapa/([a-z]{2})/(20\\d{2})/index\\.html",p.as_posix())
    if not m: continue
    uf,year=m.group(1).upper(),m.group(2)
    s=p.read_text(encoding="utf-8")
    old=s
    s=s.replace("/mapa/sp-modular/","/mapa/")
    s=s.replace("← SÃO PAULO","← VOLTAR").replace("← SÃO PAULO ","← VOLTAR ")
    # normalize button/anchor labels that represent year navigation
    def norm(match):
        tag,attrs,body,end=match.groups()
        href=re.search(r'href=["\\\']([^"\\\']+)["\\\']',attrs,re.I)
        y=None
        u=uf
        if href:
            hm=re.search(r"/mapa/([a-z]{2})/(20\\d{2})/?",href.group(1),re.I)
            if hm: u,y=hm.group(1).upper(),hm.group(2)
        if not y:
            ym=re.search(r"20(?:18|22|26)",re.sub("<.*?>","",body))
            if ym: y=ym.group(0)
        if y:
            return "<"+tag+attrs+">"+u+" · "+y+"</"+end+">"
        return match.group(0)
    s=re.sub(r"<(a|button)([^>]*)>(.*?)</(a|button)>",norm,s,flags=re.S|re.I)
    # Any remaining visible Sao Paulo back label
    s=re.sub(r"(>\\s*)←?\\s*SÃO PAULO(\\s*<)",r"\\1← VOLTAR\\2",s,flags=re.I)
    if s!=old:
        p.write_text(s,encoding="utf-8"); changed+=1
# strict audit
bad=[]
for p in Path("mapa").glob("*/*/index.html"):
    if not re.fullmatch(r"mapa/[a-z]{2}/20\\d{2}/index\\.html",p.as_posix()): continue
    s=p.read_text(encoding="utf-8")
    if "/mapa/sp-modular/" in s or "SÃO PAULO" in s.upper():
        bad.append(str(p))
if bad: raise SystemExit("navigation audit failed: "+", ".join(bad))
print("changed",changed)
