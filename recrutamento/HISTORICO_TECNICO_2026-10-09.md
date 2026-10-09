# Histórico técnico — Recrutamento PCB-SP

## Checkpoint — 09/10/2026
- Branch de segurança: `checkpoint-recrutamento-2026-10-09`, criada a partir da `main` antes deste registro.
- Site: https://pcbsp.com.br/recrutamento/
- Repositório: `thistoriador/pcbsp-site`; página: `recrutamento/index.html`.
- Supabase (projeto): `zhrtwoigrmizpwwzpmwr`.
- Este checkpoint é do **código GitHub**, não um backup do banco de dados.
- O funcionamento de ponta a ponta **não foi confirmado**; usuário relatou que o portal deixou de responder. Não declarar esta versão estável sem testes.

## Registro de alterações e incidentes
1. `3c695421`: introdução da área de mensagens internas e manual, além das abas existentes.
2. `b6eefc2a`: inclusão de edição dos dados originais na ficha do recrutamento; posteriormente identificou-se erro de concatenação de string JavaScript em `openRecruit`.
3. `9696ca35`: ocultação da aba Circulistas; após relato de falha, alteração revertida.
4. `e24f9eb4`: restauração do menu Circulistas.
5. `6c941e8e`: correção pontual de sintaxe na edição da ficha, sem confirmação de recuperação funcional.
6. `7e80d4c5`: rollback integral de `recrutamento/index.html` para o conteúdo de `3c695421`, preservando os dados no Supabase. A edição original de cadastro deixou de constar no frontend.

## Pendências para próximo atendimento
- Investigar falha de navegação/login do painel em navegador real, inclusive service worker/cache de PWA e erros de console. Não presumir que rollback solucionou o problema.
- Corrigir tabela de municípios no celular: colunas muito largas, rolagem horizontal e nomes cortados; preservar ordenação e métricas.
- Na edição de usuários, adicionar botão de mostrar/ocultar **nova senha** e confirmação para evitar erro de digitação; não exibir senha existente, pois senhas de autenticação não devem ser recuperáveis em texto simples.
- Solicitação sobre a senha do usuário Júlio: **não consultar nem revelar senha atual**; usar fluxo autorizado de redefinição.
- Completar cidade, idade e WhatsApp quando faltarem em cadastros antigos, sem sobrescrever dados válidos, após corrigir e testar a interface de edição.
- Circulismo ainda não adotado: decisão de ocultar foi revertida devido ao incidente; só retomar após estabilização e testes.
- Mensagens para múltiplos destinatários: backend `admin-api` v19 suporta `message_send_batch`, mas interface de seleção múltipla não foi publicada.

## Protocolo seguro de alteração
1. Ler o arquivo e verificar a versão corrente.
2. Criar branch/checkpoint antes de alterar.
3. Alterar apenas a funcionalidade solicitada; validar sintaxe JavaScript e HTML.
4. Testar no desktop e no celular, inclusive login, menu, mapa, tabelas, edição e salvamento.
5. Publicar somente após validação; registrar commit, impacto e forma de rollback.
6. Nunca expor dados pessoais nem senhas nos logs de mudanças.
