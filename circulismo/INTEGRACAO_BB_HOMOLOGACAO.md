# Circulismo PCB-SP — integração BB em homologação

Estado: preparação técnica, **sem cobrança real**.
Aplicação Developers BB: **296880** (Circulismo PCB FR).
APIs selecionadas: **Pix v2** e **BB Pay v2**.
Conta PJ: vínculo/CNPJ ainda não confirmado. Liberação do dispositivo bancário pendente.

## Limites de segurança
- Não inserir client secret, tokens, certificados, chaves privadas ou senhas no GitHub, HTML ou JavaScript público.
- Não publicar QR Code de cobrança real, nem declarar pagamento confirmado sem consulta autenticada e conciliação.
- Não habilitar produção antes de confirmar com BB e assessoria contábil/jurídica partidária a elegibilidade da conta, meios de pagamento, identificação do doador e obrigações perante TSE.
- Separar o sandbox de produção e impedir que dados fictícios sejam contabilizados como arrecadação.

## Arquitetura prevista
1. Página /circulismo/ mantém o formulário e o aviso de versão piloto.
2. Backend autenticado (Supabase Edge Functions) valida nome, valor, consentimento e identificador da adesão.
3. Backend registra intenção de contribuição com idempotência, status `pending_test` e referência interna.
4. Adaptador BB em **sandbox** usa apenas credenciais guardadas em secrets do ambiente para simular/solicitar cobrança conforme contrato e documentação vigentes.
5. Endpoint webhook valida autenticidade, consulta o estado no BB quando necessário e atualiza o registro de forma idempotente.
6. Painel interno diferencia adesões, compromissos, pagamentos em teste, pagamentos conciliados e falhas; trilha de auditoria sem expor dados pessoais.
7. Pix recorrente / Pix Automático e cartão só em etapas separadas, após habilitação e revisão regulatória.

## Checklist antes de desenvolver conexão efetiva
- [ ] Confirmar que a aplicação 296880 é acessível no Portal Developers.
- [ ] Confirmar quais endpoints e credenciais de sandbox estão disponíveis para Pix v2 e BB Pay v2.
- [ ] Confirmar os requisitos de mTLS/certificado e escopos OAuth na documentação atual do BB.
- [ ] Verificar estado atual do projeto Supabase Circulismo e suas tabelas/funções, sem alterar o APP1 Recrutamento.
- [ ] Implementar e testar com dados fictícios, sem ativar recebimentos.
- [ ] Confirmar CNPJ e modalidade da conta PJ de arrecadação.
- [ ] Obter autorização bancária e validação jurídica/contábil antes de produção.

## Critérios de aceite
- Formulário atual e layout intactos.
- Sem segredos no navegador ou repositório.
- Eventos duplicados não geram pagamentos duplicados.
- Falha no banco não marca pagamento como concluído.
- Modo de teste claramente identificado.
