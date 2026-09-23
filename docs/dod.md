# ✅ Definition of Done (DoD)

Baseado no levantamento do estado real do repositório: hoje o time comita direto nas branches sem revisão, `feat/docker` acumulou trabalho (Dockerfile, endpoints) sem nunca virar Pull Request nem ser mergeada no `main`, não há testes automatizados, e o item "total de autuações" foi marcado como pronto sem que o endpoint correspondente existisse. Uma **User Story** só é considerada concluída quando atende a todos os itens abaixo.

- [ ] O código implementa **exatamente** o critério de aceite definido no DoR — conferido comparando a função/endpoint entregue com o que foi escrito, não com o que "parece" implementado
- [ ] Passou por **Pull Request**, com revisão de pelo menos **1 outro membro do time** antes do merge
- [ ] Foi **mergeado na branch principal** (`main`) — não fica parado em branch de feature
- [ ] Foi **testado manualmente com evidência registrada** (ex: request de exemplo + resposta no PR) até que testes automatizados existam no projeto
- [ ] A entrega foi conferida contra a **User Story correspondente** no `backlog.md`/`sprint-X.md` — não só contra a tarefa técnica isolada (ex: uma função pronta não significa a história pronta, se a história pede um endpoint que ainda não existe)
- [ ] A documentação relevante (README, backlog, docs da Sprint) foi **atualizada** refletindo o que foi de fato entregue
- [ ] O **Product Owner** validou e aceitou o resultado

> Nenhuma tarefa deve ser marcada como concluída (checklist, Jira, etc.) sem passar por todos os itens acima — foi a ausência disso que deixou "total de autuações" marcado como pronto sem o endpoint existir.
