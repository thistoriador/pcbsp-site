const fs=require('fs'),path=require('path');
const html=fs.readFileSync('mapa/teste-estadual/index.html','utf8');
const url=(html.match(/const SB_URL='([^']+)'/)||[])[1],key=(html.match(/const SB_KEY='([^']+)'/)||[])[1];
if(!url||!key)throw Error('Supabase config ausente');
const headers={apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json','Content-Profile':'api_mapa','Accept-Profile':'api_mapa'};
async function rpc(fn,args){const r=await fetch(url+'/rest/v1/rpc/'+fn,{method:'POST',headers,body:JSON.stringify(args)});if(!r.ok)throw Error(fn+' '+r.status+' '+await r.text());return r.json()}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
(async()=>{const out='mapa/teste-estadual/votos-geo';fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const ms=await rpc('mapa_municipios',{p_ano:2022});let total=0,withCoords=0;
for(let i=0;i<ms.length;i++){const m=ms[i],slug=norm(m.municipio),lp='mapa/teste-estadual/locais/'+slug+'.json';let loc=[];if(fs.existsSync(lp))loc=JSON.parse(fs.readFileSync(lp,'utf8'));
const lm=new Map(loc.map(l=>[String(l.NR_ZONA)+'|'+String(l.NR_SECAO),l]));
const rows=await rpc('municipio_secoes_pcb',{p_ano:2022,p_municipio_id:Number(m.municipio_id)});
const data=rows.map(x=>{const l=lm.get(String(x.zona)+'|'+String(x.secao))||{};const lat=l.NR_LATITUDE??null,lon=l.NR_LONGITUDE??null;if(lat!=null&&lon!=null)withCoords++;return {NR_ZONA:x.zona,NR_SECAO:x.secao,NR_LOCAL_VOTACAO:l.NR_LOCAL_VOTACAO||x.codigo_local||'',NM_LOCAL_VOTACAO:l.NM_LOCAL_VOTACAO||x.local_nome||'',DS_ENDERECO:l.DS_ENDERECO||x.endereco||'',NM_BAIRRO:l.NM_BAIRRO||x.bairro||'',NR_CEP:l.NR_CEP||'',NR_LATITUDE:lat,NR_LONGITUDE:lon,VOTOS_PCB:Number(x.votos_total||0)}});
total+=data.length;fs.writeFileSync(path.join(out,slug+'.json'),JSON.stringify(data));if((i+1)%50===0)console.log(i+1,'/',ms.length)}
console.log(JSON.stringify({municipios:ms.length,secoes:total,com_coordenadas:withCoords}));
if(ms.length!==645)throw Error('Esperados 645 municípios');
for(const n of ['campinas','santos','sao-paulo','franca'])if(!fs.existsSync(path.join(out,n+'.json')))throw Error('Faltou '+n);
})().catch(e=>{console.error(e);process.exit(1)});