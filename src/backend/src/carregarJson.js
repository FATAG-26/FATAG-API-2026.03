
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ARQ_JSON = process.env.DATA_FILE ??
  fileURLToPath(
    new URL(
      "../../data/verificacoes_bombas_tratado.json",
      import.meta.url
    )
  );

const COLUNAS_INT = [
  "RLD_ID",
  "IDFISCAL",
  "IDMOTORISTA",
  "COD_PROPR",
  "CODITEM"
];

export async function carregarJson(origem = ARQ_JSON) {
  // Lê o JSON tratado
  const resposta = String(origem).startsWith("http")
    ? await fetch(origem).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
    : JSON.parse(await readFile(origem, "utf8"));

  if (!Array.isArray(resposta)) {
    throw new Error("O JSON deve conter uma lista de registros.");
  }

  // Converte os tipos, mantendo as demais colunas
  const dados = resposta.map((registro) => {
    const item = { ...registro };

   const [ano, mes, dia] = String(item.DT_HORA_VERIF).slice(0, 10).split("-").map(Number);
    item.DATA_VERIFICACAO = new Date(Date.UTC(ano, mes - 1, dia));

    // Equivalente a pd.to_datetime()
    const data = new Date(item.DT_HORA_VERIF);

    if (Number.isNaN(data.getTime())) {
      throw new Error("DT_HORA_VERIF contém uma data inválida.");
    }

    item.DT_HORA_VERIF = data;

    // Equivalente a pd.to_numeric(...).astype("Int64")
    for (const coluna of COLUNAS_INT) {
      const valor = item[coluna];

      if (valor === null || valor === undefined ||
          String(valor).trim() === "") {
        item[coluna] = null;
        continue;
      }

      const numero = Number(valor);

      item[coluna] = Number.isSafeInteger(numero)
        ? numero
        : null;
    }

    return item;
  });

  return dados;
}
