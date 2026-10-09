import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const URL = Deno.env.get("SUPABASE_URL")!;

const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

const svc = createClient(URL, SERVICE, {

  auth: { persistSession: false, autoRefreshToken: false }

});

const cors = {

  "Access-Control-Allow-Origin": "https://pcbsp.com.br",

  "Access-Control-Allow-Headers": "authorization, content-type",

  "Access-Control-Allow-Methods": "POST, OPTIONS",

  "Content-Type": "application/json"

};

const out = (body: any, status = 200) =>

  new Response(JSON.stringify(body), { status, headers: cors });

const clean = (v: any, n = 200) =>

  String(v ?? "").trim().slice(0, n);

async function auth(req: Request) {

  const h = req.headers.get("authorization") || "";

  const token = h.replace(/^Bearer\s+/i, "");

  if (!token)

    throw new Error("Sessão administrativa necessária.");

  const {

    data: { user },

    error

  } = await svc.auth.getUser(token);

  if (error || !user)

    throw new Error("Sessão inválida ou expirada.");

  const { data: p } = await svc

    .from("profiles")

    .select(

      "user_id,nome,login_name,email,role,ativo,approval_status"

    )

    .eq("user_id", user.id)

    .maybeSingle();

  if (!p?.ativo || p.approval_status !== "APROVADO")

    throw new Error("Usuário sem acesso administrativo ativo.");

  return { user, p, token };

}

function canAll(p: any) {

  return p.role === "SUPERADMIN" || p.role === "ADMIN";

}

function canManageUsers(p: any) {

  return p.role === "SUPERADMIN" || p.role === "ADMIN";

}

