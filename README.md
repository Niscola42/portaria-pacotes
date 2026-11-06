# Portaria Pacotes

Protótipo do fluxo de recebimento e retirada de encomendas para condomínios.

## Rodar

```bash
npm install
npm start
```

Abra no Expo Go em um aparelho para testar a leitura pela câmera. No navegador, use a opção de digitação manual.

## Escopo atual

- dados fictícios de condomínio, moradores e porteiro;
- leitura de QR Code e códigos de barras;
- seleção de morador e unidade;
- registro persistido no aparelho;
- lista de encomendas pendentes;
- retirada por PIN;
- histórico de movimentações.

O backend, OCR e WhatsApp automático ficam para a etapa seguinte do piloto.

## Testes automatizados

O primeiro cenário automatizado usa Cucumber para verificar a normalização do código de rastreio.

```bash
npm test
```

A pipeline do GitLab executa a verificação do TypeScript e, em seguida, o teste Cucumber. Se qualquer etapa falhar, a pipeline é interrompida e marcada em vermelho.
