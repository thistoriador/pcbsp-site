const fs=require('fs'),zlib=require('zlib');
const dir='mapa/teste-estadual';
const src=fs.readFileSync(dir+'/setores-sp.js','utf8');
const m=src.match(/window\.SETORES_SP_2022_GZIP_B64\s*=\s*"([A-Za-z0-9+/=]+)"/);
if(!m)throw new Error('payload not found');
const all=JSON.parse(zlib.gunzipSync(Buffer.from(m[1],'base64')).toString('utf8'));
fs.mkdirSync(dir+'/setores',{recursive:true});
for(const [code,geo] of Object.entries(all))fs.writeFileSync(dir+'/setores/'+code+'.geojson',JSON.stringify(geo));
let html=fs.readFileSync(dir+'/index.html','utf8');
html=html.replace(/<script src="setores-sp\.js"><\/script>\s*/,'');
html=html.replace(/async function loadMunicipio\(\)\{[\s\S]*?\n\}\nmun\.onchange=loadMunicipio;/,`async function loadMunicipio(){
 const meta=municipios.find(x=>x.cd_mun===mun.value);stats.textContent='Carregando '+meta.municipio+'…';tip.style.display='none';reset();
 try{const r=await fetch('setores/'+mun.value+'.geojson',{cache:'force-cache'});if(!r.ok)throw new Error('HTTP '+r.status);setores=await r.json();data=mun.value==='3516200'?francaData:[];setupProjection();buildZones();render()}catch(e){stats.innerHTML='<b>Não foi possível carregar a geometria deste município.</b> '+e.message}
}
mun.onchange=loadMunicipio;`);
fs.writeFileSync(dir+'/index.html',html);
fs.unlinkSync(dir+'/setores-sp.js');
console.log('generated',Object.keys(all).length);
