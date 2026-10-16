// Conversão para JavaScript das funções de src/backend/app/service.py (Pandas).
// O "DataFrame" aqui é um array de objetos, um por linha.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

export const CSV_PATH =
  process.env.CSV_PATH ??
  fileURLToPath(new URL("../../data/verificacoes_bombas_2018.csv", import.meta.url));

export class FiltroInvalidoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "FiltroInvalidoError";
  }
}

const normalizar = (valor) => (valor ?? "").trim().toUpperCase();

/**
 * Converte "dd/mm/aaaa", "dd/mm/aa" ou "aaaa-mm-dd" em Date (meia-noite UTC).
 * Equivalente a pd.to_datetime(valor, dayfirst=True). Retorna null se inválida.
 */
export function parseData(valor) {
  if (!valor) return null;
  const texto = valor.trim().split(/[ T]/)[0];
  let dia, mes, ano;

  let m = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (m) {
    [, dia, mes, ano] = m.map(Number);
    if (m[3].length === 2) ano += 2000;
  } else if ((m = texto.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) {
    [, ano, mes, dia] = m.map(Number);
  } else {
    return null;
  }

  const data = new Date(Date.UTC(ano, mes - 1, dia));
  // Rejeita datas que "transbordam", ex.: 31/02/2018
  if (data.getUTCMonth() !== mes - 1 || data.getUTCDate() !== dia) return null;
  return data;
}

/** Formata uma Date como "dd/mm/aaaa" (equivalente a .dt.strftime("%d/%m/%Y")). */
export function formatarData(data) {
  if (!data) return null;
  const dd = String(data.getUTCDate()).padStart(2, "0");
  const mm = String(data.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${data.getUTCFullYear()}`;
}

/**
 * O endereço é quebrado a partir da direita, pois o nome da rua às vezes
 * contém " - " (ex: "CARAGUÁ - UBATUBA, 6225").
 */
function extrairEndereco(endereco) {
  const partes = (endereco ?? "").trim().split(" - ");
  return {
    MUNICIPIO: partes.length >= 2 ? partes.at(-2).trim() : null,
    BAIRRO: partes.length >= 3 ? partes.at(-3).trim() : null,
  };
}

/** Lê o CSV (latin1, separador ";") e devolve as linhas já tratadas. */
export function carregarDados(caminho = CSV_PATH) {
  const conteudo = readFileSync(caminho, "latin1");
  const linhas = parse(conteudo, {
    delimiter: ";",
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  });

  return linhas.map((linha) => {
    const { MUNICIPIO, BAIRRO } = extrairEndereco(linha.ENDERECO_COMPLETO);
    return {
      MUNICIPIO,
      BAIRRO,
      PROPRIETARIO: linha.NOMEFANTASIA ?? null,
      DESCRICAO: linha.DESC_ITEM ?? null,
      NUMERO_INMETRO: linha.NR_INMETRO ?? null,
      NUMERO_SERIE: linha.NR_SERIE ?? null,
      DATA_VERIFICACAO: parseData(linha.DATAVERIFICACAO),
      RESULTADO: linha.RESULTADO ?? null,
    };
  });
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

  const inicio = dataInicio ? parseData(dataInicio) : null;
  const final = dataFinal ? parseData(dataFinal) : null;
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
