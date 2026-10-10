# PCB-SP — Checkpoint da homepage v2 — 10/10/2026

## Estado de publicação
- Branch de segurança: `checkpoint-home-v2-2026-10-10`, criada a partir de `main`.
- A homepage nova **não está publicada**. A raiz `index.html` de `main` permanece na versão anterior (página de aplicativos).
- Arquivos da homepage revisada preparados nesta conversa: `pcbsp-home-v2-1-revisada-autonoma.html` (prévia com imagens incorporadas) e `pcbsp-home-v2-1-pronta-para-publicacao.zip` (HTML e assets).
- O pacote ainda precisa ser importado, conferido e homologado antes de substituir `index.html`. Não presumir que arquivos de conversa estão no GitHub.

## Identidade e layout aprovados
- Logo oficial PCB-SP (mapa amarelo de SP, foice e martelo); não usar estrela inventada.
- Banner original da cidade de São Paulo, com chamada 'Conheça o PCB. Vamos conversar?' e textos editáveis em HTML, não incorporados na imagem.
- Dois painéis de fotografia: ORGANIZE SUA REVOLTA (botão amarelo 'Quero me organizar →') e APOIE ESSA LUTA (botão vermelho 'Quero apoiar agora →'). **Sem ícones pequenos dentro dos botões**.
- Os textos dos banners e botões devem continuar editáveis, separados das imagens.
- Menu: Início; O PCB; NOSSO PROGRAMA PARA SP; Nossa atuação; Galeria de Arte; Contato; destaques ORGANIZE SUA REVOLTA e APOIE ESSA LUTA. Responsivo no celular.
- Quatro cartões com faixa preta compacta: Mapa Eleitoral, UJC, Unidade Classista e Coletivo Ana Montenegro. Usar imagens originais fornecidas pelo usuário e logomarcas oficiais, sem recriações.
- Seções Nossa História, Galeria de Arte e Contato; sem aba Notícias nesta primeira fase.
- Mensagem política: luta revolucionária, construção do socialismo e Poder Popular; não substituir por formulação genérica de direitos e democracia.

## Links conhecidos
- Mapa eleitoral: https://pcbsp.com.br/mapa/
- Recrutamento: https://pcbsp.com.br/recrutamento/
- UJC SP: https://www.instagram.com/ujc.sp.oficial/
- Unidade Classista Paulista: https://www.instagram.com/uc_paulista/
- Coletivo Ana Montenegro (página nacional): https://www.instagram.com/anamontenegro.br/
- Apoio financeiro/Circulismo público: **em preparação**; não criar cobrança ou link de pagamento fictício.
- Programa para SP, contato e notícias: ainda sem sistema final; não coletar dados no protótipo.

## Sistemas existentes — não alterar
- Repositório: `thistoriador/pcbsp-site`, branch principal `main`.
- Recrutamento e Circulismo interno: `/recrutamento/`, com dados sensíveis e autenticação próprios.
- Mapa eleitoral: `/mapa/`.
- Não tocar em Supabase, recrutamentos, cotização, permissões ou dados de militantes.
- Não substituir homepage sem conferência de todos os assets, links, menu móvel e autorização explícita para publicação.

## Melhorias futuras
- Painel Editorial separado com colaboradores e conselho editorial. Editor submete; cada conselheiro autenticado marca APROVADO; publicação automática ao atingir maioria absoluta. Não integrar isso na primeira publicação.

## Próximos passos
1. Verificar se os assets e o HTML revisado estão presentes no ambiente de trabalho; importar o pacote para uma branch de homologação.
2. Testar desktop e celular, imagens, logo oficial, textos editáveis e links.
3. Com autorização, publicar na raiz e testar https://pcbsp.com.br/.
4. Preservar checkpoint e registrar commit de publicação.
