# 📋 Backlog da Sprint 2

> **Período:** 05/10 – 25/10 · **Meta:** consultar os dados por município e região, gerar o ranking de municípios e regiões e comparar a evolução entre os anos.
>
> **Legenda:** ✅ Concluído · 🚧 Em andamento · ❌ Não iniciado

| Rank | Prioridade | User Story | Story Points | Sprint | Requisito do Cliente | Status |
| :--: | :--------: | ---------- | :----------: | :----: | :------------------: | :----: |
| 5 | Alta | Como usuário, quero consultar os dados das bombas por município e região, para avaliar o controle de qualidade dos combustíveis em minha região. | 13 | 2 | R02 | 🚧 |
| 6 | Médio | Como usuário, quero visualizar um ranking de municípios e regiões, para comparar rapidamente os resultados das fiscalizações. | 13 | 2 | R04 | 🚧 |
| 7 | Médio | Como usuário, quero ter um comparativo de evolução entre os anos, para assim avaliar a evolução ou regressão no número de aprovados. | 13 | 2 | — | 🚧 |

## 🧩 Subtarefas

### US 5 – Consulta por município e região (R02)

| Subtarefa | Status |
| --------- | :----: |
| Adicionar os dados de 2019 a 2025 à base do projeto | ✅ |
| Tratar no notebook os dados de 2018 a 2025 e exportar a base tratada em JSON | ✅ |
| Converter os algoritmos do Pandas para JavaScript, com o backend em Node.js (Express) | ✅ |
| Rota `/api/bombas` com filtros por município, bairro, proprietário, resultado e data, com paginação | ✅ |
| Aceitar datas nos formatos `dd/mm/aaaa` e `aaaa-mm-dd` no filtro por data | ✅ |
| Testes automatizados das funções de filtro e dos indicadores | ✅ |
| Atualizar o Docker Compose para usar o backend em Node | ✅ |
| Carregar no backend a base tratada completa (2018–2025), em vez de apenas o CSV de 2018 | ❌ |
| Incluir a regional (`REGIONAL`) nos dados e adicionar filtro por região | ❌ |
| Rota com a taxa de conformidade por município e por região | ❌ |
| Fazer a tabela do front-end consumir a API, em vez de dados fixos | ❌ |

### US 6 – Ranking de municípios e regiões (R04)

| Subtarefa | Status |
| --------- | :----: |
| Rota `/api/municipios/contagem` com a contagem de um resultado por município | ✅ |
| Gráfico de barras com o ranking de municípios no front-end (ainda com dados fixos) | ✅ |
| Layout responsivo das telas | ✅ |
| Ranking ordenado (por quantidade e por taxa de aprovação) direto na API | ❌ |
| Ranking por região | ❌ |
| Fazer o gráfico de ranking consumir a API | ❌ |

### US 7 – Comparativo de evolução entre os anos

| Subtarefa | Status |
| --------- | :----: |
| Adicionar os dados de 2019 a 2025 à base do projeto | ✅ |
| Tratar no notebook os dados de todos os anos, com a coluna `ANO` na base tratada | ✅ |
| Rota com a quantidade e o percentual de aprovados, reprovados e interditados por ano | ❌ |
| Gráfico de evolução ano a ano no front-end | ❌ |
| Validar os totais por ano com a base de origem | ❌ |

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
