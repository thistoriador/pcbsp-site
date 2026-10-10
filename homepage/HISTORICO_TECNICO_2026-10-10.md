# HISTÓRICO TÉCNICO E EDITORIAL — HOMEPAGE PCB-SP
**Data:** 10/10/2026
**Checkpoint:** `checkpoint-homepage-2026-10-10`
**Repositório:** `thistoriador/pcbsp-site`
**Estado:** projeto visual aprovado; lançamento 1.0 ainda não autorizado nem executado.

## 1. Objetivo e decisões aprovadas
Nova homepage institucional de `pcbsp.com.br`, responsiva, baseada na proposta visual recuperada pelo usuário. Identidade vermelho/bordô, amarelo, preto e branco; cabeçalho com logomarca oficial PCB-SP; banner original com cidade de São Paulo; chamadas de destaque **ORGANIZE SUA REVOLTA** e **APOIE ESSA LUTA**; apresentação institucional e contato; seção **Nas ruas e nos territórios**; seção **Galeria de Arte — Cartazes Revolucionários**.

**Não exibir bloco “Aplicativos” na homepage**; aplicativos continuam acessíveis pela navegação. **Não exibir seção/aba Notícias na versão 1.0**. Futuramente acrescentar notícias e páginas dos coletivos sem reconstruir a homepage.

## 2. Seção Nas ruas e nos territórios
Quatro cartões, usando **exatamente os arquivos originais enviados pelo usuário**, nunca imagens recriadas por IA:
1. **Mapa Eleitoral** — arte original “Mapa dos Votos PCB-SP”; link pretendido `/mapa/` (validar antes do lançamento).
2. **UJC** — fotografia original da manifestação com bandeiras, enviada pelo usuário; link oficial a confirmar.
3. **Unidade Classista** — fotografia original da bandeira branca, enviada pelo usuário; link oficial a confirmar.
4. **Coletivo Ana Montenegro** — fotografia original compartilhada pelo usuário, publicação do perfil @anamontenegro.br de 1º de maio de 2025, com bandeira roxa; link oficial a confirmar. Confirmar permissão de reutilização da fotografia.

Usar corte responsivo apenas para enquadramento, sem reconstruir fotos, bandeiras, símbolos ou textos.

## 3. Identidade visual e galeria
- Cabeçalho: arquivo original `pcb-sp-transparente(4).png`; vetorização SVG deve ser fiel, conferida visualmente, sem redesenho arbitrário. Não considerar SVG validado até conferência.
- Banner de São Paulo: arquivo original enviado pelo usuário, remover a frase “Ferramentas e Aplicativos” sem modificar demais elementos. Verificar fidelidade e legibilidade em desktop/mobile.
- Galeria de Arte — Cartazes Revolucionários: usar **exatamente** a foto de exposição enviada pelo usuário (`291962.jpg` no contexto da conversa), não uma geração substituta. A exposição permanente será fase posterior, com curadoria e documentação.
- O mockup de imagem gerada por IA é apenas referência compositiva, não fonte das fotografias definitivas.

## 4. Lançamento 1.0 — escopo acordado
- Página institucional com os elementos aprovados; cartões dos coletivos funcionam inicialmente como **links externos oficiais**, sem CMS.
- Notícias ficam ocultas, sem botões vazios.
- Formulário de contato somente se destino, consentimento, proteção de dados e funcionamento estiverem definidos e testados; caso contrário, não coletar dados.
- Conferir todos os links, a navegação por toque, acessibilidade básica, tamanho das imagens, adaptação mobile, performance e fallback.
- Preservar integralmente as rotas existentes, especialmente `/mapa/`, `/recrutamento/` e `/redepoderpopular/`; não misturar dados públicos com recrutamento, organização, cotização ou circulismo.
- Fazer backup/rollback da homepage atual antes de substituir a raiz. **Não publicar sem autorização explícita após testes.**

## 5. Conselho Editorial — fase 2.0
Objetivo: colaboradores cadastrarem notícias e informações dos coletivos; Conselho Editorial PCB-SP decide publicação.
**Regra expressamente aprovada:** editor prepara/submete a matéria; cada conselheiro habilitado marca a caixa **APROVADO**; quando o número de aprovações alcançar **maioria absoluta dos membros habilitados** (mais da metade; 5 membros -> 3, 7 -> 4), a **versão submetida** é publicada automaticamente, sem segundo clique. Cada voto é individual, autenticado e auditado; alteração substancial da matéria após início da votação exige nova rodada. Definir regras para composição do conselho, afastamentos, retirada/correção pós-publicação e versionamento antes de implementar.
Arquitetura proposta, não implantada: painel editorial separado, com autenticação e regras de acesso próprias, base de conteúdos públicos isolada de dados internos; portal público lê apenas matérias aprovadas. Publicação imediata após aprovação, sem depender de commit GitHub.

