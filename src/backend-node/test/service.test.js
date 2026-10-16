import { test } from "node:test";
import assert from "node:assert/strict";
import * as s from "../src/service.js";

const linha = (municipio, bairro, resultado, data, proprietario = "POSTO X") => ({
  MUNICIPIO: municipio,
  BAIRRO: bairro,
  PROPRIETARIO: proprietario,
  RESULTADO: resultado,
  DATA_VERIFICACAO: s.parseData(data),
});

const dados = [
  linha("SANTOS", "CENTRO", "Aprovado", "01/03/2018"),
  linha("SANTOS", "GONZAGA", "Reprovado", "02/03/2018"),
  linha("CAMPINAS", "CENTRO", "Aprovado", "03/03/2018", "POSTO Y"),
  linha("CAMPINAS", "CAMBUI", "Interditado", "04/03/2018"),
  linha("ATIBAIA", "CENTRO", "Sem Verif.", "05/03/2018"),
];

test("parseData aceita dd/mm/aaaa, dd/mm/aa e aaaa-mm-dd", () => {
  const esperado = Date.UTC(2018, 2, 1);
  assert.equal(s.parseData("01/03/2018").getTime(), esperado);
  assert.equal(s.parseData("01/03/18").getTime(), esperado);
  assert.equal(s.parseData("2018-03-01").getTime(), esperado);
  assert.equal(s.parseData("31/02/2018"), null);
  assert.equal(s.parseData("abc"), null);
  assert.equal(s.formatarData(s.parseData("2018-03-01")), "01/03/2018");
});

test("nPericiadas", () => {
  assert.equal(s.nPericiadas(dados), 5);
  assert.equal(s.nPericiadas(dados, "Aprovado"), 2);
});

test("contarAprRep agrupa por município em ordem alfabética", () => {
  assert.deepEqual(s.contarAprRep(dados, "Aprovado"), { CAMPINAS: 1, SANTOS: 1 });
  assert.deepEqual(Object.keys(s.contarAprRep(dados, "Aprovado")), ["CAMPINAS", "SANTOS"]);
});

test("filtros de texto ignoram espaços e maiúsculas", () => {
  assert.equal(s.filtrarPorMunicipio(dados, "  santos ").length, 2);
  assert.equal(s.filtrarPorBairro(dados, "centro").length, 3);
  assert.equal(s.filtrarPorProprietario(dados, "posto y").length, 1);
});

test("percentuais", () => {
  assert.deepEqual(s.percentualAprovadoReprovado(dados), {
    aprovado: 40,
    reprovado: 20,
    interditado: 20,
  });
  assert.deepEqual(s.percentualPorResultado(dados), {
    Aprovado: 40,
    Reprovado: 20,
    Interditado: 20,
    "Sem Verif.": 20,
  });
  assert.deepEqual(s.percentualAprovadoReprovado([]), { aprovado: 0, reprovado: 0, interditado: 0 });
});

test("filtrarPorData", () => {
  assert.equal(s.filtrarPorData(dados, "02/03/2018", null, "S").length, 1);
  assert.equal(s.filtrarPorData(dados, "2018-03-02", null, "i").length, 4);
  assert.equal(s.filtrarPorData(dados, null, "02/03/2018", "I").length, 2);
  assert.equal(s.filtrarPorData(dados, "02/03/2018", "04/03/2018", "I").length, 3);
  assert.equal(s.filtrarPorData(dados, "01/01/2020", null, "S").length, 0);

  assert.throws(() => s.filtrarPorData(dados, "01/03/2018", null, null), s.FiltroInvalidoError);
  assert.throws(() => s.filtrarPorData(dados, "01/03/2018", "02/03/2018", "S"), s.FiltroInvalidoError);
  assert.throws(() => s.filtrarPorData(dados, null, "01/03/2018", "S"), s.FiltroInvalidoError);
  assert.throws(() => s.filtrarPorData(dados, "01/03/2018", null, "X"), s.FiltroInvalidoError);
  assert.throws(() => s.filtrarPorData(dados, "99/99/2018", null, "I"), s.FiltroInvalidoError);
});

test("carregarDados lê o CSV de 2018", () => {
  const df = s.carregarDados();
  assert.ok(df.length > 5000);
  assert.equal(df[0].MUNICIPIO, "GUARATINGUETÁ");
  assert.equal(df[0].BAIRRO, "CENTRO");
  assert.equal(df[0].PROPRIETARIO, "POSTO DOM PEDRO GUARA URBANO");
  assert.equal(s.formatarData(df[0].DATA_VERIFICACAO), "01/03/2018");
});
