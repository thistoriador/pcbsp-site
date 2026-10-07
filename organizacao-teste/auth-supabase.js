// APP2 — adaptador de autenticação Supabase.
// CP3: arquivo preparado, ainda NÃO carregado pelo index.html.
(function(){
  'use strict';
  const SESSION_MAX_MS = 60 * 60 * 1000;
  const IDLE_MAX_MS = 10 * 60 * 1000;

  function config(){
    const c=window.PCB_ORG_SUPABASE;
    if(!c || !c.url || !c.publishableKey) throw new Error('Configuração Supabase ausente.');
    return c;
  }
  function client(){
    if(!window.supabase?.createClient) throw new Error('Biblioteca Supabase não carregada.');
    const c=config();
    return window.supabase.createClient(c.url,c.publishableKey,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
    });
  }
  async function loadProfile(sb,userId){
    const {data,error}=await sb.from('org_profiles')
      .select('user_id,display_name,role,scope,active')
      .eq('user_id',userId).maybeSingle();
    if(error) throw error;
    if(!data || !data.active) throw new Error('Perfil interno inexistente ou inativo.');
    const allowed=['SUPERADMIN','ADMIN_CR','FINANCAS_CR','LEITURA_CR'];
    if(!allowed.includes(data.role)) throw new Error('Perfil sem acesso ao domínio Direção.');
    return data;
  }
  window.PCBOrgAuth=Object.freeze({client,loadProfile,SESSION_MAX_MS,IDLE_MAX_MS});
})();
