# 🚦 Definition of Ready (DoR)

Baseado no levantamento do estado real da Sprint 1 (repositório `FATAG-API-2026.03`): o item "total de autuações" foi marcado como concluído sem nunca ter tido um critério de aceite escrito — só existia na cabeça de quem implementou. Uma **User Story** só entra no Planning de uma Sprint quando atende a todos os itens abaixo.

- [ ] Está escrita no formato **"Como \<usuário\>, quero \<ação\>, para \<benefício\>"**
- [ ] Tem **critério de aceite escrito** na própria linha do backlog/sprint (ex: "retorna o total de bombas com resultado Reprovado + Interditado") — não pode ficar implícito ou só combinado verbalmente
- [ ] O critério de aceite foi **validado pelo Product Owner e pelo time** antes de entrar na Sprint
- [ ] Foi **estimada** pelo time (Planning Poker / pontos de história)
- [ ] Está **priorizada** no Backlog do Produto
- [ ] A **fonte de dado** necessária está identificada e acessível (ex: CSV do IPEM-SP já carregado em `src/data/`)
- [ ] Não possui **impedimento ou dependência bloqueante** conhecida (ex: outra função/endpoint que precisa existir antes)
- [ ] O tamanho da história é compatível com a duração da Sprint (cabe em uma Sprint — INVEST)

> Sem critério de aceite escrito e validado, a história não entra na Sprint — volta para refinamento.

## Aplicação na Sprint 1

| User Story | Critério de aceite escrito | Estimada | Fonte de dado disponível | Sem impedimento | Pronta? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Consultar os dados das bombas medidoras | ⚠️ Não formalizado no backlog | ✅ (20) | ✅ CSV IPEM-SP | ✅ | ⚠️ Com ressalva |
| Visualizar o total de bombas periciadas | ⚠️ Não formalizado no backlog | ✅ (8) | ✅ | ✅ | ⚠️ Com ressalva |
| Visualizar o percentual de bombas aprovadas | ⚠️ Não formalizado no backlog | ✅ (8) | ✅ | ✅ | ⚠️ Com ressalva |
| Visualizar o total de autuações | ❌ Nunca escrito (regra "reprovado + interditado" só combinada verbalmente) | ✅ (8) | ✅ | ✅ | ❌ Não deveria ter entrado sem critério escrito |

> A história "total de autuações" é o exemplo de por que o critério de aceite escrito é obrigatório a partir de agora: sem ele, ninguém percebeu a tempo que faltava um endpoint dedicado.
