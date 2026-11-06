import assert from "node:assert/strict";
import { Given, Then, When } from "@cucumber/cucumber";
import { normalizeTrackingCode } from "../../src/package-rules.ts";

let codigoInformado;
let resultado;

Given("que o código informado é {string}", function (codigo) {
  codigoInformado = codigo;
});

When("o sistema normaliza o código de rastreio", function () {
  resultado = normalizeTrackingCode(codigoInformado);
});

Then("o resultado deve ser {string}", function (codigoEsperado) {
  assert.equal(resultado, codigoEsperado);
});
