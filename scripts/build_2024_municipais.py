import csv,json,zipfile,urllib.request,io,os,unicodedata
UFS={"BA":"Bahia","CE":"Ceará","MA":"Maranhão","MG":"Minas Gerais","PE":"Pernambuco","RJ":"Rio de Janeiro","RS":"Rio Grande do Sul"}
base="https://cdn.tse.jus.br/estatistica/sead/odsele/"
urls={"cand":base+"votacao_candidato_munzona/votacao_candidato_munzona_2024.zip","part":base+"votacao_partido_munzona/votacao_partido_munzona_2024.zip"}
def rows(url):
    b=urllib.request.urlopen(url,timeout=120).read()
    z=zipfile.ZipFile(io.BytesIO(b))
    for n in z.namelist():
      if n.lower().endswith(".csv"):
       with z.open(n) as f:
        for r in csv.DictReader(io.TextIOWrapper(f,encoding="latin1"),delimiter=";"): yield r
def iv(r,k):
    try:return int(r.get(k,"0") or 0)
    except:return 0
data={u:{} for u in UFS}
for r in rows(urls["cand"]):
 u=r.get("SG_UF"); party=r.get("SG_PARTIDO")
 if u not in UFS or party!="PCB": continue
 cargo=r.get("DS_CARGO","")
 if cargo not in ("Prefeito","Vereador"): continue
 mun=r.get("NM_MUNICIPIO","").strip(); key=(r.get("SQ_CANDIDATO",""),mun)
 d=data[u].setdefault(key,{"id":r.get("SQ_CANDIDATO",""),"nome":r.get("NM_URNA_CANDIDATO") or r.get("NM_CANDIDATO",""),"numero":r.get("NR_CANDIDATO",""),"cargo":cargo,"municipio":mun,"total":0})
 d["total"]+=iv(r,"QT_VOTOS_NOMINAIS")
for u in UFS:
 vals=list(data[u].values()); vals.sort(key=lambda x:(x["municipio"],0 if x["cargo"]=="Prefeito" else 1,x["nome"]))
 out={"uf":u,"ano":2024,"fonte":"TSE Dados Abertos — votação nominal por município e zona","candidatos":vals}
 os.makedirs(f"mapa/{u.lower()}/2024",exist_ok=True)
 json.dump(out,open(f"mapa/{u.lower()}/2024/dados.json","w",encoding="utf8"),ensure_ascii=False,separators=(",",":"))
 geo=f"/mapa/{u.lower()}/municipios.geojson" if u not in ("MA","MG") else f"/mapa/dados/2026/{u.lower()}/municipios.geojson"
 years={"BA":[2022,2024],"CE":[2018,2022,2024],"MA":[2018,2022,2024,2026],"MG":[2018,2022,2024,2026],"PE":[2018,2022,2024],"RJ":[2018,2022,2024],"RS":[2018,2022,2024]}[u]
 buttons="".join([f'<button class="pill {"red" if y==2024 else ""}" onclick="location.href=\'{("/mapa/"+u.lower()+"/2024/" if y==2024 else "/mapa/"+u.lower()+("/" if y in (2022,2026) and ((u in ("BA","CE","PE","RJ","RS") and y==2022) or (u in ("MA","MG") and y==2026) else f"/{y}/")))}\'">{u} · {y}</button>' for y in years])
 html=f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{UFS[u]} 2024 • Mapa dos Votos PCB-SP</title><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>*{{box-sizing:border-box}}body{{margin:0;background:#f4efe5;font-family:Arial,sans-serif;color:#1c1a18}}header{{background:#87080f;color:#fff;padding:18px 22px;border-bottom:5px solid #f0c52b}}header b{{font-size:26px}}header em{{color:#f0c52b;font-style:normal}}.top{{padding:10px 15px;background:#fff;display:flex;gap:8px;flex-wrap:wrap;border-bottom:1px solid #ddd}}.pill{{border:1px solid #d8d0c5;border-radius:22px;padding:9px 13px;background:#fff;font-weight:800}}.red{{background:#b80e19;color:#fff}}.wrap{{padding:12px 14px 40px}}.status,.group{{background:#fff;border:1px solid #ddd4c7;border-radius:11px;padding:9px;margin-bottom:8px}}.status{{background:#fff3cf;border-color:#e4ca70}}.group-title{{font-size:12px;font-weight:900;color:#756f67;margin-bottom:6px}}.cands{{display:flex;flex-wrap:wrap;gap:6px}}.cand{{flex:0 1 205px;min-width:180px;border:1px solid #d8d0c5;border-radius:9px;padding:7px 8px;background:#fff}}.cand strong{{display:block;font-size:14px}}.cand small{{font-size:11px;color:#756f67}}.n{{font-size:17px;font-weight:900;color:#b80e19;margin-top:4px}}#map{{height:420px;border:1px solid #cfc6b8;border-radius:12px;margin-top:10px}}@media(max-width:600px){{.cand{{flex:1 1 145px;min-width:135px}}#map{{height:360px}}}}</style></head><body><header><b>MAPA DOS VOTOS <em>PCB-SP</em></b><div>{UFS[u].upper()} • 2024</div></header><div class="top"><button class="pill" onclick="location.href='/mapa/'">← VOLTAR</button>{buttons}</div><main class="wrap"><div class="status" id="status">Dados oficiais TSE 2024</div><div id="groups"></div><div id="map"></div></main><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>
const fmt=n=>new Intl.NumberFormat("pt-BR").format(n), norm=s=>(s||"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toUpperCase();
Promise.all([fetch("dados.json").then(r=>r.json()),fetch("{geo}").then(r=>r.json())]).then(([D,G])=>{{let by={{}};D.candidatos.forEach(c=>(by[c.municipio]??=[]).push(c));document.getElementById("status").textContent="Dados oficiais TSE 2024 • "+Object.keys(by).length+" município(s) com candidatura PCB";document.getElementById("groups").innerHTML=Object.keys(by).sort().map(m=>'<section class="group"><div class="group-title">'+m+'</div><div class="cands">'+by[m].map(c=>'<div class="cand"><strong>'+c.nome+'</strong><small>'+c.cargo+' • PCB '+c.numero+'</small><div class="n">'+fmt(c.total)+' votos</div></div>').join("")+'</div></section>').join("");let map=L.map("map");L.tileLayer("https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png",{{maxZoom:18,attribution:"© OpenStreetMap"}}).addTo(map);let names=new Set(Object.keys(by).map(norm));let layer=L.geoJSON(G,{{style:f=>{{let p=f.properties||{{}},n=p.NM_MUN||p.NM_MUNICIP||p.name||p.nome||p.NOME||"";return {{color:"#8c8175",weight:.6,fillColor:names.has(norm(n))?"#b80e19":"#eee5d8",fillOpacity:names.has(norm(n))?.78:.35}}}},onEachFeature:(f,l)=>{{let p=f.properties||{{}},n=p.NM_MUN||p.NM_MUNICIP||p.name||p.nome||p.NOME||"";if(n)l.bindTooltip(n)}}}}).addTo(map);map.fitBounds(layer.getBounds())}}).catch(e=>document.getElementById("status").textContent="Erro ao carregar: "+e.message);
</script></body></html>'''
 open(f"mapa/{u.lower()}/2024/index.html","w",encoding="utf8").write(html)
print({u:len(data[u]) for u in UFS})
