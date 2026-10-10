# Checkpoint — Portal PCB-SP integrado — 10/10/2026

**Estado:** versão candidata de homologação montada localmente; NÃO PUBLICADA em produção. Esta branch preserva o estado de `main` antes da implantação.

## Pacote local preparado
`pcbsp-portal-publicacao-candidata.zip` (aprox. 10 MB), criado na conversa em 10/10/2026. Os arquivos binários ainda NÃO estão neste repositório. O pacote contém:
- `index.html` homepage;
- `assets/` fotos e logos oficiais;
- `galeria/index.html` e `galeria/acervo.json`;
- `historia/index.html` e `historia/textos/andreto-pcb-sao-paulo-1922-1935.pdf` (original);
- `circulismo/index.html` página pública de apresentação, SEM pagamentos;
- `CHECKPOINT.md` histórico.

## Ajustes aprovados
- Menu: **PROGRAMA PARA SP** em amarelo.
- Card **FORMAÇÃO POLÍTICA** em construção.
- Botões: **Quero me organizar →** (amarelo), **Quero apoiar agora →** (vermelho), sem pequenos ícones.
- Logo original PCB-SP, fotografias originais e cards compactos; não introduzir símbolos novos.
- Nossa História: primeiro artigo de Lucas Alexandre Andreto, *O Partido Comunista do Brasil (PCB) em São Paulo: das origens até a Aliança Nacional Libertadora (1922–1935)*, *Expedições Morrinhos*, n. 14, p. 4–24 (2022).
- Galeria de Arte: primeira seleção de seis registros; dois cartazes com imagens remotas e quatro referências de acervo; checar licenças e URLs antes de publicar.
- Circulismo público separado da Cotização interna e do Recrutamento; pagamento ainda não ativado.

## Integrações a manter
- `/mapa/` e `/recrutamento/` existentes, não alterar seus códigos, dados nem autenticação.
- `/galeria/`, `/historia/`, `/circulismo/` novos.
- UJC, Unidade Classista e Ana Montenegro via Instagram.
- Conselho editorial colaborativo com aprovação por maioria absoluta: fase futura, sem implementação agora.

## Para publicação
É preciso transferir o HTML, as 12 imagens e o PDF binário do pacote ao repositório, validar os links e renderização mobile, só então atualizar `main`. **Não substituir `index.html` isoladamente**, pois causaria imagens e links quebrados.
