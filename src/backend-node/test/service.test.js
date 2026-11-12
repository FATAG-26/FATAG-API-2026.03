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
  linha("ATIBAIA", "CENTRO", "Sem Verificação", "05/03/2018"),
];

const d = s.parseData;

test("parseData aceita dd/mm/aaaa, dd/mm/aa e aaaa-mm-dd", () => {
  const esperado = Date.UTC(2018, 2, 1);
  assert.equal(s.parseData("01/03/2018").getTime(), esperado);
  assert.equal(s.parseData("01/03/18").getTime(), esperado);
  assert.equal(s.parseData("2018-03-01").getTime(), esperado);
  assert.equal(s.parseData("2018-03-01T10:30:00").getTime(), esperado);
  assert.equal(s.parseData("31/02/2018"), null);
  assert.equal(s.parseData("abc"), null);
  assert.equal(s.parseData(""), null);
});

test("formatarData devolve dd-mm-aaaa", () => {
  assert.equal(s.formatarData(s.parseData("2018-03-01")), "01-03-2018");
  assert.equal(s.formatarData(null), null);
});

test("nPericiadas", () => {
  assert.equal(s.nPericiadas(dados), 5);
  assert.equal(s.nPericiadas(dados, "Aprovado"), 2);
});

test("aproRepr seleciona as linhas do resultado", () => {
  assert.equal(s.aproRepr(dados, "Aprovado").length, 2);
  assert.equal(s.aproRepr(dados, "Excluído").length, 0);
});

test("filtros de texto ignoram espaços, maiúsculas e acentos", () => {
  assert.equal(s.filtrarPorMunicipio(dados, "  santos ").length, 2);
  assert.equal(s.filtrarPorBairro(dados, "centro").length, 3);
  assert.equal(s.filtrarPorProprietario(dados, "posto y").length, 1);

  const comAcento = [linha("SÃO JOSÉ DOS CAMPOS", "CENTRO", "Aprovado", "01/03/2018")];
  assert.equal(s.filtrarPorMunicipio(comAcento, "sao jose dos campos").length, 1);
});

test("filtrarPorTexto: nome exato tem prioridade; senão busca por trecho; vazio = nada", () => {
  const base = [
    linha("SÃO JOSÉ DOS CAMPOS", "A", "Aprovado", "01/03/2018"),
    linha("SÃO JOSÉ DO BARREIRO", "B", "Aprovado", "01/03/2018"),
  ];
  assert.equal(s.filtrarPorMunicipio(base, "sao jose").length, 2);
  assert.equal(s.filtrarPorMunicipio(base, "São José do Barreiro").length, 1);
  assert.equal(s.filtrarPorMunicipio(dados, "camp").length, 2);
  assert.equal(s.filtrarPorMunicipio(dados, "").length, 0);
});

test("filtrarPorData recebe Date (a rota converte o texto com parseData)", () => {
  assert.equal(s.filtrarPorData(dados, d("02/03/2018"), null, "S").length, 1);
  assert.equal(s.filtrarPorData(dados, d("2018-03-02"), null, "i").length, 4);
  // a data final inclui o dia inteiro
  assert.equal(s.filtrarPorData(dados, null, d("02/03/2018"), "I").length, 2);
  assert.equal(s.filtrarPorData(dados, d("02/03/2018"), d("04/03/2018"), "I").length, 3);
  assert.equal(s.filtrarPorData(dados, d("01/01/2020"), null, "S").length, 0);

  assert.throws(() => s.filtrarPorData(dados, null, null, "I"), s.FiltroInvalidoError);
  assert.throws(() => s.filtrarPorData(dados, d("01/03/2018"), null, null), s.FiltroInvalidoError);
  assert.throws(() => s.filtrarPorData(dados, d("01/03/2018"), d("02/03/2018"), "S"), s.FiltroInvalidoError);
  assert.throws(() => s.filtrarPorData(dados, null, d("01/03/2018"), "S"), s.FiltroInvalidoError);
  assert.throws(() => s.filtrarPorData(dados, d("01/03/2018"), null, "X"), s.FiltroInvalidoError);
});

test("percentualAprovadoReprovado", () => {
  assert.deepEqual(s.percentualAprovadoReprovado(dados), { aprovado: 40, reprovado: 20, interditado: 20 });
  assert.deepEqual(s.percentualAprovadoReprovado([]), { aprovado: 0, reprovado: 0, interditado: 0 });
});