Deno.serve(async (req) => {

  if (req.method === "OPTIONS")

    return new Response(null, { headers: cors });

  if (req.method !== "POST")

    return out({ erro: "Método não permitido." }, 405);

  try {

    const b = await req.json().catch(() => ({}));

    const action = clean(b.action, 60);

    const d = b.data || {};

    // =========================================================

    // ATIVAÇÃO INICIAL

    // =========================================================

    if (action === "bootstrap") return out({erro:"Ativação inicial desabilitada."},410);

    if (action === "login") {
      const login = clean(d.login_name, 80).toLowerCase();
      const pw = String(d.password || "");
      if (!login || !pw) return out({erro:"Usuário ou senha inválidos."},401);
      const key = "admin-login:" + login;
      async function record(event: "success"|"failure"|"blocked") {
        const {error} = await svc.rpc("admin_login_record",{p_login:login,p_event:event,p_ip:null});
        if (error) console.error("admin_login_record:",error.code || "unknown");
      }
      async function limit(event: "check"|"failure"|"success"): Promise<boolean> {
        const {data,error} = await svc.rpc("admin_login_limit",{p_key:key,p_event:event});
        if (error) {
          console.error("admin_login_limit unavailable:",error.code || "unknown");
          throw new Error("Não foi possível validar o acesso agora. Tente novamente em instantes.");
        }
        return data === true;
      }
      if (!(await limit("check"))) {
        await record("blocked");
        return out({erro:"Muitas tentativas de acesso. Aguarde 15 minutos e tente novamente."},429);
      }
      const {data:p,error:profileError} = await svc.from("profiles")
        .select("email,ativo,approval_status").ilike("login_name",login).maybeSingle();
      if (profileError) throw profileError;
      if (!p?.ativo || p.approval_status !== "APROVADO" || !p.email) {
        await limit("failure");
        await record("failure");
        return out({erro:"Usuário ou senha inválidos."},401);
      }
      const anon = createClient(URL,ANON,{auth:{persistSession:false,autoRefreshToken:false}});
      const {data:sessionData,error:loginError} = await anon.auth.signInWithPassword({email:p.email,password:pw});
      if (loginError || !sessionData.session) {
        await limit("failure");
        await record("failure");
        return out({erro:"Usuário ou senha inválidos."},401);
      }
      await limit("success");
      await record("success");
      return out({ok:true,access_token:sessionData.session.access_token,
        refresh_token:sessionData.session.refresh_token,expires_at:sessionData.session.expires_at});
    }

    // =========================================================
    // AUTOCADASTRO PARA SOLICITAR ACESSO
    // =========================================================

    if (action === "request_access") {

      const email = clean(

        d.email,

        200

      ).toLowerCase();

      const login = clean(d.login_name, 60);

      const nome = clean(d.nome, 160);

      const password = String(d.password || "");

      if (

        !email ||

        !login ||

        !nome ||

        password.length < 8

      )

        return out(

          {

            erro:

              "Dados incompletos ou senha muito curta."

          },

          400

        );

      const { data: dup } = await svc

        .from("profiles")

        .select("user_id")

        .ilike("login_name", login)

        .maybeSingle();

      if (dup)

        return out(

          { erro: "Este login já está em uso." },

          409

        );

      const { data: u, error: ue } =

        await svc.auth.admin.createUser({

          email,

          password,

          email_confirm: false,

          user_metadata: { nome }

        });

      if (ue || !u.user)

        return out(

          {

            erro:

              ue?.message ||

              "Falha ao solicitar acesso."

          },

          400

        );

      const { error: pe } = await svc

        .from("profiles")

        .insert({

          user_id: u.user.id,

          nome,

          login_name: login,

          email,

          role: "RESPONSAVEL",

          ativo: false,

          approval_status: "PENDENTE"

        });

      if (pe) {

        await svc.auth.admin.deleteUser(u.user.id);

        return out(

          { erro: pe.message },

          400

        );

      }

      return out({

        ok: true,

        mensagem:

          "Solicitação enviada. Aguarde aprovação do SUPERADMIN."

      });

    }

    // =========================================================

    // DAQUI PARA BAIXO EXIGE LOGIN

    // =========================================================

    const A = await auth(req);

    if (action === "message_contacts") {
 const {data,error}=await svc.from("profiles").select("user_id,nome,role").eq("ativo",true).eq("approval_status","APROVADO").neq("user_id",A.user.id).order("nome").limit(500);
 if(error)throw error;return out({ok:true,rows:data||[]});
}
if (action === "message_send") {
 const recipient=clean(d.recipient_id,80),subject=clean(d.subject,140),body=clean(d.body,4001);
 if(!/^[0-9a-f-]{36}$/i.test(recipient)||!subject||!body||body.length>4000||recipient===A.user.id)return out({erro:"Preencha destinatário, assunto e mensagem (até 4.000 caracteres)."},400);
 const {data:dest,error:de}=await svc.from("profiles").select("user_id").eq("user_id",recipient).eq("ativo",true).eq("approval_status","APROVADO").maybeSingle();
 if(de)throw de;if(!dest)return out({erro:"Destinatário não está ativo."},403);
 const {error}=await svc.from("recruiter_messages").insert({sender_id:A.user.id,recipient_id:recipient,subject,body});
 if(error)throw error;return out({ok:true});
}
if (action === "message_send_batch") {
 const subject=clean(d.subject,140),body=clean(d.body,4001),all=d.all===true;
 if(!subject||!body||body.length>4000)return out({erro:"Informe assunto e mensagem (máximo 4.000 caracteres)."},400);
 if(all&&!canManageUsers(A.p))return out({erro:"Envio para todos é exclusivo dos administradores."},403);
 const raw=Array.isArray(d.recipient_ids)?d.recipient_ids:[];
 if(!all&&(raw.length<1||raw.length>100||raw.some((id:any)=>typeof id!=="string"||!/^[0-9a-f-]{36}$/i.test(id))))
   return out({erro:"Selecione de 1 a 100 destinatários válidos."},400);
 let q=svc.from("profiles").select("user_id").eq("ativo",true).eq("approval_status","APROVADO").neq("user_id",A.user.id).limit(500);
 if(!all)q=q.in("user_id",[...new Set(raw)]);
 const {data:people,error:pe}=await q;if(pe)throw pe;
 const ids=(people||[]).map((x:any)=>x.user_id);
 if(!all&&ids.length!==new Set(raw).size)return out({erro:"Um ou mais destinatários não estão ativos."},400);
 if(ids.length===0)return out({erro:"Nenhum destinatário ativo encontrado."},400);
 if(ids.length>100)return out({erro:"O limite de envio é de 100 destinatários por operação."},400);
 const rows=ids.map((recipient_id:string)=>({sender_id:A.user.id,recipient_id,subject,body}));
 const {error}=await svc.from("recruiter_messages").insert(rows);
 if(error)throw error;
 return out({ok:true,sent:ids.length});
}
if (action === "message_list") {
 const sent=d.folder==="sent",col=sent?"sender_id":"recipient_id";
 const {data,error}=await svc.from("recruiter_messages").select("id,sender_id,recipient_id,subject,body,created_at,read_at").eq(col,A.user.id).order("created_at",{ascending:false}).limit(100);
 if(error)throw error;
 const ids=[...new Set((data||[]).map((x:any)=>sent?x.recipient_id:x.sender_id))];
 let names=new Map<string,string>();
 if(ids.length){const {data:profiles,error:pe}=await svc.from("profiles").select("user_id,nome").in("user_id",ids);if(pe)throw pe;names=new Map((profiles||[]).map((x:any)=>[x.user_id,x.nome]));}
 return out({ok:true,rows:(data||[]).map((x:any)=>({...x,other_name:names.get(sent?x.recipient_id:x.sender_id)||"Usuário"}))});
}
if (action === "message_read") {
 const id=clean(d.id,80);
 const {data:msg,error}=await svc.from("recruiter_messages").select("id,read_at").eq("id",id).eq("recipient_id",A.user.id).maybeSingle();
 if(error)throw error;if(!msg)return out({erro:"Mensagem não encontrada."},404);
 if(!msg.read_at){const {error:ue}=await svc.from("recruiter_messages").update({read_at:new Date().toISOString()}).eq("id",id).eq("recipient_id",A.user.id);if(ue)throw ue;}
 return out({ok:true});
}
if (action === "login_history") {
      if (A.p.role !== "SUPERADMIN") return out({erro:"Acesso restrito ao SUPERADMIN."},403);
      const filter = ["success","failure","blocked"].includes(String(d.event)) ? String(d.event) : null;
      const {data,error} = await svc.rpc("admin_login_history_read",{p_limit:100,p_event:filter});
      if (error) throw error;
      return out({ok:true,rows:data||[]});
    }

    if (action === "territory_summary") {
      if (!["SUPERADMIN","ADMIN","RECRUTADOR_ESTADUAL"].includes(A.p.role))
        return out({erro:"Sem permissão para consulta estadual."},403);
      const {data,error}=await svc.from("recrutamentos").select("cidade,estado,status").limit(10000);
      if(error) throw error;
      const counts=new Map<string,number>();
      for(const row of data||[]){
        const city=clean(row.cidade,120);
        const state=clean(row.estado,60);
        if(!city)continue;
        const key=city+"||"+state;
        counts.set(key,(counts.get(key)||0)+1);
      }
      // Municípios com poucos registros não são apresentados individualmente.
      const rows=[...counts].filter(([,total])=>total>=3).map(([key,total])=>{
        const [cidade,estado]=key.split("||");return {cidade,estado,total};
      });
      const protectedCount=[...counts].filter(([,total])=>total<3).reduce((sum,[,n])=>sum+n,0);
      return out({ok:true,rows,protected_count:protectedCount,privacy_threshold:3});
    }

    if (action === "me")

      return out({

        ok: true,

        profile: A.p

      });

    // =========================================================

    // DASHBOARD

    // =========================================================

    if (action === "dashboard") {

      const q = (table: string) =>

        svc.from(table).select("*", {

          count: "exact",

          head: true

        });

      const [r, c] = await Promise.all([

        q("recrutamentos"),

        q("circulistas")

      ]);

      const { data: rows } = await svc

        .from("recrutamentos")

        .select(

          "etapa,status,created_at,responsavel_id"

        )

        .order("created_at", {

          ascending: false

        })

        .limit(5000);

      const visible = canAll(A.p)

        ? rows || []

        : (rows || []).filter(

            (x: any) =>

              x.responsavel_id === A.user.id

          );

      const stages: any = {};

      for (const x of visible)

        stages[x.etapa] =

          (stages[x.etapa] || 0) + 1;

      return out({

        ok: true,

        total_recrutamentos: canAll(A.p)

          ? r.count

          : visible.length,

        total_circulistas: canAll(A.p)

          ? c.count

          : 0,

        etapas: stages

      });

    }

    // =========================================================

    // RECRUTAMENTOS

    // =========================================================

    if (action === "list_recrutamentos") {

      let q = svc

        .from("recrutamentos")

        .select(

          "id,codigo,nome,whatsapp,cidade,bairro,etapa,status,responsavel_id,proxima_acao,data_proxima_acao,created_at,observacoes,legacy_id,tipo_cadastro,origem_encaminhamento,idade,data_nascimento"

        )

        .order("created_at", {

          ascending: false

        })

        .limit(1000);

      if (!canAll(A.p))

        q = q.eq(

          "responsavel_id",

          A.user.id

        );

      const { data, error } = await q;

      if (error) throw error;

      return out({

        ok: true,

        rows: data

      });

    }

    if (action === "get_recrutamento") {

      let q = svc

        .from("recrutamentos")

        .select("*")

        .eq("id", clean(d.id, 80));

      if (!canAll(A.p))

        q = q.eq(

          "responsavel_id",

          A.user.id

        );

      const { data, error } =

        await q.maybeSingle();

      if (error) throw error;

      if (!data)

        return out(

          {

            erro:

              "Cadastro não encontrado."

          },

          404

        );

      const { data: hist } = await svc

        .from("recrutamento_historico")

        .select(

          "acao,detalhe,created_at,ator_id"

        )

        .eq(

          "recrutamento_id",

          data.id

        )

        .order("created_at", {

          ascending: false

        });

      return out({

        ok: true,

        row: data,

        historico: hist || []

      });

    }

    if (action === "update_recrutamento") {

      const id = clean(d.id, 80);

      let check = svc

        .from("recrutamentos")

        .select(

          "id,responsavel_id"

        )

        .eq("id", id);

      if (!canAll(A.p))

        check = check.eq(

          "responsavel_id",

          A.user.id

        );

      const { data: old } =

        await check.maybeSingle();

      if (!old)

        return out(

          {

            erro:

              "Sem permissão para este cadastro."

          },

          403

        );

      if (!canAll(A.p) && Object.prototype.hasOwnProperty.call(d,"responsavel_id"))
        return out({erro:"Transferência de responsável restrita à administração."},403);
      const patch: any = {};

      for (const k of [

        "etapa",

        "proxima_acao",

        "data_proxima_acao",

        "responsavel_id",

        "status",

        "observacoes"

      ]) {

        if (k in d)

          patch[k] = d[k] || null;

      }

      if (Object.prototype.hasOwnProperty.call(d,"tipo_cadastro")) {
        if (!["PCB","ENCAMINHADO_PCB","UJC"].includes(d.tipo_cadastro))
          return out({erro:"Tipo de cadastro inválido."},400);
        patch.tipo_cadastro=d.tipo_cadastro;
      }
      if (Object.prototype.hasOwnProperty.call(d,"origem_encaminhamento"))
        patch.origem_encaminhamento=clean(d.origem_encaminhamento,160)||null;
      patch.updated_at =

        new Date().toISOString();

      const { error } = await svc

        .from("recrutamentos")

        .update(patch)

        .eq("id", id);

      if (error) throw error;

      await svc

        .from("recrutamento_historico")

        .insert({

          recrutamento_id: id,

          ator_id: A.user.id,

          acao: "ATUALIZACAO_ADMIN",

          detalhe: clean(

            d.detalhe ||

              "Ficha atualizada no painel administrativo.",

            1000

          )

        });

      return out({ ok: true });

    }

    // =========================================================

    // CIRCULISTAS

    // =========================================================

    if (action === "list_circulistas") {

      if (!canAll(A.p))

        return out(

          { erro: "Sem permissão." },

          403

        );

      const { data, error } = await svc

        .from("circulistas")

        .select(

          "id,codigo,nome,whatsapp,email,cidade,bairro,valor_preferido,forma_preferida,situacao,created_at"

        )

        .order("created_at", {

          ascending: false

        })

        .limit(1000);

      if (error) throw error;

      return out({

        ok: true,

        rows: data

      });

    }

    // =========================================================

    // LISTAR USUÁRIOS

    // SUPERADMIN e ADMIN

    // =========================================================

    if (action === "list_users") {

      if (!canManageUsers(A.p))

        return out(

          {

            erro:

              "Acesso restrito a administradores."

          },

          403

        );

      const { data, error } = await svc

        .from("profiles")

        .select(

          "user_id,nome,login_name,email,role,ativo,approval_status,created_at"

        )

        .order("nome");

      if (error) throw error;

      const ids=(data||[]).map((x:any)=>x.user_id);
      const confirmed=new Map<string,boolean>();
      for(const id of ids){
        const {data:authData,error:authError}=await svc.auth.admin.getUserById(id);
        if(authError){console.error("user confirmation lookup:",authError.code||"unknown");continue;}
        confirmed.set(id,!!authData.user?.email_confirmed_at);
      }
      return out({ok:true,rows:(data||[]).map((x:any)=>({...x,email_confirmed:confirmed.has(x.user_id)?confirmed.get(x.user_id):null}))});

    }

    // =========================================================

    // APROVAR AUTOCADASTRO

    // SOMENTE SUPERADMIN

    // =========================================================

    if (action === "approve_user") {

      if (A.p.role !== "SUPERADMIN")

        return out(

          {

            erro:

              "Apenas SUPERADMIN pode aprovar solicitações."

          },

          403

        );

      const uid = clean(

        d.user_id,

        80

      );

      const role = clean(

        d.role,

        30

      );

      if (

        !["ADMIN", "RECRUTADOR_LOCAL", "RECRUTADOR_ESTADUAL", "RESPONSAVEL"].includes(

          role

        )

      )

        return out(

          { erro: "Perfil inválido." },

          400

        );

      const {data:pending,error:pendingError}=await svc.from("profiles").select("approval_status").eq("user_id",uid).maybeSingle();
      if(pendingError)throw pendingError;
      if(pending?.approval_status!=="PENDENTE")return out({erro:"Solicitação não está pendente."},409);
      const {error:confirmError}=await svc.auth.admin.updateUserById(uid,{email_confirm:true});
      if(confirmError)return out({erro:"Falha ao confirmar e-mail: "+confirmError.message},400);
      const {data:approved,error}=await svc.from("profiles").update({role,ativo:true,approval_status:"APROVADO",updated_at:new Date().toISOString()}).eq("user_id",uid).eq("approval_status","PENDENTE").select("user_id");
      if(error)throw error;
      if(!approved?.length)return out({erro:"Aprovação não concluída."},409);
      return out({ok:true});

    }

    // =========================================================

    // RECUSAR AUTOCADASTRO

    // SOMENTE SUPERADMIN

    // =========================================================

    if (action === "confirm_approved_email") {
      if(A.p.role!=="SUPERADMIN")return out({erro:"Apenas SUPERADMIN pode confirmar e-mails."},403);
      const uid=clean(d.user_id,80);
      const {data:target,error:targetError}=await svc.from("profiles").select("approval_status,ativo").eq("user_id",uid).maybeSingle();
      if(targetError)throw targetError;
      if(!target||target.approval_status!=="APROVADO"||!target.ativo)return out({erro:"Conta não aprovada ou inativa."},409);
      const {data:updated,error:confirmError}=await svc.auth.admin.updateUserById(uid,{email_confirm:true});
      if(confirmError)return out({erro:"Falha ao confirmar e-mail: "+confirmError.message},400);
      const {error:auditError}=await svc.from("audit_log").insert({ator_user_id:A.user.id,entidade:"profiles",entidade_id:uid,acao:"CONFIRMACAO_EMAIL_ADMIN",metadata:{email_confirmado:true}});
      if(auditError)console.error("audit_log confirm_approved_email:",auditError.code||"unknown");
      return out({ok:true,email_confirmed:!!updated?.user?.email_confirmed_at});
    }
    if (action === "reject_user") {

      if (A.p.role !== "SUPERADMIN")

        return out(

          {

            erro:

              "Apenas SUPERADMIN pode recusar solicitações."

          },

          403

        );

      const uid = clean(

        d.user_id,

        80

      );

      const { error } = await svc

        .from("profiles")

        .update({

          ativo: false,

          approval_status: "RECUSADO",

          updated_at:

            new Date().toISOString()

        })

        .eq("user_id", uid)

        .eq(

          "approval_status",

          "PENDENTE"

        );

      if (error) throw error;

      return out({ ok: true });

    }

    // =========================================================

    // CRIAR USUÁRIO

    // SUPERADMIN e ADMIN

    // =========================================================

    if (action === "create_user") {

      if (!canManageUsers(A.p))

        return out(

          {

            erro:

              "Acesso restrito a administradores."

          },

          403

        );

      const email = clean(

        d.email,

        200

      ).toLowerCase();

      const login = clean(

        d.login_name,

        60

      );

      const nome = clean(

        d.nome,

        160

      );

      const role = clean(

        d.role,

        30

      );

      const password =

        String(d.password || "");

      if (

        !email ||

        !login ||

        !nome ||

        !["ADMIN","RECRUTADOR_LOCAL","RECRUTADOR_ESTADUAL","RESPONSAVEL"].includes(role)

      )

        return out(

          {

            erro:

              "Dados do usuário incompletos."

          },

          400

        );

      // O frontend acrescenta ::P!

      // 10 recebidos = mínimo 6 digitados.

      if (password.length < 8)

        return out(

          {

            erro:

              "A senha inicial deve ter pelo menos 8 caracteres."

          },

          400

        );

      const { data: existingLogin } =

        await svc

          .from("profiles")

          .select("user_id")

          .ilike(

            "login_name",

            login

          )

          .maybeSingle();

      if (existingLogin)

        return out(

          {

            erro:

              "Este login já está em uso."

          },

          409

        );

      const { data: u, error: e } =

        await svc.auth.admin.createUser({

          email,

          password,

          email_confirm: true,

          user_metadata: { nome }

        });

      if (e || !u.user)

        return out(

          {

            erro:

              e?.message ||

              "Falha ao criar usuário."

          },

          400

        );

      const { error: pe } = await svc

        .from("profiles")

        .insert({

          user_id: u.user.id,

          nome,

          login_name: login,

          email,

          role,

          ativo: true,

          approval_status:

            "APROVADO"

        });

      if (pe) {

        await svc.auth.admin.deleteUser(

          u.user.id

        );

        return out(

          { erro: pe.message },

          400

        );

      }

      return out({ ok: true });

    }

    // =========================================================

    // EDITAR USUÁRIO

    // SUPERADMIN e ADMIN

    // ADMIN NÃO PODE ALTERAR SUPERADMIN

    // =========================================================

    if (action === "user_change_history") {
      if(!canManageUsers(A.p))return out({erro:"Acesso restrito a administradores."},403);
      const uid=clean(d.user_id,80);
      if(!uid)return out({erro:"Usuário não informado."},400);
      const {data:target,error:te}=await svc.from("profiles").select("user_id,role").eq("user_id",uid).maybeSingle();
      if(te)throw te;
      if(!target)return out({erro:"Usuário não encontrado."},404);
      if(target.role==="SUPERADMIN"&&A.p.role!=="SUPERADMIN")return out({erro:"Acesso restrito."},403);
      const {data,error}=await svc.from("audit_log").select("id,ator_user_id,acao,metadata,created_at").eq("entidade","profiles").eq("entidade_id",uid).in("acao",["REDEFINICAO_SENHA_USUARIO","EDICAO_USUARIO"]).order("created_at",{ascending:false}).limit(50);
      if(error)throw error;
      return out({ok:true,rows:data||[]});
    }

    if (action === "edit_user") {

      if (!canManageUsers(A.p))

        return out(

          {

            erro:

              "Acesso restrito a administradores."

          },

          403

        );

      const uid = clean(

        d.user_id,

        80

      );

      if (!uid)

        return out(

          {

            erro:

              "Usuário não informado."

          },

          400

        );

      const { data: target, error: te } =

        await svc

          .from("profiles")

          .select(

            "user_id,nome,login_name,email,role,ativo"

          )

          .eq("user_id", uid)

          .maybeSingle();

      if (te) throw te;

      if (!target)

        return out(

          {

            erro:

              "Usuário não encontrado."

          },

          404

        );

      // ADMIN nunca altera SUPERADMIN.

      if (

        target.role === "SUPERADMIN" &&

        A.p.role !== "SUPERADMIN"

      )

        return out(

          {

            erro:

              "ADMIN não pode alterar o SUPERADMIN."

          },

          403

        );

      const nome = clean(

        d.nome,

        160

      );

      const login = clean(

        d.login_name,

        60

      );

      const email = clean(

        d.email,

        200

      ).toLowerCase();

      const role = clean(

        d.role,

        30

      );

      const password =

        String(d.password || "");

      if (!nome || !login || !email)

        return out(

          {

            erro:

              "Nome, login e e-mail são obrigatórios."

          },

          400

        );

      if (

        !["SUPERADMIN","ADMIN","RECRUTADOR_LOCAL","RECRUTADOR_ESTADUAL","RESPONSAVEL"].includes(role)

      )

        return out(

          {

            erro:

              "Perfil inválido."

          },

          400

        );

      // SUPERADMIN não pode ser rebaixado.

      if (

        target.role === "SUPERADMIN" &&

        role !== "SUPERADMIN"

      )

        return out(

          {

            erro:

              "O perfil SUPERADMIN não pode ser alterado."

          },

          403

        );

      // Ninguém pode promover usuário comum

      // para SUPERADMIN por esta operação.

      if (

        target.role !== "SUPERADMIN" &&

        role === "SUPERADMIN"

      )

        return out(

          {

            erro:

              "A promoção para SUPERADMIN não está disponível."

          },

          403

        );

      const { data: duplicateLogin } =

        await svc

          .from("profiles")

          .select("user_id")

          .ilike(

            "login_name",

            login

          )

          .neq(

            "user_id",

            uid

          )

          .maybeSingle();

      if (duplicateLogin)

        return out(

          {

            erro:

              "Este login já está em uso."

          },

          409

        );

      if (

        password &&

        password.length < 8

      )

        return out(

          {

            erro:

              "A nova senha deve ter pelo menos 6 caracteres."

          },

          400

        );

      const authPatch: any = {

        email,

        user_metadata: { nome }

      };

      if (password)

        authPatch.password = password;

      const { error: authError } =

        await svc.auth.admin.updateUserById(

          uid,

          authPatch

        );

      if (authError)

        return out(

          {

            erro:

              authError.message

          },

          400

        );

      const { error: profileError } =

        await svc

          .from("profiles")

          .update({

            nome,

            login_name: login,

            email,

            role,

            updated_at:

              new Date().toISOString()

          })

          .eq(

            "user_id",

            uid

          );

      if (profileError)

        return out(

          {

            erro:

              profileError.message

          },

          400

        );
      // Auditoria de alterações de usuários, sem armazenar senhas.
      const changedFields = ["nome","login_name","email","role"].filter(k =>
        String((target as any)[k] ?? "") !== String(({nome,login_name:login,email,role} as any)[k] ?? "")
      );
      const {error:auditError} = await svc.from("audit_log").insert({
        ator_user_id:A.user.id,entidade:"profiles",entidade_id:uid,
        acao:password ? "REDEFINICAO_SENHA_USUARIO" : "EDICAO_USUARIO",
        metadata:{campos_alterados:changedFields,senha_redefinida:!!password}
      });
      if(auditError) console.error("audit_log edit_user:",auditError.code || "unknown");
      return out({ ok: true });
    }

    // =========================================================

    // ATIVAR / DESATIVAR USUÁRIO

    // SUPERADMIN e ADMIN

    // SUPERADMIN É PROTEGIDO

    // =========================================================

    if (action === "set_user_active") {

      if (!canManageUsers(A.p))

        return out(

          {

            erro:

              "Acesso restrito a administradores."

          },

          403

        );

      const uid = clean(

        d.user_id,

        80

      );

      if (uid === A.user.id)

        return out(

          {

            erro:

              "Você não pode desativar seu próprio acesso."

          },

          400

        );

      const { data: target } =

        await svc

          .from("profiles")

          .select("role")

          .eq(

            "user_id",

            uid

          )

          .maybeSingle();

      if (!target)

        return out(

          {

            erro:

              "Usuário não encontrado."

          },

          404

        );

      if (

        target.role === "SUPERADMIN"

      )

        return out(

          {

            erro:

              "O SUPERADMIN não pode ser desativado."

          },

          403

        );

      const { error } = await svc

        .from("profiles")

        .update({

          ativo: !!d.ativo,

          updated_at:

            new Date().toISOString()

        })

        .eq(

          "user_id",

          uid

        );

      if (error) throw error;

      return out({ ok: true });

    }

    // =========================================================

    // EXCLUIR USUÁRIO

    // SUPERADMIN e ADMIN

    // SUPERADMIN É PROTEGIDO

    // =========================================================

    if (action === "delete_user") {

      if (!canManageUsers(A.p))

        return out(

          {

            erro:

              "Acesso restrito a administradores."

          },

          403

        );

      const uid = clean(

        d.user_id,

        80

      );

      if (!uid)

        return out(

          {

            erro:

              "Usuário não informado."

          },

          400

        );

      if (uid === A.user.id)

        return out(

          {

            erro:

              "Você não pode excluir seu próprio usuário."

          },

          400

        );

      const { data: target, error: te } =

        await svc

          .from("profiles")

          .select(

            "user_id,role"

          )

          .eq(

            "user_id",

            uid

          )

          .maybeSingle();

      if (te) throw te;

      if (!target)

        return out(

          {

            erro:

              "Usuário não encontrado."

          },

          404

        );

      if (

        target.role === "SUPERADMIN"

      )

        return out(

          {

            erro:

              "O SUPERADMIN não pode ser excluído."

          },

          403

        );

      // Libera recrutamentos atribuídos.

      const { error: re } = await svc

        .from("recrutamentos")

        .update({

          responsavel_id: null

        })

        .eq(

          "responsavel_id",

          uid

        );

      if (re) throw re;

      // Libera circulistas atribuídos.

      const { error: ce } = await svc

        .from("circulistas")

        .update({

          responsavel_id: null

        })

        .eq(

          "responsavel_id",

          uid

        );

      if (ce) throw ce;

      const { error: de } =

        await svc.auth.admin.deleteUser(

          uid

        );

      if (de) throw de;

      return out({ ok: true });

    }

    // =========================================================

    // ALTERAR A PRÓPRIA SENHA

    // =========================================================

    if (action === "change_password") {
      const currentPassword = String(d.current_password || "");
      const newPassword = String(d.password || "");
      if (!currentPassword || newPassword.length < 8)
        return out({erro:"Informe a senha atual e uma nova senha de pelo menos 8 caracteres."},400);
      const anon = createClient(URL, ANON, {auth:{persistSession:false,autoRefreshToken:false}});
      const {error: verifyError} = await anon.auth.signInWithPassword({email:A.user.email!,password:currentPassword});
      if (verifyError) return out({erro:"Senha atual incorreta."},403);
      const {error} = await svc.auth.admin.updateUserById(A.user.id,{password:newPassword});
      if (error) throw error;
      return out({ok:true});
    }

    return out(

      {

        erro:

          "Ação inválida."

      },

      400

    );

  } catch (e) {

    return out(

      {

        erro:

          e instanceof Error

            ? e.message

            : "Erro interno."

      },

      400

    );

  }

});