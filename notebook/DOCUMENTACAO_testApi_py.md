# Documentação do notebook `testApi_py.ipynb`

## Objetivo

O notebook carrega e organiza registros de verificações de bombas de combustível do IPEM-SP, da regional de São José dos Campos, referentes ao período de março a outubro de 2018. Em seguida, permite consultar e resumir os registros por resultado, município, bairro, data e proprietário, além de exibir um gráfico de distribuição dos resultados.

## Arquivo de entrada e preparação

O notebook espera encontrar `verificacoes_bombas_2018-2.csv` no diretório de trabalho, usando o caminho relativo `./verificacoes_bombas_2018-2.csv`. O CSV deve usar `;` como separador e codificação Latin-1. Todas as colunas são inicialmente lidas como texto, preservando identificadores e valores com zeros à esquerda.

O processamento:

1. Lê o CSV com pandas.
2. Extrai `BAIRRO` e `MUNICIPIO` de `ENDERECO_COMPLETO`, separando o endereço pelo delimitador ` - ` e pegando os componentes a partir do final. Isso evita quebrar incorretamente nomes de ruas que também contenham esse delimitador.
3. Converte `DATAVERIFICACAO` para data, considerando o dia antes do mês.
4. Renomeia campos para nomes mais legíveis e seleciona as oito colunas de análise.

O resultado preparado fica na variável `df`.

### Colunas de `df`

| Coluna | Conteúdo |
|---|---|
| `MUNICIPIO` | Município extraído do endereço |
| `BAIRRO` | Bairro extraído do endereço |
| `PROPRIETARIO` | Nome fantasia (`NOMEFANTASIA` no CSV) |
| `DESCRICAO` | Descrição do item (`DESC_ITEM`) |
| `NUMERO_INMETRO` | Número do instrumento no INMETRO (`NR_INMETRO`) |
| `NUMERO_SERIE` | Número de série (`NR_SERIE`) |
| `DATA_VERIFICACAO` | Data da verificação, convertida para data |
| `RESULTADO` | Resultado da verificação |

A célula seguinte exibe `df` para inspeção visual dos registros carregados.

## Consultas e funções

### Contagem de registros: `nPericiadas(l, resultado=None)`

Retorna o número de linhas em `l`. Se `resultado` for informado, conta somente as linhas cujo campo `RESULTADO` corresponde exatamente ao valor fornecido, como `"Aprovado"` ou `"Reprovado"`.

Exemplo: `nPericiadas(df, "Aprovado")`.

### Seleção por resultado: `aproRepr(l, a)`

Retorna um DataFrame contendo somente as linhas em que `RESULTADO` é igual a `a`. Embora o nome sugira aprovação/reprovação, pode ser usado com qualquer categoria presente nos dados, como `"Interditado"`.

Exemplo: `aproRepr(df, "Aprovado")`.

### Contagem por município: `contarAprRep(l, ar)`

Filtra o DataFrame pelo resultado informado e conta quantos registros desse resultado há em cada município. A função também aceita categorias além de aprovados e reprovados.

Exemplo: `contarAprRep(df, "Interditado")`.

### Filtro por município: `filtrarPorMunicipio(l, municipio)`

Retorna os registros de um município. A comparação ignora espaços nas extremidades e diferenças entre maiúsculas e minúsculas. A célula de exemplo solicita o município com `input()`.

### Percentuais de resultados

- `percentualAprovadoReprovado(l)` calcula a porcentagem de registros `Aprovado`, `Reprovado` e `Interditado` em relação ao total de linhas.
- `percentualPorResultado(l)` calcula a porcentagem de todas as categorias encontradas na coluna `RESULTADO`, incluindo categorias como `Excluído` e `Sem Verif.`. Os valores são arredondados para duas casas decimais.

### Filtro por bairro: `filtrarPorBairro(l, bairro)`

Retorna os registros de um bairro, ignorando diferenças entre maiúsculas e minúsculas e espaços nas extremidades. A célula de exemplo solicita o bairro com `input()`.

### Filtro por data: `filtrarPorData(l, data_inicio=None, data_final=None, modo=None)`

Filtra os registros pela coluna `DATA_VERIFICACAO`. As datas de texto são interpretadas com dia antes do mês.

| Modo | Comportamento |
|---|---|
| `"S"` | Busca uma data exata; informe `data_inicio` e deixe `data_final` vazio. |
| `"I"` | Busca um intervalo inclusivo. Com início e fim, inclui as duas extremidades; apenas início significa daquela data em diante; apenas fim significa até aquela data. |

A função devolve uma mensagem quando faltam parâmetros ou quando não há registros. Para um intervalo, informe a data inicial antes da final. Exemplo: `filtrarPorData(df, "2018-04-05", "2018-04-27", modo="I")`.

### Filtro por proprietário: `filtrarPorProprietario(l, fornecedor)`

Retorna os registros do nome fantasia informado, ignorando diferenças entre maiúsculas e minúsculas e espaços nas extremidades. Apesar do parâmetro se chamar `fornecedor`, ele é comparado com a coluna `PROPRIETARIO`.

## Gráfico

A última seção cria um gráfico de pizza com a quantidade relativa de cada categoria de resultado: `Aprovado`, `Reprovado`, `Interditado`, `Excluído` e `Sem Verif.`. Os rótulos exibem percentuais e uma legenda de texto abaixo informa o total de perícias.

## Como executar

1. Instale Python e as bibliotecas `pandas` e `matplotlib`.
2. Coloque o notebook e o arquivo CSV no local esperado, ou ajuste a variável `arquivo` para apontar para o CSV.
3. Abra o notebook em Jupyter ou Google Colab e execute as células em ordem, começando pela leitura e preparação dos dados.
4. Nas células de filtro interativo, informe os valores solicitados quando aparecer o campo de entrada.
