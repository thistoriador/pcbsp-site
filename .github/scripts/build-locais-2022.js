const fs=require('fs'),path=require('path'),https=require('https'),{execFileSync}=require('child_process');
const URL='https://cdn.tse.jus.br/estatistica/sead/odsele/eleitorado_locais_votacao/eleitorado_local_votacao_2022.zip';
const tmp='/tmp/tse-locais-2022.zip', out='mapa/teste-estadual/locais';
function dl(url,file){return new Promise((ok,no)=>{https.get(url,r=>{if(r.statusCode>=300&&r.statusCode<400&&r.headers.location)return dl(r.headers.location,file).then(ok,no);if(r.statusCode!==200)return no(new Error('HTTP '+r.statusCode));const w=fs.createWriteStream(file);r.pipe(w);w.on('finish',()=>w.close(ok));}).on('error',no)})}
function slug(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
(async()=>{
 await dl(URL,tmp); fs.rmSync('/tmp/tse-locais',{recursive:true,force:true});fs.mkdirSync('/tmp/tse-locais');
 execFileSync('unzip',['-q',tmp,'-d','/tmp/tse-locais']);
 const csv=fs.readdirSync('/tmp/tse-locais').find(x=>x.toLowerCase().endsWith('.csv'));if(!csv)throw Error('CSV não encontrado');
 const txt=fs.readFileSync('/tmp/tse-locais/'+csv,'latin1');
 const lines=txt.split(/\r?\n/).filter(Boolean), head=parse(lines[0]), ix=Object.fromEntries(head.map((x,i)=>[x,i]));
 const need=['SG_UF','NM_MUNICIPIO','NR_ZONA','NR_SECAO','NR_LOCAL_VOTACAO','NM_LOCAL_VOTACAO','DS_ENDERECO','NM_BAIRRO','NR_CEP','NR_LATITUDE','NR_LONGITUDE','QT_ELEITOR_SECAO'];
 for(const k of need)if(ix[k]==null)throw Error('Coluna ausente: '+k);
 const by={};
 for(let n=1;n<lines.length;n++){const a=parse(lines[n]);if(a[ix.SG_UF]!=='SP')continue;const m=a[ix.NM_MUNICIPIO],k=slug(m);(by[k]??=[]).push({NR_ZONA:+a[ix.NR_ZONA],NR_SECAO:+a[ix.NR_SECAO],NR_LOCAL_VOTACAO:a[ix.NR_LOCAL_VOTACAO],NM_LOCAL_VOTACAO:a[ix.NM_LOCAL_VOTACAO],DS_ENDERECO:a[ix.DS_ENDERECO],NM_BAIRRO:a[ix.NM_BAIRRO],NR_CEP:a[ix.NR_CEP],NR_LATITUDE:num(a[ix.NR_LATITUDE]),NR_LONGITUDE:num(a[ix.NR_LONGITUDE]),QT_ELEITOR_SECAO:+a[ix.QT_ELEITOR_SECAO]||0});}
 fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
 for(const [k,v] of Object.entries(by))fs.writeFileSync(path.join(out,k+'.json'),JSON.stringify(v));
 console.log('municípios SP:',Object.keys(by).length,'registros:',Object.values(by).reduce((s,v)=>s+v.length,0));
 if(Object.keys(by).length!==645)throw Error('Esperados 645 municípios');
 function parse(line){const r=[];let x='',q=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(q&&line[i+1]==='"'){x+='"';i++}else q=!q}else if(c===';'&&!q){r.push(x);x=''}else x+=c}r.push(x);return r}
 function num(v){if(!v||v==='#NULO'||v==='#NE'||v==='-1'||v==='-3')return null;const n=Number(String(v).replace(',','.'));return Number.isFinite(n)?n:null}
})().catch(e=>{console.error(e);process.exit(1)});