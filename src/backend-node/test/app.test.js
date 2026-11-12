// Testes das rotas da API (src/app.js), com uma base pequena em memória.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { criarApp } from "../src/app.js";
import { parseData } from "../src/service.js";

const linha = (municipio, bairro, resultado, data) => ({
  MUNICIPIO: municipio,
  BAIRRO: bairro,
  PROPRIETARIO: "POSTO X",
  DESCRICAO: null,
  NUMERO_INMETRO: "1",
  NUMERO_SERIE: "A1",
  RESULTADO: resultado,
  DATA_VERIFICACAO: parseData(data),
});

const dados = [
  linha("SANTOS", "CENTRO", "Aprovado", "01/03/2018"),
  linha("SANTOS", "GONZAGA", "Reprovado", "02/03/2018"),
  linha("CAMPINAS", "CENTRO", "Aprovado", "03/03/2018"),
  linha("CAMPINAS", "CAMBUI", "Interditado", "04/03/2019"),
  linha("ATIBAIA", "CENTRO", "Sem Verificação", "05/03/2019"),
];

let servidor;
let base;

before(async () => {
  servidor = criarApp(dados).listen(0);
  await new Promise((r) => servidor.once("listening", r));
  base = `http://127.0.0.1:${servidor.address().port}/api`;
});

after(() => servidor.close());

async function get(caminho) {
  const resposta = await fetch(base + caminho);
  return { status: resposta.status, corpo: await resposta.json() };
}

test("GET /api/health", async () => {
  assert.deepEqual(await get("/health"), { status: 200, corpo: { status: "ok", registros: 5 } });
});

test("GET /api/bombas: paginação e data em dd-mm-aaaa", async () => {
  const { status, corpo } = await get("/bombas?limit=2&offset=1");
  assert.equal(status, 200);
  assert.equal(corpo.total, 5);
  assert.equal(corpo.itens.length, 2);
  assert.equal(corpo.itens[0].DATA_VERIFICACAO, "02-03-2018");
});

test("GET /api/bombas: filtros combinados e vários municípios", async () => {
  assert.equal((await get("/bombas?municipio=SANTOS&municipio=ATIBAIA")).corpo.total, 3);
  assert.equal((await get("/bombas?municipio=santos&resultado=Reprovado")).corpo.total, 1);
  assert.equal((await get("/bombas?bairro=centro")).corpo.total, 3);
  assert.equal((await get("/bombas?data_inicio=2019-01-01&data_fim=2019-12-31&modo=I")).corpo.total, 2);
  assert.equal((await get("/bombas?data_inicio=01/03/2018&modo=S")).corpo.total, 1);
});

test("GET /api/bombas: parâmetros inválidos retornam 400", async () => {
  const semModo = await get("/bombas?data_inicio=2019-01-01");
  assert.equal(semModo.status, 400);
  assert.match(semModo.corpo.erro, /modo/);

  const dataInvalida = await get("/bombas?data_inicio=31/02/2019&modo=I");
  assert.equal(dataInvalida.status, 400);
  assert.match(dataInvalida.corpo.erro, /Data inválida/);

  assert.equal((await get("/bombas?limit=-1")).status, 400);
  assert.equal((await get("/bombas?offset=abc")).status, 400);
});

test("GET /api/resumo respeita os filtros", async () => {
  const { corpo } = await get("/resumo?municipio=CAMPINAS");
  assert.equal(corpo.total, 2);
  assert.deepEqual(corpo.porResultado, { Aprovado: 1, Interditado: 1 });
  assert.deepEqual(corpo.percentuais, { aprovado: 50, reprovado: 0, interditado: 50 });
});

test("GET /api/bombas/por-ano", async () => {
  const { corpo } = await get("/bombas/por-ano");
  assert.deepEqual(corpo, [
    { ano: 2018, total: 3, aprovados: 2, reprovados: 1, interditados: 0 },
    { ano: 2019, total: 2, aprovados: 0, reprovados: 0, interditados: 1 },
  ]);
  assert.equal((await get("/bombas/por-ano?municipio=SANTOS")).corpo.length, 1);
});

test("GET /api/ranking: percentual, absoluto e filtro de resultado ignorado", async () => {
  const pct = await get("/ranking?alvo=Aprovado&min_bombas=1&limite=0");
  assert.deepEqual(pct.corpo, {
    tipo: "percentual",
    alvo: "Aprovado",
    itens: [
      { municipio: "CAMPINAS", valor: 50 },
      { municipio: "SANTOS", valor: 50 },
      { municipio: "ATIBAIA", valor: 0 },
    ],
  });

  // ?resultado= vira o alvo, mas não reduz a base (senão todo município teria 100%)
  const porResultado = await get("/ranking?resultado=Reprovado&min_bombas=1&limite=1");
  assert.equal(porResultado.corpo.alvo, "Reprovado");
  assert.deepEqual(porResultado.corpo.itens, [{ municipio: "SANTOS", valor: 50 }]);

  const absoluto = await get("/ranking?tipo=absoluto&alvo=Aprovado");
  assert.deepEqual(absoluto.corpo.itens, [
    { municipio: "CAMPINAS", valor: 1 },
    { municipio: "SANTOS", valor: 1 },
  ]);

  assert.equal((await get("/ranking?tipo=x")).status, 400);
});

test("GET /api/municipios e /api/bairros", async () => {
  assert.deepEqual((await get("/municipios")).corpo, ["ATIBAIA", "CAMPINAS", "SANTOS"]);
  assert.deepEqual((await get("/municipios?q=s&limite=1")).corpo, ["SANTOS"]);
  assert.deepEqual((await get("/bairros?municipio=santos")).corpo, ["CENTRO", "GONZAGA"]);
  assert.deepEqual((await get("/bairros")).corpo, []);
});
