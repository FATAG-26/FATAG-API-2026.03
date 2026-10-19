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
  const texto = (nome) => (typeof query[nome] === "string" ? query[nome].trim() || undefined : undefined);

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

  // Tudo abaixo aceita os mesmos filtros de /api/bombas (município, bairro,
  // proprietário, resultado, data_inicio, data_fim, modo). Sem filtros = dados gerais.

  app.get("/api/bombas/contagem", (req, res) => {
    const base = aplicarFiltrosQuery(df, req.query);
    res.json({ quantidade: service.nPericiadas(base, req.query.resultado) });
  });

  app.get("/api/municipios/contagem", (req, res) => {
    const base = aplicarFiltrosQuery(df, req.query);
    const resultado = req.query.resultado ?? "Aprovado";
    res.json(service.contarAprRep(base, resultado));
  });

  app.get("/api/percentuais/aprovado-reprovado", (req, res) => {
    const pct = service.percentualAprovadoReprovado(aplicarFiltrosQuery(df, req.query));
    res.json({
      aprovado: service.arredondar(pct.aprovado),
      reprovado: service.arredondar(pct.reprovado),
      interditado: service.arredondar(pct.interditado),
    });
  });

  app.get("/api/percentuais/por-resultado", (req, res) => {
    res.json(service.percentualPorResultado(aplicarFiltrosQuery(df, req.query)));
  });

  // Cards e gráfico de pizza numa chamada só: { total, porResultado, percentuais }.
  app.get("/api/resumo", (req, res) => {
    res.json(service.resumo(aplicarFiltrosQuery(df, req.query)));
  });

  // Contagem por ano (contDataRes do notebook).
  app.get("/api/bombas/por-ano", (req, res) => {
    res.json(service.contagemPorAno(aplicarFiltrosQuery(df, req.query)));
  });

  /**
   * Ranking por município (gerarGrafico do notebook).
   *   ?tipo=percentual|absoluto  (padrão: percentual)
   *   ?alvo=Aprovado             resultado que está sendo ranqueado
   *   ?limite=5                  0 = todos        ?min_bombas=20 (só no percentual)
   * O filtro ?resultado= é ignorado aqui: "% de aprovados" dentro de um
   * conjunto já filtrado por resultado não teria sentido.
   */
  app.get("/api/ranking", (req, res) => {
    const base = aplicarFiltrosQuery(df, { ...req.query, resultado: undefined });
    const tipo = req.query.tipo ?? "percentual";
    if (tipo !== "percentual" && tipo !== "absoluto") {
      throw new FiltroInvalidoError("Parâmetro 'tipo' deve ser 'percentual' ou 'absoluto'.");
    }
    const alvo = typeof req.query.alvo === "string" && req.query.alvo ? req.query.alvo : "Aprovado";
    const limite = inteiro(req.query.limite, 5, "limite");
    const itens =
      tipo === "percentual"
        ? service.percentualAprRep(base, alvo, inteiro(req.query.min_bombas, 20, "min_bombas"), limite)
        : service.rankingContagem(base, alvo, limite);
    res.json({ tipo, alvo, itens });
  });

  // Listas de sugestão para os campos de busca (listarMunicipios / listarBairros).
  app.get("/api/municipios", (req, res) => {
    const limite = inteiro(req.query.limite, 0, "limite");
    res.json(service.listarMunicipios(df, String(req.query.q ?? ""), limite));
  });

  app.get("/api/bairros", (req, res) => {
    const limite = inteiro(req.query.limite, 0, "limite");
    res.json(service.listarBairros(df, String(req.query.municipio ?? ""), String(req.query.q ?? ""), limite));
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
