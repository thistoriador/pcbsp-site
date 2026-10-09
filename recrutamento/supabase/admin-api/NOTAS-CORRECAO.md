# Correção do fluxo de aprovação — 2026-10-09

Arquivo: `admin-api/index.ts`. Origem: Supabase Edge Function admin-api v21, SHA256 `9929d84253d493a8d249ec0dccc299bb13d009220c49c3063b7b0a9c98488864`.

## Alterações
- Ao aprovar solicitação pendente, confirmar email no Supabase Auth antes de aprovar o perfil.
- Adicionar ação `confirm_approved_email`, somente SUPERADMIN, para regularização individual de contas já aprovadas e ativas.
- Registrar tentativa de regularização no audit_log; não altera senhas.

## Implantação
- Revisar diff com a versão 21 antes de publicar.
- Publicar como Edge Function admin-api (manter configuração de JWT atual e autenticação própria).
- Testar primeiro em conta controlada. Não executar regularização em lote sem revisão.
- Atenção: o endpoint de regularização exige chamada autenticada; não foi adicionado botão ao frontend.

## Status
- Preparado em branch isolada, não implantado em produção.
- Testes funcionais e publicação pendentes.
