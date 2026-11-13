import assert from "node:assert/strict";
import { Given, Then, When } from "@cucumber/cucumber";
import {
  collectPackageRecord,
  createPackageRecord,
  generatePickupPin,
  resendPackageNotification,
} from "../../src/package-rules.ts";

let dadosCadastro;
let encomendaCadastrada;
let encomendas;
let pinGerado;
let resultadoReenvio;
let resultadoRetirada;

function criarEncomenda({
  status = "pending",
  notificationCount = 1,
  pickupPin = "1234",
} = {}) {
  return {
    id: "pacote-1",
    trackingCode: "BR987654321BR",
    residentId: "morador-1",
    volumes: 1,
    receivedAt: "2026-11-13T10:00:00.000Z",
    receivedBy: "Marcos Almeida",
    pickupPin,
    notificationCount,
    lastNotificationAt: "2026-11-13T10:00:00.000Z",
    status,
  };
}

When("o sistema gerar um PIN de retirada", function () {
  pinGerado = generatePickupPin(() => 0.5);
});

Then("o PIN deve possuir {int} dígitos", function (quantidadeEsperada) {
  assert.match(pinGerado, /^\d+$/);
  assert.equal(pinGerado.length, quantidadeEsperada);
});

Given("os dados de uma encomenda com código {string}", function (codigo) {
  dadosCadastro = {
    trackingCode: codigo,
    residentId: "morador-1",
    volumes: 1,
  };
});

When("o sistema cadastrar a encomenda", function () {
  encomendaCadastrada = createPackageRecord(dadosCadastro, {
    id: "pacote-1",
    now: new Date("2026-11-13T10:00:00.000Z"),
    random: () => 0.5,
  });
});

Then("o código cadastrado deve ser {string}", function (codigoEsperado) {
  assert.equal(encomendaCadastrada.trackingCode, codigoEsperado);
});

Then("a situação cadastrada deve ser {string}", function (situacaoEsperada) {
  assert.equal(encomendaCadastrada.status, situacaoEsperada);
});

Given(
  "que existe uma encomenda {string} com {int} notificação",
  function (situacao, quantidade) {
    encomendas = [criarEncomenda({ status: situacao, notificationCount: quantidade })];
  },
);

When("o porteiro solicitar o reenvio da notificação", function () {
  resultadoReenvio = resendPackageNotification(
    encomendas,
    "pacote-1",
    new Date("2026-11-13T12:00:00.000Z"),
  );
});

Then("o reenvio deve ser autorizado", function () {
  assert.equal(resultadoReenvio.success, true);
});

Then("o reenvio deve ser recusado", function () {
  assert.equal(resultadoReenvio.success, false);
});

Then("a encomenda deve possuir {int} notificações", function (quantidadeEsperada) {
  assert.equal(resultadoReenvio.packages[0].notificationCount, quantidadeEsperada);
});

Then("a encomenda deve possuir {int} notificação", function (quantidadeEsperada) {
  assert.equal(resultadoReenvio.packages[0].notificationCount, quantidadeEsperada);
});

Given("que existe uma encomenda pendente com PIN {string}", function (pin) {
  encomendas = [criarEncomenda({ pickupPin: pin })];
});

When("o porteiro informar o PIN {string}", function (pin) {
  resultadoRetirada = collectPackageRecord(
    encomendas,
    "pacote-1",
    pin,
    new Date("2026-11-13T12:00:00.000Z"),
  );
});

Then("o resultado da retirada deve ser {string}", function (resultadoEsperado) {
  assert.equal(resultadoRetirada.result, resultadoEsperado);
});

Then("a situação da encomenda deve ser {string}", function (situacaoEsperada) {
  assert.equal(resultadoRetirada.packages[0].status, situacaoEsperada);
});
