import http from "node:http";
import { carregarJson } from "./carregarJson.js";
import { aplicarFiltros, FiltroInvalidoError } from "./filtros/filtros.js";

// Carrega os dados apenas uma vez
const dados = await carregarJson();

// Lê um número inteiro da query string (?limite=, ?offset=)
function inteiro(valor, nome, padrao, { min = 0, max = Infinity } = {}) {
  if (valor == null || valor === "") return padrao;

  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero < min) {
    throw new FiltroInvalidoError(`Parâmetro "${nome}" inválido: "${valor}".`);
  }

  return Math.min(numero, max);
}

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost:8000");

  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "GET" && url.pathname === "/api/bombas") {
    const params = url.searchParams;

    try {
      // ?municipio=&bairro=&data_inicio=&data_fim=&modo=  (todos opcionais)
      const resultado = aplicarFiltros(dados, {
        municipio: params.get("municipio"),
        bairro: params.get("bairro"),
        dataInicio: params.get("data_inicio"),
        dataFinal: params.get("data_fim"),
        modo: params.get("modo"),
      });

            // ?limite= (padrão 50, máximo 500) e ?offset= (padrão 0): devolve só uma página
      const limite = inteiro(params.get("limite"), "limite", 50, { min: 1, max: 500 });
      const offset = inteiro(params.get("offset"), "offset", 0);

      res.writeHead(200);
      res.end(
        JSON.stringify({
          total: resultado.length, // total que bate com os filtros (não só a página)
          limite,
          offset,
          registros: resultado.slice(offset, offset + limite),
        })
      );

      res.writeHead(400);
      res.end(JSON.stringify({ erro: erro.message }));
    }

    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ erro: "Rota não encontrada" }));
});

servidor.listen(8000, "0.0.0.0");