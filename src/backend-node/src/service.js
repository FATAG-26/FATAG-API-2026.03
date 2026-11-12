// Conversão para JavaScript das funções do notebook (notebook/testApi_py.ipynb, em Pandas).
// O "DataFrame" aqui é um array de objetos, um por linha.
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

// DATA_FILE (usado no docker-compose) aponta para o JSON tratado gerado pelo notebook.
// Também aceita os caminhos usados por configurações anteriores.
export const DATA_PATH = fileURLToPath(new URL("../../data/verificacoes_bombas_tratado.json", import.meta.url));


export class FiltroInvalidoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "FiltroInvalidoError";
  }
}

const normalizar = (valor) => (valor ?? "").trim().toUpperCase();

/**
 * Porte de `normalizar` do notebook: maiúsculas, sem acento e sem pontuação,
 * para comparar textos ("São José" == "SAO JOSE").
 */
export function normalizarBusca(texto) {
  if (texto === null || texto === undefined) return "";
  return String(texto)
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "") 
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Guarda o texto normalizado de cada linha/campo (fora da linha, para não
// aparecer no JSON da API): normalizar 46 mil linhas a cada requisição seria lento.
const cacheNormalizado = new WeakMap();
function normalizadoDe(linha, campo) {
  let porCampo = cacheNormalizado.get(linha);
  if (!porCampo) cacheNormalizado.set(linha, (porCampo = {}));
  return (porCampo[campo] ??= normalizarBusca(linha[campo]));
}

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

export const MAPA_DESCRICAO = {
  372: "Bomba medidora para combustíveis, vazão > 20 até 100 L/min.",
  373: "Bomba medidora para combustíveis, vazão > 100 até 500 L/min.",
};

/**
 * Porte de `carregar_tratado` + montagem do df da célula "ANÁLISE" do notebook:
 * lê o JSON tratado; DESCRICAO vem de CODITEM e DATA_VERIFICACAO é o dia de DT_HORA_VERIF.
 */
export function carregarJson(caminho = DATA_PATH) {
  const registros = JSON.parse(readFileSync(caminho, "utf-8"));
  return registros.map((r) => ({
    MUNICIPIO: r.MUNICIPIO ?? r.CIDADE ?? null,
    BAIRRO: r.BAIRRO ?? null,
    PROPRIETARIO: r.PROPRIETARIO ?? r.NOMEFANTASIA ?? null,
    DESCRICAO: MAPA_DESCRICAO[Number(r.CODITEM)] ?? r.DESCRICAO ?? null,
    NUMERO_INMETRO: r.NUMERO_INMETRO ?? r.NR_INMETRO ?? null,
    NUMERO_SERIE: r.NUMERO_SERIE ?? r.NR_SERIE ?? null,
    DATA_VERIFICACAO: parseData(r.DT_HORA_VERIF ?? r.DATA_VERIFICACAO),
    RESULTADO: r.RESULTADO ?? null,
  }));
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


/**
 * filtrarPorTexto do notebook: nome completo exato -> só ele;
 * senão -> tudo que contém o texto (sem acento/pontuação). Busca vazia -> [].
 */
export function filtrarPorTexto(dados, coluna, busca) {
  const alvo = normalizarBusca(busca);
  if (!alvo) return [];
  const exatos = dados.filter((l) => normalizadoDe(l, coluna) === alvo);
  if (exatos.length > 0) return exatos;
  return dados.filter((l) => normalizadoDe(l, coluna).includes(alvo));
}

export const filtrarPorMunicipio = (dados, municipio) => filtrarPorTexto(dados, "MUNICIPIO", municipio);
export const filtrarPorBairro = (dados, bairro) => filtrarPorTexto(dados, "BAIRRO", bairro);

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


export const arredondar = (valor, casas = 2) => {
  const fator = 10 ** casas;
  return Math.round((valor + Number.EPSILON) * fator) / fator;
};

/** Date (UTC) -> "dd-mm-aaaa". Retorna null se não houver data. */
export function formatarData(data) {
  if (!data) return null;
  const dd = String(data.getUTCDate()).padStart(2, "0");
  const mm = String(data.getUTCMonth() + 1).padStart(2, "0");
  const aaaa = data.getUTCFullYear();
  return `${dd}-${mm}-${aaaa}`;
}

/**
 * Filtra por data. `inicio` e `finalDia` são Date (a rota converte o texto com parseData).
 *
 * - inicio, modo 'S'           --> somente uma data (igualdade exata)
 * - inicio, modo 'I'           --> datas >= inicial
 * - finalDia, modo 'I'         --> datas <= final (o dia final inteiro)
 * - inicio + finalDia, modo 'I' --> intervalo entre as datas
 * - inicio + finalDia, modo 'S' --> inválido
 *
 * Retorna as linhas filtradas (pode ser vazio). Lança FiltroInvalidoError
 * quando os parâmetros são inválidos.
 */
export function filtrarPorData(dados, inicio, finalDia, modo) {
  if (!(inicio || finalDia)) throw new FiltroInvalidoError("Insira pelo menos uma data.");
  if (!modo) throw new FiltroInvalidoError("Coloque o modo ('S' = singular / 'I' = intervalo)");

  
  const final = finalDia ? new Date(finalDia.getTime() + 24 * 60 * 60 * 1000 - 1) : null;

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

// ---------------------------------------------------------------------------
// Portes das demais funções do notebook (ranking, listas de sugestão, ano)
// ---------------------------------------------------------------------------

// Ordena por valor (decrescente); empate resolvido pelo nome, para ser determinístico.
const ordenarRanking = (itens) =>
  itens.sort((a, b) => b.valor - a.valor || (a.municipio < b.municipio ? -1 : a.municipio > b.municipio ? 1 : 0));

const contarPorMunicipio = (dados) => {
  const mapa = new Map();
  for (const l of dados) if (l.MUNICIPIO != null) mapa.set(l.MUNICIPIO, (mapa.get(l.MUNICIPIO) ?? 0) + 1);
  return mapa;
};

/**
 * contarAprRep do notebook: quantidade por município, do maior para o menor.
 * `resultado` vazio = todos os resultados. `limite` (0/undefined = todos) equivale ao .head().
 */
 export function rankingContagem(dados, resultado, limite) {
  const base = resultado ? aproRepr(dados, resultado) : dados;
  const itens = ordenarRanking([...contarPorMunicipio(base)].map(([municipio, valor]) => ({ municipio, valor })));
  return limite ? itens.slice(0, limite) : itens;
} 

/**
 * percentualAprRep do notebook: % de `resultado` por município, ignorando os que
 * têm menos de `minBombas` bombas (cidades muito pequenas).
 */
export function percentualAprRep(dados, resultado, minBombas = 20, limite) {
  const total = contarPorMunicipio(dados);
  const qtd = contarPorMunicipio(aproRepr(dados, resultado));
  const itens = ordenarRanking(
    [...total]
      .filter(([, t]) => t >= minBombas)
      .map(([municipio, t]) => ({ municipio, valor: ((qtd.get(municipio) ?? 0) / t) * 100 })),
  );
  return limite ? itens.slice(0, limite) : itens;
}

/** contDataRes do notebook para todos os anos: total, aprovados, reprovados e interditados. */
export function contagemPorAno(dados) {
  const porAno = new Map();
  for (const l of dados) {
    if (!l.DATA_VERIFICACAO) continue;
    const ano = l.DATA_VERIFICACAO.getUTCFullYear();
    const c = porAno.get(ano) ?? { ano, total: 0, aprovados: 0, reprovados: 0, interditados: 0 };
    c.total++;
    if (l.RESULTADO === "Aprovado") c.aprovados++;
    else if (l.RESULTADO === "Reprovado") c.reprovados++;
    else if (l.RESULTADO === "Interditado") c.interditados++;
    porAno.set(ano, c);
  }
  return [...porAno.values()].sort((a, b) => a.ano - b.ano);
}

/** Dados dos cards e do gráfico de pizza: contagem de cada resultado + percentuais. */
export function resumo(dados) {
  const porResultado = {};
  for (const { RESULTADO } of dados) {
    if (RESULTADO == null) continue;
    porResultado[RESULTADO] = (porResultado[RESULTADO] ?? 0) + 1;
  }
  const pct = percentualAprovadoReprovado(dados);
  return {
    total: dados.length,
    porResultado,
    percentuais: {
      aprovado: arredondar(pct.aprovado),
      reprovado: arredondar(pct.reprovado),
      interditado: arredondar(pct.interditado),
    },
  };
}

// _sugestoes do notebook: valores únicos que contêm o texto; quem começa com ele vem primeiro.
function sugestoes(valores, texto = "", limite) {
  const unicos = [...new Set(valores.filter((v) => v != null))];
  const busca = normalizarBusca(texto);
  let itens = unicos.map((v) => ({ v, k: normalizarBusca(v) }));
  const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  if (busca) {
    itens = itens.filter((i) => i.k.includes(busca));
    itens.sort((a, b) => cmp(!a.k.startsWith(busca), !b.k.startsWith(busca)) || cmp(a.k, b.k));
  } else {
    itens.sort((a, b) => cmp(a.v, b.v));
  }
  const lista = itens.map((i) => i.v);
  return limite ? lista.slice(0, limite) : lista;
}

/** Municípios cadastrados. Texto vazio = todos. */
export const listarMunicipios = (dados, texto = "", limite) =>
  sugestoes(dados.map((l) => l.MUNICIPIO), texto, limite);

/** Bairros do município. Texto vazio = todos. Município vazio/inexistente = []. */
export function listarBairros(dados, municipio, texto = "", limite) {
  const alvo = normalizarBusca(municipio);
  if (!alvo) return [];
  return sugestoes(
    dados.filter((l) => normalizadoDe(l, "MUNICIPIO") === alvo).map((l) => l.BAIRRO),
    texto,
    limite,
  );
}
