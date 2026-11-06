import assert from "node:assert/strict";
import { Given, Then, When } from "@cucumber/cucumber";
import { findPackageByTrackingCode } from "../../src/package-rules.ts";

let encomendas;
let encomendaEncontrada;

Given(
  "que existe uma encomenda com identificador {string} e código {string}",
  function (identificador, codigo) {
    encomendas = [{
      id: identificador,
      trackingCode: codigo,
      residentId: "morador-1",
      volumes: 1,
      receivedAt: "2026-11-06T12:00:00.000Z",
      receivedBy: "Marcos Almeida",
      pickupPin: "1234",
      notificationCount: 1,
      lastNotificationAt: "2026-11-06T12:00:00.000Z",
      status: "pending",
    }];
  },
);

When("o porteiro procura pelo código {string}", function (codigo) {
  encomendaEncontrada = findPackageByTrackingCode(encomendas, codigo);
});

Then(
  "a encomenda encontrada deve ter o identificador {string}",
  function (identificadorEsperado) {
    assert.equal(encomendaEncontrada?.id, identificadorEsperado);
  },
);
