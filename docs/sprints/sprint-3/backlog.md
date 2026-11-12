# 📋 Backlog da Sprint 3

> **Período:** 02/11 – 22/11 · **Meta:** entregar a dashboard interativa, com filtros por município, região e período, gráficos interativos e exportação dos registros tratados em CSV.
>
> **Legenda:** ✅ Concluído · 🚧 Em andamento · ❌ Não iniciado

| Rank | Prioridade | User Story | Story Points | Sprint | Requisito do Cliente | Status |
| :--: | :--------: | ---------- | :----------: | :----: | :------------------: | :----: |
| 8 | Médio | Como usuário, quero filtrar os dados por município, região e período, para realizar consultas específicas e facilitar a análise dos resultados. | 20 | 3 | R05 | 🚧 |
| 9 | Médio | Como usuário, quero visualizar gráficos interativos dos dados, para facilitar a análise dos resultados das fiscalizações. | 20 | 3 | R07 | 🚧 |
| 10 | Médio | Como usuário, quero utilizar uma dashboard interativa, para navegar e consultar as informações de forma simples e intuitiva. | 20 | 3 | R05 | 🚧 |
| 11 | Alta | Como usuário, quero ter acesso aos registros em CSV das bombas periciadas tratadas, para facilitar o acesso dos dados para o usuário. | 20 | 3 | — | 🚧 |

## 🧩 Subtarefas

### US 8 – Filtros por município, região e período (R05)

| Subtarefa | Status |
| --------- | :----: |
| Filtros por município, bairro, proprietário e resultado aplicados na tabela, nos indicadores, no ranking e nos gráficos | ✅ |
| Filtro por período (De / Até) com seletor de datas | ✅ |
| Lista de sugestões de municípios e de bairros (bairros conforme o município escolhido) | ✅ |
| Seleção de municípios pelo mapa do Vale do Paraíba conectada aos filtros (SCRUM-45) | ✅ |
| Botão "Limpar Filtros" | ✅ |
| Barra de "Filtros ativos" com botão para remover cada filtro, incluindo os aplicados pelos gráficos e pelo mapa | ✅ |
| Filtro por região (regional): hoje todos os registros são da regional de São José dos Campos, e o notebook remove a coluna `REGIONAL` | ❌ |

### US 9 – Gráficos interativos (R07)

| Subtarefa | Status |
| --------- | :----: |
| Gráfico de linhas com a comparação de 2018 a 2026 (SCRUM-40) | ✅ |
| Gráfico de pizza interativo: clicar numa fatia ou na legenda filtra pelo resultado (SCRUM-52) | ✅ |
| Gráfico de rosca: destaque da fatia ao passar o mouse, percentual no centro, clicar de novo remove o filtro, legenda acessível pelo teclado | ✅ |
| Ranking: clicar numa barra filtra pelo município (sincronizado com o mapa) e destaca os selecionados | ✅ |
| Gráfico de evolução por ano: respeita os filtros do painel, tooltip com quantidade e percentual, clicar num ano filtra o painel por aquele ano | ✅ |
| Gráfico de ranking por município com o percentual do resultado selecionado (SCRUM-39) | ✅ |
| Mapa interativo do Vale do Paraíba, com seleção de municípios (SCRUM-45) | ✅ |
| Validar os valores dos gráficos com a base de origem | ❌ |

### US 10 – Dashboard interativa (R05)

| Subtarefa | Status |
| --------- | :----: |
| Novo visual do site (SCRUM-41) | ✅ |
| Filtro lateral com modal (SCRUM-46) | ✅ |
| Nova cor dos cards e logo nova (SCRUM-46) | ✅ |
| Dropdown de relatórios (SCRUM-46) | ✅ |
| Relatório personalizado em PDF com os critérios da consulta, o resumo e o ranking (SCRUM-36 / SCRUM-48) | ✅ |
| Limpeza do código não utilizado no `service.js` e nas rotas do `app.js` (SCRUM-43) | ✅ |
| Reestruturação do Docker Compose (SCRUM-43) | ✅ |
| Corrigir os erros de TypeScript que impediam o `npm run build` do front-end | ✅ |
| Atualizar os testes do backend depois da limpeza do SCRUM-43 e adicionar testes das rotas da API (23 testes passando no `npm test`) | ✅ |
| Atualizar o manual de instalação: execução sem Docker e atualização da base (RNF01) | ✅ |
| Atualizar a documentação do notebook (tratamento de 2018 a 2026 e exportação do JSON) | ✅ |
| Criar o manual do usuário (RNF02), em `docs/manual-do-usuario.md` | ✅ |
| Documentação da API (RNF03), em `docs/api.md` | ✅ |

### US 11 – Registros tratados em CSV

| Subtarefa | Status |
| --------- | :----: |
| Exportar em CSV os registros tratados, respeitando os filtros aplicados (SCRUM-53) | ✅ |
| Exportar também em JSON (SCRUM-53) | ✅ |
| CSV com BOM UTF-8 e separador `;`, para abrir com a acentuação correta no Excel | ✅ |
| Ícones nos botões de gerar relatório (SCRUM-53) | ✅ |
| Validar o arquivo exportado com a base de origem | ❌ |

