# 📋 Backlog da Sprint 3

> **Período:** 02/11 – 22/11 ·
>
> **Legenda:** ✅ Concluído · 🚧 Em andamento · ❌ Não iniciado

| Rank | Prioridade | User Story | Story Points | Sprint | Requisito do Cliente | Status |
| :--: | :--------: | ---------- | :----------: | :----: | :------------------: | :----: |
| 8 | Médio | Como usuário, quero filtrar os dados por município, região e período, para realizar consultas específicas e facilitar a análise dos resultados. | 20 | 3 | R05 | 🚧 |
| 9 | Médio | Como usuário, quero visualizar gráficos interativos dos dados, para facilitar a análise dos resultados das fiscalizações. | 20 | 3 | R07 | 🚧 |
| 10 | Médio | Como usuário, quero utilizar uma dashboard interativa, para navegar e consultar as informações de forma simples e intuitiva. | 20 | 3 | R05 | 🚧 |
| 11 | Alta | Como usuário, quero ter acesso aos registros em CSV das bombas periciadas tratadas, para facilitar o acesso dos dados para o usuário. | 20 | 3 | — | 🚧 |

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