## 6. Histórico dos protótipos e problemas observados
Foram apresentadas prévias locais chamadas `pcbsp-home-preview`, `pcbsp-home-imagens` e `pcbsp-home-corrigida.html`. Um print do celular mostrou imagens quebradas e cabeçalho comprimido. Foi relatada uma versão com imagens incorporadas ao HTML para evitar caminhos quebrados. **Não há homologação documentada em celular/desktop**; validar arquivos efetivos e suas imagens antes de qualquer implantação. Não confundir links sandbox de conversas anteriores com arquivos versionados no repositório.

## 7. Pendências antes da publicação
- Confirmar arquivos originais e licença/permissão de uso.
- Confirmar destinos de UJC, Unidade Classista, Ana Montenegro, História, Galeria, Organize e Apoie.
- Validar ou ocultar formulário até existir endpoint e política de privacidade adequados.
- Vetorizar/conferir logo SVG e banner.
- Testar homepage estática em branch ou ambiente isolado; checar layout real mobile e desktop.
- Obter autorização expressa para publicar na `main`, após backup e checklist.

## 8. Limites deste checkpoint
Este commit registra **somente decisões e histórico** na branch `checkpoint-homepage-2026-10-10`. Não altera a homepage em produção, não publica HTML, não implementa CMS e não altera bancos ou aplicativos.

## 9. Revisão de pré-lançamento (10/10/2026)
Arquivo local gerado: `pcbsp-home-v1-revisada.zip` (entregue na conversa; não versionado no GitHub). Revisões: logo PNG original enviado pelo usuário; destinos oficiais UJC `https://www.instagram.com/ujc.sp.oficial/`, Unidade Classista `https://www.instagram.com/uc_paulista/`, Ana Montenegro nacional `https://www.instagram.com/anamontenegro.br/`; redação sobre luta revolucionária, socialismo e Poder Popular; Notícias ausentes; formulário e apoio ainda inativos. **A versão revisada não foi publicada.** Próxima etapa: homologação em staging, conferir arquivos e links, autorização para substituir homepage em produção.

## 10. Resumos dos quatro cartões (10/10/2026)
Versão local `pcbsp-home-v1-resumos.zip` criada a partir de `pcbsp-home-v1-revisada.zip`; alterados apenas os textos dos quatro cartões. Mapa: “Explore os resultados eleitorais, compare eleições e conheça a presença do PCB nos municípios paulistas.” UJC: “Organiza a juventude na luta revolucionária, pela superação do capitalismo e pela construção do socialismo.” Unidade Classista: “Organiza a luta da classe trabalhadora, fortalecendo a organização sindical classista e o Poder Popular.” Ana Montenegro: “Organiza a luta feminista classista, articulando o combate ao patriarcado, ao racismo e à exploração capitalista.” Mantidas imagens e URLs. Arquivo gerado localmente; **ainda não publicado nem incorporado à branch GitHub**.

## 11. Frontend identidade dos coletivos (10/10/2026)
Artefatos locais: `pcbsp-home-v1-identidade-coletivos.zip` (pasta `pcbsp-home-v1-identidade-coletivos/` com HTML e assets) e `pcbsp-home-v1-identidade-coletivos-autonomo.html` (imagens locais incorporadas em base64). Logomarca da Unidade Classista fornecida pelo usuário adicionada em `assets/unidade-classista-logo-enviada.png` e apresentada no cartão. Para UJC e Ana Montenegro, referências aos símbolos originais da Wikipédia foram adicionadas como links, **não como SVGs baixados**, pois os arquivos ainda não foram obtidos/verificados. Fotografias originais e resumos mantidos. Botões de recrutamento e chamada principal apontam a `https://pcbsp.com.br/recrutamento/`; apoio/circulismo permanece não conectado. Fundos ilustrativos provisórios nos painéis de ação ainda exigem conferência das imagens específicas aprovadas pelo usuário. **Nada foi publicado em produção; a branch guarda somente o histórico, não o pacote HTML.**
