import os
 
import pandas as pd
 
CSV_PATH = "../data/verificacoes_bombas_2018.csv"
 
 
def carregar_dados() -> pd.DataFrame:
    df = pd.read_csv(CSV_PATH, sep=";", encoding="latin1", dtype=str)
 
    def extrair_endereco(endereco):
        # O endereço é quebrado a partir da direita, pois o nome da rua
        # às vezes contém " - " (ex: "CARAGUÁ - UBATUBA, 6225").
        partes = endereco.strip().split(" - ")
        return pd.Series(
            {
                "MUNICIPIO": partes[-2].strip(),
                "BAIRRO": partes[-3].strip(),
            }
        )
 
    df = pd.concat([df, df["ENDERECO_COMPLETO"].apply(extrair_endereco)], axis=1)
    df["DATAVERIFICACAO"] = pd.to_datetime(df["DATAVERIFICACAO"], dayfirst=True)
 
    df = df.rename(
        columns={
            "NOMEFANTASIA": "PROPRIETARIO",
            "DESC_ITEM": "DESCRICAO",
            "NR_INMETRO": "NUMERO_INMETRO",
            "NR_SERIE": "NUMERO_SERIE",
            "DATAVERIFICACAO": "DATA_VERIFICACAO",
        }
    )
 
    colunas = [
        "MUNICIPIO",
        "BAIRRO",
        "PROPRIETARIO",
        "DESCRICAO",
        "NUMERO_INMETRO",
        "NUMERO_SERIE",
        "DATA_VERIFICACAO",
        "RESULTADO",
    ]
    return df[colunas]
 
 
def n_periciadas(l: pd.DataFrame, resultado: str | None = None) -> int:
    """Retorna o número de bombas periciadas.
 
    Se `resultado` for informado, conta apenas as linhas com aquele
    resultado (ex: "Aprovado"). Caso contrário, conta todas as linhas.
    """
    if resultado:
        return len(l[l["RESULTADO"] == resultado])
    return len(l)
 
 
def apro_repr(l: pd.DataFrame, a: str) -> pd.DataFrame:
    """Retorna apenas as linhas com o resultado informado
    (ex: "Aprovado", "Reprovado", "Interditado")."""
    nv = l[l["RESULTADO"] == a]
    return nv
 
 
def contar_apr_rep(l: pd.DataFrame, ar: str) -> pd.Series:
    """Retorna o quantitativo (contagem) de um resultado específico,
    agrupado por município."""
    nv = l[l["RESULTADO"] == ar]
    return nv.groupby("MUNICIPIO")["RESULTADO"].count()
 
 
def filtrar_por_municipio(l: pd.DataFrame, municipio: str) -> pd.DataFrame:
    """Retorna os dados filtrados por município."""
    nv = l[l["MUNICIPIO"].str.strip().str.upper() == municipio.strip().upper()]
    return nv
 
 
def percentual_aprovado_reprovado(l: pd.DataFrame) -> tuple[float, float, float]:
    """Retorna o percentual de bombas aprovadas, reprovadas e interditadas."""
    total = len(l)
    aprovadas = len(l[l["RESULTADO"] == "Aprovado"])
    reprovadas = len(l[l["RESULTADO"] == "Reprovado"])
    interditado = len(l[l["RESULTADO"] == "Interditado"])
    pct_aprovadas = aprovadas / total * 100
    pct_reprovadas = reprovadas / total * 100
    pct_interditado = interditado / total * 100
    return pct_aprovadas, pct_reprovadas, pct_interditado
 
 
def percentual_por_resultado(l: pd.DataFrame) -> pd.Series:
    """Retorna o percentual de TODAS as categorias de resultado.
 
    Necessária além da função acima porque os dados de SP também têm
    "Excluído" e "Sem Verif.", que ficam de fora da função anterior.
    """
    return (l["RESULTADO"].value_counts() / len(l) * 100).round(2)
 
 
def filtrar_por_bairro(l: pd.DataFrame, bairro: str) -> pd.DataFrame:
    """Retorna os dados filtrados por bairro."""
    nv = l[l["BAIRRO"].str.strip().str.upper() == bairro.strip().upper()]
    return nv
 
 
def filtrar_por_data(
    l: pd.DataFrame,
    data_inicio: str | None = None,
    data_final: str | None = None,
    modo: str | None = None,
):
    """Retorna os dados filtrados por data (dd/mm/aaaa).

    - data_inicio, modo='S' --> somente uma data (igualdade exata)
    - data_inicio, modo='I' --> datas maiores ou iguais à inicial
    - data_final, modo='I'  --> datas menores ou iguais à final
    - data_inicio, data_final, modo='I' --> intervalo entre as datas
    - data_inicio, data_final, modo='S' --> inválido (modo singular aceita
      apenas uma data)

    Retorna um DataFrame filtrado, ou uma string com uma mensagem de erro/
    aviso quando os parâmetros são inválidos ou não há resultados.
    """
    if not (data_inicio or data_final):
        return "Insira pelo menos uma data."
    if modo is None:
        return "Coloque o modo ('S' = singular / 'I' = intervalo)"

    modo = modo.upper()
    inicio = pd.to_datetime(data_inicio, dayfirst=True) if data_inicio else None
    final = pd.to_datetime(data_final, dayfirst=True) if data_final else None

    # modo singular
    if modo == "S":
        if not inicio:
            return "No modo singular, informe uma data."
        if final:
            return "No modo singular, informe apenas uma data."
        comparado = l["DATA_VERIFICACAO"] == inicio

    # modo intervalo
    elif modo == "I":
        comparado = (
            (l["DATA_VERIFICACAO"] >= inicio)
            if inicio
            else (l["DATA_VERIFICACAO"] <= final)
        )
        if inicio and final:
            comparado &= l["DATA_VERIFICACAO"] <= final

    else:
        return "Modo inválido. Use 'S' ou 'I'."

    resultado = l[comparado]
    return resultado if not resultado.empty else "Não há nenhum valor."
 
def filtrar_por_proprietario(l: pd.DataFrame, fornecedor: str) -> pd.DataFrame:
    """Retorna os dados filtrados por proprietário/nome fantasia."""
    nv = l[l["PROPRIETARIO"].str.strip().str.upper() == fornecedor.strip().upper()]
    return nv
 