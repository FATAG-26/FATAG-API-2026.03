from flask import Flask, request, jsonify
import pandas as pd
 
from . import service
 
app = Flask(__name__)
df = service.carregar_dados()
 
def _df_para_json(tabela: pd.DataFrame):
    """Converte um DataFrame em algo serializável em JSON, formatando a
    data e trocando NaN por None."""
    tabela = tabela.copy()
    if "DATA_VERIFICACAO" in tabela.columns:
        tabela["DATA_VERIFICACAO"] = tabela["DATA_VERIFICACAO"].dt.strftime("%d/%m/%Y")
    return tabela.where(tabela.notna(), None).to_dict("records")
 
 
 
def _aplicar_filtros_query(base: pd.DataFrame) -> pd.DataFrame:
    """Aplica, em sequência, os filtros vindos da query string (?municipio=,
    ?bairro=, ?proprietario=, ?resultado=, ?data_inicio=, ?data_fim=).
 
    Todos são opcionais e combináveis entre si.
    """
    resultado = base
 
    municipio = request.args.get("municipio")
    if municipio:
        resultado = service.filtrar_por_municipio(resultado, municipio)
 
    bairro = request.args.get("bairro")
    if bairro:
        resultado = service.filtrar_por_bairro(resultado, bairro)
 
    proprietario = request.args.get("proprietario")
    if proprietario:
        resultado = service.filtrar_por_proprietario(resultado, proprietario)
 
    resultado_filtro = request.args.get("resultado")
    if resultado_filtro:
        resultado = service.apro_repr(resultado, resultado_filtro)
 
    data_inicio = request.args.get("data_inicio")
    data_fim = request.args.get("data_fim")
    if data_inicio and data_fim:
        filtrado_por_data = service.filtrar_por_data(resultado, data_inicio, data_fim)
        # filtrar_por_data pode devolver uma string quando não há resultado
        resultado = (
            filtrado_por_data
            if isinstance(filtrado_por_data, pd.DataFrame)
            else resultado.iloc[0:0]  # tabela vazia com as mesmas colunas
        )
 
    return resultado
 

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "registros": len(df)})
 
 
@app.get("/api/bombas")
def listar_bombas():
    """Aceita ?municipio=, ?bairro=, ?proprietario=, ?resultado=,
    ?data_inicio= e ?data_fim= (dd/mm/aaaa), todos opcionais e combináveis.
    """
    tabela = _aplicar_filtros_query(df)
 
    limit = int(request.args.get("limit", 100))
    offset = int(request.args.get("offset", 0))
    pagina = tabela.iloc[offset : offset + limit]
 
    return jsonify({"total": len(tabela), "itens": _df_para_json(pagina)})
 
 
@app.get("/api/bombas/contagem")
def contagem_bombas():
    """Equivalente a nPericiadas(df, resultado). ?resultado= é opcional."""
    resultado = request.args.get("resultado")
    return jsonify({"quantidade": service.n_periciadas(df, resultado)})
 
 
@app.get("/api/municipios/contagem")
def contagem_por_municipio():
    """Equivalente a contarAprRep(df, resultado). ?resultado= é obrigatório
    (ex: Aprovado, Reprovado, Interditado)."""
    resultado = request.args.get("resultado", "Aprovado")
    contagem = service.contar_apr_rep(df, resultado)
    return jsonify(contagem.to_dict())
 
 
@app.get("/api/percentuais/aprovado-reprovado")
def percentual_aprovado_reprovado():
    """Equivalente a percentualAprovadoReprovado(df)."""
    pct_aprovadas, pct_reprovadas, pct_interditado = (
        service.percentual_aprovado_reprovado(df)
    )
    return jsonify(
        {
            "aprovado": round(pct_aprovadas, 2),
            "reprovado": round(pct_reprovadas, 2),
            "interditado": round(pct_interditado, 2),
        }
    )
 
 
@app.get("/api/percentuais/por-resultado")
def percentual_por_resultado():
    """Equivalente a percentualPorResultado(df) — inclui também
    'Excluído' e 'Sem Verif.'."""
    return jsonify(service.percentual_por_resultado(df).to_dict())
 