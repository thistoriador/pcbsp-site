# APP2 — Cronograma de migração segura

Data-base: 07/10/2026

Regra: ALTERAR → AUDITAR → TESTAR POSITIVO → TESTAR NEGAÇÃO → COMMIT/CHECKPOINT → AVANÇAR.

## CP0 — Base funcional preservada
- UI funcional anterior: `563a244e`
- Segurança documentada: `fe4fc54e`
- Fronteira Direção registrada: `c79a7636`
- Supabase migration: `organizacao_direcao_security_boundary`
- Rollback lógico: retornar UI ao checkpoint funcional e reverter apenas a migration específica necessária.

## CP1 — Auditoria e endurecimento do backend — CONCLUÍDO
Supabase:
- `organizacao_cp1_hardening_indexes`
- `organizacao_cp1_revoke_public_helpers`
Testes:
- todas as tabelas APP2 com RLS;
- sem sessão: Direção/Admin/Finanças = false;
- helpers APP2 sem EXECUTE para anon/PUBLIC;
- 9 FKs APP2 deixaram de aparecer como sem índice no advisor;
- achados APP1 separados e intocados.

## CP1 — Auditoria e endurecimento do backend
Objetivo:
- auditar RLS/policies/helpers;
- retirar exposição desnecessária dos helpers;
- adicionar índices APP2 necessários;
- não tocar APP1;
- confirmar usuário anônimo/sem perfil sem acesso estadual.

Critérios de saída:
- todas `org_*` com RLS;
- nenhuma política estadual baseada em ADMIN_LOCAL;
- helpers sem exposição anônima desnecessária;
- testes de negação aprovados;
- advisors revisados.

## CP2 — Auditoria imutável de ações sensíveis — CONCLUÍDO
Supabase: `organizacao_cp2_audit_log`
Testes:
- `org_audit_log` com RLS;
- anon sem SELECT;
- authenticated tem apenas SELECT nominal e ainda depende de policy SUPERADMIN;
- authenticated sem INSERT/UPDATE/DELETE;
- índices de data, ator e ação criados;
- log vazio: nenhum dado fictício/pessoal introduzido.

## CP2 — Auditoria imutável de ações sensíveis
Objetivo:
- tabela de eventos de segurança/auditoria;
- leitura limitada;
- cliente não pode adulterar/apagar log;
- registrar mudanças críticas futuramente via backend seguro.

Critérios:
- RLS ativo;
- INSERT/UPDATE/DELETE diretos do cliente negados;
- índices por usuário/data/ação;
- sem dados políticos desnecessários no log.

## CP3 — Preparação do Supabase Auth
Objetivo:
- manter login local funcionando enquanto a nova autenticação é preparada;
- definir perfis CR: SUPERADMIN, ADMIN_CR, FINANCAS_CR, LEITURA_CR;
- obter somente URL + publishable key para frontend;
- jamais expor service_role;
- preparar sessão e logout.

Critérios:
- frontend antigo não quebrado;
- chave usada é publishable;
- usuário não autenticado não lê `org_*`;
- perfil inativo não lê `org_*`.

## CP4 — Login real em modo paralelo
Objetivo:
- implementar Supabase Auth no APP2 de teste;
- manter fallback local temporário somente para recuperação/teste até validação;
- carregar `org_profiles` após autenticação;
- menus obedecem capacidades do perfil, mas segurança permanece no banco.

Critérios:
- login/logout;
- expiração/inatividade;
- refresh de sessão;
- nega perfil ausente/inativo;
- mapa, censo, cotizações e circulares continuam funcionando.

## CP5 — Usuários e Permissões real
Objetivo:
- tela real para listar/desativar/atribuir perfis CR;
- criação/convite somente por backend/Edge Function protegida;
- sem service_role no navegador.

Critérios:
- somente SUPERADMIN administra usuários;
- FINANCAS_CR não administra usuários;
- LEITURA_CR não escreve;
- desativação corta acesso;
- auditoria registra mudança de permissão.

## CP6 — MFA e sessão de emergência
Objetivo:
- MFA para contas internas;
- reautenticação para ações sensíveis;
- revogação/desativação administrativa;
- sessão curta e timeout.

Critérios:
- ação sensível exige nível adequado;
- conta desativada perde acesso;
- teste de aparelho/sessão comprometida;
- nenhum dado sensível persistido em localStorage.

## CP7 — Migração controlada dos módulos para backend
Ordem:
1. organismos/municípios;
2. snapshots/histórico;
3. circulares;
4. cotizações;
5. militantes, por último.

Cada módulo só migra após teste de regressão visual/funcional.

## CP8 — Teste integrado da Direção
Matriz:
- SUPERADMIN;
- ADMIN_CR;
- FINANCAS_CR;
- LEITURA_CR;
- sem perfil;
- perfil inativo;
- usuário local/organismo (negação estadual).

Testar desktop + celular e registrar checkpoint final.

## CP9 — Piloto futuro Área dos Organismos
Somente depois do APP Direção aprovado.
- domínio de dados separado;
- sem acesso direto a `org_militants` estadual;
- 2–3 organismos voluntários;
- ponte controlada Direção ↔ Organismos;
- avaliação antes de expansão.

## Auditoria paralela APP1
Achados do linter referentes a `mapa`, `mapa_import` e `api_mapa` ficam em trilha separada.
Não corrigir nesta migração sem teste específico do mapa eleitoral.
