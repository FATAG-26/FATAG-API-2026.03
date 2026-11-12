# 🔌 Documentação da API

API REST em **Node.js + Express** (`src/backend-node`), que serve os dados tratados das verificações de bombas de combustível para o front-end. Ela lê a base `src/data/verificacoes_bombas_tratado.json` (gerada pelo [notebook](../notebook/DOCUMENTACAO_testApi_py.md)) uma única vez, ao iniciar, e responde tudo em memória.

- **URL base:** `http://localhost:8000/api`
- **Formato:** JSON (UTF-8)
- **Autenticação:** nenhuma; todas as rotas são `GET` e só de leitura
- **No front-end:** o Vite encaminha `/api` para o backend (ver `vite.config.ts`), então o front usa caminhos relativos, como `/api/resumo`

## Rotas

| Rota | Para que serve | Aceita os filtros? |
| ---- | -------------- | :----------------: |
| [`GET /api/health`](#get-apihealth) | Saber se a API está no ar | — |
| [`GET /api/bombas`](#get-apibombas) | Tabela de verificações, com paginação | ✅ |
| [`GET /api/resumo`](#get-apiresumo) | Cards de KPI e gráfico de rosca | ✅ |
| [`GET /api/bombas/por-ano`](#get-apibombaspor-ano) | Gráfico de evolução por ano | ✅ |
| [`GET /api/ranking`](#get-apiranking) | Ranking de municípios | ✅ (menos `resultado`) |
| [`GET /api/municipios`](#get-apimunicipios) | Sugestões para o campo Município | — |
| [`GET /api/bairros`](#get-apibairros) | Sugestões para o campo Bairro | — |

## Filtros

Todas as rotas marcadas com ✅ aceitam os mesmos filtros na query string. Todos são opcionais e podem ser combinados; sem filtros, a rota responde com a base inteira.

| Parâmetro | Exemplo | Como funciona |
| --------- | ------- | ------------- |
| `municipio` | `?municipio=TAUBATÉ` | Pode repetir para vários municípios: `?municipio=TAUBATÉ&municipio=JACAREÍ`. |
| `bairro` | `?bairro=centro` | |
| `proprietario` | `?proprietario=POSTO MAXIMO DE COMBUSTIVEIS` | Nome fantasia **completo** do posto (ignora maiúsculas e espaços nas pontas; não busca por trecho). |
| `resultado` | `?resultado=Reprovado` | Valor exato: `Aprovado`, `Reprovado`, `Interditado`, `Excluído` ou `Sem Verificação`. |
| `data_inicio` / `data_fim` | `?data_inicio=2020-01-01&data_fim=2020-12-31&modo=I` | Datas em `aaaa-mm-dd` ou `dd/mm/aaaa`. **Exigem o parâmetro `modo`.** |
| `modo` | `I` ou `S` | `I` = intervalo inclusivo (só início = daquela data em diante; só fim = até aquela data). `S` = uma data exata (informe só `data_inicio`). |

Os filtros `municipio` e `bairro` ignoram acentos, pontuação e maiúsculas. Se o texto for igual a um nome completo, retorna só esse nome; senão, retorna tudo que **contém** o texto. Exemplo: `municipio=sao jose` traz São José dos Campos e São José do Barreiro.

## Erros

Parâmetros inválidos retornam **400** com uma mensagem em português:

```json
{ "erro": "Data inválida. Use dd/mm/aaaa ou aaaa-mm-dd." }
```

| Situação | Mensagem |
| -------- | -------- |
| Data em formato inválido | `Data inválida. Use dd/mm/aaaa ou aaaa-mm-dd.` |
| Data sem `modo` | `Coloque o modo ('S' = singular / 'I' = intervalo)` |
| `modo` diferente de `S` ou `I` | `Modo inválido. Use 'S' ou 'I'.` |
| `limit`, `offset`, `limite` ou `min_bombas` negativo ou não inteiro | `Parâmetro '<nome>' deve ser um inteiro não negativo.` |
| `tipo` do ranking inválido | `Parâmetro 'tipo' deve ser 'percentual' ou 'absoluto'.` |

Qualquer outro erro retorna **500** com `{ "erro": "Erro interno do servidor." }`, e o detalhe aparece no log do backend.

---

## `GET /api/health`

Verifica se a API está no ar e quantos registros foram carregados.

```json
{ "status": "ok", "registros": 46056 }
```

## `GET /api/bombas`

Lista as verificações filtradas, com paginação.

| Parâmetro | Padrão | Descrição |
| --------- | :----: | --------- |
| `limit` | `100` | Quantos registros devolver. |
| `offset` | `0` | Quantos registros pular. |
| + [filtros](#filtros) | | |

`total` é o número de registros que atendem aos filtros, não só os da página. A data volta no formato `dd-mm-aaaa`.

`GET /api/bombas?municipio=LORENA&limit=1`

```json
{
  "total": 2017,
  "itens": [
    {
      "MUNICIPIO": "LORENA",
      "BAIRRO": "CRUZ",
      "PROPRIETARIO": "POSTO MAXIMO DE COMBUSTIVEIS",
      "DESCRICAO": "Bomba medidora para combustíveis, vazão > 20 até 100 L/min.",
      "NUMERO_INMETRO": "10053429",
      "NUMERO_SERIE": "111970",
      "DATA_VERIFICACAO": "04-07-2018",
      "RESULTADO": "Aprovado"
    }
  ]
}
```

## `GET /api/resumo`

Totais usados nos cards de KPI e no gráfico de rosca: total de bombas periciadas, contagem por resultado e percentuais (com duas casas decimais) sobre o total.

`GET /api/resumo?municipio=LORENA`

```json
{
  "total": 2017,
  "porResultado": { "Aprovado": 1807, "Reprovado": 83, "Excluído": 94, "Sem Verificação": 32, "Interditado": 1 },
  "percentuais": { "aprovado": 89.59, "reprovado": 4.12, "interditado": 0.05 }
}
```

## `GET /api/bombas/por-ano`

Contagem de verificações por ano, em ordem crescente. Base do gráfico de evolução por ano.

`GET /api/bombas/por-ano?municipio=TAUBATÉ`

```json
[
  { "ano": 2018, "total": 727, "aprovados": 630, "reprovados": 38, "interditados": 3 },
  { "ano": 2019, "total": 1104, "aprovados": 961, "reprovados": 72, "interditados": 16 }
]
```

## `GET /api/ranking`

Ranking de municípios, do maior para o menor valor (empates em ordem alfabética).

| Parâmetro | Padrão | Descrição |
| --------- | :----: | --------- |
| `tipo` | `percentual` | `percentual` = % de bombas com o resultado `alvo` em cada município. `absoluto` = quantidade de bombas com esse resultado. |
| `alvo` | `Aprovado` | Resultado que está sendo ranqueado. Se não for informado, usa o `resultado` da query. |
| `limite` | `5` | Quantos municípios devolver. `0` = todos. |
| `min_bombas` | `20` | Só no `percentual`: ignora municípios com menos bombas, para cidades muito pequenas não distorcerem o ranking. |
| + [filtros](#filtros) | | O filtro `resultado` é ignorado, porque o percentual de aprovados dentro de uma base só de reprovados não faria sentido. |

`GET /api/ranking?tipo=absoluto&alvo=Reprovado&limite=3`

```json
{
  "tipo": "absoluto",
  "alvo": "Reprovado",
  "itens": [
    { "municipio": "SÃO JOSÉ DOS CAMPOS", "valor": 466 },
    { "municipio": "TAUBATÉ", "valor": 220 },
    { "municipio": "PINDAMONHANGABA", "valor": 122 }
  ]
}
```

No tipo `percentual`, `valor` vai de 0 a 100.

## `GET /api/municipios`

Lista os municípios da base, para as sugestões do campo de busca.

| Parâmetro | Padrão | Descrição |
| --------- | :----: | --------- |
| `q` | — | Texto a buscar (ignora acentos e maiúsculas). Quem começa com o texto vem primeiro. Vazio = todos, em ordem alfabética. |
| `limite` | `0` | Máximo de itens. `0` = todos. |

`GET /api/municipios?q=sao&limite=3`

```json
["SÃO BENTO DO SAPUCAÍ", "SÃO JOSÉ DO BARREIRO", "SÃO JOSÉ DOS CAMPOS"]
```

## `GET /api/bairros`

Lista os bairros de um município. Sem `municipio`, devolve uma lista vazia.

| Parâmetro | Padrão | Descrição |
| --------- | :----: | --------- |
| `municipio` | — | Município dos bairros. |
| `q` | — | Texto a buscar, como em `/api/municipios`. |
| `limite` | `0` | Máximo de itens. `0` = todos. |

`GET /api/bairros?municipio=LORENA&q=cen`

```json
["CENTRO"]
```

---

## Testes

Os testes automatizados ficam em `src/backend-node/test/service.test.js` e rodam com:

```bash
cd src/backend-node
npm test
```

> ⚠️ Desde a limpeza do SCRUM-43, 5 dos 7 testes falham, porque usam funções que foram removidas do `service.js` (`contarAprRep`, `carregarDados`, `percentualPorResultado`) ou chamam `filtrarPorData` com texto em vez de `Date`. Os testes precisam ser atualizados.
