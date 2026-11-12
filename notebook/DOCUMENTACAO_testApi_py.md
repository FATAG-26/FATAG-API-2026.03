# Documentação do notebook `testApi_py.ipynb`

## Objetivo

O notebook carrega, trata e analisa os registros de verificações de bombas de combustível do IPEM-SP, da regional de São José dos Campos, de **janeiro de 2018 a setembro de 2026**. Ele tem três partes:

1. **Carga:** lê os dois CSVs de origem e junta tudo em um único `df`.
2. **Tratamento:** limpa e padroniza os dados e exporta a base tratada em `verificacoes_bombas_tratado.json`. **É esse arquivo que o backend em Node.js usa** (em `src/data/`).
3. **Análise:** carrega o JSON tratado e oferece funções de consulta, filtros, indicadores e gráficos. Essas funções foram portadas para JavaScript em `src/backend-node/src/service.js`.

## 1. Carga dos dados de origem

Os arquivos são lidos direto do repositório no GitHub, então não é preciso baixá-los antes:

| Arquivo | Período | Separador | Formato da data |
|---|---|:---:|:---:|
| `src/data/verificacoes_bombas_2018.csv` | jan/2018 – nov/2018 | `;` | `dd/mm/aaaa` |
| `src/data/verificacoes_bombas_2019-2025.csv` | jan/2019 – set/2026 | `,` | `dd/mm/aa` |

Os dois arquivos têm as mesmas colunas e codificação Latin-1. Todas as colunas são lidas como texto, para preservar identificadores com zeros à esquerda.

A função `carregarArquivo(arquivo, sep, formato)` lê um CSV e converte `DATAVERIFICACAO` para data. `extrairEndereco(endereco)` separa `MUNICIPIO` e `BAIRRO` de `ENDERECO_COMPLETO`. O endereço é quebrado a partir da direita, porque o nome da rua às vezes contém ` - ` (ex.: `CARAGUÁ - UBATUBA, 6225`).

Depois disso as colunas são renomeadas para nomes mais legíveis (`NOMEFANTASIA` → `PROPRIETARIO`, `DESC_ITEM` → `DESCRICAO`, `NR_INMETRO` → `NUMERO_INMETRO`, `NR_SERIE` → `NUMERO_SERIE`, `DATAVERIFICACAO` → `DATA_VERIFICACAO`).

## 2. Tratamento e exportação

A célula de tratamento executa, em ordem:

```python
df_tratado = sinalizar_repetidos(tratar(df))
validar(df_tratado)
exportar_json(df_tratado)
```

### `tratar(df)`

| Etapa | O que faz |
|---|---|
| `verificar_entrada` | Confere se as colunas necessárias existem. |
| `vazios_para_nan` | Troca textos vazios ou só com espaços por nulos. |
| `padronizar_datas` | Mantém `DATA_VERIFICACAO` e converte `DT_HORA_VERIF`, quando existir. |
| Limpeza de texto | Remove espaços extras e coloca `PROPRIETARIO`, `BAIRRO` e `MUNICIPIO` em maiúsculas. |
| Correções de nomes | Unifica nomes de postos (`MAPA_NOMES`) e troca `Sem Verif.` por `Sem Verificação`. |
| Número de série e CNPJ | Padroniza o número de série (sem espaços e pontuação) e completa `NR_CGC_INDICE` com zeros até 8 dígitos. |
| `separar_endereco` | Separa `RUA_NUM` e `CEP` do endereço. |
| `converter_ids` | Converte os IDs (`RLD_ID`, `IDFISCAL`, `IDMOTORISTA`, `COD_PROPR`, `CODITEM`) para inteiros. |
| `padronizar_textos` | Expande abreviações (ex.: `AV.` → `AVENIDA`), corrige erros de digitação e unifica palavras que diferem só por acento. |
| Remoção de colunas | Remove colunas redundantes (`INDICEDOC`, `ESPECIE`, `REGIONAL`) e auxiliares. |