test("arredondar usa duas casas por padrão", () => {
  assert.equal(s.arredondar(89.585), 89.59);
  assert.equal(s.arredondar(1 / 3, 1), 0.3);
});

test("resumo: total, contagem por resultado e percentuais", () => {
  assert.deepEqual(s.resumo(dados), {
    total: 5,
    porResultado: { Aprovado: 2, Reprovado: 1, Interditado: 1, "Sem Verificação": 1 },
    percentuais: { aprovado: 40, reprovado: 20, interditado: 20 },
  });
  assert.deepEqual(s.resumo([]), {
    total: 0,
    porResultado: {},
    percentuais: { aprovado: 0, reprovado: 0, interditado: 0 },
  });
});

test("rankingContagem: do maior para o menor, empate em ordem alfabética", () => {
  assert.deepEqual(s.rankingContagem(dados, "Aprovado"), [
    { municipio: "CAMPINAS", valor: 1 },
    { municipio: "SANTOS", valor: 1 },
  ]);
  assert.deepEqual(s.rankingContagem(dados, ""), [
    { municipio: "CAMPINAS", valor: 2 },
    { municipio: "SANTOS", valor: 2 },
    { municipio: "ATIBAIA", valor: 1 },
  ]);
  assert.equal(s.rankingContagem(dados, "", 1).length, 1);
});

test("percentualAprRep: % por município, com mínimo de bombas e limite", () => {
  assert.deepEqual(s.percentualAprRep(dados, "Aprovado", 1), [
    { municipio: "CAMPINAS", valor: 50 },
    { municipio: "SANTOS", valor: 50 },
    { municipio: "ATIBAIA", valor: 0 },
  ]);
  // ATIBAIA tem só 1 bomba e fica de fora com mínimo 2
  assert.deepEqual(
    s.percentualAprRep(dados, "Aprovado", 2).map((i) => i.municipio),
    ["CAMPINAS", "SANTOS"],
  );
  assert.equal(s.percentualAprRep(dados, "Aprovado", 1, 1).length, 1);
  // padrão: mínimo de 20 bombas
  assert.deepEqual(s.percentualAprRep(dados, "Aprovado"), []);
});

test("contagemPorAno: totais por ano em ordem crescente", () => {
  const base = [
    ...dados,
    linha("SANTOS", "CENTRO", "Reprovado", "10/01/2019"),
    { ...linha("SANTOS", "CENTRO", "Aprovado", "10/01/2019"), DATA_VERIFICACAO: null },
  ];
  assert.deepEqual(s.contagemPorAno(base), [
    { ano: 2018, total: 5, aprovados: 2, reprovados: 1, interditados: 1 },
    { ano: 2019, total: 1, aprovados: 0, reprovados: 1, interditados: 0 },
  ]);
});

test("listarMunicipios e listarBairros", () => {
  assert.deepEqual(s.listarMunicipios(dados), ["ATIBAIA", "CAMPINAS", "SANTOS"]);
  // quem começa com o texto vem primeiro
  assert.deepEqual(s.listarMunicipios(dados, "s"), ["SANTOS", "CAMPINAS"]);
  assert.deepEqual(s.listarMunicipios(dados, "", 2), ["ATIBAIA", "CAMPINAS"]);
  assert.deepEqual(s.listarBairros(dados, "santos"), ["CENTRO", "GONZAGA"]);
  assert.deepEqual(s.listarBairros(dados, "santos", "gon"), ["GONZAGA"]);
  assert.deepEqual(s.listarBairros(dados, ""), []);
});

test("carregarJson lê a base tratada de 2018 a 2026", () => {
  const df = s.carregarJson();
  assert.ok(df.length > 40000);
  assert.equal(df[0].MUNICIPIO, "GUARATINGUETÁ");
  assert.equal(df[0].BAIRRO, "CENTRO");
  assert.equal(df[0].PROPRIETARIO, "POSTO DOM PEDRO GUARA URBANO");
  assert.equal(df[0].DESCRICAO, s.MAPA_DESCRICAO[372]);
  assert.equal(s.formatarData(df[0].DATA_VERIFICACAO), "01-03-2018");

  const anos = new Set(df.map((l) => l.DATA_VERIFICACAO?.getUTCFullYear()));
  assert.ok(anos.has(2018) && anos.has(2025));
  assert.ok(df.every((l) => l.DATA_VERIFICACAO instanceof Date));
});
