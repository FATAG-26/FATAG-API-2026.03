// Conversão para Express de src/backend/app/main.py (Flask). Mesmas rotas e respostas.
import express from "express";
import * as service from "./service.js";

const { FiltroInvalidoError } = service;

/**
 * Aplica, em sequência, os filtros da query string (?municipio=, ?bairro=,
 * ?proprietario=, ?resultado=, ?data_inicio=, ?data_fim=, ?modo=).
 * Todos são opcionais e combináveis.
 */
function aplicarFiltrosQuery(base, query) {
  let resultado = base;
  const texto = (nome) => (typeof query[nome] === "string" ? query[nome] : undefined);

  const municipio = texto("municipio");
  if (municipio) resultado = service.filtrarPorMunicipio(resultado, municipio);

  const bairro = texto("bairro");
  if (bairro) resultado = service.filtrarPorBairro(resultado, bairro);

  const proprietario = texto("proprietario");
  if (proprietario) resultado = service.filtrarPorProprietario(resultado, proprietario);

  const filtroResultado = texto("resultado");
  if (filtroResultado) resultado = service.aproRepr(resultado, filtroResultado);

  const dataInicio = texto("data_inicio");
  const dataFim = texto("data_fim");
  if (dataInicio || dataFim) {
    resultado = service.filtrarPorData(resultado, dataInicio, dataFim, texto("modo"));
  }

  return resultado;
}

function inteiro(valor, padrao, nome) {
  if (valor === undefined) return padrao;
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 0) {
    throw new FiltroInvalidoError(`Parâmetro '${nome}' deve ser um inteiro não negativo.`);
  }
  return numero;
}

export function criarApp(df) {
  const app = express();

  app.get("/api/get", (req, res) => {
    res.json(df)
  })

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", registros: df.length });
  });

  app.get("/api/bombas", (req, res) => {
    console.log("Query recebida:", req.query);
    console.log("Registros originais:", df.length);
    const tabela = aplicarFiltrosQuery(df, req.query);
    console.log("Após filtros:", tabela.length);
    const limit = inteiro(req.query.limit, 100, "limit");
    const offset = inteiro(req.query.offset, 0, "offset");
    console.log({ limit, offset });
    const pagina = tabela.slice(offset, offset + limit);
    const itens = pagina;
    res.json({total: tabela.length,itens});
  });

  app.get("/api/bombas/contagem", (req, res) => {
    res.json({ quantidade: service.nPericiadas(df, req.query.resultado) });
  });

  app.get("/api/municipios/contagem", (req, res) => {
    const resultado = req.query.resultado ?? "Aprovado";
    res.json(service.contarAprRep(df, resultado));
  });

  app.get("/api/percentuais/aprovado-reprovado", (req, res) => {
    const pct = service.percentualAprovadoReprovado(df);
    res.json({
      aprovado: service.arredondar(pct.aprovado),
      reprovado: service.arredondar(pct.reprovado),
      interditado: service.arredondar(pct.interditado),
    });
  });

  app.get("/api/percentuais/por-resultado", (req, res) => {
    res.json(service.percentualPorResultado(df));
  });

  // Erros de parâmetro viram 400; o resto, 500.
  app.use((erro, req, res, next) => {
    if (erro instanceof FiltroInvalidoError) {
      return res.status(400).json({ erro: erro.message });
    }
    console.error(erro);
    res.status(500).json({ erro: "Erro interno do servidor." });
  });

  return app;
}
