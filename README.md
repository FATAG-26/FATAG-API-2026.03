<div align="center">
  <img src="docs/img/logo.png" alt="Logo da Equipe" width="200"/>
</div>

# </FATAG>

<div align="center">

[Desafio](#-desafio) • [Requisitos](docs/requisitos.md) • [Backlog](docs/backlog.md) • [Sprints](#-sprints) • [DoR/DoD](#-dor--dod) • [Equipe](#-equipe) • [Como_Instalar](docs/instalação.md) • [Cronograma de Evolução](docs/cronograma.png)

</div>

> **Parceiro:** IPEM-SP · **Curso:** 3°ADS · **Período:** 2026-2
>
> **Status do Projeto:** Em desenvolvimento 🚧

---

## 🏭 Desafio

O IPEM-SP publica um grande volume de dados sobre a fiscalização de bombas medidoras de combustível, mas essa informação chega ao público em planilhas brutas, espalhadas entre o Portal de Dados Abertos do IPEM-SP e o PSIE do Inmetro. Os registros trazem inconsistências de nomes de municípios, formatos de data variados e colunas de medição sem padronização.

O resultado é um dado que existe, é público, mas não é consultável: o cidadão não consegue saber se as bombas da sua cidade estão em conformidade, e a própria gestão perde agilidade para identificar regiões críticas e padrões de reprovação.

Nesse contexto, o desafio é transformar essa base dispersa em informação clara, construindo um pipeline de tratamento e análise em Python e um painel web de consulta rápida sobre a conformidade das bombas de combustível fiscalizadas no estado de São Paulo.

---

## ⚙️ Desenvolvimento

Todo o processo da Sprint 1 foi desenvolvido no Google Colab, permitindo uma análise mais prática e detalhada do tratamento dos dados.

O notebook utilizado durante o desenvolvimento está disponível neste repositório em [notebook](notebook/testApi_py.ipynb).

A documentação do notebook está disponível em [documentação](notebook/DOCUMENTACAO_testApi_py.md).

---

## 🌳Estratégia de Branches

### Branch Principal:
- `main`: Branch de produção com código estável e funcional;

### Branch de Desenvolvimento:
- `feat/docker`: Implementação do docker no projeto;
- `front-end`: Desenvolvimento do visual do site.

---

## 📅 Sprints

| Sprint | Período | Meta | Documentação | Vídeo |
| :----- | :------ | :--- | :----------- | :---- |
| 🏃 **Sprint 1** | 07/09 – 27/09 | Consolidar os dados de fiscalização das bombas medidoras e disponibilizar os indicadores básicos de conformidade | [Docs](docs/sprints/sprint-1.md) | [Assistir](#) |
| 🏃 **Sprint 2** | 05/10 – 05/25 | Meta da sprint | [Docs](docs/sprints/sprint-2/backlog.md) | [Assistir](#) |
| 🏃 **Sprint 3** | 02/11 – 22/11 | Meta da sprint | [Docs](docs/sprints/sprint-3/backlog.md) | [Assistir](#) |

---

## 🚦 DoR & DoD

### 🏃‍ DoR - Definition of Ready

* User Stories com **Critérios de Aceitação**
* Subtarefas divididas **a partir das US**
* Fontes de dados **identificadas** (Portal de Dados Abertos do IPEM-SP e PSIE do Inmetro)
* Dicionário de dados com as **colunas relevantes** mapeadas
* Protótipo das telas no **Figma**
* User Stories **estimadas** e **priorizadas** no Backlog

### 🏆 DoD - Definition of Done

* Critérios de Aceitação **atendidos**
* Pipeline de tratamento dos dados **completo** (limpeza e padronização)
* Indicadores **validados** com a base de dados
* Código completo e **versionado** no GitHub
* Documentação do **Notebook** atualizada
* Manual de Usuário
* Vídeos de cada etapa de entrega

---

## 👥 Equipe

| Membro | Função | GitHub | LinkedIn |
| :----- | :----- | :----- | :------- |
| João Barreto | Product Owner | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JoaoBarreto3) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/joaobarreto3/) |
| Nicolas Escobar | Scrum Master | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Niikoto) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nicolas-escobar-souza-020162324) |
| Elizabete Baltazar | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/BeteBaltazar) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/elizabete-de-sá-flores-baltazar-9a362242b) |
| Heitor Galvão | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Scareev) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/heitor-junqueira-a3336a34a) |
| Miguel Duarte | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Duarte-Biophysics) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/miguel-duarte-a12181390) |
| Lucas Suzuki | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LucaSuzuki) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucas-suzuki-695010380) |
| Kamille Fernandes | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/KamilleFernandes) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kamille-f-da-silva-122a10284) |
| Adler Rocha | Desenvolvedor(a) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AdlerR101) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/adler-rocha-a98480216) |

---

<div align="center">

FATAG · 3º ADS · Fatec São José dos Campos · 2026-2

</div>