## ✅ Critérios de Aceitação e Cenários de Teste

> Usados pelo PO na validação da sprint. Uma história só é ✅ quando todos os seus critérios forem atendidos.

### US 8 – Filtros por município, região e período (R05)

**Critérios de aceitação**

1. O usuário consegue filtrar por município, bairro, proprietário, resultado e período (De / Até).
2. O campo Município sugere os municípios da base, e o campo Bairro sugere apenas os bairros do município escolhido.
3. Os filtros podem ser combinados e são aplicados ao mesmo tempo na tabela, nos cards, nos gráficos, no ranking e nos relatórios.
4. Os filtros aplicados ficam visíveis fora do modal, e cada um pode ser removido individualmente; "Limpar Filtros" remove todos.
5. A busca por município e bairro ignora acentos e maiúsculas ("sao jose" encontra "SÃO JOSÉ DOS CAMPOS").
6. ⚠️ **Filtro por região: aguardando decisão do PO.** Todos os registros atuais são da regional de São José dos Campos, então o filtro por regional não teria efeito. Opções: (a) tirar "região" desta história; (b) definir região como agrupamento de municípios (ex.: sub-regiões do Vale do Paraíba); (c) incluir dados de outras regionais.

**Cenários de teste**

| # | Dado | Quando | Então |
| :-: | ---- | ------ | ----- |
| 8.1 | que o painel está sem filtros | o usuário escolhe o município "TAUBATÉ" | a tabela, os cards, os gráficos e o ranking mostram apenas dados de Taubaté, e o chip "Município: TAUBATÉ" aparece em "Filtros ativos" |
| 8.2 | que o município "LORENA" está selecionado | o usuário abre o campo Bairro | só aparecem bairros de Lorena |
| 8.3 | que o painel está sem filtros | o usuário informa De = 01/01/2020 e Até = 31/12/2020 | o total periciado é 5.838 (total de 2020 na base) |
| 8.4 | que há filtros de município e período aplicados | o usuário clica no ✕ do chip do município | só o filtro de município é removido; o de período continua |
| 8.5 | que há vários filtros aplicados | o usuário clica em "Limpar Filtros" | todos os filtros são removidos e o painel volta a mostrar os 46.056 registros |
| 8.6 | que o painel está sem filtros | o usuário digita "sao jose" no campo Município | os dados de São José dos Campos e de São José do Barreiro são exibidos |

### US 9 – Gráficos interativos (R07)

**Critérios de aceitação**

1. O painel tem, no mínimo: gráfico de rosca dos resultados, ranking de municípios, gráfico de evolução por ano e mapa do Vale do Paraíba.
2. Ao passar o mouse sobre um elemento do gráfico, o usuário vê o valor exato e o percentual.
3. Clicar num elemento do gráfico filtra o painel inteiro (fatia → resultado; barra do ranking → município; ponto do gráfico de linhas → ano; município no mapa → município).
4. Clicar de novo no mesmo elemento remove o filtro que ele aplicou.
5. Os gráficos respeitam os filtros do painel.
6. Os valores exibidos nos gráficos conferem com a base de origem.

**Cenários de teste**

| # | Dado | Quando | Então |
| :-: | ---- | ------ | ----- |
| 9.1 | que o painel está sem filtros | o usuário passa o mouse na fatia "Reprovado" | o centro da rosca mostra 3,6% e "Reprovado" |
| 9.2 | que o painel está sem filtros | o usuário clica na fatia "Reprovado" | a tabela mostra só bombas reprovadas, o ranking passa a ser de % de reprovados e aparece o chip "Resultado: Reprovado" |
| 9.3 | que o filtro "Reprovado" foi aplicado pela rosca | o usuário clica de novo na fatia "Reprovado" | o filtro de resultado é removido |
| 9.4 | que o painel está sem filtros | o usuário clica na barra do 1º colocado do ranking | o painel é filtrado por esse município e ele aparece selecionado no mapa |
| 9.5 | que o painel está sem filtros | o usuário clica no ponto de 2019 do gráfico de evolução | o painel é filtrado de 01/01/2019 a 31/12/2019, o total periciado é 6.632 e o gráfico continua mostrando todos os anos, com 2019 marcado |
| 9.6 | que o município "TAUBATÉ" está filtrado | o usuário olha o gráfico de evolução | o ponto de 2018 mostra 727 periciadas e 630 aprovadas |
| 9.7 | que o painel está sem filtros | o usuário clica em "Reprovados" na legenda do gráfico de evolução | a linha de reprovados é escondida, sem filtrar o painel |

### US 10 – Dashboard interativa (R05)

**Critérios de aceitação**