> A coluna `REGIONAL` é removida porque todos os registros são da mesma regional (São José dos Campos). Por isso a aplicação ainda não tem filtro por região.

### `sinalizar_repetidos(df)`

Marca na coluna `REPETIDO` os registros com o mesmo `RLD_ID` + `NUMERO_INMETRO`. Nenhum registro é excluído.

### `validar(df)`

Mostra indicadores de qualidade (datas inválidas, municípios e bairros nulos, CEP, CNPJ e números de série fora do formato, grafias diferentes para o mesmo nome) e a distribuição dos registros por ano.

### `exportar_json(df, caminho="verificacoes_bombas_tratado.json")`

Exporta a base tratada em JSON UTF-8, com datas no formato ISO e campos vazios como `null`. Para atualizar a base usada pela aplicação, copie o arquivo gerado para `src/data/`.

## 3. Análise

A célula **ANÁLISE** pode ser executada sozinha (depois da célula de imports). Ela lê o JSON tratado com `carregar_tratado(origem)`, que aceita um caminho local ou uma URL, e monta o `df` usado no resto do notebook:

| Coluna | Conteúdo |
|---|---|
| `MUNICIPIO` | Município |
| `BAIRRO` | Bairro |
| `PROPRIETARIO` | Nome fantasia do posto |
| `DESCRICAO` | Descrição do item, a partir de `CODITEM` (372 = vazão de 20 a 100 L/min; 373 = vazão de 100 a 500 L/min) |
| `NUMERO_INMETRO` | Número do instrumento no Inmetro |
| `NUMERO_SERIE` | Número de série |
| `DATA_VERIFICACAO` | Dia da verificação (de `DT_HORA_VERIF`) |
| `RESULTADO` | `Aprovado`, `Reprovado`, `Interditado`, `Excluído` ou `Sem Verificação` |
| `ANO` | Ano da verificação |
| `COD_PROPR` | Código do proprietário |

A variável `df_view` mostra a mesma tabela com as datas em `dd/mm/aaaa`.

## Consultas e funções

### Contagem de registros: `nPericiadas(l, resultado=None)`

Retorna o número de linhas em `l`. Se `resultado` for informado, conta só as linhas com aquele `RESULTADO`.

Exemplo: `nPericiadas(df, "Aprovado")`.

### Seleção por resultado: `aproRepr(l, a)`

Retorna só as linhas em que `RESULTADO` é igual a `a`. Funciona com qualquer resultado, não só aprovado e reprovado.

Exemplo: `aproRepr(df, "Interditado")`.

### Contagem por município: `contarAprRep(l, ar=None)`

Conta os registros por município, do maior para o menor, e devolve os 5 primeiros. Com `ar`, conta só aquele resultado; sem `ar`, conta todos.

Exemplo: `contarAprRep(df, "Reprovado")`.

### Ranking percentual: `percentualAprRep(l, ar, min_bombas=20)`

Calcula o percentual do resultado `ar` em cada município e devolve os 5 maiores. Municípios com menos de `min_bombas` bombas ficam de fora, para cidades muito pequenas não distorcerem o ranking. É a base do gráfico de ranking da aplicação.

Exemplo: `percentualAprRep(df, "Aprovado")`.

### Sugestões de busca: `listarMunicipios(l, texto="", limite=None)` e `listarBairros(l, municipio, texto="", limite=None)`

Devolvem os municípios (ou os bairros de um município) que contêm o texto, ignorando acentos e pontuação. Quem começa com o texto vem primeiro. Texto vazio devolve todos. São usadas nas listas de sugestão dos campos de busca da aplicação.

Exemplo: `listarMunicipios(df, "jose", limite=5)`.

### Filtros de texto: `filtrarPorMunicipio(l, municipio)` e `filtrarPorBairro(l, bairro)`

Usam `filtrarPorTexto`, que compara os textos sem acento, pontuação ou diferença entre maiúsculas e minúsculas:

