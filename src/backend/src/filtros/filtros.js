// Equivalente às células "Filtros" do notebook (município, bairro e data).

export class FiltroInvalidoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "FiltroInvalidoError";
  }
}

// ---------------------------------------------------------------------------
// Texto
// ---------------------------------------------------------------------------

/** Maiúsculas, sem acento e sem pontuação, para comparar textos. */
export function normalizar(texto) {
  if (texto == null || Number.isNaN(texto)) return "";

  return String(texto)
    .normalize("NFKD")
    .replace(/\P{ASCII}/gu, "") // equivale a .encode("ascii", "ignore")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Guarda a normalização dos valores que vêm dos dados (poucos valores únicos),
// para não normalizar 46 mil linhas a cada requisição.
const cacheDados = new Map();

function chave(valor) {
  let n = cacheDados.get(valor);
  if (n === undefined) {
    n = normalizar(valor);
    cacheDados.set(valor, n);
  }
  return n;
}

/** Nome completo exato -> só ele. Senão -> tudo que contém o texto. */
export function filtrarPorTexto(dados, coluna, busca) {
  const buscaNormalizada = normalizar(busca);

  if (!buscaNormalizada) return [];

  const exatos = dados.filter((item) => chave(item[coluna]) === buscaNormalizada);

  if (exatos.length > 0) return exatos;

  return dados.filter((item) => chave(item[coluna]).includes(buscaNormalizada));
}

export function filtrarPorMunicipio(dados, municipio) {
  return filtrarPorTexto(dados, "MUNICIPIO", municipio);
}

export function filtrarPorBairro(dados, bairro) {
  return filtrarPorTexto(dados, "BAIRRO", bairro);
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

/**
 * Equivalente a pd.to_datetime(texto, dayfirst=True).
 * Aceita AAAA-MM-DD e DD/MM/AAAA (também DD/MM/AA). Devolve o timestamp (UTC, 00:00).
 */
function lerData(texto) {
  const t = String(texto).trim();
  let ano, mes, dia;

  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t);
  if (m) {
    [, ano, mes, dia] = m;
  } else if ((m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4}|\d{2})$/.exec(t))) {
    [, dia, mes, ano] = m;
    if (ano.length === 2) ano = `20${ano}`;
  } else {
    throw new FiltroInvalidoError(`Data inválida: "${texto}". Use AAAA-MM-DD ou DD/MM/AAAA.`);
  }

  ano = Number(ano);
  mes = Number(mes);
  dia = Number(dia);

  const data = new Date(Date.UTC(ano, mes - 1, dia));
  const existe =
    data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;

  if (!existe) throw new FiltroInvalidoError(`Data inválida: "${texto}".`);

  return data.getTime();
}

/**
 * data_inicio, modo='S' --> somente uma data
 * data_inicio, modo='I' --> datas maiores ou iguais a inicial
 * data_final,  modo='I' --> datas menores ou iguais à final
 * data_inicio, data_final, modo='I' --> intervalo entre as datas
 * data_inicio, data_final, modo='S' --> inválido
 *
 * Diferença para o notebook: onde o Python devolve uma mensagem (string),
 * aqui um parâmetro inválido lança FiltroInvalidoError (mesmo texto) e
 * "Não há nenhum valor." vira lista vazia.
 */
export function filtrarPorData(dados, dataInicio = null, dataFinal = null, modo = null) {
  if (!(dataInicio || dataFinal)) throw new FiltroInvalidoError("Insira pelo menos uma data.");
  if (modo == null) throw new FiltroInvalidoError("Coloque o modo ('S' = singular / 'I' = intervalo)");

  modo = String(modo).toUpperCase();

  const inicio = dataInicio ? lerData(dataInicio) : null;
  const final = dataFinal ? lerData(dataFinal) : null;

  let comparar;

  // modo singular
  if (modo === "S") {
    if (inicio === null) throw new FiltroInvalidoError("No modo singular, informe uma data.");
    if (final !== null) throw new FiltroInvalidoError("No modo singular, informe apenas uma data.");

    comparar = (t) => t === inicio;

    // modo intervalo
  } else if (modo === "I") {
    comparar = (t) => {
      let ok = inicio !== null ? t >= inicio : t <= final;
      if (inicio !== null && final !== null) ok = ok && t <= final;
      return ok;
    };
  } else {
    throw new FiltroInvalidoError("Modo inválido. Use 'S' ou 'I'.");
  }

  return dados.filter((item) => comparar(item.DATA_VERIFICACAO?.getTime()));
}

// ---------------------------------------------------------------------------
// Junta os filtros (todos opcionais). O bairro é buscado dentro do município
// já filtrado, e a data dentro dos dois.
// ---------------------------------------------------------------------------

export function aplicarFiltros(dados, { municipio, bairro, dataInicio, dataFinal, modo } = {}) {
  let resultado = dados;

  if (municipio?.trim()) resultado = filtrarPorMunicipio(resultado, municipio);
  if (bairro?.trim()) resultado = filtrarPorBairro(resultado, bairro);
  if (dataInicio || dataFinal) resultado = filtrarPorData(resultado, dataInicio, dataFinal, modo);

  return resultado;
}