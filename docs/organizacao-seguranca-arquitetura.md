# APP2 — Arquitetura de Segurança e Fronteiras de Dados

Status: decisão arquitetural — 07/10/2026

## 1. Decisão

O APP2 atual será consolidado primeiro como **instrumento da Direção Regional (CR)**.

Uma futura **Área dos Organismos** será tratada como outro domínio de segurança. Ela poderá compartilhar identidade visual e integrar-se ao APP2, mas **não terá acesso direto ao banco nominal estadual de militantes**.

A integração entre Direção e Organismos deverá ocorrer por uma ponte/API controlada, transmitindo somente os dados necessários a cada operação.

## 2. Princípio central

> O comprometimento de uma conta ou aparelho não deve significar o comprometimento da organização inteira.

Aplicar:
- menor privilégio;
- minimização de dados;
- compartimentação;
- separação entre administração técnica e acesso a conteúdo;
- autenticação forte;
- sessões revogáveis;
- auditoria de ações sensíveis;
- nenhuma chave secreta/service-role no navegador.

## 3. Domínios

### A. Direção Regional — APP2
Pode conter:
- painel/censo estadual;
- mapa e organismos;
- dados nominais estritamente necessários;
- cotizações estaduais;
- circulares;
- linha histórica;
- usuários/permissões;
- administração.

Acesso: número reduzido de usuários autorizados pelo CR.

### B. Área dos Organismos — futura
Pode conter:
- Meu Organismo;
- cadastro organizativo local;
- cotizações locais;
- atividades e relatórios;
- comunicação com CR/assistência;
- documentos/circulares;
- consultas estaduais;
- rede institucional dos organismos.

Regra: não consultar diretamente tabelas estaduais nominais.

### C. Ponte controlada
Exemplos:
- organismo envia totais/atualização organizativa ao CR;
- organismo envia relatório/demanda;
- CR publica circular/consulta;
- CR designa assistência;
- organismo confirma fotografia/censo.

A ponte deve expor somente operações explicitamente previstas.

## 4. Situação atual do Supabase

Projeto principal identificado: `cthntxgopxhbaemgnttn`.

Já existem tabelas APP2:
- org_profiles
- org_organisms
- org_organism_cities
- org_militants
- org_cot_local
- org_cot_cr
- org_history
- org_census_snapshots
- org_circulars
- org_cot_plans
- org_cot_submissions

Todas essas tabelas estão com RLS habilitado.

### Checkpoint de segurança aplicado — 07/10/2026

Migration Supabase: `organizacao_direcao_security_boundary`.

Implementado:
- leitura estadual das tabelas APP2 restrita a perfis do domínio Direção;
- `ADMIN_LOCAL` não é mais administrador estadual;
- helper `org_is_direction_user()`;
- administração geral restrita a `SUPERADMIN` e `ADMIN_CR`;
- papel `FINANCAS_CR` com escrita somente nas tabelas financeiras;
- papel `LEITURA_CR` para futura leitura estadual sem poder de escrita;
- usuário sem perfil válido retorna falso para acesso Direção, administração e finanças.

Papéis locais/organismos permanecem reservados para a futura Área dos Organismos e **não devem receber acesso às tabelas estaduais**.

## 5. Autenticação

O login local/PIN existente em `organizacao-teste/index.html` é apenas protótipo de interface.

Antes de dados reais:
- Supabase Auth;
- MFA para acesso interno;
- sessão curta e timeout por inatividade;
- revogação administrativa de sessões/acesso;
- reautenticação para ações sensíveis;
- nenhum dado sensível persistente em localStorage;
- nenhum segredo administrativo no frontend.

## 6. Modelo de permissões da Direção

Separar função de sistema de acesso ao conteúdo.

Papéis da primeira fronteira implementada:
- `SUPERADMIN` — administração técnica e administrativa;
- `ADMIN_CR` — administração organizativa estadual;
- `FINANCAS_CR` — leitura estadual + escrita nas tabelas financeiras;
- `LEITURA_CR` — leitura estadual sem escrita.

Papéis legados `ADMIN_REGIONAL`, `ADMIN_LOCAL` e `LEITURA` continuam aceitos no cadastro por compatibilidade, mas não pertencem à fronteira de leitura estadual definida por `org_is_direction_user()`.

SUPERADMIN não deve significar automaticamente acesso irrestrito a todo conteúdo por conveniência.

## 7. Dados

Classificar antes de produção:

### Estruturais
organismos, municípios, situação, histórico institucional.

### Pessoais sensíveis
nome de militante, contato, vínculo organizativo e demais dados identificáveis.

### Financeiros
cotizações, valores, repasses e comprovantes.

### Político-organizativos
relatórios, avaliações, demandas, atas, consultas e comunicações internas.

Aplicar minimização: se um campo não é necessário para uma finalidade definida, não coletar.

## 8. Exportações

Não disponibilizar exportação estadual genérica.

Exportações sensíveis devem:
- exigir permissão específica;
- exigir autenticação recente/MFA;
- registrar auditoria;
- limitar escopo e campos;
- evitar arquivos permanentes quando possível.

## 9. Auditoria

Registrar:
- login e encerramento/revogação de sessão;
- criação/desativação de usuário;
- mudança de permissão;
- exportação;
- alteração/exclusão de registros sensíveis;
- ações financeiras relevantes.

Não usar auditoria como rastreamento político/comportamental da militância.

## 10. Plano de implementação

### Fase 1 — agora
1. manter APP2 como ferramenta da Direção;
2. preservar dados reais fora do frontend/localStorage;
3. revisar RLS e papéis do domínio Direção;
4. substituir autenticação local por Supabase Auth somente após a matriz de acesso;
5. testar explicitamente acessos permitidos e negados.

### Fase 2 — piloto
Criar Área dos Organismos separada, inicialmente com dados de teste e 2–3 organismos voluntários.

### Fase 3 — integração
Criar ponte controlada Direção ↔ Organismos.

### Fase 4 — expansão
Somente após avaliação do piloto e teste de segurança.

## 11. Regra de publicação

Nenhum nome, telefone, dado financeiro real ou relatório político interno entra no ambiente enquanto autenticação, RLS, matriz de acesso, revogação e testes de negação não estiverem concluídos.
