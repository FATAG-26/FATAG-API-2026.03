// Conversão para JavaScript das funções de src/backend/app/service.py (Pandas).
// O "DataFrame" aqui é um array de objetos, um por linha.
import { fileURLToPath } from "node:url";
import fs from 'node:fs/promises';

export const JSON_PATH =
  process.env.JSON_PATH ??
  fileURLToPath(new URL("../../data/verificacoes_bombas_tratado.json", import.meta.url));

export class FiltroInvalidoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "FiltroInvalidoError";
  }
}

const normalizar = (valor) => (valor ?? "").trim().toUpperCase();

/** Lê o CSV (latin1, separador ";") e devolve as linhas já tratadas. */
export async function carregarDados(caminho = JSON_PATH) {
    const conteudo = await fs.readFile(caminho, 'utf-8');
    return JSON.parse(conteudo);
}

/**
 * Número de bombas periciadas. Se `resultado` for informado, conta apenas
 * as linhas com aquele resultado (ex: "Aprovado").
 */
export function nPericiadas(dados, resultado) {
  if (resultado) return dados.filter((l) => l.RESULTADO === resultado).length;
  return dados.length;
}

/** Linhas com o resultado informado ("Aprovado", "Reprovado", "Interditado"...). */
export function aproRepr(dados, resultado) {
  return dados.filter((l) => l.RESULTADO === resultado);
}

/** Contagem de um resultado específico agrupada por município (ordenada pelo nome). */
export function contarAprRep(dados, resultado) {
  const contagem = {};
  for (const linha of aproRepr(dados, resultado)) {
    if (linha.MUNICIPIO == null) continue; // groupby ignora NaN
    contagem[linha.MUNICIPIO] = (contagem[linha.MUNICIPIO] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(contagem).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
}

export function filtrarPorMunicipio(dados, municipio) {
  const alvo = normalizar(municipio);
  return dados.filter((l) => l.MUNICIPIO != null && normalizar(l.MUNICIPIO) === alvo);
}

export function filtrarPorBairro(dados, bairro) {
  const alvo = normalizar(bairro);
  return dados.filter((l) => l.BAIRRO != null && normalizar(l.BAIRRO) === alvo);
}

export function filtrarPorProprietario(dados, proprietario) {
  const alvo = normalizar(proprietario);
  return dados.filter((l) => l.PROPRIETARIO != null && normalizar(l.PROPRIETARIO) === alvo);
}

/** Percentual de bombas aprovadas, reprovadas e interditadas. */
export function percentualAprovadoReprovado(dados) {
  const total = dados.length;
  const pct = (resultado) => (total ? (nPericiadas(dados, resultado) / total) * 100 : 0);
  return {
    aprovado: pct("Aprovado"),
    reprovado: pct("Reprovado"),
    interditado: pct("Interditado"),
  };
}

/**
 * Percentual de TODAS as categorias de resultado (inclui "Excluído" e
 * "Sem Verif."), arredondado em 2 casas e ordenado do maior para o menor,
 * como o value_counts() do Pandas.
 */
export function percentualPorResultado(dados) {
  const total = dados.length;
  const contagem = {};
  for (const { RESULTADO } of dados) {
    if (RESULTADO == null) continue; // value_counts ignora NaN
    contagem[RESULTADO] = (contagem[RESULTADO] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(contagem)
      .sort(([, a], [, b]) => b - a)
      .map(([chave, qtd]) => [chave, arredondar((qtd / total) * 100)]),
  );
}

export const arredondar = (valor, casas = 2) => {
  const fator = 10 ** casas;
  return Math.round((valor + Number.EPSILON) * fator) / fator;
};

/**
 * Filtra por data (dd/mm/aaaa ou aaaa-mm-dd).
 *
 * - dataInicio, modo 'S'            --> somente uma data (igualdade exata)
 * - dataInicio, modo 'I'            --> datas >= inicial
 * - dataFinal,  modo 'I'            --> datas <= final
 * - dataInicio + dataFinal, modo 'I' --> intervalo entre as datas
 * - dataInicio + dataFinal, modo 'S' --> inválido
 *
 * Retorna as linhas filtradas (pode ser vazio). Lança FiltroInvalidoError
 * quando os parâmetros são inválidos.
 */
export function filtrarPorData(dados, dataInicio, dataFinal, modo) {
  if (!(dataInicio || dataFinal)) throw new FiltroInvalidoError("Insira pelo menos uma data.");
  if (!modo) throw new FiltroInvalidoError("Coloque o modo ('S' = singular / 'I' = intervalo)");

  const inicio = dataInicio
  const final = dataFinal
  if ((dataInicio && !inicio) || (dataFinal && !final)) {
    throw new FiltroInvalidoError("Data inválida. Use dd/mm/aaaa ou aaaa-mm-dd.");
  }

  let comparar;
  switch (modo.toUpperCase()) {
    case "S":
      if (!inicio) throw new FiltroInvalidoError("No modo singular, informe uma data.");
      if (final) throw new FiltroInvalidoError("No modo singular, informe apenas uma data.");
      comparar = (t) => t === inicio.getTime();
      break;
    case "I":
      comparar = (t) =>
        (!inicio || t >= inicio.getTime()) && (!final || t <= final.getTime());
      break;
    default:
      throw new FiltroInvalidoError("Modo inválido. Use 'S' ou 'I'.");
  }

  return dados.filter((l) => l.DATA_VERIFICACAO && comparar(l.DATA_VERIFICACAO.getTime()));
}
