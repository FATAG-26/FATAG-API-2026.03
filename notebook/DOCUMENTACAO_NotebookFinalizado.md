# Documentação do notebook de atualização da base IPEM

O notebook [`NotebookFinalizado.ipynb`](NotebookFinalizado.ipynb) permite tratar um arquivo CSV de verificações de bombas e atualizar a base JSON usada pelo sistema. Ele reaproveita as regras de padronização de dados do projeto.

## Requisitos

- Python 3 com `pandas` instalado.
- Google Colab ou Jupyter Notebook.
- Arquivos CSV no padrão de colunas utilizado pelo IPEM para a função de tratamento.
- Para atualização da base, o JSON atual e o JSON novo devem estar no formato de lista de registros utilizado pelo sistema e conter `RLD_ID` e `NUMERO_INMETRO`.

## Como executar

1. Abra `NotebookFinalizado.ipynb` no Google Colab ou no Jupyter.
2. Execute as células de preparação em ordem, do início até a seção **Seleção de arquivos**.
3. Para tratar um CSV, execute a primeira célula de ação e selecione o arquivo. O resultado será `dados_tratados.json`.
4. Para atualizar a base, execute a segunda célula de ação. Selecione primeiro o JSON atual do sistema e depois o JSON com os novos registros.
5. A base combinada será salva como `verificacoes_bombas_tratado.json`. No Colab, o arquivo será baixado. No Jupyter, será salvo na pasta do arquivo JSON atual.
6. Copie o arquivo gerado para `src/backend-node/data/`, substitua a base anterior e reinicie a API para carregar os dados atualizados.

## Tratamento do CSV

A leitura detecta automaticamente o separador entre vírgula, ponto e vírgula e tabulação, e mantém os valores como texto para preservar zeros à esquerda. A codificação padrão é Latin-1, usada nos arquivos de origem do projeto. Se o CSV usar outra codificação, a função `tratar_csv_para_json` aceita o parâmetro `encoding`.

O tratamento valida as colunas obrigatórias, normaliza datas e textos, padroniza identificadores e endereços, converte campos numéricos e exporta os registros em JSON UTF-8, com datas ISO e valores ausentes como `null`.

## Combinação de JSONs

A função `combinar_jsons_tratados` acrescenta os registros do segundo arquivo ao primeiro, mantendo todas as linhas. Em seguida, recalcula `REPETIDO` considerando a base completa, pela combinação de `RLD_ID` e `NUMERO_INMETRO`. A função não exclui duplicatas automaticamente.

O arquivo final deve manter o nome `verificacoes_bombas_tratado.json`, esperado pela aplicação. Antes de substituir a base em uso, confira as contagens de registros exibidas ao final da combinação.

## Uso em Python

As células de ação abrem os seletores de arquivo. As funções também podem ser chamadas diretamente após executar as células de preparação:

```python
tratar_csv_para_json("dados_2027.csv", "dados_2027_tratados.json")

combinar_jsons_tratados(
    "verificacoes_bombas_tratado.json",
    "dados_2027_tratados.json",
    "verificacoes_bombas_tratado.json",
)
```