- se o texto for igual a um nome completo, devolve só esse nome;
- senão, devolve tudo que contém o texto;
- busca vazia devolve uma tabela vazia.

As células de exemplo pedem o valor com `input()`.

### Filtro por proprietário: `filtrarPorProprietario(l, fornecedor)`

Retorna os registros do nome fantasia informado, ignorando maiúsculas/minúsculas e espaços nas pontas. Apesar do nome do parâmetro, a comparação é com a coluna `PROPRIETARIO`.

### Filtro por data: `filtrarPorData(l, data_inicio=None, data_final=None, modo=None)`

Filtra pela coluna `DATA_VERIFICACAO`. Aceita datas em `dd/mm/aaaa` e `aaaa-mm-dd`.

| Modo | Comportamento |
|---|---|
| `"S"` | Busca uma data exata; informe só `data_inicio`. |
| `"I"` | Busca um intervalo inclusivo. Só início = daquela data em diante; só fim = até aquela data. |

A função devolve uma mensagem quando faltam parâmetros ou quando não há registros.

Exemplo: `filtrarPorData(df, "2018-08-30", modo="S")`.

### Percentuais de resultados

- `percentualAprovadoReprovado(l)` calcula o percentual de `Aprovado`, `Reprovado` e `Interditado` sobre o total de linhas.
- `percentualPorResultado(l)` calcula o percentual de todas as categorias, incluindo `Excluído` e `Sem Verificação`, com duas casas decimais.

### Exportar consulta em JSON: `gerarJson(l, arquivo="dados_filtrados.json")`

Salva em JSON o resultado de qualquer filtro, com datas em `AAAA-MM-DD` e campos vazios como `null`. Se não houver dados, devolve uma mensagem em vez de criar o arquivo.

Exemplo: `gerarJson(filtrarPorMunicipio(df, "GUARATINGUETÁ"), "guaratingueta.json")`.

### Comparação entre anos: `gropoData(l, ano)` e `contDataRes(l, audi, apro, repro, inter, ano)`

`gropoData` devolve só os registros do ano informado. `contDataRes` devolve, para esse ano, a tupla `(periciadas, aprovadas, reprovadas, interditadas)`; cada contagem só é calculada se o parâmetro correspondente for `True` (as outras ficam 0). É a base do gráfico de evolução por ano da aplicação.

Exemplo: `contDataRes(df, True, True, True, True, 2020)`.

## Gráficos e cards

| Célula / função | O que mostra |
|---|---|
| Gráfico de pizza | Distribuição de todos os resultados, com percentuais e o total de perícias. |
| `gerarGrafico(l, r=None, modo="absoluto")` | Ranking de municípios em barras horizontais. `modo="percentual"` usa `percentualAprRep`; o modo absoluto usa `contarAprRep`. Sem `r`, conta todas as perícias. |
| `exibirCard(t, f)` | Card com um número (total de perícias, de aprovados e de autuações). |
| `exibirCardPorCem(t)` | Card com o percentual de aprovados, reprovados ou interditados. |

> As funções de gráfico usam o `df` global da célula de análise, não o parâmetro `l`.

## Como executar

1. Abra o notebook no [Google Colab](https://colab.research.google.com/drive/1hZg6B7dlyYgenRo9yUHyZRV7iHlA0LvL?usp=sharing) ou no Jupyter, com Python, `pandas` e `matplotlib` instalados.
2. Execute a célula de carga: os CSVs são baixados direto do GitHub.
3. Execute a célula de tratamento para gerar `verificacoes_bombas_tratado.json`.
4. Execute a célula **ANÁLISE** e depois as demais, na ordem. Nas células com `input()`, digite o valor pedido.

Para só analisar, sem tratar de novo, coloque `verificacoes_bombas_tratado.json` (de `src/data/`) na pasta do notebook e comece pela célula **ANÁLISE**.
