# CHECKPOINT — Comunicação PCB-SP e Notícias das Células

**Data:** 23/10/2026
**Repositório:** `thistoriador/pcbsp-site`
**Branch:** `main`
**Ambiente:** https://pcbsp.com.br/comunicacao-teste/

## Estado confirmado

- Painel existente em `comunicacao-teste/index.html`, com abas Visão geral, Campanhas, Organismos e páginas, Meu checklist e agora **Notícias e publicações**.
- A aba Notícias e publicações possui formulário para célula, categoria, URL pública de postagem/Reel do Instagram, título e resumo, validação básica da URL e prévia local. Inclui links para a demonstração de incorporação e o protótipo visual do Index.
- Protótipo de incorporação do Instagram: `noticias-teste/instagram.html` (https://pcbsp.com.br/noticias-teste/instagram.html). Exibe post público em iframe quando permitido pelo Instagram e permite editar uma chamada editorial de exemplo.
- Protótipo isolado do layout de notícias: `noticias-teste/index.html` (https://pcbsp.com.br/noticias-teste/).
- O **Index oficial não recebeu a seção de notícias**; o banner original `/portal-teste/assets/cidade-sp.jpg` foi restaurado. Não modificar o Index sem aprovação expressa.
- Nenhum backend de notícias, fila de aprovação, autenticação ou sincronização foi implementado. A prévia de notícia no painel não é persistida nem publicada. O painel preexistente continua sendo uma demonstração que utiliza dados locais do navegador.

## Commits de referência

- `53dfa225b6fad644ce6fb8885b212e2161d15c26` — integra a aba Notícias e publicações ao painel de Comunicação.
- `a9b3a7f82a5aa0925c1fa61835a75248fec81577` — demonstração Instagram → chamada editorial.
- `8b5b5c22edface811b08808dea6e689cd793e8a0` — protótipo de notícias com prévia do Index.
- `900a0aa6704853ae7a5297b1ce3a883ab6f9656e` — restaura imagem original do banner do Index.

## Próximos passos sugeridos (ainda não executados)

1. Conferir a nova aba em desktop e celular, após a publicação do GitHub Pages.
2. Definir identidade e permissões: célula envia/edita rascunhos; Comunicação Estadual revisa, aprova, devolve ou destaca; administrador gerencia acessos.
3. Projetar banco e armazenamento de imagens no Supabase com políticas RLS, sem expor chaves administrativas no frontend; integrar com cautela e preservar os sistemas existentes.
4. Definir fluxo de postagem Instagram: incorporação de publicações públicas quando permitida; importação de mídia/legendas somente mediante permissões e API apropriadas. Prever envio manual de texto/fotos.
5. Criar fila editorial e publicar somente notícias aprovadas, com página individual, autoria/célula, data e arquivo pesquisável.
6. Somente depois de testes e aprovação visual, inserir seção **PCB em Movimento** no Index oficial.

## Diretriz de continuidade

**Não reconstruir nem remover funcionalidades existentes.** Manter o ambiente de testes isolado, realizar alterações pequenas e verificáveis, preservar o Index oficial até autorização. Não confundir demonstração visual com funcionalidade em produção.

## Prompt para retomada

> Retome o projeto do Sistema de Comunicação PCB-SP a partir de `comunicacao-teste/CHECKPOINT_2026-10-23.md`. Confira os arquivos e commits listados. Quero continuar a integração de notícias das células e postagens do Instagram, preservando o painel existente e sem alterar o Index oficial até minha aprovação.
