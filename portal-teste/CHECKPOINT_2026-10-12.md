# Checkpoint — Portal PCB-SP — 12/10/2026

## Ambiente
- Repositório: thistoriador/pcbsp-site
- Branch: main
- Portal de testes: https://pcbsp.com.br/portal-teste/
- Mapa eleitoral existente: https://pcbsp.com.br/mapa/
- Checkpoint registrado após commit recente observado: fe8d429443612da394339a96f097c5dfc9f7df68. Conferir o histórico de commits antes de modificar arquivos.

## Estado e arquivos
- portal-teste/index.html: homepage com chamada eleitoral que leva ao Mapa Eleitoral; última alteração conhecida da chamada: e3cd635dbe75bd4e70400b2cb3de5eec032ba4d8.
- portal-teste/galeria/index.html: Galeria de Arte com coleções antifascista e histórica do PCB.
- portal-teste/galeria/antifascismo-sovietico/index.html: 20 cartazes hospedados na própria pasta e visualização ampliada; nomes corrigidos dos cartazes 11 e 16.
- portal-teste/galeria/cartazes-pcb/index.html: 4 cartazes históricos com arquivos locais e ampliação.
- Identidade: vermelho PCB #a52722, amarelo #e6ce2e, branco e grafite; cabeçalhos das três galerias padronizados.
- Há também formação, história e vamos-conversar no portal de testes. Preservar suas funcionalidades.

## Pedidos recentes / pendências
1. Banner/chamada eleitoral da homepage: usar o padrão visual dos cards de agradecimento do Mapa Eleitoral, mas sem recriar o mapa nem duplicar base eleitoral. A chamada deve levar a https://pcbsp.com.br/mapa/.
2. Carlos Machado (governador): arte fornecida pelo usuário apresenta 58.862 votos e 620 municípios (96,12%). Conferir na fonte antes de publicar qualquer correção.
3. Peter Maahs (senador): **verificar votação total e número/percentual real de municípios com votos na base do Mapa Eleitoral do PCB**. O usuário suspeita de 62 municípios sem votos, mas isso NÃO está confirmado. Não inventar totais ou percentuais.
4. Rodapé do banner de agradecimento: remover frases antigas e usar exatamente: **SOCIALISMO | PODER POPULAR | ANTIFASCISMO | VENHA SE ORGANIZAR NO PCB!**
5. O usuário pediu um layout/proposta visual inspirado em arte com ilustração do Carlos, números grandes, fundo vermelho, faixa amarela e barras/ranking; após conversa, preferiu apenas a chamada para o mapa existente.
6. Se houver banner de Peter separado (fora da homepage), localizar o arquivo correto antes de alterar. Não presumir que a chamada da homepage seja o banner a corrigir.
7. Verificar publicação no site antes de declarar que mudanças estão visíveis; commit GitHub sozinho não confirma deployment.

## Regras de continuidade
- Antes de alterar, buscar arquivos atuais no GitHub (branch main) e conferir SHA.
- Alterações pequenas e cirúrgicas; preservar o layout e as funções do portal e do mapa.
- Preferir os dados já existentes no Mapa Eleitoral para todos os números; evitar pesquisa paralela que gere divergências.
- Registrar commits e links de teste, sem declarar teste visual não realizado.