1. O painel reúne em uma única tela: tabela, cards de KPI, gráficos, ranking, mapa, filtros e relatórios.
2. A tabela carrega mais registros automaticamente ao rolar até o fim (sem travar a tela).
3. O layout funciona em computador e em celular, sem rolagem horizontal da página.
4. Enquanto os dados carregam, o painel indica o carregamento; se a API falhar, aparece uma mensagem de erro em vez de uma tela em branco.
5. O relatório em PDF traz os critérios da consulta, o resumo dos resultados e o ranking.
6. O projeto sobe com `docker compose up --build` seguindo o [manual de instalação](../../instalação.md).
7. O `npm run build` do front-end e o `npm test` do backend passam sem erros.

**Cenários de teste**

| # | Dado | Quando | Então |
| :-: | ---- | ------ | ----- |
| 10.1 | que o usuário abriu o painel | ele rola a tabela até o fim | mais registros são carregados |
| 10.2 | que o painel está aberto numa tela de celular (360 px de largura) | o usuário rola a página | todos os blocos cabem na largura da tela, sem rolagem horizontal |
| 10.3 | que o filtro "TAUBATÉ" está aplicado | o usuário gera o relatório em PDF | o PDF mostra "Município: TAUBATÉ" nos critérios, o resumo e o ranking de Taubaté |
| 10.4 | que a API está desligada | o usuário abre o painel | aparecem mensagens de erro nos blocos, sem quebrar a página |
| 10.5 | que o projeto foi baixado numa máquina nova com Docker | o usuário segue o manual de instalação | o painel abre em http://localhost:5173 com os dados |

### US 11 – Registros tratados em CSV

**Critérios de aceitação**

1. O usuário consegue baixar em CSV os registros tratados, pelo menu "Relatórios".
2. O arquivo contém só os registros que atendem aos filtros aplicados.
3. O CSV abre corretamente no Excel: colunas separadas, acentos corretos e datas legíveis.
4. O arquivo tem as colunas Município, Bairro, Proprietário, Descrição, Número Inmetro, Número de Série, Data de Verificação e Resultado.
5. O nome do arquivo identifica o conteúdo e a data da exportação.
6. Também é possível baixar os mesmos dados em JSON.

**Cenários de teste**

| # | Dado | Quando | Então |
| :-: | ---- | ------ | ----- |
| 11.1 | que o painel está sem filtros | o usuário clica em Relatórios → CSV | é baixado `relatorio_bombas_<data>.csv` com 46.056 linhas de dados mais o cabeçalho |
| 11.2 | que o filtro "LORENA" está aplicado | o usuário exporta o CSV | o arquivo tem 2.017 linhas de dados, todas de Lorena |
| 11.3 | que o CSV foi baixado | o usuário abre o arquivo no Excel | cada campo aparece em sua coluna e palavras como "GUARATINGUETÁ" e "Excluído" aparecem com acento |
| 11.4 | que o filtro "Reprovado" está aplicado | o usuário exporta em JSON | o arquivo contém 1.646 registros, todos com resultado "Reprovado" |

## 🏅 DoR - Definition of Ready

| Critério | Descrição |
| :------: | --------- |
| Clareza na Descrição | A User Story está escrita no formato "Como [persona], quero [ação], para [objetivo]". |
| Critérios de Aceitação Definidos | A história possui critérios objetivos que indicam o que é necessário para considerá-la concluída. |
| Cenários de Teste Especificados | A história tem pelo menos 1 cenário de teste estruturado (Dado, Quando, Então). |
| Independente | A história pode ser implementada sem depender de outra tarefa da mesma Sprint. |
| Compreensão Compartilhada | Toda a equipe (incluindo PO e devs) compreende o propósito da história. |
| Estimável | A história foi pontuada no Planning Poker ou tem uma estimativa clara. |
| Fontes de Dados Identificadas | As bases necessárias (Portal de Dados Abertos do IPEM-SP e PSIE do Inmetro) foram localizadas e estão acessíveis. |
| Documentos de Apoio | Se necessário, dicionário de dados, mockups ou fluxos estão anexados ou referenciados. |

## 🏅 DoD - Definition of Done

| Critério | Descrição |
| :------: | --------- |
| Critérios de Aceitação atendidos | Todos os cenários de teste da história foram executados e aprovados. |
| Dados tratados | Os dados de todos os anos foram limpos e padronizados (municípios, regionais e datas). |
| API funcionando | As rotas da história respondem corretamente e têm testes automatizados passando (`npm test`). |
| Indicadores validados | As contagens, taxas e rankings por município e região conferem com a base de origem. |
| Front-end integrado | As telas da história exibem os dados vindos da API. |
| Código revisado | O código foi revisado por pelo menos um colega de equipe. |
| Documentação atualizada | O notebook, a documentação e o manual de instalação foram atualizados com as alterações da Sprint. |
| Código versionado | O código está no repositório do GitHub seguindo o padrão de commits. |
| Validação do PO | O Product Owner validou a entrega com base nos critérios definidos. |
| Pronto para entrega | O item está testado, validado e pode ser apresentado ao cliente. |
