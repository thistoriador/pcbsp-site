# CONTINUIDADE — SITE PCB-SP

Atualizado em: 2026-11-04
Protocolo: PCS (Continuidade e Segurança)

## Identificação verificada
- Repositório: thistoriador/pcbsp-site
- Branch padrão: main
- Site público informado: https://pcbsp.com.br/
- Arquivo index.html acessível no GitHub em 2026-11-04.

## Escopo
Portal público PCB-SP e módulos relacionados: formação política, notícias, comunicação, vamos conversar, recrutamento, circulismo, central e integrações. Os módulos com dados e autenticação devem ter checkpoints próprios.

## Histórico relatado (não verificado nesta auditoria)
- Padronização de cabeçalho e rodapé, ajustes de responsividade e banners.
- Formação política: curso nacional de seis módulos em vídeo e materiais do XVI Congresso.
- Notícias/comunicação: fila de aprovação, destaques e acervo; relatos de falhas em publicação e prévias.
- Central: gestão de usuários, manuais e problemas de autenticação da Organização.
- Recrutamento: responsáveis atribuídos e exibição das cidades nos botões (até três linhas).

## Estado confirmado neste checkpoint
- EXECUTADO: consulta ao repositório e leitura do index.html.
- VERIFICADO: repositório existe, branch padrão main, index.html acessível.
- PENDENTE: validar páginas em navegador, funcionalidades, login, deploy e integrações Supabase.
- PENDENTE: confirmar individualmente alterações históricas relatadas.
- FALHOU: nenhuma alteração operacional foi tentada neste checkpoint.

## Regras de segurança
1. Antes de alterar, consultar estado atual dos arquivos e dependências.
2. Não presumir que uma publicação no GitHub equivale a deploy em produção.
3. Evitar regressões, testar por módulo e registrar rollback quando possível.
4. Separar EXECUTADO, VERIFICADO, PENDENTE e FALHOU.
5. Não registrar senhas, tokens ou chaves.

## Próximas ações
1. Inventariar diretórios e módulos ativos.
2. Confirmar deploy e funcionamento das páginas críticas.
3. Investigar login da Organização/Central em contexto próprio.
4. Validar atribuições de recrutadores e lista de cidades.
5. Atualizar este documento a cada marco importante, com evidências e commits.
