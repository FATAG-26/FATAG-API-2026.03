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
| Atualizar os testes automatizados do backend depois da limpeza do SCRUM-43 (hoje 5 de 7 falham no `npm test`) | ❌ |
| Atualizar o manual de instalação: execução sem Docker e atualização da base (RNF01) | ✅ |
| Atualizar a documentação do notebook (tratamento de 2018 a 2026 e exportação do JSON) | ✅ |
| Criar o manual do usuário (RNF02) | ❌ |
| Documentação da API (RNF03), em `docs/api.md` | ✅ |

### US 11 – Registros tratados em CSV

| Subtarefa | Status |
| --------- | :----: |
| Exportar em CSV os registros tratados, respeitando os filtros aplicados (SCRUM-53) | ✅ |
| Exportar também em JSON (SCRUM-53) | ✅ |
| CSV com BOM UTF-8 e separador `;`, para abrir com a acentuação correta no Excel | ✅ |
| Ícones nos botões de gerar relatório (SCRUM-53) | ✅ |
| Validar o arquivo exportado com a base de origem | ❌ |

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
